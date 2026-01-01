<template>
    <div class="item-card" @click="$emit('click')">
      <div class="item-image">
        <img :src="item.image || '/placeholder-watch.jpg'" :alt="item.name" />
        <div class="item-status" :class="item.status">
          {{ item.status }}
        </div>
      </div>
      
      <div class="item-content">
        <h3 class="item-name">{{ item.name }}</h3>
        <p class="item-brand">{{ item.brand }} {{ item.model }}</p>
        <p class="item-description">{{ truncateDescription(item.description) }}</p>
        
        <div class="item-footer">
          <div class="item-price">
            <span v-if="item.price">${{ item.price }}</span>
            <span v-else>Price on request</span>
          </div>
          <div class="item-year" v-if="item.year">
            {{ item.year }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ItemCard',
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    emits: ['click'],
    methods: {
      truncateDescription(description) {
        if (!description) return 'No description available'
        return description.length > 100 
          ? description.substring(0, 100) + '...' 
          : description
      }
    }
  }
  </script>
  
  <style scoped>
  .item-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .item-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
  
  .item-image {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
  
  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .item-status {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .item-status.available {
    background: #d4edda;
    color: #155724;
  }
  
  .item-status.sold {
    background: #f8d7da;
    color: #721c24;
  }
  
  .item-content {
    padding: 1.5rem;
  }
  
  .item-name {
    font-size: 1.25rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
  
  .item-brand {
    color: #f4d03f;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }
  
  .item-description {
    color: #6c757d;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  
  .item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .item-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2c3e50;
  }
  
  .item-year {
    color: #6c757d;
    font-size: 0.9rem;
  }
  </style>