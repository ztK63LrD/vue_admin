// 商品分类全局组件的小仓库
import { defineStore } from 'pinia'
// 引入分类接口的方法
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
// 引入ts类型
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 存储一级分类的数据
      c1Arr: [],
      // 存储一级分类的ID
      c1Id: '',
      // 存储对应一级分类下的二级分类
      c2Arr: [],
      // 存储二级分类的ID
      c2Id: '',
      // 存储三级分类的数据
      c3Arr: [],
      // 存储三级分类的ID
      c3Id: '',
    }
  },
  actions: {
    // 获取一级分类的方法
    async getC1() {
      // 发请求获取一级分类的数据
      const result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
    // 获取二级分类的数据
    async getC2() {
      // 获取对应一级分类下的二级分类
      const result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    // 获取三级分类的数据
    async getC3() {
      // 获取对应二级分类下的三级分类
      const result: CategoryResponseData = await reqC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})
export default useCategoryStore
