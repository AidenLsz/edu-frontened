<template lang="html">
  <el-dialog
    title="创建用户"
    :visible.sync="visible"
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
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="Create_User_To_Group()">确 定</el-button>
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
    groupid: {
      type: String
    },
  },
  data() {
    return {
      visible: false,
      formName: 'addUserForm',
      ruleForm: {
        username: '',
        password: '',
        email: '',
        phone: '',
        type: 'user'
        // phone: '19916935265'
      },
      rules: {
        username: [{
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        }, ],
        password: [{
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }, ],
        email: [{
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        phone: [{
            required: true,
            message: "请输入手机号码",
            trigger: "blur"
          },
          {
            min: 11,
            max: 11,
            message: "请输入11位手机号码",
            trigger: "blur"
          },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[01235678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码"
          }
        ],
      },
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.$refs[this.formName].resetFields();
      }
      this.visible = newVal;
    },
  },
  methods: {
    openDialog() {
      this.visible = true
    },
    Create_User_To_Group() {
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
