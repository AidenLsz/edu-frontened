// 这一页面主要用于测试各类新功能的显示是否符合具体要求，等待完成后再放到正式页面上去

<template>
    <div style="min-height: 600px" ref="PaperAnalyseInfo">
    <!-- 准备开始写大题分析图表 -->
    <!-- QB即Question_Bundle，指题包 -->
    <el-dialog
        :visible.sync="Question_Bundle_Analyse"
        :title="'第' + Get_Question_Bundle_Index(this.Question_Bundle_Index) + '大题分析'" 
        width="80%"
        @close="Part_Expand_QB = [false, false];"
        :modal-append-to-body="false"
        :close-on-click-modal="true">
        <!-- 综合分析的部分 -->
        <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse_QB(0)" :class="Get_Part_Row_Style_QB(0)">
            <el-col :span="14" style="text-align: left">
                综合分析
            </el-col>
            <el-col :span="2" :offset="8">
                <i class="el-icon-arrow-down" v-if="!Part_Expand_QB[0]"></i>
                <i class="el-icon-arrow-up" v-if="Part_Expand_QB[0]"></i>
            </el-col>
        </el-row>
        <el-row :class="Get_Expand_Or_Collapse_QB(0)">
            <!-- 本大题的小题数量 -->
            <el-row style="width: 67%; margin-left: 16.5%; font-size: 1.5rem; text-align: left" type="flex" justify="start">
                <label>此大题共{{Paper_Json_Question_Bundle_Info.sub_question.length}}道题目，各项指标如下：</label>
            </el-row>
            <!-- 三项指标的假表格 -->
            <!-- 表头项 -->
            <el-row style="width: 67%; margin-left: 16.5%; background: WhiteSmoke; font-weight: bold; font-size: 1.5rem; margin-top: 30px; padding-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver">
                <el-col :span="5" :offset="4">均值</el-col>
                <el-col :span="5">方差</el-col>
                <el-col :span="5">最大值</el-col>
                <el-col :span="5">最小值</el-col>
            </el-row>
            <!-- 第一项 -->
            <el-row style="width: 67%; margin-left: 16.5%; margin-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver">
                <el-col :span="4">难度</el-col>
                <el-col :span="5">{{Reduce_Length(Paper_Json_Question_Bundle_Info.difficulty_statistics.mean)}}</el-col>
                <el-col :span="5">{{Reduce_Length(Paper_Json_Question_Bundle_Info.difficulty_statistics.min)}}</el-col>
                <el-col :span="5">{{Reduce_Length(Paper_Json_Question_Bundle_Info.difficulty_statistics.max)}}</el-col>
                <el-col :span="5">{{Reduce_Length(Paper_Json_Question_Bundle_Info.difficulty_statistics.std)}}</el-col>
            </el-row>
            <!-- 第二项 -->
            <el-row style="width: 67%; margin-left: 16.5%; margin-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver">
                <el-col :span="4">指标2</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
            </el-row>
            <!-- 第三项 -->
            <el-row style="width: 67%; margin-left: 16.5%; margin-top: 5px; margin-bottom: 40px; padding-bottom: 5px; border-bottom: 1px solid silver">
                <el-col :span="4">指标3</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
            </el-row>
            <!-- 随意添加的一个假柱状图 -->
            <el-row>
                <div id="QB_Total_Bar" class="QB_Total_Bar"></div>
            </el-row>
        </el-row>
        <!-- 分析详情 -->
        <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse_QB(1)" :class="Get_Part_Row_Style_QB(1)">
            <el-col :span="14" style="text-align: left">
                知识点分析
            </el-col>
            <el-col :span="2" :offset="8">
                <i class="el-icon-arrow-down" v-if="!Part_Expand_QB[1]"></i>
                <i class="el-icon-arrow-up" v-if="Part_Expand_QB[1]"></i>
            </el-col>
        </el-row>
        <el-row :class="Get_Expand_Or_Collapse_QB(1)">
            <!-- 知识点分析 -->
            <el-row>
                <!-- 知识点难度分析部分 -->
                <!-- 总分析行 -->
                <el-row type="flex" justify="start" style="width: 67%; margin-left: 16.5%; font-size: 1.5rem; margin-top: 30px; text-align: left">
                    <label>此大题共包含了&nbsp;&nbsp;{{Get_QB_Knowledge_Length()}}&nbsp;&nbsp;个知识点，<span v-if="Get_QB_Knowledge_Length() > 1">难度最大的知识点</span>为&nbsp;&nbsp;{{Get_QB_Knowledge_Difficult(true)}}&nbsp;&nbsp;
                        <span v-if="Get_QB_Knowledge_Length() > 1">，难度最小的知识点为&nbsp;&nbsp;{{Get_QB_Knowledge_Difficult(false)}}&nbsp;&nbsp;。</span>
                        <span v-else>。</span>
                        </label>
                </el-row>
                <!-- 提示行 -->
                <el-row type="flex" justify="start" style="width: 67%; margin-left: 16.5%; font-size: 1.5rem">
                    <label>各知识点平均难度为：</label>
                </el-row>
                <!-- 知识点难度分布柱状图 -->
                <el-row>
                    <div id="QB_Knowledge_Difficult_Analyse" class="QB_Knowledge_Difficult_Analyse"></div>
                </el-row>
                <!-- 知识点分值分布部分 -->
                <!-- 总分析行 -->
                <el-row type="flex" justify="start" style="width: 67%; margin-left: 16.5%; font-size: 1.5rem; margin-top: 30px; margin-right: 16.5%; text-align: left">
                    <label style=" text-align: left; margin-bottom: 20px">此大题总分为&nbsp;&nbsp;{{Paper_Json_Question_Bundle_Info.score}}&nbsp;&nbsp;分。
                        其中<span v-if="QB_KnowledgeScore_Name_List.length > 1">，分值最大</span>的知识点为&nbsp;&nbsp;{{QB_KnowledgeScore_Name_List[0]}}&nbsp;&nbsp;
                        {{QB_Get_Second_Score()}}<span v-if="QB_KnowledgeScore_Name_List.length > 1">
                        ，分值最小的知识点为&nbsp;&nbsp;{{QB_KnowledgeScore_Name_List[QB_KnowledgeScore_List.length - 1]}}&nbsp;&nbsp;
                        ，仅占&nbsp;&nbsp;{{QB_KnowledgeScore_List[QB_KnowledgeScore_List.length - 1]}}&nbsp;&nbsp;分。
                        </span>
                        <span v-else>
                            ，占&nbsp;&nbsp;{{QB_KnowledgeScore_List[0]}}&nbsp;&nbsp;分。
                        </span>
                    </label>
                </el-row>
                <!-- 提示行 -->
                <el-row type="flex" justify="start" style="width: 67%; margin-left: 16.5%; font-size: 1.5rem">
                    <label>各知识点所占分值为：</label>
                </el-row>
                <!-- 知识点难度分布柱状图 -->
                <el-row>
                    <div id="QB_Knowledge_Score_Analyse" class="QB_Knowledge_Score_Analyse"></div>
                </el-row>
                <!-- 知识点点对分布部分 -->
                <!-- 总分析行 -->
                <el-row type="flex" justify="start" style="width: 67%; margin-left: 16.5%; font-size: 1.5rem; margin-top: 30px; margin-right: 16.5%; text-align: left">
                    <label v-if="QB_KnowledgePair_Name_List.length > 0" style=" text-align: left">
                        共同出现次数最多的知识点为&nbsp;&nbsp;{{QB_Get_First_Pair()}}&nbsp;&nbsp;，
                        共同出现了&nbsp;&nbsp;{{QB_KnowledgePair_List[0]}}&nbsp;&nbsp;次
                        {{QB_Get_Second_Pair()}}
                    </label>
                    <label v-if="QB_KnowledgePair_Name_List.length == 0">
                        此大题中没有共同出现的知识点对。
                    </label>
                </el-row>
                <!-- 提示行 -->
                <el-row v-if="QB_KnowledgePair_Name_List.length > 0" type="flex" justify="start" style="width: 67%; margin-left: 16.5%; font-size: 1.5rem">
                    <label>知识点共现关系如下：</label>
                </el-row>
                <!-- 知识点点对分布表格展示部分 -->
                <el-row v-if="QB_KnowledgePair_Name_List.length > 0"  style="font-size: 1.5rem; margin-top: 30px; ">
                    <el-row style="background: #409EFD; color: white; margin: 0px 16.5vw;">
                        <el-col :offset="2" :span="7"><label>知识点Ⅰ</label></el-col>
                        <el-col :span="7"><label>知识点Ⅱ</label></el-col>
                        <el-col :span="7"><label>出现次数</label></el-col>
                    </el-row>
                    <el-row v-for="(QB_Knowledge_Pair, Pair_Index) in QB_KnowledgePair_Name_List" :key="'QB_Ku_Pair_' + Pair_Index" :class="Total_Table_Style(Pair_Index)">
                        <el-col :offset="2" :span="7"><label>{{Paper_Total_Get_Ku_Pair_Part(QB_Knowledge_Pair, 0)}}</label></el-col>
                        <el-col :span="7"><label>{{Paper_Total_Get_Ku_Pair_Part(QB_Knowledge_Pair, 1)}}</label></el-col>
                        <el-col :span="7"><label>{{QB_KnowledgePair_List[Pair_Index]}}</label></el-col>
                    </el-row>
                </el-row>
                <!-- 知识点点对分布共现关系的图的部分 -->
                <el-row v-if="QB_KnowledgePair_Name_List.length > 0">
                    <div id="QB_Knowledge_Pair" class="QB_Knowledge_Pair"></div>
                </el-row>
            </el-row>
        </el-row>
    </el-dialog>
    <el-row style="padding-top: 15px">
        <label style="font-size: 2rem">xxx试卷分析报告</label>
    </el-row>
    <el-row>
        <el-col :span="18" :offset="3">
            <el-divider style="width: 3px"></el-divider>
        </el-col>
    </el-row>
    <!-- 综合分析 -->
    <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(0)" :class="Get_Part_Row_Style(0)">
        <el-col :span="12" style="text-align: left">
            综合分析
        </el-col>
        <el-col :span="2" :offset="10">
            <i class="el-icon-arrow-down" v-if="!Part_Expand[0]"></i>
            <i class="el-icon-arrow-up" v-if="Part_Expand[0]"></i>
        </el-col>
    </el-row>
    <el-row :class="Get_Expand_Or_Collapse(0)">
        <!-- 本卷大题数量 -->
        <el-row style="width: 67vw; margin-left: 16.5vw; font-size: 1.5rem; text-align: left" type="flex" justify="start">
            <label>本卷共{{Paper_Json.sub_question.length}}道大题，各项指标如下：</label>
        </el-row>
        <!-- 三项指标的假表格 -->
        <!-- 表头项 -->
        <el-row style="width: 67vw; background: WhiteSmoke; font-weight: bold; font-size: 1.5rem; margin-left: 16.5vw; margin-top: 30px; padding-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver">
            <el-col :span="5" :offset="4">均值</el-col>
            <el-col :span="5">方差</el-col>
            <el-col :span="5">最大值</el-col>
            <el-col :span="5">最小值</el-col>
        </el-row>
        <!-- 第一项 -->
        <el-row style="width: 67vw; margin-left: 16.5vw; margin-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver">
            <el-col :span="4">难度</el-col>
            <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.mean)}}</el-col>
            <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.min)}}</el-col>
            <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.max)}}</el-col>
            <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.std)}}</el-col>
        </el-row>
        <!-- 第二项 -->
        <el-row style="width: 67vw; margin-left: 16.5vw; margin-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver">
            <el-col :span="4">指标2</el-col>
            <el-col :span="5">0</el-col>
            <el-col :span="5">0</el-col>
            <el-col :span="5">0</el-col>
            <el-col :span="5">0</el-col>
        </el-row>
        <!-- 第三项 -->
        <el-row style="width: 67vw; margin-left: 16.5vw; margin-top: 5px; margin-bottom: 40px; padding-bottom: 5px; border-bottom: 1px solid silver">
            <el-col :span="4">指标3</el-col>
            <el-col :span="5">0</el-col>
            <el-col :span="5">0</el-col>
            <el-col :span="5">0</el-col>
            <el-col :span="5">0</el-col>
        </el-row>
        <!-- 随意添加的一个假柱状图 -->
        <el-row>
            <div id="Paper_Total_Bar" class="Paper_Total_Bar"></div>
        </el-row>
    </el-row>
    <!-- 分析详情 -->
    <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(1)" :class="Get_Part_Row_Style(1)">
        <el-col :span="12" style="text-align: left">
            分析详情
        </el-col>
        <el-col :span="2" :offset="10">
            <i class="el-icon-arrow-down" v-if="!Part_Expand[1]"></i>
            <i class="el-icon-arrow-up" v-if="Part_Expand[1]"></i>
        </el-col>
    </el-row>
    <el-row :class="Get_Expand_Or_Collapse(1)">
        <el-row style="width: 18vw; margin-left: 41vw; margin-top: 10px; border: 1px solid #409EFD; border-radius: 10px; height: 30px">
            <el-col :span="12" style="border-top-left-radius: 10px; border-bottom-left-radius: 10px;" :class="Check_Total_Switch(true)" v-on:click.native="Paper_Total_Analyse_Focus = true">
                知识点分析
            </el-col>
            <el-col :span="12" style="border-top-right-radius: 10px; border-bottom-right-radius: 10px;" :class="Check_Total_Switch(false)" v-on:click.native="Paper_Total_Analyse_Focus = false">
                难度分析
            </el-col>
        </el-row>
        <!-- 知识点分析 -->
        <el-row :class="Paper_Total_Analyse_Hidden(true)">
            <!-- 知识点难度分析部分 -->
            <!-- 总分析行 -->
            <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem; margin-top: 30px; text-align: left">
                <label>本卷共包含了&nbsp;&nbsp;{{Get_Paper_Knowledge_Length()}}&nbsp;&nbsp;个知识点，难度最大的知识点为&nbsp;&nbsp;{{Get_Paper_Knowledge_Difficult(true)}}&nbsp;&nbsp;，难度最小的知识点为&nbsp;&nbsp;{{Get_Paper_Knowledge_Difficult(false)}}&nbsp;&nbsp;。</label>
            </el-row>
            <!-- 提示行 -->
            <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem">
                <label>各知识点平均难度为：</label>
            </el-row>
            <!-- 知识点难度分布柱状图 -->
            <el-row>
                <div id="Paper_Knowledge_Difficult_Analyse" class="Paper_Knowledge_Difficult_Analyse"></div>
            </el-row>
            <!-- 知识点分值分布部分 -->
            <!-- 总分析行 -->
            <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem; margin-top: 30px; margin-right: 16.5vw; text-align: left">
                <label>本卷总分为&nbsp;&nbsp;{{Paper_Json.score}}&nbsp;&nbsp;分。
                    其中，分值最大的知识点为&nbsp;&nbsp;{{KnowledgeScore_Name_List[0]}}&nbsp;&nbsp;
                    {{Paper_Total_Get_Second_Score()}}
                    ，分值最小的知识点为&nbsp;&nbsp;{{KnowledgeScore_Name_List[KnowledgeScore_List.length - 1]}}&nbsp;&nbsp;
                    ，仅占&nbsp;&nbsp;{{KnowledgeScore_List[KnowledgeScore_List.length - 1]}}&nbsp;&nbsp;分。</label>
            </el-row>
            <!-- 提示行 -->
            <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem">
                <label>各知识点所占分值为：</label>
            </el-row>
            <!-- 知识点难度分布柱状图 -->
            <el-row>
                <div id="Paper_Knowledge_Score_Analyse" class="Paper_Knowledge_Score_Analyse"></div>
            </el-row>
            <!-- 知识点点对分布部分 -->
            <!-- 总分析行 -->
            <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem; margin-top: 30px; margin-right: 16.5vw; text-align: left">
                <label v-if="KnowledgePair_Name_List.length > 0">
                    共同出现次数最多的知识点为&nbsp;&nbsp;{{Paper_Total_Get_First_Pair()}}&nbsp;&nbsp;，
                    共同出现了&nbsp;&nbsp;{{KnowledgePair_List[0]}}&nbsp;&nbsp;次
                    {{Paper_Total_Get_Second_Pair()}}
                </label>
                <label v-if="KnowledgePair_Name_List.length == 0">
                    本卷中没有共同出现的知识点对。
                </label>
            </el-row>
            <!-- 提示行 -->
            <el-row v-if="KnowledgePair_Name_List.length > 0" type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem">
                <label>知识点共现关系如下：</label>
            </el-row>
            <!-- 知识点点对分布表格展示部分 -->
            <el-row v-if="KnowledgePair_Name_List.length > 0"  style="font-size: 1.5rem; margin-top: 30px; ">
                <el-row style="background: #409EFD; color: white; margin: 0px 16.5vw;">
                    <el-col :offset="2" :span="7"><label>知识点Ⅰ</label></el-col>
                    <el-col :span="7"><label>知识点Ⅱ</label></el-col>
                    <el-col :span="7"><label>出现次数</label></el-col>
                </el-row>
                <el-row v-for="(Knowledge_Pair, Pair_Index) in KnowledgePair_Name_List" :key="'T_P_Ku_Pair_' + Pair_Index" :class="Total_Table_Style(Pair_Index)">
                    <el-col :offset="2" :span="7"><label>{{Paper_Total_Get_Ku_Pair_Part(Knowledge_Pair, 0)}}</label></el-col>
                    <el-col :span="7"><label>{{Paper_Total_Get_Ku_Pair_Part(Knowledge_Pair, 1)}}</label></el-col>
                    <el-col :span="7"><label>{{KnowledgePair_List[Pair_Index]}}</label></el-col>
                </el-row>
            </el-row>
            <!-- 知识点点对分布共现关系的图的部分 -->
            <el-row v-if="KnowledgePair_Name_List.length > 0">
                <div id="Paper_Knowledge_Pair" class="Paper_Knowledge_Pair"></div>
            </el-row>
            <!-- 知识点覆盖程度部分 -->
            <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem; margin-top: 30px; margin-right: 16.5vw; text-align: left">
                <label>本卷覆盖的知识点比例尚待进一步分析。（下方区域是圆环图今后大致的占位区域）</label>
            </el-row>
            <el-row>
                <div id="Paper_Knowledge_Cover" class="Paper_Knowledge_Cover"></div>
            </el-row>
        </el-row>
        <!-- 难度分析 -->
        <el-row :class="Paper_Total_Analyse_Hidden(false)">
            <!-- 总分析行 -->
            <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem; margin-top: 30px; text-align: left">
                <label>本卷难度平均值为&nbsp;&nbsp;{{Reduce_Length(Paper_Json.difficulty_statistics.mean)}}&nbsp;&nbsp;，占比最大的题目难度区间为&nbsp;&nbsp;{{Max_Gap}}</label>
            </el-row>
            <!-- 提示行 -->
            <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem">
                <label>各难度所占分值如下：</label>
            </el-row>
            <!-- 环状图 -->
            <el-row>
                <div id="Paper_Total_Difficult_Analyse" class="Paper_Total_Difficult_Analyse"></div>
            </el-row>
        </el-row>
    </el-row>
    <!-- 相似试卷 -->
    <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(2)" :class="Get_Part_Row_Style(2)">
        <el-col :span="12" style="text-align: left">
            相似试卷
        </el-col>
        <el-col :span="2" :offset="10">
            <i class="el-icon-arrow-down" v-if="!Part_Expand[2]"></i>
            <i class="el-icon-arrow-up" v-if="Part_Expand[2]"></i>
        </el-col>
    </el-row>
    <el-row :class="Get_Expand_Or_Collapse(2)" type="flex" justify="start" style="margin: 0px 16.5vw 30px 16.5vw">
        <label>与此试卷相似的试卷是xxxxxxx</label>
    </el-row>
    <!-- 试卷详情 -->
    <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(3)" :class="Get_Part_Row_Style(3)">
        <el-col :span="12" style="text-align: left">
            试卷详情
        </el-col>
        <el-col :span="2" :offset="10">
            <i class="el-icon-arrow-down" v-if="!Part_Expand[3]"></i>
            <i class="el-icon-arrow-up" v-if="Part_Expand[3]"></i>
        </el-col>
    </el-row>
    <el-row :class="Get_Expand_Or_Collapse(3)">
        <el-row v-for="(Sub_Ques, Sub_Index) in Paper_Json.sub_question" :key="Sub_Ques.id" style="margin: 30px 0px">
            <el-row type="flex" justify="start" style="margin: 0px 16.5vw 10px 16.5vw">
                <el-col :span="20" style="text-align: left">
                    <label style="line-height: 28px; font-size: 1.5rem">第{{Get_Question_Bundle_Index((Sub_Index + 1) + "")}}大题 —— {{Sub_Ques.desc}}（共{{Sub_Ques.sub_question.length}}题，{{Sub_Ques.score}}分）：</label>
                </el-col>
                <el-col :span="4">
                    <el-row type="flex" justify="end">
                        <el-button type="success" size="small" @click="Change_Dialog_Info(Sub_Index, (Sub_Index + 1) + '')">
                            查看大题分析
                        </el-button>
                    </el-row>
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="margin: 0px 16.5vw 10px 16.5vw">
                <PaperAnalysePQRoot :PackedQues="Sub_Ques" :Index="Sub_Index" style="width: 100%"></PaperAnalysePQRoot>
            </el-row>
        </el-row>
    </el-row>
    <el-row type="flex" justify="center" style="margin-bottom: 50px">
        <el-button type="success" plain @click="PDF_Download()">保存当前页面为PDF文档</el-button>
    </el-row>  
    </div>
</template>
<script>

// 引入基本模板
import * as echarts from 'echarts';
import PaperAnalysePQRoot from './components/PaperAnalysePQRoot.vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {

    components: { PaperAnalysePQRoot },
    name: "TestPage",
    data(){
        return {
            Paper_Json: this.Paper_J,
            // 总体分析界面是否展开/折叠
            Part_Expand: [false, false, false, false],
            // 总体分析页面展开的是知识点分析还是难度分析的区分变量
            Paper_Total_Analyse_Focus: true,
            // 占比最大的题目难度区间
            Max_Gap: "",
            // 大题分析页面是否展开/折叠
            Part_Expand_QB: [false, false],
            // 以下属性只用于全卷分析这一节的内容，之后的大题分析环节我们交给函数去算
            // 知识点分值和知识点分值对应的名称
            KnowledgeScore_List: [],
            KnowledgeScore_Name_List: [],
            // 知识点对的次数和知识点对对应的名称
            KnowledgePair_List: [],
            KnowledgePair_Name_List: [],
            // 想了想，还是用公共变量吧
            // 知识点分值和知识点分值对应的名称
            QB_KnowledgeScore_List: [],
            QB_KnowledgeScore_Name_List: [],
            // 知识点对的次数和知识点对对应的名称
            QB_KnowledgePair_List: [],
            QB_KnowledgePair_Name_List: [],
            // 当前正在查看的大题分析的序号
            Question_Bundle_Index: "1",
            // 大题分析的对话框是否显示
            Question_Bundle_Analyse: false,
            // 用来显示大题分析内容图表的变量
            Paper_Json_Question_Bundle_Info: {
                "id": "43482c08-8c71-4166-8490-2d991ba5be0a",
                "type": "PackedQues",
                "score": 4,
                "difficulty_statistics": {
                    "mean": 0.4028695672750473,
                    "min": 0.29554620385169983,
                    "max": 0.5101929306983948,
                    "std": 0.10732336342334747
                },
                "knowledge_knowledge2num": {
                    "解析几何::代数": 1
                },
                "knowledge2difficulty": {
                    "解析几何": 0.4028695672750473,
                    "代数": 0.5101929306983948
                },
                "knowledge2score": {
                    "解析几何": 4,
                    "代数": 2
                },
                "sub_question": [{},
                {}]
            }
        }
    },
    destroyed(){
    //    sessionStorage.removeItem('PaperJson')
    },
    props: {
        Paper_J:{
            type: Object,
            default: function(){
                return {
                    "id": "af6a45a3-46fa-41d6-ac7e-ae3842ce40fb",
                    "type": "Paper",
                    "status": "OK",
                    "score": 31,
                    "difficulty_area_score": [
                        0,
                        0,
                        2,
                        12,
                        3,
                        2,
                        12,
                        0,
                        0,
                        0
                    ],
                    "difficulty_statistics": {
                        "mean": 0.47843202083341535,
                        "min": 0.29554620385169983,
                        "max": 0.6161502003669739,
                        "std": 0.11606908316104704
                    },
                    "knowledge_knowledge2num": {
                        "代数::解析几何": 1,
                        "三角函数::代数": 2,
                        "统计与概率::三角函数": 1,
                        "统计与概率::代数": 1
                    },
                    "knowledge2score": {
                        "解析几何": 4,
                        "代数": 20,
                        "立体几何与平面几何": 1,
                        "三角函数": 20,
                        "统计与概率": 8
                    },
                    "knowledge2difficulty": {
                        "解析几何": 0.4028695672750473,
                        "代数": 0.5347670212388038,
                        "立体几何与平面几何": 0.4640635550022125,
                        "三角函数": 0.5146675765514374,
                        "统计与概率": 0.3793210983276367
                    },
                    "sub_question": [
                        {
                            "id": "43482c08-8c71-4166-8490-2d991ba5be0a",
                            "type": "PackedQues",
                            "desc": "填空题",
                            "level": 1,
                            "score": 4,
                            "difficulty_statistics": {
                                "mean": 0.4028695672750473,
                                "min": 0.29554620385169983,
                                "max": 0.5101929306983948,
                                "std": 0.10732336342334747
                            },
                            "knowledge_knowledge2num": {
                                "解析几何::代数": 1
                            },
                            "knowledge2difficulty": {
                                "解析几何": 0.4028695672750473,
                                "代数": 0.5101929306983948
                            },
                            "knowledge2score": {
                                "解析几何": 4,
                                "代数": 2
                            },
                            "sub_question": [
                                {
                                    "id": "812f1b6f-cd74-41a0-9504-dc4fb9d3871b",
                                    "type": "Question",
                                    "level": 2,
                                    "stem": "在平面直角坐标系$\\LUNALaTexPictureID{57511d56-9861-4de6-a896-e2d3e5ffcf0c}$中，椭圆$C$的中心为原点，焦点$F_{1}$、$F_{2}$在$x$轴上，离心率为$\\frac{\\sqrt{2}}{2}$.过点$F_{1}$的直线$l$交椭圆$C$于$A$、$B$两点，且$\\Delta A B F_{2}$的周长为$16$，那么椭圆$C$的方程为________.",
                                    "options": "",
                                    "answer": "$\\frac{x^{2}}{16}+\\frac{y^{2}}{8}=1$",
                                    "analysis": "",
                                    "difficulty": 0.29554620385169983,
                                    "score": 2,
                                    "knowledge_points_frontend": {
                                        "kp": [
                                            "圆锥曲线与方程",
                                            "解析几何",
                                            "椭圆的定义、标准方程及简单几何性质",
                                            "直线与圆锥曲线的关系",
                                            "直线与椭圆的位置关系及其简单应用",
                                            "圆锥曲线"
                                        ],
                                        "kp_layer": [
                                            {
                                                "label": "解析几何",
                                                "children": [
                                                    {
                                                        "label": "圆锥曲线与方程",
                                                        "children": [
                                                            {
                                                                "label": "圆锥曲线",
                                                                "children": []
                                                            },
                                                            {
                                                                "label": "直线与圆锥曲线的关系",
                                                                "children": [
                                                                    {
                                                                        "label": "直线与椭圆的位置关系及其简单应用",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "kp_priority": [
                                            "解析几何",
                                            "圆锥曲线与方程",
                                            "圆锥曲线",
                                            "直线与圆锥曲线的关系",
                                            "直线与椭圆的位置关系及其简单应用"
                                        ]
                                    }
                                },
                                {
                                    "id": "3bd039b1-f8e1-425d-aea9-9b33990fe172",
                                    "type": "Question",
                                    "level": 2,
                                    "stem": "过点$\\LUNALaTexPictureID{3907684b-1bfa-4189-bd04-fa59578c7239}$与曲线$f(x)=x^{3}-x^{2}-2 x+1$相切的直线有___________条（以数字作答）.",
                                    "options": "",
                                    "answer": "$2$",
                                    "analysis": "",
                                    "difficulty": 0.5101929306983948,
                                    "score": 2,
                                    "knowledge_points_frontend": {
                                        "kp": [
                                            "函数概念与基本初等函数I",
                                            "代数",
                                            "函数及其基本性质",
                                            "解析几何"
                                        ],
                                        "kp_layer": [
                                            {
                                                "label": "代数",
                                                "children": [
                                                    {
                                                        "label": "函数概念与基本初等函数I",
                                                        "children": [
                                                            {
                                                                "label": "函数及其基本性质",
                                                                "children": [
                                                                    {
                                                                        "label": "函数的概念",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "label": "解析几何",
                                                "children": []
                                            }
                                        ],
                                        "kp_priority": [
                                            "代数",
                                            "解析几何",
                                            "函数概念与基本初等函数I",
                                            "函数及其基本性质",
                                            "函数的概念"
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            "id": "9d7f1411-677a-4e69-b34e-e87f28e95a78",
                            "type": "PackedQues",
                            "desc": "综合题",
                            "level": 1,
                            "score": 13,
                            "difficulty_statistics": {
                                "mean": 0.6014587627007411,
                                "min": 0.4640635550022125,
                                "max": 0.6161502003669739,
                                "std": 0.03978468727873507
                            },
                            "knowledge_knowledge2num": {
                                "代数::三角函数": 1
                            },
                            "knowledge2difficulty": {
                                "立体几何与平面几何": 0.4640635550022125,
                                "三角函数": 0.6129083633422852,
                                "代数": 0.6129083633422852
                            },
                            "knowledge2score": {
                                "立体几何与平面几何": 1,
                                "三角函数": 12,
                                "代数": 12
                            },
                            "sub_question": [
                                {
                                    "id": "67856dca-708c-4aa2-9fd7-8850e3edafaf",
                                    "type": "PackedQues",
                                    "desc": "请解答以下问题。",
                                    "level": 2,
                                    "score": 13,
                                    "difficulty_statistics": {
                                        "mean": 0.6014587627007411,
                                        "min": 0.4640635550022125,
                                        "max": 0.6161502003669739,
                                        "std": 0.03978468727873507
                                    },
                                    "knowledge_knowledge2num": {
                                        "三角函数::代数": 1
                                    },
                                    "knowledge2difficulty": {
                                        "立体几何与平面几何": 0.4640635550022125,
                                        "三角函数": 0.6129083633422852,
                                        "代数": 0.6129083633422852
                                    },
                                    "knowledge2score": {
                                        "立体几何与平面几何": 1,
                                        "三角函数": 12,
                                        "代数": 12
                                    },
                                    "sub_question": [
                                        {
                                            "id": "7c2bcff3-0f75-4062-ab0d-8a9441a74d03",
                                            "type": "Question",
                                            "level": 3,
                                            "stem": "要在边长为$\\LUNALaTexPictureID{8b8cc022-63ff-4645-b27f-628f97765f77}$米的正方形草坪上安装喷水龙头，使整个草坪都能喷洒到水．假设每个喷水龙头的喷洒范围都是关径为$6$米的圆面，则需安装这种喷水龙头的个数最少是（　　）",
                                            "options": "['$3$', '$4$', '$5$', '$6$']",
                                            "answer": "$B$",
                                            "analysis": "",
                                            "difficulty": 0.4640635550022125,
                                            "score": 1
                                        },
                                        {
                                            "id": "ef94592e-3828-430c-a629-e23b68f392f3",
                                            "type": "PackedQues",
                                            "desc": "设$\\LUNALaTexPictureID{099cfbf5-d63a-4aa7-94d7-49c24cbc7a53}$，曲线$x^{2} \\sin \\theta+y^{2} \\cos \\theta=1$和$x^{2} \\cos \\theta-y^{2} \\sin \\theta=1$有$4$个不同的交点。",
                                            "level": 3,
                                            "score": 12,
                                            "difficulty_statistics": {
                                                "mean": 0.6129083633422852,
                                                "min": 0.6096665263175964,
                                                "max": 0.6161502003669739,
                                                "std": 0.0032418370246887207
                                            },
                                            "knowledge_knowledge2num": {
                                                "代数::三角函数": 2
                                            },
                                            "knowledge2difficulty": {
                                                "三角函数": 0.6129083633422852,
                                                "代数": 0.6129083633422852
                                            },
                                            "knowledge2score": {
                                                "三角函数": 12,
                                                "代数": 12
                                            },
                                            "sub_question": [
                                                {
                                                    "id": "86ed5c6a-53b0-4dd5-8a70-9860b90897bc",
                                                    "type": "Question",
                                                    "level": 4,
                                                    "stem": "求$\\LUNALaTexPictureID{a9fc567d-485a-4ced-aac9-5bbb70ad7b57}$的取值范围；",
                                                    "options": "",
                                                    "answer": "",
                                                    "analysis": "",
                                                    "difficulty": 0.6096665263175964,
                                                    "score": 6
                                                },
                                                {
                                                    "id": "bf446a82-96d6-45fc-ad44-2733d1db8128",
                                                    "type": "Question",
                                                    "level": 4,
                                                    "stem": "证明这$\\LUNALaTexPictureID{79c8ee0e-c76c-4aaa-aa47-2cf575b770e8}$个交点共圆，并求圆半径的取值范围。",
                                                    "options": "",
                                                    "answer": "",
                                                    "analysis": "",
                                                    "difficulty": 0.6161502003669739,
                                                    "score": 6
                                                }
                                            ]
                                        }
                                    ],
                                    "knowledge_points_frontend": {
                                        "kp": [
                                            "圆内接四边形的性质定理与判定定理",
                                            "立体几何与平面几何",
                                            "直线与圆的位置关系（选）",
                                            "几何证明选讲（选考内容）"
                                        ],
                                        "kp_layer": [
                                            {
                                                "label": "立体几何与平面几何",
                                                "children": [
                                                    {
                                                        "label": "几何证明选讲（选考内容）",
                                                        "children": [
                                                            {
                                                                "label": "直线与圆的位置关系（选）",
                                                                "children": [
                                                                    {
                                                                        "label": "圆内接四边形的性质定理与判定定理",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "label": "立体几何初步",
                                                        "children": [
                                                            {
                                                                "label": "空间几何体",
                                                                "children": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "kp_priority": [
                                            "立体几何与平面几何",
                                            "几何证明选讲（选考内容）",
                                            "空间几何体",
                                            "直线与圆的位置关系（选）",
                                            "圆内接四边形的性质定理与判定定理"
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            "id": "ac789714-5394-45f8-9641-966a74a31c67",
                            "type": "PackedQues",
                            "desc": "解答题",
                            "level": 1,
                            "score": 12,
                            "difficulty_statistics": {
                                "mean": 0.37724650899569195,
                                "min": 0.36151546239852905,
                                "max": 0.3971267342567444,
                                "std": 0.014831327958718265
                            },
                            "knowledge_knowledge2num": {
                                "三角函数::代数": 1,
                                "三角函数::统计与概率": 1,
                                "代数::统计与概率": 1
                            },
                            "knowledge2difficulty": {
                                "三角函数": 0.3673063963651657,
                                "代数": 0.36151546239852905,
                                "统计与概率": 0.3793210983276367
                            },
                            "knowledge2score": {
                                "三角函数": 8,
                                "代数": 4,
                                "统计与概率": 8
                            },
                            "sub_question": [
                                {
                                    "id": "e45b0d29-1444-445f-b71f-f733100f7e91",
                                    "type": "PackedQues",
                                    "desc": "某陶瓷厂准备烧制甲、乙、丙三件不同的工艺品，制作过程必须先后经过两次烧制，当第一次烧制合格后方可进入第二次烧制，两次烧制过程相互独立．根据该厂现有的技术水平，经过第一次烧制后，甲、乙、丙三件产品合格的概率依次为$\\LUNALaTexPictureID{a2f1b992-f1f6-4302-be31-1b3ce261c724}$、$0.6$、$0.4$，第二次烧制后，甲、乙、丙三件产品合格的概率依次为$0.6$、$\\LUNALaTexPictureID{a2f1b992-f1f6-4302-be31-1b3ce261c724}$、$0.75$。",
                                    "level": 2,
                                    "score": 8,
                                    "difficulty_statistics": {
                                        "mean": 0.3793210983276367,
                                        "min": 0.36151546239852905,
                                        "max": 0.3971267342567444,
                                        "std": 0.017805635929107666
                                    },
                                    "knowledge_knowledge2num": {
                                        "代数::三角函数": 1,
                                        "统计与概率::三角函数": 1,
                                        "统计与概率::代数": 1
                                    },
                                    "knowledge2difficulty": {
                                        "三角函数": 0.36151546239852905,
                                        "代数": 0.36151546239852905,
                                        "统计与概率": 0.3793210983276367
                                    },
                                    "knowledge2score": {
                                        "三角函数": 4,
                                        "代数": 4,
                                        "统计与概率": 8
                                    },
                                    "sub_question": [
                                        {
                                            "id": "ded078a1-20bd-4354-b847-e7b71a02dd40",
                                            "type": "Question",
                                            "level": 3,
                                            "stem": "求第一次烧制后恰有一件产品合格的概率；",
                                            "options": "",
                                            "answer": "分别记甲、乙、丙经第一次烧制后合格为事件$\\LUNALaTexPictureID{189b6d98-384d-46b1-9385-7aa84cc67e16}$， $A_{2}$，$A_{3}$设$E$表示第一次烧制后恰好有一件合格，则$P=0.38$::因为每件工艺品经过两次烧制后合格的概率均为$p=0.3$，所以$\\xi \\sim B(30, 0.3)$，故$E \\xi=x p=3 \\times 0.3=0.9$．",
                                            "analysis": "",
                                            "difficulty": 0.36151546239852905,
                                            "score": 4
                                        },
                                        {
                                            "id": "f5c073b3-e0c7-45e4-b8b4-53c97792a3fa",
                                            "type": "Question",
                                            "level": 3,
                                            "stem": "经过前后两次烧制后，合格工艺品的个数为$\\LUNALaTexPictureID{8701cc30-2975-4215-aac0-7418edc597c9}$，求随机变量$\\LUNALaTexPictureID{8701cc30-2975-4215-aac0-7418edc597c9}$的期望．",
                                            "options": "",
                                            "answer": "分别记甲、乙、丙经第一次烧制后合格为事件$A_{1}$， $A_{2}$，$A_{3}$设$E$表示第一次烧制后恰好有一件合格，则$P=0.38$::因为每件工艺品经过两次烧制后合格的概率均为$p=0.3$，所以$\\xi \\sim B(30, 0.3)$，故$E \\xi=x p=3 \\times 0.3=0.9$．",
                                            "analysis": "",
                                            "difficulty": 0.3971267342567444,
                                            "score": 4
                                        }
                                    ],
                                    "knowledge_points_frontend": {
                                        "kp": [
                                            "随机变量及其分布",
                                            "统计与概率",
                                            "概率",
                                            "离散型随机变量及其分布列",
                                            "离散型随机变量的均值、方差"
                                        ],
                                        "kp_layer": [
                                            {
                                                "label": "代数",
                                                "children": []
                                            },
                                            {
                                                "label": "三角函数",
                                                "children": []
                                            },
                                            {
                                                "label": "统计与概率",
                                                "children": [
                                                    {
                                                        "label": "概率",
                                                        "children": [
                                                            {
                                                                "label": "概率初步",
                                                                "children": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "kp_priority": [
                                            "代数",
                                            "三角函数",
                                            "统计与概率",
                                            "概率",
                                            "概率初步"
                                        ]
                                    }
                                },
                                {
                                    "id": "b51bc253-90eb-4968-ba5f-79be3cc808b8",
                                    "type": "PackedQues",
                                    "desc": "请计算以下问题。",
                                    "level": 2,
                                    "score": 4,
                                    "difficulty_statistics": {
                                        "mean": 0.37309733033180237,
                                        "min": 0.37309733033180237,
                                        "max": 0.37309733033180237,
                                        "std": 0.0
                                    },
                                    "knowledge_knowledge2num": {},
                                    "knowledge2difficulty": {
                                        "三角函数": 0.37309733033180237
                                    },
                                    "knowledge2score": {
                                        "三角函数": 4
                                    },
                                    "sub_question": [
                                        {
                                            "id": "7db9674f-17be-4b48-bff8-0989d31cb93c",
                                            "type": "Question",
                                            "level": 3,
                                            "stem": "方程$\\LUNALaTexPictureID{828f4cea-bda1-4f8a-8b6c-0f1b85980750}$在区间$(0,2\\pi)$内的解的个数。",
                                            "options": "",
                                            "answer": "本小题考查三角方程的解。原方程等价于$\\sin x=0$或$\\cos x=\\frac{1}{2}$，又$x \\in(0,2\\pi)$，∴$x=\\frac{\\pi}{3}$或$x=\\pi$或$x=\\frac{5 \\pi}{3}$。本题难度：中等",
                                            "analysis": "",
                                            "difficulty": 0.37309733033180237,
                                            "score": 4
                                        }
                                    ],
                                    "knowledge_points_frontend": {
                                        "kp": [
                                            "三角函数",
                                            "三角函数的图象与性质",
                                            "基本初等函数II"
                                        ],
                                        "kp_layer": [
                                            {
                                                "label": "三角函数",
                                                "children": [
                                                    {
                                                        "label": "基本初等函数II",
                                                        "children": [
                                                            {
                                                                "label": "任意角的三角函数",
                                                                "children": [
                                                                    {
                                                                        "label": "任意角的三角函数（正弦、余弦、正切）的定义",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "label": "三角函数的图象与性质",
                                                                "children": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "kp_priority": [
                                            "三角函数",
                                            "基本初等函数II",
                                            "任意角的三角函数",
                                            "三角函数的图象与性质",
                                            "任意角的三角函数（正弦、余弦、正切）的定义"
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            "id": "da5146bf-6f05-47d5-bd2b-d77b77a6e576",
                            "type": "PackedQues",
                            "desc": "选择题: 请从以下四个选项中，选出一个正确的答案。",
                            "level": 1,
                            "score": 2,
                            "difficulty_statistics": {
                                "mean": 0.4369961768388748,
                                "min": 0.4020228981971741,
                                "max": 0.47196945548057556,
                                "std": 0.034973278641700745
                            },
                            "knowledge_knowledge2num": {},
                            "knowledge2difficulty": {
                                "代数": 0.4369961768388748
                            },
                            "knowledge2score": {
                                "代数": 2
                            },
                            "sub_question": [
                                {
                                    "id": "0b1b75ac-3053-45b5-9244-65b0dbb9d9f1",
                                    "type": "Question",
                                    "level": 2,
                                    "stem": "从$\\LUNALaTexPictureID{59dae23f-c8cd-4771-8711-d6a20d1c0118}$名男生和$3$名女生中选出$3$人，分别从事三项不同的工作，若这$3$人中至少有$1$名女生，则选派方案共有(  )种",
                                    "options": "['$108$种', '$186$种', '$216$种', '$270$种']",
                                    "answer": "$B$",
                                    "analysis": "",
                                    "difficulty": 0.4020228981971741,
                                    "score": 1,
                                    "knowledge_points_frontend": {
                                        "kp": [
                                            "排列、组合与二项式定理",
                                            "代数",
                                            "计数原理"
                                        ],
                                        "kp_layer": [
                                            {
                                                "label": "代数",
                                                "children": [
                                                    {
                                                        "label": "不等式",
                                                        "children": []
                                                    },
                                                    {
                                                        "label": "计数原理",
                                                        "children": [
                                                            {
                                                                "label": "排列、组合与二项式定理",
                                                                "children": [
                                                                    {
                                                                        "label": "排列与组合的简单应用",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "kp_priority": [
                                            "代数",
                                            "不等式",
                                            "计数原理",
                                            "排列、组合与二项式定理",
                                            "排列与组合的简单应用"
                                        ]
                                    }
                                },
                                {
                                    "id": "4bc1ada9-0364-45be-8f80-4960c9327c20",
                                    "type": "Question",
                                    "level": 2,
                                    "stem": "设函数$\\LUNALaTexPictureID{d6f31644-c14a-4097-9048-9ba0b0f01d01}$,集合$M=\\{x | f(x)<0\\}$,$P=\\left\\{x | f^{\\prime}(x)>0\\right\\}$,若$M\\subset P$,则实数$a$的取值范围是 (     )",
                                    "options": "['$(-\\infty,1)$', '$(0,1)$', '$(1,+\\infty)$', '$[1,+\\infty)$']",
                                    "answer": "",
                                    "analysis": "",
                                    "difficulty": 0.47196945548057556,
                                    "score": 1,
                                    "knowledge_points_frontend": {
                                        "kp": [
                                            "代数",
                                            "集合间的关系与运算",
                                            "集合"
                                        ],
                                        "kp_layer": [
                                            {
                                                "label": "代数",
                                                "children": [
                                                    {
                                                        "label": "集合",
                                                        "children": [
                                                            {
                                                                "label": "集合间的关系与运算",
                                                                "children": [
                                                                    {
                                                                        "label": "集合之间的基本关系",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "label": "集合的基本运算",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "kp_priority": [
                                            "代数",
                                            "集合",
                                            "集合间的关系与运算",
                                            "集合之间的基本关系",
                                            "集合的基本运算"
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
              }
            }
        }
    },
    mounted() {
        this.Init();
        window.scrollTo(0, 0);
    },
    methods: {
        // 下载PDF格式的分析报告
        PDF_Download(){

            this.Part_Expand = [true, true, true, true];
            setTimeout(() => {
                html2canvas(this.$refs["PaperAnalyseInfo"]).then(
                    canvas => {

                        var contentWidth = canvas.width;
                        var contentHeight = canvas.height;

                        var pageHeight = contentWidth / 592.28 * 841.89;
                        var leftHeight = contentHeight;

                        var position = 0;

                        var imgWidth = 595.28;
                        var imgHeight = 592.28/contentWidth * contentHeight;

                        var pageData = canvas.toDataURL('image/jpeg', 1.0);

                        var pdf = new jsPDF('', 'pt', 'a4');
                        if (leftHeight < pageHeight) {
                            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
                        } else {
                            while(leftHeight > 0) {
                                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                                leftHeight -= pageHeight;
                                position -= 841.89;
                                //避免添加空白页
                                if(leftHeight > 0) {
                                    pdf.addPage();
                                }
                            }
                        }
                        pdf.save("content.pdf");
                    }
                )
            }, 100)
        },
        // 处理对话框内应当显示的内容
        Change_Dialog_Info(Sub_Index, Dialog_Label)
        {
            this.Question_Bundle_Index = Dialog_Label;

            this.Paper_Json_Question_Bundle_Info = this.Paper_Json.sub_question[Sub_Index];

            this.QB_KnowledgePair_Name_List = [];
            this.QB_KnowledgePair_List = [];

            this.QB_KnowledgeScore_Name_List = [];
            this.QB_KnowledgeScore_List = [];

            var Temp_Score_Dict_2 = this.Paper_Json_Question_Bundle_Info.knowledge2score;
            while(Object.keys(Temp_Score_Dict_2).length > this.QB_KnowledgeScore_List.length){
                var Temp_Ku_Max_Score_2 = -1;
                var Temp_Ku_Max_Name_2 = "";
                for(var Ku_2 in Temp_Score_Dict_2){
                    if(this.QB_KnowledgeScore_Name_List.indexOf(Ku_2) == -1 && Temp_Score_Dict_2[Ku_2] > Temp_Ku_Max_Score_2){
                        Temp_Ku_Max_Score_2 = Temp_Score_Dict_2[Ku_2]
                        Temp_Ku_Max_Name_2 = Ku_2
                    }
                }
                this.QB_KnowledgeScore_Name_List.push(Temp_Ku_Max_Name_2)
                this.QB_KnowledgeScore_List.push(Temp_Ku_Max_Score_2)
            }

            var Temp_Pair_Dict_2 = this.Paper_Json_Question_Bundle_Info.knowledge_knowledge2num;
            while(Object.keys(Temp_Pair_Dict_2).length > this.QB_KnowledgePair_List.length){
                var Temp_Pair_Max_Count_2 = -1;
                var Temp_Pair_Max_Name_2 = "";
                for(var Pair_2 in Temp_Pair_Dict_2){
                    if(this.QB_KnowledgePair_Name_List.indexOf(Pair_2) == -1 && Temp_Pair_Dict_2[Pair_2] > Temp_Pair_Max_Count_2){
                        Temp_Pair_Max_Count_2 = Temp_Pair_Dict_2[Pair_2]
                        Temp_Pair_Max_Name_2 = Pair_2
                    }
                }
                this.QB_KnowledgePair_Name_List.push(Temp_Pair_Max_Name_2)
                this.QB_KnowledgePair_List.push(Temp_Pair_Max_Count_2)
            }
            
            this.Question_Bundle_Analyse = true;

            setTimeout(() => {
                this.Init_QB_Total_Bar();
                this.Init_QB_Knowledge_Difficult_Analyse();
                this.Init_QB_Knowledge_Score_Analyse();
                this.Init_QB_Knowledge_Pair();
            }, 100)

        },
        // 调整对话框下显示的数据的序号
        Get_Question_Bundle_Index(Bundle_Index){
            var Char_List = ["一","二","三","四","五","六","七","八","九"];
            if(Bundle_Index.length == 1 && Bundle_Index != "0"){
                return Char_List[parseInt(Bundle_Index) - 1]
            }else if(Bundle_Index.length == 2){
                if(Bundle_Index[1] == "0" && Bundle_Index[1] == "1"){
                    return "十"
                }else if(Bundle_Index[1] == "0" && Bundle_Index[1] != "1"){
                    return Char_List[parseInt(Bundle_Index[0]) - 1] + "十"
                }else if(Bundle_Index[1] != "0" && Bundle_Index[1] == "1"){
                    return "十" + Char_List[parseInt(Bundle_Index[1]) - 1]
                }else if(Bundle_Index[1] != "0" && Bundle_Index[1] != "1"){
                    return Char_List[parseInt(Bundle_Index[0]) - 1] + "十" + Char_List[parseInt(Bundle_Index[1]) - 1]
                }
            }
        },
        // 调整数据长度
        Reduce_Length(Data){
            Data = Data + "";
            return Data.substring(0, 4);
        },
        // 返回全卷知识点的长度
        Get_Paper_Knowledge_Length(){
            return Object.keys(this.Paper_Json.knowledge2score).length;
        },
        // 返回大题知识点的长度
        Get_QB_Knowledge_Length(){
            return Object.keys(this.Paper_Json_Question_Bundle_Info.knowledge2score).length;
        },
        // 切分知识点对并返回对应部分
        Paper_Total_Get_Ku_Pair_Part(Knowledge_Pair, index){
            var Pair = Knowledge_Pair.split("::")
            return Pair[index]
        },
        // 返回全卷知识点分值排序的次选点信息
        Paper_Total_Get_Second_Score(){
            if(this.KnowledgeScore_Name_List.length < 3){
                return ""
            }else if(this.KnowledgeScore_Name_List.length == 3){
                return "，其次是 " + this.KnowledgeScore_Name_List[1]
            }else if(this.KnowledgeScore_Name_List.length > 3){
                return "，其次是 " + this.KnowledgeScore_Name_List[1] + " 和 " + this.KnowledgeScore_Name_List[2]
            }
        },
        // 返回大题知识点分值排序的次选点信息
        QB_Get_Second_Score(){
            if(this.QB_KnowledgeScore_Name_List.length < 3){
                return ""
            }else if(this.QB_KnowledgeScore_Name_List.length == 3){
                return "，其次是 " + this.KnowledgeScore_Name_List[1]
            }else if(this.QB_KnowledgeScore_Name_List.length > 3){
                return "，其次是 " + this.QB_KnowledgeScore_Name_List[1] + " 和 " + this.QB_KnowledgeScore_Name_List[2]
            }
        },
        // 返回全卷知识点对排序的首选点信息
        Paper_Total_Get_First_Pair(){
            return this.KnowledgePair_Name_List[0].replace(/::/, " 和 ")
        },
        // 返回全卷知识点对排序的次选点信息
        Paper_Total_Get_Second_Pair(){
            if(this.KnowledgePair_Name_List.length == 1){
                return "。"
            }else if(this.KnowledgePair_Name_List.length == 2){
                return "，其次为 " + this.KnowledgePair_Name_List[1].replace(/::/, " 和 ") + "。"
            }else if(this.KnowledgePair_Name_List.length > 2){
                return "，其次为 " + this.KnowledgePair_Name_List[1].replace(/::/, " 和 ") 
                    + " 与 " + this.KnowledgePair_Name_List[2].replace(/::/, " 和 ") + "。"
            }
        },
        // 返回大题知识点对排序的首选点信息
        QB_Get_First_Pair(){
            return this.QB_KnowledgePair_Name_List[0].replace(/::/, " 和 ")
        },
        // 返回大题知识点对排序的次选点信息
        QB_Get_Second_Pair(){
            if(this.QB_KnowledgePair_Name_List.length == 1){
                return "。"
            }else if(this.QB_KnowledgePair_Name_List.length == 2){
                return "，其次为 " + this.QB_KnowledgePair_Name_List[1].replace(/::/, " 和 ") + "。"
            }else if(this.QB_KnowledgePair_Name_List.length > 2){
                return "，其次为 " + this.QB_KnowledgePair_Name_List[1].replace(/::/, " 和 ") 
                    + " 与 " + this.QB_KnowledgePair_Name_List[2].replace(/::/, " 和 ") + "。"
            }
        },
        // 返回全卷知识点最难和最简单
        Get_Paper_Knowledge_Difficult(Part){
            var D = 0;
            if(Part){
                D = -1;
                var D_Ku = ""
                for(var i in this.Paper_Json.knowledge2difficulty){
                    if(this.Paper_Json.knowledge2difficulty[i] > D){
                        D = this.Paper_Json.knowledge2difficulty[i]
                        D_Ku = i
                    }
                }
                return D_Ku
            }else{
                D = 1;
                var E_Ku = ""
                for(var j in this.Paper_Json.knowledge2difficulty){
                    if(this.Paper_Json.knowledge2difficulty[j] < D){
                        D = this.Paper_Json.knowledge2difficulty[j]
                        E_Ku = j
                    }
                }
                return E_Ku
            }
        },
        // 返回大题知识点最难和最简单
        Get_QB_Knowledge_Difficult(Part){
            var D = 0;
            if(Part){
                D = -1;
                var D_Ku = ""
                for(var i in this.Paper_Json_Question_Bundle_Info.knowledge2difficulty){
                    if(this.Paper_Json_Question_Bundle_Info.knowledge2difficulty[i] > D){
                        D = this.Paper_Json_Question_Bundle_Info.knowledge2difficulty[i]
                        D_Ku = i
                    }
                }
                return D_Ku
            }else{
                D = 1;
                var E_Ku = ""
                for(var j in this.Paper_Json_Question_Bundle_Info.knowledge2difficulty){
                    if(this.Paper_Json_Question_Bundle_Info.knowledge2difficulty[j] < D){
                        D = this.Paper_Json_Question_Bundle_Info.knowledge2difficulty[j]
                        E_Ku = j
                    }
                }
                return E_Ku
            }
        },
        // 返回首页分析的表格样式
        Total_Table_Style(index){
            if(index%2 == 1){
                return "Total_Table_Single"
            }else{
                return "Total_Table_Double"
            }
        },
        // 返回全卷分析选项的样式，指知识点分析/难度分析
        Check_Total_Switch(Part){
            if(Part == this.Paper_Total_Analyse_Focus){
                return "Paper_Total_Analyse_Focus"
            }else{
                return "Paper_Total_Analyse_Unfocus"
            }
        },
        // 返回功能条的样式
        Get_Part_Row_Style(index){
            if(this.Part_Expand[index])
                return "Part_Row_Style_Expand"
            return "Part_Row_Style_Collapse"
        },
        // 返回功能条的样式 - 题包
        Get_Part_Row_Style_QB(index){
            if(this.Part_Expand_QB[index])
                return "Part_Row_Style_Expand"
            return "Part_Row_Style_Collapse"
        },
        // 展开下级展示区域
        Expand_Or_Collapse(index){
            this.Part_Expand.splice(index, 1, !this.Part_Expand[index])
        },
        // 展开下级显示区域 - 题包
        Expand_Or_Collapse_QB(index){
            this.Part_Expand_QB.splice(index, 1, !this.Part_Expand_QB[index])
        },
        // 修改下级展示区域的Style
        Get_Expand_Or_Collapse(index){
            if(!this.Part_Expand[index])
                return "Hidden"
            return ""
        },
        // 修改下级展示区域的Style - 题包
        Get_Expand_Or_Collapse_QB(index){
            if(!this.Part_Expand_QB[index])
                return "Hidden"
            return ""
        },
        // 全卷分析的不同模块区域是否显示
        Paper_Total_Analyse_Hidden(Part){
            if(Part == this.Paper_Total_Analyse_Focus){
                return ""
            }else{
                return "Hidden"
            }
        },
        // 对话框是否显示
        Hidden_Or_Not(Question_Bundle_Analyse){
            if(!Question_Bundle_Analyse)
                return "Hidden"
            return ""
        },
        // 获取占比最大难度区间
        Get_Max_Difficult_Gap(){
            var Max_Gap = Math.max.apply(Math, this.Paper_Json.difficulty_area_score);
            var Result = "";
            for(var i = 0; i < 10; i++){
                if(this.Paper_Json.difficulty_area_score[i] == Max_Gap){
                    if(Result == ""){
                        if(i != 9){
                            Result = "0." + i + " - 0." + (i + 1);
                        }
                        else{
                            Result = "0." + i + " - 1.0";
                        }
                    }else{
                        if(i != 9){
                            Result = Result + "、0." + i + " - 0." + (i + 1);
                        }
                        else{
                            Result = Result + "、0." + i + " - 1.0";
                        }
                    }
                }
            }
            this.Max_Gap = Result;
        },
        // 初始化总体的那张柱状图的方法
        Init_Paper_Total_Bar(){

            let myChart = echarts.init(document.getElementById('Paper_Total_Bar'));

            let option = {
                grid: {
                x: 70,
                y: 90,
                x2: 30,
                y2: 35
                },
                title: {
                    text: "各大题指标变化趋势",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,25]
                },
                color: ["#00B0F0", "#FFC000", "#92D050"],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow',
                        label : {
                            show: true
                        }
                    },
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                        align: 'left'
                    },
                },
                calculable: true,
                legend: {
                    data: ['指标1', '指标2', '指标3'],
                    itemGap: 20,
                    x: "right",
                    y: "top",
                    padding: [5,30,40,5],
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                    },
                },
                xAxis : [
                {
                    type : 'category',
                    data : ["大题1", "大题2", "大题3", "大题4"],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                        show:true,  //这里的show用于设置是否显示x轴下的字体 默认为true
                        interval:0,  //可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
                        textStyle:{   //textStyle里面写x轴下的字体的样式
                            color:'black',
                            fontSize:14
                        }
                    },
                }
                ],
                yAxis : [
                {
                    type : 'value',
                    name : '数量',
                    min: 0.0,
                    max: 0.7,
                    axisLabel:{
                        show:true,  //这里的show用于设置是否显示y轴下的字体 默认为true
                        textStyle:{   //textStyle里面写y轴下的字体的样式
                            color:'black',
                            fontSize:14
                        }
                    },
                    nameTextStyle:{
                        color:"black", 
                        fontSize:14,  
                        padding:[30, 35, 15, 10]
                    }
                }
                ],
                series : [
                {
                    name:'指标1',
                    type:'bar',
                    barWidth: '20%',
                    data: [0.4, 0.3, 0.2, 0.6]
                },
                {
                    name:'指标2',
                    type:'bar',
                    barWidth: '20%',
                    data: [0.6, 0.2, 0.4, 0.6]
                },
                {
                    name:'指标3',
                    type:'bar',
                    barWidth: '20%',
                    data: [0.2, 0.4, 0.1, 0.4]
                },
            ]
            };

            myChart.setOption(option);

            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});

        },
        // 初始化大题分析的那张柱状图的方法
        Init_QB_Total_Bar(){

            let myChart = echarts.init(document.getElementById('QB_Total_Bar'));

            let option = {
                grid: {
                x: 70,
                y: 90,
                x2: 30,
                y2: 35
                },
                title: {
                    text: "大题指标变化趋势",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,25]
                },
                color: ["#00B0F0", "#FFC000", "#92D050"],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow',
                        label : {
                            show: true
                        }
                    },
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                        align: 'left'
                    },
                },
                calculable: true,
                legend: {
                    data: ['指标1', '指标2', '指标3'],
                    itemGap: 20,
                    x: "right",
                    y: "top",
                    padding: [5,30,40,5],
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                    },
                },
                xAxis : [
                {
                    type : 'category',
                    data : ["小题1", "小题2", "小题3", "小题4"],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                        show:true,  //这里的show用于设置是否显示x轴下的字体 默认为true
                        interval:0,  //可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
                        textStyle:{   //textStyle里面写x轴下的字体的样式
                            color:'black',
                            fontSize:14
                        }
                    },
                }
                ],
                yAxis : [
                {
                    type : 'value',
                    name : '数量',
                    min: 0.0,
                    max: 0.7,
                    axisLabel:{
                        show:true,  //这里的show用于设置是否显示y轴下的字体 默认为true
                        textStyle:{   //textStyle里面写y轴下的字体的样式
                            color:'black',
                            fontSize:14
                        }
                    },
                    nameTextStyle:{
                        color:"black", 
                        fontSize:14,  
                        padding:[30, 35, 15, 10]
                    }
                }
                ],
                series : [
                {
                    name:'指标1',
                    type:'bar',
                    barWidth: '20%',
                    data: [0.4, 0.3, 0.2, 0.6]
                },
                {
                    name:'指标2',
                    type:'bar',
                    barWidth: '20%',
                    data: [0.6, 0.2, 0.4, 0.6]
                },
                {
                    name:'指标3',
                    type:'bar',
                    barWidth: '20%',
                    data: [0.2, 0.4, 0.1, 0.4]
                },
            ]
            };

            myChart.setOption(option);

            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});

        },
        // 初始化总体的难度分析的那张环形图的方法
        Init_Paper_Total_Difficult_Analyse(){

            var chartDom = document.getElementById('Paper_Total_Difficult_Analyse');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '18%',
                    right: '15%',
                    orient: 'vertical'
                },
                title: {
                    text: "各难度区间分值图",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [15, 5, 5, 5]
                },
                series: [
                    {
                        name: '难度区间',
                        type: 'pie',
                        radius: ['40%', '80%'],
                        center: ["50%", "55%"], 
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',
                            color: 'black',
                            fontSize: '12',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '24',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: []
                    }
                ]
            };

            for(var i = 0; i < this.Paper_Json.difficulty_area_score.length; i++){
                var name_End = ""
                if(i != 9){
                    name_End = "0." + (i + 1);
                }else{
                    name_End = "1.0";
                }
                option.series[0].data.push(
                    {
                        value: this.Paper_Json.difficulty_area_score[i], 
                        name: "0." + i + "-" + name_End
                    }
                )
            }

            myChart.setOption(option);
            window.addEventListener('resize',function() {myChart.resize()});

        },
        // 初始化总体的知识点难度分布的那张柱状图的方法
        Init_Paper_Knowledge_Difficult_Analyse(){

            let myChart = echarts.init(document.getElementById('Paper_Knowledge_Difficult_Analyse'));

            let option = {
                grid: {
                x: 70,
                y: 90,
                x2: 30,
                y2: 35
                },
                title: {
                    text: "知识点平均难度",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,25]
                },
                color: ["#409EFD"],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow',
                        label : {
                            show: true
                        }
                    },
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                        align: 'left'
                    },
                },
                calculable: true,
                legend: {
                    data: ['平均难度'],
                    itemGap: 20,
                    x: "right",
                    y: "top",
                    padding: [5,30,40,5],
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                    },
                },
                xAxis : [
                    {
                        type : 'category',
                        data : [],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel:{
                            show:true,  //这里的show用于设置是否显示x轴下的字体 默认为true
                            interval:0,  //可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
                            textStyle:{   //textStyle里面写x轴下的字体的样式
                                color:'black',
                                fontSize:14
                            }
                        },
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : '平均难度',
                        min: 0.0,
                        max: 0.7,
                        axisLabel:{
                            show:true,  //这里的show用于设置是否显示y轴下的字体 默认为true
                            textStyle:{   //textStyle里面写y轴下的字体的样式
                                color:'black',
                                fontSize:14
                            }
                        },
                        nameTextStyle:{
                            color:"black", 
                            fontSize:14,  
                            padding:[30, 35, 15, 10]
                        }
                    }
                ],
                series : [
                    {
                        name:'平均难度',
                        type:'bar',
                        barWidth: '20%',
                        data: []
                    }
                ]
            };

            for(var knowledgePoint in this.Paper_Json.knowledge2difficulty){
                option.xAxis[0].data.push(knowledgePoint);
                option.series[0].data.push(this.Paper_Json.knowledge2difficulty[knowledgePoint])
            }

            myChart.setOption(option);

            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});
        },
        // 初始化总体的知识点分数分布的那张饼图的方法
        Init_Paper_Knowledge_Score_Analyse(){

            var chartDom = document.getElementById('Paper_Knowledge_Score_Analyse');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}：{c} 分<br/>占比：({d}%)'
                },
                // roseType: 'radius',
                legend: {
                    top: '18%',
                    right: '15%',
                    orient: 'vertical'
                },
                title: {
                    text: "各知识点平均分值图",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [15, 5, 5, 5]
                },
                series: [
                    {
                        name: '分值与比例',
                        type: 'pie',
                        radius: ['30%', '65%'],
                        center: ["50%", "55%"], 
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            // position: 'center',
                            color: 'black',
                            fontSize: '14',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '18',
                                fontWeight: 'bold',
                            }
                        },
                        labelLine: {
                            show: true,
                            lineStyle: {
                                color: 'red'
                            },
                            length: 20,
                            length2: 0
                        },
                        data: [],
                    }
                ]
            };

            for(var i = 0; i < this.KnowledgeScore_Name_List.length; i++){
                option.series[0].data.push(
                    {
                        value: this.KnowledgeScore_List[i], 
                        name: this.KnowledgeScore_Name_List[i]
                    }
                )
            }

            myChart.setOption(option);
            window.addEventListener('resize',function() {myChart.resize()});

        },
        // 初始化总体的知识点点对分布的那张关系图的办法
        Init_Paper_Knowledge_Pair(){

            let myChart = echarts.init(document.getElementById('Paper_Knowledge_Pair'));

            let option = {
                grid: {
                    x: 600,
                    y: 600,
                    x2: 600,
                    y2: 400
                },
                title: {
                    text: "知识点对共现关系图",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,25]
                },
                tooltip : {},
                label: {
                    normal: {
                        show: true
                    }
                },
                legend: {
                    data: ['知识点'],
                    itemGap: 20,
                    x: "right",
                    y: "top",
                    padding: [5,30,70,5],
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                    },
                },
                series : [
                {
                    name:'知识点对共现关系图',
                    type: 'graph',
                    layout: 'circular',
                    symbolSize: 20,
                    focusNodeAdjacency: true,
                    categories: [
                        {
                            name: "知识点",
                            itemStyle: {
                                color: "#409EFD"
                            }
                        }
                    ],
                    zoom: 0.8,
                    circular: {
                        rotateLabel: false
                    },
                    label: {
                        show: true,
                            textStyle: {
                                fontSize: 14
                            },
                            position: 'right',
                            formatter: '{b}'
                    },
                    data: [],
                    links: [],
                    lineStyle: {
                        opacity: 0.7,
                        width: 2,
                        curveness: 0.7
                    }
                }
            ]
            };

            var Temp_Ku_Name_List = []

            for(var j in this.Paper_Json.knowledge2difficulty){
                option.series[0].data.push({
                    name: j,
                    category: 0
                })
                Temp_Ku_Name_List.push(j)
            }

            for(var i = 0; i < this.KnowledgePair_Name_List.length; i++){
                var Pair = this.KnowledgePair_Name_List[i]
                var From = Pair.split("::")[0]
                var To = Pair.split("::")[1]
                option.series[0].links.push({
                    source: Temp_Ku_Name_List.indexOf(From),
                    target: Temp_Ku_Name_List.indexOf(To),
                    value: this.KnowledgePair_List[i],
                    lineStyle: {
                        color: this.Paper_Total_Ku_Pair_LineStyle(i)
                    }
                })
            }

            myChart.setOption(option);

            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});

        },
        // 初始化大题的知识点难度分布的那张柱状图的方法
        Init_QB_Knowledge_Difficult_Analyse(){

            let myChart = echarts.init(document.getElementById('QB_Knowledge_Difficult_Analyse'));

            let option = {
                grid: {
                x: 70,
                y: 90,
                x2: 30,
                y2: 35
                },
                title: {
                    text: "知识点平均难度",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,25]
                },
                color: ["#409EFD"],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow',
                        label : {
                            show: true
                        }
                    },
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                        align: 'left'
                    },
                },
                calculable: true,
                legend: {
                    data: ['平均难度'],
                    itemGap: 20,
                    x: "right",
                    y: "top",
                    padding: [5,30,40,5],
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                    },
                },
                xAxis : [
                    {
                        type : 'category',
                        data : [],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel:{
                            show:true,  //这里的show用于设置是否显示x轴下的字体 默认为true
                            interval:0,  //可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
                            textStyle:{   //textStyle里面写x轴下的字体的样式
                                color:'black',
                                fontSize:14
                            }
                        },
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : '平均难度',
                        min: 0.0,
                        max: 0.7,
                        axisLabel:{
                            show:true,  //这里的show用于设置是否显示y轴下的字体 默认为true
                            textStyle:{   //textStyle里面写y轴下的字体的样式
                                color:'black',
                                fontSize:14
                            }
                        },
                        nameTextStyle:{
                            color:"black", 
                            fontSize:14,  
                            padding:[30, 35, 15, 10]
                        }
                    }
                ],
                series : [
                    {
                        name:'平均难度',
                        type:'bar',
                        barWidth: '20%',
                        data: []
                    }
                ]
            };

            for(var knowledgePoint in this.Paper_Json_Question_Bundle_Info.knowledge2difficulty){
                option.xAxis[0].data.push(knowledgePoint);
                option.series[0].data.push(this.Paper_Json_Question_Bundle_Info.knowledge2difficulty[knowledgePoint])
            }

            myChart.setOption(option);

            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});
        },
        // 初始化大题的知识点分数分布的那张饼图的方法
        Init_QB_Knowledge_Score_Analyse(){

            var chartDom = document.getElementById('QB_Knowledge_Score_Analyse');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}：{c} 分<br/>占比：({d}%)'
                },
                // roseType: 'radius',
                legend: {
                    top: '18%',
                    right: '15%',
                    orient: 'vertical'
                },
                title: {
                    text: "各知识点平均分值图",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [15, 5, 5, 5]
                },
                series: [
                    {
                        name: '分值与比例',
                        type: 'pie',
                        radius: ['30%', '65%'],
                        center: ["50%", "55%"], 
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            // position: 'center',
                            color: 'black',
                            fontSize: '14',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '18',
                                fontWeight: 'bold',
                            }
                        },
                        labelLine: {
                            show: true,
                            lineStyle: {
                                color: 'red'
                            },
                            length: 20,
                            length2: 0
                        },
                        data: [],
                    }
                ]
            };

            for(var i = 0; i < this.QB_KnowledgeScore_Name_List.length; i++){
                option.series[0].data.push(
                    {
                        value: this.QB_KnowledgeScore_List[i], 
                        name: this.QB_KnowledgeScore_Name_List[i]
                    }
                )
            }

            myChart.setOption(option);
            window.addEventListener('resize',function() {myChart.resize()});

        },
        // 初始化大题的知识点点对分布的那张关系图的办法
        Init_QB_Knowledge_Pair(){

            let myChart = echarts.init(document.getElementById('QB_Knowledge_Pair'));

            let option = {
                grid: {
                    x: 600,
                    y: 600,
                    x2: 600,
                    y2: 400
                },
                title: {
                    text: "知识点对共现关系图",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,25]
                },
                tooltip : {},
                label: {
                    normal: {
                        show: true
                    }
                },
                legend: {
                    data: ['知识点'],
                    itemGap: 20,
                    x: "right",
                    y: "top",
                    padding: [5,30,70,5],
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                    },
                },
                series : [
                {
                    name:'知识点对共现关系图',
                    type: 'graph',
                    layout: 'circular',
                    symbolSize: 20,
                    focusNodeAdjacency: true,
                    categories: [
                        {
                            name: "知识点",
                            itemStyle: {
                                color: "#409EFD"
                            }
                        }
                    ],
                    zoom: 0.8,
                    circular: {
                        rotateLabel: false
                    },
                    label: {
                        show: true,
                            textStyle: {
                                fontSize: 14
                            },
                            position: 'right',
                            formatter: '{b}'
                    },
                    data: [],
                    links: [],
                    lineStyle: {
                        opacity: 0.7,
                        width: 2,
                        curveness: 0.7
                    }
                }
            ]
            };

            var Temp_Ku_Name_List = []

            for(var j in this.Paper_Json_Question_Bundle_Info.knowledge2difficulty){
                option.series[0].data.push({
                    name: j,
                    category: 0
                })
                Temp_Ku_Name_List.push(j)
            }

            for(var i = 0; i < this.QB_KnowledgePair_Name_List.length; i++){
                var Pair = this.QB_KnowledgePair_Name_List[i]
                var From = Pair.split("::")[0]
                var To = Pair.split("::")[1]
                option.series[0].links.push({
                    source: Temp_Ku_Name_List.indexOf(From),
                    target: Temp_Ku_Name_List.indexOf(To),
                    value: this.QB_KnowledgePair_List[i],
                    lineStyle: {
                        color: this.Paper_Total_Ku_Pair_LineStyle(i)
                    }
                })
            }

            myChart.setOption(option);

            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});

        },
        // 返回不同颜色
        Paper_Total_Ku_Pair_LineStyle(index){
            if(index < 3){
                return 'red'
            }else{
                return '#CCC'
            }
        },
        // 初始化数据的方法，不要动，放到最下面就得了
        // 千把来行着实太长了，展开了翻起来都费劲
        Init(){

            if(sessionStorage.getItem('PaperJson')){
                this.Paper_Json = JSON.parse(sessionStorage.getItem('PaperJson'))
            }

            var Temp_Score_Dict = this.Paper_Json.knowledge2score;
            while(Object.keys(Temp_Score_Dict).length > this.KnowledgeScore_List.length){
                var Temp_Ku_Max_Score = -1;
                var Temp_Ku_Max_Name = "";
                for(var Ku in Temp_Score_Dict){
                    if(this.KnowledgeScore_Name_List.indexOf(Ku) == -1 && Temp_Score_Dict[Ku] > Temp_Ku_Max_Score){
                        Temp_Ku_Max_Score = Temp_Score_Dict[Ku]
                        Temp_Ku_Max_Name = Ku
                    }
                }
                this.KnowledgeScore_Name_List.push(Temp_Ku_Max_Name)
                this.KnowledgeScore_List.push(Temp_Ku_Max_Score)
            }

            var Temp_Pair_Dict = this.Paper_Json.knowledge_knowledge2num;
            while(Object.keys(Temp_Pair_Dict).length > this.KnowledgePair_List.length){
                var Temp_Pair_Max_Count = -1;
                var Temp_Pair_Max_Name = "";
                for(var Pair in Temp_Pair_Dict){
                    if(this.KnowledgePair_Name_List.indexOf(Pair) == -1 && Temp_Pair_Dict[Pair] > Temp_Pair_Max_Count){
                        Temp_Pair_Max_Count = Temp_Pair_Dict[Pair]
                        Temp_Pair_Max_Name = Pair
                    }
                }
                this.KnowledgePair_Name_List.push(Temp_Pair_Max_Name)
                this.KnowledgePair_List.push(Temp_Pair_Max_Count)
            }

            setTimeout(()=>{
                this.Init_Paper_Total_Bar();
                this.Init_Paper_Total_Difficult_Analyse();
                this.Get_Max_Difficult_Gap();
                this.Init_Paper_Knowledge_Difficult_Analyse();
                this.Init_Paper_Knowledge_Score_Analyse();
                this.Init_Paper_Knowledge_Pair();
            }, 100)
        },
    }
}
</script>
<style lang="scss" scoped>
.el-divider--horizontal{
    display:block;
    height:4px;
    width:100%;
    margin:24px 0
}
// 调整区块显示条
.Part_Row_Style_Collapse{
    border-left: 15px solid #409EFD; 
    background: 	#F8FBFF; 
    width: 70%; 
    margin: 5px 15% 20px 15%;
    padding-left: 30px;
    font-size: 1.5rem;
    font-weight: bold;
    padding-top: 5px;
    padding-bottom: 5px;
    cursor: pointer;
}
.Part_Row_Style_Expand{
    border-left: 15px solid #409EFD; 
    background: 	white; 
    width: 70%; 
    margin: 5px 15% 20px 15%;
    padding-left: 30px;
    font-size: 1.5rem;
    font-weight: bold;
    padding-top: 5px;
    padding-bottom: 5px;
    cursor: pointer;
}
// 调整试卷总体条形图外框
.Paper_Total_Bar{
    border-radius: 10px; 
    width: 67vw; 
    height:300px; 
    padding-top: 20px; 
    margin-left: calc(100vw * 0.165);  
    border: 3px solid #EEF5FE; 
    margin-bottom: 40px;
}
// 调整大题总体条形图外框
.QB_Total_Bar{
    border-radius: 10px; 
    width: calc(100vw * 0.67 * 0.8);
    height:300px; 
    padding-top: 20px; 
    margin-left: calc(100vw * 0.14 * 0.8); 
    border: 3px solid #EEF5FE; 
    margin-bottom: 40px;
}
// 整体难度分析
.Paper_Total_Difficult_Analyse{
    margin-top: 30px;
    border-radius: 10px; 
    width: 67vw; 
    height:350px; 
    padding-top: 10px; 
    margin-left: calc(100vw * 0.165);  
    border: 3px solid #EEF5FE; 
    background: #EEF5FE;
    margin-bottom: 40px;
}
// 知识点难度分析
.Paper_Knowledge_Difficult_Analyse{
    margin-top: 30px;
    border-radius: 10px; 
    width: 67vw; 
    height:350px; 
    padding-top: 10px; 
    margin-left: calc(100vw * 0.165);  
    border: 3px solid #EEF5FE; 
    background: #EEF5FE;
    margin-bottom: 40px;
}
// 知识点覆盖率，暂时是个占位符
.Paper_Knowledge_Cover{
    margin-top: 30px;
    border-radius: 10px; 
    width: 67vw; 
    height:350px; 
    padding-top: 10px; 
    margin-left: calc(100vw * 0.165);  
    border: 3px solid #EEF5FE; 
    background: #EEF5FE;
    margin-bottom: 40px;
}
// 知识点对的出现情况
.Paper_Knowledge_Pair{
    margin-top: 30px;
    border-radius: 10px; 
    width: 67vw; 
    height:550px; 
    padding-top: 10px; 
    margin-left: calc(100vw * 0.165);  
    border: 3px solid #EEF5FE; 
    background: #EEF5FE;
    margin-bottom: 40px;
}
// 知识点分数分析
.Paper_Knowledge_Score_Analyse{
    margin-top: 30px;
    border-radius: 10px; 
    width: 67vw; 
    height:400px; 
    padding-top: 10px; 
    margin-left: calc(100vw * 0.165);  
    border: 3px solid #EEF5FE; 
    background: #EEF5FE;
    margin-bottom: 40px;
}
// 题包知识点难度分析
.QB_Knowledge_Difficult_Analyse{
    margin-top: 30px;
    border-radius: 10px; 
    width: calc(100vw * 0.67 * 0.8);
    height:350px; 
    padding-top: 10px; 
    margin-left: calc(100vw * 0.14 * 0.8);  
    border: 3px solid #EEF5FE; 
    background: #EEF5FE;
    margin-bottom: 40px;
}
// 题包知识点对的出现情况
.QB_Knowledge_Pair{
    margin-top: 30px;
    border-radius: 10px; 
    width: calc(100vw * 0.67 * 0.8);
    height:550px; 
    padding-top: 10px; 
    margin-left: calc(100vw * 0.14 * 0.8); 
    border: 3px solid #EEF5FE; 
    background: #EEF5FE;
    margin-bottom: 40px;
}
// 题包知识点分数分析
.QB_Knowledge_Score_Analyse{
    margin-top: 30px;
    border-radius: 10px; 
    width: calc(100vw * 0.67 * 0.8);
    height:400px; 
    padding-top: 10px; 
    margin-left: calc(100vw * 0.14 * 0.8); 
    border: 3px solid #EEF5FE; 
    background: #EEF5FE;
    margin-bottom: 40px;
}
// 隐藏用
.Hidden{
    display: none;
}
// 知识点，难度分析的组合
.Paper_Total_Analyse_Focus{
    margin-top: -1px;
    height: 30px;
    padding-top: 5px;
    background: #409EFD;
    color: white;
}
.Paper_Total_Analyse_Unfocus{
    margin-top: -1px;
    height: 30px;
    padding-top: 5px;
}
// 表格单行，双行
.Total_Table_Single{
    background: transparent;
    margin: 0 16.5vw;
}
.Total_Table_Double{
    background: #F8FBFF;
    margin: 0 16.5vw;
}
</style>