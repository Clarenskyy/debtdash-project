import styles from './Inventory.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../navigation/Navigation';
import {jwtDecode} from "jwt-decode"; 

function Inventory() {
    const [items, setItems] = useState([]); // State for inventory items
    const [filters, setFilters] = useState({ search: '', sort: '' }); // State for filtering and sorting
    const [renderForm, setRenderForm] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

  // Check if the user is logged in and token is valid
  useEffect(() => {
    if (!token) {
        navigate("/login");  // Redirect to login page if no token is found
    } else {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp <= currentTime) {
                localStorage.removeItem("token");  // Remove expired token
                navigate("/login");  // Redirect to login page if token is expired
            } else {
                localStorage.setItem("userId", decodedToken.id); // Store userId in local storage
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            localStorage.removeItem("token");  // Remove invalid token
            navigate("/login");  // Redirect to login page if token is invalid
        }
    }
}, [token, navigate]);

  const fetchItems = async () => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      console.error("No userId found in localStorage.");
      return; // Prevent the API call if no userId is found
    }
    try {
      const response = await fetch(`/api/inventory/${storedUserId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      fetchItems();
    } else {
      console.error("No userId found. Redirecting to login.");
      navigate("/login");
    }
  }, [navigate]);
  
  


    useEffect(() => {
        fetchItems();
    }, [userId]);

    // Add an item via the API
    const addItem = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const price = parseFloat(e.target.price.value);

        try {
            const response = await fetch(`/api/inventory/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price }),
            });
            if (response.ok) {
                const newItem = await response.json();
                setItems([...items, newItem]);
                e.target.reset(); // Reset form fields
            } else {
                console.error('Error adding item:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    // Handle filter change and fetch filtered/sorted items
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        // Update the filters state
        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters, [name]: value };

            // Fetch updated items based on new filters
            const queryParams = new URLSearchParams(updatedFilters).toString();
            fetch(`/api/inventory/search/${userId}?${queryParams}`)
                .then((response) => response.json())
                .then((data) => setItems(data))
                .catch((error) => console.error('Error filtering items:', error));

            return updatedFilters; // Return the updated state
        });
    };

    // Delete an item
    const deleteItem = async (id) => {
        try {
            const response = await fetch(`/api/inventory/${userId}/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setItems(items.filter((item) => item._id !== id));
            } else {
                console.error('Error deleting item:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    // Toggle the form for adding items
    const renderAddItem = () => {
        setRenderForm(!renderForm);
    };

    return (
        <>
            <Navigation />
            <div className={styles.container}>
                <h1 className={styles.heading}>ITEM LIST</h1>

                <div className={styles.listContainer}>
                    {renderForm && (
                        <div className={styles.bgContainer}>
                            <div className={styles.formContainer}>
                                <h2 className={styles.subHeading}>Add Item</h2>
                                <form onSubmit={addItem} className={styles.form}>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Item Name"
                                        required
                                        className={styles.input}
                                    />
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="Price"
                                        required
                                        className={styles.input}
                                    />
                                    <button type="submit" className={styles.button}>
                                        Add Item
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.button}
                                        onClick={renderAddItem}
                                    >
                                        Close Form
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className={styles.filters}>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by name"
                            onChange={handleFilterChange}
                            className={styles.input}
                        />
                        <select
                            name="sort"
                            onChange={handleFilterChange}
                            className={styles.input}
                        >
                            <option value="">Sort By</option>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                        </select>
                        <button className={styles.button} onClick={renderAddItem}>
                            Add Item
                        </button>
                    </div>

                    <ul className={styles.list}>
                        {Array.isArray(items) ? (
                            items.map((item) => (
                            <li key={item._id} className={styles.listItem}>
                                <h3>{item.name}</h3>
                                <p>Price: {item.price.toFixed(2)}</p>
                                <button
                                className={styles.button}
                                onClick={() => deleteItem(item._id)}
                                >
                                Delete
                                </button>
                            </li>
                            ))
                        ) : (
                            <p>No items to display</p>
                        )}
                        </ul>

                </div>
            </div>
        </>
    );
}

export default Inventory;
