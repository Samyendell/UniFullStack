<template>
    <div class="logout">
      <div class="logout-container">
        <div class="logout-content">
          <h1>Logging Out...</h1>
          <div class="spinner"></div>
          <p>Please wait while we securely log you out</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { coreService } from '../../services/coreService'
  
  export default {
    name: 'Logout',
    created() {
      this.performLogout()
    },
    methods: {
      async performLogout() {
        try {
          await coreService.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          // Clear local storage
          localStorage.removeItem('session_token')
          localStorage.removeItem('user_data')
          
          // Redirect to login page
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .logout {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .logout-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    padding: 3rem;
    text-align: center;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #f4d03f;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 2rem auto;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }
  
  p {
    color: #6c757d;
  }
  </style>