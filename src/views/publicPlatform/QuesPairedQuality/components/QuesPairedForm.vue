<template>
  <div class="qp-form-container">
    <div class="qp-form-single">
      <p>学科</p>
      <el-button-group>
        <el-button size="medium" @click="selected.subject = subject.value" :type="selected.subject === subject.value ? `primary` : null" :key="subject.label" v-for="subject in subjectList">{{ subject.label}}</el-button>
      </el-button-group>
    </div>

    <div class="qp-form-single">
      <p>题型</p>
      <el-button-group>
        <el-button size="medium" @click="selected.questionType = question.value" :type="selected.questionType === question.value ? `primary` : null" :key="question.label" v-for="question in questionTypes">{{ question.label}}</el-button>
      </el-button-group>
    </div>


    <div class="qp-form-single">
      <p>学段</p>
      <el-button-group>
        <el-button size="medium" @click="selected.period = period.value" :type="selected.period === period.value ? `primary` : null" :key="period.label" v-for="period in periodList">{{ period.label}}</el-button>
      </el-button-group>
    </div>

    <div class="qp-form-single">
      <p>试题库</p>
      <el-button-group>
        <el-button size="medium" @click="selected.questionDatabase = database.value" :type="selected.questionDatabase === database.value ? `primary` : null" :key="database.label" v-for="database in questionDatabases">{{ database.label}}</el-button>
      </el-button-group>
    </div>

    <div class="qp-form-single">
      <p>题库类别</p>
      <el-button-group>
        <el-button size="medium" @click="selected.isTest = !!database.value" :type="selected.isTest === !!database.value ? `primary` : null" :key="database.label" v-for="database in testDatabases">{{ database.label}}</el-button>
      </el-button-group>
    </div>

  </div>
</template>

<script>
import {periodList, questionTypes, subjectList, questionDatabases, testDatabases} from '../data';

export default {
  name: 'Form',
  props: {
    selected: Object,
  },
  data() {
    return {
      subjectList,
      periodList,
      questionTypes,
      questionDatabases,
      testDatabases,
    }
  }
}
</script>

<style scoped lang="scss">
.qp-form-container {

}

.qp-form-single {
  >p {
    font-size: 1.4rem;
    margin: 0;
    margin-top: 15px;
    margin-bottom: 4px;
  }
}

</style>
