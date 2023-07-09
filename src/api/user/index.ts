// 统一管理我们项目用户的相关接口
import requset from '@/utils/request'
// 约束ts类型
import type { loginFormData, loginResponseData, userInfoReponseData } from './type'
// 统一管理接口
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}
// 暴露请求函数
// 登录接口的方法
export const reqLogin = (data: loginFormData) => requset.post<any, loginResponseData>(API.LOGIN_URL, data)
// 获取用户信息接口方法
export const reqUserInfo = () => requset.get<any, userInfoReponseData>(API.USERINFO_URL)
// 退出登录
export const reqLogout = () => requset.post<any, any>(API.LOGOUT_URL)
