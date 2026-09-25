from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.alchemy import get_wallet_transfers
from app.services.goplus import check_wallet
from app.services.processor import process_wallet_data
from app.services.risk_engine import calculate_risk
from app.utils.validators import validate_wallet_address


app = FastAPI(
    title="STOCOMETER API",
    description="Blockchain Risk Intelligence API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WalletRequest(BaseModel):
    wallet: str
    network: str = "ethereum"


@app.get("/")
def root():
    return {
        "message": "STOCOMETER API is running"
    }


@app.post("/analyze")
def analyze_wallet(request: WalletRequest):
    try:
        network = request.network.lower().strip()

        supported_networks = {
            "ethereum",
            "polygon",
            "base",
            "arbitrum",
            "solana",
        }

        if network not in supported_networks:
            raise ValueError(
                f"Unsupported network: {network}. "
                f"Supported networks: {', '.join(sorted(supported_networks))}"
            )

        wallet = validate_wallet_address(
            request.wallet,
            network
        )

        alchemy_result = get_wallet_transfers(
            wallet,
            network
        )

        # GoPlus currently works with EVM address security.
        # Solana will be handled separately when we add its
        # dedicated security/data flow.
        if network == "solana":
            goplus_result = {}
        else:
            goplus_result = check_wallet(wallet)

        processed_data = process_wallet_data(
            alchemy_result,
            goplus_result
        )

        risk_result = calculate_risk(
            processed_data
        )

        return {
            "wallet": wallet,
            "network": network,
            "blockchain": processed_data["blockchain"],
            "security": processed_data["security"],
            "risk": risk_result,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )