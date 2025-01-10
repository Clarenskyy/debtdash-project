import styles from './DebtorComponents.module.css';

function AddDebtorForm({ addDebtor, onClose }) {

    return(
        <>
        <div className={styles.bgContainer}>
            <div className={styles.formContainer}>
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
            <button
                type="button"
                className={styles.button}
                onClick={onClose}
            >
                Cancel
            </button>
            </form>
            </div>
        </div>  
        </>
    )
}

export default AddDebtorForm;