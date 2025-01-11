import styles from "./DebtorDetailComponents.module.css";

function PayingDebtForm({paymentAmount, setPaymentAmount, handlePayment, isPayingDebt, setIsPayingDebt}) {

    return(
        <>
            <div className={`${styles.bgContainer} ${isPayingDebt ? styles.show : ""}`}>
                <div className={styles.formOverlay}>
                    <div className={styles.formContainer}>
                        <h3 className={styles.heading}>Pay Debt</h3>
                        <input
                            type="number"
                            placeholder="Amount Paid"
                            value={paymentAmount === 0 ? "" : paymentAmount}
                            onChange={(e) => setPaymentAmount(Number(e.target.value))}
                            className={styles.input}
                        />
                        <div className={styles.buttonGroup}>
                            <button
                                onClick={() => handlePayment(false)}
                                className={styles.button}
                            >
                                Pay Partial
                            </button>
                            <button
                                onClick={() => handlePayment(true)}
                                className={styles.button}
                            >
                                Pay All
                            </button>
                            <button
                                onClick={() => setIsPayingDebt(false)}
                                className={styles.button}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PayingDebtForm;