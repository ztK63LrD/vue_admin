<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c1Id" @change="handler">
          <!-- option中label即为显示文字  value属性即为select下拉菜单收集的数据 -->
          <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c2Id" @change="handler1">
          <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c3Id">
          <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// 引入分类相关的仓库
import useCategoryStore from '@/store/category'
let categoryStore = useCategoryStore()

// 通知仓库获取一级分类的方法
const getC1 = async () => {
  // 通知分类仓库发请求获取一级分类的数据
  categoryStore.getC1()
}
// 组件挂载完毕
onMounted(() => {
  // 获取一级分类的数据
  getC1()
})

// 一级分类下拉菜单的change事件(选中值的时候会触发，保证有一级分类ID)
const handler = () => {
  // 需要先将二级、三级分类的数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  // 通知仓库获取二级分类的数据
  categoryStore.getC2()
}
// 二级分类下拉菜单的change事件(选中值的时候会触发，保证有二级分类ID)
const handler1 = () => {
  // 需要先将三级分类的数据清空
  categoryStore.c3Id = ''
  // 通知仓库获取二级分类的数据
  categoryStore.getC3()
}
// 接收父组件传递过来的场景值
defineProps(['scene'])
</script>

<style scoped></style>
