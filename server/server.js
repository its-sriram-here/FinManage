const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/transactions', require('./routes/transactionRoutes.js'));
app.use('/api/budgets', require('./routes/budgetRoutes.js'));
app.use('/api/goals', require('./routes/goalRoutes.js'));

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../', 'client', 'dist', 'index.html'))
    );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
