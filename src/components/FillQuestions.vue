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
                <FillDisplay :QI="questionInfo"></FillDisplay>
            </div>
        </el-dialog>
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
                        <el-input type="number" min="1" max="100" step="0.1" v-model="questionInfo.score" size="mini" style="font-size: 15px"></el-input>
                    </el-col>
                </el-row>
                <br/>
                <el-row style="padding-left: 20px">
                    <el-col :span="12">
                        <el-button size="mini" style="font-size: 12px" @click="Fill_Add()">
                            <i class="el-icon-edit"></i>
                            添加占位符
                        </el-button>
                    </el-col>
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
                            v-model="questionInfo.content" 
                            :autosize="{minRows: 2, maxRows: 4}" 
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
                                <p><icon class="el-icon-picture"></icon></p>
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
                                <el-button plain circle size="mini" @click="Delete_Image(index, 'content')" type="danger" ><i class="el-icon-delete"></i></el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
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
                            <div 
                                class="btn_file"
                                :style="{ opacity: changecss }">
                                <p><icon class="el-icon-picture"></icon></p>
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
                                <el-button plain circle size="mini" @click="Delete_Image(index, 'answer')" type="danger" ><i class="el-icon-delete"></i></el-button>
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
                            <div 
                                class="btn_file"
                                :style="{ opacity: changecss }">
                                <p><icon class="el-icon-picture"></icon></p>
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
                                <el-button plain circle size="mini" @click="Delete_Image(index, 'analyse')" type="danger" ><i class="el-icon-delete"></i></el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!-- 确认完成的按钮 -->
        <br/>
        <el-row>
            <el-button type="success" @click="Edit_Finish()">
                <i class="el-icon-check"></i>
                编辑完成
            </el-button>
        </el-row>
    </div>
</template>

<script>
import FillDisplay  from "./FillDisplay.vue";
export default {
    components: { FillDisplay },
    name: "FillQuestions",
    props: {

        QInfos: {

            type: Object,
            default: function(){
                return {
                    type: "fill",
                    // 分值
                    score: 1,
                    // 题目内容，题目内容图片
                    content: "",
                    content_images: [],
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

            questionInfo: this.QInfos,
            ReEdit: this.RE,
            preview: false

        }
        
    },
    watch: {

        'questionInfo.score': {

            handler(newVal, oldVal) {
                if(newVal == ""){
                    newVal = oldVal;
                    this.$message.error("请勿直接删除分数值");
                }else if(newVal < 0){
                    newVal = 0.1;
                    this.$message.error("一道题目应当至少有0.1分");
                }else if(newVal > 100){
                    newVal = 100;
                    this.$message.error("一道题目应当至多有100分");
                }
                this.questionInfo.score = newVal;
            },

            deep: true,
            immediate: true,
        
        },
        QInfos(newVal){

            this.questionInfo = newVal;

        },
        RE(newVal){
            
            this.ReEdit = newVal;

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
                this.questionInfo.content_images.splice(index, 1);
            }else if(type == 'answer'){
                this.questionInfo.answer_images.splice(index, 1);
            }else if(type == 'analyse'){
                this.questionInfo.analyse_images.splice(index, 1);
            }

        },
        uploadImg(e, type) {

            let _this = this;
            let length = e.target.files.length;
            console.log(e.target.files);

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
        Edit_Finish(){

            if(this.Necessary_Check()){
            
                setTimeout(()=>{

                    if(this.ReEdit == false){

                        this.$emit("EditFinish", this.questionInfo);

                    }else{

                        this.$emit("ReEditFinish", this.questionInfo);
                        this.ReEdit = false;

                    }

                }, 10);

            }else{
                this.$message.error("请先完成所有必填项的填写。");
            }

        },
        Necessary_Check(){

            var Result = true;
            
            if(this.questionInfo.content == ""){
                Result = false
            }

            return Result;

        },
        Open_Preview(){

            if(this.Necessary_Check()){
                this.preview = true;
            }else{
                this.$message.error("请先完成所有必填项的填写。");
            }

        },
        Fill_Add(){

            this.questionInfo.content = this.questionInfo.content + "________"

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