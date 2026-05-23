<template>
  <div class="wrapper index">
    <top-nav />
    <div class="main">
      <div class="main-left">
        <!-- 项目信息 -->
        <Box>
          <template #content>
            <div class="box-tit"><span>项目信息</span></div>
            <div class="box-con"
              :style="{ maxHeight: projectMore ? '855px' : '153px', overflow: 'hidden', overflowY: projectMore ? 'auto' : 'hidden' }">
              <div class="list">
                <div class="list-con">
                  <h4>{{ projectInfo.totalCost || 0 }}</h4>
                  <p>工程造价（万元）</p>
                </div>
                <div class="list-con">
                  <h4>{{ getTotalDate(projectInfo?.actualCommencementDate, projectInfo?.actualCompletionDate) || 0 }}
                  </h4>
                  <p>项目工期（天）</p>
                </div>
                <div class="list-con">
                  <h4>{{ projectInfo.totalArea || 0 }}</h4>
                  <p>建筑面积（平方米）</p>
                </div>
              </div>
              <div class="dec" @mouseover="projectMore = true" @mouseout="projectMore = false">
                <p>项目名称：<span>{{ projectInfo.projectName }}</span><em></em></p>
                <p>施工单位：<span>{{ projectInfo.companyName }}</span></p>
                <p>建设单位：<span>{{ projectInfo.constructionUnitName }}</span></p>
                <p>监理单位：<span>{{ projectInfo.investigationCompany }}</span></p>
                <p>设计单位：<span>{{ projectInfo.designCompany }}</span></p>
                <p>项目介绍：<span>{{ projectInfo.projectBrief }}</span></p>
              </div>
            </div>
          </template>
        </Box>
        <!-- 质量问题情况 -->
        <Box v-if="!projectMore">
          <template #content>
            <div class="box-tit"><span>质量问题情况</span></div>
            <div class="box-con">
              <div class="list">
                <div class="list-con">
                  <img src="../../../public/images/i-01.png" alt="">
                  <h4>{{ qualityIssues.count || 0 }}</h4>
                  <p>隐患总数</p>
                </div>
                <!-- <div class="list-con">
                <img src="../../../public/images/i-02.png" alt="">
                <h4>{{ qualityIssues.major }}</h4>
                <p>重大隐患</p>
              </div> -->
                <div class="list-con">
                  <img src="../../../public/images/i-03.png" alt="">
                  <h4>{{ qualityIssues.unfinished || 0 }}</h4>
                  <p>未整改</p>
                </div>
                <div class="list-con">
                  <img src="../../../public/images/i-04.png" alt="">
                  <h4>{{ qualityIssues.percent || 0 }}</h4>
                  <p>已整改</p>
                </div>
              </div>
            </div>
          </template>
        </Box>
        <!-- 安全隐患情况 -->
        <Box v-if="!projectMore">
          <template #content>
            <div class="box-tit"><span>安全隐患情况</span></div>
            <div class="box-con" style="height:133px">
              <safetyIssuesChart ref="safetyIssuesChart" />
            </div>
          </template>
        </Box>
        <!-- 培训情况 -->
        <Box v-if="!projectMore">
          <template #content>
            <div class="box-tit"><span>培训情况</span></div>
            <div class="box-con" style="overflow: hidden;max-height: 140px;overflow-y: auto;">
              <ul class="noice-list">
                <li v-for="(item, index) in trainingInfo" :key="index" @click="openNoticeInfo(item.path)">{{ item.name
                }}<span>{{ item.time }}</span>
                </li>
              </ul>
              <el-empty v-if="trainingInfo.length === 0" :image-size="80" style="padding:10px 0;"
                description="暂无数据"></el-empty>
            </div>
          </template>
        </Box>
      </div>
      <div class="main-center">
        <PicSwiper :images="imageList" ref="PicSwiper" :showParent="false" />

        <Box>
          <template #content>
            <div class="box-tit"><span>进度节点</span><em style="font-size:14px">总工期：{{ progressTotal?.allDate }}天</em>
            </div>
            <div class="box-con" style="overflow: hidden;overflow-x: auto;">
              <div class="progress-timeline" :style="{
                width: `${100 + Math.max(0, progressNodes.length - 6) * 20}%`
              }">
                <div v-for="(node, index) in progressNodes" :key="index"
                  :class="['timeline-node', index === 0 ? 'start' : index === progressNodes.length - 1 ? 'end' : 'phase' + index]">
                  <h4>{{ node.name }}</h4>
                  <el-tooltip placement="top">
                    <div slot="content">
                      <div v-html="formatNode(node)"></div>
                    </div>
                    <div class="node-dot"></div>
                  </el-tooltip>
                  <div class="node-info">
                    <p>计划：{{ node.planStartDate }}</p>
                    <p>实际：{{ node.actualStartDate }}</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Box>
      </div>
      <div class="main-right">
        <!-- 项目公告 -->
        <Box>
          <template #content>
            <div class="box-tit"><span>项目公告</span></div>
            <div class="box-con" style="overflow: hidden;max-height: 145px;overflow-y: auto;">
              <ul class="noice-list">
                <li v-for="(notice, index) in projectNotices" :key="index" @click="openNoticeInfo(notice.path)">{{
                  notice.name }}<span>{{ notice.time || notice.createTime
                  }}</span></li>
              </ul>
            </div>
          </template>
        </Box>
        <!-- 安保管理 -->
        <Box>
          <template #content>
            <div class="box-tit"><span>安保管理</span></div>
            <div class="box-con" style="overflow: hidden;">
              <SwiperScroll :data="securityStaff" :direction="3" :limit-move-num="3" :step="0.5" :hover-stop="true"
                :wait-time="1000" ref="securityStaff">
                <template slot-scope="{ item: staff }">
                  <div class="abgl-item">
                    <img :src="staff.photoReal" alt="">
                    <div class="des">
                      <h4>{{ staff.name }}</h4>
                      <p>{{ staff.post }}</p>
                    </div>
                  </div>
                </template>
              </SwiperScroll>
            </div>
          </template>
        </Box>
        <!-- 特种设备管理 -->
        <Box>
          <template #content>
            <div class="box-tit"><span>特种设备管理</span></div>
            <div class="box-con " style="overflow: hidden;">
              <div class="swiper-container" id="specialEquipment">
                <div class="specialEquipment swiper-wrapper">
                  <div class="list-con swiper-slide" v-for="item in specialEquipment" :key="item.typeId">
                    <div class="bg" :class="`bg${Math.floor(Math.random() * 8) + 1}`">
                      <h4>{{ item.count }}</h4>
                      <img src="../../../public/images/sm.png" alt="">
                    </div>
                    <p>{{ item.typeName }}</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Box>
        <!-- 环境监测 -->
        <Box>
          <template #content>
            <div class=" box-tit"><span>环境监测</span>
            </div>
            <div class="box-con" style="max-height: 145px; overflow: hidden;">
              <div class="swiper-container" id="EnvironmentMonitoring" style="height: 145px;">
                <div class="swiper-wrapper">
                  <div class="construction-list2 swiper-slide" v-if="environmentData?.temperature?.value">
                    <div class="icon"><img src="../../../public/images/i-13.png" alt=""></div>
                    <div class="info">
                      <p>温度</p>
                      <h4>{{ environmentData?.temperature?.value }}<em>℃</em></h4>
                    </div>
                  </div>
                  <div class="construction-list2  swiper-slide" v-if="environmentData?.humidity?.value">
                    <div class="icon"><img src="../../../public/images/i-14.png" alt=""></div>
                    <div class="info">
                      <p>湿度</p>
                      <h4>{{ environmentData?.humidity?.value }}<em>%</em></h4>
                    </div>
                  </div>
                  <div class="construction-list2  swiper-slide" v-if="environmentData?.windSpeed?.value">
                    <div class="icon"><img src="../../../public/images/i-15.png" alt=""></div>
                    <div class="info">
                      <p>风速</p>
                      <h4>{{ environmentData?.windSpeed?.value }}<em>m/s</em></h4>
                    </div>
                  </div>
                  <div class="construction-list2  swiper-slide" v-if="environmentData?.noise?.value">
                    <div class="icon"><img src="../../../public/images/i-zs.png" alt=""></div>
                    <div class="info">
                      <p>噪声</p>
                      <h4>{{ environmentData?.noise?.value }}<em>db</em></h4>
                    </div>
                  </div>
                  <div class="construction-list2  swiper-slide" v-if="environmentData?.pm10?.value">
                    <div class="icon"><img src="../../../public/images/i-p10.png" alt=""></div>
                    <div class="info">
                      <p>PM10</p>
                      <h4>{{ environmentData?.pm10?.value }}<em>μg/m³</em></h4>
                    </div>
                  </div>
                  <div class="construction-list2  swiper-slide" v-if="environmentData?.pm25?.value">
                    <div class="icon"><img src="../../../public/images/i-p25.png" alt=""></div>
                    <div class="info">
                      <p>PM25</p>
                      <h4>{{ environmentData?.pm25?.value }}<em>μg/m³</em></h4>
                    </div>
                  </div>
                  <div class="construction-list2  swiper-slide" v-if="environmentData?.windDir?.value">
                    <div class="icon"><img src="../../../public/images/i-16.png" alt=""></div>
                    <div class="info">
                      <p>风向</p>
                      <h4>{{ environmentData?.windDir?.value }}</h4>
                    </div>
                  </div>
                  <!-- <div class="construction-list2  swiper-slide">
                  <div class="icon"><img src="../../../public/images/i-fl.png" alt=""></div>
                  <div class="info">
                    <p>风力</p>
                    <h4>{{ environmentData?.windDir?.value }}<em>m/s</em></h4>
                  </div>
                </div> -->
                  <div class="construction-list2  swiper-slide" v-if="environmentData?.TSP?.value">
                    <div class="icon"><img src="../../../public/images/i-tsp.png" alt=""></div>
                    <div class="info">
                      <p>TSP</p>
                      <h4>{{ environmentData?.TSP?.value }}</h4>
                    </div>
                  </div>
                  <div class="construction-list2 swiper-slide" v-if="environmentData?.airPressure?.value">
                    <div class="icon"><img src="../../../public/images/i-qy.png" alt=""></div>
                    <div class="info">
                      <p>大气压力</p>
                      <h4>{{ environmentData?.airPressure?.value }}<em>百帕</em></h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Box>
      </div>
    </div>
    <!-- end  -->
    <div class="swiper mainBg">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in imageList"><img :src="item" alt="" style="width:100%;height:100%">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav.vue'
import Box from '@/components/box.vue';
import PicSwiper from '@/components/PicSwiper.vue'
import safetyIssuesChart from './safetyIssuesChart.vue'
import SwiperScroll from '@/components/SwiperScroll.vue'
import { mapGetters } from 'vuex'
import { getTraining, getProjectInfo, getQualityProblem, getProjectProgress, getSpecialEquipment, getProjectBulletin, getSecurityManagement, getEnvironmentMonitoring } from '@/api/index'
import { downloadImage } from '@/utils/downloadImage'
import { getFileUrl } from '@/api/safety'
export default {
  components: {
    TopNav,
    Box,
    safetyIssuesChart,
    SwiperScroll,
    PicSwiper
  },
  computed: {
    ...mapGetters(['project', 'projectInfo'])
  },
  data() {
    return {
      randomBg: `bg${Math.floor(Math.random() * 3) + 1}`,
      projectMore: false,
      // projectInfo: {},
      qualityIssues: {},
      safetyHazards: {},
      trainingInfo: [],
      progressNodes: [],
      progressTotal: null,
      projectNotices: [],
      securityStaff: [],
      specialEquipment: {},
      environmentData: {},

      EnvironmentMonitoringSwiper: null,
      picList: [],
      thumbSwiper: null,
      imageList: [],
    }
  },
  watch: {
    projectMore(val) {
      if (!val) {
        this.$nextTick(() => {
          // this.$refs?.safetyIssuesChart?.resize()
        });
      }
    },
  },
  created() {
    // if (this.project?.projectId) {
    //   this.getProjectInfo(this.project?.projectId)
    // }
    this.getProjectInfo()
    this.getQualityProblem()
    this.getProjectProgress()
    this.getSpecialEquipment()
    this.getProjectBulletin()
    this.getSecurityManagement()
    this.getEnvironmentMonitoring()
    this.getTraining()
  },
  mounted() { },
  methods: {
    getTraining() {
      getTraining().then(res => {
        if (res.code === 0) {
          this.trainingInfo = res.data
        }
      })
    },
    getimg(e) {
      return `${process.env.VUE_APP_BASE_API}/qdoner${e}`
    },
    async getImg(src) {
      return await downloadImage(src)
    },
    getEnvironmentMonitoring() {
      getEnvironmentMonitoring().then(res => {
        if (res.code === 0) {
          this.environmentData = res.data
          this.EnvironmentMonitoringSwiper = new Swiper(document.getElementById('EnvironmentMonitoring'), {
            // spaceBetween: 10,
            slidesPerView: 2,
            grid: {
              fill: 'column',
              rows: 2,
            },
            autoplay: {
              delay: 2000,
              disableOnInteraction: false,
            },
            // loop: true,
            observer: true,  //开启动态检查器，监测swiper和slide
            observeParents: true,  //监测Swiper 的祖/父元素
          });
        }
      })
    },
    getSecurityManagement() {
      getSecurityManagement().then(res => {
        if (res.code === 0) {
          this.securityStaff = res.data
          this.securityStaff.map(async item => {
            if (item.photo) {
              // let photo = await this.getImg(item.photo)
              let photo = process.env.VUE_APP_BASE_API + '/qdoner' + item.photo
              this.$set(item, 'photoReal', photo)
            }
          })
          this.$refs?.securityStaff?.reset()
        }
      })
    },
    openNoticeInfo(path) {
      // window.open(path, '_blank')
      window.open("https://view.xdocin.com/view?src=" + encodeURIComponent(path));
    },
    getProjectBulletin() {
      getProjectBulletin().then(res => {
        if (res.code === 0) {
          this.projectNotices = res.data
          new Swiper(document.getElementById('specialEquipment'), {
            spaceBetween: 10,
            slidesPerView: 3,
            autoplay: {
              delay: 2000,
              disableOnInteraction: false,
            },
            observer: true,  //开启动态检查器，监测swiper和slide
            observeParents: true,  //监测Swiper 的祖/父元素
          });
        }
      })
    },
    getSpecialEquipment() {
      getSpecialEquipment().then(res => {
        if (res.code === 0) {
          this.specialEquipment = res.data
        }
      })
    },
    formatNode(node) {
      // str = "负责人:张三\r\n负责班组:杂工\r\n说明:123123123123"
      let other = `<p>计划开始时间：${node?.planStartDate || '-'}</p></p><p>计划结束时间：${node?.planEndDate || '-'}</p></p><p>实际开始时间：${node.actualStartDate || '-'}</p></p><p>实际结束时间：${node.actualEndDate || '-'}</p>`
      if (node?.note) {
        return `<p>${node?.note.replace(/\r\n/g, '</p><p>')}</p>${other}`
      } else {
        return other
      }
    },
    getProjectProgress() {
      getProjectProgress({ id: this.project?.id }).then(res => {
        if (res.code === 0 && res.data) {
          this.progressTotal = res.data?.ZUB
          this.progressNodes = res.data?.ZIB
        }
      })
    },
    getProjectInfo() {
      // getProjectInfo(val).then(res => {
      //   if (res.code === 0) {
      //     this.projectInfo = res.data
      // window.localStorage.setItem('planBatchId', JSON.stringify(res.data.planBatchId))
      // window.localStorage.setItem('imgBatchId', JSON.stringify(res.data.imgBatchId))
      // window.localStorage.setItem('qualityImgBatchId', JSON.stringify(res.data.qualityImgBatchId))
      // window.localStorage.setItem('safetyImgBatchId', JSON.stringify(res.data.safetyImgBatchId))
      getFileUrl(this.projectInfo?.imgBatchId).then(res => {
        this.imageList = res.data.map(item => {
          if (item.url.startsWith('http')) {
            return item.url
          } else {
            return process.env.VUE_APP_BASE_API + '/qdoner' + item.url
          }
        });
        this.$nextTick(() => {
          this.thumbSwiper = new Swiper('.mainBg', {
            thumbs: {
              swiper: this.$refs.PicSwiper.thumbSwiper,
            },
            autoplay: {
              delay: 3000,
              disableOnInteraction: false,
            },
            loop: true,
            observer: true,  //开启动态检查器，监测swiper和slide
            observeParents: true,
          });
        });

      })



      // }
      // })
    },
    getQualityProblem() {
      getQualityProblem().then(res => {
        if (res.code === 0) {
          this.qualityIssues = res.data
        }
      })
    },
    getTotalDate(s, e) {
      if (!s) return 0;
      const start = new Date(s);
      const end = e ? new Date(e) : new Date(); // 如果 e 没值，就用当前时间
      const diffTime = end - start;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 去掉小数部分
      return diffDays;
    },//计算项目工期
  },


}
</script>

<style scoped></style>