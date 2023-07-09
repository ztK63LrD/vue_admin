// 书写品牌管理模块的接口
import request from '@/utils/request'
// 引入ts类型
import type { TradeMarkResponseData, TradeMark } from './type'
// 品牌管理模块接口地址
enum API {
  // 获取已有品牌接口
  TRADEMAKE_URL = '/admin/product/baseTrademark/',
  // 添加品牌
  ADDTRADEMAKE_URL = '/admin/product/baseTrademark/save',
  // 修改品牌
  UPDATETRADEMAKE_URL = '/admin/product/baseTrademark/update',
  // 删除已有品牌数据
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}
// 获取已有品牌的接口方法：page：获取第几页；limit：获取几个已有品牌的数据
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(API.TRADEMAKE_URL + `${page}/${limit}`)
// 添加和修改已有品牌接口方法
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  // 修改已有品牌的数据
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMAKE_URL, data)
  } else {
    // 新增品牌数据
    return request.post<any, any>(API.ADDTRADEMAKE_URL, data)
  }
}
// 删除某一个已有品牌的数据
export const reqDeleteTrademark = (id: number) => request.delete<any, any>(API.DELETE_URL + id)
