// 可以自由添加想要的测试部分，但是记得在describe前面写好测试相关信息 

const AXIOS = require('axios')

// 测试人员：韩子勤
// 编写日期：20211009
// 编写目的：对普通用户的试题检索进行测试
describe('试题检索测试', function() {
  
    // 正常检索，即和平时测试一样，单纯的搜一个三角形，剩下的什么也不加
    it("试题检索测试 - Part1 - 正常检索", function(){
      let P =  new Promise(function(resolve) {
        AXIOS({
          url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/search',
          method: 'post',
          data: {
            "data": JSON.stringify({
              "content": "三角形",
              "size": 5,
              "database": ['public'],
              "page_count": 1,
              "subject": [],
              "period": [],
              "type": [],
              "difficulty": [0.0, 1.0],
              "semantic": 0
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
          let Data = response.data
          if(Data.results.length > 0){
            resolve("正常检索 - 成功")
          }
          else{
            resolve("正常检索 - 返回值出现问题，需要单独检查")
          }
        })
        .catch(function () {
          resolve("正常检索 - 返回值出现问题，需要单独检查");
        });
      });
      return P.then(function(code) {
        expect(code).toBe("正常检索 - 成功");
      });
    })

    // 学科检索，除了搜一个三角形以外，添加学科是数学和英语的限制，并检测是否返回结果中的所有值都是数学或英语题目
    it("试题检索测试 - Part2 - 学科检索（数学和英语）", function(){
        let P =  new Promise(function(resolve) {
          AXIOS({
            url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/search',
            method: 'post',
            data: {
              "data": JSON.stringify({
                "content": "三角形",
                "size": 5,
                "database": ['public'],
                "page_count": 1,
                "subject": ["数学", "英语"],
                "period": [],
                "type": [],
                "difficulty": [0.0, 1.0],
                "semantic": 0
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
            let Data = response.data
            if(Data.results.length > 0){
                let Check_Flag = true
                for(let i = 0; i < Data.results.length; i++){
                    if(["数学", "英语"].indexOf(Data.results[i].subject) != -1){
                        continue
                    }else{
                        Check_Flag = false
                    }
                }
                if(Check_Flag){
                    resolve("学科检索 - 成功")
                }else{
                    resolve("学科检索 - 出现数学和英语学科之外的题目")
                }
            }
            else{
              resolve("学科检索 - 检索返回的题目数量为0")
            }
          })
          .catch(function () {
            resolve("学科检索 - 返回值出现问题，需要单独检查");
          });
        });
        return P.then(function(code) {
          expect(code).toBe("学科检索 - 成功");
        });
      })

    // 学段检索，除了搜一个三角形以外，添加学段是高中的限制，并检测是否返回结果中的所有学段都是高中
    it("试题检索测试 - Part3 - 学段检索（高中）", function(){
        let P =  new Promise(function(resolve) {
          AXIOS({
            url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/search',
            method: 'post',
            data: {
              "data": JSON.stringify({
                "content": "三角形",
                "size": 5,
                "database": ['public'],
                "page_count": 1,
                "subject": [],
                "period": ["高中"],
                "type": [],
                "difficulty": [0.0, 1.0],
                "semantic": 0
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
            let Data = response.data
            if(Data.results.length > 0){
                let Check_Flag = true
                for(let i = 0; i < Data.results.length; i++){
                    if(["高中"].indexOf(Data.results[i].period) != -1){
                        continue
                    }else{
                        Check_Flag = false
                    }
                }
                if(Check_Flag){
                    resolve("学段检索 - 成功")
                }else{
                    resolve("学段检索 - 出现了高中学段以外的题目")
                }
            }
            else{
              resolve("学段检索 - 检索返回的题目数量为0")
            }
          })
          .catch(function () {
            resolve("学段检索 - 返回值出现问题，需要单独检查");
          });
        });
        return P.then(function(code) {
          expect(code).toBe("学段检索 - 成功");
        });
      })

    // 题型检索，除了搜一个三角形以外，添加题型是填空题的限制，并检测是否返回结果中的所有题型标签都是填空题
    it("试题检索测试 - Part4 - 题型检索（填空题）", function(){
        let P =  new Promise(function(resolve) {
          AXIOS({
            url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/search',
            method: 'post',
            data: {
              "data": JSON.stringify({
                "content": "三角形",
                "size": 5,
                "database": ['public'],
                "page_count": 1,
                "subject": [],
                "period": [],
                "type": ["填空题"],
                "difficulty": [0.0, 1.0],
                "semantic": 0
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
            let Data = response.data
            if(Data.results.length > 0){
                let Check_Flag = true
                for(let i = 0; i < Data.results.length; i++){
                    if(["填空题"].indexOf(Data.results[i].type) != -1){
                        continue
                    }else{
                        Check_Flag = false
                    }
                }
                if(Check_Flag){
                    resolve("题型检索 - 成功")
                }else{
                    resolve("题型检索 - 出现了填空题以外的题型")
                }
            }
            else{
              resolve("题型检索 - 检索返回的题目数量为0")
            }
          })
          .catch(function () {
            resolve("题型检索 - 返回值出现问题，需要单独检查");
          });
        });
        return P.then(function(code) {
          expect(code).toBe("题型检索 - 成功");
        });
      })

      // 同时在这个过程中，我们也要检测题目的返回关键字段格式是否与我们想要的一致，或者说是否有变动。
    it("试题检索测试 - Part5 - 返回值关键字比对", function(){
      let P =  new Promise(function(resolve) {
        AXIOS({
          url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/search',
          method: 'post',
          data: {
            "data": JSON.stringify({
              "content": "三角形",
              "size": 5,
              "database": ['public'],
              "page_count": 1,
              "subject": [],
              "period": [],
              "type": [],
              "difficulty": [0.0, 1.0],
              "semantic": 0
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
          let Data = response.data
          let Error_Msg = ""
          let Key_Hope = {
            "analysis": "string", 
            "answer": "string", 
            "database": "string", 
            "id": "string", 
            "options": "object", 
            "period": "string", 
            "stem": "string", 
            "subject": "string", 
            "type": "string",
            "difficulty": "number"
          }
          if(typeof(Data.totalLength) != 'number'){
            resolve("返回值关键字比对 - 返回的试题总量数据异常")
          }

          let Key_Wait = Object.keys(Data.results[0])

          if(Key_Wait.length !=  Object.keys(Key_Hope).length){
            resolve("返回值关键字比对 - 题目的关键字数量不一致")
          }else{
              let Check_Flag = true
              for(let i = 0; i < Key_Wait.length; i++){
                  if(Key_Wait[i] != 'difficulty' && Object.keys(Key_Hope).indexOf(Key_Wait[i]) != -1 && Key_Hope[Key_Wait[i]] == typeof(Data.results[0][Key_Wait[i]])){
                      continue
                  }else if(Key_Wait[i] != 'difficulty'){
                      Error_Msg = Error_Msg + Key_Wait[i] + "的格式不正确或者这是一个新返回的关键字\n"
                      Check_Flag = false
                  }
              }
              if(Check_Flag){
                  resolve("返回值关键字比对 - 成功")
              }else{
                  resolve("返回值关键字比对 - 题目中出现与期望名称或返回格式不一致的关键字，请检查以下字段：\n" + Error_Msg)
              }
          }
        })
        .catch(function () {
          resolve("返回值关键字比对 - 返回值出现问题，需要单独检查");
        });
      });
      return P.then(function(code) {
        expect(code).toBe("返回值关键字比对 - 成功");
      });
    })
  
  });

// 测试人员：韩子勤
// 编写日期：20211009
// 编写目的：对普通用户的试卷检索进行测试
describe('试卷检索测试', function() {
  
    // 正常检索，即和平时测试一样，单纯的搜一个三角形，剩下的什么也不加
    it("试卷检索测试 - Part1 - 正常检索", function(){
      let P =  new Promise(function(resolve) {
        AXIOS({
          url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/search_paper',
          method: 'post',
          data: {
            "data": JSON.stringify({
                "content": "唐代",
                "size": 5,
                "database": ['public'],
                "page_count": 1,
                "subject": [],
                "period": []
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
          let Data = response.data
          if(Data.question_list.length > 0){
            resolve("正常检索 - 成功")
          }
          else{
            resolve("正常检索 - 返回值出现问题，需要单独检查")
          }
        })
        .catch(function () {
          resolve("正常检索 - 返回值出现问题，需要单独检查");
        });
      });
      return P.then(function(code) {
        expect(code).toBe("正常检索 - 成功");
      });
    })

    // 学科检索，除了搜一个三角形以外，添加学科是数学和英语的限制，并检测是否返回结果中的所有值都是数学或英语题目
    it("试卷检索测试 - Part2 - 学科检索（数学和英语）", function(){
        let P =  new Promise(function(resolve) {
          AXIOS({
            url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/search_paper',
            method: 'post',
            data: {
              "data": JSON.stringify({
                "content": "三角形",
                "size": 5,
                "database": ['public'],
                "page_count": 1,
                "subject": ["数学", "英语"],
                "period": []
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
            let Data = response.data
            if(Data.question_list.length > 0){
                let Check_Flag = true
                for(let i = 0; i < Data.question_list.length; i++){
                    if(["数学", "英语"].indexOf(Data.question_list[i].subject) != -1){
                        continue
                    }else{
                        Check_Flag = false
                    }
                }
                if(Check_Flag){
                    resolve("学科检索 - 成功")
                }else{
                    resolve("学科检索 - 出现数学和英语学科之外的试卷")
                }
            }
            else{
              resolve("学科检索 - 检索返回的试卷数量为0")
            }
          })
          .catch(function () {
            resolve("学科检索 - 返回值出现问题，需要单独检查");
          });
        });
        return P.then(function(code) {
          expect(code).toBe("学科检索 - 成功");
        });
      })

    // 学段检索，除了搜一个三角形以外，添加学段是高中的限制，并检测是否返回结果中的所有学段都是高中
    it("试题检索测试 - Part3 - 学段检索（高中）", function(){
        let P =  new Promise(function(resolve) {
          AXIOS({
            url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/search_paper',
            method: 'post',
            data: {
              "data": JSON.stringify({
                "content": "三角形",
                "size": 5,
                "database": ['public'],
                "page_count": 1,
                "subject": [],
                "period": ["高中"]
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
            let Data = response.data
            if(Data.question_list.length > 0){
                let Check_Flag = true
                for(let i = 0; i < Data.question_list.length; i++){
                    if(["高中"].indexOf(Data.question_list[i].period) != -1){
                        continue
                    }else{
                        Check_Flag = false
                    }
                }
                if(Check_Flag){
                    resolve("学段检索 - 成功")
                }else{
                    resolve("学段检索 - 出现了高中学段以外的试卷")
                }
            }
            else{
              resolve("学段检索 - 检索返回的题目数量为0")
            }
          })
          .catch(function () {
            resolve("学段检索 - 返回值出现问题，需要单独检查");
          });
        });
        return P.then(function(code) {
          expect(code).toBe("学段检索 - 成功");
        });
      })

    // 同时在这个过程中，我们也要检测搜索试卷的返回关键字段格式是否与我们想要的一致，或者说是否有变动。
    it("试题检索测试 - Part4 - 返回值关键字比对", function(){
        let P =  new Promise(function(resolve) {
          AXIOS({
            url: 'https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/search_paper',
            method: 'post',
            data: {
                "data": JSON.stringify({
                    "content": "三角形",
                    "size": 5,
                    "database": ['public'],
                    "page_count": 1,
                    "subject": [],
                    "period": []
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
            let Data = response.data
            let Error_Msg = ""
            let Key_Hope = {
              "paper_id_list": "object", 
              "paper_title_list": "object", 
              "question_list": "object", 
              "totalLength": "number"}
            let Key_Wait = Object.keys(Data)
            if(Key_Wait.length != Object.keys(Key_Hope).length){
                resolve("返回值关键字比对 - 关键字数量不一致")
            }else{
                let Check_Flag = true
                for(let i = 0; i < Key_Wait.length; i++){
                    if(Object.keys(Key_Hope).indexOf(Key_Wait[i]) != -1 && Key_Hope[Key_Wait[i]] == typeof(Data[Key_Wait[i]])){
                        continue
                    }else{
                      Error_Msg = Error_Msg + Key_Wait[i] + "的格式不正确或者这是一个新返回的关键字\n"
                      Check_Flag = false
                    }
                }
                if(Check_Flag){
                    resolve("返回值关键字比对 - 成功")
                }else{
                    resolve("返回值关键字比对 - 题目中出现与期望名称或返回格式不一致的关键字，请检查以下字段：\n" + Error_Msg)
                }
            }
          })
          .catch(function () {
            resolve("返回值关键字比对 - 返回值出现问题，需要单独检查");
          });
        });
        return P.then(function(code) {
          expect(code).toBe("返回值关键字比对 - 成功");
        });
      })
  
  });