<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录的表单 -->
        <el-form
          class="login_form animate__animated animate__backInDown"
          :model="loginForm"
          :rules="rules"
          ref="login_Form"
        >
          <h1>欢迎来到后台管理系统</h1>
          <el-form-item prop="username">
            <el-input
              class="input"
              :prefix-icon="User"
              v-model="loginForm.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              class="input"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              type="password"
              show-password
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login_btn" type="primary" :loading="loading" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import 'animate.css'

import { User, Lock } from '@element-plus/icons-vue'
// 引入用户信息相关数据的pinia仓库
import userUserStore from '@/store/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { reactive, ref } from 'vue'
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'

// 收集表单数据
let loginForm = reactive({
  username: 'admin',
  password: 'atguigu123',
})
// 获取el-form组件
let login_Form = ref()
let userStore = userUserStore()
// 获取路由器
let $router = useRouter()
// 获取路由对象
let $route = useRoute()
// 定义变量控制按钮加载效果
let loading = ref(false)

// 登录按钮点击事件
const login = async () => {
  // 保证全部表单项校验通过再发请求
  await login_Form.value.validate()
  // 开始加载按钮loading效果
  loading.value = true
  try {
    await userStore.userLogin(loginForm)
    // 编程式导航跳转到首页
    // 判断登录页面路由路径中是否有query参数，如果有就往query参数跳转，没有就跳转到首页
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    if (ElNotification) {
      ElNotification.closeAll()
    }
    // 登录成功的提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来！',
      title: `HI,${getTime()}好`,
    })
    // 登录成功加载效果消失
    loading.value = false
  } catch (error) {
    // 登录失败加载效果消失
    loading.value = false
    if (ElNotification) {
      ElNotification.closeAll()
    }
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 监听页面回车键的点击
window.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    login()
  }
})

// 自定义校验用户名规则的函数
const validatorUserName = (_rule: any, value: any, callback: any) => {
  if (value.length < 5) {
    callback(new Error('用户名长度不能少于5位'))
  } else if (value.length > 10) {
    callback(new Error('用户名长度不能超过10位'))
  } else {
    callback()
  }
}
const validatorPassWord = (_rule: any, value: any, callback: any) => {
  if (value.length < 5) {
    callback(new Error('密码长度不能少于5位'))
  } else if (value.length > 10) {
    callback(new Error('密码长度不能超过10位'))
  } else {
    callback()
  }
}

// 定义表单校验对象
const rules = {
  username: [{ trigger: 'blur', validator: validatorUserName }],
  password: [{ trigger: 'blur', validator: validatorPassWord }],
}
</script>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/bg1.jpg') no-repeat;
  background-size: cover; // 调整背景图片的大小，使其填充整个元素背景，并尽可能保持比例不失真

  .login_form {
    position: relative;
    top: 30vh;
    height: 300px;
    width: 60%;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 15px 25px rgba(50, 10, 10, 0.65);
    border-radius: 10px;
    padding: 40px;
  }

  h1 {
    font-size: 30px;
    text-align: center;
    color: white;
    margin: 25px auto 40px;
  }

  .input {
    font-size: 15px;
    height: 38px;
    margin-bottom: 10px;
  }

  .login_btn {
    position: relative;
    height: 40px;
    font-size: 14px;
    color: #fff;
    margin: 20px auto;
    width: 80%;
    background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
    border-radius: 30px;
    z-index: 1;

    &:hover {
      animation: ani 8s linear infinite;
      height: 40px;
      border: none;
    }

    @keyframes ani {
      0% {
        background-position: 0%;
      }

      100% {
        background-position: 400%;
      }
    }

    &:before {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      z-index: -1;
      background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
      background-size: 400%;
      border-radius: 35px;
      transition: 1s;
    }

    &:hover::before {
      filter: blur(20px);
    }

    &:active {
      background: linear-gradient(32deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
    }
  }
}
</style>
