<template>
  <div
    class="exercise"
    style="margin-bottom: 40px; margin-top: 5vh"
    v-loading="Question_Analysing"
    element-loading-text="正在加载分析报告..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(211, 211, 211, 0.6)">
    <el-dialog
        :visible.sync="simpleInput"
        title="LUNA输入助手"
        width="65%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
      <ComplexInput @Update_CI="UCI" @Update_Image="UCII" :Get_Out_Content="content"></ComplexInput>
      <el-button type="success" plain @click="simpleInput = false">完成输入</el-button>
    </el-dialog>
    <!-- 查看分析报告 -->
    <el-dialog
        :visible.sync="analyseReport"
        width="90%"
        :modal-append-to-body="false"
        :close-on-click-modal="true">
        <template slot="title"></template>
        <el-row
          style="margin: 0px">
          <QuestionAnalyse :Ques="analyseData"></QuestionAnalyse>
        </el-row>
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
      <template v-for="(item,i) in database_list">
        <el-col :key="i" :span="2">
          <div :class="Check_Focus_Database(i)" @click="Database_Aim(i)">
            {{item.nick||item.name}}
          </div>
        </el-col>
      </template>
      <!-- <el-col :span="2">
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
      </el-col>-->
    </el-row>
    <!-- 搜索框行 -->
    <el-row type="flex" justify="start" class="SearchArea">
      <!-- enter.native才能监听到组件化的事件，要注意一下 -->
        <el-col :span="19" v-if="Cache_Pic[0] == ''">
          <el-input class="SearchInput" v-model="content" type="text" @keyup.enter.native="submit(0, '')">

          </el-input>
        </el-col>
        <el-col :span="1" v-if="Cache_Pic[0] == ''">
          <el-button type="text" style="font-size: 20px; color: black;" size="small" v-if="content != ''" @click="content = ''">
            <i class="el-icon-close"></i>
          </el-button>
        </el-col>
        <el-col :span="4" v-if="Cache_Pic[0] != ''">
          <el-row type="flex" justify="start" style="border: 1px solid red; border-radius: 15px; height: 36px; margin: 3px">
            <el-image :src="Cache_Pic[0]" style="height: 30px; width: 60px; margin-top: 3px; margin-left: 30px;" :preview-src-list="Cache_Pic"></el-image>
            <el-button type="text"
              style="font-size: 20px; color: rgba( 0, 0, 0, 0.4); margin-left: 10px; width: 40px; display: block"
              size="small"
              @click="Clear_Pic">
              <i class="el-icon-close"></i>
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="1" v-if="Cache_Pic[0] == ''">
          <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :span="1" :offset="16" v-if="Cache_Pic[0] != ''">
          <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 22px; color: #409EFF; display: block; margin-left: -6px;"  size="small" @click="simpleInput = true">
            &Sigma;
          </el-button>
        </el-col>
        <el-col :span="1">
          <el-row type="flex" justify="start" style="line-height: 40px">
            <div class="picSearchArea">
              <p style="display: inline-block;">
                <i class="el-icon-camera-solid" style="font-size: 22px;"></i>
              </p>
              <input
                class="picSearch"
                type="file"
                @change="pictureSearch($event)"
                accept=".jpeg, .png, .jpg"
                ref="picSearchInput"
                multiple="false"
              />
            </div>
          </el-row>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 22px; display: block; margin-left: -8px" size="small" @click="submit(0, '')">
            <i class="el-icon-search"></i>
          </el-button>
        </el-col>
    </el-row>
    <!-- 筛选条件行 -->
    <el-row type="flex" justify="start" style="margin-left: 5vw; margin-right: 5vw; border-top: 1px solid Silver; border-bottom: 1px solid Silver;">
      <el-col :span="2">
        <span style="line-height: 40px; font-weight: bold">筛选条件：</span>
      </el-col>
      <el-col :span="3">
        <el-popover
          placement="bottom-start"
          width="850"
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
            <el-button size="small" plain type="primary" @click="submit()" style="margin-left: 40px; font-size: 14px">确认</el-button>
          </el-checkbox-group>
          <el-button slot="reference" class="FilterButton" type="text">{{Get_Subject()}}</el-button>
          <el-button slot="reference" type="text" v-if="Subject_Type.length > 0" @click="Subject_Type = []; submit()" style="color: LightGrey"><i class="el-icon-close"></i></el-button>
        </el-popover>
      </el-col>
      <el-col :span="3">
        <el-popover
          placement="bottom-start"
          width="510"
          trigger="hover">
          <el-checkbox-group v-model="Period_Type">
            <el-checkbox label="小学">小学</el-checkbox>
            <el-checkbox label="初中">初中</el-checkbox>
            <el-checkbox label="高中">高中</el-checkbox>
            <el-checkbox label="大学">大学</el-checkbox>
            <el-checkbox label="成人">成人</el-checkbox>
            <el-button size="small" plain type="primary" @click="submit()" style="margin-left: 40px; font-size: 14px">确认</el-button>
          </el-checkbox-group>
          <el-button slot="reference" class="FilterButton" type="text">{{Get_Period()}}</el-button>
          <el-button slot="reference" type="text" v-if="Period_Type.length > 0" @click="Period_Type = []; submit()" style="color: LightGrey"><i class="el-icon-close"></i></el-button>
        </el-popover>
      </el-col>
    </el-row>
    <el-row
      v-for="(Question, Question_Index) in question_list"
      :key="Question_Index"
      style="margin-bottom: 50px"
      >
      <el-col :span="17" class="quesCard">
        <el-row style="text-align: left; padding-left: 30px; padding-top: 15px; background: white; padding-bottom: 15px">
          <el-col style="padding-bottom: 15px">
            <Mathdown :content="Question.stem" :name="'Q_' + Question_Index + '_Stem'"></Mathdown>
          </el-col>
          <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_'+ Option_Index + '_Of_' + Question_Index">
            <el-row style="line-height: 40px" type="flex" justify="start"><span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span><Mathdown style="width:700px" :content="Option" :name="'Q_' + Question_Index + '_Option_' + Option_Index"></Mathdown></el-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 15px">
            <el-col :span="4" style="line-height: 40px; color: #888; font-size: 1.5rem; padding-left: 30px; text-align: left">
              所属题库：{{Question.database}}
            </el-col>
            <el-col :span="2" style="line-height: 40px; color: #888; font-size: 1.5rem">
              学科：{{Question.subject}}
            </el-col>
            <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem; display: none">
              题型：{{Question.type}}
            </el-col>
            <el-col :span="2" style="line-height: 40px; color: #888; font-size: 1.5rem">
              学段：{{Question.period}}
            </el-col>
            <el-col :span="4" :offset="7" style="line-height: 40px">
              <el-button size="medium" plain round type="primary" @click="Expand(Question_Index)">查看答案与解析</el-button>
            </el-col>
            <el-col :span="3" style="line-height: 40px">
              <el-button size="medium" plain round type="primary" @click="Check_Analyse(Question.id, Question.database)">查看分析报告</el-button>
            </el-col>
        </el-row>
        <el-row v-if="Expand_List[Question_Index]" style="text-align: left; padding-left: 40px; line-height:30px; padding-top: 20px; border-top: 1px dashed black">
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
import QuestionAnalyse from "../resourceAnalyse/QuestionAnalyse.vue"
import {commonAjax} from '@/common/utils/ajax'

export default {
  components: { Mathdown, ComplexInput, QuestionAnalyse },
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
      // database_aim: [true, false, false],
      // database_name: ['public', 'neea', 'iflytek'],
      database_aim: [],
      database_list:[],
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
      // 上次选择的学科和学段
      history_Subject_Type: [],
      history_Period_Type: [],
      // 分析报告页是否显示
      analyseReport: false,
      // 是否正在返回分析报告
      Question_Analysing: false,
      // 暂存的图片内容
      Cache_Pic: [""],
      // 用于分析显示的题目数据
      analyseData: {
                "analysis": "\u5982\u56fe\uff0c\u505a\u51fa\u7ea6\u675f\u6761\u4ef6$\\left\\{\\begin{array}{c}2 x+y-2 \\leq 0 \\ x-y-1 \\geq 0 \\ y+1 \\geq 0\\end{array}\\right.$\u6240\u8868\u793a\u7684\u53ef\u884c\u57df\u3002\u6613\u5f97A\u7684\u5750\u6807\u4e3a$A(1,0)$\u3002\u5f53\u76ee\u6807\u51fd\u6570\u7ecf\u8fc7A\u70b9\u65f6\uff0cz\u53d6\u5f97\u6700\u5927\u503c\uff0c\u53ef\u5f97$z=x+7 y$\u7684\u6700\u5927\u503c\u4e3a$1+7 \\times 0=1$",
                "answer": "1",
                "database": "公开题库",
                "id": "96ac6512-8aed-11eb-8fbd-b46bfc50aa29",
                "options": [],
                "period": "高中",
                "stem": "若$x,y$满足约束条件$\\left\\{\\begin{array}{c}2 x+y-2 \\leq 0 \\ x-y-1 \\geq 0 \\ y+1 \\geq 0\\end{array}\\right.$，则$z=x+7 y$的最大值为$\\underline{}$",
                "subject": "数学",
                "type": "Question",
                "que_type": "其他",
                "difficulty": 0.2,
                "discrimination": 0.3,

                "quality": 0.6,
                "knowledge_points_frontend": {
                    "kp": [
                        "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212",
                        "\u4ee3\u6570",
                        "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898",
                        "\u4e0d\u7b49\u5f0f"
                    ],
                    "kp_layer": [
                        {
                        "children": [
                            {
                            "children": [
                                {
                                "children": [
                                    {
                                    "children": [],
                                    "label": "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898"
                                    },
                                    {
                                    "children": [],
                                    "label": "\u4e8c\u5143\u4e00\u6b21\u4e0d\u7b49\u5f0f\uff08\u7ec4\uff09\u8868\u793a\u7684\u5e73\u9762\u533a\u57df"
                                    }
                                ],
                                "label": "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212"
                                }
                            ],
                            "label": "\u4e0d\u7b49\u5f0f"
                            }
                        ],
                        "label": "\u4ee3\u6570"
                        }
                    ],
                    "kp_priority": [
                            "\u4ee3\u6570",
                            "\u4e0d\u7b49\u5f0f",
                            "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212",
                            "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898",
                            "\u4e8c\u5143\u4e00\u6b21\u4e0d\u7b49\u5f0f\uff08\u7ec4\uff09\u8868\u793a\u7684\u5e73\u9762\u533a\u57df"
                    ]
                    },
                }
    };
  },
  watch:{
    sour(val) {
      this.submit();
    },
  },
  mounted(){
    this.ToTop()
    this.initDatabaseList();
  },
  methods: {
    initDatabaseList(){
      this.database_list=[{name:'public',nick:'公共题库'}]
      this.database_aim=[true]
      commonAjax(this.backendIP+'/api/get_user_ig_name',
        {
          type:'Question',
          action:'R',
        }
      ).then((res)=>{
        let data=res.ig_name;
        for (var i = 0; i < data.length; i++) {
          this.database_list.push({name:data[i]})
          this.database_aim.push(false)
        }
      })
    },
    // 清除图片
    Clear_Pic(){
      this.Cache_Pic.splice(0, 1, "");
    },
    // 照片上传
    pictureSearch(event){
      if(event.target.files){
        // 获取图片
        let Pic = event.target.files[0];
        // 保存读取内容用的临时变量
        var Picresult = "";
        // 获取this对象
        const _this = this;
        // 重置input组件
        this.$refs.picSearchInput.value = "";
        // Promise方法避免异步操作
        var promise = new Promise(function(resolve, reject){
          // 用文件读取来读取图片的base64格式代码
          var reader = new FileReader();
          reader.readAsDataURL(Pic);
          reader.onloadend = function (e) {
            Picresult = e.target.result;
            // 这里是为了先处理一下现在没有暂存图片内容的情况，防止后面忘记写，有备无患
            _this.content = "";
            console.log(_this.Cache_Pic);
            if(_this.Cache_Pic[0] == ""){
              _this.Cache_Pic.splice(0, 1, Picresult);
              _this.Page_Index = 1;
            }
            // 提供resolve信息让then方法去捕捉
            resolve('1');
          };
        });
        promise.then(function(){
          // 用捕捉到的this对象来进行搜索
          _this.submit(1, Picresult);
        }).catch(function(error){
          // 报错了就打印错误
          console.log(error)
        })

      }else{
        return
      }
    },
    // 查看单题分析报告
    Check_Analyse(ID, DatabaseName){

      this.Question_Analysing = true;

      // let config = {
      //     headers: { "Content-Type": "multipart/form-data" }
      // };
      //
      // let param = new FormData();

      // if(DatabaseName == '公开题库'){
      //   param.append("databasename", 'public');
      // }else if(DatabaseName == 'neea'){
      //   param.append("databasename", 'neea');
      // }else if(DatabaseName == 'iflytek'){
      //   param.append("databasename", 'iflytek');
      // }
      // param.append("ID", ID);
      //
      // this.$http
      // .post(this.backendIP + "/api/questionAnalyse", param, config, {
      //   emulateJSON: true
      // })
      // .then(function(data) {
      //   this.analyseData = data.data.que_dic;
      //   this.analyseReport = true;
      //   this.Question_Analysing = false;
      // });
      commonAjax(this.backendIP+'/api/questionAnalyse',
        {
          databasename:DatabaseName=='公开题库'?'public':DatabaseName,
          ID:ID
        }
      ).then((data)=>{
        // console.log(data);
        this.analyseReport = true;
        this.Question_Analysing = false
        this.analyseData = data.que_dic
      })
    },
    ToTop(){
      window.scrollTo(0,0);
    },
    BackToTop(){
      if(this.Cache_Pic[0].length > 0){
        this.submit(1, this.Cache_Pic[0]);
      }else{
        this.submit(0, "");
      }
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
      // console.log(this.src);
      // console.log(this.filelists);
      // console.log(document.getElementsByTagName("input").value);
    },
    Same_Check(Arr1, Arr2){
      if(Arr1.length != Arr2.length){
        return false
      }
      for(let i = 0; i < Arr1.length; i++){
        if(Arr2.indexOf(Arr1[i]) == -1){
          return false
        }
      }
      return true
    },
    submit(type, Pic = "") {

      this.loading = true;

      // type为1，代表图片搜索，只有当传入的图片和原来的不一样，才需要替换页数为1
      // 而且使用图片搜索时，为了防止和普通的文字搜索混淆，把content改写为空字符串
      // 如果与缓存的图片不一致，则说明是新图片，需要替换图片内容
      if(type != 0){
        this.content = "";
        if(Pic != this.Cache_Pic[0]){
          this.Cache_Pic.splice(0, 1, Pic);
          this.Page_Index = 1;
        }
      }
      // 默认传入一个空字符串，这代表了使用文字搜索或者同一张图片的换页操作
      // 文字栏为空，Pic也为空字符串而触发了submit函数，说明应该是换页，继续流程即可
      // 文字栏不为空，Pic为空字符串，说明应该是文字搜索，此时应当清理图片缓存
      else{
        this.Cache_Pic = [""];
      }

      // 后续逻辑和原先一致

      if(this.content != this.old_content){
        this.Page_Index = 1;
      }

      this.old_content = this.content

      if(!this.Same_Check(this.history_Subject_Type, this.Subject_Type)){
        this.Page_Index = 1;
      }

      this.history_Subject_Type = this.Subject_Type;

      if(!this.Same_Check(this.history_Period_Type, this.Period_Type)){
        this.Page_Index = 1;
      }

      this.history_Period_Type = this.Period_Type;

      this.question_list = [];

      let config = {
          headers: { "Content-Type": "multipart/form-data" }
      };

      // let param = new FormData();
      let param={}
      var database_list = [];
      for(var i = 0; i < this.database_aim.length; i++){
        if(this.database_aim[i]){
          database_list.push(this.database_list[i].name)
        }
      }

      if(this.Cache_Pic[0].length > 0){
        // param.append('pic', this.Cache_Pic[0]);
        param.pic=this.Cache_Pic[0]
      }

      var data = JSON.stringify({
        "content": this.content,
        "size": 5,
        "database": database_list,
        "page_count": this.Page_Index,
        "subject": this.Subject_Type,
        "period": this.Period_Type
      })

      // param.append("data", data);
      param.data=data

      // this.$http
      // .post(this.backendIP + "/api/search", param, config, {
      //   emulateJSON: true
      // })
      // .then(function(data) {
      //   this.loading = false;
      //   this.Expand_List = [];
      //   this.question_list = [];
      //   var quess = data.data.results;
      //   for(var i = 0; i < quess.length; i++){
      //     this.question_list.push(quess[i])
      //     this.Expand_List.push(false);
      //   }
      //   this.Total_Count = data.data.totalLength
      //
      // });
      commonAjax(this.backendIP+'/api/search',param)
      .then((data)=>{
        this.loading = false;
        this.Expand_List = [];
        this.question_list = [];
        var quess = data.results;
        for(var i = 0; i < quess.length; i++){
          this.question_list.push(quess[i])
          this.Expand_List.push(false);
        }
        this.Total_Count = data.totalLength
      })
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
/deep/.dev-md-content{
  img{
    max-width:80%
  }
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
// .focusDatabase{
//   background: #409EFF;
//   color: white;
//   border-radius: 15px;
//   margin: 0px 8px;
//   height: 30px;
//   line-height: 30px;
//
// }
// .unFocusDatabase{
//   background: #F8FBFF;
//   color: #409EFF;
//   border-radius: 15px;
//   border: 1px solid #409EFF;
//   margin: 0px 8px;
//   height: 30px;
//   line-height: 30px;
// }
.focusDatabase{
  background: #409EFF;
  color: white;
}
.unFocusDatabase{
  background: #F8FBFF;
  color: #409EFF;
  border: 1px solid #409EFF;
}
.focusDatabase,.unFocusDatabase{
  border-radius: 15px;
  padding: 0px 15px;
  height: 30px;
  line-height: 30px;
  float: left;
  text-align: center;/*让文字水平居中*/
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
  box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
  -webkit-box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
}
// 照相机按钮使用的区域
.picSearchArea{
  position: relative;
  background-color: transparent;
  height: 36px;
  padding-top: 4px;
  color: #409EFF;
  cursor: pointer;
  margin-left: -7px;
}
// 照相机按钮使用的样式
.picSearch{
  position: absolute;
  top: 0;
  right: 0;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  width: 34px;
}
</style>
