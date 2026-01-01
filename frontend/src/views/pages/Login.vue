<template>
  <div class="watch-login">
    <div class="login-container">
      <div class="login-header">
        <h1>⌚ TimeKeeper Auctions</h1>
        <p>{{ showSignup ? 'Join the Collection' : 'Welcome Back, Collector' }}</p>
      </div>
      
      <LoginForm 
        v-if="!showSignup"
        :loading="loading"
        :error="error"
        :submitted="submitted"
        @submit="handleLogin"
        @switch-mode="showSignup = true"
      />
      
      <SignupForm 
        v-else
        :loading="loading"
        :error="error"
        :submitted="signupSubmitted"
        @submit="handleSignup"
        @switch-mode="showSignup = false"
      />
    </div>
  </div>
</template>

<script>
import { userService } from '../../services/userService'
import LoginForm from '../components/molecules/LoginForm.vue'
import SignupForm from '../components/molecules/SignupForm.vue'

export default {
  name: 'Login',
  components: {
    LoginForm,
    SignupForm
  },
  data() {
    return {
      showSignup: false,
      loading: false,
      error: '',
      submitted: false,
      signupSubmitted: false
    }
  },
  methods: {
    async handleLogin(formData) {
      this.submitted = true
      this.error = ''
      
      const { email, password } = formData
      
      if (!(email && password)) {
        return
      }

      const password_pattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/
      if (!password_pattern.test(password)) {
        this.error = "Password must be at least 8 characters with uppercase and lowercase letters."
        return
      }

      this.loading = true
      
      try {
        const data = await userService.login(email, password)
        this.$router.push('/')
      } catch (error) {
        this.error = error || 'Login failed. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async handleSignup(formData) {
      this.signupSubmitted = true
      this.error = ''
      
      const { firstName, lastName, email, password } = formData
      
      if (!(firstName && lastName && email && password)) {
        return
      }

      const password_pattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/
      if (!password_pattern.test(password)) {
        this.error = "Password must be at least 8 characters with uppercase and lowercase letters."
        return
      }

      this.loading = true
      
      try {
        await userService.register(firstName, lastName, email, password)
        
        alert('Welcome to TimeKeeper! Please sign in with your new account.')
        this.showSignup = false
        this.resetForms()
      } catch (error) {
        this.error = error || 'Signup failed. Please try again.'
      } finally {
        this.loading = false
      }
    },

    resetForms() {
      this.submitted = false
      this.signupSubmitted = false
      this.error = ''
    }
  }
}
</script>

<style scoped>
.watch-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 2rem;
}

.login-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  overflow: hidden;
  width: 100%;
  max-width: 450px;
}

.login-header {
  background: linear-gradient(45deg, #f4d03f, #f7dc6f);
  padding: 2rem;
  text-align: center;
  color: #1a1a2e;
}

.login-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-header p {
  font-size: 1rem;
  opacity: 0.8;
}
</style>