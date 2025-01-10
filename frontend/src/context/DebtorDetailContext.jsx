import React, { navigate, createContext, useState, useEffect } from "react";
import getTokenInfo from "../utils/tokenUtils";
import { useParams, useNavigate } from "react-router-dom";

export const DebtorDetailContext = createContext();

export const DebtorDetailProvider = ({children}) => {
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
        const token = getTokenInfo();
        if (!token) {
            navigate("/login");
            return;
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

    return(
        <DebtorDetailContext.Provider value={{
            debtor,
            loading,
            isDebtAdding,
            setIsDebtAdding,
            debtType,
            setDebtType,
            description,
            setDescription,
            amount,
            setAmount,
            quantities,
            setQuantities,
            isPayingDebt,
            setIsPayingDebt,
            paymentAmount,
            setPaymentAmount,
            inventoryItems,
            handleAddDebt,
            handleAddInventoryItem,
            handlePayment,
            handleReturnToList
        }}>
            {children}
        </DebtorDetailContext.Provider>
    )
}