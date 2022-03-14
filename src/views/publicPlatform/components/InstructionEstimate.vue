<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import sp1 from "@/assets/InstEst/sp1.png";
import sp2 from "@/assets/InstEst/sp2.png";
import sp3 from "@/assets/InstEst/sp3.png";
import sp4 from "@/assets/InstEst/sp4.png";
import Instruction from "@/common/components/Instruction.vue";
export default {
  components: {
    Instruction,
  },
  data() {
    return {
      steps: [
        {
          desc: "上传图片并转写为文字",
          imgSrc: sp1,
        },
        {
          desc: "编辑转写后的文字，或者直接以latex格式输入",
          imgSrc: sp2,
        },
        {
          desc: "选择学科与题型开始预估",
          imgSrc: sp3,
        },
        {
          desc: "查看结果",
          imgSrc: sp4,
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
