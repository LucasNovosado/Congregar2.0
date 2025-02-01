<template>
  <div class="form-wrapper">
    <form @submit.prevent="handleSubmit" class="cult-form">
      <div class="form-grid">
        <div class="input-group">
          <label for="amount">Culto N°</label>
          <input 
            id="amount"
            type="number" 
            v-model="formData.amount"
            required
            :placeholder="nextCultNumber"
            class="input-field"
          >
        </div>

        <div class="input-group">
          <label for="typeCult">Tipo de Serviço</label>
          <select 
            id="typeCult"
            v-model="formData.typeCult" 
            required
            class="select-field"
          >
            <option value="">Selecione o tipo de serviço</option>
            <option v-for="type in cultTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label for="date">Data</label>
          <input 
            id="date"
            type="date" 
            v-model="formData.date"
            required
            class="input-field"
          >
        </div>

        <div class="input-group">
          <label for="location">Localização</label>
          <div class="autocomplete-wrapper">
            <input 
              id="location"
              type="text" 
              v-model="formData.location"
              required
              class="input-field"
              placeholder="Ex: Vila Nova I"
              @input="handleLocationInput"
              @blur="handleBlur('location')"
              @focus="handleFocus('location')"
              autocomplete="off"
            >
            <div v-if="showSuggestions.location && suggestions.location.length > 0" class="suggestions-list">
              <div 
                v-for="suggestion in suggestions.location" 
                :key="suggestion"
                class="suggestion-item"
                @mousedown.prevent="selectSuggestion('location', suggestion)"
              >
                {{ suggestion }}
              </div>
            </div>
          </div>
        </div>

        <div class="input-group">
          <label for="service">Atendimento</label>
          <div class="autocomplete-wrapper">
            <input 
              id="service"
              type="text" 
              v-model="formData.service"
              required
              class="input-field"
              placeholder="Ex: Ir. Nivaldo"
              @input="handleServiceInput"
              @blur="handleBlur('service')"
              @focus="handleFocus('service')"
              autocomplete="off"
            >
            <div v-if="showSuggestions.service && suggestions.service.length > 0" class="suggestions-list">
              <div 
                v-for="suggestion in suggestions.service" 
                :key="suggestion"
                class="suggestion-item"
                @mousedown.prevent="selectSuggestion('service', suggestion)"
              >
                {{ suggestion }}
              </div>
            </div>
          </div>
        </div>

        <div class="input-group">
          <label for="hollyWord">Palavra Sagrada</label>
          <input 
            id="hollyWord"
            type="text" 
            v-model="formData.hollyWord"
            required
            class="input-field"
            placeholder="Ex: Salmos 23;1-6"
          >
        </div>

        <div class="input-group">
          <label for="preaching">Palavra revelada ao</label>
          <div class="autocomplete-wrapper">
            <input 
              id="preaching"
              type="text" 
              v-model="formData.preaching"
              required
              class="input-field"
              placeholder="Ex: Ir. Joelson"
              @input="handlePreachingInput"
              @blur="handleBlur('preaching')"
              @focus="handleFocus('preaching')"
              autocomplete="off"
            >
            <div v-if="showSuggestions.preaching && suggestions.preaching.length > 0" class="suggestions-list">
              <div 
                v-for="suggestion in suggestions.preaching" 
                :key="suggestion"
                class="suggestion-item"
                @mousedown.prevent="selectSuggestion('preaching', suggestion)"
              >
                {{ suggestion }}
              </div>
            </div>
          </div>
        </div>

        <div class="input-group full-width">
          <label for="exhortation">Exortação</label>
          <textarea 
            id="exhortation"
            v-model="formData.exhortation"
            required
            rows="4"
            class="textarea-field"
            placeholder="Anote os momentos marcantes do culto: versículos, revelações, profecias e experiências com a presença de Deus. Use essas anotações como memórias e fonte de edificação futura."
          ></textarea>
        </div>
      </div>

      <button type="submit" class="submit-button">
        {{ isEditing ? 'Atualizar' : 'Adicionar' }} Culto
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Toast } from 'vant';
import 'vant/es/toast/style';

export default {
  name: 'FormCult',
  props: {
    editData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formData: {
        amount: '',
        typeCult: '',
        date: '',
        location: '',
        service: '',
        hollyWord: '',
        preaching: '',
        exhortation: ''
      },
      suggestions: {
        location: [],
        service: [],
        preaching: []
      },
      showSuggestions: {
        location: false,
        service: false,
        preaching: false
      },
      cultTypes: [
        'Culto Oficial',
        'Culto Online',
        'Reunião de Jovens e Menores',
        'Reunião da Mocidade',
        'Batismo',
        'Reunião Ministerial',
        'Reunião Administrativa',
        'Ensaio Regional'
      ]
    }
  },
  computed: {
    ...mapGetters(['getCults']),
    isEditing() {
      return !!this.editData;
    },
    nextCultNumber() {
      if (this.getCults.length === 0) return 1;
      const maxAmount = Math.max(...this.getCults.map(cult => cult.amount));
      return maxAmount + 1;
    }
  },
  watch: {
    editData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = { ...newVal };
        } else {
          this.formData.amount = this.nextCultNumber;
        }
      }
    }
  },
  methods: {
    handleFieldInput(field) {
      const value = this.formData[field];
      if (value.length >= 3) {
        this.suggestions[field] = this.getCults
          .map(cult => cult[field])
          .filter((item, index, self) => 
            item && 
            item.toLowerCase().includes(value.toLowerCase()) && 
            self.indexOf(item) === index
          )
          .slice(0, 5);
      } else {
        this.suggestions[field] = [];
      }
    },

    handleFocus(field) {
      if (this.formData[field].length >= 3) {
        this.handleFieldInput(field);
        this.showSuggestions[field] = true;
      }
    },

    handleBlur(field) {
      setTimeout(() => {
        this.showSuggestions[field] = false;
      }, 150);
    },

    handleLocationInput() {
      this.handleFieldInput('location');
      this.showSuggestions.location = true;
    },

    handleServiceInput() {
      this.handleFieldInput('service');
      this.showSuggestions.service = true;
    },

    handlePreachingInput() {
      this.handleFieldInput('preaching');
      this.showSuggestions.preaching = true;
    },

    selectSuggestion(field, value) {
      this.formData[field] = value;
      this.suggestions[field] = [];
      this.showSuggestions[field] = false;
    },

    async handleSubmit() {
      try {
        if (!this.validateForm()) {
          Toast.fail('Por favor, preencha todos os campos obrigatórios.');
          return;
        }

        const loading = Toast.loading({
          message: 'Salvando...',
          forbidClick: true,
        });

        const processedData = {
          ...this.formData,
          amount: parseInt(this.formData.amount),
          date: new Date(this.formData.date).toISOString()
        };
        
        if (this.isEditing) {
          await this.$store.dispatch('updateCult', {
            cultId: this.editData.id,
            cultData: processedData
          });
          Toast.success('Culto atualizado com sucesso!');
        } else {
          await this.$store.dispatch('addCult', processedData);
          Toast.success('Culto registrado com sucesso!');
        }
        
        loading.clear();
        this.$emit('submit-success');
      } catch (error) {
        console.error('Erro detalhado:', error.message, error.stack);
        Toast.fail(`Erro: ${error.message}`);
      }
    },

    validateForm() {
      return Object.values(this.formData).every(value => value !== '');
    }
  }
}
</script>

<style scoped>
.input-field::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  font-size: 0.9rem;
}

.input-field:focus::placeholder {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.form-wrapper {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.8s ease-out forwards;
  animation-delay: 0.4s;
  max-width: 900px;
  margin: 0 auto;
}

.cult-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.full-width {
  grid-column: 1 / -1;
}

label {
  font-weight: 600;
  color: #ffffff;
  font-size: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.input-field, .select-field, .textarea-field {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-field:focus,
.select-field:focus,
.textarea-field:focus {
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  outline: none;
}

.textarea-field {
  resize: vertical;
  min-height: 120px;
}

.submit-button {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  color: #1a2a6c;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  align-self: center;
  min-width: 200px;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.submit-button:active {
  transform: translateY(0);
}

.autocomplete-wrapper {
  position: relative;
  width: 100%;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(26, 42, 108, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.suggestion-item {
  padding: 10px 15px;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}

.suggestion-item:hover {
  background: rgba(255, 215, 0, 0.2);
}

.select-field {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffd700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.select-field option {
  background: #1266b4;
  color: #ffffff;
  padding: 8px;
}

.textarea-field::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  font-size: 0.9rem;
  line-height: 1.4;
}

.suggestions-list::-webkit-scrollbar {
  width: 6px;
}

.suggestions-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.suggestions-list::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.5);
  border-radius: 3px;
}

@media (max-width: 768px) {
  .form-wrapper {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .submit-button {
    width: 100%;
  }
}
</style>
