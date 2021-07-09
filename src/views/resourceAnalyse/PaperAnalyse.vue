// 这一页面主要用于测试各类新功能的显示是否符合具体要求，等待完成后再放到正式页面上去

<template>
    <div 
        style="min-height: 600px" 
        ref="PaperAnalyseInfo"
        v-loading="loading"
        element-loading-text="文档生成中，请等待..."
        element-loading-spinner="el-icon-loading">
          <!-- 试卷分析路径跳转 -->
    <el-dialog :visible.sync="PaperAnalyseSwitchFlag" width="70%">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-button @click="PAS(0)" circle style="height: 200px; width: 200px;"><img src="../../assets/icon4.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <el-button type="text" @click="PAS(0)" style="margin-top: 30px; font-size: 20px; color: black">
              录入试卷进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-button @click="PAS(1)" circle style="height: 200px; width: 200px"><img src="../../assets/icon1.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <el-button type="text" @click="PAS(1)" style="margin-top: 30px; font-size: 20px; color: black">
              选择题库中试卷进行分析
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
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
            <el-col :span="14" style="text-align: left; line-height: 30px">
                <el-row type="flex" justify="start">
                    <i class="el-icon-arrow-up" v-if="Part_Expand_QB[0]" style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    <i class="el-icon-arrow-down" v-else style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    综合分析
                </el-row>
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
                <el-col :span="5">{{Reduce_Length(Paper_Json_Question_Bundle_Info.difficulty_statistics.std)}}</el-col>
                <el-col :span="5">{{Reduce_Length(Paper_Json_Question_Bundle_Info.difficulty_statistics.max)}}</el-col>
                <el-col :span="5">{{Reduce_Length(Paper_Json_Question_Bundle_Info.difficulty_statistics.min)}}</el-col>
            </el-row>
            <!-- 第二项 -->
            <el-row style="width: 67%; margin-left: 16.5%; margin-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver; display: none">
                <el-col :span="4">指标2</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
            </el-row>
            <!-- 第三项 -->
            <el-row style="width: 67%; margin-left: 16.5%; margin-top: 5px; margin-bottom: 40px; padding-bottom: 5px; border-bottom: 1px solid silver; display: none">
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
        <el-row type="flex" justify="center" :class="Get_Expand_Or_Collapse_QB(0)" style="margin-top: -10px; margin-bottom: 30px">
            <el-button v-on:click.native="Expand_Or_Collapse_QB(0)" round size="small" plain>收起</el-button>
        </el-row>
        <!-- 分析详情 -->
        <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse_QB(1)" :class="Get_Part_Row_Style_QB(1)">
            <el-col :span="14" style="text-align: left; line-height: 30px">
                <el-row type="flex" justify="start">
                    <i class="el-icon-arrow-up" v-if="Part_Expand_QB[1]" style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    <i class="el-icon-arrow-down" v-else style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    知识点分析
                </el-row>
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
                        <el-row v-if="Pair_Index < 5">
                            <el-col :offset="2" :span="7"><label>{{Paper_Total_Get_Ku_Pair_Part(QB_Knowledge_Pair, 0)}}</label></el-col>
                            <el-col :span="7"><label>{{Paper_Total_Get_Ku_Pair_Part(QB_Knowledge_Pair, 1)}}</label></el-col>
                            <el-col :span="7"><label>{{QB_KnowledgePair_List[Pair_Index]}}</label></el-col>
                        </el-row>
                    </el-row>
                </el-row>
                <!-- 知识点点对分布共现关系的图的部分 -->
                <el-row v-if="QB_KnowledgePair_Name_List.length > 0">
                    <div id="QB_Knowledge_Pair" class="QB_Knowledge_Pair"></div>
                </el-row>
            </el-row>
        </el-row>
        <el-row type="flex" justify="center" :class="Get_Expand_Or_Collapse_QB(1)" style="margin-top: -10px; margin-bottom: 30px">
            <el-button v-on:click.native="Expand_Or_Collapse_QB(1)" round size="small" plain>收起</el-button>
        </el-row>
    </el-dialog>
    <el-dialog
        :visible.sync="analyseDataShow"
        width="90%"
        :modal-append-to-body="false"
        :close-on-click-modal="true"
        :key="Refresh">
        <template slot="title"></template>
        <QuestionAnalyse :Ques="analyseData"></QuestionAnalyse>
    </el-dialog>
    <el-row justify="start" type="flex">
        <el-col style="padding-left: 25px; margin-top: 5vh">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >分析</el-breadcrumb-item>
            <el-breadcrumb-item ><span @click="PaperAnalyseSwitch()" style="cursor: pointer">试卷资源</span></el-breadcrumb-item>
            <el-breadcrumb-item >分析报告</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
    </el-row>
    <div ref="Paper_Title">
        <el-row style="padding-top: 15px">
            <label style="font-size: 2rem">{{Paper_Json.title}}分析报告</label>
        </el-row>
        <el-row>
            <el-col :span="18" :offset="3">
                <el-divider style="width: 3px"></el-divider>
            </el-col>
        </el-row>
    </div>
    <div ref="Paper_Total">
        <!-- 综合分析 -->
        <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(0)" :class="Get_Part_Row_Style(0)">
            <el-col :span="12" style="text-align: left; line-height: 30px">
                <el-row type="flex" justify="start">
                    <i class="el-icon-arrow-up" v-if="Part_Expand[0]" style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    <i class="el-icon-arrow-down" v-else style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    综合分析
                </el-row>
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
            <el-row style="width: 67vw; margin-left: 16.5vw; margin-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver; margin-bottom: 5vh">
                <el-col :span="4">难度</el-col>
                <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.mean)}}</el-col>
                <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.std)}}</el-col>
                <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.max)}}</el-col>
                <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.min)}}</el-col>
            </el-row>
            <!-- 第二项 -->
            <el-row style="width: 67vw; margin-left: 16.5vw; margin-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver; display: none">
                <el-col :span="4">指标2</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
                <el-col :span="5">0</el-col>
            </el-row>
            <!-- 第三项 -->
            <el-row style="width: 67vw; margin-left: 16.5vw; margin-top: 5px; margin-bottom: 40px; padding-bottom: 5px; border-bottom: 1px solid silver; display: none">
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
        <el-row type="flex" justify="center" :class="Get_Expand_Or_Collapse(0)" style="margin-top: -10px; margin-bottom: 30px">
            <el-button v-on:click.native="Expand_Or_Collapse(0)" round size="small" plain>收起</el-button>
        </el-row>
    </div>
    <div ref="Paper_Analyse">
    <!-- 分析详情 -->
        <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(1)" :class="Get_Part_Row_Style(1)">
            <el-col :span="12" style="text-align: left; line-height: 30px">
                <el-row type="flex" justify="start">
                    <i class="el-icon-arrow-up" v-if="Part_Expand[1]" style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    <i class="el-icon-arrow-down" v-else style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    分析详情
                </el-row>
            </el-col>
        </el-row>
        <el-row :class="Get_Expand_Or_Collapse(1)">
            <el-row style="width: 24vw; margin-left: 38vw; margin-top: 10px; border: 1px solid #409EFD; border-radius: 10px; height: 30px">
                <el-col :span="8" style="border-top-left-radius: 10px; border-bottom-left-radius: 10px;" :class="Check_Total_Switch(0)" v-on:click.native="Paper_Total_Analyse_Focus = 0">
                    知识点分析
                </el-col>
                <el-col :span="8" :class="Check_Total_Switch(1)" v-on:click.native="Paper_Total_Analyse_Focus = 1">
                    难度分析
                </el-col>
                <el-col :span="8" style="border-top-right-radius: 10px; border-bottom-right-radius: 10px;" :class="Check_Total_Switch(2)" v-on:click.native="Paper_Total_Analyse_Focus = 2">
                    双向细目表分析
                </el-col>
            </el-row>
            <!-- 知识点分析 -->
            <el-row :class="Paper_Total_Analyse_Hidden(0)">
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
                        <el-row v-if="Pair_Index < 5">
                            <el-col :offset="2" :span="7"><label>{{Paper_Total_Get_Ku_Pair_Part(Knowledge_Pair, 0)}}</label></el-col>
                            <el-col :span="7"><label>{{Paper_Total_Get_Ku_Pair_Part(Knowledge_Pair, 1)}}</label></el-col>
                            <el-col :span="7"><label>{{KnowledgePair_List[Pair_Index]}}</label></el-col>
                        </el-row>
                    </el-row>
                </el-row>
                <!-- 知识点点对分布共现关系的图的部分 -->
                <el-row v-if="KnowledgePair_Name_List.length > 0">
                    <div id="Paper_Knowledge_Pair" class="Paper_Knowledge_Pair"></div>
                </el-row>
                <!-- 知识点覆盖程度部分 -->
                <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem; margin-top: 30px; margin-right: 16.5vw; text-align: left;">
                    <label>与大纲相对比，本卷覆盖了大纲中 {{Get_Cover_Ratio()}} 的一级知识点。</label>
                </el-row>
                <!-- 提示行 -->
                <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem">
                    <label>一级知识点覆盖情况如下：</label>
                </el-row>
                <el-row>
                    <div id="Paper_Knowledge_Cover" class="Paper_Knowledge_Cover"></div>
                </el-row>
            </el-row>
            <!-- 难度分析 -->
            <el-row :class="Paper_Total_Analyse_Hidden(1)">
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
                <!-- 总分析行 -->
                <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem; margin-top: 30px; text-align: left">
                    <label>本卷中难度最大的题目是第 {{Max_Difficult}} 题，难度最低的题目是第 {{Min_Difficult}} 题。</label>
                </el-row>
                <!-- 提示行 -->
                <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 1.5rem">
                    <label>全卷卷内难度变化如下：</label>
                </el-row>
                <!-- 折线图 -->
                <el-row>
                    <div id="Paper_Total_Difficult_Analyse_Line" class="Paper_Total_Difficult_Analyse_Line"></div>
                </el-row>
            </el-row>
            <!-- 双向细目表分析 -->
            <el-row 
                :class="Paper_Total_Analyse_Hidden(2)" 
                style="margin-bottom: 30px"
                v-loading="Question_Analysing"
                element-loading-text="正在加载分析报告..."
                element-loading-spinner="el-icon-loading"
                >
                <!-- 表头 -->
                <el-row style="margin: 30px 16.5vw 0px 16.5vw;">
                  <el-col :span="3">
                      <el-row type="flex" justify="center" class="Double_Table_Border" style="border-top: 2px solid #D8D8D8; border-left: 2px solid #D8D8D8;">
                          <label>题型</label>
                      </el-row>
                  </el-col>
                  <el-col :span="21">
                      <el-row type="flex" justify="center">
                        <el-col :span="2">
                            <el-row type="flex" justify="center" class="Double_Table_Border" style="border-top: 2px solid #D8D8D8;">
                                <label>题号</label>
                            </el-row>
                        </el-col>
                        <el-col :span="2">
                            <el-row type="flex" justify="center" class="Double_Table_Border" style="border-top: 2px solid #D8D8D8;">
                                <label>分值</label>
                            </el-row>
                        </el-col>
                        <el-col :span="16">
                            <el-row type="flex" justify="center" class="Double_Table_Border" style="border-top: 2px solid #D8D8D8;">
                                <label>知识点</label>
                            </el-row>
                        </el-col>
                        <el-col :span="4">
                            <el-row type="flex" justify="center" class="Double_Table_Border" style="border-top: 2px solid #D8D8D8; border-right: 2px solid #D8D8D8;">
                                <label>试题难度</label>
                            </el-row>
                        </el-col>
                      </el-row>
                  </el-col>
                </el-row>
                <el-row style="margin: 0px 16.5vw 0px 16.5vw" v-for="(Item, Index) in Double_Analyse" :key="'DA_' + Index">
                  <el-col :span="3">
                      <el-row :style="Double_Analyse_Pos(Index)">
                          <label>{{Item.type}}</label>
                      </el-row>
                  </el-col>
                  <el-col :span="21">
                      <el-row v-for="(Info, ii) in Item.items" :key="'DA_' + Index + '_' + ii">
                          <el-row type="flex" justify="center" :style="Get_Double_Table_Background(Info.index)">
                            <el-col :span="2">
                                <el-row v-if="Info.index != Double_Count" type="flex" justify="center" class="Double_Table_Border">
                                    <el-button type="text" @click="Jump_To_Question(Index, ii)" style="margin-top: -5px">{{Info.index}}</el-button>
                                </el-row>
                                <el-row v-else type="flex" justify="center" class="Double_Table_Border" style="border-bottom: 2px solid #D8D8D8;">
                                    <el-button type="text" @click="Jump_To_Question(Index, ii)" style="margin-top: -5px">{{Info.index}}</el-button>
                                </el-row>
                            </el-col>
                            <el-col :span="2">
                                <el-row v-if="Info.index != Double_Count" type="flex" justify="center" class="Double_Table_Border">
                                    {{Info.score}}
                                </el-row>
                                <el-row v-else type="flex" justify="center" class="Double_Table_Border" style="border-bottom: 2px solid #D8D8D8;">
                                    {{Info.score}}
                                </el-row>
                            </el-col>
                            <el-col :span="16">
                                <el-row v-if="Info.index != Double_Count" type="flex" justify="center" class="Double_Table_Border">
                                    <el-button v-for="(KU, ki) in Info.kp" :key="'KU_' + ki" @click="submit(KU)" type="text" style="margin-top: -5px">{{ KU }}</el-button>
                                </el-row>
                                <el-row v-else type="flex" justify="center" class="Double_Table_Border" style="border-bottom: 2px solid #D8D8D8;">
                                    <el-button v-for="(KU, ki) in Info.kp" :key="'KU_' + ki" @click="submit(KU)" type="text" style="margin-top: -5px">{{ KU }}</el-button>
                                </el-row>
                            </el-col>
                            <el-col :span="4">
                                <el-row v-if="Info.index != Double_Count" type="flex" justify="center" class="Double_Table_Border" style="border-right: 2px solid #D8D8D8;">
                                    {{Info.difficulty.toFixed(2)}}
                                </el-row>
                                <el-row v-else type="flex" justify="center" class="Double_Table_Border" style="border-right: 2px solid #D8D8D8; border-bottom: 2px solid #D8D8D8;">
                                    {{Info.difficulty.toFixed(2)}}
                                </el-row>
                            </el-col>
                        </el-row>
                      </el-row>
                  </el-col>
                </el-row>
            </el-row>
        </el-row>
        <el-row type="flex" justify="center" :class="Get_Expand_Or_Collapse(1)" style="margin-top: -10px; margin-bottom: 30px">
            <el-button v-on:click.native="Expand_Or_Collapse(1)" round size="small" plain>收起</el-button>
        </el-row>
    </div>
    <div ref="Paper_Similarity"  style="display: none">
        <!-- 相似试卷 -->
        <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(2)" :class="Get_Part_Row_Style(2)">
            <el-col :span="12" style="text-align: left; line-height: 30px">
                <el-row type="flex" justify="start">
                    <i class="el-icon-arrow-up" v-if="Part_Expand[2]" style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    <i class="el-icon-arrow-down" v-else style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    相似试卷
                </el-row>
            </el-col>
        </el-row>
        <el-row :class="Get_Expand_Or_Collapse(2)" type="flex" justify="start" style="margin: 0px 16.5vw 30px 16.5vw">
            <label>与此试卷相似的试卷是xxxxxxx</label>
        </el-row>
    </div>
    <div ref="Paper_Detail">
        <!-- 试卷详情 -->
        <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(3)" :class="Get_Part_Row_Style(3)">
            <el-col :span="12" style="text-align: left; line-height: 30px">
                <el-row type="flex" justify="start">
                    <i class="el-icon-arrow-up" v-if="Part_Expand[3]" style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    <i class="el-icon-arrow-down" v-else style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                    试卷详情
                </el-row>
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
                    <PaperAnalysePQRoot @Report="Question_Report_Show" :PackedQues="Sub_Ques" :Index="Sub_Index" style="width: 100%"></PaperAnalysePQRoot>
                </el-row>
            </el-row>
        </el-row>
        <el-row type="flex" justify="center" :class="Get_Expand_Or_Collapse(3)" style="margin-top: -40px; margin-bottom: 30px">
            <el-button v-on:click.native="Expand_Or_Collapse(3)" round size="small" plain>收起</el-button>
        </el-row>
    </div>
    <el-row type="flex" justify="center" style="margin-bottom: 50px">
        <el-button 
            type="success" 
            plain 
            @click="Report_Download()" 
            :disabled="Remaining > 0">
            下载分析报告
            <span v-if="Remaining > 0"> - {{Remaining}} 秒</span>
        </el-button>
        <el-button type="success" plain @click="PaperAnalyseSwitch()">分析其他试卷</el-button>
    </el-row>  
    </div>
</template>
<script>
// 引入基本模板
import * as echarts from 'echarts';
import PaperAnalysePQRoot from './components/PaperAnalysePQRoot.vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QuestionAnalyse from "./QuestionAnalyse.vue"

import {commonAjax} from '@/common/utils/ajax'

var PDF = new jsPDF('', 'pt', 'a4');

export default {

    components: { PaperAnalysePQRoot, QuestionAnalyse },
    name: "PaperAnalyse",
    data(){
        return {
<<<<<<< HEAD
            loading: false,
            // 计时器，用Remaining做计时
            Timer: "",
            // 倒计时五秒前不允许下载，为了方便Echarts完全生成
            Remaining: 6,
            // 保存图用的字典
            Chart_Base_Dict: {
                // 最顶上的字典
                Total_Bar: "",
                // 知识点分析
                KU: {
                    // 难度
                    Average_Diff: "",
                    // 分数
                    Score: "",
                    // 知识点对
                    KU_Pair: "",
                    // 覆盖率
                    Cover: ""
                },
                // 难度分析部分
                Difficulty: {
                    // 难度区间
                    Diff_Gap: "",
                    // 难度波动
                    Diff_Wave: ""
                }
                // 双向细目表的表格是我自己手搓的，没图
            },
=======
            // 双向分析报告位置先加一个loading来做“跳出来”页面的遮罩
            Question_Analysing: false,
>>>>>>> 046d2a2... issue33 - Double-Analyse-New-Function
            // 双相啥的分析报告
            Double_Analyse: [],
            // 还是写个最后一行的标签吧
            Double_Count: -1,
            // 单题分析报告
            analyseData: "",
            analyseDataShow: false,
            Refresh: false,
            // 最难，最简单的序号
            Max_Difficult: -1,
            Min_Difficult: -1,
            // 保存标志
            transing: false,
            // 跳转至试卷分析的不同地点用的
            PaperAnalyseSwitchFlag: false,
            Paper_Json: this.Paper_J,
            // 总体分析界面是否展开/折叠
            Part_Expand: [true, false, false, false],
            // 总体分析页面展开的是知识点分析还是难度分析的区分变量
            // 6月25日，新加第三项了，改成0/1/2了
            Paper_Total_Analyse_Focus: 0,
            // 占比最大的题目难度区间
            Max_Gap: "",
            // 大题分析页面是否展开/折叠
            Part_Expand_QB: [true, false],
            // 以下属性只用于全卷分析这一节的内容，之后的大题分析环节我们交给函数去算
            // 知识点分值和知识点分值对应的名称
            KnowledgeScore_List: [],
            KnowledgeScore_Name_List: [],
            Question_Difficult_List: [],
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
        sessionStorage.removeItem('PaperJson')
    },
    watch: {
        Remaining(){
            if(this.Remaining <= 0){
                clearInterval(this.Timer)
            }
        }
    },
    props: {
        Paper_J:{
            type: Object,
            default: function(){
                return {
                    "id": "af6a45a3-46fa-41d6-ac7e-ae3842ce40fb",
                    "type": "Paper",
                    "title": "Temp_Title",
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
                    "sub_question": []
              }
            }
        }
    },
    mounted() {
        this.Timer = setInterval( () => {
            this.Remaining = this.Remaining - 1;
        }, 1000)
        this.Init();
        window.scrollTo(0, 0);
    },
    methods: {
        // 跳转到这道题（也不知道啥意思）
        Jump_To_Question(Index_Out, Index_In){
            let ID = this.Double_Analyse[Index_Out].items[Index_In].id;
            this.Search(ID, 'public')
        },
        // 对于对应ID的题目进行检索
        Search(ID, Database){
            this.Question_Analysing = true;
            commonAjax(this.backendIP+'/api/questionAnalyse',
                {
                    databasename: Database,
                    ID: ID
                }
                ).then((data)=>{
                    if(data.status == 'fail' && Database == 'public'){
                        this.Search(ID, 'test');
                    }else if(data.status == 'fail' && Database != 'public'){
                        this.$message.error("此题暂无法获取单题分析报告。")
                        this.Question_Analysing = false;
                        return;
                    }else{
                        this.analyseData = data.que_dic;
                        this.analyseDataShow = true;
                        this.Refresh = !this.Refresh;
                        this.$message.success("获取成功！")
                        this.Question_Analysing = false;
                    }
                }).catch(()=>{
                    if(Database == 'public'){
                        this.$message.error("服务器正忙，请稍后重试。")
                    }else{
                        this.$message.warning("文件上传的试题暂不支持单题分析，正在更新过程中，敬请期待。")
                    }
                    this.Question_Analysing = false;
                })
        },
        // 点击检索
        submit(KU) {
            let routeData = this.$router.resolve({
                name: "Knowledge Unit",
            });
            sessionStorage.setItem("KUFromPaperAnalyse", KU)
            window.open(routeData.href, '_blank');
        },
        // 双向分析，表格单行的颜色
        Get_Double_Table_Background(Index){
            let Style1 = {
                "background": "transparent"
            }
            let Style2 = {
                "background": "#F8FBFF"
            }
            if(Index % 2 != 1){
                return Style1
            }else{
                return Style2
            }
        },
        // 获取双相分析每一行题型的Pos
        Double_Analyse_Pos(Index){
            let Style = {
                "height" : (this.Double_Analyse[Index].items.length * 30) + "px",
                "line-height": (this.Double_Analyse[Index].items.length * 30) + "px",
                "border": "1px solid #D8D8D8",
                "border-left": "2px solid #D8D8D8",
                "border-bottom": "1px solid #D8D8D8",
                "background": "transparent",
                "-webkit-box-sizing": "border-box",
                "-moz-box-sizing": "border-box",
                "box-sizing": "border-box"
            }
            if(Index == this.Double_Analyse.length - 1){
                Style['border-bottom'] = "2px solid #D8D8D8"
            }
            return Style
        },
        Question_Report_Show(val){
            this.analyseData = JSON.parse(val)
            this.analyseDataShow = true
            this.Refresh = !this.Refresh;
        },
        PAS(index){
            if(index == 0){
                this.$router.push({ path: "/paperAnalyseInput" });
                this.PaperAnalyseSwitchFlag = false;
            }else{
                alert("尚未完成");
            }
        },
        // 跳转至试卷分析的不同位置的对话框
        PaperAnalyseSwitch(){
            this.PaperAnalyseSwitchFlag = true;
        },
        Report_Download(){

            this.loading = true;

            let Paper_Data = {
                title: this.Paper_Json.title,
                score: this.Paper_Json.score,
                difficulty_list: this.Paper_Json.difficulty_list,
                level_one_knowledge_point: this.Paper_Json.level_one_knowledge_point,
                all_level_one_knowledge_point: this.Paper_Json.all_level_one_knowledge_point,
                difficulty_statistics: this.Paper_Json.difficulty_statistics,
                knowledge_knowledge2num: this.Paper_Json.knowledge_knowledge2num,
                knowledge2score: this.Paper_Json.knowledge2score,
                knowledge2difficulty: this.Paper_Json.knowledge2difficulty,
                sub_question: this.Paper_Json.sub_question,
                Total_Bar: this.Chart_Base_Dict.Total_Bar,
                KU: {
                    Average_Diff: this.Chart_Base_Dict.KU.Average_Diff,
                    Score: this.Chart_Base_Dict.KU.Score,
                    KU_Pair: this.Chart_Base_Dict.KU.KU_Pair,
                    Cover: this.Chart_Base_Dict.KU.Cover
                },
                Difficulty: {
                    Diff_Gap: this.Chart_Base_Dict.Difficulty.Diff_Gap,
                    Diff_Wave: this.Chart_Base_Dict.Difficulty.Diff_Wave
                }
            }

            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                responseType: 'arraybuffer',
                emulateJSON: true
            }

            let param = new FormData();

            param.append('Paper_Data', JSON.stringify(Paper_Data, null, 4));

            this.$http
                .post(this.backendIP + "/api/paperAnalyseReport", param, config)
                .then(function(data) {
                if(data.data){
                    this.loading = false;
                    const link = document.createElement('a')
                    let blob = new Blob([data.data],
                        {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"})
                    let objectUrl = URL.createObjectURL(blob)
                    link.href = objectUrl
                    link.download = '试卷分析报告 - ' + this.Paper_Json.title + '.docx'
                    link.click()
                    URL.revokeObjectURL(objectUrl);
                }
                }).catch(() => {
                    alert("服务器过忙，请稍后重新尝试...");
                    this.loading = false;
                    return
                });
            // var file = new File(
            //     [JSON.stringify(this.Chart_Base_Dict, null, 4)],
            //     "Cover.json",
            //     { type: "text/plain;charset=utf-8" }
            // );
            // FileSaver.saveAs(file);
            // file = new File(
            //     [JSON.stringify(this.Paper_Json, null, 4)],
            //     "Paper.json",
            //     { type: "text/plain;charset=utf-8" }
            // );
            // FileSaver.saveAs(file);
            // let flag = true;
            // if(flag){
            //     return
            // }
            // window.scrollTo(0, 0);
            // this.Part_Expand = [true, true, true, true];
            // // this.transing = true;
            // // this.PDF_Download("Paper_Title");
            // // this.PDF_Download("Paper_Total");
            // // this.PDF_Download("Paper_Analyse");
            // // this.PDF_Download("Paper_Similarity");
            // // this.PDF_Download("Paper_Detail");
            // this.PDF_Download("PaperAnalyseInfo");
            
        },
        // 下载PDF格式的分析报告
        PDF_Download(part){

            if(this.Part_Expand.indexOf(false) != -1){
                this.Part_Expand = [true, true, true, true];
            }
            setTimeout(()=>{
                html2canvas(this.$refs[part]).then(

                    canvas => {

                        var contentWidth = canvas.width;
                        var contentHeight = canvas.height;

                        var pageHeight = contentWidth / 592.28 * 841.89;
                        var leftHeight = contentHeight;

                        var position = 0;

                        var imgWidth = 595.28;
                        var imgHeight = 592.28/contentWidth * contentHeight;

                        var pageData = canvas.toDataURL('image/jpeg', 1.0);

                        if (leftHeight < pageHeight) {
                            PDF.addImage(pageData, 'JPEG', 0, 20, imgWidth, imgHeight );
                        } else {
                            while(leftHeight > 0) {
                                PDF.addImage(pageData, 'JPEG', 0, position + 20, imgWidth, imgHeight)
                                leftHeight -= pageHeight;
                                position -= 841.89;
                                //避免添加空白页
                                if(leftHeight > 0) {
                                    PDF.addPage();
                                }
                            }
                        }
                        if(part == "Paper_Detail" || part == "PaperAnalyseInfo"){
                            PDF.save("part_content.pdf")
                            PDF = new jsPDF('', 'pt', 'a4');
                            // this.transing = false;
                        }else{
                            PDF.addPage();
                        }
                        return
                    }
                )
            }, 1)     
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
                    max: 1.0,
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
                },
                // {
                //     name:'指标2',
                //     type:'bar',
                //     barWidth: '20%',
                //     data: [0.6, 0.2, 0.4, 0.6]
                // },
                // {
                //     name:'指标3',
                //     type:'bar',
                //     barWidth: '20%',
                //     data: [0.2, 0.4, 0.1, 0.4]
                // },
            ]
            };

            for(let i = 0; i < this.Paper_Json.sub_question.length; i++){
                option.xAxis[0].data.push("第" + (i+1) + "大题");
                option.series[0].data.push(this.Paper_Json.sub_question[i].difficulty_statistics.mean);
            }

            myChart.setOption(option);

            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});
            setTimeout(() => {
                this.Chart_Base_Dict.Total_Bar = myChart.getDataURL();
            }
            , 4000)
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
                    max: 1.0,
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
                },
                // {
                //     name:'指标2',
                //     type:'bar',
                //     barWidth: '20%',
                //     data: [0.6, 0.2, 0.4, 0.6]
                // },
                // {
                //     name:'指标3',
                //     type:'bar',
                //     barWidth: '20%',
                //     data: [0.2, 0.4, 0.1, 0.4]
                // },
            ]
            };

            for(let i = 0; i < this.Paper_Json_Question_Bundle_Info.sub_question.length; i++){
                option.xAxis[0].data.push("第" + (i+1) + "小题");
                if(this.Paper_Json_Question_Bundle_Info.sub_question[i].difficulty){
                    option.series[0].data.push(this.Paper_Json_Question_Bundle_Info.sub_question[i].difficulty);
                }else{
                    option.series[0].data.push(this.Paper_Json_Question_Bundle_Info.sub_question[i].difficulty_statistics.mean);
                }
            }

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
            
            setTimeout(() => {
                this.Chart_Base_Dict.Difficulty.Diff_Gap = myChart.getDataURL();
            }
            , 4000)

        },
        Init_Paper_Total_Difficult_Analyse_Line(){

            var chartDom = document.getElementById('Paper_Total_Difficult_Analyse_Line');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                title: {
                    text: "卷内难度波动",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,25]
                },
                tooltip: {
                    trigger: 'axis',
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                        align: 'left'
                    }
                },
                color: ["#409EFD"],
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    min: 0.0,
                    max: 1.0
                },
                series: [{
                    name: "试题难度",
                    data: [],
                    type: 'line',
                    smooth: true,
                    label: {
                        show: true
                    }
                }]
            }

            for(let i = 0; i < this.Question_Difficult_List.length; i++){
                option.xAxis.data.push("第" + (i+1) + "题");
                option.series[0].data.push(this.Question_Difficult_List[i])
            }


            myChart.setOption(option);
            window.addEventListener('resize',function() {myChart.resize()});

            
            setTimeout(() => {
                this.Chart_Base_Dict.Difficulty.Diff_Wave = myChart.getDataURL();
            }
            , 4000)

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
                        max: 1.0,
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

            
            setTimeout(() => {
                this.Chart_Base_Dict.KU.Average_Diff = myChart.getDataURL();
            }
            , 4000)
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
                            length: 10,
                            length2: 10
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
            setTimeout(() => {
                this.Chart_Base_Dict.KU.Score = myChart.getDataURL()
            }
            , 4000)

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

            
            setTimeout(() => {
                this.Chart_Base_Dict.KU.KU_Pair = myChart.getDataURL()
            }
            , 4000)

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
                        max: 1.0,
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
                    right: '7%',
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
                            length: 10,
                            length2: 10
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
        // 偷偷摸摸塞进来，这里是添加一级知识点覆盖情况的旭日图
        Init_Paper_Knowledge_Cover_Sunburst(){
            let Line_Chart_1 = echarts.init(document.getElementById("Paper_Knowledge_Cover"));
            let Level_Data = []

            let Temp_List = this.Paper_Json.all_level_one_knowledge_point;
            let Check_List = [];

            for(let i = 0 ; i < Temp_List.length; i++){
                if(Check_List.indexOf(Temp_List[i]) == -1){
                    Check_List.push(Temp_List[i])
                }
            }

            let Have_List = this.Paper_Json.level_one_knowledge_point;

            for(let i = 0; i < Check_List.length; i++){
                if(Have_List.indexOf(Check_List[i]) != -1){
                    Level_Data.push({
                        name: Check_List[i],
                        value: 1,
                        itemStyle: {
                            color: "#409EFD",
                        },
                        label: {
                            color: "#409EFD"
                        },
                        children: []
                    })
                }else{
                    Level_Data.push({
                        name: Check_List[i],
                        value: 1,
                        itemStyle: {
                            color: "Gainsboro",
                        },
                        label: {
                            color: "Gainsboro"
                        },
                        children: []
                    })
                }
            }

            let Liberal_Option_1 = {
            
                title: {
                    text: "一级知识点覆盖状态图",
                    x: "left",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,25]
                },
                series: {
                    type: 'sunburst',

                    data: Level_Data,
                    radius: [0, '95%'],
                    sort: null,

                    emphasis: {
                        focus: 'ancestor'
                    },

                    levels: [{}, {
                        r0: '20%',
                        r: '60%',
                        itemStyle: {
                            borderWidth: 2
                        },
                        label: {
                            rotate: 'radial',
                            position: 'outside',
                            padding: 3,
                            silent: false
                        }
                    }]
                }
            }

            Line_Chart_1.setOption(Liberal_Option_1);
            window.addEventListener('resize',function() {Line_Chart_1.resize()});
            setTimeout(() => {
                this.Chart_Base_Dict.KU.Cover = Line_Chart_1.getDataURL();
            }
            , 4000)
            
        },
        // 覆盖率的计算
        Get_Cover_Ratio(){

            let Temp_List = this.Paper_Json.all_level_one_knowledge_point;
            let Check_List = [];

            for(let i = 0 ; i < Temp_List.length; i++){
                if(Check_List.indexOf(Temp_List[i]) == -1){
                    Check_List.push(Temp_List[i])
                }
            }

            let Have_List = this.Paper_Json.level_one_knowledge_point;

            let R = parseFloat(Have_List.length / Check_List.length) * 100 + ""

            let Pos = R.indexOf(".");
            R = R.substring(0, Pos + 3) + "%";

            return R
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

            let Temp_Max = -1;
            let Temp_Min = 2;

            let count = 1;

            let Temp_List = this.Paper_Json.all_level_one_knowledge_point;
            let Check_List = [];

            for(let i = 0 ; i < Temp_List.length; i++){
                if(Check_List.indexOf(Temp_List[i]) == -1){
                    Check_List.push(Temp_List[i])
                }
            }

            this.Double_Analyse = [];

            for(let i = 0; i < this.Paper_Json.sub_question.length; i++){
                let Double_Item = {
                    type: this.Paper_Json.sub_question[i].desc,
                    items: []
                };
                for(let j = 0; j < this.Paper_Json.sub_question[i].sub_question.length; j++){
                    let D = 0;
                    let Double_Element = {
                        score: this.Paper_Json.sub_question[i].sub_question[j].score,
                        kp: [],
                        difficulty: this.Paper_Json.sub_question[i].sub_question[j].difficulty,
                        index: count,
                        id: this.Paper_Json.sub_question[i].sub_question[j].id
                    };

                    for(let eleI = 0; eleI < this.Paper_Json.sub_question[i].sub_question[j].knowledge_points_frontend.kp_layer.length; eleI++){
                        Double_Element.kp.push(this.Paper_Json.sub_question[i].sub_question[j].knowledge_points_frontend.kp_layer[eleI].label)
                    }

                    if(this.Paper_Json.sub_question[i].sub_question[j].difficulty){
                        D = this.Paper_Json.sub_question[i].sub_question[j].difficulty
                    }else{
                        D = this.Paper_Json.sub_question[i].sub_question[j].difficulty_statistics.mean;
                    }
                    D = parseFloat(D.toFixed(3));
                    this.Question_Difficult_List.push(D);
                    if(D <= Temp_Min){
                        Temp_Min = D;
                        this.Min_Difficult = count;
                    }
                    if(D >= Temp_Max){
                        Temp_Max = D;
                        this.Max_Difficult = count;
                    }
                    count = count + 1;
                    Double_Item.items.push(Double_Element)
                }
                this.Double_Analyse.push(Double_Item);
                this.Double_Count = count - 1;
            }

            setTimeout(()=>{
                this.Init_Paper_Total_Bar();
                this.Init_Paper_Total_Difficult_Analyse();
                this.Init_Paper_Total_Difficult_Analyse_Line();
                this.Get_Max_Difficult_Gap();
                this.Init_Paper_Knowledge_Difficult_Analyse();
                this.Init_Paper_Knowledge_Score_Analyse();
                this.Init_Paper_Knowledge_Pair();
                this.Init_Paper_Knowledge_Cover_Sunburst();
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
.Paper_Total_Difficult_Analyse_Line{
    margin-top: 30px;
    border-radius: 10px; 
    width: 67vw; 
    height:350px; 
    padding-top: 10px; 
    margin-left: calc(100vw * 0.165);  
    border: 3px solid #EEF5FE; 
    background: transparent;
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
    height:600px; 
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
    cursor: pointer;
}
.Paper_Total_Analyse_Unfocus{
    margin-top: -1px;
    height: 30px;
    padding-top: 5px;
    cursor: pointer;
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
// 双相分析单表格行
.Double_Table_Border{
    border: 1px solid #D8D8D8;
    height: 30px;
    line-height: 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
</style>