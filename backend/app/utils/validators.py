import re


def is_valid_ethereum_address(address: str) -> bool:
    """
    Check whether a string is a valid Ethereum wallet address format.

    Ethereum addresses:
    - Start with 0x
    - Contain exactly 40 hexadecimal characters after 0x
    """

    if not isinstance(address, str):
        return False

    pattern = r"^0x[a-fA-F0-9]{40}$"

    return bool(re.fullmatch(pattern, address))


def validate_wallet_address(address: str) -> str:
    """
    Validate and return a cleaned Ethereum wallet address.
    Raises ValueError if the format is invalid.
    """

    address = address.strip()

    if not is_valid_ethereum_address(address):
        raise ValueError(
            "Invalid Ethereum wallet address. "
            "Expected format: 0x followed by 40 hexadecimal characters."
        )

    return address