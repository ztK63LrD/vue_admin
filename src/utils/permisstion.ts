// 路由鉴权文件
import router from '@/router'
// 引入进度条插件
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
// 取消加载的小圆球
nprogress.configure({ showSpinner: false })

// 获取用户相关信息数据的仓库,去判断用户是否登录
import useUserStore from '@/store/user'
import pinia from '@/store'
const userStore = useUserStore(pinia)
// 全局前置守卫(项目中任意路由的切换都会触发的钩子)
router.beforeEach(async (to: any, from: any, next: any) => {
  nprogress.start()
  // 获取token，去判断用户是否登录
  const token = userStore.token
  // 获取用户名字
  const username = userStore.username
  if (token) {
    // 用户登录判断
    // 用户登录成功如果想去访问登录页面，我们是不能让你访问的直接跳转到首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        // 放行
        next()
      } else {
        // 如果没有用户信息，在守卫这里发请求获取到用户信息再放行
        try {
          // 获取用户信息成功后放行
          await userStore.useInfo()
          // 万一刷新的是异步路由，有可能获取到用户信息，异步路由还没有加载完毕，出现空白效果
          next({ ...to })
        } catch (error) {
          // 两种情况：token过期获取不到用户信息；用户手动修改了本地存储的token
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 用户未登录判断
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})

// 全局后置守卫
router.afterEach((to: any, from: any) => {
  // 设置标题
  document.title = to.meta.title
  nprogress.done()
})
