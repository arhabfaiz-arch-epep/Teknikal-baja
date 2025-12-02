# TODO: Add API Backend to Teknikal Baja Project

## Phase 1: Backend Setup ✅
- [x] Update package.json with backend dependencies (express, cors, etc.)
- [x] Create server.js with Express server setup
- [x] Create data/ folder with JSON data files
- [x] Create models/ folder for data handling

## Phase 2: API Endpoints ✅
- [x] Create routes/auth.js for authentication (login/register)
  - [x] POST /auth/login
  - [x] POST /auth/register
  - [x] GET /auth/verify
- [x] Create routes/steel.js for steel data (types, specs, standards)
  - [x] GET /steel/types (all steel types)
  - [x] GET /steel/types/:id (specific steel)
  - [x] GET /steel/standards (all standards)
  - [x] GET /steel/standards/:region (region specific)
  - [x] GET /steel/search (search functionality)
  - [x] GET /steel/compare (compare steels)
- [x] Create routes/calculator.js for calculation tools
  - [x] POST /calculator/load-capacity
  - [x] POST /calculator/weight
  - [x] POST /calculator/convert
  - [x] POST /calculator/stress-strain
- [x] Create routes/profile.js for user profiles
  - [x] GET /profile/:userId (get profile)
  - [x] PUT /profile/:userId (update profile)
  - [x] POST /profile/:userId/add-points (add points)
  - [x] POST /profile/:userId/add-achievement (add achievement)
  - [x] GET /profile (leaderboard)

## Phase 3: Data Files ✅
- [x] Create data/users.json with test users
- [x] Create data/steels.json with steel types data
- [x] Create data/standards.json with international standards

## Phase 4: Documentation ✅
- [x] Create API_DOCUMENTATION.md with all endpoints
- [x] Add test credentials
- [x] Add error response examples

## Phase 5: Frontend Integration (TODO)
- [ ] Update anime.js to make API calls for login
- [ ] Update dashboard to fetch dynamic steel data from API
- [ ] Update calculator tools to use API calculations
- [ ] Add API response handling and error notifications
- [ ] Cache frequently accessed data

## Phase 6: Testing & Polish (TODO)
- [ ] Test all API endpoints with Postman/Insomnia
- [ ] Test frontend-backend integration
- [ ] Add input validation
- [ ] Add rate limiting for security
- [ ] Add logging system
- [ ] Optimize performance
- [ ] Add database (MongoDB/PostgreSQL) for persistent storage

## How to Run
```bash
npm install
npm run dev  # Development with nodemon
npm start    # Production
```

API will be running at: http://localhost:5000
See API_DOCUMENTATION.md for all endpoints
