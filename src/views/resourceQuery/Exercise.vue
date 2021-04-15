<template>
  <div class="exercise" style="margin-bottom: 40px; margin-top: 5vh">
    <el-dialog
        :visible.sync="simpleInput" 
        title="LUNA输入助手" 
        width="65%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
      <ComplexInput @Update_CI="UCI" @Update_Image="UCII" :Get_Out_Content="content"></ComplexInput>
      <el-button type="success" plain @click="simpleInput = false">完成输入</el-button>
    </el-dialog>
    <!-- 地址框 -->
    <el-row justify="start" type="flex">
      <el-col :span="7" style="margin-left: 5vw;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>试题检索</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 题库选择 -->
    <el-row style="padding-top: 8px; height: 40px;">
      <el-col :span="4" style="text-align: left; line-height: 30px; margin-left: 5vw;">
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
    <!-- 搜索框行 -->
    <el-row type="flex" justify="start" class="SearchArea">
        <el-col :span="20">
          <el-input class="SearchInput" v-model="content" type="text">
            
          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 20px; color: black;" size="small" v-if="content != ''" @click="content = ''">
            <i class="el-icon-close"></i>
          </el-button>
        </el-col>
        <el-col :span="1">
          <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 18px; color: black; display: block; margin-left: -5px"  size="small" @click="simpleInput = true">
            ∑
          </el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 20px; display: block; margin-left: -8px;" size="small" @click="submit()">
            <i class="el-icon-search"></i>
          </el-button>
        </el-col>
    </el-row>
    <!-- 筛选条件行 -->
    <el-row type="flex" justify="start" style="margin-left: 5vw; margin-right: 5vw; border-top: 1px solid Silver; border-bottom: 1px solid Silver;">
      <el-col :span="2">
        <span style="line-height: 40px; font-weight: bold">筛选条件：</span>
      </el-col>
      <el-col :span="2">
        <el-popover
          placement="bottom-start"
          width="765"
          trigger="hover">
          <el-checkbox-group v-model="Subject_Type">     
            <el-checkbox label="语文">语文</el-checkbox>
            <el-checkbox label="数学">数学</el-checkbox>
            <el-checkbox label="英语">英语</el-checkbox>
            <el-checkbox label="政治">政治</el-checkbox>
            <el-checkbox label="历史">历史</el-checkbox>
            <el-checkbox label="地理">地理</el-checkbox>
            <el-checkbox label="物理">物理</el-checkbox>
            <el-checkbox label="化学">化学</el-checkbox>
            <el-checkbox label="生物">生物</el-checkbox>
          </el-checkbox-group>
          <el-button slot="reference" class="FilterButton" type="text">{{Get_Subject()}}</el-button>
          <el-button slot="reference" type="text" v-if="Subject_Type.length > 0" @click="Subject_Type = []" style="color: LightGrey"><i class="el-icon-close"></i></el-button>
        </el-popover>
      </el-col>
      <el-col :span="3">
        <el-popover
          placement="bottom-start"
          width="425"
          trigger="hover">
          <el-checkbox-group v-model="Period_Type">     
            <el-checkbox label="小学">小学</el-checkbox>
            <el-checkbox label="初中">初中</el-checkbox>
            <el-checkbox label="高中">高中</el-checkbox>
            <el-checkbox label="大学">大学</el-checkbox>
            <el-checkbox label="成人">成人</el-checkbox>
          </el-checkbox-group>
          <el-button slot="reference" class="FilterButton" type="text">{{Get_Period()}}</el-button>
          <el-button slot="reference" type="text" v-if="Period_Type.length > 0" @click="Period_Type = []" style="color: LightGrey"><i class="el-icon-close"></i></el-button>
        </el-popover>
      </el-col>
    </el-row>
    <el-row v-for="(Question, Question_Index) in question_list" :key="Question_Index" style="margin-bottom: 50px">
      <el-col :span="17" class="quesCard">
        <el-row style="text-align: left; padding-left: 40px; padding-top: 10px; background: white; padding-bottom: 15px">
          <el-col style="padding-bottom: 15px">
            <Mathdown :content="Question.stem" :name="'Q_' + Question_Index + '_Stem'"></Mathdown>
          </el-col>
          <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_'+ Option_Index + '_Of_' + Question_Index">
            <el-row style="line-height: 40px" type="flex" justify="start"><span style="line-height: 40px">选项{{Get_Option_Label(Option_Index)}}：</span><Mathdown style="width:700px" :content="Option" :name="'Q_' + Question_Index + '_Option_' + Option_Index"></Mathdown></el-row>
          </el-col>
        </el-row>
        <el-row style="padding-bottom: 10px; border-bottom: 1px dashed black">
            <el-col :span="4" style="line-height: 40px; color: #888; font-size: 14px">
              所属题库：{{database_from[Question_Index]}}
            </el-col>
            <el-col :span="2" style="line-height: 40px; color: #888; font-size: 14px">
              学科：{{Question.subject}}
            </el-col>
            <el-col :span="3" style="line-height: 40px; color: #888; font-size: 14px">
              题型：{{Question.type}}
            </el-col>
            <el-col :span="2" style="line-height: 40px; color: #888; font-size: 14px">
              学段：{{Question.period}}
            </el-col>
            <el-col :span="2" :offset="8" style="line-height: 40px">
              <el-button size="medium" plain round type="primary" @click="Expand(Question_Index)">详情</el-button>
            </el-col>
            <el-col :span="3" style="line-height: 40px">
              <el-button size="medium" plain round type="primary" @click="Check_Analyse(Question.id)">查看分析报告</el-button>
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
import Mathdown from "../../common/components/Mathdown.vue";
import ComplexInput from "../../common/components/ComplexInput.vue";
export default {
  components: { Mathdown, ComplexInput },
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
      simpleInput: false,
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
      loading: false,
      // 学科和学段
      Subject_Type: [],
      Period_Type: [],
    };
  },
  watch:{
    sour(val) {
      this.submit();
    }
  },
  mounted(){
    this.ToTop()
  },
  methods: {
    // 查看单题分析报告
    Check_Analyse(ID){
      console.log(ID)
    },
    ToTop(){
      window.scrollTo(0,0);
    },
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

      console.log(database_list)
      // console.log(this.content, 5, database_list, this.Page_Index);
      // param.append("content", this.content);
      // param.append("size", 5);
      // param.append("database", database_list);
      // param.append("page_count", this.Page_Index)

      var data = JSON.stringify({
        "content": this.content,
        "size": 5,
        "database": database_list,
        "page_count": this.Page_Index,
        "subject": this.Subject_Type,
        "period": this.Period_Type
      })

      param.append("data", data);

      this.$http
      .post(this.backendIP + "/api/search", param, config, {
        emulateJSON: true
      })
      .then(function(data) {
        console.log(data.data);
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

    },
    // 修改学科，学段时的配套显示
    Get_Subject(){
      if(this.Subject_Type.length == 0){
        return "选择学科"
      }else if(this.Subject_Type.length == 1){
        return this.Subject_Type[0]
      }else{
        return this.Subject_Type[0] + "（等" + this.Subject_Type.length + "项）"
      }
    },
    Get_Period(){
      if(this.Period_Type.length == 0){
        return "选择学段"
      }else if(this.Period_Type.length == 1){
        return this.Period_Type[0]
      }else{
        return this.Period_Type[0] + "（等" + this.Period_Type.length + "项）"
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
  background: #F8FBFF; 
  border: 1px dashed black;
  margin-left: 5vw;
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
  background-image: url(./../../assets/delete.jpeg);
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
<style lang="scss" scoped>
.SearchInput{
  font-size: 16px;
  line-height: 28px;
  height: 28px
}
.SearchInput /deep/ .el-input__inner {
  border: 0;
  border-radius: 0px;
  background: transparent;
}

.el-divider--vertical{
  display: block;
  width: 2px;
  background-color: #9B9EA4;
  height: 32px;
  margin-top: 4px;
}
.FilterButton{
  padding-top: 12px;
}
.SearchArea{
  margin-left: 5vw; 
  border: 1px solid Silver;
  width: 60%; 
  border-radius: 18px;
  -webkit-box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
}
</style>