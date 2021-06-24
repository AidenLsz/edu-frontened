<template>
  <div>
    <!-- 地址框 -->
    <el-row justify="start" type="flex">
      <el-col :span="7">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>资源管理</el-breadcrumb-item>
          <el-breadcrumb-item>我的试题</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 30px">
        <label style="font-size: 18px">我的试题资源管理</label>
    </el-row>
    <el-divider></el-divider>
    <el-row type="flex" justify="start">
        <el-col :span="18">
            <el-row type="flex" justify="start" style="margin-left: 10px">
                <span style="height: 40px; line-height: 40px; margin-right: 15px">试题ID：</span>
                <el-input v-model="searchID" placeholder="试题ID" style="width: 12vw; height: 30px; line-height: 30px; margin-right: 30px"></el-input>
                <span style="height: 40px; line-height: 40px; margin-right: 15px">关键词：</span>
                <el-input v-model="searchKeyword" placeholder="关键词" style="width: 8vw; height: 30px; line-height: 30px; margin-right: 30px"></el-input>
                <el-button type="primary" style="height: 40px">检索</el-button>
            </el-row>
        </el-col>
        <el-col :span="6">
            <el-row type="flex" justify="end" style="margin-right: 40px">
                <el-button type="primary" style="height: 40px" @click="Input_New_Question()">录入试题</el-button>
            </el-row>
        </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 40px">
        <el-table
            :data="tableData">
            <el-table-column
                prop="id"
                label="试题ID"
                width="180">
            </el-table-column>
            <el-table-column
                prop="stem"
                label="题目内容">
            </el-table-column>
            <el-table-column
                prop="answer"
                label="试题答案">
            </el-table-column>
            <el-table-column
                prop="analyse"
                label="试题解析">
            </el-table-column>
            <el-table-column
                prop="source"
                label="试题来源"
                width="100">
            </el-table-column>
            <el-table-column
                type="index"
                label="操作"
                width="240">
                <template slot-scope="scope">
                    <el-row>
                        <el-button size="mini" type="primary" @click="Check_My_Question(scope.row)">查看</el-button>
                        <el-button size="mini" type="success" @click="Edit_My_Question(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="Delete_My_Question(scope.row)">删除</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'MyQuestion',
  props: {

  },
  data() {
    return {
        searchID: "",
        searchKeyword: "",
        tableData: [{
            id: '12345678-1234-5678-12345678',
            stem: '题目一的内容现在显然有点太长了，不适合在这种表格里面查看了，不行我就再加两个字看够不够长',
            answer: 'A',
            analyse: "第一题",
            source: "user"
          }, {
            id: '12345678-1234-5678-12345678',
            stem: '题目二的内容就比较短',
            answer: 'B',
            analyse: "第二题",
            source: "user"
          }, {
            id: '12345678-1234-5678-12345678',
            stem: '题目三的内容现在尝试居于一到两行之间，比较合适',
            answer: 'C',
            analyse: "第三题",
            source: "user"
          }]
    }
  },
  watch:{

  },
  mounted() {
      for(let i = 0; i < this.tableData.length; i++){
          let ITEM = this.tableData[i];
          let limit = 25;
          if(ITEM.stem.length > limit){
              ITEM.stem = ITEM.stem.substring(0, limit) + "..."
          }
          if(ITEM.answer.length > limit){
              ITEM.answer = ITEM.answer.substring(0, limit) + "..."
          }
          if(ITEM.analyse.length > limit){
              ITEM.analyse = ITEM.analyse.substring(0, limit) + "..."
          }
          if(ITEM.source.length > limit){
              ITEM.source = ITEM.source.substring(0, limit) + "..."
          }
          this.tableData.splice(i, 1, ITEM)
      }
  },
  methods: {
      Check_My_Question(val){
        console.log(val.id + " is Checking...")
      },
      Edit_My_Question(val){
        console.log(val.stem + " is Editing...")
      },
      Delete_My_Question(val){
        console.log(val.id + " is Deleted.")
      },
      Input_New_Question(){
        alert("正要前往试题录入界面...")
      }
  }
}
</script>
<style >
</style>