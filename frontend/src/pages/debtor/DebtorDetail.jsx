import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../navigation/Navigation";
import styles from './DebtorDetail.module.css';

function DebtorDetail() {
    const { id } = useParams();
    const [debtor, setDebtor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDebtAdding, setIsDebtAdding] = useState(false);
    const [debtType, setDebtType] = useState(""); // For inventory or manual debt
    const [description, setDescription] = useState(""); // Description of the debt
    const [amount, setAmount] = useState(0); // Amount of the debt
    const [paymentAmount, setPaymentAmount] = useState(0); // Amount for payments
    const [isPayingDebt, setIsPayingDebt] = useState(false); // To show/hide payment form
    const navigate = useNavigate(); // Navigation hook


    useEffect(() => {
        const fetchDebtor = async () => {
            try {
                const response = await fetch(`/api/debt/${id}`);
                if (!response.ok) {
                    throw new Error('Error fetching debtor details');
                }
                const data = await response.json();
                setDebtor(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDebtor();
    }, [id]);

    // Handle adding debt (POST request)
    const handleAddDebt = async () => {
        if (debtType === "inventory") {
            try {
                const response = await fetch(`/api/debtlist/${id}/debt`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ debtType }),
                });
                if (!response.ok) throw new Error("Error fetching inventory items");
    
                const data = await response.json();
                // Show inventory selection UI here using `data.items`
                console.log("Inventory Items:", data.items);
            } catch (error) {
                console.error(error);
            }
        } else if (debtType === "manual") {
            try {
                const response = await fetch(`/api/debtlist/${id}/debt`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ debtType, description, amount }),
                });
                if (!response.ok) throw new Error("Error adding debt");
    
                const updatedDebtor = await response.json();
                setDebtor(updatedDebtor);
            } catch (error) {
                console.error(error);
            }
        }
    
        setIsDebtAdding(false); // Close the debt form
    };

    // Handle paying debt (full or partial)
    const handlePayDebt = () => {
        setIsPayingDebt(true);
    };

    const handlePayment = async (fullPayment = false) => {
        const paymentData = fullPayment
            ? { amountPaid: debtor.totalBalance } // Full payment clears all debts
            : { amountPaid: paymentAmount }; // Partial payment
    
        try {
            const response = await fetch(`/api/debtlist/${id}/pay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData),
            });
    
            if (!response.ok) throw new Error("Error making payment");
    
            const updatedDebtor = await response.json();
            setDebtor(updatedDebtor); // Update the state with cleared debts or partial payment
    
            if (!fullPayment) {
                setPaymentAmount(0); // Clear the input after partial payment
            }
        } catch (error) {
            console.error(error);
        }
    
        setIsPayingDebt(false); // Close the payment form
    };

    // Return to debtor list
    const handleReturnToList = () => {
        navigate("/debt");
    };

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
            <div>
            <div className={styles.container}>
            <button onClick={handleReturnToList} className={`${styles.button} ${styles.returnButton}`}>Return to Debtor List</button>
                <h1 className={styles.heading}>{debtor.name}</h1>
                <p>Contact: {debtor.contact}</p>
                

                <h2>Debts:</h2>
                <ul>
                    {debtor.debts.length === 0 ? (
                        <p>No debts found.</p>) : 
                        debtor.debts.map((debt, index) => (
                        <li key={index}>
                            <p>{debt.description}: {debt.amount.toFixed(2)} (Added on: {debt.date})</p>
                        </li>
                    ))}
                </ul>

                {/* Option to add debt */}
                <p>Total Balance: {debtor.totalBalance.toFixed(2)}</p>

                <button onClick={() => setIsDebtAdding(true)} className={styles.button}>Add Debt</button>

{isDebtAdding && (
    <div className={styles.bgContainer}>
        <div className={styles.formOverlay}>
            <div className={styles.formContainer}>
                <h3 className={styles.heading}>Add Debt</h3>
                <div className={styles.radioGroup}>
                    <label>
                        <input 
                            type="radio" 
                            value="inventory" 
                            checked={debtType === "inventory"} 
                            onChange={() => setDebtType("inventory")} 
                        /> Take Item from Inventory
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            value="manual" 
                            checked={debtType === "manual"} 
                            onChange={() => setDebtType("manual")} 
                        /> Manually Add Product
                    </label>
                </div>
                {debtType === "manual" && (
                    <div>
                        <input 
                            type="text" 
                            placeholder="Product Description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className={styles.input}
                        />
                        <input 
                            type="number" 
                            placeholder="Amount" 
                            value={amount === 0 ? "" : amount} 
                            onChange={(e) => setAmount(Number(e.target.value))} 
                            className={styles.input}
                        />
                    </div>
                )}
                <div className={styles.buttonGroup}>
                    <button onClick={handleAddDebt} className={styles.button}>Add Debt</button>
                    <button onClick={() => setIsDebtAdding(false)} className={styles.button}>Close</button>
                </div>
            </div>
        </div>
    </div>
)}

{isPayingDebt && (
    <div className={styles.bgContainer}>
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
                    <button onClick={() => handlePayment(false)} className={styles.button}>
                        Pay Partial
                    </button>
                    <button onClick={() => handlePayment(true)} className={styles.button}>
                        Pay All
                    </button>
                    <button onClick={() => setIsPayingDebt(false)} className={styles.button}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
)}


                {/* Option to pay debt */}
                <button onClick={handlePayDebt} className={styles.button}>Pay Debt</button>

                {isPayingDebt && (
                    <div className={styles.payDebtForm}>
                        <h3>Pay Debt</h3>
                        <button onClick={handlePayment} className={styles.button}>Pay All</button>
                        <div>
                            <input 
                                type="number" 
                                placeholder="Amount Paid" 
                                value={paymentAmount} 
                                onChange={(e) => setPaymentAmount(Number(e.target.value))} 
                            />
                            <button onClick={handlePayment} className={styles.button}>Pay Partial</button>
                        </div>
                    </div>
                )}
            </div>
            </div>

        </>
    );
}

export default DebtorDetail;
