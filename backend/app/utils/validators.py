import re


EVM_NETWORKS = {
    "ethereum",
    "polygon",
    "base",
    "arbitrum",
}

SUPPORTED_NETWORKS = EVM_NETWORKS | {"solana"}


def is_valid_evm_address(address: str) -> bool:
    if not isinstance(address, str):
        return False

    pattern = r"^0x[a-fA-F0-9]{40}$"
    return bool(re.fullmatch(pattern, address))


def is_valid_solana_address(address: str) -> bool:
    if not isinstance(address, str):
        return False

    # Solana addresses are Base58 strings, generally 32-44 characters.
    pattern = r"^[1-9A-HJ-NP-Za-km-z]{32,44}$"
    return bool(re.fullmatch(pattern, address))


def validate_wallet_address(address: str, network: str) -> str:
    address = address.strip()
    network = network.lower().strip()

    if network not in SUPPORTED_NETWORKS:
        raise ValueError(
            f"Unsupported network: {network}. "
            f"Supported networks: {', '.join(sorted(SUPPORTED_NETWORKS))}"
        )

    if network in EVM_NETWORKS:
        if not is_valid_evm_address(address):
            raise ValueError(
                f"Invalid {network.capitalize()} wallet address. "
                "Expected format: 0x followed by 40 hexadecimal characters."
            )

    elif network == "solana":
        if not is_valid_solana_address(address):
            raise ValueError(
                "Invalid Solana wallet address."
            )

    return address