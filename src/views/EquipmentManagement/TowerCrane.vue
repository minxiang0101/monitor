<template>
  <div class="main">
    <div class="main-left width-170" style="overflow: hidden; overflow-y: auto;">
      <SideNav />
    </div>
    <div class="main-center other2">
      <Box style="flex: 1.8;background: rgba(5, 34, 68, 0.9)">
        <template #content>
          <div class="box-tit"><span>实时数据</span>
            <el-select v-model="selectedEquipment" placeholder="请选择设备" class="mx-select" @change="changeSB">
              <el-option v-for="item in equipmentList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="box-con">
            <div class="ss">
              <div class="ss-left">
                <div class="top">
                  <div class="dec">
                    <div class="img">
                      <img :src="imageUrl" alt="" @error="handleImageError($event, '/dp/images/td.png')">
                    </div>
                  </div>
                  <div class="info">
                    <div>
                      <p>前臂长</p>
                      <h4><span>{{ equipmentInfo?.foreArmLength || '-' }}</span>米</h4>
                    </div>
                    <div>
                      <p>后臂长</p>
                      <h4><span>{{ equipmentInfo?.rearArmLength || '-' }}</span>米</h4>
                    </div>
                    <div>
                      <p>塔臂高</p>
                      <h4><span>{{ equipmentInfo?.armHeight || '-' }}</span>米</h4>
                    </div>
                    <div>
                      <p>力矩</p>
                      <h4><span>{{ (equipmentInfo?.weight && equipmentInfo?.amplitude) ? (equipmentInfo?.weight *
                        equipmentInfo?.amplitude)?.toFixed(1) : '-' }}</span>T.M</h4>
                    </div>
                  </div>
                </div>
                <div class="info">
                  <p>塔基编号：{{ equipmentInfo?.assetCode }} 塔基名称：{{ equipmentInfo?.assetName }} 数据获取时间： {{
                    equipmentInfo?.offlineDate }}</p>
                </div>
              </div>
              <div class="ss-right">
                <div class="compass-chat">
                  <div style="flex:1;height:280px;">
                    <Compass ref="Compass" />
                  </div>
                  <p style="color: rgba(255,255,255,.7); font-size: 12px; text-align: center;">
                    数据时间：{{ equipmentInfo?.monitorTime || '-' }}</p>
                </div>
                <div class="info">
                  <div>
                    <p>回旋</p>
                    <h4><span>{{ equipmentInfo?.rotation || '-' }}</span>米</h4>
                  </div>
                  <div>
                    <p>风速</p>
                    <h4><span>{{ equipmentInfo?.windLevel || 0 }}</span>m/s</h4>
                  </div>
                  <div>
                    <p>倾角</p>
                    <h4><span>{{ equipmentInfo?.angle || 0 }}</span>度</h4>
                  </div>
                </div>
              </div>
            </div>
            <div class="ss-total">
              <div class="ss-total-list">
                <img src="../../../public/images/s-1.png" alt="">
                <div class="info">
                  <h4><span>{{ equipmentInfo?.height || 0 }}</span>米</h4>
                  <p>高度</p>
                </div>
              </div>
              <div class="ss-total-list">
                <img src="../../../public/images/s-2.png" alt="">
                <div class="info">
                  <h4><span>{{ equipmentInfo?.amplitude || 0 }}</span>米</h4>
                  <p>幅度</p>
                </div>
              </div>
              <div class="ss-total-list">
                <img src="../../../public/images/s-3.png" alt="">
                <div class="info">
                  <h4><span>{{ equipmentInfo?.rotation || 0 }}</span>度</h4>
                  <p>圈数</p>
                </div>
              </div>
              <div class="ss-total-list">
                <img src="../../../public/images/s-4.png" alt="">
                <div class="info">
                  <h4><span>{{ equipmentInfo?.weight || 0 }}</span>T</h4>
                  <p>吊重</p>
                </div>
              </div>
              <div class="ss-total-list">
                <img src="../../../public/images/s-5.png" alt="">
                <div class="info">
                  <h4><span>{{ equipmentInfo?.windspeed || 0 }}</span>m/s</h4>
                  <p>风速</p>
                </div>
              </div>
              <div class="ss-total-list">
                <img src="../../../public/images/s-6.png" alt="">
                <div class="info">
                  <h4><span>{{ equipmentInfo?.angle || 0 }}</span>度</h4>
                  <p>倾斜</p>
                </div>
              </div>

            </div>
          </div>
        </template>
      </Box>
      <Box>
        <template #content>
          <div class="box-tit"><span>统计分析</span>
            <div class="chart-btns">
              <button :class="{ active: chartType === 'weight' }" @click="switchChartType('weight')">吊重</button>
              <button :class="{ active: chartType === 'torque' }" @click="switchChartType('torque')">力矩</button>
            </div>
          </div>
          <div class="box-con">
            <Total ref="Total" />
          </div>
        </template>
      </Box>
    </div>
    <div class="main-right width-520">
      <Box style="flex: 0.7;">
        <template #content>
          <div class="box-tit"><span>运行状态</span></div>
          <div class="box-con">
            <div class="yxzt">
              <div class="yxzt-list"><span class="dot dot-warning"></span>工作时长：<em>{{ operationStatus?.gzsc }}</em>min
              </div>
              <div class="yxzt-list"><span class="dot dot-danger"></span>今日吊重：<em>{{ operationStatus?.jrdz }}</em>T
              </div>
              <div class="yxzt-list"><span class="dot dot-success"></span>今日吊次：<em>{{ operationStatus?.jrdc }}</em>次
              </div>
              <div class="yxzt-list"><span class="dot dot-purple"></span>今日报警：<em>{{ operationStatus?.bjs }}</em>次</div>
              <div class="yxzt-list"><span class="dot dot-blue"></span>当前状态：<em>{{ operationStatus?.onLine }}</em></div>
            </div>
            <div class="yxzt-pepole">
              <div class="yxzt-pepole-img"><img :src="getUser(equipmentUser?.imgCardUrl) || '/dp/images/user.png'"
                  alt="" @error="handleImageError($event, '/dp/images/user.png')"></div>
              <div class="yxzt-pepole-info">
                <div>姓名：{{ equipmentUser?.name || '-' }}</div>
                <div>性别：{{ equipmentUser?.sex || '-' }}</div>
                <div>年龄：{{ equipmentUser?.csrq || '-' }}</div>
                <div>电话：{{ equipmentUser?.phone || '-' }}</div>
                <div>身份证号：{{ equipmentUser?.idCard || '-' }}</div>
              </div>
            </div>
          </div>
        </template>
      </Box>
      <Box>
        <template #content>
          <div class="box-tit"><span>设备信息</span></div>
          <div class="box-con">
            <div class="sb-con">
              <div class="sb-con-list"><span>设备名称</span><span>{{ equipmentInfo?.assetName }}</span></div>
              <div class="sb-con-list"><span>设备编号</span><span>{{ equipmentInfo?.assetCode }}</span></div>
              <div class="sb-con-list"><span>设备品牌</span><span>{{ equipmentInfo?.brand }}</span></div>
              <div class="sb-con-list"><span>最大吊重</span><span>{{ equipmentInfo?.maxWeight || '-' }}</span></div>
              <div class="sb-con-list"><span>最大力矩</span><span>{{ equipmentInfo?.ratedTorque || '-' }}</span></div>
              <div class="sb-con-list"><span>前臂长</span><span>{{ equipmentInfo?.foreArmLength || '-' }}</span></div>
              <div class="sb-con-list"><span>后臂长</span><span>{{ equipmentInfo?.rearArmLength || '-' }}</span></div>
              <!-- <div class="sb-con-list"><span>塔臂高</span><span>{{ equipmentInfo?.armHeight || '-' }}</span></div> -->
            </div>
            <div class="sb-btns">
              <div v-for="tab in tabs" :key="tab.id" :class="{ cur: activeTab === tab.id }" @click="switchTab(tab.id)">
                {{ tab.name }}</div>
            </div>
          </div>
        </template>
      </Box>
    </div>
    <!-- 工作循环记录对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="RecordDialog" width="70%" class="dialog other" destroy-on-close
      :modal-append-to-body="false">
      <div class="search-bar">
        <el-date-picker v-model="timeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" @change="handleTimeChange"></el-date-picker>
      </div>
      <el-table :data="currentRecordList" max-height="400" :fit="false" size="small" style="width: 100%"
        class="mx-table">
        <template v-if="activeTab === 'workCycle'">
          <el-table-column prop="projectName" min-width="180" label="项目名称" :show-overflow-tooltip="true"
            s></el-table-column>
          <el-table-column prop="assetName" min-width="180" label="设备名称"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="assetCode" min-width="180" label="设备编号"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="startTime" min-width="180" label="开始时间"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="endTime" min-width="180" label="结束时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="weight" min-width="120" label="平均吊重（T）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="maxPercent" min-width="180" label="本次循环最大力矩（T·M）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="maxHeight" min-width="120" label="最大高度（米）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="minHeight" min-width="120" label="最小幅度（米）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="minRadius" min-width="120" label="最小幅度（米）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="maxRadius" min-width="120" label="最大幅度（米）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="startAngle" min-width="120" label="起吊点角度（米）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="endAngle" min-width="120" label="卸掉点角度（米）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="liftingPointHeight" min-width="120" label="起掉点高度（米）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="liftingPointHeightUnload" min-width="120" label="卸掉点高度（米）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="liftingPointRadius" min-width="120" label="起掉点幅度（米）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="liftingPointRadiusUnload" min-width="120" label="卸掉点幅度（米）"
            :show-overflow-tooltip="true"></el-table-column>
        </template>
        <template v-else-if="activeTab === 'monitorHistory'">
          <el-table-column prop="projectName" min-width="180" label="项目名称"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="assetName" min-width="180" label="设备名称"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="assetCode" min-width="180" label="设备编号"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="monitorTime" min-width="180" label="监测时间"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="amplitude" label="幅度（米）" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="height" label="高度（米）" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="rotation" label="转角（度）" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="weight" label="吊重（T）" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="windspeed" min-width="100" label="风速（米/秒）"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="obliguity" label="倾角（度）" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="moment" label="力矩百分比" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="weightPercentage" label="吊重百分比" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="windPercentage" label="风速百分比" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="obliguityPercentage" label="倾角百分比" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bjyy" label="报警类型" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="brakingStatus" label="制动状态" :show-overflow-tooltip="true"></el-table-column>
        </template>
        <template v-else-if="activeTab === 'alarmHistory'">
          <el-table-column prop="projectName" min-width="180" label="项目名称"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="assetName" label="设备名称" min-width="180"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="assetCode" min-width="180" label="设备编号"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createTime" min-width="180" label="报警时间"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="monitorData" min-width="220" label="报警数据"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="content" min-width="260" label="警报内容" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="handleTime" label="处理时间" min-width="180"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="handleMeasures" label="处理措施" min-width="180"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="handleConclu" label="处理后结论" min-width="180"
            :show-overflow-tooltip="true"></el-table-column>
        </template>
      </el-table>
      <div style="display:flex;justify-content: center;">
        <el-pagination background @current-change="handlePageChange" :current-page="pageNum" :page-size="limit"
          layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Box from '@/components/box.vue'
import SideNav from './SideNav.vue';
import Compass from './Compass.vue'
import Total from './Total.vue'
import { getMonitorHistory, getAlarm, getEquipmentData, getEquipmentState, getEquipmentInfo, getEquipmentWeight, getEquipmentUser, getWorkRecord } from '@/api/index'
import { getFileUrl } from '@/api/safety'
// import { Dialog, Table, TableColumn, Pagination, DatePicker } from 'element-ui';
export default {
  components: {
    Box,
    SideNav,
    Compass,
    Total,
    // ElDialog: Dialog,
    // ElTable: Table,
    // ElTableColumn: TableColumn,
    // ElPagination: Pagination,
    // ElDatePicker: DatePicker
  },
  name: 'TowerCrane',
  data() {
    return {
      selectedEquipment: '',
      equipmentList: [],
      equipmentUser: null,
      operationStatus: null,
      equipmentInfo: null,
      activeTab: 'workCycle',
      tabs: [
        { id: 'workCycle', name: '工作循环记录' },
        { id: 'monitorHistory', name: '监测历史记录' },
        { id: 'alarmHistory', name: '报警历史记录' }
      ],
      // 统计分析图表类型
      chartType: 'weight', // 'weight' 或 'torque',
      pageNum: 1,
      startTime: '',
      endTime: '',
      limit: 10,
      total: 0,
      RecordList: [],
      AlarmList: [],
      MonitorHistoryList: [],
      RecordDialog: false,
      timeRange: null, // 用于存储时间范围选择器的值
      imageUrl: '',
    }
  },
  computed: {
    dialogTitle() {
      switch (this.activeTab) {
        case 'workCycle':
          return '工作循环记录';
        case 'monitorHistory':
          return '监测历史记录';
        case 'alarmHistory':
          return '报警历史记录';
        default:
          return '';
      }
    },
    currentRecordList() {
      switch (this.activeTab) {
        case 'workCycle':
          return this.RecordList;
        case 'monitorHistory':
          return this.MonitorHistoryList;
        case 'alarmHistory':
          return this.AlarmList;
        default:
          return [];
      }
    }
  },
  methods: {
    handleImageError(event, defaultSrc) {
      // 当图片加载失败时，将 src 替换为默认图片
      if (event.target.src !== defaultSrc) {
        if (window.location.origin.includes('localhost')) {
          defaultSrc = defaultSrc.replace('/dp', '')
        }
        event.target.src = defaultSrc;
      }
    },
    async getFileUrl(id) {
      const { data = [] } = await getFileUrl(id);
      const file = data[0];
      return file?.url
        ? file.url.startsWith('http')
          ? file.url
          : `${process.env.VUE_APP_BASE_API}/qdoner${file.url}`
        : null;
    },
    getUser(url) {
      if (!url) return null
      return process.env.VUE_APP_BASE_API + '/qdoner' + url
    },
    changeSB() {
      this.getEquipmentState(this.selectedEquipment)
      this.getEquipmentInfo(this.selectedEquipment)
      this.getEquipmentWeight(this.selectedEquipment)
      let code = this.equipmentList.find(item => item.value == this.selectedEquipment)?.code
      this.getEquipmentUser(code)
      // this.getWorkRecord(this.selectedEquipment) // 切换设备时不直接加载记录，等待点击tab
    },
    getEquipmentData() {
      getEquipmentData().then(res => {
        if (res.data.length == 0) {
          // this.$message.error('暂无数据')
          this.$refs.Total.load = false;
          this.$refs.Compass.load = false;
          this.$alert('暂无设备数据，请先添加设备', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });

          return
        }
        this.equipmentList = res.data.map(item => {
          return {
            label: item.assetName,
            value: item.assetId,
            code: item.assetCode
          }
        })
        this.selectedEquipment = this.equipmentList[0]?.value || ''
        this.getEquipmentState(this.selectedEquipment)
        this.getEquipmentInfo(this.selectedEquipment)
        this.getEquipmentWeight(this.selectedEquipment)
        this.getEquipmentUser(this.equipmentList[0]?.code)
        // this.getWorkRecord(this.selectedEquipment) // 初始化时不直接加载记录，等待点击tab
      })
    },
    getWorkRecord(id) {
      // 确保设备已选择
      if (!this.selectedEquipment) return;
      getWorkRecord(id, this.pageNum, this.limit, this.startTime, this.endTime).then(res => {
        this.RecordList = res.data.list
        this.total = res.data.totalRow
      })
    },
    getMonitorHistory(id) {
      if (!this.selectedEquipment) return;
      getMonitorHistory(id, this.pageNum, this.limit, this.startTime, this.endTime).then(res => {
        this.MonitorHistoryList = res.data.list
        this.total = res.data.totalRow
      })
    },
    getAlarm(id) {
      if (!this.selectedEquipment) return;
      getAlarm(id, this.pageNum, this.limit, this.startTime, this.endTime).then(res => {
        this.AlarmList = res.data.list
        this.total = res.data.totalRow
      })
    },
    getEquipmentState(id) {
      getEquipmentState(id).then(async res => {
        this.equipmentInfo = res.data
        this.imageUrl = await this.getFileUrl(this.equipmentInfo?.batchId) || '/images/td.png'
        this.$nextTick(async () => {
          this.$refs.Compass?.initData(this.equipmentInfo?.angle || 0)
        })
      })
    },
    getEquipmentInfo(id) {
      getEquipmentInfo(id).then(res => {
        this.operationStatus = res.data
      })
    },
    getEquipmentWeight(id) {
      getEquipmentWeight(id).then(res => {
        this.$refs?.Total?.intData(res.data)
      })
    },
    // 切换统计分析图表类型
    switchChartType(type) {
      this.chartType = type;
      this.$refs.Total.changeType(type);
      // TODO: 更新图表数据
    },
    // 切换信息选项卡
    switchTab(tabId) {
      this.activeTab = tabId;
      this.RecordDialog = true; // 打开同一个对话框
      this.pageNum = 1; // 重置页码
      this.timeRange = null; // 重置时间范围
      this.startTime = '';
      this.endTime = '';

      if (tabId == 'workCycle') {
        this.getWorkRecord(this.selectedEquipment); // 加载工作循环记录数据
      } else if (tabId == 'monitorHistory') {
        this.getMonitorHistory(this.selectedEquipment);
      } else if (tabId == 'alarmHistory') {
        this.getAlarm(this.selectedEquipment);
      }
    },
    // 更新实时数据
    updateRealTimeData() {
      // TODO: 从API获取最新数据
    },
    getEquipmentUser(id) {
      getEquipmentUser(id).then(res => {
        this.equipmentUser = res.data
      })
    },
    // 处理分页变化
    handlePageChange(val) {
      debugger
      this.pageNum = val;
      if (this.activeTab === 'workCycle') {
        this.getWorkRecord(this.selectedEquipment);
      } else if (this.activeTab === 'monitorHistory') {
        this.getMonitorHistory(this.selectedEquipment);
      } else if (this.activeTab === 'alarmHistory') {
        this.getAlarm(this.selectedEquipment);
      }
    },
    // 处理时间范围变化
    handleTimeChange(val) {
      if (val) {
        this.startTime = val[0];
        this.endTime = val[1];
      } else {
        this.startTime = '';
        this.endTime = '';
      }
      if (this.activeTab === 'workCycle') {
        this.getWorkRecord(this.selectedEquipment);
      } else if (this.activeTab === 'monitorHistory') {
        this.getMonitorHistory(this.selectedEquipment);
      } else if (this.activeTab === 'alarmHistory') {
        this.getAlarm(this.selectedEquipment);
      }
    }
  },
  mounted() {
    this.getEquipmentData()
    // 初始化实时数据更新定时器
    // setInterval(this.updateRealTimeData, 5000);
    // TODO: 初始化图表
  }
}
</script>

<style scoped>
/* 添加对话框和表格样式 */
.dialog .el-dialog__body {
  padding-top: 0;
}

.dialog .el-pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog .search-bar {
  margin-bottom: 20px;
}

.dialog .search-bar .el-date-editor {
  margin-right: 10px;
}
</style>
