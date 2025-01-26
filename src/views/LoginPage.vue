<template>
  <title>Congregar</title>
  <div class="login-container">
    <!-- Banner com logo e título -->
    <div class="banner">
      <h1 class="banner-title">Bem-vindo de Volta</h1>
      <p class="banner-subtitle">Por favor, faça login para continuar</p>
    </div>

    <van-form @submit="onSubmit" class="form-container">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h1 class="app-name">Congregar</h1>
      </div>

      <van-cell-group>
        <van-field
          v-model="username"
          label="Usuário"
          placeholder="Digite seu nome de usuário"
          :rules="[{ required: true, message: 'Campo obrigatório' }]"
          left-icon="user-o"
        />
        <van-field
          v-model="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          :rules="[{ required: true, message: 'Campo obrigatório' }]"
          left-icon="lock"
        />
      </van-cell-group>

      <!-- Botão padrão personalizado com animação de loading -->
      <BotaoPadrao type="submit" class="login-button" :disabled="isLoading">
        <span v-if="!isLoading">Login</span>
        <span v-else>
          <van-loading type="spinner" size="20px" color="#fff" /> Processando...
        </span>
      </BotaoPadrao>

      <p class="register-link">
        Não tem uma conta?
        <a href="#" @click.prevent="goToCadastro" class="register-link-text">Cadastre-se</a>
      </p>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/services/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import BotaoPadrao from '@/components/BotaoPadrao.vue'; // Importando o BotaoPadrao
import { Toast } from 'vant'; // Importando o Toast para exibir mensagens de erro

export default {
  components: {
    BotaoPadrao, // Registrando o componente BotaoPadrao
  },
  setup() {
    const username = ref('');
    const password = ref('');
    const isLoading = ref(false); // Estado para controlar o loading
    const router = useRouter();
    const store = useStore();

    const onSubmit = async () => {
      isLoading.value = true; // Inicia a animação de loading

      try {
        await login(username.value, password.value);
        store.dispatch('updateUsername', username.value);
        router.push({ name: 'Dashboard' });
      } catch (error) {
        Toast.fail('Erro ao fazer login. Verifique suas credenciais.'); // Exibe mensagem de erro
      } finally {
        isLoading.value = false; // Para a animação de loading
      }
    };

    const goToCadastro = () => {
      router.push({ name: 'Cadastro' });
    };

    return {
      username,
      password,
      isLoading,
      onSubmit,
      goToCadastro,
    };
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #032549, #1d6fcc);
  padding: 20px;
}

.banner {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.logo {
  width: 60px; /* Ajuste o tamanho da logo conforme necessário */
  height: auto;
  margin-right: 10px; /* Espaço entre a logo e o texto */
}

.app-name {
  font-size: 2rem;
  color: #032549;
  margin: 0;
}

.banner-title {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 10px;
  font-weight: bold;
}

.banner-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
}

.form-container {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-button {
  margin-top: 20px;
  width: 100%; /* Garante que o botão ocupe a largura total */
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: #666;
}

.register-link-text {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.register-link-text:hover {
  text-decoration: underline;
}

.van-field__left-icon {
  color: #007bff;
}
</style>