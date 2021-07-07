<template>
  <div style="width: 90vw; margin-left: 5vw; padding-top: 60px;">
    <!-- 地址框 -->
    <el-row justify="start" type="flex">
      <el-col :span="7">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>用户信息</el-breadcrumb-item>
          <el-breadcrumb-item>组织架构</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 30px">
        <label style="font-size: 18px">用户管理</label>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 10px">
        <label style="font-size: 14px">用户所属：</label>
        <!-- <span style="font-size: 14px">{{ userGroup }}</span> -->
        <el-select v-model="groupid" placeholder="请选择">
          <el-option
            v-for="item,i in groupnameArray"
            :key="i"
            :label="item.groupname"
            :value="item.groupid">
          </el-option>
        </el-select>
    </el-row>
    <el-divider></el-divider>
    <el-row type="flex" justify="start">
        <el-col :span="18">
            <el-row type="flex" justify="start" style="margin-left: 10px">
                <span style="height: 40px; line-height: 40px; margin-right: 15px">用户名：</span>
                <el-input v-model="username" placeholder="用户名" style="width: 12vw; height: 30px; line-height: 30px; margin-right: 30px"></el-input>
                <span style="height: 40px; line-height: 40px; margin-right: 15px">邮箱：</span>
                <el-input v-model="email" placeholder="邮箱" style="width: 8vw; height: 30px; line-height: 30px; margin-right: 30px"></el-input>
                <el-button type="primary" style="height: 40px">查询</el-button>
            </el-row>
        </el-col>
        <el-col :span="6">
            <el-row type="flex" justify="end" style="margin-right: 40px">
                <el-button type="primary" style="height: 40px" @click="centerDialogVisible=true">添加用户</el-button>
            </el-row>
        </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 40px">
        <el-table
            :data="tableData">
            <el-table-column
                prop="username"
                label="用户名">
            </el-table-column>
            <!-- <el-table-column
                prop="userNick"
                label="昵称">
            </el-table-column> -->
            <el-table-column
                prop="groupname"
                label="所属单位">
            </el-table-column>
            <!-- <el-table-column
                prop="userProfession"
                label="职业"
                width="100">
            </el-table-column> -->
            <el-table-column
                prop="email"
                label="邮箱"
                width="240">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="电话"
                width="150">
            </el-table-column>
            <el-table-column
                prop="role"
                label="权限"
                width="100">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                width="100">
            </el-table-column>
            <el-table-column
                type="index"
                label="操作"
                width="160">
                <template slot-scope="scope">
                    <el-row>
                        <el-button size="mini" type="success" @click="Edit_User(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="Delete_User(scope.$index)">删除</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
    </el-row>

    <el-dialog
      title="添加用户"
      :visible.sync="centerDialogVisible"
      width="800px"
      center>
      <el-form :model="ruleForm" status-icon :rules="rules" :ref="formName" label-position="left" label-width="90px" class="demo-ruleForm"
        autocomplete="off"
        style="margin-top:30px">
       <input type="password" style="display: none;"/>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="账号"  prop="username" style="margin-bottom: 15px">
                <el-input
                  type="text"
                  v-model="ruleForm.username"
                  auto-complete="off"
                  placeholder="请输入账号名称"
                />
              </el-form-item>

            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码"  prop="password" style="margin-bottom: 15px">
              <el-input type="password" v-model="ruleForm.password"  autocomplete="new-password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email" style="margin-bottom: 15px">
              <el-input
                type="text"
                v-model="ruleForm.email"
                auto-complete="off"
                placeholder="请输入您的邮箱"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone" style="margin-bottom: 15px">
              <el-input
                type="text"
                v-model="ruleForm.phone"
                auto-complete="off"
                placeholder="请输入您的手机号码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="specform_DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Add_New_User_To_Group()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {commonAjax} from '@/common/utils/ajax'
import {Message } from 'element-ui'
import * as variable from '@/common/utils/variable'

export default {
  name: 'myPaper',
  props: {

  },
  data() {
    return {
        // 这个是用于检索的关键字，如果要显示用户信息的话之后手写一个方法放上去就好
        centerDialogVisible:false,
        formName:'addUserForm',
        username: "",
        email:"",
        groupid:"",
        groupData:[],
        groupnameArray:[],
        ruleForm: {
          username: '',
          password: '',
          email: '',
          phone: '',
          inviteCode:'',
          type:'user'
          // phone: '19916935265'
        },
        rules: {
          username:[
            { required: true, message: "请输入用户名", trigger: "blur" },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            // { validator: validatePass, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          phone: [
            { required: true, message: "请输入手机号码", trigger: "blur" },
            { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
            {
              pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
              message: "请输入正确的手机号码"
            }
          ],
        }
    }
  },
  watch:{
    visible(newVal){
      if(!newVal){
        this.$refs[this.formName].resetFields();
      }
      this.visible = newVal;
    },
  },
  mounted() {
    this.GET_USER_DATA();
  },
  computed:{
    tableData(){
      return this.groupData[this.groupid]
    }
  },
  methods: {
    GET_USER_DATA(){
      commonAjax(this.backendIP+'/api/get_users_by_admin',{}).then((res)=>{
        res.data.forEach((item)=>{
          item.status=variable.status[item.status]
          item.role=variable.userType[item.is_admin]
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
        // console.log(this.groupData);
        // console.log(this.groupnameArray);
        // console.log(this.groupid);
      })
    },
    Edit_User(val){
        alert(val.userName + " 正在编辑中...");
    },
    Delete_User(val){
      this.$message.error("已删除（隐藏）对应数据。")
      this.tableData.splice(val, 1);
    },
    Add_New_User_To_Group(){
      this.$refs[this.formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        let fd={
          username:this.ruleForm.username,
          password:this.ruleForm.password,
          phone:this.ruleForm.phone,
          email:this.ruleForm.email,
          ug_ID:this.groupid,
          type:'user',
        }
        commonAjax(this.backendIP + "/api/register",fd).then((data)=>{
          this.centerDialogVisible=false;
          this.GET_USER_DATA()
          console.log(data);
          // let userInfo={
          //   token:data.access_token,
          //   name:this.ruleForm.username,
          // }
        }).catch(()=>{
          Message({
            message: '添加用户失败！',
            type: 'error',
            duration: 5 * 1000
          })
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
<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
