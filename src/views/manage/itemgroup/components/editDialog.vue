<template lang="html">
  <el-dialog
    :title="igData.name"
    :visible.sync="visible"
    width="800px"
    center>
    <div class="">
      <el-row type="flex" justify="start">
        <el-col :span="12">
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
                  type="index"
                  label="权限"
                  width="200"
                  >
                  <template slot-scope="scope">
                      <el-row>
                        <el-col :span="11">
                          <el-checkbox v-model="scope.row.R">读</el-checkbox>
                        </el-col>
                        <el-col :span="11">
                          <el-checkbox v-model="scope.row.W">写</el-checkbox>
                        </el-col>
                      </el-row>
                  </template>
              </el-table-column>
              <el-table-column
                  type="index"
                  label="操作"
                  width="200"
                  >
                  <template slot-scope="scope">
                      <el-row>
                          <el-button size="mini"  @click="savePermission(scope.row)">保存</el-button>
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
    </div>
    <div slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="visible = false">取 消</el-button>
      <!-- <el-button type="primary" @click="UpdateUserInGroup()">确 定</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import {
  Message
} from 'element-ui'
import {
  commonAjax
} from '@/common/utils/ajax'
// import * as variable from '@/common/utils/variable'


export default {
  props: {
    igData: {
      type: Object
    },
  },
  data() {
    return {
      visible: false,
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
      },
      permissionData:[]
    }
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
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.permissionData = false
      }
      this.visible = newVal;
    },
  },
  methods: {
    savePermission(data){
      let arr = this.permissionData.filter((item)=>(item.user_ID==data.user_ID))
      let originData=arr[0]
      let fd = {
        user_ID:data.user_ID,
        ig_ID:this.igData.ig_ID
      }
      if(data.R!=originData.R){
        fd.action = 'R'
        if(data.R){
          this.grant_permission_to_member(fd)
        }else{
          this.revoke_permission_from_member(fd)
        }
      }
      if(data.W!=originData.W){
        fd.action = 'W'
        if(data.W){
          this.grant_permission_to_member(fd)
        }else {
          this.revoke_permission_from_member(fd)
        }
      }
      return ""
    },
    grant_permission_to_member(fd){
      commonAjax(this.backendIP + "/api/grant_permission_to_member", fd).then((res) => {
        if(!res.success){
          throw Error()
        }
        Message({
          message: '修改用户权限成功',
          type: 'success',
          duration: 5 * 1000
        })
      }).catch(() => {
        Message({
          message: '修改用户权限失败',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    revoke_permission_from_member(fd){
      commonAjax(this.backendIP + "/api/revoke_permission_from_member", fd).then((res) => {
        if(!res.success){
          throw Error()
        }
        Message({
          message: '修改用户权限成功',
          type: 'success',
          duration: 5 * 1000
        })
      }).catch(() => {
        Message({
          message: '修改用户权限失败',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    openDialog() {
      this.visible = true
      console.log(this.igData);
      this.$nextTick(function() {
        this.GetMemPermission()
      });
    },
    handleCurrentChange(val) {
      this.pagenation.page=val
      this.pagenation.startNumber = this.pagenation.limit * (this.pagenation.page - 1)
      this.pagenation.endNumber = this.pagenation.limit * this.pagenation.page
    },
    GetMemPermission(){
      let fd = {
        ig_ID: this.igData.ig_ID,
      }
      commonAjax(this.backendIP + "/api/get_permission_of_member", fd).then((res) => {
        let data =res.users
        this.permissionData = JSON.parse(JSON.stringify(data))
        this.groupData = this.groupBy(data, function(item){
            return item.ug_ID;
        });
        let tmpArray = this.groupBy(data, function(item){
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
      }).catch(() => {
        Message({
          message: '获取用户信息失败！',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    UpdateUserInGroup() {
      if (this.is_admin==this.userData.is_admin &&this.status==this.userData.status) {
        Message({
          message: '没有更改任何信息！',
          type: 'warning',
          duration: 5 * 1000
        })
        return ;
      }
      let fd = {
        user_ID: this.userData.user_ID,
        ug_ID: this.userData.ug_ID,
        is_admin: this.is_admin,
        status: this.status,
      }
      commonAjax(this.backendIP + "/api/update_ug_rel", fd).then(() => {
        this.visible = false;
        this.$emit('userUpdated')
        Message({
          message: '编辑用户信息成功！',
          type: 'success',
          duration: 5 * 1000
        })
      }).catch(() => {
        Message({
          message: '编辑用户信息失败！',
          type: 'error',
          duration: 5 * 1000
        })
      })
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

<style lang="css" scoped>
</style>
