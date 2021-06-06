<template>
    <div>
        <!-- 单题预览的对话框 -->
        <el-dialog 
            :visible.sync="preview" 
            width="50%" 
            :modal-append-to-body="false"
            :append-to-body="true"
            title="题目预览（图片有偏移）"
        >   
            <div>
                <AnswerDisplay :QI="questionInfos"></AnswerDisplay>
            </div>
        </el-dialog>
        <!-- 分值，题干 -->
        <el-row style="margin-top: 15px">
            <!-- 左边组，第一行是分值和显示分值的地方 -->
            <!-- 第二行是添加选项，预览题目效果 -->
            <el-col :span="6">
                <el-row type="flex" justify="start">
                    <label style="padding-left: 5px; font-size: 15px; display: inline-block; width: 60px; padding-top:4px">分值：</label>
                    <el-input type="number" min="1" max="100" step="0.1" :readonly="true" v-model="questionInfos.score" size="mini" style="font-size: 15px; width: 100px; margin-left: 20px"></el-input>
                    <label style="font-size: 15px; display: inline-block; width: 20px; padding-top:4px; margin-left: 20px">分</label>
                </el-row>
                <br/>
                <el-row type="flex" justify="start">
                    <el-button size="mini" style="font-size: 12px; margin-left: 5px" @click="Sub_Questions_Add()">
                        <i class="el-icon-edit"></i>
                        添加小题
                    </el-button>
                    <el-button size="mini" style="font-size: 12px; margin-left: 20px" @click="Open_Preview()">
                        <i class="el-icon-search"></i>
                        预览本题
                    </el-button>
                </el-row>
            </el-col>
            
            <el-col :span="2" style="padding-top: 4px">
                <el-row type="flex" justify="center">
                    <span style="font-size: 15px; font-weight: bold">题目</span>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row>
                    <el-col :span="18">
                        <el-input 
                            type="textarea" 
                            v-model="questionInfos.content" 
                            :autosize="{minRows: 2, maxRows: 4}" 
                            resize="none" 
                            style="font-size: 15px"
                            placeholder="请输入题目内容（必填）">
                        </el-input>
                    </el-col>
                    <el-col :span="6" style="margin-left: -5px">
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
                                <el-button plain circle size="mini" @click="Delete_Image(index, 'content')" type="danger" ><i class="el-icon-delete"></i></el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!-- 选项与选项图片的部分 -->
        <el-row>
            <el-col :span="24" style="padding-top: 10px">
                <el-row v-for="index in questionInfos.sub_questions.length" :key="index">
                    <el-row>
                        <el-col :span="1" style="padding-top: 5px">
                            <el-button size="mini" circle plain @click="Sub_Questions_Up(index - 1)" :disabled="index == 1">
                                <i class="el-icon-arrow-up"></i>
                            </el-button>
                        </el-col>
                        <el-col :span="1" style="padding-top: 5px">
                            <el-button size="mini" circle plain @click="Sub_Questions_Down(index - 1)" :disabled="index == questionInfos.sub_questions.length">
                                <i class="el-icon-arrow-down"></i>
                            </el-button>
                        </el-col>
                        <el-col :span="1" style="padding-top: 5px">
                            <el-button size="mini" circle plain @click="Sub_Questions_Delete(index - 1)">
                                <i class="el-icon-delete"></i>
                            </el-button>
                        </el-col>
                        <el-col :span="2" style="padding-top: 10px; font-size: 15px; font-weight: bold">
                            <el-row type="flex" justify="center">
                                <label>分值</label>
                            </el-row>
                        </el-col>
                        <el-col :span="2" style="padding-top: 6px">
                            <el-input type="number" min="1" max="100" step="0.1" v-model="questionInfos.sub_questions_scores[index - 1]" size="mini" style="font-size: 15px"></el-input>
                        </el-col>
                        <el-col :span="2" style="padding-top: 10px; font-size: 15px; font-weight: bold">
                            <el-row type="flex" justify="start" style="padding-left: 20px">
                                小题 {{String.fromCharCode(64 + index)}}
                            </el-row>
                        </el-col>
                        <el-col :span="10" style="margin-left: 10px">
                            <el-input 
                                v-model="questionInfos.sub_questions[index - 1]" 
                                :placeholder="'小题' + String.fromCharCode(64 + index) + '（必填）'"
                                type="textarea" 
                                :autosize="{minRows: 2, maxRows: 4}" 
                                resize="none"
                            ></el-input>
                        </el-col>
                            
                        <el-col :span="3" :offset="1">
                            <el-row type="flex" justify="center" style="margin-left: 5px">
                                <label>添加图片</label>
                            </el-row>
                            <el-row type="flex" justify="center" style="margin-left: 5px">
                                <div 
                                    class="btn_file">
                                    <p><i class="el-icon-picture"></i></p>
                                    <input
                                        type="file"
                                        @change="uploadImg_Sub($event, index - 1)"
                                        accept="image/png, image/jpeg"
                                    />
                                </div>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 15px">
                        <el-col :span="23" :offset="1" style="padding-top: 10px;">
                            <el-row v-for="row_count in Math.ceil(questionInfos.sub_questions_images[index - 1].length/4)" :key="row_count">
                                <el-col 
                                    :span="6" 
                                    v-for="index_subImg in [0 + (row_count - 1)*4, 
                                                    1 + (row_count - 1)*4, 
                                                    2 + (row_count - 1)*4, 
                                                    3 + (row_count - 1)*4]" 
                                    :key="index_subImg"
                                    >
                                    <el-row v-if="index_subImg < questionInfos.sub_questions_images[index - 1].length">
                                        <el-col :span="16" >
                                            <el-image 
                                                :src="questionInfos.sub_questions_images[index - 1][index_subImg]" 
                                                style="height: 100px; width: 100px" 
                                                fit="contain"
                                                :preview-src-list="questionInfos.sub_questions_images[index - 1]">
                                            </el-image>
                                        </el-col>
                                        <el-col :span="8" style="padding-top: 36px">
                                            <el-button plain circle size="mini" @click="Delete_Sub_Questions_Image(index - 1, index_subImg)" type="danger" ><i class="el-icon-delete"></i></el-button>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-row>     
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
                                <el-button plain circle size="mini" @click="Delete_Image(index, 'answer')" type="danger" ><i class="el-icon-delete"></i></el-button>
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
                                <el-button plain circle size="mini" @click="Delete_Image(index, 'analyse')" type="danger" ><i class="el-icon-delete"></i></el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!-- 确认完成的按钮 -->
        <br/>
        <el-row type="flex" justify="center">
            <el-button type="success" @click="Edit_Finish()">
                <i class="el-icon-check"></i>
                编辑完成
            </el-button>
        </el-row>
    </div>
</template>

<script>
import AnswerDisplay  from "./AnswerDisplay.vue";
export default {
    components: { AnswerDisplay },
    name: "AnswerQuestions",
    props: {

        QInfos: {

            type: Object,
            default: function(){
                return {
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
            }

        },
        RE: {

            type: Boolean,
            default: false
            
        }
    },
    data(){

        return{

            questionInfos: this.QInfos,
            preview: false,
            ReEdit: this.RE,
            changecss:1

        }

    },
    watch: {

        'questionInfos.sub_questions_scores': {

            handler: function(newVal, oldVal) {

                for(var i = 0; i < newVal.length; i++){
                    if(parseFloat(newVal[i]) == 1 && oldVal){
                        newVal[i] = parseFloat(oldVal[i]);
                    }else if(parseFloat(newVal[i]) <= 0){
                        newVal.splice(i, 1, 0.1);
                        this.$message.error("一道题目应当至少有0.1分");
                        return 
                    }else if(parseFloat(newVal[i]) > 100){
                        newVal.splice(i, 1, 100);
                        this.$message.error("一道题目应当至多有100分");
                        return 
                    }else if(!parseFloat(newVal[i])){
                        newVal[i] = parseFloat(oldVal[i])
                        this.$message.error("请勿直接删除分数值");
                        return 
                    }else if(parseFloat(newVal[i])){
                        newVal[i] = parseFloat(newVal[i])
                    }
                }


                this.questionInfos.sub_questions_scores = newVal;
                this.questionInfos.score = parseFloat(this.questionInfos.sub_questions_scores[0]);

                for(var j = 1; j < this.questionInfos.sub_questions_scores.length; j++){
                    this.questionInfos.score = this.questionInfos.score + parseFloat(this.questionInfos.sub_questions_scores[j]);
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
    mounted() {
        if(sessionStorage.InputPaperEditQuestion){
            this.questionInfos = JSON.parse(sessionStorage.InputPaperEditQuestion);
        }
    },
    methods: {
        Calc_Option_Offset(index){
            
            if(index != 0){
                return 1
            }else{
                return 0
            }

        },
        Delete_Image(index, type){

            if(type == 'content'){
                this.questionInfos.content_images.splice(index, 1);
            }else if(type == 'answer'){
                this.questionInfos.answer_images.splice(index, 1);
            }else if(type == 'analyse'){
                this.questionInfos.analyse_images.splice(index, 1);
            }

        },
        Delete_Sub_Questions_Image(index, img_index){

            this.questionInfos.sub_questions_images[index].splice(img_index, 1);

        },
        uploadImg(e, type) {

            let _this = this;
            let length = e.target.files.length;

            for (var i = 0; i < length; i++) {
                let reader = new FileReader();
                reader.readAsDataURL(e.target.files[i]);
                reader.onloadend = function() {
                    if(type == 'content'){
                        _this.questionInfos.content_images.push(this.result);
                    }else if(type == 'answer'){
                        _this.questionInfos.answer_images.push(this.result);
                    }else if(type == 'analyse'){
                        _this.questionInfos.analyse_images.push(this.result);
                    }
                };
            }

            this.clearImgSelector(e);

        },
        uploadImg_Sub(e, index) {

            let _this = this;
            let length = e.target.files.length;

            for (var i = 0; i < length; i++) {
                let reader = new FileReader();
                reader.readAsDataURL(e.target.files[i]);
                reader.onloadend = function() {
                    _this.questionInfos.sub_questions_images[index].push(this.result);
                    
                };
            }

            this.clearImgSelector(e);

        },
        clearImgSelector(e){

            e.target.type = "text";
            e.target.value = "";
            e.target.type = "file";

        },
        Sub_Questions_Up(index){

            var Sub_Questions_Now = this.questionInfos.sub_questions[index];
            this.questionInfos.sub_questions.splice(index, 1);
            this.questionInfos.sub_questions.splice(index - 1, 0, Sub_Questions_Now);

            var Sub_Questions_Images_Now = this.questionInfos.sub_questions_images[index];
            this.questionInfos.sub_questions_images.splice(index, 1);
            this.questionInfos.sub_questions_images.splice(index - 1, 0, Sub_Questions_Images_Now);

            var Sub_Questions_Scores_Now = this.questionInfos.sub_questions_scores[index];
            this.questionInfos.sub_questions_scores.splice(index, 1);
            this.questionInfos.sub_questions_scores.splice(index - 1, 0, Sub_Questions_Scores_Now);

        },
        Sub_Questions_Down(index){

            var Sub_Questions_Now = this.questionInfos.sub_questions[index];
            this.questionInfos.sub_questions.splice(index, 1);
            this.questionInfos.sub_questions.splice(index + 1, 0, Sub_Questions_Now);

            var Sub_Questions_Images_Now = this.questionInfos.sub_questions_images[index];
            this.questionInfos.sub_questions_images.splice(index, 1);
            this.questionInfos.sub_questions_images.splice(index + 1, 0, Sub_Questions_Images_Now);

            var Sub_Questions_Scores_Now = this.questionInfos.sub_questions_scores[index];
            this.questionInfos.sub_questions_scores.splice(index, 1);
            this.questionInfos.sub_questions_scores.splice(index + 1, 0, Sub_Questions_Scores_Now);

        },
        Sub_Questions_Delete(index){

            if(this.questionInfos.sub_questions.length > 1){
                this.questionInfos.sub_questions.splice(index, 1);
                this.questionInfos.sub_questions_images.splice(index, 1);
                this.questionInfos.sub_questions_scores.splice(index, 1);
                this.Calc_Score();
            }else{
                this.$message("至少要保留一道小题！");
            }

        },
        Sub_Questions_Add(){

            if(this.questionInfos.sub_questions.length < 26){
                this.questionInfos.sub_questions.push("");
                this.questionInfos.sub_questions_images.push([]);
                this.questionInfos.sub_questions_scores.push(1);
                this.Calc_Score();
            }else{
                this.$message("小题过多！");
            }

        },
        Calc_Score(){
            this.questionInfos.score = 0
            for(let i = 0; i < this.questionInfos.sub_questions_scores.length; i++){
                this.questionInfos.sub_questions_scores.splice(i, 1, parseFloat(this.questionInfos.sub_questions_scores[i]))
                this.questionInfos.score += parseFloat(this.questionInfos.sub_questions_scores[i])
            }
        },
        Reset_Params(){
            this.questionInfos = {
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
        Edit_Finish(){

            if(this.Necessary_Check()){
            
                setTimeout(()=>{

                    sessionStorage.removeItem("InputPaperEditQuestion");

                    this.questionInfos.score = parseFloat(this.questionInfos.score);
                    for(let i = 0; i < this.questionInfos.sub_questions_scores.length; i++){
                        this.questionInfos.sub_questions_scores.splice(i, 1, parseFloat(this.questionInfos.sub_questions_scores[i]))
                    }

                    if(this.ReEdit == false){

                        this.$emit("EditFinish", this.questionInfos);

                    }else{

                        this.$emit("ReEditFinish", this.questionInfos);
                        this.ReEdit = false;

                    }

                    this.Reset_Params();

                }, 10);

            }else{
                this.$message.error("请先完成所有必填项的填写。");
            }

        },
        Necessary_Check(){

            var Result = true;
            
            if(this.questionInfos.content == "" && this.questionInfos.content_images.length == 0){
                Result = false
            }

            for(var i = 0; i < this.questionInfos.sub_questions.length; i++){
                if(this.questionInfos.sub_questions[i] == "" && this.questionInfos.sub_questions_images[i].length == 0){
                    Result = false
                }
            }

            return Result;

        },
        Open_Preview(){

            if(this.Necessary_Check()){
                this.preview = true;
            }else{
                this.$message.error("请先完成所有必填项的填写。");
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