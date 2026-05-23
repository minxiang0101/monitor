<template>
  <div class="swiper-scroll-container" :style="containerStyle">
    <div class="swiper" ref="swiper" :data-direction="swiperDirection">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in duplicatedData" :key="`slide-${index}`">
          <slot :item="item" :index="index % originalLength"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SwiperScroll',
  props: {
    // 滚动数据
    data: {
      type: Array,
      default: () => []
    },
    // 滚动方向：1-向上，2-向下，3-向左，4-向右
    direction: {
      type: Number,
      default: 1
    },
    // 滚动速度
    speed: {
      type: Number,
      default: 3000
    },
    // 每次滚动步长
    step: {
      type: Number,
      default: 1
    },
    // 鼠标悬停时是否停止
    hoverStop: {
      type: Boolean,
      default: true
    },
    // 等待时间（毫秒）
    waitTime: {
      type: Number,
      default: 3000
    },
    // 限制移动数量
    limitMoveNum: {
      type: Number,
      default: 3
    },
    // 容器高度
    height: {
      type: String,
      default: 'auto'
    },
    // 容器宽度
    width: {
      type: String,
      default: '100%'
    },
    // slide间距
    spaceBetween: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      swiper: null,
      autoplayTimer: null,
      isHovered: false,
      originalLength: 0
    }
  },
  computed: {
    // 获取滚动方向配置
    swiperDirection() {
      return this.direction === 3 || this.direction === 4 ? 'horizontal' : 'vertical'
    },
    // 容器样式
    containerStyle() {
      return {
        height: this.height,
        width: this.width,
        overflow: 'hidden'
      }
    },
    // 复制数据以实现无缝滚动
    duplicatedData() {
      if (!this.data || this.data.length === 0) return []
      this.originalLength = this.data.length
      // 复制数据以实现无缝循环
      const duplicateCount = Math.max(3, this.limitMoveNum)
      const result = []
      for (let i = 0; i < duplicateCount; i++) {
        result.push(...this.data)
      }
      return result
    }
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this.initSwiper()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initSwiper()
    })
  },
  beforeDestroy() {
    this.destroySwiper()
  },
  methods: {
    // 初始化Swiper
    initSwiper() {
      if (this.swiper) {
        this.destroySwiper()
      }
      
      if (!this.data || this.data.length === 0) return
      
      const config = {
        direction: this.swiperDirection,
        loop: true,
        speed: 1000,
        slidesPerView: this.limitMoveNum,
        spaceBetween: this.spaceBetween,
        autoplay: {
          delay: this.waitTime,
          disableOnInteraction: false,
          reverseDirection: this.direction === 2 || this.direction === 4
        },
        on: {
          init: () => {
            this.setupHoverEvents()
          }
        }
      }
      
      this.swiper = new Swiper(this.$refs.swiper, config)
    },
    
    // 设置鼠标悬停事件
    setupHoverEvents() {
      if (!this.hoverStop || !this.$refs.swiper) return
      
      const container = this.$refs.swiper
      
      container.addEventListener('mouseenter', () => {
        this.isHovered = true
        if (this.swiper && this.swiper.autoplay) {
          this.swiper.autoplay.stop()
        }
      })
      
      container.addEventListener('mouseleave', () => {
        this.isHovered = false
        if (this.swiper && this.swiper.autoplay) {
          this.swiper.autoplay.start()
        }
      })
    },
    
    // 销毁Swiper实例
    destroySwiper() {
      if (this.swiper) {
        this.swiper.destroy(true, true)
        this.swiper = null
      }
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer)
        this.autoplayTimer = null
      }
    },
    
    // 重置滚动
    reset() {
      this.$nextTick(() => {
        this.initSwiper()
      })
    },
    
    // 开始滚动
    start() {
      if (this.swiper && this.swiper.autoplay) {
        this.swiper.autoplay.start()
      }
    },
    
    // 停止滚动
    stop() {
      if (this.swiper && this.swiper.autoplay) {
        this.swiper.autoplay.stop()
      }
    }
  }
}
</script>

<style scoped>
.swiper-scroll-container {
  position: relative;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-wrapper {
  display: flex;
}

.swiper-slide {
  flex-shrink: 0;
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
}

/* 垂直滚动时的样式 */
.swiper[data-direction="vertical"] .swiper-wrapper {
  flex-direction: column;
}

.swiper[data-direction="vertical"] .swiper-slide {
  width: 100%;
  height: auto;
}

/* 水平滚动时的样式 */
.swiper[data-direction="horizontal"] .swiper-wrapper {
  flex-direction: row;
}

.swiper[data-direction="horizontal"] .swiper-slide {
  width: auto;
  height: 100%;
}
</style>