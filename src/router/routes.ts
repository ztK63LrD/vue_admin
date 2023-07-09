// 对外暴露路由(常量路由)
export const constantRoute = [
  {
    path: '/login',
    name: 'login', // 命名路由
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录页面',
      hidden: true, // 代表路由标题在菜单中是否隐藏
      icon: 'Printer', // 菜单文字左侧的图标，支持element-ui
    },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '',
      requiresAuth: false,
      hidden: true,
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled', // 菜单文字左侧的图标，支持element-ui
        },
      },
    ],
  },
  {
    path: '/screen',
    name: 'screen',
    meta: {
      title: '数据大屏',
      icon: 'Platform',
    },
    children: [
      {
        path: '/three',
        component: () => import('@/views/home/screen/three/index.vue'),
        name: 'three',
        meta: {
          title: '3D可视化',
          icon: 'Picture',
        },
      },
      {
        path: '/echarts',
        component: () => import('@/views/home/screen/echarts/index.vue'),
        name: 'echarts',
        meta: {
          title: 'ECharts展示',
          icon: 'ShoppingBag',
        },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404界面',
      hidden: true,
    },
  },
]
// 异步路由
export const asyncRoute = [
  {
    path: '/acl',
    component: () => import('@/views/home/index.vue'),
    name: 'Acl',
    meta: {
      title: '权限管理',
      icon: 'Lock',
    },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/home/acl/user/index.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        component: () => import('@/views/home/acl/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'UserFilled',
        },
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/home/acl/permission/index.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          icon: 'Monitor',
        },
      },
    ],
  },
  {
    path: '/product',
    component: () => import('@/views/home/index.vue'),
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'Goods',
    },
    redirect: '/product/trademark',
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/views/home/product/trademark/index.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          icon: 'ShoppingCartFull',
        },
      },
      {
        path: '/product/attr',
        component: () => import('@/views/home/product/attr/index.vue'),
        name: 'Attr',
        meta: {
          title: '属性管理',
          icon: 'ChromeFilled',
        },
      },
      {
        path: '/product/spu',
        component: () => import('@/views/home/product/spu/index.vue'),
        name: 'Spu',
        meta: {
          title: 'SPU管理',
          icon: 'Calendar',
        },
      },
      {
        path: '/product/sku',
        component: () => import('@/views/home/product/sku/index.vue'),
        name: 'Sku',
        meta: {
          title: 'SKU管理',
          icon: 'Orange',
        },
      },
    ],
  },
]
//任意路由
export const anyRoute = {
  //任意路由
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  name: 'Any',
  meta: {
    title: '任意路由',
    hidden: true,
    icon: 'DataLine',
  },
}
