import React, { useState } from "react";
import Navigation from "../navigation/Navigation";

function Inventory() {
    const [items, setItems] = useState([]); // State for inventory items
    const [filters, setFilters] = useState({ search: "", sort: "" }); // State for filtering and sorting
    const [renderForm, setRenderForm] = useState(false)

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
        setRenderForm(!renderForm)
    }

    return (
        <>
            <Navigation />
            <div div style={styles.container}>
               <h1 style={styles.heading}>INVENTORY LIST</h1>

                <div style={styles.listContainer}>
                    {renderForm ? 
                    <div style={styles.bgContainer}>
                        <div style={styles.formContainer}>
                            <h2 style={styles.subHeading}>Add Item</h2>
                            <form onSubmit={addItem} style={styles.form}>
                                
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Item Name"
                                    required
                                    style={styles.input}
                                />
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    required
                                    style={styles.input}
                                />
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                    required
                                    style={styles.input}
                                />
                                <button type="submit" style={styles.button}>
                                            Add Item
                                </button>
                                <button style={styles.button} onClick={renderAddItem}>
                                    Close Form
                                </button>
                            </form>
                            </div>
                    </div>
            : null}

                    <div style={styles.filters}>
                        <div>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by name"
                            onChange={handleFilterChange}
                            style={styles.input}
                        />
                        </div>
                        
                        <div className={styles.innerFilters}>
                            <div>
                                <select
                                name="sort"
                                onChange={handleFilterChange}
                                style={styles.input}>
                                <option value="">Sort By</option>
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                </select>
                            </div>
                            <div>
                                <button style={styles.button} onClick={renderAddItem}>
                                Add Item
                                </button>
                            </div>
                        </div>
                    </div>
                    <ul style={styles.list}>
                        {filteredItems.map((item, index) => (
                            <li key={index} style={styles.listItem}>
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

const styles = {
    container: {
        position: 'fixed',
        top: "70px",
        left: "70px",
        right: 0,
        bottom: 0,
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    heading: {
        textAlign: "center",
        color: "#9055A2",
    },
    subHeading: {
        color: "#9055A2",
    },
    bgContainer: {
        position: "fixed",
        top: "0%",
        left: "0%",
        bottom: "0%",
        right: "0%",
        backdropFilter: "blur(5px)",
        zIndex: 50,
    },
    formContainer: {
        position: "fixed",
        top: "25%",
        left: "15%",
        bottom: "10%",
        right: "8%",
        marginBottom: "30px",
        backgroundColor: '#011638',
        zIndex: 100,
        borderRadius: "10px",
    },
    form: {
        position: "absolute",
        top: "25%",
        left: "8%",
        bottom: "10%",
        right: "8%",
        zIndex: 101,
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
        margin: "0 auto",
    },
    input: {
        marginBottom: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    textarea: {
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
        marginBottom: "5px",
    },
    listContainer: {
        marginTop: "30px",
    },
    filters: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "20px",
    },
    innerFilters: {
        width: "200px",
        display: "flex",
        flexDirection: "row",
        marginLeft: "10px",
        marginRight: "10px",
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
};

export default Inventory;
