import styles from './InventoryComponents.module.css';

function InventoryList({ items, deleteItem, isEditting }) {

    return (
    <ul className={styles.list}>
        {Array.isArray(items) ? (
            items.map((item) => (
            <li key={item._id} className={styles.listItem}>
                <h3>{item.name}</h3>
                <p>Price: {item.price.toFixed(2)}</p>
                <button
                className={styles.button}
                onClick={() => isEditting(item)}>
                    Edit
                </button>
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
    )
}

export default InventoryList;