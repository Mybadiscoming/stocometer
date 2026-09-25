import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")

ALCHEMY_URLS = {
    "ethereum": f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}",
    "polygon": f"https://polygon-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}",
    "base": f"https://base-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}",
    "arbitrum": f"https://arb-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}",
    "solana": f"https://solana-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}",
}


def get_wallet_transfers(
    wallet_address: str,
    network: str = "ethereum",
    max_transfers: int = 5000,
):
    network = network.lower().strip()

    if network == "solana":
        return get_solana_transactions(
            wallet_address,
            max_transfers
        )

    if network not in ALCHEMY_URLS:
        raise ValueError(
            f"Unsupported network: {network}"
        )

    alchemy_url = ALCHEMY_URLS[network]

    categories = [
        "external",
        "erc20",
        "erc721",
        "erc1155",
    ]

    if network in {"ethereum", "polygon", "base"}:
        categories.append("internal")

    all_transfers = []
    page_key = None

    while len(all_transfers) < max_transfers:

        params = {
            "fromBlock": "0x0",
            "toBlock": "latest",
            "fromAddress": wallet_address,
            "category": categories,
            "withMetadata": True,
            "excludeZeroValue": True,
            "maxCount": "0x3e8",
        }

        if page_key:
            params["pageKey"] = page_key

        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "alchemy_getAssetTransfers",
            "params": [params],
        }

        result = make_alchemy_request(
            alchemy_url,
            payload
        )

        transfers = result.get("transfers", [])

        all_transfers.extend(transfers)

        print(
            f"Alchemy {network}: "
            f"fetched {len(all_transfers)} transfers"
        )

        page_key = result.get("pageKey")

        if not page_key:
            break

    return {
        "transfers": all_transfers[:max_transfers]
    }


def get_solana_transactions(
    wallet_address: str,
    max_transfers: int = 5000,
):
    """
    Fetch Solana transaction history for a wallet.

    Solana uses a different API from the EVM Transfers API.
    We use getTransactionsForAddress and convert the returned
    transaction records into the structure expected by the
    existing STOCOMETER processor.
    """

    alchemy_url = ALCHEMY_URLS["solana"]

    all_transactions = []
    pagination_token = None

    while len(all_transactions) < max_transfers:

        configuration = {
            "transactionDetails": "signatures",
            "sortOrder": "desc",
            "limit": min(
                1000,
                max_transfers - len(all_transactions)
            ),
        }

        if pagination_token:
            configuration["paginationToken"] = pagination_token

        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTransactionsForAddress",
            "params": [
                wallet_address,
                configuration
            ],
        }

        result = make_alchemy_request(
            alchemy_url,
            payload
        )

        transactions = result.get("data", [])

        if not transactions:
            break

        for transaction in transactions:
            all_transactions.append({
                "hash": transaction.get("signature"),
                "from": wallet_address,
                "to": None,
                "asset": "SOL",
                "value": None,
                "category": "solana_transaction",
                "blockNum": str(
                    transaction.get("slot", "")
                ),
                "metadata": {
                    "blockTimestamp": (
                        transaction.get("blockTime")
                    )
                },
            })

        print(
            f"Alchemy solana: "
            f"fetched {len(all_transactions)} transactions"
        )

        pagination_token = result.get("paginationToken")

        if not pagination_token:
            break

    return {
        "transfers": all_transactions[:max_transfers]
    }


def make_alchemy_request(
    alchemy_url: str,
    payload: dict,
):
    for attempt in range(1, 4):

        try:
            response = requests.post(
                alchemy_url,
                json=payload,
                timeout=30,
            )

            response.raise_for_status()

            data = response.json()

            if "error" in data:
                raise RuntimeError(
                    data["error"]
                )

            return data["result"]

        except requests.exceptions.RequestException as error:

            if attempt < 3:
                print(
                    f"Alchemy connection failed "
                    f"(attempt {attempt}/3). Retrying..."
                )
                time.sleep(2)

            else:
                raise RuntimeError(
                    f"Alchemy connection failed after "
                    f"3 attempts: {error}"
                )