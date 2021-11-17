<template>
  <div class="pd-side">
    <el-card class="pd-questions">
      <div class="pd-side__header">
        <div>题号</div>
        <div>题型</div>
      </div>
      <div class="pd-side__body">
        <div class="pd-side__item" v-for="(question, question_index) in questionList" :key="`paper-divide-sidebar-${question.questionID}-${question.questionSideID}`">
          <div class="pd-side__line">
            <div @click="toggleNumber(question_index)" class="pd-side__num">{{ `${question.questionID}-${question.questionSideID}` }}</div>
              <PaperdivideDropdown :question="question"/>
          </div>
          <hr>
        </div>
      </div>
    </el-card>

    <div class="pd-tools">
      <el-card @click.native="scrollToPaper" class="pd-tool"
        ><i class="el-icon-top"></i
      ></el-card>
      <el-card @click.native="reset" class="pd-tool"><i class="el-icon-refresh"></i
        ><span class="show-desktop">重置</span></el-card>
      <el-card @click.native="submit" class="pd-tool"><i class="el-icon-monitor"></i><span class="show-desktop">提交切分</span></el-card>
    </div>
  </div>
</template>

<script>
import {eventList} from '../data';
import PaperdivideDropdown from './PaperdivideDropdown';

export default {
  name: "PaperdivideSidebar",
  components: {PaperdivideDropdown},
  props: {
    questionList: {
      type: Array,
    },
  },
  methods: {
    scrollToPaper() {
      document.getElementById("pd-body__anchor").scrollIntoView({
        behavior: "smooth",
      });
    },
    // 发送重置信号
    reset() {
      this.$root.$emit(eventList.reset);
    },
    // 发送入库信号
    submit() {
      this.$root.$emit(eventList.submit);
    },
    toggleNumber(index) {
      this.$root.$emit(eventList.reorder, {
        index,
        isWhole: false,
      })
    }
  },
};
</script>

<style lang="scss" scoped>
$width-threshold: 800px;

.pd-side {
  position: sticky;
  top: 100px;

  hr {
    margin: 10px 5px;
  }

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    padding: 15px 10px;
    font-weight: bold;
    border: 1px #e8e8e9 solid;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background: #fafafb;

    @media (max-width: 1200px) {
      padding: 0 4px;
    }

    & div:first-child {
      flex: 4;
    }

    & div:last-child {
      flex: 14;
    }
  }

  &__line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    margin: 5px 0;
  }

  &__num {
    font-size: 1.5rem;
    line-height: 40px;
    text-align: center;
    cursor: pointer;

    @media (max-width: 1200px) {
      min-width: 50px;
    }

  }

  &__body {
    height: 58vh;
    overflow-y: auto;
    min-height: 180px;

  }
}

.pd-questions {

  ::v-deep .el-card__body {
    padding: 0;
  }
}

.pd-tools {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.pd-tool {
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  flex: 2;
  font-size: 1.5rem;
  margin: 10px;

  i {
    margin-right: 4px;
  }

  &:first-child {
    margin-left: 0;
    flex: 1;

    @media (max-width: $width-threshold) {
      flex: 2;
    }
  }

  &:last-child {
    margin-right: 0;
    flex: 3;
    color: white;
    background: #409effff;

    @media (max-width: $width-threshold) {
      flex: 2;
    }
  }

  ::v-deep .el-card__body {
    padding: 10px;
  }
}

.show-desktop {
  @media (max-width: $width-threshold) {
    display: none;
  }
}
</style>
