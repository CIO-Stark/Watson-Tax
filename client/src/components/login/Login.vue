<template>
  <div class="login hero">
    <div class="hero-body">
      <div class="container">
        <!-- <h2 class="title is-2">Log In</h2> -->

        <form class="form" @submit="submit">
          <inputbox label="Email" property="username" :value="credentials.username" :onChange="setCredential" type="email" />
          <inputbox label="Senha" property="password" :value="credentials.password" :onChange="setCredential" type="password" />
          <button type="submit" :class="{'is-loading': isLoading}" class="button is-primary is-pulled-right">Access</button>
        </form>
        
        <div v-if="error" class="message is-danger">
              <p>{{ error }}</p>
          </div>
      </div>
    </div>
  </div>
  </template>

<script>
import inputbox from '../shared/input';
import * as auth from '../../data/auth';
import router from '../../router';

export default {
  components: { inputbox },
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      error: null,
      isLoading: false
    }
  },
  methods: {
    setCredential (prop, value) {
      this.credentials[prop] = value;
    },
    submit (event) {
        event.preventDefault();
        if (!this.credentials.username || !this.credentials.password) {
            this.error = 'Preencha todos os campos.'
            return false;
        }

        this.isLoading = true;
        this.error = '';
        auth.login(this.credentials)
        .then(result => {
            this.isLoading = true;
            router.go('/');
        })
        .catch(error => {
            this.isLoading = true;
            this.error = error.message || 'Erro ao autenticar o user';
        })
    }
  }
}
</script>

<style>
.login.hero {
  text-align: left; 
}

.login.hero .container {
  clear: both;
  max-width: 500px;
}

.login.hero .message {
  text-align: center;
  padding: 2rem;
  margin-top: 5rem;
}
</style>
  