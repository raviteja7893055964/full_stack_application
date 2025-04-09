const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./Models/User');
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { redirect } = require('react-router-dom');
const Product = require('./Models/Products');



const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));




app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'user desnot exists.' });
    }
    else{
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      else{
        const token = jwt.sign(
          { role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ token, message: 'Login successful', user });
      }
    }


   
   
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// this is registration code
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
/* // console.log(hashedPassword);
 */
    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.', user: newUser });
    redirect("/login")
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// get data
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); // fetch all products
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


//post products
app.post('/api/products', async (req, res) => {
  const { title, description, inventory } = req.body;
  const newProduct = new Product({ title, description, inventory });
  await newProduct.save();
  res.status(201).json({ message: 'Product created successfully', products: newProduct });
});


// delete products
app.delete('/api/products/:id', verifyToken, async (req, res) => {
  try {
    console.log(req.params.id);
    
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// update products
app.put('/api/products/:id', verifyToken, async (req, res) => {
  const { title, description, inventory } = req.body;

  try { 
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, inventory },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
