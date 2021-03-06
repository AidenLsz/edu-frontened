<template>
  <!--todo: polish the format-->
  <div class="home">
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
            <router-link to="/inputMarked" :underline="false">
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
            <router-link to="/inputPaper" :underline="false">
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
            <router-link to="/exercise" :underline="false">
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
            <el-button @click="Router_Trans('/ku')" circle style="height: 200px; width: 200px"><img src="../assets/icon5.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <router-link to="/ku" :underline="false">
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
            <el-button circle style="height: 200px; width: 200px;"><img src="../assets/icon6.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
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
            <router-link to="/inputMarked" :underline="false">
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
            <router-link to="/exercise" :underline="false">
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
            <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon1.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
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
            <router-link to="/inputPaper" :underline="false">
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
            <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon1.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
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
            <router-link to="/ku" :underline="false">
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

    <section class="slider-bg" >
      <el-row type="flex" justify="center" style="padding-top: 400px;">
        <el-col :span="10">
          <el-input
            v-model="ku_name"
            placeholder="三角函数"
          ></el-input>
        </el-col>
        <el-col :span="2">
          <el-row type="flex" justify="start">
            <el-button type="primary" @click="submit" plain
              ><i class="el-icon-search" style="margin-right: 15px"></i>检索</el-button
            >
          </el-row>
        </el-col>
      </el-row>
    </section>

    <!-- about-area -->
    <section class="about-area">
      <el-row>
        <el-col :span="4" :offset="5">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="6">
          <h1 style="padding-left: 5vw; padding-right: 4vw; letter-spacing: 1vw; margin-top: 5px">简介</h1>
        </el-col>
        <el-col :span="4">
          <el-divider></el-divider>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <img src="../assets/intro.png" width="70%"/>
        </el-col>
        <el-col :span="9">
          <p style="font-size: 20px; line-height: 200%; padding-left: 30px; margin-top: 7vh; text-align: left">
          智慧教育知识图谱（LUNA）致力于为广大师生提供智能且直观的知识组织、呈现、应用等多维度功能。通过对海量教材、题库、考纲等教育教学资源进行深层次的数据挖掘与建模。LUNA具有其他知识图谱所不具备的而丰富内容和多样化的智能接口。LUNA不仅提供了简单、直观、易用的知识、资源查询功能，还提供了如自动考卷分析、试题难度评估等智慧化分析、评估接口，可满足广大师生、学校管理者丰富的教育教学需求。
          </p>
        </el-col>
      </el-row>

    </section>

    <section class="link-bg">
      <!-- 试题检索卡片跳转 -->
      <el-row style="margin-bottom: 50px">
        <el-col :span="4" :offset="5">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="6">
          <span style="padding-left: 4vw; padding-right: 3vw; letter-spacing: 1vw; font-size: 36px;">资源与功能</span>
        </el-col>
        <el-col :span="4">
          <el-divider></el-divider>
        </el-col>
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
          <el-row v-if="ToolsLabelNow == '资源'" style="padding-top: 30px; background: white; padding-bottom: 30px">
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
          <el-row v-else-if="ToolsLabelNow == '功能'"  style="padding-top: 30px; background: white; padding-bottom: 30px">
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
    
    <!-- cta-area -->
    <section>
      <el-row style="margin-top: 50px;">
        <el-col :span="4" :offset="5">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="6">
          <span style="padding-left: 5vw; padding-right: 4vw; letter-spacing: 1vw; font-size: 36px;">关于我们</span>
        </el-col>
        <el-col :span="4">
          <el-divider></el-divider>
        </el-col>
      </el-row>
      <el-row style="margin-top: 80px; padding-bottom: 200px">
        <el-col :span="14" :offset="5">
          <span style="font-size: 16px; line-height: 200%; text-align: left; font-weight: bold; display: inline-block">
            大数据分析与应用安徽省重点实验室（Anhui Province Key Laboratory of Big Data Analysis and Application），学科领域为电子信息，由中国科学技术大学、科大讯飞股份有限公司（以下简称科大讯飞公司）和安徽广电传媒产业集团有限责任公司（以下简称安徽广电集团）三方共建。其中，作为依托单位的中国科学技术大学，是我省乃至我国大数据分析与应用方向的优势研究单位；同时，作为共建单位的科大讯飞公司和安徽广电集团，不仅拥有规模庞大的大数据云平台以及优质数据资源，而且具有丰富的大数据技术产业化经验；更为重要的是，经过多年的合作，共建三方已经形成了强强联合、优势互补的稳定合作局面，围绕大数据分析与应用方向，建立了大数据产学研合作平台，在科研平台、产业平台和数据平台三个方面都拥有良好的科研和产业环境。
          </span>
        </el-col>
      </el-row>
    </section>
    <!-- cta-area-end -->
  </div>
</template>
<script>

import $ from "jquery";

export default {
  components: { },
  name: "Home",
  data() {
    return {
      ku_name: "三角函数",
      image_infos: [],
      ToolsLabelNow: "资源",
      functionStatus: [false, false, false, false],
      resourceStatus: [false, false, false, false]
    };
  },
  mounted() {
    // data - background
    $("[data-background]").each(function() {
      $(this).css(
        "background-image",
        "url(" + $(this).attr("data-background") + ")"
      );
    });
  },
  methods: {
    submit() {
      this.$router.push({
        name: "Knowledge Unit",
        params: { name: this.ku_name }
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
    }
  }
};
</script>
<style scoped>
.link-bg {
  padding-top: 50px;
  background: #EEF5FE;
  background-size: 100%;
  position: relative;
  min-height: 700px;
  background-position: center;
  background-size: cover;
  z-index: 1;
}
.slider-bg {
  background: url("../assets/bg.png");
  background-size: 100%;
  position: relative;
  min-height: 653px;
  background-position: center;
  background-size: cover;
  z-index: 1;
}
.slider-bg::before {
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
  position: fixed;
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
  padding-top: 50px;
  padding-bottom: 50px;
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
</style>
