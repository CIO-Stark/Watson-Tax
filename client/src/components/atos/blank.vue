<template>
  <section class="hero is-medium">
    <div class="hero-body">
      <div class="container is-centered">
        <h1>
          <span class="icon blank-icon"><i class="ibm-search"></i></span>
        </h1>
        <h1 class="subtitle">
          {{ message }}
        </h1>
        <!-- <button class="button is-loading is-white"></button> -->
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['message']
}
</script>

<style>
.blank-icon {
  font-size: 3rem;
}
</style>
