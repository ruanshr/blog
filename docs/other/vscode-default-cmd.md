# Vscode 快捷操作

### 不用鼠标，用键盘将vscode打开当前文件夹

环境变量: 将vscode安装目录上的code.exe所在的目录设置在环境变量上

快捷键win + cmd 进入cmd命令，通过命令进入到对应的文件夹，然后code .即可

### 快捷打开命令窗口

ctrl + shift + ~

设置git为默认命令窗口(linux 命令，可以执行shell等linux命令)

在文件->首选项->设置

在 terminal.integrated.profiles.windows 配置上添加git

```json

"terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "icon": "terminal-powershell"
    },
    "Command Prompt": {
      "path": [
        "${env:windir}\\Sysnative\\cmd.exe",
        "${env:windir}\\System32\\cmd.exe"
      ],
      "args": [],
      "icon": "terminal-cmd"
    },
    "Git": {
      "path": "XXX\\Git\\bin\\base.exe"
    }
  },
  "terminal.integrated.defaultProfile.windows": "Git"
  
```