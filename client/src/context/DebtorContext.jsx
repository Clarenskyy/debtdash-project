import React, { createContext, useState, useEffect, navigate } from "react";
import getTokenInfo from "../utils/tokenUtils";


export const DebtorContext = createContext();

export const DebtorProvider = ({children}) => {   
    const [debtors, setDebtors] = useState([]);
    const [renderForm, setRenderForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [newDebtor, setNewDebtor] = useState(null);
    const [editDebtor, setEditDebtor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const userId = localStorage.getItem("userId");

    let token;

    useEffect(() => {
        const token = getTokenInfo();
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);



    useEffect(() => {
        const fetchDebtors = async () => {
            if (!userId) {
                console.error('User not authenticated');
                return;
            }
    
            try {
                const response = await fetch(`/api/debt/${userId}`);
                
                // Check if the response is not ok (status code is not in the 200-299 range)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                // Parse the response as JSON
                const json = await response.json();
                
                // Check if the response contains data (to ensure it's not empty)
                if (json.length === 0) {
                    console.log('No debtors found');
                } else {
                    console.log('Debtors fetched successfully:', json);  // Logging the fetched debtors data
                    setDebtors(json);
                }
                
                // Fade-in animation or transition logic
                setFadeIn(true);
            } catch (error) {
                console.error('Error fetching debtors:', error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchDebtors(); // Call the fetchDebtors function inside the useEffect
    
    }, [userId]);  // Dependency array, this effect runs when userId changes
    

    useEffect(() => {
        if (newDebtor) {
            setDebtors((prevDebtors) => [...prevDebtors, newDebtor]);
            setFadeIn(true);
        }
    }, [newDebtor]);

    const addDebtor = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const contact = e.target.contact.value;

        try {
            const response = await fetch(`/api/debt/${userId}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, contact }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response}`);
            }

            const addedDebtor = await response.json();
            setNewDebtor(addedDebtor);
        } catch (error) {
            console.error('Error adding debtor:', error.message);
        }

        e.target.reset();
        setRenderForm(false);
    };

    const deleteDebtor = async (id) => {
        try {
            const response = await fetch(`/api/debt/${userId}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setDebtors(debtors.filter((debtor) => debtor._id !== id));
            } else {
                console.error('Error deleting debtor:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting debtor:', error.message);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const updatedName = e.target.name.value;

        try {
            const response = await fetch(`/api/debt/${userId}/${editDebtor._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: updatedName }),
            });

            if (response.ok) {
                const updatedDebtor = await response.json();
                setDebtors(debtors.map((d) => (d._id === updatedDebtor._id ? updatedDebtor : d)));
                setEditDebtor(null);
            } else {
                console.error('Error updating debtor:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating debtor:', error.message);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredDebtors = debtors.filter((debtor) =>
        debtor.name.toLowerCase().includes(searchQuery)
    );



    return (
        <DebtorContext.Provider value={{
            debtors,
            setDebtors,
            renderForm,
            setRenderForm,
            searchQuery,
            setSearchQuery,
            newDebtor,
            setNewDebtor,
            editDebtor,
            setEditDebtor,
            loading,
            setLoading,
            fadeIn,
            setFadeIn,
            addDebtor,
            deleteDebtor,
            handleEditSubmit,
            handleSearch,
            filteredDebtors
        }}>
            {children}
        </DebtorContext.Provider>
    );
};