// 这一页面的主要作用是测试不同题型的录入和显示功能是否能正常运作

<template>
    <div>
        <!-- 提供给选择题的编辑器 -->
        <el-dialog 
            :visible.sync="showDialog" 
            title="请编辑想要插入/修改的选择题内容" 
            width="65%" 
            @close="Editor_Dialog_Close()"
            :modal-append-to-body="false"
            :append-to-body="true"
        >
            <el-row>
                <el-col v-if="complex_Input">
                    <el-row>
                        <label>复杂输入框，请在需要时自行复制至目标输入框</label>
                    </el-row>
                    <ComplexInput></ComplexInput>
                    <el-row>
                        <el-button @click="complex_Input = false"><label>隐藏并清空复杂输入框</label></el-button>
                    </el-row>
                </el-col>
                <el-col v-if="!complex_Input">
                    <el-row>
                        <el-button @click="complex_Input = true"><label>显示复杂输入框</label></el-button>
                    </el-row>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <OptionQuestions 
                @EditFinish="New_Questions" 
                @ReEditFinish="ReEdit_Questions" 
                :RE.sync="ReEditSwitch" 
                :QInfos.sync="Temp_OptionQuestionInfos" 
                ref="OptionQuestionsEditor">
            </OptionQuestions>
        </el-dialog>
        <!-- 提供给填空题的编辑器 -->
        <el-dialog 
            :visible.sync="showDialog_Fill" 
            title="请编辑想要插入/修改的填空题内容" 
            width="65%" 
            @close="Editor_Dialog_Close()"
            :modal-append-to-body="false"
            :append-to-body="true"
        >
            <el-row>
                <el-col v-if="complex_Input">
                    <el-row>
                        <label>复杂输入框，请在需要时自行复制至目标输入框</label>
                    </el-row>
                    <ComplexInput></ComplexInput>
                    <el-row>
                        <el-button @click="complex_Input = false"><label>隐藏并清空复杂输入框</label></el-button>
                    </el-row>
                </el-col>
                <el-col v-if="!complex_Input">
                    <el-row>
                        <el-button @click="complex_Input = true"><label>显示复杂输入框</label></el-button>
                    </el-row>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <FillQuestions
                @EditFinish="New_Questions" 
                @ReEditFinish="ReEdit_Questions" 
                :RE.sync="ReEditSwitch" 
                :QInfos.sync="Temp_FillQuestionInfos" 
            ></FillQuestions>
        </el-dialog>
        <!-- 提供给解答题的编辑器 -->
        <el-dialog 
            :visible.sync="showDialog_Answer" 
            title="请编辑想要插入/修改的解答题内容" 
            width="65%" 
            @close="Editor_Dialog_Close()"
            :modal-append-to-body="false"
            :append-to-body="true"
        >
            <el-row>
                <el-col v-if="complex_Input">
                    <el-row>
                        <label>复杂输入框，请在需要时自行复制至目标输入框</label>
                    </el-row>
                    <ComplexInput></ComplexInput>
                    <el-row>
                        <el-button @click="complex_Input = false"><label>隐藏并清空复杂输入框</label></el-button>
                    </el-row>
                </el-col>
                <el-col v-if="!complex_Input">
                    <el-row>
                        <el-button @click="complex_Input = true"><label>显示复杂输入框</label></el-button>
                    </el-row>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <AnswerQuestions
                @EditFinish="New_Questions" 
                @ReEditFinish="ReEdit_Questions" 
                :RE.sync="ReEditSwitch" 
                :QInfos.sync="Temp_AnswerQuestionInfos" 
            ></AnswerQuestions>
        </el-dialog>
        <!-- 提供给自己的预览 -->
        <el-dialog
            :visible.sync="preview" 
            title="题目预览" 
            width="65%" 
            @close="Editor_Dialog_Close()"
            :modal-append-to-body="false"
            :append-to-body="true"
        >
            <MixDisplay :QI="questionInfos"></MixDisplay>
        </el-dialog>
        <!-- 测试用按钮行 -->
        <el-row>
            <el-col :span="3">
                <el-button size="small" @click="showDialog = true">插入新选择题</el-button>
            </el-col>
            <el-col :span="3">
                <el-button size="small" @click="showDialog_Fill = true">插入新填空题</el-button>
            </el-col>
            <el-col :span="3">
                <el-button size="small" @click="showDialog_Answer = true">插入新解答题</el-button>
            </el-col>
        </el-row>
        <!-- 分值，题干 -->
        <el-row style="margin-top: 15px">
            <!-- 左边组，第一行是分值和显示分值的地方 -->
            <!-- 第二行是添加选项，预览题目效果 -->
            <el-col :span="6">
                <el-row>
                    <el-col :span="6" style="padding-top: 4px">
                        <span style="font-size: 15px; font-weight: bold">分值</span>
                    </el-col>
                    <el-col :span="18">
                        <el-input readonly v-model="questionInfos.score" size="mini" style="font-size: 15px"></el-input>
                    </el-col>
                </el-row>
                <br/>
                <el-row style="padding-left: 10px">
                    <el-col :span="12">
                        <el-button size="mini" style="font-size: 12px" @click="Open_Preview()">
                            <i class="el-icon-search"></i>
                            预览本题
                        </el-button>
                    </el-col>
                </el-row>
            </el-col>
            
            <el-col :span="2" style="padding-top: 4px">
                <span style="font-size: 15px; font-weight: bold">题目</span>
            </el-col>
            <el-col :span="16">
                <el-row>
                    <el-col :span="18">
                        <el-input 
                            type="textarea" 
                            v-model="questionInfos.content" 
                            :autosize="{minRows: 3, maxRows: 5}" 
                            resize="none" 
                            style="font-size: 15px"
                            placeholder="请输入题目内容（必填）">
                        </el-input>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-row type="flex" justify="center">
                            <label>
                                添加图片
                            </label>
                        </el-row>
                        <el-row type="flex" justify="center">
                            <div 
                                class="btn_file"
                                :style="{ opacity: changecss }">
                                <p><i class="el-icon-picture"></i></p>
                                <input
                                    type="file"
                                    @change="uploadImg($event, 'content')"
                                    accept="image/png, image/jpeg"
                                />
                            </div>
                        </el-row>
                    </el-col>
                </el-row>     
            </el-col>
        </el-row>
        <!-- 题干图片的部分 -->
        <el-row style="margin-top: 15px">
            <el-col :span="23" :offset="1" style="padding-top: 10px;">
                <el-row v-for="row_count in Math.ceil(questionInfos.content_images.length/4)" :key="row_count">
                    <el-col 
                        :span="6" 
                        v-for="index in [0 + (row_count - 1)*4, 
                                         1 + (row_count - 1)*4, 
                                         2 + (row_count - 1)*4, 
                                         3 + (row_count - 1)*4]" 
                        :key="index"
                        >
                        <el-row v-if="index < questionInfos.content_images.length && questionInfos.content_images[index] != ''">
                            <el-col :span="16" >
                                <el-image 
                                    :src="questionInfos.content_images[index]" 
                                    style="height: 100px; width: 100px" 
                                    fit="contain"
                                    :preview-src-list="questionInfos.content_images">
                                </el-image>
                            </el-col>
                            <el-col :span="8" style="padding-top: 36px">
                                <el-button plain circle size="mini" @click="Delete_image(index, 'content')" type="danger" ><i class="el-icon-delete"></i></el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!-- 小题渲染区，要求所见即所得 -->
        <el-row v-for="(item, index) in questionInfos.sub_questions" :key="index"> 
            <el-col>
                <!-- 编辑题目，上移，下移，删除，折叠/展开按钮 -->
                <el-row style="margin-top: 5px; margin-bottom: 10px">
                    <el-col :span="2">
                        <el-button 
                            circle 
                            size="small"
                            @click="Edit_Question(index)"
                        ><i class="el-icon-edit"></i></el-button>
                    </el-col>
                    <el-col :span="1">
                        <el-button 
                            :disabled="index == 0" 
                            circle 
                            size="small"
                            @click="Question_Up(index)"
                        ><i class="el-icon-arrow-up"></i></el-button>
                    </el-col>
                    <el-col :span="1">
                        <el-button 
                            :disabled="index == questionInfos.sub_questions.length - 1" 
                            circle 
                            size="small"
                            @click="Question_Down(index)"
                        ><i class="el-icon-arrow-down"></i></el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button 
                            circle 
                            plain
                            size="small"
                            type="danger"
                            @click="Delete_Question(index)"
                        ><i class="el-icon-delete"></i></el-button>
                    </el-col>
                    <el-col :span="2" >
                        <div v-if="questionInfos.sub_questions_collapse[index] == false">
                            <el-button 
                                round 
                                plain
                                size="small"
                                type="info"
                                @click="Change_Question_collapse(index)"
                            >折叠</el-button>
                        </div>
                        <div v-if="questionInfos.sub_questions_collapse[index] == true">
                            <el-button 
                                round 
                                plain
                                size="small"
                                type="info"
                                @click="Change_Question_collapse(index)"
                            >展开</el-button>
                        </div>
                    </el-col>
                </el-row>
                <!-- 展开模式交给Display来负责，折叠模式为了避免样式报错，直接转换成文字格式 -->
                <div v-if="questionInfos.sub_questions_collapse[index] == false">
                    <el-row style="text-align: left; font-size: 20px">
                        <label>第 {{index + 1}} 题</label>
                    </el-row>
                    <br/>
                    <el-row>
                        <OptionDisplay v-if="item.type == 'option'" :QI="item"></OptionDisplay>
                        <FillDisplay v-else-if="item.type == 'fill'" :QI="item"></FillDisplay>
                        <AnswerDisplay v-else-if="item.type == 'answer'" :QI="item"></AnswerDisplay>
                    </el-row>
                </div>
                <div v-if="questionInfos.sub_questions_collapse[index]">
                    <el-row style="text-align: left; font-size: 20px">
                        <el-col :span="2">
                            <label>第 {{index + 1}} 题</label>
                        </el-col>
                        <el-col :span="21" :offset="1">
                            <label>{{Get_collapse_Show(item)}}</label>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <!-- 答案与答案图片 -->
        <el-row style="margin-top: 15px">
            <el-col :span="2" :offset="1"  style="padding-top: 4px">
                <span style="font-size: 15px; font-weight: bold">答案</span>
            </el-col>
            <el-col :span="21">
                <el-row>
                    <el-col :span="19">
                        <el-input 
                            type="textarea" 
                            v-model="questionInfos.answer" 
                            :autosize="{minRows: 2, maxRows: 4}" 
                            resize="none" 
                            style="font-size: 15px"
                            placeholder="请输入答案内容（可选）">
                        </el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-row type="flex" justify="center">
                            <label>
                                添加图片
                            </label>
                        </el-row>
                        <el-row type="flex" justify="center">
                            <div 
                                class="btn_file"
                                :style="{ opacity: changecss }">
                                <p><i class="el-icon-picture"></i></p>
                                <input
                                    type="file"
                                    @change="uploadImg($event, 'answer')"
                                    accept="image/png, image/jpeg"
                                />
                            </div>
                        </el-row>
                    </el-col>
                </el-row>     
            </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
            <el-col :span="23" :offset="1" style="padding-top: 10px;">
                <el-row v-for="row_count in Math.ceil(questionInfos.answer_images.length/4)" :key="row_count">
                    <el-col 
                        :span="6" 
                        v-for="index in [0 + (row_count - 1)*4, 
                                         1 + (row_count - 1)*4, 
                                         2 + (row_count - 1)*4, 
                                         3 + (row_count - 1)*4]" 
                        :key="index"
                        >
                        <el-row v-if="index < questionInfos.answer_images.length && questionInfos.answer_images[index] != ''">
                            <el-col :span="16" >
                                <el-image 
                                    :src="questionInfos.answer_images[index]" 
                                    style="height: 100px; width: 100px" 
                                    fit="contain"
                                    :preview-src-list="questionInfos.answer_images">
                                </el-image>
                            </el-col>
                            <el-col :span="8" style="padding-top: 36px">
                                <el-button plain circle size="mini" @click="Delete_image(index, 'answer')" type="danger" ><i class="el-icon-delete"></i></el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!-- 解析与解析图片 -->
        <el-row style="margin-top: 15px">
            <el-col :span="2" :offset="1"  style="padding-top: 4px">
                <span style="font-size: 15px; font-weight: bold">解析</span>
            </el-col>
            <el-col :span="21">
                <el-row>
                    <el-col :span="19">
                        <el-input 
                            type="textarea" 
                            v-model="questionInfos.analyse" 
                            :autosize="{minRows: 2, maxRows: 4}" 
                            resize="none" 
                            style="font-size: 15px"
                            placeholder="请输入解析内容（可选）">
                        </el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-row type="flex" justify="center">
                            <label>
                                添加图片
                            </label>
                        </el-row>
                        <el-row type="flex" justify="center">
                            <div 
                                class="btn_file"
                                :style="{ opacity: changecss }">
                                <p><i class="el-icon-picture"></i></p>
                                <input
                                    type="file"
                                    @change="uploadImg($event, 'analyse')"
                                    accept="image/png, image/jpeg"
                                />
                            </div>
                        </el-row>
                    </el-col>
                </el-row>     
            </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
            <el-col :span="23" :offset="1" style="padding-top: 10px;">
                <el-row v-for="row_count in Math.ceil(questionInfos.analyse_images.length/4)" :key="row_count">
                    <el-col 
                        :span="6" 
                        v-for="index in [0 + (row_count - 1)*4, 
                                         1 + (row_count - 1)*4, 
                                         2 + (row_count - 1)*4, 
                                         3 + (row_count - 1)*4]" 
                        :key="index"
                        >
                        <el-row v-if="index < questionInfos.analyse_images.length && questionInfos.analyse_images[index] != ''">
                            <el-col :span="16" >
                                <el-image 
                                    :src="questionInfos.analyse_images[index]" 
                                    style="height: 100px; width: 100px" 
                                    fit="contain"
                                    :preview-src-list="questionInfos.analyse_images">
                                </el-image>
                            </el-col>
                            <el-col :span="8" style="padding-top: 36px">
                                <el-button plain circle size="mini" @click="Delete_image(index, 'analyse')" type="danger" ><i class="el-icon-delete"></i></el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!-- 提交按钮 -->
        <el-row>
            <el-button type="success" @click="Edit_Finish()">
                <i class="el-icon-check"></i>
                编辑完成
            </el-button>
        </el-row>
    </div>
</template>
<script>

import OptionQuestions from "./OptionQuestions.vue"
import FillQuestions from "./FillQuestions.vue"
import ComplexInput from "./ComplexInput.vue"
import OptionDisplay from "./OptionDisplay.vue";
import FillDisplay from "./FillDisplay.vue";
import AnswerQuestions from "./AnswerQuestions.vue";
import AnswerDisplay from "./AnswerDisplay.vue";
import MixDisplay from "./MixDisplay.vue";

export default {

    components: { ComplexInput, 
                  OptionQuestions, OptionDisplay, 
                  FillQuestions, FillDisplay, 
                  AnswerQuestions, AnswerDisplay,
                  MixDisplay},
    name: "MixQuestions",
    props: {

        QInfos: {

            type: Object,
            default: function(){
                return {
                    type: "mix",
                    score: "None",
                    content: "",
                    content_images: [],
                    answer: "",
                    answer_images: [],
                    sub_questions: [],
                    sub_questions_collapse: [],
                    analyse: "",
                    analyse_images: [],
                }
            }

        },
        RE: {

            type: Boolean,
            default: false
            
        }
    },
    watch: {

        'questionInfos.sub_questions': {

            handler: function(newVal, oldVal) {

                var change_Switch = false;

                if(newVal != oldVal){
                    for(var i = 0; i < newVal.length; i++){
                        if(parseFloat(newVal[i].score) == 1 && oldVal){
                            newVal[i].score = oldVal[i].score;
                            change_Switch = true;
                        }else if(parseFloat(newVal[i].score) <= 0){
                            newVal[i].score = "0.1";
                            this.$message.error("一道题目应当至少有0.1分");
                            change_Switch = true;
                        }else if(parseFloat(newVal[i].score) > 100){
                            newVal[i].score = "100";
                            this.$message.error("一道题目应当至多有100分");
                            change_Switch = true;
                        }
                    }
                }

                if(!change_Switch && this.questionInfos.sub_questions.length > 0){

                    this.questionInfos.score = parseFloat(this.questionInfos.sub_questions[0].score);

                    for(var j = 1; j < this.questionInfos.sub_questions.length; j++){
                        this.questionInfos.score = this.questionInfos.score + parseFloat(this.questionInfos.sub_questions[j].score);
                    }

                }

                if(newVal.length == 0){
                    this.questionInfos.score = "None";
                }

            },

            deep: true,
            immediate: true,
        
        },
        QInfos(newVal){

            this.questionInfos = newVal;

        },
        RE(newVal){
            
            this.ReEdit = newVal;

        }

    },
    data(){
        return {
            // 一道非选择题应当包含的信息
            // 小题中的图片，分数，内容由其自己保管，反正有对应的Display工具作显示
            // 这边只需要编辑他的内容就好了
            questionInfos: this.QInfos,
            // 选择题编辑器,填空题编辑器和解答题编辑器的显示控制
            showDialog: false,
            showDialog_Fill: false,
            showDialog_Answer: false,
            // 打开复杂输入框的控制
            complex_Input: false,
            // 重写编辑标记
            ReEditSwitch: this.RE,
            // 两个临时存放用的Json变量
            Temp_OptionQuestionInfos: {

                type: "option",
                // 分值
                score: 1,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 选项的部分
                options: ["", "", "", ""],
                options_images: ["", "", "", ""],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: []

            },
            Temp_FillQuestionInfos: {

                type: "fill",
                // 分值
                score: 1,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: []

            },
            Temp_AnswerQuestionInfos: {

                type: "answer",
                // 分值
                score: 1,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 小题的部分
                sub_questions: [""],
                sub_questions_images: [[]],
                sub_questions_scores: ["1"],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: []

            },
            // 临时保存重写编辑的位置用的记号
            Index_Edit_Record: -1,
            // 是否允许预览对话框打开
            preview: false,
            changecss: 1
        }
    },
    methods: {
        Open_Preview(){
            this.preview = true;
        },
        Edit_Finish(){


            if(!this.ReEdit){
                this.ReEdit = false;
            }

            if(this.Necessary_Check()){
            
                setTimeout(()=>{

                    if(this.ReEdit == false){

                        this.$emit("EditFinish_Mix", this.questionInfos);

                    }else{

                        this.$emit("ReEditFinish_Mix", this.questionInfos);
                        this.ReEdit = false;

                    }

                }, 1);

            }else{
                this.$message.error("请先完成所有题干项的填写。");
            }

        },
        Necessary_Check(){

            if(this.questionInfos.content == ""){
                return false
            }else{
                return true
            }

        },
        // 处理插入新题目的办法
        // 需要管理两个条目，一个是题目内容，一个是是否折叠
        // 由于折叠属性放在题目内会对显示造成复杂化的结果，就放在外面
        New_Questions(val){

            this.questionInfos.sub_questions.push(val);
            this.questionInfos.sub_questions_collapse.push(false);
            this.Close_Editor();
            this.Reset_Params();

        },
        // 处理想要修改题目内容时的方法
        // 核心思路是把题目内容的部分丢给编辑器，让编辑器来读取内容
        // 然后等待编辑器内部的处理
        // 在这里，是否发送重写信号由ReEditSwitch来决定
        // Index_Edit_Record用于记录编辑的编号
        // Temp名称用于临时交换让编辑器处理的数据内容
        // showDialog代表显示的是哪个编辑器
        Edit_Question(index){

            if(this.questionInfos.sub_questions[index].type == 'option'){
                this.showDialog = true;
                this.Temp_OptionQuestionInfos = this.questionInfos.sub_questions[index];
                console.log(this.Temp_OptionQuestionInfos)
            }else if(this.questionInfos.sub_questions[index].type == 'fill'){
                this.showDialog_Fill = true;
                this.Temp_FillQuestionInfos = this.questionInfos.sub_questions[index];
                console.log(this.Temp_FillQuestionInfos)
            }else if(this.questionInfos.sub_questions[index].type == 'answer'){
                this.showDialog_Answer = true;
                this.Temp_AnswerQuestionInfos = this.questionInfos.sub_questions[index];
                console.log(this.Temp_AnswerQuestionInfos)
            }
            this.ReEditSwitch = true;
            this.Index_Edit_Record = index;

        },
        Editor_Dialog_Close(){

            this.Close_Editor();
            this.Reset_Params();

        },
        // 重写编辑后，把新数据直接覆盖上去
        ReEdit_Questions(val){

            this.questionInfos.sub_questions.splice(this.Index_Edit_Record, 1, val);

            this.Close_Editor();
            this.Reset_Params();
            
        },
        // 一起关掉
        Close_Editor(){

            this.showDialog = false;
            this.showDialog_Fill = false;
            this.showDialog_Answer = false;

            this.preview = false;

        },
        // 移动题目位置
        // 注意要一次移动信息和折叠属性两个，不然会有问题
        Question_Up(index){

            var temp_Save = this.questionInfos.sub_questions[index];
            this.questionInfos.sub_questions.splice(index, 1);
            this.questionInfos.sub_questions.splice(index - 1, 0, temp_Save);

            var temp_coll = this.questionInfos.sub_questions_collapse[index];
            this.questionInfos.sub_questions_collapse.splice(index, 1);
            this.questionInfos.sub_questions_collapse.splice(index - 1, 0, temp_coll);

        },
        Question_Down(index){

            var temp_Save = this.questionInfos.sub_questions[index];
            this.questionInfos.sub_questions.splice(index, 1);
            this.questionInfos.sub_questions.splice(index + 1, 0, temp_Save);

            var temp_coll = this.questionInfos.sub_questions_collapse[index];
            this.questionInfos.sub_questions_collapse.splice(index, 1);
            this.questionInfos.sub_questions_collapse.splice(index + 1, 0, temp_coll);

        },
        // 处理完题目的录入之后要重置这些临时使用的变量
        Reset_Params(){

            this.Index_Edit_Record = -1;
            this.ReEditSwitch = false;

            this.Temp_OptionQuestionInfos = {

                type: "option",
                // 分值
                score: 1,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 选项的部分
                options: ["", "", "", ""],
                options_images: ["", "", "", ""],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: []

            }

            this.Temp_FillQuestionInfos = {

                type: "fill",
                // 分值
                score: 1,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: []

            }

            this.Temp_AnswerQuestionInfos = {

                type: "answer",
                // 分值
                score: 1,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 小题的部分
                sub_questions: [""],
                sub_questions_images: [[]],
                sub_questions_scores: ["1"],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: []

            }

        },
        // 删除题目也是一样，要一起删除折叠信息
        Delete_Question(index){

            this.questionInfos.sub_questions.splice(index, 1);
            this.questionInfos.sub_questions_collapse.splice(index, 1);

        },
        // 压缩题目长度，使过长的题目能正常显示
        Get_collapse_Show(Ques){

            var Score = Ques.score.toString();
            var content = Ques.content;

            var Result = "（ " + Score + "分 ）   ";
            if(content.length > 30){
                content = content.substring(0, 30) + "……";
            }

            Result = Result + content;
            return Result

        },
        // 修改折叠属性，注意要用splice，否则会有bug
        // 天知道vue这到底什么谜一样的前端内容……
        Change_Question_collapse(index){

            if(this.questionInfos.sub_questions_collapse[index]){
                this.questionInfos.sub_questions_collapse.splice(index, 1, false);
            }else{
                this.questionInfos.sub_questions_collapse.splice(index, 1, true);
            }

        }

    }
}
</script>
<style scoped>
.btn_file {
  position: relative;
  background-color: #fff;
  padding-top: 2px;
  height: 30px;
  width: 4vw;
  font-size: 20px;
  border-radius: 2px;
  border: 1px dashed black;
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