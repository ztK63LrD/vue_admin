<template>
  <!-- 路由组件出口位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染home主页下的一级路由组件下的子路由 -->
      <component :is="Component" v-if="flag"></component>
    </transition>
  </router-view>
</template>
<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
import useLayOutSettingStore from '@/store/settings'
const layoutSettingStore = useLayOutSettingStore()
// 控制当前组件是否需要进行销毁重建
let flag = ref(true)
// 监听仓库中的数据内容是否发生变化,如果发生变化说明用户点击过刷新按钮
watch(
  () => layoutSettingStore.refsh,
  () => {
    // 点击刷新按钮，路由组件销毁
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>
<script lang="ts">
export default {
  name: 'MAIN',
}
</script>
<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-leave {
  opacity: 1;
  transform: scale(1);
}
</style>
