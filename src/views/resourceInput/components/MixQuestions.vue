// 这一页面的主要作用是测试不同题型的录入和显示功能是否能正常运作

<template>
    <div>
        <!-- 提供给选择题的编辑器 -->
        <el-dialog 
            :visible.sync="showDialog" 
            width="65%" 
            @close="Editor_Dialog_Close()"
            :modal-append-to-body="false"
            :append-to-body="true"
        >
            <template slot="title">
                <el-row type="flex" justify="center" style="font-size: 18px;">请编辑想要插入/修改的选择题内容</el-row>  
            </template>
            <el-row>
                <el-col v-if="complex_Input">
                    <el-row type="flex" justify="center">
                        <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                    </el-row>
                    <ComplexInput :Mathdown_Special="'minQuestion_Option'"></ComplexInput>
                    <el-row type="flex" justify="center">
                        <el-button @click="complex_Input = false"><label>隐藏并清空</label></el-button>
                    </el-row>
                </el-col>
                <el-col v-if="!complex_Input">
                    <el-row type="flex" justify="center">
                        <el-button @click="complex_Input = true"><label>显示LUNA输入助手</label></el-button>
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
            width="65%" 
            @close="Editor_Dialog_Close()"
            :modal-append-to-body="false"
            :append-to-body="true"
        >
            <template slot="title">
                <el-row type="flex" justify="center" style="font-size: 18px;">请编辑想要插入/修改的小题内容</el-row>  
            </template>
            <el-row>
                <el-col v-if="complex_Input">
                    <el-row type="flex" justify="center">
                        <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                    </el-row>
                    <ComplexInput :Mathdown_Special="'minQuestion_Fill'"></ComplexInput>
                    <el-row type="flex" justify="center">
                        <el-button @click="complex_Input = false"><label>隐藏并清空</label></el-button>
                    </el-row>
                </el-col>
                <el-col v-if="!complex_Input">
                    <el-row type="flex" justify="center">
                        <el-button @click="complex_Input = true"><label>显示LUNA输入助手</label></el-button>
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
            width="65%" 
            @close="Editor_Dialog_Close()"
            :modal-append-to-body="false"
            :append-to-body="true"
        >
            <template slot="title">
                <el-row type="flex" justify="center" style="font-size: 18px;">请编辑想要插入/修改的解答题内容</el-row>  
            </template>
            <el-row>
                <el-col v-if="complex_Input">
                    <el-row type="flex" justify="center">
                        <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                    </el-row>
                    <ComplexInput :Mathdown_Special="'minQuestion_Answer'"></ComplexInput>
                    <el-row type="flex" justify="center">
                        <el-button @click="complex_Input = false"><label>隐藏并清空</label></el-button>
                    </el-row>
                </el-col>
                <el-col v-if="!complex_Input">
                    <el-row type="flex" justify="center">
                        <el-button @click="complex_Input = true"><label>显示LUNA输入助手</label></el-button>
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
            <MixDisplay :QI="questionInfo" :BI="'Self_Preview_0'"></MixDisplay>
        </el-dialog>
        <!-- 测试用按钮行 -->
        <!-- <el-row>
            <el-col :span="3">
                <el-button size="small" @click="showDialog = true">插入新选择题</el-button>
            </el-col>
            <el-col :span="3">
                <el-button size="small" @click="showDialog_Fill = true">插入新填空题</el-button>
            </el-col>
            <el-col :span="3">
                <el-button size="small" @click="showDialog_Answer = true">插入新解答题</el-button>
            </el-col>
        </el-row> -->
        <!-- 分值，题干 -->
        <el-row type="flex" justify="start" style="margin: 0px 5px; padding: 0px">
            <el-col :span="4">
                <el-row type="flex" justify="start" style="margin: 0px; padding: 0px">
                    <el-button @click="Unit_Score_Switch = !Unit_Score_Switch" type="text">小题分数统一开关</el-button>
                </el-row>
            </el-col>
            <el-col :span="3">
                <el-row type="flex" justify="start" style="margin: 0px; padding: 0px">
                    <el-input v-model="Unit_Score" :disabled="!Unit_Score_Switch"></el-input>
                </el-row>
            </el-col>
            <el-col :span="3" :offset="1">
                <el-row type="flex" justify="start" style="margin: 0px; padding: 0px">
                    <el-button @click="Unit_Score_Do()" :disabled="!Unit_Score_Switch" >分数统一</el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row style="margin-top: 15px">
            <!-- 左边组，第一行是分值和显示分值的地方 -->
            <!-- 第二行是添加选项，预览题目效果 -->
            <el-col :span="6">
                <el-row type="flex" justify="start">
                    <label style="padding-left: 5px; font-size: 15px; display: inline-block; width: 60px; padding-top:4px">分值：</label>
                    <el-input type="number" min="1" max="100" step="0.1" v-model="questionInfo.score" size="mini" style="font-size: 15px; width: 100px; margin-left: 20px" :readonly="true"></el-input>
                    <label style="font-size: 15px; display: inline-block; width: 20px; padding-top:4px; margin-left: 20px">分</label>
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 10px">
                    <el-button size="mini" style="font-size: 12px; width: 34%;" @click="Open_Preview()">
                        <i class="el-icon-search"></i>
                        预览本题
                    </el-button>
                    <el-button size="small" @click.native="New_Ques('Option')" style="margin-left: 8%; font-size: 12px; width: 34%">
                        <i class="el-icon-edit"></i>
                        新选择题
                    </el-button>
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 10px">
                    <el-button size="small" @click.native="New_Ques('Fill')" style="font-size: 12px; width: 76%">
                        <i class="el-icon-edit"></i>
                        新小题
                    </el-button>
                </el-row>
            </el-col>
            
            <el-col :span="2" style="padding-top: 4px">
                <span style="font-size: 15px; font-weight: bold">题干</span>
            </el-col>
            <el-col :span="16">
                <el-row>
                    <el-col :span="18">
                        <el-input 
                            type="textarea" 
                            v-model="questionInfo.content" 
                            :autosize="{minRows: 4, maxRows: 6}" 
                            resize="none" 
                            style="font-size: 15px"
                            placeholder="请输入题干内容（必填）">
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-row type="flex" justify="center">
                            <label>
                                添加图片
                            </label>
                        </el-row>
                        <el-row type="flex" justify="center">
                            <div class="btn_file">
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
                <el-row v-for="row_count in Math.ceil(questionInfo.content_images.length/4)" :key="row_count">
                    <el-col 
                        :span="6" 
                        v-for="index in [0 + (row_count - 1)*4, 
                                         1 + (row_count - 1)*4, 
                                         2 + (row_count - 1)*4, 
                                         3 + (row_count - 1)*4]" 
                        :key="index"
                        >
                        <el-row v-if="index < questionInfo.content_images.length && questionInfo.content_images[index] != ''">
                            <el-col :span="16" >
                                <el-image 
                                    :src="questionInfo.content_images[index]" 
                                    style="height: 100px; width: 100px" 
                                    fit="contain"
                                    :preview-src-list="questionInfo.content_images">
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
        <el-row v-for="(item, index) in questionInfo.sub_questions" :key="index"> 
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
                            :disabled="index == questionInfo.sub_questions.length - 1" 
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
                        <div v-if="questionInfo.sub_questions_collapse[index] == false">
                            <el-button 
                                round 
                                plain
                                size="small"
                                type="info"
                                @click="Change_Question_collapse(index)"
                            >折叠</el-button>
                        </div>
                        <div v-if="questionInfo.sub_questions_collapse[index] == true">
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
                <div v-if="questionInfo.sub_questions_collapse[index] == false" style="margin-top: 20px">
                    <el-row style="text-align: left; font-size: 15px; padding-left: 20px; margin-bottom: 10px">
                        <label>第 {{index + 1}} 题</label>
                    </el-row>
                    <el-row>
                        <OptionDisplay v-if="item.type == 'option'" :QI="item" :Bundle_Index="'Bundle_' + index"></OptionDisplay>
                        <FillDisplay v-else-if="item.type == 'fill'" :QI="item" :Bundle_Index="'Bundle_' + index"></FillDisplay>
                        <AnswerDisplay v-else-if="item.type == 'answer'" :QI="item" :Bundle_Index="'Bundle_' + index"></AnswerDisplay>
                    </el-row>
                </div>
                <div v-if="questionInfo.sub_questions_collapse[index]" style="margin-top: 20px">
                    <el-row style="text-align: left; font-size: 15px; padding-left: 20px; margin-bottom: 10px">
                        <label>第 {{index + 1}} 题</label>
                        <span style="margin-left: 20px">{{Get_collapse_Show(item)}}</span>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <!-- 答案与答案图片 -->
        <el-row style="margin-top: 15px">
            <el-col :span="3" style="padding-top: 4px">
                <el-row type="flex" justify="center">
                    <span style="font-size: 15px; font-weight: bold">答案</span>
                </el-row>
            </el-col>
            <el-col :span="21">
                <el-row>
                    <el-col :span="19">
                        <el-input 
                            type="textarea" 
                            v-model="questionInfo.answer" 
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
                            <div class="btn_file">
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
                <el-row v-for="row_count in Math.ceil(questionInfo.answer_images.length/4)" :key="row_count">
                    <el-col 
                        :span="6" 
                        v-for="index in [0 + (row_count - 1)*4, 
                                         1 + (row_count - 1)*4, 
                                         2 + (row_count - 1)*4, 
                                         3 + (row_count - 1)*4]" 
                        :key="index"
                        >
                        <el-row v-if="index < questionInfo.answer_images.length && questionInfo.answer_images[index] != ''">
                            <el-col :span="16" >
                                <el-image 
                                    :src="questionInfo.answer_images[index]" 
                                    style="height: 100px; width: 100px" 
                                    fit="contain"
                                    :preview-src-list="questionInfo.answer_images">
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
            <el-col :span="3" style="padding-top: 4px">
                <el-row type="flex" justify="center">
                    <span style="font-size: 15px; font-weight: bold">解析</span>
                </el-row>
            </el-col>
            <el-col :span="21">
                <el-row>
                    <el-col :span="19">
                        <el-input 
                            type="textarea" 
                            v-model="questionInfo.analyse" 
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
                            <div class="btn_file">
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
                <el-row v-for="row_count in Math.ceil(questionInfo.analyse_images.length/4)" :key="row_count">
                    <el-col 
                        :span="6" 
                        v-for="index in [0 + (row_count - 1)*4, 
                                         1 + (row_count - 1)*4, 
                                         2 + (row_count - 1)*4, 
                                         3 + (row_count - 1)*4]" 
                        :key="index"
                        >
                        <el-row v-if="index < questionInfo.analyse_images.length && questionInfo.analyse_images[index] != ''">
                            <el-col :span="16" >
                                <el-image 
                                    :src="questionInfo.analyse_images[index]" 
                                    style="height: 100px; width: 100px" 
                                    fit="contain"
                                    :preview-src-list="questionInfo.analyse_images">
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

import ComplexInput from "../../../common/components/ComplexInput.vue"

import OptionQuestions from "./OptionQuestions.vue"
import FillQuestions from "./FillQuestions.vue"
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
                    score: 0,
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
            
        },
        ST: {
            type: String,
            default: ""
        }
    },
    created() {
        if(sessionStorage.getItem("InputPaperEditQuestion")){
            this.questionInfo = JSON.parse(sessionStorage.getItem("InputPaperEditQuestion"));
            this.ReEdit = true;
        }
        sessionStorage.removeItem("InputPaperEditQuestion")
    },
    watch: {

        questionInfo(newVal, oldVal) {
            var change_Switch = false;

            if(newVal != oldVal){
                for(var i = 0; i < newVal.sub_questions.length; i++){
                    if(newVal.sub_questions[i].score < 0.5){
                        newVal.sub_questions[i].score = 0.5;
                        this.$message.error("一道题目应当至少有0.1分");
                        change_Switch = true;
                    }else if(newVal.sub_questions[i].score > 100){
                        newVal.sub_questions[i].score = 100;
                        this.$message.error("一道题目应当至多有100分");
                        change_Switch = true;
                    }else if(!parseFloat(newVal.sub_questions[i].score)){
                        newVal[i] = oldVal[i]
                        this.$message.error("请勿直接删除分数值");
                    }
                }
            }

            if(!change_Switch && this.questionInfo.sub_questions.length > 0){

                this.questionInfo.score = parseFloat(this.questionInfo.sub_questions[0].score);

                for(var j = 1; j < this.questionInfo.sub_questions.length; j++){
                    this.questionInfo.score = this.questionInfo.score + parseFloat(this.questionInfo.sub_questions[j].score);
                }

            }

            if(newVal.sub_questions.length == 0){
                this.questionInfo.score = 0;
            }

        },
        RE(newVal){
            
            this.ReEdit = newVal;

        },
        Unit_Score(newVal, oldVal) {
            newVal = parseInt(newVal)
            oldVal = parseInt(oldVal)
            if(newVal < 0.5){
                newVal = 0.5;
                this.$message.error("一道题目应当至少有0.5分");
            }else if(newVal > 100){
                newVal = 100;
                this.$message.error("一道题目应当至多有100分");
            }else if(!parseFloat(newVal)){
                newVal = oldVal
                this.$message.error("请勿直接删除分数值");
            }
        }
    },
    data(){
        return {
            // ReSave
            Re_Cache: false,
            Unit_Score_Switch: false,
            Unit_Score: 1,
            // 一道非选择题应当包含的信息
            // 小题中的图片，分数，内容由其自己保管，反正有对应的Display工具作显示
            // 这边只需要编辑他的内容就好了
            questionInfo: this.QInfos,
            SubjectType: this.ST,
            // 选择题编辑器,填空题编辑器和解答题编辑器的显示控制
            showDialog: false,
            showDialog_Fill: false,
            showDialog_Answer: false,
            // 打开LUNA输入助手的控制
            complex_Input: false,
            // 重写编辑标记
            ReEditSwitch: this.RE,
            // 用于输入符号提示的部分
            en_pun_list: [',','.','?','!',':',';','\'','"','(',')','&nbsp','_','/','|','\\','<','>'],
            ch_pun_list: ['，','。','！','？','：','；','‘','’','“','”','（','）','&nbsp','、','《','》'],
            math_pun_list: ['+', '-', "*", "/", "%", "="],
            // 两个临时存放用的Json变量
            Temp_OptionQuestionInfos: {

                type: "option",
                // 分值
                score: 5,
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
                analyse_images: [],
                detail_type: "单选题"

            },
            Temp_FillQuestionInfos: {

                type: "fill",
                // 分值
                score: 5,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: [],
                detail_type: "填空题"

            },
            Temp_AnswerQuestionInfos: {

                type: "answer",
                // 分值
                score: 5,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 小题的部分
                sub_questions: [""],
                sub_questions_images: [[]],
                sub_questions_scores: [5],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: [],
                detail_type: "简答题"

            },
            // 临时保存重写编辑的位置用的记号
            Index_Edit_Record: -1,
            // 是否允许预览对话框打开
            preview: false
        }
    },
    methods: {
        New_Ques(part){
            this.Re_Cache = this.ReEditSwitch;
            this.ReEditSwitch = false;
            if(part == "Option"){
                this.showDialog = true;
            }else if(part == 'Fill'){
                this.showDialog_Fill = true;
            }else if(part == 'Answer'){
                this.showDialog_Answer = true;
            }
        },
        Unit_Score_Do(){
            for(let i = 0; i < this.questionInfo.sub_questions.length; i++){
                let Temp_Item = JSON.parse(JSON.stringify(this.questionInfo.sub_questions[i]))
                Temp_Item.score = parseFloat(this.Unit_Score);
                this.questionInfo.sub_questions.splice(i, 1, Temp_Item);
            }
            this.Calc_Score();
        },
        Open_Preview(){
            this.preview = true;
        },
        Edit_Finish(){


            if(!this.ReEdit){
                this.ReEdit = false;
            }

            if(this.Necessary_Check()){

                sessionStorage.removeItem("InputPaperEditQuestion");
                const _this = this;
            
                setTimeout(()=>{

                    let Pro = new Promise(function(resolve){

                        if(_this.ReEdit == false){

                            _this.$emit("EditFinish_Mix", _this.questionInfo);
                            
                        }else{

                            _this.$emit("ReEditFinish_Mix", _this.questionInfo);
                            _this.ReEdit = false;

                        }

                        resolve("1")
                    })

                    Pro.then(function(){
                        _this.questionInfo = _this.QInfos;
                    })


                }, 1);

            }else{
                this.$message.error("请先完成所有题干项的填写。");
            }

        },
        Necessary_Check(){

            if(this.questionInfo.content == ""){
                return false
            }else{
                return true
            }

        },
        // 处理插入新题目的办法
        // 需要管理两个条目，一个是题目内容，一个是是否折叠
        // 由于折叠属性放在题目内会对显示造成复杂化的结果，就放在外面
        New_Questions(val){
            this.ReEditSwitch = this.Re_Cache;
            let temp_val = "";

            temp_val = this.Normal_Char_Check(val);

            if(temp_val != false){
                this.questionInfo.sub_questions.push(temp_val);
            }else{
                this.questionInfo.sub_questions.push(val);
            }
            this.questionInfo.sub_questions_collapse.push(false);
            this.Close_Editor();
            this.Reset_Params();

            this.Calc_Score();

        },
        // 检测是否有非法字符 - 选择-填空-解答
        Normal_Char_Check(val){

        var Check_Now = val.content;
        var result = this.ChecK_Do(Check_Now);
        if(Check_Now!= "" && result[1]){
            this.$alert("请将题干内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
            confirmButtonText: '确定'
            });
            return false
        }else if(Check_Now!= "" && !result[1]){
            val.content = result[0];
        }

        var Check_Now_List = val.answer;
        Check_Now_List = Check_Now_List.split("::");
        for(let j = 0; j < Check_Now_List.length; j++){
            var item = Check_Now_List[j]
            result = this.ChecK_Do(item);
            if(item != "" && result[1]){
            this.$alert("请将答案内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
                confirmButtonText: '确定'
            });
            return false
            }else if(item != "" && !result[1]){
            Check_Now_List.splice(j, 1, result[0])
            }
        }
        val.answer = Check_Now_List.join("\n");

        Check_Now = val.analyse;
        result = this.ChecK_Do(Check_Now);
        if(Check_Now!= "" && result[1]){
            this.$alert("请将解析内容中自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
            confirmButtonText: '确定'
            });
            return false
        }else if(Check_Now!= "" && !result[1]){
            val.analyse = result[0];
        }

        if(val.type == 'option'){
            Check_Now_List = val.options;
            for(let opi = 0; opi < Check_Now_List.length; opi++){
            item = Check_Now_List[opi]
            result = this.ChecK_Do(item);
            if(item != "" && result[1]){
                this.$alert("请将选项内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
                confirmButtonText: '确定'
                });
                return false
            }else if(item != "" && !result[1]){
                Check_Now_List.splice(opi, 1, result[0])
            }
            }
            val.options = Check_Now_List;
        }else if(val.type == 'answer'){
            Check_Now_List = val.sub_questions;
            for(let opi = 0; opi < Check_Now_List.length; opi++){
            item = Check_Now_List[opi]
            result = this.ChecK_Do(item);
            if(item != "" && result[1]){
                this.$alert("请将选项内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
                confirmButtonText: '确定'
                });
                return false
            }else if(item != "" && !result[1]){
                Check_Now_List.splice(opi, 1, result[0])
            }
            }
            val.sub_questions = Check_Now_List;
        }

        this.Symbol_Error = false;

        return val;
        },
        // 负责实际检查的部分
        ChecK_Do(content){

        let remakeContent = "";

        var latexFlag = false;
        let symbolError = false;
        let Regx = /[A-Za-z0-9]/;

        var Img_Catcher = new RegExp('<img src="(.*?)">', 'g')
        var Result_List = Img_Catcher.exec(content);

        var Img_SE = [];
        var Start = 0;

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
                if ((Regx.test(content[i]) && this.SubjectType != "英语") || this.math_pun_list.indexOf(content[i]) != -1) {
                    if(remakeContent[remakeContent.length - 1] == '$'){
                        remakeContent = remakeContent.substring(0, remakeContent.length - 1) + content[i] + "$";
                    }else{
                        remakeContent = remakeContent + "$" + content[i] + "$";
                    }
                }
                // 中文字符，中英文允许的符号，空格或Latex结尾的$符号，换行符
                else if(!(content.charCodeAt(i) > 255 || 
                        this.ch_pun_list.indexOf(content[i]) != -1 || this.en_pun_list.indexOf(content[i]) != -1 ||
                        content[i] == ' ' || content[i] == '$' || 
                        content.charCodeAt(i) == 10) 
                        && !symbolError
                        && this.SubjectType != "英语"){
                symbolError = true;
                this.$message.error({message: "请修正位于 " + ( i + 1 ) + " 处的非法字符，或将其包裹于$$符号之内。错误符号：" + content[i], offset: 40, duration: 5000});
                remakeContent = remakeContent + content[i];
                }
                else {
                remakeContent = remakeContent + content[i];
                }
            }else{
                remakeContent = remakeContent + content[i];
            }
        }
        return [remakeContent, latexFlag]
        },
        // 处理想要修改题目内容时的方法
        // 核心思路是把题目内容的部分丢给编辑器，让编辑器来读取内容
        // 然后等待编辑器内部的处理
        // 在这里，是否发送重写信号由ReEditSwitch来决定
        // Index_Edit_Record用于记录编辑的编号
        // Temp名称用于临时交换让编辑器处理的数据内容
        // showDialog代表显示的是哪个编辑器
        Edit_Question(index){

            if(this.questionInfo.sub_questions[index].type == 'option'){
                this.showDialog = true;
                this.Temp_OptionQuestionInfos = this.questionInfo.sub_questions[index];
            }else if(this.questionInfo.sub_questions[index].type == 'fill'){
                this.showDialog_Fill = true;
                this.Temp_FillQuestionInfos = this.questionInfo.sub_questions[index];
            }else if(this.questionInfo.sub_questions[index].type == 'answer'){
                this.showDialog_Answer = true;
                this.Temp_AnswerQuestionInfos = this.questionInfo.sub_questions[index];
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

            let temp_val = "";

            temp_val = this.Normal_Char_Check(val);

            if(temp_val != false){
                this.questionInfo.sub_questions.splice(this.Index_Edit_Record, 1, temp_val);
            }else{
                this.questionInfo.sub_questions.splice(this.Index_Edit_Record, 1, val);
            }

            this.Close_Editor();
            this.Reset_Params();

            this.Calc_Score();
            
        },
        Calc_Score(){
            this.questionInfo.score = 0;
            for(let i = 0; i < this.questionInfo.sub_questions.length; i++){
                this.questionInfo.score += this.questionInfo.sub_questions[i].score;
            }
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

            var temp_Save = this.questionInfo.sub_questions[index];
            this.questionInfo.sub_questions.splice(index, 1);
            this.questionInfo.sub_questions.splice(index - 1, 0, temp_Save);

            var temp_coll = this.questionInfo.sub_questions_collapse[index];
            this.questionInfo.sub_questions_collapse.splice(index, 1);
            this.questionInfo.sub_questions_collapse.splice(index - 1, 0, temp_coll);

        },
        Question_Down(index){

            var temp_Save = this.questionInfo.sub_questions[index];
            this.questionInfo.sub_questions.splice(index, 1);
            this.questionInfo.sub_questions.splice(index + 1, 0, temp_Save);

            var temp_coll = this.questionInfo.sub_questions_collapse[index];
            this.questionInfo.sub_questions_collapse.splice(index, 1);
            this.questionInfo.sub_questions_collapse.splice(index + 1, 0, temp_coll);

        },
        // 处理完题目的录入之后要重置这些临时使用的变量
        Reset_Params(){

            this.Index_Edit_Record = -1;
            this.ReEditSwitch = false;
            this.complex_Input = false;

            this.Temp_OptionQuestionInfos = {

                type: "option",
                // 分值
                score: 5,
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
                analyse_images: [],
                detail_type: "单选题"

            }

            this.Temp_FillQuestionInfos = {

                type: "fill",
                // 分值
                score: 5,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: [],
                detail_type: "填空题"

            }

            this.Temp_AnswerQuestionInfos = {

                type: "answer",
                // 分值
                score: 5,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 小题的部分
                sub_questions: [""],
                sub_questions_images: [[]],
                sub_questions_scores: [5],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: [],
                detail_type: "简答题"

            }

        },
        // 删除题目也是一样，要一起删除折叠信息
        Delete_Question(index){

            this.questionInfo.sub_questions.splice(index, 1);
            this.questionInfo.sub_questions_collapse.splice(index, 1);

            this.Calc_Score();

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

            if(this.questionInfo.sub_questions_collapse[index]){
                this.questionInfo.sub_questions_collapse.splice(index, 1, false);
            }else{
                this.questionInfo.sub_questions_collapse.splice(index, 1, true);
            }

        },
        uploadImg(e, type) {

            let _this = this;
            let length = e.target.files.length;

            for (var i = 0; i < length; i++) {
                let reader = new FileReader();
                reader.readAsDataURL(e.target.files[i]);
                reader.onloadend = function() {
                    if(type == 'content'){
                        _this.questionInfo.content_images.push(this.result);
                    }else if(type == 'answer'){
                        _this.questionInfo.answer_images.push(this.result);
                    }else if(type == 'analyse'){
                        _this.questionInfo.analyse_images.push(this.result);
                    }
                };
            }

            this.clearImgSelector(e);

        },
        clearImgSelector(e){

            e.target.type = "text";
            e.target.value = "";
            e.target.type = "file";

        },

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