import styles from './InventoryComponents.module.css';

function EditItem({ editItem, handleEditItem, setEditItemForm}) {
    return (
        <div className={styles.bgContainer}>
            <div className={styles.formContainer}>
                <form onSubmit={handleEditItem} className={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Edit Item Name"
                        defaultValue={editItem.name}
                        required
                        className={styles.input}
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Edit Price"
                        defaultValue={editItem.price}
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>
                        Save
                    </button>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => setEditItemForm(false)}
                    >
                        Close Form
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditItem;
