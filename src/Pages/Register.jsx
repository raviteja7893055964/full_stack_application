import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom"


const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
    });
    const navigate = useNavigate()


    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const { username, email, password, role } = form;

        if (!username || !email || !password || !role) {
            setMessage('All fields are required.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/register', form);
            setMessage(res.data.message);
            setForm({ username: '', email: '', password: '', role: '' });
            navigate(`/login`)
        } catch (err) {
            console.error(err);
            setMessage('Registration failed.');
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
            <h2 style={{ marginBottom: '16px', textAlign: 'center', color: '#333' }}>Register</h2>
            {message && <p className="text-info">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={form.username}
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
                <div className="mb-3">
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Role</label>
                    <select
                        className="form-select"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                    </select>
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
                }}>Register</button>
            </form>
            <p>Already have an account? <Link to="/login" style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '20px'
            }}>Login here</Link></p>
        </div >
    );
};

export default Register;
