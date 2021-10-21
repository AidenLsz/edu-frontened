<template>
  <div
      style="padding-top: 5vh; padding-left: 5vw; padding-right: 5vw ;height:100px"
      v-loading="File_Uploading"
      element-loading-text="加载中，请等待..."
      element-loading-spinner="el-icon-loading">

    <el-row justify="start" type="flex">
      <el-col :span="6">
        <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; padding-top: 13px">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>标注管理平台</el-breadcrumb-item>
          </el-breadcrumb>
        </el-row>
      </el-col>
    </el-row>
    <p class="title" style="margin-left: 10px;">试题切分标注</p>


    <div class="upload_box">

      <el-upload :action="Submit">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip"></div>
      </el-upload>
    </div>


    <el-row justify="start" style="margin-top: 92px; margin-left: 10px; z-index: 30">
      <el-col :span="12" @click.native="Reset_Focus()" >
        <!-- 学科选择 -->
        <el-row type="flex" justify="start" style="margin-bottom: 2vh">
          <el-col :span="2">
            <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
              <label>科目</label>
            </el-row>
          </el-col>
          <el-col :span="20" :offset="1">
            <el-row type="flex" justify="start">
              <el-select v-model="Subject" placeholder="请选择科目">
                <el-option
                    v-for="item in Subject_List"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-row>
          </el-col>
        </el-row>
        <!-- 学段选择 -->
        <el-row type="flex" justify="start" style="margin-top: 2vh; margin-bottom: 2vh">
          <el-col :span="2">
            <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
              <label>学段</label>
            </el-row>
          </el-col>
          <el-col :span="20" :offset="1">
            <el-row type="flex" justify="start">
              <el-select v-model="Period" placeholder="请选择学段">
                <el-option
                    v-for="item in Period_List"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-row>
          </el-col>
        </el-row>
        <!-- 学段选择 -->
        <el-row type="flex" justify="start" style="margin-top: 2vh; margin-bottom: 2vh">
          <el-col :span="2">
            <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
              <label>标题</label>
            </el-row>
          </el-col>
          <el-col :span="20" :offset="1">
            <el-row type="flex" justify="start" style="width: 100%">
              <el-input v-model="Title" placeholder="请输入试卷的标题信息"></el-input>
            </el-row>
          </el-col>
        </el-row>
        <!-- 学段选择 -->
        <el-row type="flex" justify="start" style="margin-top: 7vh; margin-bottom: -1vh; margin-left: 12vh;">
<!--          <el-col :span="4">-->
<!--            <el-row type="flex" justify="start">-->
<!--              <el-button type="primary" style="width: 100px;" @click="Submit()">切分试卷</el-button>-->
<!--            </el-row>-->
<!--          </el-col>-->
          <el-col :span="4">
            <el-row type="flex" justify="start">
              <input type="file" accept=".doc, .docx" id="fileSelect" :multiple="false" style="display: none">
              <el-button type="primary" style="width: 100px;" @click="File_Import()">文件导入</el-button>
            </el-row>
          </el-col>

          <el-col :span="1" v-show="File_Name != ''">
            <el-row type="flex" justify="start">
              <el-button type="text" @click="Paper_Data_Clear()" style="margin: 0px; padding: 10px"><i class="el-icon-close" style="font-size: 20px;"></i></el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <div
        v-show="Using_Part == 'Fileinput'"
        @click="Reset_Focus()"
        style="position:absolute;z-index: 40;padding-left: 2vw; min-height: 100vh; padding-top: 10px; padding-right: 2vw; border: 3px solid #409EFF; border-radius: 15px; margin-top: 150px; margin-bottom: 30px; width:792px;">
      <div style=" min-height: 90vh; ">
        <el-row
            v-for="(Item, Item_Index) in Paper_Content"

            :key="'Line_' + Item_Index">
          <el-col >

            <el-row v-if="Item != 'DIVIDER_LINES'&& Item.para_type == '0'" :style="Item.para_style">
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
            <el-row v-if="Item != 'DIVIDER_LINES' && Item.para_type == '1'">
              <div :style="Item.para_style">
                <span v-html="Table_Img_Get(Item.table_raw_html)"></span>
              </div>
            </el-row>
            <el-row
                v-if="Item == 'DIVIDER_LINES'"
                style="height: 30px; padding-top: 15px; padding-bottom: 15px; cursor: pointer"
                @click.native="Delete_Divider(Item_Index)"
                @mouseenter.native="Paper_Divider_Index = Item_Index"
                @mouseleave.native="Paper_Divider_Index = -1">
              <el-col>
                <el-row :style="'border-top: 2px dashed ' + (Paper_Divider_Index == Item_Index ? 'red' : '#ccc') + '; width: 100%;'"></el-row>
              </el-col>
            </el-row>
            <el-row
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
      <el-row type="flex" justify="end" style="padding-right: 30px; margin-top: 30px; margin-bottom: 30px;">
        <el-button type="primary" icon="el-icon-refresh" @click="Paper_Data_Reset()" style="margin-right: 20px">重置试卷数据</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="Paper_Data_Clear()" style="margin-right: 20px">清空当前数据</el-button>
        <el-button type="primary" icon="el-icon-check" @click="Divider_Final_Check()">切分确认</el-button>
      </el-row>
    </div>
<!--    <div class="background_color"></div>-->
    <div class="user_label" v-show="Using_Part == 'Fileinput'" >
    <el-table
        :data="question_list"
        style="height: 3553px"
        :row-style="{height: '30px'}"
    >
      <el-table-column
          prop="question_id"
          label="题号"
          style="width: 72px"

      >
      </el-table-column>
      <el-table-column label="题目类型" prop="type" style="width: 248px">
        <template slot-scope="scope">
          <el-select
              v-model="scope.row.type"
              multiple
              placeholder="请选择题目类型"
          >
            <el-option
                v-for="item in questiontype"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
            <!-- 分割线 -->
          </el-select>
        </template>
      </el-table-column>
    </el-table>
      <el-row type="flex" justify="end" style="padding-right: 30px; margin-top: 30px; margin-bottom: 30px;">
        <el-button type="primary" icon="el-icon-refresh" @click="Paper_Data_Reset()" style="margin-right: 20px">重置</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="Paper_Data_Clear()" style="margin-right: 20px">清空</el-button>
        <el-button type="primary" icon="el-icon-check" @click="Divider_Final_Check()">切分确认</el-button>
      </el-row>

    </div>
    </div>


</template>

<script>



import {commonAjax} from '@/common/utils/ajax'

export default {
  name: "inputPaper",

  data() {
    return {
      papertext:[],
      question_list:[
      ],
      papermanualdivide_list:[],
      questiontype:[
        {
          "value":0,
          "label":"其它"
        },{
          "value":1,
          "label":"多选题"
        },{
          "value":2,
          "label":"填空题"
        },{
          "value":3,
          "label":"判断题"
        },{
          "value":4,
          "label":"简答题"
        },{
          "value":5,
          "label":"计算题"
        },{
          "value":6,
          "label":"综合题"
        }
      ],
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
      // 待选科目
      Subject_List: [
        { value: "语文", label: "语文" },
        { value: "数学", label: "数学" },
        { value: "英语", label: "英语" },
        { value: "历史", label: "历史" },
        { value: "政治", label: "政治" },
        { value: "地理", label: "地理" },
        { value: "物理", label: "物理" },
        { value: "化学", label: "化学" },
        { value: "生物", label: "生物" },
        { value: "其他", label: "其他" }
      ],
      // 待选学段
      Period_List: [
        { value: 5, label: "小学" },
        { value: 1, label: "初中" },
        { value: 2, label: "高中" },
        { value: 3, label: "大学" },
        { value: 4, label: "成人" },
        { value: 0, label: "其他" }
      ],
      // 待选试题类型
      Type_List: [
        { value: "单选题", label: "单选题" },
        { value: "多选题", label: "多选题" },
        { value: "判断题", label: "判断题" },
        { value: "填空题", label: "填空题" },
        { value: "简答题", label: "简答题" },
        { value: "计算题", label: "计算题" },
        { value: "综合题", label: "综合题" }
      ],
      Question_Bundle: [],
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
    };
  },
  mounted(){
    if(!this.$store.state.user.name || this.$store.state.user.name.length == 0){
      this.$message.error("您尚未登录，请登录后使用录入功能。")
      this.$router.push("/")
      return
    }
    this.Get_User_UUID();
    this.Init_File_Selector();
  },
  methods:{
    // 清空试卷数据
    Paper_Data_Clear(){
      this.$confirm('您点击了清空当前试卷切分内容的按钮，当前的切分结果将被清空，您将需要重新导入其他试卷，确定要清空吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.File_Name = ""
        this.File_Uploading = false
        this.Paper_Content = []
        this.Paper_Image_Dict = {}
        this.Paper_Divider_Index = -1;
      }).catch(()=>{
        this.$message.info("已取消")
      })
    },
    // 重置
    Paper_Data_Reset(){
      this.$confirm('您点击了重置当前试卷切分内容的按钮，当前的切分结果将被重置为当前试卷最开始的切分结果，确定要重置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.Paper_Content = JSON.parse(JSON.stringify(this.Paper_Content_BackUp));
        this.Paper_Divider_Index = -1;
      }).catch(()=>{
        this.$message.info("已取消")
      })
    },
    // 调整功能选择
    Change_Using_Part(Part){
      if(Part != 'Fileinput'){
        if(this.Paper_Content.length == 0){
          this.Using_Part = Part
        }else{
          this.$message.warning("您正在使用文件导入功能，确认完成或清空内容后才可切换当前操作模块。")
        }
      }else{
        this.Using_Part = Part
      }
    },
    // 将切分后的内容整理成导出格式
    Divider_Final_Check(){
    // * papertext: string list, 试卷的每一行文本，每个元素代表一行文本(按'\n'划分不同行，不保留'\n')，图片和表格保留html标签，图片用base64表示，其余内容仅保留纯文本
    //   * papermanualdivide_list: json string, 人工标注的试题列表，每个元素是一道试题，包含
    //   * question_num: int, 标识试题是试卷中的第几道试题, 从1开始
    //   * start_line: int, 试题开始行号, 行号从1开始, 包括开始行
    //   * end_line: int, 试题结束行号, 行号从1开始, 包括结束行
    //   * type: int, 题型

      let Reg_C = new RegExp('&#xa0;', 'g')

      let Out_JSON = []
      let ID = 0
      let Item = {
        id: ID,
        subject: "语文",
        period: this.Period,
        content: []
      }
      var start = false;
      let question={
        'question_num':0,
        'start_line':1,
        'end_line':1,
        'type':0,
      };
      var question_count=0;
      for(let i = 0;i< this.Paper_Content.length;i++){
        if(this.Paper_Content[i]!="DIVIDER_LINES")
          this.papertext.push(this.Paper_Content[i]['para_text']);
        else{
          if(start==false){
            question['question_num']=1;
            question['type']=this.question_list[0]['type']
            this.papermanualdivide_list.push(question)
          }
          else{
            this.papermanualdivide_list[question_count-1]['end_line']=i;
            if(i!=this.Paper_Content.length-1) {
              question['question_num'] = question_count + 1;
              question['start_line'] = i + 1;
              question['type'] = this.question_list[0]['type']
              this.papermanualdivide_list.push(question);
            }
          }
          question_count=question_count+1;
        }
      }
      for(let i = 0; i < this.Paper_Content.length; i++){
        if(this.Paper_Content[i] == "DIVIDER_LINES"){
          // 每次遇到切分线，就把当前累积的内容推进去，然后将内容重置一下，再给序号加一
          Out_JSON.push(JSON.parse(JSON.stringify(Item)))
          ID = ID + 1;
          Item = {
            id: ID,
            subject: this.Subject,
            period: this.Period,
            content: []
          }
        }else{
          // 0 代表文字和图片内容
          // 1 代表试卷中的表格内容（不太清楚要怎么办，但总之应该是这么返回才对……吧？）
          if(this.Paper_Content[i].para_type == '0'){
            let Content = ""
            for(let j = 0; j < this.Paper_Content[i].runs.length; j++){
              if(this.Paper_Content[i].runs[j].run_type == '0'){
                Content = Content + this.Paper_Content[i].runs[j].run_text
              }else if(this.Paper_Content[i].runs[j].run_type == '1'){
                Content = Content
                    + "<img src='" + this.Paper_Image_Dict[this.Paper_Content[i].runs[j].image.src] + "' "
                    + " width='" + this.Paper_Content[i].runs[j].image.width + "' "
                    + " height='" + this.Paper_Content[i].runs[j].image.height + "' "
                    + " style='" + this.Paper_Content[i].runs[j].image.style + "' "
                    + " alt='" + this.Paper_Content[i].runs[j].image.alt + "' "
                    + ">"
              }
            }
            Content = Content.replace(Reg_C, "")
            Item.content.push(Content)
          }else{
            Item.content.push(this.Table_Img_Get(this.Paper_Content[i].table_raw_html))
          }
        }
      }
      // 把累积到的最后一组也压进去
      Out_JSON.push(JSON.parse(JSON.stringify(Item)))

      let Param = {
        'test': true,
        'title': this.Title,
        'period': this.period,
        'subject': this.subject,
        'user': this.UUID,
        'papertext': this.papertext,
        'papermanualdivide_list': JSON.stringify(this.papermanualdivide_list, null, 4),

      }

      let Temp_Result_Dict = {
        单选题: {
          list: [],
          desc: ""
        },
        多选题: {
          list: [],
          desc: ""
        },
        判断题: {
          list: [],
          desc: ""
        },
        填空题: {
          list: [],
          desc: ""
        },
        简答题: {
          list: [],
          desc: ""
        },
        计算题: {
          list: [],
          desc: ""
        }
      }

      let Type_List = ['单选题', '多选题', '判断题', '填空题', '简答题', '计算题']
      for(let j = 0; j < Type_List.length; j++){
        let Count = 1;
        for(let i = 0; i < this.Question_Bundle.length; i++){
          if(this.Question_Bundle[i].type == Type_List[j]){
            Count = Count + 1
          }
        }
        Temp_Result_Dict[Type_List[j]].desc = "第" + Count + "个" + Type_List[j] + "题包"
      }

      commonAjax('https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/input_paper', Param,{ emulateJSON: true }).then((res)=>{

        let Result = res.data

        for(let i = 0; i < Result.length; i++){
          if(['单选题', '多选题', '判断题'].indexOf(Result[i].type) != -1){
            let Item = {
              score: Result[i].score == 0 ? 5 : Result[i].score,
              stem: Result[i].stem,
              stem_image: [],
              options: [],
              options_image: [],
              answer: Result[i].answer,
              answer_image: [],
              analysis: Result[i].analysis,
              analysis_image: [],
              // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
              sub_questions: [],
              sub_questions_image: [],
              sub_questions_score: [],
              answer_list: []
            }
            for(let j = 0; j < Result[i].options.length; j++){
              Item.options.push(Result[i].options[j])
              Item.options_image.push([])
            }
            Temp_Result_Dict[Result[i].type].list.push(Item)
          }else if(Result[i].type == '填空题'){
            let Item = {
              score: Result[i].score == 0 ? 5 : Result[i].score,
              stem: Result[i].stem,
              stem_image: [],
              options: [],
              options_image: [],
              answer: Result[i].answer,
              answer_image: [],
              analysis: Result[i].analysis,
              analysis_image: [],
              // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
              sub_questions: [],
              sub_questions_image: [],
              sub_questions_score: [],
              answer_list: []
            }
            Temp_Result_Dict[Result[i].type].list.push(Item)
          }else if(['简答题', '计算题'].indexOf(Result[i].type) != -1){
            let Item = {
              score: 5 * Result[i].subquestions.length,
              stem: Result[i].stem,
              stem_image: [],
              options: [],
              options_image: [],
              answer: Result[i].answer,
              answer_image: [],
              analysis: Result[i].analysis,
              analysis_image: [],
              // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
              sub_questions: [],
              sub_questions_image: [],
              sub_questions_score: [],
              answer_list: []
            }
            for(let j = 0; j < Result[i].subquestions.length; j++){
              Item.sub_questions.push(Result[i].subquestions[j])
              Item.sub_questions_image.push([])
              Item.sub_questions_score.push(5)
            }
          }
        }

        for(let i = 0; i < Type_List.length; i++){
          if(Temp_Result_Dict[Type_List[i]].list.length > 0){
            this.Question_Bundle.push({
              type: Type_List[i],
              desc: Temp_Result_Dict[Type_List[i]].desc,
              list: Temp_Result_Dict[Type_List[i]].list
            })
          }
        }

        this.$message.success("所切分的结果中，可识别的试题结果已全部导入录入结果当中。")

        this.File_Name = ""
        this.File_Uploading = false
        this.Paper_Content = []
        this.Paper_Image_Dict = {}
        this.Paper_Divider_Index = -1;
        this.Using_Part = "Input"

      }).catch(
          ()=>{
            this.$message.error("解析出现异常，请重试。")
          }
      )
    },
    // 尝试添加和删除切分线
    Delete_Divider(Item_Index){
      this.Paper_Content.splice(Item_Index, 1)
      this.Paper_Divider_Index = -1;
    },
    Add_Divider(Item_Index){
      this.Paper_Content.splice(Item_Index + 1, 0, 'DIVIDER_LINES')
      this.Paper_Divider_Index = -1;
    },
    // 初始化选择器
    Init_File_Selector(){
      this.File_Selector = document.getElementById("fileSelect");
      this.File_Selector.addEventListener("change", (e)=>{
        if(e.target.files[0]){
          this.File_Uploading = true
          this.File_Upload(e.target.files[0])
          this.File_Selector.value = ""
        }
      })
    },
    // 清空所有手动录入的试题数据
    Clear_All_Questions_Info(){
      this.Question_Bundle = []
      this.Draging_Questions_Rect = [];
      this.Draging_Questions_Index = -1;
      this.Draging_Questions_Position = {
        x: 0,
        y: 0
      }
      this.Focusing_Questions_Position = {
        x: 0,
        y: 0
      }
      this.Focusing_Index = -1
      this.Editing_Position = ""

      this.Multi_Type_Insert = false;
      this.Multi_Info = [];
      this.Waiting_Question = {}

      this.Jumping = ""

      this.Refresh = true
      this.Refresh = false
    },
    // 上传文件
    File_Upload(file){

      this.Paper_Content = []
      this.Paper_Image_Dict = {}
      this.Paper_Divider_Index = -1;

      this.Using_Part = "Fileinput"
      this.File_Name = file.name

      let formData = new FormData();


      formData.append("files", file);
      formData.append("paper_type","4");
      formData.append("data_format", '0')

      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };

      this.uploadFile(formData, config);
    },
    // 触发上传事件
    File_Import(){
        this.File_Selector.click();

    },
    // 选择上传
    uploadFile(formData, config) {
      let k=0;
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
                k=k+1;
                this.question_list.push({question_id: k,type:'None'});
                Lists.push("DIVIDER_LINES")
              }
            }
            this.Paper_Content = Lists
            let question_num=0;

            for(let i=0;i<this.Paper_Content.length;i++){
              if(this.Paper_Content[i]=='DIVIDER_LINES'){
                question_num=question_num+1;

              }

            }
            this.Paper_Content_BackUp = Lists
            this.File_Uploading = false;
          }).catch(() => {
        this.$alert("切分过程出现错误，这可能是由于服务器原因导致目前暂时无法提供服务，请重新提交文件或稍后再试。", "提示")
        this.File_Uploading = false;
      });
    },
    // 获取UUID
    Get_User_UUID(){
      commonAjax(this.backendIP + '/api/getUserUUID', {}).then((res)=>{
        this.UUID = res.UUID
      }).catch(
          (err)=>{
            console.log(err)
            console.log("Failed.")
          }
      )
    },
    // 单题录入
    toSingle(){
      this.$router.push({path: "/inputMarked"})
    },
    // 展示题目大类标题的方法
    Get_Bundle_Label(Type, Bundle_Index){
      let Symbol = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      let String_BI = Bundle_Index + ""

      if(Bundle_Index < 10){
        return Symbol[Bundle_Index] + "、" + Type
      }else if(Bundle_Index < 19){
        return "十" + Symbol[parseInt(String_BI[1])] + "、" + Type
      }else if(Bundle_Index < 99 && String_BI[1] == "9"){
        return Symbol[parseInt(String_BI[0])] + "十、" + Type
      }else if(Bundle_Index < 99){
        return Symbol[parseInt(String_BI[0]) - 1] + "十" + Symbol[parseInt(String_BI[1])] + "、" + Type
      }
    },

    // 返回选项的字母信息

    // “聚焦”题目的一些操作内容，包括向前移动，向后移动，删除，导入编辑区
    // 向前移动

    // 向后移动


    // 题包内试题的前移，后移，删除，修改
    // 前移


    // 修改
    Question_Edit(Bundle_Index, Question_Index){
      let Item = JSON.parse(JSON.stringify(this.Question_Bundle[Bundle_Index].list[Question_Index]))
      this.Editing_Position = Bundle_Index + " " + Question_Index
      this.Edit_Question(this.Question_Bundle[Bundle_Index].type, Item)
    },
    // 题包的前移，后移，删除

    // 获取组件坐标
    // Start 代表按下去了
    // End 代表松开了


    // 外面点一下重置题目聚焦
    Reset_Focus(){
      this.Focusing_Questions_Position = {
        x: 0,
        y: 0
      },
          this.Focusing_Index = -1
      this.Draging_Questions_Rect = [];
    },
    // 调整指针样式为抓握和松开

    // 由于有两个位置调用编辑，所以准备了一个方法让两边一起接进来
    Edit_Question(Question_Type, Question_Info){
      this.Type = "";
      this.Type = Question_Type;
      this.Refresh = !this.Refresh
      this.Using_Part = 'Input'
      sessionStorage.setItem("PaperEditing", JSON.stringify(Question_Info))
    },
    // 准备提交（入包）

    Multi_Choice(){
      this.Multi_Info = []
      for(let i = 0; i < this.Question_Bundle.length; i++){
        if(this.Question_Bundle[i].type == this.Type){
          let Score = 0;
          for(let j = 0; j < this.Question_Bundle[i].list.length; j++){
            Score = Score + this.Question_Bundle[i].list[j].score
          }
          this.Multi_Info.push({
            index: i,
            desc: this.Question_Bundle[i].desc,
            length: this.Question_Bundle[i].list.length,
            score: Score
          })
        }
      }
      this.Multi_Type_Insert = true;
    },
    Waiting_Insert(Index){
      console.log(this.Waiting_Question)
      this.Question_Bundle[Index].list.push(JSON.parse(JSON.stringify(this.Waiting_Question)))
      this.Multi_Info = [];
      this.Multi_Type_Insert = false;
      this.Refresh = !this.Refresh;
      console.log(this.Jumping)
      if(this.Jumping != ""){
        let Aim = this.Jumping.split(" ")
        this.Question_Bundle[Aim[0]].list.splice(Aim[1], 1)
        this.Reset_Focus()
        this.Jumping = ""
      }
    },

    // 负责实际检查的部分
    Check_Do(content){

      let remakeContent = "";

      var latexFlag = false;
      let Regx = /[A-Za-z0-9]/;

      var Img_Catcher = new RegExp('<img src="(.*?)">', 'g')
      var Result_List = Img_Catcher.exec(content);

      var Img_SE = [];
      var Start = 0;

      let Wrong_Char = [];

      while(Result_List != null){
        var Temp_Catcher = '<img src="' + Result_List[1] + '">';
        if(Img_SE.length > 0){
          Start = content.indexOf(Temp_Catcher, Img_SE[Img_SE.length - 1][1]);
        }
        else{
          Start = content.indexOf(Temp_Catcher);
        }
        Img_SE.push([Start, Start + Temp_Catcher.length - 1])
        Result_List = Img_Catcher.exec(content);
      }

      var Img_Index = 0;

      for(var i = 0; i < content.length; i++){

        if(content[i] == '$' && !latexFlag){
          latexFlag = true;
        }else if(content[i] == '$' && latexFlag){
          latexFlag = false;
        }

        if(Img_SE.length > 0 && i >= Img_SE[Img_Index][0] && i <= Img_SE[Img_Index][1]){
          remakeContent = remakeContent + content[i];
          continue;
        }else if(Img_SE.length > 0 && i > Img_SE[Img_Index][1] && Img_Index < Img_SE.length - 1){
          Img_Index = Img_Index + 1
        }

        if(!latexFlag){
          if (Regx.test(content[i]) || this.math_pun_list.indexOf(content[i]) != -1) {
            if(remakeContent[remakeContent.length - 1] == '$'){
              remakeContent = remakeContent.substring(0, remakeContent.length - 1) + content[i] + "$";
            }else if(['i', 'b'].indexOf(content[i]) != -1 &&
                (
                    (content[i - 1] == '/' && content[i - 2] == '<' && content[i + 1] == '>') ||
                    (content[i - 1] == '<' && content[i + 1] == '>')
                )
            ){
              remakeContent = remakeContent + content[i]
            }else if(content[i] == '/' && ['i', 'b'].indexOf(content[i+1]) != -1 && content[i-1] == '<' && content[i+2] == '>'){
              remakeContent = remakeContent + content[i]
            }else{
              remakeContent = remakeContent + "$" + content[i] + "$";
            }
          }
          // 中文字符，中英文允许的符号，空格或Latex结尾的$符号，换行符
          else if(!(content.charCodeAt(i) > 255 ||
              this.ch_pun_list.indexOf(content[i]) != -1 || this.en_pun_list.indexOf(content[i]) != -1 ||
              content[i] == ' ' || content[i] == '$' ||
              content.charCodeAt(i) == 10)
          ){
            Wrong_Char.push({
              position: i+1,
              char: content[i]
            })
            remakeContent = remakeContent + content[i];
          }
          else {
            remakeContent = remakeContent + content[i];
          }
        }else{
          remakeContent = remakeContent + content[i];
        }
      }
      return [remakeContent, Wrong_Char, latexFlag]
    },
    // 返回试题类别按钮样式

    // 切换当前想录入的题目类型

    // 获取正在编辑的题目的题型和位置
    Get_Editing_Info(){
      let Aim_Info = this.Editing_Position.split(" ")
      return "正在编辑第 " + (parseInt(Aim_Info[0]) + 1) + " 大题的第 " + (parseInt(Aim_Info[1]) + 1) + " 题"
    },
    // 获取正在创建的题目的题型
    Get_Building_Info(){
      return "正在录入" + this.Type
    },
    // 调整分区显示的样式
    Part_Class(Part_Name){
      if(Part_Name == this.Using_Part){
        return 'Using_Part'
      }else{
        return 'Un_Using_Part'
      }
    },
    // 调整全卷预览时，题号的显示
    Get_Preview_Index(Bundle_Index, Question_Index){
      let Index = 0;
      for(let i = 0; i < Bundle_Index; i++){
        Index = Index + this.Question_Bundle[i].list.length
      }
      Index = Index + Question_Index
      return "(" + Index + ")"
    },
    Submit(){
      this.question_list.push({question_id: 0,type:'None'})
      this.Title = this.Title.replace(/^\s*|\s*$/g,"");
      if(this.Title == ""){
        this.$message.error("尚未填写试卷标题或仅有空格，请重新填写。")
        return
      }

      let Upload_Json = {
        title: this.Title != "" ? this.Title : "未命名试卷",
        desc: "",
        Question_list: []
      }
      for(let i = 0; i < this.Question_Bundle.length; i++){
        this.question_list.push({question_id: i,type:'None'})
        let Question_Item = {
          desc : this.Question_Bundle[i].desc,
          type : ['单选题', '多选题', '判断题'].indexOf(this.Question_Bundle[i].type) != -1 ?
              '选择题' : ['简答题', '计算题'].indexOf(this.Question_Bundle[i].type) != -1 ?
                  '解答题' : this.Question_Bundle[i].type == '填空题' ? '填空题' : '综合题',
          material : "",
          questions : []
        }
        for(let j = 0; j < this.Question_Bundle[i].list.length; j++){
          let Item = this.Question_Bundle[i].list[j];
          let Result = this.Submit_Format_Fix(JSON.stringify(Item), this.Question_Bundle[i].type)
          Question_Item.questions.push(Result)
        }
        Upload_Json.Question_list.push(Question_Item)
      }

      let Param = {
        'Input_Data': JSON.stringify({
          "post_type": 1,
          "user_id": this.UUID,
          "subject": this.Subject,
          "period": this.Period,
          "questions": JSON.stringify(Upload_Json),
        }, null, 4),
        'questionInput': true
      }

      commonAjax(this.backendIP + '/api/mathUpload', Param).then(()=>{
        this.$message.success("入库完成")
        this.Uploading = false;
      }).catch(
          ()=>{
            this.$message.error("入库失败")
            this.Uploading = false;
          }
      )

    },
    // 开始调用格式转换方法
    Submit_Format_Fix(Ques, Type){
      this.Wrong_Char_Info = ""
      this.Wrong_Char_Dialog = false

      if(Type != '综合题'){

        // 名称格式修正一下
        let Question = JSON.parse(Ques);

        // 必填项检测
        if(Question.stem.length == 0){
          this.Wrong_Char_Info = "题干项尚未填写。"
          this.Wrong_Char_Dialog = true
          return
        }

        if(['单选题', '多选题', '判断题'].indexOf(Type) != -1){
          let Str = Question.stem
          let Quote_Reg = new RegExp("(\\(|\\（)(\\s*)(\\)|\\）)", "g")
          let res = Quote_Reg.exec(Str)
          while(res != null){
            Str = Str.replace(Quote_Reg, "$\\SIFChoice$")
            res = Quote_Reg.exec(Str)
          }
          Question.stem = Str
        }else if(Type == '填空题'){
          let Str = Question.stem
          let Space_Reg = new RegExp("____+", 'g')
          let res = Space_Reg.exec(Str)
          while(res != null){
            Str = Str.replace(Space_Reg, "$\\SIFBlank$")
            res = Space_Reg.exec(Str)
          }
          Question.stem = Str
        }

        // 开始检测题干项是否正确
        let C_Stem = this.Check_Do(Question.stem);
        if(C_Stem[2]){
          this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
          this.Wrong_Char_Dialog = true
          return
        }else if(C_Stem[1].length == 0){
          Question.stem = C_Stem[0]
        }else{
          this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
          for(let i = 0; i < C_Stem[1].length; i++){
            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
          }
          this.Wrong_Char_Dialog = true
          return
        }

        // 开始检测选项部分
        this.Wrong_Char_Info = ""
        for(let i = 0; i < Question.options.length; i++){
          // 必填项检测
          if(Question.options[i].length == 0){
            this.Wrong_Char_Info = this.Wrong_Char_Info + "选项 " + String.fromCharCode( 65 + i ) + " 尚未填写。请注意所有选项都是必填项。<br>"
          }
        }
        if(this.Wrong_Char_Info != ""){
          this.Wrong_Char_Dialog = true;
          return
        }

        // 内容检测
        for(let i = 0; i < Question.options.length; i++){

          let C_Option_Item = this.Check_Do(Question.options[i])
          if(C_Option_Item[2]){
            this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在包裹不完全的 Latex 公式，请修正后重试"
            this.Wrong_Char_Dialog = true
            return
          }else if(C_Option_Item[1].length == 0){
            Question.options.splice(i, 1, C_Option_Item[0])
          }else{
            this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
            for(let j = 0; j < C_Option_Item[1].length; j++){
              this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Option_Item[1][j].position + " 处的 " + C_Option_Item[1][j].char + " 字符。<br>"
            }
            this.Wrong_Char_Dialog = true
            return
          }
        }
        // this.$message.success("选项内容格式检测已通过。")

        if(Question.answer.length != 0){
          let C_Answer = this.Check_Do(Question.answer);
          if(C_Answer[2]){
            this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
            this.Wrong_Char_Dialog = true
            return
          }else if(C_Answer[1].length == 0){
            Question.answer = C_Answer[0]
          }else{
            this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
            for(let i = 0; i < C_Answer[1].length; i++){
              this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
            }
            this.Wrong_Char_Dialog = true
            return
          }
        }
        // this.$message.success("答案内容格式检测已通过。")

        if(Question.analysis.length != 0){
          let C_Analysis = this.Check_Do(Question.analysis);
          if(C_Analysis[2]){
            this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
            this.Wrong_Char_Dialog = true
            return
          }else if(C_Analysis[1].length == 0){
            Question.analysis = C_Analysis[0]
          }else{
            this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
            for(let i = 0; i < C_Analysis[1].length; i++){
              this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
            }
            this.Wrong_Char_Dialog = true
            return
          }
        }

        // 小题内容检测 - 必填检测
        this.Wrong_Char_Info = ""
        for(let i = 0; i < Question.sub_questions.length; i++){
          if(Question.sub_questions[i].length == 0){
            this.Wrong_Char_Info = this.Wrong_Char_Info + "第 " + (i+1) + " 小题尚未填写。<br>"
          }
        }
        if(this.Wrong_Char_Info != ""){
          this.Wrong_Char_Dialog = true;
          return
        }
        // 内容检测
        for(let i = 0; i < Question.sub_questions.length; i++){
          let C_Sub_Ques_Item = this.Check_Do(Question.sub_questions[i])
          if(C_Sub_Ques_Item[2]){
            this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在包裹不完全的 Latex 公式，请修正后重试"
            this.Wrong_Char_Dialog = true
            return
          }else if(C_Sub_Ques_Item[1].length == 0){
            Question.sub_questions.splice(i, 1, C_Sub_Ques_Item[0])
          }else{
            this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
            for(let j = 0; j < C_Sub_Ques_Item[1].length; j++){
              this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Sub_Ques_Item[1][j].position + " 处的 " + C_Sub_Ques_Item[1][j].char + " 字符。<br>"
            }
            this.Wrong_Char_Dialog = true
            return
          }
        }

        return this.Submit_Normal_Ques(Question, Type)
      }
      // 开始检测综合题部分
      else{

        // 名称规范化
        let Question = JSON.parse(Ques);

        // 必填项检测
        if(Question.stem.length == 0){
          this.Wrong_Char_Info = "题干项尚未填写。"
          this.Wrong_Char_Dialog = true
          return
        }

        // 开始检测题干项是否正确
        let C_Stem = this.Check_Do(Question.stem);
        if(C_Stem[2]){
          this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
          this.Wrong_Char_Dialog = true
          return
        }else if(C_Stem[1].length == 0){
          Question.stem = C_Stem[0]
        }else{
          this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
          for(let i = 0; i < C_Stem[1].length; i++){
            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
          }
          this.Wrong_Char_Dialog = true
          return
        }

        // 检测答案项部分，由于是非必填项，不填也没事
        if(Question.answer.length != 0){
          let C_Answer = this.Check_Do(Question.answer);
          if(C_Answer[2]){
            this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
            this.Wrong_Char_Dialog = true
            return
          }else if(C_Answer[1].length == 0){
            Question.answer = C_Answer[0]
          }else{
            this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
            for(let i = 0; i < C_Answer[1].length; i++){
              this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
            }
            this.Wrong_Char_Dialog = true
            return
          }
        }

        // 检测解析字段 - 不填也没事
        if(Question.analysis.length != 0){
          let C_Analysis = this.Check_Do(Question.analysis);
          if(C_Analysis[2]){
            this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
            this.Wrong_Char_Dialog = true
            return
          }else if(C_Analysis[1].length == 0){
            Question.analysis = C_Analysis[0]
          }else{
            this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
            for(let i = 0; i < C_Analysis[1].length; i++){
              this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
            }
            this.Wrong_Char_Dialog = true
            return
          }
        }

        for(let j = 0; j < Question.sub_questions.length; j++){

          let Item = Question.sub_questions[j]
          // 重置提示信息
          this.Wrong_Char_Info = ""

          // 必填项检测
          if(Item.stem.length == 0){
            this.$message.error("题干项尚未填写。")
            return
          }

          if(['单选题', '多选题', '判断题'].indexOf(Question.sub_questions[j].type) != -1){
            let Str = Question.sub_questions[j].stem
            let Quote_Reg = new RegExp("(\\(|\\（)(\\s*)(\\)|\\）)", "g")
            let res = Quote_Reg.exec(Str)
            while(res != null){
              Str = Str.replace(Quote_Reg, "$\\SIFChoice$")
              res = Quote_Reg.exec(Str)
            }
            Question.sub_questions[j].stem = Str
          }else if(Question.sub_questions[j].type == '填空题'){
            let Str = Question.sub_questions[j].stem
            let Space_Reg = new RegExp("____+", 'g')
            let res = Space_Reg.exec(Str)
            while(res != null){
              Str = Str.replace(Space_Reg, "$\\SIFBlank$")
              res = Space_Reg.exec(Str)
            }
            Question.sub_questions[j].stem = Str
          }

          // 开始检测题干项是否正确
          let C_Stem = this.Check_Do(Item.stem);
          if(C_Stem[2]){
            this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
            this.Wrong_Char_Dialog = true
            return
          }else if(C_Stem[1].length == 0){
            Item.stem = C_Stem[0]
          }else{
            this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
            for(let i = 0; i < C_Stem[1].length; i++){
              this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
            }
            this.Wrong_Char_Dialog = true
            return
          }

          // 开始检测选项部分
          this.Wrong_Char_Info = ""
          for(let i = 0; i < Item.options.length; i++){
            // 必填项检测
            if(Item.options[i].length == 0){
              this.Wrong_Char_Info = this.Wrong_Char_Info + "选项 " + String.fromCharCode( 65 + i ) + " 尚未填写。请注意所有选项都是必填项。<br>"
            }
          }
          if(this.Wrong_Char_Info != ""){
            this.Wrong_Char_Dialog = true;
            return
          }

          // 内容检测
          for(let i = 0; i < Item.options.length; i++){

            let C_Option_Item = this.Check_Do(Item.options[i])
            if(C_Option_Item[2]){
              this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在包裹不完全的 Latex 公式，请修正后重试"
              this.Wrong_Char_Dialog = true
              return
            }else if(C_Option_Item[1].length == 0){
              Item.options.splice(i, 1, C_Option_Item[0])
            }else{
              this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
              for(let j = 0; j < C_Option_Item[1].length; j++){
                this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Option_Item[1][j].position + " 处的 " + C_Option_Item[1][j].char + " 字符。<br>"
              }
              this.Wrong_Char_Dialog = true
              return
            }
          }

          if(Item.answer.length != 0){
            let C_Answer = this.Check_Do(Item.answer);
            if(C_Answer[2]){
              this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
              this.Wrong_Char_Dialog = true
              return
            }else if(C_Answer[1].length == 0){
              Item.answer = C_Answer[0]
            }else{
              this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
              for(let i = 0; i < C_Answer[1].length; i++){
                this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
              }
              this.Wrong_Char_Dialog = true
              return
            }
          }

          if(Item.analysis.length != 0){
            let C_Analysis = this.Check_Do(Item.analysis);
            if(C_Analysis[2]){
              this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
              this.Wrong_Char_Dialog = true
              return
            }else if(C_Analysis[1].length == 0){
              Item.analysis = C_Analysis[0]
            }else{
              this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
              for(let i = 0; i < C_Analysis[1].length; i++){
                this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
              }
              this.Wrong_Char_Dialog = true
              return
            }
          }

          // 小题内容检测 - 必填检测
          this.Wrong_Char_Info = ""
          for(let i = 0; i < Item.sub_questions.length; i++){
            if(Item.sub_questions[i].length == 0){
              this.Wrong_Char_Info = this.Wrong_Char_Info + "第 " + (i+1) + " 小题尚未填写。<br>"
            }
          }
          if(this.Wrong_Char_Info != ""){
            this.Wrong_Char_Dialog = true;
            return
          }
          // 内容检测
          for(let i = 0; i < Item.sub_questions.length; i++){
            let C_Sub_Ques_Item = this.Check_Do(Item.sub_questions[i])
            if(C_Sub_Ques_Item[2]){
              this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在包裹不完全的 Latex 公式，请修正后重试"
              this.Wrong_Char_Dialog = true
              return
            }else if(C_Sub_Ques_Item[1].length == 0){
              Item.sub_questions.splice(i, 1, C_Sub_Ques_Item[0])
            }else{
              this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
              for(let j = 0; j < C_Sub_Ques_Item[1].length; j++){
                this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Sub_Ques_Item[1][j].position + " 处的 " + C_Sub_Ques_Item[1][j].char + " 字符。<br>"
              }
              this.Wrong_Char_Dialog = true
              return
            }
          }
        }
        return this.Submit_Mix_Ques(Question)
      }

    },
    // 将基础题转化为可以入库的格式的部分
    Submit_Normal_Ques(Ques, Type){

      var Temp_Result = ""

      if(['单选题', '多选题', '判断题', '填空题'].indexOf(Type) != -1){

        let Temp_Doc = {
          type: Type,
          stem: Ques.stem,
          stem_image: Ques.stem_image,
          score: parseFloat(Ques.score + ""),
          options: Ques.options,
          options_image: Ques.options_image,
          answer: Ques.answer,
          answer_image: Ques.answer_image,
          analysis: Ques.analysis,
          analysis_image: Ques.analysis_image
        }

        Temp_Result = Temp_Doc

      }else if(['简答题', '计算题'].indexOf(Type) != -1){


        let Temp_Doc = {
          desc: Ques.stem,
          desc_image: Ques.stem_image,
          type: "大题",
          score: parseFloat(Ques.score + ""),
          subquestions: [],
          answer: Ques.answer,
          answer_image: Ques.answer_image,
          analysis: Ques.analysis,
          analysis_image: Ques.analysis_image
        }


        for(let i = 0; i < Ques.sub_questions.length; i++){
          let Item = {
            type: Type,
            score: parseFloat(Ques.sub_questions_score[i] + ""),
            stem: Ques.sub_questions[i],
            stem_image: Ques.sub_questions_image[i],
            options: [],
            options_image: [],
            answer: "",
            answer_image: [],
            analysis: "",
            analysis_image: []
          }
          Temp_Doc.subquestions.push(Item)
        }
        Temp_Result = Temp_Doc
      }
      return Temp_Result
    },
    // 将综合题转化为可以入库的格式的部分
    Submit_Mix_Ques(Ques){
      let Temp_Doc = {
        desc: "",
        desc_image: [],
        type: "大题",
        score: 0,
        subquestions: [],
        answer: "",
        answer_image: [],
        analysis: "",
        analysis_image: []
      }

      Temp_Doc.desc = Ques.stem;
      Temp_Doc.desc_image = Ques.stem_image;

      Temp_Doc.score = parseFloat(Ques.score + "");

      for(let i = 0; i < Ques.sub_questions.length; i++){
        let Item = {
          type: Ques.sub_questions[i].type,
          score: parseFloat(Ques.sub_questions[i].score + ""),
          stem: Ques.sub_questions[i].stem,
          stem_image: Ques.sub_questions[i].stem_image,
          options: Ques.options,
          options_image: Ques.options_image,
          answer: Ques.sub_questions[i].answer,
          answer_image: Ques.sub_questions[i].answer_image,
          analysis: Ques.sub_questions[i].analysis,
          analysis_image: Ques.sub_questions[i].analysis_image
        }

        Temp_Doc.subquestions.push(Item)
      }

      Temp_Doc.answer = Ques.answer;
      Temp_Doc.answer_image = Ques.answer_image;

      Temp_Doc.analysis = Ques.analysis;
      Temp_Doc.analysis_image = Ques.analysis_image;

      return Temp_Doc
    },
    // 添加新的空题包
    Add_New_Empty_Bundle(){
      let Count = 1;
      for(let i = 0; i < this.Question_Bundle.length; i++){
        if(this.Question_Bundle[i].type == this.Add_Bundle_Type){
          Count = Count + 1
        }
      }
      this.Question_Bundle.push({
        type: this.Add_Bundle_Type,
        list: [],
        desc: "第" + Count + "个" + this.Add_Bundle_Type + "题包"
      })
    },
    // 给表格的每一行赋予相对的样式
    Multi_Choise_Table_Row(Info_Index){
      if(Info_Index%2 == 1){
        return "Multi_Choise_Table_Row_0"
      }else{
        return "Multi_Choise_Table_Row_1"
      }
    },
    Focus_Jump_Check(Type){
      let Count = 0
      for(let i = 0; i < this.Question_Bundle.length; i++){
        if(this.Question_Bundle[i].type == Type){
          Count = Count + 1
        }
      }
      if(Count > 1){
        return true
      }else{
        return false
      }
    },
    Focus_Question_Jump(Bundle_Index){
      let Index = 0;
      while(this.Draging_Questions_Rect[Index].x != this.Focusing_Questions_Position.x ||
      this.Draging_Questions_Rect[Index].y != this.Focusing_Questions_Position.y){
        Index = Index + 1
      }
      let Item = JSON.parse(JSON.stringify(this.Question_Bundle[Bundle_Index].list[Index]))
      this.Jumping = Bundle_Index + " " + Index
      this.Waiting_Question = Item;
      this.Multi_Info = []
      for(let i = 0; i < this.Question_Bundle.length; i++){
        if(this.Question_Bundle[i].type == this.Question_Bundle[Bundle_Index].type){
          let Score = 0;
          for(let j = 0; j < this.Question_Bundle[i].list.length; j++){
            Score = Score + this.Question_Bundle[i].list[j].score
          }
          this.Multi_Info.push({
            index: i,
            desc: this.Question_Bundle[i].desc,
            length: this.Question_Bundle[i].list.length,
            score: Score
          })
        }
      }
      this.Multi_Type_Insert = true;
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.toSingle{
  height: 40px;
  line-height: 40px;
  width: 10vw;
  background: #FFE37F;
  font-weight: bold;
  border-radius: 15px;
  cursor: pointer;
}
.toSingle:hover{
  background: #FFF0A0;
  color: #888;
}

.Ques_Button{
  width: 100%;
  height: 100%;
  cursor: grab;
  box-sizing: border-box;
}
.Ques_Button:hover{
  border: 1px solid whitesmoke;
  border-radius: 5px;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
}
.PreviewPaperArea{
  width: 100%;
  border: 2px solid #409EFF;
  border-radius: 10px;
  min-height: 400px;
  padding: 20px;
  box-shadow: 2px 3px 4px 0 rgba(64, 158, 255, 0.8);
}
// 主要区域的高度
.Total_Bundle_Popover_Main{
  height: 290px;
  overflow-x: hidden;
  overflow-y: auto;
}
.Un_Selectable{
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  user-select: none;
}
// 下面四个是试题类型按钮的样式
.typeButton{
  border-radius: 20px;
  margin-right: 10px;
  font-weight: bold;
  box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
.typeButton.focusType{
  background: #409EFF;
  border: 1px solid #409EFF;
  color: white;
}
.typeButton.unFocusType{
  background: white;
  border: 1px solid whitesmoke;
}
.typeButton.unFocusType:hover{
  background: #E5EEFF;
  border: 1px solid #F5FEFF;
}
// 正在编辑的题目位置的显示框的样式
.Editing_Info{
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  border: 2px dashed red;
  background: rgba($color: red, $alpha: 0.1);
  color: red;
}
// 正在新建题目的显示框的样式
.Building_Info{
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  border: 2px dashed #409EFF;
  background: rgba($color: 	#409EFF, $alpha: 0.1);
  color: 	#409EFF;
}
// 符合当前正在使用的部分的标签
.Un_Using_Part{
  border: 2px solid #409EFF;
  background: white;
  color: #409EFF;
  cursor: pointer;
  box-sizing: border-box;
}
.Un_Using_Part:hover{
  background: rgba($color: 	#409EFF, $alpha: 0.1);
}
.Using_Part{
  border: 2px solid #409EFF;
  background: #409EFF;
  color: white;
  cursor: pointer;
  box-sizing: border-box;
}
<<<<<<< HEAD
.Desc_Input ::v-deep .el-input__inner{
=======
.Desc_Input /deep/ .el-input__inner{
>>>>>>> 2d66eba... commit final branch
  margin: 5px 0px;
  padding: 0px;
  height: 20px;
  line-height: 20px;
}
.Multi_Choise_Table_Top{
  border: 1px solid #409eff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.Multi_Choise_Table_Top_Label{
  border-right: 1px solid #409eff;
  height: 40px;
  line-height: 40px;
  color: #409EFF
}
.Multi_Choise_Table_Row_0{
  height: 40px;
  line-height: 40px;
  border: 1px solid #409eff;
  border-top: none;
}
.Multi_Choise_Table_Row_1{
  height: 40px;
  line-height: 40px;
  border: 1px solid #409eff;
  border-top: none;
  background: rgba($color: 	#409EFF, $alpha: 0.1);;
}
</style>
<style>
/* 设定一下弹出框的属性 */
.el-popover.Total_Bundle_Popover{
  height: 350px;
}

.el-dialog.Multi_Type_Selector{
  display: flex;
  flex-direction: column;
  margin:0 !important;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
}
.background_color {
  z-index: 20;
  position: absolute;
  z-index: 10;
  width: 990px;
  height: 950px;
  left: 629.97px;
  top: -213px;

  background: #D9E9FE;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.06);
  border-radius: 60px;
  transform: rotate(10deg);
}
.title {
  position: static;
  width: 340px;
  height: 48px;
  left: 70px;
  top: 144px;

  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 48px;
  line-height: 22px;
  /* or 46% */

  display: flex;
  align-items: center;
  letter-spacing: 0.05em;

  color: #000000;
}
.upload_text {
  position: absolute;
  width: 220px;
  height: 28px;
  left: calc(50% - 220px/2 + 316px);
  top: calc(50% - 28px/2 - 930px);

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;

  color: #000000;
}
.table_area {
  position: static;
  width: 320px;
  height: 479px;
  left: 0px;
  top: 0px;


  /* Inside Auto Layout */

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 16px 0px;
}
.paper_info {
  position: fixed;
  width: 584px;
  height: 324px;
  left: 144px;
  top: 258px;
}
.upload_box {
  position: absolute;
  z-index: 50;
  width: 520px;
  height: 324px;
  left: calc(50% - 520px/2 + 316px);
  top: calc(50% - 324px/2 - 985px);

  background: #FEFEFE;
  box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
}
.table {
  position: absolute;
  width: 120px;
  height: 479px;
  left: 0px;
  top: 0px;

  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(12px);
  /* Note: backdrop-filter has minimal browser support */

  border-radius: 10px;
}
.user_label {
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;

  position: absolute;
  width: 320px;
  left: 976px;
  top: 652px;
}
.button_line {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;

  position: static;
  width: 320px;
  height: 48px;
  left: calc(50% - 320px/2);
  top: calc(50% - 48px/2 + 247.5px);


  /* Inside Auto Layout */

  flex: none;
  order: 1;
  flex-grow: 0;
  margin: 16px 0px;
}
</style>
