<template>
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <Logo />
        </router-link>
        
        <Navigation />
        
        <div class="header-actions">
          <div v-if="isLoggedIn" class="user-menu">
            <router-link to="/profile" class="user-link">Profile</router-link>
            <router-link to="/logout" class="logout-link">Logout</router-link>
          </div>
          <div v-else>
            <router-link to="/login" class="login-link">Login</router-link>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  import Logo from '../atoms/Logo.vue'
  import Navigation from './Navigation.vue'
  
  export default {
    name: 'Header',
    components: {
      Logo,
      Navigation
    },
    computed: {
      isLoggedIn() {
        return !!localStorage.getItem('session_token')
      }
    }
  }
  </script>
  
  <style scoped>
  .header {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .logo-link {
    text-decoration: none;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .user-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .user-link, .logout-link, .login-link {
    text-decoration: none;
    color: #2c3e50;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .user-link:hover, .login-link:hover {
    background: #f4d03f;
    color: #1a1a2e;
  }
  
  .logout-link {
    color: #dc3545;
  }
  
  .logout-link:hover {
    background: #dc3545;
    color: white;
  }
  
  @media (max-width: 768px) {
    .header-content {
      padding: 1rem;
    }
    
    .user-menu {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  </style>