<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名：">
          <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
          <el-button type="primary" size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
      <el-button type="danger" :disabled="selectIdArr.length ? false : true" @click="deleteSelectUser">
        批量删除
      </el-button>
      <!-- 表格展示用户信息 -->
      <el-table @selection-change="selectChange" style="margin: 10px 0px" border :data="userArr">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="序号" align="center" type="index"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="320px" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="default" icon="User" @click="setRole(row)">分配角色</el-button>
            <el-button type="primary" size="default" icon="Edit" @click="updateUser(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.username}?`" width="200px" @confirm="deleteUser(row.id)">
              <template #reference>
                <el-button type="primary" size="default" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5, 7, 9, 11]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getHasUser"
        @size-change="handler"
      />
    </el-card>
    <!-- 抽屉结构：完成添加或修改新的用户账号信息 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
              全选
            </el-checkbox>
            <!-- 显示职位的复选框 -->
            <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/settings'
import { ref, onMounted, reactive, nextTick } from 'vue'
// 引入接口函数
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllrole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user'
// 引入ts类型
import type { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
// 当前的页码值
let pageNo = ref<number>(1)
// 页码展示的数据
let pageSize = ref<number>(5)
// 用户的总个数
let total = ref<number>(0)
// 存储全部用户的数组
let userArr = ref<Records>([])
// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 控制分配角色抽屉的显示与隐藏
let drawer1 = ref<boolean>(false)
// 收集响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
// 获取组件实例
let formRef = ref<any>()
// 全选复选框收集数据:是否全选
let checkAll = ref<boolean>(false)
// 设置不确定状态,仅负责样式控制
let isIndeterminate = ref<boolean>(true)
// 设置所有职位的名称
let allRole = ref<AllRole>([])
// 已有职位的数据
let userRole = ref<AllRole>([])
// 准备一个数组存储批量删除的用户ID
let selectIdArr = ref<User[]>([])
// 收集用户输入进来的关键字
let keyword = ref<string>('')
// 获取仓库对象
let settingStore = useLayOutSettingStore()

// 组件挂载完毕执行函数
onMounted(() => {
  getHasUser()
})
// 获取全部已有的信息
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
// 更新当前页码能够显示的条数
const handler = () => {
  getHasUser()
}
// 添加用户按钮的回调
const addUser = () => {
  // 抽屉显示出来
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    username: '',
    name: '',
    password: '',
    id: 0,
  })
  // 清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
// 更新已有用户按钮的回调
const updateUser = (row: User) => {
  // 抽屉显示出来
  drawer.value = true
  // 存储收集已有的账号信息
  Object.assign(userParams, row)
  // 清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}
// 取消按钮的回调
const cancel = () => {
  // 抽屉隐藏
  drawer.value = false
}
// 保存按钮的回调
const save = async () => {
  // 点击保存按钮的时候,务必需要保证表单全部符合条件再去发起请求
  await formRef.value.validate()
  // 保存按钮：添加|修改已有的用户账号信息
  let result = await reqAddOrUpdateUser(userParams)
  // 添加或更新成功
  if (result.code == 200) {
    drawer.value = false // 抽屉关闭
    // 提示消息
    ElMessage({ type: 'success', message: userParams.id ? '更新成功' : '添加成功' })
    // 获取最新的全部账号信息
    getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新一次
    // window.location.reload()
  } else {
    drawer.value = false // 抽屉关闭
    // 提示消息
    ElMessage({ type: 'error', message: userParams.id ? '更新失败' : '添加失败' })
  }
}
// 校验用户名字的回调函数
const validatorUsername = (_rule: any, value: any, callback: any) => {
  // 用户名字|昵称，长度至少五位
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户的名称至少五位！'))
  }
}
// 校验用户名称的回调函数
const validatorName = (_rule: any, value: any, callback: any) => {
  // 用户名字|昵称，长度至少五位
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户的昵称至少五位！'))
  }
}
// 校验密码的回调函数
const validatorPassword = (_rule: any, value: any, callback: any) => {
  // 用户名字|昵称，长度至少五位
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('用户的密码至少六位！'))
  }
}

// 表单校验的规则对象
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  // 用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  // 密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
// 分配角色按钮的回调
const setRole = async (row: User) => {
  // 数据合并
  Object.assign(userParams, row)
  // 获取全部的职位的数据与当前用户已有的职位的数据
  let result: AllRoleResponseData = await reqAllrole(userParams.id as number)
  if (result.code == 200) {
    // 存储全部职位
    allRole.value = result.data.allRolesList
    // 存储当前用户已有的职位
    userRole.value = result.data.assignRoles
    // 抽屉显示出来
    drawer1.value = true
  }
}
// 全选复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
// 底部复选框事件
const handleCheckedCitiesChange = (value: string[]) => {
  // 已经勾选的这些项目的长度
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  // 顶部的复选框不确定的样式
  isIndeterminate.value = !(checkedCount === allRole.value.length)
}
// 确定按钮回调(分配职位)
const confirmClick = async () => {
  // 收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  // 分配用户职位
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    // 提示信息
    ElMessage({ type: 'success', message: '分配职位成功！' })
    // 关闭抽屉
    drawer1.value = false
    // 获取更新后的数据，更新完毕留在当前页
    getHasUser(pageNo.value)
  }
}
// 删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功！' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '删除失败！' })
  }
}
// table复选框勾选的时候会触发的事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}
// 批量删除
const deleteSelectUser = async () => {
  // 整理批量删除的参数
  let idsList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  // 批量删除的请求
  let result: any = await reqSelectUser(idsList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功！' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
// 搜索按钮的回调
const search = () => {
  // 根据关键字获取相应的数据
  getHasUser()
  // 清空关键字
  keyword.value = ''
}
// 重置按钮
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
