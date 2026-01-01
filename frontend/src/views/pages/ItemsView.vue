<template>
    <div class="items-view">
      <div class="items-header">
        <h1>Browse Items</h1>
        <div class="search-section">
          <SearchBar @search="handleSearch" />
        </div>
      </div>
  
      <div class="items-filters">
        <select v-model="selectedFilter" @change="applyFilter">
          <option value="all">All Items</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
        
        <select v-model="sortBy" @change="applySorting">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
  
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading items...</p>
      </div>
  
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="loadItems" class="btn btn-retry">Try Again</button>
      </div>
  
      <div v-else-if="filteredItems.length === 0" class="no-items">
        <p>No items found</p>
        <router-link to="/create-item" class="btn btn-primary">
          Create First Item
        </router-link>
      </div>
  
      <div v-else class="items-grid">
        <ItemCard 
          v-for="item in filteredItems" 
          :key="item.id" 
          :item="item"
          @click="viewItem(item.id)"
        />
      </div>
  
      <div class="items-actions">
        <router-link to="/create-item" class="btn btn-primary">
          Add New Item
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { coreService } from '../../services/coreService'
  import SearchBar from '../../views/components/molecules/SearchBar.vue'
  import ItemCard from '../../views/components/molecules/ItemCard.vue'
  
  export default {
    name: 'ItemsView',
    components: {
      SearchBar,
      ItemCard
    },
    data() {
      return {
        items: [],
        filteredItems: [],
        loading: false,
        error: null,
        searchQuery: '',
        selectedFilter: 'all',
        sortBy: 'newest'
      }
    },
    created() {
      this.loadItems()
    },
    methods: {
      async loadItems() {
        this.loading = true
        this.error = null
  
        try {
          this.items = await coreService.getAllItems()
          this.filteredItems = [...this.items]
          this.applyFilter()
        } catch (error) {
          this.error = error.message || 'Failed to load items'
        } finally {
          this.loading = false
        }
      },
      handleSearch(query) {
        this.searchQuery = query
        this.filterItems()
      },
      applyFilter() {
        this.filterItems()
      },
      applySorting() {
        this.sortItems()
      },
      filterItems() {
        let filtered = [...this.items]
  
        // Apply search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase()
          filtered = filtered.filter(item => 
            item.name?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.brand?.toLowerCase().includes(query) ||
            item.model?.toLowerCase().includes(query)
          )
        }
  
        // Apply status filter
        if (this.selectedFilter !== 'all') {
          filtered = filtered.filter(item => item.status === this.selectedFilter)
        }
  
        this.filteredItems = filtered
        this.sortItems()
      },
      sortItems() {
        const items = [...this.filteredItems]
        
        switch (this.sortBy) {
          case 'newest':
            items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            break
          case 'oldest':
            items.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            break
          case 'price-low':
            items.sort((a, b) => (a.price || 0) - (b.price || 0))
            break
          case 'price-high':
            items.sort((a, b) => (b.price || 0) - (a.price || 0))
            break
        }
  
        this.filteredItems = items
      },
      viewItem(id) {
        this.$router.push(`/items/${id}`)
      }
    }
  }
  </script>
  
  <style scoped>
  .items-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .items-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .items-header h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }
  
  .search-section {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .items-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;
  }
  
  .items-filters select {
    padding: 0.5rem 1rem;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  .loading {
    text-align: center;
    padding: 4rem 2rem;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #f4d03f;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error {
    text-align: center;
    padding: 2rem;
    color: #d63384;
  }
  
  .no-items {
    text-align: center;
    padding: 4rem 2rem;
  }
  
  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .items-actions {
    text-align: center;
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
  
  .btn-retry {
    background: #17a2b8;
    color: white;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
  
  @media (max-width: 768px) {
    .items-view {
      padding: 1rem;
    }
    
    .items-filters {
      flex-direction: column;
      align-items: center;
    }
    
    .items-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>