<template>
  <el-button type="primary" size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
  <el-button type="primary" size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          @change="changeDark"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
        ></el-switch>
      </el-form-item>
      <el-form-item label="主题颜色">
        <el-color-picker v-model="color" @change="setColor" show-alpha :predefine="predefineColors" />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button type="primary" size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img :src="userStore.avatar" style="width: 24px; height: 24px; border-radius: 50%; margin: 0 10px" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="layout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 获取骨架仓库
import useLayOutSettingStore from '@/store/settings'
// 获取用户相关的仓库
import useUserStore from '@/store/user'
import { useRouter, useRoute } from 'vue-router'
const layoutSettingStore = useLayOutSettingStore()
const userStore = useUserStore()
// 获取路由器对象
const $router = useRouter()
// 获取路由对象
const $route = useRoute()
// 收集开关数据
let dark = ref<boolean>(localStorage.getItem('dark') === 'false')
// 取色器
let color = ref<string>(localStorage.getItem('color') || 'rgba(255, 69, 0, 0.68)')
let predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

// 切换刷新按钮标识
const updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}
// 切换全面模式展现
const fullScreen = () => {
  // DOM对象的有个属性，用来判断当前是不是全屏模式[全屏:true,不是全屏:null]
  let full = document.fullscreenElement
  // 切换全屏模式
  if (!full) {
    // 文档根节点的方法requestFullscreen，实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}
// 退出登录
const layout = async () => {
  await userStore.userLogout()
  // 跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
onMounted(() => {
  const storedValue = localStorage.getItem('dark')
  if (storedValue !== null) {
    dark.value = storedValue === 'true'
    let html = document.documentElement
    dark.value ? (html.className = 'dark') : (html.className = '')
  }
  const storeColor = localStorage.getItem('color')
  if (storeColor !== null) {
    color.value = storeColor
    let html = document.documentElement
    html.style.setProperty('--el-color-primary', color.value)
  }
})
// switch开关的change事件进行暗黑模式的切换
const changeDark = () => {
  // 获取html根节点
  let html = document.documentElement
  // 判断HTML标签是否含有类名dark
  dark.value ? (html.className = 'dark') : (html.className = '')
  localStorage.setItem('dark', dark.value.toString())
}
// 主题颜色的设置
const setColor = () => {
  // 通知js修改根节点的样式对象的属性与属性值
  let html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
  localStorage.setItem('color', color.value.toString())
}
</script>

<style lang="scss" scoped></style>
