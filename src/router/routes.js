
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
        // 这是图像清洗、增广后的结果管理界面的url，由于当时编写的时候没想过单独摘出来作为一个path
        // 后续考虑把它拿出来，作为单独的url路径，不放在data-augment下面
        path: 'augment-result',
        name: 'augmentResult',
        component: () => import ('pages/data-augment/augment-result/index.vue')
      },
      {
        path: 'audio-augment-result',
        name: 'audioAugmentResult',
        component: () => import ('pages/data-augment/audio-augment-result/index.vue')
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
        component: () => import('pages/data-clean/audio-clean/index.vue')
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
