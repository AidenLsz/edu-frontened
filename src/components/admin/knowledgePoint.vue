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
      <el-table-column prop="name" label="知识点" sortable width="180">
      </el-table-column>
      <el-table-column prop="area" label="学科" width="120"> </el-table-column>
      <el-table-column prop="grade" label="年级" width="120"> </el-table-column>
      <el-table-column prop="chapter" label="单元" width="90">
      </el-table-column>
      <el-table-column
        prop="version"
        label="版本"
        width="120"
        :filters="[
          { text: '人教版', value: '人教版' },
          { text: '苏教版', value: '苏教版' }
        ]"
        :filter-method="filterVersion"
      >
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
        <el-form-item label="知识点" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学科" :label-width="formLabelWidth">
          <el-input v-model="editForm.area" autocomplete="off"></el-input>
          <!-- <el-select v-model="editForm.area">
          <el-option label="数学" value="math"></el-option>
          <el-option label="语文" value="chinese"></el-option>
        </el-select> -->
        </el-form-item>
        <el-form-item label="年级" :label-width="formLabelWidth">
          <el-input v-model="editForm.grade" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单元" :label-width="formLabelWidth">
          <el-input v-model="editForm.chapter" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本" :label-width="formLabelWidth">
          <el-input v-model="editForm.version" autocomplete="off"></el-input>
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
        name: "",
        area: "",
        grade: "",
        chapter: "",
        version: ""
      },
      formLabelWidth: "80px"
    };
  },
  mounted() {
    this.getNodes();
  },
  methods: {
    getNodes() {
      this.$http
        .get(this.backendIP + "/api/list_book", { emulateJSON: true })
        .then(function(data) {
          this.lists = data.data;
          this.total = this.lists.length;
        });
    },
    // 显示编辑界面
    handleEdit: function(index, row) {
      this.dialogFormVisible = true;
      this.editForm.name = row.name;
      this.editForm.area = row.area;
      this.editForm.grade = row.grade;
      this.editForm.chapter = row.chapter;
      this.editForm.version = row.version;
      this._id = row._id;
    },
    // 编辑
    editSubmit() {
      this.$http
        .put(
          this.backendIP + `/api/list/${this._id}`,
          { name: this.editForm.name },
          { emulateJSON: true }
        )
        .then(function(data) {
          this.getNodes();
        });

      this.$http
        .put(
          this.backendIP + `/api/regrade/${this._id}`,
          { grade: this.editForm.grade },
          { emulateJSON: true }
        )
        .then(function(data) {
          this.getNodes();
        });

      this.$http
        .put(
          this.backendIP + `/api/re_chapter/${this._id}`,
          { chapter: this.editForm.chapter },
          { emulateJSON: true }
        )
        .then(function(data) {
          this.getNodes();
        });

      this.$http
        .put(
          this.backendIP + `/api/reversion/${this._id}`,
          { version: this.editForm.version },
          { emulateJSON: true }
        )
        .then(function(data) {
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
    },
    filterVersion(value, row) {
      return row.version === value;
    }
  }
};
</script>

<style></style>
