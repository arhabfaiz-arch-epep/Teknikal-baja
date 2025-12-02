const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Path to steel data file
const STEEL_FILE = path.join(__dirname, '../data/steel.json');

// Helper function to read steel data
async function readSteelData() {
    try {
        const data = await fs.readFile(STEEL_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('Failed to read steel data');
    }
}

// Get all steel types
router.get('/types', async (req, res) => {
    try {
        const data = await readSteelData();
        res.json({
            success: true,
            data: data.types,
            count: data.types.length
        });
    } catch (error) {
        console.error('Get steel types error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data jenis baja'
        });
    }
});

// Get steel type by ID
router.get('/types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readSteelData();
        const steelType = data.types.find(type => type.id === id);

        if (!steelType) {
            return res.status(404).json({
                success: false,
                message: 'Jenis baja tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: steelType
        });
    } catch (error) {
        console.error('Get steel type error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data jenis baja'
        });
    }
});

// Get steel standards
router.get('/standards', async (req, res) => {
    try {
        const data = await readSteelData();
        res.json({
            success: true,
            data: data.standards
        });
    } catch (error) {
        console.error('Get standards error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data standar'
        });
    }
});

// Get standards by organization
router.get('/standards/:org', async (req, res) => {
    try {
        const { org } = req.params;
        const data = await readSteelData();

        if (!data.standards[org.toUpperCase()]) {
            return res.status(404).json({
                success: false,
                message: 'Organisasi standar tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: data.standards[org.toUpperCase()],
            organization: org.toUpperCase()
        });
    } catch (error) {
        console.error('Get standards by org error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data standar'
        });
    }
});

// Get knowledge articles
router.get('/knowledge', async (req, res) => {
    try {
        const { category } = req.query;
        const data = await readSteelData();

        let knowledge = data.knowledge;
        if (category) {
            knowledge = knowledge.filter(item => item.category === category);
        }

        res.json({
            success: true,
            data: knowledge,
            count: knowledge.length,
            category: category || 'all'
        });
    } catch (error) {
        console.error('Get knowledge error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data pengetahuan'
        });
    }
});

// Get knowledge article by ID
router.get('/knowledge/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readSteelData();
        const article = data.knowledge.find(item => item.id === id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Artikel pengetahuan tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: article
        });
    } catch (error) {
        console.error('Get knowledge article error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil artikel pengetahuan'
        });
    }
});

// Search steel types
router.get('/search', async (req, res) => {
    try {
        const { q, category } = req.query;
        const data = await readSteelData();

        let results = data.types;

        // Filter by category if provided
        if (category) {
            results = results.filter(type => type.category.toLowerCase() === category.toLowerCase());
        }

        // Search by query if provided
        if (q) {
            const query = q.toLowerCase();
            results = results.filter(type =>
                type.name.toLowerCase().includes(query) ||
                type.description.toLowerCase().includes(query) ||
                type.applications.some(app => app.toLowerCase().includes(query)) ||
                type.standards.some(std => std.toLowerCase().includes(query))
            );
        }

        res.json({
            success: true,
            data: results,
            count: results.length,
            query: q,
            category: category
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat pencarian'
        });
    }
});

module.exports = router;
