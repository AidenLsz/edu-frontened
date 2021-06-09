<template>
    <div>
        <!-- 题目分数及题干 -->
        <el-row style="font-size: 15px; text-align: center; margin-bottom: 6px">
            <el-col :span="2">
                <span><label> ( {{ QI.score }}分 ) </label></span>
            </el-col>
            <el-col :span="20">
                <Mathdown :name="BI + '_' + 'MixQuestions_Content_Show'" :content="QI.content"></Mathdown>
            </el-col>
        </el-row>
        <!-- 题干图片的部分 -->
        <el-row style="margin-top: 15px; margin-bottom: 6px" v-if="QI.content_images.length > 0">
            <el-col :span="23" :offset="1" style="padding-top: 10px;">
                <el-row v-for="row_count in Math.ceil(QI.content_images.length/4)" :key="row_count">
                    <el-col 
                        :span="6" 
                        v-for="index in [0 + (row_count - 1)*4, 
                                         1 + (row_count - 1)*4, 
                                         2 + (row_count - 1)*4, 
                                         3 + (row_count - 1)*4]" 
                        :key="index"
                        >
                        <el-row v-if="index < QI.content_images.length && QI.content_images[index] != ''">
                            <el-col :span="16" >
                                <el-image 
                                    :src="QI.content_images[index]" 
                                    style="height: 100px; width: 100px" 
                                    fit="contain"
                                    :preview-src-list="QI.content_images">
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
        <el-row v-for="(item, index) in QI.sub_questions" :key="index"> 
            <el-col :offset="1">
                <!-- 展开模式交给Display来负责 -->
                <el-row style="text-align: left; font-size: 14px; margin-bottom: 6px">
                    <label>第 {{index + 1}} 小题：</label>
                </el-row>
                <el-row>
                    <OptionDisplay v-if="item.type == 'option'" :QI="item" :Bundle_Index="BI" :Sub_Index="index.toString()"></OptionDisplay>
                    <FillDisplay v-else-if="item.type == 'fill'" :QI="item" :Bundle_Index="BI" :Sub_Index="index.toString()"></FillDisplay>
                    <AnswerDisplay v-else-if="item.type == 'answer'" :QI="item" :Bundle_Index="BI" :Sub_Index="index.toString()"></AnswerDisplay>
                </el-row>
            </el-col>
        </el-row>
        <!-- 答案内容及图片 -->
        <el-row v-if="QI.answer != '' || QI.answer_images.length > 0">
            <el-row style="font-size: 14px; text-align: center">
                <el-col :span="2">                        
                    <span><label>答案：</label></span>
                </el-col>
                <el-col :span="20" v-if="QI.answer != ''">
                    <Mathdown :name="BI + '_' + 'MixQuestions_Answer_Show'" :content="QI.answer"></Mathdown>
                </el-col>
                <el-col :span="20" v-if="QI.answer == ''"  style="text-align: left">
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
                <el-col :span="20" v-if="QI.analyse != ''">
                    <Mathdown :name="BI + '_' + 'MixQuestions_Analyse_Show'" :content="QI.analyse"></Mathdown>
                </el-col>
                <el-col :span="20" v-if="QI.analyse == ''" style="text-align: left">
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

import OptionDisplay from "./OptionDisplay.vue";
import FillDisplay from "./FillDisplay.vue";
import AnswerDisplay from "./AnswerDisplay.vue";

import Mathdown from "./../../../common/components/Mathdown.vue";

export default {

    components: { OptionDisplay, FillDisplay, AnswerDisplay, Mathdown},
    name: "MixDisplay",
    props: {

        QI: {

            type: Object,
            default: function(){
                return {
                    type: "mix",
                    score: 3,
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
        BI: {
            type: String,
            default: "Bundle_0"
        }
    },
}
</script>