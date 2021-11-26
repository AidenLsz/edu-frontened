<template>
  <div 
    id="Page_Top"
    style="margin-top: 5vh; padding-left: 5vw; padding-right: 5vw"
    v-loading="File_Uploading"
    :element-loading-text="File_Uploading_Text"
    element-loading-spinner="el-icon-loading">
    <el-dialog
        :visible.sync="Wrong_Char_Dialog"
        title="格式错误提示"
        width="40%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
        <div v-html="Wrong_Char_Info"></div>
        <el-button 
            type="danger" 
            @click="Wrong_Char_Dialog = false"
            style="margin-top: 30px;"
            >确认</el-button>
    </el-dialog>
    <el-row type="flex" justify="start" style="margin-top: -1vh;">
        <el-col :span="13">
            <el-row type="flex" justify="start" style="height: 40px; line-height: 40px;" v-show="Import_Mode == 'Single'">
                <el-col v-for="Type in Type_List" :key="'Ques_Type_' + Type.label" :span="24/8">
                    <el-row 
                        type="flex" 
                        justify="center" 
                        :class="Get_Type_Button_Class(Type)"
                        @click.native="Type_Change(Type.value)">
                        {{Type.label}}
                    </el-row>
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="height: 40px; line-height: 40px;" v-show="Import_Mode == 'Paper'">
                <el-button type="primary" @click="File_Upload()">点击此处上传{{Subject}}试卷文件</el-button>
                
                <label style="height: 40px; line-height: 40px; margin: 0px 16px 0px 40px">当前显示试卷：</label>
                <span style="height: 40px; line-height: 40px">{{File_Name == "" ? "尚未选择试卷" : File_Name}}</span>
            </el-row>
        </el-col>
        <el-col :span="11">
            <el-row type="flex" justify="end">
                <input type="file" accept=".doc, .docx" id="File_Upload" :multiple="false" style="display: none">
                <!-- 切换知识点过滤检索或者文件检索的按钮 -->
                <el-switch
                    style="display: block; margin-top: 9px; margin-left: 10px;"
                    v-model="Import_Mode"
                    active-color="#409EFF"
                    inactive-color="#13ce66"
                    inactive-text="手动录入单题模式"
                    inactive-value="Single"
                    active-text="整卷切分导入模式"
                    active-value="Paper">
                </el-switch>
            </el-row>
        </el-col>
    </el-row>
    <el-row 
        type="flex" 
        justify="center" 
        v-show="Import_Mode == 'Single'"
        style="border: 3px solid #409EFF; min-height: 30vh; border-radius: 15px; margin-top: 30px; margin-bottom: 30px;">
        <OptionQuestions @Emit_And_Submit="Prepare_For_Submit" style="width: 100%" v-if="['单选题', '多选题', '判断题'].indexOf(Type) != -1" :detailType.sync="Type"></OptionQuestions>
        <FillQuestions @Emit_And_Submit="Prepare_For_Submit" style="width: 100%" v-if="['填空题'].indexOf(Type) != -1" :detailType.sync="Type"></FillQuestions>
        <AnswerQuestions @Emit_And_Submit="Prepare_For_Submit" style="width: 100%" v-if="['简答题', '计算题'].indexOf(Type) != -1" :detailType.sync="Type"></AnswerQuestions>
        <MixQuestions @Emit_And_Submit="Prepare_For_Submit" style="width: 100%" v-if="['综合题'].indexOf(Type) != -1" :detailType.sync="Type"></MixQuestions>
    </el-row>
    <!-- 试卷切分的显示部分 -->
    <div 
      v-show="Import_Mode == 'Paper' && Paper_Content.length > 0" 
      style="padding: 32px; min-height: 100vh; border: 3px solid #409EFF; border-radius: 15px; margin-top: 30px; margin-bottom: 30px;">
        <el-row type="flex" justify="start" v-show="Question_Infos.length > 0">
            <!-- 切换知识点过滤检索或者文件检索的按钮 -->
            <el-switch
                style="display: block; margin-top: 9px; margin-left: 10px;"
                v-model="File_Step"
                active-color="#409EFF"
                inactive-color="#13ce66"
                inactive-text="文件切分调整页面"
                inactive-value="File_Cutting"
                active-text="确认识别内容加入题包"
                active-value="Question_Checking">
            </el-switch>
            <el-button v-show="File_Step == 'Question_Checking'" type="primary" @click="All_Choose_In_One_Click()" style="margin-left: 30px">一键选中所有题目</el-button>
        </el-row>
      <div v-show="File_Step == 'File_Cutting'">
        <div style="min-height: 90vh;">
        <el-row
            v-for="(Item, Item_Index) in Paper_Content"
            :key="'Line_' + Item_Index">
            <!-- 所有切分结果呈一列 -->
            <el-col>
                <!-- Item != 'DIVIDER_LINES' 这代表这部分内容是切分出来的结果的部分 -->
                <!-- 所有显示基本上就是把切分出来的内容按照配套的html格式显示出来 -->
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
                <!-- Item == 'DIVIDER_LINES' 这代表这个元素是原试卷内容里面的某一部分的分界线 -->
                <!-- mouse事件的作用是判断当前鼠标悬浮在哪个线上，用来操作的，用不到可以删 -->
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
                <!-- Item != 'DIVIDER_LINES' 即添加新切分线的部分是在试卷元素的后面出现的、其下一个内容不能是切分线、也不能是试卷的最后一个部分 -->
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
      <div v-show="File_Step == 'Question_Checking'">
          <div 
            v-for="(Question, Question_Index) in Question_Infos" 
            :key="'Checking_Question_' + Question_Index" 
            class="Checking_Question_Item">
                <el-row type="flex" justify="start" style="margin-bottom: 16px;">
                    <label style="height: 40px; line-height: 40px; margin-right: 15px;">此题的分数为：</label>
                    <el-input-number v-model="Question_Infos[Question_Index].score" placeholder=""></el-input-number>
                    <label style="height: 40px; line-height: 40px; margin-left: 40px; margin-right: 15px;">此题的题型为：</label>
                    <el-radio-group 
                        v-model="Question_Infos[Question_Index].type" 
                        style="padding-top: 13px;"
                        v-if="['单选题', '多选题', '判断题'].indexOf(Question.type) != -1">
                        <el-radio label="单选题">单选题</el-radio>
                        <el-radio label="多选题">多选题</el-radio>
                        <el-radio label="判断题">判断题</el-radio>
                    </el-radio-group>
                    <el-radio-group 
                        v-model="Question_Infos[Question_Index].type" 
                        style="padding-top: 13px;"
                        v-else>
                        <el-radio label="填空题">填空题</el-radio>
                        <el-radio label="简答题">简答题</el-radio>
                        <el-radio label="计算题">计算题</el-radio>
                    </el-radio-group>
                </el-row>
                <el-row type="flex" justify="start">
                    <Mathdown :content="Question.stem" :name="'Checking_Question_Stem_' + Question_Index"></Mathdown>
                </el-row>
                <el-row 
                    v-for="(Option, Option_Index) in Question.options" 
                    :key="'Checking_Question_Stem_' + Question_Index + '_Option_' + Option_Index" 
                    style="line-height: 40px" 
                    type="flex" 
                    justify="start">
                    <span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span>
                    <Mathdown style="width:700px" :content="Option" :name="'Checking_Question_Stem_' + Question_Index + '_Option_' + Option_Index"></Mathdown>
                </el-row>
                <el-row type="flex" justify="center">
                    <div :class="{
                            'Button_Basic': true,
                            'Picking_Button': Picking_List[Question_Index],
                            'Unpicking_Button': !Picking_List[Question_Index]
                        }"
                        @click="Change_Picking_Status(Question_Index)"
                        align="center">
                        {{Picking_List[Question_Index] ? "已选中此题目（点击取消）" : "未选中此题目（点击选中）"}}
                    </div>
                </el-row>
          </div>
          <div align="center">
              <el-button type="success" @click="All_Question_Checked()">试题检查完成</el-button>
          </div>
      </div>
    </div>
    <div 
        v-show="Import_Mode == 'Paper' && Paper_Content.length == 0" 
        style="min-height: 80vh; padding-top: 180px;">
        <label style="font-size: 24px; color: #ccc">点击左上角按钮选择当前学科的试卷进行切分</label>
    </div>
  </div>
</template>

<script>

import OptionQuestions from '@/views/resourceInput/components/OptionQuestions'
import FillQuestions from '@/views/resourceInput/components/FillQuestions.vue'
import AnswerQuestions from '@/views/resourceInput/components/AnswerQuestions.vue'
import MixQuestions from '@/views/resourceInput/components/MixQuestions.vue'

import Mathdown from '@/common/components/Mathdown'

import {commonAjax} from '@/common/utils/ajax'

export default {
  name: "inputMarked",
  components: {
      OptionQuestions, FillQuestions, AnswerQuestions, MixQuestions, Mathdown
  },
  data() {
    return {
        // 用于确定当前显示的题目类型的变量
        Type: "单选题",
        // 待选试题类型
        Type_List: [
            { value: "单选题", label: "单选题" },
            { value: "多选题", label: "多选题" },
            { value: "判断题", label: "判断题" },
            { value: "填空题", label: "填空题" },
            { value: "简答题", label: "简答题" },
            { value: "计算题", label: "计算题" },
            // { value: "综合题", label: "综合题" }
        ],
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
        // 录入模式
        Import_Mode: "Single",
        // 保存Input组件
        File_Selector: "",
        // 表示正在切分的变量
        File_Uploading: false,
        File_Uploading_Text: "",
        // 试卷内容，试卷配图内容，切分结果，切分结果备份
        // 用于存放拿来显示的变量
        Paper_Content: [],
        // 用来进行初始结果的备份
        Paper_Content_BackUp: [],
        // 存放拿来进行显示的图片
        Paper_Image_Dict: {

        },
        // 标记切分点的变量
        Paper_Divider_Index: -1,
        // 正在切分的卷子名称
        File_Name: "",
        // 因为是分两步，所以文件切分的显示过程还要加一个变量来区分这两步
        // File_Cutting - 切分
        // Question_Checking - 试题确认
        File_Step: "File_Cutting",
        // 存放题目信息识别后留下来的内容
        Question_Infos: [],
        // 存放这些留下来的内容是否要被用于放到试题组里面去
        Picking_List: []
    };
  },
  props: {
      Subject: {
          type: String,
          default: "数学"
      },
      Period: {
          type: String,
          default: "高中"
      }
  },
  mounted(){
      if(!this.$store.state.user.name || this.$store.state.user.name.length == 0){
        this.$message.error("您尚未登录，请登录后使用录入功能。")
        this.$router.push("/")
        return 
      }
      this.Get_User_UUID();
      this.Init_File_Selector()
  },
  methods:{
        // 完成全部题目的检查
        All_Question_Checked(){
            this.$confirm('确认要导入所有选中的题目吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                for(let i = 0; i < this.Picking_List.length; i++){
                    if(this.Picking_List[i]){
                        this.$emit("Add_To_Cart", JSON.stringify(this.Question_Infos[i]))
                    }
                }
                this.$message.success("已将所有选中的题目导入试题篮中。")
                this.To_Top();
            }).catch(()=>{
                this.$message.info("已取消")
            })
        },
        // 调整是否选中
        Change_Picking_Status(Question_Index){
            this.Picking_List.splice(Question_Index, 1, !this.Picking_List[Question_Index])
        },
        // 一键选中所有题目
        All_Choose_In_One_Click(){
            for(let i = 0; i < this.Picking_List.length; i++){
                this.Picking_List.splice(i, 1, true)
            }
        },
        // 返回选项标签
        Get_Option_Label(Index){
            return String.fromCharCode(Index + 65)
        },
        // 初始化选择器
        Init_File_Selector(){
            this.File_Selector = document.getElementById("File_Upload");
            this.File_Selector.addEventListener("change", (e)=>{
                if(e.target.files[0]){
                    this.File_Uploading = true
                    this.File_Uploading_Text = "切分试卷中，请稍后..."
                    this.File_Upload_Do(e.target.files[0])
                    this.File_Selector.value = ""
                }
            })
        },
        Import_Mode_Change(){
            this.Import_Mode = this.Import_Mode == "Single" ? "Paper" : "Single"
        },
        // 导入试卷切分的部分
        File_Upload(){
            this.File_Selector.click();
        },
        // 上传文件
        File_Upload_Do(file){

            this.Paper_Content = []
            this.Picking_List = []
            this.Paper_Image_Dict = {}
            this.Paper_Divider_Index = -1;

            this.File_Name = file.name

            let formData = new FormData();

            // 对应的切分编号，是约定好的，别动就好
            let Num_Dict = {
                英语: "0",
                数学: "1",
                文综: "2",
                政治: "2",
                历史: "2",
                地理: "2",
                理综: "3",
                物理: "3",
                化学: "3",
                生物: "3",
                语文: "4",
            }

            formData.append("files", file);
            formData.append("paper_type", Num_Dict[this.Subject]);
            formData.append("data_format", '0');
            // 为了防止需要老版本的地方崩溃，先加了这个，以后用不到了再说
            formData.append("paper_Cut_New", true);

            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };

            this.File_Cutting(formData, config);
        },
        // 选择上传
        File_Cutting(formData, config) {

            this.$http
            .post("https://file-upload-backend-88-production.env.bdaa.pro/v1/paperProcessing/upload", formData, config)
            .then(function(data) {
                // 切分出来的文字部分
                this.Paper_Content = data.data.paper
                // 切分出来的图片部分，注意在显然的时候，需要从这里找到对应的图片内容
                this.Paper_Image_Dict = data.data.image_dict
                // 空列表，用来存放元素
                let Lists = []
                for(let i = 0; i < data.data.paper.length; i++){
                    for(let j = 0; j < data.data.paper[i].sub_para.length; j++){
                        // 这是切分格式的结果，我也不知道为什么sub_para会是一个数组，但是这样读取就没问题
                        let Para = data.data.paper[i].sub_para[j]
                        // 把每个大段里面的每个小内容抽出来，单独塞到List里面
                        for(let k = 0; k < Para.length; k++){
                            Lists.push(Para[k])
                        }
                    }
                    // 只要不是最后一个大段，那么就往里面塞一个“切分线”元素
                    if(i != data.data.paper.length - 1){
                        Lists.push("DIVIDER_LINES")
                    }
                }
                // 把转化结果丢给显示区域，同时留一个备份
                this.Paper_Content = Lists
                this.Paper_Content_BackUp = Lists
                this.File_Uploading = false;
            }).catch(() => {
                this.$alert("切分过程出现错误，这可能是由于服务器原因导致目前暂时无法提供服务，请重新提交文件或稍后再试。", "提示")
                this.File_Uploading = false;
                this.File_Name = ""
            });
        },
        // 更新表格中的图片文件
        Table_Img_Get(Table_Html){
            for(var key in this.Paper_Image_Dict){
                var Img_Name_Catcher = new RegExp('<img src="' + key + '"')
                if(Img_Name_Catcher.exec(Table_Html) != null){
                Table_Html = Table_Html.replace(Img_Name_Catcher,'<img src="' + this.Paper_Image_Dict[key] + '"')
                }
            }
            return Table_Html
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
        // 将切分后的内容整理成导出格式
        Divider_Final_Check(){

            this.File_Uploading = true;
            this.File_Uploading_Text = "正在从切分结果中识别题目，请稍后..."

            let Reg_C = new RegExp('&#xa0;', 'g')

            let Out_JSON = []
            let ID = 0
            let Item = {
                id: ID,
                subject: this.Subject,
                period: this.Period,
                content: []
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
                'Paper_Cut_Result': JSON.stringify(Out_JSON, null, 4)
            }

            commonAjax(this.backendIP + '/api/paperCutResultAnalyse', Param)
            .then((res)=>{
                this.Question_Infos = []
                let Result = res.data
                this.Question_Infos_Fill(Result);
                this.File_Step = "Question_Checking"
            }).catch(
                ()=>{
                    this.$message.error("解析出现异常，请重试。")
                }
            ).finally(()=>{
                this.File_Uploading = false
                this.File_Uploading_Text = ""
            })
        },
        Question_Infos_Fill(Result){
            for(let i = 0; i < Result.length; i++){
                let Item = {
                    id: Result[i].id,
                    stem: Result[i].stem,
                    options: Result[i].options,
                    answer:  Result[i].answer,
                    analyse:  Result[i].analysis,
                    score:  Result[i].score,
                    type: Result[i].type == "选择题" ? "单选题" : Result[i].type == "综合题" ? "简答题" : Result[i].type
                }
                for(let j = 0; j < Result[i].subquestions.length; j++){
                    Item.stem = Item.stem + '\n' + Result[i].subquestions[j].sub_stem;
                    for(let k = 0; k < Result[i].subquestions[j].sub_options.length; k++){
                        Item.stem = Item.stem + '\n' + String.fromCharCode(65 + k) + Result[i].subquestions[j].sub_options[k]
                    }
                }
                this.Question_Infos.push(JSON.parse(JSON.stringify(Item)))
                this.Picking_List.push(false)
                this.To_Top();
            }
        },
        // 卷动至最上方
        To_Top(){
            document.getElementById("Page_Top").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
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
      // 跳转至整卷录入页面
      toPaper(){
        this.$router.push({path: "/inputPaper"})
      },
      // 返回按钮样式
      Get_Type_Button_Class(Type){
          if(Type.value == this.Type){
              return "typeButton focusType"
          }else{
              return "typeButton unFocusType"
          }
      },
      // 切换当前想录入的题目类型
      Type_Change(Type_value){
          this.Type = Type_value
      },
    Prepare_For_Submit(Ques){

        this.Wrong_Char_Info = ""
        this.Wrong_Char_Dialog = false

        if(this.Type != '综合题'){

            // 名称格式修正一下
            let Question = JSON.parse(Ques);

            // 必填项检测
            if(Question.stem.length == 0){
                this.Wrong_Char_Info = "题干项尚未填写。"
                this.Wrong_Char_Dialog = true
                return
            }

            // if(['单选题', '多选题', '判断题'].indexOf(this.Type) != -1){
            //     let Str = Question.stem
            //     let Quote_Reg = new RegExp("(\\(|\\（)(\\s*)(\\)|\\）)", "g")
            //     let res = Quote_Reg.exec(Str)
            //     while(res != null){
            //         Str = Str.replace(Quote_Reg, "$\\SIFChoice$")
            //         res = Quote_Reg.exec(Str)
            //     }
            //     Question.stem = Str
            // }else if(this.Type == '填空题'){
            //     let Str = Question.stem
            //     let Space_Reg = new RegExp("____+", 'g')
            //     let res = Space_Reg.exec(Str)
            //     while(res != null){
            //         Str = Str.replace(Space_Reg, "$\\SIFBlank$")
            //         res = Space_Reg.exec(Str)
            //     }
            //     Question.stem = Str
            // }

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

            this.Submit_Normal_Ques(Question);
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
            this.Submit_Mix_Ques(Question)
        }
    },
    // 将基础题转化为可以入库的格式的部分
    Submit_Normal_Ques(Ques){

        var Temp_Result = ""

        if(['单选题', '多选题', '判断题', '填空题'].indexOf(this.Type) != -1){

            let Temp_Doc = {
                type: this.Type,
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

        }else if(['简答题', '计算题'].indexOf(this.Type) != -1){


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
                    type: this.Type,
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
        this.Submit_Do(Temp_Result)
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

        this.Submit_Do(Temp_Doc)

    },
    Submit_Do(Submit_JSON){
      let Question_Show_Infos = {
        id: "",
        type: this.Type,
        score: Submit_JSON.score,
        stem: "",
        options: [],
        answer: "",
        analyse: ""
      }

      if(Submit_JSON.type != "大题"){

        Question_Show_Infos.stem = Submit_JSON.stem
        for(let i = 0; i < Submit_JSON.stem_image.length; i++){
          Question_Show_Infos.stem += "<img src='" + Submit_JSON.stem_image[i] + "'>"
        }

        Question_Show_Infos.answer = Submit_JSON.answer;
        for(let i = 0; i < Submit_JSON.answer_image.length; i++){
          Question_Show_Infos.answer += "<img src='" + Submit_JSON.answer_image[i] + "'>"
        }

        Question_Show_Infos.analyse = Submit_JSON.analysis
        for(let i = 0; i < Submit_JSON.analysis_image.length; i++){
          Question_Show_Infos.analyse += "<img src='" + Submit_JSON.analysis_image[i] + "'>"
        }

        Question_Show_Infos.options = Submit_JSON.options;
        for(let i = 0; i < Submit_JSON.options.length; i++){
          let Sub_Now = Submit_JSON.options[i]
          for(let j = 0; j < Submit_JSON.options_image[i].length; j++){
            Sub_Now = Sub_Now + "<img src='" + Submit_JSON.options_image[i][j] + "'>"
          }
          Question_Show_Infos.options.splice(i, 1, Sub_Now)
        }

      }else{

        Question_Show_Infos.stem = Submit_JSON.desc
        for(let i = 0; i < Submit_JSON.desc_image.length; i++){
          Question_Show_Infos.stem += "<img src='" + Submit_JSON.desc_image[i] + "'>"
        }

        for(let j = 0; j < Submit_JSON.subquestions.length; j++){
          let Item = Submit_JSON.subquestions[j];
          Question_Show_Infos.stem = Question_Show_Infos.stem + "\n" + Item.stem
          for(let k = 0; k < Item.stem_image.length; k++){
            Question_Show_Infos.stem = Question_Show_Infos.stem + "<img src='" + Item.stem_image[k] + "'>"
          }
        }

        Question_Show_Infos.answer = Submit_JSON.answer;
        for(let i = 0; i < Submit_JSON.answer_image.length; i++){
          Question_Show_Infos.answer += "<img src='" + Submit_JSON.answer_image[i] + "'>"
        }

        Question_Show_Infos.analyse = Submit_JSON.analysis
        for(let i = 0; i < Submit_JSON.analysis_image.length; i++){
          Question_Show_Infos.analyse += "<img src='" + Submit_JSON.analysis_image[i] + "'>"
        }

      }

      this.$emit("Add_To_Cart", JSON.stringify(Question_Show_Infos))
      this.$message.success("试题内容已加入试题篮")
      
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.toPaper{
    height: 40px; 
    line-height: 40px;
    width: 10vw; 
    background: #FFE37F;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
}
.toPaper:hover{ 
    background: #FFF0A0;
    color: #888;
}
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

.Checking_Question_Item{
    border: 1px solid black;
    border-radius: 10px;
    padding: 16px;
    margin: 20px 0px;
}

.Button_Basic{
    width: 260px;
    height: 40px;
    line-height: 40px;
    margin-top: 10px;
    border-radius: 5px;
    box-shadow: 0px 2px 8px rgba(151, 151, 151, 0.06);
    -webkit-box-shadow: 0px 2px 8px rgba(151, 151, 151, 0.06);
    color: white;
    cursor: pointer;
}

.Picking_Button{
    background-color: #67C23A;
    transition-duration: 200ms;
}

.Picking_Button:hover{
    background-color: rgba(#67C23A, 0.6);
}

.Unpicking_Button{
    background-color: #C0C4CC;
    transition-duration: 200ms;
}

.Unpicking_Button:hover{
    background-color: rgba(#C0C4CC, 0.6);
}
</style>
