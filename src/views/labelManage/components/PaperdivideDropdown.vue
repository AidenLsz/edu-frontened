<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link pd-drop-link" :class="{
      recognized: questionStatus.isRecognized }">{{questionStatus.text}}<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="questionType in questionTypes" :key="`paper-divide-questionTypes-${questionType.value}`" @click.native="handleTypeClick(question, questionType.value)">{{questionType.label}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { questionTypes } from '../data';

export default {
  name: 'PaperdivideDropdown',
  props: {
    question: {
      type: Object,
    },
  },
  computed: {
    questionStatus() {
      if (this.question.type === null) {
        return {
          isRecognized: false,
          text: '未识别',
        };
      } else {
        const questionType = questionTypes.find((questionType) => {
          return questionType.value === this.question.type;
        });
        return {
          isRecognized: true,
          text: questionType.label,
        };
      }
    }
  },
  data() {
    return {
      questionTypes,
    }
  },
  methods: {
    handleTypeClick(question, questionType) {
      question.type = questionType;
    }
  }
}
</script>

<style lang="scss" scoped>
  .pd-drop-link {
    position: relative;
    margin-left: 10px;
    font-size: 1.5rem;

    &:before {
      position: absolute;
      content: '';
      border-radius: 5px;
      left: -10px;
      height: 8px;
      width: 8px;
      top: 50%;
      transform: translateY(-50%);
      line-height: 16px;
      background: #e13a16;
    }

    &.recognized {
      &:before {
        background: #4be116;
      }
    }
  }
</style>
