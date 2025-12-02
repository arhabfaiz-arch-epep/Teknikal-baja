# 🚀 Setup Guide - Teknikal Baja API Backend

Panduan lengkap untuk setup dan menjalankan Teknikal Baja dengan API Backend.

## ✅ Prerequisites

Pastikan sudah terinstall:
- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **npm** (biasanya terinstall dengan Node.js)
- **Git** (opsional, untuk clone repository)

Verifikasi instalasi:
```bash
node --version
npm --version
```

## 📦 Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd "Teknikal Baja"
```

### Step 2: Install Dependencies
```bash
npm install
```

Ini akan menginstall:
- `express` - Web framework
- `cors` - Enable CORS
- `body-parser` - Parse request body
- `uuid` - Generate unique IDs
- `nodemon` - Auto-reload development server

### Step 3: Verify Installation
```bash
npm list
```

Pastikan dependencies terinstall dengan benar.

## 🏃 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

Output yang diharapkan:
```
🚀 Teknikal Baja API Server running on http://localhost:5000
📚 API Health Check: http://localhost:5000/api/health
```

### Production Mode
```bash
npm start
```

## 🧪 Test API

Buka terminal baru dan test health endpoint:

```bash
curl http://localhost:5000/api/health
```

Response yang diharapkan:
```json
{
  "status": "OK",
  "message": "Teknikal Baja API is running",
  "timestamp": "2025-01-15T10:30:45.123Z"
}
```

## 📱 Test Login

```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Response:
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": { ... },
  "token": "token_user-001_..."
}
```

## 🎮 Using Postman/Insomnia (Optional)

Untuk testing yang lebih mudah, gunakan tools ini:

1. **Download Postman**: https://www.postman.com/downloads/
2. **Import dari file** atau buat requests manual
3. **Base URL**: `http://localhost:5000/api`

## 🌐 Frontend Access

1. Buka browser
2. Go to: `http://localhost:5000`
3. Page akan loading dan menampilkan landing page
4. Click "Masuk" atau "Jelajahi Sekarang"
5. Gunakan credentials:
   - Username: `admin` / Password: `admin123`
   - Username: `engineer` / Password: `engineer123`

## 📚 Data Files

Backend menyimpan data di file JSON:

```
data/
├── users.json          # User data dan credentials
├── steels.json         # Steel types dan specifications
└── standards.json      # International standards
```

### Edit Users
Edit `data/users.json` untuk menambah/edit user:
```json
{
  "id": "user-003",
  "username": "newuser",
  "password": "password123",
  "email": "newuser@example.com",
  "name": "New User",
  "level": "Beginner",
  "points": 0,
  "joinDate": "2025-01-15",
  "achievements": []
}
```

### Edit Steel Data
Edit `data/steels.json` untuk menambah jenis baja baru.

### Edit Standards
Edit `data/standards.json` untuk menambah standar baru.

## 🔧 Troubleshooting

### Port 5000 already in use

**Opsi 1:** Use different port
```bash
PORT=5001 npm run dev
```

**Opsi 2:** Kill process on port 5000

Windows:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -i :5000
kill -9 <PID>
```

### Cannot find module

```bash
npm install
npm cache clean --force
```

### API returns CORS error

CORS sudah configured di server. Jika masih error:
- Pastikan frontend loading dari `http://localhost:5000`
- Check bahwa server running di port 5000

### Database file not found

Create missing files:
```bash
# Manually create files atau reset
npm install
npm run dev
```

## 🔐 Security Notes

⚠️ **For Development Only!**

Saat production, lakukan:
- [ ] Use proper database (MongoDB, PostgreSQL)
- [ ] Hash passwords dengan bcrypt
- [ ] Use JWT untuk authentication
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Use HTTPS/SSL
- [ ] Add logging system

## 📚 Documentation

Dokumentasi lengkap tersedia di:
- `README.md` - General information
- `API_DOCUMENTATION.md` - Complete API reference
- `TODO.md` - Project progress

## 🚀 Next Steps

1. **Test semua endpoints** - Gunakan curl atau Postman
2. **Test frontend integration** - Login dan browse sections
3. **Test calculator tools** - Submit forms dan verify calculations
4. **Add more data** - Tambah users, steels, standards

## 📝 Common Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Install packages
npm install

# Update packages
npm update

# Check installed packages
npm list

# Clear npm cache
npm cache clean --force
```

## 🎓 Learning Resources

- Express.js Documentation: https://expressjs.com/
- RESTful API Best Practices: https://restfulapi.net/
- Node.js Documentation: https://nodejs.org/docs/

## 💡 Tips

1. **Keep terminal running** saat development
2. **Check console** untuk error messages
3. **Use Postman** untuk test API sebelum frontend integration
4. **Read error messages** carefully
5. **Check logs** di console untuk debugging

## ❓ Need Help?

1. Check `API_DOCUMENTATION.md` untuk endpoint details
2. Check error messages di console
3. Verify file permissions
4. Restart server
5. Check port availability

---

**Happy Coding! 🎉**

Untuk info lebih lanjut, buka README.md atau API_DOCUMENTATION.md
