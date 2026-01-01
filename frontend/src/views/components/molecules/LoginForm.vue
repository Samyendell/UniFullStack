<template>
    <div class="form-container">
      <h2>Login to Your Account</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email"
            v-model="formData.email" 
            placeholder="Enter your email"
            :class="{ 'error': submitted && !formData.email }"
          />
          <div v-show="submitted && !formData.email" class="validation-error">
            Email is required
          </div>
        </div>
  
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password"
            v-model="formData.password" 
            placeholder="Enter your password"
            :class="{ 'error': submitted && !formData.password }"
          />
          <div v-show="submitted && !formData.password" class="validation-error">
            Password is required
          </div>
        </div>
  
        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Signing In...' : 'Sign In' }}
        </button>
        
        <div v-if="error" class="error">{{ error }}</div>
      </form>
      
      <p class="switch-form">
        New to TimeKeeper? 
        <a href="#" @click="$emit('switch-mode')">Create Account</a>
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginForm',
    props: {
      loading: Boolean,
      error: String,
      submitted: Boolean
    },
    emits: ['submit', 'switch-mode'],
    data() {
      return {
        formData: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$emit('submit', this.formData)
      }
    }
  }
  </script>
  
  <style scoped>
  .form-container {
    padding: 2rem;
  }
  
  .form-container h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
  }
  
  input:focus {
    outline: none;
    border-color: #f4d03f;
  }
  
  input.error {
    border-color: #d63384;
  }
  
  .validation-error {
    color: #d63384;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 1rem;
  }
  
  .btn-primary {
    background: linear-gradient(45deg, #f4d03f, #f7dc6f);
    color: #1a1a2e;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(244, 208, 63, 0.3);
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
    text-align: center;
  }
  
  .switch-form {
    text-align: center;
    margin-top: 1.5rem;
    color: #6c757d;
  }
  
  .switch-form a {
    color: #f4d03f;
    text-decoration: none;
    font-weight: 600;
  }
  
  .switch-form a:hover {
    text-decoration: underline;
  }
  </style>