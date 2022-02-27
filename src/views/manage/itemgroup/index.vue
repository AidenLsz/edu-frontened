<template>
<div style="width: 90%; margin-left: 5%; padding-top: 60px;">
  <!-- 地址框 -->
  <el-row justify="start" type="flex">
    <el-col :span="7">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>资源管理</el-breadcrumb-item>
        <el-breadcrumb-item>题库资源
          <span @click="openInstructionDialog" style="cursor:pointer;">
            <i class="el-icon-question"></i>
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
  <el-row type="flex" justify="center" style="margin-top: 30px">
    <label style="font-size: 28px">题库管理</label>
  </el-row>

  <el-divider></el-divider>
  <el-row type="flex" justify="start">
    <el-col :span="6">
      <el-row type="flex" justify="start" style="">
        <label style="font-size: 14px;line-height: 35px;min-width:60px;">题库：</label>
        <el-select v-model="itemType" placeholder="请选择">
          <el-option v-for="(item,i) in itemTypeList" :key="i" :label="item.val" :value="item.key">
          </el-option>
        </el-select>
      </el-row>
    </el-col>
    <el-col :span="12">
      <el-row type="flex" justify="start" style="">
        <label style="font-size: 14px;line-height: 35px;min-width:60px;">权限：</label>
        <el-select v-model="actionType" placeholder="请选择">
          <el-option v-for="(item,i) in actionList" :key="i" :label="item" :value="i">
          </el-option>
        </el-select>
      </el-row>
    </el-col>
    <!-- <el-col :span="6">
          <el-row type="flex" justify="start" style="margin-left: 10px">
              <label style="height: 35px; line-height: 35px; margin-right: 15px">查询：</label>
              <el-input v-model="searchData" placeholder="请输入查询信息"
                style="width: 12vw; height: 35px; line-height: 35px; margin-right: 30px"></el-input>
          </el-row>
      </el-col> -->
    <el-col :span="6">
      <el-row type="flex" justify="end" style="margin-right: 40px">
        <el-button type="primary" style="height: 40px" @click="openCreateDialog()">创建题库</el-button>
      </el-row>
    </el-col>
  </el-row>
  <el-row type="flex" justify="center" style="margin-top: 40px">
    <el-table border :data="tableData.slice(this.pagenation.startNumber,this.pagenation.endNumber)">
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="itemtype_ch" label="类型">
      </el-table-column>
      <el-table-column prop="source_type_ch" label="来源">
      </el-table-column>
      <el-table-column prop="action_ch" label="拥有权限">
      </el-table-column>
      <el-table-column type="index" label="操作" width="150">
        <template slot-scope="scope">
          <el-row v-if="scope.row.action_list.includes('M')">
            <el-button size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button size="mini" @click="openDeleteDialog(scope.row)">删除</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  <el-row class="block" style="margin:25px auto;" v-show="this.tableData.length!=0">
    <el-pagination @current-change="handleCurrentChange" :current-page="pagenation.page" :page-size="pagenation.limit" layout="total, prev, pager, next, jumper" :total="this.tableData.length">
    </el-pagination>
  </el-row>
  <instruction ref="instruction" />
  <createDialog ref="CreateDialog" :itemType="itemType" @igCreated="GET_IG_INFO()" />
  <deleteDialog ref="DeleteDialog" :igData="igData" @igDeleted="GET_IG_INFO()" />
  <editDialog ref="EditDialog" :igData="igData" @userUpdated="GET_IG_INFO()" />
</div>
</template>
<script>
import {
  commonAjax
} from '@/common/utils/ajax'
import * as variable from '@/common/utils/variable'
import deleteDialog from './components/deleteDialog'
import createDialog from './components/createDialog'
import editDialog from './components/editDialog'
import Instruction from './components/InstructionItemGroup.vue'

export default {
  name: '',
  components: {
    createDialog,
    deleteDialog,
    editDialog,
    Instruction
  },
  data() {
    return {
      // 这个是用于检索的关键字，如果要显示用户信息的话之后手写一个方法放上去就好
      searchData: "",
      itemTypeList: [],
      itemType: '',
      itemGroupData: [],
      igData: {},
      actionList: variable.actionType,
      actionType: 'R',
      groupnameArray: [],
      pagenation: {
        page: 1,
        limit: 10,
        startNumber: 0,
        endNumber: 10
      },
      UUID: ' ',
    }
  },
  mounted() {
    this.GET_IG_INFO();
    this.Get_User_UUID();
  },
  computed: {
    CurrentItemGroupData() {
      if (!this.itemGroupData[this.itemType])
        return []
      let resData = this.itemGroupData[this.itemType]
      return resData.filter((item) => item.action_ch.includes(variable.actionType[this.actionType]))
    },
    tableData() {
      let resData = this.CurrentItemGroupData;
      return resData
    },
    groupname() {
      let arr = this.groupnameArray.filter((item) => (item.groupid == this.groupid))
      if (arr.length != 0) {
        return arr[0].groupname
      }
      return ""
    }
  },
  methods: {
    openInstructionDialog() {
      this.$refs.instruction.openDialog();
    },
    openCreateDialog() {
      this.$refs.CreateDialog.openDialog();
    },
    openAddDialog() {
      this.$refs.AddDialog.openDialog();
    },
    openDeleteDialog(data) {
      this.igData = data
      this.$refs.DeleteDialog.openDialog();
    },
    openEditDialog(data) {
      this.igData = data
      this.$refs.EditDialog.openDialog();
    },
    handleCurrentChange(val) {
      this.pagenation.page = val
      this.pagenation.startNumber = this.pagenation.limit * (this.pagenation.page - 1)
      this.pagenation.endNumber = this.pagenation.limit * this.pagenation.page
    },
    Get_User_UUID() {
      commonAjax(this.backendIP + '/api/getUserUUID', {}).then((res) => {
        this.UUID = res.UUID
      }).catch((err) => {
        console.log(err)
      })
    },
    GET_IG_INFO() {
      this.itemTypeList = []
      this.itemTypeList.push({
        'key': '3',
        'val': variable.itemType[3]
      })
      this.itemTypeList.push({
        'key': '4',
        'val': variable.itemType[4]
      })
      commonAjax(this.backendIP + '/api/get_user_ig_info', {}).then((res) => {
        this.itemGroupData = res.ig_info
        for (let key in this.itemGroupData) {
          this.itemGroupData[key] = this.obj2arr(this.groupData(this.itemGroupData[key]));
        }
        if (this.itemTypeList.length > 0) {
          this.itemType = this.itemTypeList[0].key
        }
        if (this.actionList.length > 0) {
          this.actionType = this.actionList[0].key
        }
      })
    },
    obj2arr(data){
      let res=[]
      for (var key in data) {
        res.push(data[key])
      }
      return res
    },
    groupData(data){
      let igObj = {}
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        if (!igObj[item.ig_ID]) {
          item.itemtype_ch = variable.itemType[item.itemtype]
          item.source_type_ch = variable.sourceType[item.source_type]
          igObj[item.ig_ID]=item
          if (item.source == this.UUID) {
            igObj[item.ig_ID].action_list = ['M']
          } else {
            igObj[item.ig_ID].action_list = []
          }
        }
        igObj[item.ig_ID].action_list.push(item.action)
      }
      for (var key in igObj) {
        let item = igObj[key]
        item.action_ch = igObj[item.ig_ID].action_list.map(item => variable.actionType[item]).join('、')
      }
      return igObj
    }
  }
}
</script>
