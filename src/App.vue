<template>
  <div id="app" class="wrapper" :style="{ backgroundImage: `url(${bgImg})` }"
    :class="$route.name !== 'login' && $route.name !== 'home' ? 'index' : ''">
    <top-nav v-if="$route.name !== 'login' && $route.name !== 'home'" />
    <router-view ref="content" />
  </div>
</template>
<script>
import TopNav from './components/TopNav.vue'
import { mapGetters } from 'vuex';
import { getFileUrl } from '@/api/safety'
export default {
  name: 'App',
  components: {
    TopNav
  },
  computed: {
    ...mapGetters(['projectInfo', 'project'])
  },
  watch: {
    projectInfo(val) {
      this.inPic()
    },
    project: {
      handler(newProject) {
        if (newProject && newProject.projectName) {
          document.title = newProject.projectName + " - 智慧工地指挥中心"
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      bgImg: '',
    }
  },
  mounted() {
    // this.inPic()
    this.doOnResize();
    window.addEventListener('resize', this.doOnResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.doOnResize);
  },
  methods: {
    getimg(e) {
      return `${process.env.VUE_APP_BASE_API}/qdoner${e}`
    },
    async inPic() {
      if (this.projectInfo?.planBatchId) {
        let res = await getFileUrl(this.projectInfo?.planBatchId).then(res => res.data)
        if (res.length > 0) {
          this.bgImg = res[0].url.startsWith('http') ? res[0].url : process.env.VUE_APP_BASE_API + '/qdoner' + res[0].url
        } else {
          this.bgImg = '/dp/images/bg.jpg'
        }
      }
    },
    doOnResize() {
      var width = window.innerWidth;
      var zoomScale = width / 1920;

      var container = document.querySelector('.wrapper');
      container.style.position = 'relative';
      container.style.transformOrigin = '0 0';
      container.style.webkitTransform = 'scale(' + zoomScale + ')';
      container.style.mozTransform = 'scale(' + zoomScale + ')';
      container.style.msTransform = 'scale(' + zoomScale + ')';
      container.style.oTransform = 'scale(' + zoomScale + ')';
      container.style.transform = 'scale(' + zoomScale + ')';
    }
  }
}
</script>
<style lang="scss"></style>
