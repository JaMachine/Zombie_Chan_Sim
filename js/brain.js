// 1. ХРАНИЛИЩЕ ДАННЫХ СЮЖЕТА
let storyData = {};

// 2. ССЫЛКИ НА DOM-ЭЛЕМЕНТЫ
const ui = {
    text: document.getElementById('story-text'),
    image: document.getElementById('scene-image'),
    choices: document.getElementById('choices-container'),
    audio: document.getElementById('voice-player'),
    bgm: document.getElementById('bgm-player')
};

// ХЕЛПЕР: ИСПРАВЛЕНИЕ ПУТИ К КАРТИНКЕ
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

// ХЕЛПЕР: ИСПРАВЛЕНИЕ ПУТИ К АУДИО (Автоматически добавляет .mp3, ЕСЛИ расширения ещё нет)
function formatAudioPath(path) {
    if (!path) return '';
    let result = path;
    if (!result.startsWith('audio/') && !result.startsWith('/') && !result.startsWith('http')) {
        result = 'audio/' + result;
    }
    // БАГ БЫЛ ЗДЕСЬ: в списке расширений не было .opus и .webm.
    // Из-за этого "audio/privet_ti_kto.opus" не проходил проверку и превращался
    // в "audio/privet_ti_kto.opus.mp3" — несуществующий файл, который просто не грузился.
    if (!/\.(mp3|wav|ogg|oga|opus|m4a|webm)$/i.test(result)) {
        result += '.mp3';
    }
    return result;
}

// 3. ФУНКЦИЯ ЗАПУСКА И НАСТРОЙКИ ФОНОВОЙ МУЗЫКИ
function initBGM() {
    if (!ui.bgm) return;

    ui.bgm.volume = 0.2; // Громкость фоновой музыки (20%)
    ui.bgm.loop = true;  // Дублируем через JS — на случай, если атрибут loop в HTML не сработает

    let unlocked = false;

    // Диагностика: если файл реально не грузится (неверный путь, 404, битый файл и т.д.) —
    // теперь это будет видно в консоли, а не тихо проглатываться
    ui.bgm.addEventListener('error', () => {
        console.error('BGM: ошибка загрузки audio/bgm.mp3 — проверь путь к файлу и сам файл.', ui.bgm.error);
    });

    const tryPlayBGM = () => {
        if (unlocked) return;
        ui.bgm.play()
            .then(() => {
                unlocked = true;
                removeUnlockListeners();
            })
            .catch(e => {
                // Не удалось запустить — слушатели НЕ снимаем, попробуем ещё раз
                // при следующем клике/нажатии/тапе (раньше слушатели снимались
                // после первой попытки, даже если она проваливалась — из-за этого
                // музыка могла не заиграть вообще ни разу за сессию)
                console.log('Фоновая музыка пока не может запуститься, ждём взаимодействия:', e);
            });
    };

    function removeUnlockListeners() {
        document.removeEventListener('click', tryPlayBGM);
        document.removeEventListener('keydown', tryPlayBGM);
        document.removeEventListener('touchstart', tryPlayBGM);
    }

    // Слушаем разные виды взаимодействия (клик, клавиатура, тап на мобильных)
    document.addEventListener('click', tryPlayBGM);
    document.addEventListener('keydown', tryPlayBGM);
    document.addEventListener('touchstart', tryPlayBGM);

    // На случай, если браузер сам поставит трек на паузу (бывает на мобильных
    // при сворачивании вкладки/приложения) — пробуем возобновить
    ui.bgm.addEventListener('pause', () => {
        if (unlocked && !document.hidden) {
            ui.bgm.play().catch(() => {});
        }
    });

    // Пробуем запустить сразу — сработает, если у браузера уже есть разрешение
    // на автовоспроизведение (например, высокий Media Engagement Index)
    tryPlayBGM();
}

// 4. ФУНКЦИЯ ОТРИСОВКИ КАДРА
function renderScene(sceneId) {
    const scene = storyData[sceneId];

    if (!scene) {
        console.error(`Кадр "${sceneId}" не найден в storyData!`);
        return;
    }

    // Текст
    ui.text.innerText = scene.text;

    // Картинка
    if (scene.image) {
        ui.image.src = formatImagePath(scene.image);
        ui.image.classList.remove('hidden');
    } else {
        ui.image.classList.add('hidden');
    }

    // Озвучка кадра
    if (scene.audio) {
        ui.audio.src = formatAudioPath(scene.audio);
        ui.audio.currentTime = 0; // Сброс на начало
        ui.audio.play().catch(e => {
            console.log('Озвучка заблокирована или файл не найден:', e);
        });
    } else {
        ui.audio.pause();
    }

    // Очистка кнопок
    ui.choices.innerHTML = '';

    // Концовка
    if (scene.isEnding) {
        renderEndingUI();
        return;
    }

    // Генерация кнопок
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