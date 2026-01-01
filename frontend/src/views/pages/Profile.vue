<template>
    <div class="profile">
      <div class="profile-container">
        <div class="profile-header">
          <div class="avatar">
            <img :src="user.avatar || '/default-avatar.jpg'" :alt="user.name" />
          </div>
          <h1>{{ user.name || 'User Profile' }}</h1>
          <p>{{ user.email }}</p>
        </div>
  
        <div class="profile-tabs">
          <button 
            @click="activeTab = 'info'"
            :class="{ active: activeTab === 'info' }"
            class="tab-btn"
          >
            Personal Info
          </button>
          <button 
            @click="activeTab = 'items'"
            :class="{ active: activeTab === 'items' }"
            class="tab-btn"
          >
            My Items
          </button>
          <button 
            @click="activeTab = 'settings'"
            :class="{ active: activeTab === 'settings' }"
            class="tab-btn"
          >
            Settings
          </button>
        </div>
  
        <div class="profile-content">
          <!-- Personal Info Tab -->
          <div v-show="activeTab === 'info'" class="tab-content">
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  v-model="userForm.name" 
                  required
                />
              </div>
  
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email"
                  v-model="userForm.email" 
                  required
                />
              </div>
  
              <div class="form-group">
                <label for="phone">Phone</label>
                <input 
                  type="tel" 
                  id="phone"
                  v-model="userForm.phone"
                />
              </div>
  
              <div class="form-group">
                <label for="location">Location</label>
                <input 
                  type="text" 
                  id="location"
                  v-model="userForm.location"
                  placeholder="City, Country"
                />
              </div>
  
              <div class="form-group">
                <label for="bio">Bio</label>
                <textarea 
                  id="bio"
                  v-model="userForm.bio" 
                  rows="4"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
  
              <div class="form-actions">
                <button type="submit" :disabled="loading" class="btn btn-primary">
                  {{ loading ? 'Updating...' : 'Update Profile' }}
                </button>
              </div>
            </form>
          </div>
  
          <!-- My Items Tab -->
          <div v-show="activeTab === 'items'" class="tab-content">
            <div class="items-stats">
              <div class="stat-card">
                <h3>{{ userItems.length }}</h3>
                <p>Total Items</p>
              </div>
              <div class="stat-card">
                <h3>{{ availableItems }}</h3>
                <p>Available</p>
              </div>
              <div class="stat-card">
                <h3>{{ soldItems }}</h3>
                <p>Sold</p>
              </div>
            </div>
  
            <div v-if="userItems.length === 0" class="no-items">
              <p>You haven't created any items yet</p>
              <router-link to="/create-item" class="btn btn-primary">
                Create Your First Item
              </router-link>
            </div>
  
            <div v-else class="items-list">
              <div 
                v-for="item in userItems" 
                :key="item.id"
                class="item-row"
                @click="viewItem(item.id)"
              >
                <img :src="item.image || '/placeholder-watch.jpg'" :alt="item.name" />
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.brand }} {{ item.model }}</p>
                  <span class="status" :class="item.status">{{ item.status }}</span>
                </div>
                <div class="item-price">
                  ${{ item.price }}
                </div>
              </div>
            </div>
          </div>
  
          <!-- Settings Tab -->
          <div v-show="activeTab === 'settings'" class="tab-content">
            <div class="settings-section">
              <h3>Account Settings</h3>
              
              <div class="setting-item">
                <label>
                  <input type="checkbox" v-model="settings.emailNotifications" />
                  Receive email notifications
                </label>
              </div>
  
              <div class="setting-item">
                <label>
                  <input type="checkbox" v-model="settings.publicProfile" />
                  Make profile public
                </label>
              </div>
  
              <div class="setting-item">
                <label>
                  <input type="checkbox" v-model="settings.showLocation" />
                  Show location to other users
                </label>
              </div>
  
              <button @click="updateSettings" class="btn btn-primary">
                Save Settings
              </button>
            </div>
  
            <div class="danger-zone">
              <h3>Danger Zone</h3>
              <button @click="deleteAccount" class="btn btn-danger">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { coreService } from '../../services/coreService'
  
  export default {
    name: 'Profile',
    data() {
      return {
        user: {},
        userForm: {},
        userItems: [],
        settings: {
          emailNotifications: true,
          publicProfile: false,
          showLocation: false
        },
        activeTab: 'info',
        loading: false,
        error: null
      }
    },
    computed: {
      availableItems() {
        return this.userItems.filter(item => item.status === 'available').length
      },
      soldItems() {
        return this.userItems.filter(item => item.status === 'sold').length
      }
    },
    created() {
      this.loadProfile()
    },
    methods: {
      async loadProfile() {
        try {
          this.user = await coreService.getUserProfile()
          this.userForm = { ...this.user }
          this.userItems = await coreService.getUserItems()
        } catch (error) {
          this.error = error.message
        }
      },
      async updateProfile() {
        this.loading = true
        try {
          await coreService.updateProfile(this.userForm)
          this.user = { ...this.userForm }
        } catch (error) {
          this.error = error.message
        } finally {
          this.loading = false
        }
      },
      async updateSettings() {
        try {
          await coreService.updateSettings(this.settings)
        } catch (error) {
          this.error = error.message
        }
      },
      viewItem(id) {
        this.$router.push(`/items/${id}`)
      },
      async deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
          try {
            await coreService.deleteAccount()
            this.$router.push('/logout')
          } catch (error) {
            this.error = error.message
          }
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .profile {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .profile-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  
  .profile-header {
    background: linear-gradient(45deg, #f4d03f, #f7dc6f);
    padding: 2rem;
    text-align: center;
    color: #1a1a2e;
  }
  
  .avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid white;
    margin-bottom: 1rem;
  }
  
  .profile-tabs {
    display: flex;
    border-bottom: 1px solid #e9ecef;
  }
  
  .tab-btn {
    flex: 1;
    padding: 1rem;
    border: none;
    background: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .tab-btn.active {
    background: #f4d03f;
    color: #1a1a2e;
  }
  
  .profile-content {
    padding: 2rem;
  }
  
  .profile-form {
    max-width: 500px;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    font-size: 1rem;
    box-sizing: border-box;
  }
  
  .items-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
  }
  
  .stat-card h3 {
    font-size: 2rem;
    color: #f4d03f;
    margin-bottom: 0.5rem;
  }
  
  .items-list {
    space-y: 1rem;
  }
  
  .item-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .item-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .item-row img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .item-info {
    flex: 1;
  }
  
  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .status.available {
    background: #d4edda;
    color: #155724;
  }
  
  .status.sold {
    background: #f8d7da;
    color: #721c24;
  }
  
  .settings-section {
    margin-bottom: 3rem;
  }
  
  .setting-item {
    margin-bottom: 1rem;
  }
  
  .danger-zone {
    border-top: 2px solid #dc3545;
    padding-top: 2rem;
  }
  
  .btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }
  
  .btn-primary {
    background: linear-gradient(45deg, #f4d03f, #f7dc6f);
    color: #1a1a2e;
  }
  
  .btn-danger {
    background: #dc3545;
    color: white;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
  
  @media (max-width: 768px) {
    .profile {
      padding: 1rem;
    }
    
    .items-stats {
      grid-template-columns: 1fr;
    }
  }
  </style>