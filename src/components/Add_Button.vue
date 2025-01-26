<template>
    <button 
      @click="navigateToAdd" 
      class="add-button"
      :class="{ 'button-pulse': isPulsing }"
    >
      <van-icon name="plus" size="24" />
      <span class="button-text">Adicionar Culto</span>
    </button>
  </template>
  
  <script>
  import { Icon as VanIcon } from 'vant';
  
  export default {
    name: 'AddButton',
    components: {
      VanIcon
    },
    data() {
      return {
        isPulsing: false
      }
    },
    mounted() {
      setInterval(() => {
        this.isPulsing = true;
        setTimeout(() => {
          this.isPulsing = false;
        }, 1000);
      }, 3000);
    },
    methods: {
      navigateToAdd() {
        this.$router.push('/cults/add');
      }
    }
  }
  </script>
  
  <style scoped>
  .add-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 16px 24px;
    border-radius: 50px;
    background: linear-gradient(135deg, #1d6fcc 0%, #032549 100%);
    border: none;
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(29, 111, 204, 0.4);
    transition: all 0.3s ease;
    z-index: 1000;
  }
  
  .add-button::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #00ff9d, #1d6fcc, #032549);
    border-radius: 50px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .add-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(29, 111, 204, 0.6);
  }
  
  .add-button:hover::before {
    opacity: 1;
  }
  
  .button-text {
    font-weight: 600;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 4px 15px rgba(29, 111, 204, 0.4);
    }
    50% {
      box-shadow: 0 4px 25px rgba(11, 209, 193, 0.6);
    }
    100% {
      box-shadow: 0 4px 15px rgba(29, 111, 204, 0.4);
    }
  }
  
  
  @media (max-width: 768px) {
    .add-button {
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
    }
    
    .button-text {
      font-size: 0.9rem;
    }
  }
  </style>