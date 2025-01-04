import Debtor from "./pages/debtor/Debtor.jsx";
import { Route, Routes } from 'react-router-dom';
import Inventory from './pages/inventory/Inventory.jsx';
import Welcome from "./pages/Welcome.jsx";
import DebtorDetail from './pages/debtor/DebtorDetail.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route index path='/' element={<Welcome />} />
        <Route path='/debt' element={<Debtor />} />
        <Route path='/debt/:id' element={<DebtorDetail />} /> 
        <Route path='/inventory' element={<Inventory />} />
      </Routes>
    </>
  );
}

export default App;
