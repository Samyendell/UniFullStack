<template>
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <Logo size="small" />
          <p class="footer-description">
            Your premier destination for luxury watch auctions and collections.
          </p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/items">Browse Items</router-link></li>
            <li><router-link to="/create-item" v-if="isLoggedIn">Add Item</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Account</h4>
          <ul class="footer-links">
            <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/profile">Profile</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/logout">Logout</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Contact</h4>
          <p>Email: support@timekeeper.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 TimeKeeper Auctions. All rights reserved.</p>
      </div>
    </footer>
  </template>
  
  <script>
  import Logo from '../atoms/Logo.vue'
  
  export default {
    name: 'Footer',
    components: {
      Logo
    },
    computed: {
      isLoggedIn() {
        return !!localStorage.getItem('session_token')
      }
    }
  }
  </script>
  
  <style scoped>
  .footer {
    background: #2c3e50;
    color: white;
    margin-top: auto;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .footer-section h4 {
    color: #f4d03f;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
  
  .footer-description {
    color: #bdc3c7;
    line-height: 1.6;
    margin-top: 1rem;
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
  }
  
  .footer-links li {
    margin-bottom: 0.5rem;
  }
  
  .footer-links a {
    color: #bdc3c7;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-links a:hover {
    color: #f4d03f;
  }
  
  .footer-bottom {
    border-top: 1px solid #34495e;
    text-align: center;
    padding: 1.5rem 2rem;
    color: #95a5a6;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      padding: 2rem 1rem 1rem;
    }
  }
  </style>