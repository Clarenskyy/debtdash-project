import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation/Navigation";
import styles from './DebtorDetail.module.css';

function DebtorDetail() {
    const { id } = useParams();
    const [debtor, setDebtor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDebtAdding, setIsDebtAdding] = useState(false);
    const [debtType, setDebtType] = useState(""); // For inventory or manual debt
    const [description, setDescription] = useState(""); // Description of the debt
    const [amount, setAmount] = useState(0); // Amount of the debt
    const [quantities, setQuantities] = useState({}); 
    const [paymentAmount, setPaymentAmount] = useState(0); // Amount for payments
    const [isPayingDebt, setIsPayingDebt] = useState(false); // To show/hide payment form
    const [inventoryItems, setInventoryItems] = useState([]); // State to hold inventory items
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

    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const response = await fetch('/api/inventory'); // Adjust the URL to your endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json(); // Parse the JSON response
                setInventoryItems(data); // Set inventory data to the state
            } catch (error) {
                console.error('Error fetching inventory items:', error);
            } finally {
                setLoading(false); // Set loading to false after the fetch is complete
            }
        };

        fetchInventoryItems();
    }, []); // Empty dependency array to run only once when the component mounts

    // Handle adding debt (POST request)
    const handleAddDebt = async () => {
        try {
            if (!description || amount <= 0) {
                alert("Please provide a description and amount.");
                return;
            }

            const response = await fetch(`/api/debtlist/${id}/debt/manual`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    debtType,
                    description,
                    amount,
                }),
            });

            if (!response.ok) throw new Error("Error adding manual debt");

            const updatedDebtor = await response.json();
            setDebtor(updatedDebtor);
        } catch (error) {
            console.error(error);
        }

        setIsDebtAdding(false); // Close the debt form
    };

    const handleAddInventoryItem = async (item) => {
        const quantity = quantities[item._id] || 1;
        const total = quantity * item.price;

        try {
            const response = await fetch(`/api/debtlist/${id}/debt/inventory`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    debtType: "inventory",
                    description: `${item.name} - ${quantity}`,
                    amount: total,
                    itemId: item._id,
                    quantity: quantity,
                }),
            });

            if (!response.ok) throw new Error("Error adding inventory item to debt");

            const updatedDebtor = await response.json();
            setDebtor(updatedDebtor);
            setQuantities({ ...quantities, [item._id]: 0 }); // Reset quantity after adding
        } catch (error) {
            console.error("Error adding inventory item:", error);
        }
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
            <div className={styles.container}>
                <button onClick={handleReturnToList} className={`${styles.button} ${styles.returnButton}`}>Return to Debtor List</button>
                <h1 className={styles.heading}>{debtor.name}</h1>
                <p>Contact: {debtor.contact}</p>

                <h2>Debts:</h2>
                <ul>
                    {debtor.debts.length === 0 ? (
                        <p>No debts found.</p>
                    ) : (
                        debtor.debts.map((debt, index) => (
                            <li key={index}>
                                <p>
                                    {debt.description}: {debt.amount.toFixed(2)}
                                    <br /> 
                                    (Added on: {new Date(debt.date).toLocaleString("en-US", {
                                        month: "short", // Short month name (e.g., Jan, Feb)
                                        day: "2-digit", // Day with leading zero
                                        year: "numeric", // Full year
                                        hour12: false, // Use 24-hour format (set to `true` for 12-hour with AM/PM)
                                    })})
                                </p>
                            </li>
                        ))
                    )}
                </ul>

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

                                {debtType === "inventory" && (
                                    <div>
                                        <h4>Select Inventory Item</h4>
                                        <ul>
                                            {inventoryItems.map((item, index) => (
                                                <li key={index}>
                                                    <span>{item.name} - {item.price.toFixed(2)}</span>
                                                    <input
                                                        type="number"
                                                        placeholder="Quantity"
                                                        min="1"
                                                        value={quantities[item._id] || ""}
                                                        onChange={(e) =>
                                                            setQuantities({
                                                                ...quantities,
                                                                [item._id]: Number(e.target.value),
                                                            })
                                                        }
                                                    />
                                                    <button
                                                        onClick={() => handleAddInventoryItem(item)}
                                                        className={styles.button}
                                                    >
                                                        Add to Debt
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {debtType === "manual" && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Product Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && description.trim()) {
                                                    document.getElementById("amountInput").focus();
                                                }
                                            }}
                                            className={styles.input}
                                        />
                                        <input
                                            id="amountInput"
                                            type="number"
                                            placeholder="Amount"
                                            value={amount === 0 ? "" : amount}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && amount > 0) {
                                                    handleAddDebt();
                                                    setDescription(""); // Clear description
                                                    setAmount(0); // Reset amount
                                                }
                                            }}
                                            className={styles.input}
                                        />
                                    </div>
                                )}

                                <div className={styles.buttonGroup}>
                                    <button
                                        onClick={() => {
                                            handleAddDebt();
                                            setDescription("");
                                            setAmount(0);
                                        }}
                                        className={styles.button}
                                    >
                                        Add Debt
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsDebtAdding(false);
                                            setDescription("");
                                            setAmount(0);
                                        }}
                                        className={styles.button}
                                    >
                                        Close
                                    </button>
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
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && paymentAmount > 0) {
                                            handlePayment(false); // Pay Partial
                                            setPaymentAmount(0); // Clear input
                                        }
                                    }}
                                    className={styles.input}
                                />
                                <div className={styles.buttonGroup}>
                                    <button
                                        onClick={() => {
                                            handlePayment(false);
                                            setPaymentAmount(0); // Clear input
                                        }}
                                        className={styles.button}
                                    >
                                        Pay Partial
                                    </button>
                                    <button
                                        onClick={() => {
                                            handlePayment(true);
                                            setPaymentAmount(0); // Clear input
                                        }}
                                        className={styles.button}
                                    >
                                        Pay All
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsPayingDebt(false);
                                            setPaymentAmount(0); // Clear input
                                        }}
                                        className={styles.button}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button onClick={handlePayDebt} className={styles.button}>Pay Debt</button>
            </div>
        </>
    );
}

export default DebtorDetail;
