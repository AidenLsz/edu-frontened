// 这一页面的主要作用是测试以种类大题的形式加入大题分类

<template>
    <div>
        <!-- 提供给选择题的编辑器 -->
        <el-dialog 
            :visible.sync="showDialog" 
            title="请编辑想要插入/修改的选择题内容" 
            width="65%" 
            @close="Editor_Dialog_Close()"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
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
                :QInfos.sync="Temp_OptionQuestionInfo" 
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
            :close-on-click-modal="false"
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
                :QInfos.sync="Temp_FillQuestionInfo" 
            ></FillQuestions>
        </el-dialog>
        <!-- 提供给解答题的编辑器 -->
        <el-dialog 
            :visible.sync="showDialog_Answer" 
            title="请编辑想要插入/修改的解答题内容" 
            width="65%" 
            @close="Editor_Dialog_Close()"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
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
                :QInfos.sync="Temp_AnswerQuestionInfo" 
            ></AnswerQuestions>
        </el-dialog>
        <!-- 测试用按钮行 -->
        <!-- <el-button @click="showDialog = true">插入新选择题</el-button>
        <el-button @click="showDialog_Fill = true">插入新填空题</el-button>
        <el-button @click="showDialog_Answer = true">插入新解答题</el-button>
        <el-divider></el-divider> -->
        <!-- 渲染区，要求所见即所得 -->
        <el-row>

            <el-col :span="8">
                <el-row><el-button @click="Add_Question_List('option')">添加选择题大题</el-button></el-row>
                <el-row><el-button @click="Add_Question_List('fill')">添加填空题大题</el-button></el-row>
                <el-row><el-button @click="Add_Question_List('answer')">添加解答题大题</el-button></el-row>
            </el-col>
            
            <el-col :span="16">
                <!-- <el-row v-for="(item, index) in Questions_List" :key="index">
                    <el-col>
                        编辑题目，上移，下移，删除，折叠/展开按钮
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
                                    :disabled="index == Questions_List.length - 1" 
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
                                <div v-if="Questions_Collapse[index] == false">
                                    <el-button 
                                        round 
                                        plain
                                        size="small"
                                        type="info"
                                        @click="Change_Question_Collapse(index)"
                                    >折叠</el-button>
                                </div>
                                <div v-if="Questions_Collapse[index] == true">
                                    <el-button 
                                        round 
                                        plain
                                        size="small"
                                        type="info"
                                        @click="Change_Question_Collapse(index)"
                                    >展开</el-button>
                                </div>
                            </el-col>
                        </el-row>
                        展开模式交给Display来负责，折叠模式为了避免样式报错，直接转换成文字格式
                        <div v-if="Questions_Collapse[index] == false">
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
                        <div v-if="Questions_Collapse[index]">
                            <el-row style="text-align: left; font-size: 20px">
                                <el-col :span="2">
                                    <label>第 {{index + 1}} 题</label>
                                </el-col>
                                <el-col :span="21" :offset="1">
                                    <label>{{Get_Collapse_Show(item)}}</label>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row> -->
                <el-row v-for="(Question_Bundle, Bundle_Index) in Questions" :key="Bundle_Index">
                    <!-- 第一行：大题编号，添加新的小题，题目类型，上移，下移，删除，题目说明 -->
                    <el-row >
                        <el-col :span="2" style="font-size: 18px; padding-top: 8px">
                            <label><span>第{{Bundle_Index + 1}}大题</span></label>
                        </el-col>
                        <el-col :span="2" style="font-size: 18px; padding-top: 8px">
                            <label><span>{{Get_Bundle_Type_Label(Question_Bundle)}}</span></label>
                        </el-col>
                        <el-col :span="1" style="padding-top: 5px">
                            <el-button circle plain size="small" type="message" @click="New_Question(Bundle_Index, Question_Bundle)">
                                <i class="el-icon-plus"></i>
                            </el-button>
                        </el-col>
                        <el-col :span="2" style="padding-top: 5px">
                            <el-button-group>
                                <el-button circle plain size="small" type="message" @click="Bundle_Up(Bundle_Index)">
                                    <i class="el-icon-arrow-up"></i>
                                </el-button>
                                <el-button circle plain size="small" type="message" @click="Bundle_Down(Bundle_Index)">
                                    <i class="el-icon-arrow-down"></i>
                                </el-button>
                            </el-button-group>
                        </el-col>
                        <el-col :span="1" style="padding-top: 5px">
                            <el-button circle plain size="small" type="message" @click="Bundle_Delete(Bundle_Index)">
                                <i class="el-icon-delete"></i>
                            </el-button>
                        </el-col>
                        <el-col :span="13" :offset="1">
                            <el-input v-model="Question_Bundle.Bundle_Introduce" placeholder="大题说明"></el-input>
                        </el-col>
                    </el-row>
                    <!-- 之后的每一行，读取这个大题中的一个题目，然后进行对应的渲染 -->
                    <el-row v-for="(Question, Question_Index) in Question_Bundle.Bundle_Questions" :key="Question_Index">
                        <el-col :offset="2">
                            <!-- 编辑题目，上移，下移，删除，折叠/展开按钮 -->
                            <el-row style="margin-top: 5px; margin-bottom: 10px">
                                <el-col :span="2" style="text-align: left; font-size: 16px; padding-top: 4px">
                                    <label>第 {{Question_Index + 1}} 题</label>
                                </el-col>
                                <el-col :span="1">
                                    <el-button 
                                        circle 
                                        size="small"
                                        @click="Edit_Question(Bundle_Index, Question_Index)"
                                    ><i class="el-icon-edit"></i></el-button>
                                </el-col>
                                <el-col :span="2">
                                    <el-button-group>
                                        <el-button 
                                            :disabled="Question_Index == 0" 
                                            circle 
                                            size="small"
                                            @click="Question_Up(Bundle_Index, Question_Index)"
                                        ><i class="el-icon-arrow-up"></i></el-button>
                                        <el-button 
                                            :disabled="Question_Index == Question_Bundle.Bundle_Questions.length - 1" 
                                            circle 
                                            size="small"
                                            @click="Question_Down(Bundle_Index, Question_Index)"
                                        ><i class="el-icon-arrow-down"></i></el-button>
                                    </el-button-group>
                                </el-col>
                                <el-col :span="1">
                                    <el-button 
                                        circle 
                                        plain
                                        size="small"
                                        type="danger"
                                        @click="Question_Delete(Bundle_Index, Question_Index)"
                                    ><i class="el-icon-delete"></i></el-button>
                                </el-col>
                                <el-col :span="1" :offset="1">
                                    <div v-if="Question_Bundle.Bundle_Questions_Collapse[Question_Index] == false">
                                        <el-button 
                                            round 
                                            plain
                                            size="small"
                                            type="info"
                                            @click="Change_Question_Collapse(Bundle_Index, Question_Index)"
                                        >折叠</el-button>
                                    </div>
                                    <div v-if="Question_Bundle.Bundle_Questions_Collapse[Question_Index] == true">
                                        <el-button 
                                            round 
                                            plain
                                            size="small"
                                            type="info"
                                            @click="Change_Question_Collapse(Bundle_Index, Question_Index)"
                                        >展开</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                            <!-- 展开模式交给Display来负责，折叠模式为了避免样式报错，直接转换成文字格式 -->
                            <div v-if="Question_Bundle.Bundle_Questions_Collapse[Question_Index] == false">
                                <el-row>
                                    <OptionDisplay v-if="Question.type == 'option'" :QI="Question"></OptionDisplay>
                                    <FillDisplay v-else-if="Question.type == 'fill'" :QI="Question"></FillDisplay>
                                    <AnswerDisplay v-else-if="Question.type == 'answer'" :QI="Question"></AnswerDisplay>
                                </el-row>
                            </div>
                            <div v-if="Question_Bundle.Bundle_Questions_Collapse[Question_Index]">
                                <el-row style="text-align: left; font-size: 14px">
                                    <el-col :offset="1">
                                        <label>{{Get_Collapse_Show(Question)}}</label>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>

import ComplexInput from "./ComplexInput.vue"
import OptionQuestions from "./OptionQuestions.vue";
import FillQuestions from "./FillQuestions.vue";
import AnswerQuestions from "./AnswerQuestions.vue";
import OptionDisplay from "./OptionDisplay.vue";
import FillDisplay from "./FillDisplay.vue";
import AnswerDisplay from "./AnswerDisplay.vue";

export default {

    components: { ComplexInput,
                  OptionQuestions, FillQuestions, AnswerQuestions,
                  OptionDisplay, FillDisplay, AnswerDisplay},
    name: "TestPage",
    data(){
        return {
            // 选择题编辑器,填空题编辑器和解答题编辑器的显示控制
            showDialog: false,
            showDialog_Fill: false,
            showDialog_Answer: false,
            // 打开复杂输入框的控制
            complex_Input: false,
            // 题目信息和折叠信息
            Questions_List: [],
            Questions_Collapse: [],
            // 重写编辑标记
            ReEditSwitch: false,
            // 临时存放/读取题目数据用的Json变量
            Temp_OptionQuestionInfo: {

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
            Temp_FillQuestionInfo: {

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
            Temp_AnswerQuestionInfo: {

                type: "answer",
                // 分值
                score: 1,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 小题的部分
                sub_questions: [""],
                sub_questions_images: [[]],
                sub_questions_scores: [1],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: []

            },
            // 临时保存重写编辑的位置用的记号
            Index_Edit_Record: -1,

            // 测试大题类型用的保存数组
            Questions: [],
            // 保存当前操作题包序号的标签：
            Question_Bundle_Add_Index: -1
        }
    },
    methods: {
        // 处理插入新题目的办法
        // 需要管理两个条目，一个是题目内容，一个是是否折叠
        // 由于折叠属性放在题目内会对显示造成复杂化的结果，就放在外面
        // 查找次序依次为题目包，点击添加按钮的包序号，然后访问这个包下保存题目和题目折叠信息的条目
        New_Questions(val){

            this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions.push(val);
            this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions_Collapse.push(false);

            this.Question_Bundle_Add_Index = -1;

            this.Close_Editor();
            this.Reset_Params();

        },
        // 处理想要修改题目内容时的方法
        // 核心思路是把题目内容的部分丢给编辑器，让编辑器来读取内容
        // 然后等待编辑器内部的处理
        // 在这里，是否发送重写信号由ReEditSwitch来决定
        // Question_Bundle_Add_Index临时用于存放一下编辑的题包序号
        // Index_Edit_Record用于记录题包下的题目序号
        // Temp名称用于临时交换让编辑器处理的数据内容
        // showDialog代表显示的是哪个编辑器
        Edit_Question(Bundle_Index, Question_Index){

            if(this.Questions[Bundle_Index].Bundle_Questions[Question_Index].type == 'option'){
                this.showDialog = true;
                this.Temp_OptionQuestionInfo = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
            }else if(this.Questions[Bundle_Index].Bundle_Questions[Question_Index].type == 'fill'){
                this.showDialog_Fill = true;
                this.Temp_FillQuestionInfo = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
            }else if(this.Questions[Bundle_Index].Bundle_Questions[Question_Index].type == 'answer'){
                this.showDialog_Answer = true;
                this.Temp_AnswerQuestionInfo = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
            }

            this.ReEditSwitch = true;
            this.Question_Bundle_Add_Index = Bundle_Index;
            this.Index_Edit_Record = Question_Index;

        },
        Editor_Dialog_Close(){

            this.Close_Editor();
            this.Reset_Params();

        },
        // 重写编辑后，把新数据直接覆盖上去
        ReEdit_Questions(val){

            this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions.splice(this.Index_Edit_Record, 1, val);

            this.Close_Editor();
            this.Reset_Params();
            
        },
        // 一起关掉
        Close_Editor(){

            this.showDialog = false;
            this.showDialog_Fill = false;
            this.showDialog_Answer = false;

        },
        // 处理完题目的录入之后要重置这些临时使用的变量
        Reset_Params(){

            this.Index_Edit_Record = -1;
            this.Question_Bundle_Add_Index = -1;
            this.ReEditSwitch = false;

            this.Temp_OptionQuestionInfo = {

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

            this.Temp_FillQuestionInfo = {

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

            this.Temp_AnswerQuestionInfo = {

                type: "answer",
                // 分值
                score: 1,
                // 题目内容，题目内容图片，是否显示图片
                content: "",
                content_images: [],
                // 小题的部分
                sub_questions: [""],
                sub_questions_images: [[]],
                sub_questions_scores: [1],
                // 答案的部分
                answer: "",
                answer_images: [],
                // 解析的部分
                analyse: "",
                analyse_images: []

            }

        },
        // 移动题目位置
        // 注意要一次移动信息和折叠属性两个，不然会有问题
        Question_Up(Bundle_Index, Question_Index){

            var temp_Save = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
            this.Questions[Bundle_Index].Bundle_Questions.splice(Question_Index, 1);
            this.Questions[Bundle_Index].Bundle_Questions.splice(Question_Index - 1, 0, temp_Save);

            var temp_coll = this.Questions[Bundle_Index].Bundle_Questions_Collapse[Question_Index];
            this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index, 1);
            this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index - 1, 0, temp_coll);

        },
        Question_Down(Bundle_Index, Question_Index){

            var temp_Save = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
            this.Questions[Bundle_Index].Bundle_Questions.splice(Question_Index, 1);
            this.Questions[Bundle_Index].Bundle_Questions.splice(Question_Index + 1, 0, temp_Save);

            var temp_coll = this.Questions[Bundle_Index].Bundle_Questions_Collapse[Question_Index];
            this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index, 1);
            this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index + 1, 0, temp_coll);

        },
        // 删除题目也是一样，要一起删除折叠信息
        Question_Delete(Bundle_Index, Question_Index){

            this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index, 1);
            this.Questions[Bundle_Index].Bundle_Questions.splice(Question_Index, 1);

            if(this.Questions[Bundle_Index].Bundle_Questions.length == 0){

                this.Bundle_Delete(Bundle_Index);

            }

        },
        // 上，下，删的题包版本
        Bundle_Up(Bundle_Index){

            var Bundle_Now = this.Questions[Bundle_Index];
            this.Questions.splice(Bundle_Index, 1);
            this.Questions.splice(Bundle_Index - 1, 0, Bundle_Now);

        },
        Bundle_Down(Bundle_Index){

            var Bundle_Now = this.Questions[Bundle_Index];
            this.Questions.splice(Bundle_Index, 1);
            this.Questions.splice(Bundle_Index + 1, 0, Bundle_Now);

        },
        Bundle_Delete(Bundle_Index){

            this.Questions.splice(Bundle_Index, 1);

        },
        // 修改折叠属性，注意要用splice，否则会有bug
        // 天知道vue这到底什么谜一样的前端内容……
        Change_Question_Collapse(Bundle_Index, Question_Index){

            if(this.Questions[Bundle_Index].Bundle_Questions_Collapse[Question_Index]){
                this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index, 1, false);
            }else{
                this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index, 1, true);
            }

        },
        // 压缩题目长度，使过长的题目能正常显示
        Get_Collapse_Show(Ques){

            var Score = Ques.score.toString();
            var Content = Ques.content;

            var Result = "（ " + Score + "分 ）   ";
            if(Content.length > 30){
                Content = Content.substring(0, 30) + "……";
            }

            Result = Result + Content;
            return Result

        },

        // 从这里开始是尝试加入确定种类的大题部分
        // 添加新的大题题包
        Add_Question_List(Type){

            var New_Question_Bundle = {
                
                Bundle_Type: Type,
                Bundle_Introduce: "",
                Bundle_Questions: [],
                Bundle_Collapse: false,
                Bundle_Questions_Collapse: []

            }

            this.Questions.push(New_Question_Bundle);

        },
        // 确定显示的大题题包类型
        Get_Bundle_Type_Label(Bundle){

            var Result = ""

            if(Bundle.Bundle_Type == 'option'){
                Result = "选择题";
            }else if(Bundle.Bundle_Type == 'fill'){
                Result = "填空题";
            }else if(Bundle.Bundle_Type == 'answer'){
                Result = "解答题";
            }else if(Bundle.Bundle_Type == 'mix'){
                Result = "组合题";
            }

            return Result

        },
        // 给对应序号的大题添加新小题
        New_Question(Bundle_Index, Question_Bundle){

            this.Question_Bundle_Add_Index = Bundle_Index;

            if(Question_Bundle.Bundle_Type == 'option'){
                this.showDialog = true;
            }else if(Question_Bundle.Bundle_Type == 'fill'){
                this.showDialog_Fill = true;
            }else if(Question_Bundle.Bundle_Type == 'answer'){
                this.showDialog_Answer = true;
            }

        }
    }
}
</script>