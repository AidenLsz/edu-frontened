// 可以自由添加想要的测试部分，但是记得在describe前面写好测试相关信息 

const AXIOS = require('axios')

jest.setTimeout(60000)

// 测试人员：韩子勤
// 编写日期：20211021
// 编写目的：对试题分析报告的获取进行测试
describe('试题分析报告测试', function() {
  
    // 正常检索，单纯的拿一份试题分析报告回来
    it("试题分析报告测试 - Part1 - 正常检索", function(){
      let P =  new Promise(function(resolve) {
        AXIOS({
          url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/questionAnalyse',
          method: 'post',
          data: {
            databasename: "public",
            ID: "801141dc-e4b2-11eb-9cc0-d46a6a0f329c"
          },
          transformRequest: [function (data) {
            var oMyForm = new FormData();
            let List = Object.keys(data);
            for(let i = 0; i < List.length; i++){
              oMyForm.append(List[i], data[List[i]])
            }
            return oMyForm;
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(function () {
            // let Report = response.data.que_dic
            resolve("正常检索 - 成功")
        })
        .catch(function () {
          resolve("正常检索 - 返回值出现问题，需要单独检查");
        });
      });
      return P.then(function(code) {
        expect(code).toBe("正常检索 - 成功");
      });
    })

    // 正常检索，然后看一下里面的关键字是不是分析报告都要用到的关键字
    // 试题本身那部分的关键字应该和试题检索那边是一样的，可以查也可以不查，反正看显示结果就能知道
    // 而且属于固定格式的项目，应该不会有变动，否则数据库那边要大乱套了
    it("试题分析报告测试 - Part2 - 关键字检查", function(){
        let P =  new Promise(function(resolve) {
          AXIOS({
            url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/questionAnalyse',
            method: 'post',
            data: {
              databasename: "public",
              ID: "801141dc-e4b2-11eb-9cc0-d46a6a0f329c"
            },
            transformRequest: [function (data) {
              var oMyForm = new FormData();
              let List = Object.keys(data);
              for(let i = 0; i < List.length; i++){
                oMyForm.append(List[i], data[List[i]])
              }
              return oMyForm;
            }],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then(function (response) {
              let Report = response.data.que_dic
              let Error_Msg = ""
            //   let Key_Wait = Object.keys(Report)
                let Key_Hope = {
                    "difficulty": "string",
                    "chapter": "string",
                    "discrimination": "string",
                    "rel": "string",
                    "literacy": "string",
                    "pastpaper": "string",
                    "que_type": "string",
                    "subject": "string",
                    "period": "string",
                    "knowledge_points_frontend": "object"
                }
                let Key_Hope_List = Object.keys(Key_Hope)
                let Check_Flag = true
                for(let i = 0; i < Key_Hope_List.length; i++){
                    if(Key_Hope[Key_Hope_List[i]] == typeof(Report[Key_Hope_List[i]])){
                        continue
                    }else{
                        Error_Msg = Error_Msg 
                            + Key_Hope_List[i] + "的格式为" 
                            + typeof(Report[Key_Hope_List[i]]) 
                            + "而不是" + Key_Hope[Key_Hope_List[i]] + "\n"
                        Check_Flag = false
                    }
                }
                if(Check_Flag){
                    resolve("返回值关键字比对 - 成功")
                }else{
                    resolve("返回值关键字比对 - 题目中出现与期望返回格式不一致的关键字，请检查以下字段：\n" + Error_Msg)
                }
          })
          .catch(function () {
            resolve("正常检索 - 返回值出现问题，需要单独检查");
          });
        });
        return P.then(function(code) {
          expect(code).toBe("返回值关键字比对 - 成功");
        });
      })
  
  });

// 测试人员：韩子勤
// 编写日期：20211021
// 编写目的：对试题分析报告的获取进行测试
describe('试卷分析报告测试', function() {
  
    // 如果获取和关键字分开两次的话好像有点卡……所以关键字挤到这里来好了……
    // 主要还是获取分析报告这个本身需要一点时间来跑……
    // 正常检索，然后看一下里面的关键字是不是分析报告都要用到的关键字，或者格式是不是统一
    // 具体的计算就不用了，毕竟数据内容不对不是前端的问题，我们需要检测的是自己拿到的数据格式是不是和用到的部分一致
    it("试题分析报告测试 - Part1 - 获取已有试卷的分析报告", function(){
        let P =  new Promise(function(resolve) {
            AXIOS({
                url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/paperJsonGet',
                method: 'post',
                data: {
                  Database_Name: "LUNA",
                  Paper_ID: "19e548ca-8b0c-11eb-b813-b46bfc50aa29"
                },
                transformRequest: [function (data) {
                  var oMyForm = new FormData();
                  let List = Object.keys(data);
                  for(let i = 0; i < List.length; i++){
                    oMyForm.append(List[i], data[List[i]])
                  }
                  return oMyForm;
                }],
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              })
          .then(function (response) {
              let Report = response.data.Paper_Json
              let Error_Msg = ""
                let Key_Hope = {
                    "title": "string",
                    // 题包，每道大题下面的关键字之后也要查一下
                    "sub_question": "object",
                    // mean std max min，看显示结果即可，格式是数字或者字符串都不重要，显示出来没区别
                    "difficulty_statistics": "object",
                    "discrimination_statistics": "object",
                    "reliability_statistics": "object",
                    // 第一部分 - 知识点分析
                    // 整卷难度分布和知识点分数分布
                    "knowledge2score": "object",
                    "knowledge2difficulty": "object",
                    // 知识点对
                    "knowledge_knowledge2num": "object",
                    // 覆盖率 - 全部1级知识点和此题包含的1级知识点
                    "all_level_one_knowledge_point": "object",
                    "level_one_knowledge_point": "object",
                    // 第二部分 - 难度分析
                    // 难度区间
                    "difficulty_area_score": "object",
                    // 难度波动
                    // 是用的sub_question下面单题的难度拼起来的，没有专门的关键字
                    // 第三部分 - 双向细目表，也是逐题塞到数据里面然后拼出来的，没有其他关键字
                }
                let Key_Hope_List = Object.keys(Key_Hope)
                let Check_Flag = true
                for(let i = 0; i < Key_Hope_List.length; i++){
                    if(Key_Hope[Key_Hope_List[i]] == typeof(Report[Key_Hope_List[i]])){
                        continue
                    }else{
                        Error_Msg = Error_Msg 
                            + Key_Hope_List[i] + "的当前格式为" 
                            + typeof(Report[Key_Hope_List[i]]) 
                            + "而不是" + Key_Hope[Key_Hope_List[i]] + "\n"
                        Check_Flag = false
                    }
                }

                if(!Check_Flag){
                    resolve("返回值关键字比对 - 试卷分析报告的最外层中出现与期望返回格式不一致的关键字，请检查以下字段：\n" + Error_Msg)
                    return
                }

                let Key_Hope_Sub = {
                    "sub_question": "object",
                    "knowledge2score": "object",
                    "knowledge2difficulty": "object",
                    "knowledge_knowledge2num": "object",
                    "reliability_statistics": "object",
                    "discrimination_statistics": "object",
                    "difficulty_statistics": "object",
                }
                let Key_Hope_Sub_List = Object.keys(Key_Hope_Sub)
                let Report_Sub = Report.sub_question[0]
                for(let i = 0; i < Key_Hope_Sub_List.length; i++){
                    if(Key_Hope_Sub[Key_Hope_Sub_List[i]] == typeof(Report_Sub[Key_Hope_Sub_List[i]])){
                        continue
                    }else{
                        Error_Msg = Error_Msg 
                            + Key_Hope_Sub_List[i] + "的当前格式为" 
                            + typeof(Report_Sub[Key_Hope_Sub_List[i]]) 
                            + "而不是" + Key_Hope_Sub[Key_Hope_Sub_List[i]] + "\n"
                        Check_Flag = false
                    }
                }

                if(!Check_Flag){
                    resolve("返回值关键字比对 - 试卷分析报告的大题题包层出现与期望返回格式不一致的关键字，请检查以下字段：\n" + Error_Msg)
                    return
                }

                let Report_Sub_0 = Report_Sub.sub_question[0]
                let Key_Hope_Bundle = {
                    "type": "string",
                    "difficulty": "number",
                    "discrimination": "number",
                    "reliability": "number",
                    "literacy": "string",
                    "knowledge_points_frontend": "object",
                    "score": "number"
                }
                let Key_Hope_Bundle_List = Object.keys(Key_Hope_Bundle)
                for(let i = 0; i < Key_Hope_Bundle_List.length; i++){
                    if(Key_Hope_Bundle[Key_Hope_Bundle_List[i]] == typeof(Report_Sub_0[Key_Hope_Bundle_List[i]])){
                        continue
                    }else{
                        Error_Msg = Error_Msg 
                            + Key_Hope_Bundle_List[i] + "的当前格式为" 
                            + typeof(Report_Sub_0[Key_Hope_Bundle_List[i]]) 
                            + "而不是" + Key_Hope_Bundle[Key_Hope_Bundle_List[i]] + "\n"
                        Check_Flag = false
                    }
                }

                if(!Check_Flag){
                    resolve("返回值关键字比对 - 试卷分析报告的题包中的题目出现与期望返回格式不一致的关键字，请检查以下字段：\n" + Error_Msg)
                    return
                }

                if(typeof(Report_Sub_0.knowledge_points_frontend.kp_layer) != 'object'){
                    Check_Flag = false
                }

                if(!Check_Flag){
                    resolve("返回值关键字比对 - 试卷分析报告的题包中的题目的难度部分出现与期望返回格式不一致的问题。")
                    return
                }

                resolve("返回值关键字比对 - 成功")
          })
          .catch(function () {
            resolve("正常检索 - 返回值出现问题，需要单独检查");
          });
        });
        return P.then(function(code) {
          expect(code).toBe("返回值关键字比对 - 成功");
        });
      })

    // 正常检索，获取一份组卷的分析报告回来
    it("试卷分析报告测试 - Part2 - 正常检索获得的试卷", function(){
        let Data = {
            subject: "数学",
            title: "单元测试的数据样本，请无视",
            data: [
                {
                    is_longques: 2,
                    desc: "单选题",
                    content: [
                        {
                            score: 5,
                            stem: "1+1",
                            options: ["1", "2", "3", "4"],
                            answer: "B",
                            analysis: "1+1=2"
                        }
                    ]
                }
            ]
        }
        let P =  new Promise(function(resolve) {
          AXIOS({
            url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/combinePaperAnalyseReport',
            method: 'post',
            data: {
                Paper_Data: JSON.stringify(Data)
            },
            transformRequest: [function (data) {
              var oMyForm = new FormData();
              let List = Object.keys(data);
              for(let i = 0; i < List.length; i++){
                oMyForm.append(List[i], data[List[i]])
              }
              return oMyForm;
            }],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then(function (response) {
            if(response.status == 200){
                resolve("获取组卷分析报告 - 成功")
            }else{
                resolve("获取组卷分析报告 - 失败，可能是服务出现异常。")
            }
          })
          .catch(function () {
            resolve("获取组卷分析报告 - 失败，可能是服务器出现故障。");
          });
        });
        return P.then(function(code) {
          expect(code).toBe("获取组卷分析报告 - 成功");
        });
      })

  });
