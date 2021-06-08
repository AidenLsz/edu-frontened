<template>
  <div style="margin-top: 5vh">
    <!-- 数学试题手动切分用的对话框 -->
    <el-dialog
      :visible.sync="userCutMath"
      title="数学试题手动调整切分"
      width="90%"
      @close="User_Cut_Math_Close()"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-row>
        <el-col v-if="complex_Input">
            <el-row>
                <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
            </el-row>
            <ComplexInput :Mathdown_Special="'inputPaper_HandCut'"></ComplexInput>
            <el-row>
                <el-button @click="complex_Input = false"><label>隐藏并清空</label></el-button>
            </el-row>
        </el-col>
        <el-col v-if="!complex_Input">
            <el-row>
                <el-button @click="complex_Input = true"><label>显示LUNA输入助手</label></el-button>
            </el-row>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row style="width: 85%; margin-left: 6.75vw">
        <el-row style="margin-top: 2vh; margin-bottom: 3vh" type="flex" justify="center">
          <el-button @click="Re_Cut_TestData()" size="medium" type="success" plain>修正完成，再次切分</el-button>
        </el-row>
        <el-row v-for="(Question, index) in userCutTestData" :key="index" style="margin-bottom: 5vh; border: 2px dashed black; padding: 10px 20px; background: rgba(0,255,255,0.04)">
          <el-row type="flex" justify="center">
            <el-button type="text" size="medium" :disabled="index == 0" @click="Math_Merge_To_Front(index)">向前合并</el-button>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-row type="flex" justify="start" v-for="(Stem, sindex) in Question.Stem" :key="index + '_Q_Stem_' + sindex">
                <el-col :span="18">
                  <el-row type="flex" justify="start">
                    <Mathdown :content="Stem" :name="'Q_' + index + '_Stem_' + sindex"></Mathdown>
                  </el-row>
                </el-col>
                <el-col :span="2"><el-button type="text" size="mini" :disabled="sindex == 0" @click="Math_Front_Cut(index, sindex)">前切</el-button></el-col>
                <el-col :span="2"><el-button type="text" size="mini" :disabled="sindex == Question.Stem.length - 1" @click="Math_Back_Cut(index, sindex)">后切</el-button></el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row type="flex" justify="start" style="margin-bottom: 2vh">
                <span>本题分值：</span>
              </el-row>
              <el-row type="flex" justify="start" style="margin-bottom: 2vh">
                <el-input-number size="mini" v-model="testDataScore[index]"></el-input-number>
              </el-row>
              <el-row type="flex" justify="start" style="margin-bottom: 2vh">
                <span>正确答案：</span>
              </el-row>
              <el-row type="flex" justify="start" style="margin-bottom: 2vh">
                <el-input
                  type="textarea"
                  :rows="2"
                  :placeholder="'在此输入题目' + (index+1) + '的正确答案（可选）'"
                  resize="none"
                  v-model="Question.Answer"></el-input>
              </el-row>
              <el-row type="flex" justify="start" style="margin-bottom: 2vh">
                <span>解析内容：</span>
              </el-row>
              <el-row type="flex" justify="start">
                <el-input
                  type="textarea"
                  :rows="2"
                  :placeholder="'在此输入题目' + (index+1) + '的解析内容（可选）'"
                  resize="none"
                  v-model="Question.Analyse"></el-input>
              </el-row>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-button type="text" size="medium" :disabled="index == userCutTestData.length - 1" @click="Math_Merge_To_Back(index)">向后合并</el-button>
          </el-row>
        </el-row>
        <el-row style="margin-top: 2vh; margin-bottom: 3vh" type="flex" justify="center">
          <el-button @click="Re_Cut_TestData()" size="medium" type="success" plain>修正完成，再次切分</el-button>
        </el-row>
      </el-row>
    </el-dialog>
    <!-- 提供给非法输入格式的提示对话框 -->
    <el-dialog
        :visible.sync="showHint"
        title="非法输入格式提示"
        width="65%"
        @close="Editor_Dialog_Close()"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
      <el-row style="margin: 20px 0px 0px 0px">
        <el-col :span="4" style="text-align: left">
          合法的英文符号有：
        </el-col>
        <el-col :span="1" style="border: 1px dashed black; margin: 2px; font-size: 16px" v-for="(Sym, SymIndex) in en_pun_list" :key="'EN' + SymIndex.toString()" v-html="Sym">
        </el-col>
      </el-row>
      <el-row style="margin: 50px 0px">
        <el-col :span="4" style="text-align: left">
          合法的中文符号有：
        </el-col>
        <el-col :span="1" style="border: 1px dashed black; margin: 2px; font-size: 16px" v-for="(Sym, SymIndex) in ch_pun_list" :key="'CH' + SymIndex.toString()" v-html="Sym">
        </el-col>
      </el-row>
      <el-row style="margin: 50px 0px">
        <el-col :span="4" style="text-align: left">
          合法的简单数学符号有：
        </el-col>
        <el-col :span="1" style="border: 1px dashed black; margin: 2px; font-size: 16px" v-for="(Sym, SymIndex) in math_pun_list" :key="'MATH' + SymIndex.toString()" v-html="Sym">
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="font-size: 20px; color: red; font-weight: bold">
        请勿输入其他符号，如需输入，请使用题目录入上方的LUNA输入助手进行辅助
      </el-row>
    </el-dialog>
    <!-- 全卷预览 -->
    <el-dialog
        :visible.sync="paperShow"
        title="全卷预览"
        width="65%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
      <el-row v-for="(Question_Bundle, Bundle_Index) in Questions" :key="Bundle_Index">
          <!-- 第一行：大题编号，添加新的小题，题目类型，上移，下移，删除，题目说明 -->
          <el-row >
            <el-col :span="2" style="font-size: 18px; padding-top: 8px">
              <label><span>第{{Bundle_Index + 1}}大题</span></label>
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
                  </el-row>
                  <!-- 展开模式交给Display来负责，折叠模式为了避免样式报错，直接转换成文字格式 -->
                  <el-row>
                      <OptionDisplay v-if="Question.type == 'option'" :QI="Question" :Bundle_Index="'Bundle_' + Bundle_Index" :Sub_Index="'Sub_' + Question_Index"></OptionDisplay>
                      <FillDisplay v-else-if="Question.type == 'fill'" :QI="Question" :Bundle_Index="'Bundle_' + Bundle_Index" :Sub_Index="'Sub_' + Question_Index"></FillDisplay>
                      <AnswerDisplay v-else-if="Question.type == 'answer'" :QI="Question" :Bundle_Index="'Bundle_' + Bundle_Index" :Sub_Index="'Sub_' + Question_Index"></AnswerDisplay>
                      <MixDisplay v-else-if="Question.type == 'mix'" :QI="Question" :BI="'Bundle_' + Bundle_Index"></MixDisplay>
                  </el-row>
              </el-col>
          </el-row>
        </el-row>
    </el-dialog>
    <!-- 试卷导入，中间的区域预留了位置，但是功能还得等黄杰那边实现 -->
    <!-- 暂时是个展示功能，之后有需求的时候往进接一下那个算法就行了 -->
    <el-dialog
        :visible.sync="importPaperDialog"
        title="试卷文件导入（尚未开发完成，数学部分仍在测试过程当中）"
        width="90%"
        @close="Import_Paper_Dialog_Close()"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
        <el-row type="flex" justify="start">
          <label style="font-weight: bold; line-height: 40px; padding-left: 30px">请选择科目信息：</label>
          <el-select
            v-model="paper_type"
            placeholder="请选择"
            style="width: 180px; line-height: 40px"
          >
            <el-option value="0" label="英语"></el-option>
            <el-option value="1" label="数学"></el-option>
            <el-option value="4" label="语文"></el-option>
            <el-option value="2" label="文综"></el-option>
            <el-option value="3" label="理综"></el-option>
          </el-select>
          <label style="font-weight: bold; line-height: 40px; padding-left: 30px" v-if="paper_type == '1'">请选择学段信息：</label>
          <el-select v-model="PeriodType" placeholder="请选择学段" v-if="paper_type == '1'">
                <el-option
                  v-for="item in Period_List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          <label style="font-weight: bold; line-height: 40px; padding-left: 30px">*支持doc，docx格式的文件</label>
        </el-row>
        <!-- 数学试卷的不同输入类型 -->
        <el-row v-if="paper_type == '1'">
          <el-row
            type="flex"
            justify="start"
            style="padding-left: 30px; padding-top: 10px"
          >
            <label>请选择文件输入格式</label>
          </el-row>
          <el-row>
            <el-col
              :span="4"
              type="flex"
              justify="start"
              style="margin: 15px 0px; padding-left: 15px"
            >
              <el-radio v-model="math_input" label="paper">
                只输入考题文件
              </el-radio>
            </el-col>
            <el-col
              :span="4"
              type="flex"
              justify="start"
              style="margin: 15px 0px; padding-left: 15px"
            >
              <el-radio v-model="math_input" label="combine">
                考题与答案分开
              </el-radio>
            </el-col>
            <el-col
              :span="4"
              type="flex"
              justify="start"
              style="margin: 15px 0px; padding-left: 15px"
            >
              <el-radio v-model="math_input" label="mix">
                考题与答案同卷
              </el-radio>
            </el-col>
          </el-row>
        </el-row>
        <!-- 试卷输入的入口 -->
        <el-row type="flex" justify="start" v-if="paper_type != ''">
          <el-col :span="12" v-if="paper_type != '1' ">
            <el-row type="flex" justify="start" style="line-height: 40px">
              <div class="btn_file">
                <p style="display: inline-block">
                  <i class="el-icon-files"></i>选取试卷文件(doc/docx)
                </p>
                <input
                  type="file"
                  @change="selectFile($event)"
                  accept=".docx, .doc"
                  ref="eng_input"
                />
                <!-- <span>选择文件</span>
                <input type="file" @change="uploadPaper($event)" accept=".doc, .docx, .pdf"> -->
              </div>
              <p style="display: inline-block; margin-left: 30px; margin-top: 15px; padding-top: 5px;">
                名称：{{
                  fileName
              }}</p>
            </el-row>
          </el-col>
          <el-col :span="12" v-if="paper_type == '1'">
            <el-row type="flex" justify="start" style="line-height: 40px">
              <div class="btn_file">
                <p style="display: inline-block">
                  <i class="el-icon-files"></i>选取数学试卷文件(doc/docx)
                </p>
                <input
                  type="file"
                  @change="selectPaperFile($event)"
                  accept=".docx, .doc"
                  ref="math_paper_input"
                />
                <!-- <span>选择文件</span>
                <input type="file" @change="uploadPaper($event)" accept=".doc, .docx, .pdf"> -->
              </div>
              <p style="display: inline-block; margin-left: 30px; margin-top: 15px; padding-top: 5px;">
                名称：{{
                  mathPaperName
              }}</p>
            </el-row>
          </el-col>
          <el-col :span="12" v-if="paper_type == '1' && math_input == 'combine'">
            <el-row type="flex" justify="start" style="line-height: 40px">
              <div class="btn_file">
                <p style="display: inline-block">
                  <i class="el-icon-files"></i>选取数学答案文件(doc/docx)
                </p>
                <input
                  type="file"
                  @change="selectAnswerFile($event)"
                  accept=".docx, .doc"
                  ref="math_answer_input"
                />
                <!-- <span>选择文件</span>
                <input type="file" @change="uploadPaper($event)" accept=".doc, .docx, .pdf"> -->
              </div>
              <p style="display: inline-block; margin-left: 30px; margin-top: 15px; padding-top: 5px;">
                名称：{{
                  mathAnswerName
              }}</p>
            </el-row>
          </el-col>
        </el-row>
        <!-- 英语试卷内容导出 -->
        <el-row
          v-if="Type_Visible() && paper_type != '1'"
          style="padding-top: 15px"
        >
          <el-col :span="2" style="padding-top: 8px; padding-left: 15px">
            下载格式：
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start">
              <el-col :span="12">
                <el-radio
                  v-model="format"
                  label="1"
                  style="font-size: 16px; font-weight: bold; margin: 10px 0px"
                  >json格式</el-radio
                >
              </el-col>
              <el-col :span="12">
                <el-radio
                  v-model="format"
                  label="0"
                  style="font-size: 16px; font-weight: bold; margin: 10px 0px"
                  >txt格式</el-radio
                >
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="saveFile(format)" :disabled="Download_Show(format)">导出文件</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row type="flex" justify="center">
              <el-button v-if="!Hand_Cut_Mode" @click="Hand_Cut_Mode = true" type="text" style="color: #409EFD; font-weight: bold">开启自定义切分</el-button>
              <el-button v-if="Hand_Cut_Mode" @click="Hand_Cut_Mode = false" type="text" style="color: #FF7F50; font-weight: bold">关闭自定义切分</el-button>
            </el-row>
          </el-col>
        </el-row>
        <!-- 显示试卷标题 -->
        <el-row style="margin: 30px 50px 20px 50px" v-if="TestData.title">
            {{TestData.title}}
        </el-row>
        <!-- 再次确认科目和学段是否正确 -->
        <el-row style="margin: 0px 30px 0px 30px" type="flex" justify="start" v-if="paper_type == '1' && TestData.doc">
            <el-col :span="4">
              <p style="text-align: left">确认科目：</p>
              <el-select v-model="SubjectType" placeholder="请选择科目">
                <el-option
                  v-for="item in Subject_List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" :offset="2">
              <p style="text-align: left">确认学段：</p>
              <el-select v-model="PeriodType" placeholder="请选择学段">
                <el-option
                  v-for="item in Period_List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" :offset="10" style="line-height: 60px">
              <el-button @click="showHint = true" size="medium" type="danger">非法格式提示</el-button>
            </el-col>
        </el-row>
        <!-- 英语的手动切分过程 -->
        <el-row v-if="paper_type == '0'">
          <el-col
            v-for="(item, index_out) in file_item"
            :key="index_out"
            class="area_border"
          >
            <el-row type="flex" justify="center" v-if="Hand_Cut_Mode">
              <el-button
                type="text"
                size="medium"
                @click="Del(index_out, 'front')"
                :disabled="index_out == 0"
                >向前合并</el-button
              >
            </el-row>
            <el-row
              v-for="(i, index_in) in item"
              :key="index_in"
              :span="24"
              style="padding: 10px; margin: 1px;"
            >
              <el-row v-if="index_in == 0">
                <el-col
                  :span="22"
                  v-if="file_item_label[index_out] < 0"
                >
                  <label>--------------------题干分界线--------------------</label>
                </el-col>
                <el-col
                  :span="22"
                  v-if="file_item_label[index_out] > 0"
                >
                  <label>--------------------题目分界线--------------------</label>
                </el-col>
                <el-col :span="2" style="line-height: 30px">
                  <el-row type="flex" justify="center" style="padding-left: 30px">
                    <el-button type="text" @click="Transfer(index_out)"
                      >修改类型为{{
                        file_item_label[index_out] == -1 ? "题目" : "题干"
                      }}</el-button
                    >
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22">
                  <p class="title_message">
                    {{ i }}
                  </p>
                </el-col>
              </el-row>
              <!-- 1：不在末尾，2，是在手动切分状态下，3，段标签和行标签与当前相等 -->
              <el-row v-if="index_in < item.length - 1
                            && Hand_Cut_Mode
                            && index_out == Hand_Cut_Now[0]
                            && index_in == Hand_Cut_Now[1]"
                            type="flex" justify="center"
                            style="cursor: pointer"
                            @mouseleave.native="Hand_Cut_Clear()"
                            @mouseenter.native="Hand_Cut_Change(index_out, index_in)"
                            @click.native="English_Hand_Cut(index_out, index_in)">
                <span style="line-height: 30px; height: 30px;">-------------------------------</span>
                <i class="el-icon-scissors" style="font-size: 20px; padding-top: 5px"></i>
                <span style="line-height: 30px; height: 30px;">-------------------------------</span>
              </el-row>
              <el-row
                v-if="index_in < item.length - 1
                      && Hand_Cut_Mode
                      && (index_out != Hand_Cut_Now[0] || index_in != Hand_Cut_Now[1])"
                style="height: 10px; padding: 0px; margin: 4px 0px; border: 2px dashed #ccc"
                @mouseenter.native="Hand_Cut_Change(index_out, index_in)"
                @mouseleave.native="Hand_Cut_Clear()">
                <span>&nbsp;</span>
              </el-row>
              <el-row v-if="index_in == item.length - 1">
                <el-col
                  style="line-height: 30px"
                  :span="22"
                  v-if="file_item_label[index_out] < 0"
                >
                  <label>--------------------题干分界线--------------------</label>
                </el-col>
                <el-col
                  style="line-height: 30px"
                  :span="22"
                  v-if="file_item_label[index_out] > 0"
                >
                  <label>--------------------题目分界线--------------------</label>
                </el-col>
                <el-col :span="2" style="line-height: 30px">
                  <el-row type="flex" justify="center" style="padding-left: 30px">
                    <el-button type="text" @click="Transfer(index_out)"
                      >修改类型为{{
                        file_item_label[index_out] == -1 ? "题目" : "题干"
                      }}</el-button
                    >
                  </el-row>
                </el-col>
              </el-row>
            </el-row>
            <el-row type="flex" justify="center" v-if="Hand_Cut_Mode">
              <el-button
                type="text"
                size="medium"
                @click="Del(index_out, 'back')"
                :disabled="index_out == file_item.length - 1"
                >向后合并</el-button
              >
            </el-row>
          </el-col>
        </el-row>
        <!-- 文综，理综，语文的手动切分过程 -->
        <!-- LS原本指的是Liberal & Science，但是还要有新内容加进来的话缩写改起来没完了，就先不动了 -->
        <el-row v-if="paper_type != '0' && paper_type != '1'">
          <el-row
            v-for="(Para, Para_Index) in json_content"
            :key="'LS_Para_' + Para_Index"
            style="width: 85vw; margin-left: 1vw; margin-top: 30px; border: 2px dashed black; margin-bottom: 30px; background: rgba(0, 255, 255, 0.04);">
            <el-col :span="24">
              <el-row type="flex" justify="center" v-if="Hand_Cut_Mode">
                <el-button type="text" size="medium" :disabled="Para_Index == 0" @click="Merge_LS_To_Front(Para_Index)">
                  向前合并
                </el-button>
              </el-row>
              <el-row style="padding-left: 4vw; padding-right: 4vw; padding-top: 10px; padding-bottom: 5px">
                <el-col :span="22">
                  <label v-if="Para.is_question == 1" style="line-height: 30px">
                    --------------------题目分界线--------------------
                  </label>
                  <label v-if="Para.is_question == 0" style="line-height: 30px">
                    --------------------题干分界线--------------------
                  </label>
                </el-col>
                <el-col :span="2" style="line-height: 30px;">
                  <el-row
                    type="flex"
                    justify="center"
                  >
                    <el-button
                      type="text"
                      size="medium"
                      @click="LS_Para_Type_Change(Para_Index)"
                    >
                      修改类型为{{ Para.is_question == 1 ? "题干" : "题目" }}
                    </el-button>
                  </el-row>
                </el-col>
              </el-row>
              <el-row v-for="(Item, Item_Index) in Para.sub_para[0]" :key="'LS_P_SP_' + Item_Index" style="padding-left: 4vw; padding-right: 4vw">
                <el-col :span="22">
                  <el-row v-if="Item.para_type == '0'" :style="Item.para_style">
                    <span
                      v-for="(message, index_i) in Item.runs"
                      :key="index_i + 'run'"
                      :style="message.run_style"
                    >
                      <span
                        v-if="message.run_type == '0'"
                        v-html="message.run_text"
                      ></span>
                      <img
                        v-else-if="message.run_type == '1'"
                        :src="json_image_dict[message.image.src]"
                        :width="message.image.width"
                        :height="message.image.height"
                        :style="message.image.style"
                        :alt="message.image.alt"
                      />
                    </span>
                  </el-row>
                  <el-row v-if="Item.para_type == '1'">
                    <div :style="Item.para_style">
                      <span v-html="Table_Img_Get(Item.table_raw_html)"></span>
                    </div>
                  </el-row>
                  <!-- 1：不在末尾，2，是在手动切分状态下，3，段标签和行标签与当前相等 -->
                  <el-row v-if="Item_Index != Para.sub_para[0].length - 1
                                && Hand_Cut_Mode
                                && Para_Index == Hand_Cut_Now[0]
                                && Item_Index == Hand_Cut_Now[1]"
                                type="flex" justify="center"
                                style="cursor: pointer"
                                @mouseleave.native="Hand_Cut_Clear()"
                                @mouseenter.native="Hand_Cut_Change(Para_Index, Item_Index)"
                                @click.native="Hand_Cut(Para_Index, Item_Index)">
                    <span style="line-height: 30px; height: 30px;">-------------------------------</span>
                    <i class="el-icon-scissors" style="font-size: 20px; padding-top: 5px"></i>
                    <span style="line-height: 30px; height: 30px;">-------------------------------</span>
                  </el-row>
                  <el-row
                    v-if="Item_Index != Para.sub_para[0].length - 1
                          && Hand_Cut_Mode
                          && (Para_Index != Hand_Cut_Now[0] || Item_Index != Hand_Cut_Now[1])"
                    style="height: 10px; padding: 0px; margin: 4px 0px; border: 2px dashed #ccc"
                    @mouseenter.native="Hand_Cut_Change(Para_Index, Item_Index)"
                    @mouseleave.native="Hand_Cut_Clear()">
                    <span>&nbsp;</span>
                  </el-row>
                </el-col>
                <!-- <el-col :span="3">
                  <el-row type="flex" justify="center">
                    <el-button
                      type="text"
                      size="small"
                      @click="LS_Cut_Front(Para_Index, Item_Index)"
                      :disabled="Item_Index == 0"
                      style="margin-right: 30px"
                      >前切</el-button
                    >
                    <el-button
                      type="text"
                      size="small"
                      @click="LS_Cut_Back(Para_Index, Item_Index)"
                      :disabled="Item_Index == Para.sub_para[0].length - 1"
                      >后切</el-button
                    >
                  </el-row>
                </el-col> -->
              </el-row>
              <el-row style="padding-left: 4vw; padding-right: 4vw; padding-bottom: 10px; padding-top: 5px">
                <el-col :span="22">
                  <label v-if="Para.is_question == 1" style="line-height: 30px">
                    --------------------题目分界线--------------------
                  </label>
                  <label v-if="Para.is_question == 0" style="line-height: 30px">
                    --------------------题干分界线--------------------
                  </label>
                </el-col>
                <el-col :span="2" style="line-height: 30px">
                  <el-row
                    type="flex"
                    justify="center"
                  >
                    <el-button
                      type="text"
                      size="medium"
                      @click="LS_Para_Type_Change(Para_Index)"
                    >
                      修改类型为{{ Para.is_question == 1 ? "题干" : "题目" }}
                    </el-button>
                  </el-row>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center" v-if="Hand_Cut_Mode">
                <el-button type="text" size="medium" :disabled="Para_Index == json_content.length - 1" @click="Merge_LS_To_Back(Para_Index)">
                  向后合并
                </el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-row>
        <!-- 转换过程的加载区域 -->
        <el-row
          v-if="file_item.length == 0 && !(TestData.doc)"
          v-loading="loading"
          :element-loading-text="Waiting_Text"
          element-loading-spinner="el-icon-loading"
          style="height: 300px"
          >

        </el-row>
        <!-- 顶部确认入库按钮 -->
        <el-row style="margin: 30px 50px" v-if="paper_type == '1' && TestData.doc">
          <el-col :span="6" :offset="6">
            <el-button v-if="Submit_Show" @click="Ensure()" type="success" plain>
              确认入库
            </el-button>
            <el-button v-else @click="Check_All()" type="success" plain>
              全部确认
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button @click="User_Cut_Math()" type="success" plain>手动切分</el-button>
          </el-col>
        </el-row>
        <!-- 数学，内容确认区域 -->
        <el-row v-for="(Question_Info, Question_Index) in TestData.doc" :key="Question_Index" style="border: 3px dashed black; background: #F8FBFF; margin: 30px">
            <!-- 题型，上传用户，科目部分 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px 0px 50px">
                <el-col :span="1" style="text-align: left">
                  <el-popover
                    placement="top"
                    width="170"
                    trigger="hover"
                    v-if="Question_Check[Question_Index] == false"
                    content="点击完成该题目确认">
                    <el-button
                      slot="reference"
                      circle size="medium"
                      @click="Question_Check.splice(Question_Index, 1, true)"
                      type="success"
                      ><i class="el-icon-check"></i></el-button>
                  </el-popover>
                  <el-popover
                    placement="top"
                    width="170"
                    trigger="hover"
                    v-if="Question_Check[Question_Index] == true"
                    content="点击取消确认该题目">
                    <el-button
                      slot="reference"
                      circle size="medium"
                      @click="Question_Check.splice(Question_Index, 1, false)"
                      type="danger"><i class="el-icon-edit"></i></el-button>
                  </el-popover>
                </el-col>
                <el-col :span="2" style="text-align: left; padding-top: 1.2vh">
                    {{Question_Info.question_type}}
                </el-col>
                <el-col :span="3" style="text-align: left; padding-top: 1.2vh">
                    提交者：{{Question_Info.source}}
                </el-col>
                <el-col :span="3" style="text-align: left; padding-top: 1.2vh">
                    科目：{{Question_Info.subject}}
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="margin: 30px 50px; height: 26px; line-height: 26px">
              <label style="margin-right: 20px">本题分值：</label>
              <el-input-number size="mini" v-model="testDataScore[Question_Index]"></el-input-number>
              <label style="margin-left: 20px">分</label>
            </el-row>
            <!-- 题干部分 - 无小题 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px;">
                <!-- <p style="text-align: left" v-html="Get_Question_Show(Question_Info.question_stem, 'stem')"></p> -->
              <el-col :span="1" v-if="Question_Check[Question_Index] == false">
                <el-row type="flex" justify="start">
                    <el-button @click="Show_Part(Question_Index, 'stem')" size="small">{{Get_Button_Label(Question_Index, 'stem')}}</el-button>
                </el-row>
              </el-col>
              <el-col :span="21" style="padding-top: 7px; padding-left: 1vw">
                <el-row type="flex" justify="start">
                  <Mathdown :content="Get_Question_Show(Question_Info.question_stem, 'stem', Question_Index)" style="width: 84vw;" :name="Get_Name(Question_Index, 'stem')"/>
                </el-row>
                <el-row type="flex" justify="start">
                  <ComplexInput
                    v-if="Show_ComplexInput(Question_Index, 'stem')"
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Question_Show(Question_Info.question_stem, 'stem', Question_Index).substring(5)"
                    :Mathdown_Special="'Q_' + Question_Index + '_Stem'"></ComplexInput>
                </el-row>
              </el-col>
            </el-row>
            <!-- 题干部分 - 有小题 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px;"
              v-for="(Sub_Question, Sub_Question_Index) in Question_Info.sub_questions" :key="Sub_Question_Index">
                <!-- <p style="text-align: left" v-html="Get_Question_Show(Question_Info.question_stem, 'stem')"></p> -->
              <el-col :span="1" v-if="Question_Check[Question_Index] == false">
                <el-row type="flex" justify="start">
                    <el-button @click="Show_Part(Question_Index, 'sub_question', Sub_Question_Index)" size="small">{{Get_Button_Label(Question_Index, 'sub_question', Sub_Question_Index)}}</el-button>
                </el-row>
              </el-col>
              <el-col :span="21" style="padding-top: 7px; padding-left: 1vw">
                <el-row type="flex" justify="start">
                  <Mathdown :content="Get_Sub_Question(Sub_Question, Question_Index, Sub_Question_Index)" style="width: 84vw;" :name="Get_Name(Question_Index, 'sub_question', Sub_Question_Index)"/>
                </el-row>
                <el-row type="flex" justify="start">
                  <ComplexInput
                    v-if="Show_ComplexInput(Question_Index, 'sub_question', Sub_Question_Index)"
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Sub_Question(Sub_Question, Question_Index, Sub_Question_Index)"
                    :Mathdown_Special="'Q_' + Question_Index + '_SQI_' + Sub_Question_Index"></ComplexInput>
                </el-row>
              </el-col>
            </el-row>
            <!-- 选项部分 -->
            <el-row type="flex" justify="start" style="margin: 20px 50px"
                    v-for="(Question_Option, Option_Index) in Question_Info.question_options"
                    :key="Option_Index" >
              <!-- <p style="text-align: left" v-html="Get_Question_Options(Question_Option, Option_Index)"></p>
                -->
              <el-col :span="1" v-if="Question_Check[Question_Index] == false">
                <el-row type="flex" justify="start">
                    <el-button @click="Show_Part(Question_Index, 'option', Option_Index)" size="small">{{Get_Button_Label(Question_Index, 'option', Option_Index)}}</el-button>
                </el-row>
              </el-col>
              <el-col :span="21" style="padding-top: 7px; padding-left: 1vw">
                <el-row type="flex" justify="start">
                  <Mathdown :content="Get_Question_Options(Question_Option, Option_Index, Question_Index)" style="width: 80vw;"  :name="Get_Name(Question_Index, 'option', Option_Index)"/>
                </el-row>
                <el-row type="flex" justify="start">
                  <ComplexInput
                    v-if="Show_ComplexInput(Question_Index, 'option', Option_Index)"
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Question_Options(Question_Option, Option_Index, Question_Index).substring(4)"
                    :Mathdown_Special="'Q_' + Question_Index + '_Option_' + Option_Index"></ComplexInput>
                </el-row>
              </el-col>
              <!-- <el-row type="flex" justify="start" style="margin: 30px 50px; background: red" v-if="Show_ComplexInput(Question_Index, 'option', Option_Index)">
                <ComplexInput
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Question_Options(Question_Option, Option_Index)"></ComplexInput>
              </el-row> -->
            </el-row>
            <!-- 答案部分 -->
            <el-row type="flex" justify="start" style="margin: 20px 50px" v-for="(Answer, Answer_Index) in Question_Info.answer" :key="Question_Index + 'Answer_' + Answer_Index">
               <!-- <p style="text-align: left" v-html="Get_Question_Show(Question_Info.answer, 'answer')"></p> -->
               <el-col :span="1" v-if="Question_Check[Question_Index] == false">
                 <el-row type="flex" justify="start">
                    <el-button @click="Show_Part(Question_Index, 'answer', Answer_Index)" size="small">{{Get_Button_Label(Question_Index, 'answer', Answer_Index)}}</el-button>
                 </el-row>
               </el-col>
               <el-col :span="21" style="padding-top: 7px; padding-left: 1vw">
                 <el-row type="flex" justify="start">
                  <Mathdown :content="Get_Question_Show(Answer, 'answer', Question_Index, Answer_Index)" style="width: 80vw;"  :name="Get_Name(Question_Index, 'answer', Answer_Index)"/>
                 </el-row>
                 <el-row type="flex" justify="start">
                  <ComplexInput
                    v-if="Show_ComplexInput(Question_Index, 'answer', Answer_Index)"
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Question_Show(Answer, 'answer', Question_Index, Answer_Index).substring(6)"
                    :Mathdown_Special="'Q_' + Question_Index + '_Answer'"></ComplexInput>
                 </el-row>
               </el-col>
            </el-row>
            <!-- 解析部分 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px">
                <!-- <p style="text-align: left" v-html="Get_Question_Show(Question_Info.analysis, 'analyse')"></p> -->
              <el-col :span="1" v-if="Question_Check[Question_Index] == false">
                <el-row type="flex" justify="start">
                    <el-button @click="Show_Part(Question_Index, 'analyse')" size="small">{{Get_Button_Label(Question_Index, 'analyse')}}</el-button>
                </el-row>
              </el-col>
              <el-col :span="21" style="padding-top: 7px; padding-left: 1vw">
                <el-row type="flex" justify="start">
                  <Mathdown :content="Get_Question_Show(Question_Info.analysis, 'analyse', Question_Index)" style="width: 80vw;"  :name="Get_Name(Question_Index, 'analyse')"/>
                </el-row>
                <el-row type="flex" justify="start">
                  <ComplexInput
                    v-if="Show_ComplexInput(Question_Index, 'analyse')"
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Question_Show(Question_Info.analysis, 'analyse', Question_Index).substring(5)"
                    :Mathdown_Special="'Q_' + Question_Index + '_Analyse'"></ComplexInput>
                </el-row>
              </el-col>
            </el-row>
        </el-row>
        <!-- 英语，文件导出区域 -->
        <el-row v-if="paper_type != '1'">
          <el-button type="primary" @click="saveFile(format)" :disabled="Download_Show(format)">导出文件</el-button>
        </el-row>
        <!-- 数学，文件导出区域 -->
        <el-row v-if="paper_type == '1' && TestData.doc">
          <el-col :span="4" :offset="2">
            <el-button v-if="Submit_Show" @click="Ensure()" type="success" plain>
              确认入库
            </el-button>
            <el-button v-else @click="Check_All()" type="success" plain>
              全部确认
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-button @click="User_Cut_Math()" type="success" plain>手动切分</el-button>
          </el-col>
          <el-col :span="4">
            <el-button :disabled="downloadPaper == ''" @click="saveMathFile(0)" type="primary" plain>
              下载试卷原Json文件
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-button :disabled="downloadAnswer == ''"
              @click="saveMathFile(1)"
              type="primary" plain>
              下载答案原Json文件
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-button :disabled="downloadAnswer == ''"
              @click="saveMathFile(2)"
              type="primary" plain>
              下载合并Json文件
            </el-button>
          </el-col>
        </el-row>
    </el-dialog>
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
                    <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput :Mathdown_Special="'inputPaper_Option'"></ComplexInput>
                <el-row>
                    <el-button @click="complex_Input = false"><label>隐藏并清空</label></el-button>
                </el-row>
            </el-col>
            <el-col v-if="!complex_Input">
                <el-row>
                    <el-button @click="complex_Input = true"><label>显示LUNA输入助手</label></el-button>
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
                    <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput :Mathdown_Special="'inputPaper_Fill'"></ComplexInput>
                <el-row>
                    <el-button @click="complex_Input = false"><label>隐藏并清空</label></el-button>
                </el-row>
            </el-col>
            <el-col v-if="!complex_Input">
                <el-row>
                    <el-button @click="complex_Input = true"><label>显示LUNA输入助手</label></el-button>
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
                    <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput :Mathdown_Special="'inputPaper_Answer'"></ComplexInput>
                <el-row>
                    <el-button @click="complex_Input = false"><label>隐藏并清空</label></el-button>
                </el-row>
            </el-col>
            <el-col v-if="!complex_Input">
                <el-row>
                    <el-button @click="complex_Input = true"><label>显示LUNA输入助手</label></el-button>
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
    <!-- 提供给非选择题的编辑器 -->
    <el-dialog
        :visible.sync="showDialog_Mix"
        title="请编辑想要插入/修改的非选择题内容"
        width="65%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
        <el-row>
            <el-col v-if="complex_Input">
                <el-row>
                    <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput :Mathdown_Special="'inputPaper_Mix'"></ComplexInput>
                <el-row>
                    <el-button @click="complex_Input = false"><label>隐藏并清空</label></el-button>
                </el-row>
            </el-col>
            <el-col v-if="!complex_Input">
                <el-row>
                    <el-button @click="complex_Input = true"><label>显示LUNA输入助手</label></el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <MixQuestions
            @EditFinish_Mix="New_Questions"
            @ReEditFinish_Mix="ReEdit_Questions"
            :RE.sync="ReEditSwitch"
            :QInfos.sync="Temp_MixQuestionInfo"
        ></MixQuestions>
    </el-dialog>
    <el-row justify="start" type="flex">
      <el-col style="padding-left: 25px">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>资源录入</el-breadcrumb-item>
          <el-breadcrumb-item>试卷资源
            <span @click="openInstructionDialog" style="cursor:pointer;">
            <i class="el-icon-question"></i>
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <instruction ref="instruction"/>
    <el-row>
      <el-col :span="4" style="padding-bottom: 50px; margin-top: 30px">
        <!-- 切换页面 -->
        <el-row type="flex" justify="center">
          <el-button type="warning" plain @click="Router_Trans('/inputMarked')" style="width: 200px; font-size: 16px">
            <span style="font-weight: bold">
              切换至单题录入页面
            </span>
          </el-button>
        </el-row>
        <!-- 不同题型 -->
        <el-row style="padding-top: 30px;">
          <el-row>
            <el-col :span="6" style="font-size: 20px">
              <i v-if="Expand" @click="Expand_Type_Change()" class="el-icon-arrow-down"></i>
              <i v-if="!Expand" @click="Expand_Type_Change()" class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="8" style="text-align: left; font-size: 20px">
              添加题包
            </el-col>
            <el-col :span="9">
              <el-button @click="showHint = true" size="mini" type="danger" plain>非法格式提示</el-button>
            </el-col>
          </el-row>
          <!-- Option -->
          <el-row style="margin-top: 10px" v-if="Expand">
            <el-col :span="18" :offset="6" style="text-align: left; font-size: 20px">
              <i class="el-icon-circle-check"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Add_Question_List('option')">选择题</el-button>
            </el-col>
          </el-row>
          <!-- Fill -->
          <el-row v-if="Expand">
            <el-col :span="18" :offset="6" style="text-align: left; font-size: 20px">
              <i class="el-icon-full-screen"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Add_Question_List('fill')">填空题</el-button>
            </el-col>
          </el-row>
          <!-- Answer -->
          <el-row v-if="Expand">
            <el-col :span="18" :offset="6" style="text-align: left; font-size: 20px">
              <i class="el-icon-edit-outline"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Add_Question_List('answer')">解答题</el-button>
            </el-col>
          </el-row>
          <!-- Mix -->
          <el-row v-if="Expand">
            <el-col :span="18" :offset="6" style="text-align: left; font-size: 20px">
              <i class="el-icon-reading"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Add_Question_List('mix')">综合题</el-button>
            </el-col>
          </el-row>
        </el-row>
        <el-row type="flex" justify="center" style="padding-top: 30px">
          <el-button type="primary" plain style="width: 200px; font-size: 16px" @click="Import_Paper_Dialog_Open()">
            <label>文件导入</label>
          </el-button>
        </el-row>
        <el-row type="flex" justify="center" style="padding-top: 30px">
          <el-button type="primary" @click="paperShow = true" plain style="width: 200px; font-size: 16px"  :disabled="Blank_Paper()">
            <label>预览全卷</label>
          </el-button>
        </el-row>
        <el-row
          v-loading="Uploading"
          element-loading-text="正在上传此试卷..."
          element-loading-spinner="el-icon-loading"
          type="flex" justify="center" style="padding-top: 30px">
          <el-button type="success" plain style="width: 200px; font-size: 16px" @click="PaperUpload('upload')" :disabled="Blank_Paper()">
            <label>题目入库</label>
          </el-button>
        </el-row>
        <el-row type="flex" justify="center" style="padding-top: 30px" v-if="Authority_Check()" >
          <el-button type="warning" plain style="width: 200px; font-size: 16px" @click="PaperUpload('export')" :disabled="Blank_Paper()">
            <label>导出题目</label>
          </el-button>
        </el-row>
        <el-row
          v-loading="downloading"
          element-loading-text="加载中，请等待"
          element-loading-spinner="el-icon-loading"
          type="flex"
          justify="center"
          style="margin-top: 30px">
            <el-button type="warning" plain style="width: 200px; font-size: 16px" @click="PaperUpload('download')" :disabled="Blank_Paper()">
              <label>下载试卷</label>
            </el-button>
        </el-row>
        <!-- <el-row type="flex" justify="center" style="padding-top: 30px; font-size: 18px">
          <el-col :span="14">
          <label>导出序号：</label>
            <el-switch
              v-model="Sequence_Questions"
              active-color="#47A9FF"
              inactive-color="#ccc"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </el-col>
          <el-col :span="6">
            <label v-if="Sequence_Questions == '1'">连续</label>
            <label v-else-if="Sequence_Questions == '0'">不连续</label>
          </el-col>
        </el-row> -->
      </el-col>
      <el-col :span="19" style="background: #F8FBFF; padding-top: 40px; min-height: 70.8vh; margin-top: 30px">
        <!-- 确认学科和学段的选择项 -->
        <el-row style="margin: 0px 50px" type="flex" justify="start">
            <el-col :span="4">
              <p style="text-align: left">选择科目：</p>
              <el-select v-model="SubjectType" placeholder="请选择科目">
                <el-option
                  v-for="item in Subject_List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" :offset="2">
              <p style="text-align: left">选择学段：</p>
              <el-select v-model="PeriodType" placeholder="请选择学段">
                <el-option
                  v-for="item in Period_List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12" :offset="2">
              <p style="text-align: left">试卷名称：</p>
              <el-input v-model="PaperTitle" placeholder="请输入试卷名称"></el-input>
            </el-col>
        </el-row>
        <el-row v-for="(Question_Bundle, Bundle_Index) in Questions" :key="Bundle_Index">
          <!-- 第一行：大题编号，添加新的小题，题目类型，上移，下移，删除，题目说明 -->
          <el-row style="margin-top: 20px">
            <el-col :span="2" style="font-size: 18px; padding-top: 8px">
              <label>第{{Bundle_Index + 1}}大题</label>
            </el-col>
            <el-col :span="2" style="font-size: 18px; padding-top: 8px">
              <label>{{Get_Bundle_Type_Label(Question_Bundle)}}</label>
            </el-col>
            <el-col :span="1" style="padding-top: 5px">
              <el-button circle plain size="small" type="message" @click="New_Question(Bundle_Index, Question_Bundle)">
                <i class="el-icon-plus"></i>
              </el-button>
            </el-col>
            <el-col :span="2" style="padding-top: 5px">
              <el-button-group>
                <el-button circle plain size="small" type="message" @click="Bundle_Up(Bundle_Index)" :disabled="Bundle_Index == 0">
                  <i class="el-icon-arrow-up"></i>
                </el-button>
                <el-button circle plain size="small" type="message" @click="Bundle_Down(Bundle_Index)" :disabled="Bundle_Index == Questions.length - 1">
                  <i class="el-icon-arrow-down"></i>
                </el-button>
              </el-button-group>
            </el-col>
            <el-col :span="1" style="padding-top: 5px">
              <el-button circle plain size="small" type="message" @click="Bundle_Delete(Bundle_Index)">
                <i class="el-icon-delete"></i>
              </el-button>
            </el-col>
            <el-col :span="12" :offset="1">
              <el-input v-model="Question_Bundle.Bundle_Introduce" placeholder="大题说明"></el-input>
            </el-col>
          </el-row>
          <!-- 之后的每一行，读取这个大题中的一个题目，然后进行对应的渲染 -->
          <el-row v-for="(Question, Question_Index) in Question_Bundle.Bundle_Questions" :key="Question_Index">
              <el-col style="margin-left: 50px; margin-top: 5px">
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
                  <el-row v-if="Question_Bundle.Bundle_Questions_Collapse[Question_Index] == false"  style="text-align: left">
                      <OptionDisplay v-if="Question.type == 'option'" :QI="Question" :Bundle_Index="'Bundle_' + Bundle_Index" :Sub_Index="'Sub_' + Question_Index"></OptionDisplay>
                      <FillDisplay v-else-if="Question.type == 'fill'" :QI="Question" :Bundle_Index="'Bundle_' + Bundle_Index" :Sub_Index="'Sub_' + Question_Index"></FillDisplay>
                      <AnswerDisplay v-else-if="Question.type == 'answer'" :QI="Question" :Bundle_Index="'Bundle_' + Bundle_Index" :Sub_Index="'Sub_' + Question_Index"></AnswerDisplay>
                      <MixDisplay v-else-if="Question.type == 'mix'" :QI="Question" :BI="'Bundle_' + Bundle_Index"></MixDisplay>
                  </el-row>
                  <el-row v-if="Question_Bundle.Bundle_Questions_Collapse[Question_Index]" style="text-align: left; font-size: 14px; padding-left: 22px">
                      <label>{{Get_Collapse_Show(Question)}}</label>
                  </el-row>
              </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import FileSaver from "file-saver";

import OptionDisplay from './components/OptionDisplay.vue'
import OptionQuestions from './components/OptionQuestions.vue'
import FillQuestions from "./components/FillQuestions.vue"
import FillDisplay from "./components/FillDisplay.vue";
import AnswerQuestions from "./components/AnswerQuestions.vue";
import AnswerDisplay from "./components/AnswerDisplay.vue";
import MixQuestions from "./components/MixQuestions.vue";
import MixDisplay from "./components/MixDisplay.vue";
import Instruction from './components/InstructionPaper.vue'

import Mathdown from "../../common/components/Mathdown.vue";
import ComplexInput from '../../common/components/ComplexInput.vue'

export default {
  components: { ComplexInput,
                OptionDisplay, OptionQuestions,
                FillQuestions, FillDisplay,
                AnswerQuestions, AnswerDisplay,
                MixQuestions, MixDisplay, Mathdown,Instruction
                },
  data() {
    return {
      // 是否展开题包
      Expand: true,
      // 待选科目
      Subject_List: [{
        value: "语文",
        label: "语文"
      },{
        value: "数学",
        label: "数学"
      },{
        value: "英语",
        label: "英语"
      },{
        value: "历史",
        label: "历史"
      },{
        value: "政治",
        label: "政治"
      },{
        value: "地理",
        label: "地理"
      },{
        value: "物理",
        label: "物理"
      },{
        value: "化学",
        label: "化学"
      },{
        value: "生物",
        label: "生物"
      },{
        value: "其他",
        label: "其他"
      }],
      // 待选学段
      Period_List: [{
        value: "小学",
        label: "小学"
      },{
        value: "初中",
        label: "初中"
      },{
        value: "高中",
        label: "高中"
      },{
        value: "大学",
        label: "大学"
      },{
        value: "成人",
        label: "成人"
      },{
        value: "其他",
        label: "其他"
      }],
      // 用于选择科目和学段
      SubjectType: "数学",
      PeriodType: "高中",
      // 试卷标题
      PaperTitle: "",
      // 用于标记是否有非法字符
      Symbol_Error: false,
      // 用于输入符号提示的部分
      en_pun_list: [',','.','?','!',':',';','\'','"','(',')','&nbsp','_','/','|','\\','<','>'],
      ch_pun_list: ['，','。','！','？','：','；','‘','’','“','”','（','）','&nbsp','、','《','》'],
      math_pun_list: ['+', '-', "*", "/", "%", "="],
      TestData:{
        // "title": "2009年课标甲乙",
        //       "subject_type": "数学",
        //       "period_type": "高中",
        //       "doc": [
        //         {
        //           "question_stem": "已知集合$A = \\{ 0,2 \\}$，$B = \\{ - 2 , - 1,0,1,2 \\}$,则$A \\cap B =$",
        //           "question_options": [ "$\\{ 0,2 \\}$", "$\\{ 1,2 \\}$", "$\\{ 0 \\}$", "$\\{ - 2 , - 1,0,1,2 \\}$" ],
        //           "question_type": "选择题",
        //           "sub_questions": [],
        //           "answer": "A",
        //           "analysis": "",
        //           "source": "user_input",
        //           "subject": "user_input"
        //         }
        //         ]
      },

      Question_Edit_Now: -1,
      Question_Edit_Part: "",
      Question_Edit_Option_Index: -1,
      Question_Edit_Sub_Ques_Index: -1,
      Question_Edit_Answer_Index: -1,
      Question_Check: [],
      Submit_Show: false,

      Sequence_Questions: "1",
      // 是否显示导入试卷的对话框
      importPaperDialog: false,
      // 选择题编辑器,填空题编辑器和解答题编辑器的显示控制
      showDialog: false,
      showDialog_Fill: false,
      showDialog_Answer: false,
      showDialog_Mix: false,
      // 非法输入格式提示
      showHint: false,
      // 打开LUNA输入助手的控制
      complex_Input: false,
      // 题目信息和折叠信息
      Questions_Collapse: [],
      // 重写编辑标记
      ReEditSwitch: false,
      // 两个临时存放用的Json变量
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
      Temp_MixQuestionInfo: {
          type: "mix",
          score: 0,
          content: "",
          content_images: [],
          answer: "",
          answer_images: [],
          sub_questions: [],
          sub_questions_collapse: [],
          analyse: "",
          analyse_images: [],
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
      Question_Bundle_Add_Index: -1,
      // 全卷内容预览
      paperShow: false,
      // 以下是需要对导入试卷时的数据进行保存的数据字段
      changecss: 1,
      // 读取返回json用的字段
      json_content: "",
      // 文综理综以及后续课目用的，图片保存字段
      json_image_dict: "",
      // 数学专用，答案JSON
      answer_content: "",
      // 保存英语的txt格式的字段
      txt_content: "",
      // 保存英语试卷名称的字段
      fileName: "",
      // 确认下载格式字段
      format: "3",
      loading: false,
      // 保存英语显示内容的字段，data代表每个大段的内容，item代表每段里面有些什么内容要显示
      file_data: [],
      file_item: [],
      // file_item属于的标签号，现在只有1或-1了，1代表题目，-1代表题干，判断用大于小于0
      file_item_label: [],
      json_return: {
        "paper_title": "",
        "type": "",
        "segment_num": 0,
        "paper": []
      },
      // 试卷的分类，0 - 英语,1 - 数学
      paper_type: '',
      // 数学试卷的输入类型
      math_input: "paper",
      mathPaperName: "",
      mathAnswerName: "",
      // 标记试题与答案分段上传的进度
      // "-1": 都没上传; "0": 上传了试卷; "1": 上传了答案; "2": 都上传完了
      math_standby: "-1",
      // 临时中转试题与答案文件
      temp_File: "",
      // 存储用于给用户下载的JSON文件的变量
      downloadPaper: "",
      downloadAnswer: "",
      // 下载用的json名称
      downloadPaperName: "",
      downloadAnswerName: "",
      // 下载doc/docx格式时用的等待变量
      downloading: false,
      // 分析报告的等待
      analysing: false,
      // 上传过程的等待
      Uploading: false,
      // 等待信息
      Waiting_Text: "切分试卷中，请等待......",
      // 用户手动切分数学试卷
      userCutMath: false,
      // 手动切分时的试卷内容
      userCutTestData: [],
      // TestData对应的分值
      testDataScore: [],
      // 用于标记手动切分当前点是否替换为剪刀标记的标记项
      Hand_Cut_Now: [-1, -1],
      // 用于标记当前是否是手动切分模式的变量
      Hand_Cut_Mode: false
    };
  },
  computed: {
    total_score: {
      get: function() {
        let totalScore = 0;
        const reg = /[\d|.]+/g;
        for (const option of this.option_content) {
          const regResult = option.optionQuestion.score.match(reg);
          if (regResult != null) {
            totalScore += parseInt(regResult[0]);
          }
        }
        for (const fill of this.fill_content) {
          const regResult = fill.fillQuestion.score.match(reg);
          if (regResult != null) {
            totalScore += parseInt(regResult[0]);
          }
        }
        for (const answer of this.answer_content) {
          const regResult = answer.answerQuestion.score.match(reg);
          if (regResult != null) {
            totalScore += parseInt(regResult[0]);
          } else if (answer.answerQuestion.sub_score.length > 0) {
            for (const score of answer.answerQuestion.sub_score) {
              const regSubResult = score.match(reg);
              if (regSubResult != null) {
                totalScore += parseInt(regSubResult[0]);
              }
            }
          }
        }
        for (const mix of this.mix_content) {
          const regResult = mix.mixQuestion.score.match(reg);
          if (regResult != null) {
            totalScore += parseInt(regResult[0]);
          } else if (mix.mixQuestion.sub_score.length > 0) {
            for (const score of mix.mixQuestion.sub_score) {
              const regSubResult = score.match(reg);
              if (regSubResult != null) {
                totalScore += parseInt(regSubResult[0]);
              }
            }
          }
        }
        return totalScore;
      },
      set: function(value) {
        this.total_score = value;
      }
    },
    total_question: function() {
      let total = 0;
      total +=
        this.option_content.length +
        this.fill_content.length +
        this.answer_content.length +
        this.mix_content.length;
      return total;
    }
  },
  watch: {
    default_subject: function() {
      this.deleteAllCard();
    },
    Question_Check(val){

      var Flag = true

      for(var c = 0; c < val.length; c++){
        if(!val[c]){
          Flag = false
          this.Submit_Show = false;
        }
      }

      if(Flag){
        this.Ensure();
      }

      Flag = true
    },
    paper_type(newVal, oldVal){
      if(newVal != oldVal){
        this.Clear();
        this.fileName = "";
        this.mathPaperName = "";
        this.mathAnswerName = "";
        this.paper_type = newVal;
        this.downloadPaperName = "",
        this.downloadAnswerName = ""
      }
    },
    math_input(newVal, oldVal){
      if(newVal != oldVal){
        this.Clear();
        this.fileName = "";
        this.mathPaperName = "";
        this.mathAnswerName = "";
        this.math_input = newVal;
        this.downloadPaperName = "",
        this.downloadAnswerName = ""
      }
    },
  },
  mounted(){
    this.ToTop();
  },
  methods: {
    openInstructionDialog(){
      this.$refs.instruction.openDialog();
    },
    // 替换文理综的前后切的新方法：手动切分
    // 1：替换当前显示为剪刀的标记位置
    Hand_Cut_Change(Para_Index, Item_Index){
      this.Hand_Cut_Now = [Para_Index, Item_Index]
    },
    // 2：重置标记位置
    Hand_Cut_Clear(){
      this.Hand_Cut_Now = [-1, -1]
    },
    // 3：进行手动切分
    Hand_Cut(Para_Index, Item_Index){
      var Temp_Item = JSON.parse(JSON.stringify(this.json_content[Para_Index]));
      Temp_Item.sub_para[0].splice(Item_Index + 1, Temp_Item.sub_para[0].length);
      this.json_content[Para_Index].sub_para[0].splice(0, Item_Index + 1);
      this.json_content.splice(Para_Index, 0, Temp_Item);
    },
    // // 文综，理综，前切后切
    // LS_Cut_Front(Para_Index, Item_Index){
    //   var Temp_Item = JSON.parse(JSON.stringify(this.json_content[Para_Index]));
    //   Temp_Item.sub_para[0].splice(Item_Index, Temp_Item.sub_para[0].length);
    //   this.json_content[Para_Index].sub_para[0].splice(0, Item_Index);
    //   this.json_content.splice(Para_Index, 0, Temp_Item);
    // },
    // LS_Cut_Back(Para_Index, Item_Index){
    //   var Temp_Item = JSON.parse(JSON.stringify(this.json_content[Para_Index]));
    //   Temp_Item.sub_para[0].splice(Item_Index + 1, Temp_Item.sub_para[0].length);
    //   this.json_content[Para_Index].sub_para[0].splice(0, Item_Index + 1);
    //   this.json_content.splice(Para_Index, 0, Temp_Item);
    // },
    // 修改文综，理综的段落类型
    LS_Para_Type_Change(Para_Index){
      if(this.json_content[Para_Index].is_question == 0){
        this.json_content[Para_Index].is_question = 1
        return
      }else{
        this.json_content[Para_Index].is_question = 0
        return
      }
    },
    // 更新表格中的图片文件
    Table_Img_Get(Table_Html){
      for(var key in this.json_content.img){
        var Img_Name_Catcher = new RegExp('<img src="' + key + '"')
        if(Img_Name_Catcher.exec(Table_Html) != null){
          Table_Html = Table_Html.replace(Img_Name_Catcher,'<img src="' + this.json_content.img[key] + '"')
        }
      }
      return Table_Html
    },
    // 向前合并文理综试题
    Merge_LS_To_Front(Para_Index){

      if(this.json_content[Para_Index].is_question != this.json_content[Para_Index - 1].is_question){
        this.$confirm("你想合并的两部分类型不一致，请选择合并后的类型", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: '题干',
          cancelButtonText: '题目',
          type: "info",
          confirmButtonClass: "confirmButton",
          cancelButtonClass: "confirmButton"
        }).then(() => {
          this.json_content[Para_Index].is_question = 0
          this.json_content[Para_Index - 1].is_question = 0
        })
        .catch((action) => {
          if(action == "cancel"){
            this.json_content[Para_Index].is_question = 1
            this.json_content[Para_Index - 1].is_question = 1
          }else{
            return
          }
        })
      }

      for(let i = 0; i < this.json_content[Para_Index].sub_para[0].length; i++){
        this.json_content[Para_Index - 1].sub_para[0].push(this.json_content[Para_Index].sub_para[0][i])
      }
      this.json_content.splice(Para_Index, 1)
    },
    Merge_LS_To_Back(Para_Index){

      if(this.json_content[Para_Index].is_question != this.json_content[Para_Index + 1].is_question){
        this.$confirm("你想合并的两部分类型不一致，请选择合并后的类型", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: '题干',
          cancelButtonText: '题目',
          type: "info",
          confirmButtonClass: "confirmButton",
          cancelButtonClass: "confirmButton"
        }).then(() => {
          this.json_content[Para_Index].is_question = 0
          this.json_content[Para_Index + 1].is_question = 0
        })
        .catch((action) => {
          if(action == "cancel"){
            this.json_content[Para_Index].is_question = 1
            this.json_content[Para_Index + 1].is_question = 1
          }else{
            return
          }
        })
      }

      for(let i = 0; i < this.json_content[Para_Index + 1].sub_para[0].length; i++){
        this.json_content[Para_Index].sub_para[0].push(this.json_content[Para_Index + 1].sub_para[0][i])
      }
      this.json_content.splice(Para_Index + 1, 1)
    },
    //请求重新切分
    Re_Cut_TestData(){
      for(let i = 0; i < this.testDataScore.length; i++){
        this.userCutTestData[i].Score = this.testDataScore[i];
      }
      this.userCutMath = false;
    },
    Show_Score(score){
      score
      // console.log(score)
    },
    // 将所有题目状况更改为已确认
    Check_All(){
      for(let i = 0; i < this.Question_Check.length; i++){
        if(!this.Question_Check[i]){
          this.Question_Check.splice(i, 1, true);
        }
      }
      this.Submit_Show = true;
    },
    // 向前切分数学试题
    Math_Front_Cut(index, sindex){

      let Ques = this.userCutTestData[index];
      let New_Ques = {
        'Stem': [],
        'Answer': "",
        'Analysis': ""
      }

      for(let i = 0; i < sindex; i++){
        New_Ques.Stem.push(Ques.Stem[i])
      }
      New_Ques.Answer = Ques.Answer
      New_Ques.Analysis = Ques.Analysis

      Ques.Stem.splice(0, sindex)
      this.userCutTestData.splice(index, 1, Ques)
      if(index > 0){
        this.userCutTestData.splice(index, 0, New_Ques)
      }else{
        this.userCutTestData.splice(0, 0, New_Ques)
      }
      this.testDataScore.splice(index, 0, this.testDataScore[index])

    },
    // 向后切分数学试题
    Math_Back_Cut(index, sindex){

      let Ques = this.userCutTestData[index];
      let New_Ques = {
        'Stem': [],
        'Answer': "",
        'Analysis': ""
      }

      for(let i = 0; i <= sindex; i++){
        New_Ques.Stem.push(Ques.Stem[i])
      }
      New_Ques.Answer = Ques.Answer
      New_Ques.Analysis = Ques.Analysis

      Ques.Stem.splice(0, sindex + 1)
      this.userCutTestData.splice(index, 1, Ques)
      this.userCutTestData.splice(index, 0, New_Ques)
      this.testDataScore.splice(index, 0, this.testDataScore[index])

    },
    // 向前合并数学试题
    Math_Merge_To_Front(index){

      let Ques_A = this.userCutTestData[index-1];
      let Ques_B = this.userCutTestData[index];

      for(let i = 0; i < Ques_B.Stem.length; i++){
        Ques_A.Stem.push(Ques_B.Stem[i])
      }

      if(Ques_A.Answer != Ques_B.Answer){
        Ques_A.Answer = Ques_A.Answer + "\n" + Ques_B.Answer;
      }
      Ques_A.Analysis = Ques_A.Analysis + "\n" + Ques_B.Analysis;

      this.userCutTestData.splice(index, 1);
      this.testDataScore[index - 1] = this.testDataScore[index] + this.testDataScore[index - 1];
      this.testDataScore.splice(index, 1);
    },
    // 向后合并数学试题
    Math_Merge_To_Back(index){
      let Ques_A = this.userCutTestData[index];
      let Ques_B = this.userCutTestData[index + 1];

      for(let i = 0; i < Ques_B.Stem.length; i++){
        Ques_A.Stem.push(Ques_B.Stem[i])
      }

      Ques_B.Stem = Ques_A.Stem;

      if(Ques_B.Answer != Ques_A.Answer){
        Ques_B.Answer = Ques_A.Answer + "\n" + Ques_B.Answer;
      }
      Ques_B.Analysis = Ques_A.Analysis + "\n" + Ques_B.Analysis;

      this.userCutTestData.splice(index, 1);
      this.testDataScore[index + 1] = this.testDataScore[index] + this.testDataScore[index + 1];
      this.testDataScore.splice(index, 1);
    },
    User_Cut_Math_Close(){
      this.userCutMath = false;
    },
    // 手动切分数学试题
    User_Cut_Math(){
      this.importPaperDialog = false;
      this.userCutTestData = [];
      for(let Ques_Index = 0; Ques_Index < this.TestData.doc.length; Ques_Index++){
        let Temp_Item = {
          'Stem': [],
          'Answer': "",
          'Analysis': ""
        }
        let Ques_Now = this.TestData.doc[Ques_Index];

        Temp_Item.Stem.push(Ques_Now.question_stem);

        for(let j = 0; j < Ques_Now.sub_questions.length; j++){
          Temp_Item.Stem.push(Ques_Now.sub_questions[j])
        }

        for(let j = 0; j < Ques_Now.question_options.length; j++){
          Temp_Item.Stem.push(Ques_Now.question_options[j])
        }

        Temp_Item.Answer = Ques_Now.answer.join("\n");
        Temp_Item.Analysis = Ques_Now.analysis;

        this.userCutTestData.push(Temp_Item);

      }
      this.userCutMath = true;
    },
    // 是否为实际空试卷检查
    Blank_Paper(){
      if(this.Questions.length == 0){
        return true
      }else{
        for(let i = 0; i < this.Questions[i].Bundle_Questions.length; i++){
          if(this.Questions[i].Bundle_Questions.length > 0){
            return false
          }
        }
        return true
      }
    },
    // 权限检查
    Authority_Check(){
      var username = sessionStorage.getItem("user");
      if(username === "advanced" || username === "admin"){
        return true
      }else{
        return false
      }
    },
    ToTop(){
      window.scrollTo(0,0);
    },
    // 切换题包是否展开
    Expand_Type_Change(){
      this.Expand = !this.Expand;
    },
    // 处理导入试卷功能时所使用的提交方法
    // 选择上传
    uploadFile(formData, config) {

      this.loading = true;

      setTimeout(()=>{
        if(this.loading){
          this.Waiting_Text = "切分已超过预期时间，您可以选择继续等待，刷新页面或更换试卷重试。"
        }
      }, 30000);

      this.$http
        .post("https://file-upload-backend-88-production.env.bdaa.pro/v1/paperProcessing/upload", formData, config)
        .then(function(data) {

          this.Clear();

          this.Hand_Cut_Mode = true;

          // 这里是处理英语试卷的逻辑部分，数学试卷的逻辑部分另写
          if(this.paper_type == '0'){

            // 捕捉数据，关闭等待，并初始化各种返回用的标签特征值，用换行符切分
            this.json_content = data.data;
            this.txt_content = data.data.text;
            this.loading = false;

            this.$refs.eng_input.value = "";

            this.file_data = this.txt_content.split("\n");
            this.json_return.type = this.json_content.type;
            this.json_return.paper_title = this.json_content.paper_title;

            // 从txt中分离段落和框体
            var reps = new RegExp("第(一|二|三|四|五|六|七|八|九|十)");
            var reps2 = new RegExp("第[0-9]+段");

            var divrep = new RegExp("^={4,}");

            var item_count = 0;
            var div_recoder = [0];

            // 根据换行符和切分标签切分大段，但由于第一大段前面是没有切分符的
            // 在这里面记录的是这段的首行和末行的位置

            for (var i = 0; i < this.file_data.length; i++) {

              if(divrep.test(this.file_data[i])){
                item_count = item_count + 1;
                this.file_item.push([]);
                div_recoder.push(i);
              }

            }

            div_recoder.push(this.file_data.length);

            var text_count = 0;

            // 根据大段结果准备往里面塞东西

            for (var ic = 0; ic < item_count; ic++){

              var div_tester_border_front = div_recoder[ic];
              var div_tester_border_back = div_recoder[ic+1];

              // 检测是否是题干段，如果是题干段就加一个题干标签并进入下一轮循环，否则循环完了以后就加一个题目标签
              // 题干标签用-1表示，题目标签用当前大段的标号表示

              for(var t = div_tester_border_front; t < div_tester_border_back; t++){

                if(reps.test(this.file_data[t])){
                  this.file_item_label.push(-1);
                  break;
                }

                else if(reps2.test(this.file_data[t])){
                  this.file_item_label.push(-1);
                  break;
                }

                else if(t == div_tester_border_back - 1){
                  this.file_item_label.push(1);
                }

              }

              // 开始塞东西，把每段的内容塞到大段里面去

              while(text_count < this.file_data.length && this.file_data[text_count][0] != "="){
                if(this.file_data[text_count] != ""){
                  this.file_item[ic].push(this.file_data[text_count]);
                }
                text_count = text_count + 1;
              }
              text_count = text_count + 1;

            }

          } else if (this.paper_type == '1'){

            this.Waiting_Text = "已获取切分结果，正在排版显示内容......"

            this.ImportFile();

            this.TestData = {};

            this.$refs.math_paper_input.value = ""

            if(this.math_input == 'paper'){
              this.downloadPaper = data.body.Download_Paper;
              this.TestData = data.body.TestData;
              this.Init_Question_Check();
              this.loading = false;
            }else{
              this.downloadPaper = data.body.Download_Paper;
              this.downloadAnswer = data.body.Download_Answer;
              this.TestData = data.body.TestData;
              this.Init_Question_Check();
              this.loading = false;
            }

            if(this.math_input == 'combine'){
              this.$refs.math_answer_input.value = ""
            }

          } 
          // 文综，理综，语文
          else if( this.paper_type == '2' || this.paper_type == '3' || this.paper_type == '4'){
            this.$refs.eng_input.value = "";
            this.json_content = data.data.paper
            this.json_image_dict = data.data.image_dict
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
          if(this.$refs.eng_input){
            this.$refs.eng_input.value = "";
          }
          if(this.$refs.math_paper_input){
            this.$refs.math_paper_input.value = ""
          }
          if(this.$refs.math_answer_input){
            this.$refs.math_answer_input.value = ""
          }
          this.Clear();
          this.$alert("切分过程出现错误，这可能是由于您拖拽的文件格式不正确，或服务器超载导致目前暂时无法提供服务，请重新提交文件或稍后再试。", "提示")
        });
    },
    // 导入大多数试卷时的方法
    selectFile(e){

      if(e.target.files.length > 0){

        this.fileName = e.target.files[0].name;

        let formData = new FormData();

        formData.append("files", e.target.files[0]);
        formData.append("paper_type", this.paper_type);
        formData.append("data_format", '0')

        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };

        this.uploadFile(formData, config, e);

      }else{

        this.$alert('  请正确选择要进行分析的文件。', '提示', {
          confirmButtonText: '确定',
        });

      }

    },
    selectPaperFile(e) {

      this.TestData = {};
      this.Waiting_Text = "切分试卷中，请等待......"

      if(this.temp_File && this.math_standby == "0"){
        this.temp_File = "";
      }

      if(e.target.files.length > 0){

        let formData = new FormData();

        this.mathPaperName = e.target.files[0].name;
        this.downloadPaperName = e.target.files[0].name.split(".")[0];
        this.downloadAnswerName = e.target.files[0].name.split(".")[0];

        if(this.math_input != 'combine'){

          formData.append("paper", e.target.files[0])
          formData.append("paper_type", this.paper_type);
          if(this.math_input == 'paper'){
            formData.append("math_input", '0');
          }else{
            this.downloadPaperName = this.downloadPaperName + "_Paper";
            this.downloadAnswerName = this.downloadAnswerName + "_Answer";
            formData.append("math_input", "2");
          }

          formData.append("From", "File_Import");

          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };

          this.uploadFile(formData, config, e);

        }else{

          if(this.math_standby == "1"){

            formData.append("paper", e.target.files[0]);
            formData.append("answer", this.temp_File);
            formData.append("paper_type", this.paper_type);
            formData.append("math_input", "1");
            formData.append("From", "File_Import");

            let config = {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            };

            this.uploadFile(formData, config, e);

          }else if(this.math_standby == "-1"){

            this.math_standby = "0"
            this.temp_File = e.target.files[0];

          }

        }

      }else{

        this.$alert('  请正确选择要进行分析的文件。', '提示', {
          confirmButtonText: '确定'
        });

      }
    },
    selectAnswerFile(e) {

      this.TestData = {};
      this.Waiting_Text = "切分试卷中，请等待......"

      if(this.temp_File && this.math_standby == "1"){
        this.temp_File = "";
      }

      this.downloadAnswerName = e.target.files[0].name.split(".")[0]

      if(e.target.files.length > 0){

        let formData = new FormData();

        this.mathAnswerName = e.target.files[0].name;

        if(this.math_standby == "0"){

          formData.append("answer", e.target.files[0]);
          formData.append("paper", this.temp_File);
          formData.append("paper_type", this.paper_type);
          formData.append("math_input", "1");
          formData.append("From", "File_Import");

          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };

          this.uploadFile(formData, config, e);

        }else if(this.math_standby == "-1"){

          this.math_standby = "1";
          this.temp_File = e.target.files[0];

        }

      }else{

        this.$alert('  请正确选择要进行分析的文件。', '提示', {
          confirmButtonText: '确定'
        });

      }
    },
    saveFile(f){

      this.$confirm(
        "   确认当前分段正确无误吗？正确无误请点击确认，仍要修改请点击取消。", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "info"
        }
      ).then(() => {

          if(f == 0){
            this.saveTxtFile()
          }else{
            this.saveJsonFile();
          }

          this.save_This_To_Database()

        }).catch();

    },
    save_This_To_Database(){

      this.json_return.segment_num = this.file_item.length;
      this.json_return.paper = [];

      for(var i = 0; i < this.file_item.length; i++){

        var Item = {"is_question": -1, "text": "", "additional": ""}

        if(this.file_item_label[i] != -1){
          Item.is_question = 1;
        }else{
          Item.is_question = 0;
        }

        for(var j = 1; j < this.file_item[i].length - 1; j++){
          Item.text = Item.text + this.file_item[i][j] + "\n";
        }

        this.json_return.paper.push(Item);

      }

      let formData = new FormData();
      formData.append("paper", JSON.stringify(this.json_return));
      formData.append("type", this.json_return.type);

      let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
      };

      this.$http.post("https://file-upload-backend-88-production.env.bdaa.pro/v1/paperProcessing/savePaper", formData, config, {
          emulateJSON: true
        }).then(
        function(data){
          data
        }
      );

    },
    // 存储为txt文件并下载
    saveTxtFile() {
      var output_string = "";
      if(this.paper_type == '0'){
        for (var i = 0; i < this.file_item.length; i++) {
          if(this.file_item_label[i] < 0){
            output_string += "-------------------- 题干分界线 --------------------\n"
          }else{
            output_string += "-------------------- 题目分界线 --------------------\n"
          }
          for (var j = 0; j < this.file_item[i].length; j++) {
            output_string += this.file_item[i][j] + "\n";
          }
          if(this.file_item_label[i] < 0){
            output_string += "-------------------- 题干分界线 --------------------\n"
          }else{
            output_string += "-------------------- 题目分界线 --------------------\n"
          }
        }
      }else if(this.paper_type == '2' || this.paper_type == '3'){
        for(let i = 0 ; i < this.json_content.length; i++){
          if(this.json_content[i].is_question == 0){
            output_string += "-------------------- 题干分界线 --------------------\n"
          }else{
            output_string += "-------------------- 题目分界线 --------------------\n"
          }
          for(let j = 0; j < this.json_content[i].sub_para[0].length; j++){
            for(let k = 0; k < this.json_content[i].sub_para[0][j].runs.length; k++){
              if(this.json_content[i].sub_para[0][j].runs[k].run_type == '0'){
                output_string += this.json_content[i].sub_para[0][j].runs[k].run_text;
              }else if(this.json_content[i].sub_para[0][j].runs[k].run_type == '1'){
                output_string += "<Pic_Name_" + this.json_content[i].sub_para[0][j].runs[k].image.src + ">";
              }
            }
            output_string += "\n"
          }
          if(this.json_content[i].is_question == 0){
            output_string += "-------------------- 题干分界线 --------------------\n"
          }else{
            output_string += "-------------------- 题目分界线 --------------------\n"
          }
        }
      }

      this.txt_content = output_string;

      var file = new File(
        [this.txt_content],
        this.fileName.split(".")[0] + ".txt",
        { type: "text/plain;charset=utf-8" }
      );
      FileSaver.saveAs(file);
    },
    // 对数学的json文件进行下载
    saveMathFile(part){

      var json = "";
      if(part == 0){
        json = this.downloadPaper;
        var file = new File(
          [JSON.stringify(json, null, 4)],
          this.downloadPaperName + ".json",
          { type: "text/plain;charset=utf-8" }
        );
        FileSaver.saveAs(file);
      }else if(part == 1){
        json = this.downloadAnswer
        file = new File(
          [JSON.stringify(json, null, 4)],
          this.downloadAnswerName + ".json",
          { type: "text/plain;charset=utf-8" }
        );
        FileSaver.saveAs(file);
      }else if(part == 2){
        json = this.TestData
        file = new File(
          [JSON.stringify(json, null, 4)],
          this.downloadPaperName + "_" + this.downloadAnswerName + "_Merge" + ".json",
          { type: "text/plain;charset=utf-8" }
        );
        FileSaver.saveAs(file);
      }

    },
    // 存储为json文件并下载
    saveJsonFile() {

      if(this.paper_type == "0"){

        this.json_return.segment_num = this.file_item.length;
        this.json_return.paper = [];

        for(var i = 0; i < this.file_item.length; i++){

          var Item = {"is_question": -1, "text": "", "additional": ""}

          if(this.file_item_label[i] > 0){
            Item.is_question = 1;
          }else{
            Item.is_question = 0;
          }

          for(var j = 0; j < this.file_item[i].length; j++){
            Item.text = Item.text + this.file_item[i][j] + "\n";
          }

          this.json_return.paper.push(Item);

        }
        let file = new File(
          [JSON.stringify(this.json_return, null, 2)],
          this.fileName.split(".")[0] + ".json",
          { type: "text/plain;charset=utf-8" }
        );
        FileSaver.saveAs(file);
        return
      }else{
        let file = new File(
          [JSON.stringify(this.json_content, null, 2)],
          this.fileName.split(".")[0] + ".json",
          { type: "text/plain;charset=utf-8" }
        );
        FileSaver.saveAs(file);
      }
    },
    // 名称
    English_Hand_Cut(index_out, index_in) {

      let Para_Type = this.file_item_label[index_out]

      if(Para_Type > 0){

          let list_forward = [];

          for (var i = 0; i < index_in + 1; i++) {
            list_forward.push(this.file_item[index_out][i]);
          }

          this.file_item[index_out].splice(0, index_in + 1);
          this.file_item.splice(index_out, 0, list_forward);

          this.file_item_label.splice(index_out, 0, this.file_item_label[index_out]);

      }
      else {

        let list_forward = [];

        for (i = 0; i < index_in + 1; i++) {
          list_forward.push(this.file_item[index_out][i]);
        }

        this.file_item[index_out].splice(0, index_in + 1);
        this.file_item.splice(index_out, 0, list_forward);

        this.file_item_label.splice(index_out + 1, 0, -1);

      }

    },

    // 合并相邻的两个位置
    Del(index_out, label) {

        // 去掉前切分线
        if (label == 'front') {

            if (this.file_item_label[index_out] ==this.file_item_label[index_out - 1]) {

              // 内容合并
              for (var i = 0; i < this.file_item[index_out].length; i++) {
                this.file_item[index_out - 1].push(
                  this.file_item[index_out][i]
                );
              }

              // 删除原先“后面”的那一项
              this.file_item.splice(index_out, 1);
              this.file_item_label.splice(index_out, 1);

            }
            // 两项所处位置不一样
            else {
              this.Show_CANT(index_out, label);
            }
        }
        // 去掉后切分线
        else {

          if (this.file_item_label[index_out] == this.file_item_label[index_out + 1]) {

              // 内容合并
              for (i = 0; i < this.file_item[index_out + 1].length; i++) {
                this.file_item[index_out].push(
                  this.file_item[index_out + 1][i]
                );
              }

              // 删除原先“后面”的那一项
              this.file_item.splice(index_out + 1, 1);
              this.file_item_label.splice(index_out, 1);
            }
            // 两项所处类型不一样
            else {
              this.Show_CANT(index_out, label);
            }
        }

    },

    // 获取题干或其他内容应当显示的分界线内容
    Get_Stem_Label(index_out){
      index_out
      return "--------------------题干分界线--------------------"
    },

    // 获取题目部分应当显示的分界线内容
    Get_Title_Label(index_out){
      index_out
      return "--------------------题目分界线--------------------"
    },
    // 将题干和题目类型互相转化
    Transfer(index_out){
      // 当这个部分是题目内容时
      if(this.file_item_label[index_out] > 0){
        this.file_item_label.splice(index_out, 1, -1);
      }else{
        this.file_item_label.splice(index_out , 1, 1);
      }
    },
    Show_CANT(index_out, label){
      this.$confirm("类型不一致，请选择合并后的类型", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: '题干',
          cancelButtonText: '题目',
          type: "info",
          confirmButtonClass: "confirmButton",
          cancelButtonClass: "confirmButton"
        }).then(() => {
          if(label == "front"){
            if(this.file_item_label[index_out] > 0){
              this.file_item_label.splice(index_out, 1, -1)
            }else{
              this.file_item_label.splice(index_out - 1, 1, -1)
            }
            this.Del(index_out, label)
          }else{
            if(this.file_item_label[index_out] > 0){
              this.file_item_label.splice(index_out, 1, -1)
            }else{
              this.file_item_label.splice(index_out + 1, 1, -1)
            }
            this.Del(index_out, label)
          }
        })
        .catch((action) => {
          if(action == "cancel"){
            if(label == "front"){
              if(this.file_item_label[index_out] > 0){
                this.file_item_label.splice(index_out - 1, 1, 1)
              }else{
                this.file_item_label.splice(index_out, 1, 1)
              }
              this.Del(index_out, label)
            }else{
              if(this.file_item_label[index_out] > 0){
                this.file_item_label.splice(index_out + 1, 1, 1)
              }else{
                this.file_item_label.splice(index_out, 1, 1)
              }
              this.Del(index_out, label)
            }
          }
        })

    },
    Download_Show(form_at){
      if((form_at == 0 || form_at == 1) && this.fileName != ""){
        return false
      }
      else{
        return true
      }
    },
    Type_Visible(){
      if(this.fileName != "" && !(this.loading)){
        return true
      }
      else{
        return false
      }
    },
    Clear(){

      this.json_content = ""
      this.json_image_dict = ""
      // 数学专用，答案JSON
      this.answer_content = ""
      this.txt_content = ""

      this.downloadPaper = ""
      this.downloadAnswer = ""

      this.Hand_Cut_Now = [-1, -1];
      this.Hand_Cut_Mode = false;

      this.Waiting_Text = "切分试卷中，请等待......"

      this.format = "3"
      this.loading = false
      this.file_data = []
      this.file_item = []
      // 题目编号
      this.title_index = []
      // file_item属于的标签号
      this.file_item_label = []
      this.json_return = {
        "paper_title": "",
        "type": "",
        "segment_num": 0,
        "paper": []
      }

      this.TestData = {}

    },
    // ------------------------这下面是本体的方法，上面是导入试卷的方法-------------------------------
    // 处理上传试卷时的方法
    // uploadPaper(event){
    //   console.log(event.target.files)
    // },
    // 关闭导入试卷这一栏对话框的方法
    Import_Paper_Dialog_Open(){
      this.importPaperDialog = true;
    },
    Import_Paper_Dialog_Close(){
      this.importPaperDialog = false;
    },
    // 处理插入新题目的办法
    // 需要管理两个条目，一个是题目内容，一个是是否折叠
    // 由于折叠属性放在题目内会对显示造成复杂化的结果，就放在外面
    // 查找次序依次为题目包，点击添加按钮的包序号，然后访问这个包下保存题目和题目折叠信息的条目
    New_Questions(val){

        let temp_val = "";

        if(val.type != 'mix'){
          temp_val = this.Normal_Char_Check(val);
        }else{
          temp_val = this.Mix_Char_Check(val)
        }

        if(temp_val != false){
          this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions.push(temp_val);
          this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions_Collapse.push(false);
        }else{
          this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions.push(val);
          this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions_Collapse.push(false);
        }

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
        }else if(this.Questions[Bundle_Index].Bundle_Questions[Question_Index].type == 'mix'){
            this.showDialog_Mix = true;
            this.Temp_MixQuestionInfo = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
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

        let temp_val = ""

        if(val.type != 'mix'){
          temp_val = this.Normal_Char_Check(val);
        }else{
          temp_val = this.Mix_Char_Check(val)
        }
        if(temp_val != false){
          this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions.splice(this.Index_Edit_Record, 1, temp_val);
        }else{
          this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions.splice(this.Index_Edit_Record, 1, val);
        }

        this.Close_Editor();
        this.Reset_Params();

    },
    // 一起关掉
    Close_Editor(){

        this.showDialog = false;
        this.showDialog_Fill = false;
        this.showDialog_Answer = false;
        this.showDialog_Mix = false;
        this.showHint = false;

    },
    // 处理完题目的录入之后要重置这些临时使用的变量
    Reset_Params(){

        this.Index_Edit_Record = -1;
        this.Question_Bundle_Add_Index = -1;
        this.ReEditSwitch = false;
        this.complex_Input = false;

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

        this.Temp_MixQuestionInfo = {
            type: "mix",
            score: 0,
            content: "",
            content_images: [],
            answer: "",
            answer_images: [],
            sub_questions: [],
            sub_questions_collapse: [],
            analyse: "",
            analyse_images: [],
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

        // 大题类型，大题介绍
        // 本包下的题目
        // 本包是否折叠
        // 本包下的小题是否折叠
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
            Result = "综合题";
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
        }else if(Question_Bundle.Bundle_Type == 'mix'){
            this.showDialog_Mix = true;
        }

    },
    Router_Trans(route){
      this.$router.push({ path: route });
    },

    // 读取Json格式的数据
    loadJsonFromFile(file, fileList) {
      this.uploadFileName = file;
      this.upload_files = fileList;
      this.loadDataFromFile();
    },
    // 从读取到的数据当中提取对应的格式信息
    loadDataFromFile() {
      if (this.upload_files && this.upload_files.length > 0) {
        const file = this.upload_files[0];
        const reader = new FileReader();
        reader.onload = async e => {
          try {
            this.upload = true;
            // reset all variables
            // 初始化所有内容字段
            this.option_content = [];
            this.fill_content = [];
            this.answer_content = [];
            this.mix_content = [];
            this.option_show_answer = [];
            this.fill_show_answer = [];
            this.answer_show_answer = [];
            this.mix_show_answer = [];
            this.option_show_answer_analysis = [];
            this.fill_show_answer_analysis = [];
            this.answer_show_answer_analysis = [];
            this.mix_show_answer_analysis = [];
            this.option_show_image = [];
            this.option_show_option_image = [];
            this.option_show_analysis_image = [];
            this.fill_show_analysis_image = [];
            this.answer_show_analysis_image = [];
            this.mix_show_analysis_image = [];
            this.answer_show_answer_image = [];
            this.mix_show_answer_image = [];
            this.fill_show_image = [];
            this.answer_show_image = [];
            this.mix_show_image = [];
            this.answer_show_option_image = [];
            this.mix_show_option_image = [];
            this.option_view = [];
            this.fill_view = [];
            this.option_collapse = [];
            this.fill_collapse = [];
            this.answer_collapse = [];
            this.mix_collapse = [];

            const document = JSON.parse(e.target.result);
            this.paper_title = document["paper_title"];
            this.chemistry_subtitle = document["chemistry_subtitle"];

            // 遍历Json内容中的题目部分，以题型为基本区分单位
            for (let questions of document["questions"]) {
              switch (questions["type"]) {

                // 如果是选择题的情况

                case "option":
                  this.option_show_image = [];
                  this.option_show_option_image = [];
                  this.option_show_analysis_image = [];
                  for (let question of questions["questions"]) {
                    this.option_collapse.push(false);
                    delete question.eno;
                    this.option_content.push({
                      optionQuestion: question
                    });
                    if (question.image[0] !== "") {
                      this.option_show_image.push(
                        question.image.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.option_show_image.push([]);
                    }
                    if (question.images) {
                      question.option_images = question.images;
                      delete question["images"];
                    }
                    if (question.option_images[0] !== "") {
                      this.option_show_option_image.push(
                        question.option_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.option_show_option_image.push([]);
                    }
                    if (typeof question.analysis_images !== "undefined") {
                      this.option_show_analysis_image.push(
                        question.analysis_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.analysis_images = [];
                      this.option_show_analysis_image.push([]);
                    }
                  }
                  this.option_subtitle = questions["subtitle"];
                  break;

                // 如果是填空题的情况

                case "fill":
                  this.fill_show_image = [];
                  this.fill_show_analysis_image = [];
                  for (let question of questions["questions"]) {
                    this.fill_collapse.push(false);
                    delete question.eno;
                    this.fill_content.push({
                      fillQuestion: question
                    });
                    if (question.image[0] !== "") {
                      this.fill_show_image.push(
                        question.image.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.fill_show_image.push([]);
                    }
                    if (typeof question.analysis_images !== "undefined") {
                      this.fill_show_analysis_image.push(
                        question.analysis_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.analysis_images = [];
                      this.fill_show_analysis_image.push([]);
                    }
                  }
                  this.fill_subtitle = questions["subtitle"];
                  break;

                // 如果是解答题的情况

                case "answer":
                  this.answer_show_image = [];
                  this.answer_show_option_image = [];
                  this.answer_show_analysis_image = [];
                  this.answer_show_answer_image = [];
                  for (let question of questions["questions"]) {
                    this.answer_collapse.push(false);
                    delete question.eno;
                    this.answer_content.push({
                      answerQuestion: question
                    });
                    if (question.image[0] !== "") {
                      this.answer_show_image.push(
                        question.image.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.answer_show_image.push([]);
                    }
                    if (question.images) {
                      question.option_images = question.images;
                      delete question["images"];
                    }
                    if (question.option_images[0] !== "") {
                      this.answer_show_option_image.push(
                        question.option_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.answer_show_option_image.push([]);
                    }
                    if (typeof question.analysis_images !== "undefined") {
                      this.answer_show_analysis_image.push(
                        question.analysis_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.analysis_images = [];
                      this.answer_show_analysis_image.push([]);
                    }
                    if (typeof question.answer_images !== "undefined") {
                      this.answer_show_answer_image.push(
                        question.answer_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.answer_images = [];
                      this.answer_show_answer_image.push([]);
                    }
                    if (question.tableConfig === undefined) {

                      question.tableConfig = [];
                    }
                    if (question.tableData === undefined) {

                      question.tableData = [];
                    }
                    if (question.table_view === undefined) {

                      question.table_view = false;
                    }
                    if (typeof question.table_row === "undefined") {
                      question.table_row = "";
                    }
                    if (typeof question.table_col === "undefined") {
                      question.table_col = "";
                    }
                  }
                  this.answer_subtitle = questions["subtitle"];
                  break;

                // 如果是混合题型的情况

                case "mix":
                  this.mix_show_image = [];
                  this.mix_show_option_image = [];
                  this.mix_show_analysis_image = [];
                  this.mix_show_answer_image = [];
                  for (let question of questions["questions"]) {
                    this.mix_collapse.push(false);
                    for (
                      var i = 0;
                      i < question.mix_sub_fill_questions.length;
                      i++
                    ) {
                      if (
                        question.mix_sub_fill_questions[i].sub_fill
                          .tableConfig === undefined
                      ) {

                        question.mix_sub_fill_questions[
                          i
                        ].sub_fill.tableConfig = [];
                      }
                      if (
                        question.mix_sub_fill_questions[i].sub_fill
                          .tableData === undefined
                      ) {

                        question.mix_sub_fill_questions[
                          i
                        ].sub_fill.tableData = [];
                      }
                      if (
                        question.mix_sub_fill_questions[i].sub_fill
                          .mix_sub_fill_table_view === undefined
                      ) {

                        question.mix_sub_fill_questions[
                          i
                        ].sub_fill.mix_sub_fill_table_view = false;
                      }
                      if (
                        typeof question.mix_sub_fill_questions[i].sub_fill
                          .table_row === "undefined"
                      ) {
                        question.mix_sub_fill_questions[i].sub_fill.table_row =
                          "";
                      }
                      if (
                        typeof question.mix_sub_fill_questions[i].sub_fill
                          .table_col === "undefined"
                      ) {
                        question.mix_sub_fill_questions[i].sub_fill.table_col =
                          "";
                      }
                    }

                    delete question.eno;
                    this.mix_content.push({
                      mixQuestion: question
                    });
                    if (question.image[0] !== "") {
                      this.mix_show_image.push(
                        question.image.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.mix_show_image.push([]);
                    }
                    if (typeof question.analysis_images !== "undefined") {
                      this.mix_show_analysis_image.push(
                        question.analysis_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.analysis_images = [];
                      this.mix_show_analysis_image.push([]);
                    }
                    if (typeof question.answer_images !== "undefined") {
                      this.mix_show_answer_image.push(
                        question.answer_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.answer_images = [];
                      this.mix_show_answer_image.push([]);
                    }
                  }
                  this.mix_subtitle = questions["subtitle"];
                  break;
              }
            }
          } catch (err) {
            this.upload = false;
            // console.log(`${err.message}`);
          }
        };
        reader.readAsText(file.raw);
      }
    },
    // 导出Json格式的文件
    output() {
      // save json file to local
      // const data = {};
      // data["paper_title"] = this.paper_title;
      // if (this.default_subject === "math") {
      //   data["type"] = "math";
      // } else if (this.default_subject === "physics") {
      //   data["type"] = "physics";
      // } else if (this.default_subject === "chemistry") {
      //   data["type"] = "chemistry";
      //   data["chemistry_subtitle"] = this.chemistry_subtitle;
      // } else if (this.default_subject === "biology") {
      //   data["type"] = "biology";
      // }
      // data["info"] = { global_eno: false };

      // data["questions"] = [];

      // let option = {};
      // option["type"] = "option";
      // option["subtitle"] = this.option_subtitle;
      // option["questions"] = [];
      // for (let i in this.option_content) {
      //   let tmp = this.option_content[i].optionQuestion;
      //   let eno = { eno: parseInt(i) + 1 };
      //   let question = {};
      //   Object.assign(question, eno, tmp);
      //   option["questions"].push(question);
      // }
      // data["questions"].push(option);

      // let fill = {};
      // fill["type"] = "fill";
      // fill["subtitle"] = this.fill_subtitle;
      // fill["questions"] = [];
      // for (let i in this.fill_content) {
      //   let tmp = this.fill_content[i].fillQuestion;
      //   let eno = { eno: parseInt(i) + 1 };
      //   let question = {};
      //   Object.assign(question, eno, tmp);
      //   fill["questions"].push(question);
      // }
      // data["questions"].push(fill);

      // let answer = {};
      // answer["type"] = "answer";
      // answer["subtitle"] = this.answer_subtitle;
      // answer["questions"] = [];
      // for (let i in this.answer_content) {
      //   let tmp = this.answer_content[i].answerQuestion;
      //   let eno = { eno: parseInt(i) + 1 };
      //   let question = {};
      //   Object.assign(question, eno, tmp);
      //   answer["questions"].push(question);
      // }
      // data["questions"].push(answer);

      // let mix = {};
      // mix["type"] = "mix";
      // mix["subtitle"] = this.mix_subtitle;
      // mix["questions"] = [];
      // for (let i in this.mix_content) {
      //   let tmp = this.mix_content[i].mixQuestion;
      //   let eno = { eno: parseInt(i) + 1 };
      //   let question = {};
      //   Object.assign(question, eno, tmp);
      //   mix["questions"].push(question);
      // }
      // data["questions"].push(mix);

      // let jsonData = JSON.stringify(data);
      // const blob = new Blob([jsonData], { type: "" });
      // FileSaver.saveAs(blob, (this.paper_title || "paper") + ".json");

      // send json file to server

      // let param = new FormData();
      // param.append("option_content", JSON.stringify(this.option_content));
      // param.append("fill_content", JSON.stringify(this.fill_content));
      // param.append("answer_content", JSON.stringify(this.answer_content));
      // let config = {
      //   headers: { "Content-Type": "multipart/form-data" }
      // };
      // param.append("paper_title", this.paper_title);
      // this.$http
      //   .post(
      //     this.backendIP + "/api/paper/" + this.paper_title + ".json",
      //     param,
      //     config,
      //     {
      //       emulateJSON: true
      //     }
      //   )
      //   .then(function(data) {
      //     let url =
      //       this.backendIP + "/api/download/" + this.paper_title + ".json";
      //     window.open(url);
      //     this.$http.post(
      //       this.backendIP + "/api/delete/" + this.paper_title + ".json"
      //     );
      //   });
    },
    // 尝试进行导出
    PaperUpload(Control){

      if(this.Symbol_Error){
        this.$message.error("仍有非法字符存在，请修改后重新尝试。")
        return null;
      }

      // var Upload_Json = {
      //   "title": this.PaperTitle,
      //   "subject_type": this.SubjectType,
      //   "period_type": this.PeriodType,
      //   "source": "USER_ID",
      //   "img": {},
      //   "doc": []
      // }

      // for(var len = 0; len < this.Questions.length; len++){

      //   for(var i = 0; i < this.Questions[len].Bundle_Questions.length; i++){


      //     var Temp_Doc = {
      //       "question_stem": "",
      //       "question_options": [],
      //       "question_type": "",
      //       "sub_questions": [],
      //       "answer": "",
      //       "analysis": ""
      //     }

      //     var Ques = this.Questions[len].Bundle_Questions[i]

      //     if(Ques.type == 'option'){
      //       // 题型
      //       Temp_Doc.question_type = "选择题"
      //       // 题干
      //       Temp_Doc.question_stem = Ques.content;
      //       for(var img_l = 0; img_l < Ques.content_images.length; img_l++){
      //         Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
      //       }
      //       // 答案
      //       Temp_Doc.answer = Ques.answer;
      //       for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
      //         Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
      //       }
      //       // 解析
      //       Temp_Doc.analysis = Ques.analyse;
      //       for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
      //         Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
      //       }
      //       // 选项
      //       for(img_l = 0; img_l < Ques.options.length; img_l++){
      //         var optionInfo = Ques.options[img_l];
      //         if(Ques.options_images[img_l] != ""){
      //           optionInfo = optionInfo + "<img src='" + Ques.options_images[img_l] + "'>"
      //         }
      //         Temp_Doc.question_options.push(optionInfo)
      //       }

      //       Upload_Json.doc.push(Temp_Doc)
      //     }else if(Ques.type == 'fill'){
      //       // 题型
      //       Temp_Doc.question_type = "填空题"
      //       // 题干
      //       Temp_Doc.question_stem = Ques.content;
      //       for(img_l = 0; img_l < Ques.content_images.length; img_l++){
      //         Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
      //       }
      //       // 答案
      //       Temp_Doc.answer = Ques.answer;
      //       for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
      //         Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
      //       }
      //       // 解析
      //       Temp_Doc.analysis = Ques.analyse;
      //       for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
      //         Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
      //       }

      //       Upload_Json.doc.push(Temp_Doc)
      //     }else if(Ques.type == 'answer'){
      //       // 题型
      //       Temp_Doc.question_type = "解答题"
      //       // 题干
      //       Temp_Doc.question_stem = Ques.content;
      //       for(img_l = 0; img_l < Ques.content_images.length; img_l++){
      //         Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
      //       }
      //       // 答案
      //       Temp_Doc.answer = Ques.answer;
      //       for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
      //         Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
      //       }
      //       // 解析
      //       Temp_Doc.analysis = Ques.analyse;
      //       for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
      //         Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
      //       }
      //       // 小题
      //       for(img_l = 0; img_l < Ques.sub_questions.length; img_l++){
      //         var subTemp = Ques.sub_questions[img_l];
      //         for(var inner = 0; inner < Ques.sub_questions_images[img_l].length; inner++){
      //           subTemp = subTemp + "<img src='" + Ques.sub_questions_images[img_l][inner] + "'>"
      //         }
      //         Temp_Doc.sub_questions.push(subTemp)
      //       }

      //       Upload_Json.doc.push(Temp_Doc)
      //     }else if(Ques.type == 'mix'){

      //       var O_Ques = this.Questions[len].Bundle_Questions[i];
      //       var O_Answer = O_Ques.answer.split("::");

      //       for(var B_inner = 0; B_inner < this.Questions[len].Bundle_Questions[i].sub_questions.length; B_inner++){

      //         Temp_Doc = {
      //           "question_stem": "",
      //           "question_options": [],
      //           "question_type": "",
      //           "sub_questions": [],
      //           "answer": "",
      //           "analysis": ""
      //         }

      //         Ques = this.Questions[len].Bundle_Questions[i].sub_questions[B_inner]

      //         if(Ques.type == 'option'){
      //           // 题型
      //           Temp_Doc.question_type = "选择题"
      //           // 题干
      //           Temp_Doc.question_stem = this.Questions[len].Bundle_Questions[i].content + " " + Ques.content;
      //           for(img_l = 0; img_l < Ques.content_images.length; img_l++){
      //             Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
      //           }
      //           // 答案
      //           if(O_Answer[B_inner]){
      //             Temp_Doc.answer = O_Answer[B_inner] + " " + Ques.answer;
      //           }else{
      //             Temp_Doc.answer = Ques.answer;
      //           }
      //           for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
      //             Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
      //           }
      //           // 解析
      //           Temp_Doc.analysis = Ques.analyse;
      //           for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
      //             Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
      //           }
      //           // 选项
      //           for(img_l = 0; img_l < Ques.options.length; img_l++){
      //             optionInfo = Ques.options[img_l];
      //             if(Ques.options_images[img_l] != ""){
      //               optionInfo = optionInfo + "<img src='" + Ques.options_images[img_l] + "'>"
      //             }
      //             Temp_Doc.question_options.push(optionInfo)
      //           }
      //         }else if(Ques.type == 'fill'){
      //           // 题型
      //           Temp_Doc.question_type = "填空题"
      //           // 题干
      //           Temp_Doc.question_stem = this.Questions[len].Bundle_Questions[i].content + " " + Ques.content;
      //           for(img_l = 0; img_l < Ques.content_images.length; img_l++){
      //             Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
      //           }
      //           // 答案
      //           if(O_Answer[B_inner]){
      //             Temp_Doc.answer = O_Answer[B_inner] + " " + Ques.answer;
      //           }else{
      //             Temp_Doc.answer = Ques.answer;
      //           }
      //           for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
      //             Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
      //           }
      //           // 解析
      //           Temp_Doc.analysis = Ques.analyse;
      //           for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
      //             Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
      //           }
      //         }else if(Ques.type == 'answer'){
      //           // 题型
      //           Temp_Doc.question_type = "解答题"
      //           // 题干
      //           Temp_Doc.question_stem = this.Questions[len].Bundle_Questions[i].content + " " + Ques.content;
      //           for(img_l = 0; img_l < Ques.content_images.length; img_l++){
      //             Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
      //           }
      //           // 答案
      //           if(O_Answer[B_inner]){
      //             Temp_Doc.answer = O_Answer[B_inner] + " " + Ques.answer;
      //           }else{
      //             Temp_Doc.answer = Ques.answer;
      //           }
      //           for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
      //             Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
      //           }
      //           // 解析
      //           Temp_Doc.analysis = Ques.analyse;
      //           for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
      //             Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
      //           }
      //           // 小题
      //           for(img_l = 0; img_l < Ques.sub_questions.length; img_l++){
      //             subTemp = Ques.sub_questions[img_l];
      //             for(inner = 0; inner < Ques.sub_questions_images[img_l].length; inner++){
      //               subTemp = subTemp + "<img src='" + Ques.sub_questions_images[img_l][inner] + "'>"
      //             }
      //             Temp_Doc.sub_questions.push(subTemp)
      //           }
      //         }

      //         Upload_Json.doc.push(Temp_Doc)
      //       }
      //     }

      //   }

      // }

      if(Control == 'upload'){

        this.Uploading = true;

        if(this.PaperTitle == ""){
          this.$message.error("试卷标题不能为空！")
          return
        }

        let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
        };
        let param = new FormData();

        param.append('result_json',
                        JSON.stringify({
                          "post_type": 1,
                          "title": this.PaperTitle,
                          "subject_type": this.SubjectType,
                          "period_type": this.PeriodType,
                          "questions": this.Questions,
                        }, null, 4));

        this.$http
        .post(this.backendIP + "/api/mathUpload", param, config, {
          emulateJSON: true
        })
        .then(function() {
          this.$message.success("整卷上传已完成。");
          this.Uploading = false;
          return
        }).catch(() => {
          this.$message.error("过程出现错误，请稍后重新尝试...");
          this.Uploading = false;
          return
        });

      }else if(Control == 'export'){

        var file_2 = new File(
          [JSON.stringify({
                          "title": this.PaperTitle,
                          "subject_type": this.SubjectType,
                          "period_type": this.PeriodType,
                          "questions": this.Questions,
                          }, null, 4)],
          this.PaperTitle + "_Full.json",
          { type: "text/plain;charset=utf-8" }
        )

        FileSaver.saveAs(file_2);

      }else if(Control == 'download') {

        this.downloading = true;

        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          responseType: 'arraybuffer',
          emulateJSON: true
        }

        let param = new FormData();

        param.append('result_json',
          JSON.stringify({
            "title": this.PaperTitle,
            "subject_type": this.SubjectType,
            "period_type": this.PeriodType,
            "questions": this.Questions,
          }, null, 4));

        this.$http
            .post(this.backendIP + "/api/paperDownload", param, config)
            .then(function(data) {
              if(data.data){

                this.downloading = false;

                const link = document.createElement('a')
                let blob = new Blob([data.data],
                    {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"})
                let objectUrl = URL.createObjectURL(blob)
                link.href = objectUrl
                link.download = this.PaperTitle + '.docx'
                link.click()
                URL.revokeObjectURL(objectUrl);
              }
            }).catch(() => {
              alert("下载过程出现问题，请稍后重新尝试...");
              this.analysing = false;
              return
            });
      }else if(Control == 'analyse'){

        this.analysing = true;

        if(this.PaperTitle == ""){
          this.$message.error("试卷标题不能为空！")
          return
        }

        let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
        };
        let param = new FormData();

        param.append('result_json',
                        JSON.stringify({
                          "post_type": 1,
                          "title": this.PaperTitle,
                          "subject_type": this.SubjectType,
                          "period_type": this.PeriodType,
                          "questions": this.Questions,
                        }, null, 4));

        this.$http
        .post(this.backendIP + "/api/mathUpload", param, config, {
          emulateJSON: true
        })
        .then(function(data) {
            this.analysing = false;
            let Test_Json = data.data.Paper_Json
            sessionStorage.PaperJson = JSON.stringify(Test_Json);
            this.Open_PaperAnalyse();
        }).catch(() => {
          alert("解析失败，请稍后重新尝试...");
          this.analysing = false;
          return
        });
      }
    },
    Open_PaperAnalyse(){
      this.$confirm("已获取分析报告，新窗口页面打开请按确定，本页面打开请按取消。").then( () => {
        let routeData = this.$router.resolve({ path: '/paperAnalyse' });
        window.open(routeData.href, '_blank');
        this.$message.success("试题分析内容已在新页面展开。");
        return
      }).catch(() => {
        this.$router.push("/paperAnalyse");
        this.$message.success("试题分析内容已在本页面展开。");
        return
      })
    },
    // 以下是单题显示配套用的方法
    Ensure(){
      this.$confirm("您已经锁定了所有题目，确认审核完毕请点击确认提交，仍有更改请点击取消。").then( () => {
        this.Submit_Show = true;
        this.Submit();
        this.$message.success("已提交");
        return
      }).catch(() => {
        this.Submit_Show = true;
        this.$message.info("已取消");
        return
      })
    },
    Init_Question_Check(){

      this.Question_Check = [];

      for(var i = 0; i < this.TestData.doc.length; i++){
        this.Question_Check.push(false);
        this.TestData.doc[i].answer = this.TestData.doc[i].answer.split("::");
        if(i < 16){
          this.testDataScore.push(5);
        }else{
          this.testDataScore.push(12);
        }
      }

    },
    Get_Question_Show(Stem, Type, Question_Index, Answer_Index = null){

        for(var key in this.TestData.img){
            var Img_Name_Catcher = new RegExp('<IMG: ' + key + '>')
            if(Img_Name_Catcher.exec(Stem) != null){
                Stem = Stem.replace(Img_Name_Catcher,'<img src="' + this.TestData.img[key] + '">')
            }
        }
        if(Type == 'stem'){
            if(this.TestData.doc[Question_Index].question_stem != Stem)
              this.TestData.doc[Question_Index].question_stem = Stem;
            return "题干$：$" + Stem
        }else if(Type == 'answer'){
            if(this.TestData.doc[Question_Index].answer[Answer_Index] != Stem)
              this.TestData.doc[Question_Index].answer.splice(Answer_Index, 1, Stem)
            if(this.TestData.doc[Question_Index].answer.length == 1){
              return "答案   ：" + Stem
            }else{
              return "答案$" + (Answer_Index + 1).toString() + "$：" + Stem
            }
        }else if(Type == 'analyse'){
            if(this.TestData.doc[Question_Index].analysis != Stem)
              this.TestData.doc[Question_Index].analysis = Stem;
            return "解析$：$" + Stem
        }
    },
    Get_Question_Options(Stem, Index, Question_Index){
        for(var key in this.TestData.img){
            var Img_Name_Catcher = new RegExp('<IMG: ' + key + '>')
            if(Img_Name_Catcher.exec(Stem) != null){
                Stem = Stem.replace(Img_Name_Catcher,'<img src="' + this.TestData.img[key] + '">')
            }
        }
        if(this.TestData.doc[Question_Index].question_options[Index] != Stem)
          this.TestData.doc[Question_Index].question_options.splice(Index, 1, Stem)
        return String.fromCharCode(Index + 65) + "$：$" + Stem
    },
    Get_Sub_Question(Stem, Question_Index, Sub_Question_Index){
        for(var key in this.TestData.img){
            var Img_Name_Catcher = new RegExp('<IMG: ' + key + '>')
            if(Img_Name_Catcher.exec(Stem) != null){
                Stem = Stem.replace(Img_Name_Catcher,'<img src="' + this.TestData.img[key] + '">')
            }
        }
        if(this.TestData.doc[Question_Index].sub_questions[Sub_Question_Index] != Stem){
          this.TestData.doc[Question_Index].sub_questions.splice(Sub_Question_Index, 1, Stem);
        }
        return Stem
    },
    Show_ComplexInput(Question_Index, Part, Index = null){
      if(this.Question_Edit_Option_Index == -1 && this.Question_Edit_Sub_Ques_Index == -1 && this.Question_Edit_Answer_Index == -1){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part){
          return true
        }else{
          return false
        }
      }else if(this.Question_Edit_Option_Index != -1){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Option_Index){
          return true
        }else{
          return false
        }
      }else if(this.Question_Edit_Sub_Ques_Index != -1){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Sub_Ques_Index){
          return true
        }else{
          return false
        }
      }else if(this.Question_Edit_Answer_Index != -1){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Answer_Index){
          return true
        }else{
          return false
        }

      }
    },
    Update_ComplexInput(val){
      if(this.Question_Edit_Part == 'answer'){
        this.TestData.doc[this.Question_Edit_Now].answer.splice(this.Question_Edit_Answer_Index, 1, val);
      }else if(this.Question_Edit_Part == 'stem'){
        this.TestData.doc[this.Question_Edit_Now].question_stem = val;
      }else if(this.Question_Edit_Part == 'analyse'){
        this.TestData.doc[this.Question_Edit_Now].analysis = val;
      }else if(this.Question_Edit_Part == 'option'){
        this.TestData.doc[this.Question_Edit_Now].question_options.splice(this.Question_Edit_Option_Index, 1, val);
      }else if(this.Question_Edit_Part == 'sub_question'){
        this.TestData.doc[this.Question_Edit_Now].sub_questions.splice(this.Question_Edit_Sub_Ques_Index, 1, val);
      }
    },
    Show_Part(Question_Index, Part, Index = null){

      if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part){
        this.Question_Edit_Now = -1;
        this.Question_Edit_Part = "";
      }else{
        this.Question_Edit_Now = Question_Index;
        this.Question_Edit_Part = Part;
      }

      if(this.Question_Edit_Part == 'option' && Index != null && Index != this.Question_Edit_Option_Index){
        this.Question_Edit_Option_Index = Index;
      }else{
        this.Question_Edit_Option_Index = -1;
      }

      if(this.Question_Edit_Part == 'sub_question' && Index != null && Index != this.Question_Edit_Sub_Ques_Index){
        this.Question_Edit_Sub_Ques_Index = Index;
      }else{
        this.Question_Edit_Sub_Ques_Index = -1;
      }

      if(this.Question_Edit_Part == 'answer' && Index != null && Index != this.Question_Edit_Answer_Index){
        this.Question_Edit_Answer_Index = Index;
      }else{
        this.Question_Edit_Answer_Index = -1;
      }
    },
    Get_Button_Label(Question_Index, Part, Index = null){
      if(Index == null){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part){
          return "收起"
        }else {
          return "编辑"
        }
      }else if(Part == 'option'){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Option_Index){
          return "收起"
        }else{
          return "编辑"
        }
      }
      else if(Part == 'answer'){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Answer_Index){
          return "收起"
        }else{
          return "编辑"
        }
      }else if(Part == 'sub_question'){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Sub_Ques_Index){
          return "收起"
        }else{
          return "编辑"
        }
      }
    },
    Get_Name(Question_Index, Type, Index = null){
      if(Index == null){
        return "Mathdown" + Question_Index.toString() + "_" + Type
      }else{
        return "Mathdown" + Question_Index.toString() + "_" + Type + "_" + Index.toString()
      }
    },
    // 打开数据展示
    ImportFile(){
      this.$confirm("确认题目无误后请点击左上角锁定此题，所有题目锁定后可以确认审核完毕。").then( () => {
      }).catch(() => {
      })
    },
    // 检测是否有非法字符 - 综合
    Mix_Char_Check(val){

      var Check_Now = val.content;
      var result = this.ChecK_Do(Check_Now);
      if(Check_Now!= "" && result[1]){
        this.$alert("请将题干内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
          confirmButtonText: '确定'
        });
        return false
      }else if(Check_Now!= "" && !result[1]){
        val.content = result[0];
      }

      var Check_Now_List = val.answer;
      Check_Now_List = Check_Now_List.split("::");
      for(var j = 0; j < Check_Now_List.length; j++){
        var item = Check_Now_List[j]
        result = this.ChecK_Do(item);
        if(item != "" && result[1]){
          this.$alert("请将答案内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
            confirmButtonText: '确定'
          });
          return false
        }else if(item != "" && !result[1]){
          Check_Now_List.splice(j, 1, result[0])
        }
      }
      val.answer = Check_Now_List.join("\n");

      Check_Now = val.analyse;
      if(Check_Now!= "" && result[1]){
        this.$alert("请将解析内容中自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
          confirmButtonText: '确定'
        });
        return false
      }else if(Check_Now!= "" && !result[1]){
        val.analyse = result[0];
      }

      Check_Now_List = val.sub_questions;
      for(var len = 0; len < Check_Now_List.length; len++){
        item = Check_Now_List[len]
        result = this.Normal_Char_Check(item)
        val.sub_questions.splice(len, 1, result)
      }

      this.Symbol_Error = false;

      return val;

    },
    // 检测是否有非法字符 - 选择-填空-解答
    Normal_Char_Check(val){

      var Check_Now = val.content;
      var result = this.ChecK_Do(Check_Now);
      if(Check_Now!= "" && result[1]){
        this.$alert("请将题干内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
          confirmButtonText: '确定'
        });
        return false
      }else if(Check_Now!= "" && !result[1]){
        val.content = result[0];
      }

      var Check_Now_List = val.answer;
      Check_Now_List = Check_Now_List.split("::");
      for(let j = 0; j < Check_Now_List.length; j++){
        var item = Check_Now_List[j]
        result = this.ChecK_Do(item);
        if(item != "" && result[1]){
          this.$alert("请将答案内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
            confirmButtonText: '确定'
          });
          return false
        }else if(item != "" && !result[1]){
          Check_Now_List.splice(j, 1, result[0])
        }
      }
      val.answer = Check_Now_List.join("\n");

      Check_Now = val.analyse;
      result = this.ChecK_Do(Check_Now);
      if(Check_Now!= "" && result[1]){
        this.$alert("请将解析内容中自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
          confirmButtonText: '确定'
        });
        return false
      }else if(Check_Now!= "" && !result[1]){
        val.analyse = result[0];
      }

      if(val.type == 'option'){
        Check_Now_List = val.options;
        for(let opi = 0; opi < Check_Now_List.length; opi++){
          item = Check_Now_List[opi]
          result = this.ChecK_Do(item);
          if(item != "" && result[1]){
            this.$alert("请将选项内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
              confirmButtonText: '确定'
            });
            return false
          }else if(item != "" && !result[1]){
            Check_Now_List.splice(opi, 1, result[0])
          }
        }
        val.options = Check_Now_List;
      }else if(val.type == 'answer'){
        Check_Now_List = val.sub_questions;
        for(let opi = 0; opi < Check_Now_List.length; opi++){
          item = Check_Now_List[opi]
          result = this.ChecK_Do(item);
          if(item != "" && result[1]){
            this.$alert("请将选项内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
              confirmButtonText: '确定'
            });
            return false
          }else if(item != "" && !result[1]){
            Check_Now_List.splice(opi, 1, result[0])
          }
        }
        val.sub_questions = Check_Now_List;
      }

      this.Symbol_Error = false;

      return val;
    },
    // 负责实际检查的部分
    ChecK_Do(content){

      let remakeContent = "";

      var latexFlag = false;
      let symbolError = false;
      let Regx = /[A-Za-z0-9]/;

      var Img_Catcher = new RegExp('<img src="(.*?)">', 'g')
      var Result_List = Img_Catcher.exec(content);

      var Img_SE = [];
      var Start = 0;

      while(Result_List != null){
        var Temp_Catcher = '<img src="' + Result_List[1] + '">';
        if(Img_SE.length > 0){
          Start = content.indexOf(Temp_Catcher, Img_SE[Img_SE.length - 1][1]);
        }
        else{
          Start = content.indexOf(Temp_Catcher);
        }
        Img_SE.push([Start, Start + Temp_Catcher.length - 1])
        Result_List = Img_Catcher.exec(content);
      }

      var Img_Index = 0;

      for(var i = 0; i < content.length; i++){

        if(content[i] == '$' && !latexFlag){
            latexFlag = true;
        }else if(content[i] == '$' && latexFlag){
            latexFlag = false;
        }

        if(Img_SE.length > 0 && i >= Img_SE[Img_Index][0] && i <= Img_SE[Img_Index][1]){
          remakeContent = remakeContent + content[i];
          continue;
        }else if(Img_SE.length > 0 && i > Img_SE[Img_Index][1] && Img_Index < Img_SE.length - 1){
          Img_Index = Img_Index + 1
        }

        if(!latexFlag){
            if (Regx.test(content[i]) || this.math_pun_list.indexOf(content[i]) != -1) {
                if(remakeContent[remakeContent.length - 1] == '$'){
                    remakeContent = remakeContent.substring(0, remakeContent.length - 1) + content[i] + "$";
                }else{
                    remakeContent = remakeContent + "$" + content[i] + "$";
                }
            }
            // 中文字符，中英文允许的符号，空格或Latex结尾的$符号，换行符
            else if(!(content.charCodeAt(i) > 255 ||
                      this.ch_pun_list.indexOf(content[i]) != -1 || this.en_pun_list.indexOf(content[i]) != -1 ||
                      content[i] == ' ' || content[i] == '$' ||
                      content.charCodeAt(i) == 10)
                    && !symbolError){
              symbolError = true;
              this.$message.error({message: "请修正位于 " + ( i + 1 ) + " 处的非法字符，或将其包裹于$$符号之内" + content[i] + " ！", offset: 40});
              remakeContent = remakeContent + content[i];
            }
            else {
              remakeContent = remakeContent + content[i];
            }
        }else{
            remakeContent = remakeContent + content[i];
        }
      }
      return [remakeContent, latexFlag]
    },
    Submit(){

      var Docs = this.TestData.doc;

      for(var i = 0; i < Docs.length; i++){

        var Ques = Docs[i]

        Docs[i].question_score = this.testDataScore[i];

        var stem = Ques.question_stem;
        var result = this.ChecK_Do(stem);
        if(result[1]){
          this.$message.error({message: "请将第 "+ (i+1).toString() + " 题题干内容中自己输入的Latex公式完整包裹在$$符号之内！"
                    , offset: 80});
          return false;
        }else{
          Docs[i].question_stem = result[0]
        }

        var answer = Ques.answer;
        for(let j = 0; j < answer.length; j++){
          let item = answer[j]
          result = this.ChecK_Do(item);
          if(result[1]){
            this.$message.error({message: "请将第"+ (i+1).toString() + "题第" + (j+1).toString() + "部分答案内容中自己输入的Latex公式完整包裹在$$符号之内！"
                      , offset: 80});
            return false;
          }else{
            Docs[i].answer.splice(j, 1, result[0])
          }
        }

        var analyse = Ques.analysis;
        result = this.ChecK_Do(analyse);
        if(result[1]){
          this.$message.error({message: "请将第"+ (i+1).toString() + "题解析内容中自己输入的Latex公式完整包裹在$$符号之内！"
                    , offset: 80});
          return false;
        }else{
          Docs[i].analysis = result[0]
        }

        var options = Ques.question_options;
        for(let j = 0; j < options.length; j++){
          result = this.ChecK_Do(options[j]);
          if(result[1]){
            this.$message.error({message: "请将第"+ (i+1).toString() + "题第" + (j+1).toString() + "选项内容中自己输入的Latex公式完整包裹在$$符号之内！"
                      , offset: 80});
            return false;
          }else{
            Docs[i].question_options.splice(j, 1, result[0])
          }
        }

        var sub_Ques = Ques.sub_questions;
        for(let j = 0; j < sub_Ques.length; j++){
          result = this.ChecK_Do(sub_Ques[j]);
          if(result[1]){
            this.$message.error({message: "请将第"+ (i+1).toString() + "题第" + (j+1).toString() + "小题内容中自己输入的Latex公式完整包裹在$$符号之内！"
                      , offset: 80});
            return false;
          }else{
            Docs[i].sub_questions.splice(j, 1, result[0])
          }
        }
      }

      // this.TestData.doc = Docs;

      // console.log("Check_Pass.")

      // let config = {
      //     headers: { "Content-Type": "multipart/form-data" }
      // };
      // let param = new FormData();

      // param.append('result_json', JSON.stringify(this.TestData));
      // this.$http
      // .post(this.backendIP + "/api/mathUpload", param, config, {
      //   emulateJSON: true
      // })
      // .then(function(data) {
      //   console.log(data.data)
      // });

      // var Ques_List = [];

      // var Option_Ques = {
      //     type: "option",
      //     // 分值
      //     score: 1,
      //     // 题目内容，题目内容图片，是否显示图片
      //     content: "",
      //     content_images: [],
      //     // 选项的部分
      //     options: ["", "", "", ""],
      //     options_images: ["", "", "", ""],
      //     // 答案的部分
      //     answer: "",
      //     answer_images: [],
      //     // 解析的部分
      //     analyse: "",
      //     analyse_images: []
      // }

      // var Fill_Ques = {

      //     type: "fill",
      //     // 分值
      //     score: 1,
      //     // 题目内容，题目内容图片，是否显示图片
      //     content: "",
      //     content_images: [],
      //     // 答案的部分
      //     answer: "",
      //     answer_images: [],
      //     // 解析的部分
      //     analyse: "",
      //     analyse_images: []

      // }

      // var Answer_Ques = {

      //     type: "answer",
      //     // 分值
      //     score: 1,
      //     // 题目内容，题目内容图片，是否显示图片
      //     content: "",
      //     content_images: [],
      //     // 小题的部分
      //     sub_questions: [],
      //     sub_questions_images: [],
      //     sub_questions_scores: [],
      //     // 答案的部分
      //     answer: "",
      //     answer_images: [],
      //     // 解析的部分
      //     analyse: "",
      //     analyse_images: []

      // }

      // for(i = 0; i < Docs.length; i++){
      //   Ques = Docs[i]
      //   if(Ques.question_type == "选择题"){
      //     var Opt = Option_Ques;
      //     Opt.type = "option"
      //     Opt.score = "UNKNOWN";
      //     Opt.content = Ques.question_stem;
      //     Opt.content_images = [];
      //     Opt.options = Ques.question_options;
      //     Opt.options_images = [];
      //     for(j = 0; j < Ques.question_options.length; j++){
      //       Opt.options_images.push("")
      //     }
      //     Opt.answer = Ques.answer;
      //     Opt.answer_images = [];
      //     Opt.analyse = Ques.analysis;
      //     Opt.analyse_images = [];
      //     Ques_List.push(Opt);
      //   }else if(Ques.question_type == "填空题"){
      //     var Fill = Fill_Ques;
      //     Fill.type = "fill"
      //     Fill.score = "UNKNOWN";
      //     Fill.content = Ques.question_stem;
      //     Fill.content_images = [];
      //     Fill.answer = Ques.answer;
      //     Fill.answer_images = [];
      //     Fill.analyse = Ques.analysis;
      //     Fill.analyse_images = [];
      //     Ques_List.push(Fill);
      //   }else if(Ques.question_type == "解答题"){
      //     var Ans = Answer_Ques;
      //     Ans.type = "answer";
      //     Ans.score = "UNKNOWN";
      //     Ans.content = Ques.question_stem;
      //     Ans.content_images = []
      //     Ans.answer = Ques.answer;
      //     Ans.answer_images = []
      //     Ans.analyse = Ques.analysis;
      //     Ans.analyse_images = [];
      //     for(j = 0; j < Ques.sub_questions.length; j++){
      //       Ans.sub_questions.push(Ques.sub_questions[j]);
      //       Ans.sub_questions_images.push([]);
      //       Ans.sub_questions_scores.push("UNKNOWN");
      //     }
      //     Ques_List.push(Ans);
      //   }

      // }

      // console.log(Ques_List);

      let config = {
            headers: { "Content-Type": "multipart/form-data" }
        };
      let param = new FormData();

      param.append('result_json',
                    JSON.stringify({
                      "post_type": 3,
                      "title": this.PaperTitle,
                      "subject_type": this.SubjectType,
                      "period_type": this.PeriodType,
                      "questions": this.TestData,
                    }, null, 4));

      this.$http
        .post(this.backendIP + "/api/mathUpload", param, config, {
          emulateJSON: true
        })
        .then(function(data) {
          if(data.data){
            this.$message.success("试卷内容上传已完成。");
          }
        }).catch(() => {
          alert("解析失败，请稍后重新尝试...");
          this.analysing = false;
          return
        });

    },
  }
};
</script>
<style lang="less" scoped>
.panel {
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 3%;
  height: 800px;
}
/deep/ .el-short_input__inner .el-input__inner {
  height: 33px;
  width: 80px;
  text-align: left;
}
/deep/ .el-form-item {
  margin-bottom: 0;
}
h6 {
  font-size: 14px;
}
.tb-edit .el-input {
  display: none;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
// 这是单独处理上传试卷的按钮的样式
// .file {
//     position: relative;
//     display: inline-block;
//     background: #D0EEFF;
//     border: 1px solid #99D3F5;
//     border-radius: 4px;
//     padding: 4px 8px;
//     overflow: hidden;
//     color: #1E88C7;
//     text-decoration: none;
//     text-indent: 0;
//     line-height: 20px;
// }
// .file input {
//     position: absolute;
//     font-size: 100px;
//     right: 0;
//     top: 0;
//     opacity: 0;
// }
// .file:hover {
//     background: #AADFFD;
//     border-color: #78C3F3;
//     color: #004974;
//     text-decoration: none;
// }
// 处理点击上传试卷时的按钮
.btn_file {
  position: relative;
  margin-left: 30px;
  margin-top: 15px;
  padding-top: 5px;
  background-color: #fff;
  height: 50px;
  width: 240px;
  border-radius: 2px;
  border: 1px dashed black;
  cursor: pointer;
}
input {
  position: absolute;
  top: 0;
  right: 0;
  height: 50px;
  width: 240px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}
.area_border{
  background-color: rgba(0,255,255,0.04);
  border: 2px dashed black;
  padding: 20px;
  margin: 18px 0px 18px 0px;
}
.btn_merge{
  margin-left: 30px;
  border: 1px dashed black;
}
.btn_front_cut{
  margin-left: 6px;
  border: 1px dashed black;
}
.btn_back_cut{
  border: 1px dashed black;
}
.btn_trans {
  border: 1px dashed black;
  margin: 15px;
}
</style>
<style >
.confirmButton{
  font-size: 14px !important;
  color: #409EFD !important;
  background: transparent !important;
  border: 1px solid #409EFD !important;
}
</style>
