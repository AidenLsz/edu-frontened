<template>
  <div>
    <el-row>
      <el-col :span="21">
        <fieldManager src="edge"></fieldManager>
      </el-col>
      <el-col :span="3">
        <InsertOne collection="edge_copy" field="edge"></InsertOne>
      </el-col>
    </el-row>

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
      v-loading="loading"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column
        v-for="(item, index) in fieldName"
        :key="index"
        :prop="item"
        :label="item"
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
import axios from "axios";
import fieldManager from "./fieldManager.vue";
import InsertOne from "./InsertOne.vue";
export default {
  components: { fieldManager, InsertOne },
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
      formLabelWidth: "120px",
      fieldName: [],
      rules: {
        source_name: [
          { required: true, message: "请输入知识点名称", trigger: "blur" }
        ],
        target_name: [
          { required: true, message: "请输入知识点名称", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请输入知识关系属性", trigger: "blur" }
        ],
        verified: [
          {
            type: "enum",
            enum: ["false", "true"],
            message: "请输入 true 或 false",
            trigger: "blur"
          }
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
          this.fieldName = data.data.edge;
        });
    },
    getNodes() {
      axios({ method: "GET", url: this.backendIP + "/api/list_edge" }).then(
        result => {
          this.lists = result.data;
          this.total = this.lists.length;
          this.loading = false;
        },
        error => {
          console.error(error);
        }
      );
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
              this.backendIP + `/api/editEdge/${this._id}`,
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
            .put(this.backendIP + `/api/del_edge/${row._id}`, {
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

<style></style>
