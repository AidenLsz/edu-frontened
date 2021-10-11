<template lang="html">
  <el-dialog
    title="创建题库"
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
            <el-form-item label="名称"  prop="name" style="margin-bottom: 15px">
              <el-input
                type="text"
                v-model="ruleForm.name"
                auto-complete="off"
                placeholder="请输入题库名称"
              />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="createItemGroup()">确 定</el-button>
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
    itemType: {
      type: String
    },
  },
  data() {
    return {
      visible: false,
      formName: 'addUserForm',
      ruleForm: {
        name: '',
      },
      rules: {
        name: [{
          required: true,
          message: "请输入题库名称",
          trigger: "blur"
        }, ],

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
    createItemGroup() {
      this.$refs[this.formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        let fd = {
          name: this.ruleForm.name,
          type:this.itemType
        }
        commonAjax(this.backendIP + "/api/create_item_group", fd).then(() => {
          this.visible = false;
          this.$emit('igCreated')
        }).catch(() => {
          Message({
            message: '创建题库失败！',
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
