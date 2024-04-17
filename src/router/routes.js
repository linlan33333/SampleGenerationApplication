
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
        component: () => import('pages/data-management/audio-management/index.vue')
      },
      {
        path: 'text-management',
        name: 'textManagement',
        component: () => import('pages/IndexPage.vue')
      },
    ]
  },

  {
    path: '/data-augment',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'image-augment',
        name: 'imageAugment',
        component: () => import('pages/data-augment/image-augment/index.vue')
        // component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'audio-augment',
        name: 'audioAugment',
        component: () => import('pages/data-augment/audio-augment/index.vue')
      },
      {
        path: 'text-augment',
        name: 'textAugment',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'augment-result',
        name: 'augmentResult',
        component: () => import ('pages/data-augment/augment-result/index.vue')
      }
    ]
  },

  {
    path: '/data-clean',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'image-clean',
        name: 'imageClean',
        component: () => import('pages/data-clean/image-clean/index.vue')
      },
      {
        path: 'audio-clean',
        name: 'audioClean',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'text-clean',
        name: 'textClean',
        component: () => import('pages/IndexPage.vue')
      }
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
