import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


function Login() {

    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!form.email || !form.password) {
            setMessage('Email and password are required');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/login', form);
            const token = res.data.token;
            localStorage.setItem("token", token);

            setMessage('Login successful!');
            navigate("/products");
        } catch (err) {
            setMessage('Login failed');
        }
    };


    return (
        <div style={{
            maxWidth: '400px',
            margin: '40px auto',
            padding: '24px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Segoe UI, sans-serif'
        }}>
            <h2 style={{ marginBottom: '16px', textAlign: 'center', color: '#333' }}>Login</h2>
            {message && <p className="text-info">{message}</p>}
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                </div>
                <button type="submit" style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}>Login</button>
            </form>
        </div>
    )
}

export default Login