<template>
    <button 
      :type="type"
      :disabled="disabled || loading"
      :class="buttonClasses"
      @click="$emit('click')"
    >
      <span v-if="loading" class="spinner"></span>
      {{ loading ? loadingText : text }}
    </button>
  </template>
  
  <script>
  export default {
    name: 'Button',
    props: {
      text: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'button'
      },
      variant: {
        type: String,
        default: 'primary'
      },
      size: {
        type: String,
        default: 'medium'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      loadingText: {
        type: String,
        default: 'Loading...'
      },
      fullWidth: {
        type: Boolean,
        default: false
      }
    },
    emits: ['click'],
    computed: {
      buttonClasses() {
        return [
          'btn',
          `btn-${this.variant}`,
          `btn-${this.size}`,
          {
            'btn-full-width': this.fullWidth,
            'btn-loading': this.loading
          }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .btn {
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  .btn-medium {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  .btn-large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
  
  .btn-primary {
    background: linear-gradient(45deg, #f4d03f, #f7dc6f);
    color: #1a1a2e;
  }
  
  .btn-secondary {
    background: #6c757d;
    color: white;
  }
  
  .btn-danger {
    background: #dc3545;
    color: white;
  }
  
  .btn-success {
    background: #28a745;
    color: white;
  }
  
  .btn-full-width {
    width: 100%;
  }
  
  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
  
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>