from datetime import datetime, timezone
from uuid import uuid4


# ---------------------------------------------------------
# In-memory case store
# ---------------------------------------------------------

_CASE_STORE = {}


# ---------------------------------------------------------
# Case creation
# ---------------------------------------------------------

def create_case(
    wallet,
    network,
    investigation=None,
    graph=None,
):
    """
    Create a standardized STOCOMETER investigation case.

    Cases are stored in memory for Phase 2 investigator APIs.
    Persistent storage can be added later without changing
    the investigation result structure.
    """

    now = datetime.now(timezone.utc).isoformat()

    investigation = investigation or {}

    case_id = f"STO-{uuid4().hex[:10].upper()}"

    case = {
        "case_id": case_id,
        "created_at": now,
        "updated_at": now,
        "status": "completed",
        "target": {
            "wallet": wallet,
            "network": network,
        },
        "risk": {
            "score": investigation.get("risk_score"),
            "level": investigation.get("risk_level"),
        },
        "investigation": investigation,
        "graph": graph or {},
    }

    _CASE_STORE[case_id] = case

    return case


# ---------------------------------------------------------
# Case retrieval
# ---------------------------------------------------------

def get_case(case_id):
    """
    Retrieve a stored investigation case by case ID.

    Returns None when the case does not exist.
    """

    if not case_id:
        return None

    return _CASE_STORE.get(case_id)


# ---------------------------------------------------------
# Case listing
# ---------------------------------------------------------

def list_cases():
    """
    Return all currently stored investigation cases.

    Cases are returned newest first.
    """

    return sorted(
        _CASE_STORE.values(),
        key=lambda case: case.get("created_at", ""),
        reverse=True,
    )