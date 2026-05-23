<template>
  <div class="main">
    <div class="main-left width-355">
      <Box>
        <template #content>
          <div class="box-tit"><span>目录</span></div>
          <div class="box-con" style="max-height: calc(100% - 55px); overflow-y: auto;">
            <div class="column">
              <template v-for="(item, index) in menuItems">
                <div :key="index" class="column-item"
                  :class="{ hasChild: item.children && item.children.length > 0, active: item.active }"
                  @click.stop="handleMenuClick(item, menuItems)">
                  <h4><i></i>{{ item.label }}</h4>
                  <ul v-if="item.children && item.children.length > 0 && item.active">
                    <template v-for="(child, childIndex) in item.children">
                      <li :key="childIndex" :class="{ active: child.active }"
                        @click.stop="handleMenuClick(child, item.children)">
                        {{ child.label }}
                        <ul v-if="child.children && child.children.length > 0 && child.active">
                          <li v-for="(grandChild, grandChildIndex) in child.children" :key="grandChildIndex"
                            :class="{ active: grandChild.active }"
                            @click.stop="handleMenuClick(grandChild, child.children)">
                            {{ grandChild.label }}
                          </li>
                        </ul>
                      </li>
                    </template>
                  </ul>
                </div>
              </template>
            </div>
          </div>
        </template>
      </Box>
    </div>
    <div class="main-center other5">
      <Box>
        <template #content>
          <div class="box-con" style="margin: -10px;max-height: 100%;">
            <div class="tabs">
              <div class="tabs-tit">
                <span :class="{ cur: activeTab === 'all' }" @click="handleTabClick('all')">全部</span>
                <div
                  style="position:absolute; top: 5px; right: 20px; display: flex; flex-wrap: nowrap; align-items: center;">
                  <!-- <el-input placeholder="请输入关键字" size="mini" v-model.trim="searchKey" class="mx-select">    
                    <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:90px">
                      <el-option label="按名称" value="1"></el-option>
                      <el-option label="按编码" value="2"></el-option>
                      <el-option label="按单位" value="3"></el-option>
                    </el-select>         
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                  </el-input> -->
                  <el-input v-model="fileName" placeholder="请输入文件名称" class="mx-select sm"></el-input>
                  <el-input v-model="fileCode" placeholder="请输入文件编码" class="mx-select sm"></el-input>
                  <el-input v-model="preparedUnit" placeholder="请输入编制单位" class="mx-select sm"></el-input>
                  <el-date-picker type="date"  value-format="yyyy-MM-dd" v-model="beginTime" placeholder="请输入开始时间" class="mx-select sm" @change="handleBeginTimeChange"></el-date-picker>
                  <el-date-picker type="date"  value-format="yyyy-MM-dd" v-model="endTime" placeholder="请输入结束时间" class="mx-select sm" @change="handleEndTimeChange"></el-date-picker>
                  <el-button type="primary" icon="el-icon-search" @click="handleSearch"></el-button>
                </div>
              </div>
              <div class="tabs-con">
                <!-- 全部 -->
                <div class="tabs-con-item" style="display: block;">
                  <table>
                    <thead>
                      <tr>
                        <th width="80">序号</th>
                        <th>资料名称</th>
                        <th>资料类型</th>
                        <th>编制日期</th>
                        <th>附件</th>
                        <!-- <th>操作</th> -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(data, index) in allTableData" :key="'all-' + index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ data.fileName }}</td>
                        <td>{{ data.fileType }}</td>
                        <td>{{ data.createTime }}</td>
                        <td>
                          <img src="images/doc.png" v-if="data.fileType == 'doc'"
                            @click="openDocList(data.fileBatchId)">
                          <i class="el-icon-link" v-else @click="openDocList(data.fileBatchId)"></i>
                        </td>
                        <!-- <td>
                          <a href="javascript:;" class="text-primary mr10"><i class="el-icon-document mr5"></i>查看</a>
                          <a href="javascript:;" class="text-danger"><i class="el-icon-delete mr5"></i>删除</a>
                        </td> -->
                      </tr>
                      <tr v-if="allTableData.length === 0">
                        <td colspan="5">暂无数据</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="pagination-container" style="text-align: center; margin-top: 20px;">
                    <el-pagination class="mx-page" background @size-change="handleSizeChange"
                      @current-change="handleCurrentChange" :current-page.sync="pageNum" :page-size="pageSize"
                      layout="total, prev, pager, next" :total="total">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Box>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="文件列表" class="dialog" :visible.sync="dialogVisible" width="30%" destroy-on-close
      :modal-append-to-body="false">
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
  </div>
</template>

<script>
import Box from '@/components/box.vue'
import { getMaterialList, getMaterialData } from '@/api/index'
import { getFileUrl } from '@/api/safety'
export default {
  components: {
    Box
  },
  name: 'DataManagement',
  data() {
    return {
      select: '1',
      dialogVisible: false,
      menuItems: [],
      activeTab: 'all',
      allTableData: [],
      selectedMenuItem: null,
      searchKey: '',
      pageNum: 1,    // Use number
      pageSize: 10,  // Use number
      total: 0,
      fileName: '',
      fileCode: '',
      preparedUnit: '',
      beginTime: '',
      endTime: '',
    }
  },
  mounted() {

    getMaterialList().then(res => {
      const rawMenuItems = res.data;
      this.menuItems = this.addActiveProperty(rawMenuItems);
      if (this.menuItems && this.menuItems.length > 0) {
        this.menuItems[0].active = true;
        this.selectedMenuItem = this.menuItems[0];
        this.getMaterialData(this.selectedMenuItem.id);
      }
    }).catch(error => {
      console.error("获取物料列表时出错:", error);
    });
  },
  methods: {
    getView(val) {
      let url = `${process.env.VUE_APP_BASE_API}/qdoner${val}`
      window.open("https://view.xdocin.com/view?src=" + encodeURIComponent(url));
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
    getMaterialData(idToLoad) {
      if (!idToLoad && this.selectedMenuItem) {
        idToLoad = this.selectedMenuItem.id;
      }
      if (!idToLoad) {
        this.allTableData = [];
        this.total = 0;
        this.$message.warning('请选择目录');
        return;
      }
      getMaterialData(idToLoad, this.fileName, this.fileCode,this.preparedUnit,this.beginTime,this.endTime, this.pageNum, this.pageSize).then(res => {
        this.allTableData = res.data?.list || [];
        this.total = res.data?.totalRow || 0;
      }).catch(error => {
        console.error("获取物料数据时出错 ID:", idToLoad, error);
        this.allTableData = [];
        this.total = 0;
      });
    },

    addActiveProperty(nodes) {
      if (!nodes || !Array.isArray(nodes)) {
        return nodes;
      }
      return nodes.map(node => {
        const newNode = { ...node, active: false, label: node.label };
        if (newNode.children && Array.isArray(newNode.children)) {
          newNode.children = this.addActiveProperty(newNode.children);
        }
        return newNode;
      });
    },

    handleMenuClick(clickedItem, parentList) {
      parentList.forEach(item => {
        item.active = (item.id === clickedItem.id);
        if (item.id !== clickedItem.id && item.children) {
          this.deactivateChildren(item.children);
        }
      });
      this.selectedMenuItem = clickedItem;
      this.pageNum = 1;
      this.getMaterialData(clickedItem.id);
      this.$forceUpdate();
    },

    deactivateChildren(children) {
      children.forEach(child => {
        child.active = false;
        if (child.children) {
          this.deactivateChildren(child.children);
        }
      });
    },

    handleTabClick(tabName) {
      this.activeTab = tabName;
    },

    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.pageNum = 1;
      this.getMaterialData(this.selectedMenuItem ? this.selectedMenuItem.id : null);
    },

    handleCurrentChange(newPage) {
      this.pageNum = newPage;
      this.getMaterialData(this.selectedMenuItem ? this.selectedMenuItem.id : null);
    },

    handleSearch() {
      // if (this.searchKey === '') {
      //   this.$message.warning('请输入搜索关键字');
      //   return
      // }
      this.pageNum = 1;
      this.getMaterialData(this.selectedMenuItem ? this.selectedMenuItem.id : null);
    },
    handleBeginTimeChange(val) {
      if (this.endTime && val > this.endTime) {
        this.$message.warning('开始时间不能大于结束时间');
        this.beginTime = '';
      }
    },
    handleEndTimeChange(val) {
      if (this.beginTime && val < this.beginTime) {
        this.$message.warning('结束时间不能小于开始时间');
        this.endTime = '';
      }
    },
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

.sm {
  width: 160px;
  margin-right: 10px;
}
</style>