// ==UserScript==
// @name         Luogu-CF-Rescuer
// @namespace    http://tampermonkey.net/
// @author KevinHuangIsLearning
// @version      3.1.0
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

    const CF_LANGS = [{"id": "43", "name": "GNU GCC C11 5.1.0"}, {"id": "54", "name": "GNU G++17 7.3.0"}, {"id": "89", "name": "GNU G++20 13.2 (64 bit, winlibs)"}, {"id": "91", "name": "GNU G++23 14.2 (64 bit, msys2)"}, {"id": "65", "name": "C# 8, .NET Core 3.1"}, {"id": "79", "name": "C# 10, .NET SDK 6.0"}, {"id": "96", "name": "C# 13, .NET SDK 9"}, {"id": "9", "name": "C# Mono 6.8"}, {"id": "28", "name": "D DMD32 v2.105.0"}, {"id": "97", "name": "F# 9, .NET SDK 9"}, {"id": "32", "name": "Go 1.22.2"}, {"id": "12", "name": "Haskell GHC 8.10.1"}, {"id": "87", "name": "Java 21 64bit"}, {"id": "36", "name": "Java 8 32bit"}, {"id": "83", "name": "Kotlin 1.7.20"}, {"id": "88", "name": "Kotlin 1.9.21"}, {"id": "99", "name": "Kotlin 2.2.0"}, {"id": "19", "name": "OCaml 4.02.1"}, {"id": "3", "name": "Delphi 7"}, {"id": "4", "name": "Free Pascal 3.2.2"}, {"id": "51", "name": "PascalABC.NET 3.8.3"}, {"id": "13", "name": "Perl 5.20.1"}, {"id": "6", "name": "PHP 8.1.7"}, {"id": "7", "name": "Python 2.7.18"}, {"id": "31", "name": "Python 3.13.2"}, {"id": "40", "name": "PyPy 2.7.13 (7.3.0)"}, {"id": "41", "name": "PyPy 3.6.9 (7.3.0)"}, {"id": "70", "name": "PyPy 3.10 (7.3.15, 64bit)"}, {"id": "67", "name": "Ruby 3.2.2"}, {"id": "75", "name": "Rust 1.89.0 (2021)"}, {"id": "98", "name": "Rust 1.89.0 (2024)"}, {"id": "20", "name": "Scala 2.12.8"}, {"id": "34", "name": "JavaScript V8 4.8.0"}, {"id": "55", "name": "Node.js 15.8.0 (64bit)"}, {"id": "14", "name": "ActiveTcl 8.5"}, {"id": "15", "name": "Io-2008-01-07 (Win32)"}, {"id": "17", "name": "Pike 7.8"}, {"id": "18", "name": "Befunge"}, {"id": "22", "name": "OpenCobol 1.0"}, {"id": "25", "name": "Factor"}, {"id": "26", "name": "Secret_171"}, {"id": "27", "name": "Roco"}, {"id": "33", "name": "Ada GNAT 4"}, {"id": "38", "name": "Mysterious Language"}, {"id": "39", "name": "FALSE"}, {"id": "44", "name": "Picat 0.9"}, {"id": "45", "name": "GNU C++11 5 ZIP"}, {"id": "46", "name": "Java 8 ZIP"}, {"id": "47", "name": "J"}, {"id": "56", "name": "Microsoft Q#"}, {"id": "57", "name": "Text"}, {"id": "62", "name": "UnknownX"}, {"id": "68", "name": "Secret 2021"}];

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

    // --- 1. 洛谷侧 logic ---
    if (location.host === 'www.luogu.com.cn') {
        const injectLogic = () => {
            if (!window.location.hash.includes('#submit')) return;

            // 洛谷的提交按钮搜索
            const realBtn = document.querySelector('button.solid:nth-child(5)') ||
                            document.querySelector('.single-problem-submit-button');

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
                        const langId = document.getElementById('cf-rescue-lang-select')?.value || "91";

                        if (code && match) {
                            log(`准备传输数据：题目=${match[1]}, 代码长度=${code.length}, 语言ID=${langId}`, "success");
                            GM_setValue('rescue_data', {
                                id: match[1],
                                code: code,
                                langId: langId
                            });
                            log("GM_setValue 写入完毕，准备打开 CF 验证页面", "info");
                            window.open('https://codeforces.com/problemset/submit?RMJ=1', '_blank');
                        } else {
                            throw new Error("无法获取题目ID或代码内容");
                        }
                    } catch (e) {
                        log(`错误: ${e.message}`, "error");
                        alert("劫持失败：" + e.message);
                    }
                });

                // 只有在成功替换提交按钮后，才替换语言选择器
                const langWrapper = document.querySelector('.combo-wrapper');
                if (langWrapper && !langWrapper.dataset.handled) {
                    langWrapper.dataset.handled = "true";
                    log("已捕获语言选择器", "success");

                    langWrapper.style.display = 'none';
                    const fakeLang = document.createElement('select');
                    fakeLang.id = 'cf-rescue-lang-select';
                    fakeLang.style.cssText = 'height: 32px; width: 300px; padding: 0 5px; border: 1px solid #ddd; border-radius: 4px; outline: none; margin-right: 10px;';
                    
                    CF_LANGS.forEach(l => {
                        const opt = document.createElement('option');
                        opt.value = l.id;
                        opt.innerText = l.name;
                        if (l.id === "91") opt.selected = true; // 默认 GNU G++23
                        fakeLang.appendChild(opt);
                    });

                    langWrapper.parentNode.insertBefore(fakeLang, langWrapper);
                }
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
            const langSelect = document.querySelector('select[name="programTypeId"]');
            const aceInput = document.querySelector('.ace_text-input');
            const submitBtn = document.querySelector('#singlePageSubmitButton');

            if (idInput && idInput.value !== data.id) {
                idInput.value = data.id;
                ['input', 'change', 'blur'].forEach(ev => idInput.dispatchEvent(new Event(ev, { bubbles: true })));
                log(`已自动填入题目 ID: ${data.id}`, "success");
            }

            if (langSelect && data.langId && langSelect.value !== data.langId) {
                langSelect.value = data.langId;
                ['input', 'change'].forEach(ev => langSelect.dispatchEvent(new Event(ev, { bubbles: true })));
                log(`已自动选择语言 ID: ${data.langId}`, "success");
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
