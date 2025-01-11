import styles from './Debtor.module.css';
import { useContext } from "react";;
import Navigation from "../../components/navigation/Navigation";
import AddDebtorForm from '../../components/debtor-related/AddDebtorForm';
import SearchDebtor from '../../components/debtor-related/SearchDebtors';
import EditDebtor from '../../components/debtor-related/EditDebtor';
import DebtorList from '../../components/debtor-related/DebtorList';
import { DebtorContext } from '../../context/DebtorContext';

function Debtor() {
    const {renderForm, setRenderForm, searchQuery, editDebtor, setEditDebtor, loading, fadeIn, handleSearch, filteredDebtors, deleteDebtor, addDebtor, handleEditSubmit} = useContext(DebtorContext);

    if (loading) {
        return (
            <>
                <Navigation />
                <div className={styles.container}>
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navigation />
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.heading}>DEBTOR LIST</h1>

                    <SearchDebtor searchQuery={searchQuery} handleSearch={handleSearch} setRenderForm={setRenderForm} renderForm={renderForm}/>

                    {renderForm && (<AddDebtorForm addDebtor={addDebtor} onClose={(e) => {setRenderForm(false)}} />)}

                    {editDebtor && (<EditDebtor editDebtor={editDebtor} handleEditSubmit={handleEditSubmit}/>)}

                    <DebtorList
                        filteredDebtors={filteredDebtors}
                        setEditDebtor={setEditDebtor}
                        deleteDebtor={deleteDebtor}
                        fadeIn={fadeIn} />
                </div>
            </div>
        </>
    );
}

export default Debtor;
