<template>
  <div>
    <form @submit.prevent="handleSubmit" class="form-content">
      <h2>List Your Watch</h2>
      
      <Input
        v-model="formData.name"
        label="Item Name"
        placeholder="Enter watch name"
        :error="submitted && !formData.name ? 'Item name is required' : ''"
      />

      <div class="form-group">
        <label>Description</label>
        <textarea 
          v-model="formData.description"
          placeholder="Describe your watch"
          class="description-input"
          rows="4"
        ></textarea>
      </div>

      <Input
        v-model="formData.starting_bid"
        type="number"
        label="Starting Bid"
        placeholder="0"
        min="0"
        :error="submitted && !formData.starting_bid ? 'Starting bid is required' : ''"
      />

      <div class="form-group">
        <label>Auction End Date</label>
        <input 
          v-model="formData.end_date"
          type="datetime-local"
          class="form-input"
          :class="{ error: submitted && !formData.end_date }"
        />
        <div v-if="submitted && !formData.end_date" class="error-text">End date is required</div>
      </div>

      <div v-if="error" class="form-error">{{ error }}</div>

      <div class="form-submit">
        <Button 
          type="submit" 
          :text="loading ? 'Creating...' : 'Create Listing'"
          :disabled="loading"
          class="w-full"
        />
      </div>
    </form>
  </div>
</template>

<script>
import Input from '../atoms/Input.vue'
import Button from '../atoms/Button.vue'

export default {
  name: 'CreateItemForm',
  components: {
    Input,
    Button
  },
  props: {
    loading: Boolean,
    error: String
  },
  emits: ['submit'],
  data() {
    return {
      submitted: false,
      formData: {
        name: '',
        description: '',
        starting_bid: '',
        end_date: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      this.submitted = true
      
      if (!(this.formData.name && this.formData.starting_bid && this.formData.end_date)) {
        return
      }

      const endDateTimestamp = new Date(this.formData.end_date).getTime()

      const itemData = {
        name: this.formData.name,
        description: this.formData.description,
        starting_bid: parseFloat(this.formData.starting_bid),
        end_date: endDateTimestamp
      }

      this.$emit('submit', itemData)
    }
  }
}
</script>

<style scoped>
  .description-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #000000;
    border-radius: 14px;
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
  }
  
  .description-input:focus {
    outline: none;
    border-color: #d4af37;
  }
  
  .error-text {
    color: #ff0000;
    font-size: 14px;
    margin-top: 6px;
  }
  
  .form-input.error {
    border-color: #ff0000;
  }
  </style>