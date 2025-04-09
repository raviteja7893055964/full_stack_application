import './App.css';
import Login from './Pages/Login';
import Products from './Pages/Products';
import Register from './Pages/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
        <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        </Routes>
      </Router>
    </>
      

    
  );
}

export default App;
