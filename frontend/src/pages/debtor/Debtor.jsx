import styles from './Debtor.module.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navigation from "../../components/navigation/Navigation";
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function Debtor() {
    const [debtors, setDebtors] = useState([]);
    const [renderForm, setRenderForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [newDebtor, setNewDebtor] = useState(null);
    const [editDebtor, setEditDebtor] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp <= currentTime) {
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    userId = decodedToken.id;
                    localStorage.setItem("userId", userId);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("token");
                navigate("/login");
            }
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
    }, [userId]);

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
                        <button className={styles.button} onClick={() => setRenderForm(!renderForm)}>
                            Add Debtor
                        </button>
                    </div>

                    {renderForm && (
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
                                Add
                            </button>
                        </form>
                    )}

                    {editDebtor && (
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
                                Save
                            </button>
                        </form>
                    )}

                    <ul className={styles.list}>
                        {filteredDebtors.map((debtor) => (
                            <li key={debtor._id} className={styles.listItem}>
                                <Link to={`/debt/${debtor._id}`}>
                                    <h3>{debtor.name}</h3>
                                    <p>Contact: {debtor.contact}</p>
                                </Link>
                                <button
                                    className={styles.button}
                                    onClick={() => setEditDebtor(debtor)}
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
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Debtor;
