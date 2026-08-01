// 1. ХРАНИЛИЩЕ ДАННЫХ СЮЖЕТА
let storyData = {};

// 2. ССЫЛКИ НА DOM-ЭЛЕМЕНТЫ
const ui = {
    text: document.getElementById('story-text'),
    image: document.getElementById('scene-image'),
    choices: document.getElementById('choices-container'),
    audio: document.getElementById('voice-player'),
    bgm: document.getElementById('bgm-player') // Ссылка на фоновую музыку
};

// ХЕЛПЕР: АВТОМАТИЧЕСКОЕ ИСПРАВЛЕНИЕ ПУТИ К КАРТИНКЕ
function formatImagePath(path) {
    if (!path) return '';
    let result = path;
    if (!result.startsWith('images/') && !result.startsWith('/') && !result.startsWith('http')) {
        result = 'images/' + result;
    }
    if (!/\.(webp|png|jpg|jpeg|gif)$/i.test(result)) {
        result += '.webp';
    }
    return result;
}

// 3. ФУНКЦИЯ ЗАПУСКА И НАСТРОЙКИ ФОНОВОЙ МУЗЫКИ
function initBGM() {
    if (!ui.bgm) return;

    // Громкость фона от 0.0 до 1.0 (0.2 = 20%, чтобы фоновая музыка не перебивала озвучку)
    ui.bgm.volume = 0.2;

    // Пытаемся запустить автоплеем
    ui.bgm.play().catch(() => {
        // Если браузер заблокировал автоплей, включаем музыку при первом клике в любом месте страницы
        const unlockAudio = () => {
            ui.bgm.play();
            document.removeEventListener('click', unlockAudio);
        };
        document.addEventListener('click', unlockAudio);
    });
}

// 4. ФУНКЦИЯ ОТРИСОВКИ КАДРА
function renderScene(sceneId) {
    const scene = storyData[sceneId];

    if (!scene) {
        console.error(`Кадр "${sceneId}" не найден в storyData!`);
        return;
    }

    // Отрисовка текста
    ui.text.innerText = scene.text;

    // Картинка
    if (scene.image) {
        ui.image.src = formatImagePath(scene.image);
        ui.image.classList.remove('hidden');
    } else {
        ui.image.classList.add('hidden');
    }

    // Озвучка кадра (голос / реплика)
    if (scene.audio) {
        ui.audio.src = scene.audio;
        ui.audio.play().catch(() => {});
    } else {
        ui.audio.pause();
    }

    // Очистка кнопок предыдущего кадра
    ui.choices.innerHTML = '';

    // Если это концовкa
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

// 5. ФУНКЦИЯ ОТРИСОВКИ ФИНАЛА
function renderEndingUI() {
    const links = [
        { text: 'YouTube', url: 'https://www.youtube.com/@Пуська-килла?sub_confirmation=1', class: 'btn-secondary' },
        { text: 'Telegram', url: 'https://t.me/CAZOROK_BATAKY', class: 'btn-secondary' },
        { text: 'TikTok', url: 'https://www.tiktok.com/@killa_chan67', class: 'btn-secondary' }
    ];

    links.forEach(link => {
        const a = document.createElement('a');
        a.className = `btn ${link.class}`;
        a.innerText = link.text;
        a.href = link.url;
        a.target = '_blank';
        ui.choices.appendChild(a);
    });

    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn';
    restartBtn.innerText = 'Начать заново';
    restartBtn.addEventListener('click', () => renderScene('start'));
    ui.choices.appendChild(restartBtn);

    const fuckOffBtn = document.createElement('button');
    fuckOffBtn.className = 'btn btn-danger';
    fuckOffBtn.innerText = 'Пойти нахер';
    fuckOffBtn.addEventListener('click', () => {
        window.location.href = 'https://www.google.com/search?q=как+перестать+играть+в+новеллы';
    });
    ui.choices.appendChild(fuckOffBtn);
}

// 6. ИНИЦИАЛИЗАЦИЯ И ЗАГРУЗКА JSON
async function initGame() {
    try {
        const response = await fetch('data/story.json');
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
        }

        storyData = await response.json();
        
        // Запускаем музыку и первый кадр
        initBGM();
        renderScene('start');
    } catch (error) {
        console.error('Ошибка инициализации игры:', error);
        ui.text.innerText = 'Не удалось загрузить данные игры. Убедитесь, что запустили через локальный сервер (Live Server).';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});