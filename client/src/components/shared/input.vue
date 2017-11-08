<template>
  <div class="field">
    <label class="label" v-if="label">{{ label }}</label>
    <p class="control">
      <input class="input is-small" :type="inputType" :placeholder="placeholder" :value="value" @input="handleChange">
    </p>
  </div>
</template>

<script>
export default {
  props: ['placeholder', 'label', 'value', 'type', 'property', 'onChange'],
  computed: {
    inputType () {
      return this.type || 'text';
    }
  },
  methods: {
    handleChange (event) {
      this.onChange(this.property, event.target.value);
    }
  }
}
</script>

<style>
.input {
  border-radius: 0;
  outline: none;
}

.input:focus {
  border-color: #dbdbdb;
}
</style>