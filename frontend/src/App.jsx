import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Debtor from "./pages/debtor/Debtor.jsx";
import Inventory from './pages/inventory/Inventory.jsx';
import Welcome from "./pages/welcome/Welcome.jsx";
import DebtorDetail from './pages/debtor/DebtorDetail.jsx';
import Login from './pages/login/login.jsx';
import Signup from './pages/signup/signup.jsx';
import AuthPage from './pages/auth/AuthPage.jsx';


function App() {

  const testingComponents = false;

  if (testingComponents) {
    return (
      <>
        {/* Add testing components here */}
      </>
    );
  } else {
    return (
      <>
        <Routes>
          <Route index path='/' element={<AuthPage />} />
          <Route index path='/home' element={<Welcome />} />
          <Route path='/debt' element={<Debtor />} />
          <Route path='/debt/:id' element={<DebtorDetail />} /> 
          <Route path='/inventory' element={<Inventory />} />
          
          {/* Add login and signup routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </>
    );
  }

}

export default App;
