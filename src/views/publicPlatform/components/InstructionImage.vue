<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import sp1 from "@/assets/InstImg/sp1.jpg";
import sp2 from "@/assets/InstImg/sp2.jpg";
import sp3 from "@/assets/InstImg/sp3.jpg";
import sp4 from "@/assets/InstImg/sp4.jpg";
import sp5 from "@/assets/InstImg/sp5.jpg";
import sp6 from "@/assets/InstImg/sp6.jpg";
import Instruction from "@/common/components/Instruction.vue";
export default {
  components: {
    Instruction,
  },
  data() {
    return {
      steps: [
        {
          desc: "方式一：输入url地址上传",
          imgSrc: sp1,
        },
        {
          desc: "方式二：本地上传",
          imgSrc: sp2,
        },
        {
          desc: "方式二：本地上传-上传图片",
          imgSrc: sp3,
        },
        {
          desc: "方式二：本地上传-调整图片并搜索",
          imgSrc: sp4,
        },
        {
          desc: "方式二：本地上传-识别",
          imgSrc: sp5,
        },
        {
          desc: "方式三：使用默认图片识别",
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
