import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Navigation from "../../components/navigation/Navigation";
import styles from "./DebtorDetail.module.css";

function DebtorDetail() {
    const { id } = useParams();
    const [debtor, setDebtor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDebtAdding, setIsDebtAdding] = useState(false);
    const [debtType, setDebtType] = useState(""); // "inventory" or "manual"
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [quantities, setQuantities] = useState({});
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [isPayingDebt, setIsPayingDebt] = useState(false);
    const [inventoryItems, setInventoryItems] = useState([]);
    const navigate = useNavigate();
    let userId = localStorage.getItem("userId");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp <= currentTime) {
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                localStorage.setItem("userId", decodedToken.id);
            }
        } catch {
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchDebtor = async () => {
            try {
                const response = await fetch(`/api/debt/${userId}/${id}`);
                if (!response.ok) throw new Error("Error fetching debtor details");
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
                const response = await fetch(`/api/inventory/${userId}`);
                if (!response.ok) throw new Error("Error fetching inventory items");
                const data = await response.json();
                setInventoryItems(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchInventoryItems();
    }, []);

    const handleAddDebt = async () => {
        if (!description || amount <= 0) {
            alert("Please provide a valid description and amount.");
            return;
        }
        try {
            const response = await fetch(`/api/debtlist/${userId}/${id}/debt/manual`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description, amount }),
            });
            if (!response.ok) throw new Error("Error adding manual debt");
            const updatedDebtor = await response.json();
            setDebtor(updatedDebtor);
        } catch (error) {
            console.error(error);
        }
        setIsDebtAdding(false);
    };

    const handleAddInventoryItem = async (item) => {
        const quantity = quantities[item._id] || 1;
        if (quantity <= 0) {
            alert("Quantity must be greater than zero.");
            return;
        }
        try {
            const response = await fetch(`/api/debtlist/${userId}/${id}/debt/inventory`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemId: item._id,
                    quantity,
                }),
            });
            if (!response.ok) throw new Error("Error adding inventory debt");
            const updatedDebtor = await response.json();
            setDebtor(updatedDebtor);
            setQuantities({ ...quantities, [item._id]: 0 });
        } catch (error) {
            console.error(error);
        }
    };

    const handlePayment = async (fullPayment = false) => {
        const paymentData = fullPayment
            ? { amountPaid: debtor.totalBalance }
            : { amountPaid: paymentAmount };
        try {
            const response = await fetch(`/api/debtlist/${userId}/${id}/pay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData),
            });
            if (!response.ok) throw new Error("Error processing payment");
            const updatedDebtor = await response.json();
            setDebtor(updatedDebtor);
        } catch (error) {
            console.error(error);
        }
        setIsPayingDebt(false);
        setPaymentAmount(0);
    };

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
                <button onClick={handleReturnToList} className={`${styles.button} ${styles.returnButton}`}>
                    Return to Debtor List
                </button>
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
                                    (Added on:{" "}
                                    {new Date(debt.date).toLocaleString("en-US", {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric",
                                        hour12: false,
                                    })}
                                    )
                                </p>
                            </li>
                        ))
                    )}
                </ul>

                <p>Total Balance: {debtor.totalBalance.toFixed(2)}</p>

                <button onClick={() => setIsDebtAdding(true)} className={styles.button}>
                    Add Debt
                </button>

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
                                        />{" "}
                                        Take Item from Inventory
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="manual"
                                            checked={debtType === "manual"}
                                            onChange={() => setDebtType("manual")}
                                        />{" "}
                                        Manually Add Product
                                    </label>
                                </div>

                                {debtType === "inventory" && (
                                    <div>
                                        <h4>Select Inventory Item</h4>
                                        <ul>
                                            {inventoryItems.map((item, index) => (
                                                <li key={index}>
                                                    <span>
                                                        {item.name} - {item.price.toFixed(2)}
                                                    </span>
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
                )}

                <button onClick={() => setIsPayingDebt(true)} className={styles.button}>
                    Pay Debt
                </button>
            </div>
        </>
    );
}

export default DebtorDetail;
