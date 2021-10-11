<template lang="html">
  <el-dialog
    class="dialog"
    title="添加用户"
    :visible.sync="visible"
    width="800px"
    center>
    <el-row type="flex" justify="start" >
      <el-input placeholder="请输入查询内容"
        v-model="searchData"
        class="input-width-select"
        style="width:70%;margin-right:20px;"
        clearable
        @keyup.enter.native="Search()">
        <el-select
          :disable="true"
          v-model="searchType"
          slot="prepend"
          style="width:120px"
          >
          <el-option v-for="(item,index) in list"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-input>
      <el-button type="primary" @click="Search()">查 询</el-button>
    </el-row>
    <el-row v-if="resData.user_name" type="flex" justify="start" class="res-data">
      <el-col class="left">
        查询结果：
      </el-col>
      <el-col>
        <span>账号：{{resData.user_name}}</span>
        <span>邮箱：{{resData.email}}</span>
        <span>手机号码：{{resData.phone}}</span>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :disabled="!resData.user_name" @click="Add()">添 加</el-button>
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
    tableData: {
      type: Array
    },
    groupname: {
      type: String
    },
  },
  data() {
    return {
      searchData: '',
      searchType: 'user_name', // 下拉框的值
      resData:{},
      list: [{
          label: '账号',
          value: 'user_name'
        },
        {
          label: '邮箱',
          value: 'email'
        },
        {
          label: '手机号码',
          value: 'phone'
        },
      ], // 数据字典下拉列表
      visible: false,
      formName: 'addUserForm',
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.resData={}
      }
      this.visible = newVal;
    },
    searchData() {
      this.resData={}
    },
    searchType(){
      this.resData={}
    }
  },
  methods: {
    Search() {
      this.resData={}
      let fd={
        field:this.searchType,
        value:this.searchData
      }
      commonAjax(this.backendIP + "/api/get_user_by_field", fd).then((res) => {
        if(res&&res.data)
          if(this.inGroup(res.data))
            Message({
              message: res.data.user_name+' 用户已在 '+this.groupname+' 组织机构中！',
              type: 'error',
              duration: 5 * 1000
            })
          else
            this.resData=res.data
        else
          Message({
            message: '未搜索到用户！',
            type: 'error',
            duration: 5 * 1000
          })
      }).catch(() => {
        Message({
          message: '服务器发生错误！',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    openDialog() {
      this.visible = true
    },
    Add(){
      let fd={
        ug_ID:this.groupid,
        user_ID:this.resData.user_ID
      }
      commonAjax(this.backendIP + "/api/insert_user_to_user_group", fd).then((res) => {
        if(!res.status)
          throw Error()
        Message({
          message: '添加用户成功！',
          type: 'success',
          duration: 5 * 1000
        })
        this.$emit('userAdded')
        this.visible=false
      }).catch(() => {
        Message({
          message: '添加用户失败！',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    inGroup(data){
      return this.tableData.some((item)=>item.user_ID==data.user_ID)
    }
  }
}
</script>

<style lang="scss" scoped>
.res-data{
  margin-top:40px;
  font-size: 16px;
  .left{
    width:150px;
    letter-spacing:4px;
    margin-left:5px;
  }
  span{
    display: inline-block;
    margin-right:35px;
    margin-bottom:5px;
  }
}
.el-select{
	width:100px;
	height:100%;
}
.input-width-select{
	width:80%
}
</style>
