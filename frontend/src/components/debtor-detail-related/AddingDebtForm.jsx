import styles from "./DebtorDetailComponents.module.css";

function AddingDebtForm({ setDebtType, debtType, description, setDescription, amount, setAmount, quantities, setQuantities, isDebtAdding, setIsDebtAdding, inventoryItems, handleAddDebt, handleAddInventoryItem }) {

    return(
        <>
        <div className={`${styles.bgContainer} ${isDebtAdding ? styles.show : ""}`}>
                <div className={styles.formOverlay}>
                    <div className={styles.formContainer}>
                        <h3 className={styles.heading}>Add Debt</h3>
                        <div className={styles.radioGroup}>
                            <label>
                                <input
                                    type="radio"
                                    value="inventory"
                                    checked={debtType === "inventory"}
                                    onChange={() => setDebtType("inventory")}
                                />{" "}
                                Take Item from Inventory
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="manual"
                                    checked={debtType === "manual"}
                                    onChange={() => setDebtType("manual")}
                                />{" "}
                                Manually Add Product
                            </label>
                        </div>

                        {debtType === "inventory" && (
                            <div>
                                <h4>Select Inventory Item</h4>
                                <ul>
                                    {inventoryItems.map((item, index) => (
                                        <li key={index}>
                                            <span>
                                                {item.name} - {item.price.toFixed(2)}
                                            </span>
                                            <input
                                                type="number"
                                                placeholder="Quantity"
                                                min="1"
                                                value={quantities[item._id] || ""}
                                                onChange={(e) =>
                                                    setQuantities({
                                                        ...quantities,
                                                        [item._id]: Number(e.target.value),
                                                    })
                                                }
                                            />
                                            <button
                                                onClick={() => handleAddInventoryItem(item)}
                                                className={styles.button}
                                            >
                                                Add to Debt
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {debtType === "manual" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Product Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={styles.input}
                                />
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={amount === 0 ? "" : amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className={styles.input}
                                />
                            </div>
                        )}

                        <div className={styles.buttonGroup}>
                            <button
                                onClick={() => {
                                    handleAddDebt();
                                    setDescription("");
                                    setAmount(0);
                                }}
                                className={styles.button}
                            >
                                Add Debt
                            </button>
                            <button
                                onClick={() => {
                                    setIsDebtAdding(false);
                                    setDescription("");
                                    setAmount(0);
                                }}
                                className={styles.button}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default AddingDebtForm;