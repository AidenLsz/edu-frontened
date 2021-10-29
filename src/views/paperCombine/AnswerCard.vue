<template>
  <div 
    style="background: #F5FEFF"
    v-loading="waiting"
    element-loading-text="正在准备答题卡，请稍后..."
    element-loading-spinner="el-icon-loading">
    <div style="margin-left: 10vw; margin-right: 10vw; min-height: 700px; padding-top: 22px; margin-bottom: 30px;">
      <el-dialog 
        :visible.sync="Edit_Part_Dialog"
        title="编辑题目分区信息"
        width="50%"
        :modal-append-to-body="false"
        :close-on-click-modal="true"
        @close="Reset_Edit_Part_Info()">
        <el-row type="flex" justify="center" style="font-size: 18px; width: 100%"
        >
          <el-input 
            v-model="Editing_Part_Info"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            resize="none"></el-input>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 20px">
          <el-button type="primary" plain size="small" @click="Finish_Edit_Part_Info()">完成</el-button>
        </el-row>
      </el-dialog>
      <el-dialog 
        :visible.sync="Cautions_Editor_Dialog"
        title="编辑注意事项信息"
        width="50%"
        :modal-append-to-body="false"
        :close-on-click-modal="true">
        <el-row type="flex" justify="center" style="font-size: 18px; width: 100%"
        >
          <el-input 
            v-model="PaperInfo.Cautions"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            resize="none"></el-input>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 20px">
          <el-button type="primary" plain size="small" @click="Cautions_Editor_Dialog = false">完成</el-button>
        </el-row>
      </el-dialog>
      <!-- 左侧的纸页样式调整 -->
      <div class="PaperStableIcon">
        <el-row type="flex" justify="start" style="margin-top: 20px; margin-left: 5px">
          <label>
            点击切换
          </label>
        </el-row>
        <el-row type="flex" justify="start" style="margin-top: -5px; margin-left: 5px">
          <label>
            纸页布局
          </label>
        </el-row>
        <el-row type="flex" justify="start" style="margin-top: 10px; margin-left: 5px">
          <label>
            纸页
          </label>
        </el-row>
        <el-row type="flex" justify="center" class="PaperSettingIconArea">
          <label @click="ChangePaperType()" style="cursor: pointer">{{PaperType}}</label>
        </el-row>
        <el-row type="flex" justify="start" style="margin-top: 10px; margin-left: 5px">
          <label>
            布局
          </label>
        </el-row>
        <el-row type="flex" justify="center" class="PaperSettingIconArea">
          <label @click="ChangeFillType()" style="cursor: pointer">{{FillType}}</label>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 10px;">
          <label>
            试卷总分
          </label>
        </el-row>
        <el-row type="flex" justify="center">
          <label>
            {{TotalScore}}<span style="margin-left: 5px">分</span>
          </label>
        </el-row>
      </div>
      <!-- 右侧的内容合适调整 -->
      <div class="StyleStableIcon">
        <!-- 身份识别区 -->
        <el-row type="flex" justify="start">
          <el-col>
            <el-row type="flex" justify="start" style="padding-left: 15px; padding-top: 15px">
              <label>
                答题卡内容基础设置
              </label>
            </el-row>
            <el-divider></el-divider>
          </el-col>
        </el-row>
        <!-- 身份识别区 -->
        <el-row type="flex" justify="start" style="margin-left: 15px">
          <el-col>
            <el-row type="flex" justify="start">
              <label>
                身份识别方式
              </label>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 10px;">
              <el-radio v-model="IDCodeType" label="考号填涂">考号填涂</el-radio>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 5px;">
              <el-radio v-model="IDCodeType" label="条形码">条形码</el-radio>
            </el-row>
          </el-col>
        </el-row>
        <!-- 其他设置区 -->
        <el-row type="flex" justify="start" style="margin-top: 30px; margin-left: 15px">
          <el-col>
            <el-row type="flex" justify="start">
              <label>
                其他内容设置
              </label>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 10px;">
              <el-checkbox v-model="ContentSetting" label="注意事项与缺考标记"></el-checkbox>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 5px;">
              <el-checkbox v-model="ContentSetting" label="存在AB卷"></el-checkbox>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 5px;">
              <el-checkbox v-model="ContentSetting" label="红色答题卡"></el-checkbox>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 5px;">
              <el-checkbox v-model="ContentSetting" label="客观题竖向排列"></el-checkbox>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 5px;">
              <el-checkbox v-model="ContentSetting" label="分区答题卡"></el-checkbox>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 30px">
          <el-button type="success" plain @click="Download_Answer_Card()">下载</el-button>
        </el-row>
      </div>
      <el-row :style="'min-height: 50vh; border: 1px solid ' + Get_Color() + '; border-bottom: none; margin-right: 7vw; background: white; box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.3);'">
        <!-- 关于标题 -->
        <el-row
          v-if="ContentSetting.indexOf('存在AB卷') != -1"
          type="flex" 
          justify="center"
          >
          <el-col :span="4">
            <el-row type="flex" justify="center" :style="'border-bottom: 1px solid ' + Get_Color() + '; border-right: 1px solid ' + Get_Color() + '; height: 39px; line-height: 39px'">
              <el-col :span="12">
                <el-row type="flex" justify="center" :style="'border-right: 1px solid ' + Get_Color() + ''">
                  A卷<span style="height: 15px; margin-top: 11px; border: 2px solid black; margin-left: 6px; width: 40px"></span>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row type="flex" justify="center">
                  B卷<span style="height: 15px; margin-top: 11px; border: 2px solid black; margin-left: 6px; width: 40px"></span>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="20">
            <el-row
              type="flex" 
              justify="center" 
              @mouseleave.native="Expand_Change('title', 0)" 
              @mouseenter.native="Expand_Change('title', 1)">
              <el-row
                v-if="Expand_Model.title == 0" 
                :style="'border-bottom: 1px solid ' + Get_Color() + '; width: 100%; padding-top: 5px'"
                type="flex" justify="center">
                <label 
                  style="font-size: 20px;">
                  {{PaperInfo.title}}
                </label>
              </el-row>
              <el-row 
                v-if="Expand_Model.title == 1"
                class="Focusing_Part" 
                @click.native="Expand_Change('title', 2)"
                style="font-size: 20px; font-weight: bold;"
                type="flex" justify="center">
                {{PaperInfo.title}}
              </el-row>
              <el-row
                v-if="Expand_Model.title == 2" 
                style="font-size: 20px;"
                class="Focusing_Part"
              >
                <el-input style="text-align: center" v-model="PaperInfo.title"></el-input>
              </el-row>
              
            </el-row>
          </el-col>
        </el-row>
        <el-row 
          v-else
          type="flex" 
          justify="center" 
          @mouseleave.native="Expand_Change('title', 0)" 
          @mouseenter.native="Expand_Change('title', 1)">
          <el-row
            v-if="Expand_Model.title == 0" 
            :style="'border-bottom: 1px solid ' + Get_Color() + '; width: 100%; padding-top: 5px'"
            type="flex" justify="center">
            <label 
              style="font-size: 20px;">
              {{PaperInfo.title}}
            </label>
          </el-row>
          <el-row 
            v-if="Expand_Model.title == 1"
            class="Focusing_Part" 
            @click.native="Expand_Change('title', 2)"
            style="font-size: 20px; font-weight: bold;"
            type="flex" justify="center">
            {{PaperInfo.title}}
          </el-row>
          <el-row
            v-if="Expand_Model.title == 2" 
            style="font-size: 20px;"
            class="Focusing_Part"
          >
            <el-input style="text-align: center" v-model="PaperInfo.title"></el-input>
          </el-row>
          
        </el-row>
        <!-- 关于答题卡最上面的信息部分 -->
        <el-row>
          <!-- 正常的填涂部分 -->
          <el-col 
            :span="Get_Input_Span()" 
            v-if="ContentSetting.indexOf('注意事项与缺考标记') == -1"
            :style="'border-right: 1px solid ' + Get_Color() + '; border-bottom: 1px solid ' + Get_Color() + '; height: 253px'"
            @mouseleave.native="Setting_Visible.UserFill = false" 
            @mouseenter.native="Setting_Visible.UserFill = true">
            <el-popover 
              placement="bottom"
              width="150"
              trigger="hover">
              <el-row type="flex" justify="start" @mouseenter.native="Setting_Visible.UserFill = true">
                <el-col>
                  <el-row type="flex" justify="start">
                    <label>已选信息</label>
                  </el-row>
                  <el-row 
                    v-for="Item in UserFillInfoFull" 
                    :key="'User_Fill_Full_' + Item" 
                    class="UserFillInfoFullItem"
                    @click.native="Edit_User_Fill_Info(Item)">
                    <el-col :span="20">
                      <el-row type="flex" justify="start">
                        {{Item}}
                      </el-row>
                    </el-col>
                    <el-col :span="4">
                      <el-row type="flex" justify="end">
                        <i class="el-icon-plus" v-if="UserFillInfo.indexOf(Item) == -1"></i>
                        <i class="el-icon-delete" v-else></i>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <div slot="reference" class="EditArea" v-show="Setting_Visible.UserFill">
                <span>编辑</span>
              </div>
            </el-popover>
            <el-row v-for="Item in UserFillInfo" :key="'User_Fill_' + Item" :style="Get_User_Fill_Line_Style()">
              <el-col :span="4">
                <el-row type="flex" justify="start" style="padding-left: 2vw; font-size: 1.5rem; font-weight: bold">{{Item}}：</el-row>
              </el-col>
              <el-col :span="13" :style="Get_User_Fill_UnderLine()"></el-col>
            </el-row>
          </el-col>
          <!-- 带有注意事项与缺考标记的部分 -->
          <el-col 
            :span="Get_Input_Span()" 
            v-else
            :style="'border-right: 1px solid ' + Get_Color() + '; border-bottom: 1px solid ' + Get_Color() + '; height: 253px'"
            >
            <el-row type="flex" justify="center">
              <el-col 
                :style="'height: 90px; border-bottom: 1px solid ' + Get_Color()"
                @mouseleave.native="Setting_Visible.UserFill = false" 
                @mouseenter.native="Setting_Visible.UserFill = true"
                >
                <el-popover 
                  placement="bottom"
                  width="150"
                  trigger="hover">
                  <el-row type="flex" justify="start" @mouseenter.native="Setting_Visible.UserFill = true">
                    <el-col>
                      <el-row type="flex" justify="start">
                        <label>已选信息</label>
                      </el-row>
                      <el-row 
                        v-for="Item in UserFillInfoFull" 
                        :key="'User_Fill_Full_' + Item" 
                        class="UserFillInfoFullItem"
                        @click.native="Edit_User_Fill_Info(Item)">
                        <el-col :span="20">
                          <el-row type="flex" justify="start">
                            {{Item}}
                          </el-row>
                        </el-col>
                        <el-col :span="4">
                          <el-row type="flex" justify="end">
                            <i class="el-icon-plus" v-if="UserFillInfo.indexOf(Item) == -1"></i>
                            <i class="el-icon-delete" v-else></i>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <div slot="reference" class="EditArea" v-show="Setting_Visible.UserFill">
                    <span>编辑</span>
                  </div>
                </el-popover>
                <el-row v-for="Item in UserFillInfo" :key="'User_Fill_' + Item" :style="Get_User_Fill_Line_Style_Mix()">
                  <el-col :span="4">
                    <el-row type="flex" justify="start" style="padding-left: 2vw; font-size: 1.5rem; font-weight: bold">{{Item}}：</el-row>
                  </el-col>
                  <el-col :span="13" :style="Get_User_Fill_UnderLine_Mix()"></el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start" :style="'padding-left: 2vw; border-bottom: 1px solid ' + Get_Color() + '; height: 30px; line-height: 30px'">
              <span style="font-weight: bold">正确填涂：</span><span style="margin-left: 20px; margin-top: 7px; height: 16px; background: black; width: 40px"></span>
            </el-row>
            <el-row type="flex" justify="start" :style="'padding-left: 2vw; border-bottom: 1px solid ' + Get_Color() + '; height: 30px; line-height: 30px'">
              <span style="font-weight: bold">缺考标记：</span><span style="margin-left: 20px; margin-top: 7px; height: 16px; background: transparent; width: 40px; border: 1px solid black"></span>
            </el-row>
            <!-- 关于注意事项 -->
            <el-row 
              type="flex" 
              justify="center"
              @mouseleave.native="Expand_Change('cautions', 0)" 
              @mouseenter.native="Expand_Change('cautions', 1)">
              <el-row
                v-if="Expand_Model.cautions == 0" 
                style="padding: 3px; border: 3px solid transparent; min-height: 20px; width: 100%"
                type="flex" justify="center">
                <span 
                  style="font-size: 14px; white-space: pre-line; text-align: left; width: 100%; color: #909399">
                  {{PaperInfo.Cautions}}
                </span>
              </el-row>
              <el-row 
                v-if="Expand_Model.cautions == 1"
                class="Focusing_Part" 
                @click.native="Expand_Change('cautions', 2)"
                style="font-size: 14px; font-weight: bold; min-height: 20px; white-space: pre-line; text-align: left; width: 100%;"
                type="flex" justify="start">
                {{PaperInfo.Cautions}}
              </el-row>
              <el-row
                v-if="Expand_Model.cautions == 2" 
                style="font-size: 18px; width: 100%"
                class="Focusing_Part"
              >
                <el-input 
                  v-model="PaperInfo.Cautions"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  resize="none"></el-input>
              </el-row>
            </el-row>
          </el-col>
          <!-- 填涂准考证号或贴条形码的部分 -->
          <el-col 
            :span="Get_Code_Span()" 
            :style="'border-bottom: 1px solid ' + Get_Color() + '; height: 253px'"
            @mouseleave.native="Setting_Visible.IDCode = false" 
            @mouseenter.native="Setting_Visible.IDCode = true"
            >
            <el-popover 
              placement="bottom"
              width="150"
              trigger="hover">
              <el-row type="flex" justify="start" @mouseenter.native="Setting_Visible.IDCode = true">
                <el-col>
                  <el-row type="flex" justify="start">
                    <label>当前考号位数</label>
                  </el-row>
                  <el-row type="flex" justify="start">
                    <el-input-number v-model="PaperInfo.StudentCodeLength" placeholder="" :min="4" :max="12"></el-input-number>
                  </el-row>
                </el-col>
              </el-row>
              <div slot="reference" class="EditArea" v-show="Setting_Visible.IDCode && IDCodeType == '考号填涂'">
                <span>编辑</span>
              </div>
            </el-popover>
            <!-- 考号填涂 -->
            <el-row
              v-if="IDCodeType == '考号填涂'"
              :style="'height: 36px; line-height: 36px; font-size: 18px; font-weight: bold; width: 100%; border-bottom: 1px solid ' + Get_Color() + '; text-align: center'"
            >
              准考证号填涂区
            </el-row>
            <el-row
              v-if="IDCodeType == '考号填涂'"
              type="flex"
              justify="center"
            >
              <el-col v-for="Ind in PaperInfo.StudentCodeLength - 1" :key="'Student_Code_' + Ind" :span="24/PaperInfo.StudentCodeLength" :style="'border-right: 1px solid ' + Get_Color() + '; height: 214px; width: 100%'">
                <el-row type="flex" :style="'height: 34px; width: 100%; border-bottom: 1px solid ' + Get_Color() + ''">

                </el-row>
                <el-row 
                  v-for="J in 10" 
                  :key="'SC_' + Ind + '_' + J" 
                  type="flex" 
                  justify="center" 
                  :style="'height: 18px; line-height: 18px; font-size: 14px; width: 100%; color: ' + Get_Color()">
                  <span style="margin-right: 12%">[</span>{{J-1}}<span style="margin-left: 12%">]</span>
                </el-row>
              </el-col>
              <el-col :span="24/PaperInfo.StudentCodeLength" style="height: 214px; width: 100%">
                <el-row type="flex" :style="'height: 34px; width: 100%; border-bottom: 1px solid ' + Get_Color() + ''">

                </el-row>
                <el-row 
                  v-for="J in 10" 
                  :key="'SC__' + J" 
                  type="flex" 
                  justify="center" 
                  :style="'height: 18px; line-height: 18px; font-size: 14px; width: 100%; color: ' + Get_Color()">
                  <span style="margin-right: 12%">[</span>{{J-1}}<span style="margin-left: 12%">]</span>
                </el-row>
              </el-col>
            </el-row>
            <!-- 条形码 -->
            <el-row 
              v-else
              type="flex" 
              justify="center" 
              :style="'height: 200px; margin: 25px 20px 0px 20px; border: 1px dashed ' + Get_Color() + '; border-radius: 20px; line-height: 200px'">
              <span style="font-size: 24px">条形码粘贴区</span>
            </el-row>
          </el-col>
        </el-row>
        <!-- 关于题目填涂的部分 -->
        <el-row 
          v-for="(Bundle, Bundle_Index) in Question_Lists" 
          :key="'Question_Bundle_' + Bundle_Index"
          :style="'padding-bottom: 15px; border-bottom: 1px solid '  + Get_Color() + ''">
          <el-col
            @mouseleave.native="Setting_Visible.Editing_Bundle = -1" 
            @mouseenter.native="Setting_Visible.Editing_Bundle = Bundle_Index">
            <el-popover 
              placement="bottom"
              width="180"
              trigger="hover">
              <el-row type="flex" justify="center" @mouseenter.native="Setting_Visible.Editing_Bundle == Bundle_Index">
                <!-- 针对于选择题类型的版本 -->
                <el-col v-if="['单选题', '多选题', '判断题'].indexOf(Bundle.type) != -1">
                  <el-row type="flex" justify="center">
                    <label>每组选择题数量</label>
                  </el-row>
                  <el-row type="flex" justify="center">
                    <el-input-number 
                      v-model="Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item" 
                      placeholder=""
                      :min="1"
                      :max="10"
                      ></el-input-number>
                  </el-row>
                </el-col>
                <!-- 针对于填空题版本的类型 -->
                <el-col v-if="['填空题'].indexOf(Bundle.type) != -1">
                  <el-row type="flex" justify="center">
                    <label>每行填空的空格数量</label>
                  </el-row>
                  <el-row type="flex" justify="center">
                    <el-input-number 
                      v-model="Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item" 
                      placeholder=""
                      :min="1"
                      :max="PaperType != 'A3/B4/8K' ? 5 : FillType == '双栏' ? 4 : 3"
                      ></el-input-number>
                  </el-row>
                </el-col>
              </el-row>
              <div 
                slot="reference" 
                class="EditArea" 
                v-show="Setting_Visible.Editing_Bundle == Bundle_Index">
                <span>编辑</span>
              </div>
            </el-popover>
            <!-- 分区答题卡 -->
            <el-row 
              v-if="ContentSetting.indexOf('分区答题卡') != -1 && !PaperInfo.Partshow[Bundle_Index]"
              type="flex" justify="center"
              :style="'height: 36px; line-height: 36px; color: black; border-bottom: 1px solid ' + Get_Color() + ';'">
              <el-button type="text" @click="Change_Part_Info(Bundle_Index)">
                <span v-if="!PaperInfo.Partshow[Bundle_Index]" >点击在此添加分区</span>
              </el-button>
            </el-row>
            <el-row 
              v-if="ContentSetting.indexOf('分区答题卡') != -1 && PaperInfo.Partshow[Bundle_Index]"
              type="flex" justify="start"
              :style="'height: 36px; line-height: 36px; color: black'">
              <el-col :span="16">
                <el-row type="flex" justify="center">
                  <el-row
                    :style="'border-bottom: 1px solid ' + Get_Color() + '; border-right: 1px solid ' + Get_Color() + '; width: 100%; padding-top: 5px'"
                    type="flex" justify="center">
                    <el-button type="text" @click="Edit_Part_Info(Bundle_Index)">
                      {{PaperInfo.PartInfo[Get_Info_Index(Bundle_Index)].type}}<span v-if="PaperInfo.PartInfo[Get_Info_Index(Bundle_Index)].showScore">（共{{PaperInfo.PartInfo[Get_Info_Index(Bundle_Index)].score}}分）</span>
                    </el-button> 
                  </el-row>
                </el-row>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="center">
                  <el-row
                    :style="'border-bottom: 1px solid ' + Get_Color() + '; border-right: 1px solid ' + Get_Color() + '; width: 100%; padding-top: 5px'"
                    type="flex" justify="center">
                    <el-button type="text" @click="Part_Score_Show(Bundle_Index)">
                      <span v-if="PaperInfo.PartInfo[Get_Info_Index(Bundle_Index)].showScore">隐藏本区域分数</span>
                      <span v-else>显示本区域分数</span>
                    </el-button> 
                  </el-row>
                </el-row>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="center">
                  <el-row
                    :style="'border-bottom: 1px solid ' + Get_Color() + '; width: 100%; padding-top: 5px'"
                    type="flex" justify="center">
                    <el-button type="text" @click="Change_Part_Info(Bundle_Index)">
                      <span v-if="PaperInfo.Partshow[Bundle_Index]" >点击取消此处分区</span>
                    </el-button>
                  </el-row>
                </el-row>
              </el-col>
            </el-row>
            <!-- 题型的部分 -->
            <el-row type="flex" justify="start" style="margin-left: 15px; margin-top: 25px; padding-bottom: 10px">
              <label>{{Get_Bundle_Title_Show(Bundle, Bundle_Index)}}</label>
            </el-row>
            <!-- 选择部分的模板 -->
            <el-row v-if="Bundle.type == '单选题'">
              <!-- 计算一共会有几大行 -->
              <el-row 
                v-for="Row_Index in Get_Opt_Row_Index(Bundle_Index)" 
                :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index"
                type="flex" justify="start">
                <!-- 计算这一大行里面会有几列 -->
                <el-col 
                  v-for="Col_Index in Get_Opt_Col_Group(Bundle_Index, Row_Index)"
                  :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index + '_' + Col_Index"
                  :span="6">
                  <div v-if="ContentSetting.indexOf('客观题竖向排列') != -1">
                    <el-row type="flex" justify="center">
                      <!-- 计算这一列里面会有几个题目元素 -->
                      <el-col 
                        v-for="Item_Index in Get_Opt_Item_Count_Vertical(Bundle_Index)"
                        :span="Get_Opt_Item_Span_Vertical(Bundle_Index)"
                        :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index + '_' + Col_Index + '_' + Item_Index"
                        style="font-size: 16px; height: 100px;">
                        <div v-if="Show_Or_Not(Bundle_Index, Get_Opt_Item_Index(Bundle_Index, Row_Index, Col_Index, Item_Index))">
                          <el-row type="flex" justify="center">
                            <!-- 得到题号 -->
                            <span>{{Get_Opt_Item_Index(Bundle_Index, Row_Index, Col_Index, Item_Index)}}</span>
                          </el-row>
                          <el-row 
                            type="flex" 
                            justify="center" 
                            v-for="OptIndex in 4"
                            :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index + '_' + Col_Index + '_' + Item_Index + '_' + OptIndex">
                            <!-- 画出选项 -->
                            <span :style="'font-size: 14px; color: ' + Get_Color()">
                              <span style="margin-right: 0.5vw">[</span>{{Get_Opt_Fill(OptIndex)}}<span style="margin-left: 0.5vw">]</span>  
                            </span>
                          </el-row>
                        </div>
                        <div v-else>
                          <span style="font-size: 14px; color: transparent">
                            <span style="margin-right: 0.5vw">[</span>A<span style="margin-left: 0.5vw">]</span>  
                          </span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-else>
                    <!-- 计算这一列里面会有几个题目元素 -->
                    <el-row 
                      v-for="Item_Index in Get_Opt_Item_Count(Bundle_Index, Row_Index, Col_Index)"
                      :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index + '_' + Col_Index + '_' + Item_Index"
                      type="flex" justify="start" style="padding-left: 2vw; font-size: 16px; height: 22px; line-height: 22px">
                      <el-col :span="3">
                        <el-row type="flex" justify="start">
                          <!-- 得到题号 -->
                          <span>{{Get_Opt_Item_Index(Bundle_Index, Row_Index, Col_Index, Item_Index)}}:</span>
                        </el-row>
                      </el-col>
                      <el-col :span="21">
                        <el-row type="flex" justify="start">
                          <!-- 画出选项 -->
                          <span 
                            v-for="OptIndex in 4" 
                            :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index + '_' + Col_Index + '_' + Item_Index + '_' + OptIndex"
                            :style="'padding-left: 10px; font-size: 14px; color: ' + Get_Color()">
                            <span style="margin-right: 0.5vw">[</span>{{Get_Opt_Fill(OptIndex)}}<span style="margin-left: 0.5vw">]</span>  
                          </span>
                        </el-row>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-row>
            <!-- 参照单选 -->
            <el-row v-if="Bundle.type == '多选题'">
              <el-row 
                v-for="Row_Index in Get_Opt_Row_Index(Bundle_Index)" 
                :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index"
                type="flex" justify="start">
                <el-col 
                  v-for="Col_Index in Get_Opt_Col_Group(Bundle_Index, Row_Index)"
                  :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index + '_' + Col_Index"
                  :span="6">
                  <el-row 
                    v-for="Item_Index in Get_Opt_Item_Count(Bundle_Index, Row_Index, Col_Index)"
                    :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index + '_' + Col_Index + '_' + Item_Index"
                    type="flex" justify="start" style="padding-left: 2vw; font-size: 16px; height: 22px; line-height: 22px">
                    <el-col :span="3">
                      <el-row type="flex" justify="start">
                        <!-- 得到题号 -->
                        <span>{{Get_Opt_Item_Index(Bundle_Index, Row_Index, Col_Index, Item_Index)}}:</span>
                      </el-row>
                    </el-col>
                    <el-col :span="21">
                      <el-row type="flex" justify="start">
                        <!-- 画出选项 -->
                        <span 
                          v-for="OptIndex in 4" 
                          :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index + '_' + Col_Index + '_' + Item_Index + '_' + OptIndex"
                          style="padding-left: 10px; font-size: 14px; ">
                          <span style="margin-right: 0.5vw">[</span>{{Get_Opt_Fill(OptIndex)}}<span style="margin-left: 0.5vw">]</span>  
                        </span>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-row>
            <!-- 参照单选，但选项只有对错两项 -->
            <el-row v-if="Bundle.type == '判断题'">
              <el-row 
                v-for="Row_Index in Get_Opt_Row_Index(Bundle_Index)" 
                :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index"
                type="flex" justify="start">
                <el-col 
                  v-for="Col_Index in Get_Opt_Col_Group(Bundle_Index, Row_Index)"
                  :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index + '_' + Col_Index"
                  :span="6">
                  <el-row 
                    v-for="Item_Index in Get_Opt_Item_Count(Bundle_Index, Row_Index, Col_Index)"
                    :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index + '_' + Col_Index + '_' + Item_Index"
                    type="flex" justify="start" style="padding-left: 2vw; font-size: 16px; height: 22px; line-height: 22px">
                    <el-col :span="3">
                      <el-row type="flex" justify="start">
                        <!-- 得到题号 -->
                        <span>{{Get_Opt_Item_Index(Bundle_Index, Row_Index, Col_Index, Item_Index)}}:</span>
                      </el-row>
                    </el-col>
                    <el-col :span="21">
                      <el-row type="flex" justify="start">
                        <!-- 画出选项 -->
                        <span 
                          v-for="OptIndex in 2" 
                          :key="'Single_Opt_' + Bundle_Index + '_' + Row_Index + '_' + Col_Index + '_' + Item_Index + '_' + OptIndex"
                          style="padding-left: 10px; font-size: 14px; ">

                          <span style="margin-right: 0.35vw">[</span>
                          <span v-if="OptIndex == 1"><i class="el-icon-check"></i></span>
                          <span v-if="OptIndex == 2"><i class="el-icon-close"></i></span>
                          <span style="margin-left: 0.35vw">]</span>  
                        </span>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-row>
            <!-- 填空部分的模板 -->
            <el-row v-if="Bundle.type == '填空题'">
              <el-col>
                <el-row 
                  v-for="(Fill_Ques, Fill_Index) in Bundle.list" 
                  :key="'Fill_' + Bundle_Index + '_' + Fill_Index"
                  type="flex" justify="start"
                  style="margin-top: 7px;">
                  <!-- 获取题号的部分 -->
                  <el-col :span="1">
                    <el-row type="flex" justify="start" style="padding-left: 2vw; font-size: 16px; height: 32px; line-height: 32px">
                      <span>
                        {{Get_Normal_Ques_Index(Bundle_Index, Fill_Index)}}:
                      </span>
                    </el-row>
                  </el-col>
                  <!-- 勾画填涂位置的部分 -->
                  <el-col :span="23">
                    <el-row 
                      type="flex" 
                      justify="start"
                      v-for="Fill_Row_Index in Get_Fill_Row_Count(Bundle_Index, Fill_Index)"
                      :key="'Fill_' + Bundle_Index + '_' + Fill_Index + '_' + Fill_Row_Index"
                      style="padding-left: 0.5vw; font-size: 16px; height: 32px; line-height: 32px">
                      <el-col 
                        v-for="Fill_Blank_Index in Get_Fill_Blank_Count(Bundle_Index, Fill_Index, Fill_Row_Index)" 
                        :key="'Fill_' + Bundle_Index + '_' + Fill_Index + '_' + Fill_Row_Index + '_' + Fill_Blank_Index"
                        :span="Get_Fill_Span(Bundle_Index)">
                        <el-row :style="'width: 90%; height: 32px; border-bottom: 2px solid ' + Get_Color() + ''">

                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
              
            </el-row>
            <!-- 简答和计算部分的模板 -->
            <el-row v-if="Bundle.type == '计算题' || Bundle.type == '简答题'">
              <el-col>
                <el-row
                  v-for="(Ans_Ques, Ans_Index) in Bundle.list" 
                  :key="'Ans_' + Bundle_Index + '_' + Ans_Index"
                  type="flex" justify="start"
                  style="margin-top: 7px;"
                  @mouseleave.native="Setting_Visible.Editing_Bundle = -1" 
                  @mouseenter.native="Setting_Visible.Editing_Bundle = Bundle_Index + '_' + Ans_Index">
                  
                  <!-- 获取题号的部分 -->
                  <el-col :span="1">
                    <el-row type="flex" justify="center" style="padding-left: 1vw; font-size: 16px; height: 32px; line-height: 32px">
                      <span>
                        {{Get_Normal_Ques_Index(Bundle_Index, Ans_Index)}}:
                      </span>
                    </el-row>
                    <el-popover 
                      placement="bottom"
                      width="200"
                      trigger="hover">
                      <el-row type="flex" justify="center" @mouseenter.native="Setting_Visible.Editing_Bundle == Bundle_Index + '_' + Ans_Index">
                        <el-col v-if="['简答题', '计算题'].indexOf(Bundle.type) != -1">
                          <el-row type="flex" justify="center">
                            <label>增加或减少答题栏行数</label>
                          </el-row>
                          <el-row type="flex" justify="center">
                          <el-input-number 
                            v-model="Bundle_Card_Option_List[Bundle_Index][Ans_Index]" 
                            placeholder=""
                            :min="4"
                            ></el-input-number>
                        </el-row>
                        </el-col>
                      </el-row>
                      <div 
                        slot="reference" 
                        class="EditArea_2" 
                        v-show="Setting_Visible.Editing_Bundle == Bundle_Index + '_' + Ans_Index">
                        <span>编辑</span>
                      </div>
                    </el-popover>
                  </el-col>
                  <!-- 答题区域的部分 -->
                  <el-col :span="23" :style="Get_Ans_Style(Bundle_Index, Ans_Index)">
                    <el-row 
                      type="flex" 
                      justify="center"
                      v-for="Row_Index in Bundle_Card_Option_List[Bundle_Index][Ans_Index]"
                      :key="'Ans_' + Bundle_Index + '_' + Ans_Index + '_Row_' + Row_Index"
                      :style="'border-bottom: 1px solid ' + Get_Color() + '; height: 30px; margin-left: 20px; margin-right: 20px'"
                      >
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-row>
    </div>
  </div>
</template>
<script>

export default {
  name: 'AnswerCard',
  props: {

  },
  data() {
    return {
      // 学科
      Subject: "",
      // 试题属性
      Question_Lists: [],
      Cautions_Editor_Dialog: false,
      // 纸页大小与纸页样式
      PaperType: "A3/B4/8K",
      FillType: "双栏",
      // 身份识别的不同方式
      IDCodeType: "考号填涂",
      // 身份识别左侧的填涂内容
      UserFillInfo: ['考号', '学校', '姓名', '班级'],
      // 身份识别左侧的填涂内容应当有些什么可选项
      UserFillInfoFull: ['考号', '学校', '姓名', '班级', '考场', '座号', '任课老师'],
      // 其他内容是否要放进来
      ContentSetting: [],
      // 废物利用，拿来控制标题和注意事项
      Expand_Model: {
        title: 0,
        cautions: 0,
        part: []
      },
      // 试卷信息
      PaperInfo: {
        title: "20210809 - 测试卷用标题",
        StudentCodeLength: 9,
        Cautions: "注意事项：\n答题前填写好自己的班级、姓名、考号等信息。\n请将答案正确填写在答题卡上。\n填涂时用2B铅笔将选项涂黑涂满，修改时用橡皮擦干净。注意题号顺序并保持卷面整洁，请勿折叠或做标记。",
        // 用于分区显示过滤
        Partshow: [],
        // 用于分区内容显示
        PartInfo: []
      },
      Setting_Visible: {
        // 左侧填写框
        UserFill: false,
        // 右侧填涂框（只在非条形码时生效）
        IDCode: false,
        // 注意事项
        Cautions: false,
        Editing_Bundle: -1
      },
      // 记录每道大题的特殊编辑信息的记录器
      Bundle_Card_Option_List: [],
      // 记录用于编辑的题目信息的位置
      Editing_Part_Info: "",
      // 记录编辑的是哪个位置的标记
      Editing_Index: -1,
      // 编辑用的对话框
      Edit_Part_Dialog: false,
      TotalScore: 0,
      // 等待变量
      waiting: false
    }
  },
  watch: {
    ContentSetting(newVal, oldVal){
      if(newVal.indexOf('注意事项与缺考标记') != oldVal.indexOf('注意事项与缺考标记')){
        if(newVal.indexOf('注意事项与缺考标记') != -1){
          this.UserFillInfo = ['考号', '姓名', '班级']
        }else{
          this.UserFillInfo = ['考号', '学校', '姓名', '班级']
        }
      }
      if(newVal.indexOf('分区答题卡') != oldVal.indexOf('分区答题卡')){
        if(newVal.indexOf('分区答题卡') == -1){
          this.$message.warning("由于分区设置改变，分区结果已初始化。")
        }else{
          this.$message.warning("已打开分区答题卡，修改分区将初始化修改信息，请注意。\n初始化后，只有仅包含选择题的分区将被认定为选择题。")
          this.Init_Part_Info();
        }
        this.PaperInfo.Partshow.splice(0, 1, true)
        for(let i = 1; i < this.PaperInfo.Partshow.length; i++){
          if(this.PaperInfo.Partshow[i]){
            this.PaperInfo.Partshow.splice(i, 1, false)
          }
        }
      }
    },
  },
  mounted() {
    this.Question_Lists = JSON.parse(sessionStorage.getItem('CombinePaper_AnswerCard'));
    this.Init_Bundle_Options();
    this.Subject = sessionStorage.getItem('AnswerCardSubject');
  },
  methods: {
    // 下载答题卡
    Download_Answer_Card(){

      let Setting_English = {
        注意事项与缺考标记: "cautions",
        存在AB卷: "existAB",
        红色答题卡: "redSheet",
        客观题竖向排列: "verticalChoice",
        分区答题卡: "partInfo"
      }

      let Card_Form = {
        sheetSize: this.PaperType,
        columnNum: this.FillType == "双栏" ? 2 : this.FillType == "三栏" ? 3 : 1,
        fillType: this.IDCodeType == "考号填涂" ? "paint" : "barCode",
        examNumberDigits: this.IDCodeType == "考号填涂" ? this.PaperInfo.StudentCodeLength + "" : "",
        sheetFormat: [],
        fillPart: this.UserFillInfo,
        title: this.PaperInfo.title,
        cautions: this.PaperInfo.Cautions,
        subject: this.Subject,
        questions: []
      }

      for(let i = 0; i < this.ContentSetting.length; i++){
        Card_Form.sheetFormat.push(Setting_English[this.ContentSetting[i]])
      }

      for(let j = 0; j < this.Question_Lists.length; j++){
        let Item_Form = {
            type: this.Question_Lists[j].type,
            bundleInfo: this.Get_Bundle_Title_Show(this.Question_Lists[j], j),
            partInfo: !(this.ContentSetting.indexOf("分区答题卡") != -1 && this.PaperInfo.Partshow[j]) ? 
                        "" : this.PaperInfo.PartInfo[this.Get_Info_Index(j)].showScore ? 
                        this.PaperInfo.PartInfo[this.Get_Info_Index(j)].type : this.PaperInfo.PartInfo[this.Get_Info_Index(j)].type + "（共" + this.PaperInfo.PartInfo[this.Get_Info_Index(this.Bundle_Index)].score + "分）",
            questions: this.Question_Lists[j].list.length,
            EachRowsItem: this.Bundle_Card_Option_List[j].Each_Rows_Item ? this.Bundle_Card_Option_List[j].Each_Rows_Item : "",
            AnswerLength: ['单选题', '多选题', '判断题'].indexOf(this.Question_Lists[j].type) != -1 ?
                            [] : ['填空题'].indexOf(this.Question_Lists[j].type) != -1 ?
                              this.Bundle_Card_Option_List[j].List : ['简答题', '计算题'].indexOf(this.Question_Lists[j].type) != -1 ?
                                this.Bundle_Card_Option_List[j]: [],
            score: []
        }
        for(let i = 0; i < this.Question_Lists[j].list.length; i++){
          Item_Form.score.push(this.Question_Lists[j].list[i].score)
        }
        Card_Form.questions.push(Item_Form)
      }

      let config = {
          headers: {
              "Content-Type": "multipart/form-data"
          },
          responseType: 'arraybuffer',
          emulateJSON: true
      }

      let param = new FormData();

      param.append('Paper_Data', JSON.stringify(Card_Form, null, 4));

      this.$http
          .post(this.backendIP + "/api/answerSheetDownload", param, config)
          .then(function(data) {
          if(data.data){
              this.waiting = false;
              const link = document.createElement('a')
              let blob = new Blob([data.data],
                  {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"})
              let objectUrl = URL.createObjectURL(blob)
              link.href = objectUrl
              link.download = this.PaperInfo.title + '答题卡.docx'
              link.click()
              URL.revokeObjectURL(objectUrl);
              this.waiting_text = ""
          }
          }).catch(() => {
              this.$message.error("服务器忙碌，请稍后再试...");
              this.waiting = false;
              this.waiting_text = "";
              return
          });
    },
    // 切换分数显示
    Part_Score_Show(Bundle_Index){
      let Index = this.Get_Info_Index(Bundle_Index);
      this.PaperInfo.PartInfo[Index].showScore = !this.PaperInfo.PartInfo[Index].showScore
    },
    // 获得分卷信息
    Get_Info_Index(Bundle_Index){
      let Count = 0;
      for(let i = 0; i < Bundle_Index; i++){
        if(this.PaperInfo.Partshow[i]){
          Count = Count + 1
        }
      }
      return Count
    },
    // 初始化分卷标题内容
    Init_Part_Info(){
      
      this.PaperInfo.PartInfo = [];
      let Type = ['单选题', '多选题', '判断题'];
      let Str = Type.indexOf(this.Question_Lists[0].type) == -1 ? "非选择题" : "选择题"
      let Score = 0
      let Start = 0
      for(let i = 1; i <= this.PaperInfo.Partshow.length; i++){
        if(this.PaperInfo.Partshow[i] || i == this.PaperInfo.Partshow.length){
          let Label = this.Get_Part_Show(Start)
          for(let j = Start; j < i; j++){
            for(let k = 0; k < this.Question_Lists[j].list.length; k++){
              Score = Score + this.Question_Lists[j].list[k].score
            }
          }
          this.PaperInfo.PartInfo.push({
            type: '第' + Label + '卷：' + Str,
            score: Score,
            showScore: true
          })
          Score = 0
          Start = i
          Str = "选择题"
        }  
        if(i < this.PaperInfo.Partshow.length && Type.indexOf(this.Question_Lists[i].type) == -1){
          Str = "非选择题"
        }
      }
    },
    // 返回分区内容显示
    Get_Part_Show(Bundle_Index){
      let Index_Label = ['', 'Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ']
      let Count = 0;
      for(let i = 0; i <= Bundle_Index; i++){
        if(this.PaperInfo.Partshow[i]){
          Count = Count + 1
        }
      }
      return Index_Label[Count]
    },
    // 修改分区标记
    Change_Part_Info(Bundle_Index){
      if(Bundle_Index == 0){
        this.$message.error("分区答题卡模式下不能取消此位置的分区。")
        return
      }
      this.PaperInfo.Partshow.splice(Bundle_Index, 1, !this.PaperInfo.Partshow[Bundle_Index])
      this.Init_Part_Info()
    },
    // 调整答题卡颜色
    Get_Color(){
      if(this.ContentSetting.indexOf('红色答题卡') != -1){
        return "red"
      }else{
        return "black"
      }
    },
    // 返回解答题类型的题目的解答区域高度
    Get_Ans_Style(Bundle_Index, Ans_Index){
      let Answer_Length = this.Bundle_Card_Option_List[Bundle_Index][Ans_Index] * 30 + 15
      let Color = this.Get_Color()
      let Style = {
        "height": Answer_Length + 'px',
        "line-height": Answer_Length + 'px',
        "border": "1px dashed " + Color,
        "border-radius": "10px",
        "margin-bottom": "15px",
        "color": "#409EFD",
        "text-align": "center",
        "font-size": "18px",
        "margin-left": "15px",
        "margin-right": "15px"
      }
      return Style
    },
    // 获取这道填空题每行最多有多少个空
    Get_Fill_Span(Bundle_Index){
      return Math.ceil(24/this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item)
    },
    // 获取这道填空题应当有多少行的空
    Get_Fill_Row_Count(Bundle_Index, Fill_Index){
      let Total = this.Bundle_Card_Option_List[Bundle_Index].List[Fill_Index]
      let Gap = this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item
      return Math.ceil(Total / Gap)
    },
    // 获取这道填空题这行应当有多少个空
    Get_Fill_Blank_Count(Bundle_Index, Fill_Index, Fill_Row_Index){
      let Total = this.Bundle_Card_Option_List[Bundle_Index].List[Fill_Index]
      let Gap = this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item
      let Row_Count = Math.ceil(Total / Gap)
      if(Fill_Row_Index < Row_Count){
        return Gap
      }else{
        return Total - (Fill_Row_Index - 1) * Gap
      }
    },
    // 获取一般题目的序号
    Get_Normal_Ques_Index(Bundle_Index, Fill_Index){
      let Base = 0;
      for(let i = 0; i < Bundle_Index; i++){
        Base = Base + this.Question_Lists[i].list.length
      }
      return Base + Fill_Index + 1
    },
    // 纵向排列的时候对于空列的处理
    Show_Or_Not(Bundle_Index, OptIndex){
      let Base = 0;
      for(let i = 0; i <= Bundle_Index; i++){
        Base = Base + this.Question_Lists[i].list.length
      }
      if(OptIndex > Base){
        return false
      }else{
        return true
      }
    },
    // 计算当选择题纵向排列时每组元素应当占据的宽度
    Get_Opt_Item_Span_Vertical(Bundle_Index){
      return 24/this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item
    },
    // 计算应当显示的选项编号
    Get_Opt_Fill(OptIndex){
      return String.fromCharCode(OptIndex + 64)
    },
    // 计算应当显示多少行选择题
    Get_Opt_Row_Index(Bundle_Index){
      let Item_Length = this.Question_Lists[Bundle_Index].list.length;
      let Group = Math.ceil(Item_Length/this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item)
      return Math.ceil(Group/4);
    },
    // 计算这一行的这一列应当显示多少行选择题
    Get_Opt_Col_Group(Bundle_Index, Row_Index){
      let Item_Length = this.Question_Lists[Bundle_Index].list.length;
      let Group = Math.ceil(Item_Length/this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item)
      let Row_Count = Math.ceil(Group/4)
      if(Row_Index < Row_Count){
        return 4
      }else{
        return Group - (Row_Count - 1) * 4
      }
    },
    // 计算这一个单元格内应当有多少个元素行
    Get_Opt_Item_Count(Bundle_Index, Row_Index, Col_Index){
      let Item_Length = this.Question_Lists[Bundle_Index].list.length;
      let Group = Math.ceil(Item_Length/this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item)
      let Row_Count = Math.ceil(Group/4)
      let Col_Count = Group - (Row_Count - 1) * 4;
      if(Row_Index < Row_Count){
        return this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item
      }else{
        if(Col_Index < Col_Count){
          return this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item
        }else{
          return Item_Length - ((Row_Index - 1) * 4 + Col_Index - 1) * this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item
        }
      }
    },
    Get_Opt_Item_Count_Vertical(Bundle_Index){
      return this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item
    },
    // 看看这些题目应当是什么编号
    Get_Opt_Item_Index(Bundle_Index, Row_Index, Col_Index, Item_Index){
      let Base = 0;
      for(let i = 0; i < Bundle_Index; i++){
        Base = Base + this.Question_Lists[i].list.length
      }
      return ((Row_Index - 1) * 4 + Col_Index - 1) * this.Bundle_Card_Option_List[Bundle_Index].Each_Rows_Item + Item_Index + Base
    },
    // 用于记录每道大题的特殊设置项
    Init_Bundle_Options(){
      for(let i = 0; i < this.Question_Lists.length; i++){
        let Bundle = this.Question_Lists[i];
        if(['单选题', '多选题', '判断题'].indexOf(Bundle.type) != -1){
          let Item = {
            Each_Rows_Item: 5,
          }
          this.Bundle_Card_Option_List.push(Item)
        }else if(['填空题'].indexOf(Bundle.type) != -1){
          let Space_Reg = new RegExp("____+", 'g')
          let Quote_Reg = new RegExp("(\\(|\\（|\\[)(\\s*)(\\)|\\）|\\])", "g")
          let Item = {
            Each_Rows_Item: this.PaperType != 'A3/B4/8K' ? 5 : this.FillType == '双栏' ? 4 : 3,
            List: []
          }
          for(let i = 0; i < Bundle.list.length; i++){
            let Count = 0;
            let Ques = Bundle.list[i];
            let Stem = Ques.stem;
            let res = Quote_Reg.exec(Stem)
            while(res != null){
              Stem = Stem.replace(res[0], "", 1)
              res = Quote_Reg.exec(Stem)
              Count = Count + 1
            }
            res = Space_Reg.exec(Stem)
            while(res != null){
              res = Space_Reg.exec(Stem)
              Count = Count + 1
            }
            Item.List.push(Count)
          }
          this.Bundle_Card_Option_List.push(Item)
        }else if(['简答题', '计算题'].indexOf(Bundle.type) != -1){

          let Item = [];
          for(let i = 0; i < Bundle.list.length; i++){
            let Ans_Ques = Bundle.list[i];
            let Answer_List = Ans_Ques.answer.split("\n")
            Item.push(Answer_List.length >= 4 ? Answer_List.length : 4)
          }
          this.Bundle_Card_Option_List.push(Item)
        }
        if(i == 0){
          this.PaperInfo.Partshow.push(true)
        }else{
          this.PaperInfo.Partshow.push(false)
        }
        for(let j = 0; j < Bundle.list.length; j++){
          this.TotalScore = this.TotalScore + Bundle.list[j].score
        }
      }
    },
    // 返回每道大题的标题信息 
    Get_Bundle_Title_Show(Bundle, Bundle_Index){
      let Result = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
      let Score = 0;
      for(let i = 0; i < Bundle.list.length; i++){
        Score = Score + parseFloat(Bundle.list[i].score)
      }
      return Result[Bundle_Index] + '、' + Bundle.type + '(' + Score + '分)'
    },
    // 修改左侧区域的显示内容
    Edit_User_Fill_Info(Item){
      if(this.ContentSetting.indexOf('注意事项与缺考标记') == -1){
        let Index = this.UserFillInfo.indexOf(Item)
        if(Index != -1){
          this.UserFillInfo.splice(Index, 1)
        }else{
          this.UserFillInfo.push(Item)
        }
        this.Sort_User_Fill_Info();
      }else{
        let Index = this.UserFillInfo.indexOf(Item)
        if(Index != -1){
          this.UserFillInfo.splice(Index, 1)
        }else if(this.UserFillInfo.length < 3){
          this.UserFillInfo.push(Item)
        }else{
          this.$message.error("在添加注意事项与缺考标记的情况下，最多选择三项进行显示。")
        }
        this.Sort_User_Fill_Info();
      }
    },
    // 排序
    Sort_User_Fill_Info(){
      let Result = [];
      for(let i = 0; i < this.UserFillInfoFull.length; i++){
        if(this.UserFillInfo.indexOf(this.UserFillInfoFull[i]) != -1){
          Result.push(this.UserFillInfoFull[i])
        }
      }
      this.UserFillInfo = Result
    },
    // 根据用户填写项内容的长度来返回这一行的样式信息
    Get_User_Fill_Line_Style(){
      let Style = {
        'height': 250 / this.UserFillInfo.length + 'px',
        'line-height':  250 / this.UserFillInfo.length + 'px'
      }
      return Style
    },
    // 根据用户填写项内容的长度来返回这一行的样式信息 - 混合版本
    Get_User_Fill_Line_Style_Mix(){
      let Style = {
        'height': 90 / this.UserFillInfo.length + 'px',
        'line-height':  90 / this.UserFillInfo.length + 'px'
      }
      return Style
    },
    // 返回用户填写项的下划线填写位置
    Get_User_Fill_UnderLine(){
      let Gap = this.UserFillInfo.length > 5 ? 5 : 10
      let Color = this.Get_Color();
      let Style = {
        'height': 250 / this.UserFillInfo.length - Gap + 'px',
        'text-align': 'left',
        'border-bottom': '2px solid ' + Color
      }
      return Style
    },
    // 返回用户填写项的下划线填写位置 - 混合版本
    Get_User_Fill_UnderLine_Mix(){
      let Color = this.Get_Color();
      let Style = {
        'height': 90 / this.UserFillInfo.length - 5 + 'px',
        'text-align': 'left',
        'border-bottom': '2px solid ' + Color
      }
      return Style
    },
    // 根据学生考号位数或条形码来返回信息输入框的宽度
    Get_Input_Span(){
      if(this.IDCodeType == "条形码"){
        return 16
      }else{
        if(this.PaperInfo.StudentCodeLength < 10){
          return 24 - this.PaperInfo.StudentCodeLength
        }
        else{
          return 15
        }
      }
    },
    // 根据学生考号位数或条形码来返回学生辨别区输入框的宽度
    Get_Code_Span(){
      if(this.IDCodeType == "条形码"){
        return 8
      }else{
        if(this.PaperInfo.StudentCodeLength < 10){
          return this.PaperInfo.StudentCodeLength
        }
        else{
          return 9
        }
      }
    },
    //暂时提示
    Unfinish(){
      this.$message.warning("正在准备中...")
    },
    ChangePaperType(){
      if(this.PaperType == 'A3/B4/8K'){
        this.PaperType = "A4/B5"
        this.FillType = "单栏"
        for(let i = 0; i < this.Question_Lists.length; i++){
          if(this.Question_Lists[i].type == '填空题'){
            this.Bundle_Card_Option_List[i].Each_Rows_Item = 5
          }
        }
      }else{
        this.PaperType = 'A3/B4/8K'
        this.FillType = "双栏"
        for(let i = 0; i < this.Question_Lists.length; i++){
          if(this.Question_Lists[i].type == '填空题'){
            this.Bundle_Card_Option_List[i].Each_Rows_Item = 4
          }
        }
      }
    },
    ChangeFillType(){
      if(this.PaperType == "A3/B4/8K"){
        if(this.FillType == '双栏'){
          this.FillType = "三栏"
          for(let i = 0; i < this.Question_Lists.length; i++){
            if(this.Question_Lists[i].type == '填空题'){
              this.Bundle_Card_Option_List[i].Each_Rows_Item = 3
            }
          }
        }else{
          this.FillType = "双栏"
          for(let i = 0; i < this.Question_Lists.length; i++){
            if(this.Question_Lists[i].type == '填空题'){
              this.Bundle_Card_Option_List[i].Each_Rows_Item = 4
            }
          }
        }
      }else{
        this.FillType = "单栏"
      }
    },
    // 废物利用，调整标题格式
    // 比较例外的，调整大题注释的内容的时候
    // 调整标题栏内容
    Expand_Change(part, value){
      this.Expand_Model[part] = value;
      if(value == 0){
        this.Expand_Model.title = 0;
        this.Expand_Model.cautions = 0;
      }
      if(value == 0 && part == 'cautions'){
        let List = this.PaperInfo.Cautions.split("\n");
        if(List.length > 4){
          this.$message.error("已将您超出四行的部分进行了一定的压缩，请控制在四行以内。")
          let Str = List[3]
          for(let i = 4; i < List.length; i++){
            Str = Str + List[i]
          }
          List.splice(3, List.length, Str)
        }
        this.PaperInfo.Cautions = List.join("\n")
      }
    },
    // 废物利用二号，调整分区信息
    Edit_Part_Info(Index){
      let Ind = this.Get_Info_Index(Index);
      this.Editing_Index = Ind;
      this.Editing_Part_Info = this.PaperInfo.PartInfo[Ind].type
      this.Edit_Part_Dialog = true;
    },
    // 完成分区内容编辑
    Finish_Edit_Part_Info(){
      this.PaperInfo.PartInfo[this.Editing_Index].type = this.Editing_Part_Info;
      this.Edit_Part_Dialog = false;
      this.Reset_Edit_Part_Info()
    },
    Reset_Edit_Part_Info(){
      this.Editing_Index = -1;
      this.Editing_Part_Info = ""
    }
  },
}
</script>
<style>
/* 左侧，答题卡纸样控制区域 */
.PaperStableIcon{
    position: absolute;
    top: 100px;
    height: 400px;
    left: 0px;
    width: 5vw;
    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;
    border-left-style: none;
    background: white;
    box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.3);
}
/* 右侧，答题卡内容控制区域 */
.StyleStableIcon{
  position: absolute;
  padding-top: 15px;
  top: 100px;
  height: 500px;
  right: 16px;
  width: 12vw;
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  background: white;
  box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.3);
}
/* 以后用于替换点击切换纸样图标的占位Style */
.PaperSettingIconArea{
  height: 5vw;
  line-height: 5vw;
  text-align: center;
  border: 1px solid black;
  border-radius: 10px;
  width: 5vw;
  margin-bottom: 20px;
  margin-top: 5px;
  cursor: pointer;
}
/* 用于处理试卷标题的样式 */
.Focusing_Part{
  width: 100%; 
  text-align: center; 
  cursor: pointer; 
  padding: 3px; 
  border: 1px dashed black;
  background: #EEF5FE;
  box-sizing: border-box;
}
/* 编辑区域的通用Style */
.EditArea{
  position: relative;
  float: right;
  width: 60px;
  height: 36px;
  background: #409EFD;
  color: white;
  border-bottom-left-radius: 20px;
  font-size: 14px;
  padding-top: 7px;
  cursor: pointer;
  z-index: 10;
}
.EditArea_2{
  position: relative;
  top: 0;
  left: 0;
  width: 60px;
  height: 36px;
  background: #409EFD;
  color: white;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  font-size: 14px;
  padding-top: 7px;
  cursor: pointer;
  z-index: 10;
}
/* 输入编辑区域选项的通用Style 1 */
.UserFillInfoFullItem{
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
  font-size: 14px;
}
.UserFillInfoFullItem:hover{
  border: 1px dashed #409EFD;
  border-radius: 5px;
}
</style>
<style scoped>

</style>