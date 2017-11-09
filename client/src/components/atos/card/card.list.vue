<template>
  <section id="card-list" class="section">
    <div class="level">
      <div class="level-left">
        <p>Resultados</p>
      </div>

       <div class="level-right">
      </div> 
    </div>

    <div class="columns is-multiline">
      <div class="column is-one-third" v-for="report in reports" :key="report._id" v-if="report.overview">
        <card :item="report" :modal="openModal" :on-save="onSave" />
      </div>
       <!-- <div class="column is-12">
         <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
           <span slot="no-more">Fim da busca.</span>
         </infinite-loading> 
       </div> -->
    </div>

    <cardModal :is-active="isModalActive" :dismiss="closeModal" :item="selectedCard" />
  </section>
</template>

<script>
import card from './card';
import cardModal from './card.modal';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  components: { 
    card,
    cardModal,
    InfiniteLoading
  },
  props: ['reports', 'valor', 'loadMore', 'onSave'],
  data () {
    return {
      selectedCard: null,
      isModalActive: false
    };
  },
  methods: {
    onInfinite () {
      let self = this;

      self.loadMore().then(hasLoadedMore => {
        if (hasLoadedMore) {
          self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
        } else {
          self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
        }
      });
    },
    openModal (item) {
      this.selectedCard = item;
      this.isModalActive = true;
    },
    closeModal () {
      this.selectedCard = null;
      this.isModalActive = false;
    }
  }
}
</script>

<style>
#card-list {
  padding-top: 0.1rem;
  min-height: 500px;
}

#card-list:last-child {
  margin-bottom: 100px;
}

#card-list .level:first-child {
  border-bottom: 1px solid #cecece;
}

#card-list .level-right .level-item a {
  padding-bottom: -4px;
}

#card-list .level-right .level-item a.is-active {
  border-bottom: 1px solid #9659D0;
}

.loading-default {
  border-color: #9659D0 !important;
}

.loading-default::before {
  background-color: #9659D0 !important;
}
</style>