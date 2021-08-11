function getOptionIndex (text) {
  const regexp = /A((?!A[.,、，]).)*B.*?C.*D/;
  const match = regexp.exec(text);
  if (match !== null) {
    return match.index;
  } else {
    return -1;
  }
}

function getStem (text) {
  const optionIndex = getOptionIndex(text);
  const answerIndex = text.search('答案');
  const analysisIndex = text.search('解析');
  let para = '';
  if (optionIndex > 0) {
    para = text.slice(0, optionIndex);
  } else if (answerIndex > 0 || analysisIndex > 0) {
    para = text.slice(0, Math.min(answerIndex, analysisIndex));
  } else {
    para = text.slice(0, text.length);
  }
  return para;
}

function getOption (text) {
  const optionIndex = getOptionIndex(text);
  const answerIndex = text.search('答案');
  const analysisIndex = text.search('解析');
  let para = '';
  if (optionIndex < 0) {
    para = '""';
  } else if (analysisIndex > answerIndex && answerIndex > 0) {
    para = text.slice(optionIndex, answerIndex);
  } else if (answerIndex > analysisIndex && analysisIndex > 0) {
    para = text.slice(optionIndex, analysisIndex);
  } else {
    para = text.slice(optionIndex, text.length);
  }
  return para;
}

function getAnswer (text) {
  const answerIndex = text.search('答案');
  const analysisIndex = text.search('解析');
  let para = '';
  if (answerIndex < 0) {
    para = '""';
  } else if (answerIndex < analysisIndex) {
    para = text.slice(answerIndex, analysisIndex);
  } else {
    para = text.slice(answerIndex, text.length);
  }
  return para;
}

function getAnalysis (text) {
  const answerIndex = text.search('答案');
  const analysisIndex = text.search('解析');
  let para = '';
  if (analysisIndex < 0) {
    para = '""';
  } else if (analysisIndex < answerIndex) {
    para = text.slice(analysisIndex, answerIndex);
  } else {
    para = text.slice(analysisIndex, text.length);
  }
  return para;
}

export function extract (text) {
  const stem = getStem(text);
  const option = getOption(text);
  const answer = getAnswer(text);
  const analysis = getAnalysis(text);
  let result = { 题干: stem, 选项: option, 答案: answer, 解析: analysis };
  return result;
}
