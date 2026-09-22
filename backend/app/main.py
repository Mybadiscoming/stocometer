from app.services.alchemy import get_wallet_transfers
from app.utils.validators import validate_wallet_address
from app.services.processor import process_wallet_data
from app.services.goplus import check_wallet
from app.services.risk_engine import calculate_risk


def main():
    wallet_input = input("Enter Ethereum wallet address: ").strip()

    try:
        wallet = validate_wallet_address(wallet_input)
    except ValueError as error:
        print(f"\n❌ {error}")
        return

    print("\n" + "=" * 50)
    print("STOCOMETER")
    print("=" * 50)

    # 1. Get blockchain data from Alchemy
    print("\n[1/4] Fetching blockchain data from Alchemy...")

    alchemy_result = get_wallet_transfers(wallet)

    print("✓ Alchemy data received")

    # 2. Get security intelligence from GoPlus
    print("\n[2/4] Checking wallet risk with GoPlus...")

    goplus_result = check_wallet(wallet)

    print("✓ GoPlus result received")

    # 3. Organize all data
    print("\n[3/4] Organizing wallet data...")

    processed_data = process_wallet_data(
        alchemy_result,
        goplus_result
    )

    print("✓ Data organized")

    # 4. Calculate risk
    print("\n[4/4] Calculating wallet risk...")

    risk_result = calculate_risk(processed_data)

    print("✓ Risk calculated")

    # --------------------------------
    # STOCOMETER RISK REPORT
    # --------------------------------

    print("\n" + "=" * 50)
    print("STOCOMETER RISK REPORT")
    print("=" * 50)

    print(f"\nWallet: {wallet}")

    # Blockchain summary
    blockchain = processed_data["blockchain"]

    print("\nBlockchain Activity:")
    print("-------------------")
    print(f"Transfers analyzed: {blockchain['transfer_count']}")
    print(f"Unique addresses: {blockchain['unique_addresses']}")
    print(f"Assets: {blockchain['assets']}")

    # Security summary
    security = processed_data["security"]

    print("\nSecurity Analysis:")
    print("------------------")
    print(f"Risk indicators detected: {security['flag_count']}")

    if security["positive_flags"]:
        print("Flags detected:")

        for flag in security["positive_flags"]:
            print(f"  • {flag}")
    else:
        print("No positive security indicators detected.")

    # Risk assessment
    print("\nRisk Assessment:")
    print("----------------")
    print(f"Risk Score: {risk_result['risk_score']}/100")
    print(f"Risk Level: {risk_result['risk_level']}")

    # Explanation
    print("\nWhy?")
    print("----")

    for reason in risk_result["reasons"]:
        print(f"  • {reason}")

    print("\n" + "=" * 50)


if __name__ == "__main__":
    main()