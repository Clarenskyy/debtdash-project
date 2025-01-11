import styles from './DebtorComponents.module.css';

function EditDebtor({editDebtor, handleEditSubmit}) {
    return (
        <>
        <div className={styles.bgContainer}>
            <div className={styles.formContainer}>
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
            </div>
        </div>
        </>
    )
}

export default EditDebtor;