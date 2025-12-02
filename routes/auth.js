const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const usersFile = path.join(__dirname, '../data/users.json');

// Helper function to read users
function getUsers() {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper function to save users
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
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
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Username atau password salah'
        });
    }

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

    if (!username || !email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: 'Semua field harus diisi'
        });
    }

    const users = getUsers();
    
    if (users.find(u => u.username === username)) {
        return res.status(409).json({
            success: false,
            message: 'Username sudah terdaftar'
        });
    }

    if (users.find(u => u.email === email)) {
        return res.status(409).json({
            success: false,
            message: 'Email sudah terdaftar'
        });
    }

    const newUser = {
        id: `user-${uuidv4().substring(0, 8)}`,
        username,
        email,
        password, // In production, use bcrypt
        name,
        level: 'Beginner',
        points: 0,
        joinDate: new Date().toISOString().split('T')[0],
        achievements: []
    };

    users.push(newUser);
    saveUsers(users);

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
