<template>
  <div 
    style="padding-top: 10px; padding-left: 5vw; padding-right: 5vw"
    v-loading="File_Uploading"
    element-loading-text="加载中，请等待..."
    element-loading-spinner="el-icon-loading">
    <el-dialog
        :visible.sync="Wrong_Char_Dialog"
        title="格式错误提示"
        width="40%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
        <div v-html="Wrong_Char_Info"></div>
        <el-button 
            type="danger" 
            @click="Wrong_Char_Dialog = false"
            style="margin-top: 30px;"
            >确认</el-button>
    </el-dialog>
    <el-dialog
      custom-class="Multi_Type_Selector"
        :visible.sync="Multi_Type_Insert"
        :show-close="false"
        width="70%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
        <el-row slot="title" style="margin: 0px; padding: 0px">选择要插入的{{Jumping != '' ? Question_Bundle[parseInt(Jumping.split(' ')[0])].type : Type}}大题</el-row>
        <el-row type="flex" justify="start" class="Multi_Choise_Table_Top">
          <el-col :span="2" class="Multi_Choise_Table_Top_Label">
            <el-row type="flex" justify="center">
              大题序号
            </el-row>
          </el-col>
          <el-col :span="2" class="Multi_Choise_Table_Top_Label">
            <el-row type="flex" justify="center">
              题目数量
            </el-row>
          </el-col>
          <el-col :span="2" class="Multi_Choise_Table_Top_Label">
            <el-row type="flex" justify="center">
              题包总分
            </el-row>
          </el-col>
          <el-col :span="15" class="Multi_Choise_Table_Top_Label">
            <el-row type="flex" justify="center">
              题包信息
            </el-row>
          </el-col>
          <el-col :span="3" class="Multi_Choise_Table_Top_Label" style="border-right: none">
            <el-row type="flex" justify="center">
              确定添加
            </el-row>
          </el-col>
        </el-row>
        <el-row 
          type="flex" 
          justify="start" 
          v-for="(Info, Info_Index) in Multi_Info"
          :key="'Multi_' + Info_Index"
          :class="Multi_Choise_Table_Row(Info_Index)"
          :style="Info_Index == Multi_Info.length - 1? 'border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;': ''"
          >
          <el-col :span="2" style="border-right: 1px solid #409eff">
            <el-row type="flex" justify="center">
              {{Info.index != parseInt(Jumping.split(' ')[0]) ? Info.index + 1 : '当前大题'}}
            </el-row>
          </el-col>
          <el-col :span="2" style="border-right: 1px solid #409eff">
            <el-row type="flex" justify="center">
              {{Info.length}}
            </el-row>
          </el-col>
          <el-col :span="2" style="border-right: 1px solid #409eff">
            <el-row type="flex" justify="center">
              {{Info.score}}
            </el-row>
          </el-col>
          <el-col :span="15" style="border-right: 1px solid #409eff">
            <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; padding-left: 10px; padding-right: 10px; overflow: hidden">
              {{Info.desc == "" ? "暂无介绍，请尽快填写以便于区分" : Info.desc}}
            </el-row>
          </el-col>
          <el-col :span="3">
            <el-row type="flex" justify="center" style="height: 40px; line-height: 40px">
              <el-button 
                type="text" 
                @click="Waiting_Insert(Info.index)"
                >添加</el-button>
            </el-row>
          </el-col>
        </el-row>
        
    </el-dialog>
    <el-row justify="start" type="flex">
      <el-col :span="6">
        <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; padding-top: 13px">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>资源录入</el-breadcrumb-item>
                <el-breadcrumb-item>试卷资源</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="center" @click.native="toSingle()" class="toSingle">
            <span>切换至单题页面</span>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start" style="margin-top: 6vh; ">
      <el-col :span="12" @click.native="Reset_Focus()">
        <!-- 学科选择 -->
        <el-row type="flex" justify="start" style="margin-bottom: -1vh">
          <el-col :span="3">
              <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
                  <label>科目</label>
              </el-row>
          </el-col>
          <el-col :span="20" :offset="1">
              <el-row type="flex" justify="start">
                  <el-select v-model="Subject" placeholder="请选择科目">
                  <el-option
                      v-for="item in Subject_List"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                  </el-select>
              </el-row>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 学段选择 -->
        <el-row type="flex" justify="start" style="margin-top: -1vh; margin-bottom: -1vh">
          <el-col :span="3">
              <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
                  <label>学段</label>
              </el-row>
          </el-col>
          <el-col :span="20" :offset="1">
              <el-row type="flex" justify="start">
                  <el-select v-model="Period" placeholder="请选择学段">
                  <el-option
                      v-for="item in Period_List"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                  </el-select>
              </el-row>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 学段选择 -->
        <el-row type="flex" justify="start" style="margin-top: -1vh; margin-bottom: -1vh">
          <el-col :span="3">
              <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
                  <label>试卷标题</label>
              </el-row>
          </el-col>
          <el-col :span="20" :offset="1">
              <el-row type="flex" justify="start" style="width: 100%">
                  <el-input v-model="Title" placeholder="请输入试卷的标题信息"></el-input>
              </el-row>
          </el-col>
        </el-row>
        <!-- 学段选择 -->
        <el-row type="flex" justify="start" style="margin-top: 7vh; margin-bottom: -1vh">
          <el-col :span="4">
            <el-row type="flex" justify="start">  
              <el-button type="primary" style="width: 100px;" @click="Submit()">开始入库</el-button>
            </el-row>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="start">  
              <input type="file" accept=".doc, .docx" id="fileSelect" :multiple="false" style="display: none">
              <el-button type="primary" style="width: 100px;" @click="File_Import()">文件导入</el-button>
            </el-row>
          </el-col>
          <el-col :span="15" v-show="File_Name != ''" style="margin-bottom: 10px">
            <el-row type="flex" justify="start" style="overflow: hidden; height: 40px; line-height: 40px; ">  
              文件名称：{{File_Name}}
            </el-row>
          </el-col>
          <el-col :span="1" v-show="File_Name != ''">
            <el-row type="flex" justify="start">  
              <el-button type="text" @click="Paper_Data_Clear()" style="margin: 0px; padding: 10px"><i class="el-icon-close" style="font-size: 20px;"></i></el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="11" :offset="1" v-show="Using_Part != 'Fileinput'">
        <el-row type="flex" justify="center" class="PreviewPaperArea">
          <el-col>
            <el-row type="flex" justify="start" style="padding-bottom: 15px; margin-bottom: 15px; border-bottom: 2px dashed #ccc">
              <el-col :span="6">
                <el-row type="flex" justify="start" style="height: 40px; line-height: 40px">
                  <label>全卷题目速览</label>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row type="flex" justify="end">
                  <el-select v-model="Add_Bundle_Type" placeholder="">
                    <el-option 
                      v-for="Type in Type_List" 
                      :label="Type.label" 
                      :value="Type.value"
                      :key="'Add_Bundle_Of_' + Type.label"></el-option>
                  </el-select>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row type="flex" justify="end">
                  <el-button type="primary" @click="Add_New_Empty_Bundle()">手动添加题包</el-button>
                </el-row>
              </el-col>
            </el-row>
            <!-- 循环遍历每一个题包 -->
            <el-row v-if="Question_Bundle.length == 0" style="width: 100%;">
              <el-col>
                <el-row type="flex" justify="start" class="Break_Line" style="margin-bottom: 10px;">
                  关于如何创建题包：
                </el-row>
                <el-row type="flex" justify="start" class="Break_Line">
                  1：使用下方的单题录入组件，试题将自动创建尚未存在的对应类型的题包并自动加入。
                </el-row>
                <el-row type="flex" justify="start" class="Break_Line">
                  2：使用右上角的按钮，手动插入题包。
                </el-row>
                <el-row type="flex" justify="start" class="Break_Line">
                  2-1：若手动插入的题包类型为唯一存在的此类型题包，则试题仍然会自动归类。
                </el-row>
                <el-row type="flex" justify="start" class="Break_Line" style="margin-bottom: 20px;">
                  2-2：若手动插入的题包类型不是唯一存在的此类型题包，则应当填写说明项以便于区分。
                </el-row>
                <el-row type="flex" justify="start" class="Break_Line" style="margin-bottom: 10px;">
                  关于如何使用单题录入组件：
                </el-row>
                <el-row type="flex" justify="start" class="Break_Line">
                  1：选择或切换题目类型，至少填写所有必填项，点击确定提交，将自动检查语法是否符合规范，并提示应当修改哪些内容，通过检查后将加入题包。
                </el-row>
                <el-row type="flex" justify="start" class="Break_Line">
                  2：若题目类型对应的题包唯一或不存在，将自动创建新题包或加入对应类型的题包。
                </el-row>
                <el-row type="flex" justify="start" class="Break_Line">
                  3：若题目类型对应的题包不唯一，则需要用户手动在弹出的对话框中选择加入哪一个题包。
                </el-row>
                <el-row type="flex" justify="start" class="Break_Line">
                  4：切换题目类型将视为创建新题目，会清空正在录入的题目数据，请注意。
                </el-row>
              </el-col>
            </el-row>
            <el-row 
              type="flex" 
              justify="start" 
              v-for="(Bundle, Bundle_Index) in Question_Bundle"
              :key="'Total_Bundle_' + Bundle_Index">
              <el-col>
                <!-- 大序号 -->
                <el-row type="flex" justify="start">
                  <el-col :span="6">
                    <el-row type="flex" justify="start">
                      <label>{{Get_Bundle_Label(Bundle.type, Bundle_Index)}}</label>
                    </el-row>
                  </el-col>
                  <!-- 按钮区域 -->
                  <el-col :span="4">
                    <el-row type="flex" justify="start">
                      <el-col :span="8">
                        <el-row type="flex" justify="center">
                          <el-tooltip :hide-after="300" :enterable="false" class="item" effect="dark" content="题包向上移动一位" placement="top">
                            <el-button 
                              type="text" 
                              style="margin: 0px; padding: 0px;"
                              :disabled="Bundle_Index == 0 || Editing_Position != ''"
                              @click="Bundle_Move_Front(Bundle_Index)"><i class="el-icon-top" style="color: #409EFF; font-size: 18px"></i></el-button>
                          </el-tooltip>
                        </el-row>
                      </el-col>
                      <el-col :span="8">
                        <el-row type="flex" justify="center">
                          <el-tooltip :hide-after="300" :enterable="false" class="item" effect="dark" content="题包向下移动一位" placement="top">
                            <el-button 
                              type="text" 
                              style="margin: 0px; padding: 0px;"
                              :disabled="Bundle_Index == Question_Bundle.length - 1 || Editing_Position != ''"
                              @click="Bundle_Move_Back(Bundle_Index)"><i class="el-icon-bottom" style="color: #409EFF; font-size: 18px"></i></el-button>
                          </el-tooltip>
                        </el-row>
                      </el-col>
                      <el-col :span="8">
                        <el-row type="flex" justify="center">
                          <el-tooltip :hide-after="300" :enterable="false" class="item" effect="dark" content="删除此题包" placement="top">
                            <el-button 
                              type="text" 
                              style="margin: 0px; padding: 0px;"
                              :disabled="Editing_Position != ''"
                              @click="Bundle_Delete(Bundle_Index)"><i class="el-icon-close" style="color: #409EFF; font-size: 18px"></i></el-button>
                          </el-tooltip>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col 
                    :span="6"
                    :offset="2"
                    v-show="Focusing_Questions_Position.x != 0 && Focusing_Questions_Position.y != 0 && Bundle_Index == Focusing_Index">
                    <el-row type="flex" justify="start">
                      <el-col :span="4">
                        <el-row type="flex" justify="center">
                          <el-tooltip :hide-after="300" :enterable="false" class="item" effect="dark" content="标记题目前移一位" placement="top">
                            <el-button 
                              type="text" 
                              style="margin: 0px; padding: 0px;"
                              :disabled="Editing_Position != ''"
                              @click="Focus_Question_Move_Front(Bundle_Index)"><i class="el-icon-arrow-left" style="color: #409EFF; font-size: 18px"></i></el-button>
                          </el-tooltip>
                        </el-row>
                      </el-col>
                      <el-col :span="4" :offset="1">
                        <el-row type="flex" justify="center">
                          <el-tooltip :hide-after="300" :enterable="false" class="item" effect="dark" content="标记题目后移一位" placement="top">
                            <el-button 
                              type="text" 
                              style="margin: 0px; padding: 0px;"
                              :disabled="Editing_Position != ''"
                              @click="Focus_Question_Move_Back(Bundle_Index)"><i class="el-icon-arrow-right" style="color: #409EFF; font-size: 18px"></i></el-button>
                          </el-tooltip>
                        </el-row>
                      </el-col>
                      <el-col :span="4" :offset="1">
                        <el-row type="flex" justify="center">
                          <el-tooltip :hide-after="300" :enterable="false" class="item" effect="dark" content="标记题目删除" placement="top">
                            <el-button 
                              type="text" 
                              style="margin: 0px; padding: 0px;"
                              :disabled="Editing_Position != ''"
                              @click="Focus_Question_Delete(Bundle_Index)"><i class="el-icon-delete" style="color: #409EFF; font-size: 18px"></i></el-button>
                          </el-tooltip>
                        </el-row>
                      </el-col>
                      <el-col :span="4" :offset="1">
                        <el-row type="flex" justify="center">
                          <el-tooltip :hide-after="300" :enterable="false" class="item" effect="dark" content="标记题目导入编辑区" placement="top">
                            <el-button 
                              type="text" 
                              style="margin: 0px; padding: 0px;"
                              @click="Focus_Question_Edit(Bundle_Index)"><i class="el-icon-edit" style="color: #409EFF; font-size: 18px"></i></el-button>
                          </el-tooltip>
                        </el-row>
                      </el-col>
                      <el-col :span="4" :offset="1" v-show="Focus_Jump_Check(Bundle.type)">
                        <el-row type="flex" justify="center">
                          <el-tooltip :hide-after="300" :enterable="false" class="item" effect="dark" content="移动至某个同类型题包" placement="top">
                            <el-button 
                              type="text" 
                              style="margin: 0px; padding: 0px;"
                              @click="Focus_Question_Jump(Bundle_Index)"><i class="el-icon-position" style="color: #409EFF; font-size: 18px"></i></el-button>
                          </el-tooltip>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="start">
                  <el-col :span="3">
                    <el-row type="flex" justify="start" style="height: 20px; line-height: 20px; margin-top: 5px;">
                      题目说明：
                    </el-row>
                  </el-col>
                  <el-col :span="21">
                    <el-row type="flex" justify="start">
                      <el-input v-model="Question_Bundle[Bundle_Index].desc" class="Desc_Input"></el-input>
                    </el-row>
                  </el-col>
                </el-row>
                <!-- 每道题都搞一下， -->
                <el-row type="flex" justify="start" style="margin-bottom: 5px; width: 100%">
                  <el-col>
                    <el-row 
                      v-for="TBQ_Row_Index in Math.ceil(Bundle.list.length/24)"
                      :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index"
                      type="flex" justify="start"
                      style="width: 100%">
                      <el-col 
                        v-for="Question_Index in Get_Question_Row_Length(Bundle.list.length, TBQ_Row_Index)" 
                        :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index"
                        :span="1"
                        >
                        <el-popover 
                          placement="left"
                          width="800"
                          :open-delay="500"
                          trigger="hover"
                          :disabled="Draging_Questions_Index != -1"
                          :ref="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Pop'">
                          <div class="Total_Bundle_Popover_Main">
                            <!-- 触发popover的项 -->
                            <el-row type="flex" justify="start" style="margin-bottom: 10px;">
                              <el-col :span="2">
                                  <el-row type="flex" justify="end" style="font-weight: bold;">
                                      <span>题干：</span>
                                  </el-row>
                              </el-col>
                              <el-col :span="22">
                                  <el-row type="flex" justify="start">
                                      <Mathdown 
                                        :content="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].stem" 
                                        :name="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index +  '_' + Question_Index + '_Stem'"></Mathdown>
                                  </el-row>
                              </el-col>
                            </el-row>
                            <!-- 题干的配图部分 -->
                            <el-row type="flex" justify="end" v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].stem_image.length > 0">
                                <el-col :span="22">
                                    <el-row 
                                        type="flex" 
                                        justify="start" 
                                        v-for="TBQ_Stem_Pic_Row_Index in Math.ceil(Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].stem_image.length/12)"
                                        :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Stem_Pic_Row_' + TBQ_Stem_Pic_Row_Index"
                                        style="margin-bottom: 10px">
                                        <el-col 
                                            :span="2" 
                                            v-for="TBQ_Stem_Pic_Col_Index in 12" 
                                            :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Stem_Pic_Row_' + TBQ_Stem_Pic_Row_Index + '_' + TBQ_Stem_Pic_Col_Index">
                                            <el-row 
                                                type="flex" 
                                                justify="center" 
                                                v-if="(TBQ_Stem_Pic_Row_Index - 1) * 12 + TBQ_Stem_Pic_Col_Index - 1 < Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].stem_image.length"
                                                >
                                                <img height="30" :src="Get_Picture_Src('stem_image', Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1, TBQ_Stem_Pic_Row_Index, TBQ_Stem_Pic_Col_Index)">   
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            
                            <!-- 选项部分 -->
                            <el-row 
                                type="flex" 
                                justify="start" 
                                v-for="(Option, Option_Index) in Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].options" 
                                :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Opt_' + Option_Index"
                                style="margin-bottom: 10px;">
                                <el-col>
                                    <!-- 选项文字 -->
                                    <el-row type="flex" justify="start">
                                        <el-col :span="2">
                                            <el-row type="flex" justify="end" style="font-weight: bold;">
                                                <span>{{Get_Option_Label(Option_Index)}}：</span>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="22">
                                            <el-row type="flex" justify="start">
                                                <Mathdown 
                                                  :content="Option" 
                                                  :name="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Opt_' + Option_Index"></Mathdown>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                    <el-row style="margin-top: 10px;" v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].options_image[Option_Index].length > 0">
                                        <el-col :span="22" :offset="2">
                                            <el-row 
                                                type="flex" 
                                                justify="start"
                                                v-for="TBQ_Option_Pic_Row_Index in Math.ceil(Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].options_image[Option_Index].length/12)"
                                                :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Opt_' + Option_Index + '_Pic_Row_' + TBQ_Option_Pic_Row_Index">
                                                <el-col 
                                                    :span="2"
                                                    v-for="TBQ_Option_Pic_Col_Index in 12"
                                                    :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Opt_' + Option_Index + '_Pic_Row_' + TBQ_Option_Pic_Row_Index + 'Col_' + TBQ_Option_Pic_Col_Index">
                                                    <el-row 
                                                        type="flex" 
                                                        justify="center" 
                                                        v-if="(TBQ_Option_Pic_Row_Index - 1) * 12 + TBQ_Option_Pic_Col_Index - 1 < Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].options_image[Option_Index].length"
                                                        >
                                                        <img height="30" :src="Get_Picture_Src('options_image ' + Option_Index , Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1, TBQ_Option_Pic_Row_Index, TBQ_Option_Pic_Col_Index)">
                                                    </el-row>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>

                            <!-- 最烦人的部分，小题，需要分类讨论，1：综合题的小题；2：不是综合题的小题 -->
                            <!-- 反正选择题和填空题也没有小题这一说，遍历都遍历不进去 -->
                            <!-- 综合题的小题部分 -->
                            <el-row v-if="Bundle.type == '综合题'">
                              <el-col>
                                <!-- 每道小题都是独立题目 -->
                                <!-- 小题部分 -->
                                <el-row 
                                    type="flex"
                                    justify="end"
                                    v-for="(Big_Sub_Question, Big_Sub_Question_Index) in Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions"
                                    :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index"
                                    style="margin-bottom: 20px">
                                    <!-- 退一格 -->
                                    <el-col :span="22">
                                        <!-- 题干 -->
                                        <el-row 
                                            type="flex" 
                                            justify="start" 
                                            :style="
                                                ['单选题', '多选题', '判断题', '简答题', '计算题'].indexOf(Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].type) != -1 
                                                ? 'margin-bottom: 10px' 
                                                : ''">
                                            <el-col :span="2">
                                                <el-row type="flex" justify="start" style="font-weight: bold;">
                                                    <span>（{{Big_Sub_Question_Index+1}}）</span>
                                                </el-row>
                                            </el-col>
                                            <el-col :span="22">
                                                <el-row type="flex" justify="start">
                                                    <Mathdown 
                                                      :content="Big_Sub_Question.stem" 
                                                      :name="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Stem'"></Mathdown>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                        <!-- 题干配图 -->
                                        <el-row 
                                            type="flex" 
                                            justify="end" 
                                            style="margin-top: 5px; margin-bottom: 5px"
                                            v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].stem_image.length > 0">
                                            <el-col :span="22">
                                                <el-row 
                                                    type="flex" 
                                                    justify="start"
                                                    style="margin-top: 5px; margin-bottom: 5px"
                                                    v-for="Pre_Mix_Stem_Pic_Row_Index in Math.ceil(Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].stem_image.length/12)"
                                                    :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Stem_Pic_Row_' + Pre_Mix_Stem_Pic_Row_Index">
                                                    <el-col 
                                                        :span="2"
                                                        v-for="Pre_Mix_Stem_Pic_Col_Index in 12"
                                                        :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Stem_Pic_Row_' + Pre_Mix_Stem_Pic_Row_Index + 'Col_' + Pre_Mix_Stem_Pic_Col_Index">
                                                        <el-row 
                                                            type="flex" 
                                                            justify="center" 
                                                            v-if="(Pre_Mix_Stem_Pic_Row_Index - 1) * 12 + Pre_Mix_Stem_Pic_Col_Index - 1 < Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].stem_image.length"
                                                            >
                                                            <img height="30" :src="Get_Picture_Src('stem_image ' + Big_Sub_Question_Index, Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1, Pre_Mix_Stem_Pic_Row_Index, Pre_Mix_Stem_Pic_Col_Index)">
                                                        </el-row>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                        <!-- 选择题的选项部分 -->
                                        <el-row 
                                            type="flex"
                                            justify="start"
                                            style="margin-top: 5px; margin-bottom: 5px"
                                            v-show="['单选题', '多选题', '判断题'].indexOf(Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].type) != -1"
                                            v-for="(Pre_Option, Pre_Option_Index) in Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].options"
                                            :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Option_' + Pre_Option_Index">
                                            <el-col>
                                                <el-row type="flex" justify="start">
                                                    <el-col :span="2">
                                                        <el-row type="flex" justify="center">
                                                            <label>{{Get_Option_Label(Pre_Option_Index)}}:</label>
                                                        </el-row>
                                                    </el-col>
                                                    <el-col :span="22">
                                                        <el-row type="flex" justify="start">
                                                            <Mathdown 
                                                              :content="Pre_Option" 
                                                              :name="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Options_' + Pre_Option_Index"></Mathdown>
                                                        </el-row>
                                                    </el-col>
                                                </el-row>
                                                <el-row type="flex" justify="end" v-show="Big_Sub_Question.options_image[Pre_Option_Index].length > 0">
                                                    <el-col :span="22">
                                                        <el-row 
                                                            type="flex" 
                                                            justify="start"
                                                            style="margin-top: 5px; margin-bottom: 5px"
                                                            v-for="Pre_Mix_Opt_Pic_Row_Index in Math.ceil(Big_Sub_Question.options_image[Pre_Option_Index].length/12)"
                                                            :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index  + '_Options_' + Pre_Option_Index + '_Pic_Row_' + Pre_Mix_Opt_Pic_Row_Index">
                                                            <el-col 
                                                                :span="2"
                                                                v-for="Pre_Mix_Opt_Pic_Col_Index in 12"
                                                                :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index  + '_Options_' + Pre_Option_Index + '_Pic_Row_' + Pre_Mix_Opt_Pic_Row_Index + 'Col_' + Pre_Mix_Opt_Pic_Col_Index">
                                                                <el-row 
                                                                    type="flex" 
                                                                    justify="center" 
                                                                    v-if="(Pre_Mix_Opt_Pic_Row_Index - 1) * 12 + Pre_Mix_Opt_Pic_Col_Index - 1 < Big_Sub_Question.options_image[Pre_Option_Index].length"
                                                                    >
                                                                    <img height="30" :src="Get_Picture_Src('options_image ' + Big_Sub_Question_Index + ' ' + Pre_Option_Index, Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1, Pre_Mix_Opt_Pic_Row_Index, Pre_Mix_Opt_Pic_Col_Index)">
                                                                </el-row>
                                                            </el-col>
                                                        </el-row>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                        <!-- 简答题，计算题的部分 - 小题 -->
                                        <el-row 
                                            type="flex"
                                            justify="start"
                                            style="margin-top: 5px; margin-bottom: 5px"
                                            v-show="['简答题', '计算题'].indexOf(Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].type) != -1"
                                            v-for="(Pre_Small_Sub_Question, Pre_Small_Sub_Question_Index) in Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].sub_questions"
                                            :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_S_SQ_' + Pre_Small_Sub_Question_Index">
                                            <el-col>
                                                <el-row type="flex" justify="start">
                                                    <el-col :span="2">
                                                        <el-row type="flex" justify="end">
                                                            <label>({{Pre_Small_Sub_Question_Index + 1}})：</label>
                                                        </el-row>
                                                    </el-col>
                                                    <el-col :span="22">
                                                        <el-row type="flex" justify="start">
                                                            <Mathdown 
                                                              :content="Pre_Small_Sub_Question" 
                                                              :name="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_S_SQ_' + Pre_Small_Sub_Question_Index"></Mathdown>
                                                        </el-row>
                                                    </el-col>
                                                </el-row>
                                                <el-row type="flex" justify="end" v-show="Big_Sub_Question.sub_questions_image[Pre_Small_Sub_Question_Index].length > 0">
                                                    <el-col :span="22">
                                                        <el-row 
                                                            type="flex" 
                                                            justify="start"
                                                            v-for="Pre_Mix_S_SQ_Pic_Row_Index in Math.ceil(Big_Sub_Question.sub_questions_image[Pre_Small_Sub_Question_Index].length/12)"
                                                            :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index  + '_S_SQ_' + Pre_Small_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_S_SQ_Pic_Row_Index">
                                                            <el-col 
                                                                :span="2"
                                                                v-for="Pre_Mix_S_SQ_Pic_Col_Index in 12"
                                                                :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index  + '_S_SQ_' + Pre_Small_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_S_SQ_Pic_Row_Index + 'Col_' + Pre_Mix_S_SQ_Pic_Col_Index">
                                                                <el-row 
                                                                    type="flex" 
                                                                    justify="center" 
                                                                    v-if="(Pre_Mix_S_SQ_Pic_Row_Index - 1) * 12 + Pre_Mix_S_SQ_Pic_Col_Index - 1 < Big_Sub_Question.sub_questions_image[Pre_Small_Sub_Question_Index].length"
                                                                    >
                                                                    <img height="30" :src="Get_Picture_Src('sub_questions_image ' + Big_Sub_Question_Index + ' ' + Pre_Small_Sub_Question_Index, Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1, Pre_Mix_S_SQ_Pic_Row_Index, Pre_Mix_S_SQ_Pic_Col_Index)">
                                                                </el-row>
                                                            </el-col>
                                                        </el-row>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                        <!-- 答案 -->
                                        <el-row 
                                            type="flex" 
                                            justify="start" 
                                            style="margin-top: 5px; margin-bottom: 5px"
                                            v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].answer.length > 0">
                                            <el-col :span="2">
                                                <el-row type="flex" justify="start" style="font-weight: bold;">
                                                    <span>答案</span>
                                                </el-row>
                                            </el-col>
                                            <el-col :span="22">
                                                <el-row type="flex" justify="start">
                                                    <Mathdown 
                                                      :content="Big_Sub_Question.answer" 
                                                      :name="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Answer'"></Mathdown>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                        <!-- 答案配图 -->
                                        <el-row 
                                            type="flex" 
                                            justify="end" 
                                            style="margin-top: 5px; margin-bottom: 5px"
                                            v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].answer_image.length > 0">
                                            <el-col :span="22">
                                                <el-row 
                                                    type="flex" 
                                                    justify="start"
                                                    v-for="Pre_Mix_Answer_Pic_Row_Index in Math.ceil(Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].answer_image.length/12)"
                                                    :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Answer_Pic_Row_Index">
                                                    <el-col 
                                                        :span="2"
                                                        v-for="Pre_Mix_Answer_Pic_Col_Index in 12"
                                                        :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Answer_Pic_Row_Index + 'Col_' + Pre_Mix_Answer_Pic_Col_Index">
                                                        <el-row 
                                                            type="flex" 
                                                            justify="center" 
                                                            v-if="(Pre_Mix_Answer_Pic_Row_Index - 1) * 12 + Pre_Mix_Answer_Pic_Col_Index - 1 < Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].answer_image.length"
                                                            >
                                                            <img height="30" :src="Get_Picture_Src('answer_image ' + Big_Sub_Question_Index , Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1, Pre_Mix_Answer_Pic_Row_Index, Pre_Mix_Answer_Pic_Col_Index)">
                                                        </el-row>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                        <!-- 解析 -->
                                        <el-row 
                                            type="flex" 
                                            justify="start" 
                                            style="margin-top: 5px; margin-bottom: 5px"
                                            v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].analysis.length > 0">
                                            <el-col :span="2">
                                                <el-row type="flex" justify="start" style="font-weight: bold;">
                                                    <span>解析</span>
                                                </el-row>
                                            </el-col>
                                            <el-col :span="22">
                                                <el-row type="flex" justify="start">
                                                    <Mathdown :content="Big_Sub_Question.analysis" :name="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Analysis'"></Mathdown>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                        <!-- 解析配图 -->
                                        <el-row 
                                            type="flex" 
                                            justify="end" 
                                            style="margin-top: 5px; margin-bottom: 5px"
                                            v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].analysis_image.length > 0">
                                            <el-col :span="22">
                                                <el-row 
                                                    type="flex" 
                                                    justify="start"
                                                    v-for="Pre_Mix_Analysis_Pic_Row_Index in Math.ceil(Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].analysis_image.length/12)"
                                                    :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Analysis_Pic_Row_Index">
                                                    <el-col 
                                                        :span="2"
                                                        v-for="Pre_Mix_Analysis_Pic_Col_Index in 12"
                                                        :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Analysis_Pic_Row_Index + 'Col_' + Pre_Mix_Analysis_Pic_Col_Index">
                                                        <el-row 
                                                            type="flex" 
                                                            justify="center" 
                                                            v-if="(Pre_Mix_Analysis_Pic_Row_Index - 1) * 12 + Pre_Mix_Analysis_Pic_Col_Index - 1 < Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions[Big_Sub_Question_Index].analysis_image.length"
                                                            >
                                                            <img height="30" :src="Get_Picture_Src('analysis_image ' + Big_Sub_Question_Index, Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1, Pre_Mix_Analysis_Pic_Row_Index, Pre_Mix_Analysis_Pic_Col_Index)">
                                                        </el-row>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                              </el-col>
                            </el-row>
                            <!-- 简答题，计算题的小题部分 -->
                            <el-row v-else style="margin-bottom: 5px">
                              <!-- 每个小题分两部分，一部分文字，一部分配图 -->
                              <el-col>
                                <!-- 小题竖直排列 -->
                                <el-row
                                  type="flex"
                                  justify="end"
                                  v-for="(Sub_Question, Sub_Question_Index) in Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions"
                                  :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_SQ_' + Sub_Question_Index">
                                  <el-col>
                                    <!-- 文字部分 -->
                                    <el-row type="flex" justify="start">
                                      <el-col :span="2">
                                        <el-row type="flex" justify="end">
                                          <label>（{{Sub_Question_Index + 1}}）:</label>
                                        </el-row>
                                      </el-col>
                                      <el-col :span="22">
                                        <el-row type="flex" justify="start">
                                          <Mathdown 
                                            :content="Sub_Question" 
                                            :name="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_SQ_' + Sub_Question_Index"></Mathdown>
                                        </el-row>
                                      </el-col>
                                    </el-row>
                                    <!-- 配图部分 -->
                                    <el-row style="margin-top: 5px; margin-bottom: 5px" v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions_image[Sub_Question_Index].length > 0">
                                      <!-- 退两格 -->
                                      <el-col :span="22" :offset="2">
                                        <el-row 
                                          type="flex" 
                                          justify="start"
                                          v-for="TBQ_SQ_Pic_Row_Index in Math.ceil(Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions_image[Sub_Question_Index].length/12)"
                                          :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_SQ_' + Sub_Question_Index + '_Pic_Row_' + TBQ_SQ_Pic_Row_Index">
                                          <el-col 
                                            :span="2"
                                            v-for="TBQ_SQ_Pic_Col_Index in 12"
                                            :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_SQ_' + Sub_Question_Index + '_Pic_Row_' + TBQ_SQ_Pic_Row_Index + 'Col_' + TBQ_SQ_Pic_Col_Index">
                                            <el-row 
                                                type="flex" 
                                                justify="center" 
                                                v-if="(TBQ_SQ_Pic_Row_Index - 1) * 12 + TBQ_SQ_Pic_Col_Index - 1 < Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].sub_questions_image[Sub_Question_Index].length"
                                                >
                                                <img height="30" :src="Get_Picture_Src('sub_questions_image ' + Sub_Question_Index , Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1, TBQ_SQ_Pic_Row_Index, TBQ_SQ_Pic_Col_Index)">
                                            </el-row>
                                          </el-col>
                                        </el-row>
                                      </el-col>
                                    </el-row>
                                  </el-col>
                                </el-row>
                              </el-col>
                            </el-row>

                            <!-- 答案部分 -->
                            <el-row type="flex" justify="start" style="margin-bottom: 10px;" v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].answer_image.length > 0 || Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].answer.length > 0">
                                <el-col :span="2">
                                    <el-row type="flex" justify="end" style="font-weight: bold;">
                                        <span>答案：</span>
                                    </el-row>
                                </el-col>
                                <el-col :span="22">
                                    <el-row type="flex" justify="start">
                                        <Mathdown 
                                          :content="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].answer" 
                                          :name="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Answer'"></Mathdown>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 答案配图 -->
                            <el-row type="flex" justify="end" v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].answer_image.length > 0">
                                <el-col :span="22">
                                    <el-row 
                                        type="flex" 
                                        justify="start" 
                                        v-for="TBQ_Answer_Pic_Row_Index in Math.ceil(Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].answer_image.length/12)"
                                        :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Answer_Pic_Row_' + TBQ_Answer_Pic_Row_Index"
                                        style="margin-bottom: 10px;">
                                        <el-col 
                                            :span="2" 
                                            v-for="TBQ_Answer_Pic_Col_Index in 12" 
                                            :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Answer_Pic_Row_' + TBQ_Answer_Pic_Row_Index + '_' + TBQ_Answer_Pic_Col_Index">
                                            <el-row 
                                                type="flex" 
                                                justify="center" 
                                                v-if="(TBQ_Answer_Pic_Row_Index - 1) * 12 + TBQ_Answer_Pic_Col_Index - 1 < Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].answer_image.length"
                                                >
                                                <img height="30" :src="Get_Picture_Src('answer_image', Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1, TBQ_Answer_Pic_Row_Index, TBQ_Answer_Pic_Col_Index)">   
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            
                            <!-- 解析部分 -->
                            <el-row type="flex" justify="start" style="margin-bottom: 10px;" v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].analysis_image.length > 0 || Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].analysis.length > 0">
                                <el-col :span="2">
                                    <el-row type="flex" justify="end" style="font-weight: bold;">
                                        <span>解析：</span>
                                    </el-row>
                                </el-col>
                                <el-col :span="22">
                                    <el-row type="flex" justify="start">
                                        <Mathdown 
                                          :content="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].analysis" 
                                          :name="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Analysis'"></Mathdown>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 解析部分配图 -->
                            <el-row type="flex" justify="end" v-show="Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].analysis_image.length > 0">
                                <el-col :span="22">
                                    <el-row 
                                        type="flex" 
                                        justify="start" 
                                        v-for="TBQ_Analysis_Pic_Row_Index in Math.ceil(Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].analysis_image.length/12)"
                                        :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Analysis_Pic_Row_' + TBQ_Analysis_Pic_Row_Index">
                                        <el-col 
                                            :span="2" 
                                            v-for="TBQ_Analysis_Pic_Col_Index in 12" 
                                            :key="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Analysis_Pic_Row_' + TBQ_Analysis_Pic_Row_Index + '_' + TBQ_Analysis_Pic_Col_Index">
                                            <el-row 
                                                type="flex" 
                                                justify="center" 
                                                v-if="(TBQ_Analysis_Pic_Row_Index - 1) * 12 + TBQ_Analysis_Pic_Col_Index - 1 < Bundle.list[(TBQ_Row_Index - 1) * 24 + Question_Index - 1].analysis_image.length"
                                                >
                                                <img height="30" :src="Get_Picture_Src('analysis_image', Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1, TBQ_Analysis_Pic_Row_Index, TBQ_Analysis_Pic_Col_Index)">   
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                          </div>
                          <el-row type="flex" justify="center">
                            <el-button 
                              type="primary" 
                              size="small" 
                              plain 
                              style="margin-right: 15px" 
                              @click="Question_Move_Front(
                                Bundle_Index, 
                                (TBQ_Row_Index - 1) * 24 + Question_Index - 1,
                                'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Pop')" 
                              :disabled="Question_Index == 1 || Editing_Position != ''">前移</el-button>
                            <el-button 
                              type="primary" 
                              size="small" 
                              plain 
                              style="margin-right: 15px" 
                              @click="Question_Move_Back(Bundle_Index, 
                                (TBQ_Row_Index - 1) * 24 + Question_Index - 1,
                                'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Pop')" 
                              :disabled="Question_Index == Bundle.list.length || Editing_Position != ''">后移</el-button>
                            <el-button 
                              type="warning" 
                              size="small" 
                              plain 
                              style="margin-right: 15px"
                              @click="Question_Edit(Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1)">编辑</el-button>
                            <el-button 
                              type="danger" 
                              size="small" 
                              plain 
                              style="margin-right: 15px"
                              :disabled="Editing_Position != ''"
                              @click="Question_Delete(Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1)">删除</el-button>
                          </el-row>
                          <el-row 
                            type="flex" 
                            justify="center" 
                            class="Ques_Button Un_Selectable" 
                            :style="Get_Cursor('Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Label', Bundle_Index, (TBQ_Row_Index - 1) * 24 + Question_Index - 1)"
                            slot="reference"
                            v-if="(TBQ_Row_Index - 1) * 24 + Question_Index - 1 < Bundle.list.length"
                            :ref="'Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Label'"
                            @mousedown.native="Get_Document_Pos_Start('Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Label', Bundle_Index)"
                            @mouseup.native="Get_Document_Pos_End('Total_Bundle_' + Bundle_Index + '_Row_' + TBQ_Row_Index + '_' + Question_Index + '_Label', Bundle_Index)"
                            >
                            {{(TBQ_Row_Index - 1) * 24 + Question_Index}}
                          </el-row>
                        </el-popover>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row type="flex" justify="center" style="margin-bottom: 4vh">
      <el-col :span="8">
        <el-row 
          type="flex" 
          justify="center" 
          :class="Part_Class('Input')"
          @click.native="Change_Using_Part('Input')"
          style="height: 30px; line-height: 30px; width: 100%; border-top-left-radius: 15px; border-bottom-left-radius: 15px">
          题目录入
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-row 
          type="flex" 
          justify="center" 
          :class="Part_Class('Preview')"
          @click.native="Change_Using_Part('Preview')"
          style="height: 30px; line-height: 30px; width: 100%; ">
          整卷预览
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-row 
          type="flex" 
          justify="center" 
          :class="Part_Class('Fileinput')"
          @click.native="Change_Using_Part('Fileinput')"
          style="height: 30px; line-height: 30px; width: 100%; border-top-right-radius: 15px; border-bottom-right-radius: 15px">
          文件导入预览
        </el-row>
      </el-col>
    </el-row>
    <!-- 题目录入组件 -->
    <div v-show="Using_Part == 'Input'"  @click="Reset_Focus()">
      <el-row type="flex" justify="start" style="margin-top: 2vh;">
          <el-col :span="2">
              <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
                  <label>题型</label>
              </el-row>
          </el-col>
          <el-col :span="13">
              <el-row type="flex" justify="start" style="height: 40px; line-height: 40px;">
                  <el-col v-for="Type in Type_List" :key="'Ques_Type_' + Type.label" :span="24/8">
                      <el-row 
                          type="flex" 
                          justify="center" 
                          :class="Get_Type_Button_Class(Type)"
                          @click.native="Type_Change(Type.value)">
                          {{Type.label}}
                      </el-row>
                  </el-col>
              </el-row>
          </el-col>
          <el-col :span="4" :offset="5" v-show="Editing_Position == ''">
            <el-row type="flex" justify="center" class="Building_Info">
              {{Get_Building_Info()}}
            </el-row>
          </el-col>
          <el-col :span="4" :offset="5" v-show="Editing_Position != ''">
            <el-row type="flex" justify="center" class="Editing_Info">
              {{Get_Editing_Info()}}
            </el-row>
          </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="border: 3px solid #409EFF; min-height: 30vh; border-radius: 15px; margin-top: 30px; margin-bottom: 30px;">
          <OptionQuestions 
            :key="'Opt_Input_' + Refresh"
            @Emit_And_Submit="Prepare_For_Submit" 
            style="width: 100%" 
            v-if="['单选题', '多选题', '判断题'].indexOf(Type) != -1" 
            :detailType.sync="Type"></OptionQuestions>
          <FillQuestions  
            :key="'Fill_Input_' + Refresh"
            @Emit_And_Submit="Prepare_For_Submit" 
            style="width: 100%" 
            v-if="['填空题'].indexOf(Type) != -1" 
            :detailType.sync="Type"></FillQuestions>
          <AnswerQuestions  
            :key="'Answer_Input_' + Refresh"
            @Emit_And_Submit="Prepare_For_Submit" 
            style="width: 100%" 
            v-if="['简答题', '计算题'].indexOf(Type) != -1" 
            :detailType.sync="Type"></AnswerQuestions>
          <MixQuestions  
            :key="'Mix_Input_' + Refresh"
            @Emit_And_Submit="Prepare_For_Submit" 
            style="width: 100%" 
            v-if="['综合题'].indexOf(Type) != -1" 
            :detailType.sync="Type"></MixQuestions>
      </el-row>
    </div>
    <!-- 全卷内容预览 -->
    <div v-show="Using_Part == 'Preview'"  @click="Reset_Focus()" style="padding-left: 2vw; padding-top: 20px; padding-right: 2vw; border: 3px solid #409EFF; min-height: 30vh; border-radius: 15px; margin-top: 30px; margin-bottom: 30px;">
      <el-row type="flex" justify="center">
        <label style="font-size: 18px">{{Title == '' ? '暂无试卷标题' : Title}}</label>
      </el-row>
      <el-row 
        type="flex" 
        justify="start" 
        v-for="(Bundle, Bundle_Index) in Question_Bundle"
        :key="'Total_Bundle_' + Bundle_Index"
        style="margin-top: 20px;">
        <el-col>
          <!-- 大序号 -->
          <el-row type="flex" justify="start">
            <el-col :span="6">
              <el-row type="flex" justify="start">
                <label>{{Get_Bundle_Label(Bundle.type, Bundle_Index)}}</label>
              </el-row>
            </el-col>
          </el-row>
          <!-- 每道题都搞一下， -->
          <el-row type="flex" justify="start" style=" width: 100%">
            <el-col>
              <el-row 
                v-for="Question_Index in Bundle.list.length"
                :key="'Total_Bundle_' + Bundle_Index + '_Row_' + Question_Index"
                type="flex" justify="start"
                style="width: 100%">
                <el-col>
                  <el-row type="flex" justify="start" style="margin-bottom: 10px; margin-top: 10px;">
                    <el-col :span="2">
                        <el-row type="flex" justify="end" style="font-weight: bold;">
                            <span>{{Get_Preview_Index(Bundle_Index, Question_Index)}}：</span>
                        </el-row>
                    </el-col>
                    <el-col :span="22">
                        <el-row type="flex" justify="start">
                            <Mathdown 
                              :content="Bundle.list[Question_Index - 1].stem" 
                              :name="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Stem'"></Mathdown>
                        </el-row>
                    </el-col>
                  </el-row>
                  <!-- 题干的配图部分 -->
                  <el-row type="flex" justify="end" v-show="Bundle.list[Question_Index - 1].stem_image.length > 0">
                      <el-col :span="22">
                          <el-row 
                              type="flex" 
                              justify="start" 
                              v-for="TBQ_Stem_Pic_Row_Index in Math.ceil(Bundle.list[Question_Index - 1].stem_image.length/12)"
                              :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Stem_Pic_Row_' + TBQ_Stem_Pic_Row_Index"
                              style="margin-bottom: 10px">
                              <el-col 
                                  :span="2" 
                                  v-for="TBQ_Stem_Pic_Col_Index in 12" 
                                  :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Stem_Pic_Row_' + TBQ_Stem_Pic_Row_Index + '_' + TBQ_Stem_Pic_Col_Index">
                                  <el-row 
                                      type="flex" 
                                      justify="center" 
                                      v-if="(TBQ_Stem_Pic_Row_Index - 1) * 12 + TBQ_Stem_Pic_Col_Index - 1 < Bundle.list[Question_Index - 1].stem_image.length"
                                      >
                                      <img height="30" :src="Get_Picture_Src('stem_image', Bundle_Index, Question_Index - 1, TBQ_Stem_Pic_Row_Index, TBQ_Stem_Pic_Col_Index)">   
                                  </el-row>
                              </el-col>
                          </el-row>
                      </el-col>
                  </el-row>
                  
                  <!-- 选项部分 -->
                  <el-row 
                      type="flex" 
                      justify="start" 
                      v-for="(Option, Option_Index) in Bundle.list[Question_Index - 1].options" 
                      :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Opt_' + Option_Index"
                      style="margin-bottom: 10px;">
                      <el-col>
                          <el-row type="flex" justify="start">
                              <el-col :span="2">
                                  <el-row type="flex" justify="end" style="font-weight: bold;">
                                      <span>{{Get_Option_Label(Option_Index)}}：</span>
                                  </el-row>
                              </el-col>
                              <el-col :span="22">
                                  <el-row type="flex" justify="start">
                                      <Mathdown 
                                        :content="Option" 
                                        :name="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Opt_' + Option_Index"></Mathdown>
                                  </el-row>
                              </el-col>
                          </el-row>
                          <el-row style="margin-top: 10px;" v-show="Bundle.list[Question_Index - 1].options_image[Option_Index].length > 0">
                              <el-col :span="22" :offset="2">
                                  <el-row 
                                      type="flex" 
                                      justify="start"
                                      v-for="TBQ_Option_Pic_Row_Index in Math.ceil(Bundle.list[Question_Index - 1].options_image[Option_Index].length/12)"
                                      :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Opt_' + Option_Index + '_Pic_Row_' + TBQ_Option_Pic_Row_Index">
                                      <el-col 
                                          :span="2"
                                          v-for="TBQ_Option_Pic_Col_Index in 12"
                                          :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Opt_' + Option_Index + '_Pic_Row_' + TBQ_Option_Pic_Row_Index + 'Col_' + TBQ_Option_Pic_Col_Index">
                                          <el-row 
                                              type="flex" 
                                              justify="center" 
                                              v-if="(TBQ_Option_Pic_Row_Index - 1) * 12 + TBQ_Option_Pic_Col_Index - 1 < Bundle.list[Question_Index - 1].options_image[Option_Index].length"
                                              >
                                              <img height="30" :src="Get_Picture_Src('options_image ' + Option_Index , Bundle_Index, Question_Index - 1, TBQ_Option_Pic_Row_Index, TBQ_Option_Pic_Col_Index)">
                                          </el-row>
                                      </el-col>
                                  </el-row>
                              </el-col>
                          </el-row>
                      </el-col>
                  </el-row>

                  <!-- 最烦人的部分，小题，需要分类讨论，1：综合题的小题；2：不是综合题的小题 -->
                  <!-- 反正选择题和填空题也没有小题这一说，遍历都遍历不进去 -->
                  <!-- 综合题的小题部分 -->
                  <el-row v-if="Bundle.type == '综合题'">
                    <el-col>
                      <el-row 
                          type="flex"
                          justify="end"
                          v-for="(Big_Sub_Question, Big_Sub_Question_Index) in Bundle.list[Question_Index - 1].sub_questions"
                          :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index"
                          style="margin-bottom: 20px">
                          <el-col :span="23">
                            <!-- 题干两项 -->
                              <el-row 
                                  type="flex" 
                                  justify="start" 
                                  :style="
                                      ['单选题', '多选题', '判断题', '简答题', '计算题'].indexOf(Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].type) != -1 
                                      ? 'margin-bottom: 10px' 
                                      : ''">
                                  <el-col :span="2">
                                      <el-row type="flex" justify="end" style="font-weight: bold;">
                                          <span>（{{Big_Sub_Question_Index+1}}）</span>
                                      </el-row>
                                  </el-col>
                                  <el-col :span="22">
                                      <el-row type="flex" justify="start">
                                          <Mathdown 
                                            :content="Big_Sub_Question.stem" 
                                            :name="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Stem'"></Mathdown>
                                      </el-row>
                                  </el-col>
                              </el-row>
                              <el-row 
                                  type="flex" 
                                  justify="end" 
                                  style="margin-top: 5px; margin-bottom: 5px"
                                  v-show="Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].stem_image.length > 0">
                                  <el-col :span="22">
                                      <el-row 
                                          type="flex" 
                                          justify="start"
                                          style="margin-top: 5px; margin-bottom: 5px"
                                          v-for="Pre_Mix_Stem_Pic_Row_Index in Math.ceil(Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].stem_image.length/12)"
                                          :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Stem_Pic_Row_' + Pre_Mix_Stem_Pic_Row_Index">
                                          <el-col 
                                              :span="2"
                                              v-for="Pre_Mix_Stem_Pic_Col_Index in 12"
                                              :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Stem_Pic_Row_' + Pre_Mix_Stem_Pic_Row_Index + 'Col_' + Pre_Mix_Stem_Pic_Col_Index">
                                              <el-row 
                                                  type="flex" 
                                                  justify="center" 
                                                  v-if="(Pre_Mix_Stem_Pic_Row_Index - 1) * 12 + Pre_Mix_Stem_Pic_Col_Index - 1 < Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].stem_image.length"
                                                  >
                                                  <img height="30" :src="Get_Picture_Src('stem_image ' + Big_Sub_Question_Index, Bundle_Index, Question_Index - 1, Pre_Mix_Stem_Pic_Row_Index, Pre_Mix_Stem_Pic_Col_Index)">
                                              </el-row>
                                          </el-col>
                                      </el-row>
                                  </el-col>
                              </el-row>
                              <!-- 选择类小题 -->
                              <el-row 
                                  type="flex"
                                  justify="start"
                                  style="margin-top: 5px; margin-bottom: 5px"
                                  v-show="['单选题', '多选题', '判断题'].indexOf(Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].type) != -1"
                                  v-for="(Pre_Option, Pre_Option_Index) in Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].options"
                                  :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Option_' + Pre_Option_Index">
                                  <el-col>
                                      <el-row type="flex" justify="start">
                                          <el-col :span="2">
                                              <el-row type="flex" justify="end" style="padding-right: 10px">
                                                  <label>{{Get_Option_Label(Pre_Option_Index)}}:</label>
                                              </el-row>
                                          </el-col>
                                          <el-col :span="22">
                                              <el-row type="flex" justify="start">
                                                  <Mathdown 
                                                    :content="Pre_Option" 
                                                    :name="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Options_' + Pre_Option_Index"></Mathdown>
                                              </el-row>
                                          </el-col>
                                      </el-row>
                                      <el-row type="flex" justify="end" v-show="Big_Sub_Question.options_image[Pre_Option_Index].length > 0">
                                          <el-col :span="22">
                                              <el-row 
                                                  type="flex" 
                                                  justify="start"
                                                  style="margin-top: 5px; margin-bottom: 5px"
                                                  v-for="Pre_Mix_Opt_Pic_Row_Index in Math.ceil(Big_Sub_Question.options_image[Pre_Option_Index].length/12)"
                                                  :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index  + '_Options_' + Pre_Option_Index + '_Pic_Row_' + Pre_Mix_Opt_Pic_Row_Index">
                                                  <el-col 
                                                      :span="2"
                                                      v-for="Pre_Mix_Opt_Pic_Col_Index in 12"
                                                      :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index  + '_Options_' + Pre_Option_Index + '_Pic_Row_' + Pre_Mix_Opt_Pic_Row_Index + 'Col_' + Pre_Mix_Opt_Pic_Col_Index">
                                                      <el-row 
                                                          type="flex" 
                                                          justify="center" 
                                                          v-if="(Pre_Mix_Opt_Pic_Row_Index - 1) * 12 + Pre_Mix_Opt_Pic_Col_Index - 1 < Big_Sub_Question.options_image[Pre_Option_Index].length"
                                                          >
                                                          <img height="30" :src="Get_Picture_Src('options_image ' + Big_Sub_Question_Index + ' ' + Pre_Option_Index, Bundle_Index, Question_Index - 1, Pre_Mix_Opt_Pic_Row_Index, Pre_Mix_Opt_Pic_Col_Index)">
                                                      </el-row>
                                                  </el-col>
                                              </el-row>
                                          </el-col>
                                      </el-row>
                                  </el-col>
                              </el-row>
                              <!-- 解答类小题 -->
                              <el-row 
                                  type="flex"
                                  justify="start"
                                  style="margin-top: 5px; margin-bottom: 5px"
                                  v-show="['简答题', '计算题'].indexOf(Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].type) != -1"
                                  v-for="(Pre_Small_Sub_Question, Pre_Small_Sub_Question_Index) in Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].sub_questions"
                                  :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_S_SQ_' + Pre_Small_Sub_Question_Index">
                                  <el-col>
                                      <el-row type="flex" justify="start">
                                          <el-col :span="2">
                                              <el-row type="flex" justify="end">
                                                  <label>{{Pre_Small_Sub_Question_Index + 1}}：</label>
                                              </el-row>
                                          </el-col>
                                          <el-col :span="22">
                                              <el-row type="flex" justify="start">
                                                  <Mathdown 
                                                    :content="Pre_Small_Sub_Question" 
                                                    :name="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_S_SQ_' + Pre_Small_Sub_Question_Index"></Mathdown>
                                              </el-row>
                                          </el-col>
                                      </el-row>
                                      <el-row type="flex" justify="end" v-show="Big_Sub_Question.sub_questions_image[Pre_Small_Sub_Question_Index].length > 0">
                                          <el-col :span="22">
                                              <el-row 
                                                  type="flex" 
                                                  justify="start"
                                                  v-for="Pre_Mix_S_SQ_Pic_Row_Index in Math.ceil(Big_Sub_Question.sub_questions_image[Pre_Small_Sub_Question_Index].length/12)"
                                                  :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index  + '_S_SQ_' + Pre_Small_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_S_SQ_Pic_Row_Index">
                                                  <el-col 
                                                      :span="2"
                                                      v-for="Pre_Mix_S_SQ_Pic_Col_Index in 12"
                                                      :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index  + '_S_SQ_' + Pre_Small_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_S_SQ_Pic_Row_Index + 'Col_' + Pre_Mix_S_SQ_Pic_Col_Index">
                                                      <el-row 
                                                          type="flex" 
                                                          justify="center" 
                                                          v-if="(Pre_Mix_S_SQ_Pic_Row_Index - 1) * 12 + Pre_Mix_S_SQ_Pic_Col_Index - 1 < Big_Sub_Question.sub_questions_image[Pre_Small_Sub_Question_Index].length"
                                                          >
                                                          <img height="30" :src="Get_Picture_Src('sub_questions_image ' + Big_Sub_Question_Index + ' ' + Pre_Small_Sub_Question_Index, Bundle_Index, Question_Index - 1, Pre_Mix_S_SQ_Pic_Row_Index, Pre_Mix_S_SQ_Pic_Col_Index)">
                                                      </el-row>
                                                  </el-col>
                                              </el-row>
                                          </el-col>
                                      </el-row>
                                  </el-col>
                              </el-row>
                              <!-- 答案两项 -->
                              <el-row 
                                  type="flex" 
                                  justify="start" 
                                  style="margin-top: 5px; margin-bottom: 5px"
                                  v-show="Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].answer.length > 0">
                                  <el-col :span="2">
                                      <el-row type="flex" justify="end" style="font-weight: bold; padding-right: 10px">
                                          <span>答案</span>
                                      </el-row>
                                  </el-col>
                                  <el-col :span="22">
                                      <el-row type="flex" justify="start">
                                          <Mathdown 
                                            :content="Big_Sub_Question.answer" 
                                            :name="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Answer'"></Mathdown>
                                      </el-row>
                                  </el-col>
                              </el-row>
                              <el-row 
                                  type="flex" 
                                  justify="end" 
                                  style="margin-top: 5px; margin-bottom: 5px"
                                  v-show="Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].answer_image.length > 0">
                                  <el-col :span="22">
                                      <el-row 
                                          type="flex" 
                                          justify="start"
                                          v-for="Pre_Mix_Answer_Pic_Row_Index in Math.ceil(Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].answer_image.length/12)"
                                          :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Answer_Pic_Row_Index">
                                          <el-col 
                                              :span="2"
                                              v-for="Pre_Mix_Answer_Pic_Col_Index in 12"
                                              :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Answer_Pic_Row_Index + 'Col_' + Pre_Mix_Answer_Pic_Col_Index">
                                              <el-row 
                                                  type="flex" 
                                                  justify="center" 
                                                  v-if="(Pre_Mix_Answer_Pic_Row_Index - 1) * 12 + Pre_Mix_Answer_Pic_Col_Index - 1 < Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].answer_image.length"
                                                  >
                                                  <img height="30" :src="Get_Picture_Src('answer_image ' + Big_Sub_Question_Index , Bundle_Index, Question_Index - 1, Pre_Mix_Answer_Pic_Row_Index, Pre_Mix_Answer_Pic_Col_Index)">
                                              </el-row>
                                          </el-col>
                                      </el-row>
                                  </el-col>
                              </el-row>
                              <!-- 解析两项 -->
                              <el-row 
                                  type="flex" 
                                  justify="start" 
                                  style="margin-top: 5px; margin-bottom: 5px"
                                  v-show="Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].analysis.length > 0">
                                  <el-col :span="2">
                                      <el-row type="flex" justify="end" style="font-weight: bold; padding-right: 10px">
                                          <span>解析</span>
                                      </el-row>
                                  </el-col>
                                  <el-col :span="22">
                                      <el-row type="flex" justify="start">
                                          <Mathdown :content="Big_Sub_Question.analysis" :name="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Analysis'"></Mathdown>
                                      </el-row>
                                  </el-col>
                              </el-row>
                              <el-row 
                                  type="flex" 
                                  justify="end" 
                                  style="margin-top: 5px; margin-bottom: 5px"
                                  v-show="Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].analysis_image.length > 0">
                                  <el-col :span="22">
                                      <el-row 
                                          type="flex" 
                                          justify="start"
                                          v-for="Pre_Mix_Analysis_Pic_Row_Index in Math.ceil(Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].analysis_image.length/12)"
                                          :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Analysis_Pic_Row_Index">
                                          <el-col 
                                              :span="2"
                                              v-for="Pre_Mix_Analysis_Pic_Col_Index in 12"
                                              :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_BSQ_' + Big_Sub_Question_Index + '_Pic_Row_' + Pre_Mix_Analysis_Pic_Row_Index + 'Col_' + Pre_Mix_Analysis_Pic_Col_Index">
                                              <el-row 
                                                  type="flex" 
                                                  justify="center" 
                                                  v-if="(Pre_Mix_Analysis_Pic_Row_Index - 1) * 12 + Pre_Mix_Analysis_Pic_Col_Index - 1 < Bundle.list[Question_Index - 1].sub_questions[Big_Sub_Question_Index].analysis_image.length"
                                                  >
                                                  <img height="30" :src="Get_Picture_Src('analysis_image ' + Big_Sub_Question_Index, Bundle_Index, Question_Index - 1, Pre_Mix_Analysis_Pic_Row_Index, Pre_Mix_Analysis_Pic_Col_Index)">
                                              </el-row>
                                          </el-col>
                                      </el-row>
                                  </el-col>
                              </el-row>
                          </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <!-- 简答题，计算题的小题部分 -->
                  <el-row v-if="Bundle.type == '简答题' || Bundle.type == '计算题'" style="margin-bottom: 5px">
                    <el-col>
                      <el-row
                        type="flex"
                        justify="end"
                        v-for="(Sub_Question, Sub_Question_Index) in Bundle.list[Question_Index - 1].sub_questions"
                        :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_SQ_' + Sub_Question_Index">
                        <el-col>
                          <el-row type="flex" justify="start">
                            <el-col :span="2">
                              <el-row type="flex" justify="end" style="padding-right: 10px">
                                <label>{{(Sub_Question_Index + 1)}}:</label>
                              </el-row>
                            </el-col>
                            <el-col :span="22">
                              <el-row type="flex" justify="start">
                                <Mathdown 
                                  :content="Sub_Question" 
                                  :name="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_SQ_' + Sub_Question_Index"></Mathdown>
                              </el-row>
                            </el-col>
                          </el-row>
                          <el-row style="margin-top: 5px; margin-bottom: 5px" v-show="Bundle.list[Question_Index - 1].sub_questions_image[Sub_Question_Index].length > 0">
                            <el-col :span="22" :offset="2">
                              <el-row 
                                type="flex" 
                                justify="start"
                                v-for="TBQ_SQ_Pic_Row_Index in Math.ceil(Bundle.list[Question_Index - 1].sub_questions_image[Sub_Question_Index].length/12)"
                                :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_SQ_' + Sub_Question_Index + '_Pic_Row_' + TBQ_SQ_Pic_Row_Index">
                                <el-col 
                                  :span="2"
                                  v-for="TBQ_SQ_Pic_Col_Index in 12"
                                  :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_SQ_' + Sub_Question_Index + '_Pic_Row_' + TBQ_SQ_Pic_Row_Index + 'Col_' + TBQ_SQ_Pic_Col_Index">
                                  <el-row 
                                      type="flex" 
                                      justify="center" 
                                      v-if="(TBQ_SQ_Pic_Row_Index - 1) * 12 + TBQ_SQ_Pic_Col_Index - 1 < Bundle.list[Question_Index - 1].sub_questions_image[Sub_Question_Index].length"
                                      >
                                      <img height="30" :src="Get_Picture_Src('sub_questions_image ' + Sub_Question_Index , Bundle_Index, Question_Index - 1, TBQ_SQ_Pic_Row_Index, TBQ_SQ_Pic_Col_Index)">
                                  </el-row>
                                </el-col>
                              </el-row>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <!-- 答案部分 -->
                  <el-row 
                    type="flex" justify="start" style="margin-bottom: 10px;" 
                    v-show="Bundle.list[Question_Index - 1].answer_image.length > 0 || Bundle.list[Question_Index - 1].answer.length > 0">
                      <el-col :span="2">
                          <el-row type="flex" justify="end" style="font-weight: bold;">
                              <span>答案：</span>
                          </el-row>
                      </el-col>
                      <el-col :span="22">
                          <el-row type="flex" justify="start">
                              <Mathdown 
                                :content="Bundle.list[Question_Index - 1].answer" 
                                :name="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Answer'"></Mathdown>
                          </el-row>
                      </el-col>
                  </el-row>
                  <!-- 答案配图 -->
                  <el-row type="flex" justify="end" v-show="Bundle.list[Question_Index - 1].answer_image.length > 0">
                      <el-col :span="22">
                          <el-row 
                              type="flex" 
                              justify="start" 
                              v-for="TBQ_Answer_Pic_Row_Index in Math.ceil(Bundle.list[Question_Index - 1].answer_image.length/12)"
                              :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Answer_Pic_Row_' + TBQ_Answer_Pic_Row_Index"
                              style="margin-bottom: 10px;">
                              <el-col 
                                  :span="2" 
                                  v-for="TBQ_Answer_Pic_Col_Index in 12" 
                                  :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Answer_Pic_Row_' + TBQ_Answer_Pic_Row_Index + '_' + TBQ_Answer_Pic_Col_Index">
                                  <el-row 
                                      type="flex" 
                                      justify="center" 
                                      v-if="(TBQ_Answer_Pic_Row_Index - 1) * 12 + TBQ_Answer_Pic_Col_Index - 1 < Bundle.list[Question_Index - 1].answer_image.length"
                                      >
                                      <img height="30" :src="Get_Picture_Src('answer_image', Bundle_Index, Question_Index - 1, TBQ_Answer_Pic_Row_Index, TBQ_Answer_Pic_Col_Index)">   
                                  </el-row>
                              </el-col>
                          </el-row>
                      </el-col>
                  </el-row>
                  
                  <!-- 解析部分 -->
                  <el-row 
                    type="flex" justify="start" style="margin-bottom: 10px;" 
                    v-show="Bundle.list[Question_Index - 1].analysis_image.length > 0 || Bundle.list[Question_Index - 1].analysis.length > 0">
                      <el-col :span="2">
                          <el-row type="flex" justify="end" style="font-weight: bold;">
                              <span>解析：</span>
                          </el-row>
                      </el-col>
                      <el-col :span="22">
                          <el-row type="flex" justify="start">
                              <Mathdown 
                                :content="Bundle.list[Question_Index - 1].analysis" 
                                :name="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Analysis'"></Mathdown>
                          </el-row>
                      </el-col>
                  </el-row>
                  <!-- 解析部分配图 -->
                  <el-row type="flex" justify="end" v-show="Bundle.list[Question_Index - 1].analysis_image.length > 0" style="margin-bottom: 15px">
                      <el-col :span="22">
                          <el-row 
                              type="flex" 
                              justify="start" 
                              v-for="TBQ_Analysis_Pic_Row_Index in Math.ceil(Bundle.list[Question_Index - 1].analysis_image.length/12)"
                              :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Analysis_Pic_Row_' + TBQ_Analysis_Pic_Row_Index">
                              <el-col 
                                  :span="2" 
                                  v-for="TBQ_Analysis_Pic_Col_Index in 12" 
                                  :key="'Pre_Total_Bundle_' + Bundle_Index + '_' + Question_Index + '_Analysis_Pic_Row_' + TBQ_Analysis_Pic_Row_Index + '_' + TBQ_Analysis_Pic_Col_Index">
                                  <el-row 
                                      type="flex" 
                                      justify="center" 
                                      v-if="(TBQ_Analysis_Pic_Row_Index - 1) * 12 + TBQ_Analysis_Pic_Col_Index - 1 < Bundle.list[Question_Index - 1].analysis_image.length"
                                      >
                                      <img height="30" :src="Get_Picture_Src('analysis_image', Bundle_Index, Question_Index - 1, TBQ_Analysis_Pic_Row_Index, TBQ_Analysis_Pic_Col_Index)">   
                                  </el-row>
                              </el-col>
                          </el-row>
                      </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!-- 试卷切分的显示部分 -->
    <div 
      v-show="Using_Part == 'Fileinput'" 
      @click="Reset_Focus()" 
      style="padding-left: 2vw; min-height: 100vh; padding-top: 20px; padding-right: 2vw; border: 3px solid #409EFF; border-radius: 15px; margin-top: 30px; margin-bottom: 30px;">
      <div style="min-height: 90vh;">
      <el-row
        v-for="(Item, Item_Index) in Paper_Content"
        :key="'Line_' + Item_Index">
          <!-- 所有切分结果呈一列 -->
          <el-col>
            <!-- Item != 'DIVIDER_LINES' 这代表这部分内容是切分出来的结果的部分 -->
            <!-- 所有显示基本上就是把切分出来的内容按照配套的html格式显示出来 -->
            <el-row v-if="Item != 'DIVIDER_LINES'&& Item.para_type == '0'" :style="Item.para_style">
              <span
                v-for="(message, index_i) in Item.runs"
                :key="'Line_' + Item_Index + '_' + index_i + '_run'"
                :style="message.run_style"
              >
                <span
                  v-if="message.run_type == '0'"
                  v-html="message.run_text"
                ></span>
                <img
                  v-else-if="message.run_type == '1'"
                  :src="Paper_Image_Dict[message.image.src]"
                  :width="message.image.width"
                  :height="message.image.height"
                  :style="message.image.style"
                  :alt="message.image.alt"
                />
              </span>
            </el-row>
            <el-row v-if="Item != 'DIVIDER_LINES' && Item.para_type == '1'">
              <div :style="Item.para_style">
                <span v-html="Table_Img_Get(Item.table_raw_html)"></span>
              </div>
            </el-row>
            <!-- Item == 'DIVIDER_LINES' 这代表这个元素是原试卷内容里面的某一部分的分界线 -->
            <!-- mouse事件的作用是判断当前鼠标悬浮在哪个线上，用来操作的，用不到可以删 -->
            <el-row 
              v-if="Item == 'DIVIDER_LINES'" 
              style="height: 30px; padding-top: 15px; padding-bottom: 15px; cursor: pointer"
              @click.native="Delete_Divider(Item_Index)"
              @mouseenter.native="Paper_Divider_Index = Item_Index"
              @mouseleave.native="Paper_Divider_Index = -1">
                <el-col>
                  <el-row :style="'border-top: 2px dashed ' + (Paper_Divider_Index == Item_Index ? 'red' : '#ccc') + '; width: 100%;'"></el-row>
                </el-col>
            </el-row>
            <!-- Item != 'DIVIDER_LINES' 即添加新切分线的部分是在试卷元素的后面出现的、其下一个内容不能是切分线、也不能是试卷的最后一个部分 -->
            <el-row 
              v-if="Item != 'DIVIDER_LINES' && Item_Index != Paper_Content.length - 1 && Paper_Content[Item_Index + 1] != 'DIVIDER_LINES'" 
              style="height: 14px; width: 100%; padding-top: 6px; cursor: pointer;" 
              @click.native="Add_Divider(Item_Index)"
              @mouseenter.native="Paper_Divider_Index = Item_Index"
              @mouseleave.native="Paper_Divider_Index = -1">
              <el-col>
                <el-row v-show="Paper_Divider_Index == Item_Index" style="border-top: 2px dashed #409EFF; width: 100%;"></el-row>
              </el-col>
            </el-row>
          </el-col>
      </el-row>
      </div>
      <el-row type="flex" justify="end" style="padding-right: 30px; margin-top: 30px; margin-bottom: 30px;">
        <el-button type="primary" icon="el-icon-refresh" @click="Paper_Data_Reset()" style="margin-right: 20px">重置试卷数据</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="Paper_Data_Clear()" style="margin-right: 20px">清空当前数据</el-button>
        <el-button type="primary" icon="el-icon-check" @click="Divider_Final_Check()">切分确认</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>

import OptionQuestions from '@/views/resourceInput/components/OptionQuestions.vue'
import FillQuestions from '@/views/resourceInput/components/FillQuestions.vue'
import AnswerQuestions from '@/views/resourceInput/components/AnswerQuestions.vue'
import MixQuestions from '@/views/resourceInput/components/MixQuestions.vue'

import Mathdown from '@/common/components/Mathdown'

import {commonAjax} from '@/common/utils/ajax'

export default {
  name: "inputPaper",
  components: {
    Mathdown, OptionQuestions, FillQuestions, AnswerQuestions, MixQuestions
  },
  data() {
    return {
      // 将要添加的题包类型
      Add_Bundle_Type: "单选题",
      // 正在使用的组件
      Using_Part: "Input",
      // 试卷标题
      Title: "",
      // 用于显示最终录入科目的变量
      Subject: "数学",
      // 用于显示最终录入学段的变量
      Period: "高中",
      // 用于确定当前显示的题目类型的变量
      // 之后会用来给录入或编辑做定位
      Type: "单选题",
      // 待选科目
      Subject_List: [
        { value: "语文", label: "语文" },
        { value: "数学", label: "数学" },
        { value: "英语", label: "英语" },
        { value: "历史", label: "历史" },
        { value: "政治", label: "政治" },
        { value: "地理", label: "地理" },
        { value: "物理", label: "物理" },
        { value: "化学", label: "化学" },
        { value: "生物", label: "生物" },
        { value: "文综", label: "文综" },
        { value: "理综", label: "理综" }
      ],
      // 待选学段
      Period_List: [
        { value: "小学", label: "小学" },
        { value: "初中", label: "初中" },
        { value: "高中", label: "高中" },
        { value: "大学", label: "大学" },
        { value: "成人", label: "成人" },
        { value: "其他", label: "其他" }
      ],
      // 待选试题类型
      Type_List: [
        { value: "单选题", label: "单选题" },
        { value: "多选题", label: "多选题" },
        { value: "判断题", label: "判断题" },
        { value: "填空题", label: "填空题" },
        { value: "简答题", label: "简答题" },
        { value: "计算题", label: "计算题" },
        { value: "综合题", label: "综合题" }
      ],
      Question_Bundle: [],
      // 所有题目的信息
      // Question_Bundle: [
      //   {
      //     type: '单选题',
      //     list: [
      //       {
      //           score: 5,
      //           stem: "反正是测试数据1",
      //           stem_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           options: ["1", "2", "3", "4"],
      //           options_image: [
      //               ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="], 
      //               [],
      //               [],
      //               []],
      //           answer: "A",
      //           answer_image: [],
      //           analysis: "解析",
      //           analysis_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
      //           sub_questions: [],
      //           sub_questions_image: [],
      //           sub_questions_score: [],
      //           answer_list: []
      //       },
      //       {
      //           score: 5,
      //           stem: "反正是测试数据2",
      //           stem_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           options: ["1", "2", "3", "4"],
      //           options_image: [
      //               ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="], 
      //               [],
      //               [],
      //               []],
      //           answer: "A",
      //           answer_image: [],
      //           analysis: "解析",
      //           analysis_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
      //           sub_questions: [],
      //           sub_questions_image: [],
      //           sub_questions_score: [],
      //           answer_list: []
      //       },
      //       {
      //           score: 5,
      //           stem: "反正是测试数据3",
      //           stem_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           options: ["1", "2", "3", "4"],
      //           options_image: [
      //               ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="], 
      //               [],
      //               [],
      //               []],
      //           answer: "A",
      //           answer_image: [],
      //           analysis: "解析",
      //           analysis_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
      //           sub_questions: [],
      //           sub_questions_image: [],
      //           sub_questions_score: [],
      //           answer_list: []
      //       },
      //       {
      //           score: 5,
      //           stem: "反正是测试数据4",
      //           stem_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           options: ["1", "2", "3", "4"],
      //           options_image: [
      //               ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="], 
      //               [],
      //               [],
      //               []],
      //           answer: "A",
      //           answer_image: [],
      //           analysis: "解析",
      //           analysis_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
      //           sub_questions: [],
      //           sub_questions_image: [],
      //           sub_questions_score: [],
      //           answer_list: []
      //       },
      //     ],
      //     desc: "第一道单选题"
      //   },
      //   {
      //     type: '填空题',
      //     list: [
      //       {
      //           score: 5,
      //           stem: "反正是测试数据________",
      //           stem_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           options: [],
      //           options_image: [],
      //           answer: "没问题",
      //           answer_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           analysis: "解析测试",
      //           analysis_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
      //           sub_questions: [],
      //           sub_questions_image: [],
      //           sub_questions_score: [],
      //           answer_list: []
      //       },
      //       {
      //           score: 5,
      //           stem: "反正是测试数据2，注意是2________",
      //           stem_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           options: [],
      //           options_image: [],
      //           answer: "没问题，答案没什么问题",
      //           answer_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           analysis: "解析测试",
      //           analysis_image: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //           // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
      //           sub_questions: [],
      //           sub_questions_image: [],
      //           sub_questions_score: [],
      //           answer_list: []
      //       }
      //     ],
      //     desc: "第一道填空题"
      //   },
      //   {
      //     type: '简答题',
      //     list: [
      //       {
      //           score: 10,
      //           stem: "简答题测试数据",
      //           stem_image: [],
      //           options: [],
      //           options_image: [],
      //           answer: "没问题",
      //           answer_image: [],
      //           analysis: "解析测试",
      //           analysis_image: [],
      //           // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
      //           sub_questions: ["$1$", "$2$"],
      //           sub_questions_image: [["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="], []],
      //           sub_questions_score: [5, 5],
      //           answer_list: []
      //       },
      //     ],
      //     desc: "第一道简答题"
      //   },
      //   {
      //     type: '综合题',
      //     list: [
      //       {
      //         score: 10,
      //         stem: "题干内容",
      //         stem_image: [],
      //         answer: "答案内容",
      //         answer_image: [],
      //         analysis: "解析内容",
      //         analysis_image: [],
      //         // 处理上的重大区别，就是综合题没有选项，只有小题，然后小题内本身允许
      //         // 单选，多选，判断，填空，简答，计算这些题型
      //         sub_questions: [
      //           {
      //             type: "单选题",
      //             score: 5,
      //             stem: "测试用题干$1$,$2$",
      //             stem_image: [
      //               "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII=", 
      //               "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //             options: ["$1$", "2", "3", "4"],
      //             options_image: [
      //               [
      //                 "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII=",
      //                 "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII=",
      //                 "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="
      //               ], 
      //               [], 
      //               [], 
      //               []
      //             ],
      //             answer: "A",
      //             answer_image: [],
      //             analysis: "选项",
      //             analysis_image: [
      //               "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII=", 
      //               "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //             // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
      //             sub_questions: [],
      //             sub_questions_image: [],
      //             sub_questions_score: [],
      //             // 给多选题类型拿来控制答案的，一般用不到
      //             answer_list: [],
      //             // 是否折叠
      //             expand: false
      //           },
      //           {
      //             type: "简答题",
      //             score: 5,
      //             stem: "题干",
      //             stem_image: [
      //               "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII=", 
      //               "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //             options: [],
      //             options_image: [],
      //             answer: "",
      //             answer_image: [],
      //             analysis: "选项",
      //             analysis_image: [
      //               "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII=", 
      //               "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="],
      //             // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
      //             sub_questions: ['1'],
      //             sub_questions_image: [
      //               [
      //                 "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII=",
      //                 "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII=",
      //                 "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBnVSBEYIwDHydoG7QERiBDWQD3cARZAPdgBFwA9yAEeoGnBNoeyYSQgtX/u6vd2nyfNIWII2r5+D58Ww8LTbgRgKSHTJhRfHFs/R0nndkoiKRR07RHnFHAS9shMVvDjzgsDqKGWSAW4rRIhMVOeAjP1NsE1oSOopYgXh7huP7xGbAm9bgsCdalcfx6Ay5tRLzuclL2VPMIQGHccCBLYkO4gMNxpO1a0Labi2K2WGBBXCShlEiZ6wgJXQRewNWLqlFfICVEglrvSRUUFKvxLk4/AFKIVhRbpGyz8dsMA6/FXkdptfixEGnNk9CiB+vUS5nH3BKvZ6aHJ9BJP5vaUfq4V0dPJ/EbHwBnONwOOYg16AAAAAASUVORK5CYII="
      //               ]
      //             ],
      //             sub_questions_score: [5],
      //             // 给多选题类型拿来控制答案的，一般用不到
      //             answer_list: [],
      //             // 是否折叠
      //             expand: true
      //           }
      //         ],
      //       },
      //     ],
      //     desc: "综合题题包"
      //   }
      // ],
      // 拖拽的题包坐标列表
      Draging_Questions_Rect: [],
      // 拖拽的题包题目类型
      Draging_Questions_Index: -1,
      // 拖拽的题目坐标
      Draging_Questions_Position: {
        x: 0,
        y: 0
      },
      // 正在聚焦的题目坐标，实际上准备靠这个认题目
      Focusing_Questions_Position: {
        x: 0,
        y: 0
      },
      // 正在聚焦的题包序号
      Focusing_Index: -1,
      // 如果点击导入，那么默认进入的是编辑模式
      // 此时Editing_Position 的 格式是【题包序号 题目在题包中的序号】
      // 如果类型改变，那么这个值将被还原成空字符串
      // 如果类型不改变，则询问是替换还是新加，如果是新加，那么将其重置为空字符串
      // 如果是替换，则切分并读取信息，进行替换工作
      Editing_Position: "",
      // 老东西，Check_Do用到的过滤列表
      // 用于输入符号提示的部分
      en_pun_list: [',','.','?','!',':',';','\'','"','(',')','&nbsp','_','/','|','\\','<','>'],
      ch_pun_list: ['，','。','！','？','：','；','‘','’','“','”','（','）','&nbsp','、','《','》'],
      math_pun_list: ['+', '-', "*", "/", "%", "="],
      // 用于展示哪些字符需要修改的对话框
      Wrong_Char_Dialog: false,
      // 用于展示错误数据的信息栏
      Wrong_Char_Info: "",
      // 保存用户的UUID信息
      UUID: "",
      // 刷新变量
      Refresh: false,
      // 第二次尝试，定位不同题包
      Multi_Type_Insert: false,
      // 选择用的列表
      Multi_Info: [],
      // 用于给多题包定位时进行等待
      Waiting_Question: {},
      // 跳跃变量
      Jumping: "",
      // 获取文件的组件
      File_Selector: "",
      // 文件名称
      File_Name: "",
      // 用于存放拿来显示的变量
      Paper_Content: [],
      // 用来进行初始结果的备份
      Paper_Content_BackUp: [],
      // 存放拿来进行显示的图片
      Paper_Image_Dict: {

      },
      // 标记切分点的变量
      Paper_Divider_Index: -1,
      // 是否正在等待文件切分完成
      File_Uploading: false
    };
  },
  mounted(){
      if(!this.$store.state.user.name || this.$store.state.user.name.length == 0){
        this.$message.error("您尚未登录，请登录后使用录入功能。")
        this.$router.push("/")
        return 
      }
      this.Get_User_UUID();
      this.Init_File_Selector();
  },
  methods:{
    // 清空试卷数据
    Paper_Data_Clear(){
      this.$confirm('您点击了清空当前试卷切分内容的按钮，当前的切分结果将被清空，您将需要重新导入其他试卷，确定要清空吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(()=>{
        this.File_Name = ""
        this.File_Uploading = false
        this.Paper_Content = []
        this.Paper_Image_Dict = {}
        this.Paper_Divider_Index = -1;
      }).catch(()=>{
          this.$message.info("已取消")
      })
    },
    // 重置
    Paper_Data_Reset(){
      this.$confirm('您点击了重置当前试卷切分内容的按钮，当前的切分结果将被重置为当前试卷最开始的切分结果，确定要重置吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(()=>{
        this.Paper_Content = JSON.parse(JSON.stringify(this.Paper_Content_BackUp));
        this.Paper_Divider_Index = -1;
      }).catch(()=>{
          this.$message.info("已取消")
      })
    },
    // 调整功能选择
    Change_Using_Part(Part){
      if(Part != 'Fileinput'){
        if(this.Paper_Content.length == 0){
          this.Using_Part = Part
        }else{
          this.$message.warning("您正在使用文件导入功能，确认完成或清空内容后才可切换当前操作模块。")
        }
      }else{
        this.Using_Part = Part
      }
    },
      // 将切分后的内容整理成导出格式
      Divider_Final_Check(){

        let Reg_C = new RegExp('&#xa0;', 'g')

        let Out_JSON = []
        let ID = 0
        let Item = {
          id: ID,
          subject: this.Subject,
          period: this.Period,
          content: []
        }
        for(let i = 0; i < this.Paper_Content.length; i++){
          if(this.Paper_Content[i] == "DIVIDER_LINES"){
            // 每次遇到切分线，就把当前累积的内容推进去，然后将内容重置一下，再给序号加一
            Out_JSON.push(JSON.parse(JSON.stringify(Item)))
            ID = ID + 1;
            Item = {
              id: ID,
              subject: this.Subject,
              period: this.Period,
              content: []
            }
          }else{
            // 0 代表文字和图片内容
            // 1 代表试卷中的表格内容（不太清楚要怎么办，但总之应该是这么返回才对……吧？）
            if(this.Paper_Content[i].para_type == '0'){
              let Content = ""
              for(let j = 0; j < this.Paper_Content[i].runs.length; j++){
                if(this.Paper_Content[i].runs[j].run_type == '0'){
                  Content = Content + this.Paper_Content[i].runs[j].run_text
                }else if(this.Paper_Content[i].runs[j].run_type == '1'){
                  Content = Content 
                    + "<img src='" + this.Paper_Image_Dict[this.Paper_Content[i].runs[j].image.src] + "' " 
                    + " width='" + this.Paper_Content[i].runs[j].image.width + "' " 
                    + " height='" + this.Paper_Content[i].runs[j].image.height + "' " 
                    + " style='" + this.Paper_Content[i].runs[j].image.style + "' " 
                    + " alt='" + this.Paper_Content[i].runs[j].image.alt + "' " 
                    + ">"
                }
              }
              Content = Content.replace(Reg_C, "")
              Item.content.push(Content)
            }else{
              Item.content.push(this.Table_Img_Get(this.Paper_Content[i].table_raw_html))
            }
          }
        }
        // 把累积到的最后一组也压进去
        Out_JSON.push(JSON.parse(JSON.stringify(Item)))

        let Param = {
          'Paper_Cut_Result': JSON.stringify(Out_JSON, null, 4)
        }

        let Temp_Result_Dict = {
          单选题: {
            list: [],
            desc: ""
          },
          多选题: {
            list: [],
            desc: ""
          },
          判断题: {
            list: [],
            desc: ""
          },
          填空题: {
            list: [],
            desc: ""
          },
          简答题: {
            list: [],
            desc: ""
          },
          计算题: {
            list: [],
            desc: ""
          }
        }

        //debug
        // console.log(this.Question_Bundle.length);

        let Type_List = ['单选题', '多选题', '判断题', '填空题', '简答题', '计算题']
        for(let j = 0; j < Type_List.length; j++){
          let Count = 1;
          for(let i = 0; i < this.Question_Bundle.length; i++){
            if(this.Question_Bundle[i].type == Type_List[j]){
              Count = Count + 1
            }
          }
          Temp_Result_Dict[Type_List[j]].desc = "第" + Count + "个" + Type_List[j] + "题包"
        }

        commonAjax(this.backendIP + '/api/paperCutResultAnalyse', Param).then((res)=>{
          
          let Result = res.data

          // console.log(Result)

          for(let i = 0; i < Result.length; i++){
            if(Result[i].type=='选择题'){
              Result[i].type = '单选题'
            }
            if(['单选题', '多选题', '判断题'].indexOf(Result[i].type) != -1){
              let Item = {
                score: Result[i].score == 0 ? 5 : Result[i].score,
                stem: Result[i].stem,
                stem_image: [],
                options: [],
                options_image: [],
                answer: Result[i].answer,
                answer_image: [],
                analysis: Result[i].analysis,
                analysis_image: [],
                // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
                sub_questions: [],
                sub_questions_image: [],
                sub_questions_score: [],
                answer_list: []
              }
              for(let j = 0; j < Result[i].options.length; j++){
                Item.options.push(Result[i].options[j])
                Item.options_image.push([])
              }
              Temp_Result_Dict[Result[i].type].list.push(Item)
            }else if(Result[i].type == '填空题'){
              let Item = {
                score: Result[i].score == 0 ? 5 : Result[i].score,
                stem: Result[i].stem,
                stem_image: [],
                options: [],
                options_image: [],
                answer: Result[i].answer,
                answer_image: [],
                analysis: Result[i].analysis,
                analysis_image: [],
                // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
                sub_questions: [],
                sub_questions_image: [],
                sub_questions_score: [],
                answer_list: []
              }
              Temp_Result_Dict[Result[i].type].list.push(Item)
            }else if(['简答题', '计算题'].indexOf(Result[i].type) != -1){
                let Item = {
                  score: Result[i].subquestions.length > 0 ? Result[i].subquestions.length * 5 : 0,
                  stem: Result[i].stem,
                  stem_image: [],
                  options: [],
                  options_image: [],
                  answer: Result[i].answer,
                  answer_image: [],
                  analysis: Result[i].analysis,
                  analysis_image: [],
                  // 这三条在填空和选择中用不到，但是可以在简答和计算中用，这里写上一个，防止读到空值，算是一种格式统一
                  sub_questions: [],
                  sub_questions_image: [],
                  sub_questions_score: [],
                  answer_list: []
              }
              for(let j = 0; j < Result[i].subquestions.length; j++){
                Item.sub_questions.push(Result[i].subquestions[j])
                Item.sub_questions_image.push([])
                Item.sub_questions_score.push(5)
              }
              Temp_Result_Dict[Result[i].type].list.push(Item)
            }
          }

          for(let i = 0; i < Type_List.length; i++){
            if(Temp_Result_Dict[Type_List[i]].list.length > 0){
              // console.log(i, Type_List[i], this.Question_Bundle.length);
              this.Question_Bundle.push({
                type: Type_List[i],
                desc: Temp_Result_Dict[Type_List[i]].desc,
                list: Temp_Result_Dict[Type_List[i]].list
              })
            }
          }

          this.$message.success("所切分的结果中，可识别的试题结果已全部导入录入结果当中。")

          this.File_Name = ""
          this.File_Uploading = false
          this.Paper_Content = []
          this.Paper_Image_Dict = {}
          this.Paper_Divider_Index = -1;
          this.Using_Part = "Input"

        }).catch(
          ()=>{
            this.$message.error("解析出现异常，请重试。")
          }
        )
      },
      // 尝试添加和删除切分线
      Delete_Divider(Item_Index){
        this.Paper_Content.splice(Item_Index, 1)
        this.Paper_Divider_Index = -1;
      },
      Add_Divider(Item_Index){
        this.Paper_Content.splice(Item_Index + 1, 0, 'DIVIDER_LINES')
        this.Paper_Divider_Index = -1;
      },
      // 初始化选择器
      Init_File_Selector(){
        this.File_Selector = document.getElementById("fileSelect");
        this.File_Selector.addEventListener("change", (e)=>{
          if(e.target.files[0]){
            this.File_Uploading = true
            this.File_Upload(e.target.files[0])
            this.File_Selector.value = ""
          }
        })
      },
      // 清空所有手动录入的试题数据
      Clear_All_Questions_Info(){
        this.Question_Bundle = []
        this.Draging_Questions_Rect = [];
        this.Draging_Questions_Index = -1;
        this.Draging_Questions_Position = {
          x: 0,
          y: 0
        }
        this.Focusing_Questions_Position = {
          x: 0,
          y: 0
        }
        this.Focusing_Index = -1
        this.Editing_Position = ""

        this.Multi_Type_Insert = false;
        this.Multi_Info = [];
        this.Waiting_Question = {}

        this.Jumping = ""

        this.Refresh = true
        this.Refresh = false
      },
      // 上传文件
      File_Upload(file){

        this.Paper_Content = []
        this.Paper_Image_Dict = {}
        this.Paper_Divider_Index = -1;

        this.Using_Part = "Fileinput"
        this.File_Name = file.name

        let formData = new FormData();

        // 对应的切分编号，是约定好的，别动就好
        let Num_Dict = {
          英语: "0",
          数学: "1",
          文综: "2",
          政治: "2",
          历史: "2",
          地理: "2",
          理综: "3",
          物理: "3",
          化学: "3",
          生物: "3",
          语文: "4",
        }

        formData.append("files", file);
        formData.append("paper_type", Num_Dict[this.Subject]);
        formData.append("data_format", '0');
        // 为了防止需要老版本的地方崩溃，先加了这个，以后用不到了再说
        formData.append("paper_Cut_New", true);

        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };

        this.uploadFile(formData, config);
      },
      // 触发上传事件
      File_Import(){
        this.File_Selector.click();
      },
      // 选择上传
      uploadFile(formData, config) {

        this.$http
          .post("https://file-upload-backend-88-production.env.bdaa.pro/v1/paperProcessing/upload", formData, config)
          .then(function(data) {
            // console.log(data.data)
            // 切分出来的文字部分
            this.Paper_Content = data.data.paper
            // 切分出来的图片部分，注意在显然的时候，需要从这里找到对应的图片内容
            this.Paper_Image_Dict = data.data.image_dict
            // 空列表，用来存放元素
            let Lists = []
            for(let i = 0; i < data.data.paper.length; i++){
              for(let j = 0; j < data.data.paper[i].sub_para.length; j++){
                // 这是切分格式的结果，我也不知道为什么sub_para会是一个数组，但是这样读取就没问题
                let Para = data.data.paper[i].sub_para[j]
                // 把每个大段里面的每个小内容抽出来，单独塞到List里面
                for(let k = 0; k < Para.length; k++){
                  Lists.push(Para[k])
                }
              }
              // 只要不是最后一个大段，那么就往里面塞一个“切分线”元素
              if(i != data.data.paper.length - 1){
                Lists.push("DIVIDER_LINES")
              }
            }
            // 把转化结果丢给显示区域，同时留一个备份
            this.Paper_Content = Lists
            this.Paper_Content_BackUp = Lists
            this.File_Uploading = false;
          }).catch(() => {
            this.$alert("切分过程出现错误，这可能是由于服务器原因导致目前暂时无法提供服务，请重新提交文件或稍后再试。", "提示")
            this.File_Uploading = false;
          });
      },
      // 获取UUID
      Get_User_UUID(){
        commonAjax(this.backendIP + '/api/getUserUUID', {}).then((res)=>{
          this.UUID = res.UUID
        }).then(() => {
          // console.log('UUID',this.UUID);
        }).catch(
          ()=>{
            // console.log(err)
            // console.log("Failed.")
          }
        )
      },
      // 单题录入
      toSingle(){
        this.$router.push({path: "/inputMarked"})
      },
      // 展示题目大类标题的方法
      Get_Bundle_Label(Type, Bundle_Index){
        let Symbol = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
        let String_BI = Bundle_Index + ""
        
        if(Bundle_Index < 10){
          return Symbol[Bundle_Index] + "、" + Type
        }else if(Bundle_Index < 19){
          return "十" + Symbol[parseInt(String_BI[1])] + "、" + Type
        }else if(Bundle_Index < 99 && String_BI[1] == "9"){
          return Symbol[parseInt(String_BI[0])] + "十、" + Type
        }else if(Bundle_Index < 99){
          return Symbol[parseInt(String_BI[0]) - 1] + "十" + Symbol[parseInt(String_BI[1])] + "、" + Type
        }
      },
      Get_Picture_Src(position, Bundle_Index, Question_Index, Stem_Pic_Row_Index, Stem_Pic_Col_Index){
        let Question = this.Question_Bundle[Bundle_Index].list[Question_Index];
        let Pos_Info = position.split(" ")
          // stem/answer/analysis_image
          if(Pos_Info.length == 1){
              let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
              return Question[Pos_Info[0]][Index]
          }else{
            // options/sub_questions_image Index
            // 即第几个选项/第几个小题的第几组图片
            if(Pos_Info.length == 2 && (Pos_Info[0] == 'options_image' || Pos_Info[0] == 'sub_questions_image')){
              let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
              return Question[Pos_Info[0]][Pos_Info[1]][Index]
            }
            // stem/answer/analysis_image Big_Sub_Question_Index
            // 即综合题存在小题时的对应题干/答案/解析的图片
            else if(Pos_Info.length == 2 && (Pos_Info[0] == 'stem_image' || Pos_Info[0] == 'answer_image' ||  Pos_Info[0] == 'analysis_image' )){
              let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
              return Question.sub_questions[Pos_Info[1]][Pos_Info[0]][Index]
            }
            // options/sub_questions_image Big_Sub_Question_Index Index
            // 即综合题存在小题时，某个选项/小题的小题的对应图片
            else if(Pos_Info.length == 3){
              let Index = (Stem_Pic_Row_Index - 1) * 12 + Stem_Pic_Col_Index - 1
              return Question.sub_questions[Pos_Info[1]][Pos_Info[0]][Pos_Info[2]][Index]
            }
          }
      },
      // 返回选项的字母信息
      Get_Option_Label(Option_Index){
        return String.fromCharCode(65 + Option_Index)
      },
      // “聚焦”题目的一些操作内容，包括向前移动，向后移动，删除，导入编辑区
      // 向前移动
      Focus_Question_Move_Front(Bundle_Index){
        let Index = 0;
        while(this.Draging_Questions_Rect[Index].x != this.Focusing_Questions_Position.x || 
              this.Draging_Questions_Rect[Index].y != this.Focusing_Questions_Position.y){
                Index = Index + 1
              }
        if(Index == 0){
          this.$message.error("已经是此题包的第一个位置，无法继续向前移动了。")
          return
        }else{
          let Item = JSON.parse(JSON.stringify(this.Question_Bundle[Bundle_Index].list[Index]));
          this.Question_Bundle[Bundle_Index].list.splice(Index, 1)
          this.Question_Bundle[Bundle_Index].list.splice(Index - 1, 0, Item);
          this.Focusing_Questions_Position.x = this.Draging_Questions_Rect[Index - 1].x;
          this.Focusing_Questions_Position.y = this.Draging_Questions_Rect[Index - 1].y;
        }
      },
      // 向后移动
      Focus_Question_Move_Back(Bundle_Index){
        let Index = 0;
        while(this.Draging_Questions_Rect[Index].x != this.Focusing_Questions_Position.x || 
              this.Draging_Questions_Rect[Index].y != this.Focusing_Questions_Position.y){
                Index = Index + 1
              }
        if(Index == this.Question_Bundle[Bundle_Index].list.length - 1){
          this.$message.error("已经是此题包的最后一个位置，无法继续向后移动了。")
          return
        }else{
          let Item = JSON.parse(JSON.stringify(this.Question_Bundle[Bundle_Index].list[Index]));
          this.Question_Bundle[Bundle_Index].list.splice(Index, 1)
          this.Question_Bundle[Bundle_Index].list.splice(Index + 1, 0, Item);
          this.Focusing_Questions_Position.x = this.Draging_Questions_Rect[Index + 1].x;
          this.Focusing_Questions_Position.y = this.Draging_Questions_Rect[Index + 1].y;
        }
      },
      // 删除
      Focus_Question_Delete(Bundle_Index){
        let Index = 0;
        while(this.Draging_Questions_Rect[Index].x != this.Focusing_Questions_Position.x || 
              this.Draging_Questions_Rect[Index].y != this.Focusing_Questions_Position.y){
                Index = Index + 1
              }
        
          this.Question_Bundle[Bundle_Index].list.splice(Index, 1)
          
          this.Reset_Focus();

          if(this.Question_Bundle[Bundle_Index].list.length == 0){
            this.Question_Bundle.splice(Bundle_Index, 1)
          }

      },
      // 编辑
      Focus_Question_Edit(Bundle_Index){
        let Index = 0;
        while(this.Draging_Questions_Rect[Index].x != this.Focusing_Questions_Position.x || 
              this.Draging_Questions_Rect[Index].y != this.Focusing_Questions_Position.y){
                Index = Index + 1
              }
        this.Editing_Position = Bundle_Index + " " + Index
        this.Edit_Question(this.Question_Bundle[Bundle_Index].type, this.Question_Bundle[Bundle_Index].list[Index])

      },
      // 题包内试题的前移，后移，删除，修改
      // 前移
      Question_Move_Front(Bundle_Index, Question_Index, Ref_Name){

        let Item = JSON.parse(JSON.stringify(this.Question_Bundle[Bundle_Index].list[Question_Index]))
        this.Question_Bundle[Bundle_Index].list.splice(Question_Index, 1)
        this.Question_Bundle[Bundle_Index].list.splice(Question_Index - 1, 0, Item)
        
        this.$refs[Ref_Name][0].doClose();
        
        this.$message.success(this.Question_Bundle[Bundle_Index].type + ' 的第 ' + (Question_Index + 1) + ' 题已向前移动一题。')
      
      },
      // 后移
      Question_Move_Back(Bundle_Index, Question_Index, Ref_Name){

        let Item = JSON.parse(JSON.stringify(this.Question_Bundle[Bundle_Index].list[Question_Index]))
        this.Question_Bundle[Bundle_Index].list.splice(Question_Index, 1)
        this.Question_Bundle[Bundle_Index].list.splice(Question_Index + 1, 0, Item)

        this.$refs[Ref_Name][0].doClose();

        this.$message.success(this.Question_Bundle[Bundle_Index].type + ' 的第 ' + (Question_Index + 1) + ' 题已向后移动一题。')

      },
      // 删除
      Question_Delete(Bundle_Index, Question_Index){
        this.Question_Bundle[Bundle_Index].list.splice(Question_Index, 1)
      },
      // 修改
      Question_Edit(Bundle_Index, Question_Index){
        let Item = JSON.parse(JSON.stringify(this.Question_Bundle[Bundle_Index].list[Question_Index]))
        this.Editing_Position = Bundle_Index + " " + Question_Index
        this.Edit_Question(this.Question_Bundle[Bundle_Index].type, Item)
      },
      // 题包的前移，后移，删除
      Bundle_Move_Front(Bundle_Index){
        let Item = JSON.parse(JSON.stringify(this.Question_Bundle[Bundle_Index]))
        this.Question_Bundle.splice(Bundle_Index, 1)
        this.Question_Bundle.splice(Bundle_Index - 1, 0, Item)
      },
      Bundle_Move_Back(Bundle_Index){
        let Item = JSON.parse(JSON.stringify(this.Question_Bundle[Bundle_Index]))
        this.Question_Bundle.splice(Bundle_Index, 1)
        this.Question_Bundle.splice(Bundle_Index + 1, 0, Item)
      },
      Bundle_Delete(Bundle_Index){
        this.Question_Bundle.splice(Bundle_Index, 1)
      },
      // 返回可提供的题目区间长度
      Get_Question_Row_Length(Length, TBQ_Row_Index){
        if(Length - 24 * (TBQ_Row_Index - 1) > 24){
          return 24
        }else{
          return Length - 24 * (TBQ_Row_Index - 1)
        }
      },
      // 获取组件坐标
      // Start 代表按下去了
      // End 代表松开了
      Get_Document_Pos_Start(Ref_Name, Bundle_Index){

        // 初始化按下去的题目的坐标，之后根据这个来反查是哪个题被按下去了
        let Document = this.$refs[Ref_Name][0].$el.getBoundingClientRect();
        this.Draging_Questions_Position = {
          x: Document.x,
          y: Document.y
        }
        // 将对应的题目组的所有坐标全部拿到
        this.Draging_Questions_Rect = [];
        for(let i = 0; i < this.Question_Bundle[Bundle_Index].list.length; i++){
          let Item_Ref_Name = 'Total_Bundle_' + Bundle_Index + '_Row_' + (Math.ceil((i+1)/24)) + '_' + ((i % 24) + 1) + '_Label'
          let Item = this.$refs[Item_Ref_Name][0].$el.getBoundingClientRect();
          this.Draging_Questions_Rect.push({
            x: Item.x,
            y: Item.y
          })
        }
        this.Draging_Questions_Index = Bundle_Index
      },
      Get_Document_Pos_End(Ref_Name, Bundle_Index){

        if(Bundle_Index != this.Draging_Questions_Index){
          this.$message.error("无效移动。")
          this.Draging_Questions_Index = -1
          this.Draging_Questions_Position = {
            x: -1,
            y: -1
          }
          this.Focusing_Questions_Position = {
            x: 0,
            y: 0
          }
          this.Draging_Questions_Rect = []
          return
        }

        // 抓取到当前松开的位置的坐标
        let Document = this.$refs[Ref_Name][0].$el.getBoundingClientRect();
        let Aim_Position = {
          x: Document.x,
          y: Document.y
        }

        let Start = -1;
        for(let i = 0; i < this.Draging_Questions_Rect.length; i++){
          if(this.Draging_Questions_Position.x == this.Draging_Questions_Rect[i].x &&
            this.Draging_Questions_Position.y == this.Draging_Questions_Rect[i].y){
              Start = i;
              break;
            }
        }

        let End = -1;
        for(let i = 0; i < this.Draging_Questions_Rect.length; i++){
          if(Aim_Position.x == this.Draging_Questions_Rect[i].x &&
            Aim_Position.y == this.Draging_Questions_Rect[i].y){
              End = i;
              break;
            }
        }
        if(Start != End && Start != -1 && End != -1){
          this.$message.success("第 " + (this.Draging_Questions_Index + 1) + " 大题的第 " + (Start + 1) + " 题已移动到第 " + (End+1) + " 题处。")
          this.Focusing_Questions_Position = {
            x: 0,
            y: 0
          }
          this.Focusing_Index = -1
          let Item = JSON.parse(JSON.stringify(this.Question_Bundle[Bundle_Index].list[Start]))
          this.Question_Bundle[Bundle_Index].list.splice(Start, 1)
          this.Question_Bundle[Bundle_Index].list.splice(End, 0, Item)
        }else if(Start == End && Start != -1 && End != -1){
          this.Focusing_Questions_Position = {
            x: Aim_Position.x,
            y: Aim_Position.y
          }
          this.Focusing_Index = Bundle_Index
        }

        this.Draging_Questions_Index = -1
        this.Draging_Questions_Position = {
          x: 0,
          y: 0
        }
      },
      // 外面点一下重置题目聚焦
      Reset_Focus(){
        this.Focusing_Questions_Position = {
          x: 0,
          y: 0
        },
        this.Focusing_Index = -1
        this.Draging_Questions_Rect = [];
      },
      // 调整指针样式为抓握和松开
      Get_Cursor(Ref_Name, Bundle_Index, Question_Index){
 
        let Search = this.$refs[Ref_Name]
        if(!Search || Search.length == 0){
          return 
        }
        let Document = Search[0].$el.getBoundingClientRect();
        let Aim_Position = {
          x: Document.x,
          y: Document.y
        }

        if(Bundle_Index != this.Draging_Questions_Index && this.Draging_Questions_Index != -1){
          return {'cursor': 'not-allowed'}
        }

        // 同一题包，且是拖拽的起点
        if(this.Draging_Questions_Index == Bundle_Index 
          && Aim_Position.x == this.Draging_Questions_Position.x 
          && Aim_Position.y == this.Draging_Questions_Position.y){
          return {
            'cursor': 'grabbing',
            'border': '2px solid #409EFF',
            'border-radius': '5px'
          }
        }
        // 同一题包，但不同的题目
        else if(this.Draging_Questions_Index == Bundle_Index){
          return {
            'cursor': 'grabbing',
            'border': '2px solid #FFE37F',
            'border-radius': '5px'
          }
        }
        // 
        else if(Aim_Position.x == this.Focusing_Questions_Position.x 
          && Aim_Position.y == this.Focusing_Questions_Position.y){
            if(parseInt(this.Editing_Position.split(' ')[0]) == Bundle_Index && 
              parseInt(this.Editing_Position.split(' ')[1]) == Question_Index){
              return {
                'border': '2px solid red',
                'border-radius': '5px',
                'box-sizing': 'border-box'
              }
            }else{
              return {
                'border': '2px solid #409EFF',
                'border-radius': '5px',
                'box-sizing': 'border-box'
              }
            }
        }
        else{
          return {'cursor': 'grab'}
        }
      },
      // 由于有两个位置调用编辑，所以准备了一个方法让两边一起接进来
      Edit_Question(Question_Type, Question_Info){
        this.Type = "";
        this.Type = Question_Type;
        this.Refresh = !this.Refresh
        this.Using_Part = 'Input'
        sessionStorage.setItem("PaperEditing", JSON.stringify(Question_Info))
      },
      // 准备提交（入包）
      Prepare_For_Submit(Ques){

        this.Wrong_Char_Info = ""
        this.Wrong_Char_Dialog = false

        if(this.Type != '综合题'){

            // 名称格式修正一下
            let Question = JSON.parse(Ques);

            // 必填项检测
            if(Question.stem.length == 0){
                this.Wrong_Char_Info = "题干项尚未填写。"
                this.Wrong_Char_Dialog = true
                return
            }

            if(['单选题', '多选题', '判断题'].indexOf(this.Type) != -1){
                let Str = Question.stem
                let Quote_Reg = new RegExp("(\\(|\\（)(\\s*)(\\)|\\）)", "g")
                let res = Quote_Reg.exec(Str)
                while(res != null){
                    Str = Str.replace(Quote_Reg, "$\\SIFChoice$")
                    res = Quote_Reg.exec(Str)
                }
                Question.stem = Str
            }else if(this.Type == '填空题'){
                let Str = Question.stem
                let Space_Reg = new RegExp("____+", 'g')
                let res = Space_Reg.exec(Str)
                while(res != null){
                    Str = Str.replace(Space_Reg, "$\\SIFBlank$")
                    res = Space_Reg.exec(Str)
                }
                Question.stem = Str
            }

            // 开始检测题干项是否正确
            let C_Stem = this.Check_Do(Question.stem);
            if(C_Stem[2]){
                this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
                this.Wrong_Char_Dialog = true
                return
            }else if(C_Stem[1].length == 0){
                Question.stem = C_Stem[0]
            }else{
                this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                for(let i = 0; i < C_Stem[1].length; i++){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
                }
                this.Wrong_Char_Dialog = true
                return 
            }
            
            // 开始检测选项部分
            this.Wrong_Char_Info = ""
            for(let i = 0; i < Question.options.length; i++){
                // 必填项检测
                if(Question.options[i].length == 0){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "选项 " + String.fromCharCode( 65 + i ) + " 尚未填写。请注意所有选项都是必填项。<br>"
                }
            }
            if(this.Wrong_Char_Info != ""){
                this.Wrong_Char_Dialog = true;
                return
            }
            
            // 内容检测
            for(let i = 0; i < Question.options.length; i++){
                
                let C_Option_Item = this.Check_Do(Question.options[i])
                if(C_Option_Item[2]){
                    this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Option_Item[1].length == 0){
                    Question.options.splice(i, 1, C_Option_Item[0])
                }else{
                    this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let j = 0; j < C_Option_Item[1].length; j++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Option_Item[1][j].position + " 处的 " + C_Option_Item[1][j].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            }
            // this.$message.success("选项内容格式检测已通过。")

            if(Question.answer.length != 0){
                let C_Answer = this.Check_Do(Question.answer);
                if(C_Answer[2]){
                    this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Answer[1].length == 0){
                    Question.answer = C_Answer[0]
                }else{
                    this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Answer[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            } 
            // this.$message.success("答案内容格式检测已通过。")

            if(Question.analysis.length != 0){
                let C_Analysis = this.Check_Do(Question.analysis);
                if(C_Analysis[2]){
                    this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Analysis[1].length == 0){
                    Question.analysis = C_Analysis[0]
                }else{
                    this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Analysis[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            }
            
            // 小题内容检测 - 必填检测
            this.Wrong_Char_Info = ""
            for(let i = 0; i < Question.sub_questions.length; i++){
                if(Question.sub_questions[i].length == 0){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "第 " + (i+1) + " 小题尚未填写。<br>"
                }
            }
            if(this.Wrong_Char_Info != ""){
                this.Wrong_Char_Dialog = true;
                return
            }
            // 内容检测
            for(let i = 0; i < Question.sub_questions.length; i++){
                let C_Sub_Ques_Item = this.Check_Do(Question.sub_questions[i])
                if(C_Sub_Ques_Item[2]){
                    this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Sub_Ques_Item[1].length == 0){
                    Question.sub_questions.splice(i, 1, C_Sub_Ques_Item[0])
                }else{
                    this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let j = 0; j < C_Sub_Ques_Item[1].length; j++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Sub_Ques_Item[1][j].position + " 处的 " + C_Sub_Ques_Item[1][j].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            }
        }
        // 开始检测综合题部分
        else{

            // 名称规范化
            let Question = JSON.parse(Ques);

            // 必填项检测
            if(Question.stem.length == 0){
                this.Wrong_Char_Info = "题干项尚未填写。"
                this.Wrong_Char_Dialog = true
                return
            }

            // 开始检测题干项是否正确
            let C_Stem = this.Check_Do(Question.stem);
            if(C_Stem[2]){
                this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
                this.Wrong_Char_Dialog = true
                return
            }else if(C_Stem[1].length == 0){
                Question.stem = C_Stem[0]
            }else{
                this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                for(let i = 0; i < C_Stem[1].length; i++){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
                }
                this.Wrong_Char_Dialog = true
                return 
            }

            // 检测答案项部分，由于是非必填项，不填也没事
            if(Question.answer.length != 0){
                let C_Answer = this.Check_Do(Question.answer);
                if(C_Answer[2]){
                    this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Answer[1].length == 0){
                    Question.answer = C_Answer[0]
                }else{
                    this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Answer[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            } 

            // 检测解析字段 - 不填也没事
            if(Question.analysis.length != 0){
                let C_Analysis = this.Check_Do(Question.analysis);
                if(C_Analysis[2]){
                    this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Analysis[1].length == 0){
                    Question.analysis = C_Analysis[0]
                }else{
                    this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Analysis[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            }

            for(let j = 0; j < Question.sub_questions.length; j++){

                let Item = Question.sub_questions[j]
                // 重置提示信息
                this.Wrong_Char_Info = ""

                // 必填项检测
                if(Item.stem.length == 0){
                    this.$message.error("题干项尚未填写。")
                    return
                }

                if(['单选题', '多选题', '判断题'].indexOf(Question.sub_questions[j].type) != -1){
                    let Str = Question.sub_questions[j].stem
                    let Quote_Reg = new RegExp("(\\(|\\（)(\\s*)(\\)|\\）)", "g")
                    let res = Quote_Reg.exec(Str)
                    while(res != null){
                        Str = Str.replace(Quote_Reg, "$\\SIFChoice$")
                        res = Quote_Reg.exec(Str)
                    }
                    Question.sub_questions[j].stem = Str
                }else if(Question.sub_questions[j].type == '填空题'){
                    let Str = Question.sub_questions[j].stem
                    let Space_Reg = new RegExp("____+", 'g')
                    let res = Space_Reg.exec(Str)
                    while(res != null){
                        Str = Str.replace(Space_Reg, "$\\SIFBlank$")
                        res = Space_Reg.exec(Str)
                    }
                    Question.sub_questions[j].stem = Str
                }

                // 开始检测题干项是否正确
                let C_Stem = this.Check_Do(Item.stem);
                if(C_Stem[2]){
                    this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Stem[1].length == 0){
                    Item.stem = C_Stem[0]
                }else{
                    this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Stem[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
                
                // 开始检测选项部分
                this.Wrong_Char_Info = ""
                for(let i = 0; i < Item.options.length; i++){
                    // 必填项检测
                    if(Item.options[i].length == 0){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "选项 " + String.fromCharCode( 65 + i ) + " 尚未填写。请注意所有选项都是必填项。<br>"
                    }
                }
                if(this.Wrong_Char_Info != ""){
                    this.Wrong_Char_Dialog = true;
                    return
                }
                
                // 内容检测
                for(let i = 0; i < Item.options.length; i++){
                    
                    let C_Option_Item = this.Check_Do(Item.options[i])
                    if(C_Option_Item[2]){
                        this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Option_Item[1].length == 0){
                        Item.options.splice(i, 1, C_Option_Item[0])
                    }else{
                        this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let j = 0; j < C_Option_Item[1].length; j++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Option_Item[1][j].position + " 处的 " + C_Option_Item[1][j].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return 
                    }
                }

                if(Item.answer.length != 0){
                    let C_Answer = this.Check_Do(Item.answer);
                    if(C_Answer[2]){
                        this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Answer[1].length == 0){
                        Item.answer = C_Answer[0]
                    }else{
                        this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let i = 0; i < C_Answer[1].length; i++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return 
                    }
                } 

                if(Item.analysis.length != 0){
                    let C_Analysis = this.Check_Do(Item.analysis);
                    if(C_Analysis[2]){
                        this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Analysis[1].length == 0){
                        Item.analysis = C_Analysis[0]
                    }else{
                        this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let i = 0; i < C_Analysis[1].length; i++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return 
                    }
                }
                
                // 小题内容检测 - 必填检测
                this.Wrong_Char_Info = ""
                for(let i = 0; i < Item.sub_questions.length; i++){
                    if(Item.sub_questions[i].length == 0){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "第 " + (i+1) + " 小题尚未填写。<br>"
                    }
                }
                if(this.Wrong_Char_Info != ""){
                    this.Wrong_Char_Dialog = true;
                    return
                }
                // 内容检测
                for(let i = 0; i < Item.sub_questions.length; i++){
                    let C_Sub_Ques_Item = this.Check_Do(Item.sub_questions[i])
                    if(C_Sub_Ques_Item[2]){
                        this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Sub_Ques_Item[1].length == 0){
                        Item.sub_questions.splice(i, 1, C_Sub_Ques_Item[0])
                    }else{
                        this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let j = 0; j < C_Sub_Ques_Item[1].length; j++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Sub_Ques_Item[1][j].position + " 处的 " + C_Sub_Ques_Item[1][j].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return 
                    }
                }
            }
        }
        this.Add_To_Bundle(JSON.parse(Ques))
    },
    Multi_Choice(){
      this.Multi_Info = []
      for(let i = 0; i < this.Question_Bundle.length; i++){
          if(this.Question_Bundle[i].type == this.Type){
            let Score = 0;
            for(let j = 0; j < this.Question_Bundle[i].list.length; j++){
              Score = Score + this.Question_Bundle[i].list[j].score
            }
            this.Multi_Info.push({
              index: i,
              desc: this.Question_Bundle[i].desc,
              length: this.Question_Bundle[i].list.length,
              score: Score
            })
          }
        }
      this.Multi_Type_Insert = true;
    },
    Waiting_Insert(Index){
      // console.log(this.Waiting_Question)
      this.Question_Bundle[Index].list.push(JSON.parse(JSON.stringify(this.Waiting_Question)))
      this.Multi_Info = [];
      this.Multi_Type_Insert = false;
      this.Refresh = !this.Refresh;
      // console.log(this.Jumping)
      if(this.Jumping != ""){
        let Aim = this.Jumping.split(" ")
        this.Question_Bundle[Aim[0]].list.splice(Aim[1], 1)
        this.Reset_Focus()
        this.Jumping = ""
      }
    },
    Add_To_Bundle(Question){
      if(this.Editing_Position == ""){
        let Count = 0
        for(let i = 0; i < this.Question_Bundle.length; i++){
          if(this.Question_Bundle[i].type == this.Type){
            Count = Count + 1
          }
        }
        if(Count > 1){
          this.Waiting_Question = Question
          this.Multi_Choice()
          return
        }else{
          let Flag = false
          for(let i = 0; i < this.Question_Bundle.length; i++){
            if(this.Question_Bundle[i].type == this.Type){
              this.Question_Bundle[i].list.push(Question)
              Flag = true
              break
            }
          }
          if(!Flag){
            this.Question_Bundle.push({
              type: this.Type,
              list: [Question],
              desc: "第1个" + this.Type + "题包"
            })
          }
        }
      }else{
        let Aim = this.Editing_Position.split(" ");
        this.Question_Bundle[Aim[0]].list.splice(Aim[1], 1, Question)
        this.Editing_Position = ""
      }
      sessionStorage.removeItem("PaperEditing")
      this.Refresh = !this.Refresh
    },
    // 负责实际检查的部分
    Check_Do(content){

        let remakeContent = "";

        var latexFlag = false;
        let Regx = /[A-Za-z0-9]/;

        var Img_Catcher = new RegExp('<img src="(.*?)">', 'g')
        var Result_List = Img_Catcher.exec(content);

        var Img_SE = [];
        var Start = 0;

        let Wrong_Char = [];

        while(Result_List != null){
            var Temp_Catcher = '<img src="' + Result_List[1] + '">';
            if(Img_SE.length > 0){
                Start = content.indexOf(Temp_Catcher, Img_SE[Img_SE.length - 1][1]);
            }
            else{
                Start = content.indexOf(Temp_Catcher);
            }
            Img_SE.push([Start, Start + Temp_Catcher.length - 1])
            Result_List = Img_Catcher.exec(content);
        }

        var Img_Index = 0;

        for(var i = 0; i < content.length; i++){

            if(content[i] == '$' && !latexFlag){
                latexFlag = true;
            }else if(content[i] == '$' && latexFlag){
                latexFlag = false;
            }

            if(Img_SE.length > 0 && i >= Img_SE[Img_Index][0] && i <= Img_SE[Img_Index][1]){
                remakeContent = remakeContent + content[i];
                continue;
            }else if(Img_SE.length > 0 && i > Img_SE[Img_Index][1] && Img_Index < Img_SE.length - 1){
                Img_Index = Img_Index + 1
            }

            if(!latexFlag){
                if (Regx.test(content[i]) || this.math_pun_list.indexOf(content[i]) != -1) {
                    if(remakeContent[remakeContent.length - 1] == '$'){
                        remakeContent = remakeContent.substring(0, remakeContent.length - 1) + content[i] + "$";
                    }else if(['i', 'b'].indexOf(content[i]) != -1 && 
                        (
                            (content[i - 1] == '/' && content[i - 2] == '<' && content[i + 1] == '>') ||
                            (content[i - 1] == '<' && content[i + 1] == '>')
                        )
                    ){
                        remakeContent = remakeContent + content[i]
                    }else if(content[i] == '/' && ['i', 'b'].indexOf(content[i+1]) != -1 && content[i-1] == '<' && content[i+2] == '>'){
                        remakeContent = remakeContent + content[i]
                    }else{
                        remakeContent = remakeContent + "$" + content[i] + "$";
                    }
                }
                // 中文字符，中英文允许的符号，空格或Latex结尾的$符号，换行符
                else if(!(content.charCodeAt(i) > 255 ||
                        this.ch_pun_list.indexOf(content[i]) != -1 || this.en_pun_list.indexOf(content[i]) != -1 ||
                        content[i] == ' ' || content[i] == '$' ||
                        content.charCodeAt(i) == 10)
                        ){
                    Wrong_Char.push({
                        position: i+1,
                        char: content[i]
                    })
                    remakeContent = remakeContent + content[i];
                }
                else {
                    remakeContent = remakeContent + content[i];
                }
            }else{
                remakeContent = remakeContent + content[i];
            }
        }
        return [remakeContent, Wrong_Char, latexFlag]
    },
    // 返回试题类别按钮样式
      Get_Type_Button_Class(Type){
          if(Type.value == this.Type){
              return "typeButton focusType"
          }else{
              return "typeButton unFocusType"
          }
      },
      // 切换当前想录入的题目类型
      Type_Change(Type_value){
        if(this.Editing_Position != ""){
          this.$confirm('您正在编辑已有题目内容，如果切换题目类型，您的修改结果不会保存，确定要切换吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(()=>{
              sessionStorage.removeItem("PaperEditing")
              this.Refresh = !this.Refresh
              this.Editing_Position = ""
              this.Type = Type_value
              this.Reset_Focus();
          }).catch(()=>{
              this.$message.info("已取消")
          })
        }else{
          this.Type = Type_value
        }
      },
      // 获取正在编辑的题目的题型和位置
      Get_Editing_Info(){
        let Aim_Info = this.Editing_Position.split(" ")
        return "正在编辑第 " + (parseInt(Aim_Info[0]) + 1) + " 大题的第 " + (parseInt(Aim_Info[1]) + 1) + " 题"
      },
      // 获取正在创建的题目的题型
      Get_Building_Info(){
        return "正在录入" + this.Type
      },
      // 调整分区显示的样式
      Part_Class(Part_Name){
        if(Part_Name == this.Using_Part){
          return 'Using_Part'
        }else{
          return 'Un_Using_Part'
        }
      },
      // 调整全卷预览时，题号的显示
      Get_Preview_Index(Bundle_Index, Question_Index){
        let Index = 0;
        for(let i = 0; i < Bundle_Index; i++){
          Index = Index + this.Question_Bundle[i].list.length
        }
        Index = Index + Question_Index
        return "(" + Index + ")"
      },
      Submit(){

        this.Title = this.Title.replace(/^\s*|\s*$/g,"");
        if(this.Title == ""){
          this.$message.error("尚未填写试卷标题或仅有空格，请重新填写。")
          return
        }
        
        let Upload_Json = {
          title: this.Title != "" ? this.Title : "未命名试卷",
          desc: "",
          Question_list: []
        }
        for(let i = 0; i < this.Question_Bundle.length; i++){
          let Question_Item = {
            desc : this.Question_Bundle[i].desc,
            type : ['单选题', '多选题', '判断题'].indexOf(this.Question_Bundle[i].type) != -1 ? 
                      '选择题' : ['简答题', '计算题'].indexOf(this.Question_Bundle[i].type) != -1 ? 
                        '解答题' : this.Question_Bundle[i].type == '填空题' ? '填空题' : '综合题',
            material : "",
            questions : []
          }
          for(let j = 0; j < this.Question_Bundle[i].list.length; j++){
            let Item = this.Question_Bundle[i].list[j];
            let Result = this.Submit_Format_Fix(JSON.stringify(Item), this.Question_Bundle[i].type)
            Question_Item.questions.push(Result)
          }
          Upload_Json.Question_list.push(Question_Item)
        }

        let Param = {
          'Input_Data': JSON.stringify({
                          "post_type": 1,
                          "user_id": this.UUID,
                          "subject": this.Subject,
                          "period": this.Period,
                          "questions": JSON.stringify(Upload_Json),
                        }, null, 4),
          'questionInput': true
        }

        commonAjax(this.backendIP + '/api/mathUpload', Param).then(()=>{
          this.$message.success("入库完成")
          this.Uploading = false;
        }).catch(
          ()=>{
            this.$message.error("入库失败")
            this.Uploading = false;
          }
        )
        
      },
      // 开始调用格式转换方法
      Submit_Format_Fix(Ques, Type){
        this.Wrong_Char_Info = ""
        this.Wrong_Char_Dialog = false

        if(Type != '综合题'){

            // 名称格式修正一下
            let Question = JSON.parse(Ques);

            // 必填项检测
            if(Question.stem.length == 0){
                this.Wrong_Char_Info = "题干项尚未填写。"
                this.Wrong_Char_Dialog = true
                return
            }

            if(['单选题', '多选题', '判断题'].indexOf(Type) != -1){
                let Str = Question.stem
                let Quote_Reg = new RegExp("(\\(|\\（)(\\s*)(\\)|\\）)", "g")
                let res = Quote_Reg.exec(Str)
                while(res != null){
                    Str = Str.replace(Quote_Reg, "$\\SIFChoice$")
                    res = Quote_Reg.exec(Str)
                }
                Question.stem = Str
            }else if(Type == '填空题'){
                let Str = Question.stem
                let Space_Reg = new RegExp("____+", 'g')
                let res = Space_Reg.exec(Str)
                while(res != null){
                    Str = Str.replace(Space_Reg, "$\\SIFBlank$")
                    res = Space_Reg.exec(Str)
                }
                Question.stem = Str
            }

            // 开始检测题干项是否正确
            let C_Stem = this.Check_Do(Question.stem);
            if(C_Stem[2]){
                this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
                this.Wrong_Char_Dialog = true
                return
            }else if(C_Stem[1].length == 0){
                Question.stem = C_Stem[0]
            }else{
                this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                for(let i = 0; i < C_Stem[1].length; i++){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
                }
                this.Wrong_Char_Dialog = true
                return 
            }
            
            // 开始检测选项部分
            this.Wrong_Char_Info = ""
            for(let i = 0; i < Question.options.length; i++){
                // 必填项检测
                if(Question.options[i].length == 0){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "选项 " + String.fromCharCode( 65 + i ) + " 尚未填写。请注意所有选项都是必填项。<br>"
                }
            }
            if(this.Wrong_Char_Info != ""){
                this.Wrong_Char_Dialog = true;
                return
            }
            
            // 内容检测
            for(let i = 0; i < Question.options.length; i++){
                
                let C_Option_Item = this.Check_Do(Question.options[i])
                if(C_Option_Item[2]){
                    this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Option_Item[1].length == 0){
                    Question.options.splice(i, 1, C_Option_Item[0])
                }else{
                    this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let j = 0; j < C_Option_Item[1].length; j++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Option_Item[1][j].position + " 处的 " + C_Option_Item[1][j].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            }
            // this.$message.success("选项内容格式检测已通过。")

            if(Question.answer.length != 0){
                let C_Answer = this.Check_Do(Question.answer);
                if(C_Answer[2]){
                    this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Answer[1].length == 0){
                    Question.answer = C_Answer[0]
                }else{
                    this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Answer[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            } 
            // this.$message.success("答案内容格式检测已通过。")

            if(Question.analysis.length != 0){
                let C_Analysis = this.Check_Do(Question.analysis);
                if(C_Analysis[2]){
                    this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Analysis[1].length == 0){
                    Question.analysis = C_Analysis[0]
                }else{
                    this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Analysis[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            }
            
            // 小题内容检测 - 必填检测
            this.Wrong_Char_Info = ""
            for(let i = 0; i < Question.sub_questions.length; i++){
                if(Question.sub_questions[i].length == 0){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "第 " + (i+1) + " 小题尚未填写。<br>"
                }
            }
            if(this.Wrong_Char_Info != ""){
                this.Wrong_Char_Dialog = true;
                return
            }
            // 内容检测
            for(let i = 0; i < Question.sub_questions.length; i++){
                let C_Sub_Ques_Item = this.Check_Do(Question.sub_questions[i])
                if(C_Sub_Ques_Item[2]){
                    this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Sub_Ques_Item[1].length == 0){
                    Question.sub_questions.splice(i, 1, C_Sub_Ques_Item[0])
                }else{
                    this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let j = 0; j < C_Sub_Ques_Item[1].length; j++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Sub_Ques_Item[1][j].position + " 处的 " + C_Sub_Ques_Item[1][j].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            }

            return this.Submit_Normal_Ques(Question, Type)
        }
        // 开始检测综合题部分
        else{

            // 名称规范化
            let Question = JSON.parse(Ques);

            // 必填项检测
            if(Question.stem.length == 0){
                this.Wrong_Char_Info = "题干项尚未填写。"
                this.Wrong_Char_Dialog = true
                return
            }

            // 开始检测题干项是否正确
            let C_Stem = this.Check_Do(Question.stem);
            if(C_Stem[2]){
                this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
                this.Wrong_Char_Dialog = true
                return
            }else if(C_Stem[1].length == 0){
                Question.stem = C_Stem[0]
            }else{
                this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                for(let i = 0; i < C_Stem[1].length; i++){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
                }
                this.Wrong_Char_Dialog = true
                return 
            }

            // 检测答案项部分，由于是非必填项，不填也没事
            if(Question.answer.length != 0){
                let C_Answer = this.Check_Do(Question.answer);
                if(C_Answer[2]){
                    this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Answer[1].length == 0){
                    Question.answer = C_Answer[0]
                }else{
                    this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Answer[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            } 

            // 检测解析字段 - 不填也没事
            if(Question.analysis.length != 0){
                let C_Analysis = this.Check_Do(Question.analysis);
                if(C_Analysis[2]){
                    this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Analysis[1].length == 0){
                    Question.analysis = C_Analysis[0]
                }else{
                    this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Analysis[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
            }

            for(let j = 0; j < Question.sub_questions.length; j++){

                let Item = Question.sub_questions[j]
                // 重置提示信息
                this.Wrong_Char_Info = ""

                // 必填项检测
                if(Item.stem.length == 0){
                    this.$message.error("题干项尚未填写。")
                    return
                }

                if(['单选题', '多选题', '判断题'].indexOf(Question.sub_questions[j].type) != -1){
                    let Str = Question.sub_questions[j].stem
                    let Quote_Reg = new RegExp("(\\(|\\（)(\\s*)(\\)|\\）)", "g")
                    let res = Quote_Reg.exec(Str)
                    while(res != null){
                        Str = Str.replace(Quote_Reg, "$\\SIFChoice$")
                        res = Quote_Reg.exec(Str)
                    }
                    Question.sub_questions[j].stem = Str
                }else if(Question.sub_questions[j].type == '填空题'){
                    let Str = Question.sub_questions[j].stem
                    let Space_Reg = new RegExp("____+", 'g')
                    let res = Space_Reg.exec(Str)
                    while(res != null){
                        Str = Str.replace(Space_Reg, "$\\SIFBlank$")
                        res = Space_Reg.exec(Str)
                    }
                    Question.sub_questions[j].stem = Str
                }

                // 开始检测题干项是否正确
                let C_Stem = this.Check_Do(Item.stem);
                if(C_Stem[2]){
                    this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Stem[1].length == 0){
                    Item.stem = C_Stem[0]
                }else{
                    this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Stem[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return 
                }
                
                // 开始检测选项部分
                this.Wrong_Char_Info = ""
                for(let i = 0; i < Item.options.length; i++){
                    // 必填项检测
                    if(Item.options[i].length == 0){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "选项 " + String.fromCharCode( 65 + i ) + " 尚未填写。请注意所有选项都是必填项。<br>"
                    }
                }
                if(this.Wrong_Char_Info != ""){
                    this.Wrong_Char_Dialog = true;
                    return
                }
                
                // 内容检测
                for(let i = 0; i < Item.options.length; i++){
                    
                    let C_Option_Item = this.Check_Do(Item.options[i])
                    if(C_Option_Item[2]){
                        this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Option_Item[1].length == 0){
                        Item.options.splice(i, 1, C_Option_Item[0])
                    }else{
                        this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let j = 0; j < C_Option_Item[1].length; j++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Option_Item[1][j].position + " 处的 " + C_Option_Item[1][j].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return 
                    }
                }

                if(Item.answer.length != 0){
                    let C_Answer = this.Check_Do(Item.answer);
                    if(C_Answer[2]){
                        this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Answer[1].length == 0){
                        Item.answer = C_Answer[0]
                    }else{
                        this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let i = 0; i < C_Answer[1].length; i++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return 
                    }
                } 

                if(Item.analysis.length != 0){
                    let C_Analysis = this.Check_Do(Item.analysis);
                    if(C_Analysis[2]){
                        this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Analysis[1].length == 0){
                        Item.analysis = C_Analysis[0]
                    }else{
                        this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let i = 0; i < C_Analysis[1].length; i++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return 
                    }
                }
                
                // 小题内容检测 - 必填检测
                this.Wrong_Char_Info = ""
                for(let i = 0; i < Item.sub_questions.length; i++){
                    if(Item.sub_questions[i].length == 0){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "第 " + (i+1) + " 小题尚未填写。<br>"
                    }
                }
                if(this.Wrong_Char_Info != ""){
                    this.Wrong_Char_Dialog = true;
                    return
                }
                // 内容检测
                for(let i = 0; i < Item.sub_questions.length; i++){
                    let C_Sub_Ques_Item = this.Check_Do(Item.sub_questions[i])
                    if(C_Sub_Ques_Item[2]){
                        this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Sub_Ques_Item[1].length == 0){
                        Item.sub_questions.splice(i, 1, C_Sub_Ques_Item[0])
                    }else{
                        this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let j = 0; j < C_Sub_Ques_Item[1].length; j++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Sub_Ques_Item[1][j].position + " 处的 " + C_Sub_Ques_Item[1][j].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return 
                    }
                }
            }
          return this.Submit_Mix_Ques(Question)
        }

      },
      // 将基础题转化为可以入库的格式的部分
    Submit_Normal_Ques(Ques, Type){

        var Temp_Result = ""

        if(['单选题', '多选题', '判断题', '填空题'].indexOf(Type) != -1){

            let Temp_Doc = {
                type: Type,
                stem: Ques.stem,
                stem_image: Ques.stem_image,
                score: parseFloat(Ques.score + ""),
                options: Ques.options,
                options_image: Ques.options_image,
                answer: Ques.answer,
                answer_image: Ques.answer_image,
                analysis: Ques.analysis,
                analysis_image: Ques.analysis_image
            }

            Temp_Result = Temp_Doc

        }else if(['简答题', '计算题'].indexOf(Type) != -1){


            let Temp_Doc = {
                desc: Ques.stem,
                desc_image: Ques.stem_image,
                type: "大题",
                score: parseFloat(Ques.score + ""),
                subquestions: [],
                answer: Ques.answer,
                answer_image: Ques.answer_image,
                analysis: Ques.analysis,
                analysis_image: Ques.analysis_image
            }


            for(let i = 0; i < Ques.sub_questions.length; i++){
                let Item = {
                    type: Type,
                    score: parseFloat(Ques.sub_questions_score[i] + ""),
                    stem: Ques.sub_questions[i],
                    stem_image: Ques.sub_questions_image[i],
                    options: [],
                    options_image: [],
                    answer: "",
                    answer_image: [],
                    analysis: "",
                    analysis_image: []
                }
                Temp_Doc.subquestions.push(Item)
            }
            Temp_Result = Temp_Doc
        }
        return Temp_Result
    },
    // 将综合题转化为可以入库的格式的部分
    Submit_Mix_Ques(Ques){
        let Temp_Doc = {
            desc: "",
            desc_image: [],
            type: "大题",
            score: 0,
            subquestions: [],
            answer: "",
            answer_image: [],
            analysis: "",
            analysis_image: []
        }

        Temp_Doc.desc = Ques.stem;
        Temp_Doc.desc_image = Ques.stem_image;

        Temp_Doc.score = parseFloat(Ques.score + "");

        for(let i = 0; i < Ques.sub_questions.length; i++){
            let Item = {
                type: Ques.sub_questions[i].type,
                score: parseFloat(Ques.sub_questions[i].score + ""),
                stem: Ques.sub_questions[i].stem,
                stem_image: Ques.sub_questions[i].stem_image,
                options: Ques.options,
                options_image: Ques.options_image,
                answer: Ques.sub_questions[i].answer,
                answer_image: Ques.sub_questions[i].answer_image,
                analysis: Ques.sub_questions[i].analysis,
                analysis_image: Ques.sub_questions[i].analysis_image
            }

          Temp_Doc.subquestions.push(Item)
        }

        Temp_Doc.answer = Ques.answer;
        Temp_Doc.answer_image = Ques.answer_image;

        Temp_Doc.analysis = Ques.analysis;
        Temp_Doc.analysis_image = Ques.analysis_image;

        return Temp_Doc
    },
    // 添加新的空题包
    Add_New_Empty_Bundle(){
      let Count = 1;
      for(let i = 0; i < this.Question_Bundle.length; i++){
        if(this.Question_Bundle[i].type == this.Add_Bundle_Type){
          Count = Count + 1
        }
      }
      this.Question_Bundle.push({
        type: this.Add_Bundle_Type,
        list: [],
        desc: "第" + Count + "个" + this.Add_Bundle_Type + "题包"
      })
    },
    // 给表格的每一行赋予相对的样式
    Multi_Choise_Table_Row(Info_Index){
      if(Info_Index%2 == 1){
        return "Multi_Choise_Table_Row_0"
      }else{
        return "Multi_Choise_Table_Row_1"
      }
    },
    Focus_Jump_Check(Type){
      let Count = 0
      for(let i = 0; i < this.Question_Bundle.length; i++){
        if(this.Question_Bundle[i].type == Type){
          Count = Count + 1
        }
      }
      if(Count > 1){
        return true
      }else{
        return false
      }
    },
    Focus_Question_Jump(Bundle_Index){
      let Index = 0;
      while(this.Draging_Questions_Rect[Index].x != this.Focusing_Questions_Position.x || 
            this.Draging_Questions_Rect[Index].y != this.Focusing_Questions_Position.y){
              Index = Index + 1
            }
      let Item = JSON.parse(JSON.stringify(this.Question_Bundle[Bundle_Index].list[Index]))
      this.Jumping = Bundle_Index + " " + Index
      this.Waiting_Question = Item;
      this.Multi_Info = []
      for(let i = 0; i < this.Question_Bundle.length; i++){
          if(this.Question_Bundle[i].type == this.Question_Bundle[Bundle_Index].type){
            let Score = 0;
            for(let j = 0; j < this.Question_Bundle[i].list.length; j++){
              Score = Score + this.Question_Bundle[i].list[j].score
            }
            this.Multi_Info.push({
              index: i,
              desc: this.Question_Bundle[i].desc,
              length: this.Question_Bundle[i].list.length,
              score: Score
            })
          }
        }
      this.Multi_Type_Insert = true;
    },
    // 替换表格中的图片内容
    // 更新表格中的图片文件
    Table_Img_Get(Table_Html){
      for(var key in this.Paper_Image_Dict){
        var Img_Name_Catcher = new RegExp('<img src="' + key + '"')
        if(Img_Name_Catcher.exec(Table_Html) != null){
          Table_Html = Table_Html.replace(Img_Name_Catcher,'<img src="' + this.Paper_Image_Dict[key] + '"')
        }
      }
      return Table_Html
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.toSingle{
    height: 40px; 
    line-height: 40px;
    width: 10vw; 
    background: #FFE37F;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
}
.toSingle:hover{ 
    background: #FFF0A0;
    color: #888;
}

.Ques_Button{
  width: 100%;
  height: 100%;
  cursor: grab;
  box-sizing: border-box;
}
.Ques_Button:hover{
  border: 1px solid whitesmoke;
  border-radius: 5px;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
}
.PreviewPaperArea{
  width: 100%; 
  border: 2px solid #409EFF;
  border-radius: 10px; 
  min-height: 400px; 
  padding: 20px;
  box-shadow: 2px 3px 4px 0 rgba(64, 158, 255, 0.8);
}
// 主要区域的高度
.Total_Bundle_Popover_Main{
  height: 290px;
  overflow-x: hidden;
  overflow-y: auto;
}
.Un_Selectable{
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  user-select: none;
}
// 下面四个是试题类型按钮的样式
.typeButton{
    border-radius: 20px;
    margin-right: 10px;
    font-weight: bold;
    box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
}
.typeButton.focusType{
    background: #409EFF;
    border: 1px solid #409EFF;
    color: white;
}
.typeButton.unFocusType{
    background: white;
    border: 1px solid whitesmoke;
}
.typeButton.unFocusType:hover{
    background: #E5EEFF;
    border: 1px solid #F5FEFF;
}
// 正在编辑的题目位置的显示框的样式
.Editing_Info{
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  border: 2px dashed red;
  background: rgba($color: red, $alpha: 0.1);
  color: red;
}
// 正在新建题目的显示框的样式
.Building_Info{
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  border: 2px dashed #409EFF;
  background: rgba($color: 	#409EFF, $alpha: 0.1);
  color: 	#409EFF;
}
// 符合当前正在使用的部分的标签
.Un_Using_Part{
  border: 2px solid #409EFF;
  background: white;
  color: #409EFF;
  cursor: pointer;
  box-sizing: border-box;
}
.Un_Using_Part:hover{
  background: rgba($color: 	#409EFF, $alpha: 0.1);
}
.Using_Part{
  border: 2px solid #409EFF;
  background: #409EFF;
  color: white;
  cursor: pointer;
  box-sizing: border-box;
}
.Desc_Input ::v-deep .el-input__inner{
  margin: 5px 0px;
  padding: 0px;
  height: 20px;
  line-height: 20px;
}
.Multi_Choise_Table_Top{
  border: 1px solid #409eff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.Multi_Choise_Table_Top_Label{
  border-right: 1px solid #409eff; 
  height: 40px; 
  line-height: 40px;
  color: #409EFF
}
.Multi_Choise_Table_Row_0{
  height: 40px; 
  line-height: 40px;
  border: 1px solid #409eff;
  border-top: none;
}
.Multi_Choise_Table_Row_1{
  height: 40px; 
  line-height: 40px;
  border: 1px solid #409eff;
  border-top: none;
  background: rgba($color: 	#409EFF, $alpha: 0.1);;
}
</style>
<style>
/* 设定一下弹出框的属性 */
.el-popover.Total_Bundle_Popover{
  height: 350px;
}

.el-dialog.Multi_Type_Selector{
  display: flex;
  flex-direction: column;
  margin:0 !important;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
}


.Break_Line{
   word-break:break-all; 
   text-align: left
}
</style>
