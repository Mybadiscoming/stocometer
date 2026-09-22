def process_wallet_data(alchemy_result: dict, goplus_result: dict) -> dict:
    """
    Combine Alchemy blockchain data and GoPlus security data
    into a clean STOCOMETER wallet profile.
    """

    transfers = alchemy_result.get("transfers", [])

    # -----------------------------
    # 1. Process transfers
    # -----------------------------

    processed_transfers = []
    unique_addresses = set()
    assets = set()
    categories = {}

    for transfer in transfers:

        from_address = transfer.get("from")
        to_address = transfer.get("to")
        asset = transfer.get("asset")
        category = transfer.get("category")

        if from_address:
            unique_addresses.add(from_address.lower())

        if to_address:
            unique_addresses.add(to_address.lower())

        if asset:
            assets.add(asset)

        if category:
            categories[category] = categories.get(category, 0) + 1

        processed_transfers.append({
            "hash": transfer.get("hash"),
            "from": from_address,
            "to": to_address,
            "asset": asset,
            "value": transfer.get("value"),
            "category": category,
            "block_number": transfer.get("blockNum"),
            "timestamp": (
                transfer.get("metadata", {})
                .get("blockTimestamp")
            )
        })

    # -----------------------------
    # 2. Arrange GoPlus indicators
    # -----------------------------

    security_indicators = {
        "cybercrime": goplus_result.get("cybercrime", "0"),
        "money_laundering": goplus_result.get("money_laundering", "0"),
        "phishing": goplus_result.get("phishing_activities", "0"),
        "stealing_attack": goplus_result.get("stealing_attack", "0"),
        "blackmail": goplus_result.get("blackmail_activities", "0"),
        "sanctioned": goplus_result.get("sanctioned", "0"),
        "mixer": goplus_result.get("mixer", "0"),
        "darkweb": goplus_result.get("darkweb_transactions", "0"),
        "financial_crime": goplus_result.get("financial_crime", "0"),
        "fake_token": goplus_result.get("fake_token", "0"),
        "honeypot": goplus_result.get("honeypot_related_address", "0"),
        "gas_abuse": goplus_result.get("gas_abuse", "0"),
        "malicious_mining": goplus_result.get(
            "malicious_mining_activities", "0"
        ),
        "sanctioned": goplus_result.get("sanctioned", "0")
    }

    # -----------------------------
    # 3. Count positive indicators
    # -----------------------------

    positive_security_flags = [
        name
        for name, value in security_indicators.items()
        if str(value) == "1"
    ]

    # -----------------------------
    # 4. Build final STOCOMETER data
    # -----------------------------

    return {
        "blockchain": {
            "transfer_count": len(processed_transfers),
            "unique_addresses": len(unique_addresses),
            "assets": sorted(assets),
            "categories": categories,
            "transfers": processed_transfers
        },

        "security": {
            "indicators": security_indicators,
            "positive_flags": positive_security_flags,
            "flag_count": len(positive_security_flags)
        }
    }