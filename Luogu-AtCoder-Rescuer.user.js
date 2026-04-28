// ==UserScript==
// @name         Luogu-AtCoder-Rescuer
// @namespace    http://tampermonkey.net/
// @author KevinHuangIsLearning
// @version      3.7.0
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

    const AT_LANGS = [{"id":"6001","name":"><> (fishr 0.1.0)"},{"id":"6002","name":"Ada 2022 (GNAT 15.2.0)"},{"id":"6003","name":"APL (GNU APL 1.9)"},{"id":"6004","name":"Assembly MIPS O32 ABI (GNU assembler 2.42)"},{"id":"6005","name":"Assembly x64 (NASM 2.16.03)"},{"id":"6006","name":"AWK (GNU awk 5.2.1)"},{"id":"6007","name":"A言語 (interpreter af48a2a)"},{"id":"6008","name":"Bash (bash 5.3)"},{"id":"6009","name":"BASIC (FreeBASIC 1.10.1)"},{"id":"6010","name":"bc (GNU bc 1.08.2)"},{"id":"6011","name":"Befunge93 (TBC 1.0)"},{"id":"6012","name":"Brainfuck (Tritium 1.2.73)"},{"id":"6013","name":"C23 (Clang 21.1.0)"},{"id":"6014","name":"C23 (GCC 14.2.0)"},{"id":"6015","name":"C# 13.0 (.NET 9.0.8)"},{"id":"6016","name":"C# 13.0 (.NET Native AOT 9.0.8)"},{"id":"6017","name":"C++23 (GCC 15.2.0)"},{"id":"6018","name":"C3 (c3c 0.7.5)"},{"id":"6019","name":"Carp(Carp 0.5.5)"},{"id":"6020","name":"cLay (cLay 20250308-1 (GCC 15.2.0))"},{"id":"6021","name":"Clojure (babashka 1.12.208)"},{"id":"6022","name":"Clojure (clojure 1.12.2)"},{"id":"6023","name":"Clojure (Clojure AOT 1.12.2)"},{"id":"6025","name":"Clojure (ClojureScript 1.12.42 (Clojure 1.12.2 Node.js 22.19.0))"},{"id":"6026","name":"COBOL (Free) (GnuCOBOL 3.2)"},{"id":"6027","name":"Common Lisp (SBCL 2.5.8)"},{"id":"6028","name":"Crystal (Crystal 1.17.0)"},{"id":"6029","name":"Cyber (Cyber v0.3)"},{"id":"6030","name":"D (DMD 2.111.0)"},{"id":"6031","name":"D (GDC 15.2)"},{"id":"6032","name":"D (LDC 1.41.0)"},{"id":"6033","name":"Dart (Dart 3.9.2)"},{"id":"6034","name":"dc 1.5.2 (GNU bc 1.08.2)"},{"id":"6035","name":"ECLiPSe (ECLiPSe 7.1_13)"},{"id":"6036","name":"Eiffel (Gobo Eiffel 22.01)"},{"id":"6037","name":"Eiffel (Liberty Eiffel 07829e3)"},{"id":"6038","name":"Elixir (Elixir 1.18.4 (OTP 28.0.2))"},{"id":"6039","name":"Emacs Lisp(Native Compile)(GNU Emacs 29.4)"},{"id":"6040","name":"Emojicode 1.0 beta 2 (emojicodec 1.0 beta 2)"},{"id":"6041","name":"Erlang (Erlang 28.0.2)"},{"id":"6042","name":"F# 9.0 (.NET 9.0.8)"},{"id":"6043","name":"Factor (Factor 0.100)"},{"id":"6044","name":"Fish (fish 4.0.2)"},{"id":"6045","name":"Forth (gforth 0.7.3)"},{"id":"6046","name":"Fortran2018 (Flang 20.1.7)"},{"id":"6047","name":"Fortran2023 (GCC 14.2.0)"},{"id":"6048","name":"FORTRAN77 (GCC 14.2.0)"},{"id":"6049","name":"Gleam (Gleam 1.12.0 (OTP 28.0.2))"},{"id":"6050","name":"Go 1.18 (gccgo 15.2.0)"},{"id":"6051","name":"Go (go 1.25.1)"},{"id":"6052","name":"Haskell (GHC 9.8.4)"},{"id":"6053","name":"Haxe/JVM 4.3.7 (hxjava 4.2.0)"},{"id":"6054","name":"C++ IOI-Style(GNU++20) (GCC 14.2.0)"},{"id":"6055","name":"ISLisp (Easy-ISLisp 5.43)"},{"id":"6056","name":"Java24 (OpenJDK 24.0.2)"},{"id":"6057","name":"JavaScript (Bun 1.2.21)"},{"id":"6058","name":"JavaScript (Deno 2.4.5)"},{"id":"6059","name":"JavaScript (Node.js 22.19.0)"},{"id":"6060","name":"Jule (jule 0.1.6)"},{"id":"6061","name":"Koka (koka v3.2.2)"},{"id":"6062","name":"Kotlin (Kotlin/JVM 2.2.10)"},{"id":"6063","name":"Kuin (kuincl v.2021.8.17)"},{"id":"6064","name":"Lazy K (irori v1.0.0)"},{"id":"6065","name":"Lean (lean v4.22.0)"},{"id":"6066","name":"LLVM IR (Clang 21.1.0)"},{"id":"6067","name":"Lua (Lua 5.4.7)"},{"id":"6068","name":"Lua (LuaJIT 2.1.1703358377)"},{"id":"6069","name":"Mercury (Mercury 22.01.8)"},{"id":"6071","name":"Nim (Nim 1.6.20)"},{"id":"6072","name":"Nim (Nim 2.2.4)"},{"id":"6073","name":"OCaml (ocamlopt 5.3.0)"},{"id":"6074","name":"Octave (GNU Octave 10.2.0)"},{"id":"6075","name":"Pascal (fpc 3.2.2)"},{"id":"6076","name":"Perl (perl 5.38.2)"},{"id":"6077","name":"PHP (PHP 8.4.12)"},{"id":"6078","name":"Piet (your-diary/piet_programming_language 3.0.0) (PPM image)"},{"id":"6079","name":"Pony (ponyc 0.59.0)"},{"id":"6080","name":"PowerShell (PowerShell 7.5.2)"},{"id":"6081","name":"Prolog (SWI-Prolog 9.2.9)"},{"id":"6082","name":"Python (CPython 3.13.7)"},{"id":"6083","name":"Python (PyPy 3.11-v7.3.20)"},{"id":"6084","name":"R (GNU R 4.5.0)"},{"id":"6085","name":"ReasonML (reson 3.16.0)"},{"id":"6086","name":"Ruby 3.3 (truffleruby 25.0.0)"},{"id":"6087","name":"Ruby 3.4 (ruby 3.4.5)"},{"id":"6088","name":"Rust (rustc 1.89.0)"},{"id":"6089","name":"SageMath (SageMath 10.7)"},{"id":"6090","name":"Scala (Dotty 3.7.2)"},{"id":"6091","name":"Scala 3.7.2 (Scala Native 0.5.8)"},{"id":"6092","name":"Scheme (ChezScheme 10.2.0)"},{"id":"6093","name":"Scheme (Gauche 0.9.15)"},{"id":"6094","name":"Seed7 (Seed7 3.5.0)"},{"id":"6095","name":"Swift 6.2"},{"id":"6096","name":"Tcl (tclsh 9.0.1)"},{"id":"6097","name":"Terra (Terra 1.2.0)"},{"id":"6098","name":"TeX (tex 3.141592653)"},{"id":"6099","name":"Text (cat 9.4)"},{"id":"6100","name":"TypeScript 5.8 (Deno 2.4.5)"},{"id":"6101","name":"TypeScript 5.9 (tsc 5.9.2 (Bun 1.2.21))"},{"id":"6102","name":"TypeScript 5.9 (tsc 5.9.2 (Node.js 22.19.0))"},{"id":"6103","name":"Uiua (uiua 0.16.2)"},{"id":"6104","name":"Unison (Unison 0.5.47)"},{"id":"6105","name":"V (0.4.10)"},{"id":"6106","name":"Vala (valac 0.56.18)"},{"id":"6107","name":"Verilog 2012 (Icarus Verilog 12.0)"},{"id":"6108","name":"Veryl (veryl 0.16.4)"},{"id":"6109","name":"WebAssembly (wabt 1.0.34 + iwasm 2.4.1)"},{"id":"6110","name":"Whitespace (whitespacers 1.3.0)"},{"id":"6111","name":"Zig (Zig 0.15.1)"},{"id":"6112","name":"なでしこ (cnako3 3.7.8 (Node.js 22.19.0))"},{"id":"6113","name":"プロデル (mono版プロデル 2.0.1353)"},{"id":"6114","name":"Julia (Julia 1.11.6)"},{"id":"6115","name":"Python (Codon 0.19.3)"},{"id":"6116","name":"C++23 (Clang 21.1.0)"},{"id":"6117","name":"Fix (1.1.0-alpha.12)"},{"id":"6118","name":"SQL (DuckDB 1.3.2)"}];

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
                        const langId = document.getElementById('at-rescue-lang-select')?.value || "6017";

                        if (code && code.trim() && match) {
                            const taskId = match[1].toLowerCase();
                            const contestId = taskId.split('_')[0];
                            log(`准备提交: ${taskId}, 语言ID: ${langId}`, "info");
                            GM_setValue('at_rescue_data', { taskId, code, langId });
                            window.open(`https://atcoder.jp/contests/${contestId}/submit?RMJ=1&task=${taskId}`, '_blank');
                        } else {
                            throw new Error("提取代码失败，请确认编辑器已有内容。");
                        }
                    } catch (e) {
                        alert("同步失败：" + e.message);
                    }
                });

                // 只有在成功替换提交按钮后，才替换语言选择器
                const langWrapper = document.querySelector('.combo-wrapper');
                if (langWrapper && !langWrapper.dataset.handled) {
                    langWrapper.dataset.handled = "true";
                    log("已捕获语言选择器", "success");

                    langWrapper.style.display = 'none';
                    const fakeLang = document.createElement('select');
                    fakeLang.id = 'at-rescue-lang-select';
                    fakeLang.style.cssText = 'height: 32px; width: 300px; padding: 0 5px; border: 1px solid #ddd; border-radius: 4px; outline: none; margin-right: 10px;';
                    
                    AT_LANGS.forEach(l => {
                        const opt = document.createElement('option');
                        opt.value = l.id;
                        opt.innerText = l.name;
                        if (l.id === "6017") opt.selected = true;
                        fakeLang.appendChild(opt);
                    });

                    langWrapper.parentNode.insertBefore(fakeLang, langWrapper);
                }
            }

        };
        setInterval(injectLogic, 500);

    // --- 2. AtCoder 侧逻辑 ---
    } else if (location.host === 'atcoder.jp') {
        const data = GM_getValue('at_rescue_data');
        if (!data || !location.search.includes('RMJ=1')) return;

        const isDebug = location.search.includes('debug');
        const SHOULD_TIMEOUT = isDebug ? 3000 : 10000;

        // 核心改动：上移 top 值
        GM_addStyle(`
            #rmj-hijack-layer {
                position: fixed !important; inset: 0 !important;
                background: rgba(255, 255, 255, 0.7) !important;
                backdrop-filter: blur(12px) !important;
                -webkit-backdrop-filter: blur(12px) !important;
                z-index: 999990 !important;
                display: flex !important; flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
            }
            .rmj-container {
                display: flex !important; flex-direction: row !important;
                align-items: center !important; justify-content: center !important;
                gap: 15px !important;
                z-index: 999992 !important;
                margin-top: -15vh !important;
            }
            .rmj-title {
                font-family: sans-serif !important; font-size: 28px !important;
                font-weight: 600 !important; color: #000 !important;
                margin: 0 !important;
            }
            .rmj-manual-submit {
                font-family: sans-serif !important; font-size: 16px !important;
                color: #3498db !important; cursor: pointer !important;
                margin-top: 20px !important;
                text-decoration: underline !important;
                z-index: 999992 !important;
                display: none !important;
            }
            .rmj-manual-submit:hover {
                color: #2980b9 !important;
            }
            .rmj-loader {
                width: 32px !important; height: 32px !important;
                border: 4px solid rgba(0,0,0,0.1) !important;
                border-top: 4px solid #3498db !important;
                border-radius: 50% !important;
                animation: rmj-spin 1s linear infinite !important;
            }
            @keyframes rmj-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            /* 验证码位置下移：从 45% 移到 58% */
            .cf-challenge, iframe[src*="challenges.cloudflare.com"] {
                position: fixed !important; top: 58% !important; left: 50% !important;
                transform: translate(-50%, -50%) !important; z-index: 1000000 !important;
            }
            @media (prefers-color-scheme: dark) {
                #rmj-hijack-layer {
                    background: rgba(0, 0, 0, 0.7) !important;
                }
                .rmj-title {
                    color: #fff !important;
                }
                .rmj-loader {
                    border-color: rgba(255, 255, 255, 0.1) !important;
                    border-top-color: #3498db !important;
                }
                .rmj-manual-submit {
                    color: #5dade2 !important;
                }
                .rmj-manual-submit:hover {
                    color: #85c1e9 !important;
                }
            }
        `);

        let isFailed = false;
        let isSuccess = false;
        let timeoutTimer = null;

        const autoProcess = () => {
            if (isFailed) return;
            if (!document.getElementById('rmj-hijack-layer')) {
                const layer = document.createElement('div');
                layer.id = 'rmj-hijack-layer';
                layer.innerHTML = `
                    <div class="rmj-container">
                        <div class="rmj-loader"></div>
                        <div class="rmj-title" id="rmj-msg">请准备大战机器人</div>
                    </div>
                    <div class="rmj-manual-submit"></div>
                `;
                document.documentElement.appendChild(layer);
            }

            try {
                const msgEl = document.getElementById('rmj-msg');
                const hasShield = isDebug ? false : (document.querySelector('.cf-turnstile') || document.querySelector('iframe[src*="challenges.cloudflare.com"]'));
                if (hasShield && msgEl && msgEl.innerText === "请准备大战机器人") {
                    msgEl.innerText = "请大战机器人";
                    const manualSubmit = document.querySelector('.rmj-manual-submit');
                    if (manualSubmit && !manualSubmit.dataset.hooked) {
                        manualSubmit.dataset.hooked = 'true';
                        manualSubmit.textContent = '切换到手动模式';
                        manualSubmit.style.display = 'block';
                        manualSubmit.addEventListener('click', () => {
                            if (timeoutTimer) clearTimeout(timeoutTimer);
                            isFailed = true;
                            clearInterval(checkInterval);
                            const layer = document.getElementById('rmj-hijack-layer');
                            if (layer) {
                                layer.style.transition = "opacity 0.5s";
                                layer.style.opacity = "0";
                                setTimeout(() => {
                                    layer.remove();
                                    log("已切换到手动模式", "info");
                                }, 500);
                            }
                        });
                    }
                }

                // 自动选题
                const taskSelect = document.querySelector('select#select-task');
                if (taskSelect && taskSelect.value !== data.taskId) {
                    taskSelect.value = data.taskId;
                    if (window.$) window.$('#select-task').trigger('change');
                }

                // 自动选语言
                const langSelect = document.querySelector('select[name="data.LanguageId"]');
                let langReady = false;
                if (langSelect) {
                    const targetValue = data.langId || "6017";
                    if (langSelect.value !== targetValue) {
                        log(`自动选择语言 ID: ${targetValue}`, "success");
                        langSelect.value = targetValue;
                        if (window.$) window.$('select[name="data.LanguageId"]').trigger('change');
                    } else {
                        langReady = true;
                    }
                }

                // 代码注入
                let codeReady = false;
                if (typeof unsafeWindow !== 'undefined' && unsafeWindow.ace) {
                    const editor = unsafeWindow.ace.edit("editor");
                    if (editor) {
                        if (editor.getValue().length < 5) {
                            editor.setValue(data.code, 1);
                        } else {
                            codeReady = true;
                        }
                    }
                }

                // 提交触发
                const token = document.querySelector('input[name="cf-turnstile-response"]');
                if (!isFailed && token && token.value.length > 20) {
                    if (msgEl) {
                        msgEl.innerText = "正在提交...";
                        msgEl.style.color = "#2ecc71";
                    }
                    const loader = document.querySelector('.rmj-loader');
                    if (loader) loader.style.display = 'none';
                    isSuccess = true;
                    clearInterval(checkInterval);
                    setTimeout(() => {
                        GM_deleteValue('at_rescue_data');
                        document.querySelector('button#submit')?.click();
                    }, 1000);
                }
            } catch (e) {
                isFailed = true;
                log("发生错误: " + e.message, "error");
            }
        };

        const checkInterval = setInterval(autoProcess, 500);

        // 10秒超时逻辑：未检测到CF盾则直接提交，有盾则继续等待
        timeoutTimer = setTimeout(() => {
            if (isSuccess || isFailed) return;
            const hasShield = isDebug ? false : (document.querySelector('.cf-turnstile') || document.querySelector('iframe[src*="challenges.cloudflare.com"]'));
            if (!hasShield) {
                log("未检测到CF盾，尝试直接提交" + (isDebug ? " [DEBUG模拟]" : ""), "warn");
                isSuccess = true;
                const msg = document.getElementById('rmj-msg');
                const loader = document.querySelector('.rmj-loader');
                if (loader) loader.style.display = 'none';
                if (msg) msg.innerText = "正在提交...";
                clearInterval(checkInterval);
                setTimeout(() => {
                    document.querySelector('button#submit')?.click();
                    GM_deleteValue('at_rescue_data');
                    const layer = document.getElementById('rmj-hijack-layer');
                    if (layer) {
                        layer.style.transition = "opacity 0.5s";
                        layer.style.opacity = "0";
                        setTimeout(() => {
                            layer.remove();
                            log("自动提交完成，已移除劫持层", "info");
                        }, 500);
                    }
                }, 500);
            } else {
                log("CF盾已加载，继续等待验证", "info");
            }
        }, SHOULD_TIMEOUT);

        setTimeout(() => clearInterval(checkInterval), 60000);
    }
})();
