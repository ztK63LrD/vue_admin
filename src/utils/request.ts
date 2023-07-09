import { ElMessage } from 'element-plus'
// 进行axios二次封装：使用请求与响应拦截器
import axios from 'axios'
// 引入用户相关的仓库
import useUserStore from '@/store/user'
// 第一步：利用axios对象的create方法，去创建axios实例(其他的配置：基础路径、超时时间)
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径会携带/api
  timeout: 5000, // 发起请求超时时间的设置
})
// 第二步：request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  // 获取用户相关的仓库，登录成功之后携带给服务器
  const useStore = useUserStore()
  if (useStore.token) {
    config.headers.token = useStore.token
  }
  // config配置对象，headers属性请求头，经常给服务器端携带公共参数
  return config // 返回配置对象
})
// 第三步：响应拦截器
request.interceptors.response.use(
  // 成功的回调
  (response) => {
    return response.data
  },
  (error) => {
    //处理网络错误
    let msg = ''
    const status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '网络出现问题'
        break
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
// 对外暴露
export default request
