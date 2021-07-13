<template>
  <div style="width: 90vw; margin-left: 5vw; padding-top: 60px;">
    <!-- 地址框 -->
    <el-row justify="start" type="flex">
      <el-col :span="7">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start" class="sub-header" >
        <label style="font-size: 18px">基本信息</label>
    </el-row>
    <el-form :model="userData" status-icon :rules="rules" :ref="formName" label-position="left" label-width="120px" class="demo-ruleForm"
      autocomplete="off"
      style="margin-top:30px">
      <el-row>
        <el-col :span="20" :offset="1">
          <el-form-item  label="账户" prop="user_name" style="margin-bottom: 15px">
            <el-row type="flex" justify="start">
              <el-input v-model="userData.user_name" style="width: 300px"></el-input>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="1">
          <el-form-item  label="邮箱" prop="email" style="margin-bottom: 15px">
            <el-row type="flex" justify="start">
              <el-input v-model="userData.email" style="width: 300px"></el-input>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="1">
          <el-form-item  label="手机号码" prop="phone" style="margin-bottom: 15px">
            <el-row type="flex" justify="start">
              <el-input v-model="userData.phone" style="width: 300px"></el-input>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="save-btn">
        <el-button type="primary" @click="updateBaseInfo()">保存</el-button>
      </div>
    <el-divider></el-divider>
    <el-row type="flex" justify="start" class="sub-header" >
        <label style="font-size: 18px">组织信息</label>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="1">
        <el-form-item  label="已加入" prop="groups" style="margin-bottom: 15px">
          <el-row type="flex" justify="start">
            <template v-for="(item,i) in groupData.filter(item=>item.status==1)">
              <el-tag :key ="i" style="margin-right:10px;">{{item.groupname}}</el-tag>
            </template>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="1">
        <el-form-item  label="待批准" prop="groups" style="margin-bottom: 15px">
          <el-row  type="flex" justify="start">
            <template v-for="(item,i) in groupData.filter(item=>item.status==0)">
              <el-tag type="warning" :key ="i" style="margin-right:10px;">{{item.groupname}}</el-tag>
            </template>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="!joinGroupSetting">
      <el-col :span="20" :offset="1">
        <el-form-item prop="" style="margin-bottom: 15px">
          <template slot="label">
            <div style="color:#409eff" @click="joinGroupSetting=true">
              申请加入新组织
            </div>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <template v-if="joinGroupSetting">
      <el-row>
        <el-col :span="20" :offset="1">
          <el-form-item  label="组织邀请码" prop="ug_ID" style="margin-bottom: 15px">
            <el-row type="flex" justify="start">
              <el-input v-model="userData.ug_ID" style="width: 300px" placeholder="请输入组织邀请码"></el-input>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="save-btn">
        <el-button @click="joinGroupSetting=false">取消</el-button>
        <el-button type="primary" @click="joinGroup()">保存</el-button>
      </div>
    </template>
    <el-divider></el-divider>
    <el-row type="flex" justify="start" class="sub-header" >
        <label style="font-size: 18px">安全设置</label>
    </el-row>
    <el-row v-if="!securitySetting">
      <el-col :span="20" :offset="1">
        <el-form-item prop="" style="margin-bottom: 15px">
          <template slot="label">
            <div style="color:#409eff" @click="securitySetting=true">
              修改密码
            </div>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <div v-if="securitySetting">
      <input type="password" style="display: none;"/>
      <el-row>
        <el-col :span="20" :offset="1">
          <el-form-item  label="旧密码" prop="oldPassword" style="margin-bottom: 15px">
            <el-row type="flex" justify="start">
              <el-input type="password" v-model="userData.oldPassword" style="width: 300px" placeholder="请输入旧密码" autocomplete="new-password"></el-input>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="1">
          <el-form-item  label="新密码" prop="newPassword1" style="margin-bottom: 15px">
            <el-row type="flex" justify="start">
              <el-input type="password" v-model="userData.newPassword1" style="width: 300px" placeholder="请输入新密码" autocomplete="new-password"></el-input>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="1">
          <el-form-item  label="确认密码" prop="newPassword2" style="margin-bottom: 15px">
            <el-row type="flex" justify="start">
              <el-input type="password" v-model="userData.newPassword2" style="width: 300px" placeholder="请再次输入新密码" autocomplete="new-password"></el-input>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="save-btn" style="margin-bottom:15px;">
        <el-button @click="securitySetting=false">取消</el-button>
        <el-button type="primary" @click="changePassword()">保存</el-button>
      </div>
    </div>
  </el-form>

  </div>
</template>
<script>
import {Message} from 'element-ui'
import {commonAjax} from '@/common/utils/ajax'
export default {
  name: 'userInfo',
  props: {

  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value==this.userData.oldPassword) {
        callback(new Error('新密码和旧密码相同！'));
      }else {
        if (this.userData.checkPass !== '') {
          this.$refs[this.formName].validateField('newPassword2');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userData.newPassword1) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateUg_ID = (rule, value, callback) => {
      let inGroup = this.groupData.some((item)=>item.ug_ID==value)
      if(inGroup){
        callback(new Error('您已加入该组织!'));
      }
      callback()
    };
    return {
      securitySetting: false,
      joinGroupSetting: false,
      formName: 'UserForm',
      ug_ID:'',
      groupData:[],
      userData: {
        user_name: '',
        email: '',
        phone: '',
        ug_ID:'',
        oldPassword:'',
        newPassword1:'',
        newPassword2:'',
      },
      rules: {
        user_name: [{required: true,message: "请输入用户名",trigger: "blur"}, ],
        oldPassword: [{required: true,message: "请输入密码",trigger: "blur"}, ],
        newPassword1: [{required: true,message: "请输入密码",trigger: "blur"},
          { validator: validatePass, trigger: 'blur' }],
        newPassword2: [{required: true,message: "请输入密码",trigger: "blur"},
          { validator: validatePass2, trigger: 'blur' }],
        email: [{required: true,message: '请输入邮箱地址',trigger: 'blur'},
          {type: 'email',message: '请输入正确的邮箱地址',trigger: ['blur', 'change']}
        ],
        phone: [{required: true,message: "请输入手机号码",trigger: "blur"},
          {min: 11,max: 11,message: "请输入11位手机号码",trigger: "blur"},
          {pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,message: "请输入正确的手机号码"}
        ],
        ug_ID: [{required: true,message: '请输入组织邀请码',},
          { validator: validateUg_ID, trigger: ['change'] }
        ],
      },
    }
  },
  watch:{

  },
  mounted() {
    this.getBaseInfo()
    this.getGroups()
  },
  methods: {
    getBaseInfo(){
      commonAjax(this.backendIP+'/api/get_user_info',{}).then((res)=>{
        this.userData=res.data
      }).catch(()=>{

      })
    },
    updateBaseInfo(){
      let validateList = [];
      this.$refs[this.formName].validateField(['phone','email','user_name'], (err) =>{
          validateList.push(err)
      })
      if (validateList.every((err) => err === '')) {
        let fd = {
          user_name: this.userData.user_name,
          phone: this.userData.phone,
          email: this.userData.email,
        }
        commonAjax(this.backendIP + "/api/update_user_info", fd).then(() => {
          this.$store.dispatch('user/setUserData', {
            token:this.$store.state.user.token,
            name:this.userData.user_name,
          })
          Message({
            message: '修改基本信息成功！',
            type: 'success',
            duration: 5 * 1000
          })
        }).catch(() => {
          Message({
            message: '修改基本信息失败！',
            type: 'error',
            duration: 5 * 1000
          })
        })
      }
    },
    getGroups(){
      commonAjax(this.backendIP+'/api/get_user_groups',{}).then((res)=>{
        this.groupData=res.data
      })
    },
    joinGroup(){
      let validateList=[]
      this.$refs[this.formName].validateField(['ug_ID'], (err) =>{
          validateList.push(err)
      })
      if (validateList.every((err) => err === '')) {
        let fd={
          ug_ID:this.userData.ug_ID
        }
        commonAjax(this.backendIP+'/api/join_group',fd).then((res)=>{
          if (res.status) {
            Message({
              message: '申请加入组织成功！',
              type: 'success',
              duration: 5 * 1000
            })
            this.userData.ug_ID=""
            this.getGroups()
          }else{
            Message({
              message: '申请加入组织失败！',
              type: 'error',
              duration: 5 * 1000
            })
          }
        }).catch(()=>{

        })
      }
    },
    changePassword(){
      let validateList=[]
      this.$refs[this.formName].validateField(['oldPassword','newPassword1','newPassword2'], (err) =>{
          validateList.push(err)
      })
      if (validateList.every((err) => err === '')) {
        let fd={
          oldPassword:this.userData.oldPassword,
          newPassword:this.userData.newPassword1,
        }
        commonAjax(this.backendIP+'/api/change_password',fd).then((res)=>{
          console.log(res);
          if(res.status){
            this.$message.success("修改密码成功!")
            this.userData.oldPassword = "";
            this.userData.newPassword1 = "";
            this.userData.newPassword2 = "";
          }else {
            this.$message.error("修改密码失败!")
          }
        }).catch(()=>{

        })

      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sub-header{
  margin-top: 30px;
  margin-bottom: 20px
}
.save-btn{
   width:900px;
}
</style>
