<template>
  <div v-loading="loading">
    <!-- 列表 -->
    <el-table
      :data="
        lists
          .filter(
            data =>
              !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
          .slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      highlight-current-row
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column
        v-for="(item, index) in fieldName"
        :key="index"
        :prop="item"
        :label="item"
        show-overflow-tooltip
        id="table"
      >
      </el-table-column>
      <el-table-column align="right" fixed="right" width="200">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="输入知识点搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="pagesize"
      layout="total, prev, pager, next"
      :total="total"
      @current-change="currentChange"
      style="float: right;"
    >
    </el-pagination>

    <!-- 编辑界面 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="ruleForm">
        <el-form-item
          v-for="(item, index) in fieldName"
          :key="index"
          :label="item"
          :prop="item"
          :label-width="formLabelWidth"
        >
          <el-input v-model="editForm[item]" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">重 置</el-button>
        <el-button type="primary" @click="editSubmit('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "ShowNode",
  props: {
    src: {
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
      loading: true,
      lists: [],
      multipleSelection: [],
      search: "",
      total: 1,
      currentPage: 1,
      pagesize: 10,
      dialogFormVisible: false,
      editForm: {},
      formLabelWidth: "90px",
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
        ]
      }
    };
  },
  mounted() {
    this.getNodes();
    this.getFields();
  },
  methods: {
    getFields() {
      this.$http
        .post(this.backendIP + "/api/fields", {}, { emulateJSON: true })
        .then(function(data) {
          this.fieldName = data.data[this.field];
          console.log(this.fieldName);
        });
    },
    getNodes() {
      this.$http
        .post(
          this.backendIP + "/api/list_data",
          { nodeType: this.src },
          { emulateJSON: true }
        )
        .then(function(data) {
          this.lists = data.data;
          this.total = this.lists.length;
          this.loading = false;
        });
    },
    // 显示编辑界面
    handleEdit: function(index, row) {
      this.dialogFormVisible = true;
      for (var i = 0; i < this.fieldName.length; i++) {
        this.$set(this.editForm, this.fieldName[i], row[this.fieldName[i]]);
      }
      this._id = row._id;
    },
    // 编辑
    editSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("submit");
          var editlist = [];
          for (var i = 0; i < this.fieldName.length; i++) {
            editlist.push(this.editForm[this.fieldName[i]]);
          }
          this.$http
            .put(
              this.backendIP + `/api/editNode/${this._id}`,
              { name: editlist, fieldName: this.fieldName },
              { emulateJSON: true }
            )
            .then(function() {
              this.getNodes();
            });
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .put(this.backendIP + `/api/del_node/${row._id}`, {
              emulateJSON: true
            })
            .then(function() {
              this.getNodes();
            });
          this.$message({
            type: "sucess",
            message: "删除成功！"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    currentChange(arg) {
      this.currentPage = arg;
    }
  }
};
</script>
<style>
.el-tooltip__popper {
  max-width: 30%;
  line-height: 30px;
}
</style>
