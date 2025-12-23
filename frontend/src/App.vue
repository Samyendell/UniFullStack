<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
    </nav>
    <router-view />
    
    <h1>{{ welcome_message }}</h1>
    <p>counter: {{ counter }}</p>
    <button v-on:click="increment">Add one</button>
    
    <p v-if="counter >= 5">Big number</p>
    <p v-else>Little number</p>

    <Login />

  </div>
</template>

<script>
  import Login from "./Login.vue"
  
  export default {
    data(){
      return {
        welcome_message: "Hello World!"
      }
    },
    methods: {
      increment(){
        this.counter ++;
      }
    },
    components: {
      Login
    }
  }
</script>

<style scoped>

</style>