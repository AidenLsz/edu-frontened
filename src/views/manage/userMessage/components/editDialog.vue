<template lang="html">
  <el-dialog
    title="编辑用户"
    :visible.sync="visible"
    width="800px"
    center>
    <el-form :model="userData" status-icon  :ref="formName" label-position="left" label-width="90px" class="demo-ruleForm"
      autocomplete="off"
      style="margin-top:30px">
     <input type="password" style="display: none;"/>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="账号"  prop="username" style="margin-bottom: 15px">
              <el-input
                type="text"
                v-model="userData.username"
                auto-complete="off"
                disabled
                placeholder="请输入账号名称"
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email" style="margin-bottom: 15px">
            <el-input
              type="text"
              v-model="userData.email"
              auto-complete="off"
              disabled
              placeholder="请输入您的邮箱"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone" style="margin-bottom: 15px">
            <el-input
              type="text"
              v-model="userData.phone"
              auto-complete="off"
              placeholder="请输入您的手机号码"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="权限" prop="is_admin" style="margin-bottom: 15px">
            <el-input
              type="text"
              v-model="userData.email"
              auto-complete="off"
              placeholder="请输入您的邮箱"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status" style="margin-bottom: 15px">
            <el-input
              type="text"
              v-model="userData.phone"
              auto-complete="off"
              placeholder="请输入您的手机号码"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="UpdateUserInGroup()">确 定</el-button>
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

export default {
  props: {
    userData: {
      type: Object
    },
  },
  data() {
    return {
      visible: false,
      formName: 'addUserForm',
      status:0,
      is_admin:0,
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.$refs[this.formName].resetFields();
      }else{
        this.status=this.userData.status
        this.is_admin=this.userData.is_admin
      }
      this.visible = newVal;
    },
  },
  methods: {
    openDialog() {
      this.visible = true
    },
    UpdateUserInGroup() {
      this.$refs[this.formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        let fd = {
          username: this.ruleForm.username,
          password: this.ruleForm.password,
          phone: this.ruleForm.phone,
          email: this.ruleForm.email,
          ug_ID: this.groupid,
          type: 'user',
        }
        commonAjax(this.backendIP + "/api/register", fd).then(() => {
          this.visible = false;
          this.$emit('userCreated')
        }).catch(() => {
          Message({
            message: '创建用户失败！',
            type: 'error',
            duration: 5 * 1000
          })
        })
      })
    },

  }
}
</script>

<style lang="css" scoped>
</style>
