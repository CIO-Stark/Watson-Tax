<template>
  <nav class="navbar">
    <div class="nav-brand">
      <div class="navbar-item">
        <p class="logo">Watson Tax</p>
      </div>
    </div>
    <div class="navbar-menu" v-show="showMenu">
      <div class="navbar-end">
        <router-link to="/" class="navbar-item" exact>Atos</router-link>
        <router-link to="/feedback" class="navbar-item" exact>Feedback</router-link>
        <a v-on:click="logout()" class="navbar-item">Logout</a>
      </div>
    </div>
  </nav>
</template>

<script>
import router from '../router';
import * as auth from '../data/auth';

export default {
  data () {
    return { showMenu: false }
  },
    methods: {
        logout: () => {
            auth.logout();
            router.go('/login');
        }
    },
    beforeMount () {
        let self = this;

        if (router.history.current.path !== '/login') {
            self.showMenu = true;
        }

        router.beforeEach((to, from, next) => {
            if (to.name === 'Login') {
            self.showMenu = false;
            } else {
                self.showMenu = true;
            }

            next();
        })
    }
}
</script>

<style>

.navbar {
  background-color: #323232;
}

.navbar * {
  color: #CDCDCD !important;
}

.navbar .nav-brand .navbar-item {
   margin-top: 5px; 
}

div.navbar-item.is-active, div.navbar-item:hover * {
  cursor: pointer;
  color: #D5ACFD !important;
}

a.navbar-item {
  height: 52px;
}

a.navbar-item.is-active, a.navbar-item:hover {
  background-color: transparent !important;
  color: #D5ACFD !important;
  border-bottom: 3px solid #D5ACFD;
  padding-bottom: 5px; 
}

.logo {
  font-weight: 700;
  color: #eee !important;
}

</style>
