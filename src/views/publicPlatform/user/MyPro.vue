<template>
  <div style="min-width: 1240px">
    <div id="Top_Nav" class="Top_Nav"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="head">
      <el-breadcrumb-item
        ><span style="color: rgba(0, 0, 0, 0.5)"
          >项目管理</span
        ></el-breadcrumb-item
      >
      <el-breadcrumb-item
        ><span style="color: black">我的项目</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="title">
      <div class="line"></div>
      <div class="text">我的项目</div>
    </div>
    <div class="main">
      <el-table
        :data="tableData"
        stripe
        :header-cell-style="{ background: '#97A3B7', color: '#555' }"
      >
        <el-table-column prop="project_name" label="项目名称" align="center">
        </el-table-column>
        <el-table-column prop="project_id" label="项目ID" align="center">
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="state" label="状态" width="90" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 0">
              <div class="green_point"></div>
              {{ "有效" }}
            </span>
            <span v-else>
              <div class="red_point"></div>
              {{ "禁用" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="services"
          label="服务类型"
          align="center"
          :formatter="Formatter"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="Detail(scope.$index, scope.row)"
              >详情</el-button
            >
            <el-button
              v-if="scope.row.state == 0"
              size="mini"
              type="warning"
              @click="Disable(scope.$index, scope.row)"
              >禁用</el-button
            >
            <el-button
              v-else
              size="mini"
              type="success"
              @click="Able(scope.$index, scope.row)"
              >启用</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="Delete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button class="create_btn" @click="CreateProject()">
        <span style="color: white">+创建项目</span></el-button
      >
    </div>
  </div>
</template>

<script>
import Axios from "axios";
// import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      tableData: [
        // {
        //   project_name: "xxx",
        //   project_id: "111",
        //   create_time: "2021-12-21 19:09:36",
        //   state: 0, // 0--有效  1--禁用
        //   services: ["xxx"],
        // },
      ],
    };
  },
  mounted() {
    this.ToTop();
    Axios.post(
      "https://ailab-api-275-production.env.bdaa.pro/v1/prog/my",
      {},
      {
        headers: {
          Authorization: `Bearer ${this.$store.state.AIlab_user.AItoken}`,
        },
      }
    ).then((data) => {
      if (data.data.success) {
        this.tableData = data.data.projects;
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].create_time = this.DateTrans(
            this.tableData[i].create_time
          );
        }
      } else {
        this.$message({
          showClose: true,
          message: data.data.errMsg,
          type: "error",
        });
      }
    });
  },
  methods: {
    ToTop() {
      document.getElementById("Top_Nav").scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    },
    DateTrans(before) {
      let after = "";
      let temp = before.split(" ");
      let month;
      switch (temp[2]) {
        case "Jan":
          month = "01";
          break;
        case "Feb":
          month = "02";
          break;
        case "Mar":
          month = "03";
          break;
        case "Apr":
          month = "04";
          break;
        case "May":
          month = "05";
          break;
        case "Jun":
          month = "06";
          break;
        case "Jul":
          month = "07";
          break;
        case "Agu":
          month = "08";
          break;
        case "Sep":
          month = "09";
          break;
        case "Oct":
          month = "10";
          break;
        case "Nov":
          month = "11";
          break;
        case "Dec":
          month = "12";
          break;
      }
      after = temp[3] + "-" + month + "-" + temp[1];
      return after;
    },
    CreateProject() {
      this.$router.push({
        path: "/PublicPlatform/user/CreateProject",
      });
      this.ToTop();
    },
    // 查看项目详情
    Detail(index, data) {
      // 注意path和params不能一起用，要么用name+params，要么用path+query
      let routeData = this.$router.resolve({
        path: "/PublicPlatform/user/ProDetail",
        query: { project_id: data.project_id },
      });
      window.open(routeData.href, "_blank");
    },
    // 禁用某项目
    Disable(index, data) {
      this.$msgbox
        .confirm("确认禁用该项目吗？", "提示", {
          type: "warning",
        })
        .then(() => {
          Axios.post(
            "https://ailab-api-275-production.env.bdaa.pro/v1/prog/stat",
            {
              project_id: data.project_id,
              state: 1,
            },
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.AIlab_user.AItoken}`,
              },
            }
          ).then((data) => {
            if (data.data.success) {
              this.tableData[index].state = 1;
              this.$message({
                type: "success",
                message: "禁用成功，您可以点击启用按钮重新启用该项目",
              });
            } else {
              this.$message({
                type: "error",
                message: data.data.errMsg,
              });
            }
          });
        });
    },
    Able(index, data) {
      this.$msgbox.confirm("确认启用该项目吗？", "提示", {}).then(() => {
        Axios.post(
          "https://ailab-api-275-production.env.bdaa.pro/v1/prog/stat",
          {
            project_id: data.project_id,
            state: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.AIlab_user.AItoken}`,
            },
          }
        ).then((data) => {
          if (data.data.success) {
            this.tableData[index].state = 0;
            this.$message({
              type: "success",
              message: "启用成功",
            });
          } else {
            this.$message({
              type: "error",
              message: data.data.errMsg,
            });
          }
        });
      });
    },
    // 删除某项目
    Delete(index, data) {
      this.$msgbox
        .confirm("确认删除该项目吗？（此操作不可逆）", "提示", {
          type: "error",
        })
        .then(() => {
          Axios.post(
            "https://ailab-api-275-production.env.bdaa.pro/v1/prog/stat",
            {
              project_id: data.project_id,
              state: 2,
            },
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.AIlab_user.AItoken}`,
              },
            }
          ).then((data) => {
            if (data.data.success) {
              this.tableData.splice(index, 1);
              this.$message({
                type: "success",
                message: "项目删除成功",
              });
            } else {
              this.$message({
                type: "error",
                message: data.data.errMsg,
              });
            }
          });
        });
    
    },
    // 格式化服务类型数据
    Formatter(row) {
      return row.services.join(";");
    },
  },
};
</script>

<style lang="scss" scoped>
.head {
  position: relative;
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 40px;
}

.title {
  position: relative;
  margin-top: 35px;
  height: 22px;
  width: 100%;
  .line {
    position: absolute;
    width: 5.56px;
    height: 22px;
    left: 40px;

    background-color: #000000;
  }
  .text {
    position: absolute;
    width: 88.89px;
    height: 22px;
    left: 51.11px;

    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 22px;
    /* identical to box height, or 110% */

    color: #000000;
  }
}

.main {
  position: relative;
  width: calc(100% - 80px);
  margin: 20px 40px;
  background: #ffffff;
  border: 1px solid #a6a6a6;
  border-radius: 8px;
  .el-table {
    width: calc(100% - 80px);
    margin: 60px 40px 0 40px;
  }
  .create_btn {
    display: block;
    position: relative;
    margin: 31.5px auto;
    width: 142px;
    height: 44px;
    background: #23242a;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.06);
    border-radius: 10px;
  }
  .create_btn:hover {
    opacity: 0.9;
  }
}

.green_point {
  position: relative;
  top: -1px;
  vertical-align: middle;
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #70c745;
  border-radius: 50%;
  margin-right: 3px;
}

.red_point {
  position: relative;
  top: -1px;
  vertical-align: middle;
  display: inline-block;
  width: 6px;
  height: 6px;
  background: red;
  border-radius: 50%;
  margin-right: 3px;
}

.Top_Nav {
  position: relative;
  top: -90px;
  width: 10px;
  height: 0px;
  background: transparent;
}
</style>