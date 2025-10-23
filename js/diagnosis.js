// js/diagnosis.js — 神様診断（8問版）：単一結果／画像差替／スコア非表示
(function () {
    // ===== 定義 =====
    const DEITIES = [
        "ブラフマー", "サラスヴァティー", "ガネーシャ", "クリシュナ",
        "シヴァ", "パールヴァティー", "ハヌマーン", "ヴィシュヌ", "ラクシュミー",
    ];

    // 8問の採点ルール（A/Bで該当神に+1）
    const RULES = [
        { A: ["ハヌマーン", "クリシュナ", "ガネーシャ"], B: ["シヴァ", "サラスヴァティー", "パールヴァティー"] }, // Q1
        { A: ["クリシュナ", "ガネーシャ", "ラクシュミー"], B: ["ヴィシュヌ", "シヴァ", "サラスヴァティー"] },   // Q2
        { A: ["ブラフマー", "ヴィシュヌ"], B: ["ガネーシャ", "ハヌマーン"] },                                       // Q3
        { A: ["シヴァ", "ブラフマー"], B: ["ヴィシュヌ", "ガネーシャ"] },                                             // Q4
        { A: ["ヴィシュヌ", "パールヴァティー"], B: ["シヴァ", "クリシュナ", "ブラフマー"] },                         // Q5
        { A: ["サラスヴァティー", "ラクシュミー", "クリシュナ"], B: ["ヴィシュヌ", "パールヴァティー"] },             // Q6
        { A: ["シヴァ", "サラスヴァティー"], B: ["ラクシュミー", "クリシュナ", "ガネーシャ"] },                       // Q7
        { A: ["ハヌマーン", "クリシュナ"], B: ["シヴァ", "サラスヴァティー", "パールヴァティー"] },                   // Q8
    ];

    // どんな人か / 説明文
    const SUMMARIES = {
        "ブラフマー": { title: "創造と構想の人", desc: "構想力で道を開くタイプ。新規プロジェクトや0→1が得意。" },
        "サラスヴァティー": { title: "学びと言葉の探究者", desc: "知・言語・音の感性が強く、体系化と表現に喜び。" },
        "ガネーシャ": { title: "段取り名人の問題解決者", desc: "親しみやすい現実解タイプ。小さな成功を積み上げる。" },
        "クリシュナ": { title: "魅力と遊び心の戦略家", desc: "楽しさで人を動かし場を回す。社交と戦術のバランス◎。" },
        "シヴァ": { title: "変容をもたらす求道者", desc: "削ぎ落としと集中でブレイクスルー。静けさの中で力を発揮。" },
        "パールヴァティー": { title: "安定と献身の土台作り", desc: "人と暮らしの基盤を整える。芯の強さで支える縁の下の力持ち。" },
        "ハヌマーン": { title: "勇気と実行のスペシャリスト", desc: "フットワーク最強。仲間思いで行動が早い。" },
        "ヴィシュヌ": { title: "維持と調停の守り人", desc: "秩序と継続で価値を守る運用の達人。" },
        "ラクシュミー": { title: "豊かさと美の引力", desc: "人を惹きつける審美眼と余裕。" }
    };

    // Homeダイジェスト用
    const TOPPING = {
        "ハヌマーン": "ドライオレンジピール",
        "サラスヴァティー": "ココナッツフレーク",
        "シヴァ": "黒ごま",
        "ヴィシュヌ": "ブルーマロー",
        "ブラフマー": "ホワイトペッパー",
        "ラクシュミー": "マリーゴールド",
        "ガネーシャ": "ピーナッツ",
        "パールヴァティー": "パプリカパウダー",
        "クリシュナ": "ターメリック"
    };
    const TAGLINE = {
        "ハヌマーン": "勇気と実行、仲間想い",
        "サラスヴァティー": "学び・言葉・表現",
        "シヴァ": "創造的破壊、アイデア",
        "ヴィシュヌ": "秩序と調停、継続力",
        "ブラフマー": "構想力、0→1",
        "ラクシュミー": "美と豊かさ、引力",
        "ガネーシャ": "段取り解決、親しみ",
        "パールヴァティー": "安定と献身、土台作り",
        "クリシュナ": "遊び心と戦略、魅力"
    };

    // 画像パス（※実ファイル名に合わせて調整）
    const PORTRAIT = {
        "ハヌマーン": "img/kamisama_Hanuman.png",
        "サラスヴァティー": "img/kamisama_Saraswati.png",
        "シヴァ": "img/kamisama_Shiva.png",
        "ヴィシュヌ": "img/kamisama_Vishnu.png",
        "ブラフマー": "img/kamisama_Brahma.png",
        "ラクシュミー": "img/kamisama_Lakshmi.png",
        "ガネーシャ": "img/kamisama_Ganesha.png",
        "パールヴァティー": "img/kamisama_Parvati.png",
        "クリシュナ": "img/kamisama_Krishna.png"
    };

    // ===== 基本ロジック =====
    function pickTopOne(scoreObj) {
        // 同点は DEITIES の並び順で先勝ち
        let best = null, bestVal = -Infinity;
        for (const d of DEITIES) {
            const v = scoreObj[d] ?? 0;
            if (v > bestVal) { best = d; bestVal = v; }
        }
        return best;
    }

    function diagnoseFromAnswers(answersAB) {
        const score = Object.fromEntries(DEITIES.map(d => [d, 0]));
        [...answersAB].forEach((ch, i) => {
            (RULES[i][ch] || []).forEach(d => { score[d] += 1; });
        });
        const top = pickTopOne(score); // 単一に絞る
        const max = Math.max(...Object.values(score));
        return { answers: answersAB, score, top, max };
    }

    function readDiagnosisFromSession() {
        try {
            const raw = sessionStorage.getItem('diagnosisResult');
            if (!raw) return null;
            const data = JSON.parse(raw);
            const topName = Array.isArray(data.top) ? data.top[0] : data.top;
            if (!topName) return null;
            return { ...data, top: topName };
        } catch (_) { return null; }
    }

    // ===== 画像セットの共通関数（404時はplaceholder） =====
    function setPortrait(imgEl, deityName) {
        if (!imgEl) return;
        const src = PORTRAIT[deityName] || "img/deities/placeholder.png";
        imgEl.onerror = () => { imgEl.src = "img/deities/placeholder.png"; };
        imgEl.src = src;
        imgEl.alt = deityName ? `${deityName}のイラスト` : "";
    }

    // ===== ページ別ハンドラ =====
    // 診断フォーム（diagnosis_form.html）
    function handleFormPage() {
        const btn = document.getElementById('quizSubmitBtn');
        if (!btn) return;

        function collectAnswers() {
            const ab = [];
            for (let i = 1; i <= 8; i++) {
                const name = `q${i}`;
                const radios = Array.from(document.querySelectorAll(`input[name="${name}"]`));
                if (radios.length < 2) throw new Error(`設問${i}の選択肢が見つかりません`);
                const aVal = radios[0].value;  // 先頭=A
                const checked = radios.find(r => r.checked);
                if (!checked) throw new Error(`設問${i}が未回答です`);
                ab.push(checked.value === aVal ? 'A' : 'B');
            }
            return ab.join("");
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                const answersAB = collectAnswers();
                const result = diagnoseFromAnswers(answersAB);
                sessionStorage.setItem('diagnosisResult', JSON.stringify(result));
                const host = btn.closest('[data-next]');
                const url = host ? host.getAttribute('data-next') : 'diagnosis_result.html';
                location.href = url;
            } catch (err) {
                alert(err.message || String(err));
            }
        });
    }

    // 診断結果ページ（diagnosis_result.html）
    // 診断結果ページ（diagnosis_result.html）
    function handleResultPage() {
        const heroName = document.getElementById('result-name');
        const heroImg = document.getElementById('result-portrait');
        if (!heroName && !heroImg) return; // このページでなければ何もしない

        const data = readDiagnosisFromSession();
        if (!data) {
            if (heroName) heroName.textContent = "未診断";
            setPortrait(heroImg, null);
            return;
        }

        const top = data.top;
        if (heroName) heroName.textContent = top || "未診断";
        setPortrait(heroImg, top);

        // ★ ここから：サブタイトル＝トッピング、説明文の先頭に「◯◯な者」を入れる
        const subtitleEl = document.getElementById('result-subtitle') || document.querySelector('.resultBody__subtitle');
        const descWrap = document.getElementById('result-desc') || document.querySelector('.resultBody__desc');

        const info = SUMMARIES[top] || { title: "", desc: "" };   // title = 旧「◯◯な者」
        const topping = TOPPING[top] || "";                        // トッピング名

        // ② サブタイトルを「トッピング：〇〇」に
        if (subtitleEl) {
            subtitleEl.textContent = topping ? `トッピング：${topping}` : "トッピング";
        }

        // ③ 説明文の先頭に「◯◯な者」を入れてから、続けて本文
        if (descWrap) {
            descWrap.innerHTML = "";
            const p = document.createElement('p');
            // 句読点は好みで。「—」派なら `${info.title} — ${info.desc}` でもOK
            const head = info.title ? `${info.title}。` : "";
            p.textContent = `${head}${info.desc || ""}`;
            descWrap.appendChild(p);
        }
    }


    // Homeの灰色ダイジェスト帯（main.html）
    function handleDigest() {
        const deityEl = document.getElementById('digest-deity');
        const toppingEl = document.getElementById('digest-topping');
        const descEl = document.getElementById('digest-desc');
        const portraitEl = document.getElementById('digest-portrait');
        if (!deityEl && !toppingEl && !descEl && !portraitEl) return;

        const data = readDiagnosisFromSession();
        if (!data) {
            if (deityEl) deityEl.textContent = "未診断";
            if (toppingEl) toppingEl.textContent = "";
            if (descEl) descEl.textContent = "診断してトッピングを提案します";
            setPortrait(portraitEl, null);
            return;
        }
        const top = data.top;
        if (deityEl) deityEl.textContent = top;
        if (toppingEl) toppingEl.textContent = TOPPING[top] ? `　${TOPPING[top]}` : "";
        if (descEl) descEl.textContent = TAGLINE[top] || "あなたらしさを表すキーワード";
        setPortrait(portraitEl, top);
    }

    // ===== 起動 =====
    document.addEventListener('DOMContentLoaded', function () {
        handleFormPage();
        handleResultPage();
        handleDigest();
    });



    // 使い回し用（任意）
    window.chaiDiag = Object.assign(window.chaiDiag || {}, {
        diagnoseFromAnswers,
        readDiagnosisFromSession
    });
})();


