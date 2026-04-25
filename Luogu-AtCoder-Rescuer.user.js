// ==UserScript==
// @name         Luogu-AtCoder-Rescuer
// @namespace    http://tampermonkey.net/
// @author KevinHuangIsLearning
// @version      3.4.0
// @description  洛谷提交至 AtCoder
// @match        https://www.luogu.com.cn/problem/AT_*
// @match        https://atcoder.jp/contests/*/submit?RMJ=1*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const log = (msg, type = "info") => {
        const colors = { info: "#00d2d3", success: "#2ed573", warn: "#ffa502", error: "#ff4757" };
        console.log(`%c[RMJ-AT-RESCUE]%c ${new Date().toLocaleTimeString()} - ${msg}`, `color: white; font-weight: bold; background: ${colors[type]}; padding: 2px 5px; border-radius: 3px;`, "color: #333; font-weight: normal;");
    };

    // --- 1. 洛谷侧逻辑 ---
    if (location.host === 'www.luogu.com.cn') {
        const injectLogic = () => {
            if (!window.location.hash.includes('#submit')) return;

            // 洛谷的提交按钮搜索
            const realBtn = document.querySelector('button.solid:nth-child(5)') ||
                            document.querySelector('.single-problem-submit-button');

            if (realBtn && !realBtn.dataset.handled) {
                realBtn.dataset.handled = "true";
                log("已捕获提交按钮", "success");

                const fakeBtn = realBtn.cloneNode(true);
                realBtn.style.display = 'none';
                fakeBtn.innerText = "提交至 AtCoder";
                realBtn.parentNode.insertBefore(fakeBtn, realBtn);

                fakeBtn.addEventListener('click', () => {
                    try {
                        const cmLines = document.querySelectorAll('.cm-line');
                        const code = Array.from(cmLines).map(l => l.textContent).join('\n') || document.querySelector('.cm-content')?.innerText;

                        const titleEl = document.querySelector('.lfe-h1');
                        const match = titleEl?.innerText.match(/AT_([a-zA-Z0-9_]+)/i);

                        if (code && code.trim() && match) {
                            const taskId = match[1].toLowerCase();
                            const contestId = taskId.split('_')[0];
                            GM_setValue('at_rescue_data', { taskId, code });
                            window.open(`https://atcoder.jp/contests/${contestId}/submit?RMJ=1&task=${taskId}`, '_blank');
                        } else {
                            throw new Error("提取代码失败，请确认编辑器已有内容。");
                        }
                    } catch (e) {
                        alert("同步失败：" + e.message);
                    }
                });
            }
        };
        setInterval(injectLogic, 500);

    // --- 2. AtCoder 侧逻辑 ---
    } else if (location.host === 'atcoder.jp') {
        const data = GM_getValue('at_rescue_data');
        if (!data || !location.search.includes('RMJ=1')) return;

        // 核心改动：上移 top 值
        GM_addStyle(`
            #rmj-hijack-layer {
                position: fixed !important; inset: 0 !important;
                background: #ffffff !important; z-index: 999990 !important;
                display: flex !important; flex-direction: column !important;
                align-items: center !important; justify-content: flex-start !important;
                padding-top: 25vh !important; /* 让内容从视口 25% 处开始 */
            }
            .rmj-title {
                font-family: sans-serif !important; font-size: 28px !important;
                font-weight: 600 !important; color: #000 !important;
                margin-bottom: 20px !important;
            }
            /* 验证码位置上移：从 55% 移到 45% */
            .cf-challenge, iframe[src*="challenges.cloudflare.com"] {
                position: fixed !important; top: 45% !important; left: 50% !important;
                transform: translate(-50%, -50%) !important; z-index: 1000000 !important;
            }
        `);

        let isFailed = false;
        const abortHijack = (reason) => {
            if (isFailed) return;
            isFailed = true;
            const layer = document.getElementById('rmj-hijack-layer');
            if (layer) layer.style.display = 'none';
            alert(`[RMJ自救助手] 自动填表失败：${reason}`);
        };

        const autoProcess = () => {
            if (isFailed) return;
            if (!document.getElementById('rmj-hijack-layer')) {
                const layer = document.createElement('div');
                layer.id = 'rmj-hijack-layer';
                layer.innerHTML = `<div class="rmj-title" id="rmj-msg">请大战机器人</div>`;
                document.documentElement.appendChild(layer);
            }

            try {
                // 自动选题
                const taskSelect = document.querySelector('select#select-task');
                if (taskSelect && taskSelect.value !== data.taskId) {
                    taskSelect.value = data.taskId;
                    if (window.$) window.$('#select-task').trigger('change');
                }

                // 自动选语言 (C++23)
                const langSelect = document.querySelector('select[name="data.LanguageId"]');
                if (langSelect && langSelect.value !== "6017") {
                    langSelect.value = "6017";
                    if (window.$) window.$('select[name="data.LanguageId"]').trigger('change');
                }

                // 代码注入
                if (typeof unsafeWindow !== 'undefined' && unsafeWindow.ace) {
                    const editor = unsafeWindow.ace.edit("editor");
                    if (editor && editor.getValue().length < 5) {
                        editor.setValue(data.code, 1);
                    }
                }

                // 提交触发
                const token = document.querySelector('input[name="cf-turnstile-response"]');
                if (token && token.value.length > 20) {
                    document.getElementById('rmj-msg').innerText = "验证成功，提交中...";
                    clearInterval(checkInterval);
                    setTimeout(() => {
                        GM_deleteValue('at_rescue_data');
                        document.querySelector('button#submit')?.click();
                    }, 500);
                }
            } catch (e) {
                abortHijack(e.message);
            }
        };

        const checkInterval = setInterval(autoProcess, 500);
        setTimeout(() => { if (!isFailed) abortHijack("超时"); }, 40000);
    }
})();
