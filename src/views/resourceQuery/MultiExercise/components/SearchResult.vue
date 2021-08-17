<template>
  <div
    class="exercise"
    v-loading="Question_Analysing"
    element-loading-text="正在加载分析报告..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(211, 211, 211, 0.6)">
    <!-- 查看分析报告 -->
    <el-dialog
        :visible.sync="analyseReport"
        width="90%"
        :modal-append-to-body="false"
        :close-on-click-modal="true"
        :key="Refresh">
        <template slot="title"></template>
        <el-row
          style="margin: 0px">
          <QuestionAnalyse :Ques="analyseData"></QuestionAnalyse>
        </el-row>
    </el-dialog>
    <!-- 筛选条件行 -->
    <!-- <el-row type="flex" justify="start" style="margin-left: 5vw; margin-right: 5vw; border-top: 1px solid Silver; border-bottom: 1px solid Silver;">
      <el-col :span="2">
        <span style="line-height: 40px; font-weight: bold">筛选条件：</span>
      </el-col>
      <el-col :span="3">
        <el-popover
          placement="bottom-start"
          width="850"
          trigger="hover">
          <el-checkbox-group v-model="Subject_Type">
            <el-checkbox label="语文">语文</el-checkbox>
            <el-checkbox label="数学">数学</el-checkbox>
            <el-checkbox label="英语">英语</el-checkbox>
            <el-checkbox label="政治">政治</el-checkbox>
            <el-checkbox label="历史">历史</el-checkbox>
            <el-checkbox label="地理">地理</el-checkbox>
            <el-checkbox label="物理">物理</el-checkbox>
            <el-checkbox label="化学">化学</el-checkbox>
            <el-checkbox label="生物">生物</el-checkbox>
            <el-button size="small" plain type="primary" @click="submit_prepare()" style="margin-left: 40px; font-size: 14px">确认</el-button>
          </el-checkbox-group>
          <el-button slot="reference" class="FilterButton" type="text">{{Get_Subject()}}</el-button>
          <el-button slot="reference" type="text" v-if="Subject_Type.length > 0" @click="Subject_Type = []; submit()" style="color: LightGrey"><i class="el-icon-close"></i></el-button>
        </el-popover>
      </el-col>
      <el-col :span="3">
        <el-popover
          placement="bottom-start"
          width="510"
          trigger="hover">
          <el-checkbox-group v-model="Period_Type">
            <el-checkbox label="小学">小学</el-checkbox>
            <el-checkbox label="初中">初中</el-checkbox>
            <el-checkbox label="高中">高中</el-checkbox>
            <el-checkbox label="大学">大学</el-checkbox>
            <el-checkbox label="成人">成人</el-checkbox>
            <el-button size="small" plain type="primary" @click="submit_prepare()" style="margin-left: 40px; font-size: 14px">确认</el-button>
          </el-checkbox-group>
          <el-button slot="reference" class="FilterButton" type="text">{{Get_Period()}}</el-button>
          <el-button slot="reference" type="text" v-if="Period_Type.length > 0" @click="Period_Type = []; submit()" style="color: LightGrey"><i class="el-icon-close"></i></el-button>
        </el-popover>
      </el-col>
      <el-col :span="3">
        <el-popover
          placement="bottom-start"
          width="770"
          trigger="hover">
          <el-checkbox-group v-model="Search_Ques_Type">
            <el-checkbox label="单选题">单选题</el-checkbox>
            <el-checkbox label="多选题">多选题</el-checkbox>
            <el-checkbox label="判断题">判断题</el-checkbox>
            <el-checkbox label="填空题">填空题</el-checkbox>
            <el-checkbox label="简答题">简答题</el-checkbox>
            <el-checkbox label="计算题">计算题</el-checkbox>
            <el-checkbox label="其他">其他</el-checkbox>
            <el-button size="small" plain type="primary" @click="submit_prepare()" style="margin-left: 40px; font-size: 14px">确认</el-button>
          </el-checkbox-group>
          <el-button slot="reference" class="FilterButton" type="text">{{Get_Search_Ques_Type()}}</el-button>
          <el-button slot="reference" type="text" v-if="Period_Type.length > 0" @click="Period_Type = []; submit()" style="color: LightGrey"><i class="el-icon-close"></i></el-button>
        </el-popover>
      </el-col>
    </el-row> -->
    <el-row
      v-for="(Question, Question_Index) in question_list"
      :key="Question_Index"
      style="margin: 25px"
      >
      <el-col :span="24" class="quesCard">
        <el-row style="text-align: left; padding-left: 30px; padding-top: 15px; background: white; padding-bottom: 15px">
          <el-col style="padding-bottom: 15px" >
            <Mathdown :content="Question.stem" :name="'Q_' + Question_Index + '_Stem'"></Mathdown>
          </el-col>
          <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_'+ Option_Index + '_Of_' + Question_Index">
            <el-row style="line-height: 40px" type="flex" justify="start"><span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span><Mathdown style="width:700px" :content="Option" :name="'Q_' + Question_Index + '_Option_' + Option_Index"></Mathdown></el-row>
          </el-col>
        </el-row>
        <el-row display="flex" style="margin-bottom: 15px">
          <el-col class="text" :span="12">
            <div>
              所属题库：{{Question.database}}
            </div>
            <div>
              学科：{{Question.subject}}
            </div>
            <div style="display:None">
              题型：{{Question.type}}
            </div>
            <div >
              学段：{{Question.period}}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="btn">
              <el-button size="medium" plain round type="primary" @click="Expand(Question_Index)">查看答案与解析</el-button>
            </div>
            <div class="btn">
              <el-button size="medium" plain round type="primary" @click="Check_Analyse(Question.id, Question.database)">查看分析报告</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="Expand_List[Question_Index]" style="text-align: left; padding-left: 40px; line-height:30px; padding-top: 20px; border-top: 1px dashed black">
          <el-col>
            <span style="margin-bottom: 10px; display: block">答案：</span><Mathdown :content="Question.answer" :name="'Q_' + Question_Index + '_Answer'"></Mathdown>
          </el-col>
        </el-row>
        <el-row v-if="Expand_List[Question_Index]" style="text-align: left; padding-left: 40px; padding-bottom: 20px">
          <el-col>
            <span style="margin-bottom: 20px; display: block">解析：</span><Mathdown :content="Question.analysis" :name="'Q_' + Question_Index + '_Analysis'"></Mathdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row
      v-if="question_list.length == 0"
      style="margin: auto;height:100vh; font-size: 30px"
      v-loading="loading"
      element-loading-text="加载中，请等待"
      element-loading-spinner="el-icon-loading">

    </el-row>
    <el-row v-if="question_list.length != 0">
      <el-pagination
        @current-change="BackToTop"
        :current-page.sync="Page_Index"
        :page-size="Page_Length"
        layout="total, prev, pager, next"
        :total="Total_Count">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import Mathdown from "@/common/components/Mathdown.vue";
import QuestionAnalyse from "../../../resourceAnalyse/QuestionAnalyse.vue"
import {commonAjax} from '@/common/utils/ajax'

export default {
  components: { Mathdown, QuestionAnalyse },
  name: "exercise",
  data() {
    return {
      // 用于之后进行图片搜索类型筛选的变量
      Refresh: false,
      // 存放返回的题目内容
      question_list: [],
      // 存放学科信息
      subject_name: [],
      // 存放题型信息
      question_type: [],
      // 存放将要查询的数据库名称
      // 检测是否要展开答案和解析内容
      Expand_List: [],
      // 页码
      Page_Index: 1,
      // 单页长度
      Page_Length: 5,
      // 能搜索到的题目数量
      Total_Count: -1,
      // loading
      loading: false,
      // 学科和学段
      Subject_Type: [],
      Period_Type: [],
      // 题型及历史题型
      Search_Ques_Type: [],
      // 上次选择的学科和学段
      history_Subject_Type: [],
      history_Period_Type: [],
      // 分析报告页是否显示
      analyseReport: false,
      // 是否正在返回分析报告
      Question_Analysing: false,
      // 暂存的图片内容
      Cache_Pic: [""],
      imgUrl:'data:image/png;base64,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AiIgAqkISFxTkVW9IiACIiACbglIXN12vRouAiIgAiKQioDENRVZ1SsCIiACIuCWgMTVbder4SIgAiIgAqkISFxTkVW9IiACIiACbglIXN12vRouAiIgAiKQioDENRVZ1SsCIiACIuCWgMTVbder4SIgAiIgAqkISFxTkVW9IiACIiACbglIXN12vRouAiIgAiKQioDENRVZ1SsCIiACIuCWgMTVbder4SIgAiIgAqkISFxTkVW9IiACIiACbglIXN12vRouAiIgAiKQioDENRVZ1SsCIiACIuCWgMTVbder4SIgAiIgAqkISFxTkVW9IiACIiACbglIXN12vRouAiIgAiKQioDENRVZ1SsCIiACIuCWgMTVbder4SIgAiIgAqkISFxTkVW9IiACIiACbglIXN12vRouAiIgAiKQioDENRVZ1SsCIiACIuCWgMTVbder4SIgAiIgAqkISFxTkVW9IiACIiACbglIXN12vRouAiIgAiKQioDENRVZ1SsCIiACIuCWgMTVbder4SIgAiIgAqkISFxTkVW9IiACIiACbglIXN12vRouAiIgAiKQioDENRVZ1SsCIiACIuCWgMTVbder4SIgAiIgAqkIuBbXIUOGWJ8+faxly5YFfH///XcbNmyYjRs3zmrXrl0s961bt9qMGTPsmWeesQoVKhT7fr1BBERABESg7BNwK65r1qyxK664wh5//HGrV69e6OmaNWva6tWrbezYsTZr1qwCsSxfvrz17dvX+D5t2jQ7cOBAwcg4dOiQjRgxwgYMGGANGjQ4YcS0bdvWWrVqVfZHkVooAiIgAiJwAgGX4nrkyBFD+BDJGjVq2LJly6xXr15WpUoVe+GFF+yGG24wRPOjjz6y3r17B1GdM2dOENty5crZ0KFD7ZxzzgkgN27caMeOHbOmTZueAHbBggXWv39/GzRokIacCIiACIiAMwIuxXXevHk2YcIEW7lypVWqVMk6duxojz32mH322We2ZcsWe+mll+zw4cPBsh0+fLh17969YFi0adPGbr/9djv77LMNkR48eLC1b9/ebr311hOGzltvvWVdu3a1O+64o9Ah9cgjjwThxlJWEQEREAERKDsEXIor3Xf06NECt++XX35pd911V3APr1q1Kuy58oWVmruP+uqrr9r+/fvtu+++C/uyI0eOtPPPPz+MiIkTJ9rff/8d3MQUrONGjRoVOloeffRRO378uD399NNlZ0SpJSIgAiIgAuZWXOn7PXv22OTJk4NI4g7u16+f7dq1y+68807bu3evTZo0ydq1a5d3mODuJZDppptusquvvjqI7eLFi4M45+69apyJgAiIgAj4IuBSXHfu3GnPPfdcEE9K3bp1T4gYxqp9++23w2stWrQILuObb745uHA3bdpk+/btC18EReHS5WcE9dtvvw0uZN7boUMHO/fcc32NJrVWBERABEQgEHAprlOmTDHcu7h0CUxat27dScMBl3Dnzp1t5syZNnXqVNu2bVsIfurZs6d99dVXdsEFFwRRbt26ddin7datm1WrVs0WLVpk8+fPD8K7e/duq1WrloaaCIiACIiAMwIuxRXL9LTTTguiuHnz5kK7nPfg9iVwqWLFirZjxw778MMPT3o/e6xEGF9zzTUFr3Felv3WTp06FVr/9OnTw2uKKHb2v07NFQERKPMEXIpr7NUxY8bY+PHjrUmTJid1NEdxNmzYEIQ1BjWtXbvWRo0aVfDev/76y957772Cf1etWjVEDsdSv379AtdzvpHUuHHj8OuiBL7Mj0A1UAREQATKIAH34orrFrdvbvnpp5/svPPOO0Fcs+9Zv3699ejRw7p06WLLly8Pe61z584NAVAESJ155pnFDhc+g1KnTp1i36s3iIAIiIAIlB4C7sX1008/tYEDB57UY7/99lvIypS1XEk6wfnV2bNnh33X0aNH27333huCoR588MHgGuYIz8KFC0NSCr6IJFYRAREQARHwRcC9uD7//PPWrFmzk3r94MGD9vHHH58gru+//34IaHryySfDudjKlSuHv4viGhNGbN++PbiDEeAVK1b4GlFqrQiIgAiIgM9o4djv7KkiomRiyi3sub755pshwxKRw7Fkk0/E3+EWZv+UCGIVERABERABEXBtuar7RUAEREAERCAFAYlrCqqqUwREQAREwDUBiavr7lfjRUAEREAEUhCQuKagqjpFQAREQARcE5C4uu5+NV4EREAERCAFAYlrCqqqUwREQAREwDUBiavr7lfjRUAEREAEUhCQuKagqjpFQAREQARcE5C4uu5+NV4EREAERCAFAYlrCqqqUwREQAREwDUBiavr7lfjRUAEREAEUhCQuKagqjpFQAREQARcE5C4uu5+NV4EREAERCAFAYlrCqqqUwREQAREwDUBiavr7lfjRUAEREAEUhCQuKagqjpFQAREQARcE5C4uu5+NV4EREAERCAFAYlrCqqqUwREQAREwDUBiavr7lfjRUAEREAEUhCQuKagqjpFQAREQARcE5C4uu5+NV4EREAERCAFAYlrCqqqUwREQAREwDUBiavr7lfjRUAEREAEUhCQuKagqjpFQAREQARcE5C4uu5+NV4EREAERCAFAYlrCqqqUwREQAREwDUBiavr7lfjRUAEREAEUhCQuKagqjpFQAREQARcE5C4uu5+NV4EREAERCAFAYlrCqqqUwREQAREwDUBiavr7lfjRUAEREAEUhCQuKagqjpFQAREQARcE5C4uu5+NV4EREAERCAFAYlrCqqqUwREQAREwDUBiavr7lfjRUAEREAEUhCQuKagqjpFQAREQARcE5C4uu5+NV4EREAERCAFAYlrCqqqUwREQAREwDUBiavr7lfjRUAEREAEUhCQuKagqjpFQAREQARcE5C4uu5+NV4EREAERCAFAYlrCqqqUwREQAREwDUBiavr7lfjRUAEREAEUhBwLa6TJ0+2Nm3aWIsWLf4V208++cS++eYbu/vuu/P+3a5du2zFihXWrFkzu/TSS/9V3XqzCIiACIhA6SfgVly3bt1qjRo1sh49eljDhg2tVatWVq9ePXv44YdP6lUEePjw4QW/nzZtmq1cudJef/318Lu5c+fa6tWrDVHduHGjbdmyxa666iobOHCg9e7du/SPErVABERABETgXxFwKa7Hjh2z2267zQ4fPmwdO3a0QYMG2YwZM6x79+62bt06GzNmTBDaPn362IIFC+yff/6xOXPmFCquHTp0sLPOOsuuu+46u/jii6158+Z2xhln/KuO0JtFQAREQATKDgGX4oo7eOjQofbEE0/YDz/8YC+++KJNnDjROnfubNu3bw/Cu2bNGmvQoIENGTIkCOe4cePs5ZdfNqzWnTt32p49e4I7Gcv03XfftV69eoWvosru3btt7dq1duONN5adEaSWiIAIiIAInETApbj+8ssvVrNmzWCtTpgwwfr372+LFi2yTp06BffvBx98YDt27Ah7qpdffnkQ1aZNmxbAa9eunR06dCi4hsuXL29YrtWqVQuu5dwyePBgq1y5cvj1zJkzbdSoUfbjjz9qKIqACIiACJRhAi7Flf6sVatWsCJ79uxpU6ZMsUmTJlmXLl2CSCKctWvXDiL70EMPndD97KvWrVs3/O6pp56yESNG2PXXX28///yzNW7c2P78809btmxZcDGXK1fOXnnlFatSpUpBHQcPHiwQ2zI8rtQ0ERABEXBNwLW4HjhwwPbt22dVq1YN3xcuXBi++PnKK68MAUuzZ88OYkjkL4X92FmzZtmFF15oX3/9dXgdAZ4+fbq1b98+BDRdcskldvz4cdcDS40XAREQAc8EXIvr0qVLbcCAATZ+/Piwl0pU8AMPPBBcxlF4sVIvuuiiYMVitRIFTADUF198EdzGmzZtsmHDhoWjOQhuUeJ69OhRwyVdp04dz2NObRcBERCBMk/Arbji/uW86n333ReCldh/JYo4unXfeOMNmzp1athXjaVfv37h2A6WbjyK8/3331v9+vVD5HHFihWLFFfcz6NHjw4CqyICIiACIlB2CbgUV47WVKhQ4aReJXoYd26NGjXs888/DwKKVUphbxYBRoznzZtXIK7vvPOO3X///bZt27bwvqIsV4QbC7dly5Zld0SpZSIgAiIgAuZSXDlGQ0ATIkvkbwxoOv30023//v1hWGCRbtiwIRzPoXB8p3r16iFIKZtEgghj3MYERBUnrhpvIiACIiACPgi4FNclS5bY2LFjbdWqVda2bdsgrs8++6x17drVunXrFnqe5BG5buE4JKK4cmyHQCeO7ZB0QuLq4z+NWikCIiACxRFwKa733HNPsDZJdYi4VqpUKRyfwQ187bXXnrK4tm7dOriBiRiORdHCxQ05vS4CIiACZZ+AS3HdvHlzyLrEWVZyDLMXirv3sssuC98pZGpav3693XLLLSeNAvZNf/3115A04o8//gju4lj27t1ry5cvD+dcVURABERABHwScCmuPrtarRYBERABESgpAhLXkiKtzxEBERABEXBD4D/4a91VAvyFeAAAAABJRU5ErkJggg==',
      // 用于分析显示的题目数据
      analyseData: {
                "analysis": "\u5982\u56fe\uff0c\u505a\u51fa\u7ea6\u675f\u6761\u4ef6$\\left\\{\\begin{array}{c}2 x+y-2 \\leq 0 \\ x-y-1 \\geq 0 \\ y+1 \\geq 0\\end{array}\\right.$\u6240\u8868\u793a\u7684\u53ef\u884c\u57df\u3002\u6613\u5f97A\u7684\u5750\u6807\u4e3a$A(1,0)$\u3002\u5f53\u76ee\u6807\u51fd\u6570\u7ecf\u8fc7A\u70b9\u65f6\uff0cz\u53d6\u5f97\u6700\u5927\u503c\uff0c\u53ef\u5f97$z=x+7 y$\u7684\u6700\u5927\u503c\u4e3a$1+7 \\times 0=1$",
                "answer": "1",
                "database": "公开题库",
                "id": "96ac6512-8aed-11eb-8fbd-b46bfc50aa29",
                "options": [],
                "period": "高中",
                "stem": "若$x,y$满足约束条件$\\left\\{\\begin{array}{c}2 x+y-2 \\leq 0 \\ x-y-1 \\geq 0 \\ y+1 \\geq 0\\end{array}\\right.$，则$z=x+7 y$的最大值为$\\underline{}$",
                "subject": "数学",
                "type": "Question",
                "que_type": "其他",
                "difficulty": 0.2,
                "discrimination": 0.3,

                "quality": 0.6,
                "knowledge_points_frontend": {
                    "kp": [
                        "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212",
                        "\u4ee3\u6570",
                        "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898",
                        "\u4e0d\u7b49\u5f0f"
                    ],
                    "kp_layer": [
                        {
                        "children": [
                            {
                            "children": [
                                {
                                "children": [
                                    {
                                    "children": [],
                                    "label": "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898"
                                    },
                                    {
                                    "children": [],
                                    "label": "\u4e8c\u5143\u4e00\u6b21\u4e0d\u7b49\u5f0f\uff08\u7ec4\uff09\u8868\u793a\u7684\u5e73\u9762\u533a\u57df"
                                    }
                                ],
                                "label": "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212"
                                }
                            ],
                            "label": "\u4e0d\u7b49\u5f0f"
                            }
                        ],
                        "label": "\u4ee3\u6570"
                        }
                    ],
                    "kp_priority": [
                            "\u4ee3\u6570",
                            "\u4e0d\u7b49\u5f0f",
                            "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212",
                            "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898",
                            "\u4e8c\u5143\u4e00\u6b21\u4e0d\u7b49\u5f0f\uff08\u7ec4\uff09\u8868\u793a\u7684\u5e73\u9762\u533a\u57df"
                    ]
                    },
                }
    };
  },
  mounted(){
    this.ToTop()

    // this.search(this.imgUrl,['public']);
  },
  methods: {
    search(imgUrl,databaselist,subject,period){
      this.submit(1, imgUrl,databaselist,subject,period);
    },
    // 给筛选器的提交做个检测
    // submit_prepare(){
    //   console.log(this.imgUrl);
    //   this.submit(1, this.imgUrl)
    // },
    // 查看单题分析报告
    Check_Analyse(ID, DatabaseName){

      this.Question_Analysing = true;
      commonAjax(this.backendIP+'/api/questionAnalyse',
        {
          databasename:DatabaseName=='公开题库'?'public':DatabaseName,
          ID:ID
        }
      ).then((data)=>{
        // console.log(data);
        this.Refresh = !this.Refresh;
        this.analyseReport = true;
        this.Question_Analysing = false
        this.analyseData = data.que_dic
      })
    },
    ToTop(){
      window.scrollTo(0,0);
    },
    BackToTop(){
      if(this.Cache_Pic[0].length > 0){
        this.submit(1, this.Cache_Pic[0]);
      }else{
        this.submit(0, "");
      }
      window.scrollTo(0,0);
    },
    // 修改翻页内容
    Get_Question_Bundle(Page_Index){
      if(Page_Index * 5 > this.question_list.length){
        return this.question_list.slice((Page_Index - 1)*5)
      }else {
        return this.question_list.slice((Page_Index - 1)*5, Page_Index * 5)
      }
    },
    // 修改是否展开
    Expand(Index){
      this.Expand_List.splice(Index, 1, !this.Expand_List[Index]);
    },
    // 返回选项标签
    Get_Option_Label(Index){
      return String.fromCharCode(Index + 65)
    },
    Same_Check(Arr1, Arr2){
      if(Arr1.length != Arr2.length){
        return false
      }
      for(let i = 0; i < Arr1.length; i++){
        if(Arr2.indexOf(Arr1[i]) == -1){
          return false
        }
      }
      return true
    },
    submit(type, Pic = "",database_list,subject,period) {

      this.loading = true;

      // if(!this.Same_Check(this.history_Subject_Type, this.Subject_Type)){
      //   this.Page_Index = 1;
      // }
      //
      // this.history_Subject_Type = this.Subject_Type;
      //
      // if(!this.Same_Check(this.history_Period_Type, this.Period_Type)){
      //   this.Page_Index = 1;
      // }
      //
      // this.history_Period_Type = this.Period_Type;

      this.question_list = [];

      let param={}
      param.pic=Pic
      var data = JSON.stringify({
        "size": 5,
        "database": database_list,
        "page_count": this.Page_Index,
        "subject": subject,
        "period": period,
        "type": this.Search_Ques_Type,
        "difficulty": [0.0, 1.0]
      })

      param.data=data
      commonAjax(this.backendIP+'/api/search',param)
      .then((data)=>{
        this.loading = false;
        this.Expand_List = [];
        this.question_list = [];
        var quess = data.results;
        for(var i = 0; i < quess.length; i++){
          this.question_list.push(quess[i])
          this.Expand_List.push(false);
        }
        this.Total_Count = data.totalLength
      })
    },
    // 修改学科，学段时的配套显示
    Get_Subject(){
      if(this.Subject_Type.length == 0){
        return "选择学科"
      }else if(this.Subject_Type.length == 1){
        return this.Subject_Type[0]
      }else{
        return this.Subject_Type[0] + "（等" + this.Subject_Type.length + "项）"
      }
    },
    Get_Period(){
      if(this.Period_Type.length == 0){
        return "选择学段"
      }else if(this.Period_Type.length == 1){
        return this.Period_Type[0]
      }else{
        return this.Period_Type[0] + "（等" + this.Period_Type.length + "项）"
      }
    },
    Get_Search_Ques_Type(){
      if(this.Search_Ques_Type.length == 0){
        return "选择题型"
      }else if(this.Search_Ques_Type.length == 1){
        return this.Search_Ques_Type[0]
      }else{
        return this.Search_Ques_Type[0] + "（等" + this.Search_Ques_Type.length + "项）"
      }
    }
  }
};
</script>

<style scoped lang="scss">
.text{
  line-height: 30px;
  color: #888;
  font-size: 1.5rem;
  padding-left: 30px;
  text-align: left
}
.btn{
  line-height: 30px;
  margin-bottom: 10px;
}
.exercise {
  // background: url("../assets/sub_bg.png") repeat;
  background-size: 100%;
}
.logo {
  margin-left: 70px;
}
.result {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 780px;
  background-color: #F8FBFF;
  margin-left: 20px;
}
.quesCard{
  // border: 3px dashed black;
  background: #F8FBFF;
  border: 1px dashed black;
}
/deep/.dev-md-content{
  img{
    max-width:80%
  }
}
.el-row {
  margin-bottom: 20px;
  & :last-child {
    margin-bottom: 0;
  }
}
.title {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  color: #0a1612;
}
.el-tag {
  margin-left: 10px;
}
.el-col {
  border-radius: 4px;
}
// .focusDatabase{
//   background: #409EFF;
//   color: white;
// }
// .unFocusDatabase{
//   background: #F8FBFF;
//   color: #409EFF;
//   border: 1px solid #409EFF;
// }
// .focusDatabase,.unFocusDatabase{
//   border-radius: 15px;
//   padding: 0px 15px;
//   height: 30px;
//   line-height: 30px;
//   float: left;
//   text-align: center;/*让文字水平居中*/
// }
</style>

<style scoped type="text/css">
.el-divider--horizontal{
  display:block;
  height:3px;
  width:100%;
  margin:24px 0
}
</style>
<style scoped>
#tabs /deep/ .el-tabs__item {
  color: #36a9df;
  font-weight: 900;
  border-radius: 10px;
  border-color: #36a9df;
}
#tabs /deep/ .el-tabs__nav.is-top{
  border: none;
}
#tabs /deep/ .el-tabs__header.is-top{
  border: none;
}
#tabs /deep/ .el-tabs__item.is-active {
  background-color: #36a9df;
  color: #fff;
  font-weight: 900;
  border-color: #36a9df;
}
#tag /deep/ .el-tag {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #36a9df !important;
}

</style>
<style lang="scss" scoped>

.el-divider--vertical{
  display: block;
  width: 2px;
  background-color: #9B9EA4;
  height: 32px;
  margin-top: 4px;
}
.FilterButton{
  padding-top: 12px;
}

.el-pagination {
    text-align: center;
}
</style>
