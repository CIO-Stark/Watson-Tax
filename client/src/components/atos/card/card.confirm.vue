<template>
  <div class="confirm-box box">
    <p>Confirma a revisão deste item?</p>

    <textarea 
      ref="textarea" 
      v-if="negativeReview" 
      v-model="justification" 
      placeholder="Em caso negativo, justifique sua validação." 
      class="textarea is-small">
    </textarea>

    <div class="buttons">
      <button class="button is-purple is-small" @click="sendReview">Confirmar</button>
      <button class="button is-small" @click="dismiss">Cancelar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['status', 'onConfirmation', 'dismiss'],
  data () {
    return { justification: '' }
  },
  computed: {
    negativeReview () {
      return this.status === 'negative';
    }
  },
  methods: {
    sendReview () {
      if (this.negativeReview && !this.justification) { // negative review and justification is empty
        this.$refs.textarea.focus();
        return;
      }

      this.onConfirmation(this.justification);
    }
  }
}
</script>

<style>
.box.confirm-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  padding: 1rem;
}

.box.confirm-box textarea {
  width: 100%;
  min-height: 80px;
  border-radius: 0;
}

.box.confirm-box textarea:focus, .box.confirm-box textarea:active {
  border-color: #9659D0 !important;
}

.box.confirm-box .buttons {
  position: absolute;
  bottom: 15px;
  right: 16px;
}
</style>
