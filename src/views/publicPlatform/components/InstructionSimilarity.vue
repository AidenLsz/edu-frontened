<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import sp1 from "@/assets/InstSim/sp1.png";
import sp2 from "@/assets/InstSim/sp2.png";
import sp3 from "@/assets/InstSim/sp3.png";
import Instruction from "@/common/components/Instruction.vue";
export default {
  components: {
    Instruction,
  },
  data() {
    return {
      steps: [
        {
          desc: "选择一对题目",
          imgSrc: sp1,
        },
        {
          desc: "继续选择或开始评估",
          imgSrc: sp2,
        },
        {
          desc: "查看结果",
          imgSrc: sp3,
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
