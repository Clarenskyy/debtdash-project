import Navigation from "../../components/navigation/Navigation";
import styles from "./DebtorDetail.module.css";
import { useContext } from "react";
import { DebtorDetailContext } from "../../context/DebtorDetailContext";
import DebtList from "../../components/debtor-detail-related/DebtList";
import AddingDebtForm from "../../components/debtor-detail-related/AddingDebtForm";
import PayingDebtForm from "../../components/debtor-detail-related/PayingDebtForm";

function DebtorDetail() {
    const {debtor, loading, isDebtAdding, setIsDebtAdding, debtType, setDebtType,description, setDescription, amount, setAmount, quantities, setQuantities, isPayingDebt, setIsPayingDebt, paymentAmount, setPaymentAmount, inventoryItems, handleAddDebt, handleAddInventoryItem, handlePayment, handleReturnToList} = useContext(DebtorDetailContext);

    if (loading) {
        return (
            <>
                <Navigation />
                <p>Loading...</p>
            </>
        );
    }

    if (!debtor) {
        return (
            <>
                <Navigation />
                <p>Debtor not found.</p>
            </>
        );
    }

    return (
<>
    <Navigation />
    <div className={styles.container}>
        <button onClick={handleReturnToList} className={`${styles.button} ${styles.returnButton}`}>
            Return to Debtor List
        </button>
        <h1 className={styles.heading}>{debtor.name}</h1>
        <p>Contact: {debtor.contact}</p>

        <DebtList debtor={debtor} />

        <p>Total Balance: {debtor.totalBalance.toFixed(2)}</p>

        <button onClick={() => setIsDebtAdding(true)} className={styles.button}>
            Add Debt
        </button>

        {isDebtAdding && (<AddingDebtForm setDebtType={setDebtType} debtType={debtType} description={description} setDescription={setDescription} amount={amount} setAmount={setAmount} quantities={quantities} setQuantities={setQuantities} isDebtAdding={isDebtAdding} setIsDebtAdding={setIsDebtAdding} inventoryItems={inventoryItems} handleAddDebt={handleAddDebt} handleAddInventoryItem={handleAddInventoryItem} />)}

        {isPayingDebt && (<PayingDebtForm paymentAmount={paymentAmount} setPaymentAmount={setPaymentAmount} handlePayment={handlePayment} isPayingDebt={isPayingDebt} setIsPayingDebt={setIsPayingDebt} />)}

        <button onClick={() => setIsPayingDebt(true)} className={styles.button}>
            Pay Debt
        </button>
    </div>
</>

    );
}

export default DebtorDetail;
