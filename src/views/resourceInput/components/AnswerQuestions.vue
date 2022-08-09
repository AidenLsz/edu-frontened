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
        <div v-show="Focus_Function == 'Editing'" style="margin-bottom: 30px;">
            <!-- 第一行，分值 -->
            <el-row type="flex" justify="start" style="margin-top: 20px;">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                        <span>总分值：</span>
                    </el-row>
                </el-col>
                <el-col :span="3" :offset="1">
                    <el-row type="flex" justify="center">
                        <el-input v-model="Question.score" placeholder="" readonly></el-input>
                    </el-row>
                </el-col>
                <el-col :span="1">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                        <span>分</span>
                    </el-row>
                </el-col>
                <el-col :span="16">
                    <el-row type="flex" justify="end">
                        <el-button type="success" @click="Emit_And_Submit()">确定提交</el-button>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 第二行，题干 -->
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                        <span>题干：</span>
                    </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input
                            @focus="Get_Focus('Answer_Stem')"
                            id="Answer_Stem"
                            type="textarea"
                            v-model="Question.stem"
                            resize="none" :rows="6"
                            placeholder="请填写题干内容（必填）"></el-input>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 题干配图 -->
            <el-row v-show="Question.stem_image.length > 0" style="margin-bottom: 20px">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px">
                        <span>题干配图：</span>
                    </el-row>
                </el-col>
                <el-col :span="21" :offset="1">
                    <el-row
                        type="flex"
                        justify="start"
                        v-for="Answer_Stem_Pic_Row_Index in Math.ceil(Question.stem_image.length/12)"
                        :key="'Answer_Stem_Pic_Row_' + Answer_Stem_Pic_Row_Index">
                        <el-col
                            :span="2"
                            v-for="Answer_Stem_Pic_Col_Index in 12"
                            :key="'Answer_Stem_Pic_Row_' + Answer_Stem_Pic_Row_Index + 'Col_' + Answer_Stem_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="start"
                                v-if="(Answer_Stem_Pic_Row_Index - 1) * 12 + Answer_Stem_Pic_Col_Index - 1 < Question.stem_image.length"
                                >
                                <el-popover
                                    :ref="'Answer_Stem_Pic_Row_' + Answer_Stem_Pic_Row_Index + 'Col_' + Answer_Stem_Pic_Col_Index + '_Pop'"
                                    placement="top"
                                    width="200"
                                    trigger="hover">
                                    <el-row type="flex" justify="center">
                                        <img width="160" :src="Get_Picture_Src('stem_image', Answer_Stem_Pic_Row_Index, Answer_Stem_Pic_Col_Index)">
                                    </el-row>
                                    <el-row type="flex" justify="center">
                                        <el-button
                                            type="danger"
                                            size="small"
                                            @click="Del_Picture_Src('stem_image', Answer_Stem_Pic_Row_Index, Answer_Stem_Pic_Col_Index)"
                                            style="margin-top: 10px">
                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                        </el-button>
                                    </el-row>
                                    <span slot="reference" class="imageLabel">
                                        配图{{(Answer_Stem_Pic_Row_Index - 1) * 12 + Answer_Stem_Pic_Col_Index}}
                                    </span>
                                </el-popover>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 第三行，小题，整体算作一个大行吧 -->
            <el-row
                v-for="(Sub_Question, Sub_Questions_Index) in Question.sub_questions"
                :key="'Answer_Sub_Questions_' + Sub_Questions_Index" style="margin-bottom: 20px;">
                <!-- 纵向排列，因为实际上每个小题分为三部分 -->
                <el-col>
                    <!-- 第一部分，单题得分 -->
                    <el-row type="flex" justify="start" style="margin-bottom: 10px;">
                        <el-col :span="2">
                            <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                                <span>第{{Sub_Questions_Index + 1}}小题分值：</span>
                            </el-row>
                        </el-col>
                        <el-col :span="3" :offset="1">
                            <el-row type="flex" justify="start">
                                <el-input-number v-model="Question.sub_questions_score[Sub_Questions_Index]" placeholder="" :min="1" :step=".5" :max="40"></el-input-number>
                            </el-row>
                        </el-col>
                        <el-col :span="1">
                            <el-row type="flex" justify="end" style="font-weight: bold; height: 40px; line-height: 40px">
                                <span>分</span>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 第二部分，文字内容 -->
                    <el-row type="flex" justify="start" style="margin-bottom: 10px">
                        <el-col :span="2">
                            <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                                <span>第{{Sub_Questions_Index + 1}}小题内容：</span>
                            </el-row>
                        </el-col>
                        <el-col :span="14" :offset="1">
                            <el-row type="flex" justify="start">
                                <el-input
                                    @focus="Get_Focus('Answer_Sub_Questions_' + Sub_Questions_Index)"
                                    :id="'Answer_Sub_Questions_' + Sub_Questions_Index"
                                    type="textarea"
                                    v-model="Question.sub_questions[Sub_Questions_Index]"
                                    resize="none" :rows="6"
                                    placeholder="请填写题干内容（必填）"></el-input>
                            </el-row>
                        </el-col>
                        <el-col :span="7">
                            <el-row type="flex" justify="start" style="height: 130px; line-height: 130px; margin-left: 30px; padding-top: 50px">
                                <span class="optionButton" @click="Sub_Questions_Up(Sub_Questions_Index)"><i class="el-icon-top" style="font-weight: bold"></i></span>
                                <span class="optionButton" @click="Sub_Questions_Down(Sub_Questions_Index)"><i class="el-icon-bottom" style="font-weight: bold"></i></span>
                                <span class="optionButton" @click="Sub_Questions_Delete(Sub_Questions_Index)"><i class="el-icon-close" style="font-weight: bold"></i></span>
                                <span class="optionButton" @click="Sub_Questions_Add()" v-if="Sub_Questions_Index == Question.sub_questions.length - 1"><i class="el-icon-plus" style="font-weight: bold"></i></span>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 第三部分，小题配图 -->
                    <el-row v-show="Question.sub_questions_image[Sub_Questions_Index].length > 0">
                        <el-col :span="2">
                            <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px; margin-top: 1px">
                                <span>第{{Sub_Questions_Index + 1}}小题配图：</span>
                            </el-row>
                        </el-col>
                        <el-col :span="21" :offset="1">
                            <el-row
                                type="flex"
                                justify="start"
                                v-for="Answer_Sub_Questions_Pic_Row_Index in Math.ceil(Question.sub_questions_image[Sub_Questions_Index].length/12)"
                                :key="'Answer_Sub_Questions_' + Sub_Questions_Index + '_Pic_Row_' + Answer_Sub_Questions_Pic_Row_Index">
                                <el-col
                                    :span="2"
                                    v-for="Answer_Sub_Questions_Pic_Col_Index in 12"
                                    :key="'Answer_Sub_Questions_' + Sub_Questions_Index
                                            + '_Pic_Row_' + Answer_Sub_Questions_Pic_Row_Index
                                            + '_Col_' + Answer_Sub_Questions_Pic_Col_Index">
                                    <el-row
                                        type="flex"
                                        justify="start"
                                        v-if="(Answer_Sub_Questions_Pic_Row_Index - 1) * 12 + Answer_Sub_Questions_Pic_Col_Index - 1
                                            < Question.sub_questions_image[Sub_Questions_Index].length"
                                        >
                                        <el-popover
                                            :ref="'Answer_Sub_Questions_' + Sub_Questions_Index + '_Pic_Row_' + Answer_Sub_Questions_Pic_Row_Index + '_Col_' + Answer_Sub_Questions_Pic_Col_Index + '_Pop'"
                                            placement="top"
                                            width="200"
                                            trigger="hover">
                                            <el-row type="flex" justify="center">
                                                <img width="160" :src="Get_Picture_Src('sub_questions_image ' + Sub_Questions_Index , Answer_Sub_Questions_Pic_Row_Index, Answer_Sub_Questions_Pic_Col_Index)">
                                            </el-row>
                                            <el-row type="flex" justify="center">
                                                <el-button
                                                    type="danger"
                                                    size="small"
                                                    @click="Del_Picture_Src('sub_questions_image ' + Sub_Questions_Index , Answer_Sub_Questions_Pic_Row_Index, Answer_Sub_Questions_Pic_Col_Index)"
                                                    style="margin-top: 10px">
                                                    删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                                </el-button>
                                            </el-row>
                                            <span slot="reference" class="imageLabel" style="margin-bottom: 0px;">
                                                配图{{(Answer_Sub_Questions_Pic_Row_Index - 1) * 12 + Answer_Sub_Questions_Pic_Col_Index}}
                                            </span>
                                        </el-popover>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 第四行，答案，选择题的答案我们只给选择的方式来确定，单选或判断只有单选，多选有checkbox -->
            <el-row type="flex" justify="start" style="margin-top: 10px; margin-bottom: 10px">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 130px; line-height: 130px">
                        <span>答案：</span>
                    </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                    <el-row type="flex" justify="start">
                        <el-input
                            @focus="Get_Focus('Answer_Answer')"
                            id="Answer_Answer"
                            type="textarea"
                            v-model="Question.answer"
                            resize="none" :rows="6"
                            placeholder="请填写答案内容（可选）"></el-input>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 答案配图 -->
            <el-row v-show="Question.answer_image.length > 0" style="margin-top: 10px; margin-bottom: 10px">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px">
                        <span>答案配图：</span>
                    </el-row>
                </el-col>
                <el-col :span="21" :offset="1">
                    <el-row
                        type="flex"
                        justify="start"
                        v-for="Answer_Answer_Pic_Row_Index in Math.ceil(Question.answer_image.length/12)"
                        :key="'Answer_Answer_Pic_Row_' + Answer_Answer_Pic_Row_Index">
                        <el-col
                            :span="2"
                            v-for="Answer_Answer_Pic_Col_Index in 12"
                            :key="'Answer_Answer_Pic_Row_' + Answer_Answer_Pic_Row_Index + '_Col_' + Answer_Answer_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="start"
                                v-if="(Answer_Answer_Pic_Row_Index - 1) * 12 + Answer_Answer_Pic_Col_Index - 1 < Question.answer_image.length"
                                >
                                <el-popover
                                    :ref="'Answer_Answer_Pic_Row_' + Answer_Answer_Pic_Row_Index + '_Col_' + Answer_Answer_Pic_Col_Index + '_Pop'"
                                    placement="top"
                                    width="200"
                                    trigger="hover">
                                    <el-row type="flex" justify="center">
                                        <img width="160" :src="Get_Picture_Src('answer_image', Answer_Answer_Pic_Row_Index, Answer_Answer_Pic_Col_Index)">
                                    </el-row>
                                    <el-row type="flex" justify="center">
                                        <el-button
                                            type="danger"
                                            size="small"
                                            @click="Del_Picture_Src('answer_image', Answer_Answer_Pic_Row_Index, Answer_Answer_Pic_Col_Index)"
                                            style="margin-top: 10px">
                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                        </el-button>
                                    </el-row>
                                    <span slot="reference" class="imageLabel">
                                        配图{{(Answer_Answer_Pic_Row_Index - 1) * 12 + Answer_Answer_Pic_Col_Index}}
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
                            @focus="Get_Focus('Answer_Analysis')"
                            id="Answer_Analysis"
                            type="textarea"
                            v-model="Question.analysis"
                            resize="none" :rows="6"
                            placeholder="请输入解析内容（可选）"></el-input>
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
                        v-for="Answer_Analysis_Pic_Row_Index in Math.ceil(Question.analysis_image.length/12)"
                        :key="'Answer_Analysis_Pic_Row_' + Answer_Analysis_Pic_Row_Index">
                        <el-col
                            :span="2"
                            v-for="Answer_Analysis_Pic_Col_Index in 12"
                            :key="'Answer_Analysis_Pic_Row_' + Answer_Analysis_Pic_Row_Index + 'Col_' + Answer_Analysis_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="start"
                                v-if="(Answer_Analysis_Pic_Row_Index - 1) * 12 + Answer_Analysis_Pic_Col_Index - 1 < Question.analysis_image.length"
                                >
                                <el-popover
                                    :ref="'Answer_Analysis_Pic_Row_' + Answer_Analysis_Pic_Row_Index + 'Col_' + Answer_Analysis_Pic_Col_Index + '_Pop'"
                                    placement="top"
                                    width="200"
                                    trigger="hover">
                                    <el-row type="flex" justify="center">
                                        <img width="160" :src="Get_Picture_Src('analysis_image', Answer_Analysis_Pic_Row_Index, Answer_Analysis_Pic_Col_Index)">
                                    </el-row>
                                    <el-row type="flex" justify="center">
                                        <el-button
                                            type="danger"
                                            size="small"
                                            @click="Del_Picture_Src('analysis_image', Answer_Analysis_Pic_Row_Index, Answer_Analysis_Pic_Col_Index)"
                                            style="margin-top: 10px">
                                            删除此图片<i class="el-icon-delete" style="margin-left: 10px; font-size: 14px"></i>
                                        </el-button>
                                    </el-row>
                                    <span slot="reference" class="imageLabel" style="margin-bottom: 0px">
                                        配图{{(Answer_Analysis_Pic_Row_Index - 1) * 12 + Answer_Analysis_Pic_Col_Index}}
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
                        <Mathdown :content="Question.stem" :name="'Pre_Answer_Stem'"></Mathdown>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 题干的配图部分 -->
            <el-row type="flex" justify="end" v-show="Question.stem_image.length > 0">
                <el-col :span="22">
                    <el-row
                        type="flex"
                        justify="start"
                        v-for="Pre_Answer_Stem_Pic_Row_Index in Math.ceil(Question.stem_image.length/12)"
                        :key="'Pre_Answer_Stem_' + Pre_Answer_Stem_Pic_Row_Index"
                        style="margin-bottom: 10px">
                        <el-col
                            :span="2"
                            v-for="Pre_Answer_Stem_Pic_Col_Index in 12"
                            :key="'Pre_Answer_Stem_' + Pre_Answer_Stem_Pic_Row_Index + '_' + Pre_Answer_Stem_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="center"
                                v-if="(Pre_Answer_Stem_Pic_Row_Index - 1) * 12 + Pre_Answer_Stem_Pic_Col_Index - 1 < Question.stem_image.length"
                                >
                                <img height="60" :src="Get_Picture_Src('stem_image', Pre_Answer_Stem_Pic_Row_Index, Pre_Answer_Stem_Pic_Col_Index)">
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 小题部分 -->
            <el-row
                type="flex"
                justify="start"
                v-for="(Sub_Question, Sub_Questions_Index) in Question.sub_questions" :key="'Pre_Answer_Sub_Questions_' + Sub_Questions_Index"
                style="margin-bottom: 10px;">
                <el-col>
                    <!-- 选项文字 -->
                    <el-row type="flex" justify="start">
                        <el-col :span="2">
                            <el-row type="flex" justify="end" style="font-weight: bold;">
                                <span>第{{Sub_Questions_Index + 1}}小题题干：</span>
                            </el-row>
                        </el-col>
                        <el-col :span="22">
                            <el-row type="flex" justify="start">
                                <Mathdown :content="Sub_Question" :name="'Pre_Answer_Sub_Questions_' + Sub_Questions_Index"></Mathdown>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 10px;" v-show="Question.sub_questions_image[Sub_Questions_Index].length > 0">
                        <el-col :span="2">
                            <el-row type="flex" justify="end" style="font-weight: bold; height: 30px; line-height: 30px; margin-top: 6px">
                                <span>第{{Sub_Questions_Index + 1}}小题配图：</span>
                            </el-row>
                        </el-col>
                        <el-col :span="22">
                            <el-row
                                type="flex"
                                justify="start"
                                v-for="Pre_Answer_Sub_Questions_Pic_Row_Index in Math.ceil(Question.sub_questions_image[Sub_Questions_Index].length/12)"
                                :key="'Pre_Answer_Sub_Questions_' + Sub_Questions_Index + '_Pic_Row_' + Pre_Answer_Sub_Questions_Pic_Row_Index">
                                <el-col
                                    :span="2"
                                    v-for="Pre_Answer_Sub_Questions_Pic_Col_Index in 12"
                                    :key="'Pre_Answer_Sub_Questions_' + Sub_Questions_Index + '_Pic_Row_' + Pre_Answer_Sub_Questions_Pic_Row_Index + '_Col_' + Pre_Answer_Sub_Questions_Pic_Col_Index">
                                    <el-row
                                        type="flex"
                                        justify="center"
                                        v-if="(Pre_Answer_Sub_Questions_Pic_Row_Index - 1) * 12 + Pre_Answer_Sub_Questions_Pic_Col_Index - 1 < Question.sub_questions_image[Sub_Questions_Index].length"
                                        >
                                        <img height="60" :src="Get_Picture_Src('sub_questions_image ' + Sub_Questions_Index , Pre_Answer_Sub_Questions_Pic_Row_Index, Pre_Answer_Sub_Questions_Pic_Col_Index)">
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <!-- 答案部分 -->
            <el-row type="flex" justify="start" style="margin-bottom: 10px;" v-show="Question.answer_image.length > 0 || Question.answer.length > 0">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold;">
                        <span>答案：</span>
                    </el-row>
                </el-col>
                <el-col :span="22">
                    <el-row type="flex" justify="start">
                        <Mathdown :content="Question.answer" :name="'Pre_Answer_Answer'"></Mathdown>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 答案配图 -->
            <el-row type="flex" justify="end" v-show="Question.answer_image.length > 0">
                <el-col :span="22">
                    <el-row
                        type="flex"
                        justify="start"
                        v-for="Pre_Answer_Answer_Pic_Row_Index in Math.ceil(Question.answer_image.length/12)"
                        :key="'Pre_Answer_Answer_' + Pre_Answer_Answer_Pic_Row_Index"
                        style="margin-bottom: 10px;">
                        <el-col
                            :span="2"
                            v-for="Pre_Answer_Answer_Pic_Col_Index in 12"
                            :key="'Pre_Answer_Answer_' + Pre_Answer_Answer_Pic_Row_Index + '_' + Pre_Answer_Answer_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="center"
                                v-if="(Pre_Answer_Answer_Pic_Row_Index - 1) * 12 + Pre_Answer_Answer_Pic_Col_Index - 1 < Question.answer_image.length"
                                >
                                <img height="60" :src="Get_Picture_Src('answer_image', Pre_Answer_Answer_Pic_Row_Index, Pre_Answer_Answer_Pic_Col_Index)">
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <!-- 解析部分 -->
            <el-row type="flex" justify="start" style="margin-bottom: 10px;" v-show="Question.analysis_image.length > 0 || Question.analysis.length > 0">
                <el-col :span="2">
                    <el-row type="flex" justify="end" style="font-weight: bold;">
                        <span>解析：</span>
                    </el-row>
                </el-col>
                <el-col :span="22">
                    <el-row type="flex" justify="start">
                        <Mathdown :content="Question.analysis" :name="'Pre_Answer_Analysis'"></Mathdown>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 解析部分配图 -->
            <el-row type="flex" justify="end" v-show="Question.analysis_image.length > 0">
                <el-col :span="22">
                    <el-row
                        type="flex"
                        justify="start"
                        v-for="Pre_Answer_Analysis_Pic_Row_Index in Math.ceil(Question.analysis_image.length/12)"
                        :key="'Pre_Answer_Analysis_' + Pre_Answer_Analysis_Pic_Row_Index">
                        <el-col
                            :span="2"
                            v-for="Pre_Answer_Analysis_Pic_Col_Index in 12"
                            :key="'Pre_Answer_Analysis_' + Pre_Answer_Analysis_Pic_Row_Index + '_' + Pre_Answer_Analysis_Pic_Col_Index">
                            <el-row
                                type="flex"
                                justify="center"
                                v-if="(Pre_Answer_Analysis_Pic_Row_Index - 1) * 12 + Pre_Answer_Analysis_Pic_Col_Index - 1 < Question.analysis_image.length"
                                >
                                <img height="60" :src="Get_Picture_Src('analysis_image', Pre_Answer_Analysis_Pic_Row_Index, Pre_Answer_Analysis_Pic_Col_Index)">
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
    name: "AnswerQuestions",
    props: {
        detailType: {
            type: String,
            default: "简答题"
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
                options: [],
                options_image: [],
                answer: "",
                answer_image: [],
                analysis: "",
                analysis_image: [],
                // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
                sub_questions: [""],
                sub_questions_image: [[]],
                sub_questions_score: [5],
                answer_list: []
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
            // 粘贴识别，但是暂时还没放进来
            Paste_Analysis: "",
        }
    },
    watch: {
        detailType(newVal, oldVal){
            if(newVal != oldVal){
                this.Reset_Question_Info();
            }
        },
        'Question.sub_questions_score': {
            handler: function(newVal) {
                let Count = 0;
                for(let i = 0; i < newVal.length; i++){
                    Count = Count + parseFloat(newVal[i])
                }
                this.Question.score = Count
            },
            deep: true,
            immediate: true,
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
        // 发射题目信息并入库
        Emit_And_Submit(){
            this.$emit('Emit_And_Submit', JSON.stringify(this.Question));
        },
        // 将公式编辑器编辑完的内容弄回来
        Update_Complex_Input(val){
            this.Complex_Input_Dialog = false
            let Aim = this.Focusing_Input.split(" ")
            if(Aim.length == 1){
                this.Question[Aim[0]] = val;
            }else{
                this.Question[Aim[0]].splice(parseInt(Aim[1]), 1, val)
            }
        },
        // 小题上移
        Sub_Questions_Up(Sub_Questions_Index){
            if(Sub_Questions_Index == 0){
                return
            }
            let Item = this.Question.sub_questions[Sub_Questions_Index];
            let Item_Image = this.Question.sub_questions_image[Sub_Questions_Index];
            let Item_Score = this.Question.sub_questions_score[Sub_Questions_Index];

            this.Question.sub_questions.splice(Sub_Questions_Index, 1);
            this.Question.sub_questions.splice(Sub_Questions_Index - 1, 0, Item)

            this.Question.sub_questions_image.splice(Sub_Questions_Index, 1);
            this.Question.sub_questions_image.splice(Sub_Questions_Index - 1, 0, Item_Image);

            this.Question.sub_questions_score.splice(Sub_Questions_Index, 1);
            this.Question.sub_questions_score.splice(Sub_Questions_Index - 1, 0, Item_Score);
        },
        // 小题下移
        Sub_Questions_Down(Sub_Questions_Index){

            if(Sub_Questions_Index == this.Question.sub_questions.length - 1){
                return
            }
            let Item = this.Question.sub_questions[Sub_Questions_Index];
            let Item_Image = this.Question.sub_questions_image[Sub_Questions_Index];
            let Item_Score = this.Question.sub_questions_score[Sub_Questions_Index];

            this.Question.sub_questions.splice(Sub_Questions_Index, 1);
            this.Question.sub_questions.splice(Sub_Questions_Index + 1, 0, Item)

            this.Question.sub_questions_image.splice(Sub_Questions_Index, 1);
            this.Question.sub_questions_image.splice(Sub_Questions_Index + 1, 0, Item_Image);

            this.Question.sub_questions_score.splice(Sub_Questions_Index, 1);
            this.Question.sub_questions_score.splice(Sub_Questions_Index + 1, 0, Item_Score);
        },

        // 小题删除
        Sub_Questions_Delete(Sub_Questions_Index){

            if(this.Question.sub_questions.length <= 1){
                this.$message.error("请保留至少一道小题。")
                return
            }

            this.Question.sub_questions.splice(Sub_Questions_Index, 1);
            this.Question.sub_questions_image.splice(Sub_Questions_Index, 1);
            this.Question.sub_questions_score.splice(Sub_Questions_Index, 1);

        },
        // 小题添加
        Sub_Questions_Add(){
            this.Question.sub_questions.push("");
            this.Question.sub_questions_image.push([]);
            this.Question.sub_questions_score.push(5);
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
            }else{
                if(this.Text_Start == this.Text_End){
                    this.Question[Aim[0]].splice(
                        parseInt(Aim[1]),
                        1,
                        this.Question[Aim[0]][parseInt(Aim[1])].substring(0, this.Text_Start)
                        + "(        )"
                        + this.Question[Aim[0]][parseInt(Aim[1])].substring(this.Text_End, this.Question[Aim[0]][parseInt(Aim[1])].length))
                }else{
                    this.Question[Aim[0]].splice(parseInt(Aim[1]), 1,
                        this.Question[Aim[0]][parseInt(Aim[1])].substring(0, this.Text_Start)
                        + "("
                        + this.Question[Aim[0]][parseInt(Aim[1])].substring(this.Text_Start, this.Text_End)
                        + ")"
                        + this.Question[Aim[0]][parseInt(Aim[1])].substring(this.Text_End, this.Question[Aim[0]][parseInt(Aim[1])].length))
                }
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
            }else{
                if(this.Text_Start == this.Text_End){
                    this.Question[Aim[0]].splice(
                        parseInt(Aim[1]),
                        1,
                        this.Question[Aim[0]][parseInt(Aim[1])].substring(0, this.Text_Start)
                        + "________"
                        + this.Question[Aim[0]][parseInt(Aim[1])].substring(this.Text_End, this.Question[Aim[0]][parseInt(Aim[1])].length))
                }else{
                    this.Question[Aim[0]].splice(parseInt(Aim[1]), 1,
                        this.Question[Aim[0]][parseInt(Aim[1])].substring(0, this.Text_Start)
                        + "________"
                        + this.Question[Aim[0]][parseInt(Aim[1])].substring(this.Text_End, this.Question[Aim[0]][parseInt(Aim[1])].length))
                }
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
            }else{
                if(this.Text_Start == this.Text_End){
                    return
                }else{
                    this.Question[Aim[0]].splice(parseInt(Aim[1]), 1,
                        this.Question[Aim[0]][parseInt(Aim[1])].substring(0, this.Text_Start)
                        + "<b>"
                        + this.Question[Aim[0]][parseInt(Aim[1])].substring(this.Text_Start, this.Text_End)
                        + "</b>"
                        + this.Question[Aim[0]][parseInt(Aim[1])].substring(this.Text_End, this.Question[Aim[0]][parseInt(Aim[1])].length))
                }
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
            }else{
                if(this.Text_Start == this.Text_End){
                    return
                }else{
                    this.Question[Aim[0]].splice(parseInt(Aim[1]), 1,
                        this.Question[Aim[0]][parseInt(Aim[1])].substring(0, this.Text_Start)
                        + "<i>"
                        + this.Question[Aim[0]][parseInt(Aim[1])].substring(this.Text_Start, this.Text_End)
                        + "</i>"
                        + this.Question[Aim[0]][parseInt(Aim[1])].substring(this.Text_End, this.Question[Aim[0]][parseInt(Aim[1])].length))
                }
            }
        },
        // 公式输入
        Complex_Input(){
            let Aim = this.Focusing_Input.split(" ")
            if(Aim.length == 1){
                this.Complex_Content = JSON.parse(JSON.stringify(this.Question[Aim[0]]))
            }else{
                this.Complex_Content = JSON.parse(JSON.stringify(this.Question[Aim[0]][parseInt(Aim[1])]))
            }
            this.Complex_Input_Dialog = true;
        },
        // 看看能不能正常拿到图片信息
        Get_Picture_Src(position, Stem_Pic_Row_Index, Stem_Pic_Col_Index){
            let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
            if(position.split(" ").length == 1){
                return this.Question[position][Index]
            }else{
                let Info = position.split(" ")
                return this.Question[Info[0]][parseInt(Info[1])][Index]
            }
        },
        // 删除图片
        Del_Picture_Src(position, Stem_Pic_Row_Index, Stem_Pic_Col_Index){
            let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
            if(position.split(" ").length == 1){
                this.Question[position].splice(Index, 1)
            }else{
                let Info = position.split(" ")
                this.Question[Info[0]][parseInt(Info[1])].splice(Index, 1)
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
            if(Info_List[1] == "Stem"){
                this.Focusing_Dom = document.getElementById("Answer_Stem")
                this.Focusing_Input = "stem"
            }
            else if(Info_List[1] + '_' + Info_List[2] == "Sub_Questions"){
                this.Focusing_Dom = document.getElementById("Answer_Sub_Questions_" + Info_List[3])
                this.Focusing_Input = "sub_questions " + Info_List[3]
            }
            else if(Info_List[1] == "Answer"){
                this.Focusing_Dom = document.getElementById("Answer_Answer")
                this.Focusing_Input = "answer"
            }
            else if(Info_List[1] == "Analysis"){
                this.Focusing_Dom = document.getElementById("Answer_Analysis")
                this.Focusing_Input = "analysis"
            }else{
                this.$message.info("此位置暂不支持配图及公式编辑，请注意。")
                this.Focusing_Dom = ""
                this.Focusing_Input = ""
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
                }else{
                    _this.Question[Place][parseInt(Aim[1])].push(File_Result);
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

            // 基础试题信息，重置
            this.Focus_Function = "Editing"
            this.Question = {
                score: 5,
                stem: "",
                stem_image: [],
                // options两项在填空里也用不到，但是在这里可以拿来保证格式统一
                options: [],
                options_image: [],
                answer: "",
                answer_image: [],
                analysis: "",
                analysis_image: [],
                // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
                sub_questions: [""],
                sub_questions_image: [[]],
                sub_questions_score: [5],
                answer_list: []
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

            this.Question = {
                score: Question_Info.score,
                stem: Question_Info.stem,
                stem_image: [],
                // options两项在填空里也用不到，但是在这里可以拿来保证格式统一
                options: [],
                options_image: [],
                answer: Question_Info.answer,
                answer_image: [],
                analysis: Question_Info.analysis,
                analysis_image: [],
                // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
                sub_questions: [],
                sub_questions_image: [],
                sub_questions_score: [],
                answer_list: []
            }

            for(let i = 0; i < Question_Info.subquestions.length; i++){
                this.Question.sub_questions.push(Question_Info.subquestions[i].sub_stem)
                this.Question.sub_questions_image.push([])
                this.Question.sub_questions_score.push(Question_Info.subquestions[i].sub_score)
            }

            if(this.Question.sub_questions.length == 0){
                this.Question.sub_questions.push("")
                this.Question.sub_questions_image.push([])
                this.Question.sub_questions_score.push(5)
                this.Question.score = 5
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
    border: 2px dashed #409EFF;
    border-radius: 10px;
    color: #409EFF;
    height: 30px;
    width: 80px;
    line-height: 30px;
}
</style>
