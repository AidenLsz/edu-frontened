<template>
  <div>
    <!-- 地址框 -->
    <el-row justify="start" type="flex">
      <el-col :span="7">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>用户信息</el-breadcrumb-item>
          <el-breadcrumb-item>组织架构</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 30px">
        <label style="font-size: 18px">用户管理</label>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 10px">
        <label style="font-size: 14px">用户所属：</label>
        <span style="font-size: 14px">{{ userGroup }}</span>
    </el-row>
    <el-divider></el-divider>
    <el-row type="flex" justify="start">
        <el-col :span="18">
            <el-row type="flex" justify="start" style="margin-left: 10px">
                <span style="height: 40px; line-height: 40px; margin-right: 15px">用户名：</span>
                <el-input v-model="userName" placeholder="用户名" style="width: 12vw; height: 30px; line-height: 30px; margin-right: 30px"></el-input>
                <span style="height: 40px; line-height: 40px; margin-right: 15px">邮箱：</span>
                <el-input v-model="mailAddress" placeholder="邮箱" style="width: 8vw; height: 30px; line-height: 30px; margin-right: 30px"></el-input>
                <el-button type="primary" style="height: 40px">查询</el-button>
            </el-row>
        </el-col>
        <el-col :span="6">
            <el-row type="flex" justify="end" style="margin-right: 40px">
                <el-button type="primary" style="height: 40px" @click="Add_New_User_To_Group()">添加用户</el-button>
            </el-row>
        </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 40px">
        <el-table
            :data="tableData">
            <el-table-column
                prop="userName"
                label="用户名">
            </el-table-column>
            <el-table-column
                prop="userNick"
                label="昵称">
            </el-table-column>
            <el-table-column
                prop="userEnterprise"
                label="所属单位">
            </el-table-column>
            <el-table-column
                prop="userProfession"
                label="职业"
                width="100">
            </el-table-column>
            <el-table-column
                prop="userMailAddress"
                label="邮箱"
                width="240">
            </el-table-column>
            <el-table-column
                prop="userPhoneNumber"
                label="电话"
                width="150">
            </el-table-column>
            <el-table-column
                prop="userAuthority"
                label="权限"
                width="100">
            </el-table-column>
            <el-table-column
                type="index"
                label="操作"
                width="160">
                <template slot-scope="scope">
                    <el-row>
                        <el-button size="mini" type="success" @click="Edit_User(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="Delete_User(scope.$index)">删除</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'myPaper',
  props: {

  },
  data() {
    return {
        // 这个是用于检索的关键字，如果要显示用户信息的话之后手写一个方法放上去就好
        userGroup: "中国科学技术大学",
        userName: "",
        mailAddress: "",
        tableData: [
            {
                userName: '12345678',
                userNick: 'A',
                userEnterprise: "中科大",
                userProfession: "教师",
                userMailAddress: "12345678@ustc.edu.cn",
                userPhoneNumber: "13222337890",
                userAuthority: "管理员"
            }, {
                userName: 'ABCDEFGH',
                userNick: 'B',
                userEnterprise: "中科大",
                userProfession: "教师",
                userMailAddress: "12345678@ustc.edu.cn",
                userPhoneNumber: "13222337890",
                userAuthority: "一般用户"
            }, {
                userName: 'zxcvbnm',
                userNick: 'C',
                userEnterprise: "中科大",
                userProfession: "教师",
                userMailAddress: "12345678@ustc.edu.cn",
                userPhoneNumber: "13222337890",
                userAuthority: "一般用户"
            }
        ]
    }
  },
  watch:{

  },
  mounted() {

  },
  methods: {
      Edit_User(val){
          alert(val.userName + " 正在编辑中...");
      },
      Delete_User(val){
        this.$message.error("已删除（隐藏）对应数据。")
        this.tableData.splice(val, 1);
      },
      Add_New_User_To_Group(){
        alert("正要前往成员添加界面...")
      }
  }
}
</script>
<style >
</style>