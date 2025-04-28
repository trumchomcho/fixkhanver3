let loadedPlugins = [];

/* Element(s?) */
const splashScreen = document.createElement('splashScreen');

/* Misc Styles */
document.head.appendChild(Object.assign(document.createElement("style"),{innerHTML:"@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}" })); 
document.head.appendChild(Object.assign(document.createElement('style'),{innerHTML:"::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }"}));
document.querySelector("link[rel~='icon']").href = 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';

/* Emmiter */
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(t, e) {
        if (typeof t === "string") t = [t];
        t.forEach(t => {
            if (!this.events[t]) this.events[t] = [];
            this.events[t].push(e);
        });
    }

    off(t, e) {
        if (typeof t === "string") t = [t];
        t.forEach(t => {
            if (this.events[t]) this.events[t] = this.events[t].filter(t => t !== e);
        });
    }

    emit(t, ...e) {
        if (this.events[t]) {
            this.events[t].forEach(t => {
                t(...e);
            });
        }
    }

    once(t, e) {
        if (typeof t === "string") t = [t];
        let s = (...i) => {
            e(...i);
            this.off(t, s);
        };
        this.on(t, s);
    }
}
const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => { 
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') plppdo.emit('domChanged');
    }
}).observe(document.body, { childList: true, subtree: true });

/* Misc Functions */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play(); };
const findAndClickBySelector = selector => {
    const element = document.querySelector(selector);
    if (element) {
        element.click();
        sendToast(`⭕ Đang nhấp vào ${selector}...`, 1000);
    } else {
        console.warn(`Không tìm thấy phần tử: ${selector}`);
    }
};

function sendToast(text, duration = 5000, gravity = 'bottom') {
    Toastify({
        text: text,
        duration: duration,
        gravity: gravity,
        position: "center",
        stopOnFocus: true,
        style: { background: "#000000" }
    }).showToast();
};

async function showSplashScreen() {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:white;font-family:MuseoSans,sans-serif;font-size:30px;text-align:center;";
    splashScreen.innerHTML = '<span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span>';
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 10);
};

async function hideSplashScreen() {
    splashScreen.style.opacity = '0';
    setTimeout(() => splashScreen.remove(), 1000);
};

async function loadScript(url, label) {
    try {
        const response = await fetch(url);
        const script = await response.text();
        loadedPlugins.push(label);
        eval(script);
    } catch (error) {
        console.error(`Lỗi khi tải script: ${label}`, error);
    }
}

async function loadCss(url) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = (error) => reject(error);
        document.head.appendChild(link);
    });
}

/* Main Functions */ 
function setupMain() {
    /* QuestionSpoof */
    (function () {
        const phrases = [ 
            "🔥 Hãy giỏi đi, và sử dụng [dphu dzzdzz](https://github.com/trumchomchotrumchomcho)!",
            "🤍 Được tạo bởi [@im.nix](https://fb.com/dinh.phu.profileprofile).",
            "☄️ Bởi phuphu.",
            "🌟 Đánh dấu dự án trên dbdb!",
            "🪶 Chế độ Lite @ KhanwareMinimal.js",
        ];
        
        const originalFetch = window.fetch;
        
        window.fetch = async function (input, init) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init && init.body) body = init.body;

            try {
                const originalResponse = await originalFetch.apply(this, arguments);
                const clonedResponse = originalResponse.clone();
                const responseBody = await clonedResponse.text();
                let responseObj = JSON.parse(responseBody);

                if (responseObj?.data?.assessmentItem?.item?.itemData) {
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
                        itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false };
                        itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                        itemData.question.widgets = { 
                            "radio 1": { 
                                type: "radio", 
                                options: { 
                                    choices: [ 
                                        { content: "Đáp án đúng.", correct: true }, 
                                        { content: "Đáp án sai.", correct: false } 
                                    ] 
                                } 
                            } 
                        };
                        responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                        sendToast("🔓 Câu hỏi đã được khai thác.", 1000);
                        return new Response(JSON.stringify(responseObj), { status: originalResponse.status, statusText: originalResponse.statusText, headers: originalResponse.headers });
                    }
                }
            } catch (e) {
                console.error('Lỗi trong QuestionSpoof:', e);
            }
            return originalResponse;
        };
    })();

    /* VideoSpoof */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init && init.body) body = init.body;
            if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
                try {
                    let bodyObj = JSON.parse(body);
                    if (bodyObj.variables && bodyObj.variables.input) {
                        const durationSeconds = bodyObj.variables.input.durationSeconds;
                        bodyObj.variables.input.secondsWatched = durationSeconds;
                        bodyObj.variables.input.lastSecondWatched = durationSeconds;
                        body = JSON.stringify(bodyObj);
                        if (input instanceof Request) { input = new Request(input, { body: body }); }
                        else init.body = body; 
                        sendToast("🔓 Video đã được khai thác.", 1000)
                    }
                } catch (e) {
                    console.error('Lỗi trong VideoSpoof:', e);
                }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* MinuteFarm */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init = {}) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init.body) body = init.body;
            if (body && input.url.includes("mark_conversions")) {
                try {
                    if (body.includes("termination_event")) { 
                        sendToast("🚫 Đã chặn giới hạn thời gian.", 1000); 
                        return; 
                    }
                } catch (e) {
                    console.error('Lỗi trong MinuteFarm:', e);
                }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* AutoAnswer */
    (function () {
        const baseSelectors = [
            `[data-testid="choice-icon__library-choice-icon"]`,
            `[data-testid="exercise-check-answer"]`, 
            `[data-testid="exercise-next-question"]`, 
            `._1udzurba`,
            `._awve9b`
        ];
        
        let khanwareDominates = true;
        
        (async () => { 
            while (khanwareDominates) {
                const selectorsToCheck = [...baseSelectors];

                for (const q of selectorsToCheck) {
                    findAndClickBySelector(q);
                    if (document.querySelector(q + "> div") && document.querySelector(q + "> div").innerText === "Xem tóm tắt") {
                        sendToast("🎉 Hoàn thành bài tập!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
                await delay(800);
            }
        })();
    })();

    /* Inject */
    if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { 
        alert("❌ Khanware không thể khởi động!\n\nBạn cần chạy Khanware trên trang Khan Academy! (https://pt.khanacademy.org/)"); 
        window.location.href = "https://pt.khanacademy.org/"; 
    }

    showSplashScreen();

    loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin')
    .then(() => { 
        DarkReader.setFetchMethod(window.fetch); 
        DarkReader.enable(); 
    })
    loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
    loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    .then(async () => {    
        sendToast("🪶 Khanware Minimal đã được inject thành công!");
        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
        await delay(500);
        hideSplashScreen();
        setupMain();
        console.clear();
    });
}
