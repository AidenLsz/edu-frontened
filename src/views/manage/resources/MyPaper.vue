<template>
  <div>
    <!-- 地址框 -->
    <el-row justify="start" type="flex">
      <el-col :span="7">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>资源管理</el-breadcrumb-item>
          <el-breadcrumb-item>我的试卷</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 30px">
        <label style="font-size: 18px">我的试卷资源管理</label>
    </el-row>
    <el-divider></el-divider>
    <el-row type="flex" justify="start">
        <el-col :span="18">
            <el-row type="flex" justify="start" style="margin-left: 10px">
                <span style="height: 40px; line-height: 40px; margin-right: 15px">试卷ID：</span>
                <el-input v-model="searchID" placeholder="试卷ID" style="width: 12vw; height: 30px; line-height: 30px; margin-right: 30px"></el-input>
                <span style="height: 40px; line-height: 40px; margin-right: 15px">关键词：</span>
                <el-input v-model="searchKeyword" placeholder="关键词" style="width: 8vw; height: 30px; line-height: 30px; margin-right: 30px"></el-input>
                <el-button type="primary" style="height: 40px">检索</el-button>
            </el-row>
        </el-col>
        <el-col :span="6">
            <el-row type="flex" justify="end" style="margin-right: 40px">
                <el-button type="primary" style="height: 40px" @click="Input_New_Paper()">录入试卷</el-button>
            </el-row>
        </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 40px">
        <el-table
            :data="tableData">
            <el-table-column
                prop="id"
                label="试卷ID"
                width="250">
            </el-table-column>
            <el-table-column
                prop="title"
                label="试卷标题">
            </el-table-column>
            <el-table-column
                prop="source"
                label="试卷来源"
                width="200">
            </el-table-column>
            <el-table-column
                type="index"
                label="操作"
                width="240">
                <template slot-scope="scope">
                    <el-row>
                        <el-button size="mini" type="primary" @click="Check_My_Paper(scope.row)">查看</el-button>
                        <el-button size="mini" type="success" @click="Edit_My_Paper(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="Delete_My_Paper(scope.row)">删除</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'myPaper',
  props: {

  },
  data() {
    return {
        searchID: "",
        searchKeyword: "",
        tableData: [{
            id: '12345678-1234-5678-12345678',
            title: '试卷一的标题现在显然有点太长了，不适合在这种表格里面查看了，不行我就再加两个字看够不够长',
            source: "user"
          }, {
            id: '12345678-1234-5678-12345678',
            title: '试卷二的标题就比较短',
            source: "user"
          }, {
            id: '12345678-1234-5678-12345678',
            title: '试卷三的标题现在尝试居于20到35字之间，比较合适',
            source: "user"
          }]
    }
  },
  watch:{

  },
  mounted() {
      for(let i = 0; i < this.tableData.length; i++){
          let ITEM = this.tableData[i];
          let limit = 30;
          if(ITEM.title.length > limit){
              ITEM.title = ITEM.title.substring(0, limit) + "..."
          }
          if(ITEM.source.length > limit){
              ITEM.source = ITEM.source.substring(0, limit) + "..."
          }
          this.tableData.splice(i, 1, ITEM)
      }
  },
  methods: {
      Check_My_Paper(val){
          this.searchID = val.id;
        console.log(val.id + " is Checking...")
      },
      Edit_My_Paper(val){
          this.searchKeyword = val.title
        console.log(val.title + " is Editing...")
      },
      Delete_My_Paper(val){
        console.log(val.id + " is Deleted.")
      },
      Input_New_Paper(){
        alert("正要前往试卷录入界面...")
      }
  }
}
</script>
<style >
</style>