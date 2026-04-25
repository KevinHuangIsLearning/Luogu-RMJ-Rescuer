# Luogu-RMJ-Rescuer
![License](https://img.shields.io/badge/license-MIT-green)

洛谷 RMJ 炸了？没关系。本脚本可以帮你直接在对应平台完成提交。

本项目提供了一套自动化提交流程：在洛谷提交页面注入按钮，点击后自动跳转至对应平台的提交页，并自动完成：**题目 ID 填入**、**代码填充**、**编程语言选择**。你只需要手动点一下验证码，剩下的交给脚本。

## 快速开始

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 插件。
2. 点击链接安装：[Luogu-Codeforces-Rescuer](https://github.com/KevinHuangIsLearning/Luogu-RMJ-Rescuer/raw/refs/heads/main/Luogu-CF-Rescuer.user.js) 和 [Luogu-AtCoder-Rescuer](https://github.com/KevinHuangIsLearning/Luogu-RMJ-Rescuer/raw/refs/heads/main/Luogu-AtCoder-Rescuer.user.js)
3. 刷新洛谷题目提交页面，你将看到一个“提交至 AtCoder/Codeforces”的按钮。

## 核心功能

- **界面覆盖**：在 AtCoder/CF 验证页提供半透明背景与加载动画，方便在等待验证时保持上下文一致。
- **自动提交流程**：
  - **动态语言选择**：在洛谷页面通过脚本注入的下拉框选择目标平台语言，无需手动修改脚本。
  - **题目 ID 填入**：自动识别并填入对应平台的题目编号。
  - **代码填充**：模拟输入完成源代码填充。
  - **自动提交**：若未检测到人机验证，表单填充完成后自动提交。
  - **超时处理**：若加载或验证超过 5 秒，自动退出覆盖层并转为手动模式，避免卡死。

- **自动清理**：提交成功后清除脚本使用的本地缓存。

## 使用指南

1. 在洛谷题目页点击 `提交答案`（或 `#submit` 锚点）。
2. 点击本脚本注入的 **[提交至 XXX]** 按钮。
3. 浏览器会自动打开新标签页，并显示“请大战机器人”。
4. **手动点击 Cloudflare 验证框**。
5. 验证通过后，脚本会自动执行 `Submit`，完成提交。

## 注意事项

- **登录状态**：请确保已在浏览器中登录 Codeforces 和 AtCoder 账号。
- **语言选择**：提交前请在洛谷页面的自定义下拉框中确认编程语言。
- **代码获取**：脚本通过捕获 CodeMirror 编辑器内容实现，请确保点击按钮前代码已输入。

## 免责声明

本工具仅作为洛谷 RMJ 功能受阻时的临时补救方案。请遵守各平台规则，合理使用。