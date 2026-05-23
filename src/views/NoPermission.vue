<template>
  <div class="no-permission">
    <div class="no-permission-container">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
        </svg>
      </div>
      <h1>访问受限</h1>
      <p>抱歉，您没有权限访问此页面</p>
      <div class="actions" v-if="roles && Object.keys(roles).length > 0">
        <el-button @click="goHome" type="primary" v-if="roles.isVideo === 1">回到视频监控</el-button>
      </div>
      <div v-else>
        <el-button  type="primary"  @click="choseUser">切换账号</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'NoPermission',
  computed: {
    ...mapGetters(['roles'])
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goHome() {
      this.$router.push('/video')
    },
    choseUser() {
       this.$store.dispatch('logout').then(() => {
        this.$router.push('/login')
      }).catch(err => {
        console.error('切换账号失败:', err);
        this.$message.error('切换账号失败，请稍后再试');
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.no-permission {
  position: relative;
  z-index: 3;
  height: calc(100% - 110px);
  margin-top: -30px;
  display: flex;
  align-items: center;
  justify-content: center;
  // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .no-permission-container {
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 60px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    max-width: 500px;
    
    .icon {
      margin-bottom: 30px;
      
      svg {
        animation: pulse 2s infinite;
      }
    }
    
    h1 {
      font-size: 32px;
      color: #333;
      margin-bottom: 16px;
      font-weight: 600;
    }
    
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 40px;
      line-height: 1.6;
    }
    
    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .no-permission {
    padding: 20px;
    
    .no-permission-container {
      padding: 40px 20px;
      
      h1 {
        font-size: 24px;
      }
      
      .actions {
        flex-direction: column;
        align-items: center;
        
        .el-button {
          width: 200px;
        }
      }
    }
  }
}
</style>