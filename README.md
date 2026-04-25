# Luogu-RMJ-Rescuer
![License](https://img.shields.io/badge/license-MIT-green)

**本项目由 Gemini 3 驱动**

洛谷 RMJ 炸了？没关系。本脚本集旨在绕过洛谷那个经常卡死的同步系统，手动完成提交过程。

本项目提供了一套**视觉劫持自救方案**：在洛谷提交页面注入“自救”按钮，点击后自动跳转至对应平台的提交页，并自动完成：**题目 ID 填入**、**代码注入**、**编程语言选择**。你只需要手动点一下验证码，剩下的交给脚本。

## 快速开始

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 插件。
2. 点击链接安装：[Luogu-Codeforces-Rescuer](https://github.com/KevinHuangIsLearning/Luogu-RMJ-Rescuer/raw/refs/heads/main/Luogu-CF-Rescuer.user.js) 和 [Luogu-AtCoder-Rescuer](https://github.com/KevinHuangIsLearning/Luogu-RMJ-Rescuer/raw/refs/heads/main/Luogu-AtCoder-Rescuer.user.js)
3. 刷新洛谷题目提交页面，你将看到一个“提交至 AtCoder/Codeforces”的按钮。**Now Enjoy!**

## 核心功能

- **视觉劫持**：在 AtCoder/CF 验证页提供半透明高斯模糊背景，配合丝滑加载动画，打造沉浸式“洛谷风格”提交环境。
- **智能自救**：
  - **动态语言选择**：在洛谷页面直接通过脚本注入的下拉框选择目标平台语言，无需手动修改脚本。
  - **题目 ID 填入**：自动识别并填入对应平台的题目编号。
  - **代码注入**：模拟真实输入完成源代码填充。
  - **无盾秒提**：若未检测到人机验证，脚本将在表单填充完毕后自动提交。
  - **超时降级**：若加载或验证超过 5 秒，自动淡出视觉劫持层并转为手动模式，确保不卡死。

- **验证码上移**：精准优化 Cloudflare 验证框位置，避免遮挡，让你“大战机器人”时心情更舒畅。
- **无感清理**：提交成功后自动清除脚本占用的本地缓存。

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

本工具仅作为洛谷 RMJ 功能受阻时的临时补救方案，旨在优化用户体验。请遵守各大 OJ 平台的提交限制，不要进行恶意攻击。
