<template>
  <el-form label-position="left" label-width="80px" :model="pdForm">
    <el-form-item label="学段">
      <el-select v-model="pdForm.period">
        <el-option v-for="period in periodList"
                   :key="period.value"
                   :label="period.label"
                   :value="period.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="科目">
      <el-select v-model="pdForm.subject">
        <el-option v-for="subject in subjectList"
                   :key="subject.value"
                   :value="subject.value"
                   :label="subject.label"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="试卷标题">
      <el-input v-model="pdForm.title" placeholder="请输入试卷标题信息" />
    </el-form-item>
    <el-form-item label="文件名称">
      <el-input v-model="pdForm.fileName"
                type="textarea"
                :rows="2"
                placeholder="请输入上传文件名称"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { subjectList, periodList } from '../data';

export default {
  name: 'PaperdivideForm',
  model: {
    prop: 'pdForm',
    event: 'formOnChange',
  },
  props: {
    pdForm: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      subjectList,
      periodList,
    };
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 38px;
}

.el-form-item:last-child {
    margin-bottom: 0;
  }

</style>
