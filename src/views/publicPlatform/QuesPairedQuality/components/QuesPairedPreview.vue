<template>
  <div>
    <Mathdown :content="parseImg(question.stem)" :name="'Q_' + prefix + question.question_ID + '_Stem'"/>
    <br>
    <div>
      <Mathdown v-for="(option, idx) in question.options" :content="`${String.fromCharCode(65+idx)}. ` + parseImg(option)" :key="option" :name="'Q_' + prefix + question.question_ID + idx + '_Stem'" />
    </div>
    <div class="qp-answers">
      <div class="qp-answer">
        <Mathdown :content="`答案：` + question.answer" :name="'Q_' + prefix + question.question_ID + 'answer' + '_Stem'" />
      </div>
      <div class="qp-answer">
        <Mathdown v-show="question.analysis && question.analysis !== ''" :content="`解析：` + parseImg(question.analysis)" :name="'Q_' + prefix + question.question_ID + 'analysis' + '_Stem'" />
      </div>
    </div>
  </div>
</template>

<script>
import Mathdown from "@/common/components/Mathdown.vue";

export default {
  name: 'QuestionPairedPreview',
  components: {
    Mathdown,
  },
  props: {
    question: Object,
    figures: Array,
    prefix: String,
  },
  methods: {
    parseImg(str) {
      try {
        return str.replace(/\$\\FigureID{([0-9a-z-]*)?}\$/g, ($1, $2) => `<img src="${this.figures.find(ele => ele.figure_ID === $2).img}">`);
      } catch (e) {
        return str;
      }
    },
  }
}
</script>

<style scoped lang="scss">
  .qp-answers {
    margin-top: 2rem;
  }

  .qp-answer {
    margin-top: 10px;
  }

  ::v-deep .latex {
    margin: 0 4px;
  }
</style>
