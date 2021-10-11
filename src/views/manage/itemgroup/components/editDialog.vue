<template lang="html">
  <el-dialog
    title="编辑题库"
    :visible.sync="visible"
    width="800px"
    center>
    <div class="">
      编辑功能开发中
    </div>
    <!-- <el-form :model="userData" status-icon  :ref="formName" label-position="left" label-width="90px" class="demo-ruleForm"
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
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="真实姓名"  prop="username" style="margin-bottom: 15px">
              <el-input
                type="text"
                v-model="userData.legal_name"
                auto-complete="off"
                disabled
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
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone" style="margin-bottom: 15px">
            <el-input
              type="text"
              v-model="userData.phone"
              auto-complete="off"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="权限" prop="is_admin" style="margin-bottom: 15px">
            <el-select v-model="is_admin" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(val,key) in variable.userType"
                :key="key"
                :label="val"
                :value="key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status" style="margin-bottom: 15px">
            <el-select v-model="status" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(val,key) in variable.status"
                :key="key"
                :label="val"
                :value="key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form> -->
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
import * as variable from '@/common/utils/variable'


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
      status: 0,
      is_admin: 0,
    }
  },
  computed: {
    variable() {
      return variable
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.$refs[this.formName].resetFields();
      } else {
        this.status = this.userData.status.toString()
        this.is_admin = this.userData.is_admin.toString()
      }
      this.visible = newVal;
    },
  },
  methods: {
    openDialog() {
      this.visible = true
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

  }
}
</script>

<style lang="css" scoped>
</style>
