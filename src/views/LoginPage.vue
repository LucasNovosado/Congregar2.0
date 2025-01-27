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
import BotaoPadrao from '@/components/BotaoPadrao.vue';
import { Toast } from 'vant';

export default {
  components: {
    BotaoPadrao,
  },
  setup() {
    const username = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const router = useRouter();
    const store = useStore();

    const onSubmit = async () => {
      isLoading.value = true;

      try {
        await login(username.value, password.value);
        store.dispatch('updateUsername', username.value);
        router.push({ name: 'Dashboard' });
      } catch (error) {
        Toast.fail('Erro ao fazer login. Verifique suas credenciais.');
      } finally {
        isLoading.value = false;
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
  padding: 16px;
  box-sizing: border-box;
}

.banner {
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.logo {
  width: 36px;
  height: auto;
  margin-right: 8px;
}

.app-name {
  font-size: 1.5rem;
  color: #032549;
  margin: 0;
}

.banner-title {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 8px;
  font-weight: bold;
}

.banner-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.form-container {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.login-button {
  margin-top: 24px;
  width: 100%;
  height: 44px;
}

.register-link {
  text-align: center;
  margin-top: 16px;
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

/* Media Queries */
@media (max-width: 480px) {
  .login-container {
    padding: 12px;
  }

  .banner {
    margin-bottom: 16px;
  }

  .banner-title {
    font-size: 1.5rem;
  }

  .banner-subtitle {
    font-size: 0.9rem;
  }

  .form-container {
    padding: 16px;
    border-radius: 8px;
  }

  .logo {
    width: 32px;
  }

  .app-name {
    font-size: 1.3rem;
  }

  .login-button {
    margin-top: 20px;
    height: 40px;
  }

  .register-link {
    font-size: 0.8rem;
  }
}

/* Additional Media Query for very small devices */
@media (max-width: 320px) {
  .login-container {
    padding: 8px;
  }

  .banner-title {
    font-size: 1.3rem;
  }

  .banner-subtitle {
    font-size: 0.8rem;
  }

  .form-container {
    padding: 12px;
  }

  .logo {
    width: 28px;
  }

  .app-name {
    font-size: 1.2rem;
  }

  .register-link {
    font-size: 0.7rem;
  }
}

/* Fix for viewport height on mobile browsers */
@supports (-webkit-touch-callout: none) {
  .login-container {
    min-height: -webkit-fill-available;
  }
}
</style>
