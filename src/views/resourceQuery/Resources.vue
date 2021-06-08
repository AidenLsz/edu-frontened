<template>
  <div class="exercise" style="margin-bottom: 40px; margin-top: 5vh">
    <!-- header -->
    <el-row justify="start" type="flex">
      <el-col style="padding-left: 1vw">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>学习资源检索
            <span @click="openInstructionDialog" style="cursor:pointer;">
              <i class="el-icon-question"></i>
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <instruction ref="instruction"/>
    <br>
    <!--    <el-row v-show="searchResult.length === 0" style="height: 40px" class="transition-box"></el-row>-->
    <el-row justify="start" type="flex">
      <el-col :span="4" :offset="5">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </el-col>
      <el-col :span="8" :offset="0">
        <el-checkbox-group v-model="checkedTypes" :min="1" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="type in types" :label="type" :key="type">{{type}}</el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-row>
        <el-col :span="14" :offset="4">
          <el-input v-model="content" placeholder="请输入要检索的资源"  @keyup.enter.native="submit"></el-input>
        </el-col>
        <el-col :span="2" :offset="0" style="padding-left: 10px">
          <el-button  plain value="提交" @click="submit">
            <span style="font-weight: bold">检索</span>
          </el-button>
        </el-col>
      </el-row>
    </el-row>
    <br><br>
    <el-col :span="20" :offset="2" style="margin-bottom: 20px">
      <el-table
          v-loading="loading"
          :data="searchResult"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          border
          style="width: 100%"
      >
        <el-table-column
            type="index"
            label="序号"
            width="80"
        >
        </el-table-column>
        <el-table-column
            prop="subject"
            label="学科"
            min-width="80"
        >
        </el-table-column>
        <el-table-column
            prop="period"
            label="学段"
            min-width="80"
        >
        </el-table-column>
        <el-table-column
            prop="type"
            label="资源类型"
            min-width="80">
        </el-table-column>
        <el-table-column
            v-if="this.showPublisher"
            prop="publisher"
            label="出版社"
            min-width="80">
        </el-table-column>
        <el-table-column
            prop="name"
            label="资源名"
            min-width="220"
        >
        </el-table-column>
        <el-table-column
            prop="date"
            label="存入日期"
            min-width="120"
        >
        </el-table-column>
        <!--        <el-table-column-->
        <!--            fixed="right"-->
        <!--            label="下载"-->
        <!--            width="80">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-button @click="handleDownloadClick(scope.row)" type="text" size="small">下载</el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </el-table>
    </el-col>
    <el-col v-if="!searchResult.length" style="height: 300px">
    </el-col>
  </div>
</template>

<script>
import Instruction from './components/InstructionResources.vue'
export default {
  name: "resources.vue",
  components:{
    Instruction
  },
  data() {
    return {
      checkAll: false,
      checkedTypes: ['教材', '课件', '教案', '学案'],
      types: ['教材', '课件', '教案', '学案'],
      isIndeterminate: true,
      loading: false,
      //搜索
      content: "",
      searchResult: [],
      // searchResult: [
      //   {
      //     subject: '英语',
      //     period: '小学一年级',
      //     type: '教材',
      //     name: '（部编版)一年级英语上册教材（我帮找网）.pdf',
      //     date: '2021-03-29',
      //     // publisher:'人教版'
      //   },
      //   {
      //     subject: '英语',
      //     period: '小学一年级',
      //     type: '教材',
      //     name: '（部编版)一年级英语上册教材（我帮找网）.pdf',
      //     date: '2021-03-29',
      //     // publisher:'人教版'
      //   }
      // ],
      showPublisher: false,
    }
  },
  methods: {
    openInstructionDialog(){
      this.$refs.instruction.openDialog();
    },
    handleCheckAllChange(val) {
      this.checkedTypes = val ? this.types : ['教材'];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.types.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.types.length;
    },
    handleDownloadClick(row) {
      console.log(row);
    },
    submit() {
      this.loading = true;
      const map = new Map();
      map.set('教材', 0)
      map.set('课件', 1)
      map.set('教案', 2)
      map.set('学案', 3)

      const types = this.checkedTypes.map(function (item) {
        return map.get(item);
      })

      //设置param
      let param = new FormData();
      const data = JSON.stringify({
        "content": this.content,
        "size": 30,
        "types": types
      });
      param.append("data", data);

      // console.log(data);

      //设置config
      let config = {
        headers: {"Content-Type": "multipart/form-data"}
      };

      //post请求给后端 .then处理返回的结果
      this.$http.post(this.backendIP + "/api/rsc_search", param, config, {
        emulateJSON: true}
      ).then(function (data) {
        //用循环分开赋值
        const error = data.data.error;

        if(error === 1) {
          //出现错误
          this.$message.error('查询出错');
          return
        }
        const results = data.data.results;
        // console.log(results);

        if (results.length !== 0) {
          let show = false;
          for (let j = 0, len = results.length; j < len; j++) {
            if (results[j].publisher !== '') {
              show = true;
              break;
            }
          }
          this.showPublisher = show;

          this.searchResult = results;
        }
        // for (let i = 0; i < results.length; i++) {
        //   this.searchResult.push(results);
        // }
        this.loading = false;
      });
      // let data = JSON.parse("{\"results\": [{\"filepath\": \"/share/luna/database-data/rsc_raw/学习资源下载/历史/大象高中历史版/高中/大象高中历史版必修一电子课\", \"subject\": \"历史\", \"period\": \"高中\", \"name\": \"大象高中历史版必修一电子课本[PDF].pdf\", \"date\": \"2021-05-04 20:19:29\", \"attrs\": {\"publisher\": 0,\"catalog\": \"\"}}]}")      //用循环分开赋值
      // const results = data.results;
      // console.log(results);
      //
      // if (results.length !== 0) {
      //   this.searchResult = results;
      // }
    },
  }
}

</script>

<style scoped>

</style>
