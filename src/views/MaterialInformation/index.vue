<template>
  <div class="main">
    <div class="main-left width-380">
      <Box>
        <template #content>
          <div class="box-tit"><span>物料进场</span></div>
          <div class="box-con">
            <div class="count-box">
              <div class="count-item">
                <div class="count-label">今日收料</div>
                <div class="count-num">
                  <div class="num-box" v-for="(num, index) in formatNumber(todayReceived)" :key="index">{{ num }}</div>
                  <span class="unit">车</span>
                </div>
              </div>
              <div class="count-item">
                <div class="count-label">累计收料</div>
                <div class="count-num">
                  <div class="num-box" v-for="(num, index) in formatNumber(totalReceived)" :key="index">{{ num }}</div>
                  <span class="unit">车</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Box>
      <Box style="flex: 2.4;">
        <template #content>
          <div class="box-tit"><span>智能地磅最新动态</span> <a href="javascript:;">详情</a></div>
          <div class="box-con">
            <div class="chart-btns" id="btns" style="margin:10px 0  10px 18px;">
              <button :class="{ active: dbActive === 0 }" @click="changeDbType(0)">进场</button>
              <button :class="{ active: dbActive === 1 }" @click="changeDbType(1)">出场</button>
            </div>
            <div class="db-list" style="max-height: 480px; overflow:hidden;">
              <vueSeamlessScroll :data="filteredDbList" :classOption="classOption">
                <div class="timeline-item" v-for="(item, index) in filteredDbList" :key="index">
                  <div class="time">{{ item.time }}</div>
                  <div class="info">
                    <span>司机：{{ item.driver }}</span>
                    <span>车牌号：{{ item.plateNumber }}</span>
                    <span>物料类别：{{ item.materialType }}</span>
                    <span>毛重：{{ item.weight }}吨</span>
                  </div>
                </div>
              </vueSeamlessScroll>
            </div>
          </div>
        </template>
      </Box>
    </div>
    <div class="main-center other3">
      <Box style="flex: 2.25;">
        <template #content>
          <div class="box-tit">
            <div class="tabs"><em @click="changeTab('1')" :class="{ 'cur': tabActive === '1' }">轮播图</em><em
                @click="changeTab('2')" :class="{ 'cur': tabActive === '2' }">监控画面</em></div>
            <el-select v-show="tabActive === '2'" v-model="selectVideo" placeholder="请选择" size="mini"
              @change="changeVideo" class="mx-select">
              <el-option :label="item.name" :value="item.indexCode" v-for="item in videoList"
                :key="item.indexCode"></el-option>
            </el-select>
          </div>
          <div class="box-con">
            <PicSwiper :images="imageList" style="max-height:560px" v-show="tabActive === '1'" />
            <div class="single-video2" v-show="tabActive === '2'">
              <HlsPlayer :src="VideoURL" />
            </div>
          </div>
        </template>
      </Box>
      <div style="flex: 1; display: flex;gap: 20px; justify-content: space-between;">
        <Box>
          <template #content>
            <div class="box-tit"><span>收料统计</span>
              <div class="chart-btns">
                <button :class="{ active: active == 0 }" @click="changeType('0')">今日收料</button>
                <button :class="{ active: active == 1 }" @click="changeType('1')">累计收料</button>
              </div>
            </div>
            <div class="box-con">
              <slChart ref="slChart" />
            </div>
          </template>
        </Box>
        <Box>
          <template #content>
            <div class="box-tit"><span>实现计划用量与实际用量比对分析</span></div>
            <div class="box-con" id="jh-chart">
              <JhChart />
            </div>
          </template>
        </Box>
      </div>
    </div>
    <div class="main-right width-540">
      <Box>
        <template #content>
          <div class="box-tit"><span>见证取样合格率统计</span></div>
          <div class="box-con">
            <qyChart />
          </div>
        </template>
      </Box>
      <Box style="flex: 1.6;">
        <template #content>
          <div class="box-tit"><span>见证取样记录</span><a href="javascript:;">详情</a></div>
          <div class="box-con">
            <table>
              <thead>
                <tr>
                  <th>取样时间</th>
                  <th>工程部位</th>
                  <th>材料类别</th>
                  <th>检验项目</th>
                  <th>样品编号</th>
                  <th>样品数量</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in sampleList" :key="index">
                  <td>{{ item.time }}</td>
                  <td>{{ item.location }}</td>
                  <td>{{ item.material }}</td>
                  <td>{{ item.testItem }}</td>
                  <td>{{ item.sampleNo }}</td>
                  <td>{{ item.quantity }}</td>
                  <td :style="{ color: item.statusColor }">{{ item.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </Box>
    </div>
  </div>
</template>

<script>
import HlsPlayer from '@/components/HlsPlayer.vue'
import PicSwiper from '@/components/PicSwiper.vue'
import Box from '@/components/box.vue';
import slChart from './slChart.vue';
import JhChart from './jhChart.vue';
import qyChart from './qyChart.vue';
import vueSeamlessScroll from 'vue-seamless-scroll'
import { getFileUrl } from '@/api/safety'
import { getVideoList, getVideoStream } from '@/api/index'
import { mapGetters } from 'vuex';
export default {
  name: 'MaterialInformation',
  components: {
    Box,
    slChart,
    JhChart,
    qyChart,
    vueSeamlessScroll,
    HlsPlayer,
    PicSwiper
  },
  data() {
    return {
      tabActive: '1',
      selectVideo: '',
      VideoURL: '',
      videoList: [],
      active: 0,
      dbActive: 0, // 地磅切换状态：0-进场，1-出场
      todayReceived: 71, // 今日收料
      totalReceived: 1786, // 累计收料
      dbList: [
        {
          type: 0, // 0-进场，1-出场
          time: '2024-03-25 10:23:45',
          driver: '张三',
          plateNumber: '京A12345',
          materialType: '钢筋',
          weight: 35.5
        },
        {
          type: 0,
          time: '2024-03-25 09:15:30',
          driver: '李四',
          plateNumber: '京B67890',
          materialType: '水泥',
          weight: 28.3
        },
        {
          type: 1,
          time: '2024-03-25 08:45:12',
          driver: '王五',
          plateNumber: '京C13579',
          materialType: '砂石',
          weight: 42.1
        }
      ],
      sampleList: [
        {
          time: '2021-09-12 15:48',
          location: '1#楼基础',
          material: '混凝土',
          testItem: '抗压等级',
          sampleNo: '2939311234',
          quantity: 3,
          status: '已送检',
          statusColor: '#4B9EFF'
        },
        {
          time: '2021-09-12 15:48',
          location: '1#楼基础',
          material: '混凝土',
          testItem: '抗压等级',
          sampleNo: '2939311234',
          quantity: 3,
          status: '已取样',
          statusColor: '#FFA84B'
        },
        {
          time: '2021-09-12 15:48',
          location: '1#楼基础',
          material: '混凝土',
          testItem: '抗压等级',
          sampleNo: '2939311234',
          quantity: 3,
          status: '不合格',
          statusColor: '#FF4B4B'
        }
      ],
      classOption: {
        limitMoveNum: 5,
        direction: 1,
      },
      imageList: []
    }
  },
  computed: {
    filteredDbList() {
      return this.dbList.filter(item => item.type === this.dbActive)
    },
    ...mapGetters(['projectInfo'])
  },
  mounted() {
    // this.getVideoList();
    this.getFileUrl();
  },
  methods: {
    getFileUrl() {
      let fileId = this.projectInfo?.imgBatchId || ''
      if (fileId) {
        getFileUrl(fileId).then(res => {
          console.log(res.data, process.env.VUE_APP_BASE_API)
          this.imageList = res.data.map(item => {
            if (item.url.startsWith('http')) {
              return item.url
            } else {
              return process.env.VUE_APP_BASE_API + '/qdoner' + item.url
            }
          })
        }).catch(() => {
          this.imageList = ['https://picsum.photos/800/600?random=1']
        })
      } else {
        this.imageList = ['https://picsum.photos/800/600?random=1']
      }
    },
    changeTab(tab) {
      this.tabActive = tab
      if (tab === '2' && this.VideoURL === '') {
        this.getVideoList();
      } else if (tab === '1' && this.imageList.length === 0) {
        this.getFileUrl();
      }
    },
    getVideoList() {
      getVideoList().then(res => {
        // console.log(res)
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
    changeType(type) {
      this.active = type;
      this.$refs.slChart.changeType(type);
    },
    changeDbType(type) {
      this.dbActive = type;
    },
    // 格式化数字为固定长度的字符串
    formatNumber(num) {
      return num.toString().padStart(4, '0').split('')
    }
  },
}
</script>

<style scoped></style>