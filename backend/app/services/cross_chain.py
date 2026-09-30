from app.services.graph import build_wallet_graph
from app.services.attribution import identify_vasp


SUPPORTED_NETWORKS = [
    "ethereum",
    "polygon",
    "base",
    "arbitrum",
    "solana",
]


def normalize_address(address):
    if not isinstance(address, str):
        return None

    return address.strip().lower()


def build_cross_chain_investigation(
    wallet_address,
    networks=None,
    max_nodes=200,
    max_edges=400,
    max_hops=2,
    max_expanded_wallets=5,
):
    """
    Build separate blockchain investigations for the same supplied
    wallet identifier across supported networks.

    This does NOT assume that an address represents the same entity
    across different networks. Each network is investigated separately,
    and only explicit observed evidence is used for correlation.
    """

    wallet = normalize_address(wallet_address)

    if not wallet:
        raise ValueError(
            "Wallet address is required."
        )

    if networks is None:
        networks = SUPPORTED_NETWORKS

    normalized_networks = []

    for network in networks:

        network_name = str(
            network
        ).strip().lower()

        if network_name not in SUPPORTED_NETWORKS:
            raise ValueError(
                f"Unsupported network: {network}"
            )

        if network_name not in normalized_networks:
            normalized_networks.append(
                network_name
            )

    investigations = {}

    total_nodes = 0
    total_edges = 0
    total_vasp_candidates = 0
    total_verified_vasps = 0
    total_evidence_chains = 0

    for network in normalized_networks:

        try:
            from app.services.alchemy import (
                get_wallet_transfers
            )

            transfer_result = get_wallet_transfers(
                wallet,
                network,
                max_transfers=500,
            )

            transfers = transfer_result.get(
                "transfers",
                [],
            )

            graph = build_wallet_graph(
                transfers,
                wallet,
                network=network,
                max_nodes=max_nodes,
                max_edges=max_edges,
                max_hops=max_hops,
                max_expanded_wallets=max_expanded_wallets,
            )

            statistics = graph.get(
                "statistics",
                {},
            )

            total_nodes += statistics.get(
                "node_count",
                0,
            )

            total_edges += statistics.get(
                "edge_count",
                0,
            )

            total_vasp_candidates += statistics.get(
                "vasp_candidate_count",
                0,
            )

            total_verified_vasps += len(
                graph.get(
                    "identified_vasps",
                    [],
                )
            )

            total_evidence_chains += statistics.get(
                "evidence_chain_count",
                0,
            )

            investigations[network] = {
                "status": "success",
                "network": network,
                "target_wallet": wallet,
                "graph": graph,
            }

        except Exception as error:

            investigations[network] = {
                "status": "error",
                "network": network,
                "target_wallet": wallet,
                "error": str(error),
            }

    return {
        "target_wallet": wallet,
        "networks": normalized_networks,
        "investigations": investigations,
        "summary": {
            "network_count": len(
                normalized_networks
            ),
            "successful_network_count": sum(
                1
                for item in investigations.values()
                if item["status"] == "success"
            ),
            "failed_network_count": sum(
                1
                for item in investigations.values()
                if item["status"] == "error"
            ),
            "total_nodes": total_nodes,
            "total_edges": total_edges,
            "total_verified_vasps": total_verified_vasps,
            "total_vasp_candidates": total_vasp_candidates,
            "total_evidence_chains": total_evidence_chains,
        },
    }