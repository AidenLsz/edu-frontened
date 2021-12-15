<template lang="html">
  <el-dialog
    class="dialog"
    title="删除题库"
    :visible.sync="visible"
    width="800px"
    center>
    <div class="tip">
      <!-- 删除功能开发中 -->
      确定删除题库吗？该操作不可撤销。
    </div>
    <div slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="Delete_Item_Group()">删 除</el-button>
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
    igData: {
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
    Delete_Item_Group(){
      commonAjax(this.backendIP+'/api/delete_empty_itemgroup',{ig_ID:this.igData.ig_ID}).then(()=>{
        Message({
          message: '删除题库成功！',
          type: 'success',
          duration: 5 * 1000
        })
        this.$emit('igDeleted')
        this.visible=false
      }).catch((err)=>{
        let msg = "删除题库失败！"
        if(err.status==401){
          msg = "您没有权限删除该题库！"
        }else if(err.status==402){
          msg = "该题库不为空，无法删除！"
        }
        Message({
          message: msg,
          type: 'error',
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
