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
                <el-input @keyup.enter.native="submit" v-model="searchKeyword" placeholder="关键词" style="width: 8vw; height: 30px; line-height: 30px; margin-right: 30px"></el-input>
                <el-button type="primary" style="height: 40px" @click="submit">检索</el-button>
            </el-row>
        </el-col>
        <el-col :span="6">
            <el-row type="flex" justify="end" style="margin-right: 40px">
                <el-button type="primary" style="height: 40px" @click="Input_New_Paper()">录入试卷</el-button>
            </el-row>
        </el-col>
    </el-row>
    <el-row v-if="Paper_Title.length > 0">
      <el-row type="flex" justify="start" style="font-size: 16px; margin-top: 20px">
        <label>{{Paper_Title}}</label>
      </el-row>
      <el-row type="flex" justify="start" style="font-size: 16px; margin-top: 10px; margin-bottom: 20px">
        <span>其中包含的样题如下：</span>
      </el-row>
      <el-row>
        <el-col :span="23" class="quesCard">
          <el-row style="text-align: left; padding-left: 30px; padding-top: 15px; background: white; padding-bottom: 15px">
            <el-col style="padding-bottom: 15px" >
              <Mathdown :content="Paper.stem" :name="'P_Stem'"></Mathdown>
            </el-col>
            <el-col v-for="(Option, Option_Index) in Paper.options" :key="'Option_'+ Option_Index">
              <el-row style="line-height: 40px" type="flex" justify="start"><span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span><Mathdown style="width:700px" :content="Option" :name="'Q_Option_' + Option_Index"></Mathdown></el-row>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 15px">
              <el-col :span="5" style="line-height: 40px; color: #888; font-size: 1.5rem; padding-left: 30px; text-align: left">
                所属题库：{{Paper.database}}
              </el-col>
              <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem">
                学科：{{Paper.subject}}
              </el-col>
              <el-col :span="4" style="line-height: 40px; color: #888; font-size: 1.5rem; display: none">
                题型：{{Paper.type}}
              </el-col>
              <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem">
                学段：{{Paper.period}}
              </el-col>
              <el-col :span="4" :offset="2" style="line-height: 40px">
                <el-button size="medium" plain round type="primary" @click="Paper_Detail_Show()">试卷详情</el-button>
              </el-col>
              <el-col :span="3" :offset="1" style="line-height: 40px">
                <el-button size="medium" plain round type="primary" @click="Check_Analyse()">查看分析报告</el-button>
              </el-col>
          </el-row>
        </el-col>
      </el-row>
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
                        <el-button size="mini" type="primary" @click="Check_My_Paper(scope.$index)">查看</el-button>
                        <el-button size="mini" type="success" @click="Edit_My_Paper(scope.$index)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="Delete_My_Paper(scope.$index)">删除</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
    <el-row v-if="Paper_Ques_List.length != 0" style="margin-top: 30px">
      <el-pagination
        @current-change="BackToTop"
        :current-page.sync="Page_Index"
        :page-size="Page_Length"
        layout="total, prev, pager, next"
        :total="Total_Count">
      </el-pagination>
    </el-row>
  </div>
</template>
<script>

import {commonAjax} from '@/common/utils/ajax'
import Mathdown from '@/common/components/Mathdown'

export default {
  name: 'myPaper',
  props: {

  },
  components: {
    Mathdown
  },
  data() {
    return {
        searchID: "",
        searchKeyword: "",
        searchKwCache: "",
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
          }],
          // 实际上就是以前的Item部分的内容
          Paper: {},
          // 用于点击“查看”以后的显示，临时从List里面抽就行
          Paper_Title: "",
          Paper_ID: "",
          // 用于保存返回数据
          Paper_Ques_List: [],
          Paper_ID_List: [],
          Paper_Title_List: [],
          // 用于缓存的，但是在这里我不确定用不用……总之加上吧……
          Paper_Cache_ID: "",
          // 数据库权限
          database_list: [],
          // 页码
            Page_Index: 1,
          // 单页长度，总页数
            Page_Length: 5,
          // 能搜索到的题目数量
            Total_Count: -1,
    }
  },
  watch:{

  },
  mounted() {
    this.initDatabaseList();
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
        this.Paper_ID = this.Paper_ID_List[val];
        this.Paper_Title = this.Paper_Title_List[val];
        this.Paper = this.Paper_Ques_List[val];
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
      },
      // 获取用户所具有的题库权限
      initDatabaseList(){
        this.database_list=[{name:'public',nick:'公共题库'}]
        //未登录时，不调用获取题库的端口
        if(!this.$store.state.user.token){
          return ;
        }
        commonAjax(this.backendIP+'/api/get_user_ig_name',
          {
            type:'Question',
            action:'R',
          }
        ).then((res)=>{
          let data=res.ig_name;
          for (var i = 0; i < data.length; i++) {
            this.database_list.push({name:data[i]})
          }
        })
        this.submit();
      },
      BackToTop(){
        this.submit();
        window.scrollTo(0,0);
      },
      submit() {

        if(this.searchKwCache != this.searchKeyword){
          this.Page_Index = 1;
        }

        this.searchKwCache = this.searchKeyword;

        // let param = new FormData();
        let param={}
        let database_list = [];

        this.tableData = [];

        for(var i = 0; i < this.database_list.length; i++){
          database_list.push(this.database_list[i].name)
        }

        var data = JSON.stringify({
          "content": this.searchKeyword,
          "size": 5,
          "database": database_list,
          "page_count": this.Page_Index,
          "subject": [],
          "period": []
        })

        // param.append("data", data);
        param.data=data

        commonAjax(this.backendIP+'/api/search_paper',param)
        .then((data)=>{

          // 清理显示数据
          this.Paper = {}
          this.Paper_Title = "";
          this.Paper_ID = "";
          this.Paper_ID_List = [];
          this.Paper_Ques_List = [];
          this.Paper_Title_List = [];

          var ID_List = data.paper_id_list;
          for(var i = 0; i < ID_List.length; i++){
            this.Paper_ID_List.push(ID_List[i]);
            this.Paper_Ques_List.push(data.question_list[i]);
            this.Paper_Title_List.push(data.paper_title_list[i]);

            this.tableData.push({
              id: ID_List[i],
              title: data.paper_title_list[i],
              source: data.question_list[i].database
            })
          }

          console.log(data)

          this.Total_Count = data.totalLength

        }).catch(()=>{
          this.$message.error("服务器繁忙，请稍后再试。")
        })
      },
      // 返回选项标签
    Get_Option_Label(Index){
      return String.fromCharCode(Index + 65)
    },
    Paper_Detail_Show(){

      if(this.Paper_Cache_ID == this.Paper_ID){
        let routeData = this.$router.resolve({ path: '/paperDetailShow' });
        window.open(routeData.href, '_blank');
        this.$message.success("试题详情内容已在新页面展开。");
        return
      }

      commonAjax(this.backendIP+'/api/paperJsonGet',
        {
          Database_Name: "LUNA",
          Paper_ID: this.Paper_ID
        }
      ).then((data)=>{
        if(data.Paper_Json.status == "FAIL"){
          this.$message.error("服务器繁忙，请稍后再试。")
          return
        }
        this.Paper_Cache_ID = this.Paper_ID;
        if(sessionStorage.getItem("PaperDetailShow")){
          sessionStorage.removeItem("PaperDetailShow");
        }
        sessionStorage.PaperDetailShow = JSON.stringify(data.Paper_Json)
        let routeData = this.$router.resolve({ path: '/paperDetailShow' });
        window.open(routeData.href, '_blank');
        this.$message.success("试题详情内容已在新页面展开。");
      })
    },
    // 查看试卷分析报告
    Check_Analyse(){

      if(this.Paper_Cache_ID == this.Paper_ID && sessionStorage.getItem("PaperDetailShow")){
        // 读取之前保存的一份信息，然后转存到分析报告页面那边去
        let Temp = JSON.parse(sessionStorage.PaperDetailShow);
        sessionStorage.PaperJson = JSON.stringify(Temp);
        let routeData = this.$router.resolve({ path: '/paperAnalyse' });
        window.open(routeData.href, '_blank');
        this.$message.success("试卷分析报告已在新页面展开。");
        return
      }

      commonAjax(this.backendIP+'/api/paperJsonGet',
        {
          Database_Name: "LUNA",
          Paper_ID: this.Paper_ID
        }
      ).then((data)=>{
        if(data.Paper_Json.status == "FAIL"){
          this.$message.error("服务器繁忙，请稍后再试。")
          return
        }
        this.Paper_Cache_ID = this.Paper_ID;
        sessionStorage.PaperDetailShow = JSON.stringify(data.Paper_Json);
        sessionStorage.PaperJson = JSON.stringify(data.Paper_Json);
        let routeData = this.$router.resolve({ path: '/paperAnalyse' });
        window.open(routeData.href, '_blank');
        this.$message.success("试卷分析报告已在新页面展开。");
      })
    },
  }
}
</script>
<style >
.quesCard{
  background: #F8FBFF;
  border: 1px dashed black;
}
</style>