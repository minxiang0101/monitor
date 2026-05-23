<template>
  <div class="main">
    <div class="main-left width-170" style="overflow: hidden; overflow-y: auto;">
      <SideNav />
    </div>
    <div class="main-center other2" style="width: calc(100% - 560px - 170px);">
      <Box>
        <template #content>
          <div class="box-con">
            <img :src="imgUrl" alt="" style="height: 100%;">
          </div>
        </template>
      </Box>
    </div>
    <div class="main-right" style="width: 560px;">
      <Box>
        <template #content>
          <div class="box-tit"><span>今日工作情况</span></div>
          <div class="box-con">
            <div class="workSituation">
              <div class="workSituation-con">
                <div class="info">
                  <div class="img"><img src="/dp/images/i-09.png"
                      @error="handleImageError($event, '/dp/images/i-09.png')" alt=""></div>
                  <div class="info-con">
                    <h4>{{ onlineEquipment }}</h4>
                    <p>在线设备</p>
                  </div>
                </div>
                <div class="dec">设备总数<span>{{ TotalNumberOfDevices }}台</span></div>
              </div>
              <div class="workSituation-con">
                <div class="info">
                  <div class="img"><img src="/dp/images/i-10.png"
                      @error="handleImageError($event, '/dp/images/i-10.png')" alt=""></div>
                  <div class="info-con">
                    <h4>{{ workStatus?.jt[1]?.val }}</h4>
                    <p>报警总数</p>
                  </div>
                </div>
                <div class="dec">昨日数据<span>{{ workStatus?.zt[1]?.val }}</span>同比过去30日<span>{{ (workStatus?.sst[1]?.val /
                  30).toFixed(2) }}%</span></div>
              </div>
            </div>
          </div>
        </template>
      </Box>
      <Box style="flex: 2.9;">
        <template #content>
          <div class="box-tit"><span>设备实时运行列表</span></div>
          <div class="box-con" style="max-height: 585px; overflow-y: auto;">
            <table class="table">
              <colgroup>
                <col style="width: 20%;">
                <col style="width: 20%;">
                <col style="width: 25%;">
              </colgroup>
              <tbody id="tableBody">
                <tr v-for="(device, index) in deviceList" :key="'device-' + index">
                  <td>
                    <div class="dot" :class="device.line == '1' ? 'dot-success' : ''"></div>{{ device.line == 1 ? '运行'
                      : '离线' }}
                  </td>
                  <td>{{ device.assetName }}</td>
                  <td>{{ device.assetCode }}</td>
                  <td>{{ device.monitorTime || '-' }}</td>
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
import Box from '@/components/box.vue'
import SideNav from './SideNav.vue';
import { getSelectAllOverview, getSelectAllAlert } from '@/api/index'
import { getFileUrl } from '@/api/safety'
import { mapGetters } from 'vuex'
export default {
  components: {
    Box,
    SideNav
  },
  name: 'EquipmentManagement',
  data() {
    return {
      workStatus: [],
      deviceList: [],
      TotalNumberOfDevices: 0,
      onlineEquipment: 0,
      planBatchId: '',
      imgUrl: '',
    }
  },
  computed: {
    ...mapGetters(['projectInfo'])
  },
  mounted() {
    this.getSelectAllOverview()
    this.getSelectAllAlert()
    let planBatchId = this.projectInfo?.planBatchId
    this.getFileUrl(planBatchId)
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
    getFileUrl(id) {
      getFileUrl(id).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '暂无文件',
            type: 'warning'
          })
          return
        } else {
          if (res.data[0].url.startsWith('http')) {
            this.imgUrl = res.data[0].url
          } else {
            this.imgUrl = `${process.env.VUE_APP_BASE_API}/qdoner${res.data[0].url}`
          }

        }
      })
    },
    getSelectAllOverview() {
      getSelectAllOverview().then(res => {
        this.deviceList = res.data
        this.TotalNumberOfDevices = res.data.length
        res.data.forEach(item => {
          if (item.line == 1) this.onlineEquipment++
        })
      })
    },
    getSelectAllAlert() {
      getSelectAllAlert().then(res => {
        this.workStatus = res.data
      })
    }
  }
}
</script>

<style scoped></style>