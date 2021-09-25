# kg-edu-frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### File Structure
```

格式说明：
    + 符号：此文件夹下的第一级文件夹，用于进行大块的区分
    - 符号：第一级文件夹下的子文件夹或文件，若为文件夹，则需要在后面添加此文件夹的简单说明，若为文件，则用制表符隔开几格后简单说明此文件
<<<<<<< HEAD
    
=======

>>>>>>> 639ed57... README Update
    完成新需求页面后，应当记得更新此页面的内容，并且在新页面内添加足够的注释说明内容以便于理解和维护

------------------------------------------------------------------------------------

public  文件夹部分

此文件夹下的内容是存放静态资源，用于网页端读取静态类型资源时使用

+ members - 成员头像图片信息，将成员页面需要展示的头像图片放入此目录，按照Members_Introduce.vue页面的格式对成员信息进行整理，即可完成对于成员信息的编辑

+ 默认路径下的其他文件

    - PrivacyPolicy.pdf     隐私政策文件，格式应当为PDF
    - UserAgreement.pdf     用户协议文件，格式应当为PDF

------------------------------------------------------------------------------------

tests\unit  文件夹部分

此文件夹下的内容是存放单元测试用到的文件，具体怎么写单元测试内容，可以参考example.spec.js内的注释说明

------------------------------------------------------------------------------------

src     文件夹部分

此文件夹下的内容是项目开发过程中的页面内容部分

+ assets - 资源模块 - 用于存放项目中使用到的背景图片，符号图片等
    + InstIM InputMarked   试题输入页面的使用说明图片
    + InstIP InputPaper    试卷输入
    + InstKU KnowledgeUnit 知识点搜索
    + InstME MultiExercise 多试题查重页面
    + InstSP SearchPaper   试题检索与试卷检索共用
    + InstSR SearchResources   资源检索
    + InstUG UserGroup     用户管理

+ common - 通用模块 - 用于存放多处多次复用的组件

    - components - 组件存放
        - assets - 通用模块的组件内的一些专属资源，当前存放了ComplexInput的自定义公式输入的图片按钮内容
        - ComplexInput.vue      复杂输入组件，当前版本是基于Mavon-Editor的版本
        - Instruction.vue       介绍页面用到的统一组件
        - Mathdown.vue          用于Latex渲染的组件，具体说明在最后
        - statistics.vue        统计组件，包含了试题，试卷，知识单元数量的展示
        - vue-img-verify.vue    验证码生成并展示的组件

    - styles - SCSS样式存放

    - utils - 工具类的JS函数存放
        - ajax.js       现在通用的服务访问时的调用模块，由于添加了用户token在里面，如果涉及到用户内容的话建议使用此模块返回的服务访问方法
<<<<<<< HEAD
=======
        - auth.js       用于将值（通常是store中的token,username等值）存放cookie中
        - index.js      暂未使用 包括时间转换，参数转换等工具
        - validate.js   暂未使用 用于权限认证
        - variable.js   用于存放全局的字典
>>>>>>> 639ed57... README Update
        - extraction.js 文字粘贴识别的JS文件，目前是初代版本，功能很弱
        - request.js    调整请求头部的JS文件，用于辅助ajax.js控制访问请求

+ historyBackpack - 历史备份模块，用于存放曾经存在于项目中，现在被淘汰掉的文件，如果有回滚需求则便于处理，此文件夹下的内容不可直接用于项目当中，无需详细内容说明

+ layout - 页面布局管理
    - components    页面组件
        - Sidebar - 导航栏组件
        - footer.vue    页面底部组件
        - login.vue     登录组件
        - register.vue  注册组件
        - PrivacyPolicy.vue     隐私政策显示页面
        - UserAgreement.vue     用户协议显示页面
    - Basic.vue     路由嵌套 - 基本布局包括固定的头部，尾部   
    - Container.vue 路由嵌套 - 仅为一个容器，不对布局产生影响     
    - SideBar.vue   路由嵌套 - 左侧菜单栏  

+ plugins - 插件导入管理
    - element.js    引入elementUI的JS文件

+ router - 路由控制
    - index.js   路由总入口
    - modules - 路由模块
        - user.js    用户登录后的路由
        - visitor.js 未登录时的路由

+ store - 状态管理，目前含用户状态的存储

+ views - 功能模块，存放所有功能性页面

    - admin - 管理员功能模块，目前存放了之前编写的管理员功能的模板（属于暂时用不到的部分，也许以后有用得到的地方）
<<<<<<< HEAD
    
=======

>>>>>>> 639ed57... README Update
    - labelManage - 标注管理平台部分

    - manage - 用户个人信息操作和管理
        - resources - 用户的资源内容操作
            - MyPaper.vue     用户试卷内容的操作页面
            - MyQuestion.vue  用户试题内容的操作页面
        - study - 用户的学习资源检索
        - userMessage - 用户的个人信息维护
            - components - 专属于个人信息维护的组件，包括各类操作时用到的Dialog内容
            - userGroup.vue     组织架构页面
            - userInfo.vue      个人信息页面

    - paperCombine - 组卷功能部分
        - components - 组卷功能下包含的子页面内容
            - AutoCombine.vue       智能组卷页面
            - DetailTable.vue       双向细目表组卷页面
            - FromDatabasePaper.vue 数据库试卷中挑题的页面
            - InputQuestion.vue     用户自己录入题目的页面
            - Keyword.vue           关键字挑题的页面
            - KnowledgePoint.vue    知识点挑题的页面
            - StartCombine.vue      最终组卷的页面
        - AnswerCard.vue    答题卡页面
        - PaperCombine.vue  组卷的主页面

    - publicPlatform - AI实验室部分
        - components - AI实验室的专属组件内容
            - Dialogue.vue          用户输入图片时的控件
            - Instruction           使用说明
        - Similarity.vue            试题相似度预估
        - Estimate.vue              试题属性预估
        - ImageTranscription.vue    图片转写内容

    - resourceAnalyse - 资源分析部分，目前存放了试卷分析和试题分析的内容
        - components - 专属于resourceAnalyse的组件
            - PaperAnalysePQRoot.vue        根组件
            - PaperAnalysePackedQues.vue    自递归组件
            - PaperAnalyseQuestion.vue      最终题目显示组件
        - PaperAnalyse.vue          试卷分析报告页面
        - PaperAnalyseInput.vue     用户录入试卷，用于分析的页面
        - QuestionAnalyse.vue       试题分析报告页面
        - QuestionAnalyseInput.vue  用户录入试题，用于分析的页面

    - resourceQuery - 资源查询部分，目前存放了知识点查询，试题搜索，试卷搜索，教材教辅搜索四部分内容
<<<<<<< HEAD
        - components - 专属于resourceQuery的组件
        - MultiExercise - 多题查重部分
            - components - 多题查重部分专门用到的组件
                - DatabaseList.vue  用户权限可用的数据库列表
                - PDF.vue           针对PDF格式文件
                - SearchResult.vue  检索结果
            - index.vue     多题查重部分的主页面
        - Exercise.vue      试题搜索
        - KU.vue            知识点搜索
=======
        + components - 专属于resourceQuery的组件
        + Exercise     根据导航栏路径是否为eems显示为试题搜索或试题查重
          + components - 专属于试题检索（查重）的组件
            - InstructionMultiExercise.vue 多题查重使用说明  
            - SelectFile.vue               上传文件
            - CutFile.vue                  切分文件
          - index.vue                    入口文件
        + KU           知识点搜索
          + components - 专属于知识点检索的组件
            - CoStudy.vue         共同学习
            - Graph.vue           右侧大图
            - Hierarchy.vue       层级结构
            - InstructionKU.vue   使用说明
            - PreSuc.vue          前驱后继
            - utils.js            
          - index.vue        入口文件
>>>>>>> 639ed57... README Update
        - Resources.vue     教材教辅搜索
        - SearchPaper.vue   试卷搜索

    - resourceInput - 资源录入部分，目前存放了试题录入和试卷录入的内容
        - components - 专属于resourceInput的组件，包括四类型题目的录入，当前的录入模块为重置版本
            - OptionQuestions.vue   选择题（单选/多选/判断）
            - FillQuestions.vue     填空题   
            - AnswerQuestions.vue   解答题（计算/简答）
            - MixQuestions.vue      综合题（多类型嵌套）
            - Instruction           使用介绍
        - InputMarked.vue   单题录入页面
        - InputPaper.vue    整卷录入页面

    - testPage - 测试页面，用于存放项目中正在测试的新功能，完成后可以保留原文件，也可以删掉，但最终完成后所使用的版本，不能是这个目录下的版本，因为具体文件内容随时可能根据测试内容删除修改，文件内容无需说明

    - 其他文件 - 暂时没有固定分类的文件，一般属于独立功能，如果后续有分类再行处理
        - 404.vue           路径出错时的默认页面，目前没有专门的样式设计
        - Admin.vue         老版本的管理员页面，目前暂时是一个放在这里不用的页面，后续有需求可以重新用起来
        - DashBoard.vue     引用统计组件statistics在前端进行展示
        - Home.vue          水镜智能主项目内容的主页面
        - Home_EEMS.vue     智慧考试管理系统的主页面
        - Members_Introduce.vue     成员介绍页面
        - PublicPlatform.vue        AI实验室的主页面

+ components - 存放自定义模块用的文件夹，如有需要可按照以下方法操作

    自定义模块如何使用？（以自定义了MavonEditor的光标位置插入功能经验为例）

    1:  在本地找到node_modules下，需要自定义功能的模块文件夹。

    2:  找到这个模块的文件夹下的package.js，从中找到 'main' 这一字段对应内容表示的文件
        这一文件代表着这个模块实际调用时所使用的文件及其路径，一般是在 dist 目录下，但是还是自己看一下的好

    3:  模仿其中的语法，修改这个文件，并在本地测试直到自定义功能通过
        3-1:    如果觉得折叠程度过于夸张难以阅读，建议以以下步骤进行修改工作。
        3-2:    按照常规项目组织路径，在模块的 src 目录下找到前端文件对应的文件（MavonEditor对应的是MavonEditor.js，下面看到的 JS 基本是代称这个文件）这个文件是项目 build 前的源文件，虽然直接修改没办法完成自定义功能，但是可以帮助你找到插入内容前后位置的代码
        3-3:    在源文件下配合 Ctrl + F 锁定要修改的位置的前后内容，在 JS 内找到对应的内容位置，模仿 build 后的语法进行修改
        3-4:    保存这个 JS 文件，然后在本地测试是否通过，重复修改步骤直至通过。

    4:  复制这个自定义过的 JS 到 src/components 目录下进行保存

    5:  【关键】
        打开 gitlab-ci.yml 文件，在 build 过程中的
        [ npm run install 后，npm run build 前 ] ← 关键
        的位置编写 cp 指令，将自定义的 JS 复制到对应的位置，这样就可以在项目build前替换JS文件，从而使目录 build 时用的是自定义过的 JS 文件

        例：\cp -f src/components/mavon-editor.js node_modules/mavon-editor/dist/

        注意：
            cp 前需要加反斜杠以避免复制过程中出现Y/N的确认过程造成中断
            选项使用 -f 来强制替换

    6:  等待项目自己build完成，自定义模块就生效了。

```

### Hints Of Mathdown.vue
```
此组件需要两个参数进行渲染，一个是content，另一个是name
content 用于渲染内容，其中支持英文，数字，汉字，<img src='...'>格式的图片，以及最重要的Latex公式，其他内容暂时还没涉及，以后再说。
name    用于定位内容渲染的组件，命名必须唯一，否则Latex公式和图片会在同一个Mathdown组件内渲染name重复次数的次数
        例如：有两个name值为 math_1 的 Mathdown 组件，content分别是$0$和$1$，则渲染出来会是$0$$0$，$1$$1$，但对内容无影响
        且只要此页面不关闭，组件不销毁，则此名称将一直存在，如果为了保证组件渲染正确而写了默认值，千万要注意在循环渲染的时候的name属性赋予
        为了独立其名称，最好在页面created时就先生成好准备给它的name值，否则可能会导致渲染时，一些前缀还没计算完，Mathdown组件就已经渲染完毕，导致name值出现重复的情况。
```
