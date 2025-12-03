const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const STEEL_FILE = path.join(__dirname, '../data/steels.json');

// In-memory cache
let steelDataCache = null;

function readSteelData() {
    if (steelDataCache) {
        return steelDataCache;
    }
    
    try {
        const data = fs.readFileSync(STEEL_FILE, 'utf8');
        steelDataCache = JSON.parse(data);
        return steelDataCache;
    } catch (error) {
        console.log('Steel data read from file failed, using default');
        return { types: [], standards: {} };
    }
}

// Get all steel types
router.get('/types', (req, res) => {
    try {
        const data = readSteelData();
        res.json({
            success: true,
            data: data.types || [],
            count: (data.types || []).length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data jenis baja'
        });
    }
});

// Get steel type by ID
router.get('/types/:id', (req, res) => {
    try {
        const { id } = req.params;
        const data = readSteelData();
        const steel = data.types.find(s => s.id === id);

        if (!steel) {
            return res.status(404).json({
                success: false,
                message: 'Jenis baja tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: steel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan'
        });
    }
});

// Get all standards
router.get('/standards', (req, res) => {
    try {
        const data = readSteelData();
        res.json({
            success: true,
            data: data.standards || {},
            count: Object.keys(data.standards || {}).length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil standar'
        });
    }
});

// Get standards by region
router.get('/standards/:region', (req, res) => {
    try {
        const { region } = req.params;
        const data = readSteelData();
        const standards = data.standards[region];

        if (!standards) {
            return res.status(404).json({
                success: false,
                message: 'Standar tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: standards
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan'
        });
    }
});

// Search steel
router.get('/search', (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query harus diisi'
            });
        }

        const data = readSteelData();
        const results = data.types.filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.description.toLowerCase().includes(query.toLowerCase())
        );

        res.json({
            success: true,
            data: results,
            count: results.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mencari'
        });
    }
});

// Compare steel
router.get('/compare', (req, res) => {
    try {
        const { ids } = req.query;
        if (!ids) {
            return res.status(400).json({
                success: false,
                message: 'IDs harus diisi'
            });
        }

        const idArray = ids.split(',');
        const data = readSteelData();
        const comparison = data.types.filter(s => idArray.includes(s.id));

        res.json({
            success: true,
            data: comparison
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membandingkan'
        });
    }
});

module.exports = router;
