<template>
  <div class="students-container">
    <div class="page-header">
      <div class="header-content">
        <h2>Students</h2>
        <p>Manage student accounts</p>
      </div>
    </div>
    
    <el-card>
      <el-empty description="Students management coming soon">
        <el-button type="primary">Coming Soon</el-button>
      </el-empty>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.students-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 1.8rem;
}

.header-content p {
  margin: 0;
  color: #606266;
  font-size: 0.9rem;
}
</style> 