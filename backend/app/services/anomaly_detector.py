from functools import lru_cache

import numpy as np
from sklearn.ensemble import IsolationForest


# Features used by the anomaly detector.
# Security flags are intentionally excluded because
# GoPlus already handles known security indicators.
FEATURE_NAMES = [
    "transfer_count",
    "unique_counterparties",
    "asset_count",
    "incoming_ratio",
    "outgoing_ratio",
    "activity_span_days",
    "active_day_count",
    "transaction_frequency",
    "repeated_counterparty_count",
    "maximum_counterparty_transactions",
]


def _build_baseline_dataset(size: int = 1000):
    """
    Create a lightweight synthetic baseline representing
    ordinary wallet behavior.

    This is a prototype baseline, NOT a trained fraud dataset.
    """

    rng = np.random.default_rng(42)

    transfer_count = rng.integers(
        1,
        500,
        size
    )

    unique_counterparties = np.minimum(
        rng.integers(1, 120, size),
        transfer_count
    )

    asset_count = rng.integers(
        1,
        15,
        size
    )

    incoming_ratio = rng.uniform(
        0,
        1,
        size
    )

    outgoing_ratio = 1 - incoming_ratio

    activity_span_days = rng.uniform(
        1,
        1500,
        size
    )

    active_day_count = np.minimum(
        rng.integers(1, 300, size),
        np.maximum(
            1,
            activity_span_days
        )
    )

    transaction_frequency = (
        transfer_count
        / np.maximum(activity_span_days, 1)
    )

    repeated_counterparty_count = np.minimum(
        rng.integers(0, 40, size),
        unique_counterparties
    )

    maximum_counterparty_transactions = np.maximum(
        1,
        rng.integers(1, 50, size)
    )

    return np.column_stack([
        transfer_count,
        unique_counterparties,
        asset_count,
        incoming_ratio,
        outgoing_ratio,
        activity_span_days,
        active_day_count,
        transaction_frequency,
        repeated_counterparty_count,
        maximum_counterparty_transactions,
    ])


@lru_cache(maxsize=1)
def _get_model():
    """
    Train the lightweight Isolation Forest once
    and keep it in memory while the API is running.
    """

    training_data = _build_baseline_dataset()

    model = IsolationForest(
        n_estimators=150,
        contamination=0.05,
        random_state=42,
        n_jobs=-1,
    )

    model.fit(training_data)

    return model


def detect_anomaly(features: dict) -> dict:
    """
    Analyze wallet behavior using Isolation Forest.

    Returns an anomaly score from 0-100.

    Important:
    This represents behavioral unusualness.
    It is NOT a probability of fraud.
    """

    model = _get_model()

    feature_vector = [
        float(features.get(name, 0))
        for name in FEATURE_NAMES
    ]

    data = np.array(
        [feature_vector],
        dtype=float
    )

    prediction = model.predict(data)[0]

    raw_score = model.decision_function(data)[0]

    # Convert Isolation Forest's decision score
    # into an easier 0-100 anomaly score.
    anomaly_score = 50 - (raw_score * 100)

    anomaly_score = max(
        0,
        min(
            100,
            anomaly_score
        )
    )

    anomaly_score = round(
        float(anomaly_score),
        2
    )

    is_anomaly = prediction == -1

    return {
        "anomaly_score": anomaly_score,
        "is_anomaly": bool(is_anomaly),
        "model": "Isolation Forest",
        "interpretation": (
            "Behavioral pattern is unusual compared "
            "with the baseline."
            if is_anomaly
            else
            "Behavioral pattern is within the baseline range."
        ),
    }