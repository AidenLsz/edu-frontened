<template>
    <div
        v-loading="Picture_Loading"
        element-loading-text="正在加载图片，请稍后..."
        element-loading-spinner="el-icon-loading"
        >
        <el-dialog
            :visible.sync="Complex_Input_Dialog"
            title="LUNA输入助手"
            width="65%"
            :modal-append-to-body="false"
            :close-on-click-modal="false">
            <ComplexInput @New_Content="Update_Complex_Input" :Get_Out_Content="Complex_Content"></ComplexInput>
        </el-dialog>
        <!-- 顶部行 -->
        <el-row type="flex" justify="start" class="topBar">
            <!-- 编辑和预览 -->
            <el-col :span="1" :offset="1">
                <el-row
                    type="flex"
                    justify="center"
                    style="height: 40px; line-height: 40px; cursor: pointer;"
                    :class="Get_Focus_Function('Editing')"
                    @click.native="Focus_Function = 'Editing'">编辑
                    <input
                        type="file"
                        style="display: none"
                        accept=".jpg, .jpeg, .png"
                        multiple="false"
                        id="PictureInput"/>
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
            <!-- 后面的编辑按钮 -->
            <el-col :span="5" :offset="15">
                <el-row type="flex" justify="start">
                    <!-- 七个编辑按钮，依序为插入括号，插入填空占位符，清理编辑内容，加粗，斜体，插入图片和插入公式 -->
                    <el-tooltip placement="top">
                        <div slot="content">插入括号</div>
                        <span @click="Insert_Quote()" class="editButton" style="font-size: 18px; font-weight: bold">
                            ( )
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">插入占位符</div>
                        <span @click="Insert_Fill()" class="editButton" style="font-size: 20px; font-weight: bold;">
                            <u>U</u>
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">清除编辑内容</div>
                        <span @click="Reset_Question_Info()" class="editButton" style="font-size: 16px; font-weight: bold; padding-top: 2px">
                            <i class="el-icon-circle-close" style="font-weight: bold; font-size: 20px;"></i>
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">加粗</div>
                        <span @click="Font_Bold()" class="editButton" style="font-size: 20px; font-weight: bold;">
                            <b>B</b>
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">斜体</div>
                        <span @click="Font_Italic()" class="editButton" style="font-size: 20px; font-weight: bold;">
                            <i>I</i>
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">插入图片</div>
                        <span @click="Insert_Picture()" class="editButton" style="font-size: 16px; font-weight: bold; padding-top: 2px">
                            <i class="el-icon-picture-outline" style="font-weight: bold; font-size: 20px;"></i>
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content">插入公式</div>
                        <span @click="Complex_Input()" class="editButton" style="font-size: 20px; font-weight: bold;">
                            <img src="./fx.png" height="18px">
                        </span>
                    </el-tooltip>
                </el-row>
            </el-col>
        </el-row>
        <!-- 下面这部分是编辑状况下看到的内容 -->
        <div v-show="Focus_Function == 'Editing'" style="padding-bottom: 30px;">
            <!-- 第一行，分值 -->
            <el-row type="flex" justify="start" style="margin-top: 20px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                        <span>总分：</span>
                    </el-row>
                </el-col>
                <el-col :span="3" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input v-model="Question.score" placeholder="" readonly></el-input>
                    </el-row>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                        <span>小题分值统一：</span>
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row type="flex" justify="start">
                        <el-input-number v-model="Unit_Score" placeholder="" :step=".5" :min="1" :max="40"></el-input-number>
                    </el-row>
                </el-col>
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                        <el-button type="primary" @click="Unit_Sub_Questions_Score()">确认修改</el-button>
                    </el-row>
                </el-col>
                <el-col :span="9">
                    <el-row type="flex" justify="end">
                        <el-button type="success" @click="Emit_And_Submit()">确定提交</el-button>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 第二行，题干 -->
            <el-row type="flex" justify="start" :style="'margin-top: 20px; ' + (Question.stem_image.length == 0 ? 'margin-bottom: 30px;' : 'margin-bottom: 10px;')">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                        <span>题干：</span>
                    </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input
                            @focus="Get_Focus('Mix_Stem')"
                            id="Mix_Stem"
                            type="textarea"
                            v-model="Question.stem"
                            resize="none" :rows="6"
                            placeholder="请填写题干内容（必填）"></el-input>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 题干配图 -->
            <el-row v-show="Question.stem_image.length > 0">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px">
                        <span>题干配图：</span>
                    </el-row>
                </el-col>
                <el-col :span="21" :offset="1">
                    <el-row
                        type="flex"
                        justify="start"
                        v-for="Stem_Pic_Row_Index in Math.ceil(Question.stem_image.length/12)"
                        :key="'Stem_Pic_Row_' + Stem_Pic_Row_Index">
                        <el-col
                            :span="2"
                            v-for="Stem_Pic_Col_Index in 12"
                            :key="'Stem_Pic_Row_' + Stem_Pic_Row_Index + 'Col_' + Stem_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="start"
                                v-if="(Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1 < Question.stem_image.length"
                                >
                                <el-popover
                                    :ref="'Stem_Pic_Row_' + Stem_Pic_Row_Index + 'Col_' + Stem_Pic_Col_Index + '_Pop'"
                                    placement="top"
                                    width="200"
                                    trigger="hover">
                                    <el-row type="flex" justify="center">
                                        <img width="160" :src="Get_Picture_Src('stem_image', Stem_Pic_Row_Index, Stem_Pic_Col_Index)">
                                    </el-row>
                                    <el-row type="flex" justify="center">
                                        <el-button
                                            type="danger"
                                            size="small"
                                            @click="Del_Picture_Src('stem_image', Stem_Pic_Row_Index, Stem_Pic_Col_Index)"
                                            style="margin-top: 10px">
                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                        </el-button>
                                    </el-row>
                                    <span slot="reference" class="imageLabel">
                                        配图{{(Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index}}
                                    </span>
                                </el-popover>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 第三行，每一道小题 -->
            <el-row style="margin-bottom: 20px; border-top: 2px solid #ccc">
                <el-col>
                    <!-- 开始进行每道小题的遍历 -->
                    <el-row
                        type="flex" justify="start"
                        v-for="(Big_Sub_Question, Big_Sub_Question_Index) in Question.sub_questions"
                        :key="'Big_Sub_Question_' + Big_Sub_Question_Index"
                        style="padding-bottom: 30px; border-bottom: 2px solid #ccc; margin-top: 30px;">
                        <!-- 一共分为两个大部分，第一部分是分值，题型和位置控制 -->
                        <!-- 第二部分是主要内容 -->
                        <!-- 主要内容下又分为，题干，选项/小题，答案，解析 -->
                        <el-col>
                            <!-- 分值，题型，位置控制 -->
                            <el-row type="flex" justify="start">
                                <el-col :span="2">
                                    <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                                        <span>小题分值：</span>
                                    </el-row>
                                </el-col>
                                <el-col :span="3" :offset="1">
                                    <el-row type="flex" justify="start" v-show="['简答题', '计算题'].indexOf(Big_Sub_Question.type) != -1">
                                        <el-input v-model="Question.sub_questions[Big_Sub_Question_Index].score" placeholder="" readonly></el-input>
                                    </el-row>
                                    <el-row type="flex" justify="start" v-show="['简答题', '计算题'].indexOf(Big_Sub_Question.type) == -1">
                                        <el-input-number
                                            @change="Update_Total_Score()"
                                            v-model="Question.sub_questions[Big_Sub_Question_Index].score"
                                            placeholder="" :min="1" :step=".5" :max="30"></el-input-number>
                                    </el-row>
                                </el-col>
                                <el-col :span="2" :offset="1">
                                    <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                                        <span>题型：</span>
                                    </el-row>
                                </el-col>
                                <el-col :span="3">
                                    <el-row type="flex" justify="start">
                                        <el-select
                                            @change="Big_Sub_Question_Type_Change(Big_Sub_Question_Index)"
                                            v-model="Question.sub_questions[Big_Sub_Question_Index].type"
                                            placeholder="请选择当前小题题型">
                                            <el-option
                                                v-for="Type in ['单选题', '多选题', '判断题', '填空题', '简答题', '计算题']"
                                                :key="'Big_SQ_' + Big_Sub_Question_Index + '_T_' + Type"
                                                :label="Type" :value="Type"></el-option>
                                        </el-select>
                                    </el-row>
                                </el-col>
                                <el-col :span="1" :offset="2">
                                    <el-row type="flex" justify="center">
                                        <el-button
                                            type="text"
                                            :disabled="Big_Sub_Question_Index == 0"
                                            @click="Big_Sub_Question_Up(Big_Sub_Question_Index)">
                                            <i class="el-icon-top" style="font-size: 20px; margin-top: -3px"></i>
                                        </el-button>
                                    </el-row>
                                </el-col>
                                <el-col :span="1">
                                    <el-row type="flex" justify="center">
                                        <el-button
                                            type="text"
                                            :disabled="Big_Sub_Question_Index == Question.sub_questions.length - 1"
                                            @click="Big_Sub_Question_Down(Big_Sub_Question_Index)">
                                            <i class="el-icon-bottom" style="font-size: 20px; margin-top: -3px"></i>
                                        </el-button>
                                    </el-row>
                                </el-col>
                                <el-col :span="1">
                                    <el-row type="flex" justify="center">
                                        <el-button
                                            type="text"
                                            :disabled="Question.sub_questions.length <= 1"
                                            @click="Big_Sub_Question_Delete(Big_Sub_Question_Index)">
                                            <i class="el-icon-close" style="font-size: 20px; margin-top: -3px"></i>
                                        </el-button>
                                    </el-row>
                                </el-col>
                                <el-col :span="1">
                                    <el-row type="flex" justify="center">
                                        <el-button
                                            type="text"
                                            v-if="Big_Sub_Question_Index == Question.sub_questions.length - 1"
                                            @click="Big_Sub_Question_Add()">
                                            <i class="el-icon-plus" style="font-size: 20px; margin-top: -3px"></i>
                                        </el-button>
                                    </el-row>
                                </el-col>
                                <el-col :span="5">
                                    <el-row type="flex" justify="end">
                                        <el-button
                                            v-if="Question.sub_questions[Big_Sub_Question_Index].expand"
                                            type="primary"
                                            @click="Expand_Change(Big_Sub_Question_Index)">
                                            展开
                                        </el-button>
                                        <el-button
                                            v-else
                                            type="primary"
                                            @click="Expand_Change(Big_Sub_Question_Index)">
                                            折叠
                                        </el-button>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 题干 -->
                            <el-row
                                type="flex"
                                justify="start"
                                style="margin-top: 10px; margin-bottom: 10px">
                                <el-col :span="2">
                                    <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                                        <span>小题题干：</span>
                                    </el-row>
                                </el-col>
                                <el-col :span="17" :offset="1">
                                    <el-row type="flex" justify="start">
                                        <el-input
                                            @focus="Get_Focus('Mix_Stem_' + Big_Sub_Question_Index)"
                                            :id="'Mix_Stem_' + Big_Sub_Question_Index"
                                            v-model="Question.sub_questions[Big_Sub_Question_Index].stem"
                                            placeholder="请填写此小题题干内容（必填）"></el-input>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 题干配图 -->
                            <el-row v-show="Question.sub_questions[Big_Sub_Question_Index].stem_image.length > 0">
                                <el-col :span="2">
                                    <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px">
                                        <span>题干配图：</span>
                                    </el-row>
                                </el-col>
                                <el-col :span="21" :offset="1">
                                    <el-row
                                        type="flex"
                                        justify="start"
                                        v-for="B_SQ_Stem_Pic_Row_Index in Math.ceil(Question.sub_questions[Big_Sub_Question_Index].stem_image.length/12)"
                                        :key="'B_SQ_Stem_Pic_Row_' + B_SQ_Stem_Pic_Row_Index">
                                        <el-col
                                            :span="2"
                                            v-for="B_SQ_Stem_Pic_Col_Index in 12"
                                            :key="'B_SQ_Stem_Pic_Row_' + B_SQ_Stem_Pic_Row_Index + 'Col_' + B_SQ_Stem_Pic_Col_Index">
                                            <el-row
                                                type="flex"
                                                justify="start"
                                                v-if="(B_SQ_Stem_Pic_Row_Index - 1) * 12 + B_SQ_Stem_Pic_Col_Index - 1 < Question.sub_questions[Big_Sub_Question_Index].stem_image.length"
                                                >
                                                <el-popover
                                                    :ref="'B_SQ_Stem_Pic_Row_' + B_SQ_Stem_Pic_Row_Index + 'Col_' + B_SQ_Stem_Pic_Col_Index + '_Pop'"
                                                    placement="top"
                                                    width="200"
                                                    trigger="hover">
                                                    <el-row type="flex" justify="center">
                                                        <img width="160" :src="Get_Picture_Src('stem_image ' + Big_Sub_Question_Index , B_SQ_Stem_Pic_Row_Index, B_SQ_Stem_Pic_Col_Index)">
                                                    </el-row>
                                                    <el-row type="flex" justify="center">
                                                        <el-button
                                                            type="danger"
                                                            size="small"
                                                            @click="Del_Picture_Src('stem_image ' + Big_Sub_Question_Index, B_SQ_Stem_Pic_Row_Index, B_SQ_Stem_Pic_Col_Index)"
                                                            style="margin-top: 10px">
                                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                                        </el-button>
                                                    </el-row>
                                                    <span slot="reference" class="imageLabel">
                                                        配图{{(B_SQ_Stem_Pic_Row_Index - 1) * 12 + B_SQ_Stem_Pic_Col_Index}}
                                                    </span>
                                                </el-popover>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 单选，多选，判断的选项区域和配图区域 -->
                            <!-- 每行两个 -->
                            <el-row
                                v-show="!Big_Sub_Question.expand"
                                type="flex" justify="start"
                                v-for="Option_Row in Math.ceil(Question.sub_questions[Big_Sub_Question_Index].options.length / 2)"
                                :key="'Big_Sub_Question_' + Big_Sub_Question_Index + '_Option_Row_' + Option_Row"
                                style="margin-top: 10px;">
                                <el-col
                                    v-for="Option_Col in 2"
                                    :key="'Big_Sub_Question_' + Big_Sub_Question_Index + '_Option_Row_' + Option_Row + '_Col_' + Option_Col"
                                    :span="12">
                                    <div v-if="(Option_Row - 1)  * 2 + Option_Col - 1 < Question.sub_questions[Big_Sub_Question_Index].options.length">
                                        <!-- 选项 -->
                                        <el-row
                                            type="flex"
                                            justify="start"
                                            v-if="(Option_Row - 1) * 2 + Option_Col - 1 < Question.sub_questions[Big_Sub_Question_Index].options.length">
                                            <el-col :span="2" :offset="Option_Col == 1 ? 4 : 0">
                                                <el-row type="flex" justify="center" style="height: 40px; line-height: 40px; font-weight: bold">
                                                    <span>{{Get_Option_Label((Option_Row - 1) * 2 + Option_Col - 1)}}：</span>
                                                </el-row>
                                            </el-col>
                                            <el-col :span="14">
                                                <el-input
                                                    :placeholder="'请填写选项' + String.fromCharCode(65 + ((Option_Row - 1) * 2 + Option_Col - 1)) + '（必填）'"
                                                    @focus="Get_Focus('Mix_Options_' + Big_Sub_Question_Index + '_' + ((Option_Row - 1) * 2 + Option_Col - 1))"
                                                    :id="'Mix_Options_' + Big_Sub_Question_Index + '_' + ((Option_Row - 1) * 2 + Option_Col - 1)"
                                                    v-model="Question.sub_questions[Big_Sub_Question_Index].options[(Option_Row - 1) * 2 + Option_Col - 1]">

                                                </el-input>
                                            </el-col>
                                            <el-col :span="2">
                                                <el-row type="flex" justify="center">
                                                    <el-button
                                                        type="text"
                                                        @click="Option_Delete(Big_Sub_Question_Index, (Option_Row - 1) * 2 + Option_Col - 1)"
                                                        >
                                                        <i class="el-icon-close" style="font-size: 20px; margin-top: -4px"></i>
                                                    </el-button>
                                                </el-row>
                                            </el-col>
                                            <el-col :span="2">
                                                <el-row
                                                    type="flex"
                                                    justify="center"
                                                    v-if="(Option_Row - 1) * 2 + Option_Col - 1 == Question.sub_questions[Big_Sub_Question_Index].options.length - 1">
                                                    <el-button
                                                        type="text"
                                                        @click="Option_Add(Big_Sub_Question_Index)">
                                                        <i class="el-icon-plus" style="font-size: 20px; margin-top: -4px"></i>
                                                    </el-button>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <div v-if="(Option_Row - 1)  * 2 + Option_Col - 1 < Question.sub_questions[Big_Sub_Question_Index].options.length">
                                        <!-- 配图 -->
                                        <el-row
                                            type="flex"
                                            justify="start"
                                            style="margin-top: 10px"
                                            v-for="B_SQ_Pic_Row_Index in Math.ceil(Question.sub_questions[Big_Sub_Question_Index].options_image[(Option_Row - 1) * 2 + Option_Col - 1].length/4)"
                                            :key="'B_SQ_' + Big_Sub_Question_Index
                                                    + '_Option_' + ((Option_Row - 1) * 2 + Option_Col - 1)
                                                    + '_Pic_Row_' + B_SQ_Pic_Row_Index">
                                            <el-row style="width: 100%">
                                                <el-col :span="2" :offset="Option_Col == 1 ? 4 : 0">
                                                    <el-row type="flex" justify="end" style="color: transparent">
                                                        选项
                                                    </el-row>
                                                </el-col>
                                                <el-col :span="16">
                                                    <el-row
                                                        type="flex" justify="start">
                                                        <el-col
                                                            :span="5"
                                                            v-for="B_SQ_Pic_Col_Index in 4"
                                                            :key="'B_SQ_' + Big_Sub_Question_Index
                                                                + '_Option_' + ((Option_Row - 1) * 2 + Option_Col - 1)
                                                                + '_Pic_Row_' + B_SQ_Pic_Row_Index
                                                                + '_Col_' + B_SQ_Pic_Col_Index">
                                                            <el-row
                                                                type="flex"
                                                                justify="start"
                                                                v-if="(B_SQ_Pic_Row_Index - 1) * 4 + B_SQ_Pic_Col_Index - 1
                                                                    < Question.sub_questions[Big_Sub_Question_Index].options_image[(Option_Row - 1) * 2 + Option_Col - 1].length"
                                                                >
                                                                <el-popover
                                                                    :ref="'B_SQ_' + Big_Sub_Question_Index
                                                                        + '_Options_' + ((Option_Row - 1) * 2 + Option_Col - 1)
                                                                        + '_Pic_Row_' + B_SQ_Pic_Row_Index
                                                                        + '_Col_' + B_SQ_Pic_Col_Index
                                                                        + '_Pop'"
                                                                    placement="top"
                                                                    width="200"
                                                                    trigger="hover">
                                                                    <el-row type="flex" justify="center">
                                                                        <img width="160" :src="Get_Picture_Src('options_image ' + Big_Sub_Question_Index + ' ' + ((Option_Row - 1) * 2 + Option_Col - 1)
                                                                                                                , B_SQ_Pic_Row_Index
                                                                                                                , B_SQ_Pic_Col_Index)">
                                                                    </el-row>
                                                                    <el-row type="flex" justify="center">
                                                                        <el-button
                                                                            type="danger"
                                                                            size="small"
                                                                            @click="Del_Picture_Src('options_image ' + Big_Sub_Question_Index + ' ' + ((Option_Row - 1) * 2 + Option_Col - 1)
                                                                                                    , B_SQ_Pic_Row_Index
                                                                                                    , B_SQ_Pic_Col_Index)"
                                                                            style="margin-top: 10px">
                                                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                                                        </el-button>
                                                                    </el-row>
                                                                    <span slot="reference" class="imageLabel">
                                                                        配图{{(B_SQ_Pic_Row_Index - 1) * 4 + B_SQ_Pic_Col_Index}}
                                                                    </span>
                                                                </el-popover>
                                                            </el-row>
                                                        </el-col>
                                                    </el-row>
                                                </el-col>
                                            </el-row>
                                        </el-row>
                                    </div>
                                </el-col>
                            </el-row>
                            <!-- 简答，计算的小题和配图区域 -->
                            <!-- 每行一个 -->
                            <el-row
                                v-show="!Big_Sub_Question.expand"
                                type="flex" justify="start"
                                v-for="(Small_Sub_Question, Small_Sub_Question_Index) in Question.sub_questions[Big_Sub_Question_Index].sub_questions"
                                :key="'Big_Sub_Question_' + Big_Sub_Question_Index + '_Small_Sub_Questions_Row_' + Small_Sub_Question_Index"
                                style="margin-top: 10px;">
                                <el-col>
                                    <el-row type="flex" justify="start">
                                        <el-col :span="2">
                                            <el-row type="flex" justify="end" style="height: 65px; line-height: 65px; font-weight: bold">
                                                <span>（{{Small_Sub_Question_Index + 1}}）：</span>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="3" :offset="1">
                                            <el-row type="flex" justify="center" style="height: 65px; padding-top: 13px;">
                                                <el-input-number
                                                    v-model="Question.sub_questions[Big_Sub_Question_Index].sub_questions_score[Small_Sub_Question_Index]"
                                                    @change="Update_Total_Score()"
                                                    :min="1" :max="20" :step=".5">
                                                </el-input-number>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="1">
                                            <el-row type="flex" justify="center" style="height: 65px; line-height: 65px; font-weight: bold">
                                                <span>分</span>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="13">
                                            <el-input
                                                @focus="Get_Focus('Mix_SQ_' + Big_Sub_Question_Index + '_' + Small_Sub_Question_Index)"
                                                :id="'Mix_SQ_' + Big_Sub_Question_Index + '_' + Small_Sub_Question_Index"
                                                type="textarea"
                                                resize="none" :rows="3"
                                                placeholder="请填写此小题的对应题目内容（必填）"
                                                v-model="Question.sub_questions[Big_Sub_Question_Index].sub_questions[Small_Sub_Question_Index]"></el-input>
                                        </el-col>
                                        <el-col :span="1">
                                            <el-row
                                                type="flex"
                                                justify="center"
                                                v-if="Small_Sub_Question_Index != 0 || Question.sub_questions[Big_Sub_Question_Index].sub_questions.length > 1"
                                                style="height: 65px; line-height: 65px; font-weight: bold; padding-top: 12px">
                                                <el-button
                                                    type="text"
                                                    @click="Small_Sub_Questions_Delete(Big_Sub_Question_Index, Small_Sub_Question_Index)"
                                                    >
                                                    <i class="el-icon-close" style="font-size: 20px; margin-top: -4px"></i>
                                                </el-button>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="1">
                                            <el-row
                                                type="flex"
                                                justify="start"
                                                v-if="Small_Sub_Question_Index == Question.sub_questions[Big_Sub_Question_Index].sub_questions.length - 1"
                                                style="height: 65px; line-height: 65px; font-weight: bold; padding-top: 12px">
                                                <el-button
                                                    type="text"
                                                    @click="Small_Sub_Questions_Add(Big_Sub_Question_Index)">
                                                    <i class="el-icon-plus" style="font-size: 20px; margin-top: -4px"></i>
                                                </el-button>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                    <!-- 配图 -->
                                    <el-row
                                        v-if="Question.sub_questions[Big_Sub_Question_Index].sub_questions_image[Small_Sub_Question_Index].length > 0"
                                        style="margin-top: 10px;">
                                        <el-col :span="2">
                                            <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px">
                                                <span>配图：</span>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="17" :offset="1">
                                            <el-row
                                                type="flex"
                                                justify="start"
                                                v-for="B_SQ_S_SQ_Pic_Row_Index in Math.ceil(Question.sub_questions[Big_Sub_Question_Index].sub_questions_image[Small_Sub_Question_Index].length/12)"
                                                :key="'B_SQ_S_SQ_Pic_Row_' + B_SQ_S_SQ_Pic_Row_Index">
                                                <el-col
                                                    :span="2"
                                                    v-for="B_SQ_S_SQ_Pic_Col_Index in 12"
                                                    :key="'B_SQ_S_SQ_Pic_Row_' + B_SQ_S_SQ_Pic_Row_Index + 'Col_' + B_SQ_S_SQ_Pic_Col_Index">
                                                    <el-row
                                                        type="flex"
                                                        justify="start"
                                                        v-if="(B_SQ_S_SQ_Pic_Row_Index - 1) * 12 + B_SQ_S_SQ_Pic_Col_Index - 1 < Question.sub_questions[Big_Sub_Question_Index].sub_questions_image[Small_Sub_Question_Index].length"
                                                        >
                                                        <el-popover
                                                            :ref="'B_SQ_S_SQ_Pic_Row_' + B_SQ_S_SQ_Pic_Row_Index + 'Col_' + B_SQ_S_SQ_Pic_Col_Index + '_Pop'"
                                                            placement="top"
                                                            width="200"
                                                            trigger="hover">
                                                            <el-row type="flex" justify="center">
                                                                <img width="160" :src="Get_Picture_Src('sub_questions_image ' + Big_Sub_Question_Index + ' ' + Small_Sub_Question_Index , B_SQ_S_SQ_Pic_Row_Index, B_SQ_S_SQ_Pic_Col_Index)">
                                                            </el-row>
                                                            <el-row type="flex" justify="center">
                                                                <el-button
                                                                    type="danger"
                                                                    size="small"
                                                                    @click="Del_Picture_Src('sub_questions_image ' + Big_Sub_Question_Index + ' ' + Small_Sub_Question_Index, B_SQ_S_SQ_Pic_Row_Index, B_SQ_S_SQ_Pic_Col_Index)"
                                                                    style="margin-top: 10px">
                                                                    删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                                                </el-button>
                                                            </el-row>
                                                            <span slot="reference" class="imageLabel">
                                                                配图{{(B_SQ_S_SQ_Pic_Row_Index - 1) * 12 + B_SQ_S_SQ_Pic_Col_Index}}
                                                            </span>
                                                        </el-popover>
                                                    </el-row>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>

                            <!-- 答案区域 - 单选，多选，判断 -->
                            <el-row
                                v-show="!Big_Sub_Question.expand"
                                type="flex"
                                justify="start"
                                v-if="['单选题', '多选题', '判断题'].indexOf(Big_Sub_Question.type) != -1"
                                style="margin-top: 10px">
                                <el-col :span="2">
                                    <el-row type="flex" justify="end" style="height: 40px; line-height: 40px">
                                        <label>小题答案：</label>
                                    </el-row>
                                </el-col>
                                <el-col :span="21" v-if="['单选题', '判断题'].indexOf(Big_Sub_Question.type) != -1" :offset="1">
                                    <el-row type="flex" justify="start">
                                        <el-select v-model="Question.sub_questions[Big_Sub_Question_Index].answer" placeholder="请选择正确答案（可选）">
                                            <el-option
                                                v-for="Option_Index in Question.sub_questions[Big_Sub_Question_Index].options.length"
                                                :key="'B_SQ_' + Big_Sub_Question_Index + '_Answer_' + Option_Index"
                                                :label="Get_Option_Label(Option_Index - 1)"
                                                :value="Get_Option_Label(Option_Index - 1)"></el-option>
                                        </el-select>
                                    </el-row>
                                </el-col>
                                <el-col :span="21" v-if="['多选题'].indexOf(Big_Sub_Question.type) != -1" :offset="1">
                                    <el-row type="flex" justify="start" style="height: 40px; line-height: 40px">
                                        <el-checkbox-group
                                            @change="Multi_Option_Answer_Make(Big_Sub_Question_Index)"
                                            v-model="Question.sub_questions[Big_Sub_Question_Index].answer_list">
                                            <el-checkbox
                                                v-for="Option_Index in Question.sub_questions[Big_Sub_Question_Index].options.length"
                                                :key="'B_SQ_' + Big_Sub_Question_Index + '_Answer_' + Option_Index"
                                                :label="Get_Option_Label(Option_Index - 1)"
                                                :value="Get_Option_Label(Option_Index - 1)"></el-checkbox>
                                        </el-checkbox-group>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 答案区域 - 填空，简答，计算 -->
                            <el-row
                                v-show="!Big_Sub_Question.expand"
                                type="flex"
                                justify="start"
                                v-if="['填空题', '简答题', '计算题'].indexOf(Big_Sub_Question.type) != -1"
                                style="margin-top: 10px">
                                <el-col :span="2">
                                    <el-row type="flex" justify="end" style="height: 65px; line-height: 65px">
                                        <label>小题答案：</label>
                                    </el-row>
                                </el-col>
                                <el-col :span="17" :offset="1">
                                    <el-row type="flex" justify="start">
                                        <el-input
                                            @focus="Get_Focus('Mix_Answer_' + Big_Sub_Question_Index)"
                                            :id="'Mix_Answer_' + Big_Sub_Question_Index"
                                            type="textarea"
                                            resize="none" :rows="3"
                                            placeholder="请填写此小题的答案内容（可选）"
                                            v-model="Question.sub_questions[Big_Sub_Question_Index].answer"></el-input>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 答案配图 -->
                            <el-row v-show="Question.sub_questions[Big_Sub_Question_Index].answer_image.length > 0 && !Big_Sub_Question.expand" style="margin-top: 10px;">
                                <el-col :span="2">
                                    <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px">
                                        <span>答案配图：</span>
                                    </el-row>
                                </el-col>
                                <el-col :span="21" :offset="1">
                                    <el-row
                                        type="flex"
                                        justify="start"
                                        v-for="B_SQ_Answer_Pic_Row_Index in Math.ceil(Question.sub_questions[Big_Sub_Question_Index].answer_image.length/12)"
                                        :key="'B_SQ_Answer_Pic_Row_' + B_SQ_Answer_Pic_Row_Index">
                                        <el-col
                                            :span="2"
                                            v-for="B_SQ_Answer_Pic_Col_Index in 12"
                                            :key="'B_SQ_Answer_Pic_Row_' + B_SQ_Answer_Pic_Row_Index + 'Col_' + B_SQ_Answer_Pic_Col_Index">
                                            <el-row
                                                type="flex"
                                                justify="start"
                                                v-if="(B_SQ_Answer_Pic_Row_Index - 1) * 12 + B_SQ_Answer_Pic_Col_Index - 1 < Question.sub_questions[Big_Sub_Question_Index].answer_image.length"
                                                >
                                                <el-popover
                                                    :ref="'B_SQ_Answer_Pic_Row_' + B_SQ_Answer_Pic_Row_Index + 'Col_' + B_SQ_Answer_Pic_Col_Index + '_Pop'"
                                                    placement="top"
                                                    width="200"
                                                    trigger="hover">
                                                    <el-row type="flex" justify="center">
                                                        <img width="160" :src="Get_Picture_Src('answer_image ' + Big_Sub_Question_Index , B_SQ_Answer_Pic_Row_Index, B_SQ_Answer_Pic_Col_Index)">
                                                    </el-row>
                                                    <el-row type="flex" justify="center">
                                                        <el-button
                                                            type="danger"
                                                            size="small"
                                                            @click="Del_Picture_Src('answer_image ' + Big_Sub_Question_Index, B_SQ_Answer_Pic_Row_Index, B_SQ_Answer_Pic_Col_Index)"
                                                            style="margin-top: 10px">
                                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                                        </el-button>
                                                    </el-row>
                                                    <span slot="reference" class="imageLabel">
                                                        配图{{(B_SQ_Answer_Pic_Row_Index - 1) * 12 + B_SQ_Answer_Pic_Col_Index}}
                                                    </span>
                                                </el-popover>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 解析区域 -->
                            <el-row
                                v-show="!Big_Sub_Question.expand"
                                type="flex"
                                justify="start"
                                style="margin-top: 10px">
                                <el-col :span="2">
                                    <el-row type="flex" justify="end" style="height: 65px; line-height: 65px">
                                        <label>小题解析：</label>
                                    </el-row>
                                </el-col>
                                <el-col :span="17" :offset="1">
                                    <el-row type="flex" justify="start">
                                        <el-input
                                            @focus="Get_Focus('Mix_Analysis_' + Big_Sub_Question_Index)"
                                            :id="'Mix_Analysis_' + Big_Sub_Question_Index"
                                            type="textarea"
                                            resize="none" :rows="3"
                                            placeholder="请填写此小题的解析内容（可选）"
                                            v-model="Question.sub_questions[Big_Sub_Question_Index].analysis"></el-input>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 解析配图 -->
                            <el-row v-show="Question.sub_questions[Big_Sub_Question_Index].analysis_image.length > 0 && !Big_Sub_Question.expand" style="margin-top: 10px;">
                                <el-col :span="2">
                                    <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px">
                                        <span>解析配图：</span>
                                    </el-row>
                                </el-col>
                                <el-col :span="21" :offset="1">
                                    <el-row
                                        type="flex"
                                        justify="start"
                                        v-for="B_SQ_Analysis_Pic_Row_Index in Math.ceil(Question.sub_questions[Big_Sub_Question_Index].analysis_image.length/12)"
                                        :key="'B_SQ_Analysis_Pic_Row_' + B_SQ_Analysis_Pic_Row_Index">
                                        <el-col
                                            :span="2"
                                            v-for="B_SQ_Analysis_Pic_Col_Index in 12"
                                            :key="'B_SQ_Analysis_Pic_Row_' + B_SQ_Analysis_Pic_Row_Index + 'Col_' + B_SQ_Analysis_Pic_Col_Index">
                                            <el-row
                                                type="flex"
                                                justify="start"
                                                v-if="(B_SQ_Analysis_Pic_Row_Index - 1) * 12 + B_SQ_Analysis_Pic_Col_Index - 1 < Question.sub_questions[Big_Sub_Question_Index].analysis_image.length"
                                                >
                                                <el-popover
                                                    :ref="'B_SQ_Analysis_Pic_Row_' + B_SQ_Analysis_Pic_Row_Index + 'Col_' + B_SQ_Analysis_Pic_Col_Index + '_Pop'"
                                                    placement="top"
                                                    width="200"
                                                    trigger="hover">
                                                    <el-row type="flex" justify="center">
                                                        <img width="160" :src="Get_Picture_Src('analysis_image ' + Big_Sub_Question_Index , B_SQ_Analysis_Pic_Row_Index, B_SQ_Analysis_Pic_Col_Index)">
                                                    </el-row>
                                                    <el-row type="flex" justify="center">
                                                        <el-button
                                                            type="danger"
                                                            size="small"
                                                            @click="Del_Picture_Src('analysis_image ' + Big_Sub_Question_Index, B_SQ_Analysis_Pic_Row_Index, B_SQ_Analysis_Pic_Col_Index)"
                                                            style="margin-top: 10px">
                                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                                        </el-button>
                                                    </el-row>
                                                    <span slot="reference" class="imageLabel">
                                                        配图{{(B_SQ_Analysis_Pic_Row_Index - 1) * 12 + B_SQ_Analysis_Pic_Col_Index}}
                                                    </span>
                                                </el-popover>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 第四行，答案 -->
            <el-row type="flex" justify="start" style="margin-top: 10px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                        <span>答案：</span>
                    </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input
                            @focus="Get_Focus('Mix_Answer')"
                            id="Mix_Answer"
                            type="textarea"
                            v-model="Question.answer"
                            resize="none" :rows="6"
                            placeholder="请填写答案内容（可选）"></el-input>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 答案配图 -->
            <el-row v-show="Question.answer_image.length > 0" style="margin-top: 10px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px">
                        <span>答案配图：</span>
                    </el-row>
                </el-col>
                <el-col :span="21" :offset="1">
                    <el-row
                        type="flex"
                        justify="start"
                        v-for="Answer_Pic_Row_Index in Math.ceil(Question.answer_image.length/12)"
                        :key="'Answer_Pic_Row_' + Answer_Pic_Row_Index">
                        <el-col
                            :span="2"
                            v-for="Answer_Pic_Col_Index in 12"
                            :key="'Answer_Pic_Row_' + Answer_Pic_Row_Index + 'Col_' + Answer_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="start"
                                v-if="(Answer_Pic_Row_Index - 1) * 12 + Answer_Pic_Col_Index - 1 < Question.answer_image.length"
                                >
                                <el-popover
                                    :ref="'Answer_Pic_Row_' + Answer_Pic_Row_Index + 'Col_' + Answer_Pic_Col_Index + '_Pop'"
                                    placement="top"
                                    width="200"
                                    trigger="hover">
                                    <el-row type="flex" justify="center">
                                        <img width="160" :src="Get_Picture_Src('answer_image', Answer_Pic_Row_Index, Answer_Pic_Col_Index)">
                                    </el-row>
                                    <el-row type="flex" justify="center">
                                        <el-button
                                            type="danger"
                                            size="small"
                                            @click="Del_Picture_Src('answer_image', Answer_Pic_Row_Index, Answer_Pic_Col_Index)"
                                            style="margin-top: 10px">
                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                        </el-button>
                                    </el-row>
                                    <span slot="reference" class="imageLabel">
                                        配图{{(Answer_Pic_Row_Index - 1) * 12 + Answer_Pic_Col_Index}}
                                    </span>
                                </el-popover>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 第五行，解析 -->
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                        <span>解析：</span>
                    </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input
                            @focus="Get_Focus('Mix_Analysis')"
                            id="Mix_Analysis"
                            type="textarea"
                            v-model="Question.analysis"
                            resize="none" :rows="6"
                            placeholder="请填写解析内容（可选）"></el-input>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 解析配图 -->
            <el-row v-show="Question.analysis_image.length > 0">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px">
                        <span>解析配图：</span>
                    </el-row>
                </el-col>
                <el-col :span="21" :offset="1">
                    <el-row
                        type="flex"
                        justify="start"
                        v-for="Analysis_Pic_Row_Index in Math.ceil(Question.analysis_image.length/12)"
                        :key="'Analysis_Pic_Row_' + Analysis_Pic_Row_Index">
                        <el-col
                            :span="2"
                            v-for="Analysis_Pic_Col_Index in 12"
                            :key="'Analysis_Pic_Row_' + Analysis_Pic_Row_Index + 'Col_' + Analysis_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="start"
                                v-if="(Analysis_Pic_Row_Index - 1) * 12 + Analysis_Pic_Col_Index - 1 < Question.analysis_image.length"
                                >
                                <el-popover
                                    :ref="'Analysis_Pic_Row_' + Analysis_Pic_Row_Index + 'Col_' + Analysis_Pic_Col_Index + '_Pop'"
                                    placement="top"
                                    width="200"
                                    trigger="hover">
                                    <el-row type="flex" justify="center">
                                        <img width="160" :src="Get_Picture_Src('analysis_image', Analysis_Pic_Row_Index, Analysis_Pic_Col_Index)">
                                    </el-row>
                                    <el-row type="flex" justify="center">
                                        <el-button
                                            type="danger"
                                            size="small"
                                            @click="Del_Picture_Src('analysis_image', Analysis_Pic_Row_Index, Analysis_Pic_Col_Index)"
                                            style="margin-top: 10px">
                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                        </el-button>
                                    </el-row>
                                    <span slot="reference" class="imageLabel" style="margin-bottom: 0px">
                                        配图{{(Analysis_Pic_Row_Index - 1) * 12 + Analysis_Pic_Col_Index}}
                                    </span>
                                </el-popover>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <el-row type="flex" justify="start" style="margin-top: 10px; margin-bottom: 20px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                        <span>文字粘贴识别：</span>
                    </el-row>
                </el-col>
                <el-col :span="18" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input
                            @focus="Get_Focus('Opt_Paste')"
                            type="textarea"
                            v-model="Paste_Analysis"
                            resize="none" :rows="6"></el-input>
                    </el-row>
                </el-col>
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="padding-top: 50px; ">
                        <el-button type="primary" @click="Text_Split_Do()">开始识别</el-button>
                    </el-row>
                </el-col>
            </el-row>

        </div>

        <!-- 以下部分是预览那一块的部分 -->
        <div v-show="Focus_Function == 'PreView'" style="margin-left: 5vw; margin-right: 5vw; padding-top: 30px; padding-bottom: 30px">
            <!-- 题干部分 -->
            <el-row type="flex" justify="start" style="margin-bottom: 10px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold;">
                        <span>题干：</span>
                    </el-row>
                </el-col>
                <el-col :span="22">
                    <el-row type="flex" justify="start">
                        <Mathdown :content="Question.stem" :name="'Mix_Stem'"></Mathdown>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 题干的配图部分 -->
            <el-row type="flex" justify="end" style="margin-bottom: 10px" v-show="Question.stem_image.length > 0">
                <el-col :span="22">
                    <el-row
                        type="flex"
                        justify="start"
                        v-for="Stem_Pic_Row_Index in Math.ceil(Question.stem_image.length/12)"
                        :key="'Pre_Mix_Stem_' + Stem_Pic_Row_Index"
                        style="margin-bottom: 10px">
                        <el-col
                            :span="2"
                            v-for="Stem_Pic_Col_Index in 12"
                            :key="'Pre_Mix_Stem_' + Stem_Pic_Row_Index + '_' + Stem_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="center"
                                v-if="(Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1 < Question.stem_image.length"
                                >
                                <img height="60" :src="Get_Picture_Src('stem_image', Stem_Pic_Row_Index, Stem_Pic_Col_Index)">
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <!-- 小题部分 -->
            <el-row
                type="flex"
                justify="end"
                v-for="(Big_Sub_Question, Big_Sub_Question_Index) in Question.sub_questions"
                :key="'Pre_Mix_B_SQ_' + Big_Sub_Question_Index"
                style="margin-bottom: 20px">
                <!-- 退一格 -->
                <el-col :span="22">
                    <!-- 题干 -->
                    <el-row
                        type="flex"
                        justify="start"
                        :style="
                            ['单选题', '多选题', '判断题', '简答题', '计算题'].indexOf(Question.sub_questions[Big_Sub_Question_Index].type) != -1
                            ? 'margin-bottom: 10px'
                            : ''">
                        <el-col :span="2">
                            <el-row type="flex" justify="start" style="font-weight: bold;">
                                <span>（{{Big_Sub_Question_Index+1}}）题目</span>
                            </el-row>
                        </el-col>
                        <el-col :span="22">
                            <el-row type="flex" justify="start">
                                <Mathdown :content="Big_Sub_Question.stem" :name="'Pre_Mix_B_SQ_' + Big_Sub_Question_Index + '_Stem'"></Mathdown>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 题干配图 -->
                    <el-row
                        type="flex"
                        justify="start"
                        style="margin-top: 5px; margin-bottom: 5px"
                        v-show="Question.sub_questions[Big_Sub_Question_Index].stem_image.length > 0">
                        <el-col :span="2">
                            <el-row type="flex" justify="start" style="font-weight: bold;">
                                <span>（{{Big_Sub_Question_Index+1}}）题目配图</span>
                            </el-row>
                        </el-col>
                        <el-col :span="22">
                            <el-row
                                type="flex"
                                justify="start"
                                style="margin-top: 5px; margin-bottom: 5px"
                                v-for="Pre_Mix_Stem_Pic_Row_Index in Math.ceil(Question.sub_questions[Big_Sub_Question_Index].stem_image.length/12)"
                                :key="'Pre_Mix_Stem_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Stem_Pic_Row_Index">
                                <el-col
                                    :span="2"
                                    v-for="Pre_Mix_Stem_Pic_Col_Index in 12"
                                    :key="'Pre_Mix_Stem_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Stem_Pic_Row_Index + 'Col_' + Pre_Mix_Stem_Pic_Col_Index">
                                    <el-row
                                        type="flex"
                                        justify="center"
                                        v-if="(Pre_Mix_Stem_Pic_Row_Index - 1) * 12 + Pre_Mix_Stem_Pic_Col_Index - 1 < Question.sub_questions[Big_Sub_Question_Index].stem_image.length"
                                        >
                                        <img height="60" :src="Get_Picture_Src('stem_image ' + Big_Sub_Question_Index , Pre_Mix_Stem_Pic_Row_Index, Pre_Mix_Stem_Pic_Col_Index)">
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 选择题的选项部分 -->
                    <el-row
                        type="flex"
                        justify="start"
                        style="margin-top: 5px; margin-bottom: 5px"
                        v-show="['单选题', '多选题', '判断题'].indexOf(Question.sub_questions[Big_Sub_Question_Index].type) != -1"
                        v-for="(Pre_Option, Pre_Option_Index) in Question.sub_questions[Big_Sub_Question_Index].options"
                        :key="'Pre_Mix_' + Big_Sub_Question_Index + '_Option_' + Pre_Option_Index">
                        <el-col>
                            <!-- 选项的部分 -->
                            <el-row type="flex" justify="start">
                                <el-col :span="2">
                                    <el-row type="flex" justify="center">
                                        <label>{{Get_Option_Label(Pre_Option_Index)}}:</label>
                                    </el-row>
                                </el-col>
                                <el-col :span="22">
                                    <el-row type="flex" justify="start">
                                        <Mathdown :content="Pre_Option" :name="'Pre_Mix_B_SQ_' + Big_Sub_Question_Index + '_Options_' + Pre_Option_Index"></Mathdown>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 选项配图的部分 -->
                            <el-row type="flex" justify="end" v-show="Big_Sub_Question.options_image[Pre_Option_Index].length > 0">
                                <el-col :span="22">
                                    <el-row
                                        type="flex"
                                        justify="start"
                                        style="margin-top: 5px; margin-bottom: 5px"
                                        v-for="Pre_Mix_Opt_Pic_Row_Index in Math.ceil(Big_Sub_Question.options_image[Pre_Option_Index].length/12)"
                                        :key="'Pre_Mix_B_SQ_' + Big_Sub_Question_Index  + '_Options_' + Pre_Option_Index + '_Pic_Row_' + Pre_Mix_Opt_Pic_Row_Index">
                                        <el-col
                                            :span="2"
                                            v-for="Pre_Mix_Opt_Pic_Col_Index in 12"
                                            :key="'Pre_Mix_B_SQ_' + Big_Sub_Question_Index  + '_Options_' + Pre_Option_Index + '_Pic_Row_' + Pre_Mix_Opt_Pic_Row_Index + 'Col_' + Pre_Mix_Opt_Pic_Col_Index">
                                            <el-row
                                                type="flex"
                                                justify="center"
                                                v-if="(Pre_Mix_Opt_Pic_Row_Index - 1) * 12 + Pre_Mix_Opt_Pic_Col_Index - 1 < Big_Sub_Question.options_image[Pre_Option_Index].length"
                                                >
                                                <img height="60" :src="Get_Picture_Src('options_image ' + Big_Sub_Question_Index + ' ' + Pre_Option_Index , Pre_Mix_Opt_Pic_Row_Index, Pre_Mix_Opt_Pic_Col_Index)">
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 简答题，计算题的部分 - 小题 -->
                    <el-row
                        type="flex"
                        justify="start"
                        style="margin-top: 5px; margin-bottom: 5px"
                        v-show="['简答题', '计算题'].indexOf(Question.sub_questions[Big_Sub_Question_Index].type) != -1"
                        v-for="(Pre_Small_Sub_Question, Pre_Small_Sub_Question_Index) in Question.sub_questions[Big_Sub_Question_Index].sub_questions"
                        :key="'Pre_Mix_B_SQ_' + Big_Sub_Question_Index + '_S_SQ_' + Pre_Small_Sub_Question_Index">
                        <el-col>
                            <!-- 选项的部分 -->
                            <el-row type="flex" justify="start">
                                <el-col :span="2">
                                    <el-row type="flex" justify="center">
                                        <label>({{Pre_Small_Sub_Question_Index + 1}}):</label>
                                    </el-row>
                                </el-col>
                                <el-col :span="22">
                                    <el-row type="flex" justify="start">
                                        <Mathdown :content="Pre_Small_Sub_Question" :name="'Pre_Mix_B_SQ_' + Big_Sub_Question_Index + '_S_SQ_' + Pre_Small_Sub_Question_Index"></Mathdown>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 选项配图的部分 -->
                            <el-row type="flex" justify="end" v-show="Big_Sub_Question.sub_questions_image[Pre_Small_Sub_Question_Index].length > 0">
                                <el-col :span="22">
                                    <el-row
                                        type="flex"
                                        justify="start"
                                        v-for="Pre_Mix_S_SQ_Pic_Row_Index in Math.ceil(Big_Sub_Question.sub_questions_image[Pre_Small_Sub_Question_Index].length/12)"
                                        :key="'Pre_Mix_B_SQ_' + Big_Sub_Question_Index  + '_S_SQ_' + Pre_Small_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_S_SQ_Pic_Row_Index">
                                        <el-col
                                            :span="2"
                                            v-for="Pre_Mix_S_SQ_Pic_Col_Index in 12"
                                            :key="'Pre_Mix_B_SQ_' + Big_Sub_Question_Index  + '_S_SQ_' + Pre_Small_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_S_SQ_Pic_Row_Index + 'Col_' + Pre_Mix_S_SQ_Pic_Col_Index">
                                            <el-row
                                                type="flex"
                                                justify="center"
                                                v-if="(Pre_Mix_S_SQ_Pic_Row_Index - 1) * 12 + Pre_Mix_S_SQ_Pic_Col_Index - 1 < Big_Sub_Question.sub_questions_image[Pre_Small_Sub_Question_Index].length"
                                                >
                                                <img height="60" :src="Get_Picture_Src('sub_questions_image ' + Big_Sub_Question_Index + ' ' + Pre_Small_Sub_Question_Index , Pre_Mix_S_SQ_Pic_Row_Index, Pre_Mix_S_SQ_Pic_Col_Index)">
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 答案 -->
                    <el-row
                        type="flex"
                        justify="start"
                        style="margin-top: 5px; margin-bottom: 5px"
                        v-show="Question.sub_questions[Big_Sub_Question_Index].answer.length > 0">
                        <el-col :span="2">
                            <el-row type="flex" justify="start" style="font-weight: bold;">
                                <span>（{{Big_Sub_Question_Index+1}}）答案</span>
                            </el-row>
                        </el-col>
                        <el-col :span="22">
                            <el-row type="flex" justify="start">
                                <Mathdown :content="Big_Sub_Question.answer" :name="'Pre_Mix_B_SQ_' + Big_Sub_Question_Index + '_Answer'"></Mathdown>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 答案配图 -->
                    <el-row
                        type="flex"
                        justify="start"
                        style="margin-top: 5px; margin-bottom: 5px"
                        v-show="Question.sub_questions[Big_Sub_Question_Index].answer_image.length > 0">
                        <el-col :span="2">
                            <el-row type="flex" justify="start" style="font-weight: bold;">
                                <span>（{{Big_Sub_Question_Index+1}}）答案配图</span>
                            </el-row>
                        </el-col>
                        <el-col :span="22">
                            <el-row
                                type="flex"
                                justify="start"
                                v-for="Pre_Mix_Answer_Pic_Row_Index in Math.ceil(Question.sub_questions[Big_Sub_Question_Index].answer_image.length/12)"
                                :key="'Pre_Mix_Answer_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Answer_Pic_Row_Index">
                                <el-col
                                    :span="2"
                                    v-for="Pre_Mix_Answer_Pic_Col_Index in 12"
                                    :key="'Pre_Mix_Answer_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Answer_Pic_Row_Index + 'Col_' + Pre_Mix_Answer_Pic_Col_Index">
                                    <el-row
                                        type="flex"
                                        justify="center"
                                        v-if="(Pre_Mix_Answer_Pic_Row_Index - 1) * 12 + Pre_Mix_Answer_Pic_Col_Index - 1 < Question.sub_questions[Big_Sub_Question_Index].answer_image.length"
                                        >
                                        <img height="60" :src="Get_Picture_Src('answer_image ' + Big_Sub_Question_Index , Pre_Mix_Answer_Pic_Row_Index, Pre_Mix_Answer_Pic_Col_Index)">
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 解析 -->
                    <el-row
                        type="flex"
                        justify="start"
                        style="margin-top: 5px; margin-bottom: 5px"
                        v-show="Question.sub_questions[Big_Sub_Question_Index].analysis.length > 0">
                        <el-col :span="2">
                            <el-row type="flex" justify="start" style="font-weight: bold;">
                                <span>（{{Big_Sub_Question_Index+1}}）解析</span>
                            </el-row>
                        </el-col>
                        <el-col :span="22">
                            <el-row type="flex" justify="start">
                                <Mathdown :content="Big_Sub_Question.analysis" :name="'Pre_Mix_B_SQ_' + Big_Sub_Question_Index + '_Analysis'"></Mathdown>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 解析配图 -->
                    <el-row
                        type="flex"
                        justify="start"
                        style="margin-top: 5px; margin-bottom: 5px"
                        v-show="Question.sub_questions[Big_Sub_Question_Index].analysis_image.length > 0">
                        <el-col :span="2">
                            <el-row type="flex" justify="start" style="font-weight: bold;">
                                <span>（{{Big_Sub_Question_Index+1}}）解析配图</span>
                            </el-row>
                        </el-col>
                        <el-col :span="22">
                            <el-row
                                type="flex"
                                justify="start"
                                v-for="Pre_Mix_Analysis_Pic_Row_Index in Math.ceil(Question.sub_questions[Big_Sub_Question_Index].analysis_image.length/12)"
                                :key="'Pre_Mix_Analysis_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Analysis_Pic_Row_Index">
                                <el-col
                                    :span="2"
                                    v-for="Pre_Mix_Analysis_Pic_Col_Index in 12"
                                    :key="'Pre_Mix_Analysis_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Analysis_Pic_Row_Index + 'Col_' + Pre_Mix_Analysis_Pic_Col_Index">
                                    <el-row
                                        type="flex"
                                        justify="center"
                                        v-if="(Pre_Mix_Analysis_Pic_Row_Index - 1) * 12 + Pre_Mix_Analysis_Pic_Col_Index - 1 < Question.sub_questions[Big_Sub_Question_Index].analysis_image.length"
                                        >
                                        <img height="60" :src="Get_Picture_Src('analysis_image ' + Big_Sub_Question_Index , Pre_Mix_Analysis_Pic_Row_Index, Pre_Mix_Analysis_Pic_Col_Index)">
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>


            <!-- 答案部分 -->
            <el-row
                type="flex"
                justify="start"
                style="margin-top: 10px; margin-bottom: 10px"
                v-show="Question.answer_image.length > 0 || Question.answer.length > 0">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold;">
                        <span>答案：</span>
                    </el-row>
                </el-col>
                <el-col :span="22">
                    <el-row type="flex" justify="start">
                        <Mathdown :content="Question.answer" :name="'Pre_Mix_Answer'"></Mathdown>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 答案配图 -->
            <el-row
                type="flex"
                justify="end"
                style="margin-top: 10px; margin-bottom: 10px"
                v-show="Question.answer_image.length > 0">
                <el-col :span="22">
                    <el-row
                        type="flex"
                        justify="start"
                        v-for="Answer_Pic_Row_Index in Math.ceil(Question.answer_image.length/12)"
                        :key="'Pre_Mix_Answer' + Answer_Pic_Row_Index"
                        style="margin-bottom: 10px;">
                        <el-col
                            :span="2"
                            v-for="Answer_Pic_Col_Index in 12"
                            :key="'Pre_Mix_Answer' + Answer_Pic_Row_Index + '_' + Answer_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="center"
                                v-if="(Answer_Pic_Row_Index - 1) * 12 + Answer_Pic_Col_Index - 1 < Question.answer_image.length"
                                >
                                <img height="60" :src="Get_Picture_Src('answer_image', Answer_Pic_Row_Index, Answer_Pic_Col_Index)">
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <!-- 解析部分 -->
            <el-row
                type="flex"
                justify="start"
                style="margin-top: 10px; margin-bottom: 10px"
                v-show="Question.analysis_image.length > 0 || Question.analysis.length > 0">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold;">
                        <span>解析：</span>
                    </el-row>
                </el-col>
                <el-col :span="22">
                    <el-row type="flex" justify="start">
                        <Mathdown :content="Question.analysis" :name="'Pre_Mix_Analysis_'"></Mathdown>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 解析部分配图 -->
            <el-row
                type="flex"
                justify="end"
                style="margin-top: 10px; margin-bottom: 10px"
                v-show="Question.analysis_image.length > 0">
                <el-col :span="22">
                    <el-row
                        type="flex"
                        justify="start"
                        v-for="Analysis_Pic_Row_Index in Math.ceil(Question.analysis_image.length/12)"
                        :key="'Pre_Mix_Analysis_' + Analysis_Pic_Row_Index">
                        <el-col
                            :span="2"
                            v-for="Analysis_Pic_Col_Index in 12"
                            :key="'Pre_Mix_Analysis_' + Analysis_Pic_Row_Index + '_' + Analysis_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="center"
                                v-if="(Analysis_Pic_Row_Index - 1) * 12 + Analysis_Pic_Col_Index - 1 < Question.analysis_image.length"
                                >
                                <img height="60" :src="Get_Picture_Src('analysis_image', Analysis_Pic_Row_Index, Analysis_Pic_Col_Index)">
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center" style="margin-top: 20px;">
                <el-button type="success" @click="Emit_And_Submit()">确定提交</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>

import ComplexInput from '@/common/components/ComplexInput'
import Mathdown from '@/common/components/Mathdown'

import {commonAjax} from '@/common/utils/ajax'

export default {
    components: { ComplexInput, Mathdown },
    name: "OptionQuestions",
    props: {
        detailType: {
            type: String,
            default: "综合题"
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
                answer: "",
                answer_image: [],
                analysis: "",
                analysis_image: [],
                // 处理上的重大区别，就是综合题没有选项，只有小题，然后小题内本身允许
                // 单选，多选，判断，填空，简答，计算这些题型
                sub_questions: [
                    {
                        type: "单选题",
                        score: 5,
                        stem: "",
                        stem_image: [],
                        options: ["", "", "", ""],
                        options_image: [[], [], [], []],
                        answer: "",
                        answer_image: [],
                        analysis: "",
                        analysis_image: [],
                        // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
                        sub_questions: [],
                        sub_questions_image: [],
                        sub_questions_score: [],
                        // 给多选题类型拿来控制答案的，一般用不到
                        answer_list: [],
                        // 是否折叠
                        expand: false
                    }
                ],
            },
            // 用于保存图片的Input对象，拿来做自定义按钮的
            Picture_Upload_Dom: "",
            // 用于保存当前选中的框识别信息 - 给图片和文本编辑定位用的
            Focusing_Input: "",
            // 用于保存当前选中的框 - 通过ID确定是哪个框，来确定起始和终止位置
            Focusing_Dom: "",
            // 标记文档的起始和终止位置
            Text_Start: 0,
            Text_End: 0,
            // 选择观察期
            Select_Watcher: "",
            // 读取图片时用于等待
            Picture_Loading: false,
            // 用于给公式编辑器折腾内容
            Complex_Content: "",
            // 公式编辑器是否显示
            Complex_Input_Dialog: false,
            // 用于小题分数统一的选项
            Unit_Score: 5,
            // 用于粘贴识别
            Paste_Analysis: ""
        }
    },
    watch: {
        detailType(newVal, oldVal){
            if(newVal != oldVal){
                this.Reset_Question_Info();
            }
        },
    },
    mounted() {
        this.Init_Picture_Upload_Dom();
        this.Init_Select_Watcher();
        this.Checking_Editing();
    },
    methods: {
        Checking_Editing(){
            if(sessionStorage.getItem("PaperEditing")){
                this.Question = JSON.parse(sessionStorage.getItem("PaperEditing"))
            }else{
                this.Reset_Question_Info();
            }
        },
        // 切换折叠模式
        Expand_Change(Big_Sub_Question_Index){
            this.Question.sub_questions[Big_Sub_Question_Index].expand =
                !this.Question.sub_questions[Big_Sub_Question_Index].expand
        },
        // 分数统计
        Update_Total_Score(){
            let Score = 0;
            for(let i = 0; i < this.Question.sub_questions.length; i++){
                let Item = this.Question.sub_questions[i];
                if(Item.sub_questions_score.length == 0){
                    Score = Score + parseInt(Item.score)
                }else{
                    let S_Score = 0;
                    for(let j = 0; j < Item.sub_questions_score.length; j++){
                        Score = Score + parseInt(Item.sub_questions_score[j])
                        S_Score = S_Score + parseInt(Item.sub_questions_score[j])
                    }
                    this.Question.sub_questions[i].score = S_Score
                }
            }
            this.Question.score = Score
        },
        // 当小题的题型改变时
        Big_Sub_Question_Type_Change(Big_Sub_Question_Index){

            let Item = JSON.parse(JSON.stringify(this.Question.sub_questions[Big_Sub_Question_Index]))

            Item.stem = ""
            Item.stem_image = []

            Item.answer = ""
            Item.answer_image = []

            Item.analysis = ""
            Item.analysis_image = []

            Item.answer_list = []

            if(['单选题', '多选题'].indexOf(Item.type) != -1){
                Item.score = 5
                Item.options = ["", "", "", ""]
                Item.options_image = [[], [], [], []]
                Item.sub_questions = []
                Item.sub_questions_image = []
                Item.sub_questions_score = []
            }else if(Item.type == '判断题'){
                Item.score = 5
                Item.options = ["正确", "错误"]
                Item.options_image = [[], []]
                Item.sub_questions = []
                Item.sub_questions_image = []
                Item.sub_questions_score = []
            }else if(Item.type == '填空题'){
                Item.score = 5
                Item.options = []
                Item.options_image = []
                Item.sub_questions = []
                Item.sub_questions_image = []
                Item.sub_questions_score = []
            }else if(['简答题', '计算题'].indexOf(Item.type) != -1){
                Item.score = 5
                Item.options = []
                Item.options_image = []
                Item.sub_questions = [""]
                Item.sub_questions_image = [[]]
                Item.sub_questions_score = [5]
            }

            Item.expand = false

            this.Question.sub_questions.splice(Big_Sub_Question_Index, 1, Item)

            this.Update_Total_Score()

        },
        // 调整多选题的答案结果
        Multi_Option_Answer_Make(Big_Sub_Question_Index){
            let Sorted_Answer_List = JSON.parse(JSON.stringify(this.Question.sub_questions[Big_Sub_Question_Index].answer_list)).sort()
            this.Question.sub_questions[Big_Sub_Question_Index].answer = Sorted_Answer_List.join("")
        },
        // 小题分数统一
        Unit_Sub_Questions_Score(){
            this.$confirm('点击后将开始统一此题的单选、多选、判断、填空小题的分数至 ' + this.Unit_Score + ' 分，确认要开始分数统一吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                for(let i = 0; i < this.Question.sub_questions.length; i++){
                    if(this.Question.sub_questions[i].sub_questions.length == 0){
                        this.Question.sub_questions[i].score = this.Unit_Score
                    }
                }
                this.Update_Total_Score();
            }).catch(()=>{
                this.$message.info("已取消")
            })
        },
        // 发射题目信息并入库
        Emit_And_Submit(){
            this.$emit('Emit_And_Submit', JSON.stringify(this.Question));
        },
        // 将公式编辑器编辑完的内容弄回来
        Update_Complex_Input(val){
            this.Complex_Input_Dialog = false;
            let Aim = this.Focusing_Input.split(" ")
            if(Aim.length == 1){
                this.Question[Aim[0]] = val;
            }else if(Aim.length == 2){
                this.Question.sub_questions[Aim[1]][Aim[0]] = val
            }else if(Aim.length == 3){
                this.Question.sub_questions[Aim[1]][Aim[0]].splice(Aim[2], 1, val)
            }
        },
        // 插入括号
        Insert_Quote(){
            let Aim = this.Focusing_Input.split(" ")
            if(Aim.length == 1){
                if(this.Text_Start == this.Text_End){
                    this.Question[Aim[0]] =
                        this.Question[Aim[0]].substring(0, this.Text_Start)
                        + "(        )"
                        + this.Question[Aim[0]].substring(this.Text_Start, this.Question[Aim[0]].length)
                }else{
                    this.Question[Aim[0]] =
                        this.Question[Aim[0]].substring(0, this.Text_Start)
                        + "("
                        + this.Question[Aim[0]].substring(this.Text_Start, this.Text_End)
                        + ")"
                        + this.Question[Aim[0]].substring(this.Text_End, this.Question[Aim[0]].length)
                }
            }else if(Aim.length == 2){
                if(this.Text_Start == this.Text_End){
                    this.Question.sub_questions[Aim[1]][Aim[0]] =
                        this.Question.sub_questions[Aim[1]][Aim[0]].substring(0, this.Text_Start)
                        + "(        )"
                        + this.Question.sub_questions[Aim[1]][Aim[0]].substring(this.Text_Start, this.Question.sub_questions[Aim[1]][Aim[0]].length)
                }else{
                    this.Question.sub_questions[Aim[1]][Aim[0]] =
                        this.Question.sub_questions[Aim[1]][Aim[0]].substring(0, this.Text_Start)
                        + "("
                        + this.Question.sub_questions[Aim[1]][Aim[0]].substring(this.Text_Start, this.Text_End)
                        + ")"
                        + this.Question.sub_questions[Aim[1]][Aim[0]].substring(this.Text_End, this.Question.sub_questions[Aim[1]][Aim[0]].length)
                }
            }else if(Aim.length == 3){
                // 只有大小题下的小题或选项才会涉及到三层
                // Aim[0]: options/sub_questions
                // Aim[1]: Big_Sub_Questions_Index
                // Aim[2]: Small_Sub_Questions_Index
                let Text = JSON.parse(JSON.stringify(this.Question.sub_questions[Aim[1]][Aim[0]][Aim[2]]))
                if(this.Text_Start == this.Text_End){
                    Text =
                        Text.substring(0, this.Text_Start)
                        + "(        )"
                        + Text.substring(this.Text_Start, this.Question.sub_questions[Aim[1]][Aim[0]].length)
                }else{
                    Text =
                        Text.substring(0, this.Text_Start)
                        + "("
                        + Text.substring(this.Text_Start, this.Text_End)
                        + ")"
                        + Text.substring(this.Text_End, Text.length)
                }
                this.Question.sub_questions[Aim[1]][Aim[0]].splice(Aim[2], 1, Text)
            }
        },
        // 插入占位符
        Insert_Fill(){
            let Aim = this.Focusing_Input.split(" ")
            if(Aim.length == 1){
                if(this.Text_Start == this.Text_End){
                    this.Question[Aim[0]] =
                        this.Question[Aim[0]].substring(0, this.Text_Start)
                        + "________"
                        + this.Question[Aim[0]].substring(this.Text_Start, this.Question[Aim[0]].length)
                }else{
                    this.Question[Aim[0]] =
                        this.Question[Aim[0]].substring(0, this.Text_Start)
                        + "________"
                        + this.Question[Aim[0]].substring(this.Text_End, this.Question[Aim[0]].length)
                }
            }else if(Aim.length == 2){
                if(this.Text_Start == this.Text_End){
                    this.Question.sub_questions[Aim[1]][Aim[0]] =
                        this.Question.sub_questions[Aim[1]][Aim[0]].substring(0, this.Text_Start)
                        + "________"
                        + this.Question.sub_questions[Aim[1]][Aim[0]].substring(this.Text_Start, this.Question.sub_questions[Aim[1]][Aim[0]].length)
                }else{
                    this.Question.sub_questions[Aim[1]][Aim[0]] =
                        this.Question.sub_questions[Aim[1]][Aim[0]].substring(0, this.Text_Start)
                        + "________"
                        + this.Question.sub_questions[Aim[1]][Aim[0]].substring(this.Text_End, this.Question.sub_questions[Aim[1]][Aim[0]].length)
                }
            }else if(Aim.length == 3){
                // 只有大小题下的小题或选项才会涉及到三层
                // Aim[0]: options/sub_questions
                // Aim[1]: Big_Sub_Questions_Index
                // Aim[2]: Small_Sub_Questions_Index
                let Text = JSON.parse(JSON.stringify(this.Question.sub_questions[Aim[1]][Aim[0]][Aim[2]]))
                if(this.Text_Start == this.Text_End){
                    Text =
                        Text.substring(0, this.Text_Start)
                        + "________"
                        + Text.substring(this.Text_Start, this.Question.sub_questions[Aim[1]][Aim[0]].length)
                }else{
                    Text =
                        Text.substring(0, this.Text_Start)
                        + "________"
                        + Text.substring(this.Text_End, Text.length)
                }
                this.Question.sub_questions[Aim[1]][Aim[0]].splice(Aim[2], 1, Text)
            }
        },
        // 字体加粗
        Font_Bold(){
            let Aim = this.Focusing_Input.split(" ")
            if(Aim.length == 1){
                if(this.Text_Start == this.Text_End){
                    return
                }else{
                    this.Question[Aim[0]] =
                        this.Question[Aim[0]].substring(0, this.Text_Start)
                        + "<b>"
                        + this.Question[Aim[0]].substring(this.Text_Start, this.Text_End)
                        + "</b>"
                        + this.Question[Aim[0]].substring(this.Text_End, this.Question[Aim[0]].length)
                }
            }else if(Aim.length == 2){
                if(this.Text_Start == this.Text_End){
                    return
                }else{
                    this.Question.sub_questions[Aim[1]][Aim[0]] =
                        this.Question.sub_questions[Aim[1]][Aim[0]].substring(0, this.Text_Start)
                        + "<b>"
                        + this.Question.sub_questions[Aim[1]][Aim[0]].substring(this.Text_Start, this.Text_End)
                        + "</b>"
                        + this.Question.sub_questions[Aim[1]][Aim[0]].substring(this.Text_End, this.Question.sub_questions[Aim[1]][Aim[0]].length)
                }
            }else if(Aim.length == 3){
                // 只有大小题下的小题或选项才会涉及到三层
                // Aim[0]: options/sub_questions
                // Aim[1]: Big_Sub_Questions_Index
                // Aim[2]: Small_Sub_Questions_Index
                let Text = JSON.parse(JSON.stringify(this.Question.sub_questions[Aim[1]][Aim[0]][Aim[2]]))
                if(this.Text_Start == this.Text_End){
                    return
                }else{
                    Text =
                        Text.substring(0, this.Text_Start)
                        + "<b>"
                        + Text.substring(this.Text_Start, this.Text_End)
                        + "</b>"
                        + Text.substring(this.Text_End, Text.length)
                }
                this.Question.sub_questions[Aim[1]][Aim[0]].splice(Aim[2], 1, Text)
            }
        },
        // 字体加粗
        Font_Italic(){
            let Aim = this.Focusing_Input.split(" ")
            if(Aim.length == 1){
                if(this.Text_Start == this.Text_End){
                    return
                }else{
                    this.Question[Aim[0]] =
                        this.Question[Aim[0]].substring(0, this.Text_Start)
                        + "<i>"
                        + this.Question[Aim[0]].substring(this.Text_Start, this.Text_End)
                        + "</i>"
                        + this.Question[Aim[0]].substring(this.Text_End, this.Question[Aim[0]].length)
                }
            }else if(Aim.length == 2){
                if(this.Text_Start == this.Text_End){
                    return
                }else{
                    this.Question.sub_questions[Aim[1]][Aim[0]] =
                        this.Question.sub_questions[Aim[1]][Aim[0]].substring(0, this.Text_Start)
                        + "<i>"
                        + this.Question.sub_questions[Aim[1]][Aim[0]].substring(this.Text_Start, this.Text_End)
                        + "</i>"
                        + this.Question.sub_questions[Aim[1]][Aim[0]].substring(this.Text_End, this.Question.sub_questions[Aim[1]][Aim[0]].length)
                }
            }else if(Aim.length == 3){
                // 只有大小题下的小题或选项才会涉及到三层
                // Aim[0]: options/sub_questions
                // Aim[1]: Big_Sub_Questions_Index
                // Aim[2]: Small_Sub_Questions_Index
                let Text = JSON.parse(JSON.stringify(this.Question.sub_questions[Aim[1]][Aim[0]][Aim[2]]))
                if(this.Text_Start == this.Text_End){
                    return
                }else{
                    Text =
                        Text.substring(0, this.Text_Start)
                        + "<i>"
                        + Text.substring(this.Text_Start, this.Text_End)
                        + "</i>"
                        + Text.substring(this.Text_End, Text.length)
                }
                this.Question.sub_questions[Aim[1]][Aim[0]].splice(Aim[2], 1, Text)
            }
        },
        // 公式输入
        Complex_Input(){
            let Aim = this.Focusing_Input.split(" ")
            if(Aim.length == 1){
                this.Complex_Content = JSON.parse(JSON.stringify(this.Question[Aim[0]]))
            }else if(Aim.length == 2){
                this.Complex_Content = JSON.parse(JSON.stringify(this.Question.sub_questions[Aim[1]][Aim[0]]))
            }
            else if(Aim.length == 3){
                this.Complex_Content = JSON.parse(JSON.stringify(this.Question.sub_questions[Aim[1]][Aim[0]][parseInt(Aim[2])]))
            }
            this.Complex_Input_Dialog = true;
        },
        // 看看能不能正常拿到图片信息
        // position: 题干，答案，解析类 -> 'stem/answer/analysis_image'
        // 小题内的 题干，答案，解析类 -> 'stem/answer/analysis_image Sub_Question_Index'
        // 小题内的 选项，简答/计算的小题类 -> 'options_image/sub_questions_image Sub_Question_Index image_Bundle_Index'
        // Pic_Row_Index, Pic_Col_Index -> 通过行列坐标计算对应图片
        Get_Picture_Src(position, Stem_Pic_Row_Index, Stem_Pic_Col_Index){
            let Pos_Info = position.split(" ")

            if(Pos_Info.length == 1){
                let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
                return this.Question[Pos_Info[0]][Index]
            }else{
                let Item = this.Question.sub_questions[Pos_Info[1]]
                if(Pos_Info.length == 2){
                    // sub_questions[0].stem_image/answer_image/analysis_image
                    let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
                    return Item[Pos_Info[0]][Index]
                }else if(Pos_Info[0] == 'options_image'){
                    let Index = (Stem_Pic_Row_Index - 1) * 4 + Stem_Pic_Col_Index - 1
                    return Item[Pos_Info[0]][Pos_Info[2]][Index]
                }else if(Pos_Info[0] == 'sub_questions_image'){
                    let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
                    return Item[Pos_Info[0]][Pos_Info[2]][Index]
                }
            }
        },
        // 删除图片，参数意义参照上面获取src
        Del_Picture_Src(position, Stem_Pic_Row_Index, Stem_Pic_Col_Index){
            let Pos_Info = position.split(" ")
            if(Pos_Info.length == 1){
                let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
                this.Question[position].splice(Index, 1)
            }else{
                if(Pos_Info.length == 2){
                    let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
                    this.Question.sub_questions[Pos_Info[1]][Pos_Info[0]].splice(Index, 1)
                }else if(Pos_Info[0] == 'options_image'){
                    let Index = (Stem_Pic_Row_Index - 1) * 4 + Stem_Pic_Col_Index - 1
                    this.Question.sub_questions[Pos_Info[1]][Pos_Info[0]][Pos_Info[2]].splice(Index, 1)
                }else if(Pos_Info[0] == 'sub_questions_image'){
                    let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
                    this.Question.sub_questions[Pos_Info[1]][Pos_Info[0]][Pos_Info[2]].splice(Index, 1)
                }
            }
        },
        // 初始化一个观察器，每0.04秒检查一次当前的选中状况，用来提供给功能项
        Init_Select_Watcher(){
            this.Select_Watcher = setInterval(()=>{
                if(this.Focusing_Dom != ""){
                    this.Text_Start = this.Focusing_Dom.selectionStart
                    this.Text_End = this.Focusing_Dom.selectionEnd
                }
            }, 40)
        },
        // 根据传入的值来确定是谁被选中了
        Get_Focus(Info){
            let Info_List = Info.split("_")
            // Mix_Stem/Answer/Analysis
            if(Info_List.length == 2){
                if(Info_List[1] == "Stem"){
                    this.Focusing_Dom = document.getElementById("Mix_Stem")
                    this.Focusing_Input = "stem"
                }else if(Info_List[1] == "Answer"){
                    this.Focusing_Dom = document.getElementById("Mix_Answer")
                    this.Focusing_Input = "answer"
                }
                else if(Info_List[1] == "Analysis"){
                    this.Focusing_Dom = document.getElementById("Mix_Analysis")
                    this.Focusing_Input = "analysis"
                }else{
                    this.$message.info("此位置暂不支持配图及公式编辑，请注意。")
                    this.Focusing_Dom = ""
                    this.Focusing_Input = ""
                }
            }
            // Mix_Stem/Answer/Analysis_SQIndex
            else if(Info_List.length == 3){
                if(Info_List[1] == "Stem"){
                    this.Focusing_Dom = document.getElementById("Mix_Stem_" + Info_List[2])
                    this.Focusing_Input = "stem " + Info_List[2]
                }else if(Info_List[1] == "Answer"){
                    this.Focusing_Dom = document.getElementById("Mix_Answer_" + Info_List[2])
                    this.Focusing_Input = "answer " + Info_List[2]
                }
                else if(Info_List[1] == "Analysis"){
                    this.Focusing_Dom = document.getElementById("Mix_Analysis_" + Info_List[2])
                    this.Focusing_Input = "analysis " + Info_List[2]
                }
            }
            // Mix_Options/SQ(小题下的小题)_SQIndex_Index
            else if(Info_List.length == 4){
                if(Info_List[1] == "Options"){
                    this.Focusing_Dom = document.getElementById("Mix_Options_" + Info_List[2] + "_" + Info_List[3])
                    this.Focusing_Input = "options " + Info_List[2] + " " + Info_List[3]
                }else if(Info_List[1] == "SQ"){
                    this.Focusing_Dom = document.getElementById("Mix_SQ_" + Info_List[2] + "_" + Info_List[3])
                    this.Focusing_Input = "sub_questions " + Info_List[2] + " " + Info_List[3]
                }
            }
        },
        // 初始化上传图片的DOM对象
        Init_Picture_Upload_Dom(){
            this.Picture_Upload_Dom = document.getElementById("PictureInput");
            this.Picture_Upload_Dom.addEventListener("change", (e)=>{
                this.Insert_Picture_Into_Place(e.target.files[0])
                this.Picture_Upload_Dom.value = ""
            })
        },
        // 获取图片上传事件后的方法
        Insert_Picture_Into_Place(file){
            let Aim = this.Focusing_Input.split(" ")
            let Place = Aim[0] + "_image";
            const _this = this
            let File_Result = ""
            // Promise方法避免异步操作
            let promise = new Promise(function(resolve){
            // 用文件读取来读取图片的base64格式代码
                _this.Picture_Loading = true;
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function (e) {
                    File_Result = e.target.result;
                    resolve('1');
                };
            });
            promise.then(function(){
                // 用捕捉到的this对象来进行搜索
                if(Aim.length == 1){
                    _this.Question[Place].push(File_Result);
                    _this.Picture_Loading = false
                }else if(Aim.length == 2){
                    _this.Question.sub_questions[Aim[1]][Place].push(File_Result);
                    _this.Picture_Loading = false
                }else{
                    _this.Question.sub_questions[Aim[1]][Place][Aim[2]].push(File_Result);
                    _this.Picture_Loading = false
                }

            }).catch(function(){
            // 报错了就打印错误
                _this.$message.error("图片读取错误，请重试")
                _this.Picture_Loading = false
            })

        },
        // 上传图片
        Insert_Picture(){
            if(this.Focusing_Dom == ""){
                this.$message.error("请先点击某个框以确定插入位置。")
                return
            }else{
                this.Picture_Upload_Dom.click();
            }
        },
        // 选项删除
        Option_Delete(Big_Sub_Question_Index, Index){

            let Item = JSON.parse(JSON.stringify(this.Question.sub_questions[Big_Sub_Question_Index]))
            if(Item.options.length <= 2){
                this.$message.warning("请至少保留两个选项。")
                return
            }else{
                Item.options.splice(Index, 1);
                Item.options_image.splice(Index, 1);
            }
            this.Question.sub_questions.splice(Big_Sub_Question_Index, 1, Item)

        },
        // 选项增加
        Option_Add(Big_Sub_Question_Index){
            let Item = JSON.parse(JSON.stringify(this.Question.sub_questions[Big_Sub_Question_Index]))
            if(Item.options.length >= 26){
                this.$message.warning("选项过多。")
                return
            }else{
                Item.options.push("");
                Item.options_image.push([]);
            }
            this.Question.sub_questions.splice(Big_Sub_Question_Index, 1, Item)
            this.Update_Total_Score()
        },
        // 小题的小题删除
        Small_Sub_Questions_Delete(Big_Sub_Question_Index, Small_Sub_Question_Index){
            this.Question.sub_questions[Big_Sub_Question_Index].sub_questions.splice(Small_Sub_Question_Index, 1)
            this.Question.sub_questions[Big_Sub_Question_Index].sub_questions_image.splice(Small_Sub_Question_Index, 1)
            this.Question.sub_questions[Big_Sub_Question_Index].sub_questions_score.splice(Small_Sub_Question_Index, 1)
            this.Update_Total_Score()
        },
        // 小题的小题增加
        Small_Sub_Questions_Add(Big_Sub_Question_Index){
            this.Question.sub_questions[Big_Sub_Question_Index].sub_questions.push("")
            this.Question.sub_questions[Big_Sub_Question_Index].sub_questions_image.push([])
            this.Question.sub_questions[Big_Sub_Question_Index].sub_questions_score.push(5)
            this.Update_Total_Score()
        },
        Big_Sub_Question_Up(Big_Sub_Question_Index){
            let Item = JSON.parse(JSON.stringify(this.Question.sub_questions[Big_Sub_Question_Index]))
            this.Question.sub_questions.splice(Big_Sub_Question_Index, 1)
            this.Question.sub_questions.splice(Big_Sub_Question_Index - 1, 0, Item)
        },
        Big_Sub_Question_Down(Big_Sub_Question_Index){
            let Item = JSON.parse(JSON.stringify(this.Question.sub_questions[Big_Sub_Question_Index]))
            this.Question.sub_questions.splice(Big_Sub_Question_Index, 1)
            this.Question.sub_questions.splice(Big_Sub_Question_Index + 1, 0, Item)
        },
        Big_Sub_Question_Delete(Big_Sub_Question_Index){
            this.Question.sub_questions.splice(Big_Sub_Question_Index, 1)
            this.Update_Total_Score()
        },
        Big_Sub_Question_Add(){
            this.Question.sub_questions.push(
                {
                    type: "单选题",
                    score: 5,
                    stem: "",
                    stem_image: [],
                    options: ["", "", "", ""],
                    options_image: [[], [], [], []],
                    answer: "",
                    answer_image: [],
                    analysis: "",
                    analysis_image: [],
                    // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
                    sub_questions: [],
                    sub_questions_image: [],
                    sub_questions_score: [],
                    // 给多选题类型拿来控制答案的，一般用不到
                    answer_list: [],
                    // 是否折叠
                    expand: false
                }
            )
            this.Update_Total_Score()
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
            // 用于标记注意点的信息，可以重置
            this.Focusing_Input = ""
            this.Focusing_Dom = ""
            this.Text_Start = 0
            this.Text_End = 0

            // 用于公式输入
            this.Complex_Content = ""

            // 小题分数统一用的变量
            this.Unit_Score = 5

            // 基础试题信息，重置
            this.Focus_Function = "Editing"
            this.Question = {
                score: 5,
                stem: "",
                stem_image: [],
                answer: "",
                answer_image: [],
                analysis: "",
                analysis_image: [],
                // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
                sub_questions: [
                    {
                        type: "单选题",
                        score: 5,
                        stem: "",
                        stem_image: [],
                        options: ["", "", "", ""],
                        options_image: [[], [], [], []],
                        answer: "",
                        answer_image: [],
                        analysis: "",
                        analysis_image: [],
                        // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
                        sub_questions: [],
                        sub_questions_image: [],
                        sub_questions_score: [],
                        answer_list: [],
                        // 是否折叠
                        expand: false
                    }
                ],
            }
        },
        // 自动切分
        // 用于给试题文本自动切分，现在先只做选择吧，以后功能补齐了再说后面的
        Text_Split_Do(){
            this.$confirm('这将清空你现在所录入的全部内容，确定要进行粘贴文字识别吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{

                this.Picture_Loading = true;
                this.Loading_Text = "正在识别结果，请稍后..."

                let Out_JSON = [
                    {
                        id: 0,
                        subject: "",
                        period: "",
                        content: this.Paste_Analysis.split("\n")
                    }
                ]
                let Param = {
                    'Paper_Cut_Result': JSON.stringify(Out_JSON, null, 4)
                }

                commonAjax(this.backendIP + '/api/paperCutResultAnalyse', Param)
                .then((res)=>{
                    this.Paste_Extract(res.data[0])
                    this.Picture_Loading = false;
                    this.Loading_Text = "正在识别图片，请稍后"
                }).catch(
                    ()=>{
                        this.$message.error("解析出现异常，请重试。")
                    }
                ).finally(()=>{

                })
            })
        },
        Paste_Extract(Question_Info){

            // 文本框相关重置
            this.Focusing_Input = ""
            this.Focusing_Dom = ""
            this.Text_Start = 0
            this.Text_End = 0

            // 复杂输入重置
            this.Complex_Content = ""

            // 这个Question的主要作用的用来进行发送
            // 直接涉及到编辑的只有题干，选项和解析
            // 这是因为多选题的答案不唯一，需要用一个数组做间接变量才行
            this.Question = {
                score: Question_Info.score,
                stem: Question_Info.stem,
                stem_image: [],
                answer: Question_Info.answer,
                answer_image: [],
                analysis: Question_Info.analysis,
                analysis_image: [],
                // 处理上的重大区别，就是综合题没有选项，只有小题，然后小题内本身允许
                // 单选，多选，判断，填空，简答，计算这些题型
                sub_questions: [],
            }

            for(let i = 0; i < Question_Info.subquestions.length; i++){
                let Item = {
                    type: Question_Info.subquestions[i].sub_type == "选择题" ? "单选题" : Question_Info.subquestions[i].sub_type,
                    score: Question_Info.subquestions[i].sub_score,
                    stem: Question_Info.subquestions[i].sub_stem,
                    stem_image: [],
                    options: Question_Info.subquestions[i].sub_options,
                    options_image: [],
                    answer: "",
                    answer_image: [],
                    analysis: "",
                    analysis_image: [],
                    // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
                    sub_questions: [],
                    sub_questions_image: [],
                    sub_questions_score: [],
                    // 给多选题类型拿来控制答案的，一般用不到
                    answer_list: [],
                    // 是否折叠
                    expand: false
                }

                for(let j = 0 ; j < Question_Info.subquestions[i].sub_options.length; j++){
                    Item.options_image.push([])
                }

                this.Question.sub_questions.push(JSON.parse(JSON.stringify(Item)))
            }
        }
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

/* 用于试题内容简单编辑的按钮 */
.editButton{
    height: 32px;
    width: 32px;
    line-height: 32px;
    margin-top: 3px;
    border-radius: 5px;
    box-sizing: border-box;
    margin-right: 5px;
}
.editButton:hover{
    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.3);
    border: 1px solid whitesmoke;
}

/* 用于配图的文字显示 */

.imageLabel{
    display: block;
    margin-bottom: 10px;
    border: 2px dashed #409EFF;
    border-radius: 10px;
    color: #409EFF;
    height: 30px;
    width: 80px;
    line-height: 30px;
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
