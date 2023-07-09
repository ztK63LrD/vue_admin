// 创建用户信息相关数据的仓库
import { defineStore } from 'pinia'
// 引入登录接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { UserState } from './type'
// 引入操作本地存储工具的方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由(常量路由)
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
// 约束ts类型
import type { loginFormData, loginResponseData, userInfoReponseData } from '@/api/user/type'
// 引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

const useUserStore = defineStore('User', {
  // 存储数据
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识token
      menuRoutes: constantRoute, // 仓库存储生成菜单需要的数组(路由)
      username: '',
      avatar: '',
      buttons: [], // 存储用户当前是否包含某一个按钮
    }
  },
  actions: {
    // 处理用户登录
    async userLogin(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data)
      if (result.code == 200) {
        this.token = result.data as string
        // 本地持久化存储
        SET_TOKEN(result.data as string)
        // 保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 获取用户信息的方法
    async useInfo() {
      // 获取用户信息存储到仓库之中
      const result: userInfoReponseData = await reqUserInfo()
      // 如果获取用户信息成功，就存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        //计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)
        //菜单需要的数据整理完毕
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
        const test = [...userAsyncRoute, anyRoute]
        test.forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录的方法
    async userLogout() {
      // 退出登录请求
      const result: any = await reqLogout()
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN() // 删除本地token
        return '0k'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
// 对外暴露仓库方法
export default useUserStore
