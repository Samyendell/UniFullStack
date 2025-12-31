<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/Additem">Add item</router-link>
      <router-link to="/search">Search</router-link>
    </nav>
    <router-view />

    <Login />
    <Search />
    <SingleItem />
  </div>
</template>

<script>
import SingleItem from './SingleItem.vue';



</script>

<style scoped>

</style>

