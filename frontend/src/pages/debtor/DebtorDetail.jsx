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
        const newDebt = { description, amount, debtType };
    
        try {
            const response = await fetch(`/api/debt/${id}/debt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDebt),
            });
    
            if (!response.ok) {
                throw new Error('Error adding debt');
            }
    
            // Fetch the updated debtor data after adding debt
            const updatedDebtor = await response.json();
            setDebtor(updatedDebtor); // Update the debtor state with the new data
        } catch (error) {
            console.error(error);
        }
    
        setIsDebtAdding(false); // Close the debt addition form
    };

    // Handle paying debt (full or partial)
    const handlePayDebt = () => {
        setIsPayingDebt(true);
    };

    const handlePayment = async () => {
        const paymentData = { amountPaid: paymentAmount };

        try {
            const response = await fetch(`/api/debt/${id}/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (!response.ok) {
                throw new Error('Error making payment');
            }

            // Update debtor after payment
            const updatedDebtor = await response.json();
            setDebtor(updatedDebtor);
        } catch (error) {
            console.error(error);
        }

        setIsPayingDebt(false); // Hide payment form after payment
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
            <div className={styles.container}>
                <h1 className={styles.heading}>{debtor.name}</h1>
                <p>Contact: {debtor.contact}</p>
                <p>Total Balance: ${debtor.totalBalance.toFixed(2)}</p>
                <button onClick={handleReturnToList} className={styles.button}>Return to Debtor List</button>

                <h2>Debts:</h2>
                <ul>
                    {debtor.debts.map((debt, index) => (
                        <li key={index}>
                            <p>{debt.description}: ${debt.amount.toFixed(2)} (Added on: {debt.date})</p>
                        </li>
                    ))}
                </ul>

                {/* Option to add debt */}
                <button onClick={() => setIsDebtAdding(true)} className={styles.button}>Add Debt</button>

                {isDebtAdding && (
                    <div className={styles.debtForm}>
                        <h3>Add Debt</h3>
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

                        {debtType === "manual" && (
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Product Description" 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                />
                                <input 
                                    type="number" 
                                    placeholder="Amount" 
                                    value={amount} 
                                    onChange={(e) => setAmount(Number(e.target.value))} 
                                />
                                <button onClick={handleAddDebt} className={styles.button}>Add Debt</button>
                            </div>
                        )}
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
        </>
    );
}

export default DebtorDetail;
