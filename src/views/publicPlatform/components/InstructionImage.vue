<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import sp1 from "@/assets/InstImg/sp1.png";
import sp2 from "@/assets/InstImg/sp2.png";
import sp3 from "@/assets/InstImg/sp3.png";
import Instruction from "@/common/components/Instruction.vue";
export default {
  components: {
    Instruction,
  },
  data() {
    return {
      steps: [
        {
          desc: "上传图片",
          imgSrc: sp1,
        },
        {
          desc: "开始转写",
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
