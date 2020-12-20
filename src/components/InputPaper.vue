<template>
  <div id="import_paper">
    <el-row class="panel">
      <el-col :span="4">
        <el-row type="flex" justify="start">
          <h5>试卷录入</h5>
        </el-row>
        <el-row type="flex" justify="start">
          <span style="font-size:10px;">
            <router-link to="/inputMarked"
              >（录入单个试题？点击这里）</router-link
            >
          </span>
        </el-row>
        <el-row style="margin: 5px; 0px;">
          <h6 style="color: red;">请选择学科（默认数学）：</h6>
          <el-select v-model="default_subject" placeholder="请选择学科">
            <el-option
              v-for="item in subjects"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-row>
        <el-row
          v-if="default_subject == 'math'"
          style="background-color: #f8f8ff; padding: 5px; 5px;"
        >
          <h6 style="margin-bottom: -15px;">题型选择：</h6>
          <el-divider></el-divider>
          <el-row>
            <el-button type="primary" plain size="small" @click="single_choice"
              >单选题</el-button
            >
          </el-row>
          <div style="margin-top:5px;"></div>
          <el-row>
            <el-button type="primary" plain size="small" @click="fill_in"
              >填空题</el-button
            >
          </el-row>
          <div style="margin-top:5px;"></div>
          <el-row>
            <el-button
              type="primary"
              plain
              size="small"
              @click="answer_question"
              >解答题</el-button
            >
          </el-row>
        </el-row>
        <el-row
          v-if="default_subject == 'physics'"
          style="background-color: #f8f8ff; padding: 5px; 5px;"
        >
          <h6 style="margin-bottom: -15px;">题型选择：</h6>
          <el-divider></el-divider>
          <el-row>
            <el-button type="primary" plain size="small" @click="single_choice"
              >选择题</el-button
            >
          </el-row>
          <div style="margin-top:5px;"></div>
          <el-row>
            <el-button type="primary" plain size="small" @click="mix_question"
              >非选择题</el-button
            >
          </el-row>
        </el-row>
        <el-row
          v-if="default_subject == 'chemistry'"
          style="background-color: #f8f8ff; padding: 5px; 5px;"
        >
          <h6 style="margin-bottom: -15px;">题型选择：</h6>
          <el-divider></el-divider>
          <el-row>
            <el-button type="primary" plain size="small" @click="single_choice"
              >选择题</el-button
            >
          </el-row>
          <div style="margin-top:5px;"></div>
          <el-row>
            <el-button type="primary" plain size="small" @click="mix_question"
              >非选择题</el-button
            >
          </el-row>
        </el-row>
        <el-row
          v-if="default_subject == 'biology'"
          style="background-color: #f8f8ff; padding: 5px; 5px;"
        >
          <h6 style="margin-bottom: -15px;">题型选择：</h6>
          <el-divider></el-divider>
          <el-row>
            <el-button type="primary" plain size="small" @click="single_choice"
              >选择题</el-button
            >
          </el-row>
          <div style="margin-top:5px;"></div>
          <el-row>
            <el-button type="primary" plain size="small" @click="mix_question"
              >非选择题</el-button
            >
          </el-row>
        </el-row>
        <div style="margin-top:10px;"></div>
        <el-row style="background-color: #f8f8ff; padding: 5px; 5px;">
          <h6 style="margin-bottom: -15px;">批量录入：</h6>
          <el-divider></el-divider>
          <el-upload
            :file-list="upload_files"
            action="alert"
            :auto-upload="false"
            multiple
            :on-change="loadJsonFromFile"
          >
            <el-button type="primary" plain size="small">批量录入 </el-button>
          </el-upload>
          <span style="font-size:10px;">(支持json格式文件)</span>
        </el-row>
        <div style="margin-top:20px;"></div>
        <el-row style="background-color: #f8f8ff; padding: 5px; 5px;">
          <h6 style="margin-bottom: -15px;">预览设置：</h6>
          <el-divider></el-divider>
          <span style="font-size: 12px;">序号：</span>
          <el-radio v-model="number_radio" label="1">不连续</el-radio>
          <el-radio v-model="number_radio" label="2">连续</el-radio>
        </el-row>
        <br/>
        <br/>
        <el-row>
          <el-button @click="open_ComplexInput()">
            复杂输入助手
          </el-button>
        </el-row>
      </el-col>
      <el-col :span="20">
        <el-row type="flex" justify="end">
          <el-button
            type="primary"
            round
            icon="el-icon-view"
            @click="preview"
            size="small"
            >预览全卷</el-button
          >
          <el-button
            type="primary"
            round
            icon="el-icon-download"
            @click="output"
            size="small"
            >导出</el-button
          >
        </el-row>
        <el-row
          :span="24"
          style="background-color: #f5f5f5; padding: 5px; 5px; height: 700px; overflow: scroll;"
        >
          <el-row>
            <el-input
              v-model="paper_title"
              type="textarea"
              autosize
              placeholder="请输入试卷名称"
            ></el-input>
          </el-row>
          <div style="margin-top:20px;"></div>
          <el-row style="margin-bottom:15px;">
            <el-col :span="6" :offset="1">
              <el-input
                v-model="score_info"
                placeholder="请输入分数说明"
              ></el-input>
            </el-col>
            <el-col :span="2" :offset="6"><span>总题目:</span></el-col>
            <el-col :span="2">
              <el-input
                class="el-short_input__inner"
                v-model="total_question"
              ></el-input>
            </el-col>
            <el-col :span="2" :offset="1"><span>总分数:</span></el-col>
            <el-col :span="2">
              <el-input
                class="el-short_input__inner"
                v-model="total_score"
              ></el-input>
            </el-col>
          </el-row>
          <el-form>
            <el-form-item
              label="可能用到的相对原子质量："
              label-width="200px"
              v-if="default_subject == 'chemistry'"
            >
              <el-input
                type="textarea"
                autosize
                v-model="chemistry_subtitle"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="一、选择题"
              label-width="100px"
              v-if="option_content[0]"
            >
              <el-input
                v-model="option_subtitle"
                placeholder="请输入题目说明"
              ></el-input>
              <el-button
                size="mini"
                v-if="option_visible"
                @click="option_visible = false"
                >折叠选择题</el-button
              >
              <el-button
                size="mini"
                v-if="!option_visible"
                @click="option_visible = true"
                >展开选择题</el-button
              >
            </el-form-item>
            <ol
              style="text-align:left; margin-left: -35px;"
              v-show="option_visible"
            >
              <div v-for="(item, index) in option_content" :key="index">
                <el-card @mouseover.native="mouseOver($event)" shadow="hover">
                  <li style="margin-left:35px;">

                    <el-button @click="option_moveup(index)">上浮</el-button>
                    <el-button @click="option_movedown(index)">下移</el-button>

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
            <el-form-item
              label="二、填空题"
              label-width="100px"
              v-if="fill_content[0]"
            >
              <el-input
                v-model="fill_subtitle"
                placeholder="请输入题目说明"
              ></el-input>
              <el-button
                size="mini"
                v-if="fill_visible"
                @click="fill_visible = !fill_visible"
                >折叠填空题</el-button
              >
              <el-button
                size="mini"
                v-if="!fill_visible"
                @click="fill_visible = !fill_visible"
                >展开填空题</el-button
              >
            </el-form-item>
            <ol
              style="text-align:left; margin-left: -35px;"
              v-show="fill_visible"
            >
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
            <el-form-item
              label="三、解答题"
              label-width="100px"
              v-if="answer_content[0]"
            >
              <el-input
                v-model="answer_subtitle"
                placeholder="请输入题目说明"
              ></el-input>
              <el-button
                size="mini"
                v-if="answer_visible"
                @click="answer_visible = !answer_visible"
                >折叠解答题</el-button
              >
              <el-button
                size="mini"
                v-if="!answer_visible"
                @click="answer_visible = !answer_visible"
                >展开解答题</el-button
              >
            </el-form-item>
            <ol
              style="text-align:left; margin-left: -35px;"
              v-show="answer_visible"
            >
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
                      <!-- 表格 -->
                      <el-button
                        type="info"
                        size="mini"
                        round
                        style="float: right;margin-top:10px;"
                        v-if="
                          answer_content[index].answerQuestion.tableConfig
                            .length === 0
                        "
                        @click="
                          answer_content[index].answerQuestion.table_view = true
                        "
                        >增加表格</el-button
                      >
                      <el-button
                        type="info"
                        size="mini"
                        round
                        style="float: right;margin-top:10px;"
                        v-if="
                          answer_content[index].answerQuestion.tableConfig
                            .length > 0
                        "
                        @click="showTable('answer', index, false)"
                        >删除表格</el-button
                      >
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
                    <!-- 表格 -->
                    <div
                      v-if="
                        answer_content[index].answerQuestion.tableConfig
                          .length > 0
                      "
                    >
                      <el-table
                        :data="answer_content[index].answerQuestion.tableData"
                        class="tb-edit"
                        border
                        style="width: 100%"
                        highlight-current-row
                        @row-click="handleCurrentChange"
                        :show-header="false"
                      >
                        <el-table-column
                          v-for="(item, indexT) in answer_content[index]
                            .answerQuestion.tableConfig"
                          :label="item.label"
                          :key="indexT + 'answer-t'"
                        >
                          <template slot-scope="scope">
                            <el-input
                              size="small"
                              v-model="scope.row[item.prop]"
                              placeholder="内容"
                              @change="handleEdit(scope.$indexT, scope.row)"
                            ></el-input>
                            <span>{{ scope.row[item.prop] }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-form-item>
                  <el-dialog
                    title="创建表格"
                    :visible.sync="
                      answer_content[index].answerQuestion.table_view
                    "
                    width="30%"
                  >
                    <el-form>
                      <el-form-item label="行数：" label-width="60px">
                        <el-input
                          v-model="
                            answer_content[index].answerQuestion.table_row
                          "
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="列数：" label-width="60px">
                        <el-input
                          v-model="
                            answer_content[index].answerQuestion.table_col
                          "
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button
                        type="primary"
                        @click="showTable('answer', index, true)"
                        >确 定</el-button
                      >
                    </div>
                  </el-dialog>
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
                  <!-- 表格 -->
                  <el-table
                    v-if="
                      answer_content[index].answerQuestion.tableConfig.length >
                        0
                    "
                    :data="answer_content[index].answerQuestion.tableData"
                    class="tb-edit"
                    border
                    style="width: 100%"
                    highlight-current-row
                    @row-click="handleCurrentChange"
                    :show-header="false"
                  >
                    <el-table-column
                      v-for="(item, indexT) in answer_content[index]
                        .answerQuestion.tableConfig"
                      :label="item.label"
                      :prop="item.prop"
                      :key="indexT + 'answer_t'"
                    >
                      <template slot-scope="scope">
                        <Mathdown
                          :name="
                            'single-answer-question' +
                              index.toString() +
                              '-single_table' +
                              indexT.toString() +
                              scope.$index.toString()
                          "
                          :content="scope.row[`${item.prop}`]"
                        ></Mathdown>
                      </template>
                    </el-table-column>
                  </el-table>
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
            <el-form-item
              label="三、非选择题"
              label-width="100px"
              v-if="mix_content[0]"
            >
              <el-input
                v-model="mix_subtitle"
                placeholder="请输入题目说明"
              ></el-input>
              <el-button
                size="mini"
                v-if="mix_visible"
                @click="mix_visible = !mix_visible"
                >折叠非选择题</el-button
              >
              <el-button
                size="mini"
                v-if="!mix_visible"
                @click="mix_visible = !mix_visible"
                >展开非选择题</el-button
              >
            </el-form-item>
            <ol
              style="text-align:left; margin-left: -35px;"
              v-show="mix_visible"
            >
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
        <el-dialog
          v-if="number_radio === '1'"
          :title="paper_title"
          :visible.sync="isview"
          width="80%"
          style="text-align:left;"
        >
          <div>{{ score_info }}</div>
          <div>{{ "一、选择题" + option_subtitle }}</div>
          <ol v-if="option_content[0]">
            <div v-for="(item, index) in option_content" :key="index">
              <li>
                <Mathdown
                  :name="'option-question' + index.toString() + '-score'"
                  :content="
                    option_content[index].optionQuestion.score === ''
                      ? ''
                      : '(' + option_content[index].optionQuestion.score + ')'
                  "
                ></Mathdown>
                <Mathdown
                  :name="'option-question' + index.toString()"
                  :content="option_content[index].optionQuestion.content"
                ></Mathdown>
                <div
                  v-for="(item, indexOp) in option_show_image[index]"
                  :key="indexOp"
                >
                  <ImageViewer
                    v-if="option_show_image[index][indexOp]"
                    :data="option_content[index].optionQuestion.image[indexOp]"
                  ></ImageViewer>
                </div>
                <div style="margin-bottom:5px;"></div>
                <ol style="list-style-type: upper-alpha">
                  <li
                    v-for="(option, indexOp) in item.optionQuestion.option"
                    :key="indexOp"
                  >
                    <Mathdown
                      :name="
                        'option-question' +
                          index.toString() +
                          '-option' +
                          indexOp.toString()
                      "
                      :content="item.optionQuestion.option[indexOp]"
                    ></Mathdown>
                    <ImageViewer
                      v-if="option_show_option_image[index][indexOp]"
                      :data="
                        option_content[index].optionQuestion.option_images[
                          indexOp
                        ]
                      "
                    ></ImageViewer>
                  </li>
                </ol>
                <Mathdown
                  :name="'option-question' + index.toString() + '-answer'"
                  :content="
                    option_content[index].optionQuestion.answer === ''
                      ? ''
                      : '答案：' + option_content[index].optionQuestion.answer
                  "
                ></Mathdown>
                <Mathdown
                  :name="
                    'option-question' + index.toString() + '-answer_analysis'
                  "
                  :content="
                    option_content[index].optionQuestion.answer_analysis === ''
                      ? ''
                      : '解析：' +
                        option_content[index].optionQuestion.answer_analysis
                  "
                ></Mathdown>
                <div
                  v-for="(item, indexOp) in option_show_analysis_image[index]"
                  :key="indexOp"
                >
                  <ImageViewer
                    v-if="option_show_analysis_image[index][indexOp]"
                    :data="
                      option_content[index].optionQuestion.analysis_images[
                        indexOp
                      ]
                    "
                  ></ImageViewer>
                </div>
              </li>
            </div>
          </ol>
          <div v-if="default_subject == 'math'">
            {{ "二、填空题" + fill_subtitle }}
          </div>
          <ol v-if="fill_content[0]">
            <div v-for="(item, index) in fill_content" :key="index">
              <li>
                <Mathdown
                  :name="'fill-question' + index.toString() + '-score'"
                  :content="
                    fill_content[index].fillQuestion.score === ''
                      ? ''
                      : '(' + fill_content[index].fillQuestion.score + ')'
                  "
                ></Mathdown>
                <Mathdown
                  :name="'fill-question' + index.toString()"
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
                  :name="'fill-question' + index.toString() + '-answer'"
                  :content="
                    fill_content[index].fillQuestion.answer === ''
                      ? ''
                      : '答案：' + fill_content[index].fillQuestion.answer
                  "
                ></Mathdown>
                <Mathdown
                  :name="
                    'fill-question' + index.toString() + '-answer_analysis'
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
                      fill_content[index].fillQuestion.analysis_images[indexOp]
                    "
                  ></ImageViewer>
                </div>
              </li>
            </div>
          </ol>
          <div v-if="default_subject == 'math'">
            {{ "三、解答题" + answer_subtitle }}
          </div>
          <ol v-if="answer_content[0]">
            <div v-for="(item, index) in answer_content" :key="index">
              <li>
                <Mathdown
                  :name="'answer-question' + index.toString() + '-score'"
                  :content="
                    answer_content[index].answerQuestion.score === ''
                      ? ''
                      : '(' + answer_content[index].answerQuestion.score + ')'
                  "
                ></Mathdown>
                <Mathdown
                  :name="'answer-question' + index.toString()"
                  :content="answer_content[index].answerQuestion.content"
                ></Mathdown>
                <div
                  v-for="(item, indexOp) in answer_show_image[index]"
                  :key="indexOp"
                >
                  <ImageViewer
                    v-if="answer_show_image[index][indexOp]"
                    :data="answer_content[index].answerQuestion.image[indexOp]"
                  ></ImageViewer>
                </div>
                <!-- 表格 -->
                <el-table
                  v-if="
                    answer_content[index].answerQuestion.tableConfig.length > 0
                  "
                  :data="answer_content[index].answerQuestion.tableData"
                  class="tb-edit"
                  border
                  style="width: 100%"
                  highlight-current-row
                  @row-click="handleCurrentChange"
                  :show-header="false"
                >
                  <el-table-column
                    v-for="(item, indexT) in answer_content[index]
                      .answerQuestion.tableConfig"
                    :label="item.label"
                    :prop="item.prop"
                    :key="indexT + 'answer_t'"
                  >
                    <template slot-scope="scope">
                      <Mathdown
                        :name="
                          'answer-question' +
                            index.toString() +
                            '-table' +
                            indexT.toString() +
                            scope.$index.toString()
                        "
                        :content="scope.row[`${item.prop}`]"
                      ></Mathdown>
                    </template>
                  </el-table-column>
                </el-table>
                <ol type="i">
                  <li
                    v-for="(option, indexOp) in item.answerQuestion
                      .sub_questions"
                    :key="indexOp"
                  >
                    <Mathdown
                      :name="
                        'answer-question' +
                          index.toString() +
                          '-sub' +
                          indexOp.toString() +
                          '-score'
                      "
                      :content="
                        item.answerQuestion.sub_score[indexOp] === undefined ||
                        item.answerQuestion.sub_score[indexOp] === ''
                          ? ''
                          : '(' + item.answerQuestion.sub_score[indexOp] + ')'
                      "
                    ></Mathdown>
                    <Mathdown
                      :name="
                        'answer-question' +
                          index.toString() +
                          '-sub' +
                          indexOp.toString()
                      "
                      :content="item.answerQuestion.sub_questions[indexOp]"
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
                  :name="'answer-question' + index.toString() + 'answer'"
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
                    'answer-question' + index.toString() + 'answer_analysis'
                  "
                  :content="
                    answer_content[index].answerQuestion.answer_analysis === ''
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
              </li>
            </div>
          </ol>
          <div v-if="default_subject !== 'math'">
            {{ "三、非选择题" + mix_subtitle }}
          </div>
          <ol v-if="mix_content[0]">
            <div v-for="(item, index) in mix_content" :key="index">
              <li>
                <Mathdown
                  :name="'mix-question' + index.toString() + '-score'"
                  :content="
                    mix_content[index].mixQuestion.score === ''
                      ? ''
                      : '(' + mix_content[index].mixQuestion.score + ')'
                  "
                ></Mathdown>
                <Mathdown
                  :name="'mix-question' + index.toString()"
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
                    v-for="(sub_item, indexOp) in mix_content[index].mixQuestion
                      .mix_sub_questions"
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
                          'mix-question' +
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
                              mix_content[index].mixQuestion.mix_sub_questions[
                                indexOp
                              ].sub_question.score +
                              ')'
                        "
                      ></Mathdown>
                      <Mathdown
                        :name="
                          'mix-question' +
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
                    v-for="(sub_item, indexOp) in mix_content[index].mixQuestion
                      .mix_sub_fill_questions"
                    :key="indexOp + 'sub_fill_q'"
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
                          'mix-question' +
                            index.toString() +
                            '-sub_fill' +
                            indexOp.toString() +
                            '-score'
                        "
                        :content="
                          mix_content[index].mixQuestion.mix_sub_fill_questions[
                            indexOp
                          ].sub_fill.score === ''
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
                          'mix-question' +
                            index.toString() +
                            '-sub_fill' +
                            indexOp.toString()
                        "
                        :content="
                          mix_content[index].mixQuestion.mix_sub_fill_questions[
                            indexOp
                          ].sub_fill.content
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
                          mix_content[index].mixQuestion.mix_sub_fill_questions[
                            indexOp
                          ].sub_fill.tableConfig.length > 0
                        "
                        :data="
                          mix_content[index].mixQuestion.mix_sub_fill_questions[
                            indexOp
                          ].sub_fill.tableData
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
                                'mix-question' +
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
                    v-for="(sub_item, indexOp) in mix_content[index].mixQuestion
                      .mix_sub_choice_questions"
                    :key="indexOp"
                  >
                    <li
                      v-if="
                        mix_content[index].mixQuestion.mix_sub_choice_questions[
                          indexOp
                        ].sub_choice
                      "
                    >
                      <Mathdown
                        :name="
                          'mix-question' +
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
                          'mix-question' +
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
                            mix_content[index].mixQuestion.mix_sub_choice_image[
                              indexOp
                            ][indexImg]
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
                              'mix-question' +
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
                  :name="'mix-question' + index.toString() + 'answer'"
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
                  :name="'mix-question' + index.toString() + 'answer_analysis'"
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
              </li>
            </div>
          </ol>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="isview = false">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 连续序号 -->
        <el-dialog
          v-if="number_radio === '2'"
          :title="paper_title"
          :visible.sync="isview"
          width="80%"
          style="text-align:left;"
        >
          <div>{{ score_info }}</div>
          <div>{{ "一、选择题" + option_subtitle }}</div>
          <ol>
            <div v-for="(item, index) in option_content" :key="index + 'xu'">
              <li>
                <Mathdown
                  :name="'option-question' + index.toString() + '-score'"
                  :content="
                    option_content[index].optionQuestion.score === ''
                      ? ''
                      : '(' + option_content[index].optionQuestion.score + ')'
                  "
                ></Mathdown>
                <Mathdown
                  :name="'option-question' + index.toString()"
                  :content="option_content[index].optionQuestion.content"
                ></Mathdown>
                <div
                  v-for="(item, indexOp) in option_show_image[index]"
                  :key="indexOp + 'xu'"
                >
                  <ImageViewer
                    v-if="option_show_image[index][indexOp]"
                    :data="option_content[index].optionQuestion.image[indexOp]"
                  ></ImageViewer>
                </div>
                <div style="margin-bottom:5px;"></div>
                <ol style="list-style-type: upper-alpha">
                  <li
                    v-for="(option, indexOp) in item.optionQuestion.option"
                    :key="indexOp + 'xu'"
                  >
                    <Mathdown
                      :name="
                        'option-question' +
                          index.toString() +
                          '-option' +
                          indexOp.toString()
                      "
                      :content="item.optionQuestion.option[indexOp]"
                    ></Mathdown>
                    <ImageViewer
                      v-if="option_show_option_image[index][indexOp]"
                      :data="
                        option_content[index].optionQuestion.option_images[
                          indexOp
                        ]
                      "
                    ></ImageViewer>
                  </li>
                </ol>
                <Mathdown
                  :name="'option-question' + index.toString() + '-answer'"
                  :content="
                    option_content[index].optionQuestion.answer === ''
                      ? ''
                      : '答案：' + option_content[index].optionQuestion.answer
                  "
                ></Mathdown>
                <Mathdown
                  :name="
                    'option-question' + index.toString() + '-answer_analysis'
                  "
                  :content="
                    option_content[index].optionQuestion.answer_analysis === ''
                      ? ''
                      : '解析：' +
                        option_content[index].optionQuestion.answer_analysis
                  "
                ></Mathdown>
                <div
                  v-for="(item, indexOp) in option_show_analysis_image[index]"
                  :key="indexOp + 'xu'"
                >
                  <ImageViewer
                    v-if="option_show_analysis_image[index][indexOp]"
                    :data="
                      option_content[index].optionQuestion.analysis_images[
                        indexOp
                      ]
                    "
                  ></ImageViewer>
                </div>
              </li>
            </div>
            <div v-if="default_subject == 'math'" style="margin-left:-40px;">
              {{ "二、填空题" + fill_subtitle }}
            </div>
            <div v-for="(item, index) in fill_content" :key="index + 'xu'">
              <li>
                <Mathdown
                  :name="'fill-question' + index.toString() + '-score'"
                  :content="
                    fill_content[index].fillQuestion.score === ''
                      ? ''
                      : '(' + fill_content[index].fillQuestion.score + ')'
                  "
                ></Mathdown>
                <Mathdown
                  :name="'fill-question' + index.toString()"
                  :content="fill_content[index].fillQuestion.content"
                ></Mathdown>
                <div
                  v-for="(item, indexOp) in fill_show_image[index]"
                  :key="indexOp + 'xu'"
                >
                  <ImageViewer
                    v-if="fill_show_image[index][indexOp]"
                    :data="fill_content[index].fillQuestion.image[indexOp]"
                  ></ImageViewer>
                </div>
                <Mathdown
                  :name="'fill-question' + index.toString() + '-answer'"
                  :content="
                    fill_content[index].fillQuestion.answer === ''
                      ? ''
                      : '答案：' + fill_content[index].fillQuestion.answer
                  "
                ></Mathdown>
                <Mathdown
                  :name="
                    'fill-question' + index.toString() + '-answer_analysis'
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
                  :key="indexOp + 'xu'"
                >
                  <ImageViewer
                    v-if="fill_show_analysis_image[index][indexOp]"
                    :data="
                      fill_content[index].fillQuestion.analysis_images[indexOp]
                    "
                  ></ImageViewer>
                </div>
              </li>
            </div>

            <div v-if="default_subject == 'math'" style="margin-left:-40px;">
              {{ "三、解答题" + answer_subtitle }}
            </div>

            <div v-for="(item, index) in answer_content" :key="index + 'xu'">
              <li>
                <Mathdown
                  :name="'answer-question' + index.toString() + '-score'"
                  :content="
                    answer_content[index].answerQuestion.score === ''
                      ? ''
                      : '(' + answer_content[index].answerQuestion.score + ')'
                  "
                ></Mathdown>
                <Mathdown
                  :name="'answer-question' + index.toString()"
                  :content="answer_content[index].answerQuestion.content"
                ></Mathdown>
                <div
                  v-for="(item, indexOp) in answer_show_image[index]"
                  :key="indexOp + 'xu'"
                >
                  <ImageViewer
                    v-if="answer_show_image[index][indexOp]"
                    :data="answer_content[index].answerQuestion.image[indexOp]"
                  ></ImageViewer>
                </div>
                <!-- 表格 -->
                <el-table
                  v-if="
                    answer_content[index].answerQuestion.tableConfig.length > 0
                  "
                  :data="answer_content[index].answerQuestion.tableData"
                  class="tb-edit"
                  border
                  style="width: 100%"
                  highlight-current-row
                  @row-click="handleCurrentChange"
                  :show-header="false"
                >
                  <el-table-column
                    v-for="(item, indexT) in answer_content[index]
                      .answerQuestion.tableConfig"
                    :label="item.label"
                    :prop="item.prop"
                    :key="indexT + 'answer_t' + 'xu'"
                  >
                    <template slot-scope="scope">
                      <Mathdown
                        :name="
                          'answer-question' +
                            index.toString() +
                            '-table' +
                            indexT.toString() +
                            scope.$index.toString()
                        "
                        :content="scope.row[`${item.prop}`]"
                      ></Mathdown>
                    </template>
                  </el-table-column>
                </el-table>
                <ol type="i">
                  <li
                    v-for="(option, indexOp) in item.answerQuestion
                      .sub_questions"
                    :key="indexOp + 'xu'"
                  >
                    <Mathdown
                      :name="
                        'answer-question' +
                          index.toString() +
                          '-sub' +
                          indexOp.toString() +
                          '-score'
                      "
                      :content="
                        item.answerQuestion.sub_score[indexOp] === undefined ||
                        item.answerQuestion.sub_score[indexOp] === ''
                          ? ''
                          : '(' + item.answerQuestion.sub_score[indexOp] + ')'
                      "
                    ></Mathdown>
                    <Mathdown
                      :name="
                        'answer-question' +
                          index.toString() +
                          '-sub' +
                          indexOp.toString()
                      "
                      :content="item.answerQuestion.sub_questions[indexOp]"
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
                  :name="'answer-question' + index.toString() + 'answer'"
                  :content="
                    answer_content[index].answerQuestion.answer === ''
                      ? ''
                      : '答案：' + answer_content[index].answerQuestion.answer
                  "
                ></Mathdown>
                <div
                  v-for="(item, indexAn) in answer_show_answer_image[index]"
                  :key="indexAn + 'an' + 'xu'"
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
                    'answer-question' + index.toString() + 'answer_analysis'
                  "
                  :content="
                    answer_content[index].answerQuestion.answer_analysis === ''
                      ? ''
                      : '解析：' +
                        answer_content[index].answerQuestion.answer_analysis
                  "
                ></Mathdown>
                <div
                  v-for="(item, indexOp) in answer_show_analysis_image[index]"
                  :key="indexOp + 'xu'"
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
              </li>
            </div>
            <div v-if="default_subject !== 'math'" style="margin-left:-40px;">
              {{ "三、非选择题" + mix_subtitle }}
            </div>
            <div v-for="(item, index) in mix_content" :key="index + 'xu'">
              <li>
                <Mathdown
                  :name="'mix-question' + index.toString() + '-score'"
                  :content="
                    mix_content[index].mixQuestion.score === ''
                      ? ''
                      : '(' + mix_content[index].mixQuestion.score + ')'
                  "
                ></Mathdown>
                <Mathdown
                  :name="'mix-question' + index.toString()"
                  :content="mix_content[index].mixQuestion.content"
                ></Mathdown>
                <div
                  v-for="(item, indexOp) in mix_show_image[index]"
                  :key="indexOp + 'xu'"
                >
                  <ImageViewer
                    v-if="mix_show_image[index][indexOp]"
                    :data="mix_content[index].mixQuestion.image[indexOp]"
                  ></ImageViewer>
                </div>
                <ol type="i">
                  <div
                    v-for="(sub_item, indexOp) in mix_content[index].mixQuestion
                      .mix_sub_questions"
                    :key="indexOp + 'sub_' + 'xu'"
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
                          'mix-question' +
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
                              mix_content[index].mixQuestion.mix_sub_questions[
                                indexOp
                              ].sub_question.score +
                              ')'
                        "
                      ></Mathdown>
                      <Mathdown
                        :name="
                          'mix-question' +
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
                        :key="indexImg + 'xu'"
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
                    v-for="(sub_item, indexOp) in mix_content[index].mixQuestion
                      .mix_sub_fill_questions"
                    :key="indexOp + 'sub_fill_q' + 'xu'"
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
                          'mix-question' +
                            index.toString() +
                            '-sub_fill' +
                            indexOp.toString() +
                            '-score'
                        "
                        :content="
                          mix_content[index].mixQuestion.mix_sub_fill_questions[
                            indexOp
                          ].sub_fill.score === ''
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
                          'mix-question' +
                            index.toString() +
                            '-sub_fill' +
                            indexOp.toString()
                        "
                        :content="
                          mix_content[index].mixQuestion.mix_sub_fill_questions[
                            indexOp
                          ].sub_fill.content
                        "
                      ></Mathdown>
                      <div
                        v-for="(item, indexImg) in mix_content[index]
                          .mixQuestion.mix_sub_fill_image[indexOp]"
                        :key="indexImg + 'xu'"
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
                          mix_content[index].mixQuestion.mix_sub_fill_questions[
                            indexOp
                          ].sub_fill.tableConfig.length > 0
                        "
                        :data="
                          mix_content[index].mixQuestion.mix_sub_fill_questions[
                            indexOp
                          ].sub_fill.tableData
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
                          :key="indexT + 'sub_t' + 'xu'"
                        >
                          <template slot-scope="scope">
                            <Mathdown
                              :name="
                                'mix-question' +
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
                    v-for="(sub_item, indexOp) in mix_content[index].mixQuestion
                      .mix_sub_choice_questions"
                    :key="indexOp + 'xu'"
                  >
                    <li
                      v-if="
                        mix_content[index].mixQuestion.mix_sub_choice_questions[
                          indexOp
                        ].sub_choice
                      "
                    >
                      <Mathdown
                        :name="
                          'mix-question' +
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
                          'mix-question' +
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
                        :key="indexImg + 'xu'"
                      >
                        <ImageViewer
                          v-if="
                            mix_content[index].mixQuestion.mix_sub_choice_image[
                              indexOp
                            ][indexImg]
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
                          :key="indexP + 'xu'"
                        >
                          <Mathdown
                            :name="
                              'mix-question' +
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
                  :name="'mix-question' + index.toString() + 'answer'"
                  :content="
                    mix_content[index].mixQuestion.answer === ''
                      ? ''
                      : '答案：' + mix_content[index].mixQuestion.answer
                  "
                ></Mathdown>
                <div
                  v-for="(item, indexAn) in mix_show_answer_image[index]"
                  :key="indexAn + 'an' + 'xu'"
                >
                  <ImageViewer
                    v-if="mix_show_answer_image[index][indexAn]"
                    :data="
                      mix_content[index].mixQuestion.answer_images[indexAn]
                    "
                  ></ImageViewer>
                </div>
                <Mathdown
                  :name="'mix-question' + index.toString() + 'answer_analysis'"
                  :content="
                    mix_content[index].mixQuestion.answer_analysis === ''
                      ? ''
                      : '解析：' +
                        mix_content[index].mixQuestion.answer_analysis
                  "
                ></Mathdown>
                <div
                  v-for="(item, indexOp) in mix_show_analysis_image[index]"
                  :key="indexOp + 'xu'"
                >
                  <ImageViewer
                    v-if="mix_show_analysis_image[index][indexOp]"
                    :data="
                      mix_content[index].mixQuestion.analysis_images[indexOp]
                    "
                  ></ImageViewer>
                </div>
              </li>
            </div>
          </ol>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="isview = false">确 定</el-button>
          </span>
        </el-dialog>
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
      number_radio: "1",
      paper_title: "",
      option_content: [],
      option_subtitle: "", // the auxiliary subtitle of Option Question
      fill_content: [],
      fill_subtitle: "",
      answer_content: [],
      answer_subtitle: "",
      mix_content: [],
      mix_subtitle: "",
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
      score_info: "",
      chemistry_subtitle: "",
      isview: false,
      upload: false,
      option_visible: true,
      fill_visible: true,
      answer_visible: true,
      mix_visible: true,
      subjects: [
        {
          value: "math",
          label: "数学"
        },
        {
          value: "physics",
          label: "物理"
        },
        {
          value: "chemistry",
          label: "化学"
        },
        {
          value: "biology",
          label: "生物"
        }
      ],
      default_subject: "math"
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
        console.log(value);
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
            this.paper_title = document["paper_title"];
            this.chemistry_subtitle = document["chemistry_subtitle"];
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
                  this.fill_subtitle = questions["subtitle"];
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
                  this.mix_subtitle = questions["subtitle"];
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
      data["paper_title"] = this.paper_title;
      if (this.default_subject === "math") {
        data["type"] = "math";
      } else if (this.default_subject === "physics") {
        data["type"] = "physics";
      } else if (this.default_subject === "chemistry") {
        data["type"] = "chemistry";
        data["chemistry_subtitle"] = this.chemistry_subtitle;
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
      fill["subtitle"] = this.fill_subtitle;
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
      answer["subtitle"] = this.answer_subtitle;
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
      mix["subtitle"] = this.mix_subtitle;
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
      FileSaver.saveAs(blob, (this.paper_title || "paper") + ".json");

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
      this.option_content.push({
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
      this.fill_content.push({
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
      this.answer_content.push({
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
          answer_images: [""],
          tableData: [],
          tableConfig: [],
          table_view: false,
          table_row: "",
          table_col: ""
        }
      });
      this.answer_view.push(false);
      this.answer_show_image.push([]);
      this.answer_show_option_image.push([false]);
      this.answer_show_analysis_image.push([]);
      this.answer_show_answer_image.push([]);
    },
    mix_question() {
      this.mix_content.push({
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
      this.paper_title = "";
      this.score_info = "";
      this.option_subtitle = "";
      this.fill_subtitle = "";
      this.answer_subtitle = "";
      this.mix_subtitle = "";
      this.chemistry_subtitle = "";
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
    showTable(type, index, value) {
      // add option_images to options of option/answer question
      switch (type) {
        case "answer":
          for (
            var i = 1;
            i <= this.answer_content[index].answerQuestion.table_col;
            i++
          ) {
           
            this.answer_content[index].answerQuestion.tableConfig.push({
              label: "第" + i + "列",
              prop: "col" + i
            });
          }
          for (
            var j = 0;
            j < this.answer_content[index].answerQuestion.table_row;
            j++
          ) {
           
            this.answer_content[index].answerQuestion.tableData.push({
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
          
          this.answer_content[index].answerQuestion.table_view = false;
          break;
      }
      if (value === false) {
        switch (type) {
          case "answer":
           
            this.answer_content[index].answerQuestion.table_row = "";
           
            this.answer_content[index].answerQuestion.table_col = "";
            
            this.answer_content[index].answerQuestion.tableData = [];
           
            this.answer_content[index].answerQuestion.tableConfig = [];
            break;
        }
      }
    },
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
    },
    option_moveup(index){
      var option_now = this.option_content[index];
      option_now.eno = option_now.eno - 1;
      this.option_content[index-1].eno = this.option_content[index-1].eno + 1;
      this.option_content.splice(index, 1);
      this.option_content.splice(index-1, 0, option_now);

    },
    option_movedown(index){
      var option_now = this.option_content[index];
      option_now.eno = option_now.eno + 1;
      this.option_content[index+1].eno = this.option_content[index+1].eno - 1;
      this.option_content.splice(index, 1);
      this.option_content.splice(index+1, 0, option_now);
    },
    open_ComplexInput(){
      console.log("Open A CI Dialog.")
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
</style>
