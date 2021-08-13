<template>
    <div
        v-loading="Picture_Loading"
        element-loading-text="正在加载图片，请稍后..."
        element-loading-spinner="el-icon-loading"
        >
        <!-- 顶部行 -->
        <el-row type="flex" justify="start" class="topBar">
            <!-- 编辑和预览 -->
            <el-col :span="1" :offset="1">
                <el-row 
                    type="flex" 
                    justify="center" 
                    style="height: 40px; line-height: 40px; cursor: pointer;" 
                    :class="Get_Focus_Function('Editing')"
                    @click.native="Focus_Function = 'Editing'">编辑
                    <input 
                        type="file" 
                        style="display: none" 
                        accept=".jpg, .jpeg, .png" 
                        multiple="false"
                        id="PictureInput"/>
                </el-row>
            </el-col>
            <el-col :span="1">
                <el-row 
                    type="flex" 
                    justify="center" 
                    style="height: 40px; line-height: 40px; cursor: pointer; margin-left: 20px" 
                    :class="Get_Focus_Function('PreView')"
                    @click.native="Focus_Function = 'PreView'">
                    预览
                </el-row>
            </el-col>
            <!-- 后面的编辑按钮 -->
            <el-col :span="5" :offset="15">
                <el-row type="flex" justify="start">
                    <!-- 七个编辑按钮，依序为插入括号，插入填空占位符，清理编辑内容，加粗，斜体，插入图片和插入公式 -->
                    <el-tooltip placement="top">
                        <div slot="content">插入括号</div>
                        <span class="editButton" style="font-size: 18px; font-weight: bold">
                            ( )
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">插入占位符</div>
                        <span class="editButton" style="font-size: 20px; font-weight: bold;">
                            <u>U</u>
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">清除编辑内容</div>
                        <span class="editButton" style="font-size: 16px; font-weight: bold; padding-top: 2px">
                            <i class="el-icon-circle-close" style="font-weight: bold; font-size: 20px;"></i>
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">加粗</div>
                        <span class="editButton" style="font-size: 20px; font-weight: bold;">
                            <b>B</b>
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">斜体</div>
                        <span class="editButton" style="font-size: 20px; font-weight: bold;">
                            <i>I</i>
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">插入图片</div>
                        <span @click="Insert_Picture()" class="editButton" style="font-size: 16px; font-weight: bold; padding-top: 2px">
                            <i class="el-icon-picture-outline" style="font-weight: bold; font-size: 20px;"></i>
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">插入公式</div>
                        <span class="editButton" style="font-size: 20px; font-weight: bold;">
                            <img src="./fx.png" height="18px">
                        </span>
                    </el-tooltip>
                </el-row>
            </el-col>
        </el-row>
        <!-- 下面这部分是编辑状况下看到的内容 -->
        <div v-show="Focus_Function == 'Editing'">
            <!-- 第一行，分值 -->
            <el-row type="flex" justify="start" style="margin-top: 20px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                        <span>分值：</span>
                    </el-row>
                </el-col>
                <el-col :span="5" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input-number v-model="Question.score" placeholder="" :min="1" :max="10"></el-input-number>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 第二行，题干 -->
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                        <span>题干：</span>
                    </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input 
                            @focus="Get_Focus('Opt_Stem')" 
                            id="Opt_Stem" 
                            type="textarea" 
                            v-model="Question.stem" 
                            resize="none" :rows="6"></el-input>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 题干配图 -->
            <el-row v-show="Question.stem_image.length > 0">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px">
                        <span>题干配图：</span>
                    </el-row>
                </el-col>
                <el-col :span="22">
                    <el-row 
                        type="flex" 
                        justify="start"
                        v-for="Stem_Pic_Row_Index in Math.ceil(Question.stem_image.length/12)"
                        :key="'Stem_Pic_Row_' + Stem_Pic_Row_Index">
                        <el-col 
                            :span="2"
                            v-for="Stem_Pic_Col_Index in 12"
                            :key="'Stem_Pic_Row_' + Stem_Pic_Row_Index + 'Col_' + Stem_Pic_Col_Index">
                            <el-row 
                                type="flex" 
                                justify="center" 
                                v-if="(Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1 < Question.stem_image.length"
                                >
                                <el-popover 
                                    :ref="'Stem_Pic_Row_' + Stem_Pic_Row_Index + 'Col_' + Stem_Pic_Col_Index + '_Pop'"
                                    placement="top" 
                                    width="200" 
                                    trigger="hover">
                                    <el-row type="flex" justify="center">
                                        <img width="160" :src="Get_Picture_Src('stem_image', Stem_Pic_Row_Index, Stem_Pic_Col_Index)">
                                    </el-row>
                                    <el-row type="flex" justify="center">
                                        <el-button 
                                            type="danger" 
                                            size="small" 
                                            @click="Del_Picture_Src('stem_image', Stem_Pic_Row_Index, Stem_Pic_Col_Index)"
                                            style="margin-top: 10px">
                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                        </el-button>
                                    </el-row>
                                    <span slot="reference" class="imageLabel">
                                        配图{{(Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index}}
                                    </span>
                                </el-popover>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 第三行，选项，整体算作一个大行吧 -->
            <el-row
                v-for="(Qption, Option_Index) in Question.option" 
                :key="'Opt_' + Option_Index" style="margin-bottom: 8px">
                <!-- 纵向排列，因为实际上每个选项有两部分 -->
                <el-col>
                    <!-- 第一部分，文字内容 -->
                    <el-row type="flex" justify="start">
                        <el-col :span="2">
                            <el-row type="flex" justify="end" style="font-weight: bold; height: 35px; line-height: 35px">
                                <span>{{Get_Option_Label(Option_Index)}}：</span>
                            </el-row>
                        </el-col>
                        <el-col :span="14" :offset="1">
                            <el-row type="flex" justify="start">
                                <el-input 
                                    @focus="Get_Focus('Opt_Option_' + Option_Index)" 
                                    :id="'Opt_Option_' + Option_Index" 
                                    type="textarea" 
                                    v-model="Question.option[Option_Index]" 
                                    resize="none" :rows="1"></el-input>
                            </el-row>
                        </el-col>
                        <el-col :span="7">
                            <el-row type="flex" justify="start" style="height: 35px; line-height: 35px; margin-left: 30px">
                                <span class="optionButton" @click="Option_Up(Option_Index)"><i class="el-icon-top" style="font-weight: bold"></i></span>
                                <span class="optionButton" @click="Option_Down(Option_Index)"><i class="el-icon-bottom" style="font-weight: bold"></i></span>
                                <span class="optionButton" @click="Option_Delete(Option_Index)"><i class="el-icon-close" style="font-weight: bold"></i></span>
                                <span class="optionButton" @click="Option_Add()" v-if="Option_Index == Question.option.length - 1"><i class="el-icon-plus" style="font-weight: bold"></i></span>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 第二部分，选项配图 -->
                    <el-row v-show="Question.option_image[Option_Index].length > 0">
                        <el-col :span="2">
                            <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px; margin-top: 6px">
                                <span>选项{{Get_Option_Label(Option_Index)}}配图：</span>
                            </el-row>
                        </el-col>
                        <el-col :span="22">
                            <el-row 
                                type="flex" 
                                justify="start"
                                v-for="Option_Pic_Row_Index in Math.ceil(Question.option_image[Option_Index].length/12)"
                                :key="'Opt_' + Option_Index + '_Pic_Row_' + Option_Pic_Row_Index">
                                <el-col 
                                    :span="2"
                                    v-for="Option_Pic_Col_Index in 12"
                                    :key="'Opt_' + Option_Index + '_Pic_Row_' + Option_Pic_Row_Index + 'Col_' + Option_Pic_Col_Index">
                                    <el-row 
                                        type="flex" 
                                        justify="center" 
                                        v-if="(Option_Pic_Row_Index - 1) * 12 + Option_Pic_Col_Index - 1 < Question.option_image[Option_Index].length"
                                        >
                                        <el-popover 
                                            :ref="'Opt_' + Option_Index + '_Pic_Row_' + Option_Pic_Row_Index + 'Col_' + Option_Pic_Col_Index + '_Pop'"
                                            placement="top" 
                                            width="200" 
                                            trigger="hover">
                                            <el-row type="flex" justify="center">
                                                <img width="160" :src="Get_Picture_Src('option_image ' + Option_Index , Option_Pic_Row_Index, Option_Pic_Col_Index)">
                                            </el-row>
                                            <el-row type="flex" justify="center">
                                                <el-button 
                                                    type="danger" 
                                                    size="small" 
                                                    @click="Del_Picture_Src('option_image ' + Option_Index , Option_Pic_Row_Index, Option_Pic_Col_Index)"
                                                    style="margin-top: 10px">
                                                    删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                                </el-button>
                                            </el-row>
                                            <span slot="reference" class="imageLabel" style="margin-bottom: 0px; margin-top: 5px">
                                                配图{{(Option_Pic_Row_Index - 1) * 12 + Option_Pic_Col_Index}}
                                            </span>
                                        </el-popover>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 第四行，答案，选择题的答案我们只给选择的方式来确定，单选或判断只有单选，多选有checkbox -->
            <el-row type="flex" justify="start" style="margin-top: 10px;" v-if="detailType != '多选题'">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                        <span>答案：</span>
                    </el-row>
                </el-col>
                <el-col :span="5" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-select v-model="Question.answer" placeholder="请选择正确答案">
                            <el-option 
                                v-for="answer_Index in Question.option.length" 
                                :key="'Opt_ans_' + answer_Index" 
                                :label="Get_Option_Label(answer_Index - 1)" 
                                :value="Get_Option_Label(answer_Index - 1)">
                            </el-option>
                        </el-select>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 题目是多选题的情况 -->
            <el-row type="flex" justify="start" style="margin-top: 10px;" v-else>
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                        <span>答案：</span>
                    </el-row>
                </el-col>
                <el-col :span="21" :offset="1">
                    <el-row type="flex" justify="start" style="height: 40px; line-height: 40px">
                        <el-checkbox-group v-model="Answer_List">
                            <el-checkbox 
                                v-for="answer_Index in Question.option.length" 
                                :key="'Opt_ans_' + answer_Index" 
                                :label="Get_Option_Label(answer_Index - 1)">
                                {{Get_Option_Label(answer_Index - 1)}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 第五行，解析 -->
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                        <span>解析：</span>
                    </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input 
                            @focus="Get_Focus('Opt_Analysis')" 
                            id="Opt_Analysis"
                            type="textarea" 
                            v-model="Question.analysis" 
                            resize="none" :rows="6"></el-input>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 解析配图 -->
            <el-row v-show="Question.analysis_image.length > 0">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px">
                        <span>解析配图：</span>
                    </el-row>
                </el-col>
                <el-col :span="22">
                    <el-row 
                        type="flex" 
                        justify="start"
                        v-for="Analysis_Pic_Row_Index in Math.ceil(Question.analysis_image.length/12)"
                        :key="'Analysis_Pic_Row_' + Analysis_Pic_Row_Index">
                        <el-col 
                            :span="2"
                            v-for="Analysis_Pic_Col_Index in 12"
                            :key="'Analysis_Pic_Row_' + Analysis_Pic_Row_Index + 'Col_' + Analysis_Pic_Col_Index">
                            <el-row 
                                type="flex" 
                                justify="center" 
                                v-if="(Analysis_Pic_Row_Index - 1) * 12 + Analysis_Pic_Col_Index - 1 < Question.analysis_image.length"
                                >
                                <el-popover 
                                    :ref="'Analysis_Pic_Row_' + Analysis_Pic_Row_Index + 'Col_' + Analysis_Pic_Col_Index + '_Pop'"
                                    placement="top" 
                                    width="200" 
                                    trigger="hover">
                                    <el-row type="flex" justify="center">
                                        <img width="160" :src="Get_Picture_Src('analysis_image', Analysis_Pic_Row_Index, Analysis_Pic_Col_Index)">
                                    </el-row>
                                    <el-row type="flex" justify="center">
                                        <el-button 
                                            type="danger" 
                                            size="small" 
                                            @click="Del_Picture_Src('analysis_image', Analysis_Pic_Row_Index, Analysis_Pic_Col_Index)"
                                            style="margin-top: 10px">
                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                        </el-button>
                                    </el-row>
                                    <span slot="reference" class="imageLabel" style="margin-bottom: 0px">
                                        配图{{(Analysis_Pic_Row_Index - 1) * 12 + Analysis_Pic_Col_Index}}
                                    </span>
                                </el-popover>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 10px; margin-bottom: 20px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                        <span>粘贴识别：</span>
                    </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input type="textarea" v-model="Paste_Analysis" resize="none" :rows="6"></el-input>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    name: "OptionQuestions",
    props: {
        detailType: {
            type: String,
            default: "单选题" 
        }
    },
    destroyed(){
        this.Reset_Question_Info();
    },
    data(){
        return{
            Focus_Function: "Editing",
            // 这个Question的主要作用的用来进行发送
            // 直接涉及到编辑的只有题干，选项和解析
            // 这是因为多选题的答案不唯一，需要用一个数组做间接变量才行
            Question: {
                score: 5,
                stem: "",
                stem_image: [],
                option: [],
                option_image: [],
                answer: "",
                answer_image: [],
                analysis: "",
                analysis_image: []
            },
            Answer_List: [],
            // 粘贴识别，但是暂时还没放进来
            Paste_Analysis: "",
            // 用于保存图片的Input对象，拿来做自定义按钮的
            Picture_Upload_Dom: "",
            // 用于保存当前选中的框识别信息 - 给图片和文本编辑定位用的
            Focusing_Input: "",
            // 用于保存当前选中的框 - 通过ID确定是哪个框，来确定起始和终止位置
            Focusing_Dom: "",
            // 标记文档的起始和终止位置
            Text_Start: 0,
            Text_End: 0,
            // 选择观察期
            Select_Watcher: "",
            // 读取图片时用于等待
            Picture_Loading: false
        }
    },
    watch: {
        detailType(newVal, oldVal){
            if(newVal != oldVal){
                this.Reset_Question_Info();
            }
        },
        Answer_List(newVal){
            let Items = JSON.parse(JSON.stringify(newVal)).sort()
            this.Question.answer = Items.join("")
        },
        Paste_Analysis(newVal){
            this.$message.warning(newVal + " is Pasted.")
        }
    },
    mounted() {
        this.Reset_Question_Info();
        this.Init_Picture_Upload_Dom();
        this.Init_Select_Watcher();
    },
    methods: {
        // 看看能不能正常拿到图片信息
        Get_Picture_Src(position, Stem_Pic_Row_Index, Stem_Pic_Col_Index){
            let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
            if(position.split(" ").length == 1){
                return this.Question[position][Index]
            }else{
                let Info = position.split(" ")
                return this.Question[Info[0]][parseInt(Info[1])][Index]
            }
        },
        // 删除图片
        Del_Picture_Src(position, Stem_Pic_Row_Index, Stem_Pic_Col_Index){
            let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
            if(position.split(" ").length == 1){
                this.Question[position].splice(Index, 1)
            }else{
                let Info = position.split(" ")
                this.Question[Info[0]][parseInt(Info[1])].splice(Index, 1)
            }
        },
        // 初始化一个观察器，每0.04秒检查一次当前的选中状况，用来提供给功能项
        Init_Select_Watcher(){
            this.Select_Watcher = setInterval(()=>{
                if(this.Focusing_Dom != ""){
                    this.Text_Start = this.Focusing_Dom.selectionStart
                    this.Text_End = this.Focusing_Dom.selectionEnd
                }
            }, 40)
            // this.Select_Watcher = setInterval(()=>{
            //     if(this.Focusing_Dom != ""){
            //         console.log(this.Focusing_Dom)
            //         console.log(this.Text_Start, this.Text_End)
            //     }
            // }, 1000)
        },
        // 根据传入的值来确定是谁被选中了
        Get_Focus(Info){
            let Info_List = Info.split("_")
            if(Info_List[1] == "Stem"){
                this.Focusing_Dom = document.getElementById("Opt_Stem")
                this.Focusing_Input = "stem"
            }else if(Info_List[1] == "Option"){
                this.Focusing_Dom = document.getElementById("Opt_Option_" + Info_List[2])
                this.Focusing_Input = "option " + Info_List[2]
            }
            else if(Info_List[1] == "Analysis"){
                this.Focusing_Dom = document.getElementById("Opt_Analysis")
                this.Focusing_Input = "analysis"
            }
        },
        // 初始化上传图片的DOM对象
        Init_Picture_Upload_Dom(){
            this.Picture_Upload_Dom = document.getElementById("PictureInput");
            this.Picture_Upload_Dom.addEventListener("change", (e)=>{
                this.Insert_Picture_Into_Place(e.target.files[0])
                this.Picture_Upload_Dom.value = ""
            })
        },
        // 获取图片上传事件后的方法
        Insert_Picture_Into_Place(file){
            let Aim = this.Focusing_Input.split(" ")
            let Place = Aim[0] + "_image";
            const _this = this
            let File_Result = ""
            // Promise方法避免异步操作
            let promise = new Promise(function(resolve){
            // 用文件读取来读取图片的base64格式代码
                _this.Picture_Loading = true;
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function (e) {
                    File_Result = e.target.result;
                    resolve('1');
                };
            });
            promise.then(function(){
                // 用捕捉到的this对象来进行搜索
                if(Aim.length == 1){
                    _this.Question[Place].push(File_Result);
                    _this.Picture_Loading = false
                }else{
                    _this.Question[Place][parseInt(Aim[1])].push(File_Result);
                    _this.Picture_Loading = false
                }
                
            }).catch(function(){
            // 报错了就打印错误
                _this.$message.error("图片读取错误，请重试")
                _this.Picture_Loading = false
            })
            
        },
        // 上传图片
        Insert_Picture(){
            if(this.Focusing_Dom == ""){
                this.$message.error("请先点击某个框以确定插入位置。")
                return
            }else{
                this.Picture_Upload_Dom.click();
            }
        },
        // 选项上移
        Option_Up(Option_Index){

            if(Option_Index == 0){
                return
            }

            let Item = this.Question.option[Option_Index];
            let Item_image = this.Question.option_image[Option_Index];

            this.Question.option.splice(Option_Index, 1);
            this.Question.option.splice(Option_Index - 1, 0, Item);

            this.Question.option_image.splice(Option_Index, 1);
            this.Question.option_image.splice(Option_Index - 1, 0, Item_image);
        },
        // 选项下移
        Option_Down(Option_Index){

            if(Option_Index == this.Question.option.length - 1){
                return
            }

            let Item = this.Question.option[Option_Index];
            let Item_image = this.Question.option_image[Option_Index];

            this.Question.option.splice(Option_Index, 1);
            this.Question.option.splice(Option_Index + 1, 0, Item);

            this.Question.option_image.splice(Option_Index, 1);
            this.Question.option_image.splice(Option_Index + 1, 0, Item_image);
        },
        // 选项删除
        Option_Delete(Option_Index){

            if(this.Question.option.length <= 2){
                this.$message.error("请保留至少两项选项。")
                return
            }

            this.Question.option.splice(Option_Index, 1);
            this.Question.option_image.splice(Option_Index, 1);

        },
        // 选项增加
        Option_Add(){
            if(this.Question.option.length >= 26){
                this.$message.warning("选项过多。")
                return
            }
            this.Question.option.push("");
            this.Question.option_image.push([])
        },
        // 返回选项ABCD...
        Get_Option_Label(Option_Index){
            return String.fromCharCode(65 + Option_Index) 
        },
        // 根据当前选择编辑或预览提供样式
        Get_Focus_Function(FuncName){
            if(FuncName == this.Focus_Function){
                return "focusFunc"
            }else{
                return "unFocusFunc"
            }
        },
        // 重置数据变量
        Reset_Question_Info(){
            // 用于标记注意点的信息，可以重置
            this.Focusing_Input = ""
            this.Focusing_Dom = ""
            this.Text_Start = 0
            this.Text_End = 0

            this.$message.success("试题内容已重置")

            // 多选题部分的列表，重置
            this.Answer_List = []

            // 基础试题信息，重置
            this.Focus_Function = "Editing"
            this.Question = {
                score: 5,
                stem: "",
                stem_image: [],
                option: [],
                option_image: [],
                answer: "",
                answer_image: [],
                analysis: "",
                analysis_image: []
            }

            // 把选项信息塞回去
            if(this.detailType == "判断题"){
                this.Question.option = ["", ""]
                this.Question.option_image = [[], []]
            }else{
                this.Question.option = ["", "", "", ""]
                this.Question.option_image = [[], [], [], []]
            }
        },
    }
}
</script>
<style scoped>
/* 用于表示这个输入组件最上面的那一行 */
.topBar{
    height: 40px;
    border-bottom: 3px solid #409EFF;
}
/* 对应选中的功能块和没选中的功能块 */
.focusFunc{
    color: #409EFF;
    font-weight: bold;
}
.unFocusFunc{
    color: black;
}
/* 提供给上升，下降等功能按钮的样式 */
.optionButton{
    border: 2px solid #409EFF; 
    border-radius: 50%; 
    width: 25px; 
    height: 25px;
    line-height: 25px;
    margin-top: 5px;
    font-size: 15px;
    margin-right: 20px;
    cursor: pointer;
    color: #409EFF;
}
.optionButton:hover{
    color: MediumTurquoise;
    border: 2px solid MediumTurquoise; 
}

/* 用于试题内容简单编辑的按钮 */
.editButton{
    height: 32px;
    width: 32px;
    line-height: 32px;
    margin-top: 3px;
    border-radius: 5px;
    box-sizing: border-box;
    margin-right: 5px;
}
.editButton:hover{
    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.3);
    border: 1px solid whitesmoke;
}

/* 用于配图的文字显示 */

.imageLabel{
    display: block;
    margin-bottom: 10px;
    border: 2px dashed #409EFF;
    border-radius: 10px;
    color: #409EFF;
    height: 30px;
    width: 80px;
    line-height: 30px;
}

.btn_file {
  position: relative;
  background-color: #fff;
  padding-top: 2px;
  height: 30px;
  width: 4vw;
  font-size: 20px;
  border-radius: 2px;
  border: 1px dashed black;
  text-align: center;
  cursor: pointer;
}
input {
  position: absolute;
  top: 0;
  right: 0;
  height: 30px;
  width: 4vw;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}
</style>