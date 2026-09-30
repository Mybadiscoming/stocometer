def calculate_risk(
    processed_data: dict,
    anomaly_result: dict = None
) -> dict:

    blockchain = processed_data["blockchain"]
    security = processed_data["security"]
    indicators = security["indicators"]

    score = 0
    reasons = []

    # -----------------------------------
    # 1. SECURITY RULES
    # -----------------------------------

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
        "malicious_mining": 15,
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
        "malicious_mining": "Malicious mining activity detected",
    }

    for indicator, weight in weights.items():

        if str(indicators.get(indicator, "0")) == "1":

            score += weight

            reasons.append(
                reason_names[indicator]
            )

    # -----------------------------------
    # 2. BLOCKCHAIN BEHAVIOR RULES
    # -----------------------------------

    transfer_count = blockchain["transfer_count"]
    unique_addresses = blockchain["unique_addresses"]

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

    # -----------------------------------
    # 3. ML ANOMALY SIGNAL
    # -----------------------------------

    anomaly_contribution = 0

    if anomaly_result:

        anomaly_score = float(
            anomaly_result.get(
                "anomaly_score",
                0
            )
        )

        is_anomaly = anomaly_result.get(
            "is_anomaly",
            False
        )

        # Behavioral anomaly can contribute
        # a maximum of 20 points.
        anomaly_contribution = round(
            anomaly_score * 0.20
        )

        score += anomaly_contribution

        if is_anomaly:

            reasons.append(
                "Unusual behavioral pattern detected by "
                "Isolation Forest"
            )

    # -----------------------------------
    # 4. FINAL SCORE
    # -----------------------------------

    score = min(
        round(score),
        100
    )

    # -----------------------------------
    # 5. RISK LEVEL
    # -----------------------------------

    if score >= 70:

        risk_level = "HIGH"

    elif score >= 30:

        risk_level = "MEDIUM"

    else:

        risk_level = "LOW"

    # -----------------------------------
    # 6. DEFAULT REASON
    # -----------------------------------

    if not reasons:

        reasons.append(
            "No major security or behavioral risk indicators "
            "were detected in the current analysis"
        )

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "anomaly_contribution": anomaly_contribution,
        "reasons": reasons,
    }