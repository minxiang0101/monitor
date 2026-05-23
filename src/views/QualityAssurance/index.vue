<template>
  <div class="main">
    <div class="main-left width-480">
      <!-- 问题数量 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>问题数量</span></div>
          <div class="box-con">
            <IssueQuantity />
          </div>
        </template>
      </Box>
      <!-- 问题整改完成情况 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>问题整改完成情况</span></div>
          <div class="box-con">
            <IssueRectification />
          </div>
        </template>
      </Box>
      <!-- 实测实量数据 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>实测实量数据</span></div>
          <div class="box-con">
            <QualityDataAnalysis />
          </div>
        </template>
      </Box>
    </div>
    <div class="main-center other">
      <!-- <PicSwiper :images="imageList" /> -->
      <Box style="flex:2.15;">
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
      <!-- 质量检查数据统计分析 -->
      <Box>
        <template #content>
          <div class="box-tit"><span>质量检查数据统计分析</span></div>
          <div class="box-con">
            <tsjfx ref="tsjfx" />
          </div>
        </template>
      </Box>
    </div>
    <div class="main-right  width-480">
      <Box>
        <template #content>
          <div class="box-tit"><span>质量巡检</span></div>
          <div class="box-con" style="max-height: 220px; overflow-y: auto;">
            <table>
              <thead>
                <tr>
                  <th>巡检类型</th>
                  <th>巡检人</th>
                  <th>巡检单位</th>
                  <th>巡检时间</th>
                  <th width="90">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in qualityInspections" :key="index">
                  <td>{{ getValue(item.qualCheckType) }}</td>
                  <td>{{ item.qualCheckPersonName }}</td>
                  <td>{{ item.qualCheckCom }}</td>
                  <td>{{ item.qualDocumentDate }}</td>
                  <td><a class="btn btn-blue" style="cursor: pointer;"
                      @click="getQualityInspectionInfo(item.checkId)">详情</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </Box>
      <Box>
        <template #content>
          <div class="box-tit"><span>质量验收</span></div>
          <div class="box-con" style="max-height: 220px; overflow-y: auto;">
            <table>
              <thead>
                <tr>
                  <th>验收区域</th>
                  <th>验收类型</th>
                  <th width="90">验收时间</th>
                  <th>验收内容</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in qualityAcceptances" :key="index">
                  <td>{{ item.subUnitP || '-' }}</td>
                  <td>{{ item.inspectionLot || '-' }}</td>
                  <td>{{ item.reportDate || '-' }}</td>
                  <td>{{ item.content || '-' }}</td>
                  <td><span class="btn btn-blue" style="cursor: pointer;" @click="getInfo(item.acceptBatchId)">详情</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </Box>
      <Box>
        <template #content>
          <div class="box-tit"><span>安全巡检</span></div>
          <div class="box-con">
            <taqfx />
            <!-- <QualityCheck /> -->
          </div>
        </template>
      </Box>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="详情" :visible.sync="dialogVisible" width="30%" destroy-on-close :modal-append-to-body="false"
      class="dialog">
      <!-- {{qualityAcceptancesInfo.acceptCode}} -->
      <div class="zlist" v-if="Object.keys(qualityAcceptancesInfo).length > 0">
        <p><span>验收编号</span>{{ qualityAcceptancesInfo.acceptCode || '-' }}</p>
        <p><span>验收结论</span>{{ qualityAcceptancesInfo.acceptResult || '-' }}</p>
        <p><span>验收单位</span>{{ qualityAcceptancesInfo.acceptUnit || '-' }}</p>
        <p><span>验收人</span>{{ qualityAcceptancesInfo.reportUser || '-' }}</p>
        <p><span>验收日期</span>{{ qualityAcceptancesInfo.reportDate || '-' }}</p>
        <p><span>整改问题项</span>{{ qualityAcceptancesInfo.correctItem || '-' }}</p>
        <p><span>相关附件</span><em class="text-warning" @click="getAttachment(qualityAcceptancesInfo.batchId)">查看</em></p>
        <template v-if="attachmentList.length > 0">
          <p v-for="(item, index) in attachmentList" :key="index" @click="openlink(item.url)" class="text-primary"
            style="cursor: pointer;">
            <span>&nbsp;</span> {{ index + 1 }}、 {{ item.name }}
          </p>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog title="详情" :visible.sync="dialogVisible2" width="40%" destroy-on-close :modal-append-to-body="false"
      class="dialog2" :before-close="closed">
      <el-collapse v-model="activeNames" class="mx-collapse" v-if="InspectionDetails?.length > 0">
        <el-collapse-item v-for="(item, index) in InspectionDetails" :key="index" :title="'隐患详情 ' + (index + 1)"
          :name="index">
          <div class="zlist">
            <p><span>隐患位置</span>{{ item.place || '-' }}</p>
            <p><span>隐患描述</span>{{ item.qualTrobuleDescription || '-' }}</p>
            <p><span>隐患等级</span>{{ getLevelValue(item.level) || '-' }}</p>
            <p><span>紧急程度</span>{{ getUrgencyValue(item.priority) || '-' }}</p>
            <p><span>问题类型</span>{{ item.questionName || '-' }}</p>
            <p><span>实际整改人</span>{{ item.actualCorrectorName || '-' }}</p>
            <p><span>整改时间</span>{{ item.rectifyDate || '-' }}</p>
            <p><span>整改效果说明</span>{{ item.receiptInfo || '-' }}</p>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-empty v-if="InspectionDetails?.length === 0" :image-size="80" style="padding:10px 0;"
        description="暂无数据"></el-empty>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closed">取 消</el-button>
        <el-button type="primary" @click="closed">确 定</el-button>
      </span>
    </el-dialog>
    <!-- end  -->
  </div>
</template>

<script>
import PicSwiper from '@/components/PicSwiper.vue'
import Box from '@/components/box.vue'
import IssueQuantity from './IssueQuantity.vue'
import IssueRectification from './IssueRectification.vue'
import QualityDataAnalysis from './QualityDataAnalysis.vue'
import QualityCheck from './QualityCheck.vue'
import tsjfx from './tsjfx.vue'
import { getQualityAcceptance, getQualityAcceptanceInfo, getQualityInspection, getQualityInspectionInfo, getHazardLevel, getEmergencyDegree } from '@/api/quality'
import { getCheckType } from '@/api/index'
import { getFileUrl } from '@/api/safety'
import taqfx from '@/views/SafetyManagement/taqfx.vue'
import HlsPlayer from '@/components/HlsPlayer.vue'
import { getVideoList, getVideoStream } from '@/api/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    HlsPlayer,
    Box,
    IssueQuantity,
    IssueRectification,
    QualityDataAnalysis,
    QualityCheck,
    tsjfx,
    taqfx,
    PicSwiper
  },
  name: 'QualityAssurance',
  computed: {
    ...mapGetters(['projectInfo'])
  },
  data() {
    return {
      tabActive: '1',
      selectVideo: '',
      VideoURL: '',
      videoList: [],
      dialogVisible2: false,
      dialogVisible: false,
      select: '',
      qualityInspections: [],
      qualityAcceptances: [],
      qualityAcceptancesInfo: {},
      attachmentList: [],
      CheckType: [],//巡检类型字典
      InspectionDetails: null,//巡检详情
      activeNames: [0],// 默认展开第一个折叠面板
      levelType: [],//隐患等级字典
      urgencyType: [], //紧急程度字典
      imageList: [],
    }
  },
  async mounted() {
    await this.getCheckType()
    await this.getEmergencyDegree()
    await this.getHazardLevel()
    await this.getQualityAcceptance()
    await this.getQualityInspection()
    await this.getFileUrl()
    // await this.getVideoList()
  },
  methods: {
    changeTab(tab) {
      this.tabActive = tab
      if (tab === '2' && this.VideoURL === '') {
        this.getVideoList();
      } else if (tab === '1' && this.imageList.length === 0) {
        this.getFileUrl();
      } s
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
      let fileId = this.projectInfo?.qualityImgBatchId || ''
      if (fileId !== '' && fileId !== 'null') {
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
    closed() {
      this.dialogVisible2 = false;
      this.activeNames = [0]
    },
    getValue(e) {
      return this.CheckType?.filter(item => e == item.dictValue)[0]?.dictLabel
    },
    getLevelValue(e) {
      return this.levelType?.filter(item => e == item.dictValue)[0]?.dictLabel
    },
    getUrgencyValue(e) {
      return this.urgencyType?.filter(item => e == item.dictValue)[0]?.dictLabel
    },
    getEmergencyDegree() {
      getEmergencyDegree().then(res => {
        this.urgencyType = res.data
      })
    },
    getHazardLevel() {
      getHazardLevel().then(res => {
        this.levelType = res.data
      })
    },
    getCheckType() {
      getCheckType().then(res => {
        this.CheckType = res.data
      })
    },
    openlink(val) {
      let url = `${process.env.VUE_APP_BASE_API}/qdoner${val}`
      window.open("https://view.xdocin.com/view?src=" + encodeURIComponent(url));
    },
    getAttachment(id) {
      if (!id) {
        this.$message({
          message: '附件id为空',
          type: 'warning'
        })
        return
      }
      getFileUrl(id).then(res => {
        this.attachmentList = res?.data || []
      })
    },
    getQualityAcceptance() {
      getQualityAcceptance().then(res => {
        this.qualityAcceptances = res?.data?.list || []

      })
    },
    getInfo(id) {
      if (!id) {
        this.$message({
          message: '验收id不能为空',
          type: 'warning'
        })
        return
      }
      this.qualityAcceptancesInfo = {}
      getQualityAcceptanceInfo(id).then(res => {
        this.qualityAcceptancesInfo = res?.data || {}
        if (Object.keys(this.qualityAcceptancesInfo).length > 0) {
          this.dialogVisible = true
        }
      })
    },
    getQualityInspection() {
      getQualityInspection().then(res => {
        this.qualityInspections = res?.data?.list || []
      })
    },
    getQualityInspectionInfo(id) {
      if (!id) {
        this.$message({
          message: '巡检id不能为空',
          type: 'warning'
        })
        return
      }
      getQualityInspectionInfo(id).then(res => {
        this.InspectionDetails = res.data?.hiddenTroubleList
        this.dialogVisible2 = true
      })
    },
    changesj() {
      // this.$refs.tsjfx.changeType(this.select)
    }
  },
}
</script>

<style lang="scss" scoped>
.zlist {
  // padding: 0 0 0 20px;

  p {
    padding: 5px 0;
    display: flex;
    align-items: center;

    span {
      width: 100px;
      text-align: left;
      color: #999;
    }

    em {
      font-style: normal;
      cursor: pointer;
    }
  }
}
</style>