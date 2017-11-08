<template>
  <div>
    <filterBar :pending="pendingItems" :search="search" :is-searching="isSearching"></filterBar>
    <cardList v-if="reports && reports.length" :load-more="loadMore" :reports="reports" :on-save="saveItem"></cardList>
    <blank v-if="!reports || !reports.length" :message="message"></blank>
  </div>
</template>

<script>
import filterBar  from './filter';
import cardList  from './card/card.list';
import cardModal from './card/card.modal';
import blank from './blank';
// import mockedData from '../../../data/data.json';
import * as Card from '../../data/card';
import moment from 'moment';

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
        return 'Comece sua pesquisa utilizando os campos acima.';
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
      let self = this;
      
      return new Promise ((resolve, reject) => {
        Card.save(item, changes)
        .then(result => {
          resolve(result);
          setTimeout(() => {
            let index =  self.reports.indexOf(item);
            if (index > -1) {
              self.reports.splice(index, 1);
            }
          });
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
      });
    },
    search (filter) {
      let self = this;

      self.reports = [];
      self.searchOffset = 0;
      self.isSearching = true;
      self.searchOptions = filter;

      if(filter.startDate){
        let date = moment(filter.startDate, "YYYY-MM-DD");
        filter.startDateMills =  date.isValid() ? date.valueOf() : null;
      }
      if(filter.endDate){
        let date = moment(filter.endDate, "YYYY-MM-DD");
        filter.endDateMills =  date.isValid() ? date.valueOf() : null;
      }

      Card.get(filter, self.searchOffset)
      .then(response => {
        self.reports = response;
        self.isSearching = false;
      })
      .catch(error => {
        self.reports = null;
        self.isSearching = false;
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
