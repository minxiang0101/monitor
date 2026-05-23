<template>
  <div class="main">
    <div class="main-left width-480">
      <!-- 实时数据 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>实时数据</span></div>
          <div class="box-con" style=" overflow: hidden;">
            <div class="swiper-container" id="realTimeData" style="height: 220px;">
              <div class="swiper-wrapper">
                <div class="construction-list swiper-slide" v-if="realTimeData?.temperature?.value">
                  <div class="icon"><img src="../../../public/images/i-13.png" alt=""></div>
                  <div class="info">
                    <p>温度</p>
                    <h4>{{ realTimeData?.temperature?.value }}<em>℃</em></h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide" v-if="realTimeData?.humidity?.value">
                  <div class="icon"><img src="../../../public/images/i-14.png" alt=""></div>
                  <div class="info">
                    <p>湿度</p>
                    <h4>{{ realTimeData?.humidity?.value }}<em>%</em></h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide" v-if="realTimeData?.windSpeed?.value">
                  <div class="icon"><img src="../../../public/images/i-15.png" alt=""></div>
                  <div class="info">
                    <p>风速</p>
                    <h4>{{ realTimeData?.windSpeed?.value }}<em>m/s</em></h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide" v-if="realTimeData?.noise?.value">
                  <div class="icon"><img src="../../../public/images/i-zs.png" alt=""></div>
                  <div class="info">
                    <p>噪声</p>
                    <h4>{{ realTimeData?.noise?.value }}<em>db</em></h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide" v-if="realTimeData?.pm10?.value">
                  <div class="icon"><img src="../../../public/images/i-p10.png" alt=""></div>
                  <div class="info">
                    <p>PM10</p>
                    <h4>{{ realTimeData?.pm10?.value }}<em>μg/m³</em></h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide" v-if="realTimeData?.pm25?.value">
                  <div class="icon"><img src="../../../public/images/i-p25.png" alt=""></div>
                  <div class="info">
                    <p>PM25</p>
                    <h4>{{ realTimeData?.pm25?.value }}<em>μg/m³</em></h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide" v-if="realTimeData?.windDir?.value">
                  <div class="icon"><img src="../../../public/images/i-16.png" alt=""></div>
                  <div class="info">
                    <p>风向</p>
                    <h4>{{ realTimeData?.windDir?.value }}</h4>
                  </div>
                </div>
                <!-- <div class="construction-list  swiper-slide">
                  <div class="icon"><img src="../../../public/images/i-fl.png" alt=""></div>
                  <div class="info">
                    <p>风力</p>
                    <h4>{{ realTimeData?.windDir?.value }}<em>m/s</em></h4>
                  </div>
                </div> -->
                <div class="construction-list  swiper-slide" v-if="realTimeData?.TSP?.value">
                  <div class="icon"><img src="../../../public/images/i-tsp.png" alt=""></div>
                  <div class="info">
                    <p>TSP</p>
                    <h4>{{ realTimeData?.TSP?.value }}</h4>
                  </div>
                </div>
                <div class="construction-list swiper-slide" v-if="realTimeData?.airPressure?.value">
                  <div class="icon"><img src="../../../public/images/i-qy.png" alt=""></div>
                  <div class="info">
                    <p>大气压力</p>
                    <h4>{{ realTimeData?.airPressure?.value }}<em>百帕</em></h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Box>
      <Box>
        <template #content>
          <div class="box-tit"><span>环境指标监测</span>
            <el-select v-model="sSelect" placeholder="请选择" size="mini" @change="changesSelect" class="mx-select">
              <el-option :label="key" :value="key" v-for="(item, key) in environmentalMonitoringAll"
                :key="key"></el-option>
            </el-select>
          </div>
          <div class="box-con" style=" overflow: hidden;">
            <LoadingIndicator v-if="environmentalMonitoringLoading" />
            <div v-show="!environmentalMonitoringLoading" class="swiper-container construction2"
              id="environmentalMonitoring" style="height: 220px;padding:10px 0">
              <div class="swiper-wrapper">
                <div class="construction-list swiper-slide">
                  <div class="icon"><img src="../../../public/images/i-pm10.png" alt=""></div>
                  <div class="info">
                    <p>PM10</p>
                    <h4>{{ environmentalMonitoring['PM10'] }}</h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide">
                  <div class="icon"><img src="../../../public/images/i-pm2.png" alt=""></div>
                  <div class="info">
                    <p>PM2.5</p>
                    <h4>{{ environmentalMonitoring['PM2.5'] }}</h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide">
                  <div class="icon"><img src="../../../public/images/i-tsp1.png" alt=""></div>
                  <div class="info">
                    <p>TSP</p>
                    <h4>{{ environmentalMonitoring['TSP'] }}</h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide">
                  <div class="icon"><img src="../../../public/images/i-zy.png" alt=""></div>
                  <div class="info">
                    <p>噪音</p>
                    <h4>{{ environmentalMonitoring['噪音'] }}</h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide">
                  <div class="icon"><img src="../../../public/images/i-qy1.png" alt=""></div>
                  <div class="info">
                    <p>气压</p>
                    <h4>{{ environmentalMonitoring['气压'] }}</h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide">
                  <div class="icon"><img src="../../../public/images/i-wd.png" alt=""></div>
                  <div class="info">
                    <p>温度</p>
                    <h4>{{ environmentalMonitoring['温度'] }}</h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide">
                  <div class="icon"><img src="../../../public/images/i-sd.png" alt=""></div>
                  <div class="info">
                    <p>湿度</p>
                    <h4>{{ environmentalMonitoring['湿度'] }}</h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide">
                  <div class="icon"><img src="../../../public/images/i-fx.png" alt=""></div>
                  <div class="info">
                    <p>风向</p>
                    <h4>{{ environmentalMonitoring['风向'] }}</h4>
                  </div>
                </div>
                <div class="construction-list  swiper-slide">
                  <div class="icon"><img src="../../../public/images/i-fs.png" alt=""></div>
                  <div class="info">
                    <p>风速</p>
                    <h4>{{ environmentalMonitoring['风速'] }}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Box>
      <Box>
        <template #content>

          <div class="box-tit"><span>喷淋启停记录</span></div>
          <div class="box-con" style="max-height: 220px; overflow: hidden;">
            <SwiperScroll :data="sprayRecords" :direction="1" :limit-move-num="2" :step="1" :spaceBetween='15'
              :hover-stop="true" :wait-time="1000">
              <template slot-scope="{ item, index }">
                <div class="box3">
                  <div class="box3-tit">
                    <span><em class="dot" :class="item.statusClass"></em>{{ item.title }}</span>
                    <span :class="item.statusTextClass">{{ item.statusText }}</span>
                  </div>
                  <div class="box3-con">
                    <h4>{{ item.description }}</h4>
                    <p>{{ item.time }}</p>
                  </div>
                </div>
              </template>
            </SwiperScroll>
          </div>
        </template>
      </Box>
    </div>
    <div class="main-center other4">
      <div class="flex" style="flex: 2.05;">
        <div class="flex" style="width: calc(100% - 480px);">
          <!-- <PicSwiper :images="imageList"  /> -->
          <Box style="flex:2.15;max-width: 895px;">
            <template #content>
              <div class="box-tit">
                <div class="tabs">
                  <!-- <em @click="changeTab('1')" :class="{'cur':tabActive==='1'}">轮播图</em> -->
                  <em @click="changeTab('2')">监控画面</em>
                </div>
                <el-select v-show="tabActive === '2'" v-model="selectVideo" placeholder="请选择" size="mini"
                  @change="changeVideo" class="mx-select">
                  <el-option :label="item.name" :value="item.indexCode" v-for="item in videoList"
                    :key="item.indexCode"></el-option>
                </el-select>
              </div>
              <div class="box-con">
                <PicSwiper :images="imageList" style="max-height:540px" v-show="tabActive === '1'" />
                <div class="single-video2" v-show="tabActive === '2'">
                  <HlsPlayer :src="VideoURL" />
                </div>
              </div>
            </template>
          </Box>
        </div>
        <div class="flex flex-c" style="width: 480px;">
          <!-- 扬尘噪音监测 -->
          <Box>
            <template #content>
              <div class="box-tit" id="DustNoiseBtns">
                <span>扬尘噪音监测</span>
                <div class="chart-btns o"><button :class="{ active: active == 0 }"
                    @click="changeyc(0, '噪音')">噪音</button><button :class="{ active: active == 1 }"
                    @click="changeyc(1, '风速')">风速</button><button :class="{ active: active == 2 }"
                    @click="changeyc(2, '风向')">风向</button></div>
              </div>
              <div class="box-con">
                <DustNoise ref="DustNoise" />
              </div>
            </template>
          </Box>
          <!-- 最新报警 -->
          <Box>
            <template #content>
              <div class="box-tit"><span>最新报警</span></div>
              <div class="box-con" style="max-height: 220px; overflow-y: auto;">
                <table v-if="!latestAlarmsLoad">
                  <thead>
                    <tr>
                      <th>设备名称</th>
                      <th width='140'>预警类型</th>
                      <th>报警内容</th>
                      <th>报警时间</th>
                      <th>处理状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(alarm, index) in latestAlarms" :key="index">
                      <td :title="alarm.assetName">{{ alarm.assetName }}</td>
                      <td>{{ getWarningType(alarm.monitorType) }}</td>
                      <td :title="alarm.content">{{ alarm.content }}</td>
                      <td :title="alarm.createTime">{{ alarm.createTime }}</td>
                      <td :style="{ color: alarm.handleState == '0' ? '#f60' : '#4B9EFF' }">{{
                        alarm.handleState == '0' ? '未处理' : '已处理' }}</td>
                    </tr>
                  </tbody>
                </table>
                <LoadingIndicator v-if="latestAlarmsLoad" />
              </div>
            </template>
          </Box>
        </div>
      </div>
      <div style="flex: 1; display: flex;gap: 15px; justify-content: space-between;">
        <Box>
          <template #content>
            <div class="box-tit">
              <span>监测数据走势图</span>
              <el-select v-model="select" placeholder="请选择" size="mini" @change="changesj" class="mx-select">
                <el-option :label="item.label" :value="item.value" v-for="item in jcSelectList"
                  :key="item.value"></el-option>
              </el-select>
            </div>
            <div class="box-con" id="NoiseMonitoring">
              <NoiseMonitor ref="NoiseMonitor" />
            </div>
          </template>
        </Box>
        <!-- 24小时空气质量 -->
        <Box>
          <template #content>
            <div class="box-tit"><span>水电耗能折线图</span></div>
            <div class="box-con">
              <AirQuality />
            </div>
          </template>
        </Box>
      </div>
    </div>
  </div>
</template>

<script>
import PicSwiper from '@/components/PicSwiper.vue'
import Box from '@/components/box.vue'
import AirQuality from './AirQuality.vue'
import NoiseMonitor from './NoiseMonitor.vue'
import DustNoise from './DustNoise.vue'
import SwiperScroll from '@/components/SwiperScroll.vue'
import { getEnvironmentMonitoring, getEnvironmentIndex, getNewestAlert, getMonitorType } from '@/api/index'
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { getFileUrl } from '@/api/safety'
import HlsPlayer from '@/components/HlsPlayer.vue'
import { getVideoList, getVideoStream } from '@/api/index'
export default {
  components: {
    HlsPlayer,
    Box,
    SwiperScroll,
    AirQuality,
    NoiseMonitor,
    DustNoise,
    LoadingIndicator,
    PicSwiper
  },
  name: 'GreenConstruction',
  data() {
    return {
      tabActive: '2',
      selectVideo: '',
      VideoURL: '',
      videoList: [],
      imageList: [],
      active: 0,
      select: 1,
      realTimeData: [],
      environmentalMonitoring: {},
      environmentalMonitoringAll: [],
      environmentalMonitoringLoading: true,
      jcSelectList: [{
        label: 'PM2.5',
        value: 1,
      }, {
        label: 'PM10',
        value: 2,
      }, {
        label: '噪音',
        value: 3,
      }, {
        label: '温度',
        value: 4,
      }, {
        label: '湿度',
        value: 5,
      }, {
        label: '风向',
        value: 7,
      }, {
        label: '风速',
        value: 8,
      }, {
        label: 'TSP',
        value: 9,
      }, {
        label: '气压',
        value: 10,
      }],

      sprayRecords: [
        {
          title: '越界报警',
          statusClass: 'dot-danger',
          statusText: '未处理',
          statusTextClass: 'text-danger',
          description: '进入【绿地】触发了【越界报警】',
          time: '2021-11-14 12:23:45'
        },
        {
          title: '喷淋启动',
          statusClass: 'dot-success',
          statusText: '已启动',
          statusTextClass: 'text-success',
          description: '设备【喷淋A】已启动',
          time: '2021-11-14 12:25:00'
        },
        {
          title: '喷淋停止',
          statusClass: 'dot-warning',
          statusText: '已停止',
          statusTextClass: 'text-warning',
          description: '设备【喷淋B】已停止',
          time: '2021-11-14 12:30:15'
        },
        {
          title: '越界报警',
          statusClass: 'dot-warning',
          statusText: '处理中',
          statusTextClass: 'text-warning',
          description: '进入【施工区域】触发了【越界报警】',
          time: '2021-11-14 12:33:45'
        },
        {
          title: '喷淋维护',
          statusClass: 'dot-primary',
          statusText: '维护中',
          statusTextClass: 'text-primary',
          description: '设备【喷淋C】正在维护',
          time: '2021-11-14 12:35:20'
        }
      ],
      latestAlarms: [],
      realTimeDataSwiper: null,
      environmentalMonitoringSwiper: null,
      sSelect: '',//7天数据
      warningType: [],
      latestAlarmsLoad: true,
    }
  },
  async created() {
    await this.getEnvironmentMonitoring()
    await this.getEnvironmentIndex()
    await this.getMonitorType()
    await this.getNewestAlert()
    // await this.getFileUrl()
    await this.getVideoList()
  },
  methods: {
    changeTab(tab) {
      this.tabActive = tab
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
    async getMonitorType() {
      this.warningType = await getMonitorType().then(res => res.data)
      console.log(this.warningType)
    },
    getNewestAlert() {
      getNewestAlert().then(res => {
        this.latestAlarmsLoad = false
        this.latestAlarms = res?.data?.list || []
      })
    },
    getWarningType(e) {
      console.log(e)
      return this.warningType?.filter(res => e == res.dictValue)[0].dictLabel
    },
    changesSelect(type) {
      console.log(type)
      this.environmentalMonitoring = this.environmentalMonitoringAll[type]
      this.$nextTick(() => {
        this.environmentalMonitoringSwiper.update()
      })
      // this.getEnvironmentIndex()
    },
    async fetchEnvironmentData() {
      const indexMap = {
        'PM2.5': 1,
        'PM10': 2,
        '噪音': 3,
        '温度': 4,
        '湿度': 5,
        '风向': 7,
        '风速': 8,
        'TSP': 9,
        '气压': 10
      };

      const rawData = {};
      for (const [indexName, indexId] of Object.entries(indexMap)) {
        try {
          const response = await getEnvironmentIndex(indexId);
          if (response && response.data && response.data.list) {
            rawData[indexName] = response.data.list;
          }
        } catch (error) {
          console.error(`获取 ${indexName} (ID: ${indexId}) 数据时出错:`, error);
        }
      }
      const dataByDate = {};
      for (const [indexName, listData] of Object.entries(rawData)) {
        listData.forEach(item => {
          const date = item.currDate;
          if (!dataByDate[date]) {
            dataByDate[date] = [];
          }
          dataByDate[date][indexName] = item.value;
        });
      }
      return Object.fromEntries(Object.entries(dataByDate).reverse());
    },

    async getEnvironmentIndex() {
      this.environmentalMonitoringLoading = true
      this.fetchEnvironmentData()
        .then(result => {
          console.log(result)
          this.environmentalMonitoringLoading = false
          this.environmentalMonitoringAll = result
          this.environmentalMonitoring = Object.values(result)[0]
          this.sSelect = Object.keys(result)[0]
          this.$nextTick(() => {
            this.environmentalMonitoringSwiper = new Swiper(document.getElementById('environmentalMonitoring'), {
              spaceBetween: 10,
              slidesPerView: 3,
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
          })
        })

    },
    getEnvironmentMonitoring() {
      getEnvironmentMonitoring().then(res => {
        this.realTimeData = res.data
        this.realTimeDataSwiper = new Swiper(document.getElementById('realTimeData'), {
          spaceBetween: 10,
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
      })
    },
    changesj() {
      this.$refs.NoiseMonitor.changeType(this.select)
    },
    changeyc(index, type) {
      this.active = index
      this.$refs.DustNoise.changeType(type)
    }
  }
}
</script>

<style scoped></style>