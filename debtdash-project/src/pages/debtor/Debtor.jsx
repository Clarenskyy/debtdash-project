import styles from './Debtor.module.css';
import React, { useState } from "react";
import Navigation from "../navigation/Navigation";

function Debtor() {
    const [debtors, setDebtors] = useState([]); // State to manage debtors

    // Function to add a debtor
    const addDebtor = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const contact = e.target.contact.value;

        //get debt from backend
        setDebtors([
            ...debtors,
            { name, contact, totalBalance: 0, debts: [] },
        ]);
        e.target.reset(); // Reset form fields
    };

    return (
        <div className={styles.container}>
            <Navigation />
            <div className={styles.content}>
                <h1 className={styles.heading}>DEBTOR LIST</h1>

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
                        <button type="submit" className={styles.button}>
                            Add Debtor
                        </button>
                    </form>
                </div>

                <div className={styles.listContainer}>
                    <h2 className={styles.subHeading}>Debtor List</h2>
                    <ul className={styles.list}>
                        {debtors.length === 0 ? (
                            <p className={styles.noData}>No debtors added yet.</p>
                        ) : (
                            debtors.map((debtor, index) => (
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
    );
}

export default Debtor;
