const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const usersFile = path.join(__dirname, '../data/users.json');

// In-memory storage for users (session-based)
let usersInMemory = null;

// Default users (fallback if no file exists)
const DEFAULT_USERS = [
    {
        id: 'user-admin001',
        username: 'admin',
        email: 'admin@teknikalbaja.com',
        password: 'admin123',
        name: 'Administrator',
        level: 'Expert',
        points: 1000,
        joinDate: '2024-01-01',
        achievements: [
            { id: 'master', name: 'Master User', icon: '👑' }
        ]
    },
    {
        id: 'user-engineer001',
        username: 'engineer',
        email: 'engineer@teknikalbaja.com',
        password: 'engineer123',
        name: 'Engineer User',
        level: 'Intermediate',
        points: 500,
        joinDate: '2024-01-15',
        achievements: [
            { id: 'scholar', name: 'Scholar', icon: '🎓' }
        ]
    }
];

// Helper function to read users from file
function getUsersFromFile() {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        const fileUsers = JSON.parse(data);
        console.log('✅ Loaded', fileUsers.length, 'users from file');
        return fileUsers;
    } catch (err) {
        console.log('⚠️ No file found, using DEFAULT_USERS');
        return DEFAULT_USERS;
    }
}

// Helper function to get users (always from file first to get latest data)
function getUsers() {
    if (!usersInMemory) {
        usersInMemory = getUsersFromFile();
    }
    return usersInMemory;
}

// Helper function to save users (always write to file, keep in memory)
function saveUsers(users) {
    usersInMemory = users;
    
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
        console.log('✅ Users saved to file');
    } catch (err) {
        console.log('⚠️ Could not write to file (Vercel read-only), data in memory only');
    }
}

// POST: Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username dan password harus diisi'
        });
    }

    const users = getUsers();
    console.log(`🔍 Login attempt: username="${username}", total users in memory: ${users.length}`);
    
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        console.log(`❌ Login failed for "${username}" - credentials not found`);
        return res.status(401).json({
            success: false,
            message: 'Username atau password salah'
        });
    }

    console.log(`✅ Login successful for "${username}" (${user.id})`);
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({
        success: true,
        message: 'Login berhasil',
        user: userWithoutPassword,
        token: `token_${user.id}_${Date.now()}`
    });
});

// POST: Register
router.post('/register', (req, res) => {
    const { username, email, password, name } = req.body;

    console.log(`📝 Register attempt: username="${username}", email="${email}"`);

    if (!username || !email || !password || !name) {
        console.log('❌ Register failed: missing fields');
        return res.status(400).json({
            success: false,
            message: 'Semua field harus diisi'
        });
    }

    const users = getUsers();
    console.log(`Current users in memory: ${users.length}`);
    
    if (users.find(u => u.username === username)) {
        console.log(`❌ Username "${username}" already exists`);
        return res.status(409).json({
            success: false,
            message: 'Username sudah terdaftar'
        });
    }

    if (users.find(u => u.email === email)) {
        console.log(`❌ Email "${email}" already exists`);
        return res.status(409).json({
            success: false,
            message: 'Email sudah terdaftar'
        });
    }

    const newUser = {
        id: `user-${uuidv4().substring(0, 8)}`,
        username,
        email,
        password,
        name,
        level: 'Beginner',
        points: 0,
        joinDate: new Date().toISOString().split('T')[0],
        achievements: []
    };

    users.push(newUser);
    saveUsers(users);

    console.log(`✅ Register successful for "${username}" (${newUser.id})`);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        user: userWithoutPassword,
        token: `token_${newUser.id}_${Date.now()}`
    });
});

// GET: Verify token (simple check)
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak ditemukan'
        });
    }

    res.json({
        success: true,
        message: 'Token valid'
    });
});

module.exports = router;
