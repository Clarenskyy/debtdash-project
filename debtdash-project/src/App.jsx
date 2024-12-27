import Debtor from "./pages/debtor/Debtor.jsx";
import { Route, Routes} from 'react-router-dom' 
import Navigation from './pages/navigation/Navigation.jsx'
import Inventory from './pages/inventory/Inventory.jsx'
import Welcome from "./pages/Welcome.jsx";


function App(){

    return(
        <>
        <Routes>
                <Route index path='/home' element={<Welcome />}/>
                <Route path='/debt' element={<Debtor/>}/>
                <Route path='/inventory'element={<Inventory/>}/>
        </Routes>
        </>
    )
}

export default App