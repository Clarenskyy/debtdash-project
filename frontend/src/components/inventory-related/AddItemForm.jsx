import styles from './InventoryComponents.module.css';

function AddItemForm({ addItem, setRenderForm, renderForm }) {
    return (
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
                        onClick={() => {setRenderForm(!renderForm);}}
                    >
                        Close Form
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddItemForm;