import Vue from 'vue';
import Router from 'vue-router';
import Atos from '../components/atos/atos';
import Feedback from '../components/feedback/feedback';
import Login from '../components/login/Login';

import * as auth from '../data/auth';

Vue.use(Router);

const router = new Router({
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      name: 'Atos',
      component: Atos,
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: Feedback,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
});
//@PORTFOLIO
// router.beforeEach((to, from, next) => {
//     const isLogin = to.path === '/login';

//     // unfortunatly, next() isn't working as espected. 
//     // So router will be used to move user to the desired route
//     if (!auth.getToken() && !isLogin) {
//         router.history.push('/login');
//     } else if (auth.getToken() && isLogin) {
//         router.history.push('/');
//     } else {
//         next();
//     }
// });

export default router;