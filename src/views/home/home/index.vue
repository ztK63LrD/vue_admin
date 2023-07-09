<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" alt="头像图片" class="avatar" />
        <div class="bottom">
          <h3 class="title">{{ getTime() }}好呀{{ userStore.username }}</h3>
          <p class="subtitle">商品运营管理平台</p>
        </div>
      </div>
    </el-card>
    <div class="bottoms animate__animated animate__backInUp">
      <svg-icon name="welcome" width="600px" height="400px"></svg-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入用户相关的仓库，获取当前用户的头像和昵称
import useUserStore from '@/store/user'
import { getTime } from '@/utils/time'
// 获取存储用户信息的仓库对象
let userStore = useUserStore()
</script>

<style lang="scss" scoped>
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;
    .title {
      font-size: 25px;
      font-weight: 900;
      margin-bottom: 30px;
    }
    .subtitle {
      font-style: italic;
      color: #5bd4d4;
    }
  }
}
.bottoms {
  display: flex;
  margin-top: 50px;
  justify-content: center;
  align-items: center;
}
</style>
