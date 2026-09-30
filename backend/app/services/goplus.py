import os
import requests
from dotenv import load_dotenv

from goplus.auth import Auth


load_dotenv()


GOPLUS_ADDRESS_URL = (
    "https://api.gopluslabs.io/api/v1/address_security"
)


CHAIN_IDS = {
    "ethereum": "1",
    "polygon": "137",
    "arbitrum": "42161",
    "base": "8453",
}


def get_access_token():
    """
    Get a GoPlus access token using App Key + App Secret.
    """

    app_key = os.getenv("GOPLUS_APP_KEY")
    app_secret = os.getenv("GOPLUS_APP_SECRET")

    if not app_key:
        raise RuntimeError(
            "GOPLUS_APP_KEY is missing from .env"
        )

    if not app_secret:
        raise RuntimeError(
            "GOPLUS_APP_SECRET is missing from .env"
        )

    # Official GoPlus SDK handles the signature.
    auth = Auth(app_key, app_secret)

    token_response = auth.get_access_token()

    result = token_response.result

    if not result:
        raise RuntimeError(
            "GoPlus did not return a token result."
        )

    access_token = result.access_token

    if not access_token:
        raise RuntimeError(
            "GoPlus did not return an access token."
        )

    return access_token


def check_wallet(
    wallet_address: str,
    network: str = "ethereum"
):
    """
    Check an EVM wallet using the GoPlus Address Security API.

    Supported networks:
    - Ethereum
    - Polygon
    - Base
    - Arbitrum

    Solana is intentionally not handled here because this
    GoPlus address-security flow is for EVM-compatible networks.
    """

    network = network.lower().strip()

    if network not in CHAIN_IDS:
        raise ValueError(
            f"GoPlus does not support wallet security lookup "
            f"for network: {network}"
        )

    chain_id = CHAIN_IDS[network]

    access_token = get_access_token()

    # The SDK/API versions differ on whether the returned token
    # already contains "Bearer ".
    if access_token.lower().startswith("bearer "):
        authorization_header = access_token
    else:
        authorization_header = f"Bearer {access_token}"

    response = requests.get(
        f"{GOPLUS_ADDRESS_URL}/{wallet_address}",
        params={
            "chain_id": chain_id
        },
        headers={
            "Authorization": authorization_header
        },
        timeout=30
    )

    response.raise_for_status()

    data = response.json()

    if data.get("code") != 1:
        raise RuntimeError(
            f"GoPlus API error: {data}"
        )

    return data.get("result", {})