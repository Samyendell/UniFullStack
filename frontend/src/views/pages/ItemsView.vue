<template>
  <div class="items-page">
    <div class="items-container">
      <h1 class="page-title">Browse Items</h1>
      
      <div class="search-section">
        <SearchBar @search="handleSearch" />
      </div>

      <div class="filters-section">
        <select v-model="selectedFilter" @change="applyFilter">
          <option value="">All Items</option>
          <option value="BID">Items I've Bid On</option>
          <option value="OPEN">My Active Items</option>
          <option value="ARCHIVE">My Closed Items</option>
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

      <div v-else-if="items.length === 0" class="no-items">
        <p>{{ getNoItemsMessage() }}</p>
        <Button v-if="!hasSearchOrFilter" text="Create First Item" @click="createItem" class="w-full" />
      </div>

      <div v-else class="items-grid">
        <ItemCard v-for="item in items" :key="item.id" :item="item" @click="viewItem(item.id)" />
      </div>

      <div v-if="items.length > 0" class="pagination-controls">
        <Button 
          text="Previous"
          @click="previousPage"
          :class="{ 'invisible': currentOffset === 0 }"
          class="pagination-btn"
        />
        <span class="pagination-info">
          Page {{ currentPage }}
        </span>
        <Button 
          text="Next"
          @click="nextPage"
          :class="{ 'invisible': !hasMoreItems }"
          class="pagination-btn"
        />
      </div>

      <div class="items-actions">
        <Button text="Add New Item" @click="createItem" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from '../../services/coreService'
import SearchBar from '../../views/components/molecules/SearchBar.vue'
import ItemCard from '../../views/components/molecules/ItemCard.vue'
import Button from '../../views/components/atoms/Button.vue'

export default {
  name: 'ItemsView',
  components: {
    SearchBar,
    ItemCard,
    Button
  },
  data() {
    return {
      items: [],
      loading: false,
      searchQuery: '',
      selectedFilter: '',
      sortBy: 'newest',
      // Pagination
      limit: 12,
      currentOffset: 0,
      hasMoreItems: false
    }
  },
  computed: {
    currentPage() {
      return Math.floor(this.currentOffset / this.limit) + 1
    },
    hasSearchOrFilter() {
      return this.searchQuery.trim() || this.selectedFilter
    }
  },
  created() {
    this.loadItems()
  },
  methods: {
    async loadItems() {
      this.loading = true

      try {
        const params = {
          limit: this.limit + 1, // Request one extra item to check if there are more
          offset: this.currentOffset
        }

        // Add search query if present
        if (this.searchQuery.trim()) {
          params.q = this.searchQuery.trim()
        }

        // Add status filter if selected
        if (this.selectedFilter) {
          params.status = this.selectedFilter
        }

        const response = await coreService.searchItems(params)
        const allItems = Array.isArray(response) ? response : []

        this.hasMoreItems = allItems.length > this.limit
        this.items = this.hasMoreItems ? allItems.slice(0, this.limit) : allItems

        this.applySorting()

      } catch (error) {
        console.error('Error loading items:', error)
        // On error, just show empty state
        this.items = []
        this.hasMoreItems = false
      } finally {
        this.loading = false
      }
    },

    getNoItemsMessage() {
    if (this.searchQuery.trim()) {
      return `No items found for "${this.searchQuery}"`
    }
    
    if (this.selectedFilter) {
      return `No ${this.getSimpleFilterLabel()} found`
    }
    
    return 'No items available'
  },

  getSimpleFilterLabel() {
    switch (this.selectedFilter) {
      case 'BID': return 'items you\'ve bid on'
      case 'OPEN': return 'active items'
      case 'ARCHIVE': return 'closed items'
      default: return 'items'
    }
  },

    createItem() {
      this.$router.push('/create-item')
    },

    handleSearch(query) {
      this.searchQuery = query
      this.currentOffset = 0 // Reset to first page
      this.loadItems()
    },

    applyFilter() {
      this.currentOffset = 0 // Reset to first page
      this.loadItems()
    },

    applySorting() {
      const items = [...this.items]

      switch (this.sortBy) {
        case 'newest':
          items.sort((a, b) => {
            const aTime = a.end_date || a.created_at || 0
            const bTime = b.end_date || b.created_at || 0
            return bTime - aTime
          })
          break
        case 'oldest':
          items.sort((a, b) => {
            const aTime = a.end_date || a.created_at || 0
            const bTime = b.end_date || b.created_at || 0
            return aTime - bTime
          })
          break
        case 'price-low':
          items.sort((a, b) => (a.starting_bid || 0) - (b.starting_bid || 0))
          break
        case 'price-high':
          items.sort((a, b) => (b.starting_bid || 0) - (a.starting_bid || 0))
          break
      }

      this.items = items
    },

    nextPage() {
      this.currentOffset += this.limit
      this.loadItems()
    },

    previousPage() {
      this.currentOffset = Math.max(0, this.currentOffset - this.limit)
      this.loadItems()
    },

    viewItem(id) {
      this.$router.push(`/items/${id}`)
    }
  }
}
</script>

<style scoped>
.search-section {
  max-width: 500px;
  margin: 0 auto 2rem;
}

.items-actions {
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
}
</style>