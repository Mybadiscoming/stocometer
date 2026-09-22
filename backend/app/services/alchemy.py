import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")

ALCHEMY_URL = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}"


def get_wallet_transfers(wallet_address: str):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "alchemy_getAssetTransfers",
        "params": [
            {
                "fromBlock": "0x0",
                "toBlock": "latest",
                "fromAddress": wallet_address,
                "category": [
                    "external",
                    "internal",
                    "erc20",
                    "erc721",
                    "erc1155"
                ],
                "withMetadata": True,
                "excludeZeroValue": True,
                "maxCount": "0x3e8"
            }
        ]
    }

    # Retry the request up to 3 times if the connection fails.
    for attempt in range(1, 4):
        try:
            response = requests.post(
                ALCHEMY_URL,
                json=payload,
                timeout=30
            )

            response.raise_for_status()

            data = response.json()

            if "error" in data:
                raise RuntimeError(data["error"])

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
                    f"Alchemy connection failed after 3 attempts: {error}"
                )