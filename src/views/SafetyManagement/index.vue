<template>
  <div class="main">
    <div class="main-left width-480">
      <Box style="flex: 2.15;">
        <template #content>
          <div class="box-tit"><span>AI抓拍违规操作监控截图</span></div>
          <div class="box-con" style="max-height: 540px; overflow: hidden;">
            <SwiperScroll ref="SafetyEducation" :data="SafetyEducation" direction="up" :limit-move-num="4" :step="1"
              :hover-stop="true" :wait-time="1000">
              <template slot-scope="{ item }">
                <div class="SafetyEducation-list">
                  <img :src="item.photoReal" alt="">
                  <div class="des">
                    <!-- <h3>{{ item.name }}</h3> -->
                    <p class="text-danger">{{ item.analysisResult }}</p>
                    <p class="text-default">{{ item.alarmLocation }}</p>
                    <p class="text-default">{{ item.analysisTime }}</p>
                  </div>
                </div>
              </template>
            </SwiperScroll>
            <el-empty v-if="SafetyEducation.length === 0" :image-size="100" description="暂无数据"></el-empty>
          </div>
        </template>
      </Box>
      <!-- 预警管理 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>预警管理</span></div>
          <div class="box-con">
            <warningManagement />
          </div>
        </template>
      </Box>
    </div>
    <div class="main-center other">
      <Box style="flex: 1.98;">
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
            <PicSwiper :images="imageList" style="max-height:535px" v-show="tabActive === '1'" />
            <div class="single-video2" v-show="tabActive === '2'">
              <HlsPlayer :src="VideoURL" />
            </div>
          </div>
        </template>
      </Box>
      <!-- <PicSwiper :images="imageList"  /> -->
      <div style="flex: 1; display: flex;gap: 15px; justify-content: space-between;">
        <!-- 隐患监测管理（近7天） -->
        <Box>
          <template #content>
            <div class="box-tit"><span>隐患监测管理（近7天）</span></div>
            <div class="box-con">
              <hiddenDangerMonitoring />
            </div>
          </template>
        </Box>
        <!-- 隐患排查管理（近7天） -->
        <Box>
          <template #content>
            <div class="box-tit"><span>隐患排查管理（近7天）</span></div>
            <div class="box-con">
              <hiddenDangerInspection />
            </div>
          </template>
        </Box>
      </div>
    </div>
    <div class="main-right  width-480">
      <Box>
        <template #content>
          <div class="box-tit"><span>安全紧急管理</span></div>
          <div class="box-con" style="max-height: 215px; overflow-y: auto;">
            <table>
              <thead>
                <tr>
                  <th>演练名称</th>
                  <th width="155">时间</th>
                  <th width="80">演练等级</th>
                  <th width="80">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in safetyEmergencyManagement" :key="index">
                  <td>
                    <el-tooltip effect="dark" :content="item.safetyEmergencyPlanName" placement="top-start">
                      <span>{{ item.safetyEmergencyPlanName }}</span>
                    </el-tooltip>
                  </td>
                  <td>{{ item.createTime }}</td>
                  <td>{{ item.safetyEmergencyPlanLevel }}</td>
                  <td><span style="cursor: pointer;" class="btn btn-blue" @click="openDocList(item.batchId)">查看</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </Box>
      <Box>
        <template #content>
          <div class="box-tit"><span>随手拍管理</span></div>
          <div class="box-con" style="max-height: 225px; overflow: auto;">
            <div style="width: 150%;max-height: 225px; overflow: auto;">
              <table>
                <thead>
                  <tr>
                    <th>检查编号</th>
                    <th>计划名称</th>
                    <th>检查部门</th>
                    <th>检查人</th>
                    <th>整改期限</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in safetyDocumentManagement" :key="index">
                    <td>{{ item.checkCode }}</td>
                    <td>
                      <el-tooltip effect="dark" :content="item.planName" placement="top-start">
                        <span>{{ item.planName }}</span>
                      </el-tooltip>
                    </td>
                    <td>{{ item.deptName }}</td>
                    <td>{{ item.realname }}</td>
                    <td>{{ item.repairTimeLimit }}</td>
                    <td>{{ item.rectifyStatus == '1' ? '已执行' : '未执行' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </Box>
      <!-- 问题分析 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>问题分析</span></div>
          <div class="box-con">
            <taqfx />
          </div>
        </template>
      </Box>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="文件列表" class="dialog" :visible.sync="dialogVisible" width="30%" :before-close="handleClose"
      destroy-on-close :modal-append-to-body="false">
      <div class="list" v-for="(item, index) in docList" :key="item.modal - append - to - body"
        @click="getView(item.url)">
        <span>{{ index + 1 }}、{{ item.name }}</span>
        <span class="text-primary">查看</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- end  -->
  </div>
</template>

<script>
import PicSwiper from '@/components/PicSwiper.vue'
import SwiperScroll from '@/components/SwiperScroll.vue'
import Box from '@/components/box.vue'
import warningManagement from './warningManagement.vue'
import hiddenDangerMonitoring from './hiddenDangerMonitoring.vue'
import hiddenDangerInspection from './hiddenDangerInspection.vue'
import taqfx from './taqfx.vue'
import { getAiAlert, getSafetyUrgent, getFileUrl, getSafetyPhoto } from '@/api/safety'
import HlsPlayer from '@/components/HlsPlayer.vue'
import { getVideoList, getVideoStream } from '@/api/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    HlsPlayer,
    Box,
    SwiperScroll,
    warningManagement,
    hiddenDangerMonitoring,
    hiddenDangerInspection,
    taqfx,
    PicSwiper
  },
  name: 'SafetyManagement',
  computed: {
    ...mapGetters(['projectInfo'])
  },
  methods: {
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
        this.videoList = res.data
        // this.selectVideo = res.data[0].indexCode
        // this.getVideoStream(res.data[0].indexCode)
      }).catch(() => {
        this.videoList = []
        this.selectVideo = ''
        this.VideoURL = ''
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
      let fileId = this.projectInfo?.safetyImgBatchId || ''
      if (fileId !== '' && fileId !== 'null') {
        getFileUrl(fileId).then(res => {
          if (res?.data?.length > 0) {
            this.imageList = res.data?.map(item => {
              if (item.url.startsWith('http')) {
                return item.url
              } else {
                return process.env.VUE_APP_BASE_API + '/qdoner' + item.url
              }
            })
          } else {
            this.imageList = ['https://picsum.photos/800/600?random=1']
          }

        }).catch(() => {
          this.imageList = ['https://picsum.photos/800/600?random=1']
        })
      } else {
        this.imageList = ['https://picsum.photos/800/600?random=1']
      }
    },
    getSafetyPhoto() {
      getSafetyPhoto().then(res => {
        this.safetyDocumentManagement = res.data?.list || []
        console.log(this.safetyDocumentManagement);
      })
    },
    getView(val) {
      let url = `${process.env.VUE_APP_BASE_API}/qdoner${val}`
      window.open("https://view.xdocin.com/view?src=" + encodeURIComponent(url));
    },
    getAiAlert() {
      getAiAlert().then(res => {
        this.SafetyEducation = res.data?.list || []
        this.SafetyEducation?.map(async item => {
          if (item.analysisImg) {
            // let photo = await this.getImg(item.analysisImg)
            let photo = process.env.VUE_APP_BASE_API + '/qdoner' + item.analysisImg
            this.$set(item, 'photoReal', photo)
          }
        })
        this.$nextTick(() => {
          this.$refs?.SafetyEducation?.reset()
        })

      })
    },
    getSafetyUrgent() {
      getSafetyUrgent().then(res => {
        this.safetyEmergencyManagement = res.data?.list || []
        console.log(this.safetyEmergencyManagement);
      })
    },
    openDocList(id) {
      getFileUrl(id).then(res => {
        this.docList = res.data
        if (this.docList.length === 0) {
          this.$message({
            message: '暂无文件',
            type: 'warning'
          })
          return
        }
        this.dialogVisible = true
      })
    },
    handleClose() {
      this.dialogVisible = false
    }
  },
  mounted() {
    this.getAiAlert()
    this.getSafetyUrgent()
    this.getSafetyPhoto()
    this.getFileUrl()
    // this.getVideoList()
  },
  data() {
    return {
      tabActive: '1',
      selectVideo: '',
      VideoURL: '',
      videoList: [],
      imageList: [],
      docList: null,
      dialogVisible: false,
      safetyEmergencyManagement: [],
      safetyDocumentManagement: [],
      SafetyEducation: [],
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    text-align: left;

    &:first-child {
      flex: 1;
    }
  }
}
</style>