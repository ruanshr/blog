---
sidebarDepth: 0
---

# ESLint Config

## Vscode 的 eslint 配置

```json
//  Vscode的eslint配置

{
  // 关闭快速预览
  "editor.minimap.enabled": false,
  // 打开自动保存
  "files.autoSave": "off",
  "editor.quickSuggestions": {
    // 开启自动显示建议
    "other": true,
    "comments": true,
    "strings": true
  },
  // 制表符符号eslint
  "editor.tabSize": 2,
  // 每次保存自动格式化
  "editor.formatOnSave": true,
  // 每次保存的时候将代码按eslint格式进行修复
  "eslint.autoFixOnSave": true,
  // 让prettier使用eslint的代码格式进行校验
  "prettier.eslintIntegration": true,
  // 去掉代码结尾的分号
  "prettier.semi": false,
  // 使用单引号替代双引号
  "prettier.singleQuote": true,
  // 让函数(名)和后面的括号之间加个空格
  "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
  // 格式化.vue中html
  "vetur.format.defaultFormatter.html": "none",
  // 关闭vue中的template错误
  "vetur.validation.template": false,
  // 让vue中的js按编辑器自带的ts格式进行格式化
  "vetur.format.defaultFormatter.js": "vscode-typescript",
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      // 属性强制折行对齐
      "wrap_attributes": "force-aligned"
    }
  },
  "eslint.validate": [
    //开启对.vue文件中错误的检查
    "javascript",
    "javascriptreact",
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "vue",
      "autoFix": true
    }
  ],
  // 解决vscode占用cpu过高
  "search.followSymlinks": false,
  // 打开文件不覆盖
  "workbench.editor.enablePreview": false,
  "git.ignoreMissingGitWarning": true,
  "vetur.validation.style": true,
  "breadcrumbs.enabled": false,
  "editor.renderControlCharacters": false,
  "terminal.integrated.rendererType": "dom",
  "editor.renderWhitespace": "none",
  "editor.fontSize": 14,
  "[javascript]": {},
  "files.associations": {
    "*.js": "javascript"
  }
}
```

## 引入 ESLint 的依赖 packson.json

```json
{
  "devDependencies": {
    "babel-eslint": "^8.2.1",
    "eslint": "^4.15.0",
    "eslint-config-standard": "^10.2.1",
    "eslint-friendly-formatter": "^3.0.0",
    "eslint-loader": "^1.7.1",
    "eslint-plugin-import": "^2.7.0",
    "eslint-plugin-node": "^5.2.0",
    "eslint-plugin-promise": "^3.4.0",
    "eslint-plugin-standard": "^3.0.1",
    "eslint-plugin-vue": "^4.0.0"
  }
}
```
