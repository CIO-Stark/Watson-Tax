<template>
    <nav class="card-footer level">
      <div class="level-left">
        <div class="level-item" v-if="categories">
          <card-label v-for="(category, index) in categories" :category="category" :key="index" />
        </div>
      </div>

      <div class="level-right">
        <p class="level-item">
          <!-- <p v-show="!isSaving">
            <span class="icon" v-if="handleFeedback" :class="{ 'active-feed': negativeFeedback }" v-on:click="handleFeedback('negative')">
              <i class="ibm-close-cancel-error"></i>
            </span>
            <span class="icon" v-if="handleFeedback" :class="{ 'active-feed': positiveFeedback }" v-on:click="handleFeedback('positive')">
              <i class="ibm-success-confirmation"></i>
            </span>
          </p>
          <p v-show="isSaving">
            <button class="button is-loading is-white is-small"></button>
          </p> -->
          <p>
            <span class="icon" v-if="maximize" v-on:click="maximize()"><i class="ibm-maximize"></i></span>
          </p>
        </p>
      </div>
    </nav>
</template>

<script>
import cardLabel from './feedbackCard.label';

export default {
  components: { cardLabel },
  props: ['cancel', 'handleFeedback', 'maximize', 'categories', 'feedback', 'isSaving'],
  computed: {
    negativeFeedback () {
      return this.feedback === 'negative';
    },
    positiveFeedback () {
      return this.feedback === 'positive';
    }
  }
}
</script>

<style >
.card-footer {
  border: none;
}

.card-footer.level {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}

.card-footer.level .level-right .icon {
  margin-right: 5px;
  cursor: pointer;
}

.card-footer.level .level-right .icon:hover, .card-footer.level .level-right .icon.active-feed {
  color: #9659D0;
}
</style>
