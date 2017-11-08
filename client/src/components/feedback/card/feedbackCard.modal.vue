<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" v-on:click="dismiss()"></div>
    <div class="modal-content card-modal">
      
      <div class="box">
        <h3 class="is-title is-3">
          {{ content.subject }} 
          <span>
            {{ date }} 
            <a :href="content.url" target="_blank">Fonte</a>
          </span>
        </h3>
        
        <p class="box-body">{{ content.body }}</p>
      </div>
    </div>
     <button class="modal-close is-large" v-on:click="dismiss()"></button> 
  </div>  
</template>

<script>
import cardFooter from './feedbackCard.footer';
import moment from 'moment';

export default {
  components: { cardFooter },
  props: ['item', 'isActive', 'dismiss', 'updateStatus'],
  computed: {
    content () {
      let content = {};

      if (this.item) {
        content.body = this.item.body;
        content.subject = this.item.subject;
        content.date = this.item.date;
        content.url = this.item.url;
      }

      return content;
    },
    date () {
      if (this.item) {
        let date = moment(this.item.date);
        return date.isValid() ? date.format('DD/MM/YYYY') : '';
      }
      return '';
    }
  }
}
</script>

<style >
.modal-content.card-modal {
   /* width: 100%; */
  /* margin: 0 4rem;  */
}

.modal-content.card-modal .box {
  border-radius: 0;
  padding-bottom: 0.5rem; 
  overflow-y: scroll;  
  text-align: justify;  
}

.modal-content.card-modal .box .is-title span, .modal-content.card-modal .box .is-title a {
  display: block;
  font-size: 0.55rem;
}

.modal-content.card-modal .box .is-title a {
  text-decoration: underline;
}

.modal-content.card-modal .box .is-title {
  margin-bottom: 20px;
}

.modal-content.card-modal .box .box-body {
  overflow-y: scroll;
}

</style>
