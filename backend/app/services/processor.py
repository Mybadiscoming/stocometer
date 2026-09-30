from collections import Counter
from datetime import datetime


def process_wallet_data(
    alchemy_result: dict,
    goplus_result: dict,
    wallet_address: str = None,
) -> dict:
    """
    Combine blockchain activity and GoPlus security data
    into a structured STOCOMETER wallet profile.

    Calculates behavioral features for the ML/anomaly-detection layer.
    """

    transfers = alchemy_result.get("transfers", [])

    wallet = (
        wallet_address.lower().strip()
        if wallet_address
        else None
    )

    processed_transfers = []

    unique_addresses = set()
    counterparties = set()
    assets = set()
    categories = {}

    incoming_count = 0
    outgoing_count = 0

    timestamps = []
    values = []

    for transfer in transfers:

        from_address = transfer.get("from")
        to_address = transfer.get("to")
        asset = transfer.get("asset")
        category = transfer.get("category")
        value = transfer.get("value")

        from_normalized = (
            from_address.lower()
            if isinstance(from_address, str)
            else None
        )

        to_normalized = (
            to_address.lower()
            if isinstance(to_address, str)
            else None
        )

        # --------------------------------------------------
        # Address statistics
        # --------------------------------------------------

        if from_normalized:
            unique_addresses.add(from_normalized)

        if to_normalized:
            unique_addresses.add(to_normalized)

        # --------------------------------------------------
        # Asset statistics
        # --------------------------------------------------

        if asset:
            assets.add(str(asset))

        # --------------------------------------------------
        # Category statistics
        # --------------------------------------------------

        if category:
            categories[category] = (
                categories.get(category, 0) + 1
            )

        # --------------------------------------------------
        # Transaction direction
        # --------------------------------------------------

        is_outgoing = (
            wallet is not None
            and from_normalized == wallet
        )

        is_incoming = (
            wallet is not None
            and to_normalized == wallet
        )

        if is_outgoing:
            outgoing_count += 1

            if to_normalized and to_normalized != wallet:
                counterparties.add(to_normalized)

        elif is_incoming:
            incoming_count += 1

            if from_normalized and from_normalized != wallet:
                counterparties.add(from_normalized)

        # --------------------------------------------------
        # Numeric values
        # --------------------------------------------------

        if isinstance(value, (int, float)):
            if value >= 0:
                values.append(float(value))

        elif isinstance(value, str):
            try:
                numeric_value = float(value)

                if numeric_value >= 0:
                    values.append(numeric_value)

            except ValueError:
                pass

        # --------------------------------------------------
        # Timestamp
        # --------------------------------------------------

        timestamp = (
            transfer.get("metadata", {})
            .get("blockTimestamp")
        )

        if timestamp:
            timestamps.append(timestamp)

        processed_transfers.append({
            "hash": transfer.get("hash"),
            "from": from_address,
            "to": to_address,
            "asset": asset,
            "value": value,
            "category": category,
            "block_number": transfer.get("blockNum"),
            "timestamp": timestamp,
        })

    # ------------------------------------------------------
    # Basic statistics
    # ------------------------------------------------------

    transfer_count = len(processed_transfers)

    unique_address_count = len(unique_addresses)

    unique_counterparty_count = len(counterparties)

    asset_count = len(assets)

    # ------------------------------------------------------
    # Direction ratios
    # ------------------------------------------------------

    incoming_ratio = (
        incoming_count / transfer_count
        if transfer_count
        else 0
    )

    outgoing_ratio = (
        outgoing_count / transfer_count
        if transfer_count
        else 0
    )

    # ------------------------------------------------------
    # Time-based behavioral features
    # ------------------------------------------------------

    parsed_times = []

    for timestamp in timestamps:

        try:
            parsed_times.append(
                datetime.fromisoformat(
                    timestamp.replace("Z", "+00:00")
                )
            )

        except (ValueError, TypeError, AttributeError):
            continue

    activity_span_seconds = 0

    if len(parsed_times) >= 2:

        earliest = min(parsed_times)
        latest = max(parsed_times)

        activity_span_seconds = (
            latest - earliest
        ).total_seconds()

    activity_span_days = (
        activity_span_seconds / 86400
        if activity_span_seconds > 0
        else 0
    )

    transaction_frequency = (
        transfer_count / activity_span_days
        if activity_span_days > 0
        else transfer_count
    )

    # ------------------------------------------------------
    # Active days
    # ------------------------------------------------------

    active_days = set()

    for timestamp in timestamps:

        try:
            parsed_time = datetime.fromisoformat(
                timestamp.replace("Z", "+00:00")
            )

            active_days.add(
                parsed_time.date()
            )

        except (ValueError, TypeError, AttributeError):
            continue

    active_day_count = len(active_days)

    # ------------------------------------------------------
    # Repeated counterparty behavior
    # ------------------------------------------------------

    counterparty_counts = Counter()

    for transfer in transfers:

        from_address = transfer.get("from")
        to_address = transfer.get("to")

        from_normalized = (
            from_address.lower()
            if isinstance(from_address, str)
            else None
        )

        to_normalized = (
            to_address.lower()
            if isinstance(to_address, str)
            else None
        )

        if wallet and from_normalized == wallet:
            if to_normalized and to_normalized != wallet:
                counterparty_counts[to_normalized] += 1

        elif wallet and to_normalized == wallet:
            if from_normalized and from_normalized != wallet:
                counterparty_counts[from_normalized] += 1

    repeated_counterparty_count = sum(
        1
        for count in counterparty_counts.values()
        if count > 1
    )

    maximum_counterparty_transactions = (
        max(counterparty_counts.values())
        if counterparty_counts
        else 0
    )

    # ------------------------------------------------------
    # Security indicators
    # ------------------------------------------------------

    security_indicators = {
        "cybercrime": goplus_result.get(
            "cybercrime",
            "0"
        ),
        "money_laundering": goplus_result.get(
            "money_laundering",
            "0"
        ),
        "phishing": goplus_result.get(
            "phishing_activities",
            "0"
        ),
        "stealing_attack": goplus_result.get(
            "stealing_attack",
            "0"
        ),
        "blackmail": goplus_result.get(
            "blackmail_activities",
            "0"
        ),
        "sanctioned": goplus_result.get(
            "sanctioned",
            "0"
        ),
        "mixer": goplus_result.get(
            "mixer",
            "0"
        ),
        "darkweb": goplus_result.get(
            "darkweb_transactions",
            "0"
        ),
        "financial_crime": goplus_result.get(
            "financial_crime",
            "0"
        ),
        "fake_token": goplus_result.get(
            "fake_token",
            "0"
        ),
        "honeypot": goplus_result.get(
            "honeypot_related_address",
            "0"
        ),
        "gas_abuse": goplus_result.get(
            "gas_abuse",
            "0"
        ),
        "malicious_mining": goplus_result.get(
            "malicious_mining_activities",
            "0"
        ),
    }

    positive_security_flags = [
        name
        for name, value in security_indicators.items()
        if str(value) == "1"
    ]

    security_flag_count = len(
        positive_security_flags
    )

    # ------------------------------------------------------
    # ML / anomaly-detection feature vector
    # ------------------------------------------------------

    features = {
        "transfer_count": transfer_count,

        "unique_addresses": unique_address_count,

        "unique_counterparties": unique_counterparty_count,

        "asset_count": asset_count,

        "incoming_count": incoming_count,

        "outgoing_count": outgoing_count,

        "incoming_ratio": incoming_ratio,

        "outgoing_ratio": outgoing_ratio,

        "activity_span_days": activity_span_days,

        "active_day_count": active_day_count,

        "transaction_frequency": transaction_frequency,

        "repeated_counterparty_count": (
            repeated_counterparty_count
        ),

        "maximum_counterparty_transactions": (
            maximum_counterparty_transactions
        ),

        "security_flag_count": security_flag_count,
    }

    return {
        "blockchain": {
            "transfer_count": transfer_count,
            "unique_addresses": unique_address_count,
            "assets": sorted(assets),
            "categories": categories,
            "transfers": processed_transfers,
        },

        "features": features,

        "security": {
            "indicators": security_indicators,
            "positive_flags": positive_security_flags,
            "flag_count": security_flag_count,
        },
    }