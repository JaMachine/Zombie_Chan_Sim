// 1. БАЗА ДАННЫХ СЮЖЕТА (Граф кадра/выборов)
const storyData = {
    // ------------------------------------------------------------------
    // СТАРТ И ОСНОВНЫЕ ШАГИ (step_001 ... step_010)
    // ------------------------------------------------------------------
    start: {
        text: "Ты случайно встретил ее лицом к лицу. Что ты скажешь?",
        image: "images/start",
        audio: "audio/voice-01.opus",
        choices: [
            { text: "Привет", target: "step_001" },
            { text: "Пока", target: "fail_001" },
            { text: "Изыди", target: "step_002" },
            { text: " . . . ", target: "fail_002" }
        ]
    },

    step_001: {
        text: "Привет) А ты кто?",
        image: "piccha_000",
        audio: "audio/voice-01.opus",
        choices: [
            { text: "Я рэпер", target: "fail_003" },
            { text: "Я нефор", target: "step_002" },
            { text: "Я хочу с тобой познакомится", target: "step_003" },
            { text: "Я инцел", target: "fail_004" }
        ]
    },

    step_002: {
        text: "Текст для step_002...",
        image: "",
        audio: "",
        choices: [
            { text: "Вариант 1", target: "step_003" },
            { text: "Вариант 2", target: "fail_001" },
            { text: "Вариант 3", target: "fail_002" },
            { text: "Вариант 4", target: "fail_003" }
        ]
    },

    step_003: {
        text: "Текст для step_003...",
        image: "",
        audio: "",
        choices: [
            { text: "Вариант 1", target: "step_004" },
            { text: "Вариант 2", target: "fail_004" },
            { text: "Вариант 3", target: "fail_005" },
            { text: "Вариант 4", target: "fail_006" }
        ]
    },

    step_004: {
        text: "Текст для step_004...",
        image: "",
        audio: "",
        choices: [
            { text: "Вариант 1", target: "step_005" },
            { text: "Вариант 2", target: "fail_005" },
            { text: "Вариант 3", target: "fail_006" },
            { text: "Вариант 4", target: "fail_007" }
        ]
    },

    step_005: {
        text: "Текст для step_005...",
        image: "",
        audio: "",
        choices: [
            { text: "Вариант 1", target: "step_006" },
            { text: "Вариант 2", target: "fail_006" },
            { text: "Вариант 3", target: "fail_007" },
            { text: "Вариант 4", target: "fail_008" }
        ]
    },

    step_006: {
        text: "Текст для step_006...",
        image: "",
        audio: "",
        choices: [
            { text: "Вариант 1", target: "step_007" },
            { text: "Вариант 2", target: "fail_007" },
            { text: "Вариант 3", target: "fail_008" },
            { text: "Вариант 4", target: "fail_009" }
        ]
    },

    step_007: {
        text: "Текст для step_007...",
        image: "",
        audio: "",
        choices: [
            { text: "Вариант 1", target: "step_008" },
            { text: "Вариант 2", target: "fail_008" },
            { text: "Вариант 3", target: "fail_009" },
            { text: "Вариант 4", target: "fail_010" }
        ]
    },

    step_008: {
        text: "Текст для step_008...",
        image: "",
        audio: "",
        choices: [
            { text: "Вариант 1", target: "step_009" },
            { text: "Вариант 2", target: "fail_009" },
            { text: "Вариант 3", target: "fail_010" },
            { text: "Вариант 4", target: "fail_001" }
        ]
    },

    step_009: {
        text: "Текст для step_009...",
        image: "",
        audio: "",
        choices: [
            { text: "Вариант 1", target: "step_010" },
            { text: "Вариант 2", target: "fail_010" },
            { text: "Вариант 3", target: "fail_002" },
            { text: "Вариант 4", target: "fail_003" }
        ]
    },

    step_010: {
        text: "Кульминация! Финальный выбор пред твоим взором.",
        image: "",
        audio: "",
        choices: [
            { text: "Идеальный вариант", target: "win_end" },
            { text: "Ошибиться в конце 1", target: "fail_008" },
            { text: "Ошибиться в конце 2", target: "fail_009" },
            { text: "Ошибиться в конце 3", target: "fail_010" }
        ]
    },


    // ------------------------------------------------------------------
    // ВЕТКИ ПРОИГРЫШЕЙ (fail_001 ... fail_010)
    // ------------------------------------------------------------------
    fail_001: {
        text: "ПРОИГРЫШ [fail_001]: Ты попрощался на старте. Гениально.",
        image: "fail_000",
        audio: "",
        isEnding: true
    },

    fail_002: {
        text: "ПРОИГРЫШ [fail_002]: Пока ты тупил, девушка ушла. Ты лоханулся.",
        image: "fail_000",
        audio: "",
        isEnding: true
    },

    fail_003: {
        text: "ПРОИГРЫШ [fail_003]: Твой рэп никого не впечатлил.",
        image: "",
        audio: "",
        isEnding: true
    },

    fail_004: {
        text: "ПРОИГРЫШ [fail_004]: Текст для фейла 004...",
        image: "fail_000",
        audio: "",
        isEnding: true
    },

    fail_005: {
        text: "ПРОИГРЫШ [fail_005]: Текст для фейла 005...",
        image: "fail_000",
        audio: "",
        isEnding: true
    },

    fail_006: {
        text: "ПРОИГРЫШ [fail_006]: Текст для фейла 006...",
        image: "fail_000",
        audio: "",
        isEnding: true
    },

    fail_007: {
        text: "ПРОИГРЫШ [fail_007]: Текст для фейла 007...",
        image: "fail_000",
        audio: "",
        isEnding: true
    },

    fail_008: {
        text: "ПРОИГРЫШ [fail_008]: Текст для фейла 008...",
        image: "fail_000",
        audio: "",
        isEnding: true
    },

    fail_009: {
        text: "ПРОИГРЫШ [fail_009]: Текст для фейла 009...",
        image: "fail_000",
        audio: "",
        isEnding: true
    },

    fail_010: {
        text: "ПРОИГРЫШ [fail_010]: Текст для фейла 010...",
        image: "fail_000",
        audio: "",
        isEnding: true
    },


    // ------------------------------------------------------------------
    // УСПЕШНЫЙ ФИНАЛ
    // ------------------------------------------------------------------
    win_end: {
        text: "ПОБЕДА: Ты прошли игру до конца и получил идеальный финал!",
        image: "",
        audio: "",
        isEnding: true
    }
};

// 2. ССЫЛКИ НА DOM-ЭЛЕМЕНТЫ
const ui = {
    text: document.getElementById('story-text'),
    image: document.getElementById('scene-image'),
    choices: document.getElementById('choices-container'),
    audio: document.getElementById('voice-player')
};

// ХЕЛПЕР: АВТОМАТИЧЕСКОЕ ИСПРАВЛЕНИЕ ПУТИ К КАРТИНКЕ
function formatImagePath(path) {
    if (!path) return '';
    
    let result = path;
    
    // Если путь не начинается с 'images/' и не является абсолютной ссылкой, добавляем папку
    if (!result.startsWith('images/') && !result.startsWith('/') && !result.startsWith('http')) {
        result = 'images/' + result;
    }
    
    // Если нет расширения (.webp, .png, .jpg, .jpeg, .gif), подставляем по умолчанию .webp
    if (!/\.(webp|png|jpg|jpeg|gif)$/i.test(result)) {
        result += '.webp'; // Измени на '.png', если файлы формата PNG
    }
    
    return result;
}

// 3. ФУНКЦИЯ РЕНДЕРА КАДРА
function renderScene(sceneId) {
    const scene = storyData[sceneId];

    if (!scene) {
        console.error(`Кадр "${sceneId}" не найден в storyData!`);
        return;
    }

    // Отрисовка текста
    ui.text.innerText = scene.text;

    // Картинка (форматируем путь перед установкой в src)
    if (scene.image) {
        ui.image.src = formatImagePath(scene.image);
        ui.image.classList.remove('hidden');
    } else {
        ui.image.classList.add('hidden');
    }

    // Озвучка
    if (scene.audio) {
        ui.audio.src = scene.audio;
        ui.audio.play().catch(() => {
            // Игнорируем блокировку автоплея браузером
        });
    } else {
        ui.audio.pause();
    }

    // Очистка кнопок предыдущего кадра
    ui.choices.innerHTML = '';

    // Если это концовка (fail или win)
    if (scene.isEnding) {
        renderEndingUI();
        return;
    }

    // Генерация кнопок выбора
    scene.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.innerText = choice.text;
        btn.addEventListener('click', () => renderScene(choice.target));
        ui.choices.appendChild(btn);
    });
}

// 4. ФУНКЦИЯ ОТРИСОВКИ ФИНАЛА (Соцсети + Кнопки перезапуска)
function renderEndingUI() {
    // Соцсети
    const links = [
        { text: 'YouTube', url: 'https://youtube.com', class: 'btn-secondary' },
        { text: 'Telegram', url: 'https://t.me', class: 'btn-secondary' },
        { text: 'TikTok', url: 'https://tiktok.com', class: 'btn-secondary' }
    ];

    links.forEach(link => {
        const a = document.createElement('a');
        a.className = `btn ${link.class}`;
        a.innerText = link.text;
        a.href = link.url;
        a.target = '_blank';
        ui.choices.appendChild(a);
    });

    // Рестарт
    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn';
    restartBtn.innerText = 'Начать заново';
    restartBtn.addEventListener('click', () => renderScene('start'));
    ui.choices.appendChild(restartBtn);

    // Уход в Google
    const fuckOffBtn = document.createElement('button');
    fuckOffBtn.className = 'btn btn-danger';
    fuckOffBtn.innerText = 'Пойти нахер';
    fuckOffBtn.addEventListener('click', () => {
        window.location.href = 'https://www.google.com/search?q=как+перестать+играть+в+новеллы';
    });
    ui.choices.appendChild(fuckOffBtn);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    renderScene('start');
});