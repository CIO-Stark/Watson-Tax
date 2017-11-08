<template>
  <div id="app">
    <navbar></navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import navbar  from './components/navbar'

export default {
  components: { navbar }
}
</script>

<style>
@import '~ibm-icon-font/css/ibmicons.css';
@import '~bulma/css/bulma.css';
@import "~vue-popover/dist/styles.css";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

#app a {
  color: #9659D0;
}

#app a:hover {
  color: #2c3e50;
}

.button {
  border-radius: 0 !important;
}

.is-purple {
  color: #fff;
  background-color: #9659D0 !important;
  border: 0;
  border-radius: 0 !important;
}

.is-purple:hover, .is-purple:focus {
  color: #eee;
}

.control.has-icons-left .input.is-small ~ .icon, .control.has-icons-left .select select.is-small ~ .icon, .control.has-icons-right .input.is-small ~ .icon, .control.has-icons-right .select select.is-small ~ .icon {
  font-size: 0.9rem;
}
</style>