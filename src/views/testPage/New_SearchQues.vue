<template>
    <div 
        style="padding-left: 10vw; padding-right: 10vw; padding-top: 5vh;" 
        id="Page"
        v-loading="Waiting_Param"
        :element-loading-text="Waiting_Text"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(211, 211, 211, 0.6)">
        <!-- 我们写一个完全固定定死的右下角的变栏来跳转 -->
        <div class="Jump_Bar">
            <el-row 
                class="Jump_Item" 
                @click.native="Jump_To('Filter')">
                筛
            </el-row>
            <el-row 
                v-for="i in Question_List.length" 
                :key="'Jump_Item_' + i" 
                class="Jump_Item"
                @click.native="Jump_To('Question_' + (i-1))">
                {{i}}
            </el-row>
            <el-row 
                class="Jump_Item" 
                v-if="Question_List.length > 0" 
                @click.native="Jump_To('Page_Seg')">
                页
            </el-row>
        </div>
        <el-dialog
            :visible.sync="Complex_Input_Dialog"
            title="LUNA输入助手"
            width="65%"
            :modal-append-to-body="false"
            :close-on-click-modal="false">
            <ComplexInput @New_Content="Update_Complex_Input" :Get_Out_Content="Search_Content"></ComplexInput>
        </el-dialog>
        <!-- 按照设计稿写一个超巨大圆当背景用 -->
        <div class="Background_Round_Position">
            <div class="Background_Round">

            </div>
        </div>
        <!-- 查看分析报告 -->
        <el-dialog
            :visible.sync="Question_Analyse_Dialog"
            width="90%"
            :modal-append-to-body="false"
            :close-on-click-modal="true"
            :key="'Question_Analyse_' + Refresh">
            <template slot="title"></template>
            <el-row style="margin: 0px">
                <QuestionAnalyse :Ques="Question_Analyse_Info"></QuestionAnalyse>
            </el-row>
        </el-dialog>
        <!-- 图片检索的对话框 -->
        <el-dialog
            :visible.sync="Cropper_Dialog"
            title="图片检索"
            width="80%"
            :modal-append-to-body="false"
            :close-on-click-modal="false">
                <el-row type="flex" justify="start" style="margin-left: 2.4vw; margin-bottom: 20px">
                    <label style="margin-right: 3vw; margin-top: -0.3vh;">图片检索模式：</label>
                    <el-radio-group v-model="Img_Search_Type">
                        <el-radio :label="0" disabled>图例检索</el-radio>
                        <el-radio :label="1">内容识别</el-radio>
                    </el-radio-group>
                </el-row>
                <el-row style="margin: 0px; padding: 0px">
                <el-col :span="24">
                    <el-row type="flex" justify="center">
                        <VueCropper
                            style="width: 100%; height: 400px; margin-left: 2.4vw; margin-right: 2.4vw"
                            ref="cropper"
                            :img="Cropper_Option.img"
                            :autoCrop="Cropper_Option.autoCrop"
                            :canMove="Cropper_Option.canMove"
                            :centerBox="Cropper_Option.centerBox"
                            :canScale="Cropper_Option.canScale"
                            autoCropWidth="4096"
                            autoCropHeight="2048"
                        ></VueCropper>
                    </el-row>
                    <el-row type="flex" justify="start" style="margin-top: 30px;">
                        <el-col :span="4" :offset="4">
                            <el-row type="flex" justify="center">
                                <el-button
                                    type="primary"
                                    icon="el-icon-refresh-left"
                                    @click="Img_Rotate_Left()"
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
                                    @click="Img_Rotate_Right()"
                                    plain>
                                    向右旋转
                                </el-button>
                            </el-row>
                        </el-col>
                        <el-col :span="4">
                            <el-row type="flex" justify="center">
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="Img_Clear()"
                                    plain>
                                    清空关闭
                                </el-button>
                            </el-row>
                        </el-col>
                        <el-col :span="4">
                            <el-row type="flex" justify="center">
                                <el-button
                                    type="success"
                                    icon="el-icon-search"
                                    @click="Img_Cut_Data()"
                                    plain>
                                    确认切分
                                </el-button>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
                </el-row>

            </el-dialog>
        <!-- 面包屑行 -->
        <el-row type="flex" justify="start">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>
                    首页
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    试题检索
                </el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
        <!-- 页面标题行 -->
        <el-row type="flex" justify="start" style="margin-top: 2vh;">
            <span style="font-size: 4rem">试题检索</span>
        </el-row>
        <!-- 功能区 -->
        <el-row id="Filter" style="margin-bottom: 20px">
            <el-col :span="16" style="min-height: 400px;">
                <!-- 不同功能 -->
                <!-- 学段检索 -->
                <el-row type="flex" justify="start" class="Filter_Line">
                    <span class="Filter_Label">学段</span>
                    <div>
                        <span 
                            v-for="(Period_Item, Period_Item_Index) in All_Options.Period" :key="'Filter_Period_' + Period_Item_Index"
                            :class="Focus_Filter('Period', Period_Item)"
                            :style="Filter_Item('Period', Period_Item_Index)"
                            @click="Filter_Change('Period', Period_Item)">
                            {{Period_Item}}
                        </span>
                    </div>
                </el-row>
                <el-row type="flex" justify="start" class="Filter_Line">
                    <span class="Filter_Label">学科</span>
                    <div>
                        <span 
                            v-for="(Subject_Item, Subject_Item_Index) in All_Options.Subject" :key="'Filter_Subject_' + Subject_Item_Index"
                            :class="Focus_Filter('Subject', Subject_Item)"
                            :style="Filter_Item('Subject', Subject_Item_Index)"
                            @click="Filter_Change('Subject', Subject_Item)">
                            {{Subject_Item}}
                        </span>
                    </div>
                </el-row>
                <el-row type="flex" justify="start" class="Filter_Line">
                    <span class="Filter_Label">题型</span>
                    <div>
                        <span 
                            v-for="(Type_Item, Type_Item_Index) in All_Options.Type" :key="'Filter_Type_' + Type_Item_Index"
                            :class="Focus_Filter('Type', Type_Item)"
                            :style="Filter_Item('Type', Type_Item_Index)"
                            @click="Filter_Change('Type', Type_Item)">
                            {{Type_Item}}
                        </span>
                    </div>
                </el-row>
                <el-row type="flex" justify="start" class="Filter_Line">
                    <span class="Filter_Label">难度</span>
                    <span 
                        v-for="(Difficulty_Item, Difficulty_Item_Index) in All_Options.Difficulty" :key="'Filter_Difficulty_' + Difficulty_Item_Index"
                        :class="Focus_Filter('Difficulty', Difficulty_Item)"
                        :style="Filter_Item('Difficulty', Difficulty_Item_Index)"
                        @click="Filter_Change('Difficulty', Difficulty_Item)">
                        {{Difficulty_Item_Index != All_Options.Difficulty.length - 1 ? Difficulty_Item : Chosen_Options.Difficulty == '自定义' ? Difficulty_Value[0] + '~' + Difficulty_Value[1] : '自定义'}}
                    </span>
                    <el-slider
                        v-show="Chosen_Options.Difficulty == '自定义'"
                        v-model="Difficulty_Value"
                        range
                        style="width: 170px; border: 1px solid #ccc; padding: 0px 15px 0px 17px; border-radius: 10px; margin-left: 40px"
                        :step="0.01"
                        :max="1"
                        :min="0">
                    </el-slider>
                </el-row>
                <el-row type="flex" justify="start" class="Filter_Line">
                    <span class="Filter_Label">题库</span>
                    <span 
                        v-for="(Database_Item, Database_Item_Index) in All_Options.Database" :key="'Filter_Database_' + Database_Item_Index"
                        :class="Focus_Filter('Database', Database_Item.nick)"
                        :style="Filter_Item('Database', Database_Item_Index)"
                        @click="Filter_Change('Database', Database_Item.nick)">
                        {{Database_Item.nick}}
                    </span>
                </el-row>
                <el-row type="flex" justify="start" class="Filter_Line">
                    <span class="Filter_Label">匹配方式</span>
                    <span 
                        v-for="(Semantic_Item, Semantic_Item_Index) in All_Options.Semantic" :key="'Filter_Semantic_' + Semantic_Item_Index"
                        :class="Focus_Filter('Semantic', Semantic_Item)"
                        :style="Filter_Item('Semantic', Semantic_Item_Index)"
                        @click="Filter_Change('Semantic', Semantic_Item)">
                        {{Semantic_Item}}
                    </span>
                </el-row>
                <el-row type="flex" justify="start" class="Filter_Line">
                    <span class="Filter_Label">检索框</span>
                    <el-input 
                        v-model="Search_Content" 
                        :disabled="Search_Extra == 'ImgSearch'"
                        placeholder="请输入想要检索的试题文字内容"
                        style="width: 630px;"
                        class="Search_Input"></el-input>
                </el-row>
                <el-row type="flex" justify="start" class="Filter_Line" style="margin-top: 3vh">
                    <span class="Filter_Label"></span>
                    <!-- 开始检索的按钮 -->
                    <el-button 
                        type="primary" 
                        style="margin-right: 16px"
                        @click="Search_Do()">
                        <i class="el-icon-search" style="margin-right: 10px"></i>开始检索
                    </el-button>
                    <!-- 打开输入助手的按钮 -->
                    <el-button  
                        style="margin-right: 16px"
                        @click="Complex_Input_Dialog = true">
                        <span style="margin-right: 10px">&Sigma;</span>输入助手
                    </el-button>
                    <!-- 切换知识点过滤检索或者文件检索的按钮 -->
                    <el-button 
                        @click="Change_Search_Extra()">
                        <i class="el-icon-location" style="margin-right: 10px"></i>
                        {{Search_Extra == 'ImgSearch' ? '文件搜题' : '知识点过滤'}}模式
                    </el-button>
                </el-row>
            </el-col>
            <el-col :span="7" :offset="1" style="height: 512px" v-show="Search_Extra == 'ImgSearch'">
                <input 
                    type='file' 
                    id="ImgInput" 
                    ref="ImgInput"
                    :multiple="false"
                    @change="Img_Upload_Input($event)"
                    accept='.jpg, .jpeg, .png.'
                    style="display: none"/>
                <div 
                    id="ImgSearchArea" 
                    v-show="Img_All == ''"
                    @click="Img_Upload()"
                    class="ImgSearchArea"
                    style="cursor: pointer;">
                    <el-row style="margin-top: 40%">
                        <i class="el-icon-upload" style="font-size: 60px"></i><br/>
                        <span style="font-size: 18px; margin-top: 5px; margin-bottom: 5px; display: inline-block">点击或拖拽以上传</span><br/>
                        <span>支持图片检索</span>
                    </el-row>
                </div>
                <div
                    v-show="Img_All != ''"
                    style="">
                    <el-image
                        style="width: 100%; height: 100%"
                        :src="Img_Cut"
                        fit="contain"></el-image>
                </div>
                <el-row type="flex" justify="center" style="margin-top: 20px">
                    <el-button type="danger" style="margin-right: 25px" @click="Img_Clear()"><i class="el-icon-close" style="margin-right: 10px"></i>清空内容</el-button>
                    <el-button type="primary" @click="Img_Reset()"><i class="el-icon-refresh" style="margin-right: 10px"></i>重新编辑</el-button>
                </el-row>
            </el-col>
            <el-col :span="7" :offset="1" style="height: 430px;" v-show="Search_Extra == 'KnowledgePoint'">
                <div class="ImgSearchArea">
                    <el-row style="margin-top: 40%">
                        知识树的处理方案仍在商讨中...
                    </el-row>
                </div>
                <el-row type="flex" justify="center" style="margin-top: 20px">
                    <el-button type="danger"><i class="el-icon-close" style="margin-right: 10px"></i>清空知识点</el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-row 
            v-if="Question_List.length == 0"
            style="height: 300px; width: 100%">

        </el-row>
        <el-row 
            style="width: 100%;"
            class="Question_Card" 
            v-for="(Question, Question_Index) in Question_List" 
            :key="'Question_' + Question_Index" 
            :id="'Question_' + Question_Index">
            <NewSearchQuesItem 
                :Question="Question" 
                :Question_Index="Question_Index"
                @Check_Question_Analysis="Check_Question_Analysis"></NewSearchQuesItem>
        </el-row>
        <el-row 
            v-if="Question_List.length != 0" 
            id="Page_Seg"
            style="margin-top: 20px; margin-bottom: 20px">
            <el-pagination 
                @current-change="Page_Index_Change"
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
import NewSearchQuesItem from '@/views/testPage/New_SearchQues_Item'
import QuestionAnalyse from '@/views/testPage/New_QuestionAnalyse'
import ComplexInput from '@/common/components/ComplexInput'

export default {
  name: "",
  components:{
      NewSearchQuesItem, QuestionAnalyse, ComplexInput
  },
  data() {
    return {
        // 全部选项，用于显示
        All_Options:{
            Period: ["小学", "初中", "高中", "大学", "成人"],
            Subject: ["语文", "数学", "英语", "物理", "化学", "生物", "政治", "历史", "地理"],
            Type: ["单选题", "多选题", "判断题", "填空题", "计算题", "简答题", "其他"],
            Difficulty: ['容易', '较易', '中等', '较难', '困难', "自定义"],
            Database: [{name:'public',nick:'公共题库'}],
            Semantic: ["精确匹配", "语义匹配"]
        },
        // 选中的选项，用于显示样式的调整和检索的时候进行内容转换
        Chosen_Options: {
            Period: ["高中"],
            Subject: ["数学"],
            Type: ["单选题"],
            Difficulty: "中等",
            Database: [],
            Semantic: "精确匹配"
        },
        // 换页时使用的变量
        Page_Index: 1,
        // 换页时使用的总量数字
        Total_Count: 0,
        // 每页的长度，或每页有多少道题
        Page_Length: 5,
        // 难度的控制区域，只有当其内容为自定义的时候才应该实际生效
        // 但由于数据库题目的难度数据跟不上，所以实际检索的时候还是只能留[0, 1]的默认数据给难度
        Difficulty_Value: [0, 1],
        // 检索内容
        Search_Content: "",
        // 设定额外搜索条件，KnowledgePoint指知识点筛选模式，ImgSearch指图片检索模式
        // 可以通过点击按钮切换到另外一个模式
        Search_Extra: "KnowledgePoint",
        // 用于备份整张的图片，配合用于进行切分，默认值是空
        Img_All: "",
        // 用于保存拿来检索的图片被切分后的内容
        Img_Cut: "",
        // 用于保存图片点击组件
        ImgInput: "",
        // 标记图片检索模式
        Img_Search_Type: 1,
        // 控制cropper控件的设置项
        Cropper_Option:{
            img: "", // 裁剪图片的地址
            autoCrop: true, //是否默认生成截图框
            fixedBox: true, //固定截图框大小 不允许改变
            canMove: false,
            centerBox: true,
            canScale: false
        },
        // 控制图片切分组件是否显示
        Cropper_Dialog: false,
        // 控制检索结果的题目数组
        Question_List: [],
        // 记录上次检索的时候所使用的信息
        History_Chosen_Options:{
            Period: [],
            Subject: [],
            Type: [],
            Difficulty: "",
            Database: [],
            Semantic: "",
            Img: "",
            Search_Content: "",
        },
        Question_Analyse_Info: {
            // 解析，答案，章节，所属数据库，难度，区分度，试题ID，知识点
            // 考察能力，选项，是否真题，学段，质量，题型，可靠度，题干
            // 学科，类型
            analysis: "",
            answer: "",
            chapter: "",
            database: "",
            difficulty: "",
            discrimination: "",
            id: "",
            knowledge_points_frontend: {kp: [], kp_layer: [], kp_priority: []},
            literacy: "",
            options: ["", "", "", ""],
            pastpaper: "",
            period: "",
            quality: 0,
            que_type: "",
            rel: "",
            stem: "",
            subject: "",
            type: ""
        },
        Question_Analyse_Dialog: false,
        // 用于强制刷新试题分析报告的变量
        Refresh: false,
        // 用于表示正在等待的变量
        Waiting_Param: false,
        // 用于写文字来表示正在等待什么内容的变量
        Waiting_Text: "",
        // 输入助手的对话框
        Complex_Input_Dialog: false
    };
  },
  mounted(){
    this.InitDatabaseList()
    this.ImgInput = document.getElementById("ImgInput")
    let ImgSearchArea = document.querySelector('#ImgSearchArea');
    ImgSearchArea.addEventListener('dragenter', this.onDragIn, true);
    ImgSearchArea.addEventListener('dragleave', this.onDragOut, true);
    ImgSearchArea.addEventListener('drop', this.onDrop, false);
  },
  methods: {
        // 控制筛选项的样式显示
        // 参数分别是筛选项所属的属性，筛选项对应的索引值
        Filter_Item(Part, Index){
            return {
                "width": "70px",
                "height": "40px",
                "line-height": "40px",
                "text-align": "center",
                "display": "inline-block",
                "background": "white",
                "cursor": "pointer",
                "border-top-left-radius": Index == 0 ? "10px" : "0px",
                "border-bottom-left-radius": Index == 0 ? "10px" : "0px",
                "border-top-right-radius": Index == this.All_Options[Part].length - 1 ? "10px" : "0px",
                "border-bottom-right-radius": Index == this.All_Options[Part].length - 1 ? "10px" : "0px"
            }
        },
        // 样式筛选器，对比这个属性的这一项是否在Chosen_Options内，来对应不同的显示
        // 主要用于hover样式，来做成按钮的效果
        Focus_Filter(Part, Item){
            if(['Period', 'Subject', 'Type'].indexOf(Part) != -1){
                if(this.Chosen_Options[Part].indexOf(Item) == -1){
                    return "Unchosen_Option"
                }else{
                    return "Chosen_Option"
                }
            }else if(Part == 'Difficulty' || Part == 'Semantic'){
                if(this.Chosen_Options[Part] != Item){
                    return "Unchosen_Option"
                }else{
                    return "Chosen_Option"
                }
            }else if(Part == 'Database'){
                if(this.Chosen_Options.Database.indexOf(Item) == -1){
                    return "Unchosen_Option"
                }else{
                    return "Chosen_Option"
                }
            }
        },
        // 内容调整，控制选择项的内容
        Filter_Change(Part, Item){
            if(['Period', 'Subject', 'Type'].indexOf(Part) != -1){
                if(this.Chosen_Options[Part].indexOf(Item) == -1){
                    this.Chosen_Options[Part].push(Item)
                }else{
                    this.Chosen_Options[Part].splice(this.Chosen_Options[Part].indexOf(Item), 1)
                }
            }else if(Part == 'Difficulty' || Part == 'Semantic'){
                this.Chosen_Options[Part] = Item;
            }else if(Part == 'Database'){
                if(this.Chosen_Options[Part].indexOf(Item) == -1){
                    this.Chosen_Options[Part].push(Item)
                }else{
                    this.Chosen_Options[Part].splice(this.Chosen_Options[Part].indexOf(Item), 1)
                }
            }
        },
        // 老内容，检索用户可以使用的题库范围
        InitDatabaseList(){
            this.All_Options.Database = [{name:'public',nick:'公共题库'}]
            this.Chosen_Options.Database = ['公共题库']
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
                    this.All_Options.Database.push({name:data[i], nick: data[i]})
                }
            })
        },
        // 通过点击区域来激活图片选择用的input组件
        Img_Upload(){
            this.ImgInput.click();
        },
        // 实际处理图片选择事件
        Img_Upload_Input(event){
            if(event.target.files){
                // 获取图片
                let Pic = event.target.files[0];
                // 获取this对象
                const _this = this;
                // 重置input组件
                this.$refs.ImgInput.value = "";
                // Promise方法避免异步操作
                var promise = new Promise(function(resolve){
                    // 用文件读取来读取图片的base64格式代码
                    var reader = new FileReader();
                    reader.readAsDataURL(Pic);
                    reader.onloadend = function (e) {
                        resolve(e.target.result);
                    };
                });
                promise.then(function(imageData){
                    // 用捕捉到的this对象来进行搜索
                    _this.Cropper_Option.img = imageData;
                    _this.Img_All = imageData;
                    _this.Img_Cut = imageData;
                    _this.Cropper_Dialog = true;
                }).catch(function(){
                    // 报错了就打印错误
                    // console.log(error)
                })
            }else{
                return
            }
        },
        // 拖拽文件的多个相关方法，和以前的意思一样，只是换了变量的几个名字罢了
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
          this.$refs.ImgInput.value = "";
          this.$refs.cropper.refresh();
        },
        //图片预览
        imgPreview (files) {
          const _this = this;
          let read = new FileReader();
          read.readAsDataURL(files[0]);
          read.onloadend = function () {
            _this.Cropper_Option.img = read.result;
            _this.Img_All = read.result;
            _this.Img_Cut = read.result;
            _this.Cropper_Dialog = true;
          }
        },
        // 图片左旋右旋
        // 左旋转
        Img_Rotate_Left() {
          this.$refs.cropper.rotateLeft();
        },
        // 右旋转
        Img_Rotate_Right() {
          this.$refs.cropper.rotateRight();
        },
        // 生成blob图片
        Img_Cut_Data() {
          this.$refs.cropper.getCropData((data) => {
              this.Cropper_Dialog = false;
              this.Img_Cut = data
          })
        },
        // 图片清理
        Img_Clear(){
            this.Img_Cut = ""
            this.Img_All = ""
            this.Chosen_Options.img = ""
            this.Cropper_Dialog = false
        },
        // 图片重置，用备份的图片重新替换切分图片和原有图片
        Img_Reset(){
            this.Chosen_Options.img = this.Img_All;
            this.Img_Cut = this.Img_All;
            this.Cropper_Dialog = true;
        },
        // 获取知识树的方法
        // 获取知识树
        Init(){

            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                emulateJSON: true
            }

            let param = new FormData();

            param.append('system', 'tiku');
            param.append('subject', this.Subject);
            param.append('period', this.Period);

            this.$http
                .post(this.backendIP + "/api/getKnowledgeSystem", param, config)
                .then(function(data) {
                    this.TreeData = data.body.knowledge_system
                    this.$refs.tree.setCheckedKeys([])
                    this.waiting = false;
                })
        },
        // 切换检索类型，如果是文字，则图片内容部分自动清空，如果是图片，则文字部分内容自动清空
        // 紧接着是各种属性值的重置
        Change_Search_Extra(){
            this.$confirm('即将切换输入类型至 ' + (this.Search_Extra == 'ImgSearch' ? '文字检索' : '文件检索') + ' 模式，将清空之前的检索内容，确定切换吗？', '提示', {
                confirmButtonText: '确定切换',
                cancelButtonText: '取消切换',
                type: 'warning'
            }).then(() => {
                if(this.Search_Extra == 'ImgSearch'){
                    this.Img_Clear()
                }else{
                    this.Search_Content = ""
                }
                this.Search_Extra = this.Search_Extra == 'ImgSearch' ? 'KnowledgePoint' : 'ImgSearch'
                this.History_Chosen_Options = {
                    Period: [],
                    Subject: [],
                    Type: [],
                    Difficulty: "",
                    Database: [],
                    Semantic: "",
                    Img: "",
                    Search_Content: "",
                }
                this.Question_List = []
                this.Page_Index = 1
            }).catch(() => {

            })
            
        },
        // 检索用的方法
        Search_Do(){

            this.Page_Index_Change_Check()

            this.Waiting_Param = true;
            this.Waiting_Text = "正在搜索试题..."

            let Param = {}
            if(this.Search_Extra == 'ImgSearch'){
                Param.pic = this.Img_Cut
            }

            let Data = {
                "content": this.Search_Extra == 'ImgSearch' ? "" : this.Search_Content,
                "size": 5,
                "database": [],
                "page_count": this.Page_Index,
                "subject": this.Chosen_Options.Subject,
                "period": this.Chosen_Options.Period,
                "type": this.Chosen_Options.Type,
                "difficulty": [0.0, 1.0],
                "semantic": this.Chosen_Options.Semantic == '精准匹配' ? 0 : 1
            }

            for(let i = 0; i < this.Chosen_Options.Database.length; i++){
                for(let j = 0; j < this.All_Options.Database.length; j++){
                    if(this.Chosen_Options.Database[i] == this.All_Options.Database[j].nick){
                        Data.database.push(this.All_Options.Database[j].name)
                    }
                }
            }

            Param.data = JSON.stringify(Data)

            commonAjax(this.backendIP+'/api/search', Param)
            .then((data)=>{
                this.Total_Count = data.totalLength
                this.Page_Length = 5
                this.Question_List = [];
                for(let i = 0; i < data.results.length; i++){
                    this.Question_List.push(data.results[i])
                }
                this.Waiting_Param = false
                this.Waiting_Text = ""
                setTimeout(()=>{
                    document.getElementById('Question_0').scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
                }, 100)
            })

            return 
        },
        // 滚动到顶部
        Page_Index_Change(){
            this.Search_Do()
        },
        // 检测是否需要把Page_Index页码调整为1
        Page_Index_Change_Check(){
            let Flag = false
            let Keys = ["Period", "Subject", "Type", "Difficulty", "Database", "Semantic"]
            for(let i = 0; i < Keys.length; i++){
                let key = Keys[i]
                if(JSON.stringify(this.History_Chosen_Options[key]) != JSON.stringify(this.Chosen_Options[key])){
                    Flag = true
                    this.History_Chosen_Options[key] = JSON.parse(JSON.stringify(this.Chosen_Options[key]))
                }
            }
            if(JSON.stringify(this.History_Chosen_Options.Img) != JSON.stringify(this.Img_Cut)){
                Flag = true;
                this.History_Chosen_Options.Img = JSON.parse(JSON.stringify(this.Img_Cut))
            }
            if(JSON.stringify(this.History_Chosen_Options.Search_Content) != JSON.stringify(this.Search_Content)){
                Flag = true;
                this.History_Chosen_Options.Search_Content = JSON.parse(JSON.stringify(this.Search_Content))
            }
            if(Flag){
                this.Page_Index = 1
            }
        },
        // 跳转到某个组件的位置
        Jump_To(Part){
            document.getElementById(Part).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
        },
        Check_Question_Analysis(Info){
            this.Waiting_Param = true;
            this.Waiting_Text = "正在检索分析报告..."
            let Ques_Info = JSON.parse(Info)
            commonAjax(this.backendIP+'/api/questionAnalyse',
                {
                    databasename: Ques_Info.Database == '公开题库' ? 'public' : Ques_Info.Database,
                    ID: Ques_Info.ID
                }
            ).then((data)=>{
                this.Question_Analyse_Info = data.que_dic
                this.Question_Analyse_Dialog = true
                this.Refresh = !this.Refresh
                this.Waiting_Param = false;
                this.Waiting_Text = ""
            })
        },
        // 更新富文本输入框内容
        Update_Complex_Input(val){
            console.log(val)
            this.Complex_Input_Dialog = false;
            this.Search_Content = val
        }
    }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Filter_Line{
    margin: 24px 0;
    min-width: 720px;
}

.Filter_Label{
    width: 90px; 
    font-size: 18px; 
    font-weight: bold;
    height: 40px; 
    line-height: 40px; 
    text-align: left;
}

.Unchosen_Option{
    color: #333;
    border: 1px solid #ccc;
    box-sizing: border-box;
    box-shadow: 0px 6px 24px rgba($color: #000, $alpha: 0.12);
}

.Unchosen_Option:hover{
    color: rgba($color: #409EFF, $alpha: 0.6);
    border: 1px solid rgba($color: #409EFF, $alpha: 0.6);
    box-sizing: border-box;
}

.Chosen_Option{
    color: #409EFF;
    border: 1px solid #409EFF;
    box-sizing: border-box;
    box-shadow: 0px 6px 24px rgba($color: #000, $alpha: 0.12);
}

.Search_Input ::v-deep .el-input__inner{
    border-radius: 10px;
    border: 2px solid #ddd
}

.Jump_Bar{
    position: absolute;
    right: 45px;
    bottom: 20px;
    width: 40px;
    min-height: 40px;
}

.Jump_Item{
    width: 40px; 
    height: 40px;
    line-height: 40px; 
    margin-bottom: 12px;
    border-radius: 5px;
    background: white;
    cursor: pointer;
    border: 1px solid #aaa;
    box-shadow: 2px 2px 1px 1px rgba($color: #AAAAAA, $alpha: 0.6);
    z-index: 5;
    font-size: 22px;
}

.Background_Round{
    position: relative;
    width: 1000px;
    height: 1000px;
    border-radius: 50%;
    background: rgba($color: #409EFF, $alpha: 0.3);
    z-index: -1;
}

.Background_Round_Position{
    position: absolute;
    right: 0px;
    top: -380px;
    width: 850px;
    background: transparent;
    z-index: -1;
    overflow: hidden;
}

.Question_Card{
    background: white;
    box-shadow: 0px 6px 24px rgba($color: #000, $alpha: 0.12);
    margin: 64px 0;
    border-radius: 10px;
    opacity: 0.95;
}

.ImgSearchArea{
    width: 100%; 
    height: 452px; 
    border: 1px solid #ccc; 
    border-radius: 15px; 
    text-align: center; 
    background: white;
    box-shadow: 0px 6px 24px rgba($color: #000, $alpha: 0.12);
}
</style>
