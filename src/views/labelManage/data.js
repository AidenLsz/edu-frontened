export const subjectList = [
  { value: 2, label: "英语" },
  { value: 1, label: "数学" },
  { value: 3, label: "历史" },
  { value: 4, label: "政治" },
  { value: 5, label: "物理" },
  { value: 6, label: "化学" },
  { value: 7, label: "生物" },
  { value: 8, label: "语文" },
  { value: 9, label: "地理" },
  { value: 0, label: "其他" },
];

// 数据切分调用 subject list 有一个映射关系
export const paperDivideSubjectList = [
  { subject: 2, paper_type: 0, label: '英语' },
  { subject: 1, paper_type: 1, label: '数学' },
  { subject: [3, 4, 9], paper_type: 2, label: '文综'},
  { subject: [5, 6, 7], paper_type: 3, label: '理综'},
  { subject: 8, paper_type: 4, label: '语文'}
];

export function getPaperType(subject_id) {
  return paperDivideSubjectList.find((ele) => {
    if ( typeof ele.subject === 'number') {
      return ele.subject === subject_id;
    } else {
      return ele.subject.indexOf(subject_id) !== -1;
    }
  }).paper_type;
}

export const periodList = [
  { value: 5, label: "小学" },
  { value: 1, label: "初中" },
  { value: 2, label: "高中" },
  { value: 3, label: "大学" },
  { value: 4, label: "成人" },
  { value: 0, label: "其他" }
];

export const questionTypes = [{
    value: 0,
    label: '其他',
  }, {
    value: 1,
    label: '多选题',
  }, {
    value: 2,
    label: '填空题'
  }, {
    value: 3,
    label: '判断题'
  }, {
    value: 4,
    label: '简答题'
  }, {
    value: 5,
    label: '计算题',
  }, {
    value: 6,
    label: '单选题',
  }, {
    value: 7,
    label: '选择题',
  }, {
    value: 8,
    label: '非选择题'
  }, {
    value: 9,
    label: '材料分析题',
  }, {
    value: 10,
    label: '作文题',
  }, {
    value: 11,
    label: '作图题'
  }, {
    value: 12,
    label: '听力题'
  }];

export const eventList = {
  fileChange: 'paper-divide-file-change',
  reset: 'paper-divide-reset',
  reorder: 'paper-divide-reorder',
  submit: 'paper-divide-submit',
  downloadJSON: 'paper-divide-downloadJSON',
};
