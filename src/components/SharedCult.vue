<template>
    <button class="share-btn" @click="captureAndShare">
      <van-icon name="share" /> Compartilhar
    </button>
  </template>
  
  <script>
  import html2canvas from 'html2canvas';
  import { Icon as VanIcon, Toast } from 'vant';
  import 'vant/es/toast/style';
  
  export default {
    name: 'SharedCult',
    components: { VanIcon },
    props: {
      cultId: {
        type: String,
        required: true,
      },
    },
    methods: {
      async captureAndShare() {
  try {
    // Captura o card do culto
    const cardElement = document.querySelector(`.cult-card[data-cult-id="${this.cultId}"]`);
    if (!cardElement) {
      throw new Error('Card do culto não encontrado.');
    }

    // Clona o card para evitar problemas com estilos dinâmicos
    const clonedCard = cardElement.cloneNode(true);
    clonedCard.style.position = 'fixed';
    clonedCard.style.top = '-9999px'; // Move o clone para fora da tela
    clonedCard.style.width = `${cardElement.offsetWidth}px`; // Mantém a largura original
    clonedCard.style.height = `${cardElement.offsetHeight}px`; // Mantém a altura original
    
    // Aplica estilos explícitos para garantir o fundo
    clonedCard.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    clonedCard.style.background = 'rgba(255, 255, 255, 0.1)';
    clonedCard.style.backdropFilter = 'blur(10px)';
    
    document.body.appendChild(clonedCard);

    // Usa o html2canvas para criar uma imagem do card clonado
    const canvas = await html2canvas(clonedCard, {
      useCORS: true,
      scale: 2,
      logging: true,
      backgroundColor: null, // Garante que o fundo seja transparente
      allowTaint: true,
      foreignObjectRendering: true,
    });

    // Remove o clone do DOM
    document.body.removeChild(clonedCard);

    // Converte o canvas para uma imagem (base64)
    const image = canvas.toDataURL('image/png');

    // Compartilha a imagem
    if (navigator.share) {
      // Converte a imagem base64 para um Blob
      const blob = await fetch(image).then((res) => res.blob());

      // Compartilha o arquivo
      await navigator.share({
        files: [new File([blob], `culto_${this.cultId}.png`, { type: 'image/png' })],
        title: 'Compartilhar Culto',
        text: 'Confira este culto!',
      });
    } else {
      // Fallback para navegadores que não suportam navigator.share
      const link = document.createElement('a');
      link.href = image;
      link.download = `culto_${this.cultId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Toast.success('Imagem salva com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
    Toast.fail('Erro ao compartilhar culto');
  }
}
    },
  };
  </script>
  
  <style scoped>
  .share-btn {
    flex: 1;
    padding: 8px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: all 0.3s ease;
    font-weight: 500;
    background: #2196f3;
    color: white;
  }
  
  .share-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  </style>