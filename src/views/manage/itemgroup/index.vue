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
            <label style="font-size: 14px;line-height: 35px;">题库类型:</label>
            <el-select v-model="currentItemType" placeholder="请选择">
              <el-option
                v-for="(item,i) in itemTypeList"
                :key="i"
                :label="item.val"
                :value="item.key">
              </el-option>
            </el-select>
        </el-row>
      </el-col>
      <el-col :span="12">
          <el-row type="flex" justify="start" style="margin-left: 10px">
              <label style="height: 35px; line-height: 35px; margin-right: 15px">查询：</label>
              <el-input v-model="searchData" placeholder="请输入查询信息"
                style="width: 12vw; height: 35px; line-height: 35px; margin-right: 30px"></el-input>
          </el-row>
      </el-col>
      <el-col :span="6">
          <el-row type="flex" justify="end" style="margin-right: 40px">
              <el-button type="primary" style="height: 40px" @click="openAddDialog()">添加题库</el-button>
          </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 40px">
        <el-table
            border
            :data="tableData.slice(this.pagenation.startNumber,this.pagenation.endNumber)">
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="itemtype_ch"
                label="类型">
            </el-table-column>
            <el-table-column
                prop="source_type_ch"
                label="来源">
            </el-table-column>
            <el-table-column
                prop="action_ch"
                label="拥有权限">
            </el-table-column>
            <el-table-column
                type="index"
                label="操作"
                width="150"
                >
                <template slot-scope="scope">
                    <el-row>
                        <el-button size="mini"  @click="openEditDialog(scope.row)">编辑</el-button>
                        <el-button size="mini"  @click="openDeleteDialog(scope.row)">删除</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
    <el-row class="block" style="margin:25px auto;" v-show="this.tableData.length!=0">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pagenation.page"
        :page-size="pagenation.limit"
        layout="total, prev, pager, next, jumper"
        :total="this.tableData.length">
      </el-pagination>
    </el-row>
    <instruction
      ref="instruction"
    />
    <addDialog ref="AddDialog" :groupid="groupid" :tableData="currentGroupData" :groupname="groupname" @userAdded="GET_IG_INFO()"/>
    <deleteDialog ref="DeleteDialog" :userData="userData" @userDeleted="GET_IG_INFO()"/>
    <editDialog ref="EditDialog" :userData="userData" @userUpdated="GET_IG_INFO()"/>
  </div>
</template>
<script>
import {commonAjax} from '@/common/utils/ajax'
import deleteDialog from '@/views/manage/userMessage/components/deleteDialog'
import addDialog from '@/views/manage/userMessage/components/addDialog'
import editDialog from '@/views/manage/userMessage/components/editDialog'
import * as variable from '@/common/utils/variable'
import Instruction from '@/views/manage/userMessage/components/InstructionGroup.vue'

export default {
  name: '',
  components:{
    addDialog,
    deleteDialog,
    editDialog,
    Instruction
  },
  data() {
    return {
        // 这个是用于检索的关键字，如果要显示用户信息的话之后手写一个方法放上去就好
        searchData:"",
        itemTypeList:[],
        currentItemType:'',
        itemGroupData:[],
        userData:{},
        groupnameArray:[],
        pagenation:{
          page: 1,
          limit: 10,
          startNumber: 0,
          endNumber: 10
        }
    }
  },
  mounted() {
    this.GET_IG_INFO();
  },
  computed:{
    CurrentItemGroupData(){
      console.log('CurrentItemGroupData:',this.itemGroupData[this.currentItemType]);
      if(!this.itemGroupData[this.currentItemType])
        return []
      return this.itemGroupData[this.currentItemType]
    },
    tableData(){
      // let tableColumns=['username','legal_name','groupname','email','phone','is_admin_ch','status_ch']
      let resData= this.CurrentItemGroupData;
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
    groupname(){
      let arr = this.groupnameArray.filter((item)=>(item.groupid==this.groupid))
      if (arr.length!=0) {
        return arr[0].groupname
      }
      return ""
    }
  },
  methods: {
    openInstructionDialog(){
      this.$refs.instruction.openDialog();
    },
    openCreateDialog(){
      this.$refs.CreateDialog.openDialog();
    },
    openAddDialog(){
      this.$refs.AddDialog.openDialog();
    },
    openDeleteDialog(data){
      this.userData=data
      this.$refs.DeleteDialog.openDialog();
    },
    openEditDialog(data){
      this.userData=data
      this.$refs.EditDialog.openDialog();
    },
    handleCurrentChange(val) {
      this.pagenation.page=val
      this.pagenation.startNumber = this.pagenation.limit * (this.pagenation.page - 1)
      this.pagenation.endNumber = this.pagenation.limit * this.pagenation.page
    },
    GET_IG_INFO(){
      commonAjax(this.backendIP+'/api/get_user_ig_info',
        {}
      ).then((res)=>{
        // variable.itemType
        this.itemGroupData = res.ig_info
        this.itemTypeList = []
        for (let key in this.itemGroupData) {
          this.itemTypeList.push({'key':key,'val':variable.itemType[key]})
          // console.log(variable.itemType[key]);
          for (var i = 0; i < this.itemGroupData[key].length; i++) {
            this.itemGroupData[key][i].itemtype_ch=variable.itemType[this.itemGroupData[key][i].itemtype]
            this.itemGroupData[key][i].source_type_ch=variable.sourceType[this.itemGroupData[key][i].source_type]
            this.itemGroupData[key][i].action_ch=variable.actionType[this.itemGroupData[key][i].action]
            // console.log(this.itemGroupData[key][i]);
          }
        }
        console.log(this.itemGroupData);
        if (this.itemTypeList.length>0) {
          this.currentItemType=this.itemTypeList[0].key
        }
        // console.log(this.itemTypeList)
        // console.log(data,variable.itemType);
        // this.Item_Group_List=res.ig_name;
      })
    },
  }
}
</script>
