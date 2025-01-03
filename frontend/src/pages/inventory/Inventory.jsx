import styles from './Inventory.module.css';
import React, { useState } from "react";
import Navigation from "../navigation/Navigation";

function Inventory() {
    const [items, setItems] = useState([]); // State for inventory items
    const [filters, setFilters] = useState({ search: "", sort: "" }); // State for filtering and sorting
    const [renderForm, setRenderForm] = useState(false);

    // Function to add an item to the inventory
    const addItem = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const price = parseFloat(e.target.price.value);
        const quantity = parseInt(e.target.quantity.value, 10);

        setItems([...items, { name, price, quantity }]);
        e.target.reset(); // Reset form fields
    };

    // Function to handle search and filter
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Filtered and sorted items
    const filteredItems = items
        .filter((item) =>
            item.name.toLowerCase().includes(filters.search.toLowerCase())
        )
        .sort((a, b) => {
            if (filters.sort === "name") return a.name.localeCompare(b.name);
            if (filters.sort === "price") return a.price - b.price;
            return 0;
        });

    const renderAddItem = () => {
        setRenderForm(!renderForm);
    };

    return (
        <>
            <Navigation />
            <div className={styles.container}>
                <h1 className={styles.heading}>INVENTORY LIST</h1>

                <div className={styles.listContainer}>
                    {renderForm ? (
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
                                    <input
                                        type="number"
                                        name="quantity"
                                        placeholder="Quantity"
                                        required
                                        className={styles.input}
                                    />
                                    <button type="submit" className={styles.button}>
                                        Add Item
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={renderAddItem}
                                    >
                                        Close Form
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : null}

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
                        <button
                            className={styles.button}
                            onClick={renderAddItem}
                        >
                            Add Item
                        </button>
                    </div>

                    <ul className={styles.list}>
                        {filteredItems.map((item, index) => (
                            <li key={index} className={styles.listItem}>
                                <h3>{item.name}</h3>
                                <p>
                                    Price: {item.price.toFixed(2)} | Quantity:{" "}
                                    {item.quantity}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Inventory;
