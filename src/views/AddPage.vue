// AddPage.vue
<template>
    <div class="dashboard-container">
      <div class="dashboard-content">
        <h1>Adicionar Novo Culto</h1>
        <FormCult @submit-success="handleSuccess" />
      </div>
    </div>
  </template>

<script>
import FormCult from '@/components/Form_Cult.vue'

export default {
  name: 'AddPage',
  components: { FormCult },
  methods: {
    handleSuccess() {
      this.$router.push('/dashboard');
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a6c 0%, #2a4858 100%);
}

.dashboard-content {
  padding: 30px 20px;
  animation: fadeIn 0.8s ease-out forwards;
}

h1 {
  font-size: 2.8rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 4px 8px rgba(0,0,0,0.2);
  margin: 30px 0;
  position: relative;
  display: inline-block;
}

h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, #ffd700, transparent);
  border-radius: 2px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}
</style>