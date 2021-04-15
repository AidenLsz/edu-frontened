<template>
  <div class="field">
    <el-row type="flex" justify="start">
      <el-button size="small" @click="insertArea">添加数据</el-button>
    </el-row>
    <!-- 添加数据值的界面 -->
    <el-dialog title="添加数据" :visible.sync="dialogFormVisible">
      <el-form :model="addForm" :rules="rules" ref="ruleForm">
        <el-form-item
          v-for="(item, index) in fieldName"
          :key="index"
          :label="item"
          :prop="item"
          :label-width="formLabelWidth"
        >
          <el-input v-model="addForm[item]" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">重 置</el-button>
        <el-button type="primary" @click="addSubmit('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inject: ["reload"],
  name: "InsertOne",
  props: {
    collection: {
      type: String,
      default: ""
    },
    field: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "120px",
      addForm: {},
      fieldName: [],
      rules: {
        area: [
          { required: true, message: "请输入学科", trigger: "blur" },
          {
            type: "enum",
            enum: ["数学", "英语", "语文", "物理", "化学"],
            message: "请输入正确的学科名，如 ‘数学’",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "请输入知识点名称", trigger: "blur" }
        ],
        verified: [
          {
            type: "enum",
            enum: ["false", "true"],
            message: "请输入 true 或 false",
            trigger: "blur"
          }
        ],
        version: [
          { required: true, message: "请输入教科书版本", trigger: "blur" }
        ],
        grade: [
          { required: true, message: "请输入教科书版本", trigger: "blur" }
        ],
        chapter: [
          { required: true, message: "请输入教科书版本", trigger: "blur" }
        ],
        type: [{ required: true, message: "请输入知识点类别", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getFields();
  },
  methods: {
    getFields() {
      this.$http
        .post(this.backendIP + "/api/fields", {}, { emulateJSON: true })
        .then(function(data) {
          this.fieldName = data.data[this.field];
        });
    },
    insertArea() {
      this.dialogFormVisible = true;
      // this.addForm.type = this.field;
    },
    addSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("submit");
          var data = {};
          for (var i = 0; i < this.fieldName.length; i++) {
            data[this.fieldName[i]] = this.addForm[this.fieldName[i]];
          }
          console.log(this.field);
          this.$http
            .post(
              this.backendIP + "/api/insertOne",
              {
                collection_name: this.collection,
                data: JSON.stringify(data),
                field: this.field
              },
              { emulateJSON: true }
            )
            .then(function() {
              this.reload();
            });
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!");
          return false;
        }
      });
    }
  }
};
</script>
