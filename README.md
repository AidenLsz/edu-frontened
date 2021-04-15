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

+ historyBackpack - 历史备份模块 - 用于存放曾经存在于项目中，现在被淘汰掉的文件，如果有回滚需求则便于处理

+ router - 路由控制

+ plugins - 插件导入管理
```