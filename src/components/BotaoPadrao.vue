<template>
    <button :type="type" class="botao-padrao" @click="onClick">
      <slot></slot>
    </button>
  </template>
  
  <script>
  export default {
    name: "BotaoPadrao",
    props: {
      type: {
        type: String,
        default: "button", // Pode ser "button", "submit", etc.
      },
    },
    methods: {
      onClick() {
        this.$emit("click"); // Emite um evento de clique para o componente pai
      },
    },
  };
  </script>
  
  <style scoped>
  .botao-padrao {
    width: 100%;
    padding: 12px;
    background: #073e79;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
    box-sizing: border-box;
  }
  
  .botao-padrao:hover {
    background: #0056b3;
  }
  </style>