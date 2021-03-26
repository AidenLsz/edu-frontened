<template>
  <div class="exercise" style="margin-bottom: 40px; margin-top: 5vh">
    <!-- header -->
    <el-row justify="start" type="flex">
      <el-col style="padding-left: 1vw">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>试题检索</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row style="padding-top: 8px; height: 40px;">
      <el-col :span="4" :offset="1" style="text-align: left;line-height: 30px">
        请选择要查询的数据库：
      </el-col>
      <!-- 0 - public, 1 - neea, 2 - iflytek -->
      <el-col :span="2">
        <div :class="Check_Focus_Database(0)" @click="Database_Aim(0)">
          公共题库
        </div>
      </el-col>
      <el-col :span="2" v-if="User_Check()">
        <div :class="Check_Focus_Database(1)" @click="Database_Aim(1)">
          NEEA
        </div>
      </el-col>
      <el-col :span="2" v-if="User_Check()">
        <div :class="Check_Focus_Database(2)" @click="Database_Aim(2)">
          IFLYTEK
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 4vh; margin-bottom: 5vh" type="flex" v-if="simpleInput">
      <el-col :span="11" :offset="1">
        <el-input v-model="content" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary" plain @click="changeInput">
          <span style="font-weight: bold">切换多格式输入</span>
        </el-button>
      </el-col>
      <el-col :span="1" :offset="1">
        <el-button type="primary" plain value="提交" @click="submit()">
          <span style="font-weight: bold">检索</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 4vh; margin-bottom: 5vh" v-if="!simpleInput" type="flex">
      <el-col :span="18" :offset="1">
        <el-row>
          <ComplexInput @Update_CI="UCI" @Update_Image="UCII" :Get_Out_Content="content"></ComplexInput>
        </el-row>
      </el-col>
      <el-col :span="3" style="padding-top: 14vh">
        <el-row>
          <el-button type="primary" plain  @click="changeInput">
            <span style="font-weight: bold">切换简单输入</span>
          </el-button>
        </el-row>
        <el-row>
          <el-button type="primary" plain  value="提交" @click="submit">
            <span style="font-weight: bold">检索</span>
          </el-button>
        </el-row>
      </el-col>
    </el-row>
    <!-- main -->
    <!-- <el-row type="flex" justify="center" style="margin-top: 4vh;" >
      <el-col :span="20">
        <div class="result">
          <el-row type="flex" justify="start">
            <h4 style="color: #0a1612; font-weight: bold">试题检索</h4>
          </el-row>
          <el-row type="flex" justify="start">
            <h3 style="color: #0a1612;">试题文本</h3>
          </el-row>
          <el-row type="flex" justify="start">
            <el-col style="text-align: left">
              <p>{{ raw_text }}</p>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row type="flex" justify="start" style="margin-top: 3vh">
            <el-col :span="24">
              <el-row type="flex" justify="start">
                <h4 style="color: #0a1612; font-weight: bold">知识点</h4>
              </el-row>
              <el-tabs
                value="rjb_new"
                @tab-click="dataSource"
                type="card"
                style="height: 200px; margin-top: 5vh;"
                id="tabs"
              >
                <el-tab-pane label="人教版新" name="rjb_new" style="border: none">
                  <el-row
                    v-for="(entities, group, group_index) in entities_groups"
                    :key="group_index"
                  >
                    <el-row v-if="group_index == 0" type="flex" justify="start">
                    </el-row>
                    <el-row
                      v-if="group_index == 0"
                      class="label"
                      type="flex"
                      justify="start"
                    >
                      <el-popover
                        placement="top-start"
                        v-for="(entity, index) in entities"
                        :key="index"
                        :title="entity.name"
                        width="200"
                        trigger="hover"
                        :content="entity.annotation"
                      >
                        <el-tag slot="reference" id="tag">{{
                          entity.name
                        }}</el-tag>
                      </el-popover>
                    </el-row>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row> -->
    <el-row v-for="(Question, Question_Index) in question_list" :key="Question_Index" style="margin-bottom: 50px">
      <el-col :offset="1" :span="22" class="quesCard">
        <el-row style="text-align: left; padding-left: 40px; padding-top: 10px; background: white; padding-bottom: 15px">
          <el-col style="padding-bottom: 15px">
            <span style="margin-bottom: 20px; display: block">题干：</span><Mathdown :content="Question.stem" :name="'Q_' + Question_Index + '_Stem'"></Mathdown>
          </el-col>
          <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_'+ Option_Index + '_Of_' + Question_Index">
            <el-row style="line-height: 40px" type="flex" justify="start"><span style="line-height: 40px">选项{{Get_Option_Label(Option_Index)}}：</span><Mathdown style="width:700px" :content="Option" :name="'Q_' + Question_Index + '_Option_' + Option_Index"></Mathdown></el-row>
          </el-col>
        </el-row>
        <el-row style="padding-bottom: 10px; border-bottom: 1px dashed black">
            <el-col :span="4" style="line-height: 40px; color: #888; font-size: 16px">
              所属题库：{{database_from[Question_Index]}}
            </el-col>
            <el-col :span="2" style="line-height: 40px; color: #888; font-size: 16px">
              学科：{{Question.subject}}
            </el-col>
            <el-col :span="2" style="line-height: 40px; color: #888; font-size: 16px; display: none">
              题型：{{Question.type}}
            </el-col>
            <el-col :span="2" :offset="11" style="line-height: 40px">
              <el-button size="medium" plain round type="primary" @click="Expand(Question_Index)">详情</el-button>
            </el-col>
            <el-col :span="3" style="line-height: 40px">
              <el-button size="medium" plain round type="primary">查看分析报告</el-button>
            </el-col>
        </el-row>
        <el-row v-if="Expand_List[Question_Index]" style="text-align: left; padding-left: 40px; line-height:30px; padding-top: -10px; padding-bottom: 20px">
          <el-col>
            <span style="margin-bottom: 10px; display: block">答案：</span><Mathdown :content="Question.answer" :name="'Q_' + Question_Index + '_Answer'"></Mathdown>
          </el-col>
        </el-row>
        <el-row v-if="Expand_List[Question_Index]" style="text-align: left; padding-left: 40px; padding-bottom: 20px">
          <el-col>
            <span style="margin-bottom: 20px; display: block">解析：</span><Mathdown :content="Question.analysis" :name="'Q_' + Question_Index + '_Analysis'"></Mathdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row 
      v-if="question_list.length == 0" 
      style="margin: 50px 60px; height: 44vh; font-size: 30px"
      v-loading="loading"
      element-loading-text="加载中，请等待"
      element-loading-spinner="el-icon-loading">
      
    </el-row>
    <el-row v-if="question_list.length != 0">
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
/* eslint-disable */
import Mathdown from "./Mathdown.vue";
import UploadImg from "./UploadImg.vue";
import ComplexInput from "./ComplexInput.vue";
export default {
  components: { Mathdown, UploadImg, ComplexInput },
  name: "exercise",
  data() {
    return {
      // 输入的简单文本
      exercise_text: "",
      // 试题文本
      raw_text: "试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本",
      // 题目内容
      entities_groups: {},
      entity_type: "kp2.0",
      sour: "",
      // Latex格式的内容
      content: "",
      // 老内容
      old_content: "",
      // 当前是否为简单输入格式
      simpleInput: true,
      // 新版本用的mavon-editor带来的自带回调函数用的json格式
      // name: 图片名
      // info: base64转换后的数据段
      image_infos: [],
      // 存放返回的题目内容
      question_list: [],
      // 存放学科信息
      subject_name: [],
      // 存放题型信息
      question_type: [],
      // 存放将要查询的数据库名称
      // public, neea, iflytek
      database_aim: [true, false, false],
      database_name: ['public', 'neea', 'iflytek'],
      // 这些数据依次来源于哪里
      database_from: [],
      // 检测是否要展开答案和解析内容
      Expand_List: [],
      // 页码
      Page_Index: 1,
      // 单页长度，总页数
      Page_Length: 5,
      Total_Page: -1,
      // 能搜索到的题目数量
      Total_Count: -1,
      // loading
      loading: false
    };
  },
  watch:{
    sour(val) {
      this.submit();
    }
  },
  methods: {
    BackToTop(){
      this.submit();
      window.scrollTo(0,0);
    },
    // 修改翻页内容
    Get_Question_Bundle(Page_Index){
      if(Page_Index * 5 > this.question_list.length){
        return this.question_list.slice((Page_Index - 1)*5)
      }else {
        return this.question_list.slice((Page_Index - 1)*5, Page_Index * 5)
      }
    },
    // 修改是否展开
    Expand(Index){
      this.Expand_List.splice(Index, 1, !this.Expand_List[Index]);
    },
    // 返回选项标签
    Get_Option_Label(Index){
      return String.fromCharCode(Index + 65)
    },
    // 修改目标数据库
    Database_Aim(Index){
      this.database_aim.splice(Index, 1, !this.database_aim[Index])
    },
    // 检查用户
    User_Check(){
      if(sessionStorage.isAdmin){
        return true;
      }else{
        return false;
      }
    },
    // Update_Complex_Input
    UCI(val){
      this.content = val;
    },
    // UCI_Images
    UCII(val){
      this.image_infos = val;
    },
    dataSource(tab, event) {
      this.sour = tab.name;
      //黄小青师兄12月提供数据
      if(this.sour == 'rjb_new'){
        this.entity_type = "kp2.0";
      }
      return tab.name;
    },
    changeInput() {
      this.simpleInput = !this.simpleInput;
    },
   // 删除图片并保持图片数组顺序
    forkImage(index) {
      this.src.splice(index, 1);
      for (var i = 0; i < this.filelists.length; i++) {
        if (typeof this.filelists[i] === "undefined") {
          this.filelists.splice(i, 1);
          i = i - 1;
        }
      }
      this.filelists.splice(index, 1);
      document.getElementsByTagName("input").value = "";
      console.log(this.src);
      console.log(this.filelists);
      console.log(document.getElementsByTagName("input").value);
    },
    submit() {

      this.loading = true;

      if(this.old_content == ""){
        this.old_content = this.content;
      }else if(this.content != this.old_content){
        this.Page_Index = 1;
        this.old_content = this.content
      }

      this.question_list = [];

      let config = {
          headers: { "Content-Type": "multipart/form-data" }
      };

      let param = new FormData();

      var database_list = [];
      for(var i = 0; i < this.database_aim.length; i++){
        if(this.database_aim[i]){
          database_list.push(this.database_name[i])
        }
      }
      // console.log(this.content, 5, database_list, this.Page_Index);
      // param.append("content", this.content);
      // param.append("size", 5);
      // param.append("database", database_list);
      // param.append("page_count", this.Page_Index)

      var data = JSON.stringify({
        "content": this.content,
        "size": 5,
        "database": database_list,
        "page_count": this.Page_Index
      })

      param.append("data", data);

      this.$http
      .post(this.backendIP + "/api/search", param, config, {
        emulateJSON: true
      })
      .then(function(data) {
        this.loading = false;
        this.Expand_List = [];
        this.question_list = [];
        var quess = data.data.results;
        var databaseName = data.data.databaseName;
        for(var i = 0; i < quess.length; i++){
          this.question_list.push(quess[i])
          this.database_from.push(databaseName[i])
          this.Expand_List.push(false);
        }
        this.Total_Count = data.data.totalLength
        
      });    
    },
    Check_Focus_Database(Index){
      if(this.database_aim[Index]){
        return "focusDatabase"
      }else{
        return "unFocusDatabase"
      }

    }
  }
};
</script>

<style scoped lang="scss">
.exercise {
  // background: url("../assets/sub_bg.png") repeat;
  background-size: 100%;
}
.logo {
  margin-left: 70px;
}
.result {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 780px;
  background-color: #F8FBFF;
  margin-left: 20px;
}
.quesCard{
  // border: 3px dashed black; 
  background: #EBEEF5; 
  border: 1px dashed black
}
.el-row {
  margin-bottom: 20px;
  & :last-child {
    margin-bottom: 0;
  }
}
.title {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  color: #0a1612;
}
.el-tag {
  margin-left: 10px;
}
.el-col {
  border-radius: 4px;
}
.focusDatabase{
  background: #409EFF;
  color: white;
  border-radius: 15px;
  margin: 0px 8px;
  height: 30px;
  line-height: 30px;

}
.unFocusDatabase{
  background: #F8FBFF;
  color: #409EFF;
  border-radius: 15px;
  border: 1px solid #409EFF;
  margin: 0px 8px;
  height: 30px;
  line-height: 30px;
}
</style>

<style scoped type="text/css">
/* .el-button {
  background-color: #1a2930;
  color: #fff;
  border-color: #1a2930;
}
.el-button:hover {
  background-color: #008080;
  color: #fff;
  border-color: #fff;
}
.el-button:focus {
  background-color: #008080;
  color: #fff;
  border-color: #fff;
  outline: none;
} */
.img-list-item {
  position: relative;
  margin: auto;
  display: inline-block;
}
.img-list-item img {
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  vertical-align: middle;
  border: 0;
}
.img-list-item i.del-img {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: rgba(0, 0, 0, 0.1);
  background-image: url(../assets/delete.jpeg);
  background-size: 10px;
  background-repeat: no-repeat;
  background-position: 50%;
  position: relative;
  top: 0;
  right: 0;
}
.el-divider--horizontal{
  display:block;
  height:3px;
  width:100%;
  margin:24px 0
}
</style>
<style scoped>
#tabs /deep/ .el-tabs__item {
  color: #36a9df;
  font-weight: 900;
  border-radius: 10px;
  border-color: #36a9df;
}
#tabs /deep/ .el-tabs__nav.is-top{
  border: none;
}
#tabs /deep/ .el-tabs__header.is-top{
  border: none;
}
#tabs /deep/ .el-tabs__item.is-active {
  background-color: #36a9df;
  color: #fff;
  font-weight: 900;
  border-color: #36a9df;
}
#tag /deep/ .el-tag {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #36a9df !important;
}

</style>