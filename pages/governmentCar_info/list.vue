<template>
  <view>
    <view class="uni-header">
      <view class="uni-group">
        <view class="uni-title"></view>
        <view class="uni-sub-title"></view>
      </view>
      <view class="uni-group">
        <input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
        <button class="uni-button" type="default" size="mini" @click="search">搜索</button>
        <button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
        <button class="uni-button" type="default" size="mini" :disabled="!selectedIndexs.length" @click="delTable">批量删除</button>
        <download-excel class="hide-on-phone" :fields="exportExcel.fields" :data="exportExcelData" :type="exportExcel.type" :name="exportExcel.filename">
          <button class="uni-button" type="primary" size="mini">导出 Excel</button>
        </download-excel>
      </view>
    </view>
    <view class="uni-container">
      <unicloud-db ref="udb" :collection="collectionList" field="reason,department,destination,passenger,mobile,boarding_time,alighting_time,note,driver,approver,plate,begin_mileage,end_mileage,beApproved1,beApproved2" :where="where" page-data="replace"
        :orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
        v-slot:default="{data,pagination,loading,error,options}" :options="options" loadtime="manual" @load="onqueryload">
        <uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe type="selection" @selection-change="selectionChange">
          <uni-tr>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'reason')" sortable @sort-change="sortChange($event, 'reason')">用车事由</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'department')" sortable @sort-change="sortChange($event, 'department')">申请部门</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'destination')" sortable @sort-change="sortChange($event, 'destination')">目的地</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'passenger')" sortable @sort-change="sortChange($event, 'passenger')">乘车人</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'mobile')" sortable @sort-change="sortChange($event, 'mobile')">手机号码</uni-th>
            <uni-th align="center" filter-type="timestamp" @filter-change="filterChange($event, 'boarding_time')" sortable @sort-change="sortChange($event, 'boarding_time')">用车时间</uni-th>
            <uni-th align="center" filter-type="timestamp" @filter-change="filterChange($event, 'alighting_time')" sortable @sort-change="sortChange($event, 'alighting_time')">预计返回时间</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'note')" sortable @sort-change="sortChange($event, 'note')">备注</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'driver')" sortable @sort-change="sortChange($event, 'driver')">驾驶人</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'approver')" sortable @sort-change="sortChange($event, 'approver')">审批人</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'plate')" sortable @sort-change="sortChange($event, 'plate')">车牌号</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'begin_mileage')" sortable @sort-change="sortChange($event, 'begin_mileage')">起始里程</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'end_mileage')" sortable @sort-change="sortChange($event, 'end_mileage')">终点里程</uni-th>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'beApproved1')">一级审批</uni-th>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'beApproved2')">二级审批</uni-th>
            <uni-th align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="(item,index) in data" :key="index">
            <uni-td align="center">{{item.reason}}</uni-td>
            <uni-td align="center">{{item.department}}</uni-td>
            <uni-td align="center">{{item.destination}}</uni-td>
            <uni-td align="center">{{item.passenger}}</uni-td>
            <uni-td align="center">{{item.mobile}}</uni-td>
            <uni-td align="center">
              <uni-dateformat :threshold="[0, 0]" :date="item.boarding_time"></uni-dateformat>
            </uni-td>
            <uni-td align="center">
              <uni-dateformat :threshold="[0, 0]" :date="item.alighting_time"></uni-dateformat>
            </uni-td>
            <uni-td align="center">{{item.note}}</uni-td>
            <uni-td align="center">{{item.driver}}</uni-td>
            <uni-td align="center">{{item.approver}}</uni-td>
            <uni-td align="center">{{item.plate}}</uni-td>
            <uni-td align="center">{{item.begin_mileage}}</uni-td>
            <uni-td align="center">{{item.end_mileage}}</uni-td>
            <uni-td align="center">{{item.beApproved1 == true ? '✅' : '❌'}}</uni-td>
            <uni-td align="center">{{item.beApproved2 == true ? '✅' : '❌'}}</uni-td>
            <uni-td align="center">
              <view class="uni-group">
                <button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini" type="primary">修改</button>
                <button @click="confirmDelete(item._id)" class="uni-button" size="mini" type="warn">删除</button>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
        <view class="uni-pagination-box">
          <uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current" :total="pagination.count" @change="onPageChanged" />
        </view>
      </unicloud-db>
    </view>
  </view>
</template>

<script>
  import { enumConverter, filterToWhere } from '../../js_sdk/validator/governmentCar_info.js';

  const db = uniCloud.database()
  // 表查询配置
  const dbOrderBy = '' // 排序字段
  const dbSearchFields = [] // 模糊搜索字段，支持模糊搜索的字段列表。联表查询格式: 主表字段名.副表字段名，例如用户表关联角色表 role.role_name
  // 分页配置
  const pageSize = 20
  const pageCurrent = 1

  const orderByMapping = {
    "ascending": "asc",
    "descending": "desc"
  }

  export default {
    data() {
      return {
        collectionList: "governmentCar_info",
        query: '',
        where: '',
        orderby: dbOrderBy,
        orderByFieldName: "",
        selectedIndexs: [],
        options: {
          pageSize,
          pageCurrent,
          filterData: {},
          ...enumConverter
        },
        imageStyles: {
          width: 64,
          height: 64
        },
        exportExcel: {
          "filename": "governmentCar_info.xls",
          "type": "xls",
          "fields": {
            "用车事由": "reason",
            "目的地": "destination",
            "乘车人": "passenger",
            "手机号码": "mobile",
            "用车时间": "boarding_time",
            "预计返回时间": "alighting_time",
            "备注": "reason",
            "派车信息":"info"
          }
        },
        exportExcelData: []
      }
    },
    onLoad() {
      this._filter = {}
    },
    onReady() {
      this.$refs.udb.loadData()
    },
    methods: {
      onqueryload(data) {
      for(var i=0;i<data.length;i++){
          data[i]["info"]=data[i]["plate"] + data[i]["driver"]
          data[i]["boarding_time"]=new Date(data[i]["boarding_time"]).toLocaleString()
          data[i]["alighting_time"]=new Date(data[i]["alighting_time"]).toLocaleString()
          // var myDatestamp = new Date(data[i]["boarding_time"]);
          // console.log(myDatestamp)
      }
        this.exportExcelData = data
        console.log(data)
      },
      getWhere() {
        const query = this.query.trim()
        if (!query) {
          return ''
        }
        const queryRe = new RegExp(query, 'i')
        return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
      },
      search() {
        const newWhere = this.getWhere()
        this.where = newWhere
        this.$nextTick(() => {
          this.loadData()
        })
      },
      loadData(clear = true) {
        this.$refs.udb.loadData({
          clear
        })
      },
      onPageChanged(e) {
        this.selectedIndexs.length = 0
        this.$refs.table.clearSelection()
        this.$refs.udb.loadData({
          current: e.current
        })
      },
      navigateTo(url, clear) {
        // clear 表示刷新列表时是否清除页码，true 表示刷新并回到列表第 1 页，默认为 true
        uni.navigateTo({
          url,
          events: {
            refreshData: () => {
              this.loadData(clear)
            }
          }
        })
      },
      // 多选处理
      selectedItems() {
        var dataList = this.$refs.udb.dataList
        return this.selectedIndexs.map(i => dataList[i]._id)
      },
      // 批量删除
      delTable() {
        this.$refs.udb.remove(this.selectedItems(), {
          success:(res) => {
            this.$refs.table.clearSelection()
          }
        })
      },
      // 多选
      selectionChange(e) {
        this.selectedIndexs = e.detail.index
      },
      confirmDelete(id) {
        this.$refs.udb.remove(id, {
          success:(res) => {
            this.$refs.table.clearSelection()
          }
        })
      },
      sortChange(e, name) {
        this.orderByFieldName = name;
        if (e.order) {
          this.orderby = name + ' ' + orderByMapping[e.order]
        } else {
          this.orderby = ''
        }
        this.$refs.table.clearSelection()
        this.$nextTick(() => {
          this.$refs.udb.loadData()
        })
      },
      filterChange(e, name) {
        this._filter[name] = {
          type: e.filterType,
          value: e.filter
        }
        let newWhere = filterToWhere(this._filter, db.command)
        if (Object.keys(newWhere).length) {
          this.where = newWhere
        } else {
          this.where = ''
        }
        this.$nextTick(() => {
          this.$refs.udb.loadData()
        })
      }
    }
  }
</script>

<style>
</style>
