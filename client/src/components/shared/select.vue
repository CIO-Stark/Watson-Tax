<template>
  <div class="field is-fullwidth">
    <p class="control">
      <span class="select is-small" :class="{ 'is-disabled': disabled }">
        <select :value="value" @change="handleChange">
          <option selected disabled value="">{{ disabledOption }}</option>
          <option v-for="(item, index) in list" :value="item" :key="index">{{ item }}</option> 
        </select>
      </span>
    </p>
  </div>
</template>

<script>
export default {
  props: ['value', 'property', 'onChange','list', 'disabledOption', 'disabled'],
  methods: {
    handleChange (event) {
      this.onChange(this.property, event.target.value);
    }
  }
}
</script>

<style>
.select {
  min-width: 100%;
}

.select select {
  min-width: 100%;
  border-radius: 0 !important;
}
.select::after {
  border-color: #9659D0 !important;
}

.select select:focus {
  border-color: #dbdbdb;
}

.select select option {
  width: inherit;
}
</style>
