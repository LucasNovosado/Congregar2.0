<template>
  <div class="bible-verse-container">
    <div class="verse-text" v-if="currentVerse">
      <p class="title">{{ currentVerse.título }}</p>
      <p class="quote">"{{ currentVerse.texto }}"</p>
      <p class="reference">{{ currentVerse.livro }} {{ currentVerse.capítulo }}:{{ currentVerse.versículo }}</p>
    </div>
    <div v-else class="loading">
      <p>Carregando versículo...</p>
    </div>
  </div>
</template>

<script>
import versiculos from '@/assets/bible.json'

export default {
  name: 'BibleVerse',
  data() {
    return {
      verses: [],
      currentVerse: null
    }
  },
  created() {
    this.verses = versiculos;
    this.getRandomVerse();
  },
  methods: {
    getRandomVerse() {
      if (this.verses && this.verses.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.verses.length);
        this.currentVerse = this.verses[randomIndex];
      }
    }
  }
}
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
  max-width: 90%;
  transition: all 0.4s ease;
  word-wrap: break-word;
}

.verse-text {
  width: 100%;
  text-align: center;
  animation: fadeIn 0.5s ease-in;
}

.title {
  font-size: 1.2rem;
  color: #ffd700;
  margin-bottom: 12px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.quote {
  font-size: 1.1rem;
  font-style: italic;
  color: #ffffff;
  line-height: 1.6;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-family: 'Georgia', serif;
  overflow-wrap: break-word;
}

.reference {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffd700;
  margin-top: 8px;
  letter-spacing: 0.5px;
}

.loading {
  color: #ffffff;
  font-style: italic;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .bible-verse-container {
    padding: 15px 20px;
    margin: 10px auto; /* Mudado de '10px 5px' para '10px auto' para centralizar */
    min-height: 60px;
    width: 320px; /* Largura fixa */
    max-width: 93%;
  }

  .title {
    font-size: 1rem;
    margin-bottom: 8px;
  }

  .quote {
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .reference {
    font-size: 0.8rem;
  }
}

</style>
