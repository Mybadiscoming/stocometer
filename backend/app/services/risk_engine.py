def calculate_risk(processed_data: dict) -> dict:
    """
    Calculate a baseline STOCOMETER risk score
    using blockchain activity and GoPlus indicators.

    This is a rule-based baseline, not an ML model.
    """

    blockchain = processed_data["blockchain"]
    security = processed_data["security"]

    indicators = security["indicators"]

    score = 0
    reasons = []

    # --------------------------------
    # GoPlus security indicators
    # --------------------------------

    weights = {
        "cybercrime": 25,
        "money_laundering": 25,
        "phishing": 25,
        "stealing_attack": 25,
        "blackmail": 20,
        "sanctioned": 25,
        "mixer": 15,
        "darkweb": 20,
        "financial_crime": 25,
        "fake_token": 15,
        "honeypot": 15,
        "gas_abuse": 10,
        "malicious_mining": 15
    }

    reason_names = {
        "cybercrime": "Cybercrime activity detected",
        "money_laundering": "Money laundering activity detected",
        "phishing": "Phishing activity detected",
        "stealing_attack": "Stealing attack activity detected",
        "blackmail": "Blackmail activity detected",
        "sanctioned": "Sanctioned address detected",
        "mixer": "Mixer interaction detected",
        "darkweb": "Darkweb transaction activity detected",
        "financial_crime": "Financial crime activity detected",
        "fake_token": "Fake token activity detected",
        "honeypot": "Honeypot-related activity detected",
        "gas_abuse": "Gas abuse detected",
        "malicious_mining": "Malicious mining activity detected"
    }

    for indicator, weight in weights.items():

        if str(indicators.get(indicator, "0")) == "1":
            score += weight
            reasons.append(reason_names[indicator])

    # --------------------------------
    # Basic blockchain activity signal
    # --------------------------------

    transfer_count = blockchain["transfer_count"]
    unique_addresses = blockchain["unique_addresses"]

    # High activity alone is NOT malicious.
    # We only use it as a very small contextual signal.
    if transfer_count >= 1000:
        score += 5
        reasons.append(
            "High transaction activity observed in current scan"
        )

    if unique_addresses >= 200:
        score += 5
        reasons.append(
            "Large number of connected addresses observed"
        )

    # --------------------------------
    # Keep score within 0-100
    # --------------------------------

    score = min(score, 100)

    # --------------------------------
    # Risk level
    # --------------------------------

    if score >= 70:
        risk_level = "HIGH"
    elif score >= 30:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # --------------------------------
    # Default explanation
    # --------------------------------

    if not reasons:
        reasons.append(
            "No major security indicators were detected "
            "in the current analysis"
        )

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "reasons": reasons
    }