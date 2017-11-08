<template>
  <div class="box card-box">
    <p class="date is-clearfix">
      <span class="is-pulled-left"><a :href="item.url">Fonte</a></span>
      <span>{{ item.feedbackUser }}</span>
      <span class="is-pulled-right">{{ date }}</span>
    </p>
    <p class="overview">{{ item.overview }}</p>

    <div class="analysis">
      <popover name="analysis">
        <div class="box" slot="content">
          <h3 class="is-title is-3">Análises:</h3>
          <ul class="analysis-list">
            <li :key="index" v-for="(text, index) in analysis.phrases">{{ text }}</li>
          </ul>
          
          <h3 class="is-title is-3">Palavras-chave:</h3>
          <p>{{ analysis.keywords }}</p>
        </div>
        <p slot="face" class="result positive" :class="[analysis.class]">
          <span class="icon"><i :class="[analysis.icon]"></i></span>
          <span>{{ analysis.face }}</span>
        </p>
      </popover>
    </div>
    
    <card-footer :handle-feedback="setFeedback" :maximize="openModal" :categories="categories" :feedback="item.feedbackStatus" :is-saving="isSaving" />
    <card-confirm v-if="isConfirmationBoxOpen" :status="status" :on-confirmation="save" :dismiss="confimationDismiss" />
  </div>
</template>

<script>
import cardFooter from './feedbackCard.footer';
import cardConfirm from './feedbackCard.confirm';
import popover from 'vue-popover'
import moment from 'moment';

export default {
  components: { cardFooter, popover, cardConfirm },
  props: ['item', 'modal', 'onSave'],
  data () {
    return {
      status: null,
      isConfirmationBoxOpen: false,
      isSaving: false
    }
  },
  computed: {
    categories () {
      return this.item.nlu ? this.item.nlu.categories : [];
    },
    date () {
      let date = moment(this.item.date);
      return date.isValid() ? date.format('DD/MM/YYYY') : null;
    },
    analysis () {
      let isRelevant = this.item.conversation.context > 0;
      let phrases = this.item.conversation.response.text.map(text => text.text);
      let keywords = [];

      for (let type in this.item.conversation.finalEntities) {
        let entry = this.item.conversation.finalEntities[type];
        if ((isRelevant && entry.meaning === 'include') || (!isRelevant && entry.meaning  === 'exclude')) {
          keywords = keywords.concat(entry.words);
        }
      }

      return {
        phrases: phrases,
        keywords: keywords.join(', '),
        class: isRelevant ? 'positive' : 'negative',
        face: isRelevant ? 'Relevante para IBM' : 'Não relevante para IBM',
        icon: isRelevant ? 'ibm-add-new' : 'ibm-remove-delete'
      } 
    }
  },
  methods: {
    confirmationBox (open) {
      this.isConfirmationBoxOpen = open;
    },
    setFeedback (status) {
      this.status = status;
      this.confirmationBox(true);
    },
    save (justification) {
      let self = this;
      
      self.isSaving = true;
      self.confirmationBox(false);
      self.onSave(self.item, { status: self.status, justification })
      .then(response => {
        self.isSaving = false;
      })
      .catch(error => {
        self.isSaving = false;
      });
    },
    confimationDismiss () {
      this.status = null;
      this.confirmationBox(false);
    },
    openModal () {
      this.modal(this.item);
    }
  }
}
</script>

<style >
.box {
  border-radius: 0;
}

.box.card-box {
  min-height: 200px;
  position: relative;
  padding: 0.55rem;
  text-align: justify;
}

.box.card-box .level {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}

.box.card-box .date {
  font-size: 0.6rem;
  text-align: center;
}

.box.card-box .overview {
  min-height: 87px;
  font-size: 0.75rem;
}

.box.card-box .analysis {
  font-size: 0.8rem;
  margin-top: 5px; 
}

.box.card-box .analysis .result {
  cursor: pointer
}

.box.card-box .analysis .result.positive {
  color: #9659D0;
}

.box.card-box .analysis .result.negative {
  color: #ff3860;
}

.box.card-box .analysis .box {
  border-radius: 0;
}

.box.card-box .analysis .box .is-title {
  margin: 10px 0 5px 0;
}

.box.card-box .analysis .box .is-title:first-child {
  margin-top: 0;
}

.box.card-box .analysis .box .analysis-list {
  padding-left: 0.8rem;
  list-style: disc;
}
</style>
