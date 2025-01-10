import { createContext, useState, useEffect } from 'react';
import getTokenInfo from '../utils/tokenUtils';
import { useNavigate } from 'react-router-dom';

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const [items, setItems] = useState([]); // State for inventory items
    const [editItem, setEditItem] = useState(null); // State for the item being edited
    const [filters, setFilters] = useState({ search: '', sort: '' }); // State for filtering and sorting
    const [renderForm, setRenderForm] = useState(false); // Controls form visibility
    const [editItemForm, setEditItemForm] = useState(false); // Controls edit form visibility
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    let token = getTokenInfo(); // Assume getTokenInfo() fetches the token

    // Check if the user is logged in and token is valid
    useEffect(() => {
        if (!token) {
            navigate("/login");  // Redirect to login page if no token is found
        }
    }, [token, navigate]);

    const fetchItems = async () => {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
            console.error("No userId found in localStorage.");
            return; // Prevent the API call if no userId is found
        }
        try {
            const response = await fetch(`/api/inventory/${storedUserId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch items: ${response.statusText}`);
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            fetchItems();
        } else {
            console.error("No userId found. Redirecting to login.");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        fetchItems();
    }, [userId]);

    // Add an item via the API
    const addItem = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const price = parseFloat(e.target.price.value);

        try {
            const response = await fetch(`/api/inventory/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price }),
            });
            if (response.ok) {
                const newItem = await response.json();
                setItems([...items, newItem]);
                e.target.reset(); // Reset form fields
            } else {
                console.error('Error adding item:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    // Handle filter change and fetch filtered/sorted items
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters, [name]: value };
            const queryParams = new URLSearchParams(updatedFilters).toString();
            fetch(`/api/inventory/search/${userId}?${queryParams}`)
                .then((response) => response.json())
                .then((data) => setItems(data))
                .catch((error) => console.error('Error filtering items:', error));
            return updatedFilters;
        });
    };

    // Delete an item
    const deleteItem = async (id) => {
        try {
            const response = await fetch(`/api/inventory/${userId}/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setItems(items.filter((item) => item._id !== id));
            } else {
                console.error('Error deleting item:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    // Edit an item
    const handleEditItem = async (e) => {
        e.preventDefault();
        const updatedName = e.target.name.value;
        const updatedPrice = parseFloat(e.target.price.value);
    
        try {
            const response = await fetch(`/api/inventory/${userId}/${editItem._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: updatedName, price: updatedPrice }),
            });
    
            if (response.ok) {
                const updatedItem = await response.json();
                setItems(items.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
                setEditItem(null); // Clear the item being edited
                setEditItemForm(false); // Close the edit form
            } else {
                console.error('Error updating item:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating item:', error.message);
        }
    };
    

    const renderAddItem = () => {
        setRenderForm(!renderForm);
    };

    const isEditting = (item) => {
        setEditItem(item);
        setEditItemForm(true);
    };

    return (
        <InventoryContext.Provider
            value={{
                items,
                setItems,
                filters,
                setFilters,
                renderForm,
                setRenderForm,
                isEditting,
                editItemForm,
                setEditItemForm,
                addItem,
                handleFilterChange,
                deleteItem,
                renderAddItem,
                handleEditItem,
                editItem,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};
