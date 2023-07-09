<template>
  <div>
    <el-table :data="PermisstionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" :disabled="row.level == 4 ? true : false" @click="addPermisstion(row)">
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="row.level == 1 ? true : false"
            @click="updatePermisstion(row)"
          >
            编辑
          </el-button>
          <el-popconfirm :title="`你确定要删除${row.name}？`" width="260px" @confirm="removeMenu(row.id)">
            <template #reference>
              <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框组件：添加或更新已有的菜单的数据结构 -->
    <el-dialog v-model="dislogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'">
      <!-- 表单组件：收集新增与已有的菜单的数据 -->
      <el-form>
        <el-form-item label="名称">
          <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input placeholder="请你输入权限数值" v-model="menuData.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dislogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
// 引入获取菜单请求的API
import { reqAllPermisstion, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
// 引入ts类型
import type { PermissionResponseData, PermissionList, Permission, MenuParams } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'
// 存储菜单数据
let PermisstionArr = ref<PermissionList>([])
// 控制对话框的显示与隐藏
let dislogVisible = ref<boolean>(false)
// 携带的对象
let menuData = reactive<MenuParams>({
  id: 0,
  code: '',
  level: 0,
  name: '',
  pid: 0,
})

// 组件挂载完毕
onMounted(() => {
  getHasPermisstion()
})
// 获取菜单数据的方法
const getHasPermisstion = async () => {
  let result: PermissionResponseData = await reqAllPermisstion()
  if (result.code == 200) {
    PermisstionArr.value = result.data
  }
}
// 添加菜单按钮的回调
const addPermisstion = (row: Permission) => {
  // 清空数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  dislogVisible.value = true // 对话框显示
  // 收集新增菜单的level值
  menuData.level = row.level + 1
  // 给谁新增子菜单
  menuData.pid = row.id as number
}
// 编辑已有的菜单
const updatePermisstion = (row: Permission) => {
  dislogVisible.value = true // 对话框显示
  // 点击修改按钮：收集已有的菜单的数据进行更新
  Object.assign(menuData, row)
}
// 确定按钮的回调
const save = async () => {
  let result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    dislogVisible.value = false // 对话框隐藏
    // 提示消息
    ElMessage({ type: 'success', message: menuData.id ? '更新成功' : '添加成功' })
    // 再次获取全部数据
    getHasPermisstion()
  }
}
// 删除按钮的回调
const removeMenu = async (id: number) => {
  let result: any = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    // 再次获取数据
    getHasPermisstion()
  }
}
</script>

<style lang="scss" scoped></style>
