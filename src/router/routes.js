
const routes = [
  {
    path: '/',
    redirect: '/data-management/image-management'
  },

  {
    path: '/data-management',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'image-management',
        name: 'imageManagement',
        component: () => import('pages/data-management/image-management/index.vue')
        // component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'audio-management',
        name: 'audioManagement',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'text-management',
        name: 'textManagement',
        component: () => import('pages/IndexPage.vue')
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
