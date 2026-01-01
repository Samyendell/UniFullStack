<template>
    <div class="create-item">
      <div class="create-container">
        <div class="create-header">
          <h1>Create New Item</h1>
          <p>Add a new watch to your collection</p>
        </div>
  
        <form @submit.prevent="createItem" class="item-form">
          <div class="form-group">
            <label for="name">Item Name *</label>
            <input 
              type="text" 
              id="name"
              v-model="form.name" 
              required 
              placeholder="Enter item name"
            />
          </div>
  
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              v-model="form.description" 
              rows="4"
              placeholder="Enter item description"
            ></textarea>
          </div>
  
          <div class="form-row">
            <div class="form-group">
              <label for="brand">Brand</label>
              <input 
                type="text" 
                id="brand"
                v-model="form.brand" 
                placeholder="e.g. Rolex, Omega"
              />
            </div>
  
            <div class="form-group">
              <label for="model">Model</label>
              <input 
                type="text" 
                id="model"
                v-model="form.model" 
                placeholder="Model name"
              />
            </div>
          </div>
  
          <div class="form-row">
            <div class="form-group">
              <label for="year">Year</label>
              <input 
                type="number" 
                id="year"
                v-model="form.year" 
                min="1900"
                max="2024"
              />
            </div>
  
            <div class="form-group">
              <label for="condition">Condition</label>
              <select id="condition" v-model="form.condition">
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>
  
          <div class="form-group">
            <label for="price">Price ($)</label>
            <input 
              type="number" 
              id="price"
              v-model="form.price" 
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
  
          <div class="form-group">
            <label for="image">Image URL</label>
            <input 
              type="url" 
              id="image"
              v-model="form.image" 
              placeholder="https://example.com/image.jpg"
            />
          </div>
  
          <div v-if="error" class="error">
            {{ error }}
          </div>
  
          <div class="form-actions">
            <button type="button" @click="goBack" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="btn btn-primary">
              {{ loading ? 'Creating...' : 'Create Item' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { coreService } from '../../services/coreService'
  
  export default {
    name: 'CreateItem',
    data() {
      return {
        form: {
          name: '',
          description: '',
          brand: '',
          model: '',
          year: '',
          condition: '',
          price: '',
          image: ''
        },
        loading: false,
        error: null
      }
    },
    methods: {
      async createItem() {
        this.loading = true
        this.error = null
  
        try {
          await coreService.createItem(this.form)
          this.$router.push('/items')
        } catch (error) {
          this.error = error.message || 'Failed to create item'
        } finally {
          this.loading = false
        }
      },
      goBack() {
        this.$router.push('/items')
      }
    }
  }
  </script>
  
  <style scoped>
  .create-item {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .create-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    width: 100%;
    max-width: 600px;
  }
  
  .create-header {
    background: linear-gradient(45deg, #f4d03f, #f7dc6f);
    padding: 2rem;
    text-align: center;
    color: #1a1a2e;
    border-radius: 16px 16px 0 0;
  }
  
  .create-header h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .item-form {
    padding: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  label {
    display: block;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
  }
  
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #f4d03f;
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }
  
  .btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-primary {
    background: linear-gradient(45deg, #f4d03f, #f7dc6f);
    color: #1a1a2e;
  }
  
  .btn-secondary {
    background: #6c757d;
    color: white;
  }
  
  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
  
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .error {
    background: #ffe6e6;
    color: #d63384;
    padding: 0.75rem;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .form-actions {
      flex-direction: column;
    }
  }
  </style>