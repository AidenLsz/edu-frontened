<template>
  <div id="import">
    <el-tabs type="border-card" style="height:550px;">
      <!-- schema说明 -->
      <el-tab-pane label="来自百科">
        <el-row>
          <el-col :span="4">Schema字段说明：</el-col>
          <el-col :span="20">
            <el-row
              v-for="(conceptField, index) in fieldName.concept"
              :key="index"
            >
              <el-col :span="16">
                <div class="fieldtag">
                  <el-tag effect="plain" :type="conceptItem[index]">{{
                    conceptField
                  }}</el-tag>
                  <span>{{ concept[index].description }}</span>
                </div>
              </el-col>
            </el-row>
            <el-alert
              title="提示:导入json文件前请对照以上schema检查json文件包含的字段"
              type="warning"
              show-icon
              effect="dark"
              :closable="false"
            >
            </el-alert>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="4">导入到集合node：<br />（注：json格式）</el-col>
          <el-col :span="20">
            <!-- 上传 -->
            <div class="inputbg">
              <el-col :span="18">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  action="string"
                  :file-list="fileList"
                  :auto-upload="false"
                  :on-change="handleChange"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  multiple="multiple"
                >
                  <el-button
                    slot="trigger"
                    size="small"
                    type="primary"
                    @click="delFile"
                    >选取文件</el-button
                  >
                  <el-button
                    style="margin-left: 10px;"
                    size="small"
                    type="success"
                    @click="submitUpload"
                  >
                    上传</el-button
                  >
                </el-upload>
              </el-col>
              <el-col :span="2">
                <el-popover
                  placement="right"
                  title="示例"
                  width="600"
                  trigger="click"
                  :content="example[0]"
                >
                  <el-button slot="reference">查看示例</el-button>
                </el-popover>
              </el-col>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="来自教科书">
        <el-row>
          <el-col :span="4">Schema字段说明：</el-col>
          <el-col :span="20">
            <el-row
              v-for="(kpField, index) in fieldName.knowledge_point"
              :key="index"
            >
              <el-col :span="16">
                <div class="fieldtag">
                  <el-tag effect="plain" :type="kpItem[index]">{{
                    kpField
                  }}</el-tag>
                  <span>{{ kp[index].description }}</span>
                </div>
              </el-col>
            </el-row>
            <el-alert
              title="提示:导入json文件前请对照以上schema检查json文件包含的字段"
              type="warning"
              show-icon
              effect="dark"
              :closable="false"
            >
            </el-alert>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="4">导入到集合node：<br />（注：json格式）</el-col>
          <el-col :span="20">
            <!-- 上传 -->
            <div class="inputbg">
              <el-col :span="18">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  action="string"
                  :file-list="fileList2"
                  :auto-upload="false"
                  :on-change="handleChange2"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  multiple="multiple"
                >
                  <el-button
                    slot="trigger"
                    size="small"
                    type="primary"
                    @click="delFile2"
                    >选取文件</el-button
                  >
                  <el-button
                    style="margin-left: 10px;"
                    size="small"
                    type="success"
                    @click="submitUpload2"
                  >
                    上传</el-button
                  >
                </el-upload>
              </el-col>
              <el-col :span="2">
                <el-popover
                  placement="right"
                  title="示例"
                  width="600"
                  trigger="click"
                  :content="example[1]"
                >
                  <el-button slot="reference">查看示例</el-button>
                </el-popover>
              </el-col>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fieldName: {},
      conceptItem: ["danger", "danger"],
      kpItem: ["danger", "", "", "", "", "danger"],
      concept: [
        { description: "必填字段。知识单元中文名，例如‘三角函数’" },
        { description: "必填字段。知识单元类型，百科默认为 concept " },
        { description: "可选字段。标识知识点所属的学科领域，例如‘数学’" },
        { description: "可选字段。标识知识单元的来源，百科默认为 BK " }
      ],
      kp: [
        { description: "必填字段。知识单元中文名，例如‘三角函数’" },
        { description: "可选字段。标识知识单元所属的课本，例如‘人教版’ " },
        { description: "可选字段。标识知识单元的年级，例如‘一年级’" },
        { description: "可选字段。标识知识点所属的学科领域，例如‘数学’" },
        { description: "可选字段。标识知识单元章节号 " },
        {
          description: "必填字段。知识单元类型，教科书默认为 knowledge point "
        },
        { description: "可选字段。标识知识单元的来源，人教版为‘RJ’ " }
      ],
      fileList: [],
      fileList2: [],
      multiple: true,
      collection_name: "node", // 所导入的集合node
      example: [
        '{"name": "统筹法", "type": "concept", "area": "数学", "source": "BK"}',
        '{"name": "分式", "version": "人教版", "grade": "八年级下", "area": "数学", "chapter": "1.1", "type": "knowledge point", "source": "RJ"}'
      ]
    };
  },
  mounted() {
    this.getFieldname();
  },
  methods: {
    getFieldname() {
      this.$http
        .post(this.backendIP + "/api/fields", {}, { emulateJSON: true })
        .then(function(data) {
          this.fieldName = data.data;
          // console.log(data.data.concept)
        });
    },
    delFile() {
      this.fileList = [];
    },
    delFile2() {
      this.fileList2 = [];
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log(this.fileList[0].raw);
    },
    handleChange2(file, fileList) {
      this.fileList2 = fileList;
      console.log(this.fileList2[0].raw);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    submitUpload() {
      let formData = new FormData();
      if (this.collection_name && this.fileList.length != 0) { //eslint-disable-line
        formData.append("collection_name", this.collection_name);
        formData.append("file", this.fileList[0].raw);
        let config = {
          headers: {
            "Content-Type": "multipart/form-data;charset=utf-8"
          }
        };
        this.$http
          .post(this.backendIP + "/api/upload", formData, config)
          .then(function(res) {
            console.log(res);
            if (res.data == 1) { //eslint-disable-line
              alert("导入成功");
            } else {
              alert("导入失败，不被识别的文件类型");
            }
          });
      } else if (this.fileList.length == 0) { //eslint-disable-line
        alert("未选择文件");
      }
    },
    submitUpload2() {
      let formData = new FormData();
      if (this.collection_name && this.fileList2.length != 0) { //eslint-disable-line
        formData.append("collection_name", this.collection_name);
        formData.append("file", this.fileList2[0].raw);

        let config = {
          headers: {
            "Content-Type": "multipart/form-data;charset=utf-8"
          }
        };
        this.$http
          .post(this.backendIP + "/api/upload", formData, config)
          .then(function(res) {
            console.log(res);
            if (res.data == 1) { //eslint-disable-line
              alert("导入成功");
            } else {
              alert("导入失败，不被识别的文件类型");
            }
          });
      } else if (this.fileList2.length == 0) { //eslint-disable-line
        alert("未选择文件");
      }
    }
  }
};
</script>
<style>
.fieldtag {
  margin: 3px 0px;
  float: left;
}
.inputbg {
  float: left;
}
</style>
