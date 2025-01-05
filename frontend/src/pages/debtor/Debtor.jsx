import styles from './Debtor.module.css';
import React, { useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import { Link } from 'react-router-dom'; // Import Link to create routes

function Debtor() {
    const [debtors, setDebtors] = useState([]); // State to manage debtors
    const [renderForm, setRenderForm] = useState(false); // State for form visibility
    const [searchQuery, setSearchQuery] = useState(""); // State for search
    const [newDebtor, setNewDebtor] = useState(null); // State for new debtor addition
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchDebtors = async () => {
            try {
                const response = await fetch('/api/debt');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const json = await response.json();
                setDebtors(json);
            } catch (error) {
                console.error('Error fetching debtors:', error.message);
            } finally {
                setLoading(false); // Set loading to false after fetch
            }
        };

        fetchDebtors();
    }, []);

    useEffect(() => {
        if (newDebtor) {
            setDebtors((prevDebtors) => [...prevDebtors, newDebtor]);
        }
    }, [newDebtor]);

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
            setNewDebtor(addedDebtor);
        } catch (error) {
            console.error('Error adding debtor:', error.message);
        }

        e.target.reset();
        setRenderForm(false);
    };

    const renderAddDebtor = () => {
        setRenderForm(!renderForm);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredDebtors = debtors.filter((debtor) =>
        debtor.name.toLowerCase().includes(searchQuery)
    );

    if (loading) {
        return (
            <>
                <Navigation />
                <div className={styles.container}>
                    <p>Loading...</p>
                </div>
            </>
        );
    }

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
                        <div
                            className={`${styles.bgContainer}`}
                        >
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
                                        <button type="submit" className={`${styles.button}`}>
                                            Add Debtor
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.button} `}
                                            onClick={renderAddDebtor}
                                        >
                                            Close Form
                                        </button>
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
                                    <Link to={`/debt/${debtor._id}`} key={debtor._id}>
                                        <li className={styles.listItem}>
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
