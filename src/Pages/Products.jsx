import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Products() {
    const [products, setProducts] = useState([]);
    const [role, setRole] = useState('');
    const [newProduct, setNewProduct] = useState({ title: '', description: '', inventory: 0 });
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const decoded = jwtDecode(token);
        setRole(decoded.role);

        loadProducts();
    }, [newProduct]);
    const loadProducts = () => {
        fetch('http://localhost:5000/api/products')
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err));
    };




    const handleCreate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await axios.post('http://localhost:5000/api/products', newProduct);
            setMessage(res.data.message);
            loadProducts();
            setNewProduct({ title: '', description: '', inventory: '' });
            loadProducts();
        } catch (err) {
            console.error(err);
            setMessage('DATA ADDED');
        }
    };

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Product deleted successfully");
            loadProducts();
            setProducts(products.filter((prod) => prod._id !== id));
        } catch (err) {
            console.error(err);
            setMessage("Failed to delete product");
        }
    };


    const handleUpdate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            const productToUpdate = products.find(prod => prod._id === id);
            if (!productToUpdate) return alert("Product not found");
            const updatedTitle = prompt("New title:", productToUpdate.title);
            const updatedDescription = prompt("New description:", productToUpdate.description);
            const updatedInventory = prompt("New inventory:", productToUpdate.inventory);

            const updatedProduct = {
                title: updatedTitle || productToUpdate.title,
                description: updatedDescription || productToUpdate.description,
                inventory: Number(updatedInventory) || productToUpdate.inventory,
            };

            const res = await axios.put(`http://localhost:5000/api/products/${id}`, updatedProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(res.data.message);
            loadProducts();
            const updatedList = products.map(p => p._id === id ? res.data.product : p);
            setProducts(updatedList);
        } catch (err) {
            console.error(err);
            setMessage("Failed to update product");
        }
    };

    return (
        <>
            {role === 'staff' ? <p style={{
                color: '#28a745',
                fontWeight: 'bold',
                fontSize: '18px',
                textAlign: 'center',
                marginTop: '20px'
            }}>your registration is confirmed</p> :
                <div style={{
                    maxWidth: '800px',
                    margin: '30px auto',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                }}>

                    <input name="title" placeholder="title" onChange={handleInputChange} style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }} />
                    <input name="description" placeholder="description" onChange={handleInputChange} style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }} />
                    <input name="inventory" type="number" placeholder="inventory" onChange={handleInputChange} style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }} />
                    {(role === 'admin') && <button onClick={handleCreate} style={{
                        padding: '8px 12px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}>Create</button>}



                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}>
                        <thead>
                            <tr >
                                <th >Title</th>
                                <th>Description</th>
                                <th>Inventory</th>
                                {(role === 'admin' || role === 'manager') && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((prod) => (
                                <tr key={prod._id} >
                                    <td style={{
                                        padding: '12px',
                                        borderBottom: '1px solid #ccc',
                                        textAlign: 'center'
                                    }}>{prod.title}</td>
                                    <td style={{
                                        padding: '12px',
                                        borderBottom: '1px solid #ccc',
                                        textAlign: 'center'
                                    }}>{prod.description}</td>
                                    <td style={{
                                        padding: '12px',
                                        borderBottom: '1px solid #ccc',
                                        textAlign: 'center',
                                        alignItems: 'center'
                                    }}>{prod.inventory}</td>
                                    {(role === 'admin') && <button onClick={() => handleDelete(prod._id)} style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        marginRight: '12px',
                                        alignItems: 'center'

                                    }}>Delete</button>}
                                    {(role === 'admin' || role === 'manager') && <button onClick={() => handleUpdate(prod._id)} style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',

                                    }}>Update</button>}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>}
        </>
    )
}

export default Products