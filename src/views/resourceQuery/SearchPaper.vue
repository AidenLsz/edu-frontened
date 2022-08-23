<template>
    <div
        id="Page"
        v-loading.fullscreen.lock="Waiting_Param"
        :element-loading-text="Waiting_Text"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.28)">
        <div id="Filter" class="Top_Nav">

    </div>
        <LunaProgress
            v-if="Paper_Analysing"
            :Bar_Type="'time'"
            :Duration_Time="6"
            :Loading_Text.sync="Paper_Analysing_Text">

        </LunaProgress>
        <!-- 我们写一个完全固定定死的右下角的变栏来跳转 -->
        <div class="Jump_Bar">
            <el-row
                class="Jump_Item"
                @click.native="Jump_To('Filter')">
                <i class="el-icon-download" style="transform: rotate(180deg);"></i>
            </el-row>
            <el-row
                v-for="i in Paper_Info_List.length"
                :key="'Jump_Item_' + i"
                class="Jump_Item"
                @click.native="Jump_To('Question_' + (i-1))">
                {{i}}
            </el-row>
            <el-row
                class="Jump_Item"
                v-if="Paper_Info_List.length > 0"
                @click.native="Jump_To('Page_Seg')">
                <i class="el-icon-download"></i>
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
        <!-- 图片检索的对话框 -->
        <el-dialog
            :visible.sync="Cropper_Dialog"
            title="图片编辑"
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
            <instruction
                ref="instruction"
            />
      <div class="sp-container">
        <el-row type="flex" justify="center" style="padding-top: 90px" class="Main_Background">
          <el-col>
            <div class="Background_Round">

            </div>
            <!-- 功能区 -->
            <el-row class="Padding_Width">
              <el-col :span="16" style="min-height: 320px;">
                <!-- 不同功能 -->
                <!--学科检索-->
                <el-row type="flex" justify="start" class="Filter_Line">
                  <span class="Filter_Label">学科</span>
                  <div class="Filter_Item_Shadow">
                                <span
                                    v-for="(Subject_Item, Subject_Item_Index) in All_Options.Subject" :key="'Filter_Subject_' + Subject_Item_Index"
                                    :class="Focus_Filter('Subject', Subject_Item)"
                                    :style="Filter_Item('Subject', Subject_Item_Index, Subject_Item)"
                                    @click="Filter_Change('Subject', Subject_Item)">
                                    {{Subject_Item}}
                                </span>
                  </div>
                </el-row>
                <!-- 学段检索 -->
                <el-row type="flex" justify="start" class="Filter_Line">
                  <span class="Filter_Label">学段</span>
                  <div class="Filter_Item_Shadow">
                                <span
                                    v-for="(Period_Item, Period_Item_Index) in All_Options.Period" :key="'Filter_Period_' + Period_Item_Index"
                                    :class="Focus_Filter('Period', Period_Item)"
                                    :style="Filter_Item('Period', Period_Item_Index, Period_Item)"
                                    @click="Filter_Change('Period', Period_Item)">
                                    {{Period_Item}}
                                </span>
                  </div>
                </el-row>
                <!--                      搜索方式-->
                <el-row type="flex" justify="start" class="Filter_Line">
                  <span class="Filter_Label">搜索方式</span>
                  <div class="Filter_Item_Shadow">
                                <span
                                    v-for="(searchMethod_Item, searchMethod_Item_Index) in All_Options.searchMethod" :key="'Filter_search_' + searchMethod_Item_Index"
                                    :class="Focus_Filter('searchMethod', searchMethod_Item)"
                                    :style="Filter_Item('searchMethod', searchMethod_Item_Index, searchMethod_Item)"
                                    @click="Filter_Change('searchMethod', searchMethod_Item)">
                                    {{searchMethod_Item}}
                                </span>
                  </div>
                </el-row>
                <el-row type="flex" justify="start" class="Filter_Line">
                  <span class="Filter_Label">题库</span>
                  <div class="Filter_Item_Shadow">
                                <span
                                    v-for="(Database_Item, Database_Item_Index) in All_Options.Database" :key="'Filter_Database_' + Database_Item_Index"
                                    :class="Focus_Filter('Database', Database_Item.nick)"
                                    :style="Filter_Item('Database', Database_Item_Index, Database_Item.nick)"
                                    @click="Filter_Change('Database', Database_Item.nick)">
                                    {{Database_Item.nick}}
                                </span>
                  </div>
                </el-row>
                <el-row type="flex" justify="start" class="Filter_Line">
                  <span class="Filter_Label">检索框</span>
                  <el-input
                      v-model="Search_Content"
                      :disabled="Search_Extra == 'ImgSearch'"
                      @keyup.enter.native="Search_Do()"
                      placeholder="请输入想要检索的试题文字内容"
                      style="width: 630px;"
                      class="Search_Input"></el-input>
                </el-row>
                <el-row type="flex" justify="start" class="Filter_Line" style="margin-top: 3vh">
                  <span class="Filter_Label"></span>
                  <!-- 开始检索的按钮 -->
                  <el-button
                      type="primary"
                      style="margin-right: 16px; border-radius: 10px;"
                      class="Search_Button"
                      @click="Search_Do()">
                    <i class="el-icon-search" style="margin-right: 4px"></i>开始检索
                  </el-button>
                  <!-- 打开输入助手的按钮 -->
                  <el-button
                      style="margin-right: 16px;margin-left: 0px; border-radius: 10px;"
                      @click="Complex_Input_Dialog = true">
                    <span style="margin-right: 4px">&Sigma;</span>输入助手
                  </el-button>
                  <!-- 切换知识点过滤检索或者文件检索的按钮 -->
                  <el-switch
                      style="display: block; margin-top: 9px; margin-left: 10px;"
                      v-model="Search_Extra"
                      @change="Change_Search_Extra"
                      active-color="#409EFF"
                      inactive-color="#13ce66"
                      active-text="图片检索模式"
                      active-value="ImgSearch"
                      inactive-text="纯文字检索模式"
                      inactive-value="KnowledgePoint">
                  </el-switch>
                  <!-- <el-button
                      style="border-radius: 10px;"
                      @click="Change_Search_Extra()">
                      <i class="el-icon-location" style="margin-right: 4px"></i>
                      {{Search_Extra == 'ImgSearch' ? '文件搜题' : '纯文字检索'}}模式
                  </el-button> -->
                </el-row>
              </el-col>
              <el-col :span="7" :offset="1" style="height: 320px;" v-show="Search_Extra == 'ImgSearch'">
                <input
                    type='file'
                    id="ImgInput"
                    ref="ImgInput"
                    :multiple="false"
                    @change="File_Upload_Input($event)"
                    accept='.jpg, .jpeg, .png'
                    style="display: none"/>
                <div
                    id="ImgSearchArea"
                    v-show="Img_All == ''"
                    @click="Img_Upload()"
                    class="ImgSearchArea"
                    style="cursor: pointer;">
                  <el-row style="margin-top: 20%">
                    <i class="el-icon-upload" style="font-size: 60px"></i><br/>
                    <span style="font-size: 18px; margin-top: 5px; margin-bottom: 5px; display: inline-block">点击或粘贴以上传</span><br/>
                    <span>支持JPG，JPEG，PNG图片</span>
                  </el-row>
                </div>
                <div
                    v-show="Img_All != ''"
                    class="ImgSearchArea"
                    style="">
                  <el-image
                      style="width: 100%; height: 100%"
                      :src="Img_Cut"
                      fit="contain"></el-image>
                </div>
                <el-row type="flex" justify="center" style="margin-top: 20px">
                  <el-button type="danger" style="margin-right: 25px; border-radius: 10px" @click="Img_Clear()"><i class="el-icon-close" style="margin-right: 4px"></i>清空内容</el-button>
                  <el-button type="primary" style="border-radius: 10px; background: #539DD9" @click="Img_Reset()"><i class="el-icon-refresh" style="margin-right: 4px"></i>重新编辑</el-button>
                </el-row>
              </el-col>
            </el-row>
            <el-row
                v-if="Paper_Info_List.length == 0"
                style="height: 200px; line-height: 200px; width: 100%; font-weight: bold; font-size: 24px; color: #ccc"
                type="flex" justify="center">
              暂无检索结果
            </el-row>
            <el-row
                v-else
                style="height: 128px; line-height: 40px; width: 100%; padding-top: 20px;"
                type="flex"
                justify="center">
              <i
                  class="el-icon-d-arrow-left"
                  @click="Jump_To('Question_0')"
                  style="font-size: 40px; transform: rotate(270deg); opacity: 0.5; cursor: pointer; z-index: 1;"></i>
            </el-row>
          </el-col>
        </el-row>
        <div class="sp-left_container">
        <el-row>
          <el-col style="margin-top: 35%">
            <div
                v-for="(Paper_Info, Paper_Info_Index) in Paper_Info_List"
                :style="Get_Card_Background()"
                :key="'Question_' + Paper_Info_Index">
              <el-row style="padding-bottom: 75%">
                <div
                    :id="'Question_' + Paper_Info_Index"
                    style="height: 10px; width: 10px; background:transparent;position: relative; margin-top: -192px">

                </div>
              </el-row>
              <el-row>
                <div
                    :style="Get_Card_Margin(Paper_Info_Index)"
                >
                  <el-row style="width: 100%; height: 1%; background: transparent; opacity: 0; z-index: -1; border-top: 1px solid red;margin-bottom: -16%;">

                  </el-row>
                  <el-row class="Question_Card" style="background: white">
                    <SearchPaperItem
                        :Paper_Info="Paper_Info"
                        :Paper_Info_Index="Paper_Info_Index"
                        @Paper_Detail="Paper_Detail"
                        @Paper_Analyse="Paper_Analyse"
                    ></SearchPaperItem>
                  </el-row>
                </div>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row
            v-if="Paper_Info_List.length != 0"
            id="Page_Seg"
            style="padding-top: 20px; padding-bottom: 20px; background: transparent">
          <el-pagination
              @current-change="Page_Index_Change"
              :current-page.sync="Page_Index"
              :page-size="Page_Length"
              layout="total, prev, pager, next"
              :total="Total_Count">
          </el-pagination>
        </el-row>
          </div>
      </div>

    </div>
</template>

<script>

import * as variable from '@/common/utils/variable'
import SearchPaperItem from '@/views/resourceQuery/components/SearchPaperItem'
import ComplexInput from '@/common/components/ComplexInput'

import Instruction from '@/views/resourceQuery/components/InstructionExercise.vue'
import LunaProgress from '@/common/components/LunaProgress'

import {commonAjax} from '@/common/utils/ajax'
import {LRStrip} from '@/common/utils/strip'

export default {
  name: "",
  components:{
      SearchPaperItem, ComplexInput, Instruction, LunaProgress
  },
  data() {
    return {
        // 全部选项，用于显示
        All_Options:{
            Period: ["小学", "初中", "高中", "大学", "成人"],
            Subject: ["语文", "数学", "英语", "物理", "化学", "生物", "政治", "历史", "地理"],
            Database: [{name:'public',nick:'公共题库'}],
            searchMethod: ['试卷内容', '试卷题目']
        },
        // 选中的选项，用于显示样式的调整和检索的时候进行内容转换
        Chosen_Options: {
            Period: ["高中"],
            Subject: ["数学"],
            Database: ['公共题库'],
            searchMethod: ['试卷内容']
        },
        // 换页时使用的变量
        Page_Index: 1,
        // 换页时使用的总量数字
        Total_Count: 0,
        // 每页的长度，或每页有多少道题
        Page_Length: 5,
        // 检索内容
        Search_Content: "",
        // 设定额外搜索条件，KnowledgePoint指知识点筛选模式，ImgSearch指图片检索模式
        // 可以通过点击按钮切换到另外一个模式
        Search_Extra: "KnowledgePoint",
        Search_Extra_Switch: false,
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
        Paper_Info_List: [],
        // 记录上次检索的时候所使用的信息
        History_Chosen_Options:{
            Period: [],
            Subject: [],
            Database: [],
            Img: "",
            Search_Content: "",
        },
        // 用于表示正在等待的变量
        Waiting_Param: false,
        // 用于写文字来表示正在等待什么内容的变量
        Waiting_Text: "",
        // 输入助手的对话框
        Complex_Input_Dialog: false,
        // 暂时获得了分析报告的试卷ID
        Paper_Cache_ID: "",
        // 正在获取分析报告的进度条显示变量和显示文字
        Paper_Analysing: false,
        Paper_Analysing_Text: "",
        Paper_Analysing_Over_Time: false
    };
  },
  destroyed(){
    let ImgSearchArea = document.getElementById('ImgSearchArea');
    ImgSearchArea.removeEventListener('dragenter', this.onDragIn, true);
    ImgSearchArea.removeEventListener('dragleave', this.onDragOut, true);
    ImgSearchArea.removeEventListener('drop', this.onDrop, true);
    window.removeEventListener('paste', this.Paste_Function)
  },
  computed:{
    multiExerciseMap(){
      return variable.multiExerciseMap
    }
  },
  mounted(){

    if(!this.$store.state.user.name || this.$store.state.user.name.length == 0){
      this.$message.error("您尚未登录，请登录后使用录入功能。")
      this.$router.push("/")
      return
    }
    this.Get_User_UUID();
    this.Init_File_Selector();
    this.To_Top();

    this.InitDatabaseList()
    this.ImgInput = document.getElementById("ImgInput")
    let ImgSearchArea = document.getElementById('ImgSearchArea');
    ImgSearchArea.addEventListener('dragenter', this.onDragIn, true);
    ImgSearchArea.addEventListener('dragleave', this.onDragOut, true);
    ImgSearchArea.addEventListener('drop', this.onDrop, true);
    window.addEventListener('paste', this.Paste_Function);
    this.To_Top();
    setTimeout(()=>{
        if (sessionStorage.getItem("ITAS_Content")) {
            this.Search_Content = sessionStorage.getItem("ITAS_Content");
            sessionStorage.removeItem("ITAS_Content")
            this.Search_Do()
        }
    }, 100)
  },
  watch:{

  },
  updated() {

  },
  methods: {
      To_Top(){
          document.getElementById("Filter").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
      },
      openInstructionDialog(){
            this.$refs.instruction.openDialog();
        },
        // 粘贴事件
        Paste_Function(e){
            if(this.Search_Extra == 'ImgSearch'){
                const _this = this;
                let Pic = e.clipboardData.items[0].getAsFile();
                // Promise方法避免异步操作
                var promise = new Promise(function(resolve){
                    // 用文件读取来读取图片的base64格式代码
                    var reader = new FileReader();
                    reader.readAsDataURL(Pic);
                    reader.onloadend = function (e) {
                        resolve(e.target.result);
                    };
                });
                promise.then(function(ImgData){
                    _this.Img_All = ImgData
                    _this.Cropper_Option.img = ImgData;
                    _this.Img_Cut = ImgData
                    _this.Cropper_Dialog = true;
                }).catch(function(){
                    // 报错了就打印错误
                    alert("您最新的粘贴对象不是图片内容。")
                })
            }
        },
        // 控制筛选项的样式显示
        // 参数分别是筛选项所属的属性，筛选项对应的索引值
        Filter_Item(Part){
            let WIDTH = ['Database', 'Semantic'].indexOf(Part) != -1 ? '105px': '70px'
            return {
                "width": WIDTH,
                "height": "40px",
                "line-height": "40px",
                "text-align": "center",
                "display": "inline-block",
                "box-sizing": "border-box",
                "background": "white",
                "cursor": "pointer",
                "border-top-left-radius":"10px",
                "border-bottom-left-radius":"10px",
                "border-top-right-radius": "10px",
                "border-bottom-right-radius": "10px",
                "margin-right":"10px",
                "margin-top":"10px",
                "background-color":"#EDEFF2"
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
            }else if(Part === 'searchMethod'){
              if(this.Chosen_Options.searchMethod.indexOf(Item) === -1){
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
            }else if(Part === 'searchMethod'){
              if(this.Chosen_Options[Part].indexOf(Item) === -1){
                this.Chosen_Options[Part].pop()
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
                    this.All_Options.Database.push({name:data[i], nick: "个人题库" + (data.length > 1 ? (i+1) + "" : "")})
                }
            })
        },
        // 通过点击区域来激活图片选择用的input组件
        Img_Upload(){
            this.ImgInput.click();
        },
        File_Upload_Input(event){
          if (/image\/\w+/.test(event.target.files[0].type)) {
            this.Img_Upload_Input(event)
          }else {
            return
          }
        },
        // Confirm_Paper_Type(){
        // },
        handleSearch(ItemContent,Search_Type){
          this.Search_Extra = Search_Type
          if (Search_Type == 'ImgSearch') {
            this.Img_Cut = ItemContent
          }else{
            this.Search_Content = ItemContent
          }
          this.Search_Do()
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
          e.preventDefault();
        },
        onDragOut (e) {
          e.preventDefault();
        },
        onDrop (e) {
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
        // 切换检索类型，如果是文字，则图片内容部分自动清空，如果是图片，则文字部分内容自动清空
        // 紧接着是各种属性值的重置
        Change_Search_Extra(val){
            if(val == 'ImgSearch'){
                this.Search_Content = ""
            }else{
                this.Img_Clear()
            }
            this.History_Chosen_Options = {
                Period: [],
                Subject: [],
                Database: [],
                Img: "",
                Search_Content: "",
            }
            this.Paper_Info_List = []
            this.Page_Index = 1
        },
        Finish_Loading(){
            this.Paper_Analysing_Over_Time = true;
        },
        // 检索用的方法
        Search_Do(){

            this.Page_Index_Change_Check()

            let Param = {}
            if(this.Search_Extra == 'ImgSearch'){
                Param.pic = this.Img_Cut
            }else{
                let Striped_Content = LRStrip(this.Search_Content)
                if(Striped_Content == ""){
                    this.$message.info("请输入内容")
                    this.Search_Content = ""
                    return
                }else{
                    this.Search_Content = Striped_Content
                }
            }

            this.Waiting_Param = true;
            this.Waiting_Text = "正在搜索试题..."

            let Database = []
            for(let i = 0; i < this.Chosen_Options.Database.length; i++){
                for(let j = 0; j < this.All_Options.Database.length; j++){
                    if(this.Chosen_Options.Database[i] == this.All_Options.Database[j].nick){
                        Database.push(this.All_Options.Database[j].name)
                    }
                }
            }

            let Data = JSON.stringify({
                'search_type': this.Chosen_Options.searchMethod[0]==='试卷内容' ? 0 : 1,
                "content": this.Search_Extra === 'ImgSearch' ? "" : this.Search_Content,
                "size": 5,
                "database": Database,
                "page_count": this.Page_Index,
                "subject": this.Chosen_Options.Subject,
                "period": this.Chosen_Options.Period
            })

            Param.data = Data

            commonAjax(this.backendIP+'/api/search_paper', Param)
            .then((data)=>{
                this.Paper_Info_List = [];
                if(data.paper_id_list.length > 0){

                    for(let i = 0; i < data.paper_id_list.length; i++){
                      this.Paper_Info_List.push({
                        id: data.paper_id_list[i],
                        Ques: data.question_list[i],
                        title: data.paper_title_list[i]
                      })
                    }
                    this.Total_Count = data.totalLength;
                    console.log(this.Paper_Info_List)
                    setTimeout(()=>{
                        document.getElementById('Question_0').scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
                    }, 100)
                }else{
                    this.$message.warning("没有找到符合的结果，请尝试修改选项。")
                    this.Jump_To('Filter');
                }
            }).catch(()=>{
                this.$message.error("服务器好像开小差了，请稍后再试。")
                this.Jump_To('Filter');
            }).finally(()=>{
                this.Waiting_Param = false
                this.Waiting_Text = ""
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
            let Keys = ["Period", "Subject", "Database"]
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
        // 更新富文本输入框内容
        Update_Complex_Input(val){
            this.Complex_Input_Dialog = false;
            this.Search_Content = val
        },
        Get_Card_Background(){
            let Style = {
                'background':'white',
                'width': "55%",
            }
            return Style
        },
        Get_Card_Margin(Question_Index){
            let Style_Row_0 = '-128px auto 64px auto'
            let Style_Row_1 = '-128px auto 128px auto'
            let Style = {
                'margin': Question_Index == this.Paper_Info_List.length - 1 ? Style_Row_0 : Style_Row_1,
                'min-width': '500px',
            }
            return Style
        },
        // 展开后回到此题的初始位置
        Expand_Aim(val){
            let Aim = JSON.parse(val).Aim;
            this.Jump_To(Aim)
        },
        // 修改当前展示的试题的内容
        Paper_Detail(ID){

          this.Paper_Analysing = true;
          this.Paper_Analysing_Over_Time = false;
          this.Paper_Analysing_Text = "正在获取整张试卷的全部试题内容..."

          if(this.Paper_Cache_ID == ID){
            let routeData = this.$router.resolve({ path: '/paperDetailShow' });
            window.open(routeData.href, '_blank');
            this.$message.success("试题详情内容已在新页面展开。");
            this.Paper_Analysing = false;
            this.Paper_Analysing_Text = "";
            return
          }

          commonAjax(this.backendIP+'/api/paperJsonGet',
            {
              Database_Name: "LUNA",
              Paper_ID: ID
            }
          ).then((data)=>{
            this.Paper_Analysing = false;
            this.Paper_Analysing_Text = "";
            if(data.Paper_Json.status == "FAIL"){
              this.$message.error("服务器繁忙，请稍后再试。")
              return
            }
            this.Paper_Cache_ID = ID;
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
        Paper_Analyse(ID){

            this.Paper_Analysing = true;
            this.Paper_Analysing_Over_Time = false;
            this.Paper_Analysing_Text = "正在获取整张试卷分析报告..."

            if(this.Paper_Cache_ID == ID && sessionStorage.getItem("PaperDetailShow")){
                let Temp = JSON.parse(sessionStorage.PaperDetailShow);
                sessionStorage.PaperJson = JSON.stringify(Temp);
                let routeData = this.$router.resolve({ path: '/paperAnalyse' });
                window.open(routeData.href, '_blank');
                this.$message.success("试卷分析报告已在新页面展开。");
                this.Paper_Analysing = false;
                this.Paper_Analysing_Text = "";
                return
            }



          commonAjax(this.backendIP+'/api/paperJsonGet',
            {
              Database_Name: "LUNA",
              Paper_ID:ID
            }
          ).then((data)=>{
            this.Paper_Analysing = false;
            this.Paper_Analysing_Text = "";
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
    }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sp-left_container{
  flex-grow:3;
  max-width: 24%;
}
.sp-container{
  display:flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}
.Filter_Line{
    display: flex;
    flex-direction: column;
    margin: 24px 0;
    min-width: 28vw;
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
}

.Unchosen_Option:hover{
    color: rgba($color: #409EFF, $alpha: 0.6);
    // border: 1px solid rgba($color: #409EFF, $alpha: 0.6);
    box-sizing: border-box;
}

.Chosen_Option{
    color: #409EFF;
    border: 1px solid #409EFF;
    box-sizing: border-box;
}

.Search_Input ::v-deep .el-input__inner{
    border-radius: 10px;
    border: 1px solid rgba($color: #000, $alpha: 0.14);
    box-shadow: 0px 4px 12px rgba($color: #000, $alpha: 0.06);
    display:flex;
    width:30vw;
}

.Jump_Bar{
    position: absolute;
    right: 45px;
    bottom: 20px;
    width: 40px;
    min-height: 40px;
}

.Jump_Item{
    width: 36px;
    height: 36px;
    line-height: 36px;
    margin-bottom: 12px;
    border-radius: 7px;
    background: white;
    cursor: pointer;
    border: 1px solid #aaa;
    box-shadow: 0px 4px 12px rgba($color: #000, $alpha: 0.06);
    z-index: 5;
    font-size: 16px;
}

.Background_Round{
    position: absolute;
    overflow: hidden;
    width: 1000px;
    height: 1000px;
    margin-left: calc((100% - 1344px - 16px)/2);
    left: 600px;
    top: -55%;
    border-radius: 50%;
    background: linear-gradient( 180deg, rgba(#D9E9FE, 0%), rgba(#C8E0FF, 100%));
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.06);
    z-index: -1;
}

.Background_Round_Position{
    position: absolute;
    right: 0px;
    width: 850px;
    background: transparent;
    overflow: hidden;
    z-index: -1;
}

.Question_Card{
    box-shadow: 0px 6px 24px rgba($color: #000, $alpha: 0.12);
    min-width: 55vw;
    margin: 0 auto;
    border-radius: 10px;
    opacity: 0.95;
}

.ImgSearchArea{
    width: 100%;
    height: 240px;
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 15px;
    text-align: center;
    background: white;
    box-shadow: 0px 6px 24px rgba($color: #000, $alpha: 0.12);
}

.Filter_Item_Shadow{
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.Padding_Width{
    padding-right: 88px;
    padding-left: 88px;
}

.Main_Background{
    max-width: 40vw;
    overflow-x: hidden;
    margin-top: -70px;
    padding-bottom: 64px;
    margin-bottom: 64px;
  flex-grow: 1;
}

.Search_Button{
    background: #539DD9;
    transition-duration: 300ms;
}

.Search_Button:hover{
    background: #4484B8;
}

.Top_Nav{
    position: relative;
    top: -90px;
    width: 10px;
    height: 10px;
    background: transparent;
}
</style>
