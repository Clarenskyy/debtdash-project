import styles from './DebtorComponents.module.css';

function SearchDebtor({searchQuery, handleSearch, setRenderForm}) {

    return(
        <>
        <div className={styles.filters}>
            <input
                type="text"
                placeholder="Search Debtors"
                className={styles.input}
                value={searchQuery}
                onChange={handleSearch}
            />
            <button className={styles.button} onClick={() => setRenderForm(!renderForm)}>
                Add Debtor
            </button>
        </div>
        </>
    )
}

export default SearchDebtor;