<template>
  <div class="main">
    <div class="main-left width-355">
      <Box>
        <template #content>
          <div class="box-tit device-list-title">
            <span>设备列表</span>
            <el-input
              v-model.trim="searchKey"
              placeholder="请输入设备名称"
              class="mx-select video-search-input"
              clearable
              @keyup.enter.native="handleSearch"
              @clear="handleSearch"
            ></el-input>
          </div>
          <div class="box-con device-list-box">
            <el-tree
              ref="deviceTree"
              class="device-tree"
              :data="devices"
              node-key="__videoKey"
              :props="{ children: 'children', label: 'label' }"
              :expand-on-click-node="false"
              :default-expand-all="defaultExpandAll"
              :default-expanded-keys="expandedDeviceKeys"
              :highlight-current="true"
              @node-click="handleDeviceNodeClick"
            >
              <span
                slot-scope="{ data }"
                class="device-tree-node"
                :class="{ 'is-camera': data.type === 1 }"
                @dblclick.stop.prevent="handleDeviceNodeDoubleClick(data)"
              >
                <i :class="data.type === 1 ? 'el-icon-video-camera' : 'el-icon-folder'"></i>
                <span>{{ data.label }}</span>
              </span>
            </el-tree>
            <el-empty v-if="devices.length === 0" :image-size="100" description="暂无数据"></el-empty>
          </div>
        </template>
      </Box>

    </div>
    <div class="main-center other5">
      <Box>
        <template #content>
          <div class="box-con video-display-area">
            <div class="action-buttons">
                <button class="action-btn fullscreen" @click="changeLayout('1')"><i
                    class="el-icon-s-platform"></i></button>
                <button class="action-btn grid-view" @click="changeLayout('4')"><i class="el-icon-menu"></i></button>
                <button class="action-btn list-view" @click="changeLayout('9')"><i class="el-icon-s-grid"></i></button>
              </div>
            <div :class="videoContainerClass">
              <div
                v-for="pane in visiblePanes"
                :key="`pane-${pane.paneIndex}`"
                class="video-item pane-item"
                :class="{
                  active: activePaneIndex === pane.paneIndex,
                  'pane-sortable': layoutCount > 1,
                  'pane-dragging': dragPaneIndex === pane.paneIndex,
                  'pane-drag-over': dragOverPaneIndex === pane.paneIndex
                }"
                :ref="`paneItem-${pane.paneIndex}`"
                :draggable="layoutCount > 1"
                @click="selectPane(pane.paneIndex)"
                @dragstart="handlePaneDragStart($event, pane.paneIndex)"
                @dragover="handlePaneDragOver($event, pane.paneIndex)"
                @drop="handlePaneDrop($event, pane.paneIndex)"
                @dragend="handlePaneDragEnd"
              >
                <div class="pane-tag">窗口 {{ pane.paneIndex + 1 }}</div>
                <button
                  v-if="pane.device"
                  class="pane-close-btn"
                  type="button"
                  @click.stop="closePaneVideo(pane.paneIndex)"
                >
                  <i class="el-icon-close"></i>
                  <span>关闭</span>
                </button>
                <div v-if="layoutCount > 1" class="pane-drag-hint">
                  <i class="el-icon-rank"></i>
                  <span>拖拽换位</span>
                </div>
                <div class="pane-player" @dblclick.stop.prevent="handlePaneDoubleClick(pane)">
                  <HlsPlayer
                    :ref="`hlsPlayer-${pane.paneIndex}`"
                    :src="pane.videoUrl"
                    :has-device="!!pane.device"
                    :empty-text="pane.device ? '视频已断开' : '请先选择某个监控画面'"
                  />
                </div>
                <div v-if="pane.device" class="pane-ptz-control" @click.stop @mousedown.stop @dragstart.stop.prevent>
                  <div v-if="isPtzSupported(pane.device)" class="ptz-grid">
                    <button
                      v-for="control in ptzDirectionControls"
                      :key="control.command"
                      class="ptz-btn"
                      :class="[`ptz-${control.position}`, { active: isPtzActive(pane, control.command) }]"
                      type="button"
                      :title="control.label"
                      @mousedown.stop.prevent="startPtz(pane, control.command)"
                      @mouseup.stop.prevent="stopPtz(pane, control.command)"
                      @mouseleave.stop.prevent="stopPtz(pane, control.command)"
                      @touchstart.stop.prevent="startPtz(pane, control.command)"
                      @touchend.stop.prevent="stopPtz(pane, control.command)"
                      @touchcancel.stop.prevent="stopPtz(pane, control.command)"
                    >
                      <i :class="control.icon"></i>
                    </button>
                    <div class="ptz-center">PTZ</div>
                  </div>
                  <div class="ptz-zoom">
                    <template v-if="isPtzSupported(pane.device)">
                      <button
                        v-for="control in ptzZoomControls"
                        :key="control.command"
                        class="ptz-zoom-btn"
                        :class="{ active: isPtzActive(pane, control.command) }"
                        type="button"
                        :title="control.label"
                        @mousedown.stop.prevent="startPtz(pane, control.command)"
                        @mouseup.stop.prevent="stopPtz(pane, control.command)"
                        @mouseleave.stop.prevent="stopPtz(pane, control.command)"
                        @touchstart.stop.prevent="startPtz(pane, control.command)"
                        @touchend.stop.prevent="stopPtz(pane, control.command)"
                        @touchcancel.stop.prevent="stopPtz(pane, control.command)"
                      >
                        <i :class="control.icon"></i>
                      </button>
                    </template>
                    <button
                      class="ptz-zoom-btn"
                      :class="{ active: isPanePaused(pane.paneIndex) }"
                      type="button"
                      :title="isPanePaused(pane.paneIndex) ? '继续播放' : '暂停播放'"
                      @click.stop="togglePanePlayback(pane.paneIndex)"
                    >
                      <i :class="isPanePaused(pane.paneIndex) ? 'el-icon-video-play' : 'el-icon-video-pause'"></i>
                    </button>
                    <!-- <button
                      class="ptz-zoom-btn"
                      type="button"
                      :title="isPaneFullscreen(pane.paneIndex) ? '恢复' : '全屏'"
                      @click.stop="togglePaneFullscreen(pane.paneIndex)"
                    >
                      <i :class="isPaneFullscreen(pane.paneIndex) ? 'el-icon-copy-document' : 'el-icon-full-screen'"></i>
                    </button> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Box>
    </div>
  </div>
</template>

<script>
import Box from '@/components/box.vue'
import HlsPlayer from '@/components/HlsPlayer.vue'
import { getVideoTree, getVideoStreamById, controlProjectMonitor } from '@/api/index'
import { getAiAlert } from '@/api/safety'
export default {
  components: {
    Box,
    HlsPlayer
  },
  name: 'VideoMonitoringDefault',
  data() {
    return {
      allDevices: [],
      devices: [],
      captureList: [],
      searchKey: '',
      videoLayout: '1', // '1', '4', '9'
      activePaneIndex: null,
      paneDevices: Array(9).fill(null),
      videoUrlsForLayout: {},
      defaultExpandAll: true,// 是否默认展开所有节点
      expandedDeviceKeys: [],
      activePtzCommands: {},
      pausedPaneMap: {},
      fullscreenPaneIndex: null,
      ptzSpeed: 10,
      ptzDirectionControls: [
        { command: 'LEFT_UP', label: '左上', icon: 'el-icon-top-left', position: 'left-up' },
        { command: 'UP', label: '上转', icon: 'el-icon-top', position: 'up' },
        { command: 'RIGHT_UP', label: '右上', icon: 'el-icon-top-right', position: 'right-up' },
        { command: 'LEFT', label: '左转', icon: 'el-icon-back', position: 'left' },
        { command: 'RIGHT', label: '右转', icon: 'el-icon-right', position: 'right' },
        { command: 'LEFT_DOWN', label: '左下', icon: 'el-icon-bottom-left', position: 'left-down' },
        { command: 'DOWN', label: '下转', icon: 'el-icon-bottom', position: 'down' },
        { command: 'RIGHT_DOWN', label: '右下', icon: 'el-icon-bottom-right', position: 'right-down' }
      ],
      ptzZoomControls: [
        { command: 'ZOOM_IN', label: '焦距变大', icon: 'el-icon-zoom-in' },
        { command: 'ZOOM_OUT', label: '焦距变小', icon: 'el-icon-zoom-out' }
      ],
      dragPaneIndex: null,
      dragOverPaneIndex: null,
      treeNodeClickTimer: null
    }
  },
  computed: {
    layoutCount() {
      return Number(this.videoLayout) || 1
    },
    videoContainerClass() {
      if (this.videoLayout === '1') {
        return 'single-video'
      }
      return ['grid-video', `grid-${this.videoLayout}`]
    },
    visiblePanes() {
      if (this.videoLayout === '1') {
        const paneIndex = this.activePaneIndex === null ? 0 : this.activePaneIndex
        return [this.createPane(paneIndex)]
      }
      return Array.from({ length: this.layoutCount }, (_, index) => this.createPane(index))
    },
    currentDevice() {
      if (this.activePaneIndex === null) return null
      return this.paneDevices[this.activePaneIndex] || null
    }
  },
  mounted() {
    this.getVideoList()
    this.getAiAlert()
    document.addEventListener('fullscreenchange', this.handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange)
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange)
    this.clearTreeNodeClickTimer()
  },
  methods: {
    changeYt(type) {
      if (!this.currentDevice) {
        this.$message.warning('请先选择一个设备')
        return
      }
      void type
      // PtzControl('1',type)
    },
    getAiAlert() {
      getAiAlert().then(res => {
        this.captureList = res.data?.list || []
        this.captureList?.map(async item => {
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
    getVideoStream(id) {
      getVideoStreamById(id).then(res => {
        this.$set(this.videoUrlsForLayout, id, res.data)
      })
    },
    getPtzCommandKey(pane, command) {
      const videoId = this.getDeviceVideoId(pane?.device)
      return videoId ? `${videoId}_${command}` : ''
    },
    isPtzSupported(device) {
      // 监控点类型：枪机0/半球1/快球2/带云台枪机3；其中 2 和 3 才支持云台操作
      const cameraType = device?.camera_type ?? device?.cameraType
      const cameraTypeNum = cameraType === '' || cameraType === null || cameraType === undefined ? NaN : Number(cameraType)
      return cameraTypeNum === 2 || cameraTypeNum === 3
    },
    isPtzActive(pane, command) {
      const key = this.getPtzCommandKey(pane, command)
      return key ? !!this.activePtzCommands[key] : false
    },
    startPtz(pane, command) {
      if (!this.isPtzSupported(pane?.device)) return
      const key = this.getPtzCommandKey(pane, command)
      if (!key || this.activePtzCommands[key]) return
      this.$set(this.activePtzCommands, key, true)
      this.sendPtzControl(pane, command, 1)
    },
    stopPtz(pane, command) {
      if (!this.isPtzSupported(pane?.device)) return
      const key = this.getPtzCommandKey(pane, command)
      if (!key || !this.activePtzCommands[key]) return
      this.$delete(this.activePtzCommands, key)
      this.sendPtzControl(pane, command, 0, true)
    },
    sendPtzControl(pane, command, action, actionOnly = false) {
      if (!this.isPtzSupported(pane?.device)) return
      const videoId = this.getDeviceVideoId(pane?.device)
      if (!videoId) return
      const payload = actionOnly ? this.buildPtzStopPayload(command, action) : this.buildPtzControlPayload(command, action)
      if (!payload) return
      controlProjectMonitor(videoId, payload).catch(() => {
        const key = this.getPtzCommandKey(pane, command)
        if (key) this.$delete(this.activePtzCommands, key)
      })
    },
    getPtzSpeed() {
      const speed = Number(this.ptzSpeed)
      return Number.isFinite(speed) ? Math.min(Math.max(speed, 1), 100) : 50
    },
    buildPtzStopPayload(command, action) {
      const normalizedCommand = String(command || '').toUpperCase()
      if (!normalizedCommand) return null
      return {
        action,
        command: normalizedCommand
      }
    },
    buildPtzControlPayload(command, action, presetIndex) {
      const normalizedCommand = String(command || '').toUpperCase()
      if (!normalizedCommand) return null
      if (normalizedCommand === 'GOTO_PRESET' && (presetIndex === undefined || presetIndex === null || presetIndex === '')) {
        this.$message.warning('到预置点需要传入预置点编号')
        return null
      }
      const payload = {
        action,
        command: normalizedCommand,
        speed: this.getPtzSpeed()
      }
      if (normalizedCommand === 'GOTO_PRESET') {
        payload.presetIndex = Number(presetIndex)
      }
      return payload
    },
    getPanePlayer(index) {
      const player = this.$refs[`hlsPlayer-${index}`]
      return Array.isArray(player) ? player[0] : player
    },
    isPanePaused(index) {
      return !!this.pausedPaneMap[index]
    },
    togglePanePlayback(index) {
      if (this.isPanePaused(index)) {
        this.playPaneVideo(index)
      } else {
        this.pausePaneVideo(index)
      }
    },
    pausePaneVideo(index) {
      const player = this.getPanePlayer(index)
      if (player?.pause) {
        player.pause()
        this.$set(this.pausedPaneMap, index, true)
      }
    },
    playPaneVideo(index) {
      const player = this.getPanePlayer(index)
      if (player?.play) {
        player.play()
        this.$delete(this.pausedPaneMap, index)
      }
    },
    isPaneFullscreen(index) {
      return this.fullscreenPaneIndex === index
    },
    getPaneElement(index) {
      const pane = this.$refs[`paneItem-${index}`]
      return Array.isArray(pane) ? pane[0] : pane
    },
    getFullscreenElement() {
      return document.fullscreenElement || document.webkitFullscreenElement || null
    },
    togglePaneFullscreen(index) {
      const fullscreenElement = this.getFullscreenElement()
      if (fullscreenElement && this.isPaneFullscreen(index)) {
        this.exitFullscreen()
        return
      }
      const paneElement = this.getPaneElement(index)
      if (!paneElement) return
      const requestFullscreen = paneElement.requestFullscreen || paneElement.webkitRequestFullscreen
      if (requestFullscreen) {
        requestFullscreen.call(paneElement)
      }
    },
    handlePaneDoubleClick(pane) {
      if (!pane.device || !pane.videoUrl) return
      this.activePaneIndex = pane.paneIndex
      this.togglePaneFullscreen(pane.paneIndex)
    },
    exitFullscreen() {
      const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen
      if (exitFullscreen) {
        exitFullscreen.call(document)
      }
    },
    handleFullscreenChange() {
      const fullscreenElement = this.getFullscreenElement()
      if (!fullscreenElement) {
        this.fullscreenPaneIndex = null
        return
      }
      const fullscreenIndex = this.visiblePanes.find(({ paneIndex }) => this.getPaneElement(paneIndex) === fullscreenElement)
      this.fullscreenPaneIndex = fullscreenIndex ? fullscreenIndex.paneIndex : null
    },
    getVideoList() {
      getVideoTree().then(res => {
        this.allDevices = this.normalizeVideoTree(res.data)
        this.devices = this.allDevices
        this.$nextTick(() => {
          this.applyDefaultTreeExpansion()
        })
      })
    },
    handleSearch() {
      this.applyDeviceFilter()
    },
    applyDeviceFilter() {
      const keyword = this.searchKey.trim().toLowerCase()
      this.devices = keyword ? this.filterVideoTree(this.allDevices, keyword) : this.allDevices
      this.$nextTick(() => {
        if (!keyword) {
          this.applyDefaultTreeExpansion()
          return
        }
        const expandedKeys = this.collectTreeKeys(this.devices, false)
        this.expandedDeviceKeys = expandedKeys
        this.setTreeNodesExpanded(expandedKeys, true)
        const firstCamera = this.findFirstCamera(this.devices)
        if (firstCamera) {
          this.$refs.deviceTree?.setCurrentKey(firstCamera.__videoKey)
        }
      })
    },
    normalizeVideoTree(data) {
      const roots = Array.isArray(data) ? data : (data ? [data] : [])
      const walk = (node, parents = []) => {
        if (!node) return null
        const children = Array.isArray(node.children) ? node.children : []
        const name = node.label || node.name || ''
        const id = node.id || node.indexCode
        const pathNames = name ? parents.concat(name) : parents
        return {
          ...node,
          id,
          name,
          label: name,
          indexCode: node.indexCode || id,
          __videoId: id,
          __videoKey: String(id || node.indexCode || pathNames.join('-')),
          pathName: pathNames.join(' / '),
          children: children.map(child => walk(child, pathNames)).filter(Boolean)
        }
      }

      return roots.map(root => walk(root)).filter(Boolean)
    },
    filterVideoTree(tree, keyword) {
      return tree.reduce((result, node) => {
        const children = this.filterVideoTree(node.children || [], keyword)
        const text = `${node.label || ''}${node.pathName || ''}`.toLowerCase()
        if (text.includes(keyword) || children.length > 0) {
          result.push({
            ...node,
            children
          })
        }
        return result
      }, [])
    },
    collectTreeKeys(tree, includeLeaf = true) {
      return tree.reduce((keys, node) => {
        const children = node.children || []
        if (includeLeaf || children.length > 0) {
          keys.push(node.__videoKey)
        }
        keys.push(...this.collectTreeKeys(children, includeLeaf))
        return keys
      }, [])
    },
    setTreeNodesExpanded(keys, expanded) {
      keys.forEach(key => {
        const treeNode = this.$refs.deviceTree?.getNode(key)
        if (treeNode) treeNode.expanded = expanded
      })
    },
    applyDefaultTreeExpansion() {
      const treeKeys = this.collectTreeKeys(this.devices, false)
      this.expandedDeviceKeys = this.defaultExpandAll ? treeKeys : []
      this.setTreeNodesExpanded(treeKeys, this.defaultExpandAll)
    },
    findFirstCamera(tree) {
      for (const node of tree) {
        if (node.type === 1) return node
        const child = this.findFirstCamera(node.children || [])
        if (child) return child
      }
      return null
    },
    getDeviceVideoId(device) {
      return device?.__videoId || device?.id || device?.videoId || device?.monitorId || device?.cameraId || device?.indexCode || device?.code
    },
    createPane(index) {
      const device = this.paneDevices[index] || null
      const videoId = this.getDeviceVideoId(device)
      return {
        paneIndex: index,
        device,
        videoUrl: videoId ? (this.videoUrlsForLayout[videoId] || '') : ''
      }
    },
    selectPane(index) {
      this.activePaneIndex = this.activePaneIndex === index ? null : index
    },
    getAutoFillPaneOrder() {
      if (this.videoLayout === '1') {
        return [0]
      }
      if (this.videoLayout === '4') {
        return [0, 1, 2, 3]
      }
      if (this.videoLayout === '9') {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8]
      }
      return []
    },
    getNextAutoFillPaneIndex() {
      return this.getAutoFillPaneOrder().find(index => !this.paneDevices[index])
    },
    getEmptyAutoFillPaneIndexes() {
      return this.getAutoFillPaneOrder().filter(index => !this.paneDevices[index])
    },
    collectCameraNodes(node) {
      if (!node) return []
      if (node.type === 1) return [node]
      return (node.children || []).reduce((result, child) => {
        result.push(...this.collectCameraNodes(child))
        return result
      }, [])
    },
    getPlayingVideoIdSet() {
      return this.paneDevices.reduce((result, device) => {
        const videoId = this.getDeviceVideoId(device)
        if (videoId) result.add(String(videoId))
        return result
      }, new Set())
    },
    clearTreeNodeClickTimer() {
      if (this.treeNodeClickTimer) {
        clearTimeout(this.treeNodeClickTimer)
        this.treeNodeClickTimer = null
      }
    },
    scheduleTreeNodeToggle(node) {
      this.clearTreeNodeClickTimer()
      this.treeNodeClickTimer = setTimeout(() => {
        node.expanded = !node.expanded
        this.treeNodeClickTimer = null
      }, 300)
    },
    handleDeviceNodeClick(data, node) {
      if (data.type !== 1) {
        // this.scheduleTreeNodeToggle(node)
        return
      }
      this.selectDevice(data)
    },
    handleDeviceNodeDoubleClick(data) {
      this.clearTreeNodeClickTimer()
      if (this.activePaneIndex !== null || data.type === 1) return
      const emptyPaneIndexes = this.getEmptyAutoFillPaneIndexes()
      if (emptyPaneIndexes.length === 0) {
        this.$message.warning('播放窗口已满，请先关闭现有视频')
        return
      }
      const playingVideoIds = this.getPlayingVideoIdSet()
      const cameraNodes = this.collectCameraNodes(data).filter(item => {
        const videoId = this.getDeviceVideoId(item)
        return videoId && !playingVideoIds.has(String(videoId))
      })
      cameraNodes.slice(0, emptyPaneIndexes.length).forEach((item, index) => {
        this.setPaneDevice(emptyPaneIndexes[index], item)
      })
    },
    setPaneDevice(paneIndex, item) {
      const videoId = this.getDeviceVideoId(item)
      if (!videoId) return false
      this.$set(this.paneDevices, paneIndex, item)
      this.$delete(this.pausedPaneMap, paneIndex)
      if (!this.videoUrlsForLayout[videoId]) {
        this.getVideoStream(videoId)
      }
      return true
    },
    selectDevice(item) {
      const targetPaneIndex = this.activePaneIndex === null ? this.getNextAutoFillPaneIndex() : this.activePaneIndex
      if (targetPaneIndex === undefined) {
        if (this.layoutCount > 1) {
          this.$message.warning('播放窗口已满，请先选择窗口或关闭现有视频')
          return
        }
        this.$message.warning('请先选择播放窗口')
        return
      }
      const videoId = this.getDeviceVideoId(item)
      if (!videoId) {
        this.$message.warning('当前设备缺少视频ID')
        return
      }
      this.setPaneDevice(targetPaneIndex, item)
      this.$nextTick(() => {
        this.$refs.deviceTree?.setCurrentKey(item.__videoKey)
      })
    },
    closePaneVideo(index) {
      this.$set(this.paneDevices, index, null)
      this.$delete(this.pausedPaneMap, index)
      if (this.dragPaneIndex === index || this.dragOverPaneIndex === index) {
        this.resetPaneDragState()
      }
    },
    handlePaneDragStart(event, index) {
      if (this.layoutCount === 1) {
        event.preventDefault()
        return
      }
      this.dragPaneIndex = index
      this.dragOverPaneIndex = null
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
    },
    handlePaneDragOver(event, index) {
      if (this.dragPaneIndex === null || this.dragPaneIndex === index) {
        return
      }
      event.preventDefault()
      this.dragOverPaneIndex = index
      event.dataTransfer.dropEffect = 'move'
    },
    handlePaneDrop(event, index) {
      event.preventDefault()
      const sourceIndex = this.dragPaneIndex === null
        ? Number(event.dataTransfer.getData('text/plain'))
        : this.dragPaneIndex
      if (Number.isNaN(sourceIndex) || sourceIndex === index) {
        this.resetPaneDragState()
        return
      }
      const sourcePaneDevice = this.paneDevices[sourceIndex] || null
      const targetPaneDevice = this.paneDevices[index] || null
      this.$set(this.paneDevices, sourceIndex, targetPaneDevice)
      this.$set(this.paneDevices, index, sourcePaneDevice)
      if (this.activePaneIndex === sourceIndex) {
        this.activePaneIndex = index
      } else if (this.activePaneIndex === index) {
        this.activePaneIndex = sourceIndex
      }
      this.resetPaneDragState()
    },
    handlePaneDragEnd() {
      this.resetPaneDragState()
    },
    resetPaneDragState() {
      this.dragPaneIndex = null
      this.dragOverPaneIndex = null
    },
    changeLayout(layout) {
      this.resetPaneDragState()
      this.videoLayout = layout
      if (layout === '4' && this.activePaneIndex !== null && this.activePaneIndex > 3) {
        this.activePaneIndex = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.device-list-box {
  max-height: 460px;
  overflow-y: auto;
}

.device-list-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 12px;
}

.device-list-title > span {
  flex: 0 0 auto;
  white-space: nowrap;
}

.video-search-input {
  flex:0.8;
  width: 180px;
}

.device-tree {
  color: #fff;
  background: transparent;
  padding: 8px 6px 10px;
  font-size: 14px;
}

.device-tree ::v-deep .el-tree-node__content {
  height: 36px;
  margin: 2px 0;
  border: 1px solid transparent;
  border-radius: 4px;
  color: #fff;
  background: transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.device-tree ::v-deep .el-tree-node__content:hover {
  border-color: rgba(108, 192, 255, 0.45);
  background: linear-gradient(90deg, rgba(0, 178, 255, 0.18), rgba(5, 34, 68, 0.18));
}

.device-tree ::v-deep .el-tree-node.is-current > .el-tree-node__content {
  border-color: rgba(0, 178, 255, 0.85);
  background: linear-gradient(90deg, rgba(0, 178, 255, 0.36), rgba(5, 34, 68, 0.32));
  box-shadow: inset 3px 0 0 #00B2FF, 0 0 12px rgba(0, 178, 255, 0.25);
}

.device-tree ::v-deep .el-tree-node:focus > .el-tree-node__content {
  background: transparent;
}

.device-tree ::v-deep .el-tree-node__expand-icon {
  color: rgba(108, 192, 255, 0.9);
}

.device-tree ::v-deep .el-tree-node__expand-icon.is-leaf {
  color: transparent;
}

.device-tree ::v-deep .el-tree-node__children {
  position: relative;
}

.device-tree ::v-deep .el-tree-node__children::before {
  position: absolute;
  top: 0;
  bottom: 4px;
  left: 18px;
  width: 1px;
  content: '';
  background: rgba(108, 192, 255, 0.18);
}

.device-tree-node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1;
}

.device-tree-node i {
  color: rgba(108, 192, 255, 0.95);
  font-size: 15px;
}

.device-tree-node.is-camera {
  cursor: pointer;
  color: #fff;
}

.device-tree-node.is-camera i {
  color: #00D6FF;
}

.video-display-area {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  min-height: 0;

  .single-video {
    width: 100%;
    height: 100%;
    display: flex;
    min-height: 0;
  }

  .grid-video {
    width: 100%;
    height: 100%;
    display: grid;
    gap: 10px;
    min-height: 0;

    .video-item {
      width: 100%;
      height: 100%;
      max-height: none;
      min-height: 0;
    }

    .pane-ptz-control {
      transform: scale(0.82);
      transform-origin: right bottom;
    }
  }

  .single-video .video-item {
    flex: 1;
    min-height: 0;
  }

  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  .grid-9 {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);

    .pane-ptz-control {
      transform: scale(0.68);
    }
  }
}

.pane-item {
  position: relative;
  display: flex;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(108, 192, 255, 0.35);
  background: rgba(6, 28, 56, 0.45);
  min-height: 0;
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.pane-sortable {
  cursor: grab;
}

.pane-sortable:active {
  cursor: grabbing;
}

.pane-player {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.pane-player ::v-deep .video-container {
  width: 100%;
  height: 100%;
  padding-top: 0 !important;
}

.pane-player ::v-deep .video-player,
.pane-player ::v-deep .video-placeholder {
  width: 100%;
  height: 100%;
}

.pane-item:hover {
  border-color: rgba(108, 192, 255, 0.7);
}

.pane-item.active {
  border-color: rgba(0, 178, 255, 0.95);
  box-shadow: 0 0 18px rgba(0, 178, 255, 0.75), 0 0 36px rgba(0, 178, 255, 0.35);
}

.pane-item.pane-dragging {
  opacity: 0.55;
}

.pane-item.pane-drag-over {
  border-color: rgba(0, 214, 255, 0.95);
  box-shadow: inset 0 0 0 1px rgba(0, 214, 255, 0.9), 0 0 18px rgba(0, 214, 255, 0.35);
  transform: scale(0.99);
}

.pane-item:fullscreen,
.pane-item:-webkit-full-screen {
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  background: #061c38;
}

.pane-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(5, 34, 68, 0.75);
  border: 1px solid rgba(108, 192, 255, 0.45);
  color: #fff;
  font-size: 12px;
  line-height: 1;
}

.pane-ptz-control {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 4;
  display: flex;
  align-items: stretch;
  gap: 8px;
  padding: 8px;
  border: 1px solid rgba(108, 192, 255, 0.45);
  border-radius: 10px;
  background: rgba(5, 34, 68, 0.72);
  box-shadow: 0 0 16px rgba(0, 178, 255, 0.18);
  backdrop-filter: blur(2px);
}

.ptz-grid {
  display: grid;
  grid-template-columns: repeat(3, 28px);
  grid-template-rows: repeat(3, 28px);
  gap: 4px;
}

.ptz-btn,
.ptz-zoom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid rgba(108, 192, 255, 0.4);
  border-radius: 5px;
  color: #fff;
  background: rgba(5, 34, 68, 0.78);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.ptz-btn:hover,
.ptz-zoom-btn:hover,
.ptz-btn.active,
.ptz-zoom-btn.active {
  border-color: rgba(0, 214, 255, 0.95);
  background: rgba(0, 178, 255, 0.38);
  box-shadow: 0 0 10px rgba(0, 178, 255, 0.45);
}

.ptz-left-up {
  grid-column: 1;
  grid-row: 1;
}

.ptz-up {
  grid-column: 2;
  grid-row: 1;
}

.ptz-right-up {
  grid-column: 3;
  grid-row: 1;
}

.ptz-left {
  grid-column: 1;
  grid-row: 2;
}

.ptz-right {
  grid-column: 3;
  grid-row: 2;
}

.ptz-left-down {
  grid-column: 1;
  grid-row: 3;
}

.ptz-down {
  grid-column: 2;
  grid-row: 3;
}

.ptz-right-down {
  grid-column: 3;
  grid-row: 3;
}

.ptz-center {
  display: inline-flex;
  grid-column: 2;
  grid-row: 2;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 11px;
  background: rgba(0, 178, 255, 0.12);
}

.ptz-zoom {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ptz-zoom-btn {
  width: 28px;
  height: 28px;
}

.pane-close-btn,
.pane-drag-hint {
  position: absolute;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
  line-height: 1;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}

.pane-close-btn {
  top: 10px;
  right: 10px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(217, 83, 79, 0.88);
  cursor: pointer;
}

.pane-close-btn:hover {
  background: rgba(224, 111, 107, 0.95);
}

.pane-drag-hint {
  right: 10px;
  bottom: 10px;
  background: rgba(5, 34, 68, 0.75);
  border: 1px solid rgba(108, 192, 255, 0.45);
}

.pane-item:hover .pane-close-btn,
.pane-close-btn:focus {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.pane-item:hover .pane-drag-hint {
  opacity: 1;
  transform: translateY(0);
}
</style>
