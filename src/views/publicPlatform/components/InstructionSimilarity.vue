<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import sp1 from "@/assets/InstSim/sp1.jpg";
import sp2 from "@/assets/InstSim/sp2.jpg";
import sp3 from "@/assets/InstSim/sp3.jpg";
import sp4 from "@/assets/InstSim/sp4.jpg";
import sp5 from "@/assets/InstSim/sp5.jpg";
import sp6 from "@/assets/InstSim/sp6.jpg";
import sp7 from "@/assets/InstSim/sp7.jpg";
import sp8 from "@/assets/InstSim/sp8.jpg";
import sp9 from "@/assets/InstSim/sp9.jpg";
import Instruction from "@/common/components/Instruction.vue";
export default {
  components: {
    Instruction,
  },
  data() {
    return {
      steps: [
        {
          desc: "上传图片方式一：输入url地址上传",
          imgSrc: sp1,
        },
        {
          desc: "上传图片方式二：本地上传",
          imgSrc: sp2,
        },
        {
          desc: "上传图片方式二：本地上传-上传图片",
          imgSrc: sp3,
        },
        {
          desc: "上传图片方式二：本地上传-调整图片并搜索",
          imgSrc: sp4,
        },
        {
          desc: "上传图片方式三：使用默认图片",
          imgSrc: sp5,
        },
        {
          desc: "点击识别",
          imgSrc: sp6,
        },
        {
          desc: "打开编辑框",
          imgSrc: sp7,
        },
        {
          desc: "修正识别结果（或不上传图片直接通过编辑框键入题目）",
          imgSrc: sp8,
        },
        {
          desc: "对左右两边进行相同的操作，点击识别",
          imgSrc: sp9,
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
