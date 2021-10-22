// 关于如何编写测试流程 - 韩子勤
// 更新日期：2021-09-07

// 引入用于模拟建立页面对象的工具，也可以用mount，但是shallowMount更好一点
import { shallowMount } from '@vue/test-utils'

// 引入想要进行测试的页面或组件
import InputMarked from '@/views/resourceInput/InputMarked'

// 引入request和axios，用于网络通信使用
const REQUEST = require('request');
const AXIOS = require('axios')

// MOCKS变量用于统一指定哪些内容的默认值要怎么判断
// 这是因为this.$xxx.xxx格式的内容在默认情况下，是无法被jest正常识别的
// 所以必须在这里提前进行初始化，才能在之后的测试过程中正常访问这些部分
// 例如常用的，用于显示提示的this.$message.success(信息)，如果不进行初始化，就会导致读取报错而产生测试失败的状况
// 常用的this.$store.state.user.name也是一样的，但由于它是字符串内容，所以需要用字典方式进行初始化
// 当然，由于测试内容本身不会被操作，仅进行代码测试，所以设置的值只要满足测试需求即可

// 注：jest.fn()是固定写法，表示这个部分是一个函数方法

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
  },
}

// 这里用于设定最大超时状况，因为有的时候接口返回信息的时候时长会比较长，可以使用这个属性进行调整
// 如果设定的过短，也可能因为一点网络波动就导致测试失败
// 比如有些服务需要一段时间，就可以根据这个来调整一下，不然会因为超时而失败
// 顺便一提这个好像可以还可以拿来测服务是不是变慢了
jest.setTimeout(30000)

// 这里是一个测试的例子，这个例子里展示了如何对Vue组件的单值和函数方法返回结果进行测试
// 此测试不涉及接口访问，涉及接口访问的样例在后面
// 之所以这样，是因为如果涉及调用涉及接口访问的部分，会因为JS本身的异步调用策略产生返回值undefined的状况，即使用Promise对象也无法
// 解决这个问题，所以如果涉及接口访问，那么还是要单独拿出来去做一下测试比较方便
// 当然也可能是我没搞对方法，如果有修正方案，欢迎进行修正和说明的更新

// describe是一整段测试的意思，如果这一整段测试有一个统一的范围，可以在这里写名字
// 不一定非要只针对单独页面命名，下面的接口测试就是统一接入了一批接口测试内容
describe('InputMarked.vue', () => {

  // 创建wrapper对象，在这里可以用propsData进行传参，但是因为我一般会给页面的props对象写好默认值，不太清楚这里有什么必要
  // 在这里使用MOCKS对象，来保证页面中的this.$xxx.xxx可以正常通过，不出现报错。
  const wrapper = shallowMount(InputMarked, {
    propsData: {
    },
    mocks: MOCKS
  })

  // mounted只是一个自定义名称，每个测试项是以it为标记开始的，可以在mounted这里调整成自己需要的名称
  // 此名称会在单元测试过程中用于标记这段测试是否通过
  it('mounted', () => {

    // 这里针对默认的变量值进行了检查，创建wrapper对象后 .vm 可以获取当前实例对象，相当于拿到了Vue组件里的this对象
    expect(wrapper.vm.Subject).toEqual('数学');
    // 这里针对一个返回class名称的方法进行了简单测试，如果需要的话，可以用同样的方式针对想要测试的方法，用不同的测试样例进行测试
    expect(wrapper.vm.Get_Type_Button_Class("单选题")).toEqual('typeButton unFocusType');

    // 如果需要对某些组件的点击事件做测试，可以用.find("#组件ID")的方法进行获取，然后测试点击事件
    // 但我个人认为这些事情是否通畅应该在写页面的时候就全部测好，在这里没有必要写样例，就跳过了这部分，需要的同学可以自行搜索怎么写
    
    // toEqual 是一个断言，判断expect的结果和toEqual内的内容是不是一致，一致的情况将被认为是通过，不一致将被认为是不通过
  });
})

// 这里是测试网络接口访问的一些测试样例，同时写了几种用于检测返回结果的方案
// 如果只是想测试能不能跑通，那么用request就可以了，因为整体比较简单易写
// 如果需要测试携带参数进行访问，并且要获取返回值进行判断，那么需要使用axios，因为传参会比较方便一些
// 但是无论哪种方案，接口测试都必须用Promise方法来保证不受异步执行过程的影响，能正常返回结果

// Web Test是这段包的名字，和前面那个例子的InputMarked.vue一样，只是为了名称比较直接
// 本段测试包含四个样例
describe('Web Test', function() {

  // 样例1：在测试过程中仅测试是否能访问得到其他站点，然后返回一个自定义的返回值，对于访问是否成功不做判断
  // 是最简单的样例
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

  // 样例2：在测试过程中开始检查返回值的状态值是否为200
  // 但是有点小问题是因为仅仅判断了状态值，所以如果结果出错但状态码是200，就很容易被测试过程骗过去
  // 可以考虑用于仅需要进行 访问->获取 这种操作的接口当中，毕竟返回值是固定格式
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

  // 样例3：在测试过程中开始尝试检测返回值的内容是否正常
  // 在这个样例里为了方便，仅调用了一个无需参数的count，也就是首页那个计数的接口作为测试
  it("Test C UUID GET", function(){
    let P =  new Promise(function(resolve) {
      REQUEST({
        url: "https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/count",
        method: "post",
        data: {}
      }, function(err, res, body) {
        // 这三个参数分别代表了报错信息，完整结果和返回数据内容
        // body可以用res.body进行替代
        // res.statusCode代表状态码，200代表状态正常，其他状态代表访问有问题，应当检查是自己的参数有问题或者是服务出现故障
        if(res.statusCode == 200){
          
          // 需要把内容用JSON.parse进行读取，才能正常访问里面的内容
          let Data_Body = JSON.parse(body)

          // 这里是一个非常简单的测试过程，具体写什么条件可以根据测试需求和项目本身的任务功能决定
          if(Data_Body.num_paper > 0){
            resolve("SUCCESS");
          }
          // 如果不满足条件，可以返回其他内容作为提示，这部分内容会在测试出现报错时出现，用于分辨错误原因
          else{
            resolve("DATA ERROR.")
          }

        }
        // 状态如果不正常，那么必然是FAILED
        else{
          resolve("FAILED")
        }
      })
    });
    // 接口访问的结果检查
    return P.then(function(code) {
      expect(code).toBe("SUCCESS");
    });
  })

  // 样例4：携带参数进行接口访问，但由于axios携带参数更方便，所以这里改成了使用axios进行访问
  // 如果不带参数的话，request整体结构更简洁，也更易读
  // 在这里选用了我们比较常测试的试题检索接口
  // 注意：所有接口的测试尽可能要随着接口变化更新，这是为了防止忘记什么地方仍然在使用旧版本接口调用方式
  // 这是为了防止接口格式更新后忘掉内容的措施
  it("Test D Exercise Test - Axios", function(){
    
    let P =  new Promise(function(resolve) {
      
      // 以下注释为接口内容说明
      // url: 即访问的接口地址，也可以在js代码内先写好前缀内容，然后写成加法式的模式
      // method: 我们的接口应该默认都是post方式，放着就好
      // data: 指需要传递给接口的参数，具体传递什么内容，什么关键字段由接口调用需求决定
      // transformRequest: 这个是axios里面用来自动将data内的值转化成FormData并传递给接口的方法，固定格式，放着就好了
      // headers: 头部信息，同理，如果需要改成文件下载式的接口，可以自行尝试调整。但是文件下载的测试应该在自行白盒测试的时候就做过了，
      // 而且这种接口应该不会轻易修改，所以也不太需要经常测试，因此我个人觉得似乎没有必要在这里写文件下载接口的测试……
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
      // axios需要用 .then 和 .catch 来判断过程内容
      .then(function (response) {

        // 用response.data来读取返回信息内容
        let Data = response.data

        // 用返回值里面的一些内容做简单判断，可以根据具体测试需求和代码功能做更复杂的逻辑判断
        if(Data.results.length > 0){
          resolve("SUCCESS")
        }
        // 判断不通过，说明返回结果有问题，但是因为这里是有返回内容的，只是结果有问题，所以应当提供和.catch不一样的resolve值
        // 一样的值也可以，看个人需求
        else{
          resolve("SEARCH ERROR")
        }
        
      })
      // 当过程出现错误时会统一出现在这里
      .catch(function () {
        resolve("SEARCH FAILED");
      });
    });
    // 最后的检查部分
    return P.then(function(code) {
      expect(code).toBe("SUCCESS");
    });
  })

});

// 最后，单元测试命令
// npm run test:unit
// 这个命令会测试tests/unit下的所有.spec.js测试文件，所以可以考虑针对不同模块编写多个测试文件进行测试，不必挤在一起
// 这个命令本身和npm run test是不一样的，所以也需要注意一下
// 建议测试内容写好后，在本地跑一下，如果出现问题，及时联系负责那个模块的人进行代码更新
// 这也是为了出现接口更新时不打乱彼此进度的一部分

// 后续随着对于jest测试模块的内容进一步学习，可能会进一步更新这些内容
// 2021-09-07 韩子勤
