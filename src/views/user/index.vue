<template lang="html">
  <el-container style="height:100%">
    <el-header style="height:70px">
      <el-row>
        <el-col :span="6">
          <img src="@/assets/luna_icon.png" alt="Logo" width="150px" style="cursor: pointer" @click="goToMainPage"/>
        </el-col>
        <el-col :span="3" :offset="15">
          <img class="user-icon" src="https://gravatar.loli.net/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mp" alt="">
          <el-dropdown>
            <i class="el-icon-setting user-setting-icon" style="margin-left: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人设置</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" height="100%" style="background-color: #fff;min-height:90vh">
        <el-menu :default-active="activeIndex" style="text-align:left">
          <div class="user-info">
            <div>
              <img class="user-icon" src="https://gravatar.loli.net/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mp" alt="">
              <div class="info">
                <div class="user-name">
                  用户名
                </div>
                <div class="affiliation">
                  所属单位
                </div>
              </div>
            </div>
          </div>
          <div style="margin:0 10px;border-bottom:solid 1px #eee">
          </div>
          <router-link to="/" :underline="false" @click.native="ToTop">
            <el-menu-item index="0">
              <template slot="title"><i class="el-icon-s-home"></i>首页</template>
            </el-menu-item>
          </router-link>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-edit-outline"></i>资源录入</template>
            <el-menu-item index="1-1"><span style="color:	Gainsboro;">学习资源</span></el-menu-item>
            <router-link to="/inputMarked" :underline="false" @click.native="ToTop">
              <el-menu-item index="1-2">
                <span style="color: black;">试题资源</span>
              </el-menu-item>
            </router-link>
            <router-link to="/inputPaper" :underline="false" @click.native="ToTop">
              <el-menu-item index="1-3">
                <span style="color: black;">试卷资源</span>
              </el-menu-item>
            </router-link>
            <el-menu-item index="1-4"><span style="color:	Gainsboro;">知识体系</span></el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-search"></i>资源检索</template>
            <router-link to="/exercise" :underline="false" @click.native="ToTop">
              <el-menu-item index="2-1">
                <span style="color: black;">试题检索</span>
              </el-menu-item>
            </router-link>
            <router-link to="/ku" :underline="false" @click.native="ToTop">
              <el-menu-item index="2-2">
                <span style="color: black;">知识单元检索</span>
              </el-menu-item>
            </router-link>
            <el-menu-item index="2-3"><span style="color: Gainsboro;">学习资源</span></el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-pie-chart"></i>智能分析</template>
            <el-menu-item index="3-1"><span style="color: Gainsboro;">学习资源</span></el-menu-item>
            <el-menu-item index="3-2" @click="QuestionAnalyseSwitch()" @click.native="ToTop">
              <span style="color: black;">试题资源</span>
            </el-menu-item>
            <el-menu-item index="3-3" @click="PaperAnalyseSwitch()" @click.native="ToTop">
              <span style="color: black;">试卷资源</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-s-management"></i>资源管理</template>
            <el-menu-item index="4-1"><span style="color: Gainsboro;">学习资源</span></el-menu-item>
            <el-menu-item index="4-2" @click="QuestionAnalyseSwitch()" @click.native="ToTop">
              <span style="color: black;">试题资源</span>
            </el-menu-item>
            <el-menu-item index="4-3" @click="PaperAnalyseSwitch()" @click.native="ToTop">
              <span style="color: black;">试卷资源</span>
            </el-menu-item>
            <el-menu-item index="4-4">
              <span style="color: Gainsboro;">知识体系</span>
            </el-menu-item>
          </el-submenu>
          <router-link to="/user" :underline="false" @click.native="ToTop">
            <el-menu-item index="5">
              <template slot="title"><i class="el-icon-user"></i>用户管理</template>
            </el-menu-item>
          </router-link>
        </el-menu>
      </el-aside>

      <el-main style="background:#fff;margin:15px;border-radius:5px;">
        <!-- <router-view :key="$route.fullPath"></router-view> -->
        <statistics/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import statistics from '@/common/components/statistics.vue'
  export default {
    components:{statistics},
    data() {
      return {

      }
    },
    methods: {
      QAS(index){
        if(index == 0){
          this.$router.push({ path: "/QuestionAnalyseInput" });
          this.QuestionAnalyseSwitchFlag = false;
        }else{
          this.$router.push({ path: "/exercise" });
          this.QuestionAnalyseSwitchFlag = false;
        }
      },
      // 跳转至试题分析的不同位置的对话框
      QuestionAnalyseSwitch(){
        this.QuestionAnalyseSwitchFlag = true;
      },
      PAS(index){
        if(index == 0){
          this.$router.push({ path: "/paperAnalyseInput" });
          this.PaperAnalyseSwitchFlag = false;
        }else{
          alert("尚未完成");
        }
      },
      // 跳转至试卷分析的不同位置的对话框
      PaperAnalyseSwitch(){
        this.PaperAnalyseSwitchFlag = true;
      },
      Get_Priority(){
        if(sessionStorage.isAdmin){
          return true
        }else{
          return false
        }
      },
      Title_Pos(){
        return {
          "font-size": "18px",
          "color": "black",
          "margin-left": "0px"
        }
      },
      Calculate_Title_Margin(){
        var Width = window.screen.width;
        var CWidth = document.body.clientWidth;
        console.log(Width, CWidth)
        if(Width - CWidth < 300){
          return "0px"
        }else{
          return (0 - (CWidth/Width)*(CWidth/Width)*40) + "px";
        }
      },
      ToTop(){
        window.scrollTo(0,0);
      },
      TeMethod(){
        this.$router.push({ path: "/" });
        location.reload();
        window.scrollTo(0,0);
      },
      goToMainPage(){
        this.$router.push({ path: "/" });
        this.ToTop();
      },
      show_members(){
        this.$router.push({ path: "/members" });
        this.ToTop();
      },
      login_admin() {
        this.$router.push({ path: "/admin" });
        this.ToTop();
      },
      // 测试退出函数
      logout() {
        var _this = this;
        this.$confirm("确认退出吗？", "提示", {
          // type:'warning'
        })
          .then(() => {
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("isAdmin");
            sessionStorage.removeItem("accessToken");
            _this.$router.push("/");
          })
          .catch(() => {});
      },
    }
  };
</script>

<style lang="scss" scoped>

.el-header {
  background-color: #409EFF;
  background-color: rgb(238, 241, 246);
  color: #000;
  line-height: 70px;
}
.el-container{
  background-color: #f1f6fd;
}

.el-aside {
  color: #333;
}
.user-icon{
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: solid 1px #fff;
}
.user-setting-icon{
  line-height: 70px;
  vertical-align: middle;
  font-size: 24px;
  color:#ccc;
}
.user-info{
  width: 100%;
  height:100px;
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content: center;
  >div{
    display: flex;
    .user-icon{
      margin:auto;
      width: 67px;
      height: 67px;
    }
    >.info{
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .affiliation{
        color: #409EFF;
      }
    }
  }

}
</style>
