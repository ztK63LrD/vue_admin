// 关于导航组件相关的仓库
import { defineStore } from 'pinia'

const useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 用户控制菜单折叠还是收起的控制
      refsh: false, // 用于控制刷新效果
    }
  },
})

export default useLayOutSettingStore
