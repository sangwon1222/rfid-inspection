import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: '/', component: () => import('./pages/excel.vue') },
  { path: '/excel', name: 'excel', label: '발행', component: () => import('./pages/excel.vue') },
  // {
  //   path: '/history',
  //   name: 'history',
  //   label: '발행 내역',
  //   component: () => import('./pages/history.vue')
  // },
  {
    path: '/set-idro',
    name: 'set-idro',
    label: 'IDRO 설정',
    component: () => import('./pages/setIdro.vue')
  },
  {
    path: '/set-serial',
    name: 'set-serial',
    label: 'SERIAL 설정',
    component: () => import('./pages/setInspector.vue')
  },
  {
    path: '/404',
    name: 'notFound',
    label: 'notFound',
    component: () => import('./pages/404.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    label: 'notFound',
    component: () => import('./pages/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
