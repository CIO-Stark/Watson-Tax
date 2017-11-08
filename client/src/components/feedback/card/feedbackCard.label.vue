<template>
  <!-- <img :src="image.path" :alt="image.title" :title="image.title" class="label-image" /> -->
  <span v-if="label" class="tag category-tag is-primary">{{ label }}</span>
</template>

<script>
import * as cardHelper from '../../../helpers/card.helper';

export default {
  props: ['category'],
  computed: {
    label () {
      return cardHelper.parseLabel(this.category);
    }
  }
}
</script>

<style >
.label-image {
   width: 1rem;
   margin-left: 5px;
}

.category-tag {
  font-size: 0.55rem;
  margin-left: 0.3rem;
}

.category-tag.is-primary {
  /* color: #9659D0; */
  background-color: #D5ACFD;
  font-weight: 600;
}
</style>
