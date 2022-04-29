<template>
  <!--todo: polish the format-->
  <div style="margin-top: -90px;">
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
      <section class="main_area" >
        <el-row type="flex" justify="center">
          <div style="display: inline-block">
            <img src="@/assets/Luna_Home_Page_Icon.svg">
          </div>
          <div style="display: inline-block; padding-top: 10px">
            <span class="Temp_Label">L U N A</span><br>
            <label style="font-size: 24px; filter: drop-shadow(1px 4px 4px rgba(0, 0, 0, 0.12));">智慧教育知识图谱</label>
          </div>
        </el-row>
        <div justify="center" class="Search_Area">
          <div class="Self_Input_Area_Left" align="left">
            <i class="el-icon-search" style="font-size: 30px; margin-top: 18px; margin-right: 30px; margin-left: 20px;"></i>
          </div>
          <div class="Self_Input_Area_Middle" align="left">
            <input 
              v-model="ku_name" 
              class="Self_Input" 
              placeholder="在此输入知识点名称"
              @keyup.enter="submit(ku_name)">
          </div>
          <div class="Self_Input_Area_Right" align="right">
            <button 
              class="Self_Search_Button"
              @click="submit(ku_name)">搜索</button>
          </div>
        </div>
      </section>

      <!-- about-area -->
      <section class="about-area">
        <div style="padding-top: 200px;">
          <label style="font-size: 48px;">寓智于教，致知未来</label>
        </div>
        <div style="width: 760px; margin: 0 auto; margin-top: 40px;">
          <span style="font-size: 20px; letter-spacing: break-all">
            智慧教育知识图谱（LUNA）致力于为广大师生提供深层次、多维度的海量教育资源处理分析工具，与智能、个性化的教育资源组织、分析与评估服务
          </span>
        </div>
      </section>

      <!-- 图标区域-area -->
      <section class="statistics_area">
        <div class="Normal_Normal">
          <el-row style="width: 1280px; margin: 0 auto">
            <el-col :span="13">
              <statistics
                @Part_Change_Type="Part_Change_Type" id="Normal_Chart"/>
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
                <button 
                  class="statistics_Self_Button statistics_Button_Color1" 
                  v-show="Count_Part_Status == 'Question' || Count_Part_Status == 'Paper'"
                  @click="Resource_Input()">
                  <i class="el-icon-edit" style="margin-right: 2px"></i><span style="cursor: pointer">
                  {{Count_Part_Status == "Question" ? "试题" : "试卷" }}录入</span>
                </button>
                <button 
                  class="statistics_Self_Button statistics_Button_Color2"
                  @click="Resource_Search()"
                  :style="Count_Part_Status == 'KU' || Count_Part_Status == 'Resources' ? 'width: 180px' : ''">
                  <i class="el-icon-search" style="margin-right: 2px"></i><span style="cursor: pointer">
                  {{Count_Part_Status == "Question" ? "试题" : 
                    Count_Part_Status == "Paper" ? "试卷" : 
                    Count_Part_Status == "KU" ? "知识单元" : "教材教辅"}}检索</span>
                </button>
                <button 
                  class="statistics_Self_Button statistics_Button_Color3" 
                  v-show="Count_Part_Status == 'Question' || Count_Part_Status == 'Paper'"
                  @click="Resource_Analysis()">
                  <i class="el-icon-reading" style="margin-right: 2px"></i><span style="cursor: pointer">
                  {{Count_Part_Status == "Question" ? "试题" : "试卷" }}分析</span>
                </button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="Normal_Narrow">
          <el-row style="width: 768px; margin: 0 auto; padding-top: 160px;">
            <div align="center">
              <div class="statistics_Title">
                <span class="statistics_Colored_Title_1">海量</span>教学资源，<span class="statistics_Colored_Title_2">智能</span>处理
              </div>
              <div>
                <ul class="statistics_List">
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
              <div align="center">
                <button 
                  class="statistics_Self_Button statistics_Button_Color1" 
                  v-show="Count_Part_Status == 'Question' || Count_Part_Status == 'Paper'"
                  @click="Resource_Input()">
                  <i class="el-icon-edit" style="margin-right: 2px"></i><span style="cursor: pointer">
                  {{Count_Part_Status == "Question" ? "试题" : "试卷" }}录入</span>
                </button>
                <button 
                  class="statistics_Self_Button statistics_Button_Color2"
                  @click="Resource_Search()"
                  :style="Count_Part_Status == 'KU' || Count_Part_Status == 'Resources' ? 'width: 180px' : ''">
                  <i class="el-icon-search" style="margin-right: 2px"></i><span style="cursor: pointer">
                  {{Count_Part_Status == "Question" ? "试题" : 
                    Count_Part_Status == "Paper" ? "试卷" : 
                    Count_Part_Status == "KU" ? "知识单元" : "教材教辅"}}检索</span>
                </button>
                <button 
                  class="statistics_Self_Button statistics_Button_Color3" 
                  v-show="Count_Part_Status == 'Question' || Count_Part_Status == 'Paper'"
                  @click="Resource_Analysis()">
                  <i class="el-icon-reading" style="margin-right: 2px"></i><span style="cursor: pointer">
                  {{Count_Part_Status == "Question" ? "试题" : "试卷" }}分析</span>
                </button>
              </div>
            </div>
            <statistics2 
                @Part_Change_Type="Part_Change_Type" id="Narrow_Chart" style="margin-top: -80px;"/>
          </el-row>
        </div>
      </section>

      <!-- 图标区域-area -->
      <section class="ku_area">
        <div class="Normal_Normal">
          <el-row style="width: 1280px; margin: 0 auto">
            <el-col :span="13" class="Part_Right">
              <div class="statistics_Title" align="left">
                <span class="KU_Colored_Title_1">多元</span>知识点，<span class="KU_Colored_Title_2">直观</span>呈现
              </div>
              <div>
                <ul style="text-align: left" class="statistics_List">
                  <li style="margin-bottom: 16px;">
                    知识点智能化组织与展示
                  </li>
                  <li style="margin-bottom: 16px;">
                    结构清晰，辅助学生梳理知识
                  </li>
                  <li style="margin-bottom: 40px;">
                    前驱后继、共同学习和层级关系三种知识关系展示
                  </li>
                </ul>
              </div>
              <div align="left">
                <button 
                  class="statistics_Self_Button KU_Button_Color1"
                  @click="Router_Trans('\KU')">
                  <i class="el-icon-edit" style="margin-right: 2px"></i><span style="cursor: pointer">
                  立即前往</span>
                </button>
              </div>
            </el-col>
            <el-col :span="11">
              <div class="Ku_Part_Right" align="left">
                <img src="@/assets/Home_Page_Ku.png" class="Ku_Image" @click="submit('三角函数')">
                <label class="Ku_Title">
                  三角函数
                </label><br>
                <span class="Ku_Description">三角函数是基本初等函数之一，是以角度（数学上最常用弧度制，下同）为自变量，角度对应任意角终边与单位圆交点坐标或其比值为因变量的函数...</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="Normal_Narrow">
          <el-row style="width: 768px; margin: 0 auto;">
            <div align="center">
              <div class="statistics_Title" style="margin-top: 200px;">
                <span class="KU_Colored_Title_1">多元</span>知识点，<span class="KU_Colored_Title_2">直观</span>呈现
              </div>
              <div>
                <ul class="statistics_List">
                  <li style="margin-bottom: 16px;">
                    知识点智能化组织与展示
                  </li>
                  <li style="margin-bottom: 16px;">
                    结构清晰，辅助学生梳理知识
                  </li>
                  <li style="margin-bottom: 40px;">
                    前驱后继、共同学习和层级关系三种知识关系展示
                  </li>
                </ul>
              </div>
              <div>
                <button 
                  class="statistics_Self_Button KU_Button_Color1"
                  @click="Router_Trans('\KU')">
                  <i class="el-icon-edit" style="margin-right: 2px"></i><span style="cursor: pointer">
                  立即前往</span>
                </button>
              </div>
              <div class="Ku_Part_Right" align="left">
                <img src="@/assets/Home_Page_Ku.png" class="Ku_Image" @click="submit('三角函数')">
                <label class="Ku_Title">
                  三角函数
                </label><br>
                <span class="Ku_Description">三角函数是基本初等函数之一，是以角度（数学上最常用弧度制，下同）为自变量，角度对应任意角终边与单位圆交点坐标或其比值为因变量的函数...</span>
              </div>
            </div>
          </el-row>
        </div>
        
      </section>

      <section class="link-area">
        <div class="Normal_Normal">
          <el-row style="width: 1280px; margin: 0 auto">
            <div class="statistics_Title" align="left">
              <span class="Func_Colored_Title_1">特色</span>教育功能，<span class="Func_Colored_Title_2">倾力</span>打造
            </div>
          </el-row>
          <el-row style="min-width: 1366px; margin: 0 auto" type="flex" justify="center">
            <div class="Func_Card" align="left">
              <div class="Func_Card_1_Img Func_Card_Img" @click="Resource_Analysis('Paper')">

              </div>
              <label class="Func_Card_Label" @click="Resource_Analysis('Paper')">试卷分析</label>
              <br>
              <div class="Func_Card_Span">使用人工智能和数据挖掘技术在多个层次和维度上分析试卷，如各题型占比、知识点分值和难度变化</div>
              <br>
              <div class="Func_Card_Text_Button" @click="Resource_Analysis('Paper')">了解更多<i class="el-icon-right" style="margin-left: 4px"></i></div>
            </div>
            <div class="Func_Card" align="left">
              <div class="Func_Card_2_Img Func_Card_Img" @click="Router_Trans('/paperCombine')">

              </div>
              <label class="Func_Card_Label" @click="Router_Trans('/paperCombine')">组卷系统</label>
              <br>
              <div class="Func_Card_Span">智能组卷系统提供丰富的选题方式，自动组卷，以及个性化试卷和答题卡编辑、预览与下载功能</div>
              <br>
              <div class="Func_Card_Text_Button" @click="Router_Trans('/paperCombine')">了解更多<i class="el-icon-right" style="margin-left: 4px"></i></div>
            </div>
            <div class="Func_Card" align="left">
              <div class="Func_Card_3_Img Func_Card_Img" @click="Router_Trans('/PublicPlatform')">

              </div>
              <label class="Func_Card_Label" @click="Router_Trans('/PublicPlatform')">AI实验室</label>
              <br>
              <div class="Func_Card_Span">由LUNA团队提供和维护，依托领先的技术实力，为用户提供高品质的教育产品及服务</div>
              <br>
              <div class="Func_Card_Text_Button" @click="Router_Trans('/PublicPlatform')">立即前往<i class="el-icon-right" style="margin-left: 4px"></i></div>
            </div>
            <div class="Func_Card" align="left">
              <div class="Func_Card_4_Img Func_Card_Img" @click="Router_Trans('/Resources')">

              </div>
              <label class="Func_Card_Label" @click="Router_Trans('/Resources')">智能教辅平台</label>
              <br>
              <div class="Func_Card_Span">深层次多维度海量教育资源分析，个性化资源管理、组织功能，为教师提供智能化教学服务</div>
              <br>
              <div class="Func_Card_Text_Button" @click="Router_Trans('/Resources')">立即前往<i class="el-icon-right" style="margin-left: 4px"></i></div>
            </div>
          </el-row>
        </div>
        <div class="Normal_Narrow">
          <el-row style="width: 768px; margin: 0 auto" align="center">
            <div class="statistics_Title" align="left">
              <span class="Func_Colored_Title_1">特色</span>教育功能，<span class="Func_Colored_Title_2">倾力</span>打造
            </div>
          </el-row>
          <el-row style="width: 780px; margin: 0 auto" type="flex" justify="center">
            <div class="Func_Card" align="left">
              <div class="Func_Card_1_Img Func_Card_Img" @click="Resource_Analysis('Paper')">

              </div>
              <label class="Func_Card_Label" @click="Resource_Analysis('Paper')">试卷分析</label>
              <br>
              <div class="Func_Card_Span">使用人工智能和数据挖掘技术在多个层次和维度上分析试卷，如各题型占比、知识点分值和难度变化</div>
              <br>
              <div class="Func_Card_Text_Button" @click="Resource_Analysis('Paper')">了解更多<i class="el-icon-right" style="margin-left: 4px"></i></div>
            </div>
            <div class="Func_Card" align="left">
              <div class="Func_Card_2_Img Func_Card_Img" @click="Router_Trans('/paperCombine')">

              </div>
              <label class="Func_Card_Label" @click="Router_Trans('/paperCombine')">组卷系统</label>
              <br>
              <div class="Func_Card_Span">智能组卷系统提供丰富的选题方式，自动组卷，以及个性化试卷和答题卡编辑、预览与下载功能</div>
              <br>
              <div class="Func_Card_Text_Button" @click="Router_Trans('/paperCombine')">了解更多<i class="el-icon-right" style="margin-left: 4px"></i></div>
            </div>
          </el-row>
          <el-row style="width: 780px; margin: 0 auto" type="flex" justify="center">
            <div class="Func_Card" align="left">
              <div class="Func_Card_3_Img Func_Card_Img" @click="Router_Trans('/PublicPlatform')">

              </div>
              <label class="Func_Card_Label" @click="Router_Trans('/PublicPlatform')">AI实验室</label>
              <br>
              <div class="Func_Card_Span">由LUNA团队提供和维护，依托领先的技术实力，为用户提供高品质的教育产品及服务</div>
              <br>
              <div class="Func_Card_Text_Button" @click="Router_Trans('/PublicPlatform')">立即前往<i class="el-icon-right" style="margin-left: 4px"></i></div>
            </div>
            <div class="Func_Card" align="left">
              <div class="Func_Card_4_Img Func_Card_Img" @click="Router_Trans('/Resources')">

              </div>
              <label class="Func_Card_Label" @click="Router_Trans('/Resources')">智能教辅平台</label>
              <br>
              <div class="Func_Card_Span">深层次多维度海量教育资源分析，个性化资源管理、组织功能，为教师提供智能化教学服务</div>
              <br>
              <div class="Func_Card_Text_Button" @click="Router_Trans('/Resources')">立即前往<i class="el-icon-right" style="margin-left: 4px"></i></div>
            </div>
          </el-row>
        </div>
      </section>
      <!-- cta-area-end -->
    </div>
    <div class="Narrow_Home_Page">
      <section class="main_area" >
        <el-row type="flex" justify="center">
          <div style="display: inline-block">
            <img src="@/assets/Luna_Home_Page_Icon.svg">
          </div>
          <div style="display: inline-block; padding-top: 10px">
            <span class="Temp_Label">L U N A</span><br>
            <label style="font-size: 24px; filter: drop-shadow(1px 4px 4px rgba(0, 0, 0, 0.12));">智慧教育知识图谱</label>
          </div>
        </el-row>
        <div justify="center" class="Search_Area">
          <div class="Self_Input_Area_Left" align="left">
            <i class="el-icon-search" style="font-size: 30px; margin-top: 18px; margin-right: 30px; margin-left: 20px;"></i>
          </div>
          <div class="Self_Input_Area_Middle" align="left">
            <input 
              v-model="ku_name" 
              class="Self_Input" 
              placeholder="在此输入知识点名称"
              @keyup.enter="submit(ku_name)">
          </div>
          <div class="Self_Input_Area_Right" align="right">
            <button 
              class="Self_Search_Button"
              @click="submit(ku_name)">搜索</button>
          </div>
        </div>
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
        <el-row style="width: 768px; margin: 0 auto; padding-top: 160px;">
          <div align="center">
            <div class="statistics_Title">
              <span class="statistics_Colored_Title_1">海量</span>教学资源，<span class="statistics_Colored_Title_2">智能</span>处理
            </div>
            <div>
              <ul class="statistics_List">
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
            <div align="center">
              <button 
                class="statistics_Self_Button statistics_Button_Color1" 
                v-show="Count_Part_Status == 'Question' || Count_Part_Status == 'Paper'"
                @click="Resource_Input()">
                <i class="el-icon-edit" style="margin-right: 2px"></i><span style="cursor: pointer">
                {{Count_Part_Status == "Question" ? "试题" : "试卷" }}录入</span>
              </button>
              <button 
                class="statistics_Self_Button statistics_Button_Color2"
                @click="Resource_Search()"
                :style="Count_Part_Status == 'KU' || Count_Part_Status == 'Resources' ? 'width: 180px' : ''">
                <i class="el-icon-search" style="margin-right: 2px"></i><span style="cursor: pointer">
                {{Count_Part_Status == "Question" ? "试题" : 
                  Count_Part_Status == "Paper" ? "试卷" : 
                  Count_Part_Status == "KU" ? "知识单元" : "教材教辅"}}检索</span>
              </button>
              <button 
                class="statistics_Self_Button statistics_Button_Color3" 
                v-show="Count_Part_Status == 'Question' || Count_Part_Status == 'Paper'"
                @click="Resource_Analysis()">
                <i class="el-icon-reading" style="margin-right: 2px"></i><span style="cursor: pointer">
                {{Count_Part_Status == "Question" ? "试题" : "试卷" }}分析</span>
              </button>
            </div>
          </div>
          <statistics3 
                @Part_Change_Type="Part_Change_Type" id="Narrow_Chart" style="margin-top: -80px;"/>
        </el-row>
      </section>

      <!-- 图标区域-area -->
      <section class="ku_area">
        <el-row style="width: 768px; margin: 0 auto;">
          <div align="center">
            <div class="statistics_Title" style="margin-top: 200px;">
              <span class="KU_Colored_Title_1">多元</span>知识点，<span class="KU_Colored_Title_2">直观</span>呈现
            </div>
            <div>
              <ul class="statistics_List">
                <li style="margin-bottom: 16px;">
                  知识点智能化组织与展示
                </li>
                <li style="margin-bottom: 16px;">
                  结构清晰，辅助学生梳理知识
                </li>
                <li style="margin-bottom: 40px;">
                  前驱后继、共同学习和层级关系三种知识关系展示
                </li>
              </ul>
            </div>
            <div>
              <button 
                class="statistics_Self_Button KU_Button_Color1"
                @click="Router_Trans('\KU')">
                <i class="el-icon-edit" style="margin-right: 2px"></i><span style="cursor: pointer">
                立即前往</span>
              </button>
            </div>
            <div class="Ku_Part_Right" align="left">
              <img src="@/assets/Home_Page_Ku.png" class="Ku_Image" @click="submit('三角函数')">
              <label class="Ku_Title">
                三角函数
              </label><br>
              <span class="Ku_Description">三角函数是基本初等函数之一，是以角度（数学上最常用弧度制，下同）为自变量，角度对应任意角终边与单位圆交点坐标或其比值为因变量的函数...</span>
            </div>
          </div>
        </el-row>
      </section>

      <section class="link-area">
        <el-row style="width: 768px; margin: 0 auto" align="center">
          <div class="statistics_Title">
            <span class="Func_Colored_Title_1">特色</span>教育功能，<span class="Func_Colored_Title_2">倾力</span>打造
          </div>
        </el-row>
          <div class="Func_Card" align="left">
            <div class="Func_Card_1_Img Func_Card_Img" @click="Resource_Analysis('Paper')">

            </div>
            <label class="Func_Card_Label" @click="Resource_Analysis('Paper')">试卷分析</label>
            <br>
            <div class="Func_Card_Span">使用人工智能和数据挖掘技术在多个层次和维度上分析试卷，如各题型占比、知识点分值和难度变化</div>
            <br>
            <div class="Func_Card_Text_Button" @click="Resource_Analysis('Paper')">了解更多<i class="el-icon-right" style="margin-left: 4px"></i></div>
          </div>
          <div class="Func_Card" align="left">
            <div class="Func_Card_2_Img Func_Card_Img" @click="Router_Trans('/paperCombine')">

            </div>
            <label class="Func_Card_Label" @click="Router_Trans('/paperCombine')">组卷系统</label>
            <br>
            <div class="Func_Card_Span">智能组卷系统提供丰富的选题方式，自动组卷，以及个性化试卷和答题卡编辑、预览与下载功能</div>
            <br>
            <div class="Func_Card_Text_Button" @click="Router_Trans('/paperCombine')">了解更多<i class="el-icon-right" style="margin-left: 4px"></i></div>
          </div>
          <div class="Func_Card" align="left">
            <div class="Func_Card_3_Img Func_Card_Img" @click="Router_Trans('/PublicPlatform')">

            </div>
            <label class="Func_Card_Label" @click="Router_Trans('/PublicPlatform')">AI实验室</label>
            <br>
            <div class="Func_Card_Span">由LUNA团队提供和维护，依托领先的技术实力，为用户提供高品质的教育产品及服务</div>
            <br>
            <div class="Func_Card_Text_Button" @click="Router_Trans('/PublicPlatform')">立即前往<i class="el-icon-right" style="margin-left: 4px"></i></div>
          </div>
          <div class="Func_Card" align="left">
            <div class="Func_Card_4_Img Func_Card_Img" @click="Router_Trans('/Resources')">

            </div>
            <label class="Func_Card_Label" @click="Router_Trans('/Resources')">智能教辅平台</label>
            <br>
            <div class="Func_Card_Span">深层次多维度海量教育资源分析，个性化资源管理、组织功能，为教师提供智能化教学服务</div>
            <br>
            <div class="Func_Card_Text_Button" @click="Router_Trans('/Resources')">立即前往<i class="el-icon-right" style="margin-left: 4px"></i></div>
          </div>
      </section>
      <!-- cta-area-end -->
    </div>
  </div>
</template>
<script>

import $ from "jquery";
import statistics from '@/common/components/statistics_2'
import statistics2 from '@/common/components/statistics_3'
import statistics3 from '@/common/components/statistics_4'

export default {
  components: { statistics, statistics2, statistics3},
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
      Count_Type: "Question",
      // 统计项的项目和是否打开学段区分
      Count_Part_Status: "Question",
      Period_switch_status: false
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
    Resource_Input(){
      if(this.Count_Part_Status == 'Question'){
        this.Router_Trans('/inputMarked');
      }else{
        this.Router_Trans('/inputPaper');
      }
    },
    Resource_Search(){
      if(this.Count_Part_Status == 'Question'){
        this.Router_Trans('/exercise');
      }else if(this.Count_Part_Status == 'Paper'){
        this.Router_Trans('/searchPaper');
      }else if(this.Count_Part_Status == 'KU'){
        this.Router_Trans('/KU');
      }else if(this.Count_Part_Status == 'Resources'){
        this.Router_Trans('/Resources');
      }
    },
    Resource_Analysis(Part){
      if(Part == 'Question'){
        this.QuestionAnalyseSwitchFlag = true;
      }else if(Part == 'Paper'){
        this.PaperAnalyseSwitchFlag = true;
      }else if(this.Count_Part_Status == 'Question'){
        this.QuestionAnalyseSwitchFlag = true;
      }else if(this.Count_Part_Status == 'Paper'){
        this.PaperAnalyseSwitchFlag = true;
      }
    },
    // 调整主页统计区块的按钮
    Part_Change_Type(val){
      this.Count_Part_Status = val;
    },
    Part_Change_Period(val){
      this.Period_switch_status = val;
    },
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
    submit(Ku_Name) {
      this.$router.push({
        name: "visitor/Knowledge Unit",
        params: { name: Ku_Name ? Ku_Name : this.ku_name, knowledgeSystem: "neea" }
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

.main_area {
  min-width: 768px;
  background: linear-gradient(to top right, #D5F2F4, #ABC5F3);
  height: 620px;
  padding-top: 240px;
  text-shadow: 1px 4px 4px 0px rgba(0, 0, 0, 0.12);
}
.main_area::before {
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
  min-width: 768px;
  height: 532px;
  background: #FAFAFC;
  margin-top: -32px;
}

.about_triangle{
  background: url("../assets/Triangle_1440.svg");
  background-repeat: no-repeat;
  background-size: auto;
  height: 100%;
  max-width: 1440px;
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
  min-width: 1366px;
  padding-top: 100px;
}

.statistics_area{
  min-width: 768px;
  height: 1000px;
  background: #FAFAFC;
}

.link-area {
  min-width: 768px;
  height: 1000px;
  padding-top: 260px;
  background: linear-gradient(71deg, #F5F6FA 0%, #FFFBFB 90%);
}

.ku_area{
  min-width: 768px;
  height: 1000px;
  background: linear-gradient(109deg, #FFF5F5 0%, #DDE2F6 90%);
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
  filter: drop-shadow(1px 4px 4px rgba(0, 0, 0, 0.12));
}

.Self_Input{
  border: none;
  outline: none;
  height: 64px;
  width: 420px;
  font-size: 20px;
  display: inline-block;
}

.Search_Area{
  display: inline-block;
  vertical-align: top;
  margin-top: 174px;
  box-shadow: 0px 6px 32px 0px rgba(0, 0, 0, 0.12);
  border-radius: 32px;
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
  display: inline-block;
  vertical-align: top;
}

.Self_Input_Area_Middle{
  height: 64px;
  width: 440px;
  background: white;
  padding-left: 10px;
  display: inline-block;
  vertical-align: top;
}

.Self_Input_Area_Right{
  height: 64px;
  width: 128px;
  background: white;
  border-radius: 0px 32px 32px 0px;
  display: inline-block;
  vertical-align: top;
}

.Part_Right{
  height: 1000px;
  padding-top: 320px;
  padding-left: 60px;
}

.Ku_Part_Right{
  height: 520px;
  width: 552px;
  margin-top: 224px;
  padding: 32px;
  border-radius: 24px;
  background: #FFFFFF;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.06);
}

.Ku_Image{
  width: auto;
  height: auto;
  max-height: 100%;
  max-width: 100%;
  cursor: pointer;
}

.Ku_Title{
  font-size: 24px;
  font-weight: bold;
  line-height: 32px;
  letter-spacing: 0.05em;
  margin-top: 36px;
  margin-bottom: 16px;
}

.Ku_Description{
  font-size: 18px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0.05em;
  color: #9E9E9E;
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
  background-clip: text;
  color: transparent;
}

.statistics_Colored_Title_2{
  background-image: linear-gradient(to right, #4CC1F7, #1A52EE);
  background-clip: text;
  color: transparent;
}

.KU_Colored_Title_1{
  background-image: linear-gradient(to right, #23A1CB, #3AF4EB);
  background-clip: text;
  color: transparent;
}

.KU_Colored_Title_2{
  background-image: linear-gradient(to right, #F74CBE, #1A52EE);
  background-clip: text;
  color: transparent;
}

.Func_Colored_Title_1{
  background-image: linear-gradient(to right, #F74C88, #CA0F9E);
  background-clip: text;
  color: transparent;
}

.Func_Colored_Title_2{
  background-image: linear-gradient(to right, #FF3C3C, #663CFF);
  background-clip: text;
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
  cursor: pointer;
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

.KU_Button_Color1{
  background: linear-gradient(270deg, #6291C4 0%, #4F87C2 100%);
}

.Func_Card{
  width: 300px;
  height: 400px;
  border-radius: 24px;
  background: #FFFFFF;
  box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08);
  margin: 0 16px;
  margin-top: 48px;
}

.Func_Card_Label{
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  line-height: 32px;
  letter-spacing: 0.05em;
  color: #000000;
  margin: 20px 20px 10px 20px;
}

.Func_Card_Label:hover{
  color: rgba( 0, 0, 0, 0.6)
}

.Func_Card_Span{
  font-size: 20px;
  font-weight: normal;
  line-height: 32px;
  letter-spacing: 0.05em;
  color: #9E9E9E;
  margin: 0px 20px 10px 20px;
  word-break: break-all;
}

.Func_Card_Text_Button{
  width: fit-content;
  cursor: pointer;
  color: #409EFF;
  font-size: 18px;
  margin-left: 20px;
  margin-top: -10px;
}

.Func_Card_Text_Button:hover{
  color: rgba( 64, 158, 255, 0.72);
}

.Func_Card_Img{
  width: 300px;
  height: 150px;
  border-radius: 24px 24px 0px 0px;
  cursor: pointer;
  background-repeat: no-repeat;
}

.Func_Card_1_Img{
  background: url('../assets/Home_Page_Link_Card_1.jpg');
  background-size: 100% 150px;
}

.Func_Card_2_Img{
  background: url('../assets/Home_Page_Link_Card_2.jpg');
  background-size: 100% 150px;
}

.Func_Card_3_Img{
  background: url('../assets/Home_Page_Link_Card_3.jpg');
  background-size: 100% 150px;
}

.Func_Card_4_Img{
  background: url('../assets/Home_Page_Link_Card_4.jpg');
  background-size: 100% 150px;
}

@media screen and (max-width: 768px) {

  .Normal_Home_Page{
    display: none
  }

  .main_area{
    min-width: 768px;
  }

  .about-area{
    min-width: 768px;
  }

  .ku_area{
    height: 1300px;
    min-width: 768px;
  }

  .link-area{
    min-width: 768px;
    height: 2000px;
    padding-top: 120px;
  }

  .statistics_area{
    height: 1300px;
    min-width: 768px;
  }

  .about_triangle{
    width: 768px;
    background: url("../assets/Triangle.svg");
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: right;
    height: 100%;
    margin: 0px auto;
  }

  .Ku_Part_Right{
    text-align: left;
    margin-top: 124px;
  }

  .statistics_List{
    list-style-type: none;
  }

  .Func_Card{
    width: 480px;
    height: 400px;
    border-radius: 24px;
    background: #FFFFFF;
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08);
    margin: 48px auto 0px auto;
  }

  .Func_Card_Img{
    width: 480px;
    height: 150px;
    border-radius: 24px 24px 0px 0px;
    cursor: pointer;
  }

  .Func_Card_Text_Button{
    margin-top: 20px;
  }

  .Func_Card_Span{
    height: 96px;
  }
}

@media screen and (min-width: 769px) and (max-width: 1280px) {
  .Narrow_Home_Page{
    display: none
  }

  .Normal_Normal{
    display: none;
  }

  .statistics_List{
    list-style-type: none;
  }

  .link-area{
    min-width: 768px;
    height: 1200px;
    margin: 0 auto;
    padding-top: 120px;
  }

  .ku_area{
    height: 1300px;
    min-width: 768px;
  }

  .Ku_Part_Right{
    text-align: left;
    margin-top: 124px;
  }

  .statistics_area{
    height: 1300px;
    min-width: 768px;
  }

  .Func_Card{
    width: 355px;
    height: 400px;
    border-radius: 24px;
    background: #FFFFFF;
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08);
    margin: 48px auto 0px auto;
  }

  .Func_Card_Img{
    width: 355px;
    height: 150px;
    border-radius: 24px 24px 0px 0px;
    cursor: pointer;
  }

  .Func_Card_Text_Button{
    margin-top: 20px;
  }

  .Func_Card_Span{
    height: 96px;
  }
}

@media screen and (min-width: 1280px){
  .Normal_Narrow{
    display: none
  }

  .Narrow_Home_Page{
    display: none
  }
}

</style>
