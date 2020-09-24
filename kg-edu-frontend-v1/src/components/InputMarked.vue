<template>
  <div id="import_paper">
    <el-row class="panel">
      <el-col :span="4">
        <el-row type="flex" justify="start">
          <h5>试题录入</h5>
        </el-row>
        <el-row type="flex" justify="start">
          <span style="font-size:10px;">
            <router-link to="/inputPaper"
              >（录入整套试卷？点击这里）</router-link
            >
          </span>
        </el-row>
        <div style="margin-top:42px;"></div>
        <el-divider></el-divider>
        <div style="margin-top:10px;"></div>
        <el-row>
          <el-upload
            :file-list="upload_files"
            action="alert"
            :auto-upload="false"
            multiple
            :on-change="loadJsonFromFile"
          >
            <el-button type="primary" size="small">导入题目</el-button>
          </el-upload>
          <span style="font-size:10px;">(支持json格式文件)</span>
        </el-row>
        <el-divider></el-divider>
        <div style="margin-top:10px;"></div>
        <el-row>
          <el-button type="primary" @click="output" size="small"
            >导出题目</el-button
          >
        </el-row>
      </el-col>
      <el-col :span="20">
        <el-row style="background-color: #f8f8ff; padding: 5px; 5px;">
          <el-col :span="4">
            <h6>请选择学科：</h6>
          </el-col>
          <el-col :span="20">
            <el-radio v-model="default_subject" label="math">数学</el-radio>
            <el-radio v-model="default_subject" label="physics">物理</el-radio>
            <el-radio v-model="default_subject" label="chemistry"
              >化学</el-radio
            >
            <el-radio v-model="default_subject" label="biology">生物</el-radio>
          </el-col>
        </el-row>
        <div style="margin-top:10px;"></div>
        <el-row style="background-color: #f8f8ff; padding: 5px; 5px;">
          <el-col :span="4">
            <h6>请选择题型：</h6>
          </el-col>
          <el-col :span="20">
            <el-button type="primary" plain size="small" @click="single_choice"
              >单选题</el-button
            >
            <el-button type="primary" plain size="small" @click="fill_in"
              >填空题</el-button
            >
            <el-button
              type="primary"
              plain
              size="small"
              @click="answer_question"
              >解答题</el-button
            >
            <el-button type="primary" plain size="small" @click="mix_question"
              >非选择题</el-button
            >
          </el-col>
        </el-row>

        <el-row
          :span="24"
          style="background-color: #f5f5f5; padding: 5px; 5px; height: 710px; overflow: scroll;"
        >
          <el-form>
            <ol style="text-align:left; margin-left: -35px;">
              <div v-for="(item, index) in option_content" :key="index">
                <el-card @mouseover.native="mouseOver($event)" shadow="hover">
                  <li style="margin-left:35px;">
                    <el-form-item label="分值" label-width="100px">
                      <el-input
                        class="el-short_input__inner"
                        v-model="option_content[index].optionQuestion.score"
                        placeholder="分值"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="题目内容"
                      label-width="100px"
                      style="margin-bottom:5px;"
                    >
                      <el-input
                        type="textarea"
                        autosize
                        v-model="option_content[index].optionQuestion.content"
                      ></el-input>
                      <el-row type="flex" justify="end">
                        <el-button
                          type="info"
                          size="mini"
                          style="float: right;margin-top:10px;"
                          round
                          @click="showImage('option', index, true)"
                          >增加图片
                        </el-button>
                        <el-button
                          type="info"
                          size="mini"
                          v-if="
                            option_show_image[index] !== '' &&
                              option_show_image[index].length > 0
                          "
                          style="float: right;margin-top:10px;"
                          round
                          @click="showImage('option', index, false)"
                          >删除图片
                        </el-button>
                      </el-row>
                      <div
                        v-for="(item, indexOp) in option_show_image[index]"
                        :key="indexOp"
                      >
                        <ImageViewer
                          v-if="option_show_image[index][indexOp]"
                          style="margin-top:15px;"
                          :upload="upload"
                          :data="
                            upload
                              ? option_content[index].optionQuestion.image[
                                  indexOp
                                ]
                              : ''
                          "
                          @updateUpload="resetUpload()"
                          @ImageBase64="
                            saveBase64('option', $event, index, indexOp)
                          "
                        ></ImageViewer>
                      </div>
                    </el-form-item>
                    <el-form-item label="选项" label-width="100px">
                      <ol style="list-style-type: upper-alpha">
                        <li
                          v-for="(option, indexOp) in item.optionQuestion
                            .option"
                          :key="indexOp"
                          style="margin-bottom:0px;"
                        >
                          <el-input
                            type="textarea"
                            autosize
                            v-model="item.optionQuestion.option[indexOp]"
                            :placeholder="
                              '选项' + String.fromCharCode(65 + indexOp)
                            "
                          ></el-input>
                          <i
                            class="el-icon-circle-close"
                            style="position: relative;left:700px;bottom:35px;"
                            @click="deleteOption(index, indexOp)"
                          ></i>
                          <el-button
                            type="info"
                            size="mini"
                            style="float: right;margin-top:10px;"
                            round
                            @click="
                              showOptionImage(
                                'option',
                                index,
                                indexOp,
                                !option_show_option_image[index][indexOp]
                              )
                            "
                            >{{
                              option_show_option_image[index][indexOp]
                                ? "删除图片"
                                : "增加图片"
                            }}</el-button
                          >
                          <ImageViewer
                            v-if="option_show_option_image[index][indexOp]"
                            style="margin-top:-25px"
                            :upload="upload"
                            :data="
                              upload
                                ? option_content[index].optionQuestion
                                    .option_images[indexOp]
                                : ''
                            "
                            @updateUpload="resetUpload()"
                            @ImageBase64="
                              saveBase64Option('option', $event, index, indexOp)
                            "
                          ></ImageViewer>
                        </li>
                      </ol>
                    </el-form-item>
                    <el-form-item
                      label="答案"
                      label-width="100px"
                      v-if="option_show_answer[index] !== false"
                    >
                      <div style="display:flex;">
                        <el-input
                          class="el-short_input__inner"
                          v-model="option_content[index].optionQuestion.answer"
                          placeholder="答案"
                        >
                        </el-input>
                        <i
                          class="el-icon-circle-close"
                          style="position: absolute;right:735px;top:13px;"
                          @click="deleteAnswer('option', index)"
                        ></i>
                      </div>
                    </el-form-item>
                    <el-form-item
                      label="解析"
                      label-width="100px"
                      v-if="option_show_answer_analysis[index] !== false"
                    >
                      <div style="display:flex;">
                        <el-input
                          type="textarea"
                          autosize
                          v-model="
                            option_content[index].optionQuestion.answer_analysis
                          "
                          placeholder="解析"
                        ></el-input>
                        <i
                          class="el-icon-circle-close"
                          style="position: absolute;right:55px;top:10px;"
                          @click="deleteAnswerAnalysis('option', index)"
                        ></i>
                      </div>
                      <el-row type="flex" justify="end">
                        <el-button
                          type="info"
                          size="mini"
                          style="float: right;margin-top:10px;"
                          round
                          @click="showAnalysisImage('option', index, true)"
                          >增加图片
                        </el-button>
                        <el-button
                          type="info"
                          size="mini"
                          v-if="option_show_analysis_image[index].length > 0"
                          style="float: right;margin-top:10px;"
                          round
                          @click="showAnalysisImage('option', index, false)"
                          >删除图片
                        </el-button>
                      </el-row>
                      <div
                        v-for="(item, indexOp) in option_show_analysis_image[
                          index
                        ]"
                        :key="indexOp"
                      >
                        <ImageViewer
                          v-if="option_show_analysis_image[index][indexOp]"
                          style="margin-top:5px;"
                          :upload="upload"
                          :data="
                            upload
                              ? option_content[index].optionQuestion
                                  .analysis_images[indexOp]
                              : ''
                          "
                          @updateUpload="resetUpload()"
                          @ImageBase64="
                            saveBase64Analysis('option', $event, index, indexOp)
                          "
                        ></ImageViewer>
                      </div>
                    </el-form-item>

                    <div style="margin-top:5px;"></div>
                    <el-row type="flex" justify="end">
                      <el-button
                        type="primary"
                        size="mini"
                        round
                        @click="viewQuestion('option', index)"
                        >预览</el-button
                      >
                      <el-button
                        type="info"
                        size="mini"
                        round
                        v-show="option_show_answer[index] === false"
                        @click="showAnswer('option', index, true)"
                        >增加答案</el-button
                      >
                      <el-button
                        type="info"
                        size="mini"
                        v-show="option_show_answer_analysis[index] === false"
                        round
                        @click="showAnswerAnalysis('option', index, true)"
                        >增加答案解析</el-button
                      >
                      <el-button
                        type="success"
                        size="mini"
                        round
                        @click="addOption(index)"
                        >添加选项</el-button
                      >
                      <el-button
                        type="danger"
                        size="mini"
                        round
                        @click="deleteCard(index)"
                        >删除题目</el-button
                      >
                    </el-row>
                    <el-dialog
                      :title="'选择题第' + (index + 1).toString() + '题'"
                      :visible.sync="option_view[index]"
                      width="60%"
                      style="text-align:left;"
                    >
                      <Mathdown
                        :name="
                          'single-option-question' + index.toString() + 'score'
                        "
                        :content="
                          (index + 1).toString() +
                            '.' +
                            (option_content[index].optionQuestion.score === ''
                              ? ''
                              : '(' +
                                option_content[index].optionQuestion.score +
                                ')')
                        "
                      ></Mathdown>
                      <Mathdown
                        :name="'single-option-question' + index.toString()"
                        :content="option_content[index].optionQuestion.content"
                      ></Mathdown>
                      <div
                        v-for="(item, indexOp) in option_show_image[index]"
                        :key="indexOp"
                      >
                        <ImageViewer
                          v-if="option_show_image[index][indexOp]"
                          :data="
                            option_content[index].optionQuestion.image[indexOp]
                          "
                        ></ImageViewer>
                      </div>
                      <ol style="list-style-type: upper-alpha">
                        <li
                          v-for="(option, indexOp) in option_content[index]
                            .optionQuestion.option"
                          :key="indexOp"
                        >
                          <Mathdown
                            :name="
                              'single-option-question' +
                                index.toString() +
                                '-option' +
                                indexOp.toString()
                            "
                            :content="
                              option_content[index].optionQuestion.option[
                                indexOp
                              ]
                            "
                          ></Mathdown>
                          <ImageViewer
                            v-if="option_show_option_image[index][indexOp]"
                            :data="
                              option_content[index].optionQuestion
                                .option_images[indexOp]
                            "
                          ></ImageViewer>
                        </li>
                      </ol>
                      <div style="margin-top:10px;"></div>
                      <Mathdown
                        :name="
                          'single-option-question' + index.toString() + 'answer'
                        "
                        :content="
                          option_content[index].optionQuestion.answer === ''
                            ? ''
                            : '答案：' +
                              option_content[index].optionQuestion.answer
                        "
                      ></Mathdown>
                      <Mathdown
                        :name="
                          'single-option-question' +
                            index.toString() +
                            'answer_analysis'
                        "
                        :content="
                          option_content[index].optionQuestion
                            .answer_analysis === ''
                            ? ''
                            : '解析：' +
                              option_content[index].optionQuestion
                                .answer_analysis
                        "
                      ></Mathdown>
                      <div
                        v-for="(item, indexOp) in option_show_analysis_image[
                          index
                        ]"
                        :key="indexOp"
                      >
                        <ImageViewer
                          v-if="option_show_analysis_image[index][indexOp]"
                          :data="
                            option_content[index].optionQuestion
                              .analysis_images[indexOp]
                          "
                        ></ImageViewer>
                      </div>
                      <span slot="footer" class="dialog-footer">
                        <el-button
                          type="primary"
                          @click="hideQuestionView('option', index)"
                          >确 定</el-button
                        >
                      </span>
                    </el-dialog>
                  </li>
                </el-card>
              </div>
            </ol>
            <!-- 填空题 -->
            <ol style="text-align:left; margin-left: -35px;">
              <el-card
                @mouseover.native="mouseOver($event)"
                shadow="hover"
                v-for="(item, index) in fill_content"
                :key="index"
              >
                <li style="margin-left:35px;">
                  <el-form-item label="分值" label-width="100px">
                    <el-input
                      class="el-short_input__inner"
                      v-model="fill_content[index].fillQuestion.score"
                      placeholder="分值"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="题目" label-width="100px">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="fill_content[index].fillQuestion.content"
                    ></el-input>
                    <el-row type="flex" justify="end">
                      <el-button
                        type="info"
                        size="mini"
                        style="float: right;margin-top:10px;"
                        round
                        @click="showImage('fill', index, true)"
                        >增加图片
                      </el-button>
                      <el-button
                        type="info"
                        size="mini"
                        v-if="
                          fill_show_image[index] !== '' &&
                            fill_show_image[index].length > 0
                        "
                        style="float: right;margin-top:10px;"
                        round
                        @click="showImage('fill', index, false)"
                        >删除图片
                      </el-button>
                    </el-row>
                    <div
                      v-for="(item, indexOp) in fill_show_image[index]"
                      :key="indexOp"
                    >
                      <ImageViewer
                        v-if="fill_show_image[index][indexOp]"
                        style="margin-top:10px;margin-bottom:5px;"
                        :upload="upload"
                        :data="
                          upload
                            ? fill_content[index].fillQuestion.image[indexOp]
                            : ''
                        "
                        @updateUpload="resetUpload()"
                        @ImageBase64="
                          saveBase64('fill', $event, index, indexOp)
                        "
                      ></ImageViewer>
                    </div>
                  </el-form-item>
                  <el-form-item
                    label="答案"
                    label-width="100px"
                    v-if="fill_show_answer[index] !== false"
                  >
                    <el-input
                      type="textarea"
                      autosize
                      v-model="fill_content[index].fillQuestion.answer"
                      placeholder="答案"
                    >
                    </el-input>
                    <i
                      class="el-icon-circle-close"
                      style="position: absolute;right:55px;top:13px;"
                      @click="deleteAnswer('fill', index)"
                    ></i>
                  </el-form-item>
                  <el-form-item
                    label="解析"
                    label-width="100px"
                    v-if="fill_show_answer_analysis[index] !== false"
                  >
                    <el-input
                      type="textarea"
                      autosize
                      v-model="fill_content[index].fillQuestion.answer_analysis"
                      placeholder="解析"
                    ></el-input>
                    <i
                      class="el-icon-circle-close"
                      style="position: absolute;right:55px;top:18px;"
                      @click="deleteAnswerAnalysis('fill', index)"
                    ></i>
                    <el-row type="flex" justify="end">
                      <el-button
                        type="info"
                        size="mini"
                        style="float: right;margin-top:10px;"
                        round
                        @click="showAnalysisImage('fill', index, true)"
                        >增加图片
                      </el-button>
                      <el-button
                        type="info"
                        size="mini"
                        v-if="fill_show_analysis_image[index].length > 0"
                        style="float: right;margin-top:10px;"
                        round
                        @click="showAnalysisImage('fill', index, false)"
                        >删除图片
                      </el-button>
                    </el-row>
                    <div
                      v-for="(item, indexOp) in fill_show_analysis_image[index]"
                      :key="indexOp"
                    >
                      <ImageViewer
                        v-if="fill_show_analysis_image[index][indexOp]"
                        style="margin-top:5px"
                        :upload="upload"
                        :data="
                          upload
                            ? fill_content[index].fillQuestion.analysis_images[
                                indexOp
                              ]
                            : ''
                        "
                        @updateUpload="resetUpload()"
                        @ImageBase64="
                          saveBase64Analysis('fill', $event, index, indexOp)
                        "
                      ></ImageViewer>
                    </div>
                  </el-form-item>
                </li>
                <div style="margin-top:5px;"></div>
                <el-row type="flex" justify="end">
                  <el-button
                    type="primary"
                    size="mini"
                    round
                    @click="viewQuestion('fill', index)"
                    >预览</el-button
                  >
                  <el-button
                    type="success"
                    size="mini"
                    round
                    @click="addFillPlaceHolder(index)"
                    >增加占位符</el-button
                  >
                  <el-button
                    type="info"
                    size="mini"
                    round
                    v-show="fill_show_answer[index] === false"
                    @click="showAnswer('fill', index, true)"
                    >增加答案</el-button
                  >
                  <el-button
                    type="info"
                    size="mini"
                    v-show="fill_show_answer_analysis[index] === false"
                    round
                    @click="showAnswerAnalysis('fill', index, true)"
                    >增加答案解析</el-button
                  >
                  <el-button
                    type="danger"
                    size="mini"
                    round
                    @click="deleteFillCard(index)"
                    >删除题目</el-button
                  >
                </el-row>
                <el-dialog
                  :title="'填空题第' + (index + 1).toString() + '题'"
                  :visible.sync="fill_view[index]"
                  width="60%"
                  style="text-align:left;"
                >
                  <Mathdown
                    :name="'single-fill-question' + index.toString() + 'score'"
                    :content="
                      (index + 1).toString() +
                        '.' +
                        (fill_content[index].fillQuestion.score === ''
                          ? ''
                          : '(' + fill_content[index].fillQuestion.score + ')')
                    "
                  ></Mathdown>
                  <Mathdown
                    :name="'single-fill-question' + index.toString()"
                    :content="fill_content[index].fillQuestion.content"
                  ></Mathdown>
                  <div
                    v-for="(item, indexOp) in fill_show_image[index]"
                    :key="indexOp"
                  >
                    <ImageViewer
                      v-if="fill_show_image[index][indexOp]"
                      :data="fill_content[index].fillQuestion.image[indexOp]"
                    ></ImageViewer>
                  </div>
                  <Mathdown
                    :name="'single-fill-question' + index.toString() + 'answer'"
                    :content="
                      fill_content[index].fillQuestion.answer === ''
                        ? ''
                        : '答案：' + fill_content[index].fillQuestion.answer
                    "
                  ></Mathdown>
                  <Mathdown
                    :name="
                      'single-fill-question' +
                        index.toString() +
                        'answer_analysis'
                    "
                    :content="
                      fill_content[index].fillQuestion.answer_analysis === ''
                        ? ''
                        : '解析：' +
                          fill_content[index].fillQuestion.answer_analysis
                    "
                  ></Mathdown>
                  <div
                    v-for="(item, indexOp) in fill_show_analysis_image[index]"
                    :key="indexOp"
                  >
                    <ImageViewer
                      v-if="fill_show_analysis_image[index][indexOp]"
                      :data="
                        fill_content[index].fillQuestion.analysis_images[
                          indexOp
                        ]
                      "
                    ></ImageViewer>
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button
                      type="primary"
                      @click="hideQuestionView('fill', index)"
                      >确 定</el-button
                    >
                  </span>
                </el-dialog>
              </el-card>
            </ol>
            <!-- 解答题 -->

            <ol style="text-align:left; margin-left: -35px;">
              <el-card
                @mouseover.native="mouseOver($event)"
                shadow="hover"
                v-for="(item, index) in answer_content"
                :key="index"
              >
                <li style="margin-left:35px;">
                  <el-form-item label="分值" label-width="100px">
                    <el-input
                      class="el-short_input__inner"
                      v-model="answer_content[index].answerQuestion.score"
                      placeholder="分值"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="题目" label-width="100px">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="answer_content[index].answerQuestion.content"
                    ></el-input>
                    <el-row type="flex" justify="end">
                      <el-button
                        type="info"
                        size="mini"
                        style="float: right;margin-top:10px;"
                        round
                        @click="showImage('answer', index, true)"
                        >增加图片
                      </el-button>
                      <el-button
                        type="info"
                        size="mini"
                        v-if="
                          answer_show_image[index] !== '' &&
                            answer_show_image[index].length > 0
                        "
                        style="float: right;margin-top:10px;"
                        round
                        @click="showImage('answer', index, false)"
                        >删除图片
                      </el-button>
                    </el-row>
                    <div
                      v-for="(item, indexOp) in answer_show_image[index]"
                      :key="indexOp"
                    >
                      <ImageViewer
                        v-if="answer_show_image[index][indexOp]"
                        style="margin-top:10px"
                        :upload="upload"
                        :data="
                          upload
                            ? answer_content[index].answerQuestion.image[
                                indexOp
                              ]
                            : ''
                        "
                        @updateUpload="resetUpload()"
                        @ImageBase64="
                          saveBase64('answer', $event, index, indexOp)
                        "
                      ></ImageViewer>
                    </div>
                  </el-form-item>
                  <ol type="i">
                    <el-form-item label-width="100px">
                      <li
                        v-for="(option, indexOp) in item.answerQuestion
                          .sub_questions"
                        :key="indexOp"
                        style="margin-bottom: 10px"
                      >
                        <el-form-item label="分值" label-width="50px">
                          <el-input
                            class="el-short_input__inner"
                            v-model="
                              answer_content[index].answerQuestion.sub_score[
                                indexOp
                              ]
                            "
                            placeholder="分值"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="题目" label-width="50px">
                          <div style="display:flex;">
                            <el-input
                              type="textarea"
                              autosize
                              v-model="
                                item.answerQuestion.sub_questions[indexOp]
                              "
                            ></el-input>
                            <i
                              class="el-icon-circle-close"
                              style="position: absolute;right:55px;top:10px;"
                              @click="deleteAnswerOption(index, indexOp)"
                            ></i>
                          </div>
                          <el-button
                            type="info"
                            size="mini"
                            style="float: right;margin-top:10px;"
                            round
                            @click="
                              showOptionImage(
                                'answer',
                                index,
                                indexOp,
                                !answer_show_option_image[index][indexOp]
                              )
                            "
                            >{{
                              answer_show_option_image[index][indexOp]
                                ? "删除图片"
                                : "增加图片"
                            }}</el-button
                          >
                          <ImageViewer
                            v-if="answer_show_option_image[index][indexOp]"
                            style="margin-top:15px"
                            :upload="upload"
                            :data="
                              upload
                                ? answer_content[index].answerQuestion
                                    .option_images[indexOp]
                                : ''
                            "
                            @updateUpload="resetUpload()"
                            @ImageBase64="
                              saveBase64Option('answer', $event, index, indexOp)
                            "
                          ></ImageViewer>
                        </el-form-item>
                      </li>
                    </el-form-item>
                  </ol>
                  <el-form-item
                    label="答案"
                    label-width="100px"
                    v-if="answer_show_answer[index] !== false"
                  >
                    <el-input
                      type="textarea"
                      autosize
                      v-model="answer_content[index].answerQuestion.answer"
                      placeholder="答案"
                    >
                    </el-input>
                    <i
                      class="el-icon-circle-close"
                      style="position: absolute;right:55px;top:13px;"
                      @click="deleteAnswer('answer', index)"
                    ></i>
                    <el-row type="flex" justify="end">
                      <el-button
                        type="info"
                        size="mini"
                        style="float: right;margin-top:10px;margin-bottom:10px;"
                        round
                        @click="showAnswerImage('answer', index, true)"
                        >增加图片
                      </el-button>
                      <el-button
                        type="info"
                        size="mini"
                        v-if="answer_show_answer_image[index].length > 0"
                        style="float: right;margin-top:10px;margin-bottom:10px;"
                        round
                        @click="showAnswerImage('answer', index, false)"
                        >删除图片
                      </el-button>
                    </el-row>
                    <div
                      v-for="(item, indexAn) in answer_show_answer_image[index]"
                      :key="indexAn + 'answer'"
                    >
                      <ImageViewer
                        v-if="answer_show_answer_image[index][indexAn]"
                        style="margin-top:5px"
                        :upload="upload"
                        :data="
                          upload
                            ? answer_content[index].answerQuestion
                                .answer_images[indexAn]
                            : ''
                        "
                        @updateUpload="resetUpload()"
                        @ImageBase64="
                          saveBase64Answer('answer', $event, index, indexAn)
                        "
                      ></ImageViewer>
                    </div>
                  </el-form-item>
                  <el-form-item
                    label="解析"
                    label-width="100px"
                    v-if="answer_show_answer_analysis[index] !== false"
                  >
                    <el-input
                      type="textarea"
                      autosize
                      v-model="
                        answer_content[index].answerQuestion.answer_analysis
                      "
                      placeholder="解析"
                    ></el-input>
                    <i
                      class="el-icon-circle-close"
                      style="position: absolute;right:55px;top:18px;"
                      @click="deleteAnswerAnalysis('answer', index)"
                    ></i>
                    <el-row type="flex" justify="end">
                      <el-button
                        type="info"
                        size="mini"
                        style="float: right;margin-top:10px;"
                        round
                        @click="showAnalysisImage('answer', index, true)"
                        >增加图片
                      </el-button>
                      <el-button
                        type="info"
                        size="mini"
                        v-if="answer_show_analysis_image[index].length > 0"
                        style="float: right;margin-top:10px;"
                        round
                        @click="showAnalysisImage('answer', index, false)"
                        >删除图片
                      </el-button>
                    </el-row>
                    <div
                      v-for="(item, indexOp) in answer_show_analysis_image[
                        index
                      ]"
                      :key="indexOp"
                    >
                      <ImageViewer
                        v-if="answer_show_analysis_image[index][indexOp]"
                        style="margin-top:5px"
                        :upload="upload"
                        :data="
                          upload
                            ? answer_content[index].answerQuestion
                                .analysis_images[indexOp]
                            : ''
                        "
                        @updateUpload="resetUpload()"
                        @ImageBase64="
                          saveBase64Analysis('answer', $event, index, indexOp)
                        "
                      ></ImageViewer>
                    </div>
                  </el-form-item>
                </li>
                <div style="margin-top:5px;"></div>
                <el-row type="flex" justify="end">
                  <el-button
                    type="primary"
                    size="mini"
                    round
                    @click="viewQuestion('answer', index)"
                    >预览</el-button
                  >
                  <el-button
                    type="info"
                    size="mini"
                    round
                    v-show="answer_show_answer[index] === false"
                    @click="showAnswer('answer', index, true)"
                    >增加答案</el-button
                  >
                  <el-button
                    type="info"
                    size="mini"
                    v-show="answer_show_answer_analysis[index] === false"
                    round
                    @click="showAnswerAnalysis('answer', index, true)"
                    >增加答案解析</el-button
                  >
                  <el-button
                    type="success"
                    size="mini"
                    round
                    @click="addAnswerOption(index)"
                    >添加小题</el-button
                  >
                  <el-button
                    type="danger"
                    size="mini"
                    round
                    @click="deleteAnswerCard(index)"
                    >删除题目</el-button
                  >
                </el-row>
                <el-dialog
                  :title="'解答题第' + (index + 1).toString() + '题'"
                  :visible.sync="answer_view[index]"
                  width="60%"
                  style="text-align:left;"
                >
                  <Mathdown
                    :name="
                      'single-answer-question' + index.toString() + 'score'
                    "
                    :content="
                      (index + 1).toString() +
                        '.' +
                        (answer_content[index].answerQuestion.score === ''
                          ? ''
                          : '(' +
                            answer_content[index].answerQuestion.score +
                            ')')
                    "
                  ></Mathdown>
                  <Mathdown
                    :name="'single-answer-question' + index.toString()"
                    :content="answer_content[index].answerQuestion.content"
                  ></Mathdown>
                  <div
                    v-for="(item, indexOp) in answer_show_image[index]"
                    :key="indexOp"
                  >
                    <ImageViewer
                      v-if="answer_show_image[index][indexOp]"
                      :data="
                        answer_content[index].answerQuestion.image[indexOp]
                      "
                    ></ImageViewer>
                  </div>
                  <ol type="i">
                    <li
                      v-for="(option, indexOp) in answer_content[index]
                        .answerQuestion.sub_questions"
                      :key="indexOp"
                    >
                      <Mathdown
                        :name="
                          'single-answer-question' +
                            index.toString() +
                            '-sub' +
                            indexOp.toString() +
                            '-score'
                        "
                        :content="
                          answer_content[index].answerQuestion.sub_score[
                            indexOp
                          ] === undefined ||
                          answer_content[index].answerQuestion.sub_score[
                            indexOp
                          ] === ''
                            ? ''
                            : '(' +
                              answer_content[index].answerQuestion.sub_score[
                                indexOp
                              ] +
                              ')'
                        "
                      ></Mathdown>
                      <Mathdown
                        :name="
                          'single-answer-question' +
                            index.toString() +
                            '-sub' +
                            indexOp.toString()
                        "
                        :content="
                          answer_content[index].answerQuestion.sub_questions[
                            indexOp
                          ]
                        "
                      ></Mathdown>
                      <ImageViewer
                        v-if="answer_show_option_image[index][indexOp]"
                        :data="
                          answer_content[index].answerQuestion.option_images[
                            indexOp
                          ]
                        "
                      ></ImageViewer>
                    </li>
                  </ol>
                  <Mathdown
                    :name="
                      'single-answer-question' + index.toString() + 'answer'
                    "
                    :content="
                      answer_content[index].answerQuestion.answer === ''
                        ? ''
                        : '答案：' + answer_content[index].answerQuestion.answer
                    "
                  ></Mathdown>
                  <div
                    v-for="(item, indexAn) in answer_show_answer_image[index]"
                    :key="indexAn + 'an'"
                  >
                    <ImageViewer
                      v-if="answer_show_answer_image[index][indexAn]"
                      :data="
                        answer_content[index].answerQuestion.answer_images[
                          indexAn
                        ]
                      "
                    ></ImageViewer>
                  </div>
                  <Mathdown
                    :name="
                      'single-answer-question' +
                        index.toString() +
                        'answer_analysis'
                    "
                    :content="
                      answer_content[index].answerQuestion.answer_analysis ===
                      ''
                        ? ''
                        : '解析：' +
                          answer_content[index].answerQuestion.answer_analysis
                    "
                  ></Mathdown>
                  <div
                    v-for="(item, indexOp) in answer_show_analysis_image[index]"
                    :key="indexOp"
                  >
                    <ImageViewer
                      v-if="answer_show_analysis_image[index][indexOp]"
                      :data="
                        answer_content[index].answerQuestion.analysis_images[
                          indexOp
                        ]
                      "
                    ></ImageViewer>
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button
                      type="primary"
                      @click="hideQuestionView('answer', index)"
                      >确 定</el-button
                    >
                  </span>
                </el-dialog>
              </el-card>
            </ol>
            <!-- 非选择题 -->

            <ol style="text-align:left; margin-left: -35px;">
              <el-card
                @mouseover.native="mouseOver($event)"
                shadow="hover"
                v-for="(item, index) in mix_content"
                :key="index"
              >
                <li style="margin-left:35px;">
                  <el-form-item label="分值" label-width="100px">
                    <el-input
                      class="el-short_input__inner"
                      v-model="mix_content[index].mixQuestion.score"
                      placeholder="分值"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="题目" label-width="100px">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="mix_content[index].mixQuestion.content"
                    ></el-input>
                    <el-row type="flex" justify="end">
                      <el-button
                        type="info"
                        size="mini"
                        style="float: right;margin-top:10px;"
                        round
                        @click="showImage('mix', index, true)"
                        >增加图片
                      </el-button>
                      <el-button
                        type="info"
                        size="mini"
                        v-if="
                          mix_show_image[index] !== '' &&
                            mix_show_image[index].length > 0
                        "
                        style="float: right;margin-top:10px;"
                        round
                        @click="showImage('mix', index, false)"
                        >删除图片
                      </el-button>
                    </el-row>
                    <div
                      v-for="(item, indexOp) in mix_show_image[index]"
                      :key="indexOp + 'img1'"
                    >
                      <ImageViewer
                        v-if="mix_show_image[index][indexOp]"
                        style="margin-top:10px"
                        :upload="upload"
                        :data="
                          upload
                            ? mix_content[index].mixQuestion.image[indexOp]
                            : ''
                        "
                        @updateUpload="resetUpload()"
                        @ImageBase64="saveBase64('mix', $event, index, indexOp)"
                      ></ImageViewer>
                    </div>
                  </el-form-item>
                  <ol type="i">
                    <el-form-item label-width="100px">
                      <div
                        v-for="(sub_item, indexOp) in mix_content[index]
                          .mixQuestion.mix_sub_questions"
                        :key="indexOp + 'sub_'"
                      >
                        <li
                          v-if="
                            mix_content[index].mixQuestion.mix_sub_questions[0]
                          "
                        >
                          <el-form-item label="分值" label-width="50px">
                            <el-input
                              class="el-short_input__inner"
                              v-model="
                                mix_content[index].mixQuestion
                                  .mix_sub_questions[indexOp].sub_question.score
                              "
                              placeholder="分值"
                            ></el-input>
                          </el-form-item>
                          <el-form-item label="题目" label-width="50px">
                            <div style="display:flex;">
                              <el-input
                                type="textarea"
                                autosize
                                v-model="
                                  mix_content[index].mixQuestion
                                    .mix_sub_questions[indexOp].sub_question
                                    .content
                                "
                              ></el-input>
                              <i
                                class="el-icon-circle-close"
                                style="position: absolute;right:55px;top:10px;"
                                @click="deleteMixSub(index, indexOp)"
                              ></i>
                            </div>
                            <el-row type="flex" justify="end">
                              <el-button
                                type="info"
                                size="mini"
                                style="float: right;margin-top:10px;"
                                round
                                @click="
                                  showSubImage(
                                    'sub_question',
                                    index,
                                    indexOp,
                                    true
                                  )
                                "
                                >增加图片
                              </el-button>
                              <el-button
                                type="info"
                                size="mini"
                                v-if="
                                  mix_content[index].mixQuestion.mix_sub_image[
                                    indexOp
                                  ] !== '' &&
                                    mix_content[index].mixQuestion
                                      .mix_sub_image[indexOp].length > 0
                                "
                                style="float: right;margin-top:10px;"
                                round
                                @click="
                                  showSubImage(
                                    'sub_question',
                                    index,
                                    indexOp,
                                    false
                                  )
                                "
                                >删除图片
                              </el-button>
                            </el-row>
                            <div
                              v-for="(item, indexImg) in mix_content[index]
                                .mixQuestion.mix_sub_image[indexOp]"
                              :key="indexImg + 'img2'"
                            >
                              <ImageViewer
                                v-if="
                                  mix_content[index].mixQuestion.mix_sub_image[
                                    indexOp
                                  ][indexImg]
                                "
                                style="margin-top:15px;"
                                :upload="upload"
                                :data="
                                  upload
                                    ? mix_content[index].mixQuestion
                                        .mix_sub_questions[indexOp].sub_question
                                        .image[indexImg]
                                    : ''
                                "
                                @updateUpload="resetUpload()"
                                @ImageBase64="
                                  saveBase64Sub(
                                    'sub_question',
                                    $event,
                                    index,
                                    indexOp,
                                    indexImg
                                  )
                                "
                              ></ImageViewer>
                            </div>
                          </el-form-item>
                        </li>
                      </div>
                      <div
                        v-for="(sub_item, indexOp) in mix_content[index]
                          .mixQuestion.mix_sub_fill_questions"
                        :key="indexOp + 'sub_fill'"
                      >
                        <li
                          v-if="
                            mix_content[index].mixQuestion
                              .mix_sub_fill_questions[0]
                          "
                        >
                          <el-form-item label="分值" label-width="50px">
                            <el-input
                              class="el-short_input__inner"
                              v-model="
                                mix_content[index].mixQuestion
                                  .mix_sub_fill_questions[indexOp].sub_fill
                                  .score
                              "
                              placeholder="分值"
                            ></el-input>
                          </el-form-item>
                          <el-form-item label="题目" label-width="50px">
                            <div style="display:flex;">
                              <el-input
                                type="textarea"
                                autosize
                                v-model="
                                  mix_content[index].mixQuestion
                                    .mix_sub_fill_questions[indexOp].sub_fill
                                    .content
                                "
                              ></el-input>
                              <i
                                class="el-icon-circle-close"
                                style="position: absolute;right:55px;top:10px;"
                                @click="deleteMixFill(index, indexOp)"
                              ></i>
                            </div>
                            <el-row type="flex" justify="end">
                              <!-- 表格 -->
                              <el-button
                                type="info"
                                size="mini"
                                round
                                style="float: right;margin-top:10px;"
                                v-if="
                                  mix_content[index].mixQuestion
                                    .mix_sub_fill_questions[indexOp].sub_fill
                                    .tableConfig.length === 0
                                "
                                @click="
                                  mix_content[
                                    index
                                  ].mixQuestion.mix_sub_fill_questions[
                                    indexOp
                                  ].sub_fill.mix_sub_fill_table_view = true
                                "
                                >增加表格</el-button
                              >
                              <el-button
                                type="info"
                                size="mini"
                                round
                                style="float: right;margin-top:10px;"
                                v-if="
                                  mix_content[index].mixQuestion
                                    .mix_sub_fill_questions[indexOp].sub_fill
                                    .tableConfig.length > 0
                                "
                                @click="
                                  showSubTable(
                                    'sub_fill',
                                    index,
                                    indexOp,
                                    false
                                  )
                                "
                                >删除表格</el-button
                              >
                              <el-button
                                type="info"
                                size="mini"
                                style="float: right;margin-top:10px;"
                                round
                                @click="
                                  showSubImage('sub_fill', index, indexOp, true)
                                "
                                >增加图片
                              </el-button>
                              <el-button
                                type="info"
                                size="mini"
                                v-if="
                                  mix_content[index].mixQuestion
                                    .mix_sub_fill_image[indexOp] !== '' &&
                                    mix_content[index].mixQuestion
                                      .mix_sub_fill_image[indexOp].length > 0
                                "
                                style="float: right;margin-top:10px;"
                                round
                                @click="
                                  showSubImage(
                                    'sub_fill',
                                    index,
                                    indexOp,
                                    false
                                  )
                                "
                                >删除图片
                              </el-button>
                            </el-row>
                            <div
                              v-for="(item, indexImg) in mix_content[index]
                                .mixQuestion.mix_sub_fill_image[indexOp]"
                              :key="indexImg + 'img3'"
                            >
                              <ImageViewer
                                v-if="
                                  mix_content[index].mixQuestion
                                    .mix_sub_fill_image[indexOp][indexImg]
                                "
                                style="margin-top:15px;"
                                :upload="upload"
                                :data="
                                  upload
                                    ? mix_content[index].mixQuestion
                                        .mix_sub_fill_questions[indexOp]
                                        .sub_fill.image[indexImg]
                                    : ''
                                "
                                @updateUpload="resetUpload()"
                                @ImageBase64="
                                  saveBase64Sub(
                                    'sub_fill',
                                    $event,
                                    index,
                                    indexOp,
                                    indexImg
                                  )
                                "
                              ></ImageViewer>
                            </div>
                            <!-- 表格 -->
                            <div
                              v-if="
                                mix_content[index].mixQuestion
                                  .mix_sub_fill_questions[indexOp].sub_fill
                                  .tableConfig.length > 0
                              "
                            >
                              <el-table
                                :data="
                                  mix_content[index].mixQuestion
                                    .mix_sub_fill_questions[indexOp].sub_fill
                                    .tableData
                                "
                                class="tb-edit"
                                border
                                style="width: 100%"
                                highlight-current-row
                                @row-click="handleCurrentChange"
                                :show-header="false"
                              >
                                <el-table-column
                                  v-for="(item, indexT) in mix_content[index]
                                    .mixQuestion.mix_sub_fill_questions[indexOp]
                                    .sub_fill.tableConfig"
                                  :label="item.label"
                                  :key="indexT + 'sub_t'"
                                >
                                  <template slot-scope="scope">
                                    <el-input
                                      size="small"
                                      v-model="scope.row[item.prop]"
                                      placeholder="内容"
                                      @change="
                                        handleEdit(scope.$indexT, scope.row)
                                      "
                                    ></el-input>
                                    <span>{{ scope.row[item.prop] }}</span>
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                          </el-form-item>
                          <h1></h1>
                          <el-dialog
                            title="创建表格"
                            :visible.sync="
                              mix_content[index].mixQuestion
                                .mix_sub_fill_questions[indexOp].sub_fill
                                .mix_sub_fill_table_view
                            "
                            width="30%"
                          >
                            <el-form>
                              <el-form-item label="行数：" label-width="60px">
                                <el-input
                                  v-model="
                                    mix_content[index].mixQuestion
                                      .mix_sub_fill_questions[indexOp].sub_fill
                                      .table_row
                                  "
                                  autocomplete="off"
                                ></el-input>
                              </el-form-item>
                              <el-form-item label="列数：" label-width="60px">
                                <el-input
                                  v-model="
                                    mix_content[index].mixQuestion
                                      .mix_sub_fill_questions[indexOp].sub_fill
                                      .table_col
                                  "
                                  autocomplete="off"
                                ></el-input>
                              </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                              <el-button
                                type="primary"
                                @click="
                                  showSubTable('sub_fill', index, indexOp, true)
                                "
                                >确 定</el-button
                              >
                            </div>
                          </el-dialog>
                          <el-button
                            type="success"
                            size="mini"
                            round
                            style="float: right;"
                            @click="addSubFillPlaceHolder(index, indexOp)"
                            >增加占位符</el-button
                          >
                        </li>
                      </div>
                      <div
                        v-for="(sub_item, indexOp) in mix_content[index]
                          .mixQuestion.mix_sub_choice_questions"
                        :key="indexOp + 'sub_choice'"
                      >
                        <li
                          v-if="
                            mix_content[index].mixQuestion
                              .mix_sub_choice_questions[0]
                          "
                        >
                          <el-form-item label="分值" label-width="50px">
                            <el-input
                              class="el-short_input__inner"
                              v-model="
                                mix_content[index].mixQuestion
                                  .mix_sub_choice_questions[indexOp].sub_choice
                                  .score
                              "
                              placeholder="分值"
                            ></el-input>
                          </el-form-item>
                          <el-form-item label="题目" label-width="50px">
                            <div style="display:flex;">
                              <el-input
                                type="textarea"
                                autosize
                                v-model="
                                  mix_content[index].mixQuestion
                                    .mix_sub_choice_questions[indexOp]
                                    .sub_choice.content
                                "
                              ></el-input>
                              <i
                                class="el-icon-circle-close"
                                style="position: absolute;right:55px;top:10px;"
                                @click="deleteMixOption(index, indexOp)"
                              ></i>
                            </div>
                            <el-row type="flex" justify="end">
                              <el-button
                                type="info"
                                size="mini"
                                style="float: right;margin-top:10px;"
                                round
                                @click="
                                  showSubImage(
                                    'sub_choice',
                                    index,
                                    indexOp,
                                    true
                                  )
                                "
                                >增加图片
                              </el-button>
                              <el-button
                                type="info"
                                size="mini"
                                v-if="
                                  mix_content[index].mixQuestion
                                    .mix_sub_choice_image[indexOp] !== '' &&
                                    mix_content[index].mixQuestion
                                      .mix_sub_choice_image[indexOp].length > 0
                                "
                                style="float: right;margin-top:10px;"
                                round
                                @click="
                                  showSubImage(
                                    'sub_choice',
                                    index,
                                    indexOp,
                                    false
                                  )
                                "
                                >删除图片
                              </el-button>
                            </el-row>
                            <div
                              v-for="(item, indexImg) in mix_content[index]
                                .mixQuestion.mix_sub_choice_image[indexOp]"
                              :key="indexImg + 'img_choice'"
                            >
                              <ImageViewer
                                v-if="
                                  mix_content[index].mixQuestion
                                    .mix_sub_choice_image[indexOp][indexImg]
                                "
                                style="margin-top:15px;"
                                :upload="upload"
                                :data="
                                  upload
                                    ? mix_content[index].mixQuestion
                                        .mix_sub_choice_questions[indexOp]
                                        .sub_choice.image[indexImg]
                                    : ''
                                "
                                @updateUpload="resetUpload()"
                                @ImageBase64="
                                  saveBase64Sub(
                                    'sub_choice',
                                    $event,
                                    index,
                                    indexOp,
                                    indexImg
                                  )
                                "
                              ></ImageViewer>
                            </div>
                          </el-form-item>
                          <el-form-item label="选项" label-width="100px">
                            <ol style="list-style-type: upper-alpha">
                              <li
                                v-for="(option, indexP) in sub_item.sub_choice
                                  .option"
                                :key="indexP + 'sub_op'"
                              >
                                <el-input
                                  type="textarea"
                                  autosize
                                  v-model="sub_item.sub_choice.option[indexP]"
                                  :placeholder="
                                    '选项' + String.fromCharCode(65 + indexP)
                                  "
                                ></el-input>
                                <i
                                  class="el-icon-circle-close"
                                  style="position: relative;left:700px;bottom:35px;"
                                  @click="
                                    deleteSubOption(index, indexOp, indexP)
                                  "
                                ></i>
                                <el-button
                                  type="info"
                                  size="mini"
                                  style="float: right;margin-top:10px;"
                                  round
                                  @click="
                                    showSubOptionImage(
                                      'sub_choice',
                                      index,
                                      indexOp,
                                      indexP,
                                      !mix_content[index].mixQuestion
                                        .mix_sub_choice_option_image[indexOp][
                                        indexP
                                      ]
                                    )
                                  "
                                  >{{
                                    mix_content[index].mixQuestion
                                      .mix_sub_choice_option_image[indexOp][
                                      indexP
                                    ]
                                      ? "删除图片"
                                      : "增加图片"
                                  }}</el-button
                                >
                                <ImageViewer
                                  v-if="
                                    mix_content[index].mixQuestion
                                      .mix_sub_choice_option_image[indexOp][
                                      indexP
                                    ]
                                  "
                                  style="margin-top:-25px"
                                  :upload="upload"
                                  :data="
                                    upload
                                      ? mix_content[index].mixQuestion
                                          .mix_sub_choice_questions[indexOp]
                                          .sub_choice.option_images[indexP]
                                      : ''
                                  "
                                  @updateUpload="resetUpload()"
                                  @ImageBase64="
                                    saveBase64SubOption(
                                      'sub_choice',
                                      $event,
                                      index,
                                      indexOp,
                                      indexP
                                    )
                                  "
                                ></ImageViewer>
                              </li>
                            </ol>
                            <el-button
                              type="success"
                              size="mini"
                              round
                              style="float: right;"
                              @click="addSubOption(index, indexOp)"
                              >添加选项</el-button
                            >
                          </el-form-item>
                        </li>
                      </div>
                    </el-form-item>
                  </ol>
                  <el-form-item
                    label="答案"
                    label-width="100px"
                    v-if="mix_show_answer[index] !== false"
                  >
                    <el-input
                      type="textarea"
                      autosize
                      v-model="mix_content[index].mixQuestion.answer"
                      placeholder="答案"
                    >
                    </el-input>
                    <i
                      class="el-icon-circle-close"
                      style="position: absolute;right:55px;top:13px;"
                      @click="deleteAnswer('mix', index)"
                    ></i>
                    <el-row type="flex" justify="end">
                      <el-button
                        type="info"
                        size="mini"
                        style="float: right;margin-top:10px;margin-bottom:10px;"
                        round
                        @click="showAnswerImage('mix', index, true)"
                        >增加图片
                      </el-button>
                      <el-button
                        type="info"
                        size="mini"
                        v-if="mix_show_answer_image[index].length > 0"
                        style="float: right;margin-top:10px;margin-bottom:10px;"
                        round
                        @click="showAnswerImage('mix', index, false)"
                        >删除图片
                      </el-button>
                    </el-row>
                    <div
                      v-for="(item, indexAn) in mix_show_answer_image[index]"
                      :key="indexAn + 'mix'"
                    >
                      <ImageViewer
                        v-if="mix_show_answer_image[index][indexAn]"
                        style="margin-top:5px"
                        :upload="upload"
                        :data="
                          upload
                            ? mix_content[index].mixQuestion.answer_images[
                                indexAn
                              ]
                            : ''
                        "
                        @updateUpload="resetUpload()"
                        @ImageBase64="
                          saveBase64Answer('mix', $event, index, indexAn)
                        "
                      ></ImageViewer>
                    </div>
                  </el-form-item>
                  <el-form-item
                    label="解析"
                    label-width="100px"
                    v-if="mix_show_answer_analysis[index] !== false"
                  >
                    <el-input
                      type="textarea"
                      autosize
                      v-model="mix_content[index].mixQuestion.answer_analysis"
                      placeholder="解析"
                    ></el-input>
                    <i
                      class="el-icon-circle-close"
                      style="position: absolute;right:55px;top:18px;"
                      @click="deleteAnswerAnalysis('mix', index)"
                    ></i>
                    <el-row type="flex" justify="end">
                      <el-button
                        type="info"
                        size="mini"
                        style="float: right;margin-top:10px;"
                        round
                        @click="showAnalysisImage('mix', index, true)"
                        >增加图片
                      </el-button>
                      <el-button
                        type="info"
                        size="mini"
                        v-if="mix_show_analysis_image[index].length > 0"
                        style="float: right;margin-top:10px;"
                        round
                        @click="showAnalysisImage('mix', index, false)"
                        >删除图片
                      </el-button>
                    </el-row>
                    <div
                      v-for="(item, indexOp) in mix_show_analysis_image[index]"
                      :key="indexOp"
                    >
                      <ImageViewer
                        v-if="mix_show_analysis_image[index][indexOp]"
                        style="margin-top:5px"
                        :upload="upload"
                        :data="
                          upload
                            ? mix_content[index].mixQuestion.analysis_images[
                                indexOp
                              ]
                            : ''
                        "
                        @updateUpload="resetUpload()"
                        @ImageBase64="
                          saveBase64Analysis('mix', $event, index, indexOp)
                        "
                      ></ImageViewer>
                    </div>
                  </el-form-item>
                </li>
                <div style="margin-top:5px;"></div>
                <el-row type="flex" justify="end">
                  <el-button
                    type="primary"
                    size="mini"
                    round
                    @click="viewQuestion('mix', index)"
                    >预览</el-button
                  >
                  <el-button
                    type="info"
                    size="mini"
                    round
                    v-show="mix_show_answer[index] === false"
                    @click="showAnswer('mix', index, true)"
                    >增加答案</el-button
                  >
                  <el-button
                    type="info"
                    size="mini"
                    v-show="answer_show_answer_analysis[index] === false"
                    round
                    @click="showAnswerAnalysis('mix', index, true)"
                    >增加答案解析</el-button
                  >
                  <el-button
                    type="success"
                    size="mini"
                    round
                    @click="addMixOption(index)"
                    >添加选择题小题</el-button
                  >
                  <el-button
                    type="success"
                    size="mini"
                    round
                    @click="addMixFill(index)"
                    >添加填空题小题</el-button
                  >
                  <el-button
                    type="success"
                    size="mini"
                    round
                    @click="addMixSub(index)"
                    >添加小题</el-button
                  >
                  <el-button
                    type="danger"
                    size="mini"
                    round
                    @click="deleteMixCard(index)"
                    >删除题目</el-button
                  >
                </el-row>
                <el-dialog
                  :title="'非选择题第' + (index + 1).toString() + '题'"
                  :visible.sync="mix_view[index]"
                  width="60%"
                  style="text-align:left;"
                >
                  <Mathdown
                    :name="'single-mix-question' + index.toString() + 'score'"
                    :content="
                      (index + 1).toString() +
                        '.' +
                        (mix_content[index].mixQuestion.score === ''
                          ? ''
                          : '(' + mix_content[index].mixQuestion.score + ')')
                    "
                  ></Mathdown>
                  <Mathdown
                    :name="'single-mix-question' + index.toString()"
                    :content="mix_content[index].mixQuestion.content"
                  ></Mathdown>
                  <div
                    v-for="(item, indexOp) in mix_show_image[index]"
                    :key="indexOp"
                  >
                    <ImageViewer
                      v-if="mix_show_image[index][indexOp]"
                      :data="mix_content[index].mixQuestion.image[indexOp]"
                    ></ImageViewer>
                  </div>
                  <ol type="i">
                    <div
                      v-for="(sub_item, indexOp) in mix_content[index]
                        .mixQuestion.mix_sub_questions"
                      :key="indexOp + 'sub_'"
                    >
                      <li
                        v-if="
                          mix_content[index].mixQuestion.mix_sub_questions[
                            indexOp
                          ].sub_question
                        "
                      >
                        <Mathdown
                          :name="
                            'single-mix-question' +
                              index.toString() +
                              '-sub' +
                              indexOp.toString() +
                              '-score'
                          "
                          :content="
                            mix_content[index].mixQuestion.mix_sub_questions[
                              indexOp
                            ].sub_question.score === ''
                              ? ''
                              : '(' +
                                mix_content[index].mixQuestion
                                  .mix_sub_questions[indexOp].sub_question
                                  .score +
                                ')'
                          "
                        ></Mathdown>
                        <Mathdown
                          :name="
                            'single-mix-question' +
                              index.toString() +
                              '-sub' +
                              indexOp.toString()
                          "
                          :content="
                            mix_content[index].mixQuestion.mix_sub_questions[
                              indexOp
                            ].sub_question.content
                          "
                        ></Mathdown>
                        <div
                          v-for="(item, indexImg) in mix_content[index]
                            .mixQuestion.mix_sub_image[indexOp]"
                          :key="indexImg"
                        >
                          <ImageViewer
                            v-if="
                              mix_content[index].mixQuestion.mix_sub_image[
                                indexOp
                              ][indexImg]
                            "
                            :data="
                              mix_content[index].mixQuestion.mix_sub_questions[
                                indexOp
                              ].sub_question.image[indexImg]
                            "
                          ></ImageViewer>
                        </div>
                      </li>
                    </div>
                    <div
                      v-for="(sub_item, indexOp) in mix_content[index]
                        .mixQuestion.mix_sub_fill_questions"
                      :key="indexOp + 'sub_fill_'"
                    >
                      <li
                        v-if="
                          mix_content[index].mixQuestion.mix_sub_fill_questions[
                            indexOp
                          ].sub_fill
                        "
                      >
                        <Mathdown
                          :name="
                            'single-mix-question' +
                              index.toString() +
                              '-sub_fill' +
                              indexOp.toString() +
                              '-score'
                          "
                          :content="
                            mix_content[index].mixQuestion
                              .mix_sub_fill_questions[indexOp].sub_fill
                              .score === ''
                              ? ''
                              : '(' +
                                mix_content[index].mixQuestion
                                  .mix_sub_fill_questions[indexOp].sub_fill
                                  .score +
                                ')'
                          "
                        ></Mathdown>
                        <Mathdown
                          :name="
                            'single-mix-question' +
                              index.toString() +
                              '-sub_fill' +
                              indexOp.toString()
                          "
                          :content="
                            mix_content[index].mixQuestion
                              .mix_sub_fill_questions[indexOp].sub_fill.content
                          "
                        ></Mathdown>
                        <div
                          v-for="(item, indexImg) in mix_content[index]
                            .mixQuestion.mix_sub_fill_image[indexOp]"
                          :key="indexImg"
                        >
                          <ImageViewer
                            v-if="
                              mix_content[index].mixQuestion.mix_sub_fill_image[
                                indexOp
                              ][indexImg]
                            "
                            :data="
                              mix_content[index].mixQuestion
                                .mix_sub_fill_questions[indexOp].sub_fill.image[
                                indexImg
                              ]
                            "
                          ></ImageViewer>
                        </div>
                        <!-- 表格 -->

                        <el-table
                          v-if="
                            mix_content[index].mixQuestion
                              .mix_sub_fill_questions[indexOp].sub_fill
                              .tableConfig.length > 0
                          "
                          :data="
                            mix_content[index].mixQuestion
                              .mix_sub_fill_questions[indexOp].sub_fill
                              .tableData
                          "
                          class="tb-edit"
                          border
                          style="width: 100%"
                          highlight-current-row
                          @row-click="handleCurrentChange"
                          :show-header="false"
                        >
                          <el-table-column
                            v-for="(item, indexT) in mix_content[index]
                              .mixQuestion.mix_sub_fill_questions[indexOp]
                              .sub_fill.tableConfig"
                            :label="item.label"
                            :prop="item.prop"
                            :key="indexT + 'sub_t'"
                          >
                            <template slot-scope="scope">
                              <Mathdown
                                :name="
                                  'single-mix-question' +
                                    index.toString() +
                                    '-sub_fill_table' +
                                    indexOp.toString() +
                                    indexT.toString() +
                                    scope.$index.toString()
                                "
                                :content="scope.row[`${item.prop}`]"
                              ></Mathdown>
                            </template>
                          </el-table-column>
                        </el-table>
                      </li>
                    </div>
                    <div
                      v-for="(sub_item, indexOp) in mix_content[index]
                        .mixQuestion.mix_sub_choice_questions"
                      :key="indexOp"
                    >
                      <li
                        v-if="
                          mix_content[index].mixQuestion
                            .mix_sub_choice_questions[indexOp].sub_choice
                        "
                      >
                        <Mathdown
                          :name="
                            'single-mix-question' +
                              index.toString() +
                              '-sub_choice' +
                              indexOp.toString() +
                              '-score'
                          "
                          :content="
                            mix_content[index].mixQuestion
                              .mix_sub_choice_questions[indexOp].sub_choice
                              .score === ''
                              ? ''
                              : '(' +
                                mix_content[index].mixQuestion
                                  .mix_sub_choice_questions[indexOp].sub_choice
                                  .score +
                                ')'
                          "
                        ></Mathdown>
                        <Mathdown
                          :name="
                            'single-mix-question' +
                              index.toString() +
                              '-sub_choice' +
                              indexOp.toString()
                          "
                          :content="
                            mix_content[index].mixQuestion
                              .mix_sub_choice_questions[indexOp].sub_choice
                              .content
                          "
                        ></Mathdown>
                        <div
                          v-for="(item, indexImg) in mix_content[index]
                            .mixQuestion.mix_sub_choice_image[indexOp]"
                          :key="indexImg"
                        >
                          <ImageViewer
                            v-if="
                              mix_content[index].mixQuestion
                                .mix_sub_choice_image[indexOp][indexImg]
                            "
                            :data="
                              mix_content[index].mixQuestion
                                .mix_sub_choice_questions[indexOp].sub_choice
                                .image[indexImg]
                            "
                          ></ImageViewer>
                        </div>
                        <ol style="list-style-type: upper-alpha">
                          <li
                            v-for="(option, indexP) in mix_content[index]
                              .mixQuestion.mix_sub_choice_questions[indexOp]
                              .sub_choice.option"
                            :key="indexP"
                          >
                            <Mathdown
                              :name="
                                'single-mix-question' +
                                  indexOp.toString() +
                                  '-option' +
                                  indexP.toString()
                              "
                              :content="
                                mix_content[index].mixQuestion
                                  .mix_sub_choice_questions[indexOp].sub_choice
                                  .option[indexP]
                              "
                            ></Mathdown>
                            <ImageViewer
                              v-if="
                                mix_content[index].mixQuestion
                                  .mix_sub_choice_option_image[indexOp][indexP]
                              "
                              :data="
                                mix_content[index].mixQuestion
                                  .mix_sub_choice_questions[indexOp].sub_choice
                                  .option_images[indexP]
                              "
                            ></ImageViewer>
                          </li>
                        </ol>
                      </li>
                    </div>
                  </ol>
                  <Mathdown
                    :name="'single-mix-question' + index.toString() + 'answer'"
                    :content="
                      mix_content[index].mixQuestion.answer === ''
                        ? ''
                        : '答案：' + mix_content[index].mixQuestion.answer
                    "
                  ></Mathdown>
                  <div
                    v-for="(item, indexAn) in mix_show_answer_image[index]"
                    :key="indexAn + 'an'"
                  >
                    <ImageViewer
                      v-if="mix_show_answer_image[index][indexAn]"
                      :data="
                        mix_content[index].mixQuestion.answer_images[indexAn]
                      "
                    ></ImageViewer>
                  </div>
                  <Mathdown
                    :name="
                      'single-mix-question' +
                        index.toString() +
                        'answer_analysis'
                    "
                    :content="
                      mix_content[index].mixQuestion.answer_analysis === ''
                        ? ''
                        : '解析：' +
                          mix_content[index].mixQuestion.answer_analysis
                    "
                  ></Mathdown>
                  <div
                    v-for="(item, indexOp) in mix_show_analysis_image[index]"
                    :key="indexOp"
                  >
                    <ImageViewer
                      v-if="mix_show_analysis_image[index][indexOp]"
                      :data="
                        mix_content[index].mixQuestion.analysis_images[indexOp]
                      "
                    ></ImageViewer>
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button
                      type="primary"
                      @click="hideQuestionView('mix', index)"
                      >确 定</el-button
                    >
                  </span>
                </el-dialog>
              </el-card>
            </ol>
          </el-form>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Mathdown from "./Mathdown.vue";
import FileSaver from "file-saver";
import ImageViewer from "./ViewImage.vue";
import Vue from "vue";
export default {
  components: { Mathdown, ImageViewer },
  data() {
    return {
      option_content: [],
      option_subtitle: "", // the auxiliary subtitle of Option Question
      fill_content: [],

      answer_content: [],

      mix_content: [],

      option_show_answer: [],
      fill_show_answer: [],
      answer_show_answer: [],
      option_show_answer_analysis: [],
      fill_show_answer_analysis: [],
      answer_show_answer_analysis: [],
      mix_show_answer_analysis: [],
      option_show_image: [],
      option_show_option_image: [],
      fill_show_image: [],
      answer_show_image: [],
      answer_show_option_image: [],
      option_show_analysis_image: [],
      fill_show_analysis_image: [],
      answer_show_analysis_image: [],
      answer_show_answer_image: [],
      mix_show_answer: [],
      option_view: [],
      fill_view: [],
      answer_view: [],
      mix_view: [],
      mix_show_image: [],
      mix_show_option_image: [],
      mix_show_analysis_image: [],
      mix_show_answer_image: [],
      uploadFileName: "",
      upload_files: [],

      isview: false,
      upload: false,
      default_subject: "math"
    };
  },

  watch: {
    default_subject: function() {
      this.deleteAllCard();
    }
  },
  methods: {
    preview() {
      this.isview = true;
    },
    loadJsonFromFile(file, fileList) {
      this.uploadFileName = file;
      this.upload_files = fileList;
      this.loadDataFromFile();
    },
    loadDataFromFile() {
      if (this.upload_files && this.upload_files.length > 0) {
        const file = this.upload_files[0];
        const reader = new FileReader();
        reader.onload = async e => {
          try {
            this.upload = true;
            // reset all variables
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

            const document = JSON.parse(e.target.result);

            for (let questions of document["questions"]) {
              switch (questions["type"]) {
                case "option":
                  this.option_show_image = [];
                  this.option_show_option_image = [];
                  this.option_show_analysis_image = [];
                  for (let question of questions["questions"]) {
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
                case "fill":
                  this.fill_show_image = [];
                  this.fill_show_analysis_image = [];
                  for (let question of questions["questions"]) {
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

                  break;
                case "answer":
                  this.answer_show_image = [];
                  this.answer_show_option_image = [];
                  this.answer_show_analysis_image = [];
                  this.answer_show_answer_image = [];
                  for (let question of questions["questions"]) {
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
                  }

                  break;
                case "mix":
                  this.mix_show_image = [];
                  this.mix_show_option_image = [];
                  this.mix_show_analysis_image = [];
                  this.mix_show_answer_image = [];
                  for (let question of questions["questions"]) {
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

                  break;
              }
            }
          } catch (err) {
            this.upload = false;
            console.log(`${err.message}`);
          }
        };
        reader.readAsText(file.raw);
      }
    },
    output() {
      // save json file to local
      const data = {};

      if (this.default_subject === "math") {
        data["type"] = "math";
      } else if (this.default_subject === "physics") {
        data["type"] = "physics";
      } else if (this.default_subject === "chemistry") {
        data["type"] = "chemistry";
      } else if (this.default_subject === "biology") {
        data["type"] = "biology";
      }
      data["info"] = { global_eno: false };
      data["questions"] = [];
      let option = {};
      option["type"] = "option";
      option["subtitle"] = this.option_subtitle;
      option["questions"] = [];
      for (let i in this.option_content) {
        let tmp = this.option_content[i].optionQuestion;
        let eno = { eno: parseInt(i) + 1 };
        let question = {};
        Object.assign(question, eno, tmp);
        option["questions"].push(question);
      }
      data["questions"].push(option);

      let fill = {};
      fill["type"] = "fill";

      fill["questions"] = [];
      for (let i in this.fill_content) {
        let tmp = this.fill_content[i].fillQuestion;
        let eno = { eno: parseInt(i) + 1 };
        let question = {};
        Object.assign(question, eno, tmp);
        fill["questions"].push(question);
      }
      data["questions"].push(fill);

      let answer = {};
      answer["type"] = "answer";

      answer["questions"] = [];
      for (let i in this.answer_content) {
        let tmp = this.answer_content[i].answerQuestion;
        let eno = { eno: parseInt(i) + 1 };
        let question = {};
        Object.assign(question, eno, tmp);
        answer["questions"].push(question);
      }
      data["questions"].push(answer);

      let mix = {};
      mix["type"] = "mix";

      mix["questions"] = [];
      for (let i in this.mix_content) {
        let tmp = this.mix_content[i].mixQuestion;
        let eno = { eno: parseInt(i) + 1 };
        let question = {};
        Object.assign(question, eno, tmp);
        mix["questions"].push(question);
      }
      data["questions"].push(mix);

      let jsonData = JSON.stringify(data);
      const blob = new Blob([jsonData], { type: "" });
      FileSaver.saveAs(blob, "paper" + ".json");

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
    single_choice() {
      this.deleteAllCard();
      this.option_content.splice(0, 1, {
        optionQuestion: {
          eid: "",
          content: "题目内容",
          image: [""],
          score: "5分",
          answer: "",
          answer_analysis: "",
          option: ["", "", "", ""],
          option_images: ["", "", "", ""],
          analysis_images: [""]
        }
      });
      this.option_view.push(false);
      this.option_show_image.push([]);
      this.option_show_option_image.push([false, false, false, false]);
      this.option_show_analysis_image.push([]);
    },
    fill_in() {
      this.deleteAllCard();
      this.fill_content.splice(0, 1, {
        fillQuestion: {
          eid: "",
          content: "问题：_______",
          image: [""],
          score: "6分",
          answer: "",
          answer_analysis: "",
          analysis_images: [""]
        }
      });
      this.fill_show_image.push([]);
      this.fill_view.push(false);
      this.fill_show_analysis_image.push([]);
    },
    answer_question() {
      this.deleteAllCard();
      this.answer_content.splice(0, 1, {
        answerQuestion: {
          eid: "",
          content: "解答题内容",
          image: [""],
          sub_questions: ["小题"],
          sub_score: [],
          option_images: [""],
          score: "10分",
          answer: "",
          answer_analysis: "",
          analysis_images: [""],
          answer_images: [""]
        }
      });
      this.answer_view.push(false);
      this.answer_show_image.push([]);
      this.answer_show_option_image.push([false]);
      this.answer_show_analysis_image.push([]);
      this.answer_show_answer_image.push([]);
    },
    mix_question() {
      this.deleteAllCard();
      this.mix_content.splice(0, 1, {
        mixQuestion: {
          eid: "",
          content: "非选择题内容",
          image: [""],
          mix_sub_questions: [],
          mix_sub_choice_questions: [],
          mix_sub_fill_questions: [],
          sub_score: [],
          // option_images: [""],
          score: "10分",
          answer: "",
          answer_analysis: "",
          analysis_images: [""],
          answer_images: [""],
          mix_sub_choice_view: [],
          mix_sub_choice_image: [],
          mix_sub_choice_option_image: [],
          mix_sub_choice_analysis_image: [],
          mix_sub_fill_view: [],
          // mix_sub_fill_table_view: "",
          // table_row: "",
          // table_col: "",
          mix_sub_fill_image: [],
          // mix_sub_fill_table: [],
          mix_sub_image: []
        }
      });
      this.mix_view.push(false);
      this.mix_show_image.push([]);
      this.mix_show_option_image.push([false]);
      this.mix_show_analysis_image.push([]);
      this.mix_show_answer_image.push([]);
    },
    mouseOver() {
      // console.log(e.currentTarget.firstElementChild);
    },
    addOption(index) {
      this.option_content[index].optionQuestion.option.push("");
      this.option_content[index].optionQuestion.option_images.push("");
      this.option_show_option_image[index].push(false);
    },
    addSubOption(index, indexOp) {
      this.mix_content[index].mixQuestion.mix_sub_choice_questions[
        indexOp
      ].sub_choice.option.push("");
      this.mix_content[index].mixQuestion.mix_sub_choice_questions[
        indexOp
      ].sub_choice.option_images.push("");
      this.mix_content[index].mixQuestion.mix_sub_choice_option_image[
        indexOp
      ].push(false);
    },
    viewQuestion(type, index) {
      switch (type) {
        case "option":
          Vue.set(this.option_view, index, true);
          break;
        case "fill":
          Vue.set(this.fill_view, index, true);
          break;
        case "answer":
          Vue.set(this.answer_view, index, true);
          break;
        case "mix":
          Vue.set(this.mix_view, index, true);
          break;
      }
    },
    hideQuestionView(type, index) {
      switch (type) {
        case "option":
          Vue.set(this.option_view, index, false);
          break;
        case "fill":
          Vue.set(this.fill_view, index, false);
          break;
        case "answer":
          Vue.set(this.answer_view, index, false);
          break;
        case "mix":
          Vue.set(this.mix_view, index, false);
          break;
      }
    },
    showAnswer(type, index, data) {
      switch (type) {
        case "option":
          Vue.set(this.option_show_answer, index, data);
          if (data === false) {
            Vue.set(this.option_show_answer_analysis, index, data);
          }
          break;
        case "fill":
          Vue.set(this.fill_show_answer, index, data);
          if (data === false) {
            Vue.set(this.fill_show_answer_analysis, index, data);
          }
          break;
        case "answer":
          Vue.set(this.answer_show_answer, index, data);
          if (data === false) {
            Vue.set(this.answer_show_answer_analysis, index, data);
          }
          break;
        case "mix":
          Vue.set(this.mix_show_answer, index, data);
          if (data === false) {
            Vue.set(this.mix_show_answer_analysis, index, data);
          }
          break;
      }
    },
    showAnswerAnalysis(type, index, data) {
      switch (type) {
        case "option":
          Vue.set(this.option_show_answer_analysis, index, data);
          break;
        case "fill":
          Vue.set(this.fill_show_answer_analysis, index, data);

          break;
        case "answer":
          Vue.set(this.answer_show_answer_analysis, index, data);
      }
    },
    addAnswerOption(index) {
      this.answer_content[index].answerQuestion.sub_questions.push("小题");
      this.answer_content[index].answerQuestion.option_images.push("");
      this.answer_show_option_image[index].push(false);
    },
    addMixSub(index) {
      this.mix_content[index].mixQuestion.mix_sub_questions.push({
        sub_question: {
          content: "问题",
          score: "",
          image: [""]
        }
      });
      this.mix_content[index].mixQuestion.mix_sub_image.push([]);
    },
    addMixOption(index) {
      this.mix_content[index].mixQuestion.mix_sub_choice_questions.push({
        sub_choice: {
          content: "问题",
          score: "",
          image: [""],
          option: ["", "", "", ""],
          option_images: ["", "", "", ""]
        }
      });
      this.mix_content[index].mixQuestion.mix_sub_choice_view.push(false);
      this.mix_content[index].mixQuestion.mix_sub_choice_image.push([]);
      this.mix_content[index].mixQuestion.mix_sub_choice_option_image.push([
        false,
        false,
        false,
        false
      ]);
    },
    addMixFill(index) {
      this.mix_content[index].mixQuestion.mix_sub_fill_questions.push({
        sub_fill: {
          content: "问题________",
          score: "",
          image: [""],
          tableData: [],
          tableConfig: [],
          mix_sub_fill_table_view: false,
          table_row: "",
          table_col: ""
        }
      });
      console.log(this.mix_content[index].mixQuestion.mix_sub_fill_questions);
      this.mix_content[index].mixQuestion.mix_sub_fill_view.push(false);
      // this.mix_content[index].mixQuestion.mix_sub_fill_table_view = false;
      this.mix_content[index].mixQuestion.mix_sub_fill_image.push([]);
      // this.mix_content[index].mixQuestion.mix_sub_fill_table.push([]);
    },
    addSubFillPlaceHolder(index, indexOp) {
      this.mix_content[index].mixQuestion.mix_sub_fill_questions[
        indexOp
      ].sub_fill.content += "________";
    },
    addFillPlaceHolder(index) {
      this.fill_content[index].fillQuestion.content += "________";
    },
    deleteCard(index) {
      this.option_content.splice(index, 1);
    },
    deleteFillCard(index) {
      this.fill_content.splice(index, 1);
    },
    deleteAnswerCard(index) {
      this.answer_content.splice(index, 1);
    },
    deleteMixCard(index) {
      this.mix_content.splice(index, 1);
    },
    deleteAllCard() {
      this.option_content = [];
      this.fill_content = [];
      this.answer_content = [];
      this.mix_content = [];

      this.option_subtitle = "";

      this.option_show_image = [];
      this.option_show_option_image = [];
      this.fill_show_image = [];
      this.answer_show_image = [];
      this.answer_show_option_image = [];
      this.option_show_analysis_image = [];
      this.fill_show_analysis_image = [];
      this.answer_show_analysis_image = [];
      this.answer_show_answer_image = [];
      this.mix_show_image = [];
      this.mix_show_option_image = [];
      this.mix_show_analysis_image = [];
      this.mix_show_answer_image = [];
    },
    deleteAnswer(type, index) {
      switch (type) {
        case "option":
          Vue.set(this.option_show_answer, index, false);
          Vue.set(this.option_content[index].optionQuestion, "answer", "");
          break;
        case "fill":
          Vue.set(this.fill_show_answer, index, false);
          Vue.set(this.fill_content[index].fillQuestion, "answer", "");
          break;
        case "answer":
          Vue.set(this.answer_show_answer, index, false);
          Vue.set(this.answer_content[index].answerQuestion, "answer", "");
          break;
        case "mix":
          Vue.set(this.mix_show_answer, index, false);
          Vue.set(this.mix_content[index].mixQuestion, "answer", "");
          break;
      }
    },
    deleteAnswerAnalysis(type, index) {
      switch (type) {
        case "option":
          Vue.set(this.option_show_answer_analysis, index, false);
          Vue.set(
            this.option_content[index].optionQuestion,
            "answer_analysis",
            ""
          );
          break;
        case "fill":
          Vue.set(this.fill_show_answer_analysis, index, false);
          Vue.set(this.fill_content[index].fillQuestion, "answer_analysis", "");
          break;
        case "answer":
          Vue.set(this.answer_show_answer_analysis, index, false);
          Vue.set(
            this.answer_content[index].answerQuestion,
            "answer_analysis",
            ""
          );
          break;
        case "mix":
          Vue.set(this.mix_show_answer_analysis, index, false);
          Vue.set(this.mix_content[index].mixQuestion, "answer_analysis", "");
          break;
      }
    },
    deleteOption(index, indexOp) {
      this.option_content[index].optionQuestion.option.splice(indexOp, 1);
      this.option_content[index].optionQuestion.option_images.splice(
        indexOp,
        1
      );
    },
    deleteSubOption(index, indexOp, indexP) {
      this.mix_content[index].mixQuestion.mix_sub_choice_questions[
        indexOp
      ].sub_choice.option.splice(indexP, 1);
      this.mix_content[index].mixQuestion.mix_sub_choice_questions[
        indexOp
      ].sub_choice.option_images.splice(indexP, 1);
    },
    deleteAnswerOption(index, indexOp) {
      this.answer_content[index].answerQuestion.sub_questions.splice(
        indexOp,
        1
      );
    },
    deleteMixOption(index, indexOp) {
      this.mix_content[index].mixQuestion.mix_sub_choice_questions.splice(
        indexOp,
        1
      );
    },
    deleteMixFill(index, indexOp) {
      this.mix_content[index].mixQuestion.mix_sub_fill_questions.splice(
        indexOp,
        1
      );
    },
    deleteMixSub(index, indexOp) {
      this.mix_content[index].mixQuestion.mix_sub_questions.splice(indexOp, 1);
    },
    saveBase64Option(type, base64, index, indexOp) {
      switch (type) {
        case "option":
          Vue.set(
            this.option_content[index].optionQuestion.option_images,
            indexOp,
            base64
          );
          break;
        case "answer":
          Vue.set(
            this.answer_content[index].answerQuestion.option_images,
            indexOp,
            base64
          );
          break;
        case "mix":
          Vue.set(
            this.mix_content[index].mixQuestion.option_images,
            indexOp,
            base64
          );
          break;
      }
    },
    saveBase64SubOption(type, base64, index, indexOp, indexP) {
      switch (type) {
        case "sub_choice":
          Vue.set(
            this.mix_content[index].mixQuestion.mix_sub_choice_questions[
              indexOp
            ].sub_choice.option_images,
            indexP,
            base64
          );
          break;
      }
    },
    saveBase64Analysis(type, base64, index, indexOp) {
      switch (type) {
        case "option":
          Vue.set(
            this.option_content[index].optionQuestion.analysis_images,
            indexOp,
            base64
          );
          break;
        case "fill":
          Vue.set(
            this.fill_content[index].fillQuestion.analysis_images,
            indexOp,
            base64
          );
          break;
        case "answer":
          Vue.set(
            this.answer_content[index].answerQuestion.analysis_images,
            indexOp,
            base64
          );
          break;
        case "mix":
          Vue.set(
            this.mix_content[index].mixQuestion.analysis_images,
            indexOp,
            base64
          );
          break;
      }
    },
    saveBase64Answer(type, base64, index, indexOp) {
      switch (type) {
        case "answer":
          Vue.set(
            this.answer_content[index].answerQuestion.answer_images,
            indexOp,
            base64
          );
          break;
        case "mix":
          Vue.set(
            this.mix_content[index].mixQuestion.answer_images,
            indexOp,
            base64
          );
          break;
      }
    },
    saveBase64(type, base64, index, indexOp) {
      switch (type) {
        case "option":
          Vue.set(
            this.option_content[index].optionQuestion.image,
            indexOp,
            base64
          );
          break;
        case "fill":
          Vue.set(this.fill_content[index].fillQuestion.image, indexOp, base64);
          break;
        case "answer":
          Vue.set(
            this.answer_content[index].answerQuestion.image,
            indexOp,
            base64
          );
          break;
        case "mix":
          Vue.set(this.mix_content[index].mixQuestion.image, indexOp, base64);
          break;
      }
    },
    saveBase64Sub(type, base64, index, indexOp, indexImg) {
      switch (type) {
        case "sub_choice":
          Vue.set(
            this.mix_content[index].mixQuestion.mix_sub_choice_questions[
              indexOp
            ].sub_choice.image,
            indexImg,
            base64
          );
          break;
        case "sub_fill":
          Vue.set(
            this.mix_content[index].mixQuestion.mix_sub_fill_questions[indexOp]
              .sub_fill.image,
            indexImg,
            base64
          );
          break;
        case "sub_question":
          Vue.set(
            this.mix_content[index].mixQuestion.mix_sub_questions[indexOp]
              .sub_question.image,
            indexImg,
            base64
          );
          break;
      }
    },
    showOptionImage(type, index, indexOp, value) {
      // add option_images to options of option/answer question
      switch (type) {
        case "option":
          this.option_show_option_image[index].splice(indexOp, 1, value);
          break;
        case "answer":
          this.answer_show_option_image[index].splice(indexOp, 1, value);
          break;
        case "mix":
          this.mix_show_option_image[index].splice(indexOp, 1, value);
          break;
      }
      if (value === false) {
        switch (type) {
          case "option":
            this.option_content[index].optionQuestion.option_images.splice(
              indexOp,
              1,
              ""
            );
            break;
          case "answer":
            this.answer_content[index].answerQuestion.option_images.splice(
              indexOp,
              1,
              ""
            );
            break;
          case "mix":
            this.mix_content[index].mixQuestion.option_images.splice(
              indexOp,
              1,
              ""
            );
            break;
        }
      }
    },
    showSubOptionImage(type, index, indexOp, indexP, value) {
      // add option_images to options of option/answer question
      switch (type) {
        case "sub_choice":
          this.mix_content[index].mixQuestion.mix_sub_choice_option_image[
            indexOp
          ].splice(indexP, 1, value);
          break;
      }
      if (value === false) {
        switch (type) {
          case "sub_choice":
            this.mix_content[index].mixQuestion.mix_sub_choice_questions[
              indexOp
            ].sub_choice.option_images.splice(indexP, 1, "");
            break;
        }
      }
    },
    showAnswerImage(type, index, value) {
      // add images to answer of answer question
      if (value === true) {
        switch (type) {
          case "answer":
            this.answer_show_answer_image[index].splice(
              this.answer_show_answer_image[index].length,
              0,
              value
            );
            break;
          case "mix":
            this.mix_show_answer_image[index].splice(
              this.mix_show_answer_image[index].length,
              0,
              value
            );
            break;
        }
      } else {
        switch (type) {
          case "answer":
            this.answer_content[index].answerQuestion.answer_images.splice(
              -1,
              1
            );
            this.answer_show_answer_image[index].splice(-1, 1);
            break;
          case "mix":
            this.mix_content[index].mixQuestion.answer_images.splice(-1, 1);
            this.mix_show_answer_image[index].splice(-1, 1);
            break;
        }
      }
    },
    showAnalysisImage(type, index, value) {
      // add option_images to analysis of option/fill/answer question
      if (value === true) {
        switch (type) {
          case "option":
            this.option_show_analysis_image[index].splice(
              this.option_show_analysis_image[index].length,
              0,
              value
            );
            break;
          case "fill":
            this.fill_show_analysis_image[index].splice(
              this.fill_show_analysis_image[index].length,
              0,
              value
            );
            break;
          case "answer":
            this.answer_show_analysis_image[index].splice(
              this.answer_show_analysis_image[index].length,
              0,
              value
            );
            break;
          case "mix":
            this.mix_show_analysis_image[index].splice(
              this.mix_show_analysis_image[index].length,
              0,
              value
            );
            break;
        }
      } else {
        switch (type) {
          case "option":
            this.option_content[index].optionQuestion.analysis_images.splice(
              -1,
              1
            );
            this.option_show_analysis_image[index].splice(-1, 1);
            break;
          case "fill":
            this.fill_content[index].fillQuestion.analysis_images.splice(-1, 1);
            this.fill_show_analysis_image[index].splice(-1, 1);
            break;
          case "answer":
            this.answer_content[index].answerQuestion.analysis_images.splice(
              -1,
              1
            );
            this.answer_show_analysis_image[index].splice(-1, 1);
            break;
          case "mix":
            this.mix_content[index].mixQuestion.analysis_images.splice(-1, 1);
            this.mix_show_analysis_image[index].splice(-1, 1);
            break;
        }
      }
    },
    showImage(type, index, value) {
      // add images to option/fill/answer questions
      if (value === true) {
        switch (type) {
          case "option":
            this.option_show_image[index].splice(
              this.option_show_image[index].length,
              0,
              value
            );
            break;
          case "fill":
            this.fill_show_image[index].splice(
              this.fill_show_image[index].length,
              0,
              value
            );
            break;
          case "answer":
            this.answer_show_image[index].splice(
              this.answer_show_image[index].length,
              0,
              value
            );
            break;
          case "mix":
            this.mix_show_image[index].splice(
              this.mix_show_image[index].length,
              0,
              value
            );
            break;
        }
      } else {
        switch (type) {
          case "option":
            this.option_content[index].optionQuestion.image.splice(-1, 1);
            this.option_show_image[index].splice(-1, 1);
            break;
          case "fill":
            this.fill_content[index].fillQuestion.image.splice(-1, 1);
            this.fill_show_image[index].splice(-1, 1);
            break;
          case "answer":
            this.answer_content[index].answerQuestion.image.splice(-1, 1);
            this.answer_show_image[index].splice(-1, 1);
            break;
          case "mix":
            this.mix_content[index].mixQuestion.image.splice(-1, 1);
            this.mix_show_image[index].splice(-1, 1);
            break;
        }
      }
    },
    showSubImage(type, index, indexOp, value) {
      // add sub_images to mix questions
      if (value === true) {
        switch (type) {
          case "sub_choice":
            this.mix_content[index].mixQuestion.mix_sub_choice_image[
              indexOp
            ].splice(
              this.mix_content[index].mixQuestion.mix_sub_choice_image[indexOp]
                .length,
              0,
              value
            );
            break;
          case "sub_fill":
            this.mix_content[index].mixQuestion.mix_sub_fill_image[
              indexOp
            ].splice(
              this.mix_content[index].mixQuestion.mix_sub_fill_image[indexOp]
                .length,
              0,
              value
            );
            break;
          case "sub_question":
            this.mix_content[index].mixQuestion.mix_sub_image[indexOp].splice(
              this.mix_content[index].mixQuestion.mix_sub_image[indexOp].length,
              0,
              value
            );
            break;
        }
      } else {
        switch (type) {
          case "sub_choice":
            this.mix_content[index].mixQuestion.mix_sub_choice_questions[
              indexOp
            ].sub_choice.image.splice(-1, 1);
            this.mix_content[index].mixQuestion.mix_sub_choice_image[
              indexOp
            ].splice(-1, 1);
            break;
          case "sub_fill":
            this.mix_content[index].mixQuestion.mix_sub_fill_questions[
              indexOp
            ].sub_fill.image.splice(-1, 1);
            this.mix_content[index].mixQuestion.mix_sub_fill_image[
              indexOp
            ].splice(-1, 1);
            break;
          case "sub_question":
            this.mix_content[index].mixQuestion.mix_sub_questions[
              indexOp
            ].sub_question.image.splice(-1, 1);
            this.mix_content[index].mixQuestion.mix_sub_image[indexOp].splice(
              -1,
              1
            );
            break;
        }
      }
    },
    resetUpload() {
      this.upload = false;
    },
    // 表格
    showSubTable(type, index, indexOp, value) {
      // add option_images to options of option/answer question
      switch (type) {
        case "sub_fill":
          for (
            var i = 1;
            i <=
            this.mix_content[index].mixQuestion.mix_sub_fill_questions[indexOp]
              .sub_fill.table_col;
            i++
          ) {
            this.mix_content[index].mixQuestion.mix_sub_fill_questions[
              indexOp
            ].sub_fill.tableConfig.push({
              label: "第" + i + "列",
              prop: "col" + i
            });
          }
          for (
            var j = 0;
            j <
            this.mix_content[index].mixQuestion.mix_sub_fill_questions[indexOp]
              .sub_fill.table_row;
            j++
          ) {
            this.mix_content[index].mixQuestion.mix_sub_fill_questions[
              indexOp
            ].sub_fill.tableData.push({
              col1: "",
              col2: "",
              col3: "",
              col4: "",
              col5: "",
              col6: "",
              col7: "",
              col8: "",
              col9: ""
            });
          }
          this.mix_content[index].mixQuestion.mix_sub_fill_questions[
            indexOp
          ].sub_fill.mix_sub_fill_table_view = false;
          break;
      }
      if (value === false) {
        switch (type) {
          case "sub_fill":
            this.mix_content[index].mixQuestion.mix_sub_fill_questions[
              indexOp
            ].sub_fill.table_row = "";
            this.mix_content[index].mixQuestion.mix_sub_fill_questions[
              indexOp
            ].sub_fill.table_col = "";
            this.mix_content[index].mixQuestion.mix_sub_fill_questions[
              indexOp
            ].sub_fill.tableData = [];
            this.mix_content[index].mixQuestion.mix_sub_fill_questions[
              indexOp
            ].sub_fill.tableConfig = [];
            break;
        }
      }
    },
    handleCurrentChange() {
      // console.log(row, event, column, event.currentTarget)
    },
    handleEdit() {
      // console.log(row);
    },
    handleDelete() {
      // console.log(index, row);
    }
  }
};
</script>
<style lang="less" scoped>
#import_paper {
  background: url("../assets/sub_bg.png");
  background-size: 100%;
  padding: 20px 20px 0px 20px;
}
.panel {
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 3%;
  height: 850px;
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
</style>
