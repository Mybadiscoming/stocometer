# app/services/attribution.py

import json
from pathlib import Path
from typing import Optional


DATA_FILE = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "vasp_addresses.json"
)


def load_vasp_addresses() -> dict:
    """
    Load the locally verified VASP address registry.

    The registry is an evidence source, not an ownership inference
    mechanism. An address is attributed only when it exists in the
    verified registry.
    """
    if not DATA_FILE.exists():
        return {}

    try:
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
    except (json.JSONDecodeError, OSError):
        return {}

    addresses = {}

    for item in data.get("addresses", []):
        address = item.get("address")

        if not address:
            continue

        normalized = normalize_address(address)
        addresses[normalized] = item

    return addresses


def normalize_address(address: str) -> str:
    """Normalize an EVM wallet/address for comparison."""
    return address.strip().lower()


# Loaded once when the service starts.
KNOWN_VASP_ADDRESSES = load_vasp_addresses()


def identify_vasp(
    address: Optional[str],
    network: Optional[str] = None,
) -> dict:
    """
    Attribute an address using the verified VASP registry.

    This function does NOT infer ownership from transaction behavior.
    It only returns an attribution when the address exists in the
    verified registry.
    """

    if not address:
        return {
            "identified": False,
            "entity": None,
            "method": "known_address_registry",
            "confidence": None,
            "evidence": None,
        }

    normalized = normalize_address(address)
    match = KNOWN_VASP_ADDRESSES.get(normalized)
    
    if match and network:
        requested_network = network.strip().lower()
        registered_network = (
            match.get("network") or ""
        ).strip().lower()

        if registered_network != requested_network:
            return {
                "identified": False,
                "entity": None,
                "method": "known_address_registry",
                "confidence": None,
                "evidence": None,
            }

    if not match:
        return {
            "identified": False,
            "entity": None,
            "method": "known_address_registry",
            "confidence": None,
            "evidence": None,
        }

    return {
        "identified": True,
        "entity": {
            "name": match.get("entity_name"),
            "type": match.get("entity_type"),
            "label": match.get("label"),
            "address": match.get("address"),
            "network": match.get("network"),
            "category": match.get("category"),
        },
        "method": "known_address_registry",
        "confidence": match.get("confidence"),
        "evidence": {
            "source": match.get("source"),
            "source_url": match.get("source_url"),
            "address": match.get("address"),
        },
    }