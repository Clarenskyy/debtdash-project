import styles from './InventoryComponents.module.css';

function InventoryFilters({ handleFilterChange, renderAddItem }) {


    return(
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
    )
};

export default InventoryFilters;