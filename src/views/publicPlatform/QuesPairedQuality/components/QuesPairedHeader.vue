<template>
  <el-card class="qp-header-container">
    <div class="qp-header">
      <div class="qp-left">
        <div class="qp-idx">{{idx}}.</div>
        <div>
          <div class="qp-block qp-sld">
            <p>左题评分({{pair.score0}} 分)</p>
            <el-slider :show-tooltip="false" :step="1" :max="5" show-stops class="qp-slider" v-model="pair.score0" ></el-slider>
          </div>
          <div class="qp-block qp-sld">
            <p>右题评分({{pair.score1}} 分)</p>
            <el-slider :show-tooltip="false" :step="1" :max="5" show-stops class="qp-slider" v-model="pair.score1" ></el-slider>
          </div>
        </div>
      </div>

      <div class="qp-right">
        <div class="qp-opts">
          <div class="qp-block">
            <p>质量</p>
            <el-button-group>
              <el-button size="medium" @click="setBetter(1)" :type="pair.better === 1 ? `primary` : null">左题</el-button>
              <el-button size="medium" @click="setBetter(0)" :type="pair.better === 0 ? `primary` : null">相近</el-button>
              <el-button size="medium" @click="setBetter(2)" :type="pair.better === 2 ? `primary` : null">右题</el-button>
            </el-button-group>
          </div>
          <div class="qp-block">
            <p>场景</p>
            <el-select size="medium" class="qp-select" v-model="pair.scenario" placeholder="请选择">
              <el-option
                  v-for="scenario in scenarios"
                  :key="scenario.value"
                  :label="scenario.label"
                  :value="scenario.value">
              </el-option>
            </el-select>
          </div>
          <div class="qp-block">
            <el-button size="medium" @click="postPairedData" :loading="isPosting" :type="isPosted ? `success` : `primary`" icon="el-icon-upload" :disabled="isPosting">确认</el-button>
          </div>
        </div>
        <p class="qp-text">
          * 请选择您认为该项质量较高的题目，双击可取消 <span :class="isPosted ? `qp-uploaded`: `qp-not-uploaded`">标注{{isPosted ? `已` : `未`}}上传</span>
        </p>
      </div>
    </div>
  </el-card>
</template>

<script>
import {scenarios, postQuestionPair} from '../data';

export default {
  name: 'QuesPairedHeader',
  props: {
    pair: Object,
    idx: Number,
    isTest: Boolean,
  },
  data() {
    return {
      scenarios,
      isPosted: false,
      isPosting: false,
    }
  },
  methods: {
    setBetter(value) {
      if (value === this.pair.better) {
        this.pair.better = null;
      } else {
        this.pair.better = value;
      }
    },
    async postPairedData() {
      this.isPosting = true;
      this.isPosted = false;
      let res;
      if (this.pair.better === null) {
        this.$message.error(`请选择试题质量`);
      } else if (this.pair.score0 === 0) {
        this.$message.error(`请选择左题评分`);
      } else if (this.pair.score1 === 0) {
        this.$message.error(`请选择左题评分`);
      } else {
        try {
          res = await postQuestionPair(this.pair.question_ID0, this.pair.question_ID1, this.pair.better, this.pair.score0, this.pair.score1, this.pair.scenario, this.isTest);
        } catch (e) {
          console.log(e);
          this.isPosting = false;
          this.$message.error(`服务器似乎出现了一点问题`);
        }
        if (res.error !== '') {
          this.$message.error(res.error);
        } else {
          this.$message.success('上传结果成功');
        }
        this.isPosted = true;
      }
      this.isPosting = false;
    }
  },
}
</script>

<style scoped lang="scss">
  .qp-header-container {
    position: sticky;
    top: 70px;
    z-index: 10;
    overflow-y: visible !important;
  }

  .qp-header {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    margin: -6px 0;
    margin-bottom: -10px;
  }

  .qp-left {
    width: 30%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .qp-right {
    width: 60%;
  }

  .qp-opts {
    display: flex;
    justify-content: space-between;
  }

  .qp-idx {
    position: relative;
    font-weight: bold;
    font-size: 2.5rem;
    z-index: 1;

    &:before {
      content: "";
      position: absolute;
      background: rgb(220 235 247);
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
      z-index: -1;
      left: -.8rem;
      top: -.5rem;
    }
  }

  .qp-block {
    display: flex;
    align-items: center;

    p {
      margin: 0;
      margin-right: 2rem;
      font-size: 1.5rem;
      font-weight: bold;
    }

    &.qp-sld {
      justify-content: flex-end;
    }
  }

  .qp-select {
    max-width: 140px;
  }

  .qp-text {
    color: grey;
    text-align: center;
    margin: 0;
    margin-top: 10px;

    span {
      margin-left: 8px;
      font-weight: bold;
    }

    .qp-uploaded {
      color: green;
    }

    .qp-not-uploaded {
      color: red;
    }
  }

  .qp-slider {
    min-width: 160px;
  }
</style>
