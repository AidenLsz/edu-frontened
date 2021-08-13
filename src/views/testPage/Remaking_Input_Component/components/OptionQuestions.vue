<template>
    <div>
        <el-row type="flex" justify="start" class="topBar">
            <el-col :span="1" :offset="1">
                <el-row 
                    type="flex" 
                    justify="center" 
                    style="height: 40px; line-height: 40px; cursor: pointer;" 
                    :class="Get_Focus_Function('Editing')"
                    @click.native="Focus_Function = 'Editing'">编辑
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
        </el-row>
        <div v-show="Focus_Function == 'Editing'">
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
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 20px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                        <span>题干：</span>
                    </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input type="textarea" v-model="Question.stem" resize="none" :rows="6"></el-input>
                    </el-row>
                </el-col>
            </el-row>
            <el-row 
                type="flex" 
                justify="start" 
                v-for="(Qption, Option_Index) in Question.option" 
                :key="'Opt_' + Option_Index" style="margin-bottom: 8px">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 35px; line-height: 35px">
                        <span>{{Get_Option_Label(Option_Index)}}：</span>
                    </el-row>
                </el-col>
                <el-col :span="14" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input type="textarea" v-model="Question.option[Option_Index]" resize="none" :rows="1"></el-input>
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
            <el-row type="flex" justify="start" style="margin-top: 20px;" v-if="detailType != '多选题'">
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
            <el-row type="flex" justify="start" style="margin-top: 20px;" v-else>
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
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 20px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                        <span>解析：</span>
                    </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input type="textarea" v-model="Question.analysis" resize="none" :rows="6"></el-input>
                    </el-row>
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 20px;">
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
        <el-row>
            {{Question}}
        </el-row>
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
            Paste_Analysis: ""
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
    },
    methods: {
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
            this.$message.success("试题内容已重置")
            this.Answer_List = []
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