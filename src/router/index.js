<template>
  <header class="header-container">
    <div class="welcome-message">
      Bem-vindo, <span class="username">{{ username }}</span>
    </div>
    <button class="logout-button" @click="handleLogout" :disabled="isLoading">
      {{ isLoading ? 'Saindo...' : 'Sair' }}
    </button>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import { logout } from '@/services/auth';
import { ref } from 'vue';

export default {
  name: 'TopHeader',
  setup() {
    const isLoading = ref(false);
    return { isLoading };
  },
  computed: {
    ...mapGetters(['getUsername']),
    username() {
      return this.getUsername || 'Usuário';
    }
  },
  methods: {
    async handleLogout() {
      try {
        this.isLoading = true;
        await logout(); // Usa a função de logout do serviço de autenticação
        this.$router.push({ name: 'Login' });
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
  
<style scoped>
.header-container {
 display: flex;
 justify-content: space-between;
 align-items: center;
 padding: 15px 30px;
 background: linear-gradient(135deg, rgba(3,37,73,0.95), rgba(29,111,204,0.95));
 backdrop-filter: blur(10px);
 box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.welcome-message {
 font-size: 1.3rem;
 font-weight: 600;
 color: #ffffff;
 text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.username {
 color: #ffd700;
 font-weight: 700;
}

.logout-button {
 background: rgba(255,255,255,0.1);
 color: white;
 border: 1px solid rgba(255,255,255,0.2);
 padding: 10px 20px;
 border-radius: 8px;
 cursor: pointer;
 font-size: 0.9rem;
 font-weight: 500;
 transition: all 0.3s ease;
 backdrop-filter: blur(5px);
}

.logout-button:not(:disabled):hover {
 background: rgba(255,255,255,0.2);
 transform: translateY(-2px);
 box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.logout-button:disabled {
 opacity: 0.7;
 cursor: not-allowed;
 transform: none;
}

@media (max-width: 768px) {
 .header-container {
   padding: 12px 20px;
 }
 
 .welcome-message {
   font-size: 1.1rem;
 }
}
</style>
