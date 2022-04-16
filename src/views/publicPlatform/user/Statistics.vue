<template>
  <div style="min-width: 1240px">
    <div id="Top_Nav" class="Top_Nav"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="head">
      <el-breadcrumb-item
        ><span style="color: rgba(0, 0, 0, 0.5)"
          >个人中心</span
        ></el-breadcrumb-item
      >
      <el-breadcrumb-item
        ><span style="color: black">统计信息</span></el-breadcrumb-item
      >
    </el-breadcrumb>

    <div class="title">
      <div class="line"></div>
      <div class="text">近期使用</div>
    </div>

    <div class="main">
      <div class="category" id="category"></div>
    </div>

    <div class="title">
      <div class="line"></div>
      <div class="text">接口调用查询</div>
    </div>
    <div class="main">
      <div class="fliter">
        <div class="block">
          <div class="text">项目名称</div>
          <el-input
            placeholder="请输入项目名称"
            v-model="fliter.name"
            style="width: 280px"
          ></el-input>
        </div>
        <div class="block">
          <div class="text">服务类型</div>
          <el-select
            v-model="fliter.type"
            multiple
            collapse-tags
            placeholder="请选择服务类型"
            style="width: 280px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="block">
          <div class="text">查询范围</div>
          <div>
            <el-date-picker
              v-model="timerange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              style="width: 360px"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </div>
        </div>
        <el-button
          type="primary"
          @click="Query"
          style="position: absolute; right: 20px; bottom: 0"
          >查询</el-button
        >
      </div>
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        "
        stripe
        :header-cell-style="{ background: '#97A3B7', color: '#555' }"
      >
        <el-table-column
          prop="call_date"
          label="调用时间"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column prop="input" label="接收参数" align="center">
        </el-table-column>
        <el-table-column prop="output" label="返回参数" align="center">
        </el-table-column>
        <el-table-column
          prop="project_name"
          label="项目名称"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column prop="service_name" label="服务名称" align="center">
        </el-table-column>
      </el-table>
      <div style="text-align: center">
        <el-pagination
          @current-change="
            (val) => {
              currentPage = val;
            }
          "
          :page-size="pagesize"
          layout="total, prev, pager, next, jumper"
          :total="tableData.length"
          hide-on-single-page
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import Axios from "axios";
export default {
  name: "Statistics",
  data() {
    return {
      stastics: [
        [20, 21, 22, 23, 34, 1, 2], //"图片转写"服务六天前的使用次数到今天的使用次数（按照时间顺序，20是六天前的使用次数，2是今天的使用次数）
        [2, 1, 32, 13, 24, 5, 6], //"属性预估"
        [0, 5, 9, 13, 17, 19, 21], //"相似度估计"
        [21, 3, 12, 16, 5, 19, 25], //"试卷打散入库"
      ],
      records: [
        {
          call_date: "2021-12-21 19:09:36",
          input: "input",
          output: "output",
          project_name: "xxx",
          service_name: ["属性预估"],
        },
        {
          call_date: "2022-1-21 19:09:36",
          input: "input",
          output: "output",
          project_name: "yyy",
          service_name: ["图片转写"],
        },
      ],
      tableData: [],
      options: [
        {
          value: "图片转写",
          label: "图片转写",
        },
        {
          value: "属性预估",
          label: "属性预估",
        },
        {
          value: "相似度估计",
          label: "相似度估计",
        },
        {
          value: "试卷打散入库",
          label: "试卷打散入库",
        },
      ],
      fliter: {
        name: "",
        type: ["图片转写", "属性预估", "相似度估计", "试卷打散入库"],
        start_time: "2022-1-1 00:00:00",
        end_time: "",
      },
      timerange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setHours(0, 0, 0);
              end.setHours(23, 59, 59);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              start.setHours(0, 0, 0);
              end.setHours(23, 59, 59);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              start.setHours(0, 0, 0);
              end.setHours(23, 59, 59);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "全部",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setFullYear(2022, 0, 1);
              start.setHours(0, 0, 0);
              end.setHours(23, 59, 59);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      currentPage: 1,
      pagesize: 10,
    };
  },
  created() {
    const end = new Date();
    const start = new Date();
    start.setFullYear(2022, 0, 1);
    start.setHours(0, 0, 0);
    end.setHours(23, 59, 59);
    this.timerange.push(start);
    this.timerange.push(end);
  },
  mounted() {
    this.ToTop();
    this.InitCate();
    let now = new Date();
    this.fliter.end_time = this.DateTrans(now);
    Axios
      .post("https://ailab-api-275-production.env.bdaa.pro/v1/api/usage", {
        start_time: this.fliter.start_time,
        end_time: this.fliter.end_time,
      })
      .then((data) => {
        if (data.data.success) {
          this.records = data.data.records;
          this.tableData = this.records;
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
    DateTrans(date) {
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds()
      );
    },
    InitCate() {
      let mycate = echarts.init(document.getElementById("category"));
      let datelist = [];
      for (let i = -6; i <= -2; i++) {
        let date = new Date();
        date.setDate(date.getDate() + i);
        datelist.push(date.getMonth() + "/" + date.getDate());
      }
      datelist.push("昨天");
      datelist.push("今天");
      let option = {
        legend: {
          top: 20,
          data: ["图片转写", "属性预估", "相似度估计", "试卷打散入库"],
        },
        xAxis: {
          type: "category",
          data: datelist,
        },
        yAxis: {
          type: "value",
          name: "使用次数",
        },
        grid: {
          top: 60,
          bottom: 30,
        },
        tooltip: {
          trigger: "axis",
        },
        series: [
          {
            name: "图片转写",
            data: this.stastics[0],
            type: "line",
          },
          {
            name: "属性预估",
            data: this.stastics[1],
            type: "line",
          },
          {
            name: "相似度估计",
            data: this.stastics[2],
            type: "line",
          },
          {
            name: "试卷打散入库",
            data: this.stastics[3],
            type: "line",
          },
        ],
      };
      mycate.setOption(option);
      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener("resize", function () {
        mycate.resize();
      });
    },
    Query() {
      this.fliter.start_time = this.DateTrans(this.timerange[0]);
      this.fliter.end_time = this.DateTrans(this.timerange[1]);
      console.log(this.fliter);
      this.tableData = [];
      for (let i = 0; i < this.records.length; i++) {
        if (
          this.fliter.name == "" ||
          this.records[i].project_name.includes(this.fliter.name)
        ) {
          // 项目名称筛选器通过
          let flag = false;
          for (let type of this.records[i].service_name)
            if (this.fliter.type.indexOf(type) == -1) {
              console.log(type);
              flag = true;
              break;
            }
          console.log(this.records[i], flag);
          if (!flag) {
            // 服务类型筛选器通过
            let date = new Date(
              Date.parse(this.records[i].call_date.replace(/-/g, "/"))
            );
            if (date >= this.timerange[0] && date <= this.timerange[1])
              // 日期选择器通过
              this.tableData.push(this.records[i]);
          }
        }
      }
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
  padding: 20px 0;
  background: #ffffff;
  border: 1px solid #a6a6a6;
  border-radius: 8px;
  .category {
    width: 100%;
    height: 400px;
  }
  .el-table {
    width: calc(100% - 80px);
    margin: 40px 40px;
  }
  .fliter {
    position: relative;
    margin: 0 20px;
    .block {
      display: inline-block;
      margin: 0 20px;
      .text {
        font-family: "Roboto";
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        height: 22px;
        text-align: left;
        margin-bottom: 5px;
      }
    }
  }
}

.Top_Nav {
  position: relative;
  top: -90px;
  width: 10px;
  height: 0px;
  background: transparent;
}
</style>