import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use (VueRouter);

export default new VueRouter ({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      // meta: { layout: "default" },
      component: () => import ('@/views/Dashboard'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import ('@/views/Login'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import ('@/views/Create'),
    },
    {
      path: '/form/:id',
      name: 'form',
      component: () => import ('@/views/Form'),
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import ('@/views/Edit'),
    },
  ],
});
