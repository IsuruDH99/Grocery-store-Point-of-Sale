import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserReg from './pages/UserReg';
import Header from './Components/Header';
import Home from "./pages/Home";
import Calcbill from './pages/Calcbill';
import ViewProducts from './pages/ViewProducts';
import ProductEdit from './pages/ProductEdit';
import ProductAdd from './pages/ProductAdd';

function AppWrapper() {
  const location = useLocation();
  
  // Hide the Header on /login, /home, and /dashboard pages
  const showHeader = !['/login', '/', '/dashboard'].includes(location.pathname);

  return (
    <>
    {showHeader && <Header />}
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/userreg' element={<UserReg />} />
        <Route path='/header' element={<Header />} />
        <Route path='/productedit' element={<ProductEdit />} />
        <Route path='/calcbill' element={<Calcbill/>} />
        <Route path='/viewproducts' element={<ViewProducts />} />
        <Route path='/productadd' element={<ProductAdd />} />
         
      </Routes>
    </>
  );
}
function App() {
  return (
     <div className="App">
      <Router>
        <AppWrapper />
      </Router>
    </div>
  );
}

export default App;