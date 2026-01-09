<template>
  <div class="items-page">
    <div class="items-container">
      <h1 class="page-title">{{ user ? `${user.first_name} ${user.last_name}'s Profile` : 'Profile' }}</h1>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading profile...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="user" class="profile-container">
        <!-- Profile Header -->
        <div class="profile-info-section">
          <div class="avatar">
            <div class="avatar-placeholder">
              {{ user.first_name && user.last_name ? user.first_name.charAt(0) + user.last_name.charAt(0) : 'U' }}
            </div>
          </div>
          <div class="user-details">
            <p class="user-id">User ID: {{ user.user_id }}</p>
          </div>
        </div>

        <!-- Profile Tabs using Button component -->
        <div class="filters-section">
          <Button 
            :text="`Selling (${user.selling?.length || 0})`"
            @click="activeTab = 'selling'"
            :class="{ 'tab-active': activeTab === 'selling' }"
            class="tab-button"
          />
          <Button 
            :text="`Bidding On (${user.bidding_on?.length || 0})`"
            @click="activeTab = 'bidding'"
            :class="{ 'tab-active': activeTab === 'bidding' }"
            class="tab-button"
          />
          <Button 
            :text="`Ended Auctions (${user.auctions_ended?.length || 0})`"
            @click="activeTab = 'ended'"
            :class="{ 'tab-active': activeTab === 'ended' }"
            class="tab-button"
          />
        </div>

        <!-- Tab Content -->
        <!-- Selling Tab -->
        <div v-if="activeTab === 'selling'">
          <div v-if="!user.selling || user.selling.length === 0" class="no-items">
            <p>No items currently for sale</p>
          </div>
          
          <div v-else class="items-grid">
            <ItemCard 
              v-for="item in user.selling" 
              :key="item.item_id"
              :item="item"
              @click="viewItem(item.item_id)" 
            />
          </div>
        </div>

        <!-- Bidding On Tab -->
        <div v-if="activeTab === 'bidding'">
          <div v-if="!user.bidding_on || user.bidding_on.length === 0" class="no-items">
            <p>Not currently bidding on any items</p>
          </div>
          
          <div v-else class="items-grid">
            <ItemCard 
              v-for="item in user.bidding_on" 
              :key="item.item_id"
              :item="item"
              @click="viewItem(item.item_id)" 
            />
          </div>
        </div>

        <!-- Ended Auctions Tab -->
        <div v-if="activeTab === 'ended'">
          <div v-if="!user.auctions_ended || user.auctions_ended.length === 0" class="no-items">
            <p>No ended auctions</p>
          </div>
          
          <div v-else class="items-grid">
            <ItemCard 
              v-for="item in user.auctions_ended" 
              :key="item.item_id"
              :item="item"
              @click="viewItem(item.item_id)" 
            />
          </div>
        </div>
      </div>

      <div v-else class="not-found">
        <h1 class="page-title">User Not Found</h1>
        <p>The user you're looking for doesn't exist or has been removed.</p>
        <Button text="Browse Items" @click="$router.push('/items')" />
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from '../../services/userService'
import ItemCard from '../../views/components/molecules/ItemCard.vue'
import Button from '../components/atoms/Button.vue'

export default {
  name: 'Profile',
  components: {
    ItemCard,
    Button
  },
  data() {
    return {
      user: null,
      loading: true,
      error: null,
      activeTab: 'selling'
    }
  },
  computed: {
    userId() {
      return this.$route.params.id || localStorage.getItem('user_id')
    }
  },
  async created() {
    await this.loadProfile()
  },
  methods: {
    async loadProfile() {
      this.loading = true
      this.error = null

      try {
        console.log('Loading profile for user ID:', this.userId)
        this.user = await userService.getUserProfile(this.userId)
        console.log('Loaded user profile:', this.user)
      } catch (error) {
        console.error('Error loading profile:', error)
        this.error = error || 'Failed to load profile'
      } finally {
        this.loading = false
      }
    },

    viewItem(itemId) {
      console.log('Navigating to item ID:', itemId)
      this.$router.push(`/items/${itemId}`)
    }
  }
}
</script>

<style scoped>
/* Use the exact same pattern as ItemsView.vue */
.items-page {
  padding: 2rem 0;
}

.items-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  text-align: center;
  margin-bottom: 3rem;
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 700;
}

.profile-info-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(45deg, #d4af37, #f4d03f);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-id {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
}

.filters-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

/* Style the Button components as tabs */
.tab-button {
  min-width: 180px !important;
  background: white !important;
  color: #6c757d !important;
  border: 1px solid #ced4da !important;
  font-weight: 600 !important;
}

.tab-button:hover {
  border-color: #d4af37 !important;
  color: #2c3e50 !important;
  background: #f8f9fa !important;
}

.tab-button.tab-active {
  background: #d4af37 !important;
  color: white !important;
  border-color: #d4af37 !important;
}

.tab-button:focus {
  outline: none !important;
  border-color: #d4af37 !important;
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2) !important;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d4af37;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-items {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.error {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin: 2rem 0;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .items-container {
    padding: 0 1rem;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .filters-section {
    flex-direction: column;
    align-items: center;
  }

  .tab-button {
    min-width: 250px !important;
  }

  .profile-info-section {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .items-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .tab-button {
    min-width: 100% !important;
  }

  .avatar-placeholder {
    width: 60px;
    height: 60px;
    font-size: 1.2rem;
  }
}
</style>