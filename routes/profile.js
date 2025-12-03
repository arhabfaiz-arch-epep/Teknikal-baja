const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const PROFILES_FILE = path.join(__dirname, '../data/users.json');

// In-memory cache
let profilesDataCache = null;

function readProfilesData() {
    if (profilesDataCache) {
        return profilesDataCache;
    }
    
    try {
        const data = fs.readFileSync(PROFILES_FILE, 'utf8');
        profilesDataCache = JSON.parse(data);
        return profilesDataCache;
    } catch (error) {
        console.log('Profiles data read failed, returning empty');
        return [];
    }
}

function writeProfilesData(data) {
    profilesDataCache = data;
    
    try {
        fs.writeFileSync(PROFILES_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.log('File write failed (expected on Vercel), using in-memory storage');
    }
}

// Get leaderboard
router.get('/', (req, res) => {
    try {
        const users = readProfilesData();
        const sorted = users
            .sort((a, b) => (b.points || 0) - (a.points || 0))
            .slice(0, 10)
            .map(u => {
                const { password, ...rest } = u;
                return rest;
            });

        res.json({
            success: true,
            data: sorted,
            count: sorted.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan'
        });
    }
});

// Get user profile
router.get('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const users = readProfilesData();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        const { password, ...userWithoutPassword } = user;
        res.json({
            success: true,
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan'
        });
    }
});

// Update user profile
router.put('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const users = readProfilesData();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        users[userIndex] = { ...users[userIndex], ...updates, password: users[userIndex].password };
        writeProfilesData(users);

        const { password, ...userWithoutPassword } = users[userIndex];
        res.json({
            success: true,
            message: 'Profile berhasil diperbarui',
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan'
        });
    }
});

// Add points
router.post('/:userId/add-points', (req, res) => {
    try {
        const { userId } = req.params;
        const { points } = req.body;

        if (!points) {
            return res.status(400).json({
                success: false,
                message: 'Points harus diisi'
            });
        }

        const users = readProfilesData();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        users[userIndex].points = (users[userIndex].points || 0) + points;
        writeProfilesData(users);

        res.json({
            success: true,
            message: 'Points berhasil ditambahkan',
            data: { points: users[userIndex].points }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan'
        });
    }
});

// Add achievement
router.post('/:userId/add-achievement', (req, res) => {
    try {
        const { userId } = req.params;
        const { achievement } = req.body;

        if (!achievement) {
            return res.status(400).json({
                success: false,
                message: 'Achievement harus diisi'
            });
        }

        const users = readProfilesData();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        if (!users[userIndex].achievements) {
            users[userIndex].achievements = [];
        }

        users[userIndex].achievements.push(achievement);
        writeProfilesData(users);

        res.json({
            success: true,
            message: 'Achievement berhasil ditambahkan',
            data: { achievements: users[userIndex].achievements }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan'
        });
    }
});

module.exports = router;
