<template>
  <div class="main">
    <div class="main-left width-480">
      <!-- 人员分析 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>人员分析</span></div>
          <div class="box-con">
            <div class="pepole">
              <div class="pepole-list">
                <div class="icon">
                  <img src="../../../public/images/user2.png" alt="">
                </div>
                <div class="info">
                  <p>工人进场人数</p>
                  <h4>{{ personnelAnalysis.entryCount }}</h4>
                </div>
              </div>
              <div class="pepole-list">
                <div class="icon">
                  <img src="../../../public/images/user2.png" alt="">
                </div>
                <div class="info">
                  <p>工人出场人数</p>
                  <h4>{{ personnelAnalysis.exitCount }}</h4>
                </div>
              </div>
              <div class="pepole-list">
                <div class="icon">
                  <!-- <h5>{{ personnelAnalysis.headcount }}%</h5> -->
                  <img src="../../../public/images/user2.png" alt="">
                  <!-- <p>考勤率</p> -->
                </div>
                <div class="info">
                  <p>昨日考勤总人数</p>
                  <h4>{{ personnelAnalysis.headcount }}</h4>
                </div>
              </div>

              <div class="pepole-list">
                <div class="icon">
                  <img src="../../../public/images/user2.png" alt="">
                  <!-- <h5>{{ personnelAnalysis.attendanceRate }}%</h5> -->
                  <!-- <p>考勤率</p> -->
                </div>
                <div class="info">
                  <p>昨日管理人员考勤</p>
                  <h4>{{ personnelAnalysis.sceneCount }}</h4>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Box>
      <!-- 近七天考勤人数 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>近七天考勤人数</span></div>
          <div class="box-con" id="kq-charts">
            <checkOnWorkAttendance />
          </div>
        </template>
      </Box>
      <!-- 黑名单人员预警 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>黑名单人员预警</span></div>
          <div class="box-con" style="overflow: hidden;">
            <LoadingIndicator v-if="latestCheckInPersonsLoad" />
            <SwiperScroll v-show="!latestCheckInPersonsLoad && latestCheckInPersons.length > 0"
              :data="latestCheckInPersons" :direction="3" :limit-move-num="3" :step="0.5" :hover-stop="true"
              :wait-time="3000" ref="latestCheckInPersons">
              <template slot-scope="{ item: person, index }">
                <div class="card">
                  <div class="card-list">
                    <img :src="person.photoReal || '/images/user2.png'" alt=""
                      @error="handleImageError($event, '/images/user2.png')" loading="lazy">
                    <div class="name">{{ person.name }}</div>
                    <div class="info" :title="person.idCardNumber">{{ person.idCardNumber }}</div>
                    <div class="dec" :title="person.remark">{{ person.remark }}</div>
                    <!-- <div class="dec">打卡：{{ person.updateTime }}</div> -->
                  </div>
                </div>
              </template>
            </SwiperScroll>
            <el-empty v-if="!latestCheckInPersonsLoad && latestCheckInPersons.length === 0" :image-size="100"
              description="暂无数据"></el-empty>
          </div>
        </template>
      </Box>
    </div>
    <div class="main-center other">
      <Box style="flex: 1.95;">
        <template #content>
          <div class="box-tit">
            <div class="tabs">
              <!-- <em @click="changeTab('1')" :class="{'cur':tabActive==='1'}">轮播图</em>    -->
              <em @click="changeTab('2')">监控画面</em>
            </div>
            <el-select v-show="tabActive === '2'" v-model="selectVideo" placeholder="请选择" size="mini"
              @change="changeVideo" class="mx-select">
              <el-option :label="item.name" :value="item.indexCode" v-for="item in videoList"
                :key="item.indexCode"></el-option>
            </el-select>
          </div>
          <div class="box-con">
            <PicSwiper :images="imageList" style="max-height:535px" v-show="tabActive === '1'" />
            <div class="single-video2" v-show="tabActive === '2'">
              <HlsPlayer :src="VideoURL" />
            </div>
          </div>
        </template>
      </Box>

      <!-- <PicSwiper :images="imageList" /> -->
      <div style="flex: 1; display: flex;gap: 20px; justify-content: space-between;">
        <Box>
          <template #content>
            <div class="box-tit"><span>进场人员</span></div>
            <div class="box-con" style="max-height: 215px;overflow: hidden; ">
              <LoadingIndicator v-if="inoutLoad" />
              <SwiperScroll v-show="!inoutLoad && entryList.length > 0" :data="entryList" :direction="1"
                :limit-move-num="3" :step="0.5" :hover-stop="true" :wait-time="1500" ref="inPersons">
                <template slot-scope="{ item: person, index }">
                  <div class="io-wraper">
                    <div :class="['io-list', person.status]">
                      <img :src="person.imgCardUrl || '/dp/images/user2.png'" alt=""
                        @error="handleImageError($event, '/dp/images/user2.png')" loading="lazy">
                      <div class="info">
                        <h4>{{ person.name }}</h4>
                        <p>{{ person.realName }}</p>
                        <p>{{ person.clockTime }}</p>
                      </div>
                    </div>
                  </div>
                </template>
              </SwiperScroll>
              <el-empty v-if="!inoutLoad && exitList.length === 0" :image-size="100" description="暂无数据"></el-empty>
            </div>
          </template>
        </Box>
        <Box>
          <template #content>
            <div class="box-tit"><span>出场人员</span></div>
            <div class="box-con" style="max-height: 215px;overflow: hidden;">
              <LoadingIndicator v-if="inoutLoad" />
              <SwiperScroll v-show="!inoutLoad && exitList.length > 0" :data="exitList" :direction="1"
                :limit-move-num="3" :step="0.5" :hover-stop="true" :wait-time="1500" ref="outPersons">
                <template slot-scope="{ item: person, index }">
                  <div class="io-wraper">
                    <div :class="['io-list', person.status]">
                      <img :src="person.imgCardUrl || '/dp/images/user2.png'" alt=""
                        @error="handleImageError($event, '/dp/images/user2.png')" loading="lazy">
                      <div class="info">
                        <h4>{{ person.name }}</h4>
                        <p>{{ person.realName }}</p>
                        <p>{{ person.clockTime }}</p>
                      </div>
                    </div>
                  </div>
                </template>
              </SwiperScroll>
              <el-empty v-if="!inoutLoad && exitList.length === 0" :image-size="100" description="暂无数据"></el-empty>
            </div>
          </template>
        </Box>
      </div>
    </div>
    <div class="main-right width-480">
      <!-- 班组信息 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>班组信息</span></div>
          <div class="box-con">
            <bzxxChart />
          </div>
        </template>
      </Box>
      <!-- 参建单位信息 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>参建单位信息</span></div>
          <div class="box-con" style="max-height: 225px; overflow: hidden;">
            <LoadingIndicator v-if="constructionUnitsLoad" />
            <SwiperScroll v-show="!constructionUnitsLoad && constructionUnits.length > 0" :data="constructionUnits"
              :direction="1" :limit-move-num="3" :step="0.5" :hover-stop="true" :wait-time="2000"
              ref="constructionUnits">
              <template slot-scope="{ item: unit, index }">
                <div class="unit-info">
                  <div class="unit-item">
                    <h4>{{ unit.name }}</h4>
                    <div class="progress-bar ">
                      <div class="progress" :style="{ width: unit.progress + '%' }"></div>
                    </div>
                    <div class="numbers">
                      <span>总⼈数<em>{{ unit.total }}</em>人</span>
                      <span>今日出勤<em>{{ unit.count || 0 }}</em>人</span>
                    </div>
                  </div>
                </div>
              </template>
            </SwiperScroll>
            <el-empty v-if="!constructionUnitsLoad && constructionUnits.length === 0" :image-size="100"
              description="暂无数据"></el-empty>
          </div>
        </template>
      </Box>
      <!-- 培训情况 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>培训情况</span></div>
          <div class="box-con" style="max-height: 225px;overflow-y: auto;">
            <ul class="noice-list">
              <li v-for="(item, index) in trainingInfo" :key="index" @click="openNoticeInfo(item.path)">{{ item.name
              }}<span>{{ item.time }}</span>
              </li>
            </ul>
            <el-empty v-if="trainingInfo.length === 0" :image-size="100" description="暂无数据"></el-empty>
          </div>
        </template>
      </Box>
    </div>
  </div>
</template>

<script>
import HlsPlayer from '@/components/HlsPlayer.vue'
import PicSwiper from '@/components/PicSwiper.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import Box from '@/components/box.vue'
import checkOnWorkAttendance from './checkOnWorkAttendance.vue'
import bzxxChart from './bzxxChart.vue'
import SwiperScroll from '@/components/SwiperScroll.vue'
import { getBlackList, getInOutRecord, getJoinUnit, getPersonnelAnalysis } from '@/api/personnel'
import { downloadImage } from '@/utils/downloadImage'
import { getFileUrl } from '@/api/safety'
import { getVideoList, getVideoStream, getTraining } from '@/api/index'
export default {
  components: {
    Box,
    checkOnWorkAttendance,
    bzxxChart,
    SwiperScroll,
    LoadingIndicator,
    PicSwiper,
    HlsPlayer
  },
  name: 'PersonnelInformation',
  data() {
    return {
      tabActive: '2',
      selectVideo: '',
      VideoURL: '',
      videoList: [],
      imageList: [],
      constructionUnitsLoad: true,
      inoutLoad: true,
      personnelAnalysis: {},
      latestCheckInPersons: [],
      entryList: [],
      exitList: [],
      constructionUnits: [],
      trainingInfo: [],
      showAttendanceChart: false,
      showTeamChart: false,
      loadingTimer: null,
      latestCheckInPersonsLoad: true
    }
  },
  mounted() {
    // 优化加载顺序：先加载关键数据，再加载次要数据
    this.loadCriticalData()
  },
  beforeDestroy() {
    // 清理定时器，防止内存泄漏
    // if (this.loadingTimer) {
    //   clearTimeout(this.loadingTimer)
    // }
    // 清理滚动组件
    // this.$refs?.latestCheckInPersons?.destroySwiper?.()
    // this.$refs?.inPersons?.destroySwiper?.()
    // this.$refs?.outPersons?.destroySwiper?.()
    // this.$refs?.constructionUnits?.destroySwiper?.()
  },
  methods: {
    // 优化加载顺序的方法
    async loadCriticalData() {
      try {
        // 先加载关键数据
        await Promise.all([
          this.getPersonnelAnalysis(),
          this.getVideoList()
        ])
        this.getTraining()
        this.getBlackList()
        this.getInOutRecord()
        this.getJoinUnit()

        // 延迟加载图表组件，避免同时初始化
        setTimeout(() => {
          this.showAttendanceChart = true
        }, 600)

        setTimeout(() => {
          this.showTeamChart = true
        }, 800)
      } catch (error) {
        console.error('数据加载失败:', error)
      }
    },

    handleImageError(event, defaultSrc) {
      // 当图片加载失败时，将 src 替换为默认图片
      if (event.target.src !== defaultSrc) {
        if (window.location.origin.includes('localhost')) {
          defaultSrc = defaultSrc.replace('/dp', '')
        }
        // 添加防抖，避免频繁触发
        if (!event.target.dataset.errorHandled) {
          event.target.dataset.errorHandled = 'true'
          event.target.src = defaultSrc
        }
      }
    },
    changeTab(tab) {
      this.tabActive = tab
    },
    getTraining() {
      getTraining().then(res => {
        if (res.code === 0) {
          this.trainingInfo = res.data
        }
      })
    },
    openNoticeInfo(path) {
      window.open("https://view.xdocin.com/view?src=" + encodeURIComponent(path));
    },
    getVideoList() {
      getVideoList().then(res => {
        console.log(res)
        this.videoList = res.data
        // this.selectVideo = res.data[0].indexCode
        // this.getVideoStream(res.data[0].indexCode)
      })
    },
    getVideoStream(id) {
      getVideoStream(id).then(res => {
        this.VideoURL = res.data;
      })
    },
    changeVideo() {
      this.getVideoStream(this.selectVideo)
    },
    getFileUrl() {
      let fileId = window.localStorage.getItem('imgBatchId') || ''
      if (fileId) {
        getFileUrl(JSON.parse(fileId)).then(res => {
          console.log(res.data, process.env.VUE_APP_BASE_API)
          this.imageList = res.data.map(item => {
            if (item.url.startsWith('http')) {
              return item.url
            } else {
              return `${process.env.VUE_APP_BASE_API}/qdoner${item.url}`
            }
          })
        }).catch(() => {
          this.imageList = ['https://picsum.photos/800/600?random=1']
        })
      } else {
        this.imageList = ['https://picsum.photos/800/600?random=1']
      }
    },
    getPersonnelAnalysis() {
      getPersonnelAnalysis().then(res => {
        this.personnelAnalysis = res?.data
      })
    },
    getJoinUnit() {
      this.constructionUnitsLoad = true
      getJoinUnit().then(res => {
        this.constructionUnitsLoad = false
        // 优化数据处理：批量更新而不是逐个$set
        const processedData = (res?.data || []).map(item => ({
          ...item,
          progress: ((item.count / item.total) * 100).toFixed(2)
        }))
        this.constructionUnits = processedData

        this.$nextTick(() => {
          this.$refs?.constructionUnits?.reset()
        })
      }).catch(error => {
        this.constructionUnitsLoad = false
        console.error('获取参建单位信息失败:', error)
      })
    },
    async getImg(src) {
      return await downloadImage(src)
    },
    getBlackList() {
      this.latestCheckInPersonsLoad = true
      getBlackList().then(res => {
        this.latestCheckInPersonsLoad = false
        // 优化数据处理：批量处理图片URL
        const processedData = (res?.data?.list || []).map(item => ({
          ...item,
          photoReal: item.photo ? process.env.VUE_APP_BASE_API + '/qdoner' + item.photo : null
        }))
        this.latestCheckInPersons = processedData

        this.$nextTick(() => {
          this.$refs?.latestCheckInPersons?.reset()
        })
      }).catch(error => {
        this.latestCheckInPersonsLoad = false
        console.error('获取黑名单信息失败:', error)
      })
    },
    getInOutRecord() {
      this.inoutLoad = true
      getInOutRecord().then(res => {
        this.inoutLoad = false
        this.exitList = res?.data?.exitList || []
        this.entryList = res?.data?.entryList || []

        this.$nextTick(() => {
          this.$refs?.inPersons?.reset()
          this.$refs?.outPersons?.reset()
        })
      }).catch(error => {
        this.inoutLoad = false
        console.error('获取进出场记录失败:', error)
      })
    }
  },
}
</script>

<style scoped></style>