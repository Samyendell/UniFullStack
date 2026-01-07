<template>
  <div>
    <h2>Create Your Account</h2>
    
    <form @submit.prevent="handleSubmit" class="form-content">
      <div class="form-grid">
        <Input
          v-model="formData.firstName"
          label="First Name"
          placeholder="First name"
          :error="submitted && !formData.firstName ? 'First name is required' : ''"
        />

        <Input
          v-model="formData.lastName"
          label="Last Name"
          placeholder="Last name"
          :error="submitted && !formData.lastName ? 'Last name is required' : ''"
        />
      </div>

      <Input
        v-model="formData.email"
        type="email"
        label="Email"
        placeholder="Choose an email"
        :error="submitted && !formData.email ? 'Email is required' : ''"
      />

      <Input
        v-model="formData.password"
        type="password"
        label="Password"
        placeholder="Create a password"
        :error="submitted && !formData.password ? 'Password is required' : ''"
      />

      <div class="password-hint">
        Password must be at least 8 characters with uppercase and lowercase letters.
      </div>

      <div class="form-submit">
        <Button 
          type="submit" 
          :text="loading ? 'Creating Account...' : 'Create Account'"
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
  name: 'RegisterForm',
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
        firstName: '',
        lastName: '',
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
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

.password-hint {
  color: #6c757d;
  font-size: 14px;
  margin-top: -15px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }
}
</style>