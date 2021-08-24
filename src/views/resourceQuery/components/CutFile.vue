<template lang="html">
  <div>
    <div class="tab panel-btn" id="openBtn" @click="openPanel()">
          <div>切分内容</div>
        <div class="arrow"></div>
    </div>
    <el-card class="box-card right">
      <div class="panel-btn" id="closeBtn" @click="closePanel()">
        <i class="el-icon-d-arrow-right"></i>
      </div>
      <div class="container"
            v-loading="File_Uploading"
            element-loading-text="加载中，请等待..."
            element-loading-spinner="el-icon-loading">
          <el-row
            v-if="Paper_Content.length!=0"
            style="height: 30px; padding-top: 15px; padding-bottom: 15px; cursor: pointer;position:relative">
              <div style="position:absolute;top:25px;right:-5px;z-index:2003">
                <i class="el-icon-search"
                  @click="search(-1)"
                  style="color:#5e616d;font-size:22px;font-weight:700"></i>
              </div>
          </el-row>
          <el-row
            v-for="(Item, Item_Index) in Paper_Content"
            :key="'Line_' + Item_Index">
              <el-col>
                <el-row
                  v-if="Item == 'DIVIDER_LINES'"
                  style="height: 30px; padding-top: 15px; padding-bottom: 15px; cursor: pointer;position:relative">
                  <div style="position:absolute;top:35px;right:-5px;z-index:2003">
                    <i class="el-icon-search"
                      @click="search(Item_Index)"
                      style="color:#5e616d;font-size:22px;font-weight:700"></i>
                  </div>
                  <el-col>
                    <el-row
                      @click.native="Delete_Divider(Item_Index)"
                      @mouseenter.native="Paper_Divider_Index = Item_Index"
                      @mouseleave.native="Paper_Divider_Index = -1"
                      :style="'border-top: 2px dashed ' + (Paper_Divider_Index == Item_Index ? 'red' : '#ccc') + '; width: 100%;'"></el-row>
                  </el-col>
                </el-row>
                <el-row :id ="'Item_'+Item_Index" v-if="Item != 'DIVIDER_LINES'&& Item.para_type == '0'" :style="Item.para_style">
                  <span
                    v-for="(message, index_i) in Item.runs"
                    :key="'Line_' + Item_Index + '_' + index_i + '_run'"
                    :style="message.run_style"
                  >
                    <span
                      v-if="message.run_type == '0'"
                      v-html="message.run_text"
                    ></span>
                    <img
                      v-else-if="message.run_type == '1'"
                      :src="Paper_Image_Dict[message.image.src]"
                      :width="message.image.width"
                      :height="message.image.height"
                      :style="message.image.style"
                      :alt="message.image.alt"
                    />
                  </span>
                </el-row>
                <el-row :id ="'Item_'+Item_Index" v-if="Item != 'DIVIDER_LINES' && Item.para_type == '1'">
                  <div :style="Item.para_style">
                    <span v-html="Table_Img_Get(Item.table_raw_html)"></span>
                  </div>
                </el-row>
                <el-row
                  :id ="'Item_'+Item_Index"
                  v-if="Item != 'DIVIDER_LINES' && Item_Index != Paper_Content.length - 1 && Paper_Content[Item_Index + 1] != 'DIVIDER_LINES'"
                  style="height: 14px; width: 100%; padding-top: 6px; cursor: pointer;"
                  @click.native="Add_Divider(Item_Index)"
                  @mouseenter.native="Paper_Divider_Index = Item_Index"
                  @mouseleave.native="Paper_Divider_Index = -1">
                  <el-col>
                    <el-row v-show="Paper_Divider_Index == Item_Index" style="border-top: 2px dashed #409EFF; width: 100%;"></el-row>
                  </el-col>
                </el-row>
              </el-col>
          </el-row>
        </div>
      <div ref="searchQues" id="searchQues"></div>
    </el-card>
  </div>
</template>

<script>
import $ from 'jquery'
// import FileSaver from "file-saver";
import html2canvas from "html2canvas"

// import OptionQuestions from '../../resourceInput/components/OptionQuestions.vue'
// import FillQuestions from "../../resourceInput/components/FillQuestions.vue"
// import AnswerQuestions from "../../resourceInput/components/AnswerQuestions.vue";
// import Instruction from '../../resourceInput/components/InstructionPaper.vue'
// import SearchResult from "./components/SearchResult.vue";
// import DatabaseList from "./components/DatabaseList.vue";

// import Mathdown from "@/common/components/Mathdown.vue";
// import ComplexInput from '@/common/components/ComplexInput.vue'
// import pdf from './components/pdf';

// import {commonAjax} from '@/common/utils/ajax'
export default {
  data() {
    return {
      // 将要添加的题包类型
      Add_Bundle_Type: "单选题",
      // 正在使用的组件
      Using_Part: "Input",
      // 试卷标题
      Title: "",
      // 用于显示最终录入科目的变量
      Subject: "数学",
      // 用于显示最终录入学段的变量
      Period: "高中",
      // 用于确定当前显示的题目类型的变量
      // 之后会用来给录入或编辑做定位
      Type: "单选题",

      Question_Bundle: [],
      // 拖拽的题包坐标列表
      Draging_Questions_Rect: [],
      // 拖拽的题包题目类型
      Draging_Questions_Index: -1,
      // 拖拽的题目坐标
      Draging_Questions_Position: {
        x: 0,
        y: 0
      },
      // 正在聚焦的题目坐标，实际上准备靠这个认题目
      Focusing_Questions_Position: {
        x: 0,
        y: 0
      },
      // 正在聚焦的题包序号
      Focusing_Index: -1,
      // 如果点击导入，那么默认进入的是编辑模式
      // 此时Editing_Position 的 格式是【题包序号 题目在题包中的序号】
      // 如果类型改变，那么这个值将被还原成空字符串
      // 如果类型不改变，则询问是替换还是新加，如果是新加，那么将其重置为空字符串
      // 如果是替换，则切分并读取信息，进行替换工作
      Editing_Position: "",
      // 老东西，Check_Do用到的过滤列表
      // 用于输入符号提示的部分
      en_pun_list: [',','.','?','!',':',';','\'','"','(',')','&nbsp','_','/','|','\\','<','>'],
      ch_pun_list: ['，','。','！','？','：','；','‘','’','“','”','（','）','&nbsp','、','《','》'],
      math_pun_list: ['+', '-', "*", "/", "%", "="],
      // 用于展示哪些字符需要修改的对话框
      Wrong_Char_Dialog: false,
      // 用于展示错误数据的信息栏
      Wrong_Char_Info: "",
      // 保存用户的UUID信息
      UUID: "",
      // 刷新变量
      Refresh: false,
      // 第二次尝试，定位不同题包
      Multi_Type_Insert: false,
      // 选择用的列表
      Multi_Info: [],
      // 用于给多题包定位时进行等待
      Waiting_Question: {},
      // 跳跃变量
      Jumping: "",
      // 获取文件的组件
      File_Selector: "",
      // 文件名称
      File_Name: "",
      // 用于存放拿来显示的变量
      Paper_Content: [],
      // 用来进行初始结果的备份
      Paper_Content_BackUp: [],
      // 存放拿来进行显示的图片
      Paper_Image_Dict: {

      },
      // 标记切分点的变量
      Paper_Divider_Index: -1,
      // 是否正在等待文件切分完成
      File_Uploading: false
      // File_Uploading: true
    };
  },
  components:{
    // ComplexInput,
                // OptionQuestions,
                // FillQuestions,
                // AnswerQuestions,
                // SearchResult,
                // Mathdown,
                // Instruction,
                // DatabaseList,
                // pdf
  },
  watch: {
    default_subject: function() {
      this.deleteAllCard();
    },
    paper_type(newVal, oldVal){
      if(newVal != oldVal){
        this.Clear();
        this.fileName = "";
        this.mathPaperName = "";
        this.mathAnswerName = "";
        this.paper_type = newVal;
        this.downloadPaperName = "",
        this.downloadAnswerName = ""
        this.pdfURL=""
        if (this.$refs.searchRes) {
          this.$refs.searchRes.handleResData({results:[]});
        }
      }
    },
    math_input(newVal, oldVal){
      if(newVal != oldVal){
        this.Clear();
        this.fileName = "";
        this.mathPaperName = "";
        this.mathAnswerName = "";
        this.math_input = newVal;
        this.downloadPaperName = "",
        this.downloadAnswerName = ""
      }
    },
  },
  mounted(){
    // this.ToTop();
  },
  methods:{
    // 外面点一下重置题目聚焦
    openPanel() {
      $('.box-card.right').animate({
        right: '0%',
        opacity: 1
      },'easeInOutExpo')
      $('#openBtn').hide()
      $('#closeBtn').show()
    },
    closePanel(){
      $('.box-card.right').animate({
        right: '-50%',
        opacity: 0,
      }, 'easeInOutExpo')
      $('#openBtn').show()
      $('#closeBtn').hide()
    },
    uploadAndCut(formData, config) {
      this.openPanel()
      this.Paper_Content=[]
      this.File_Uploading=true;
      this.$http
        .post("https://file-upload-backend-88-production.env.bdaa.pro/v1/paperProcessing/upload", formData, config)
        .then(function(data) {
          this.Paper_Content = data.data.paper
          this.Paper_Image_Dict = data.data.image_dict
          let Lists = []
          for(let i = 0; i < data.data.paper.length; i++){
            let Para = data.data.paper[i].sub_para[0]
            for(let j = 0; j < Para.length; j++){
              Lists.push(Para[j])
            }
            if(i != data.data.paper.length - 1){
              Lists.push("DIVIDER_LINES")
            }
          }
          this.Paper_Content = Lists
          this.Paper_Content_BackUp = Lists
        }).catch(() => {
          this.$alert("切分过程出现错误，这可能是由于服务器原因导致目前暂时无法提供服务，请重新提交文件或稍后再试。", "提示")
        }).finally(()=>{
          this.File_Uploading=false;
        });
    },
    // 替换表格中的图片内容
    // 更新表格中的图片文件
    Table_Img_Get(Table_Html){
      for(var key in this.Paper_Image_Dict){
        var Img_Name_Catcher = new RegExp('<img src="' + key + '"')
        if(Img_Name_Catcher.exec(Table_Html) != null){
          Table_Html = Table_Html.replace(Img_Name_Catcher,'<img src="' + this.json_content.img[key] + '"')
        }
      }
      return Table_Html
    },
    Add_Divider(Item_Index){
      this.Paper_Content.splice(Item_Index + 1, 0, 'DIVIDER_LINES')
      this.Paper_Divider_Index = -1;
    },
    // 尝试添加和删除切分线
    Delete_Divider(Item_Index){
      this.Paper_Content.splice(Item_Index, 1)
      this.Paper_Divider_Index = -1;
    },
    search(Item_Index){
      let html="<div>"
      for (var i = Item_Index+1; i < this.Paper_Content.length; i++) {
        if (this.Paper_Content[i]=='DIVIDER_LINES') {
          break;
        }
        html+=$('#Item_'+i).html()
        html+="<br>"
      }

      html+="</div>"
      $('#searchQues').html(html)
      this.$nextTick(()=>{
        html2canvas(this.$refs.searchQues).then(canvas => {
          // 转成图片，生成图片地址
          $('#searchQues').html("")
          this.$emit('search',canvas.toDataURL("image/png"))
        });
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width:100%;
  flex-flow: column;
  overflow-y: scroll;
  height: 80vh;
  // padding-top: 20px;
  // padding-right: 2vw;
  // border: 3px solid #409EFF;
  border-radius: 15px;
}
.box-card {
    position: fixed;
    top:90px;
    background: rgba(248,251, 255, .9);
    width: 37.5%;
    height: 85vh;
    right: -3%;
    z-index: 2001;
    opacity:0;
}
.panel-btn{
  font-size: 30px;
  font-weight:bold;
  color: #bbb;
}
#openBtn{
  z-index:2002;
  top:90px;
}
#closeBtn{
  position: absolute;
  top:0;
  left:0;
}
.tab
{
    position: fixed;
    right:0;
    top:90px;
    width: 30px;
    height: 95px;
    border-radius: 10px 0px 0px 10px;
    background-color: #eef1f7;
    cursor:default;
    div{
      width: 16px;
      margin: 8px auto;
      line-height: 21px;
      font-size: 16px;
      color: #909194;
    }
    .arrow
    {
      border-color: #eef1f7 #eef1f7 transparent transparent;
      border-style: solid;
      border-width: 15px 15px 15px 15px;
      height:0;
      width:0;
      position:absolute;
      bottom:-23px;
    }
}
</style>
