<template>

  <div
      class="divide"
      v-if="item.divide"
      :class="{ active: item.active}"
  >
    <div @click="toggleDivide(item)" class="divide__line"></div>
    <div class="divide__options">
      <div @click="toggleNumber(itemIndex)" class="divide__number">
        第 {{`${item.questionID}-${item.questionSideID}`}} 题
      </div>
      <PaperdivideDropdown :question="item" class-name="divide__dropdown" />
    </div>
  </div>
</template>

<script>
import PaperdivideDropdown from './PaperdivideDropdown';
import {eventList} from '../data';
export default {
  props: {
    item: {
      type: Object,
    },
    itemIndex: {
      type: Number,
    },
  },
  name: 'PaperdivideLine',
  components: {PaperdivideDropdown},
  methods: {
    // toggle 分割线
    toggleDivide(divideItem) {
      divideItem.active = !divideItem.active;
      // 清除题号副作用
      if (divideItem.active === false) {
        divideItem.questionSideID = -1;
        divideItem.questionID = -1;
      }
      // 触发重新编号
      this.$root.$emit(eventList.reorder, {
        index: -1,
        isWhole: false,
      });
    },
    // toggle 题目编号
    toggleNumber(index) {
      this.$root.$emit(eventList.reorder, {
        index,
        isWhole: true,
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .divide {
    opacity: 0;
    transition: .15s;

    &__number {
      cursor: pointer;
      color: #346083;
      font-size: 1.8rem;
      font-weight: bold;
      margin-right: 10px;
    }
    &__options {
      display: none;
      flex-direction: row;
      justify-content: flex-end;
      height: 40px;
      line-height: 40px;
    }

    &:hover {
      opacity: 1;
    }

    &__line {
      border-bottom: 2px dashed rgb(204, 204, 204);
      width: 100%;
      cursor: pointer;
      padding: 6px 0;

      &:hover {
        border-color: rgb(64, 158, 255);
      }
    }

    &.active {
      padding-top: 6px;
      padding-bottom: 6px;
      opacity: 1;

      .divide__line:hover {
        border-color: red;
      }

      .divide__options {
        display: flex;
      }
    }
  }

  ::v-deep .pd-drop-link {
    color: #346083;
    font-size: 1.6rem!important;
    font-weight: bold;
  }
</style>
