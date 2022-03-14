<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import sp1 from "@/assets/InstMultiPaper/sp1.png";
import sp2 from "@/assets/InstMultiPaper/sp2.png";
import sp3 from "@/assets/InstMultiPaper/sp3.png";
import sp4 from "@/assets/InstMultiPaper/sp4.png";
import sp5 from "@/assets/InstMultiPaper/sp5.png";
import sp6 from "@/assets/InstMultiPaper/sp6.png";
import Instruction from "@/common/components/Instruction.vue";
export default {
  components: {
    Instruction,
  },
  data() {
    return {
      steps: [
        {
          desc: "勾选所需分析属性",
          imgSrc: sp1,
        },
        {
          desc: "点击进入试卷搜索",
          imgSrc: sp2,
        },
        {
          desc: "选择⼀种或多种检索限制",
          imgSrc: sp3,
        },
        {
          desc: "点击查看检索结果",
          imgSrc: sp4,
        },
        {
          desc: "选择试卷加入试卷篮",
          imgSrc: sp5,
        },
        {
          desc: "获取分析报告",
          imgSrc: sp6,
        },
      ],
    };
  },
  methods: {
    openDialog() {
      this.$refs.instruction.openDialog();
    },
  },
};
</script>
