import { shallowMount } from '@vue/test-utils'
// import HelloWorld from '@/components/HelloWorld.vue'
// import statistics from '@/common/components/statistics'
// import Exercise from '@/views/resourceQuery/Exercise'
// import home from '@/views/Home'
import InputMarked from '@/views/resourceInput/InputMarked'

const REQUEST = require('request');
const AXIOS = require('axios')

const message = {
  success: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  info: jest.fn()
}

const MOCKS = {
  '$store': {
    'state': {
      "user": {
        "name": ""
      }
    }
  },
  $message: message,
  $router: {
    push: jest.fn()
  },
  $http: {
    post: jest.fn()
  }
}

jest.setTimeout(30000)

describe('InputMarked.vue', () => {

  const wrapper = shallowMount(InputMarked, {
    propsData: {
    },
    mocks: MOCKS
  })

  it('mounted', () => {
    
    // ‘creat’ 这里只是一个自定义的描述性文字
    
    expect(wrapper.vm.Subject).toEqual('数学');
    expect(wrapper.vm.Get_Type_Button_Class("单选题")).toEqual('typeButton unFocusType');
    // .vm 可以获取当前实例对象，相当于拿到了 vue组件里的 this 对象
    // find()可以匹配各种类型的选择器，类似于选中 DOM, text() 就是获取其中的内容
    // toEqual 是一个断言，判断结果为 ‘title’ 时，通过测试，否则猜测是失败
  });
  // it('async test', () => {
  //   expect(wrapper.vm.Get_User_UUID()).toEqual("SUCCESS");
  // })
})

describe('Web Test', function() {
  it('Test A Direct', function() {
    var p = new Promise(function(resolve) {
      REQUEST('https://www.baidu.com', function() {
        resolve("SUCCESS");
      });
    });
    return p.then(function(status) {
      expect(status).toBe("SUCCESS");
    });
  });

  it("Test B Self Made", function(){
    let P =  new Promise(function(resolve) {
      REQUEST({
        url: "https://www.baidu.com",
        method: "post",
        data: {}
      }, function(err, res) {
        resolve(res.statusCode);
      })
    });
    return P.then(function(code) {
      expect(code).toBe(200);
    });
  })

  it("Test C UUID GET", function(){
    let P =  new Promise(function(resolve) {
      REQUEST({
        url: "https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/getUserUUID",
        method: "post",
        data: {}
      }, function(err, res) {
        if(res.statusCode == 200){
          resolve("SUCCESS");
        }else{
          resolve("FAILED")
        }
      })
    });
    return P.then(function(code) {
      expect(code).toBe("FAILED");
    });
  })

  it("Test D Exercise Test - Axios", function(){
    
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
        resolve(response.status);
      })
      .catch(function (error) {
        resolve(error);
      });
    });
    return P.then(function(code) {
      expect(code).toBe(200);
    });
  })

});


// describe('Exercise.vue', () => {
//   it('mounted', () => {
//     // ‘creat’ 这里只是一个自定义的描述性文字
//     const wrapper = shallowMount(Exercise, {
//       // 通过 mount 生成了一个包裹器，包括了一个挂载组件或 vnode，以及测试该组件或 vnode 的方法
//       propsData: {
//         // title: 'title',
//         // showIcon: true
//       }
//       // 可以带参数，这里我通过 propsData 传递了接口数据
//     })
//     wrapper
//     // expect(wrapper.find('.el-alert__title').text()).toEqual('title');
//     // expect(wrapper.vm.Init_Bar()).toEqual('三角函数');
//     // .vm 可以获取当前实例对象，相当于拿到了 vue组件里的 this 对象
//     // find()可以匹配各种类型的选择器，类似于选中 DOM, text() 就是获取其中的内容
//     // toEqual 是一个断言，判断结果为 ‘title’ 时，通过测试，否则猜测是失败
//   });
// })

