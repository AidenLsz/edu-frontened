// 用于新页面的单题显示组件

<template>
  <div style="border-radius: 10px; background: white">
    <el-row style="text-align: left; padding-left: 30px; background: white; padding-top: 15px; border-radius: 10px">
      <el-col style="padding-bottom: 8px">
        <Mathdown :content="Question.stem" :name="'Q_' + Question_Index + '_Stem'"></Mathdown>
      </el-col>
    </el-row>
    <el-row style="text-align: left; padding-left: 30px; background: white; padding-bottom: 8px">
      <el-col v-for="(Option, Option_Index) in Question.options"
              :key="'Option_'+ Option_Index + '_Of_' + Question_Index">
        <el-row style="line-height: 40px; height: 40px" type="flex" justify="start">
          <span style="line-height: 40px">{{ Get_Option_Label(Option_Index) }}：</span>
          <Mathdown style="width:700px" :content="Option"
                    :name="'Q_' + Question_Index + '_Option_' + Option_Index"></Mathdown>
        </el-row>
      </el-col>
    </el-row>
    <el-row
        v-if="Expand"
        style="text-align: left; padding-left: 40px; line-height:30px; padding-top: 20px;">
      <el-col>
        <span :style="'margin-bottom: 10px; display: ' + $store.state.user.name ? ' block': ' inline-block'">答案：</span>
        <span v-show="!$store.state.user.name" class="Answer_Before_Login">【登录后可见】</span>
        <Mathdown v-show="$store.state.user.name" :content="Question.answer"
                  :name="'Q_' + Question_Index + '_Answer'"></Mathdown>
      </el-col>
    </el-row>
    <el-row
        v-if="Expand"
        style="text-align: left; padding-left: 40px; padding-bottom: 20px">
      <el-col>
        <span style="margin-bottom: 20px; display: block">解析：</span>
        <Mathdown :content="Question.analysis" :name="'Q_' + Question_Index + '_Analysis'"></Mathdown>
      </el-col>
    </el-row>
    <el-row class="Detail_Line">
      <div
          align="right"
          class="Detail_Line_Infos">
        <div class="SQ_subject" style="margin-right:10px">
          {{ Question.subject }}
        </div>
        <div class="SQ_period" style="margin-right:10px">
          {{ Question.period }}

        </div>
        <div class="SQ_pastpaper" style="margin-right:10px">
          {{ Question.pastpaper }}
        </div>
        <div class="SQ_database" style="margin-right:10px">
          {{ Question.database }}
        </div>


      </div>
      <div
          align="left"
          class="Detail_Line_Expand">
        <el-button :class=" Expand ? 'SQ_expanded' : 'SQ_unexpanded'"
                   type="text"
                   @click="Expand = !Expand; Expand_Aim();"
                   style="height: 44px;">
          <i :class="Expand?'el-icon-arrow-up':'el-icon-document'"></i>
          {{ Expand ? '收起' : '答案与解析' }}
        </el-button>
      </div>
      <div
          class="Detail_Line_Right">
        <el-button
            size="medium"
            type="primary"
            class="Search_Button"
            style="height: 44px; border-radius: 10px; width: 130px"
            @click="Check_Analyse(Question.id, Question.database)"
            icon="el-icon-s-marketing">
          分析报告
        </el-button>
      </div>
    </el-row>
  </div>
</template>

<script>

import Mathdown from '@/common/components/Mathdown'

export default {
  name: "Test",
  components: {
    Mathdown
  },
  props: {
    Question: {
      type: Object,
      default: function () {
        return {
          "analysis": "",
          "answer": "",
          "database": "",
          "id": "",
          "options": [],
          "period": "",
          "stem": "",
          "subject": "",
          "type": "",
          "pattern": "text",
          "file_name": null,
          "pastpaper": "",
          "area": ""
        }
      }
    },
    Question_Index: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      Expand: false
    };
  },
  methods: {
    Check_Analyse(ID, Database) {
      this.$emit('Check_Question_Analysis', JSON.stringify({
        ID: ID,
        Database: Database
      }))
    },
    Get_Option_Label(Option_Index) {
      return String.fromCharCode(Option_Index + 65)
    },
    Expand_Aim() {
      if (this.Expand == true) {
        this.$emit('Expand_Aim', JSON.stringify({
          Aim: "Question_" + this.Question_Index
        }))
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.SQ_period {
  position: static;
  left: 76px;
  top: 0px;
  width: 64px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  background: #E9E8FA;

  /* 标签下阴影 */
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.16);
  font-family: Sarasa-Gothic-SC-Regular;
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  color: #38377D;
  z-index: 0
}

.SQ_subject {
  position: static;
  left: 0px;
  top: 0px;
  width: 64px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  background: #EDF4FA;

  /* 标签下阴影 */
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.16);
  z-index: 0;
  font-family: Sarasa-Gothic-SC-Regular;
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  color: #36587C;

}

.SQ_pastpaper {
  position: static;
  left: 152px;
  top: 0px;
  width: 100px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  background: #FAE8EC;

  /* 标签下阴影 */
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.16);
  font-family: SourceHanSansCN-Regular;
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  color: #7D3745;
  z-index: 0
}

.SQ_database {
  position: static;
  left: 228px;
  top: 0px;
  width: 150px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  background: #FAF3E8;

  /* 标签下阴影 */
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.16);
  font-family: Sarasa-Gothic-SC-Regular;
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  color: #7D6237;
  z-index: 0
}

.SQ_expanded {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 16px;
  border-radius: 8px;
  background: #F0F8FC;
  box-sizing: border-box;
  border: 1px solid #2E7CA3;
  z-index: 1
}

.SQ_unexpanded {
  position: static;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: #F0F8FC;
  box-sizing: border-box;
  border: 1px solid #2E7CA3;
  z-index: 1
}

.Detail_Line {
  padding: 6px 16px 16px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.Detail_Line_Right {
  width: 200px;
  height: 44px;
  display: inline-block;
  overflow: hidden;
}

.Extra_Info_Item {
  margin-left: 15px;
}

.Detail_Line_Expand {
  display: inline-block;
  width: 130px;
  margin-right: 10px;
  overflow: hidden;
}

.Detail_Line_Infos {
  position: relative;
  display: flex;
  right: 0px;
  width: 100%;
  align-items: center;
}

.Search_Button {
  background: #539DD9;
  transition-duration: 300ms;
}

.Search_Button:hover {
  background: #4484B8;
}

.Answer_Before_Login {
  color: #999
}
</style>
