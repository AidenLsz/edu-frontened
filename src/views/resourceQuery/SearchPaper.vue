<template>
  <div
    class="exercise"
    style="margin-bottom: 40px; padding-top: 10px"
    v-loading="Question_Analysing"
    element-loading-text="正在加载，请稍后..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(211, 211, 211, 0.4)">
    <el-dialog
      :visible.sync="picSearchDialogShow"
      title="图片检索"
      width="80%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @close="Reset_Interval()">
        <el-row type="flex" justify="start" style="margin-left: 2.4vw;">
          <label style="margin-right: 3vw; margin-top: -0.3vh;">图片检索模式：</label>
          <el-radio-group v-model="Img_Search_Type">
            <el-radio :label="0" disabled>图例检索</el-radio>
            <el-radio :label="1">内容识别</el-radio>
          </el-radio-group>
        </el-row>
        <el-row style="margin: 0px; padding: 0px">
          <el-col :span="24">
            <el-row v-if="option.img != ''" type="flex" justify="center">
              <VueCropper
                style="width: 100%; height: 400px; margin-left: 2.4vw; margin-right: 2.4vw"
                ref="cropper"
                :img="option.img"
                :autoCrop="option.autoCrop"
                :canMove="option.canMove"
                :centerBox="option.centerBox"
                :canScale="option.canScale"
                autoCropWidth="4096"
                autoCropHeight="2048"
              ></VueCropper>
            </el-row>
            <el-row v-else id="DragItem" type="flex" justify="center">
              <div class="btn_file" style="min-height: 400px">
                <div style="display: inline-block">
                  <i class="el-icon-plus" style="margin: 125px auto 20px auto; font-size: 60px"></i>
                  <p style="font-size: 20px">点击区域或拖拽图片入内以上传</p>
                </div>
                <input
                  class="inputSp"
                  type="file"
                  @change="pictureSearch($event)"
                  accept=".jpeg, .png, .jpg"
                  ref="picSearchInput"
                  />
              </div>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 30px;">
              <el-col :span="4" :offset="4">
                <el-row type="flex" justify="center">
                  <el-button
                    type="primary"
                    icon="el-icon-refresh-left"
                    @click="rotateLeft()"
                    plain>
                    向左旋转
                  </el-button>
                </el-row>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="center">
                  <el-button
                    type="primary"
                    icon="el-icon-refresh-right"
                    @click="rotateRight()"
                    plain>
                    向右旋转
                  </el-button>
                </el-row>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="center">
                  <el-button
                    type="warning"
                    icon="el-icon-delete"
                    @click="clearData()"
                    plain>
                    清空内容
                  </el-button>
                </el-row>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="center">
                  <el-button
                    v-if="option.img != ''"
                    type="success"
                    icon="el-icon-search"
                    @click="getCropData()"
                    plain>
                    提交搜索
                  </el-button>
                  <el-button
                    v-else
                    type="danger"
                    icon="el-icon-close"
                    @click="Reset_Interval()"
                    plain>
                    关闭页面
                  </el-button>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

    </el-dialog>
    <el-dialog
        :visible.sync="simpleInput"
        title="LUNA输入助手"
        width="65%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
      <ComplexInput @New_Content="Update_Complex_Input" :Get_Out_Content="content"></ComplexInput>
    </el-dialog>
    <!-- 地址框 -->
    <el-row justify="start" type="flex">
      <el-col :span="7" style="margin-left: 5vw;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>试卷检索
            <span @click="openInstructionDialog" style="cursor:pointer;">
            <i class="el-icon-question"></i>
          </span></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <instruction
      ref="instruction"
    />
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
          <el-button type="text" style="font-size: 22px; display: block; margin-left: -8px" size="small" @click="Open_Pic_Search()">
            <i class="el-icon-camera-solid"></i>
          </el-button>
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
      v-for="(Paper, Paper_Index) in Paper_Ques_List"
      :key="Paper_Index"
      style="margin-bottom: 70px;"
      >
      <el-row type="flex" justify="start" style="margin-left: 5vw;; padding-left: 16px; font-size: 16px">
        <label>{{Paper_Title_List[Paper_Index]}}</label>
      </el-row>
      <el-row type="flex" justify="start" style="margin-left: 5vw;; padding-left: 16px; font-size: 16px">
        <span>所包含的相似试题为：</span>
      </el-row>
      <el-row>
        <el-col :span="17" class="quesCard">
          <el-row style="text-align: left; padding-left: 30px; padding-top: 15px; background: white; padding-bottom: 15px">
            <el-col style="padding-bottom: 15px" >
              <Mathdown :content="Paper_Ques_List[Paper_Index].stem" :name="'P_' + Paper_Index + '_Stem'"></Mathdown>
            </el-col>
            <el-col v-for="(Option, Option_Index) in Paper_Ques_List[Paper_Index].options" :key="'Option_'+ Option_Index + '_Of_' + Paper_Index">
              <el-row style="line-height: 40px" type="flex" justify="start"><span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span><Mathdown style="width:700px" :content="Option" :name="'Q_' + Paper_Index + '_Option_' + Option_Index"></Mathdown></el-row>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 15px">
              <el-col :span="5" style="line-height: 40px; color: #888; font-size: 1.5rem; padding-left: 30px; text-align: left">
                所属题库：{{Paper_Ques_List[Paper_Index].database}}
              </el-col>
              <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem">
                学科：{{Paper_Ques_List[Paper_Index].subject}}
              </el-col>
              <el-col :span="4" style="line-height: 40px; color: #888; font-size: 1.5rem; display: none">
                题型：{{Paper_Ques_List[Paper_Index].type}}
              </el-col>
              <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem">
                学段：{{Paper_Ques_List[Paper_Index].period}}
              </el-col>
              <el-col :span="4" :offset="2" style="line-height: 40px">
                <el-button size="medium" plain round type="primary" @click="Paper_Detail_Show(Paper_Index)">试卷详情</el-button>
              </el-col>
              <el-col :span="3" :offset="1" style="line-height: 40px">
                <el-button size="medium" plain round type="primary" @click="Check_Analyse(Paper_ID_List[Paper_Index], Paper_Ques_List[Paper_Index].database)">查看分析报告</el-button>
              </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
    <el-row
      v-if="Paper_Ques_List.length == 0"
      style="margin: 50px 60px; height: 44vh; font-size: 30px"
      v-loading="loading"
      element-loading-text="查询中，请等待"
      element-loading-spinner="el-icon-loading">

    </el-row>
    <el-row v-if="Paper_Ques_List.length != 0">
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
import Instruction from './components/InstructionExercise.vue'

import {commonAjax} from '@/common/utils/ajax'
import {LRStrip} from '@/common/utils/strip'

export default {
  components: { Mathdown, ComplexInput, QuestionAnalyse,Instruction },
  name: "SearchPaper",
  data() {
    return {
      // 用于之后进行图片搜索类型筛选的变量
      Img_Search_Type: 1,
      // 图片剪切用的一系列变量
      // 对话框显示
      picSearchDialogShow: false,
      option: {
        img: "", // 裁剪图片的地址
        autoCrop: true, //是否默认生成截图框
        fixedBox: true, //固定截图框大小 不允许改变
        canMove: false,
        centerBox: true,
        canScale: false
      },
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
      Paper_Ques_List: [],
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
      // 试卷的ID和标题组
      Paper_ID_List: [],
      Paper_Title_List: [],
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
      // 暂时获得了分析报告的试卷ID
      Paper_Cache_ID: ""
    };
  },
  watch:{
    sour(val) {
      this.submit();
    },
  },
  destroyed(){
    sessionStorage.removeItem(PaperDetailShow);
    sessionStorage.removeItem("PicPaste");
    clearInterval(this.Paste_Catcher);
    window.removeEventListener('paste', this.Paste_Function)
  },
  mounted(){
    this.ToTop()
    this.initDatabaseList();
    let upload = document.querySelector('#DragItem');
    upload.addEventListener('dragenter', this.onDragIn, true);
    upload.addEventListener('dragleave', this.onDragOut, true);
    upload.addEventListener('drop', this.onDrop, false);
  },
  methods: {
    // 清空计时器
    Reset_Interval(){
      clearInterval(this.Paste_Catcher)
      this.picSearchDialogShow = false
      window.removeEventListener('paste', this.Paste_Function)
    },
    // 打开图片搜索栏
    Open_Pic_Search(){
      this.Init_Img_Paster();
      this.Paste_Catcher = setInterval(()=>{
        if(sessionStorage.getItem("PicPaste")){
          this.option.img = sessionStorage.getItem("PicPaste")
        }
      }
      , 20);
      this.picSearchDialogShow = true
    },
    // 尝试利用截图工具的粘贴板
    Init_Img_Paster(){
      window.addEventListener('paste', this.Paste_Function)
    },
    Paste_Function(e){
        let Pic = e.clipboardData.items[0].getAsFile();
        // 保存读取内容用的临时变量
        var Picresult = "";
        // Promise方法避免异步操作
        var promise = new Promise(function(resolve){
          // 用文件读取来读取图片的base64格式代码
          var reader = new FileReader();
          reader.readAsDataURL(Pic);
          reader.onloadend = function (e) {
            Picresult = e.target.result;
            resolve('1');
          };
        });
        promise.then(function(){
          // 用捕捉到的this对象来进行搜索
          sessionStorage.setItem("PicPaste", Picresult)
        }).catch(function(err){
          // 报错了就打印错误
          alert("您最新的粘贴对象不是图片内容。")
        })
      },
        openInstructionDialog(){
          this.$refs.instruction.openDialog();
        },
        clearData(){
          sessionStorage.setItem("PicPaste", "");
          this.option.img = "";
        },
        onDragIn (e) {
          e.stopPropagation();
          e.preventDefault();
        },
        onDragOut (e) {
          e.stopPropagation();
          e.preventDefault();
        },
        onDrop (e) {
          e.stopPropagation();
          e.preventDefault();
          this.imgPreview(e.dataTransfer.files);
          this.$refs.picSearchInput.value = "";
          this.$refs.cropper.refresh();
        },
        //图片预览
        imgPreview (files) {
          const _this = this;
          let read = new FileReader();
          read.readAsDataURL(files[0]);
          read.onloadend = function () {
            _this.show = true
            _this.option.img = read.result;
          }
        },
        // 左旋转
        rotateLeft() {
          this.$refs.cropper.rotateLeft();
        },
        // 右旋转
        rotateRight() {
          this.$refs.cropper.rotateRight();
        },
        // 生成blob图片
        getCropData() {
          this.$refs.cropper.getCropData((data) => {
              this.submit(1, data);
              this.picSearchDialogShow = false;
          })
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
        var promise = new Promise(function(resolve){
          // 用文件读取来读取图片的base64格式代码
          var reader = new FileReader();
          reader.readAsDataURL(Pic);
          reader.onloadend = function (e) {
            Picresult = e.target.result;
            resolve('1');
          };
        });
        promise.then(function(){
          // 用捕捉到的this对象来进行搜索
          _this.option.img = Picresult;
        }).catch(function(error){
          // 报错了就打印错误
          // console.log(error)
        })

      }else{
        return
      }
    },
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
    // 查看试卷分析报告
    Check_Analyse(ID, DatabaseName){

      if(this.Paper_Cache_ID == ID && sessionStorage.getItem("PaperDetailShow")){
        let Temp = JSON.parse(sessionStorage.PaperDetailShow);
        sessionStorage.PaperJson = JSON.stringify(Temp);
        let routeData = this.$router.resolve({ path: '/paperAnalyse' });
        window.open(routeData.href, '_blank');
        this.$message.success("试题详情内容已在新页面展开。");
        return
      }

      this.Question_Analysing = true;

      commonAjax(this.backendIP+'/api/paperJsonGet',
        {
          Database_Name: "LUNA",
          Paper_ID:ID
        }
      ).then((data)=>{
        this.Question_Analysing = false;
        if(data.Paper_Json.status == "FAIL"){
          this.$message.error("服务器繁忙，请稍后再试。")
          return
        }
        this.Paper_Cache_ID = ID;
        sessionStorage.PaperDetailShow = JSON.stringify(data.Paper_Json);
        sessionStorage.PaperJson = JSON.stringify(data.Paper_Json);
        let routeData = this.$router.resolve({ path: '/paperAnalyse' });
        window.open(routeData.href, '_blank');
        this.$message.success("试题详情内容已在新页面展开。");
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
      if(Page_Index * 5 > this.Paper_Ques_List.length){
        return this.Paper_Ques_List.slice((Page_Index - 1)*5)
      }else {
        return this.Paper_Ques_List.slice((Page_Index - 1)*5, Page_Index * 5)
      }
    },
    // 修改当前展示的试题的内容
    Paper_Detail_Show(Index){

      this.Question_Analysing = true;

      if(this.Paper_Cache_ID == this.Paper_ID_List[Index]){
        let routeData = this.$router.resolve({ path: '/paperDetailShow' });
        window.open(routeData.href, '_blank');
        this.$message.success("试题详情内容已在新页面展开。");
        this.Question_Analysing = false;
        return
      }

      commonAjax(this.backendIP+'/api/paperJsonGet',
        {
          Database_Name: "LUNA",
          Paper_ID:this.Paper_ID_List[Index]
        }
      ).then((data)=>{
        this.Question_Analysing = false;
        if(data.Paper_Json.status == "FAIL"){
          this.$message.error("服务器繁忙，请稍后再试。")
          return
        }
        this.Paper_Cache_ID = this.Paper_ID_List[Index];
        if(sessionStorage.getItem("PaperDetailShow")){
          sessionStorage.removeItem("PaperDetailShow");
        }
        sessionStorage.PaperDetailShow = JSON.stringify(data.Paper_Json)
        let routeData = this.$router.resolve({ path: '/paperDetailShow' });
        window.open(routeData.href, '_blank');
        this.$message.success("试题详情内容已在新页面展开。");
      })


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
    Update_Complex_Input(val){
      this.simpleInput = false
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

      let Striped_Content = LRStrip(this.content)
      if(Striped_Content == ""){
          this.$message.info("请输入内容")
          this.content = ""
          return
      }else{
          this.content = Striped_Content
      }

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

      this.Paper_Ques_List = [];

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
      //   this.Paper_ID_List = [];
      //   this.Paper_Ques_List = [];
      //   var quess = data.data.results;
      //   for(var i = 0; i < quess.length; i++){
      //     this.Paper_Ques_List.push(quess[i])
      //     this.Paper_ID_List.push(false);
      //   }
      //   this.Total_Count = data.data.totalLength
      //
      // });
      commonAjax(this.backendIP+'/api/search_paper',param)
      .then((data)=>{
        this.loading = false;
        this.Paper_ID_List = [];
        this.Paper_Ques_List = [];
        this.Paper_Title_List = [];
        var ID_List = data.paper_id_list;
        for(var i = 0; i < ID_List.length; i++){
          this.Paper_ID_List.push(ID_List[i]);
          this.Paper_Ques_List.push(data.question_list[i]);
          this.Paper_Title_List.push(data.paper_title_list[i]);
        }
        this.Total_Count = data.totalLength
      }).catch((err)=>{
        this.$message.error("服务器繁忙，请稍后再试。")
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
::v-deep.dev-md-content{
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
#tabs ::v-deep .el-tabs__item {
  color: #36a9df;
  font-weight: 900;
  border-radius: 10px;
  border-color: #36a9df;
}
#tabs ::v-deep .el-tabs__nav.is-top{
  border: none;
}
#tabs ::v-deep .el-tabs__header.is-top{
  border: none;
}
#tabs ::v-deep .el-tabs__item.is-active {
  background-color: #36a9df;
  color: #fff;
  font-weight: 900;
  border-color: #36a9df;
}
#tag ::v-deep .el-tag {
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
.SearchInput ::v-deep .el-input__inner {
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
.el-pagination {
    text-align: center;
}
</style>
<style scoped>
.pic {
  width: 600px;
  height: 400px;
  object-fit: cover;
}
.btn {
  display: flex;
  flex-direction: column;
}
.btn button {
  margin: 10px 0;
}
.btn_file {
  position: relative;
  min-height: 400px;
  width: 94%;
  background-color: #F8FBFF;
  border-radius: 20px;
  cursor: pointer;
}
.inputSp {
  position: absolute;
  top: 0;
  right: 0;
  height: 400px;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}
</style>
