<!-- <template>
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
 -->

 <template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from './views/components/organisms/Header.vue'
import Footer from './views/components/organisms/Footer.vue'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
.main-content {
  flex: 1;
  min-height: calc(100vh - 200px);
}
</style>
