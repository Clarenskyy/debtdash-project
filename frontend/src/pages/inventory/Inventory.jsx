import styles from './Inventory.module.css';
import Navigation from "../../components/navigation/Navigation";
import { InventoryContext } from '../../context/InventoryContext';
import { useContext } from 'react';
import AddItemForm from '../../components/inventory-related/AddItemForm';
import EditItem from '../../components/inventory-related/EditItem';
import InventoryFilters from '../../components/inventory-related/InventoryFilters';
import InventoryList from '../../components/inventory-related/InventoryList';



function Inventory() {
   const { items, renderForm, addItem, handleFilterChange, deleteItem, renderAddItem, setRenderForm, editItem, editItemForm, isEditting, handleEditItem, setEditItemForm, setEditItem, } = useContext(InventoryContext);

    return (
        <>
            <Navigation />
            <div className={styles.container}>
                <h1 className={styles.heading}>ITEM LIST</h1>

                <div className={styles.listContainer}>
                    {renderForm && (<AddItemForm addItem={addItem} setRenderForm={setRenderForm} renderForm={renderForm} />)}

                    {editItemForm && (
                    <EditItem handleEditItem={handleEditItem} editItem={editItem} setEditItemForm={setEditItemForm}
                    />
                    )}

                
                    <InventoryFilters handleFilterChange={handleFilterChange} renderAddItem={renderAddItem} />

                    <InventoryList items={items} deleteItem={deleteItem} isEditting={isEditting}/>



                </div>
            </div>
        </>
    );
}

export default Inventory;
