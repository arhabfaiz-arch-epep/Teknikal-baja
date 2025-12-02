const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Path to profiles data file
const PROFILES_FILE = path.join(__dirname, '../data/profiles.json');

// Helper function to read profiles data
async function readProfilesData() {
    try {
        const data = await fs.readFile(PROFILES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('Failed to read profiles data');
    }
}

// Helper function to write profiles data
async function writeProfilesData(data) {
    try {
        await fs.writeFile(PROFILES_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        throw new Error('Failed to write profiles data');
    }
}

// Get user profile by ID
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await readProfilesData();
        const profile = data.profiles.find(p => p.id === userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profil pengguna tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data profil'
        });
    }
});

// Update user profile
router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        const data = await readProfilesData();

        const profileIndex = data.profiles.findIndex(p => p.id === userId);
        if (profileIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Profil pengguna tidak ditemukan'
            });
        }

        // Update profile (only allow certain fields)
        const allowedUpdates = ['fullName', 'preferences', 'stats'];
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                data.profiles[profileIndex][field] = updates[field];
            }
        });

        await writeProfilesData(data);

        res.json({
            success: true,
            data: data.profiles[profileIndex],
            message: 'Profil berhasil diperbarui'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat memperbarui profil'
        });
    }
});

// Add achievement to user profile
router.post('/:userId/achievements', async (req, res) => {
    try {
        const { userId } = req.params;
        const { achievementId } = req.body;

        if (!achievementId) {
            return res.status(400).json({
                success: false,
                message: 'ID achievement harus diisi'
            });
        }

        const data = await readProfilesData();
        const profile = data.profiles.find(p => p.id === userId);
        const achievement = data.achievements.find(a => a.id === achievementId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profil pengguna tidak ditemukan'
            });
        }

        if (!achievement) {
            return res.status(404).json({
                success: false,
                message: 'Achievement tidak ditemukan'
            });
        }

        // Check if user already has this achievement
        const hasAchievement = profile.achievements.some(a => a.id === achievementId);
        if (hasAchievement) {
            return res.status(400).json({
                success: false,
                message: 'Achievement sudah dimiliki pengguna'
            });
        }

        // Add achievement to profile
        const newAchievement = {
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            earnedDate: new Date().toISOString().split('T')[0]
        };

        profile.achievements.push(newAchievement);
        profile.points += achievement.points;

        await writeProfilesData(data);

        res.json({
            success: true,
            data: {
                achievement: newAchievement,
                newPoints: profile.points
            },
            message: 'Achievement berhasil ditambahkan'
        });
    } catch (error) {
        console.error('Add achievement error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menambahkan achievement'
        });
    }
});

// Update user stats
router.post('/:userId/stats', async (req, res) => {
    try {
        const { userId } = req.params;
        const { statType, increment = 1 } = req.body;

        if (!statType) {
            return res.status(400).json({
                success: false,
                message: 'Tipe statistik harus diisi'
            });
        }

        const data = await readProfilesData();
        const profile = data.profiles.find(p => p.id === userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profil pengguna tidak ditemukan'
            });
        }

        // Initialize stat if it doesn't exist
        if (!profile.stats[statType]) {
            profile.stats[statType] = 0;
        }

        // Update stat
        profile.stats[statType] += increment;

        // Check for achievement unlocks based on stats
        const achievementsToCheck = data.achievements.filter(a =>
            a.id.includes('read') && statType === 'articlesRead' ||
            a.id.includes('calculator') && statType === 'calculationsDone'
        );

        const newAchievements = [];
        for (const achievement of achievementsToCheck) {
            if (achievement.tiers) {
                // Check tiered achievements
                for (const tier of achievement.tiers) {
                    if (profile.stats[statType] >= tier.threshold) {
                        const tierAchievementId = `${achievement.id}-${tier.threshold}`;
                        const hasTier = profile.achievements.some(a => a.id === tierAchievementId);

                        if (!hasTier) {
                            const tierAchievement = {
                                id: tierAchievementId,
                                name: `${achievement.name} - ${tier.name}`,
                                description: achievement.description,
                                icon: achievement.icon,
                                earnedDate: new Date().toISOString().split('T')[0]
                            };
                            profile.achievements.push(tierAchievement);
                            profile.points += achievement.points;
                            newAchievements.push(tierAchievement);
                        }
                    }
                }
            }
        }

        await writeProfilesData(data);

        res.json({
            success: true,
            data: {
                stats: profile.stats,
                newAchievements: newAchievements,
                newPoints: profile.points
            },
            message: 'Statistik berhasil diperbarui'
        });
    } catch (error) {
        console.error('Update stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat memperbarui statistik'
        });
    }
});

// Get all achievements
router.get('/achievements/all', async (req, res) => {
    try {
        const data = await readProfilesData();
        res.json({
            success: true,
            data: data.achievements,
            count: data.achievements.length
        });
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data achievements'
        });
    }
});

// Get achievement by ID
router.get('/achievements/:achievementId', async (req, res) => {
    try {
        const { achievementId } = req.params;
        const data = await readProfilesData();
        const achievement = data.achievements.find(a => a.id === achievementId);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                message: 'Achievement tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: achievement
        });
    } catch (error) {
        console.error('Get achievement error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data achievement'
        });
    }
});

module.exports = router;
