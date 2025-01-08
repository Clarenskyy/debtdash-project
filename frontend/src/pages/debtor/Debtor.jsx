import styles from './Debtor.module.css';
import React, { useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import { Link } from 'react-router-dom';

function Debtor() {
    const [debtors, setDebtors] = useState([]);
    const [renderForm, setRenderForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [newDebtor, setNewDebtor] = useState(null);
    const [editDebtor, setEditDebtor] = useState(null); // State for editing debtor
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
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

    const deleteDebtor = async (id) => {
        try {
            const response = await fetch(`/api/debt/${id}`, {
                method: 'DELETE',
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

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredDebtors = debtors.filter((debtor) =>
        debtor.name.toLowerCase().includes(searchQuery)
    );

    const renderAddDebtor = () => setRenderForm(!renderForm);

    const renderEditDebtor = (debtor) => setEditDebtor(debtor);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const updatedName = e.target.name.value;

        try {
            const response = await fetch(`/api/debt/${editDebtor._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
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
                        <div className={`${styles.bgContainer}`}>
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
                                        className={`${styles.button}`}
                                        onClick={renderAddDebtor}
                                    >
                                        Close Form
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {editDebtor && (
                        <div className={styles.bgContainer}>
                            <div className={styles.formContainer}>
                                <h2 className={styles.subHeading}>Edit Debtor</h2>
                                <form onSubmit={handleEditSubmit} className={styles.form}>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Edit Debtor Name"
                                        defaultValue={editDebtor.name}
                                        required
                                        className={styles.input}
                                    />
                                    <button type="submit" className={styles.button}>
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.button}
                                        onClick={() => setEditDebtor(null)}
                                    >
                                        Cancel
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
                                        <li key={debtor._id} className={styles.listItem}>
                                            <Link to={`/debt/${debtor._id}`} key={debtor._id}>
                                            <h3>{debtor.name}</h3>
                                            <p>Contact: {debtor.contact}</p>
                                            <p>Total Balance: {debtor.totalBalance.toFixed(2)}</p>
                                            </Link>
                                            <button
                                                className={styles.button}
                                                onClick={() => renderEditDebtor(debtor)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={styles.button}
                                                onClick={() => deleteDebtor(debtor._id)}
                                            >
                                                Delete
                                            </button>
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