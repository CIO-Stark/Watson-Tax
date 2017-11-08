<template>
  <div>
    <filterBar :pending="pendingItems" :search="search" :is-searching="isSearching"></filterBar>
    <cardList v-if="reports && reports.length" :load-more="loadMore" :reports="reports" :on-save="saveItem"></cardList>
    <blank v-if="!reports || !reports.length" :message="message"></blank>
  </div>
</template>

<script>
import filterBar  from './filter';
import cardList  from './card/feedbackCard.list';
import cardModal from './card/feedbackCard.modal';
import blank from '../atos/blank';
import mockedData from '../../../data/data.json';
import * as Card from '../../data/card';

export default {
    //name: 'app',
  components: {
    filterBar,
    cardList,
    blank
  },
  data: () => {
    return { 
      reports: null,
      isModalActive: true,
      isSearching: false,
      searchOptions: null,
      searchOffset: 0
    };
  },
  computed: {
    message () {
      if (this.reports === null) {
        return 'Comece sua pesquisa de atos já verificados utilizando os campos acima.';
      } else if (!this.reports.length && !this.isSearching) {
        return 'Nenhum dado encontrado.';
      } else if (this.isSearching) {
        return 'Buscando dados...';
      } else {
        return '';
      }
    },
    pendingItems () {
      return this.reports ? this.reports.length : 0;
    }
  },
  methods: {
    saveItem (item, changes) {
      return Card.save(item, changes);
    },
    search (filter) {
      let self = this;

      self.reports = [];
      self.searchOffset = 0;
      self.isSearching = true;
      self.searchOptions = filter;

      Card.findAllSaved(filter, self.searchOffset)
      .then(response => {
        self.reports = response;
        self.isSearching = false;
      })
      .catch(error => {
        console.log(error);
      });
    },
    loadMore () {
      let self = this;

      return new Promise ((resolve, reject) => {
        Card.get(self.searchOptions, self.searchOffset)
        .then(response => {
          self.searchOffset++;

          if (response.length) {
            self.reports = self.reports.concat(response);
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          console.log('Error loading more content: ', error);
          reject(error);
        });
      });
    }
  }  
}
</script>

<style>

</style>
