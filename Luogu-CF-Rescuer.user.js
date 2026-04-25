// ==UserScript==
// @name         Luogu-CF-Rescuer
// @namespace    http://tampermonkey.net/
// @version      3.0.4
// @description  洛谷提交至 Codeforces
// @match        https://www.luogu.com.cn/problem/CF*
// @match        https://codeforces.com/problemset/submit*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 格式化日志输出
    const log = (msg, type = "info") => {
        const colors = {
            info: "#00d2d3",
            success: "#2ed573",
            warn: "#ffa502",
            error: "#ff4757"
        };
        console.log(
            `%c[RMJ-RESCUE]%c ${new Date().toLocaleTimeString()} - ${msg}`,
            `color: white; font-weight: bold; background: ${colors[type]}; padding: 2px 5px; border-radius: 3px;`,
            "color: #333; font-weight: normal;"
        );
    };

    // === 样式注入：CF 侧的视觉劫持 ===
    if (location.host === 'codeforces.com' && location.search.includes('RMJ=1')) {
        log("检测到 RMJ 标记，注入视觉劫持样式", "info");
        GM_addStyle(`
            #rmj-hijack-layer {
                position: fixed !important; inset: 0 !important;
                background: #ffffff !important; /* 纯白色背景 */
                z-index: 999990 !important;
                display: flex !important; flex-direction: column !important;
                align-items: center !important;
            }
            .rmj-container {
                position: absolute !important;
                top: 35% !important; /* 向上平移，避免和 50% 位置的验证码重叠 */
                left: 50% !important;
                transform: translateX(-50%) !important;
                text-align: center !important;
                z-index: 999992 !important;
            }
            .rmj-title {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                font-size: 28px !important; font-weight: 600 !important;
                color: #000 !important;
                margin-bottom: 15px !important;
            }
            /* 验证码定位 */
            .cf-turnstile, iframe[src*="challenges.cloudflare.com"] {
                position: fixed !important;
                top: 52% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                z-index: 1000000 !important;
            }
        `);
    }

    // --- 1. 洛谷侧逻辑 ---
    if (location.host === 'www.luogu.com.cn') {
        const injectLogic = () => {
            if (!window.location.hash.includes('#submit')) return;
            const realBtn = document.querySelector('button.solid:nth-child(5)');

            if (realBtn && !realBtn.dataset.handled) {
                realBtn.dataset.handled = "true";
                log("检测到提交按钮，准备注入假按钮...", "info");

                const fakeBtn = realBtn.cloneNode(true);
                realBtn.style.display = 'none';
                fakeBtn.style.display = '';

                fakeBtn.innerText = "提交到 Codeforces";
                realBtn.parentNode.insertBefore(fakeBtn, realBtn);
                log("假按钮注入成功", "success");

                fakeBtn.addEventListener('click', async () => {
                    log("用户点击按钮，开始同步环境...", "info");

                    try {
                        const cmLines = document.querySelectorAll('.cm-line');
                        const code = cmLines.length > 0 ? Array.from(cmLines).map(l => l.textContent).join('\n') : document.querySelector('.cm-content')?.innerText;

                        const titleEl = document.querySelector('.lfe-h1');
                        const match = titleEl?.innerText.match(/CF(\d+[A-Z]\d*)/i);

                        if (code && match) {
                            log(`准备传输数据：题目=${match[1]}, 代码长度=${code.length}`, "success");
                            GM_setValue('rescue_data', {
                                id: match[1],
                                code: code
                            });
                            log("GM_setValue 写入完毕，准备打开 CF 验证页面", "info");
                            window.open('https://codeforces.com/problemset/submit?RMJ=1', '_blank');
                        } else {
                            throw new Error("无法获取题目ID或代码内容");
                        }
                    } catch (e) {
                        log(`错误: ${e.message}`, "error");
                        alert("劫持失败：" + e.message);
                        fakeBtn.innerText = "提交到 Codeforces";
                        fakeBtn.style.opacity = '1';
                    }
                });
            }
        };
        setInterval(injectLogic, 800);

    // --- 2. CF 侧逻辑 ---
    } else if (location.host === 'codeforces.com') {
        const data = GM_getValue('rescue_data');
        if (!data || !location.search.includes('RMJ=1')) return;

        log("同步数据读取成功，启动劫持层", "success");

        const initOverlay = () => {
            if (document.getElementById('rmj-hijack-layer')) return;
            const layer = document.createElement('div');
            layer.id = 'rmj-hijack-layer';

            layer.innerHTML = `
                <div class="rmj-container">
                    <div class="rmj-title">请大战机器人</div>
                </div>
            `;
            document.documentElement.appendChild(layer);
            log("视觉劫持层已挂载 (纯白模式)", "info");
        };

        const autoProcess = () => {
            initOverlay();

            const idInput = document.querySelector('input[name="submittedProblemCode"]');
            const aceInput = document.querySelector('.ace_text-input');
            const submitBtn = document.querySelector('#singlePageSubmitButton');

            if (idInput && idInput.value !== data.id) {
                idInput.value = data.id;
                ['input', 'change', 'blur'].forEach(ev => idInput.dispatchEvent(new Event(ev, { bubbles: true })));
                log(`已自动填入题目 ID: ${data.id}`, "success");
            }

            const aceContent = document.querySelector('.ace_content');
            if (aceContent && !aceContent.dataset.done) {
                if (aceInput) {
                    aceInput.focus();
                    if (document.execCommand('insertText', false, data.code)) {
                        aceContent.dataset.done = "true";
                        log("已自动填入源代码", "success");
                    }
                }
            }

            const tokenInput = document.querySelector('input[name^="cf-turnstile-response"]');
            if (tokenInput && tokenInput.value.length > 20) {
                log("检测到验证码已完成！", "success");
                document.querySelector('.rmj-title').innerText = "验证成功，正在提交...";
                document.querySelector('.rmj-title').style.color = "#2ecc71";

                clearInterval(checkInterval);
                setTimeout(() => {
                    log("点击 Submit 按钮", "info");
                    submitBtn.click();
                    GM_deleteValue('rescue_data');
                }, 400);
            }
        };

        const checkInterval = setInterval(autoProcess, 500);
        setTimeout(() => clearInterval(checkInterval), 60000);
    }
})();