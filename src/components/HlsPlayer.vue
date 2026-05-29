<template>
  <div class="video-container" :class="{ 'has-device': hasDevice }" :style="containerStyle">
    <!-- 当src为空时显示占位符 -->
    <div v-if="!src || src.trim() === ''" class="video-placeholder">
      <div class="placeholder-content">
        <div class="placeholder-icon">📹</div>
        <p class="placeholder-text">{{ emptyText }}</p>
      </div>
    </div>
    
    <!-- 当src存在时显示视频播放器 -->
    <video
      v-else
      ref="videoPlayer"
      class="video-player"
      :poster="poster"
    ></video>
  </div>
</template>

<script>
import Hls from 'hls.js';

export default {
  name: 'HlsPlayer',
  props: {
    src: {
      type: String,
      default: ''
    },
    poster: {
      type: String,
      default: ''
    },
    aspectRatio: {
      type: Number,
      default: null
    },
    emptyText: {
      type: String,
      default: '请先选择某个监控画面'
    },
    hasDevice: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hls: null,
      containerStyle: {}
    };
  },
  mounted() {
    this.initPlayer();
  },
  beforeUnmount() {
    this.destroyPlayer();
  },
  methods: {
    pause() {
      const video = this.$refs.videoPlayer;
      if (video) {
        video.pause();
      }
    },

    play() {
      const video = this.$refs.videoPlayer;
      if (video) {
        video.play().catch(error => {
          console.log('继续播放失败:', error);
        });
      }
    },

    initPlayer() {
      // 如果src为空，不初始化播放器
      if (!this.src || this.src.trim() === '') {
        this.setDefaultContainerStyle();
        return;
      }

      const video = this.$refs.videoPlayer;
      if (!video) return;
      
      if (Hls.isSupported()) {
        this.hls = new Hls({
          debug: false,
        });
        
        this.hls.loadSource(this.src);
        this.hls.attachMedia(video);
        
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.addEventListener('loadedmetadata', this.setDimensions);
          video.play().catch(error => {
            console.log('自动播放失败:', error);
          });
        });
        
        this.hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('网络错误');
                this.hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('媒体错误');
                this.hls.recoverMediaError();
                break;
              default:
                this.destroyPlayer();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = this.src;
        video.addEventListener('loadedmetadata', () => {
          this.setDimensions();
          video.play().catch(error => {
            console.log('自动播放失败:', error);
          });
        });
      }
    },
    
    setDimensions() {
      const video = this.$refs.videoPlayer;
      if (!video) return;
      
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      let aspectRatio = this.aspectRatio;
      if (!aspectRatio && videoWidth && videoHeight) {
        aspectRatio = videoWidth / videoHeight;
      }
      
      if (aspectRatio) {
        this.containerStyle = {
          paddingTop: `${(1 / aspectRatio) * 100}%`,
          position: 'relative'
        };
        
        video.style.position = 'absolute';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
      }
    },
    
    setDefaultContainerStyle() {
      // 当没有视频源时，设置默认的容器样式
      const aspectRatio = this.aspectRatio || 16/9; // 默认16:9比例
      this.containerStyle = {
        paddingTop: `${(1 / aspectRatio) * 100}%`,
        position: 'relative'
      };
    },
    
    destroyPlayer() {
      if (this.hls) {
        this.hls.destroy();
        this.hls = null;
      }
      
      const video = this.$refs.videoPlayer;
      if (video) {
        video.removeEventListener('loadedmetadata', this.setDimensions);
      }
    }
  },
  watch: {
    src() {
      // 先销毁之前的播放器
      this.destroyPlayer();
      
      // 等待DOM更新后重新初始化
      this.$nextTick(() => {
        this.initPlayer();
      });
    }
  }
};
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  /* 16:9宽高比的容器 */
  padding-top: 53.15%; /* 9/16 = 0.5625 */
  overflow: hidden;
}

.video-container.has-device {
  background-color: #000;
}

.video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill; /* 或者使用cover，取决于你的需求 */
}
.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #f5f5f5;
  border: 2px dashed #ddd; */
  border-radius: 8px;
}

.video-container.has-device .video-placeholder {
  background-color: #000;
}

.placeholder-content {
  text-align: center;
  color: #fff;
}

.placeholder-icon {
  font-size: 80px;
  margin-bottom: 12px;
}

.placeholder-text {
  font-size: 16px;
  margin: 0;
  /* font-weight: 500; */
}
</style>
