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
        <div style={styles.container}>
            <Navigation />
            <div style={styles.content}>
                <h1 style={styles.heading}>DEBTOR LIST</h1>

                <div style={styles.formContainer}>
                    <h2 style={styles.subHeading}>Add Debtor</h2>
                    <form onSubmit={addDebtor} style={styles.form}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Debtor Name"
                            required
                            style={styles.input}
                        />
                        <input
                            type="text"
                            name="contact"
                            placeholder="Contact Information"
                            required
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>
                            Add Debtor
                        </button>
                    </form>
                </div>

                <div style={styles.listContainer}>
                    <h2 style={styles.subHeading}>Debtor List</h2>
                    <ul style={styles.list}>
                        {debtors.length === 0 ? (
                            <p style={styles.noData}>No debtors added yet.</p>
                        ) : (
                            debtors.map((debtor, index) => (
                                <li key={index} style={styles.listItem}>
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

const styles = {
    container: {
        position: "fixed",
        top: "70px",
        left: "70px",
        right: "0",
        bottom: "0",
        backgroundColor: "#2E294E",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        overflowY: "auto",
    },
    content: {
        margin: "0 auto",
        maxWidth: "800px",
    },
    heading: {
        textAlign: "center",
        color: "#2E294E",
    },
    subHeading: {
        color: "#9055A2",
        marginBottom: "10px",
    },
    formContainer: {
        marginBottom: "30px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        marginBottom: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    button: {
        padding: "10px",
        backgroundColor: "#9055A2",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    listContainer: {
        marginTop: "30px",
    },
    list: {
        listStyleType: "none",
        padding: 0,
    },
    listItem: {
        backgroundColor: "#D499B9",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "5px",
    },
    noData: {
        textAlign: "center",
        color: "#666",
    },
};

export default Debtor;
