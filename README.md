# 🏗️ Teknikal Baja - Platform Edukasi & API Backend

Teknikal Baja adalah platform komprehensif untuk pembelajaran teknis material baja dengan antarmuka yang menarik dan backend API yang powerful.

## ✨ Fitur Utama

### Frontend
- 🎨 Interface modern dengan gradient dan animasi smooth
- 🔐 Sistem login/register
- 📚 Database lengkap tentang jenis baja
- 📊 Dashboard statistik dinamis
- 🧮 Tools kalkulator teknis
- 👥 Profil pengguna dengan achievement system
- 📖 Standar internasional (ASTM, JIS, EN, AISI)

### Backend API
- ✅ Authentication (Login, Register, Token Verification)
- 🔧 Steel Data Management (Types, Standards, Search, Compare)
- 🧮 Calculator Endpoints (Load, Weight, Conversion, Stress-Strain)
- 👤 User Profile Management (Points, Achievements, Leaderboard)
- 📡 RESTful API dengan error handling

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Installation

1. **Clone atau download project**
```bash
cd "Teknikal Baja"
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di: `http://localhost:5000`

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| GET | `/steel/types` | Get all steel types |
| GET | `/steel/standards` | Get all standards |
| GET | `/steel/search?query=...` | Search steel |
| POST | `/calculator/load-capacity` | Calculate load |
| POST | `/calculator/weight` | Calculate weight |
| POST | `/calculator/convert` | Unit conversion |
| GET | `/profile` | Get leaderboard |

**Untuk dokumentasi lengkap, lihat: `API_DOCUMENTATION.md`**

## 🧪 Test Credentials

```
Username: admin
Password: admin123

Username: engineer
Password: engineer123
```

## 📁 Project Structure

```
Teknikal Baja/
├── index.html                 # Frontend landing page
├── style.css                  # Frontend styles
├── anime.js                   # Frontend interactions & animations
├── server.js                  # Express server
├── package.json               # Dependencies
├── API_DOCUMENTATION.md       # Complete API reference
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── steel.js              # Steel data routes
│   ├── calculator.js         # Calculator routes
│   └── profile.js            # User profile routes
├── data/
│   ├── users.json            # User data store
│   ├── steels.json           # Steel types data
│   └── standards.json        # International standards data
└── halaman masuk teknikal baja/
    ├── index.html            # Login page
    ├── style.css             # Login page styles
    └── baja.js               # Login page interactions
```

## 🔑 Key Features

### Authentication
- Secure login/register system
- Token-based authentication
- User data protection

### Steel Database
- 4 main steel types (Carbon, Alloy, Stainless, Structural)
- International standards (ASTM, JIS, EN, AISI)
- Detailed specifications and properties

### Calculation Tools
- Load capacity calculation
- Material weight calculation
- Unit conversion (MPa↔PSI, mm²↔in², etc)
- Stress & Strain analysis

### User System
- User profiles with points and achievements
- Leaderboard ranking
- Achievement tracking

## 🛠️ Customization

### Add New Steel Type
Edit `data/steels.json`:
```json
{
  "id": "steel-005",
  "type": "Your Steel Type",
  "icon": "🎯",
  "usage": "...",
  "characteristics": "...",
  ...
}
```

### Add New Calculator
Edit `routes/calculator.js` and add new route.

### Add New User
Edit `data/users.json` or use API `/auth/register`.

## 📚 API Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Steel Types
```bash
curl http://localhost:5000/api/steel/types
```

### Calculate Load
```bash
curl -X POST http://localhost:5000/api/calculator/load-capacity \
  -H "Content-Type: application/json" \
  -d '{"area":100,"stress":400}'
```

## 🐛 Troubleshooting

### Port already in use
Ubah PORT di `server.js`:
```javascript
const PORT = process.env.PORT || 5001;
```

### Cannot find module
Jalankan: `npm install`

### CORS error
CORS sudah dikonfigurasi di `server.js`

## 📝 Next Steps

- [ ] Integrate frontend with API calls
- [ ] Add database support (MongoDB/PostgreSQL)
- [ ] Add authentication middleware
- [ ] Add rate limiting
- [ ] Add logging system
- [ ] Deploy to cloud (Heroku, Vercel, etc)

## 📄 License

ISC

## 👨‍💻 Developer

Teknikal Baja Team

---

**Happy Learning! 🎓**

Untuk info lebih lanjut, buka API_DOCUMENTATION.md
