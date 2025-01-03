import styles from './Debtor.module.css';
import React, { useState } from "react";
import Navigation from "../navigation/Navigation";

function Debtor() {
    const [debtors, setDebtors] = useState([]); // State to manage debtors
    const [renderForm, setRenderForm] = useState(false); // State for form visibility
    const [searchQuery, setSearchQuery] = useState(""); // State for search

    // Function to add a debtor
    const addDebtor = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const contact = e.target.contact.value;

        setDebtors([
            ...debtors,
            { name, contact, totalBalance: 0, debts: [] },
        ]);
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
            <div className={`${styles.container}`}>
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
                        <div className={`${styles.formOverlay} ${renderForm ? styles.blurBackground: null}`}>
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
                                filteredDebtors.map((debtor, index) => (
                                    <li key={index} className={styles.listItem}>
                                        <h3>{debtor.name}</h3>
                                        <p>Contact: {debtor.contact}</p>
                                        <p>Total Balance: ${debtor.totalBalance.toFixed(2)}</p>
                                    </li>
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
