# git commit 提交时能规范

### 1、前言

写好git commit提交有什么好处呢？

查看提交的log也非常的优雅，这个就不多提了

方便查找日志记录，通过简单的过滤便能定位到具体想要查找的log

方便问题回溯，通过git log就能查找到当时提交的代码文件，以及修改的代码

其实如果使用过github的release, 可以直接根据feat和fix来过滤提取日志发布版本

接下来我就来实践一下，首先我这里使用的是pnpm安装依赖的。今天主要是在提交代码时稍微自动化一点，并且让提交规范统一一些。


### 2、commitizen插件
```sh
pnpm i commitizen -D 
```

此时我们先 **git add .**,然后就可以使用一下 **git cz**,所以现在可以直接在package.json中添加一个scripts
```js
// && 代表`git add .和 `git cz` 两个指令串行执行，
// 先执行前一个，执行完后再执行后一个
"git": "git add . && git cz"
```

那么接下来直接执行  **pnpm git**

输入commit的提交信息，保存，关闭小窗，因为我这里用的是gitExtensions图形操作程序，随后git push提交即可，但是这样其实只是换了一个命令而已，并没有什么实质性的改变。那接下来就让它改变一下吧

### 3、cz-customizable设置提交模板
```sh
pnpm i cz-customizable -D
```
安装完之后在package.json中添加如下节点
```json
 "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    }
  },
```
同时可以再根目录创建**.cz-config.js**，这里有一份官网提供的模板 
下面这个是我自己修改后的提交模板
```js
module.exports = {
  // type 类型（定义之后，可通过上下键选择）
  types: [
    { value: 'feat', name: 'feat:     新增功能' },
    { value: 'fix', name: 'fix:      修复 bug' },
    { value: 'docs', name: 'docs:     文档变更' },
    {
      value: 'style',
      name: 'style:    代码格式（不影响功能，例如空格、分号等格式修正）'
    },
    {
      value: 'refactor',
      name: 'refactor: 代码重构（不包括 bug 修复、功能新增）'
    },
    { value: 'perf', name: 'perf:     性能优化' },
    { value: 'chore', name: 'chore:     其他修改, 比如构建流程, 依赖管理、版本好修正.' }
  ],

  // scope 类型（定义之后，可通过上下键选择）
  scopes: [
    ['components', '组件相关'],
    ['hooks', 'hook 相关'],
    ['utils', 'utils 相关'],
    ['element-ui', '对 element-ui 的调整'],
    ['styles', '样式相关'],
    ['deps', '项目依赖'],
    ['auth', '对 auth 修改'],
    ['other', '其他修改'],
    // 如果选择 custom，后面会让你再输入一个自定义的 scope。也可以不设置此项，把后面的 allowCustomScopes 设置为 true
    ['custom', '以上都不是？我要自定义']
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    }
  }),

  // 是否允许自定义填写 scope，在 scope 选择的时候，会有 empty 和 custom 可以选择。
  // allowCustomScopes: true,

  // allowTicketNumber: false,
  // isTicketNumberRequired: false,
  // ticketNumberPrefix: 'TICKET-',
  // ticketNumberRegExp: '\\d{1,5}',

  // 针对每一个 type 去定义对应的 scopes，例如 fix
  /*
    scopeOverrides: {
      fix: [
        { name: 'merge' },
        { name: 'style' },
        { name: 'e2eTest' },
        { name: 'unitTest' }
      ]
    },
    */

  // 交互提示信息
  messages: {
    type: '确保本次提交遵循：前端代码规范！\n选择你要提交的类型：',
    scope: '\n选择一个 scope（可选）：',
    // 选择 scope: custom 时会出下面的提示
    customScope: '请输入自定义的 scope：',
    subject: '填写简短精炼的变更描述：\n',
    body: '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
    breaking: '列举非兼容性重大的变更（可选）：\n',
    footer: '列举出所有变更的 ISSUES CLOSED（可选）。 例如: #31, #34：\n',
    confirmCommit: '确认提交？'
  },

  // 设置只有 type 选择了 feat 或 fix，才询问 breaking message
  allowBreakingChanges: ['feat', 'fix'],

  // 跳过要询问的步骤
  skipQuestions: ['scope', 'body', 'breaking', 'footer'],

  subjectLimit: 100, // subject 限制长度
  breaklineChar: '|' // 换行符，支持 body 和 footer
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true,
}
```
运行 **pnpm git**

根据指引提示，然后输入提交信息，推送到服务器就完成了，查看git log可以发现

### 4、总结

其实还可以将脚本修改一下
```sh
"git": "git add . && git cz && git push"
```
复制代码
这样三个指令会串行执行，一个接着一个执行，如果提交没什么问题的话，很自然就推送到远端了
