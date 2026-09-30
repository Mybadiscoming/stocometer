from collections import defaultdict
from datetime import datetime

from app.services.attribution import KNOWN_VASP_ADDRESSES
from app.services.attribution import identify_vasp
from app.services.alchemy import get_wallet_transfers

def vasp_priority(address):
    return 1 if address.lower() in KNOWN_VASP_ADDRESSES else 0


def detect_vasp_candidates(
    nodes,
    wallet_address,
    flow_paths=None,
):
    """
    Detect investigation-worthy VASP candidates from graph behavior.

    This does NOT establish VASP ownership or identity.
    It ranks unverified wallets using graph structure,
    transaction behavior, and observed flow evidence.
    """

    wallet = wallet_address.lower().strip()
    flow_paths = flow_paths or []

    candidates = []

    # ---------------------------------------------------------
    # Build flow evidence for each wallet
    # ---------------------------------------------------------

    flow_evidence = defaultdict(list)

    for path in flow_paths:

        path_addresses = path.get("path", [])

        if not path_addresses:
            continue

        classification = path.get(
            "flow_classification"
        )

        continuity_score = path.get(
            "continuity_score",
            0,
        )

        for address in path_addresses:

            normalized = str(address).lower().strip()

            if normalized == wallet:
                continue

            flow_evidence[normalized].append({
                "classification": classification,
                "continuity_score": continuity_score,
                "hops": path.get("hops", 0),
                "path": path_addresses,
            })

    for node_id, node in nodes.items():

        address = node_id.lower().strip()

        # -----------------------------------------------------
        # Never classify target wallet
        # -----------------------------------------------------

        if address == wallet:
            continue

        # -----------------------------------------------------
        # Verified VASPs are handled separately
        # -----------------------------------------------------

        attribution = node.get(
            "attribution",
            {},
        )

        if attribution.get("identified"):
            continue

        incoming = node.get(
            "incoming_transfer_count",
            0,
        )

        outgoing = node.get(
            "outgoing_transfer_count",
            0,
        )

        total = node.get(
            "total_transfer_count",
            0,
        )

        connections = node.get(
            "unique_counterparty_count",
            0,
        )

        intermediary_score = node.get(
            "intermediary_score",
            0,
        )

        flow_score = node.get(
            "flow_score",
            0,
        )

        chronological_activity = node.get(
            "chronological_activity",
            False,
        )

        hop = node.get(
            "hop",
            1,
        )

        reasons = []
        score = 0

        # -----------------------------------------------------
        # Basic activity gate
        # -----------------------------------------------------

        if total < 5:
            continue

        # -----------------------------------------------------
        # Transaction activity
        # -----------------------------------------------------

        if total >= 100:
            score += 20
            reasons.append(
                "High transaction activity"
            )

        elif total >= 50:
            score += 15
            reasons.append(
                "Elevated transaction activity"
            )

        elif total >= 25:
            score += 10
            reasons.append(
                "Moderate transaction activity"
            )

        elif total >= 5:
            score += 5
            reasons.append(
                "Repeated transaction activity"
            )

        # -----------------------------------------------------
        # Intermediary behaviour
        # -----------------------------------------------------

        if incoming >= 3 and outgoing >= 3:
            score += 20
            reasons.append(
                "Repeated incoming and outgoing intermediary activity"
            )

        elif incoming >= 2 and outgoing >= 2:
            score += 15
            reasons.append(
                "Multiple incoming and outgoing transfers"
            )

        elif incoming > 0 and outgoing > 0:
            score += 10
            reasons.append(
                "Incoming and outgoing intermediary activity"
            )

        # -----------------------------------------------------
        # Intermediary score
        # -----------------------------------------------------

        if intermediary_score >= 70:
            score += 15
            reasons.append(
                "Very strong intermediary activity"
            )

        elif intermediary_score >= 50:
            score += 12
            reasons.append(
                "Strong intermediary activity"
            )

        elif intermediary_score >= 20:
            score += 5
            reasons.append(
                "Observed intermediary activity"
            )

        # -----------------------------------------------------
        # Counterparty breadth
        # -----------------------------------------------------

        if connections >= 50:
            score += 20
            reasons.append(
                "Large number of unique counterparties"
            )

        elif connections >= 20:
            score += 15
            reasons.append(
                "Broad counterparty network"
            )

        elif connections >= 10:
            score += 10
            reasons.append(
                "Multiple unique counterparties"
            )

        elif connections >= 3:
            score += 5
            reasons.append(
                "Several unique counterparties"
            )

        # -----------------------------------------------------
        # Existing flow score
        # -----------------------------------------------------

        if flow_score >= 75:
            score += 15
            reasons.append(
                "High observed flow activity"
            )

        elif flow_score >= 50:
            score += 10
            reasons.append(
                "Elevated observed flow activity"
            )

        elif flow_score >= 30:
            score += 5
            reasons.append(
                "Observed flow activity"
            )

        # -----------------------------------------------------
        # Chronological activity
        # -----------------------------------------------------

        if chronological_activity:
            score += 5
            reasons.append(
                "Chronological transaction activity observed"
            )

        # -----------------------------------------------------
        # Multi-hop relevance
        # -----------------------------------------------------

        if hop >= 1:
            score += 5
            reasons.append(
                "Observed beyond the direct wallet layer"
            )

        # -----------------------------------------------------
        # Actual flow-path evidence
        # -----------------------------------------------------

        wallet_flows = flow_evidence.get(
            address,
            [],
        )

        strong_flow_count = sum(
            1
            for item in wallet_flows
            if item["classification"] == "STRONG_FLOW"
        )

        partial_flow_count = sum(
            1
            for item in wallet_flows
            if item["classification"] == "PARTIAL_FLOW"
        )

        if strong_flow_count > 0:
            score += 20
            reasons.append(
                "Participates in strong chronological/value flow paths"
            )

        elif partial_flow_count > 0:
            score += 10
            reasons.append(
                "Participates in partial fund-flow paths"
            )

        # -----------------------------------------------------
        # Final score
        # -----------------------------------------------------

        score = min(score, 100)

        # -----------------------------------------------------
        # Evidence requirement
        # -----------------------------------------------------

        # Require at least two independent behavioral/graph
        # signals before surfacing a candidate.
        signal_count = 0

        if total >= 5:
            signal_count += 1

        if incoming > 0 and outgoing > 0:
            signal_count += 1

        if connections >= 3:
            signal_count += 1

        if flow_score >= 30:
            signal_count += 1

        if intermediary_score >= 20:
            signal_count += 1

        if strong_flow_count > 0 or partial_flow_count > 0:
            signal_count += 1

        if hop >= 1:
            signal_count += 1

        if signal_count < 2:
            continue

        # Don't surface extremely weak candidates.
        if score < 25:
            continue

        # -----------------------------------------------------
        # Candidate level
        # -----------------------------------------------------

        if score >= 70:
            candidate_level = "HIGH"

        elif score >= 50:
            candidate_level = "MEDIUM"

        else:
            candidate_level = "LOW"

        candidates.append({
            "address": address,
            "candidate_score": score,
            "candidate_level": candidate_level,
            "verified_vasp": False,
            "reasons": reasons,
            "hop": hop,
            "incoming_transfer_count": incoming,
            "outgoing_transfer_count": outgoing,
            "total_transfer_count": total,
            "unique_counterparty_count": connections,
            "intermediary_score": intermediary_score,
            "flow_score": flow_score,
            "chronological_activity": chronological_activity,
            "strong_flow_count": strong_flow_count,
            "partial_flow_count": partial_flow_count,
        })

    candidates.sort(
        key=lambda item: (
            item["candidate_score"],
            item["strong_flow_count"],
            item["flow_score"],
            item["total_transfer_count"],
        ),
        reverse=True,
    )

    return candidates[:20]

def build_evidence_chain(
    flow_paths,
    target_wallet,
    network,
):
    """
    Build investigation evidence chains from observed directional
    flow paths.

    This preserves observed transaction evidence and attribution.
    It does not establish ownership or prove that the same funds
    moved through every hop.
    """

    wallet = target_wallet.lower().strip()
    evidence_chains = []

    for flow_path in flow_paths:

        path = flow_path.get("path", [])

        if not path:
            continue

        if path[0].lower() != wallet:
            continue

        transactions = flow_path.get(
            "transactions",
            [],
        )

        if not transactions:
            continue

        chain_transactions = []

        for index, transaction in enumerate(
            transactions
        ):

            source = transaction.get(
                "source"
            )

            target = transaction.get(
                "target"
            )

            if not source or not target:
                continue

            endpoint_attribution = identify_vasp(
                target,
                network,
            )

            chain_transactions.append({
                "hop": index + 1,
                "from": source,
                "to": target,
                "hash": transaction.get(
                    "hash"
                ),
                "asset": transaction.get(
                    "asset"
                ),
                "value": transaction.get(
                    "value"
                ),
                "category": transaction.get(
                    "category"
                ),
                "block_number": transaction.get(
                    "block_number"
                ),
                "timestamp": transaction.get(
                    "timestamp"
                ),
                "attribution": endpoint_attribution,
            })

        if not chain_transactions:
            continue

        endpoint = path[-1]

        endpoint_attribution = identify_vasp(
            endpoint,
            network,
        )

        evidence_chains.append({
            "target_wallet": wallet,
            "network": network,
            "path": path,
            "hops": flow_path.get(
                "hops",
                len(chain_transactions),
            ),
            "flow_classification": flow_path.get(
                "flow_classification"
            ),
            "continuity_score": flow_path.get(
                "continuity_score",
                0,
            ),
            "value_continuity": flow_path.get(
                "value_continuity",
                [],
            ),
            "endpoint": endpoint,
            "endpoint_attribution": endpoint_attribution,
            "transactions": chain_transactions,
        })

    evidence_chains.sort(
        key=lambda item: (
            item["continuity_score"],
            item["hops"],
        ),
        reverse=True,
    )

    return evidence_chains

def build_wallet_graph(
    transfers: list,
    wallet_address: str,
    network: str = "ethereum",
    max_nodes: int = 500,
    max_edges: int = 1000,
    max_hops: int = 2,
    max_expanded_wallets: int = 10,
) -> dict:

    wallet = wallet_address.lower().strip()

    nodes = {}
    edges = []

    outgoing = defaultdict(set)
    incoming = defaultdict(set)

    outgoing_count = defaultdict(int)
    incoming_count = defaultdict(int)

    wallet_timestamps = defaultdict(list)

    expanded_wallets = set()

    # ---------------------------------------------------------
    # Helpers
    # ---------------------------------------------------------

    def normalize_address(address):
        if not isinstance(address, str):
            return None
        return address.lower().strip()

    def parse_time(value):
        if not value:
            return None

        try:
            value = str(value)

            if value.endswith("Z"):
                value = value[:-1] + "+00:00"

            return datetime.fromisoformat(value)

        except Exception:
            return None

    def numeric_value(value):
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    def add_node(address, hop):

        address = normalize_address(address)

        if not address:
            return

        if address not in nodes:
            attribution = identify_vasp(address, network)

            nodes[address] = {
                "id": address,
                "type": "wallet",
                "hop": hop,
                "is_target": address.lower() == wallet_address.lower(),
                "attribution": attribution,
            }

        else:
            nodes[address]["hop"] = min(
                nodes[address]["hop"],
                hop,
            )

    def add_transfer(transfer, hop):

        if len(edges) >= max_edges:
            return

        source = normalize_address(
            transfer.get("from")
        )

        target = normalize_address(
            transfer.get("to")
        )

        if not source or not target:
            return

        if source == target:
            return

        if (
            source not in nodes
            and len(nodes) >= max_nodes
        ):
            return

        if (
            target not in nodes
            and len(nodes) >= max_nodes
        ):
            return

        add_node(source, hop)
        add_node(target, hop)

        timestamp = (
            transfer.get("metadata", {})
            .get("blockTimestamp")
        )

        edge_id = (
            transfer.get("hash")
            or f"{source}-{target}-{len(edges)}"
        )

        edge = {
            "id": edge_id,
            "source": source,
            "target": target,
            "hash": transfer.get("hash"),
            "asset": transfer.get("asset"),
            "value": transfer.get("value"),
            "category": transfer.get("category"),
            "block_number": transfer.get("blockNum"),
            "timestamp": timestamp,
            "hop": hop,
        }

        edges.append(edge)

        outgoing[source].add(target)
        incoming[target].add(source)

        outgoing_count[source] += 1
        incoming_count[target] += 1

        if timestamp:
            wallet_timestamps[source].append(timestamp)
            wallet_timestamps[target].append(timestamp)
    def frontier_priority(address):
        """
        Rank wallets for graph expansion.

        Priority order:
        1. Known VASP addresses
        2. Wallets with more observed transfer activity
        3. Wallets with more unique connections
        4. Stable address ordering
        """

        address = normalize_address(address)

        if not address:
            return (
                0,
                0,
                0,
                "",
            )

        vasp_score = vasp_priority(address)

        transfer_activity = (
            incoming_count[address]
            + outgoing_count[address]
        )

        connection_activity = (
            len(incoming.get(address, set()))
            + len(outgoing.get(address, set()))
        )

        return (
            vasp_score,
            transfer_activity,
            connection_activity,
            address,
        )    
    # ---------------------------------------------------------
    # HOP 0
    # ---------------------------------------------------------

    add_node(wallet, 0)

    for transfer in transfers:
        add_transfer(
            transfer,
            hop=0,
        )

    # ---------------------------------------------------------
    # Direct counterparties
    # ---------------------------------------------------------

    direct_counterparties = set()

    for edge in edges:

        if edge["source"] == wallet:
            direct_counterparties.add(
                edge["target"]
            )

        elif edge["target"] == wallet:
            direct_counterparties.add(
                edge["source"]
            )

    # ---------------------------------------------------------
    # HOP 1 / HOP 2 expansion
    # ---------------------------------------------------------

    frontier = sorted(
        direct_counterparties,
        key=frontier_priority,
        reverse=True,
    )

    for current_hop in range(1, max_hops):

        next_frontier = set()

        for address in frontier:

            if len(expanded_wallets) >= max_expanded_wallets:
                break

            if address in expanded_wallets:
                continue

            expanded_wallets.add(address)

            try:

                result = get_wallet_transfers(
                    address,
                    network,
                    max_transfers=250,
                )

            except Exception as error:

                print(
                    f"Graph expansion failed for "
                    f"{address}: {error}"
                )

                continue

            counterparty_transfers = result.get(
                "transfers",
                [],
            )

            for transfer in counterparty_transfers:

                before_edges = len(edges)

                add_transfer(
                    transfer,
                    hop=current_hop,
                )

                if len(edges) > before_edges:

                    edge = edges[-1]

                    source = edge["source"]
                    target = edge["target"]

                    if source != wallet:
                        next_frontier.add(source)

                    if target != wallet:
                        next_frontier.add(target)

                if len(edges) >= max_edges:
                    break

            if len(edges) >= max_edges:
                break

        frontier = sorted(
            next_frontier,
            key=frontier_priority,
            reverse=True,
        )

        if not frontier:
            break

        if len(edges) >= max_edges:
            break

    # ---------------------------------------------------------
    # Node flow statistics
    # ---------------------------------------------------------

    intermediary_candidates = []

    for node_id, node in nodes.items():

        in_count = incoming_count[node_id]
        out_count = outgoing_count[node_id]

        incoming_connections = len(
            incoming.get(
                node_id,
                set(),
            )
        )

        outgoing_connections = len(
            outgoing.get(
                node_id,
                set(),
            )
        )

        total_count = (
            in_count + out_count
        )

        unique_counterparty_count = (
            incoming_connections
            + outgoing_connections
        )

        intermediary_transfer_count = min(
            in_count,
            out_count,
        )

        intermediary_score = min(
            intermediary_transfer_count * 10,
            100,
        )

        chronological_activity = False

        timestamps = wallet_timestamps.get(
            node_id,
            [],
        )

        if len(timestamps) >= 2:

            parsed_times = [
                parse_time(timestamp)
                for timestamp in timestamps
            ]

            parsed_times = [
                timestamp
                for timestamp in parsed_times
                if timestamp
            ]

            chronological_activity = (
                len(parsed_times) >= 2
            )

        flow_score = (
            min(intermediary_transfer_count * 10, 50)
            + min(unique_counterparty_count * 3, 25)
            + min(total_count * 2, 20)
            + (
                5
                if chronological_activity
                else 0
            )
        )

        flow_score = min(
            round(flow_score, 2),
            100,
        )

        node["incoming_connections"] = (
            incoming_connections
        )

        node["outgoing_connections"] = (
            outgoing_connections
        )

        node["connection_count"] = (
            incoming_connections
            + outgoing_connections
        )

        node["incoming_transfer_count"] = (
            in_count
        )

        node["outgoing_transfer_count"] = (
            out_count
        )

        node["total_transfer_count"] = (
            total_count
        )

        node["unique_counterparty_count"] = (
            unique_counterparty_count
        )

        node["intermediary_score"] = (
            intermediary_score
        )

        node["flow_score"] = flow_score

        node["chronological_activity"] = (
            chronological_activity
        )

        if node_id == wallet:
            continue

        if in_count > 0 and out_count > 0:

            intermediary_candidates.append({
                "address": node_id,
                "hop": node.get("hop", 1),
                "incoming_transfer_count": in_count,
                "outgoing_transfer_count": out_count,
                "total_transfer_count": total_count,
                "unique_counterparty_count": (
                    unique_counterparty_count
                ),
                "intermediary_score": (
                    intermediary_score
                ),
                "flow_score": flow_score,
                "chronological_activity": (
                    chronological_activity
                ),
            })

    intermediary_candidates.sort(
        key=lambda item: (
            item["flow_score"],
            item["intermediary_score"],
            item["total_transfer_count"],
        ),
        reverse=True,
    )

    top_intermediaries = (
        intermediary_candidates[:20]
    )

    # ---------------------------------------------------------
    # ACTUAL DIRECTIONAL FLOW PATHS
    # + ASSET / VALUE CONTINUITY
    # ---------------------------------------------------------

    outgoing_edges = defaultdict(list)

    for edge in edges:
        outgoing_edges[edge["source"]].append(edge)

    for address in outgoing_edges:
        outgoing_edges[address].sort(
            key=lambda edge: (
                parse_time(edge.get("timestamp")).timestamp()
                if parse_time(edge.get("timestamp"))
                else float("-inf")
            )
        )

    def normalize_asset(asset):
        if not asset:
            return None

        return str(asset).strip().lower()

    def value_compatibility(previous_edge, current_edge):
        """
        Compare the outgoing transfer with the preceding
        incoming transfer.

        Returns:
            0.0  = incompatible
            0.5  = partially compatible
            1.0  = strongly compatible
        """

        previous_asset = normalize_asset(
            previous_edge.get("asset")
        )

        current_asset = normalize_asset(
            current_edge.get("asset")
        )

        # Asset must match when both are available.
        if (
            previous_asset
            and current_asset
            and previous_asset != current_asset
        ):
            return 0.0

        previous_value = numeric_value(
            previous_edge.get("value")
        )

        current_value = numeric_value(
            current_edge.get("value")
        )

        # If values cannot be interpreted,
        # retain only partial confidence.
        if (
            previous_value is None
            or current_value is None
        ):
            return 0.5

        if previous_value <= 0:
            return 0.0

        ratio = current_value / previous_value

        # Outgoing value cannot be larger than the
        # preceding incoming value for a strong match.
        if ratio > 1.05:
            return 0.0

        # Very small transfers are not strong evidence
        # of continuation.
        if ratio < 0.01:
            return 0.25

        # Reasonably close value.
        if ratio >= 0.50:
            return 1.0

        # Some value was transferred onward.
        return 0.5

    flow_paths = []

    def find_paths(
        current,
        path,
        visited,
        depth,
    ):

        if depth >= max_hops:
            return

        candidates = outgoing_edges.get(
            current,
            [],
        )

        for edge in candidates:

            target = edge["target"]

            if target in visited:
                continue

            current_time = parse_time(
                edge.get("timestamp")
            )

            previous_edge = (
                path[-1]
                if path
                else None
            )

            previous_time = (
                parse_time(
                    previous_edge.get("timestamp")
                )
                if previous_edge
                else None
            )

            # -------------------------------------------------
            # Chronological validation
            # -------------------------------------------------

            # For multi-hop flow attribution, timestamps are required.
# Without timestamps we cannot establish that the second
# transaction happened after the first.
            if previous_edge is not None:

                if not previous_time or not current_time:
                    # We don't reject the path entirely because the
                    # relationship may still be useful for investigation.
                    # It will receive only PARTIAL_FLOW below.
                    pass

                elif (
                    current_time.timestamp()
                    < previous_time.timestamp()
                ):
                    continue

            new_path = path + [edge]

            # -------------------------------------------------
            # Start only from target wallet
            # -------------------------------------------------

            if new_path[0]["source"] == wallet:

                continuity_scores = []

                # Compare every consecutive transaction.
                for index in range(
                    1,
                    len(new_path),
                ):

                    previous = new_path[index - 1]
                    current_transfer = new_path[index]

                    score = value_compatibility(
                        previous,
                        current_transfer,
                    )

                    continuity_scores.append(score)

                # One-hop path has no continuation to validate.
                if not continuity_scores:
                    continuity_score = 1.0
                    flow_classification = (
                        "DIRECT_TRANSFER"
                    )
                else:
                    continuity_score = round(
                        sum(continuity_scores)
                        / len(continuity_scores),
                        2,
                    )

                    # Check whether every hop has timestamps.
                    timestamps_complete = all(
                        new_path[index - 1].get("timestamp")
                        and new_path[index].get("timestamp")
                        for index in range(
                            1,
                            len(new_path),
                        )
                    )

                    if (
                        continuity_score >= 0.75
                        and timestamps_complete
                    ):
                        flow_classification = (
                            "STRONG_FLOW"
                        )

                    elif continuity_score >= 0.40:
                        flow_classification = (
                            "PARTIAL_FLOW"
                        )

                    else:
                        flow_classification = (
                            "WEAK_FLOW"
                        )

                flow_paths.append({
    "path": (
        [new_path[0]["source"]]
        + [
            item["target"]
            for item in new_path
        ]
    ),

    "hops": len(new_path),

    "transactions": new_path,

    "assets": [
        item.get("asset")
        for item in new_path
    ],

    "timestamps": [
        item.get("timestamp")
        for item in new_path
    ],

    "continuity_score": (
        continuity_score
    ),

    "value_continuity": [
        {
            "from_value": numeric_value(
                new_path[index - 1].get("value")
            ),
            "to_value": numeric_value(
                new_path[index].get("value")
            ),
            "asset_match": (
                normalize_asset(
                    new_path[index - 1].get("asset")
                )
                == normalize_asset(
                    new_path[index].get("asset")
                )
            ),
            "value_ratio": (
                round(
                    numeric_value(
                        new_path[index].get("value")
                    )
                    / numeric_value(
                        new_path[index - 1].get("value")
                    ),
                    6,
                )
                if (
                    numeric_value(
                        new_path[index - 1].get("value")
                    ) is not None
                    and numeric_value(
                        new_path[index - 1].get("value")
                    ) > 0
                    and numeric_value(
                        new_path[index].get("value")
                    ) is not None
                )
                else None
            ),
        }
        for index in range(1, len(new_path))
    ],

    "flow_classification": (
        flow_classification
    ),
    "endpoint_attribution": identify_vasp(
    new_path[-1]["target"],
    network,
    ),
})

            find_paths(
                target,
                new_path,
                visited | {target},
                depth + 1,
            )

    find_paths(
        wallet,
        [],
        {wallet},
        0,
    )

    # ---------------------------------------------------------
    # Rank paths by continuity
    # ---------------------------------------------------------

    flow_paths.sort(
        key=lambda item: (
            item["continuity_score"],
            item["hops"],
        ),
        reverse=True,
    )

    # Keep response manageable.
    # Keep direct transfers and multi-hop paths separate
    direct_flow_paths = [
        path
        for path in flow_paths
        if path["hops"] == 1
    ]

    multi_hop_flow_paths = [
        path
        for path in flow_paths
        if path["hops"] > 1
    ]

    # Prioritize multi-hop investigative paths.
    multi_hop_flow_paths.sort(
        key=lambda item: (
            item["continuity_score"],
            item["hops"],
        ),
        reverse=True,
    )

    direct_flow_paths = direct_flow_paths[:20]
    multi_hop_flow_paths = multi_hop_flow_paths[:30]

    flow_paths = (
        multi_hop_flow_paths
        + direct_flow_paths
    )
    evidence_chains = build_evidence_chain(
        flow_paths,
        wallet,
        network,
    )

    # ---------------------------------------------------------
    # Second-hop wallets
    # ---------------------------------------------------------

    second_hop_wallets = set()

    for edge in edges:

        if edge["hop"] >= 1:

            if edge["source"] != wallet:
                second_hop_wallets.add(
                    edge["source"]
                )

            if edge["target"] != wallet:
                second_hop_wallets.add(
                    edge["target"]
                )

    second_hop_wallets -= direct_counterparties

    # ---------------------------------------------------------
    # Return
    # ---------------------------------------------------------
    identified_vasps = []

    for node in nodes.values():
        attribution = node.get("attribution", {})

        if not attribution.get("identified"):
            continue

        address = node["id"]

        evidence_paths = [
    {
        "path": [
            edge["source"],
            edge["target"],
        ],
        "hops": 1,
        "transactions": [edge["hash"]],
        "assets": [edge.get("asset")],
        "timestamps": [edge.get("timestamp")],
        "values": [edge.get("value")],
        "flow_classification": "DIRECT_TRANSFER",
        "continuity_score": 1.0,
    }
    for edge in edges
    if (
        edge.get("source", "").lower() == address.lower()
        or edge.get("target", "").lower() == address.lower()
    )
]
        evidence_transactions = []

        for path in evidence_paths:
            for index, tx_hash in enumerate(path.get("transactions", [])):
                evidence_transactions.append(
            {
                "hash": tx_hash,
                "asset": (
                    path.get("assets", [None])[index]
                    if index < len(path.get("assets", []))
                    else None
                ),
                "value": (
                    path.get("values", [None])[index]
                    if index < len(path.get("values", []))
                    else None
                ),
                "timestamp": (
                    path.get("timestamps", [None])[index]
                    if index < len(path.get("timestamps", []))
                    else None
                ),
                "path": path.get("path", []),
                "classification": path.get(
                    "flow_classification"
                ),
            }
        )

        identified_vasps.append(
    {
        "address": address,
        "attribution": attribution,
        "flow_score": node.get("flow_score", 0),
        "hop": node.get("hop"),
        "incoming_transfer_count": node.get(
            "incoming_transfer_count", 0
        ),
        "outgoing_transfer_count": node.get(
            "outgoing_transfer_count", 0
        ),
        "evidence_paths": evidence_paths,
        "evidence_transactions": evidence_transactions,
    }
)

    vasp_candidates = detect_vasp_candidates(
        nodes,
        wallet,
        flow_paths,
    )

    return {
        "target_wallet": wallet,
        "network": network,
        "nodes": list(nodes.values()),
        "edges": edges,
        "flow_paths": flow_paths,
        "evidence_chains": evidence_chains,
        "identified_vasps": identified_vasps,
        "vasp_candidates": vasp_candidates,
        "statistics": {
            "node_count": len(nodes),
            "edge_count": len(edges),
            "direct_counterparty_count": len(direct_counterparties),
            "second_hop_count": len(second_hop_wallets),
            "expanded_wallet_count": len(expanded_wallets),
            "max_hops": max_hops,
            "intermediary_candidate_count": len(intermediary_candidates),
            "flow_path_count": len(flow_paths),
            "evidence_chain_count": len(evidence_chains),
            "vasp_candidate_count": len(vasp_candidates),
        },
        "direct_counterparties": sorted(direct_counterparties),
        "second_hop_wallets": sorted(second_hop_wallets),
        "intermediary_candidates": top_intermediaries,
    }