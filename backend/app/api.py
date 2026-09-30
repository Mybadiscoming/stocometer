import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.alchemy import get_wallet_transfers
from app.services.goplus import check_wallet
from app.services.cross_chain import build_cross_chain_investigation
from app.services.case import create_case,get_case,list_cases
from app.services.processor import process_wallet_data
from app.services.graph import build_wallet_graph
from app.services.anomaly_detector import detect_anomaly
from app.services.risk_engine import calculate_risk
from app.utils.validators import validate_wallet_address


# ---------------------------------------------------------
# Logging
# ---------------------------------------------------------

logger = logging.getLogger("stocometer.api")


# ---------------------------------------------------------
# Application
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# Request models
# ---------------------------------------------------------

class WalletRequest(BaseModel):
    wallet: str
    network: str = "ethereum"


class CrossChainRequest(BaseModel):
    wallet: str
    networks: list[str] | None = None    


# ---------------------------------------------------------
# Error helpers
# ---------------------------------------------------------

def error_response(
    status_code: int,
    code: str,
    message: str,
    details=None,
):
    error = {
        "code": code,
        "message": message,
    }

    if details is not None:
        error["details"] = details

    return JSONResponse(
        status_code=status_code,
        content={
            "error": error
        },
    )


# ---------------------------------------------------------
# FastAPI validation errors
# ---------------------------------------------------------

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    return error_response(
        status_code=422,
        code="VALIDATION_ERROR",
        message="The request body is invalid.",
        details=exc.errors(),
    )


# ---------------------------------------------------------
# HTTP exceptions
# ---------------------------------------------------------

@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException,
):
    detail = exc.detail

    if isinstance(detail, dict):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": detail
            },
        )

    return error_response(
        status_code=exc.status_code,
        code="HTTP_ERROR",
        message=str(detail),
    )


# ---------------------------------------------------------
# Root endpoint
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "STOCOMETER API is running"
    }

# ---------------------------------------------------------
# Investigator case retrieval
# ---------------------------------------------------------

@app.get("/cases/{case_id}")
def get_investigation_case(case_id: str):

    case = get_case(case_id)

    if case is None:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "CASE_NOT_FOUND",
                "message": "The requested investigation case was not found.",
                "details": {
                    "case_id": case_id,
                },
            },
        )

    return {
        "case": case,
    }

# ---------------------------------------------------------
# Investigator graph retrieval
# ---------------------------------------------------------

@app.get("/cases/{case_id}/graph")
def get_investigation_graph(case_id: str):

    case = get_case(case_id)

    if case is None:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "CASE_NOT_FOUND",
                "message": "The requested investigation case was not found.",
                "details": {
                    "case_id": case_id,
                },
            },
        )

    return {
        "case_id": case["case_id"],
        "target": case["target"],
        "graph": case.get("graph", {}),
    }
# ---------------------------------------------------------
# Investigator evidence retrieval
# ---------------------------------------------------------

@app.get("/cases/{case_id}/evidence")
def get_investigation_evidence(case_id: str):

    case = get_case(case_id)

    if case is None:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "CASE_NOT_FOUND",
                "message": "The requested investigation case was not found.",
                "details": {
                    "case_id": case_id,
                },
            },
        )

    investigation = case.get("investigation", {})

    return {
        "case_id": case["case_id"],
        "target": case["target"],
        "evidence": {
            "evidence_transaction_count": investigation.get(
                "evidence_transaction_count",
                0,
            ),
            "evidence_chains": investigation.get(
                "evidence_chains",
                [],
            ),
            "vasps": investigation.get(
                "vasps",
                [],
            ),
            "confidence": investigation.get(
                "confidence",
            ),
        },
    }

# ---------------------------------------------------------
# Investigator case listing
# ---------------------------------------------------------

@app.get("/cases")
def list_investigation_cases():

    cases = list_cases()

    return {
        "count": len(cases),
        "cases": cases,
    }

# ---------------------------------------------------------
# Analysis endpoint
# ---------------------------------------------------------

@app.post("/analyze")
def analyze_wallet(request: WalletRequest):

    # -----------------------------------------------------
    # Normalize request
    # -----------------------------------------------------

    network = request.network.lower().strip()

    supported_networks = {
        "ethereum",
        "polygon",
        "base",
        "arbitrum",
        "solana",
    }

    # -----------------------------------------------------
    # Network validation
    # -----------------------------------------------------

    if network not in supported_networks:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "UNSUPPORTED_NETWORK",
                "message": "The requested blockchain network is not supported.",
                "details": {
                    "network": network,
                    "supported_networks": sorted(
                        supported_networks
                    ),
                },
            },
        )

    # -----------------------------------------------------
    # Wallet validation
    # -----------------------------------------------------

    try:
        wallet = validate_wallet_address(
            request.wallet,
            network,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_WALLET",
                "message": "The wallet address is invalid for the selected network.",
                "details": str(error),
            },
        )

    except Exception:
        logger.exception(
            "Unexpected wallet validation failure"
        )

        raise HTTPException(
            status_code=500,
            detail={
                "code": "VALIDATION_INTERNAL_ERROR",
                "message": "An internal error occurred while validating the wallet.",
            },
        )

    # -----------------------------------------------------
    # Blockchain data
    # -----------------------------------------------------

    try:
        alchemy_result = get_wallet_transfers(
            wallet,
            network,
        )

    except (TimeoutError, ConnectionError) as error:
        logger.exception(
            "Blockchain provider connection failure"
        )

        raise HTTPException(
            status_code=502,
            detail={
                "code": "BLOCKCHAIN_PROVIDER_ERROR",
                "message": "The blockchain data provider could not be reached.",
            },
        )

    except Exception:
        logger.exception(
            "Blockchain provider failure"
        )

        raise HTTPException(
            status_code=502,
            detail={
                "code": "BLOCKCHAIN_PROVIDER_ERROR",
                "message": "The blockchain data provider failed while retrieving wallet activity.",
            },
        )

    # -----------------------------------------------------
    # GoPlus security intelligence
    # -----------------------------------------------------

    try:
        # GoPlus currently works with EVM address security.
        # Solana will be handled separately when we add its
        # dedicated security/data flow.
        if network == "solana":
            goplus_result = {}
        else:
            goplus_result = check_wallet(
                wallet,
                network,
            )

    except (TimeoutError, ConnectionError):
        logger.exception(
            "GoPlus provider connection failure"
        )

        raise HTTPException(
            status_code=502,
            detail={
                "code": "SECURITY_PROVIDER_ERROR",
                "message": "The security intelligence provider could not be reached.",
            },
        )

    except Exception:
        logger.exception(
            "GoPlus provider failure"
        )

        raise HTTPException(
            status_code=502,
            detail={
                "code": "SECURITY_PROVIDER_ERROR",
                "message": "The security intelligence provider failed during wallet analysis.",
            },
        )

    # -----------------------------------------------------
    # Data processing
    # -----------------------------------------------------

    try:
        processed_data = process_wallet_data(
            alchemy_result,
            goplus_result,
            wallet,
        )

    except Exception:
        logger.exception(
            "Wallet data processing failure"
        )

        raise HTTPException(
            status_code=500,
            detail={
                "code": "PROCESSING_ERROR",
                "message": "The retrieved blockchain data could not be processed.",
            },
        )

    # -----------------------------------------------------
    # Graph / transaction tracing
    # -----------------------------------------------------

    try:
        graph_result = build_wallet_graph(
            processed_data["blockchain"]["transfers"],
            wallet,
            network,
        )

    except Exception:
        logger.exception(
            "Blockchain graph analysis failure"
        )

        raise HTTPException(
            status_code=500,
            detail={
                "code": "GRAPH_ANALYSIS_ERROR",
                "message": "Blockchain transaction tracing could not be completed.",
            },
        )

    # -----------------------------------------------------
    # Anomaly detection
    # -----------------------------------------------------

    try:
        anomaly_result = detect_anomaly(
            processed_data["features"]
        )

    except Exception:
        logger.exception(
            "Anomaly detection failure"
        )

        raise HTTPException(
            status_code=500,
            detail={
                "code": "ANOMALY_ANALYSIS_ERROR",
                "message": "Behavioral anomaly analysis could not be completed.",
            },
        )

    # -----------------------------------------------------
    # Risk calculation
    # -----------------------------------------------------

    try:
        risk_result = calculate_risk(
            processed_data,
            anomaly_result,
        )

    except Exception:
        logger.exception(
            "Risk calculation failure"
        )

        raise HTTPException(
            status_code=500,
            detail={
                "code": "RISK_ANALYSIS_ERROR",
                "message": "Risk analysis could not be completed.",
            },
        )

    # -----------------------------------------------------
    # Investigation / VASP analysis
    # -----------------------------------------------------

    try:

        identified_vasps = graph_result.get(
            "identified_vasps",
            [],
        )

        statistics = graph_result.get(
            "statistics",
            {},
        )
        flow_paths = graph_result.get(
            "flow_paths",
            [],
        )

        evidence_chains = graph_result.get(
            "evidence_chains",
            [],
        )

        key_findings = [
            f"{statistics.get('direct_counterparty_count', 0)} "
            "direct counterparties identified.",

            f"{statistics.get('second_hop_count', 0)} "
            "second-hop wallets identified.",

            f"{statistics.get('flow_path_count', 0)} "
            "directional flow paths identified.",
            f"{len(evidence_chains)} "
            "structured evidence chains generated.",
        ]

        # -------------------------------------------------
        # VASP enrichment
        # -------------------------------------------------

        vasp_entities = []

        for vasp in identified_vasps:

            attribution = vasp.get(
                "attribution",
                {},
            )

            entity = attribution.get(
                "entity",
                {},
            )

            evidence = attribution.get(
                "evidence",
                {},
            )

            vasp_entities.append(
                {
                    "name": entity.get("name"),
                    "type": entity.get("type"),
                    "label": entity.get("label"),
                    "address": vasp.get("address"),
                    "network": entity.get("network"),
                    "category": entity.get("category"),
                    "attribution_method": attribution.get(
                        "method"
                    ),
                    "attribution_confidence": attribution.get(
                        "confidence"
                    ),
                    "source": evidence.get("source"),
                    "source_url": evidence.get("source_url"),
                    "evidence_transaction_count": len(
                        vasp.get(
                            "evidence_transactions",
                            [],
                        )
                    ),
                    "evidence_transactions": vasp.get(
                        "evidence_transactions",
                        [],
                    ),
                }
            )

        if vasp_entities:
            key_findings.append(
                f"{len(vasp_entities)} "
                "verified VASP attribution(s) identified."
            )

        else:
            key_findings.append(
                "No verified VASP address was identified "
                "within the traced graph."
            )

        # -------------------------------------------------
        # Evidence and investigation confidence
        # -------------------------------------------------

        evidence_transaction_count = sum(
            item["evidence_transaction_count"]
            for item in vasp_entities
        )

        if (
            vasp_entities
            and evidence_transaction_count > 0
        ):
            confidence = "high"

        elif statistics.get(
            "flow_path_count",
            0,
        ) > 0:
            confidence = "medium"

        else:
            confidence = "low"

        # -------------------------------------------------
        # Investigation object
        # -------------------------------------------------

        investigation = {
            "status": "completed",

            "target_wallet": wallet,

            "network": network,

            "tracing": {
                "direct_counterparties": statistics.get(
                    "direct_counterparty_count",
                    0,
                ),

                "second_hop_wallets": statistics.get(
                    "second_hop_count",
                    0,
                ),

                "flow_paths": statistics.get(
                    "flow_path_count",
                    0,
                ),

                "expanded_wallets": statistics.get(
                    "expanded_wallet_count",
                    0,
                ),

                "max_hops": statistics.get(
                    "max_hops",
                    0,
                ),
            },

            "identified_vasp_count": len(
                vasp_entities
            ),

            "evidence_transaction_count": (
                evidence_transaction_count
            ),

            "evidence_chains": evidence_chains,

            "vasps": vasp_entities,

            "key_findings": key_findings,

            "confidence": confidence,
        }

        # -------------------------------------------------
        # Standardized investigation report
        # -------------------------------------------------

        investigation_report = {
            "report_type": (
                "STOCOMETER Blockchain Investigation Report"
            ),

            "version": "1.0",

            "case_summary": {
                "target_wallet": wallet,
                "network": network,
                "status": investigation["status"],
                "investigation_confidence": (
                    investigation["confidence"]
                ),
            },

            "tracing_summary": {
                "direct_counterparties": investigation[
                    "tracing"
                ]["direct_counterparties"],

                "second_hop_wallets": investigation[
                    "tracing"
                ]["second_hop_wallets"],

                "flow_paths": investigation[
                    "tracing"
                ]["flow_paths"],

                "expanded_wallets": investigation[
                    "tracing"
                ]["expanded_wallets"],

                "max_hops": investigation[
                    "tracing"
                ]["max_hops"],
            },

            "vasp_attribution": {
                "identified_count": investigation[
                    "identified_vasp_count"
                ],

                "entities": investigation[
                    "vasps"
                ],
            },

            "evidence": {
                "transaction_count": investigation[
                    "evidence_transaction_count"
                ],
            },

            "findings": investigation[
                "key_findings"
            ],

            "limitations": [
                "VASP attribution is based only on the verified "
                "address registry.",

                "Absence of a verified VASP attribution does not "
                "mean that no VASP was involved.",

                "Flow-path analysis indicates transaction relationships "
                "but does not independently prove ownership or that "
                "the same funds were transferred across every hop.",
            ],
        }

        investigation["report"] = investigation_report

    except Exception:
        logger.exception(
            "Investigation analysis failure"
        )

        raise HTTPException(
            status_code=500,
            detail={
                "code": "INVESTIGATION_ERROR",
                "message": "The investigation analysis could not be completed.",
            },
        )

    investigation["risk_score"] = risk_result.get(
        "risk_score"
    )

    investigation["risk_level"] = risk_result.get(
        "risk_level"
    )
    case = create_case(
        wallet=wallet,
        network=network,
        investigation=investigation,
        graph=graph_result,
    )

    # -----------------------------------------------------
    # Final API response
    # -----------------------------------------------------

    return {
        "wallet": wallet,

        "network": network,

        "blockchain": processed_data[
            "blockchain"
        ],

        "features": processed_data[
            "features"
        ],

        "security": processed_data[
            "security"
        ],

        "anomaly": anomaly_result,

        "case": case,

        "graph": graph_result,

        "risk": risk_result,

        "investigation": investigation,
    }
# ---------------------------------------------------------
# Cross-chain investigation endpoint
# ---------------------------------------------------------

@app.post("/investigate/cross-chain")
def investigate_cross_chain(
    request: CrossChainRequest,
):

    # -----------------------------------------------------
    # Normalize networks
    # -----------------------------------------------------

    supported_networks = {
        "ethereum",
        "polygon",
        "base",
        "arbitrum",
        "solana",
    }

    if request.networks is None:
        networks = sorted(supported_networks)

    else:
        networks = [
            network.lower().strip()
            for network in request.networks
        ]

        networks = list(
            dict.fromkeys(networks)
        )

    # -----------------------------------------------------
    # Network validation
    # -----------------------------------------------------

    unsupported = [
        network
        for network in networks
        if network not in supported_networks
    ]

    if unsupported:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "UNSUPPORTED_NETWORK",
                "message": (
                    "One or more requested blockchain "
                    "networks are not supported."
                ),
                "details": {
                    "unsupported_networks": unsupported,
                    "supported_networks": sorted(
                        supported_networks
                    ),
                },
            },
        )

    # -----------------------------------------------------
    # Wallet validation
    # -----------------------------------------------------

    # Cross-chain investigation currently accepts an
    # address that is valid for at least one requested
    # network. Each network is then investigated separately.
    #
    # Solana addresses are intentionally handled by the
    # existing network-aware validator when Solana is the
    # requested network.

    valid_networks = []

    for network in networks:

        try:
            validate_wallet_address(
                request.wallet,
                network,
            )

            valid_networks.append(network)

        except ValueError:
            continue

        except Exception:
            logger.exception(
                "Cross-chain wallet validation failure"
            )

            raise HTTPException(
                status_code=500,
                detail={
                    "code": "VALIDATION_INTERNAL_ERROR",
                    "message": (
                        "An internal error occurred while "
                        "validating the wallet."
                    ),
                },
            )

    if not valid_networks:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_WALLET",
                "message": (
                    "The wallet address is invalid for "
                    "all requested networks."
                ),
                "details": {
                    "wallet": request.wallet,
                    "networks": networks,
                },
            },
        )

    # -----------------------------------------------------
    # Cross-chain investigation
    # -----------------------------------------------------

    try:

        result = build_cross_chain_investigation(
            request.wallet,
            networks=valid_networks,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail={
                "code": "CROSS_CHAIN_VALIDATION_ERROR",
                "message": str(error),
            },
        )

    except Exception:

        logger.exception(
            "Cross-chain investigation failure"
        )

        raise HTTPException(
            status_code=500,
            detail={
                "code": "CROSS_CHAIN_ANALYSIS_ERROR",
                "message": (
                    "Cross-chain investigation could "
                    "not be completed."
                ),
            },
        )

    return result