<template>
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery"
        @input="handleInput"
        placeholder="Search items by name, brand, model..."
        class="search-input"
      />
      <button @click="performSearch" class="search-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchBar',
    data() {
      return {
        searchQuery: ''
      }
    },
    methods: {
      handleInput() {
        // Debounce search
        clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() => {
          this.performSearch()
        }, 300)
      },
      performSearch() {
        this.$emit('search', this.searchQuery.trim())
      }
    },
    beforeUnmount() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
    }
  }
  </script>
  
  <style scoped>
  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 3rem 0.75rem 1rem;
    border: 2px solid #e1e8ed;
    border-radius: 25px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #f4d03f;
  }
  
  .search-btn {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    color: #6c757d;
    padding: 0.5rem;
    border-radius: 50%;
    transition: color 0.3s ease;
  }
  
  .search-btn:hover {
    color: #f4d03f;
  }
  </style>