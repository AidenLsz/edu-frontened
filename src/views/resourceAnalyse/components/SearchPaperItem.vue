// 用于新页面的单题显示组件

<template>
  <div style="border-radius: 10px; background: white">
    <el-row
      style="
        padding-top: 15px;
        margin-left: 2%;
        width: 96%;
        border-bottom: 2px dashed #ccc;
        padding-bottom: 5px;
      "
      justify="center"
    >
      <label>{{ Paper_Info.title }}</label>
    </el-row>
    <el-row
      style="
        text-align: left;
        padding-left: 30px;
        background: white;
        padding-top: 15px;
        border-radius: 10px;
      "
    >
      <el-col style="padding-bottom: 8px">
        <Mathdown
          :content="Paper_Info.Ques.stem"
          :name="'Q_' + Paper_Info_Index + '_Stem'"
        ></Mathdown>
      </el-col>
    </el-row>
    <el-row
      style="
        text-align: left;
        padding-left: 30px;
        background: white;
        padding-bottom: 8px;
      "
    >
      <el-col
        v-for="(Option, Option_Index) in Paper_Info.Ques.options"
        :key="'Option_' + Option_Index + '_Of_' + Paper_Info_Index"
      >
        <el-row
          style="line-height: 40px; height: 40px"
          type="flex"
          justify="start"
        >
          <span style="line-height: 40px"
            >{{ Get_Option_Label(Option_Index) }}：</span
          >
          <Mathdown
            style="width: 700px"
            :content="Option"
            :name="'Q_' + Paper_Info_Index + '_Option_' + Option_Index"
          ></Mathdown>
        </el-row>
      </el-col>
    </el-row>
    <el-row
      v-if="Expand"
      style="
        text-align: left;
        padding-left: 40px;
        line-height: 30px;
        padding-top: 20px;
      "
    >
      <el-col>
        <span style="margin-bottom: 10px; display: block">答案：</span>
        <Mathdown
          :content="Paper_Info.Ques.answer"
          :name="'Q_' + Paper_Info_Index + '_Answer'"
        ></Mathdown>
      </el-col>
    </el-row>
    <el-row
      v-if="Expand"
      style="text-align: left; padding-left: 40px; padding-bottom: 20px"
    >
      <el-col>
        <span style="margin-bottom: 20px; display: block">解析：</span>
        <Mathdown
          :content="Paper_Info.Ques.analysis"
          :name="'Q_' + Paper_Info_Index + '_Analysis'"
        ></Mathdown>
      </el-col>
    </el-row>
    <el-row class="Detail_Line">
      <div
        class="Detail_Line_Left"
        style="
          line-height: 44px;
          padding: 0px 16px 0px 16px;
          border-radius: 10px;
          background: #f8f8f8;
        "
      >
        <div align="left" class="Detail_Line_Infos">
          <span class="Extra_Info_Item">
            所属题库：{{ Paper_Info.Ques.database }}
          </span>
          <span class="Extra_Info_Item">
            学科：{{ Paper_Info.Ques.subject }}
          </span>
          <span class="Extra_Info_Item">
            学段：{{ Paper_Info.Ques.period }}
          </span>
        </div>
      </div>
      <div align="right" class="Detail_Line_Right">
        <el-button
          size="medium"
          type="primary"
          class="Detail_Button"
          style="
            height: 44px;
            border-radius: 10px;
            width: 110px;
            margin-right: 6px;
          "
          @click="Paper_Detail(Paper_Info.id)"
        >
          试卷详情
        </el-button>
        <el-button
          v-if="!Add"
          size="medium"
          type="primary"
          class="Search_Button"
          style="height: 44px; border-radius: 10px; width: 132px"
          @click="Add_Paper(Paper_Info.id, Paper_Info.title)"
        >
          加入试卷篮
        </el-button>
        <el-button
          v-else
          size="medium"
          type="success"
          style="height: 44px; border-radius: 10px; width: 132px"
          @click="Delete_Paper(Paper_Info.id)"
        >
          已加入试卷篮
        </el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import Mathdown from "@/common/components/Mathdown";

export default {
  name: "Test",
  components: {
    Mathdown,
  },
  props: {
    Paper_Info: {
      type: Object,
      default: function () {
        return {
          id: "",
          title: "",
          Ques: {},
        };
      },
    },
    Paper_Info_Index: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      Expand: false,
      //   Add: function() {
      //       return this.$parent.Paper_List.indexOf(this.Paper_Info.id) != -1;
      //   },
      Add: false,
    };
  },
  methods: {
    Get_Option_Label(Option_Index) {
      return String.fromCharCode(Option_Index + 65);
    },
    Paper_Detail(Paper_ID) {
      this.$emit("Paper_Detail", Paper_ID);
    },
    Paper_Analyse(Paper_ID) {
      this.$emit("Paper_Analyse", Paper_ID);
    },
    Add_Paper(Paper_ID, Paper_title) {
      this.$emit("Add_Paper", Paper_ID, Paper_title);
      this.Add = true;
    },
    Delete_Paper(Paper_ID) {
      this.$emit("Delete_Paper", Paper_ID);
      this.Add = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Detail_Line {
  padding: 6px 16px 16px 16px;
}
.Detail_Line_Left {
  display: inline-block;
  width: calc(100% - 278px);
}
.Detail_Line_Right {
  width: 278px;
  height: 44px;
  display: inline-block;
}
.Extra_Info_Item {
  margin-left: 15px;
}
.Detail_Line_Infos {
  position: relative;
  display: inline-block;
  right: 0px;
  width: 100%;
}

.Search_Button {
  background: #539dd9;
  transition-duration: 300ms;
}

.Detail_Button {
  border-color: #41a441;
  background: #edf8ed;
  color: #41a441;
  transition-duration: 300ms;
}

.Search_Button:hover {
  background: #4484b8;
}

.Detail_Button:hover {
  background: rgba(#41a441, 0.2);
}
</style>
