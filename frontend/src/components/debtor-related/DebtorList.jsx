import styles from './DebtorComponents.module.css';
import { Link } from 'react-router-dom';


function DebtorList({filteredDebtors, setEditDebtor, deleteDebtor, fadeIn}) {

    return(
        <>
        <ul className={`${styles.list} ${fadeIn ? styles.fadeIn : ''}`}>
            {filteredDebtors.map((debtor) => (
                <li key={debtor._id} className={styles.card}>
                    <Link to={`/debt/${debtor._id}`} className={styles.link}>
                        <h3>{debtor.name}</h3>
                        <p>Contact: {debtor.contact}</p>
                    </Link>
                    <button
                        className={styles.button}
                        onClick={() => setEditDebtor(debtor)}
                    >
                        Edit
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => deleteDebtor(debtor._id)}
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
        </>
    )
}

export default DebtorList;