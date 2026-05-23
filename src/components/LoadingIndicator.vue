<template>
  <div class="loading-indicator">
    <div class="spinner"></div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingIndicator',
  props: {
    message: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style scoped>
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  /* background-color: rgba(255, 255, 255, 0.1);  */
  z-index: 10;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff; /* Spinner color */
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

p {
  color: #fff; /* Text color */
  font-size: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>