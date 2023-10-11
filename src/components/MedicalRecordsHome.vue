<template>
  <div class="medical-records-home">
    <h1>Welcome to Medical Records Home, {{ username }}!</h1>
    <!-- 你可以在这里添加更多的内容和功能 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: 'User',  // 这里可以根据实际情况获取真实的用户名
    };
  },
  // 在 mounted 钩子中，你可以添加代码来获取用户的病历数据或其他信息
  mounted() {
    // 示例：获取用户名
    // this.username = this.$route.params.username;  // 假设用户名是通过路由参数传递的
  },
};
</script>

<style scoped>
/* 你可以在这里添加 CSS 样式来美化页面 */
.medical-records-home {
  padding: 20px;
}

h1 {
  color: #333;
}
</style>
