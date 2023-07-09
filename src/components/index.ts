// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Category from './Category/index.vue'
import type { App, Component } from 'vue'
// 引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 全局对象
const allGloablComponent: { [name: string]: Component } = { SvgIcon, Category }
// 对外暴露插件
export default {
  // 固定写法 install 方法
  install(app: App) {
    // 注册项目全部的全局组件
    Object.keys(allGloablComponent).forEach((key: string) => {
      // 注册为全局组件
      app.component(key, allGloablComponent[key])
    })
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
