<template>
  <!--todo: polish the format-->
  <div style="min-width: 1366px; margin-top: -90px;">
    <div id="Top_Nav" class="Top_Nav">

    </div>
    <!-- 试卷分析路径跳转 -->
    <el-dialog :visible.sync="PaperAnalyseSwitchFlag" width="70%">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-button @click="PAS(0)" circle style="height: 200px; width: 200px;"><img src="../assets/icon4.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <el-button type="text" @click="PAS(0)" style="margin-top: 30px; font-size: 20px; color: black">
              录入试卷进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-button @click="PAS(1)" circle style="height: 200px; width: 200px"><img src="../assets/icon1.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <el-button type="text" @click="PAS(1)" style="margin-top: 30px; font-size: 20px; color: black">
              选择题库中试卷进行分析
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 试卷分析路径跳转 -->
    <el-dialog :visible.sync="QuestionAnalyseSwitchFlag" width="70%">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-button @click="QAS(0)" circle style="height: 200px; width: 200px;"><img src="../assets/icon4.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <el-button type="text" @click="QAS(0)" style="margin-top: 30px; font-size: 20px; color: black">
              录入试题进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-button @click="QAS(1)" circle style="height: 200px; width: 200px"><img src="../assets/icon1.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <el-button type="text" @click="QAS(1)" style="margin-top: 30px; font-size: 20px; color: black">
              搜索试题进行分析
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 功能 - 资源录入的统一接口 -->
    <el-dialog
      :visible.sync="functionStatus[0]"
      title="资源录入"
      width="65%"
      :close="CloseFunctions"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-row style="padding-top: 30px; background: white; padding-bottom: 30px">
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px;"><img src="../assets/icon7.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              学习资源
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button @click="Router_Trans('/inputMarked')"  circle style="height: 200px; width: 200px;"><img src="../assets/icon6.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <router-link to="/inputMarked" :underline="false" @click.native="ToTop">
              <label style="margin-top: 30px; font-size: 20px; color: black">
                试题资源
              </label>
            </router-link>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button @click="Router_Trans('/inputPaper')" circle style="height: 200px; width: 200px"><img src="../assets/icon8.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <router-link to="/inputPaper" :underline="false" @click.native="ToTop">
              <label style="margin-top: 30px; font-size: 20px; color: black">
                试卷资源
              </label>
            </router-link>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon5.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              知识体系
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 功能 - 查询的统一接口 -->
    <el-dialog
      :visible.sync="functionStatus[1]"
      title="查询"
      width="65%"
      :close="CloseFunctions"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-row style="padding-top: 30px; background: white; padding-bottom: 30px">
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px;"><img src="../assets/icon7.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              学习资源
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button @click="Router_Trans('/exercise')"  circle style="height: 200px; width: 200px"><img src="../assets/icon6.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <router-link to="/exercise" :underline="false" @click.native="ToTop">
              <label style="margin-top: 30px; font-size: 20px; color: black">
                试题资源
              </label>
            </router-link>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button @click="Router_Trans('/searchPaper')"  circle style="height: 200px; width: 200px"><img src="../assets/icon8.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <router-link to="/exercise" :underline="false" @click.native="ToTop">
              <label style="margin-top: 30px; font-size: 20px; color: black">
                试卷资源
              </label>
            </router-link>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button @click="Router_Trans('/ku')" circle style="height: 200px; width: 200px"><img src="../assets/icon5.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <router-link to="/ku" :underline="false" @click.native="ToTop">
              <label style="margin-top: 30px; font-size: 20px; color: black">
                知识体系
              </label>
            </router-link>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 功能 - 分析的统一接口 -->
    <el-dialog
      :visible.sync="functionStatus[2]"
      title="分析"
      width="65%"
      :close="CloseFunctions"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-row style="padding-top: 30px; background: white; padding-bottom: 30px">
        <el-col :span="6">
          <el-row>
            <el-button @click="QuestionAnalyseSwitch()" circle style="height: 200px; width: 200px;"><img src="../assets/icon6.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              试题资源
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button @click="PaperAnalyseSwitch()" circle style="height: 200px; width: 200px"><img src="../assets/icon8.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              试卷资源
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 功能 - 管理的统一接口 -->
    <el-dialog
      :visible.sync="functionStatus[3]"
      title="管理"
      width="65%"
      :close="CloseFunctions"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-row style="padding-top: 30px; background: white; padding-bottom: 30px">
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px;"><img src="../assets/icon7.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              学习资源
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon6.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              试题资源
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon8.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              试卷资源
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon5.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              知识体系
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 资源 - 学习资源的统一接口 -->
    <el-dialog
      :visible.sync="resourceStatus[0]"
      title="学习资源"
      width="65%"
      :close="CloseFunctions"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-row style="padding-top: 30px; background: white; padding-bottom: 30px">
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px;"><img src="../assets/icon4.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px">
              资源录入
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px;"><img src="../assets/icon3.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              查询
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon2.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              管理
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 资源 - 试题资源的统一接口 -->
    <el-dialog
      :visible.sync="resourceStatus[1]"
      title="试题资源"
      width="65%"
      :close="CloseFunctions"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-row style="padding-top: 30px; background: white; padding-bottom: 30px">
        <el-col :span="6">
          <el-row>
            <el-button @click="Router_Trans('/inputMarked')" circle style="height: 200px; width: 200px;"><img src="../assets/icon4.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <router-link to="/inputMarked" :underline="false" @click.native="ToTop">
              <label style="margin-top: 30px; font-size: 20px; color: black">
                资源录入
              </label>
            </router-link>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button @click="Router_Trans('/exercise')" circle style="height: 200px; width: 200px"><img src="../assets/icon3.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <router-link to="/exercise" :underline="false" @click.native="ToTop">
              <label style="margin-top: 30px; font-size: 20px; color: black">
                查询
              </label>
            </router-link>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon2.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              管理
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button @click="QuestionAnalyseSwitch()" circle style="height: 200px; width: 200px"><img src="../assets/icon1.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              分析
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 资源 - 试卷资源的统一接口 -->
    <el-dialog
      :visible.sync="resourceStatus[2]"
      title="试卷资源"
      width="65%"
      :close="CloseFunctions"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-row style="padding-top: 30px; background: white; padding-bottom: 30px">
        <el-col :span="6">
          <el-row>
            <el-button @click="Router_Trans('/inputPaper')" circle style="height: 200px; width: 200px;"><img src="../assets/icon4.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <router-link to="/inputPaper" :underline="false" @click.native="ToTop">
              <label style="margin-top: 30px; font-size: 20px; color: black">
                试卷录入
              </label>
            </router-link>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button @click="Router_Trans('/searchPaper')" circle style="height: 200px; width: 200px"><img src="../assets/icon3.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <router-link to="/searchPaper" :underline="false" @click.native="ToTop">
              <label style="margin-top: 30px; font-size: 20px; color: black">
                查询
              </label>
            </router-link>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon2.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              管理
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button @click="PaperAnalyseSwitch()" circle style="height: 200px; width: 200px"><img src="../assets/icon1.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              分析
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 资源 - 知识体系的统一接口 -->
    <el-dialog
      :visible.sync="resourceStatus[3]"
      title="知识体系"
      width="65%"
      :close="CloseFunctions"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-row style="padding-top: 30px; background: white; padding-bottom: 30px">
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px;"><img src="../assets/icon4.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              资源录入
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button @click="Router_Trans('/ku')" circle style="height: 200px; width: 200px"><img src="../assets/icon3.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <router-link to="/ku" :underline="false" @click.native="ToTop">
              <label style="margin-top: 30px; font-size: 20px; color: black">
                查询
              </label>
            </router-link>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon2.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <label style="margin-top: 30px; font-size: 20px; color: black">
              管理
            </label>
          </el-row>
          <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
            <span>介绍文字</span>
          </el-row> -->
        </el-col>
      </el-row>
    </el-dialog>
    <div class="Normal_Home_Page">
      <section class="main_page" >
        <el-row type="flex" justify="center">
          <div style="display: inline-block">
            <img src="@/assets/Luna_Home_Page_Icon.svg">
          </div>
          <div style="display: inline-block; padding-top: 10px">
            <span class="Temp_Label">L U N A</span><br>
            <label style="font-size: 24px">智慧教育知识图谱</label>
          </div>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 174px;">
          <div class="Self_Input_Area_Left" align="left">
            <i class="el-icon-search" style="font-size: 30px; display: inline-block; margin-top: 18px; margin-right: 30px; margin-left: 20px;"></i>
          </div>
          <div class="Self_Input_Area_Middle" align="left">
            <input 
              v-model="ku_name" 
              class="Self_Input" 
              placeholder="在此输入知识点名称">
          </div>
          <div class="Self_Input_Area_Right" align="right">
            <button 
              class="Self_Search_Button"
              @click="submit">搜索</button>
          </div>
        </el-row>
      </section>

      <!-- about-area -->
      <section class="about-area">
        <div class="about_triangle">
          <div style="padding-top: 200px;">
            <label style="font-size: 48px;">寓智于教，致知未来</label>
          </div>
          <div style="width: 760px; margin: 0 auto; margin-top: 40px;">
            <span style="font-size: 20px; letter-spacing: break-all">
              智慧教育知识图谱（LUNA）致力于为广大师生提供深层次、多维度的海量教育资源处理分析工具，与智能、个性化的教育资源组织、分析与评估服务
            </span>
          </div>
        </div>
      </section>

      <!-- 图标区域-area -->
      <section class="statistics_area">
        <el-row style="width: 1280px; margin: 0 auto">
          <el-col :span="13">
            <statistics/>
          </el-col>
          <el-col :span="11" class="Part_Right">
            <div class="statistics_Title" align="left">
              <span class="statistics_Colored_Title_1">海量</span>教学资源，<span class="statistics_Colored_Title_2">智能</span>处理
            </div>
            <div>
              <ul style="text-align: left" class="statistics_List">
                <li style="margin-bottom: 16px;">
                  海量标准化、体系化的教学资源
                </li>
                <li style="margin-bottom: 16px;">
                  基于高效准确的试题相似度评估算法的高质量资源库
                </li>
                <li style="margin-bottom: 40px;">
                  智能与个性化的资源录入、查询和管理服务
                </li>
              </ul>
            </div>
            <div align="left">
              <button class="statistics_Self_Button statistics_Button_Color1">
                <i class="el-icon-edit" style="margin-right: 10px"></i>试题录入
              </button>
              <button class="statistics_Self_Button statistics_Button_Color2">
                <i class="el-icon-search" style="margin-right: 10px"></i>试题检索
              </button>
              <button class="statistics_Self_Button statistics_Button_Color3">
                <i class="el-icon-reading" style="margin-right: 10px"></i>试题分析
              </button>
            </div>
          </el-col>
        </el-row>
      </section>

      <section class="link-bg">
        <!-- 试题检索卡片跳转 -->
        <el-row class="Label_Line">
          <div class="Divider_Line" style="margin-right: 1.5rem">

          </div>
          <span class="Inner_Text">
            资源与功能
          </span>
          <div class="Divider_Line">
          
          </div>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-row type="flex" justify="center" style="padding-bottom: 50px">
              <el-button-group>
                <el-button round @click="changeToolsLabel(0)" ref="resourceButton" :class="Get_TL_Style(0)">
                  资源
                </el-button>
                <el-button round @click="changeToolsLabel(1)" ref="functionButton" :class="Get_TL_Style(1)">
                  功能
                </el-button>
              </el-button-group>
            </el-row>
            <el-row v-if="ToolsLabelNow == '资源'" style="padding-top: 30px; padding-bottom: 30px">
              <el-col :span="6">
                <el-row>
                  <el-button @click="OpenResources(0)" circle style="height: 200px; width: 200px;"><img src="../assets/icon7.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label @click="OpenResources(0)" style="margin-top: 30px; font-size: 20px">
                    学习资源
                  </label>
                </el-row>
                <!-- <el-row  style="margin-top: 15px; font-size: 10px">
                  <span>介绍文字</span>
                </el-row> -->
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button @click="OpenResources(1)" circle style="height: 200px; width: 200px"><img src="../assets/icon6.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label @click="OpenResources(1)" style="margin-top: 30px; font-size: 20px; color: black">
                    试题资源
                  </label>
                </el-row>
                <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row> -->
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button @click="OpenResources(2)" circle style="height: 200px; width: 200px"><img src="../assets/icon8.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label @click="OpenResources(2)" style="margin-top: 30px; font-size: 20px; color: black">
                    试卷资源
                  </label>
                </el-row>
                <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row> -->
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button @click="OpenResources(3)" circle style="height: 200px; width: 200px"><img src="../assets/icon5.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label @click="OpenResources(3)" style="margin-top: 30px; font-size: 20px">
                    知识体系
                  </label>
                </el-row>
                <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row> -->
              </el-col>
            </el-row>
            <!-- 第二段 -->
            <el-row v-else-if="ToolsLabelNow == '功能'"  style="padding-top: 30px; padding-bottom: 30px">
              <el-col :span="6">
                <el-row>
                  <el-button @click="OpenFunctions(0)" circle style="height: 200px; width: 200px;"><img src="../assets/icon4.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label @click="OpenFunctions(0)" style="margin-top: 30px; font-size: 20px">
                    资源录入
                  </label>
                </el-row>
                <!-- <el-row  style="margin-top: 15px; font-size: 10px">
                  <span>介绍文字</span>
                </el-row> -->
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button @click="OpenFunctions(1)" circle style="height: 200px; width: 200px"><img src="../assets/icon3.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label @click="OpenFunctions(1)" style="margin-top: 30px; font-size: 20px">
                    查询
                  </label>
                </el-row>
                <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row> -->
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button @click="OpenFunctions(3)" circle style="height: 200px; width: 200px"><img src="../assets/icon2.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label @click="OpenFunctions(3)" style="margin-top: 30px; font-size: 20px">
                    管理
                  </label>
                </el-row>
                <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row> -->
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button @click="OpenFunctions(2)" circle style="height: 200px; width: 200px"><img src="../assets/icon1.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label @click="OpenFunctions(2)" style="margin-top: 30px; font-size: 20px">
                    分析
                  </label>
                </el-row>
                <!-- <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row> -->
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </section>

      
      <!-- cta-area-end -->
    </div>
    
  </div>
</template>
<script>

import $ from "jquery";
import statistics from '@/common/components/statistics_2'

export default {
  components: { statistics},
  name: "Home",
  data() {
    return {
      ku_name: "三角函数",
      image_infos: [],
      ToolsLabelNow: "资源",
      functionStatus: [false, false, false, false],
      resourceStatus: [false, false, false, false],
      Num_Paper: 0,
      Num_Question: 0,
      Num_KU: 0,
      Paper_Data: [],
      Question_Data: [],
      KU_Data: [],
      Chart_Data: {},
      PaperAnalyseSwitchFlag: false,
      QuestionAnalyseSwitchFlag: false,
      Count_Type: "Question"
    };
  },
  mounted() {
    // this.Init_Bar();
    // data - background
    $("[data-background]").each(function() {
      $(this).css(
        "background-image",
        "url(" + $(this).attr("data-background") + ")"
      );
    });
    this.To_Top();
    document.body.scrollTo(0, 500)
  },
  methods: {
    To_Top(){
          document.getElementById("Top_Nav").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
      },
    // 调整首页统计表格的内容
    changeCountButton(type){
      this.Count_Type = type;
      this.Redraw_Bar();
    },
    // Get_Count_Style(type){
    //   if(type == this.Count_Type){
    //     return "resourceButton"
    //   }else{
    //     return "sleepingButton"
    //   }
    // },
    // 获取首页统计表格的按钮的样式
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
        this.$router.push({ path: "/searchPaper" });
        this.PaperAnalyseSwitchFlag = false;
      }
    },
    // 跳转至试卷分析的不同位置的对话框
    PaperAnalyseSwitch(){
      this.PaperAnalyseSwitchFlag = true;
    },
    ToTop(){
      window.scrollTo(0,0);
    },
    submit() {
      this.$router.push({
        name: "visitor/Knowledge Unit",
        params: { name: this.ku_name, knowledgeSystem: "neea" }
      });
    },
    CloseFunctions(){
      this.functionStatus = [false, false, false, false]
      this.resourceStatus = [false, false, false, false]
    },
    Get_TL_Style(param){
      if(param == 0 && this.ToolsLabelNow == '资源'){
        return "resourceButton"
      }else if(param == 1 && this.ToolsLabelNow == '功能'){
        return "resourceButton"
      }else if(param == 1 && this.ToolsLabelNow == '资源'){
        return "sleepingButton"
      }else if(param == 0 && this.ToolsLabelNow == '功能'){
        return "sleepingButton"
      }
    },
    changeToolsLabel(param){
      if(param == 0){
        this.ToolsLabelNow = '资源';
      }else if(param == 1){
        this.ToolsLabelNow = '功能';
      }
    },
    Router_Trans(route){
      this.$router.push({ path: route });
    },
    OpenFunctions(index){
      this.functionStatus.splice(index, 1, true);
    },
    OpenResources(index){
      this.resourceStatus.splice(index, 1, true);
    },
  }
};
</script>
<style scoped>
/* 手搓水平分割线 */
.Divider_Line{
  height: 30px;
  margin-top: 29px;
  display: inline-block;
  width:calc((100%-400px)/2);
  max-width: 250px;
  border-top: 4px solid #dcdfe6;
}
/* 分割线中间的文字 */
.Inner_Text{
  display: inline-block;
  letter-spacing: 1vw; 
  width: 400px;
  font-size: 40px;
  margin-top: 0px;
  padding-top: 0px;
  height: 60px;
  line-height: 60px;
  vertical-align: top;
}
/* 区块行 */
.Label_Line{
  width: 1344px; 
  align: center;
  margin: 30px auto 30px auto; 
  height: 60px;
}
.link-bg {
  padding-top: 30px;
  background: #EEF5FE;
  background-size: 100%;
  position: relative;
  min-height: 700px;
  background-position: center;
  background-size: cover;
  z-index: 1;
}
.main_page {
  background: linear-gradient(to top right, #D5F2F4, #ABC5F3);
  height: 620px;
  padding-top: 240px;
}
.main_page::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
}
.sticky-menu {
  left: 0;
  margin: auto;
  position: absolute;
  top: 0;
  width: 100%;
  box-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.07);
  z-index: 9999;
  background: #fff;
  -webkit-animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
  animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
  -webkit-box-shadow: 0 10px 15px rgba(25, 25, 25, 0.1);
}
.slider-content h2 {
  font-size: 48px;
  color: #fff;
  display: inline-block;
  text-align: center;
  text-align-last: center;
}

.slider-content p {
  font-size: 30px;
  color: #fff;
  margin-top: 10px;
}
/* 5. about */
.about-area {
  height: 532px;
  background: #FAFAFC;
  margin-top: -32px;
}

.about_triangle{
  background: url("../assets/Triangle_1440.svg");
  background-repeat: no-repeat;
  background-size: auto;
  height: 100%;
  width: 1440px;
  margin: 0px auto;
}

.about-content h2 {
  font-size: 40px;
  line-height: 1.3;
  margin-bottom: 22px;
  font-family: "Helvetica";
}
.section-title h2 {
  color: #1a2930;
}
.about-content h2 span {
  color: #1a2930;
}
.about-content p {
  margin-bottom: 30px;
  padding-right: 20px;
}
.about-content p:last-child {
  margin-bottom: 0;
  padding-right: 0;
}
.cta-area {
  padding-top: 150px;
  padding-bottom: 150px;
}
.about-image {
  margin-left: -130px;
}
.search-area {
  padding-top: 100px;
}

.statistics_area{
  height: 1000px;
  background: #FAFAFC;
}
/* }
.link-card {
  height: 360px;
  overflow: inherit;
  background-color: #1a2930;
  color: #fff;
} */
.card_title {
  font-weight: 900;
  font-size: 17px;
  color: #eeffbb;
}
a {
  text-decoration: none;
}
.router-link-active {
  text-decoration: none;
}
.el-divider__text{
  position:absolute;
  background-color: rgba(0,0,0,0);
  padding:0 20px;
  font-weight:500;
  color:#303133;
  font-size:14px
}
.el-divider--horizontal{
  display:block;
  height:4px;
  width:100%;
  margin:24px 0
}
.resourceButton{
  background: #48a6f3;
  color: white;
}
.el-button:focus{
  background: #48a6f3;
  color: white;
}
.el-button:active{
  background: #48a6f3;
  color: white;
}
.el-button:hover{
  background: #98caf3;
  color: white;
}
.sleepingButton{
  background: #F8FBFF;
  color: rgb(122, 122, 122);
}
.SearchInput ::v-deep .el-input__inner{
  border: none;
  border-radius: 0px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  height: 40px;
}
.SearchButton{
  border: none;
  border-radius: 0px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  border-left: 1px solid #F8FBFF;
  height: 40px;
}
/* .partData{
  height: 120px;
  background: #EEF5FE;
  box-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.07);
  -webkit-box-shadow: 0 10px 15px rgba(25, 25, 25, 0.1);
  border-radius: 10px;
}
.data_chart{
   border-radius: 10px;
   width: 67%;
   height:300px;
   padding-top: 20px;
   margin-left: 16.5%;
   border: 3px solid #EEF5FE;
   margin-bottom: 40px;
} */

.Top_Nav{
    position: relative;
    top: -90px;
    width: 10px;
    height: 10px;
    background: transparent;
}

.Temp_Label{
  font-size: 48px;
}

.Self_Input{
  border: none;
  outline: none;
  height: 64px;
  width: 420px;
  font-size: 20px;
  display: inline-block;
}

.Self_Search_Button{
  width: 100%;
  height: 64px;
  margin: 0px;
  background: linear-gradient(to right, #7BAFEE, #7786EB);
  color: white;
  font-size: 20px;
  border: 3px solid white;
  border-radius: 32px;
}

.Self_Search_Button:active{
  transform: scale(0.95) 300ms;
}

.Self_Input_Area_Left{
  height: 64px;
  width: 50px;
  background: white;
  border-radius: 32px 0px 0px 32px;
}

.Self_Input_Area_Middle{
  height: 64px;
  width: 440px;
  background: white;
  padding-left: 10px;
  vertical-align: top;
}

.Self_Input_Area_Right{
  height: 64px;
  width: 128px;
  background: white;
  border-radius: 0px 32px 32px 0px;
}

.Part_Right{
  height: 1000px;
  width: 580px;
  padding-top: 320px;
  padding-left: 60px;
}

.statistics_Title{
  width: 100%;
  font-size: 36px;
  font-weight: bold;
  line-height: 36px;
  letter-spacing: 0.05em;
}

.statistics_Colored_Title_1{
  background-image: linear-gradient(to right, #FF4848, #F0BC2D);
  -webkit-background-clip: text;
  color: transparent;
}

.statistics_Colored_Title_2{
  background-image: linear-gradient(to right, #4CC1F7, #1A52EE);
  -webkit-background-clip: text;
  color: transparent;
}

.statistics_List{
  font-size: 20px;
  line-height: 32px;
  color: #787878;
  margin-left: -20px;
  margin-top: 40px;
}

.statistics_Self_Button{
  border: none;
  display: inline-block;
  color: white;
  width: 137px;
  height: 52px;
  padding: 6px auto;
  border-radius: 10px;
  margin-right: 16px;
  font-size: 18px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.05em;
}

.statistics_Button_Color1{
  background: linear-gradient(to right, #D46A6A, #D45959);
}

.statistics_Button_Color2{
  background: linear-gradient(to right, #6A91D4, #5986D4);
}

.statistics_Button_Color3{
  background: linear-gradient(to right, #766AD4, #6759D4);
}

@media screen and (max-width: 1024px) {
  .Normal_Home_Page{
    display: none
  }
}

@media screen and (min-width: 1025px) {
  .Narrow_Home_Page{
    display: none
  }
}

</style>
