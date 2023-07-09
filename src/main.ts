/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createApp, createVNode, render } from 'vue'
import App from '@/App.vue'
// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置element-plus国际化
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// svg插件需要配置的代码
import 'virtual:svg-icons-register'
// 引入自定义插件对象：注册整个项目的全局组件
import gloablComponent from '@/components'
// 引入模板的全局样式
import '@/styles/index.scss'
// 暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入路由
import router from './router'
// 导入手撸进度条
// import loadingBarVue from '@/components/loadingBar/index.vue'
// 引入仓库
import pinia from './store'
// 引入操作token函数
// import { GET_TOKEN } from './utils/token'
import 'animate.css'
// 引入路由鉴权文件
import '@/utils/permisstion'

// 获取应用实例对象
const app = createApp(App)

// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn, // element-plus国际化配置
})

// 安装仓库pinia
app.use(pinia)

// 注册全局路由
app.use(router)

// 安装自定义插件
app.use(gloablComponent)

// 手撸进度条实现的业务，这里注销掉
// const Vnode = createVNode(loadingBarVue)
// render(Vnode, document.body)
// // 设置路由前置守卫
// router.beforeEach((to, _from, next) => {
//   document.title = to.meta.title as string
//   Vnode.component?.exposed?.startLoading()
//   if (to.meta.requiresAuth && !GET_TOKEN()) {
//     next('/login')
//   }
//   next()
// })
// // 设置路由后置守卫
// router.afterEach((_to, _from) => {
//   Vnode.component?.exposed?.endLoading()
// })

//引入自定义指令文件
import { isHasButton } from '@/directive/has'
isHasButton(app)
// 将应用挂载到挂载点上
app.mount('#app')
