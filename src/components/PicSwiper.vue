<template>
  <div class="picSwiper">
    <!-- 主视图区域 -->
    <div class="main-swiper swiper" ref="mainSwiper" v-if="showParent">
      <div class="swiper-wrapper">
        <div v-for="(image, index) in images" :key="index" class="swiper-slide">
          <!-- <div class="img-container"> -->
          <img v-if="image" :src="image" :alt="`Image ${index + 1}`" @load="onImageLoad" @error="onImageError" />
          <div v-else class="img-placeholder">
            <slot name="placeholder" :index="index">
              <div class="default-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
            </slot>
          </div>
          <!-- </div> -->
        </div>
      </div>
      <div v-if="showNavigation" class="swiper-button-next"></div>
      <div v-if="showNavigation" class="swiper-button-prev"></div>
      <div v-if="showPagination" class="swiper-pagination"></div>
    </div>
    <div style="flex: 1;" v-else></div>
    <!-- 缩略图区域 -->
    <div v-if="showThumbnails" class="thumbnail-container" :class="thumbnailPosition">
      <div class="thumb-swiper swiper" ref="thumbSwiper">
        <div class="swiper-wrapper">
          <div v-for="(image, index) in images" :key="index" class="swiper-slide"
            :class="{ 'swiper-slide-thumb-active': index === activeIndex }">
            <div class="thumb-container">
              <img v-if="image" :src="image" :alt="`Thumbnail ${index + 1}`" @click="goToSlide(index)" />
              <div v-else class="img-placeholder" @click="goToSlide(index)">
                <slot name="thumbnail-placeholder" :index="index">
                  <div class="default-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </div>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PicSwiper',
  props: {
    showParent: {
      type: Boolean,
      default: true
    },
    // 图片数组
    images: {
      type: Array,
      default: () => []
    },
    // 是否显示缩略图
    showThumbnails: {
      type: Boolean,
      default: true
    },
    // 缩略图位置 'bottom' | 'right' | 'left'
    thumbnailPosition: {
      type: String,
      default: 'bottom',
      // validator: value => ['bottom', 'right', 'left'].includes(value)
    },
    // 是否显示导航按钮
    showNavigation: {
      type: Boolean,
      default: true
    },
    // 是否显示分页器
    showPagination: {
      type: Boolean,
      default: false
    },
    // 自动播放配置
    autoplay: {
      type: [Boolean, Object],
      default: false
    },
    // 主轮播配置
    mainSwiperOptions: {
      type: Object,
      default: () => ({})
    },
    // 缩略图轮播配置
    thumbSwiperOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      mainSwiper: null,
      thumbSwiper: null,
      activeIndex: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initSwipers()
    })
  },
  beforeDestroy() {
    if (this.mainSwiper) {
      this.mainSwiper.destroy(true, true)
    }
    if (this.thumbSwiper) {
      this.thumbSwiper.destroy(true, true)
    }
  },
  watch: {
    images: {
      handler() {
        this.$nextTick(() => {
          this.updateSwipers()
        })
      },
      deep: true
    }
  },
  methods: {
    initSwipers() {
      if (typeof Swiper === 'undefined') {
        console.error('Swiper is not loaded. Please include Swiper.js library.')
        return
      }
      if (this.showParent && this.$refs.mainSwiper) {
        // 初始化主轮播
        const mainOptions = {
          spaceBetween: 10,
          observer: true,  //开启动态检查器，监测swiper和slide
          observeParents: true,
          navigation: this.showNavigation ? {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          } : false,
          pagination: this.showPagination ? {
            el: '.swiper-pagination',
            clickable: true,
          } : false,
          autoplay: this.autoplay,
          on: {
            slideChange: (swiper) => {
              this.activeIndex = swiper.activeIndex
              this.syncThumbnail()
              this.$emit('slide-change', swiper.activeIndex)
            }
          },
          ...this.mainSwiperOptions
        }

        this.mainSwiper = new Swiper(this.$refs.mainSwiper, mainOptions)
      }
      // 初始化缩略图轮播
      if (this.showThumbnails && this.$refs.thumbSwiper) {
        const thumbOptions = {
          spaceBetween: 10,
          slidesPerView: 4,
          watchSlidesProgress: true,
          slideToClickedSlide: true,
          observer: true,  //开启动态检查器，监测swiper和slide
          observeParents: true,
          thumbs: {
            swiper: this.mainSwiper,
          },
          ...this.thumbSwiperOptions
        }

        this.thumbSwiper = new Swiper(this.$refs.thumbSwiper, thumbOptions)
      }
    },
    updateSwipers() {
      if (this.mainSwiper) {
        this.mainSwiper.update()
      }
      if (this.thumbSwiper) {
        this.thumbSwiper.update()
      }
    },
    syncThumbnail() {
      if (this.thumbSwiper && this.activeIndex < this.images.length) {
        this.thumbSwiper.slideTo(this.activeIndex)
      }
    },
    goToSlide(index) {
      this.activeIndex = index
      if (this.mainSwiper) {
        this.mainSwiper.slideTo(index)
      }
      this.$emit('thumbnail-click', index)
    },
    onImageLoad(event) {
      this.$emit('image-load', event)
    },
    onImageError(event) {
      this.$emit('image-error', event)
    },
    // 公共方法
    next() {
      if (this.mainSwiper) {
        this.mainSwiper.slideNext()
      }
    },
    prev() {
      if (this.mainSwiper) {
        this.mainSwiper.slidePrev()
      }
    },
    slideTo(index) {
      this.goToSlide(index)
    }
  }
}
</script>
<style lang="scss" scoped>
.thumb-swiper .active {

  border-color: #00c3ff;

  img {
    opacity: 1;
  }
}

.thumbnail-container {
  padding: 0;
}
</style>
<!-- <style scoped>
.pic-swiper {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* 主轮播样式 */
.main-swiper {
  width: 100%;
  flex: 1;
  margin-bottom: 10px;
}

.main-swiper .swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
}

.img-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
  color: #ccc;
}

.default-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 缩略图容器样式 */
.thumbnail-container {
  width: 100%;
}

.thumbnail-container.bottom {
  margin-top: 10px;
}

.thumbnail-container.right {
  position: absolute;
  right: 0;
  top: 0;
  width: 120px;
  height: 100%;
  margin-left: 10px;
}

.thumbnail-container.left {
  position: absolute;
  left: 0;
  top: 0;
  width: 120px;
  height: 100%;
  margin-right: 10px;
}

/* 缩略图轮播样式 */
.thumb-swiper {
  width: 100%;
  height: 80px;
}

.thumbnail-container.right .thumb-swiper,
.thumbnail-container.left .thumb-swiper {
  height: 100%;
}

.thumb-swiper .swiper-slide {
  width: auto;
  height: 100%;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.thumb-swiper .swiper-slide.active {
  opacity: 1;
}

.thumb-swiper .swiper-slide:hover {
  opacity: 0.8;
}

.thumb-container {
  width: 80px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
}

.thumb-swiper .swiper-slide.active .thumb-container {
  border-color: #007bff;
}

.thumb-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-container .img-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  color: #ccc;
}

/* 响应式布局调整 */
@media (max-width: 768px) {
  .thumbnail-container.right,
  .thumbnail-container.left {
    position: relative;
    width: 100%;
    height: 80px;
    margin: 10px 0 0 0;
  }
  
  .main-swiper {
    height: 300px;
  }
}

/* Swiper导航按钮样式 */
.swiper-button-next,
.swiper-button-prev {
  color: #007bff;
}

.swiper-button-next:after,
.swiper-button-prev:after {
  font-size: 18px;
}

/* Swiper分页器样式 */
.swiper-pagination-bullet {
  background: #007bff;
}
</style> -->