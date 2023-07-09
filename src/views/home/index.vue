<template>
  <div class="layout">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <!-- logo组件 -->
      <logo></logo>
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          background-color="#008080"
          text-color="white"
          :default-active="$route.path"
          :collapse="LayOutSettingStore.fold ? true : false"
        >
          <!-- 根据路由动态的生成菜单 -->
          <Menu :menuList="useState.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <tabbar></tabbar>
    </div>
    <div class="layout_main" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Main></Main>
    </div>
    <div class="layout_footer" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Footer></Footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
// 引入左侧导航栏logo图片
import logo from './logo/index.vue'
// 引入顶部tabbar组件
import tabbar from './tabbar/index.vue'
// 引入菜单组件
import Menu from './menu/index.vue'
// 导入主体内容组件
import Main from './main/index.vue'
// 引入页脚的内容组件
import Footer from './footer/index.vue'
// 获取用户相关的仓库
import useUserStore from '@/store/user'
// 获取layout导航菜单中的仓库数据
import useLayOutSettingStore from '@/store/settings'
let useState = useUserStore()
// 获取路由对象
let $route = useRoute()
let LayOutSettingStore = useLayOutSettingStore()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
    &.fold {
      width: $base-menu-min-width;
    }
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0px;
    left: $base-menu-width;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height * 2);
    left: $base-menu-width;
    top: $base-tabbar-height;
    box-sizing: border-box;
    // background: white;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
  .layout_footer {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background: #e9d8e2;
    border-radius: 20px 20px 0 0;
    box-shadow: inset 22px 22px 43px #c6b8c0, inset -22px -22px 43px #fff8ff;
    bottom: 0;
    left: $base-menu-width;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
