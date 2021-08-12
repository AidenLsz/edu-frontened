<template>
  <div style="width: 90vw; margin-left: 5vw; padding-top: 60px;">
    <!-- 地址框 -->
    <el-row justify="start" type="flex">
      <el-col :span="7">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>组织架构
            <span @click="openInstructionDialog" style="cursor:pointer;">
              <i class="el-icon-question"></i>
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 30px">
        <label style="font-size: 28px">用户管理</label>
    </el-row>

    <el-divider></el-divider>
    <el-row type="flex" justify="start">
      <el-col :span="6">
        <el-row type="flex" justify="start" style="">
            <label style="font-size: 14px;line-height: 35px;">组织架构：</label>
            <el-select v-model="groupid" placeholder="请选择">
              <el-option
                v-for="(item,i) in groupnameArray"
                :key="i"
                :label="item.groupname"
                :value="item.groupid">
              </el-option>
            </el-select>
        </el-row>
      </el-col>
      <el-col :span="12">
          <el-row type="flex" justify="start" style="margin-left: 10px">
              <label style="height: 35px; line-height: 35px; margin-right: 15px">查询：</label>
              <el-input v-model="searchData" placeholder="请输入查询信息"
                style="width: 12vw; height: 35px; line-height: 35px; margin-right: 30px"></el-input>
              <!-- <label style="height: 35px; line-height: 35px; margin-right: 15px">邮箱：</label>
              <el-input v-model="email" placeholder="邮箱" style="width: 8vw; height: 35px; line-height: 30px; margin-right: 30px"></el-input> -->
              <!-- <el-button type="primary" style="height: 35px" @click="Search()">查询</el-button> -->
          </el-row>
      </el-col>
      <el-col :span="6">
          <el-row type="flex" justify="end" style="margin-right: 40px">
              <el-button type="primary" style="height: 40px" @click="openAddDialog()">添加用户</el-button>
              <el-button type="primary" style="height: 40px" @click="openCreateDialog()">创建用户</el-button>
          </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 40px">
        <el-table
            border
            :data="tableData.slice(this.pagenation.startNumber,this.pagenation.endNumber)">
            <el-table-column
                prop="username"
                label="账号">
            </el-table-column>
            <el-table-column
                prop="legal_name"
                label="真实姓名">
            </el-table-column>
            <el-table-column
                prop="groupname"
                label="所属组织">
            </el-table-column>
            <!-- <el-table-column
                prop="userProfession"
                label="职业"
                width="100">
            </el-table-column> -->
            <el-table-column
                prop="email"
                label="邮箱"
                >
            </el-table-column>
            <el-table-column
                prop="phone"
                label="手机号码"
                >
            </el-table-column>
            <el-table-column
                prop="is_admin_ch"
                label="权限"
                width="100">
            </el-table-column>
            <el-table-column
                prop="status_ch"
                label="状态"
                width="100"
                >
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
    <createDialog ref="CreateDialog" :groupid="groupid" @userCreated="GET_USER_DATA()"/>
    <addDialog ref="AddDialog" :groupid="groupid" :tableData="currentGroupData" :groupname="groupname" @userAdded="GET_USER_DATA()"/>
    <deleteDialog ref="DeleteDialog" :userData="userData" @userDeleted="GET_USER_DATA()"/>
    <editDialog ref="EditDialog" :userData="userData" @userUpdated="GET_USER_DATA()"/>
  </div>
</template>
<script>
import {commonAjax} from '@/common/utils/ajax'
import createDialog from './components/createDialog'
import deleteDialog from './components/deleteDialog'
import addDialog from './components/addDialog'
import editDialog from './components/editDialog'
import * as variable from '@/common/utils/variable'
import Instruction from './components/InstructionGroup.vue'

export default {
  name: '',
  components:{
    createDialog,
    addDialog,
    deleteDialog,
    editDialog,
    Instruction
  },
  data() {
    return {
        // 这个是用于检索的关键字，如果要显示用户信息的话之后手写一个方法放上去就好
        searchData:"",
        groupid:"",
        groupData:[],
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
    this.GET_USER_DATA();
  },
  computed:{
    currentGroupData(){
      if(!this.groupData[this.groupid])
        return []
      return this.groupData[this.groupid]
    },
    tableData(){
      let tableColumns=['username','legal_name','groupname','email','phone','is_admin_ch','status_ch']
      let resData= this.currentGroupData;
      if(this.searchData){
        resData = resData.filter(data => {
          for (let key in data) {
            if(data[key] && tableColumns.includes(key) && data[key].includes(this.searchData)){
              return true
            }
          }
          return false
        })
        this.handleCurrentChange(1)
      }
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
    GET_USER_DATA(){
      commonAjax(this.backendIP+'/api/get_users_by_admin',{}).then((res)=>{
        res.data.forEach((item)=>{
          item.status_ch=variable.status[item.status]
          item.is_admin_ch=variable.userType[item.is_admin]
        })
        this.groupData = this.groupBy(res.data, function(item){
            return item.ug_ID;
        });
        let tmpArray = this.groupBy(res.data, function(item){
            return item.ug_ID+":"+item.groupname;
        });
        this.groupnameArray=Object.keys(tmpArray).map((item)=>{
          let tmp={}
          tmp.groupid=item.split(":")[0]
          tmp.groupname=item.split(":")[1]
          return tmp
        })
        if(!this.groupid&&this.groupnameArray)
          this.groupid=this.groupnameArray[0].groupid
      })
    },
    Edit_User(val){
        alert(val.userName + " 正在编辑中...");
    },
    groupBy( array , f ) {
      let groups = {};
      array.forEach( function( o ) {
          let group = f(o);
          groups[group] = groups[group] || [];
          groups[group].push( o );
      });
      return groups
    }
  }
}
</script>
