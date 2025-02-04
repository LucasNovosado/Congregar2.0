import Parse from 'parse';
import html2canvas from 'html2canvas';

export default {
  async fetchCults() {
    const Cult = Parse.Object.extend('Cult');
    const query = new Parse.Query(Cult);
    const currentUser = Parse.User.current();
    query.equalTo('user', currentUser);
    try {
      const results = await query.find();
      return results.map(cult => ({
        id: cult.id,
        date: cult.get('date'),
        location: cult.get('location'),
        service: cult.get('service'),
        hollyWord: cult.get('hollyWord'),
        preaching: cult.get('preaching'),
        amount: cult.get('amount'),
        exhortation: cult.get('exhortation'),
        typeCult: cult.get('typeCult'),
        user: cult.get('user').id
      }));
    } catch (error) {
      console.error('Erro ao buscar cultos:', error);
      throw error;
    }
  },

  async fetchServiceNames() {
    const Cult = Parse.Object.extend('Cult');
    const query = new Parse.Query(Cult);
    const currentUser = Parse.User.current();
    query.equalTo('user', currentUser);
    query.select('service');
    
    try {
      const results = await query.find();
      const services = [...new Set(results.map(cult => cult.get('service')))];
      return services.filter(service => service);
    } catch (error) {
      console.error('Erro ao buscar nomes de serviço:', error);
      throw error;
    }
  },

  async addCult(cultData) {
    console.log('Iniciando addCult com dados:', cultData);
    const Cult = Parse.Object.extend('Cult');
    const cult = new Cult();
    const currentUser = Parse.User.current();
  
    if (!currentUser) {
      console.error('Usuário não encontrado');
      throw new Error('Usuário não autenticado');
    }
  
    try {
      console.log('Usuário atual:', currentUser.id);
      
      const processedData = {
        ...cultData,
        amount: parseInt(cultData.amount),
        date: new Date(cultData.date)
      };
  
      Object.entries(processedData).forEach(([key, value]) => {
        console.log(`Definindo ${key}:`, value);
        cult.set(key, value);
      });
      
      cult.set('user', currentUser);
      
      const result = await cult.save(null, { sessionToken: currentUser.getSessionToken() });
      console.log('Culto salvo com sucesso:', result.id);
      
      return {
        id: result.id,
        ...processedData,
        user: currentUser.id
      };
    } catch (error) {
      console.error('Erro detalhado ao adicionar culto:', error.message, error.stack);
      throw error;
    }
  },

  async updateCult(cultId, cultData) {
    const Cult = Parse.Object.extend('Cult');
    const query = new Parse.Query(Cult);
    try {
      const cult = await query.get(cultId);
      const currentUser = Parse.User.current();
      
      const processedData = {
        ...cultData,
        date: new Date(cultData.date),
        amount: parseInt(cultData.amount),
        user: currentUser
      };
  
      delete processedData.user;
  
      Object.entries(processedData).forEach(([key, value]) => {
        cult.set(key, value);
      });
  
      const result = await cult.save();
      return {
        id: result.id,
        ...cultData,
        user: currentUser.id
      };
    } catch (error) {
      console.error('Erro ao atualizar culto:', error);
      throw error;
    }
  },

  async deleteCult(cultId) {
    const Cult = Parse.Object.extend('Cult');
    const query = new Parse.Query(Cult);
    try {
      const cult = await query.get(cultId);
      await cult.destroy();
      return cultId;
    } catch (error) {
      console.error('Erro ao excluir culto:', error);
      throw error;
    }
  },

  async generateSummaryImage(element) {
    try {
      // Remove temporariamente os botões para a captura
      const actionButtons = element.querySelector('.action-buttons');
      if (actionButtons) {
        actionButtons.style.display = 'none';
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#1a2a6c',
        scale: window.devicePixelRatio || 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        width: element.offsetWidth,
        height: element.offsetHeight - (actionButtons ? actionButtons.offsetHeight : 0),
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      });

      // Restaura os botões após a captura
      if (actionButtons) {
        actionButtons.style.display = 'flex';
      }

      return canvas;
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      throw new Error('Falha ao gerar a imagem do culto');
    }
  },

  async shareImage(canvas) {
    try {
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });

      if (!blob) {
        throw new Error('Falha ao processar a imagem');
      }

      const file = new File([blob], 'culto.png', { type: 'image/png' });

      // Verifica se o navegador suporta compartilhamento de arquivos
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Detalhes do Culto',
          text: 'Compartilhando informações do culto'
        });
      } else {
        // Fallback para download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'culto.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      if (error.name !== 'AbortError') { // Ignora erro quando usuário cancela compartilhamento
        throw new Error('Não foi possível compartilhar a imagem');
      }
    }
  }
};
