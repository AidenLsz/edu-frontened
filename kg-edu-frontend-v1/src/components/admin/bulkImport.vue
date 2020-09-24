<template>
  <div>
    <el-row>
      <el-divider content-position="left">导入须知</el-divider>
      <ul align="left">
        <li>
          已存在的集合（collection）列表如下，批量导入前请检查集合名是否已存在 :
        </li>
        <el-col :span="3" v-for="col in list" :key="col">
          <el-tag>{{ col }}</el-tag>
        </el-col>
      </ul>
    </el-row>
    <el-row>
      <el-divider content-position="left">导入操作</el-divider>
      <el-col :span="10">
        <b>批量导入新的集合（仅提供json格式）</b><br />
        <el-form
          label-position="right"
          label-width="120px"
          ref="ruleForm"
          :model="formLabel"
          status-icon
          :rules="rules"
          class="demo-ruleForm"
        >
          <el-form-item label="集合名:" prop="colname">
            <el-input v-model="formLabel.colname"></el-input>
          </el-form-item>
        </el-form>
        <!-- 上传新集合 -->
        <div class="inputbg">
          <el-upload
            class="upload-demo"
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
              @click="submitUpload('ruleForm')"
            >
              上传</el-button
            >
            <el-button
              style="float: right;"
              size="small"
              @click="resetForm('ruleForm')"
              >重置</el-button
            >
          </el-upload>
        </div>
      </el-col>
      <el-col :span="1"> </el-col>
      <el-col :span="10">
        <b>批量导入新的字段（仅提供json格式）</b><br />
        <el-form
          label-position="right"
          label-width="120px"
          ref="ruleForm2"
          :model="formLabel"
          status-icon
          :rules="rules2"
          class="demo-ruleForm"
        >
          <el-form-item label="字段名:" prop="field_name">
            <el-input v-model="formLabel.field_name"></el-input>
          </el-form-item>
          <el-form-item label="集合:" prop="existname">
            <el-select
              v-model="formLabel.existname"
              placeholder="请选择已存在的集合"
            >
              <el-option label="node" value="node"></el-option>
              <el-option label="edge" value="edge"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 上传新字段 -->
        <div class="inputbg">
          <el-upload
            class="upload-demo"
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
              @click="submitFeild('ruleForm2')"
            >
              上传</el-button
            >
            <el-button
              style="float: right;"
              size="small"
              @click="resetForm2('ruleForm2')"
              >重置</el-button
            >
          </el-upload>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    var validataCheck = (rule, value, callback) => {
      if (value == "") { //eslint-disable-line
        callback(new Error("请创建新的集合名"));
      } else if (value == "node" || value == "edge") { //eslint-disable-line
        callback(new Error("此集合名已存在"));
      } else {
        callback();
      }
    };
    return {
      formLabel: {
        colname: "",
        field_name: "",
        existname: ""
      },
      existcollection_name: "",

      list: "",
      rules: {
        colname: [{ required: true, validator: validataCheck, trigger: "blur" }]
      },
      rules2: {
        field_name: [
          { required: true, message: "请创建新的字段名", trigger: "blur" }
        ],
        existname: [
          { required: true, message: "请选择添加到的集合", trigger: "change" }
        ]
      },
      fileList: [],
      fileList2: [],
      multiple: true
    };
  },
  mounted() {
    this.getLists();
  },
  methods: {
    getLists() {
      axios({
        method: "GET",
        url: this.backendIP + "/api/list_collection"
      }).then(
        result => {
          console.log(result.data);
          this.list = result.data;
        },
        error => {
          console.error(error);
        }
      );
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
    // 上传新集合
    submitUpload(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData();
          if (this.formLabel.colname && this.fileList.length != 0) { //eslint-disable-line
            formData.append("collection_name", this.formLabel.colname);
            formData.append("file", this.fileList[0].raw);
            let config = {
              headers: {
                "Content-Type": "multipart/form-data;charset=utf-8"
              }
            };
            this.$http
              .post(this.backendIP + "/api/upload", formData, config)
              .then(function(res) {
                // console.log(res);
                if (res.data == 1) { //eslint-disable-line
                  alert("导入成功");
                } else {
                  alert("导入失败，不被识别的文件类型");
                }
              });
          } else if (this.fileList.length == 0) { //eslint-disable-line
            alert("未选择文件");
          }
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    resetForm2(formName) {
      this.$refs[formName].resetFields();
    },
    // 上传新字段
    submitFeild(formName) {
      console.log(this.formLabel.existname);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData();
          if (this.formLabel.field_name && this.fileList2.length != 0) { //eslint-disable-line
            formData.append("field_name", this.formLabel.field_name);
            formData.append("collection_name", this.formLabel.existname);
            formData.append("file", this.fileList2[0].raw);

            let config = {
              headers: {
                "Content-Type": "multipart/form-data;charset=utf-8"
              }
            };
            this.$http
              .post(this.backendIP + "/api/updateField", formData, config)
              .then(function(res) {
                console.log(res);
                if (res.data == 1) { //eslint-disable-line
                  alert("导入成功");
                } else {
                  alert("导入失败");
                }
              });
          } else if (this.fileList2.length == 0) { //eslint-disable-line
            alert("未选择文件");
          }
        } else {
          console.log("error submit!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.inputbg {
  margin-left: 15%;
}
</style>
