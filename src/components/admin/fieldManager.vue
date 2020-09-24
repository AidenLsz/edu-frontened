<template>
  <div class="field" v-if="admin_view">
    <el-row type="flex" justify="start">
      <el-button size="small" @click="editField">编辑字段 </el-button>
    </el-row>
    <div style="margin-top: 10px;"></div>
    <el-row v-if="fieldVisible">
      <el-table :data="fieldinfo">
        <el-table-column
          property="key"
          label="field name"
          width="150"
        ></el-table-column>
        <el-table-column align="right">
          <template slot="header"></template>
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="Editfieldinfo(scope.$index, scope.row)"
              >Edit</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteField(scope.$index, scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="start">
        <el-button size="small" @click="addfieldVisible = true"
          >添加字段</el-button
        >
      </el-row>
    </el-row>
    <div style="margin-top: 10px;"></div>
    <!-- 修改字段名界面 -->
    <el-dialog title="字段编辑" :visible.sync="editfieldVisible">
      <el-form :model="fieldedit" :rules="fieldrules" ref="fieldedit">
        <el-form-item label="字段名" label-width="100px">
          <el-input v-model="fieldedit.key" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editfieldVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFieldupdate('fieldedit')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 添加字段界面 -->
    <el-dialog title="字段编辑" :visible.sync="addfieldVisible">
      <el-form :model="addfield" :rules="fieldrules" ref="addfield">
        <el-form-item label="新字段名" label-width="100px">
          <el-input v-model="addfield.key" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="默认初始值" label-width="100px">
          <el-input v-model="addfield.value" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addfieldVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFieldAdd('addfield')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inject: ["reload"],
  name: "fieldManger",
  props: {
    src: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      fieldVisible: false,
      editfieldVisible: false,
      addfieldVisible: false,
      username: "",
      admin_view: false,
      fieldinfo: [],
      fieldedit: {
        key: ""
      },
      addfield: {
        key: "",
        value: ""
      },
      fieldrules: {
        key: [{ required: true, message: "请输入知识点名称", trigger: "blur" }]
      },
      old_field: ""
    };
  },
  mounted() {
    if (sessionStorage.getItem("user") === "admin") {
      this.admin_view = true;
      this.fieldInfo();
    }
  },
  methods: {
    // 获取字段信息
    fieldInfo() {
      this.$http
        .post(this.backendIP + "/api/fields", {}, { emulateJSON: true })
        .then(function(data) {
          this.fieldName = data.data[this.src];
          for (let i = 0; i < this.fieldName.length; i++) {
            this.fieldinfo[i] = { key: this.fieldName[i] };
          }
        });
    },
    editField() {
      this.fieldVisible = !this.fieldVisible;
    },
    // 显示字段编辑界面
    Editfieldinfo: function(index, row) {
      this.editfieldVisible = true;
      this.fieldedit.key = row.key;
      this.old_field = row.key;
    },
    submitFieldupdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post(
              this.backendIP + "/api/editField",
              {
                old_field: this.old_field,
                new_field: this.fieldedit.key,
                collection: "node_copy"
              },
              { emulateJSON: true }
            )
            .then(function() {
              this.reload();
            });
          this.editfieldVisible = false;
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
    submitFieldAdd(addfield) {
      this.$refs[addfield].validate(valid => {
        if (valid) {
          this.$http
            .post(
              this.backendIP + "/api/addNewField",
              {
                new_name: this.addfield.key,
                default_value: this.addfield.value,
                collection: "node_copy"
              },
              { emulateJSON: true }
            )
            .then(function() {
              this.reload();
            });
          this.addfieldVisible = false;
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
    deleteField(index, row) {
      console.log(row);
      this.$confirm("此操作将永久删除该文件，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .put(
              this.backendIP + `/api/deleteField/${row.key}`,
              {
                collection: "node_copy"
              },
              {
                emulateJSON: true
              }
            )
            .then(function() {
              this.reload();
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
    }
  }
};
</script>
