<template>
    <div class="input-wrapper">
      <label v-if="label" :for="id" class="input-label">{{ label }}</label>
      <input 
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
      <div v-if="error" class="input-error">{{ error }}</div>
      <div v-if="hint" class="input-hint">{{ hint }}</div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Input',
    props: {
      id: String,
      label: String,
      type: {
        type: String,
        default: 'text'
      },
      modelValue: {
        type: [String, Number],
        default: ''
      },
      placeholder: String,
      disabled: {
        type: Boolean,
        default: false
      },
      required: {
        type: Boolean,
        default: false
      },
      error: String,
      hint: String,
      size: {
        type: String,
        default: 'medium'
      }
    },
    emits: ['update:modelValue', 'blur', 'focus'],
    computed: {
      inputClasses() {
        return [
          'input',
          `input-${this.size}`,
          {
            'input-error': !!this.error,
            'input-disabled': this.disabled
          }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .input-wrapper {
    margin-bottom: 1rem;
  }
  
  .input-label {
    display: block;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .input {
    width: 100%;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    font-family: inherit;
  }
  
  .input-small {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
  
  .input-medium {
    padding: 0.75rem;
    font-size: 1rem;
  }
  
  .input-large {
    padding: 1rem;
    font-size: 1.125rem;
  }
  
  .input:focus {
    outline: none;
    border-color: #f4d03f;
  }
  
  .input-error {
    border-color: #d63384;
  }
  
  .input-disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .input-error-text {
    color: #d63384;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .input-hint {
    color: #6c757d;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  </style>