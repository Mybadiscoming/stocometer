import os

import requests
from dotenv import load_dotenv


load_dotenv()

VASP_TRACK_BASE_URL = "https://www.vasptrack.org/api/v1"
VASP_TRACK_API_KEY = os.getenv("VASP_TRACK_API_KEY")


def _get_headers():
    if not VASP_TRACK_API_KEY:
        raise ValueError(
            "VASP_TRACK_API_KEY is not configured in .env"
        )

    return {
        "Authorization": f"Bearer {VASP_TRACK_API_KEY}",
        "Accept": "application/json",
    }


def search_vasp(query: str) -> dict:
    """
    Search VASP Track by VASP name.

    This is the first integration test for STOCOMETER.
    """

    if not query or len(query.strip()) < 2:
        raise ValueError(
            "VASP search query must contain at least 2 characters."
        )

    response = requests.get(
        f"{VASP_TRACK_BASE_URL}/vasps/search",
        headers=_get_headers(),
        params={
            "q": query.strip(),
        },
        timeout=15,
    )

    if response.status_code != 200:
        raise RuntimeError(
            f"VASP Track API error "
            f"{response.status_code}: "
            f"{response.text}"
        )

    return response.json()
def get_vasp(vasp_id: str) -> dict:
    """
    Get detailed information about a specific VASP.
    """

    if not vasp_id:
        raise ValueError("VASP ID is required.")

    response = requests.get(
        f"{VASP_TRACK_BASE_URL}/vasps/{vasp_id}",
        headers=_get_headers(),
        timeout=15,
    )

    if response.status_code != 200:
        raise RuntimeError(
            f"VASP Track API error "
            f"{response.status_code}: "
            f"{response.text}"
        )

    return response.json()