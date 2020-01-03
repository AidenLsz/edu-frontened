<template>
  <div id="import">
    <el-tabs type="border-card" style="height:550px;">
      <!-- schema说明 -->
      <el-tab-pane label="来自百科">
        <el-row>
          <el-col :span="4">Schema字段说明：</el-col>
          <el-col :span="20">
            <el-row v-for="(edgeField, index) in fieldName.edge" :key="index">
              <el-col :span="16">
                <div class="fieldtag">
                  <el-tag effect="plain" :type="edgeItem[index]">{{
                    edgeField
                  }}</el-tag>
                  <span>{{ edge[index].description }}</span>
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
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fieldName: {},
      edgeItem: ["danger", "danger", "", "", "danger"],
      edge: [
        { description: "必填字段。知识关系类型，一般为component 或 contain" },
        { description: "必填字段。标识头节点的name" },
        {
          description: "可选字段。头节点的类型,一般为concept 或 knowledge point"
        },
        {
          description: "可选字段。尾节点的类型,一般为concept 或 knowledge point"
        },
        { description: "必填字段。标识尾节点的name" }
      ],
      fileList: [],
      multiple: true,
      collection_name: "edge", // 所导入的集合
      example: [
        '{"type": "component", "source_name": "实轴", "source_type": "concept", "target_type": "concept", "target_name": "轴"}'
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
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log(this.fileList[0].raw);
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
    }
  }
};
</script>
<style>
.fieldtag {
  margin: 5px 0px;
  float: left;
}
.inputbg {
  float: left;
}
</style>
