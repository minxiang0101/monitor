<template>
  <div class="main">
    <div class="main-center ar-monitoring">
      <Box style="flex: 1;">
        <template #content>
          <div class="box-con ar-iframe-container">
            <iframe 
              v-if="arUrl"
              :src="arUrl" 
              frameborder="0" 
              class="ar-iframe"
              allowfullscreen
            ></iframe>
            <div v-else class="no-ar-content">
              <p>AR监控暂不可用</p>
            </div>
          </div>
        </template>
      </Box>
    </div>
  </div>
</template>

<script>
import Box from '@/components/box.vue'
import { getArUrl } from '@/api/index'

export default {
  components: {
    Box
  },
  name: 'ARMonitoring',
  data() {
    return {
      arUrl: ''
    }
  },
  mounted() {
    this.getArUrl()
  },
  methods: {
    async getArUrl() {
      try {
        const response = await getArUrl();
        this.arUrl = response.data || '';
      } catch (error) {
        console.error('获取AR监控URL失败:', error);
        this.arUrl = '';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ar-monitoring {
  width: 100%;
  height: 100%;
}

.ar-iframe-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .ar-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  .no-ar-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #999;
    font-size: 16px;
  }
}
</style>
