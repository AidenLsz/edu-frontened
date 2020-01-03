<template>
  <div>
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
      <el-table-column type="selection" width="60"> </el-table-column>
      <el-table-column type="index" width="60"> </el-table-column>
      <el-table-column
        prop="source_name"
        label="知识头节点"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column prop="target_name" label="知识尾节点" width="180">
      </el-table-column>
      <el-table-column prop="type" label="知识关系类型" width="120">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
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
      <el-form :model="editForm">
        <el-form-item label="知识头节点" :label-width="formLabelWidth">
          <el-input v-model="editForm.sourceName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="知识尾节点" :label-width="formLabelWidth">
          <el-input v-model="editForm.targetName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关系类型" :label-width="formLabelWidth">
          <el-input v-model="editForm.type" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      lists: [],
      multipleSelection: [],
      search: "",
      total: 1,
      currentPage: 1,
      pagesize: 10,
      dialogFormVisible: false,
      editForm: {
        id: 0,
        sourceName: "",
        targetName: "",
        type: ""
      },
      formLabelWidth: "120px"
    };
  },
  mounted() {
    this.getNodes();
  },
  methods: {
    getNodes() {
      axios({ method: "GET", url: this.backendIP + "/api/list_edge" }).then(
        result => {
          this.lists = result.data;
          this.total = this.lists.length;
        },
        error => {
          console.error(error);
        }
      );
    },
    // 显示编辑界面
    handleEdit: function(index, row) {
      this.dialogFormVisible = true;
      this.editForm.sourceName = row.source_name;
      this.editForm.targetName = row.target_name;
      this.editForm.type = row.type;
      this._id = row._id;
    },
    // 编辑
    editSubmit() {
      axios
        .put(this.backendIP + `/api/sourceName/${this._id}`, {
          source_name: this.editForm.sourceName
        })
        .then(res => {
          this.getNodes();
        });
      axios
        .put(this.backendIP + `/api/targetName/${this._id}`, {
          target_name: this.editForm.targetName
        })
        .then(res => {
          this.getNodes();
        });
      this.dialogFormVisible = false;
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
          // 添加删除的请求
          // ........
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
