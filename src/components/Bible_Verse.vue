<template>
    <div class="bible-verse-container">
      <div class="verse-text">
        <p class="quote">"Buscai, pois, em primeiro lugar, o Reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas."</p>
        <p class="reference">Mateus 6:33</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BibleVerse', // Nome do componente
  };
  </script>
  
  <style scoped>
 .bible-verse-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 20px 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(31,38,135,0.15);
  border: 1px solid rgba(255,255,255,0.18);
  margin: 20px auto;
  max-width: 90%; /* Ajuste para garantir que não ultrapasse a tela */
  transition: all 0.4s ease;
  word-wrap: break-word; /* Garante que o texto quebre corretamente */
}

.quote {
  font-size: 1.1rem;
  font-style: italic;
  color: #ffffff;
  line-height: 1.6;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-family: 'Georgia', serif;
  overflow-wrap: break-word; /* Garante que o texto quebre corretamente */
}

.reference {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffd700;
  margin-top: 8px;
  letter-spacing: 0.5px; /* Corrigido: formatação correta da propriedade */
}


@media (max-width: 768px) {
  .bible-verse-container {
    padding: 10px 15px; /* Reduzir o padding em telas menores */
    margin: 10px 5px; /* Reduzir a margem em telas menores */
    min-height: 60px; /* Reduzir a altura mínima */
    max-width: 95%; /* Ajustar o max-width para telas menores */
  }

  .quote {
    font-size: 0.9rem; /* Reduzir o tamanho da fonte em telas menores */
    line-height: 1.4; /* Ajustar o espaçamento entre linhas */
  }

  .reference {
    color: #ffd700;
    font-size: 0.8rem; /* Reduzir o tamanho da fonte da referência */
  }
}
  </style>
  