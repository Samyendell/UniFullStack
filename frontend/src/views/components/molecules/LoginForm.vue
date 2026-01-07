<template>
  <div>
    <h2>Login to Your Account</h2>
    
    <form @submit.prevent="handleSubmit" class="form-content">
      <Input
        v-model="formData.email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        :error="submitted && !formData.email ? 'Email is required' : ''"
      />

      <Input
        v-model="formData.password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        :error="submitted && !formData.password ? 'Password is required' : ''"
      />

      <div class="form-submit">
        <Button 
          type="submit" 
          :text="loading ? 'Signing In...' : 'Sign In'"
          :disabled="loading"
          class="w-full"
        />
      </div>
      
      <div v-if="error" class="form-error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import Button from '../atoms/Button.vue'
import Input from '../atoms/Input.vue'

export default {
  name: 'LoginForm',
  components: {
    Button,
    Input
  },
  props: {
    loading: Boolean,
    error: String,
    submitted: Boolean
  },
  emits: ['submit'],
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
  h2 {
    color: #2c3e50;
    margin-bottom: 30px;
    font-weight: 600;
    text-align: center;
  }
  
  .form-content {
    display: flex;
    flex-direction: column;
    gap: 25px;
    max-width: 400px;
    width: 100%;
  }
  
  .form-submit {
    margin-top: 14px;
  }
  
  .form-error {
    color: #ff0000;
    padding: 10px;
    border-radius: 8px;
    border: 2px solid #ff0000;
    text-align: center;
    width: 100%;
    max-width: 400px;
  }
  </style>