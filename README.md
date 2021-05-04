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
+ views - 功能模块，存放所有功能性页面
    - admin - 管理员功能模块，目前存放了之前编写的管理员功能的模板
    - resourceQuery - 资源查询部分，目前存放了知识点查询和试题搜索两部分内容
        - components - 专属于resourceQuery的组件，包括Graph.vue
    - resourceInput - 资源录入部分，目前存放了试题录入和试卷录入的内容
        - components - 专属于resourceInput的组件，包括四类型题目的录入和显示
    - resourceAnalyse - 资源分析部分，目前存放了试卷分析和试题分析的内容
        - components - 专属于resourceAnalyse的组件，包括根组件，自递归组件和最终题目显示组件
    - testPage - 测试页面，用于存放项目中正在测试的新功能
    - 其他文件 - 暂时没有固定分类的文件，一般属于独立功能，如果后续有分类再行处理

+ assets - 资源模块 - 用于存放项目中使用到的背景图片，符号图片等

+ common - 通用模块 - 用于存放多处多次复用的组件
    - components - 组件存放
    - styles - SCSS样式存放
    - utils - JS函数存放

+ components - 存放自定义模块用的文件夹

    自定义模块如何使用？（以自定义了MavonEditor的光标位置插入功能经验为例）

    1:  在本地找到node_modules下，需要自定义功能的模块文件夹。
    
    2:  找到这个模块的文件夹下的package.js，从中找到 'main' 这一字段对应内容表示的文件
        这一文件代表着这个模块实际调用时所使用的文件及其路径，一般是在 dist 目录下，但是还是自己看一下的好
    
    3:  模仿其中的语法，修改这个文件，并在本地测试直到自定义功能通过
        3-1:    如果觉得折叠程度过于夸张难以阅读，建议以以下步骤进行修改工作。
        3-2:    按照常规项目组织路径，在模块的 src 目录下找到前端文件对应的文件（MavonEditor对应的是MavonEditor.js，下面看到的 JS 
                基本是代称这个文件）这个文件是项目 build 前的源文件，虽然直接修改没办法完成自定义功能，但是可以帮助你找到插入内容前
                后位置的代码
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

+ historyBackpack - 历史备份模块 - 用于存放曾经存在于项目中，现在被淘汰掉的文件，如果有回滚需求则便于处理

+ router - 路由控制

+ plugins - 插件导入管理
```