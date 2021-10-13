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
        <label style="font-size: 14px;line-height: 35px;">题库：</label>
        <el-select v-model="itemType" placeholder="请选择">
          <el-option v-for="(item,i) in itemTypeList" :key="i" :label="item.val" :value="item.key">
          </el-option>
        </el-select>
      </el-row>
    </el-col>
    <el-col :span="12">
      <el-row type="flex" justify="start" style="">
        <label style="font-size: 14px;line-height: 35px;">权限：</label>
        <el-select v-model="actionType" placeholder="请选择">
          <el-option v-for="(item,i) in actionList" :key="i" :label="item.val" :value="item.key">
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
  <deleteDialog ref="DeleteDialog" :userData="userData" @userDeleted="GET_IG_INFO()" />
  <editDialog ref="EditDialog" :userData="userData" @userUpdated="GET_IG_INFO()" />
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
      userData: {},
      actionList: [],
      actionType: '',
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
      return resData.filter((item) => item.action == this.actionType)
    },
    tableData() {
      // let tableColumns=['username','legal_name','groupname','email','phone','is_admin_ch','status_ch']
      let resData = this.CurrentItemGroupData;
      // if(this.searchData){
      //   resData = resData.filter(data => {
      //     for (let key in data) {
      //       if(data[key] && tableColumns.includes(key) && data[key].includes(this.searchData)){
      //         return true
      //       }
      //     }
      //     return false
      //   })
      //   this.handleCurrentChange(1)
      // }
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
      this.userData = data
      this.$refs.DeleteDialog.openDialog();
    },
    openEditDialog(data) {
      this.userData = data
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
      commonAjax(this.backendIP + '/api/get_user_ig_info', {}).then((res) => {
        this.itemGroupData = res.ig_info
        this.itemTypeList = []
        for (let key in this.itemGroupData) {
          this.itemTypeList.push({
            'key': key,
            'val': variable.itemType[key]
          })
          let ig_map = {}
          for (let i = 0; i < this.itemGroupData[key].length; i++) {
            let item = this.itemGroupData[key][i]
            if (!ig_map[item.ig_ID]) {
              if (item.source == this.UUID) {
                ig_map[item.ig_ID] = ['M']
              } else {
                ig_map[item.ig_ID] = []
              }
            }
            ig_map[item.ig_ID].push(item.action)
          }
          for (let i = 0; i < this.itemGroupData[key].length; i++) {
            let item = this.itemGroupData[key][i]
            if (!this.actionList.some((item) => item.key == this.itemGroupData[key][i].action)) {
              this.actionList.push({
                'key': this.itemGroupData[key][i].action,
                'val': variable.actionType[this.itemGroupData[key][i].action]
              })
            }
            item.itemtype_ch = variable.itemType[item.itemtype]
            item.source_type_ch = variable.sourceType[item.source_type]
            item.action_ch = ig_map[item.ig_ID].map(item => variable.actionType[item]).join('、')
            item.action_list = ig_map[item.ig_ID]
          }
        }
        if (this.itemTypeList.length > 0) {
          this.itemType = this.itemTypeList[0].key
        }
        if (this.actionList.length > 0) {
          this.actionType = this.actionList[0].key
        }
        // console.log(this.itemTypeList)
        // console.log(data,variable.itemType);
        // this.Item_Group_List=res.ig_name;
      })
    },
  }
}
</script>
