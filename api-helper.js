// API Helper for Teknikal Baja Frontend
// Smart API endpoint detection
let API_BASE;
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Development: Use localhost:5000
    API_BASE = 'http://localhost:5000/api';
} else if (window.location.hostname.includes('vercel.app')) {
    // Production: Use /api (same domain)
    API_BASE = '/api';
} else {
    // Fallback for other environments
    API_BASE = '/api';
}

console.log('🔧 API_HELPER: API_BASE =', API_BASE);

class TeknikalBajaAPI {
    constructor() {
        this.token = localStorage.getItem('authToken') || null;
    }

    // Helper: Show notification
    static showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Generic API call
    async call(endpoint, method = 'GET', body = null) {
        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.token && { 'Authorization': `Bearer ${this.token}` })
                }
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${API_BASE}${endpoint}`, options);
            const data = await response.json();

            if (!response.ok) {
                console.error('API Error:', response.status, data);
                // Return error response with message intact
                return {
                    success: false,
                    message: data.message || 'Error terjadi',
                    statusCode: response.status,
                    ...data
                };
            }

            return data;
        } catch (error) {
            console.error('API Fetch Error:', error);
            return {
                success: false,
                message: 'Network error: ' + error.message
            };
        }
    }

    // ===== Authentication =====
    async login(username, password) {
        const result = await this.call('/auth/login', 'POST', { username, password });
        if (result && result.success) {
            this.token = result.token;
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('currentUser', JSON.stringify(result.user));
            console.log('✅ Login success via api-helper');
        } else {
            console.log('❌ Login failed via api-helper:', result?.message);
        }
        return result;
    }

    async register(username, email, password, name) {
        const result = await this.call('/auth/register', 'POST', { username, email, password, name });
        if (result && result.success) {
            console.log('✅ Register success via api-helper');
        } else {
            console.log('❌ Register failed via api-helper:', result?.message);
        }
        return result;
    }

    async verify() {
        return await this.call('/auth/verify');
    }

    // ===== Steel Data =====
    async getSteelTypes() {
        return await this.call('/steel/types');
    }

    async getSteelById(id) {
        return await this.call(`/steel/types/${id}`);
    }

    async getStandards() {
        return await this.call('/steel/standards');
    }

    async getStandardByRegion(region) {
        return await this.call(`/steel/standards/${region}`);
    }

    async searchSteel(query) {
        return await this.call(`/steel/search?query=${encodeURIComponent(query)}`);
    }

    async compareSteel(ids) {
        return await this.call(`/steel/compare?ids=${ids.join(',')}`);
    }

    // ===== Calculator =====
    async calculateLoadCapacity(area, stress) {
        return await this.call('/calculator/load-capacity', 'POST', { area, stress });
    }

    async calculateWeight(length, width, thickness) {
        return await this.call('/calculator/weight', 'POST', { length, width, thickness });
    }

    async convertUnits(value, from, to) {
        return await this.call('/calculator/convert', 'POST', { value, from, to });
    }

    async analyzeStressStrain(force, area, originalLength, newLength) {
        return await this.call('/calculator/stress-strain', 'POST', { 
            force, area, originalLength, newLength 
        });
    }

    // ===== Profile =====
    async getUserProfile(userId) {
        return await this.call(`/profile/${userId}`);
    }

    async updateProfile(userId, data) {
        return await this.call(`/profile/${userId}`, 'PUT', data);
    }

    async addPoints(userId, points) {
        return await this.call(`/profile/${userId}/add-points`, 'POST', { points });
    }

    async addAchievement(userId, achievement) {
        return await this.call(`/profile/${userId}/add-achievement`, 'POST', { achievement });
    }

    async getLeaderboard() {
        return await this.call('/profile');
    }

    // ===== Utility =====
    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    isAuthenticated() {
        return !!this.token;
    }
}

// Create global instance
const teknikal_baja_api = new TeknikalBajaAPI();
