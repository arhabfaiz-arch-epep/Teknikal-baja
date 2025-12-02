# Teknikal Baja API Documentation

## Base URL
```
http://localhost:5000/api
```

## Health Check
```
GET /health
```
Returns API server status.

---

## Authentication Endpoints

### 1. Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "username": "admin",
  "password": "admin123"
}

Response (201):
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "user-001",
    "username": "admin",
    "email": "admin@teknikalbaja.com",
    "name": "Administrator",
    "level": "Intermediate",
    "points": 2450,
    "joinDate": "2024-01-15",
    "achievements": ["🎓", "⭐", "🔬", "💯"]
  },
  "token": "token_user-001_1234567890"
}
```

### 2. Register
```
POST /auth/register
Content-Type: application/json

Body:
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}

Response (201):
{
  "success": true,
  "message": "Registrasi berhasil",
  "user": { ... },
  "token": "token_user-xxx_1234567890"
}
```

### 3. Verify Token
```
GET /auth/verify
Authorization: Bearer token_user-001_1234567890

Response (200):
{
  "success": true,
  "message": "Token valid"
}
```

---

## Steel Data Endpoints

### 1. Get All Steel Types
```
GET /steel/types

Response (200):
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": "steel-001",
      "type": "Baja Karbon (Carbon Steel)",
      "icon": "🔴",
      "usage": "Konstruksi, pipa, komponen mesin",
      "characteristics": "Ekonomis, mudah dibentuk, kuat",
      "gradeExamples": ["ASTM A36", "JIS SS400"],
      "tensileStrength": "400-700 MPa",
      "price": "Ekonomis",
      "resistance": "Sedang",
      "details": { ... }
    },
    ...
  ]
}
```

### 2. Get Steel Type by ID
```
GET /steel/types/steel-001

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### 3. Get All Standards
```
GET /steel/standards

Response (200):
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": "std-001",
      "region": "🇺🇸 ASTM (Amerika)",
      "standards": [ ... ]
    },
    ...
  ]
}
```

### 4. Get Standards by Region
```
GET /steel/standards/std-001

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### 5. Search Steel
```
GET /steel/search?query=carbon

Response (200):
{
  "success": true,
  "count": 1,
  "data": [ ... ]
}
```

### 6. Compare Steel Types
```
GET /steel/compare?ids=steel-001,steel-002,steel-003

Response (200):
{
  "success": true,
  "count": 3,
  "data": [ ... ]
}
```

---

## Calculator Endpoints

### 1. Calculate Load Capacity
```
POST /calculator/load-capacity
Content-Type: application/json

Body:
{
  "area": 100,
  "stress": 400
}

Response (200):
{
  "success": true,
  "calculation": {
    "area": 100,
    "stress": 400,
    "capacity": 40000,
    "safetyFactor": 1.5,
    "maxSafeCapacity": 26666.67
  },
  "unit": "N (Newton)",
  "message": "Kapasitas beban maksimal (dengan safety factor 1.5): 26666.67 N"
}
```

### 2. Calculate Weight
```
POST /calculator/weight
Content-Type: application/json

Body:
{
  "length": 2,
  "width": 100,
  "thickness": 10
}

Response (200):
{
  "success": true,
  "calculation": {
    "length": 2,
    "width": 100,
    "thickness": 10,
    "volume_cm3": 2000000,
    "density": 7.85,
    "weight_kg": 15700
  },
  "unit": "kg",
  "message": "Berat material: 15700.00 kg"
}
```

### 3. Unit Conversion
```
POST /calculator/convert
Content-Type: application/json

Body:
{
  "value": 100,
  "from": "MPa",
  "to": "PSI"
}

Supported conversions:
- MPa-to-PSI, PSI-to-MPa
- mm2-to-in2, in2-to-mm2
- kg/m-to-lb/ft, lb/ft-to-kg/m
- C-to-F, F-to-C

Response (200):
{
  "success": true,
  "calculation": {
    "value": 100,
    "from": "MPa",
    "to": "PSI",
    "result": 14503.8
  },
  "message": "100 MPa = 14503.8000 PSI"
}
```

### 4. Stress & Strain Analysis
```
POST /calculator/stress-strain
Content-Type: application/json

Body:
{
  "force": 1000,
  "area": 50,
  "originalLength": 100,
  "newLength": 105
}

Response (200):
{
  "success": true,
  "calculation": {
    "force": 1000,
    "area": 50,
    "originalLength": 100,
    "newLength": 105,
    "stress": 20,
    "strain": 0.05,
    "youngModulus": 400
  },
  "units": {
    "stress": "MPa",
    "strain": "(dimensionless)",
    "youngModulus": "MPa"
  },
  "analysis": {
    "stressLevel": "Rendah",
    "message": "Stress: 20.00 MPa, Strain: 5.00%, Young's Modulus: 400 MPa"
  }
}
```

---

## Profile Endpoints

### 1. Get User Profile
```
GET /profile/user-001

Response (200):
{
  "success": true,
  "data": {
    "id": "user-001",
    "username": "admin",
    "email": "admin@teknikalbaja.com",
    "name": "Administrator",
    "level": "Intermediate",
    "points": 2450,
    "joinDate": "2024-01-15",
    "achievements": ["🎓", "⭐", "🔬", "💯"]
  }
}
```

### 2. Update User Profile
```
PUT /profile/user-001
Content-Type: application/json

Body:
{
  "name": "New Name",
  "email": "newemail@example.com",
  "level": "Advanced"
}

Response (200):
{
  "success": true,
  "message": "Profil berhasil diperbarui",
  "data": { ... }
}
```

### 3. Add Points to User
```
POST /profile/user-001/add-points
Content-Type: application/json

Body:
{
  "points": 100
}

Response (200):
{
  "success": true,
  "message": "100 poin berhasil ditambahkan",
  "data": {
    "userId": "user-001",
    "totalPoints": 2550
  }
}
```

### 4. Add Achievement
```
POST /profile/user-001/add-achievement
Content-Type: application/json

Body:
{
  "achievement": "🏆"
}

Response (200):
{
  "success": true,
  "message": "Achievement berhasil ditambahkan",
  "data": {
    "userId": "user-001",
    "achievements": ["🎓", "⭐", "🔬", "💯", "🏆"]
  }
}
```

### 5. Get Leaderboard (Top 10)
```
GET /profile

Response (200):
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "user-002",
      "name": "Engineer Professional",
      "username": "engineer",
      "points": 5200,
      "level": "Advanced",
      "achievements": 5
    },
    {
      "id": "user-001",
      "name": "Administrator",
      "username": "admin",
      "points": 2450,
      "level": "Intermediate",
      "achievements": 4
    }
  ]
}
```

---

## Default Test Credentials

```
Username: admin
Password: admin123
Email: admin@teknikalbaja.com

Username: engineer
Password: engineer123
Email: engineer@example.com
```

---

## Error Responses

```
400 Bad Request:
{
  "success": false,
  "message": "Deskripsi error"
}

401 Unauthorized:
{
  "success": false,
  "message": "Username atau password salah"
}

404 Not Found:
{
  "success": false,
  "message": "Resource tidak ditemukan"
}

500 Internal Server Error:
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

The API will be available at `http://localhost:5000`
