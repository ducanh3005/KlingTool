const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const FormData = require('form-data');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

app.get('/cookie-manager', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'cookie-manager.html'));
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server is working!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Simple test route
app.get('/test', (req, res) => {
    res.send('Hello from Kling Tool Server!');
});

// Export for Vercel
module.exports = app; 