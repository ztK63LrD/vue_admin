<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { reqLogin } from './api/user'
// 当组件挂载完毕时
onMounted(() => {
  reqLogin({ username: 'admin', password: '111111' })
})
</script>

<style lang="less" scoped></style>
