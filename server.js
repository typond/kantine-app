const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Kantine App Server - Menu data served from Firebase database'
    });
});

// Basic info endpoint
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Kantine App Server',
        version: '1.0.0',
        description: 'Simple server for serving restaurant menu data from Firebase',
        endpoints: [
            'GET /api/health - Health check',
            'GET /api/info - Server information'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Kantine App Server running on port ${PORT}`);
    console.log(`📋 Menu data will be served from Firebase database`);
    console.log(`🔗 Server endpoints:`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   GET  /api/info   - Server information`);
});

module.exports = app;
