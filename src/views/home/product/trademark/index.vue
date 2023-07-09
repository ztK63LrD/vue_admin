<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加按钮 -->
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark" v-has="`btn.Trademark.add`">
        添加品牌
      </el-button>
      <!-- 表格组件，用于展示已有的平台数据 -->
      <el-table style="margin: 10px 0px" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <!-- <el-table-column label="品牌名称" prop="tmName"></el-table-column> -->
        <el-table-column label="品牌名称">
          <template #default="{ row }">
            <pre style="color: brown">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌Logo">
          <template #default="{ row }">
            <img :src="row.logoUrl" alt="图片不存在" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
            <el-popconfirm
              :title="`您确定要删除${row.tmName}吗？`"
              width="250px"
              icon="Delete"
              @confirm="removeTradeMark(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件 -->
      <el-pagination
        @current-change="hasTrademark"
        @size-change="sizeChange"
        :pager-count="9"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        background
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
      />
    </el-card>
    <!-- 对话框组件：在添加品牌和修改已有品牌的业务时侯使用该结构 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="92px" prop="tmName">
          <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="92px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽：设置相关按钮 -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
// 引入ts类型
import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type'
import { ElMessage, UploadProps } from 'element-plus'

// 当前的页码
let pageNo = ref<number>(1)
// 每页展示多少条数据
let limit = ref<number>(3)
// 获取数据的总量
let total = ref<number>(0)
// 获取存放数据的数组
let trademarkArr = ref<Records>([])
// 控制对话框的显示与隐藏
let dialogFormVisible = ref<boolean>(false)
// 定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
// 获取el-form组件实例
let formRef = ref()

// 获取已有品牌的接口数据
const hasTrademark = async (pager = 1) => {
  // 未传递参数时，让当前的页数默认为1
  pageNo.value = pager
  const result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code === 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
// 组件一挂载就执行
onMounted(() => {
  hasTrademark()
})
// 当下拉菜单发生变化时触发该方法
const sizeChange = () => {
  hasTrademark()
}
// 添加品牌按钮的回调
const addTrademark = () => {
  // 对话框显示
  dialogFormVisible.value = true
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0
  // 清除表单校验规则
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
}
// 修改已有品牌数据的回调
const updateTrademark = (row: TradeMark) => {
  // 清除表单校验规则
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  // 对话框显示
  dialogFormVisible.value = true
  // // 展示已有品牌的数据
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  // 使用ES6合并语法
  Object.assign(trademarkParams, row)
}
// 对话框底部取消按钮
const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
  // 收集数据清空
}
// 对话框底部确定按钮
const confirm = async () => {
  // 在发请求之前，要对整个表单进行校验
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  // 添加品牌成功
  if (result.code == 200) {
    // 对话框隐藏
    dialogFormVisible.value = false
    // 弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 再次发请求获取已有全部的品牌数据
    hasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    // 添加品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
  }
}
// 删除按钮的回调
const removeTradeMark = async (id: number) => {
  // 点击确定按钮删除已有品牌请求
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    // 再次发请求获取已有全部的品牌数据
    hasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
// 上传图片组件，钩子是在图片上传成功之前触发，上传文件之前可以约束文件类型与大小
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/gif' ||
    rawFile.type == 'image/jpeg'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小应小于4M',
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF|JPEG',
    })
    return false
  }
}
// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  // 收集图片的地址
  trademarkParams.logoUrl = response.data
  // 图片上传成功后，清除掉对应的图片校验信息
  formRef.value.clearValidate('logoUrl')
}
// 品牌自定义校验规则(文字)
const validatorTmName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    // 校验未通过返回的错误信息
    callback(new Error('品牌名称位数必须大于等于俩位'))
  }
}
// 品牌自定义校验规则(图片)
const validatorLogoUrl = (_rule: any, value: any, callback: any) => {
  // 如果图片上传
  if (value) {
    callback()
  } else {
    callback(new Error('LOGO图片务必上传！'))
  }
}
// 设置表单校验规则对象
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, trigger: 'change', validator: validatorLogoUrl }],
}
</script>
<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
::v-deep .el-form-item__label {
  justify-content: left;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
