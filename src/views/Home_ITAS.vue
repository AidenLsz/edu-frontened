<template>
  <div style="margin-top: 2vh;">
    <!-- 注册和登录 -->
    <div id="Top_Nav" class="Top_Nav">

    </div>
    <login ref="login" @register_show="register_show" />
    <register ref="register" />
    <!-- 试卷分析路径跳转 -->
    <el-dialog :visible.sync="Analyse_Paper" width="800px">
      <el-row>
        <el-col :span="8">
          <el-row>
            <el-button
              @click="Route_Trans('/PaperAnalyseInput')"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon4.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="Route_Trans('/PaperAnalyseInput')"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              录入试卷进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-button
              @click="Route_Trans('/searchPaper')"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon1.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="Route_Trans('/searchPaper')"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              选择题库中试卷进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-button
              @click="Route_Trans('/multipaperanalyse')"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon15.png"
                width="60%"
                style="margin-left: 0px; margin-top: 0px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="Route_Trans('/multipaperanalyse')"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              选择多张试卷进行分析
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 试题分析路径跳转 -->
    <el-dialog :visible.sync="Analyse_Question" width="800px">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-button
              @click="Route_Trans('/QuestionAnalyseInput')"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon4.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="Route_Trans('/QuestionAnalyseInput')"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              录入试题进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-button
              @click="Route_Trans('/exercise')"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon1.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="Route_Trans('/exercise')"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              搜索试题进行分析
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 功能 - 分析的统一接口 -->
    <el-dialog
      :visible.sync="Analyse_Switch_Dialog"
      title="分析"
      width="800px"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-row style="padding-top: 30px; background: white; padding-bottom: 30px">
        <el-col :span="12">
          <el-row>
            <el-button @click="Analyse_Switch('Question')" circle style="height: 200px; width: 200px;"><img src="@/assets/icon6.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
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
        <el-col :span="12">
          <el-row>
            <el-button @click="Analyse_Switch('Paper')" circle style="height: 200px; width: 200px"><img src="@/assets/icon8.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
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
    <div class="Normal_Home_Page">
      <!-- 注册即功能简介 -->
      <div style="width: 100%; height: 700px" align="center" id="Border_Div">
        <el-row class="Area_Row" type="flex" justify="center">
          <div class="Home_Area_Left">
            <el-row>
              <el-col>
                <el-row type="flex" justify="start" class="Part_Title" style="font-size: 58px;">
                  <span>智能教辅平台</span>
                </el-row>
                <el-row 
                  type="flex" 
                  justify="start"
                  class="Home_Area_Left_Center" 
                  style="word-break: break-all; text-align: left; font-size: 20px; height: 64px; line-height: 32px; color: #595959">
                  深层次、多维度分析处理海量教育资源，智能化、个性化资源管理、组织、查询、分析功能，为教师提供智能化教学服务
                </el-row>
                <el-row type="flex" justify="start">
                  <div class="All_Button Start_Analysis_Button" @click="register_show" style="color: white; background: #3E89E0">
                    现在加入
                  </div>
                  <!-- <div class="All_Button Start_Analysis_Button" @click="Route_Trans('user/userInfo')" v-else>
                    我的信息<i class="el-icon-right" style="margin-left: 10px;"></i>
                  </div> -->
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="Home_Area_Right" align="center">
            <el-row type="flex" justify="center" style="margin: 0; padding: 0;">
              <div style="width: 250px; margin-right: 12px; height: 300px;" align="right">
                <div class="Home_Area_Right_Block" style="cursor: pointer" @click="Jump_To('Teaching_Resource')">
                  <div style="display: inline-block; width: 48px;">
                    <img src="@/assets/dataIcon1.png" style="margin-top: -8px" width="48px" height="48px">
                  </div>
                  <div class="Home_Area_Right_Text">
                    <span style="font-size: 22px; display: block; margin-top: 8px">教学资源</span>
                  </div>
                </div>
                <div class=" Home_Area_Right_Block" style="margin-top: 12px; cursor: pointer" @click="Jump_To('Paper_Combine')">
                  <div style="display: inline-block; width: 48px;">
                    <img src="@/assets/dataIcon2.png" width="48px" height="48px" style="margin-top: -8px">
                  </div>
                  <div class="Home_Area_Right_Text">
                    <span style="font-size: 22px; display: block; margin-top: 8px">组卷系统</span>
                  </div>
                </div>
              </div>
              <div style="width: 250px; height: 300px;" align="left">
                <div class="Home_Area_Right_Block" style="margin-top: 10px; cursor: pointer" @click="Jump_To('Analysing_Part')">
                  <div style="display: inline-block; width: 48px;">
                    <img src="@/assets/SearchIcon.svg" width="48px" height="48px" style="margin-top: -8px">
                  </div>
                  <div class="Home_Area_Right_Text">
                    <span style="font-size: 22px; display: block; margin-top: 8px">智能分析</span>
                  </div>
                </div>
                <div class="Home_Area_Right_Block" style="margin-top: 12px; cursor: pointer" @click="Jump_To('Knowledge_Unit_Link')">
                  <div style="display: inline-block; width: 48px;">
                    <img src="@/assets/dataIcon3.png" width="48px" height="48px" style="margin-top: -8px">
                  </div>
                  <div class="Home_Area_Right_Text">
                    <span style="font-size: 22px; display: block; margin-top: 8px">知识联想</span>
                  </div>
                </div>
              </div>
            </el-row>
          </div>
        </el-row>
      </div>
      <!-- 资源检索 -->
      <div style="width: 100%; background: #F8F9FA;" align="center" id="Teaching_Resource">
        <el-row class="Area_Row" style="height: 700px;" type="flex" justify="center">
          <div class="Resource_Manager_Left" align="left">
            <el-row>
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Question">
                <div style="display: inline-block; width: 64px;">
                  <img src="@/assets/dataIcon1.png" width="64px" height="64px" style="margin-top: -40px;">
                </div>
                <div style="display: inline-block; width: 110px; margin-left: 16px; font-size: 18px">
                  <span style="font-size: 28px">2500万+</span><br>道试题
                </div>
              </div>
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Subject">
                <div style="display: inline-block; width: 64px;">
                  <img src="@/assets/SubjectIcon.png" width="64px" height="64px" style="margin-top: -40px;">
                </div>
                <div style="display: inline-block; width: 37px; margin-left: 12px; font-size: 18px">
                  <span style="font-size: 28px">9</span>大学科
                </div>
              </div>
            </el-row>
            <el-row style="margin-top: 30px;">
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Paper">
                <div style="display: inline-block; width: 64px;">
                  <img src="@/assets/dataIcon2.png" width="64px" height="64px" style="margin-top: -40px;">
                </div>
                <div style="display: inline-block; width: 95px; margin-left: 16px; font-size: 18px">
                  <span style="font-size: 28px">33万+</span><br>套试卷
                </div>
              </div>
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Period">
                <div style="display: inline-block; width: 64px;">
                  <img src="@/assets/PeriodIcon.png" width="64px" height="64px" style="margin-top: -40px;">
                </div>
                <div style="display: inline-block; width: 150px; margin-left: 16px; font-size: 18px" align="center">
                  <span style="font-size: 28px">小学~成人</span><br>全学段覆盖
                </div>
              </div>
            </el-row>
          </div>
          <div class="Resource_Manager_Right">
            <el-row>
              <el-col>
                <el-row type="flex" justify="start" class="Part_Title">
                  <span>海量教学资源、智能处理</span>
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 40px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>智能化、个性化的资源（试题、试卷）的录入、查询和管理服务
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>内置标准化、体系化的教学资源
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>使用高效准确的试题相似度评估算法，提升题库的资源质量
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 44px;">
                  <div 
                    class="All_Button Start_Analysis_Button" 
                    style="background: white; width: 144px; padding-left: 16px"
                    @click="Route_Trans('/exercise')">
                    试题检索<i class="el-icon-right" style="margin-left: 4px;"></i>
                  </div>
                  <div 
                    class="All_Button Start_Analysis_Button" 
                    style="background: white; margin-left: 16px; width: 144px; padding-left: 16px"
                    @click="Route_Trans('/searchPaper')">
                    试卷检索<i class="el-icon-right" style="margin-left: 4px;"></i>
                  </div>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </div>
      <!-- 组卷系统介绍 -->
      <div style="width: 100%;" align="center" id="Paper_Combine">
        <el-row class="Area_Row" style="height: 700px">
          <div class="Combine_Paper_Area_Left">
            <el-row>
              <el-col>
                <el-row type="flex" justify="start" class="Part_Title">
                  <span>多样化组卷系统，一应俱全</span>
                </el-row>
                <el-row 
                  type="flex" 
                  justify="start" 
                  style="word-break: break-all; text-align: left; margin-top: 24px; font-size: 20px; height: 56px; line-height: 28px; color: #595959">
                  智能组卷系统提供丰富的选题方式，自动组卷，以及个性化试卷和答题卡编辑、预览与下载功能
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 24px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>智能组卷
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 13px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>关键词搜题
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 13px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>知识点搜题
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 13px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>以题搜题
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 44px;">
                  <div class="All_Button Start_Analysis_Button" style="width: 144px" @click="Route_Trans('/paperCombine')">
                    开始体验<i class="el-icon-right" style="margin-left: 10px;"></i>
                  </div>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="Combine_Paper_Area_Right">
            <el-col>
              <div class="Resource_Manager_Float_Block Combine_Paper_Area_Div" style="transform: rotate(-2deg); display: block; padding: 0;">
                <span style="font-size: 22px">多样化搜题、选题</span>
              </div>
              <div class="Resource_Manager_Float_Block Combine_Paper_Area_Div" style="transform: rotate(2deg); display: block; padding: 0">
                <span style="font-size: 22px">试卷和答题卡生成</span>
              </div>
              <div class="Resource_Manager_Float_Block Combine_Paper_Area_Div" style="transform: rotate(-2deg); display: block; padding: 0">
                <span style="font-size: 22px">高质量自动化组卷</span>
              </div>
            </el-col>
          </div>
        </el-row>
      </div>
      
      <!-- 知识点直观呈现 -->
      <div style="width: 100%; background: #F8F9FA;" align="center" id="Knowledge_Unit_Link">
        <el-row class="Area_Row" style="height: 700px;" type="flex" justify="center">
          <div class="KU_Search_Left" align="center">
            <div>
              <img src="@/assets/ITAS_Home_KU.png" width="417" >
            </div>
            <div style="width: 400px; margin-top: 32px; margin-bottom: 32px" align="center">
              <el-col>
                <el-row type="flex" justify="start">
                  <el-button 
                    type="text" 
                    style="color: black; font-weight: bold; font-size: 20px"
                    @click="Search_KU('三角函数')">三角函数<i class="el-icon-right" style="margin-left: 10px;"></i></el-button>
                </el-row>
                <el-row type="flex" justify="start" style="word-break: break-all; text-align: left; margin-top: 16px;">
                  三角函数是基本初等函数之一，是以角度（数学上最常用弧度制，下同）为自变量，角度对应任意角终边与单位圆交点坐标或其比值为因变量的函数。也可以等价地用与单位圆有关的各种线段的长度来定义三角函数在研究三角形和圆等几何形状的性质时有重要作用...
                </el-row>
              </el-col>
            </div>
          </div>
          <div class="KU_Search_Right">
            <el-row>
              <el-col>
                <el-row type="flex" justify="start" class="Part_Title">
                  <span>知识点直观呈现</span>
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 40px; margin-bottom: 10px; font-size: 18px;">
                  <div class="Dot"></div>知识点智能化组织与呈现
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 18px;">
                  <div class="Dot"></div>辅助学生梳理知识结构
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 18px;">
                  <div class="Dot"></div>前驱后继、共同学习和层级关系三种知识关系展示
                </el-row>
                <el-row type="flex" justify="start">
                  <el-input 
                    v-model="Home_Ku" 
                    @keydown.enter.native="Search_KU"
                    placeholder="知识点搜索" 
                    style="width: 300px; margin-top: 44px;">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i> 
                  </el-input>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </div>
      <!-- 多层次，多维度智能分析 -->
      <div style="width: 100%; height: 700px" align="center" id="Analysing_Part">
        <el-row class="Area_Row" style="padding-top: 100px; padding-bottom: 100px;">
          <div class="Multi_Analyse_Rader_Left">
            <el-row>
              <el-col>
                <el-row type="flex" justify="start" class="Part_Title">
                  <span>深层次、多维度智能分析</span>
                </el-row>
                <el-row 
                  type="flex" 
                  justify="start" 
                  style="word-break: break-all; text-align: left; margin-top: 30px; font-size: 20px; height: 84px; line-height: 28px; color: #595959">
                  使用人工智能和数据挖掘技术对试题和试卷，在各个层次、多个维度上分析，如各题型占比、关键词比较、知识点分值和难度变化
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 28px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>试题质量、难度分析
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 16px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>试题、试卷知识点分析
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 16px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>试卷综合分析
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 44px;">
                  <div class="All_Button Start_Analysis_Button" style="width: 144px" @click="Analyse_Switch_Dialog = true">
                    开始分析<i class="el-icon-right" style="margin-left: 10px;"></i>
                  </div>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div id="Multi_Analyse_Radar_Chart" class="Multi_Analyse_Radar_Chart">

          </div>
        </el-row>
      </div>
    </div>
    <div class="Narrow_Home_Page">
      <!-- 注册即功能简介 -->
      <div style="width: 100%; height: 700px" align="center" id="Border_Div">
        <el-row class="Area_Row" type="flex" justify="center">
          <div class="Home_Area_Left">
            <el-row type="flex" justify="start" class="Part_Title" style="font-size: 58px; height: 81px; line-height: 81px;">
              <span>智能教辅平台</span>
            </el-row>
            <el-row 
              type="flex" 
              justify="start"
              class="Home_Area_Left_Center" 
              style="word-break: break-all; text-align: left; font-size: 20px; line-height: 32px; color: #595959; margin-top: 20px;">
              深层次、多维度分析处理海量教育资源，智能化、个性化资源管理、组织、查询、分析功能，为教师提供智能化教学服务
            </el-row>
            <el-row type="flex" justify="start" style="margin: 0; padding: 0;">
              <div class="Home_Area_Right_Block" style="margin-top: 48px; margin-right: 20px;">
                <div style="display: inline-block; width: 48px;">
                  <img src="@/assets/dataIcon1.png" style="margin-top: -8px" width="48px" height="48px">
                </div>
                <div class="Home_Area_Right_Text">
                  <span style="font-size: 22px; display: block; margin-top: 8px">教学资源</span>
                </div>
              </div>
              <div class=" Home_Area_Right_Block" style="margin-top: 58px; margin-right: 20px;">
                <div style="display: inline-block; width: 48px;">
                  <img src="@/assets/dataIcon2.png" width="48px" height="48px" style="margin-top: -8px">
                </div>
                <div class="Home_Area_Right_Text">
                  <span style="font-size: 22px; display: block; margin-top: 8px">组卷系统</span>
                </div>
              </div>
              <div class="Home_Area_Right_Block" style="margin-top: 68px; margin-right: 20px;">
                <div style="display: inline-block; width: 48px;">
                  <img src="@/assets/SearchIcon.svg" width="48px" height="48px" style="margin-top: -8px">
                </div>
                <div class="Home_Area_Right_Text">
                  <span style="font-size: 22px; display: block; margin-top: 8px">智能分析</span>
                </div>
              </div>
              <div class="Home_Area_Right_Block" style="margin-top: 78px;">
                <div style="display: inline-block; width: 48px;">
                  <img src="@/assets/dataIcon3.png" width="48px" height="48px" style="margin-top: -8px">
                </div>
                <div class="Home_Area_Right_Text">
                  <span style="font-size: 22px; display: block; margin-top: 8px">知识联想</span>
                </div>
              </div>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 48px">
              <div class="All_Button Start_Analysis_Button" @click="register_show" style="color: white; background: #3E89E0">
                现在加入
              </div>
              <!-- <div class="All_Button Start_Analysis_Button" @click="Route_Trans('user/userInfo')" v-else>
                我的信息<i class="el-icon-right" style="margin-left: 10px;"></i>
              </div> -->
            </el-row>
          </div>
        </el-row>
      </div>
      <!-- 资源检索 -->
      <div style="width: 100%; background: #F8F9FA;" align="center">
        <el-row class="Area_Row" style="height: 700px;" type="flex" justify="center">
          <div class="Resource_Manager_Left" align="left">
            <el-row>
              <el-col>
                <el-row type="flex" justify="start" class="Part_Title">
                  <span>海量教学资源、智能处理</span>
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 40px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>智能化、个性化的资源（试题、试卷）的录入、查询和管理服务
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>内置标准化、体系化的教学资源
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>使用高效准确的试题相似度评估算法，提升题库的资源质量
                </el-row>
              </el-col>
            </el-row>
            <el-row style="margin-top: 24px">
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Question">
                <div style="display: inline-block; width: 64px;">
                  <img src="@/assets/dataIcon1.png" width="64px" height="64px" style="margin-top: -40px;">
                </div>
                <div style="display: inline-block; width: 110px; margin-left: 16px; font-size: 18px">
                  <span style="font-size: 28px">2500万+</span><br>道试题
                </div>
              </div>
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Subject">
                <div style="display: inline-block; width: 64px;">
                  <img src="@/assets/SubjectIcon.png" width="64px" height="64px" style="margin-top: -40px;">
                </div>
                <div style="display: inline-block; width: 37px; margin-left: 12px; font-size: 18px">
                  <span style="font-size: 28px">9</span>大学科
                </div>
              </div>
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Paper">
                <div style="display: inline-block; width: 64px;">
                  <img src="@/assets/dataIcon2.png" width="64px" height="64px" style="margin-top: -40px;">
                </div>
                <div style="display: inline-block; width: 95px; margin-left: 16px; font-size: 18px">
                  <span style="font-size: 28px">33万+</span><br>套试卷
                </div>
              </div>
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Period">
                <div style="display: inline-block; width: 64px;">
                  <img src="@/assets/PeriodIcon.png" width="64px" height="64px" style="margin-top: -40px;">
                </div>
                <div style="display: inline-block; width: 150px; margin-left: 16px; font-size: 18px" align="center">
                  <span style="font-size: 28px">小学~成人</span><br>全学段覆盖
                </div>
              </div>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 44px;">
              <!-- <div>
                <el-input v-model="Exercise_Content" placeholder="试题检索">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i> 
                </el-input>
              </div> -->
              <div 
                class="All_Button Start_Analysis_Button" 
                style="background: white; width: 144px; padding-left: 16px"
                @click="Route_Trans('/exercise')">
                试题检索<i class="el-icon-right" style="margin-left: 4px;"></i>
              </div>
              <div 
                class="All_Button Start_Analysis_Button" 
                style="background: white; margin-left: 16px; width: 144px; padding-left: 16px"
                @click="Route_Trans('/searchPaper')">
                试卷检索<i class="el-icon-right" style="margin-left: 4px;"></i>
              </div>
            </el-row>
          </div>
        </el-row>
      </div>
      <!-- 组卷系统介绍 -->
      <div style="width: 100%;" align="center">
        <el-row class="Area_Row" style="height: 700px">
          <div class="Combine_Paper_Area_Left">
            <el-row>
              <el-col>
                <el-row type="flex" justify="start" class="Part_Title">
                  <span>多样化组卷系统，一应俱全</span>
                </el-row>
                <el-row 
                  type="flex" 
                  justify="start" 
                  style="word-break: break-all; text-align: left; margin-top: 24px; font-size: 20px; height: 56px; line-height: 28px; color: #595959">
                  智能组卷系统提供丰富的选题方式，自动组卷，以及个性化试卷和答题卡编辑、预览与下载功能
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 24px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>智能组卷
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 13px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>关键词搜题
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 13px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>知识点搜题
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 13px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>以题搜题
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 44px;">
                  <div class="All_Button Start_Analysis_Button" style="width: 144px" @click="Route_Trans('/paperCombine')">
                    开始体验<i class="el-icon-right" style="margin-left: 10px;"></i>
                  </div>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </div>
      <!-- 知识点直观呈现 -->
      <div style="width: 100%; background: #F8F9FA;" align="center">
        <el-row class="Area_Row" style="height: 920px;" type="flex" justify="center">
          <div class="KU_Search_Left" align="center">
            <el-row>
              <el-col>
                <el-row type="flex" justify="start" class="Part_Title">
                  <span>知识点直观呈现</span>
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 40px; margin-bottom: 10px; font-size: 18px;">
                  <div class="Dot"></div>知识点智能化组织与呈现
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 18px;">
                  <div class="Dot"></div>辅助学生梳理知识结构
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 18px;">
                  <div class="Dot"></div>前驱后继、共同学习和层级关系三种知识关系展示
                </el-row>
              </el-col>
            </el-row>
            <div class="Narrow_KU_Example">
              <div>
                <img src="@/assets/ITAS_Home_KU.png" height="248">
              </div>
              <div style="width: 100%; margin-top: 32px; margin-bottom: 32px" align="center">
                <el-col>
                  <el-row type="flex" justify="start">
                    <el-button 
                      type="text" 
                      style="color: black; font-weight: bold; font-size: 20px"
                      @click="Search_KU('三角函数')">三角函数<i class="el-icon-right" style="margin-left: 10px;"></i></el-button>
                  </el-row>
                  <el-row type="flex" justify="start" style="word-break: break-all; text-align: left; margin-top: 16px;">
                    三角函数是基本初等函数之一，是以角度（数学上最常用弧度制，下同）为自变量，角度对应任意角终边与单位圆交点坐标或其比值为因变量的函数。也可以等价地用与单位圆有关的各种线段的长度来定义三角函数在研究三角形和圆等几何形状的性质时有重要作用...
                  </el-row>
                </el-col>
              </div>
            </div>
            <el-row type="flex" justify="start">
              <el-input 
                v-model="Home_Ku" 
                @keydown.enter.native="Search_KU"
                placeholder="知识点搜索"
                style="width: 320px; margin-top: 44px;">
                <i slot="prefix" class="el-input__icon el-icon-search" style="margin-left: 10px;"></i>  
              </el-input>
            </el-row>
          </div>
        </el-row>
      </div>
      <!-- 多层次，多维度智能分析 -->
      <div style="width: 100%; height: 950px" align="center">
        <el-row class="Area_Row" style="padding-top: 60px; ">
          <div class="Multi_Analyse_Rader_Left">
            <el-row>
              <el-col>
                <el-row type="flex" justify="start" class="Part_Title">
                  <span>深层次、多维度智能分析</span>
                </el-row>
                <el-row 
                  type="flex" 
                  justify="start" 
                  style="word-break: break-all; text-align: left; margin-top: 24px; font-size: 20px; height: 56px; line-height: 28px; color: #595959">
                  使用人工智能和数据挖掘技术对试题和试卷，在各个层次、多个维度上分析，如各题型占比、关键词比较、知识点分值和难度变化
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 24px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>试题质量、难度分析
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 16px; margin-bottom: 10px; font-size: 20px;">
                  <div class="Dot"></div>试题、试卷知识点分析
                </el-row>
                <el-row type="flex" justify="start" style="margin-top: 16px; margin-bottom: 44px; font-size: 20px;">
                  <div class="Dot"></div>试卷综合分析
                </el-row>
                <div id="Multi_Analyse_Radar_Chart_Narrow" class="Multi_Analyse_Radar_Chart_Narrow">

                </div>
                <el-row type="flex" justify="start" style="margin-top: 44px;">
                  <div class="All_Button Start_Analysis_Button" style="width: 144px" @click="Analyse_Switch_Dialog = true">
                    开始分析<i class="el-icon-right" style="margin-left: 10px;"></i>
                  </div>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>

import * as echarts from 'echarts';
import login from '@/layout/components/login'
import register from '@/layout/components/register'

export default {
  name: 'ScreenShot',
  props: {
  },
  components:{
    login, register
  },
  data() {
    return {
      // 知识点
      Home_Ku: "",
      // 试题检索
      Exercise_Content: "",
      // 分析资源跳转对话框
      Analyse_Switch_Dialog: false,
      // 试题、试卷
      Analyse_Question: false,
      Analyse_Paper: false,
    }
  },
  watch: {

  },
  computed: {
    rootPath() {
      console.log("@"+this.$store.getters.rootPath)
      return this.$store.getters.rootPath;
    }
  },
  mounted() {
    this.Init_Home_Page_Radar();
    this.Init_Home_Page_Radar_Narrow();
    this.To_Top();
  },
  methods: {
    // 跳转到某个组件的位置
    Jump_To(Part){
        document.getElementById(Part).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
    },
    To_Top(){
          document.getElementById("Top_Nav").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
      },
    // 分析试题或试卷
    Analyse_Switch(Part){
      if(Part == 'Question'){
        this.Analyse_Question = true;
        this.Analyse_Paper = false;
      }else{
        this.Analyse_Paper = true;
        this.Analyse_Question = false;
      }
    },
    // 初始化首页的那张雷达图
    Init_Home_Page_Radar(){
      var Home_Radar = echarts.init(document.getElementById("Multi_Analyse_Radar_Chart"));
      //let colors = ["#EE6666", "#5470C6", "#91CC75"];
      let option = {
        title: {
          text: "知识点分值比较", //这里的参数是整个图标的标题 后面也可以加注释
          bottom: 20,
          left: "36.5%",
          textStyle: {
            fontSize: 18,
            fontStyle: "normal",
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: true,
          orient: "vertical", 
          right: 0,
          bottom: 30,
          itemHeight: 6, //修改icon图形大小
          itemWidth: 10,
          textStyle: {
            fontSize: 8,
            color: '#000'
          },
          data: [ "2020年全国统一高考数学试卷（文科）（新课标i)",
                  "2020年全国统一高考数学试卷（文科）（新课标ii)",
                  "2020年全国统一高考数学试卷（文科）（新课标iii)",
                  "2020年全国统一高考数学试卷（理科）（新课标i)"],
        },
        radar: [
          {
            center: ["50%", "44%"],
            splitArea: {
              areaStyle: {
                color: ["#FFFFFF"],
              },
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 1)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 1)",
              },
            },
            name: {
              formatter: "{value}",
              textStyle: {
                fontSize: 14,
                color: "#000000",
                fontWeight: "bold",
              },
            },
            radius: 120,
            indicator: [
              {text: "排列组合与概率统计"},
              {text: "代数"},
              {text: "算法与框图"},
              {text: "数学竞赛"},
              {text: "推理与证明"},
              {text: "立体几何"},
              {text: "三角函数"},
              {text: "高等数学"},
              {text: "平面解析几何"},
              {text: "数学知识延伸"}
            ],
          },
        ],
        calculable: true,
        series: [
          {
            name: "知识点分值",
            type: "radar",
            lineStyle: {
              type: "dashed",
            },
            symbol: "circle", // 拐点的样式
            symbolSize: 10,
            data: [
              {
                value: [90, 154, 76, 29, 5, 39, 37, 15, 20, 23],
                name: "2020年全国统一高考数学试卷（文科）（新课标i)"
              },
              {
                value: [113, 155, 101, 15, 44, 39, 39, 32, 32, 10],
                name: "2020年全国统一高考数学试卷（文科）（新课标ii)"
              },
              {
                value: [118, 143, 99, 20, 37, 27, 17, 42, 20, 15],
                name: "2020年全国统一高考数学试卷（文科）（新课标iii)"
              },
              {
                value: [115, 143, 84, 15, 39, 44, 25, 37, 20, 0],
                name: "2020年全国统一高考数学试卷（理科）（新课标i)"
              },
            ],
          },
        ],
      };
      Home_Radar.setOption(option);
      window.addEventListener('resize', function() {Home_Radar.resize()});
    },
    // 初始化首页的那张雷达图
    Init_Home_Page_Radar_Narrow(){
      var Home_Radar = echarts.init(document.getElementById("Multi_Analyse_Radar_Chart_Narrow"));
      //let colors = ["#EE6666", "#5470C6", "#91CC75"];
      let option = {
        title: {
          text: "知识点分值比较", //这里的参数是整个图标的标题 后面也可以加注释
          bottom: 10,
          left: "42.8%",
          textStyle: {
            fontSize: 18,
            fontStyle: "normal",
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: true,
          orient: "vertical", 
          right: 0,
          bottom: 30,
          itemHeight: 6, //修改icon图形大小
          itemWidth: 10,
          textStyle: {
            fontSize: 8,
            color: '#000'
          },
          data: [ "2020年全国统一高考数学试卷（文科）（新课标i)",
                  "2020年全国统一高考数学试卷（文科）（新课标ii)",
                  "2020年全国统一高考数学试卷（文科）（新课标iii)",
                  "2020年全国统一高考数学试卷（理科）（新课标i)"],
        },
        radar: [
          {
            center: ["50%", "44%"],
            splitArea: {
              areaStyle: {
                color: ["#FFFFFF"],
              },
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 1)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 1)",
              },
            },
            name: {
              formatter: "{value}",
              textStyle: {
                fontSize: 14,
                color: "#000000",
                fontWeight: "bold",
              },
            },
            radius: 110,
            indicator: [
              {text: "排列组合与概率统计"},
              {text: "代数"},
              {text: "算法与框图"},
              {text: "数学竞赛"},
              {text: "推理与证明"},
              {text: "立体几何"},
              {text: "三角函数"},
              {text: "高等数学"},
              {text: "平面解析几何"},
              {text: "数学知识延伸"}
            ],
          },
        ],
        calculable: true,
        series: [
          {
            name: "知识点分值",
            type: "radar",
            lineStyle: {
              type: "dashed",
            },
            symbol: "circle", // 拐点的样式
            symbolSize: 10,
            data: [
              {
                value: [90, 154, 76, 29, 5, 39, 37, 15, 20, 23],
                name: "2020年全国统一高考数学试卷（文科）（新课标i)"
              },
              {
                value: [113, 155, 101, 15, 44, 39, 39, 32, 32, 10],
                name: "2020年全国统一高考数学试卷（文科）（新课标ii)"
              },
              {
                value: [118, 143, 99, 20, 37, 27, 17, 42, 20, 15],
                name: "2020年全国统一高考数学试卷（文科）（新课标iii)"
              },
              {
                value: [115, 143, 84, 15, 39, 44, 25, 37, 20, 0],
                name: "2020年全国统一高考数学试卷（理科）（新课标i)"
              },
            ],
          },
        ],
      };
      Home_Radar.setOption(option);
      window.addEventListener('resize', function() {Home_Radar.resize()});
    },
    // 检索知识点
    Search_KU() {
      this.$router.push({
        name: "Knowledge Unit",
        params: { name: this.Home_Ku, knowledgeSystem: "neea" }
      });
    },
    // 跳转至新页面
    Route_Trans(route){
      document.body.scrollTo(0, 0)
      this.$router.push({ path: '/itas' + route });
    },
    // 注册和登录相关
    login_show() {
      this.$refs.login.show();
      this.$refs.register.hide();
    },
    register_show() {
      this.$refs.login.hide();
      this.$refs.register.show();
    },
  },
}
</script>

<style lang="scss" scoped>
.Multi_Analyse_Radar_Chart{
  display: inline-block;
  width: 630px;
  height: 405px;
  margin: auto 0;
  background: rgba(254, 254, 254, 0.8);
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
}

.Multi_Analyse_Radar_Chart_Narrow{
  display: inline-block;
  width: 100%;
  height: 388px;
  margin: auto 0;
  padding: 24px;
  background: rgba(254, 254, 254, 0.8);
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
}

.Multi_Analyse_Rader_Left{
  background: transparent;
  width: 562px;
  padding-right: 48px;
  display: inline-block;
}

.Combine_Paper_Area_Right{
  background: transparent;
  display: inline-block;
  width: 624px;
  height: 700px;
  padding-top: 180px;
}
.Combine_Paper_Area_Left{
  background: transparent;
  padding-top: 135px;
  height: 700px;
  width: 568px;
  display: inline-block;
}

.Area_Row{
  width: 1192px;
  padding: 0 0px;
}

.All_Button{
  width: 160px;
  height: 48px;
  padding: 13px 18px;
  line-height: 22px;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px 0px rgba($color: #000, $alpha: 0.08);
}

.Start_Analysis_Button{
  color: black;
  background: white;
  transition: 300ms;
  cursor: pointer;
  border: 1px solid #d3d3d3
}

.Start_Analysis_Button:hover{
  background: rgba(#4484B8, 0.06);
  border: 1px solid #4484B8;
  color: #4484B8;
}

.Dot{
  border-radius: 50%; 
  height: 7px; 
  width: 7px; 
  background: black; 
  margin-top: 10px; 
  margin-right: 20px;
  margin-left: 10px;
}

.Part_Title{
  font-family: PingFang SC;
  font-size: 44px;
  font-style: normal;
  font-weight: 600;
  line-height: 60px;
  letter-spacing: 0em;
  text-align: center;

}

.Resource_Manager_Left{
  background: #F8F9FA;
  width: 558px;
  padding-top: 241px;
  display: inline-block;
}

.Resource_Manager_Right{
  background: #F8F9FA;
  width: 634px;
  padding-top: 199px;
  display: inline-block;
}

.Resource_Manager_Right ::v-deep .el-input__inner{
    border-radius: 10px;
    width: 300px;
    height: 48px;
    border: 1px solid rgba($color: #000, $alpha: 0.14);
    box-shadow: 0px 4px 12px rgba($color: #000, $alpha: 0.02);
}

.Resource_Manager_Left ::v-deep .el-input__inner{
    border-radius: 10px;
    width: 320px;
    height: 48px;
    border: 1px solid rgba($color: #000, $alpha: 0.14);
    box-shadow: 0px 4px 12px rgba($color: #000, $alpha: 0.02);
}

.KU_Search_Left ::v-deep .el-input__inner{
    border-radius: 10px;
    width: 300px;
    height: 48px;
    border: 1px solid rgba($color: #000, $alpha: 0.14);
    box-shadow: 0px 4px 12px rgba($color: #000, $alpha: 0.02);
}

.KU_Search_Right ::v-deep .el-input__inner{
    border-radius: 10px;
    width: 320px;
    height: 48px;
    border: 1px solid rgba($color: #000, $alpha: 0.14);
    box-shadow: 0px 4px 12px rgba($color: #000, $alpha: 0.02);
}

.KU_Search_Left{
  background: #F8F9FA;
  width: 465px;
  height: 500px;
  margin-top: 100px;
  padding: 24px;
  display: inline-block;
  background: rgba(254, 254, 254, 0.8);
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
}

.KU_Search_Right{
  background: #F8F9FA;
  width: 667px;
  padding-top: 200px;
  margin-left: 60px;
  display: inline-block;
}

.Resource_Manager_Float_Block_Question{
  width: 249px;
  height: 99px;
  background: white;
  margin-right: 16px;
}

.Combine_Paper_Area_Div{
  width: 224px;
  height: 60px;
  line-height: 60px;
  margin-top: 40px;
  background: white;
  display: block;
}

.Resource_Manager_Float_Block_Subject{
  width: 149px;
  height: 99px;
  background: white;
}

.Resource_Manager_Float_Block_Paper{
  width: 212px;
  height: 99px;
  background: white;
  margin-right: 16px;
}

.Resource_Manager_Float_Block_Period{
  width: 265px;
  height: 99px;
  background: white;
}

.Resource_Manager_Float_Block{
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  display: inline-block;
  border: 1px solid #d3d3d3;
  padding: 16px;
  border-radius: 16px;
}

.Home_Area_Left{
  background: transparent;
  display: inline-block;
  width: 618px;
  height: 740px;
  padding-top: 180px;
}

.Home_Area_Left_Center{
  margin-top: 20px;
  margin-bottom: 56px;
}

.Home_Area_Right{
  background: transparent;
  display: inline-block;
  padding-top: 230px;
  width: 522px;
  height: 740px;
}

.Home_Area_Right_Block{
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  display: inline-block;
  border: 1px solid #d3d3d3;
  padding: 12px;
  border-radius: 16px;
  width: 180px;
  height: 72px;
  background: white;
}

.Home_Area_Right_Text{
  display: inline-block; 
  width: 90px; 
  height: 31px; 
  line-height: 31px; 
  margin-left: 12px;
}

@media screen and (max-width: 1024px) {
  .Normal_Home_Page{
    display: none
  }

  .Area_Row{
    width: 1024px;
    padding: 0 0px;
  }

  .Home_Area_Left{
    background: transparent;
    display: inline-block;
    width: 100%;
    padding: 44px;
    height: 740px;
    padding-top: 120px;
  }

  .Home_Area_Left_Center{
    margin-top: 20px;
    margin-bottom: 0;
  }

  .Resource_Manager_Left{
    background: #F8F9FA;
    width: 100%;
    padding: 44px;
    padding-top: 130px;
    display: inline-block;
  }

  .Resource_Manager_Float_Block_Subject{
    width: 149px;
    height: 99px;
    background: white;
    margin-right: 16px;
  }

  .Multi_Analyse_Rader_Left{
    background: transparent;
    width: 100%;
    padding: 44px;
    display: inline-block;
  }

  .Combine_Paper_Area_Left{
    background: transparent;
    height: 700px;
    width: 100%;
    padding: 44px;
    padding-top: 135px;
    display: inline-block;
  }

  .KU_Search_Left{
    background: #F8F9FA;
    width: 100%;
    height: 920px;
    padding: 44px;
    padding-top: 68px;
    margin: 0;
    display: inline-block;
    background: rgba(254, 254, 254, 0.8);
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.04);
  }

  .Narrow_KU_Example{
    background: #F8F9FA;
    width: 100%;
    height: 450px;
    margin-top: 44px;
    padding: 32px;
    display: inline-block;
    background: rgba(254, 254, 254, 0.8);
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.08);
    border-radius: 10px;
  }
}

@media screen and (min-width: 1025px) {
  .Narrow_Home_Page{
    display: none
  }
}

.Top_Nav{
    position: relative;
    top: -90px;
    width: 10px;
    height: 10px;
    background: transparent;
}
</style>
