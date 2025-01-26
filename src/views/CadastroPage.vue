<template>
  <div class="cadastro-container">
    <!-- Banner com título -->
    <div class="banner">
      <h1 class="banner-title">Crie sua Conta</h1>
      <p class="banner-subtitle">Por favor, preencha os dados para se cadastrar</p>
    </div>

    <!-- Formulário de cadastro -->
    <van-form @submit="onSubmit" class="form-container">
      <van-cell-group>
        <!-- Campo de username -->
        <van-field
          v-model="username"
          label="Usuário"
          placeholder="Digite seu nome de usuário"
          :rules="[{ required: true, message: 'Campo obrigatório' }]"
          left-icon="user-o"
        />
        <!-- Campo de email -->
        <van-field
          v-model="email"
          label="Email"
          placeholder="Digite seu email"
          :rules="[{ required: true, message: 'Campo obrigatório' }]"
          left-icon="envelop-o"
        />
        <!-- Campo de senha -->
        <van-field
          v-model="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          :rules="[{ required: true, message: 'Campo obrigatório' }]"
          left-icon="lock"
        />
      </van-cell-group>

      <!-- Botão de cadastro personalizado com animação de loading -->
      <BotaoPadrao type="submit" class="cadastro-button" :disabled="isLoading">
        <span v-if="!isLoading">Cadastrar</span>
        <span v-else>
          <van-loading type="spinner" size="20px" color="#fff" /> Processando...
        </span>
      </BotaoPadrao>

      <!-- Link para login -->
      <p class="login-link">
        Já tem uma conta?
        <a href="#" @click.prevent="goToLogin" class="login-link-text">Faça login</a>
      </p>
    </van-form>
  </div>
</template>

<script>
import { cadastrarUsuario } from '@/services/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BotaoPadrao from '@/components/BotaoPadrao.vue'; // Importando o BotaoPadrao
import { Toast } from 'vant'; // Importando o Toast para exibir mensagens de erro

export default {
  components: {
    BotaoPadrao, // Registrando o componente BotaoPadrao
  },
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const isLoading = ref(false); // Estado para controlar o loading
    const router = useRouter();

    const onSubmit = async () => {
      isLoading.value = true; // Inicia a animação de loading

      try {
        await cadastrarUsuario(username.value, email.value, password.value);
        Toast.success('Cadastro realizado com sucesso!'); // Exibe mensagem de sucesso
        router.push({ name: 'Login' });
      } catch (error) {
        Toast.fail('Erro ao cadastrar. Verifique os dados e tente novamente.'); // Exibe mensagem de erro
      } finally {
        isLoading.value = false; // Para a animação de loading
      }
    };

    const goToLogin = () => {
      router.push({ name: 'Login' });
    };

    return {
      username,
      email,
      password,
      isLoading,
      onSubmit,
      goToLogin,
    };
  },
};
</script>

<style scoped>
/* Estilos gerais */
.cadastro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0851a0, #013168);
  padding: 20px;
}

/* Banner */
.banner {
  text-align: center;
  margin-bottom: 40px;
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

/* Formulário */
.form-container {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Botão de cadastro */
.cadastro-button {
  margin-top: 20px;
  width: 100%; /* Garante que o botão ocupe a largura total */
}

/* Link para login */
.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: #666;
}

.login-link-text {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.login-link-text:hover {
  text-decoration: underline;
}

/* Ícones dos campos */
.van-field__left-icon {
  color: #007bff;
}
</style>