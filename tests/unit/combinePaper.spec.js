// 可以自由添加想要的测试部分，但是记得在describe前面写好测试相关信息 

const AXIOS = require('axios')

jest.setTimeout(30000)

// 测试人员：韩子勤
// 编写日期：20211010
// 编写目的：对组卷过程中用到的一些小型服务做测试
// 针对于获取试卷后的一些内容，放到试卷分析的单元测试那边去做
// 针对于获取试题后的一些内容，放到资源检索，试题相关的那边去做，毕竟数据的返回底子是同一层，避免重复测试同样的内容
describe('组卷服务测试', function() {
  
    // 检查获取知识树的服务是否正常
    it("组卷服务测试 - Part1 - 获取知识树", function(){
      let P =  new Promise(function(resolve) {
        AXIOS({
          url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/getKnowledgeSystem',
          method: 'post',
          data: {
            "system": "tiku",
            "subject": "数学",
            "period": "高中"
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
            resolve("组卷服务测试 - 知识树获取成功")
          }else{
            resolve("组卷服务测试 - 知识树获取出现通信故障，错误代码" + response.status)
          }
        })
        .catch(function () {
          resolve("组卷服务测试 - 知识树获取失败");
        });
      });
      return P.then(function(code) {
        expect(code).toBe("组卷服务测试 - 知识树获取成功");
      });
    })

    // 检查双向细目表组卷的返回结果是否正常
    it("组卷服务测试 - Part2 - 双向细目表", function(){
      let P =  new Promise(function(resolve) {
        AXIOS({
          url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/detail_table_generate',
          method: 'post',
          data: {
            "detail_table": JSON.stringify([
              {
                "database": ["public"],
                "score": 5,
                "subject": ["数学"],
                "period": ["高中"],
                "difficulty": [0, 1],
                "type": ["单选题"],
                "knowledge": {}
              }
            ], null, 4)
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
            let Data = response.data
            if(Data.length != 1){
              resolve("组卷服务测试 - 双向细目表检索到的题目数量与期望数量不一致")
            }else{
              resolve("组卷服务测试 - 双向细目表获取试题成功")
            }
          }else{
            resolve("组卷服务测试 - 双向细目表获取试题出现通信故障，错误代码" + response.status)
          }
        })
        .catch(function () {
          resolve("组卷服务测试 - 双向细目表获取试题失败");
        });
      });
      return P.then(function(code) {
        expect(code).toBe("组卷服务测试 - 双向细目表获取试题成功");
      });
    })

    // 检查试卷搜索的返回结果是否正常
    it("组卷服务测试 - Part3 - 试卷搜题", function(){
      let P =  new Promise(function(resolve) {
        AXIOS({
          url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/paperJsonGet',
          method: 'post',
          data: {
            "Database_Name": "LUNA",
            "Paper_ID": "19e548ca-8b0c-11eb-b813-b46bfc50aa29"
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
            let Data = response.data.Paper_Json
            if(Data.status == "FAIL"){
              resolve("组卷服务测试 - 试卷详情获取失败")
            }else{
              if(Data.sub_question.length == 0){
                resolve("组卷服务测试 - 试卷题目获取失败")
              }else{
                resolve("组卷服务测试 - 试卷题目获取成功")
              }
            }
          }else{
            resolve("组卷服务测试 - 获取试卷的过程出现通信故障，错误代码" + response.status)
          }
        })
        .catch(function () {
          resolve("组卷服务测试 - 试卷详情获取的过程出现错误");
        });
      });
      return P.then(function(code) {
        expect(code).toBe("组卷服务测试 - 试卷题目获取成功");
      });
    })

    // 检查试卷搜索的返回结果是否正常
    it("组卷服务测试 - Part4 - 组卷分析报告", function(){
      let P =  new Promise(function(resolve) {
        AXIOS({
          url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/combinePaperAnalyseReport',
          method: 'post',
          data: {
            "Paper_Data": JSON.stringify({
              subject: "数学",
              title: "测试用标题",
              data: [
                {
                  is_longques: 2,
                  desc: "单选题",
                  content: [
                    {
                      score: 5,
                      stem: "1+1",
                      options: ["1", "2", "3", "4"],
                      answer: "2",
                      analysis: ""
                    }
                  ]
                }
              ]
            })
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
            let Data = response.data
            if(Data.status == "FAIL"){
              resolve("组卷服务测试 - 获取组卷分析报告失败")
            }else{
              resolve("组卷服务测试 - 获取组卷分析报告成功")
            }
          }else{
            resolve("组卷服务测试 - 获取组卷分析报告的过程出现通信故障，错误代码" + response.status)
          }
        })
        .catch(function () {
          resolve("组卷服务测试 - 获取组卷分析报告的过程出现错误");
        });
      });
      return P.then(function(code) {
        expect(code).toBe("组卷服务测试 - 获取组卷分析报告成功");
      });
    })
  
  });

  // 测试试卷ID 19e548ca-8b0c-11eb-b813-b46bfc50aa29
  // 测试试卷名称 2017年全国统一高考数学试卷（理科）（新课标ⅰ）（含解析版）
  // commonAjax(this.backendIP+'/api/paperJsonGet',
  //       {
  //         Database_Name: "LUNA",
  //         Paper_ID:ID
  //       }
  //     ).then((data)=>{
  //       this.Question_Analysing = false;
  //       if(data.Paper_Json.status == "FAIL"){
  //         this.$message.error("服务器繁忙，请稍后再试。")
  //         return
  //       }
  //       this.Paper_Cache_ID = ID;
  //       sessionStorage.PaperDetailShow = JSON.stringify(data.Paper_Json);
  //       sessionStorage.PaperJson = JSON.stringify(data.Paper_Json);
  //       let routeData = this.$router.resolve({ path: '/paperAnalyse' });
  //       window.open(routeData.href, '_blank');
  //       this.$message.success("试题详情内容已在新页面展开。");
  //     })
