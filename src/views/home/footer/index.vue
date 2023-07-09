<template>
  <div class="footer">
    <div class="main">
      author：
      <span style="color: red">亦世凡华、</span>
      &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目详情：
      <a href="https://blog.csdn.net/qq_53123067/category_11818711.html?spm=1001.2014.3001.5482" target="_blank">
        点击跳转项目源文章讲解页面
      </a>
      &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目竣工：
      <span>2023-7-9</span>
    </div>
    <div class="svg">
      <svg-icon name="bg" width="1400px" height="100px"></svg-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  position: relative;
  .main {
    position: relative; /* 添加定位属性 */
    text-align: center;
    line-height: $base-tabbar-height;
    font-size: 18px;
    z-index: 1;
    a {
      text-decoration: none; /* 去除下划线 */
      color: rgb(1, 32, 1); /* 继承父元素颜色，或者自定义链接颜色 */
    }
    a:hover {
      text-decoration: underline; /* 添加下划线 */
      color: red; /* 更改链接颜色 */
    }
    a:active {
      color: rgb(33, 11, 161); /* 更改链接颜色 */
    }
  }
  .svg {
    position: absolute; /* 修改为绝对定位 */
    top: 0; /* 调整位置，使其重叠 */
    left: 0; /* 调整位置，使其重叠 */
    z-index: 0; /* 修改为较小的层叠顺序 */
  }
}
</style>
