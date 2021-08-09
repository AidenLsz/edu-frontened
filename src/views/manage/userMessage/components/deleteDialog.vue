<template lang="html">
  <el-dialog
    class="dialog"
    title="删除用户"
    :visible.sync="visible"
    width="800px"
    center>
    <div class="tip">
      确定从组织中删除用户吗？该操作不可撤销。
    </div>
    <div slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="Delete_User()">删 除</el-button>
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
    }
  },
  watch: {
  },
  methods: {
    openDialog() {
      this.visible = true
    },
    Delete_User(){
      let fd={
        user_ID:this.userData.user_ID,
        ug_ID:this.userData.ug_ID
      }
      commonAjax(this.backendIP+'/api/delete_user_from_group',fd).then((res)=>{
        if(res.status){
          Message({
            message: '删除用户成功！',
            type: 'success',
            duration: 5 * 1000
          })
          this.$emit('userDeleted')
          this.visible=false
        }else{
          throw Error()
        }
      }).catch(()=>{
        Message({
          message: '删除用户失败！',
          type: 'err',
          duration: 5 * 1000
        })
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.tip{
  font-size: 16px;
  text-indent: 2em;
}
</style>
