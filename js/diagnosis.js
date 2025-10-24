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
        "ブラフマー": {
            title: "創造と構想の人",
            desc: "ヒンドゥー三神の一柱である創造神。宇宙や時間の始まりに諸世界とヴェーダを生み出したとされる。四つの顔と四本の腕は四方位と四ヴェーダを象徴し、乗騎の白鳥は洞察と識別の力を示す。言葉と知のはたらきが創造を支えるという理解が根にあり、新しい仕組みや枠組みの設計を得意とする。理念を立ち上げ、抽象度の高い計画を具体化する場面で力を発揮するタイプ。"
        },
        "サラスヴァティー": {
            title: "学びと言葉の探究者",
            desc: "知識と学芸を司る女神。川の女神としての清らかな流れが、後にことばと学びの流れへと結び付けられた。白衣の姿にヴィーナや書物、数珠が添えられ、芸術性と知性と集中の調和を表す。学びの始まりを祝う祭礼が広く行われる。思考を整理し、言語化と記述と練習を通じて力を磨く姿勢が特徴。体系化やわかりやすい表現を積み上げることに喜びを見いだすタイプ。"
        },
        "ガネーシャ": {
            title: "段取り名人の問題解決者",
            desc: "象頭の姿で広く親しまれる守護神。障害を取り除き事の始まりを守る存在として学業や商い、旅立ちに祈られる。折れた牙は完全さへの執着より実行を選ぶ知恵の象徴。大らかな体躯は包容力を示す。先回りの段取りやリスクの芽を早めに摘む配慮に長け、親しみやすさで周囲の緊張を和らげる。小さな成功を重ねて現実的に前進させる現場力が強み。"
        },
        "クリシュナ": {
            title: "魅力と遊び心の戦略家",
            desc: "ヴィシュヌの化身として尊ばれる神。牧童期の無邪気さや笛の音色、ラーダとの物語で人々を惹きつける一方、戦場では為すべきを為す勇気と識別を説く指導者として描かれる。柔らかな魅力と戦略眼が同居し、関係を動かしながら大局へ導く力が持ち味。遊び心で場に余白を生み、難局でも機転と対話で選択肢を広げる。楽しさと倫理観の両立が鍵となるタイプ。"
        },
        "シヴァ": {
            title: "変容をもたらす求道者",
            desc: "破壊と再生、静寂と舞踏を併せ持つ大いなる行者。第三の眼は洞察と焼尽の力を示し、額の三日月は巡る時の象徴。舞い踊る王の姿は無知を踏み鎮め宇宙のリズムを打ち立てる変容そのもの。必要なものだけを残す削ぎ落としと深い集中で本質に迫る。決断の潔さで行き詰まりを破り、新しい秩序を生み直す。混沌の中でも軸を保てるタイプ。"
        },
        "パールヴァティー": {
            title: "安定と献身の土台作り",
            desc: "優しさと強さを兼ね備えた母性の女神。状況に応じて峻厳な守護者としての相を示す一方、家庭と共同体を温かく支える力で敬われる。関係の結び目を育て、暮らしの基盤を整える働きが中核。忍耐と丁寧なケアを積み重ねて大きな流れを変える。周囲の安心と秩序が育つほど自身の力も増す。長期的な繁栄と信頼の土台を築くタイプ。"
        },
        "ハヌマーン": {
            title: "勇気と実行のスペシャリスト",
            desc: "風神の子である猿の英雄。主君への献身、俊敏さ、強靭な体力で困難な使命を果たす物語で知られる。胸の内に主の姿を宿す逸話は無私の忠誠と信仰の象徴。恐れに直面しても仲間のために前進し、偵察と機動力、実行のタイミング判断に秀でる。チームの士気を高め、行動を具体的な成果へ結びつける推進力が持ち味。"
        },
        "ヴィシュヌ": {
            title: "維持と調停の守り人",
            desc: "宇宙の維持を担う神。世界が乱れるたびに多様な化身として現れ、正義と秩序を回復する役割を負う。蛇王の背に憩う像や円盤と金剛杵は保護と見通しの象徴。継続の仕組みづくりや調停に強く、複数の利害を整えながら堅実に運用する力量を持つ。レビューと改善を重ねるほど成果が安定し、長期の信頼を築けるタイプ。"
        },
        "ラクシュミー": {
            title: "豊かさと美の引力",
            desc: "富と繁栄と吉祥を司る女神。蓮に立つ気高い姿と流れる金貨は物心両面の豊穣を表す。秩序ある繁栄を支える存在として家庭や商いの守護神として広く敬われる。清潔さと調和、分かち合いへの姿勢が恵みの循環を導くという教えが基盤。審美眼と歓待の心で場に余裕と喜びをもたらし、人が集う環境を整えるタイプ。"
        }
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
        "ハヌマーン": "俊敏な実行力と献身で道を拓く。仲間を支える頼れる英雄",
        "サラスヴァティー": "言葉と学びの流れを導く女神。知性と芸術の成長を守る",
        "シヴァ": "静と動を統べる求道者。不要を手放し再生へ導く変容の神",
        "ヴィシュヌ": "秩序を保ち調停する守護者。継続の力で価値を守り育てる",
        "ブラフマー": "宇宙を構想する創造神。発想を仕組みに変える起点となる",
        "ラクシュミー": "美と繁栄を招く吉祥の女神。整え分かち合い豊かさ巡らす",
        "ガネーシャ": "障害を除き始まりを守る守護神。段取りと現実解で進める",
        "パールヴァティー": "優しさと強さで基盤を整える女神。関係と暮らしの柱",
        "クリシュナ": "魅力と機知で人を動かす神。遊び心と戦略で大局へ導く"
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
        const src = PORTRAIT[deityName] || "img/kamisama_white.png";
        imgEl.onerror = () => { imgEl.src = "img/kamisama_white.png"; };
        imgEl.src = src;
        imgEl.alt = deityName ? `${deityName}のイラスト` : "";
    }

    // ===== ページ別ハンドラ =====
    // 診断フォーム（diagnosis_form.html）
    // ====== 診断フォーム（diagnosis_form.html） ======
    function handleFormPage() {
        const btn = document.getElementById('quizSubmitBtn');
        if (!btn) return;

        // 未回答の設問を視覚的に示す（任意だが便利）
        function focusFirstUnanswered(i, radios) {
            // ラッパー（質問ブロック）を赤枠にする例
            const block = radios?.[0]?.closest('.question') || radios?.[0]?.closest('fieldset');
            if (block) {
                block.classList.add('is-error');
                // 他のエラー解除
                document.querySelectorAll('.question.is-error, fieldset.is-error')
                    .forEach(el => { if (el !== block) el.classList.remove('is-error'); });
                block.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        function collectAnswers() {
            const ab = [];
            for (let i = 1; i <= 8; i++) {
                const name = `q${i}`;
                const radios = Array.from(document.querySelectorAll(`input[name="${name}"]`));
                if (radios.length < 2) {
                    throw new Error(`設問${i}の選択肢が見つかりません`);
                }
                const aVal = radios[0].value;          // 先頭 = A
                const checked = radios.find(r => r.checked);
                if (!checked) {
                    // ここで例外を投げる前に、見つけやすくする
                    focusFirstUnanswered(i, radios);
                    throw new Error(`設問${i}が未回答です`);
                }
                ab.push(checked.value === aVal ? 'A' : 'B');
            }
            // クリア時は赤枠を全解除
            document.querySelectorAll('.question.is-error, fieldset.is-error')
                .forEach(el => el.classList.remove('is-error'));
            return ab.join('');
        }

        btn.addEventListener('click', (e) => {
            // まず全ての既定動作/伝播を止める（親の data-next ナビも無効化）
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            try {
                const answersAB = collectAnswers();   // 未回答があればここで throw
                const result = diagnoseFromAnswers(answersAB);
                sessionStorage.setItem('diagnosisResult', JSON.stringify(result));

                // ここまで来たら“成功時のみ”手動で遷移
                const host = btn.closest('[data-next]');
                const url = host ? host.getAttribute('data-next') : 'diagnosis_result.html';
                location.href = url;
            } catch (err) {
                // 失敗時はアラートを出すだけで、その場にとどまる（遷移しない）
                alert(err.message || String(err));
                // 念のため、ここでもう一度完全停止
                return false;
            }
        }, true); // ← capture フェーズで先に食うことで他ハンドラより優先して止める
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


