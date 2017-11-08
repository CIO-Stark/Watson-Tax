<template>
  <div class="field">
    <p class="control has-icons-right">
      <input 
        class="input is-small" 
        type="text" 
        :placeholder="placeholder" 
        :value="value" 
        :min="min" 
        :max="max"
        :disabled="disabled" 
        @input="handleChange" 
        @focus="changeType" 
        @blur="changeType">
      <span class="icon is-small is-right"><i class="ibm-calendar"></i></span>
    </p>
  </div>
</template>

<script>
export default {
  props: ['placeholder', 'value', 'property', 'onChange', 'disabled', 'min', 'max'],
  methods: {
    handleChange (event) {
      this.onChange(this.property, event.target.value);
    },
    changeType (event) {
      if (event.type === 'blur' && !event.target.value) {
        event.target.type = 'text';
      } else if (event.type === 'focus') {
        event.target.type = 'date';
      }
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