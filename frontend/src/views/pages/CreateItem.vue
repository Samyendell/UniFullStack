<template>
  <div class="account-page">
    <div class="account-card create-card">
      <div class="account-header">
        <h1 class="brand-logo">TickTokTwo</h1>
        <p>List your watch for sale</p>
      </div>

      <div class="account-content">
        <CreateItemForm 
          :loading="loading"
          :error="error"
          @submit="handleCreateItem"
          @cancel="goBack"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from '../../services/coreService'
import CreateItemForm from '../components/molecules/CreateItemForm.vue'

export default {
  name: 'CreateItem',
  components: {
    CreateItemForm
  },
  data() {
    return {
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleCreateItem(formData) {
      this.error = ''
      this.loading = true

      try {
        await coreService.createItem(formData)
        this.$router.push('/items')
      } catch (error) {
        this.error = error.message || 'Failed to create item. Please try again.'
      } finally {
        this.loading = false
      }
    },
    goBack() {
      this.$router.push('/items')
    }
  }
}
</script>

<style scoped>
.create-card {
  max-width: 600px;
}
</style>