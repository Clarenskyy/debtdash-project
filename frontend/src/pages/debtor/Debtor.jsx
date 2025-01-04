import styles from './Debtor.module.css';
import React, { useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import { Link } from 'react-router-dom'; // Import Link to create routes

function Debtor() {
    const [debtors, setDebtors] = useState([]); // State to manage debtors
    const [renderForm, setRenderForm] = useState(false); // State for form visibility
    const [searchQuery, setSearchQuery] = useState(""); // State for search
    const [newDebtor, setNewDebtor] = useState(null); // State for new debtor addition

    // Fetch all debtors when the component mounts
    useEffect(() => {
        const fetchDebtors = async () => {
            try {
                const response = await fetch('/api/debt');
                const text = await response.text();  // Get raw response as text
                console.log(text);  // Log the raw response to the console
                const json = JSON.parse(text);  // Try parsing it as JSON manually
                setDebtors(json);
            } catch (error) {
                console.error('Error fetching debtors:', error.message);
            }
        };
    
        fetchDebtors();
    }, []); // Runs once on mount

    // Add new debtor to the state when a new one is added
    useEffect(() => {
        if (newDebtor) {
            setDebtors((prevDebtors) => [...prevDebtors, newDebtor]);
        }
    }, [newDebtor]); // Runs whenever a new debtor is added

    // Function to handle adding a new debtor
    const addDebtor = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const contact = e.target.contact.value;

        try {
            const response = await fetch('/api/debt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, contact }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const addedDebtor = await response.json();
            setNewDebtor(addedDebtor); // Trigger useEffect to update the state
        } catch (error) {
            console.error('Error adding debtor:', error.message);
        }

        e.target.reset(); // Reset form fields
        setRenderForm(false); // Close the form
    };

    // Function to toggle the form visibility
    const renderAddDebtor = () => {
        setRenderForm(!renderForm);
    };

    // Function to handle search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Filtered debtors based on search query
    const filteredDebtors = debtors.filter((debtor) =>
        debtor.name.toLowerCase().includes(searchQuery)
    );

    return (
        <>
            <Navigation />
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.heading}>DEBTOR LIST</h1>

                    <div className={styles.filters}>
                        <input
                            type="text"
                            placeholder="Search Debtors"
                            className={styles.input}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <button className={styles.button} onClick={renderAddDebtor}>
                            Add Debtor
                        </button>
                    </div>

                    {renderForm && (
                        <div className={`${styles.formOverlay} ${renderForm ? styles.blurBackground : null}`}>
                            <div className={styles.formContainer}>
                                <h2 className={styles.subHeading}>Add Debtor</h2>
                                <form onSubmit={addDebtor} className={styles.form}>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Debtor Name"
                                        required
                                        className={styles.input}
                                    />
                                    <input
                                        type="text"
                                        name="contact"
                                        placeholder="Contact Information"
                                        required
                                        className={styles.input}
                                    />
                                    <div className={styles.buttonGroup}>
                                        <button type="submit" className={styles.button}>
                                            Add Debtor
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.button}
                                            onClick={renderAddDebtor}
                                        >
                                            Close Form
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className={styles.listContainer}>
                        <h2 className={styles.subHeading}>Debtor List</h2>
                        <ul className={styles.list}>
                            {filteredDebtors.length === 0 ? (
                                <p className={styles.noData}>No debtors found.</p>
                            ) : (
                                filteredDebtors.map((debtor) => (
                                    <Link to={`/debt/${debtor._id}`}>
                                        <li key={debtor._id} className={styles.listItem}>
                                        <h3>{debtor.name}</h3>
                                        <p>Contact: {debtor.contact}</p>
                                        <p>Total Balance: {debtor.totalBalance.toFixed(2)}</p>
                                        </li>
                                    </Link>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Debtor;
