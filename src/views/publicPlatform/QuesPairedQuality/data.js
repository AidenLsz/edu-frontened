import {commonAjax} from '../../../common/utils/ajax';

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

export const questionDatabases = [{
  label: "公共题库",
  value: 0,
}, {
  label: "内部题库",
  value: 1,
}];

export const testDatabases = [{
  label: "测试数据库",
  value: 1,
}, {
  label: "正式数据库",
  value: 0,
}]

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
},
// }, {
//   value: 9,
//   label: '材料分析题',
// }, {
//   value: 10,
//   label: '作文题',
// }, {
//   value: 11,
//   label: '作图题'
// }, {
  {
  value: 12,
  label: '听力题'
}];

export const scenarios = [{
  value: 0,
  label: "单元练习题",
}, {
  value: 1,
  label: "期末测试题"
}, {
  value: 2,
  label: "高考题",
}];

export const BASE_REQUEST_URL = "https://kg-edu-backend-44-production.env.bdaa.pro";

export const getQuestionPair = async (page = 1, test=false, size=5) => {
  console.log(test)
  return commonAjax(`${BASE_REQUEST_URL}/api/get_quality_question_pair`, {
    page,
    size,
    test,
  }, "get");
};

export const postQuestionPair = async (question_ID0, question_ID1, better=0, score0=5, score1=5, scenario = 0, test=true) => {
  return commonAjax(`${BASE_REQUEST_URL}/api/submit_quality_label`, {
    question_ID0,
    question_ID1,
    better,
    score0,
    score1,
    scenario,
    test,
  }, "post");
}
