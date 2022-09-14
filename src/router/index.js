import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use (VueRouter);

export default new VueRouter ({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'design',
      // meta: { layout: "default" },
      component: () => import ('@/views/Design'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import ('@/views/Login'),
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import ('@/views/Preview'),
    },
    {
      path: '/form',
      name: 'form',
      component: () => import ('@/views/Form'),
    },
  ],
});
