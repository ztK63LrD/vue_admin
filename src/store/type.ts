// 导入路由对象
import type { RouteRecordRaw } from 'vue-router'
// 引入ts类型
import type { CategoryObj } from '@/api/product/attr/type'
// 定义仓库数据state类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}

// 定义分类仓库state对象的ts类型
export interface CategoryState {
  c1Arr: CategoryObj[]
  c2Arr: CategoryObj[]
  c3Arr: CategoryObj[]
  c1Id: string | number
  c2Id: string | number
  c3Id: string | number
}
