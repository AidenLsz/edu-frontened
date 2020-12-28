<template>
    <div>
        <!-- 题目分数及题干 -->
        <el-row style="font-size: 18px; text-align: center; margin-bottom: 15px">
            <el-col :span="4">
                <span><label> ( {{ QI.score }}分 ) </label></span>
            </el-col>
            <el-col :span="19" :offset="1">
                <Mathdown name="OptionQuestions_Content" :content="QI.content"></Mathdown>
            </el-col>
        </el-row>
        <!-- 题干图片 -->
        <el-row v-for="row_count in Math.ceil(QI.content_images.length/4)" :key="row_count" style="margin-bottom: 15px">
            <el-col 
                :span="6" 
                v-for="index in [0 + (row_count - 1)*4, 
                                    1 + (row_count - 1)*4, 
                                    2 + (row_count - 1)*4, 
                                    3 + (row_count - 1)*4]" 
                :key="index"
                >
                <el-image 
                    v-if="index < QI.content_images.length"
                    :src="QI.content_images[index]" 
                    style="height: 100px; width: 100px;" 
                    fit="contain"
                    :preview-src-list="QI.content_images">
                </el-image>
            </el-col>
        </el-row>
        <!-- 选项内容及图片 -->
        <el-row v-for="index in QI.options.length" :key="index">
            <el-row>
                <el-col :span="2" style="font-size: 14px; text-align: center">
                    <span><label>{{String.fromCharCode(64 + index)}}</label></span>
                </el-col>
                <el-col :span="20">
                    <Mathdown 
                        :name="'OptionQuestions_Option_' + index.toString()" 
                        :content="QI.options[index - 1]">
                    </Mathdown>
                </el-col>
            </el-row>
            <el-row v-if="QI.options_images[index - 1] != ''" style="margin-top: 10px; margin-bottom: 15px">
                <el-col :span="6">
                    <el-image 
                        :src="QI.options_images[index - 1]" 
                        style="height: 100px; width: 200px" 
                        fit="contain"
                        :preview-src-list="QI.options_images">
                    </el-image>
                </el-col>
            </el-row>
            <el-row v-if="QI.options_images[index - 1] == ''">
                <br/>
            </el-row>
        </el-row>
        <!-- 答案内容及图片 -->
        <el-row v-if="QI.answer != '' || QI.answer_images.length > 0">
            <el-row style="font-size: 14px; text-align: center">
                <el-col :span="2">                        
                    <span><label>答案：</label></span>
                </el-col>
                <el-col :span="22" v-if="QI.answer != ''">
                    <Mathdown name="OptionQuestions_Answer" :content="QI.answer"></Mathdown>
                </el-col>
                <el-col :span="22" v-if="QI.answer == ''"  style="text-align: left">
                    <label>暂无文字答案，请参考附图</label>
                </el-col>
            </el-row>
            <br/>
            <el-row v-for="row_count in Math.ceil(QI.answer_images.length/4)" :key="row_count">
                <el-col 
                    :span="6" 
                    v-for="index in [0 + (row_count - 1)*4, 
                                        1 + (row_count - 1)*4, 
                                        2 + (row_count - 1)*4, 
                                        3 + (row_count - 1)*4]" 
                    :key="index"
                    >
                    <el-image 
                        v-if="index < QI.answer_images.length"
                        :src="QI.answer_images[index]" 
                        style="height: 100px; width: 100px;" 
                        fit="contain"
                        :preview-src-list="QI.answer_images">
                    </el-image>
                </el-col>
            </el-row>
        </el-row>
        <!-- 解析内容及图片 -->
        <el-row v-if="QI.analyse != '' || QI.analyse_images.length > 0">
            <el-row style="font-size: 14px; text-align: center">
                <el-col :span="2">                        
                    <span><label>解析：</label></span>
                </el-col>
                <el-col :span="22" v-if="QI.analyse != ''">
                    <Mathdown name="OptionQuestions_Content" :content="QI.analyse"></Mathdown>
                </el-col>
                <el-col :span="22" v-if="QI.analyse == ''" style="text-align: left">
                    <label>暂无文字解析，请参考附图</label>
                </el-col>
            </el-row>
            <br/>
            <el-row v-for="row_count in Math.ceil(QI.analyse_images.length/4)" :key="row_count">
                <el-col 
                    :span="6" 
                    v-for="index in [0 + (row_count - 1)*4, 
                                        1 + (row_count - 1)*4, 
                                        2 + (row_count - 1)*4, 
                                        3 + (row_count - 1)*4]" 
                    :key="index"
                    >
                    <el-image 
                        v-if="index < QI.analyse_images.length"
                        :src="QI.analyse_images[index]" 
                        style="height: 100px; width: 100px;" 
                        fit="contain"
                        :preview-src-list="QI.analyse_images">
                    </el-image>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>
<script>

import Mathdown from "./Mathdown.vue";
export default {
    components: { Mathdown },
    name: "OptionDisplay",
    props:{
        QI: {
            type: Object,
            default: function(){
                return {
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
            }
        }
    }
}
</script>