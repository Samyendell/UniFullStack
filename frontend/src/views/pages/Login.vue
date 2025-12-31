<template>
  <div class="watch-login">
      <div class="login-container">
          <div class="login-header">
              <h1>⌚ TimeKeeper Auctions</h1>
              <p>{{ showSignup ? 'Join the Collection' : 'Welcome Back, Collector' }}</p>
          </div>
          
          <!-- Login Form -->
          <div v-if="!showSignup" class="form-container">
              <h2>Login to Your Account</h2>
              
              <form @submit.prevent="handleLogin">
                  <label for="username">Email: </label>
                  <input type="text" name="email" v-model="email" placeholder="Enter your email"/>
                  <div v-show="submitted && !email" class="validation-error">Email is required</div>

                  <br /><br />

                  <label for="password">Password: </label>
                  <input type="password" name="password" v-model="password" placeholder="Enter your password"/>
                  <div v-show="submitted && !password" class="validation-error">Password is required</div>

                  <br /><br />

                  <button type="submit" :disabled="loading" class="btn btn-primary">
                      {{ loading ? 'Signing In...' : 'Sign In' }}
                  </button>
                  
                  <div v-if="error" class="error">{{ error }}</div>
              </form>
              
              <p class="switch-form">
                  New to TimeKeeper? 
                  <a href="#" @click="showSignup = true">Create Account</a>
              </p>
          </div>
          
          <!-- Signup Form -->
          <div v-else class="form-container">
              <h2>Create Your Account</h2>
              
              <form @submit.prevent="handleSignup">
                  <label for="firstName">First Name: </label>
                  <input type="text" name="firstName" v-model="firstName" placeholder="First name"/>
                  <div v-show="signupSubmitted && !firstName" class="validation-error">First name is required</div>

                  <br /><br />

                  <label for="lastName">Last Name: </label>
                  <input type="text" name="lastName" v-model="lastName" placeholder="Last name"/>
                  <div v-show="signupSubmitted && !lastName" class="validation-error">Last name is required</div>

                  <br /><br />

                  <label for="newEmail">Email: </label>
                  <input type="text" name="newEmail" v-model="newEmail" placeholder="Choose a email"/>
                  <div v-show="signupSubmitted && !newEmail" class="validation-error">Email is required</div>

                  <br /><br />

                  <label for="newPassword">Password: </label>
                  <input type="password" name="newPassword" v-model="newPassword" placeholder="Create a password"/>
                  <div v-show="signupSubmitted && !newPassword" class="validation-error">Password is required</div>

                  <br /><br />

                  <button type="submit" :disabled="loading" class="btn btn-primary">
                      {{ loading ? 'Creating Account...' : 'Create Account' }}
                  </button>
                  
                  <div v-if="error" class="error">{{ error }}</div>
              </form>
              
              <p class="switch-form">
                  Already have an account? 
                  <a href="#" @click="showSignup = false">Sign In</a>
              </p>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
      return {
          // Login form
          email: "",
          password: "",
          submitted: false,
          // Signup form
          firstName: "",
          lastName: "",
          newEmail: "",
          newPassword: "",
          signupSubmitted: false,
          // Shared
          showSignup: false,
          loading: false,
          error: ""
      }
  },
  methods: {
      handleLogin() {
          this.submitted = true;
          this.error = "";
          const { email, password } = this;
          
          // Validation - following your pattern
          if (!(email && password)) {
              return;
          }

          // Additional password validation (optional)
          const password_pattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
          if (!(password_pattern.test(password))) {
              this.error = "Password must be at least 8 characters with uppercase and lowercase letters.";
              return;
          }

          // API call
          this.loading = true;
          
          fetch('http://localhost:3333/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email: email,
                  password: password
              })
          })
          .then(response => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error('Invalid email or password');
              }
          })
          .then(data => {
              localStorage.setItem('session_token', data.token || 'logged-in');
              this.$router.push('/');
          })
          .catch(err => {
              this.error = err.message || 'Login failed. Please try again.';
          })
          .finally(() => {
              this.loading = false;
          });
      },

      handleSignup() {
          this.signupSubmitted = true;
          this.error = "";
          const { firstName, lastName, newEmail, newPassword } = this;
          
          // Validation - following your pattern
          if (!(firstName && lastName && newEmail && newPassword)) {
              return;
          }

          // Password validation
          const password_pattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
          if (!(password_pattern.test(newPassword))) {
              this.error = "Password must be at least 8 characters with uppercase and lowercase letters.";
              return;
          }

          this.loading = true;
          
          fetch('http://localhost:3333/users', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  first_name: firstName,
                  last_name: lastName,
                  email: newEmail,
                  password: newPassword
              })
          })
          .then(response => {
              if (response.ok) {
                  alert('Welcome to TimeKeeper! Please sign in with your new account.');
                  this.showSignup = false;
                  this.resetForms();
              } else {
                  throw new Error('Failed to create account. email might already be used.');
              }
          })
          .catch(err => {
              this.error = err.message || 'Signup failed. Please try again.';
          })
          .finally(() => {
              this.loading = false;
          });
      },

      resetForms() {
          this.email = "";
          this.password = "";
          this.firstName = "";
          this.lastName = "";
          this.newEmail = "";
          this.newPassword = "";
          this.submitted = false;
          this.signupSubmitted = false;
          this.error = "";
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

.form-container {
  padding: 2rem;
}

.form-container h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

label {
  font-weight: 600;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  margin-top: 0.5rem;
}

input:focus {
  outline: none;
  border-color: #f4d03f;
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