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

// ХЕЛПЕР: ИСПРАВЛЕНИЕ ПУТИ К АУДИО
function formatAudioPath(path) {
    if (!path) return '';
    let result = path;
    if (!result.startsWith('audio/') && !result.startsWith('/') && !result.startsWith('http')) {
        result = 'audio/' + result;
    }
    if (!/\.(mp3|wav|ogg|oga|opus|m4a|webm)$/i.test(result)) {
        result += '.mp3';
    }
    return result;
}

// ХЕЛПЕР: ВОСПРОИЗВЕДЕНИЕ СПЕЦЭФФЕКТОВ
function triggerEffect(effectName) {
    const overlay = document.getElementById('effect-overlay');
    if (!overlay || !effectName) return;

    overlay.className = '';
    void overlay.offsetWidth; // Принудительный reflow

    if (effectName === 'fire') {
        overlay.classList.add('effect-fire');
        setTimeout(() => {
            overlay.classList.remove('effect-fire');
        }, 600);
    } else if (effectName === 'fade') {
        overlay.classList.add('effect-fade');
        setTimeout(() => {
            overlay.classList.remove('effect-fade');
        }, 600);
    }
}

// 3. ФУНКЦИЯ ЗАПУСКА И НАСТРОЙКИ ФОНОВОЙ МУЗЫКИ
function initBGM() {
    if (!ui.bgm) return;

    ui.bgm.volume = 0.2;
    ui.bgm.loop = true;

    let unlocked = false;

    ui.bgm.addEventListener('error', () => {
        console.error('BGM: ошибка загрузки аудиофайла — проверь путь и имя файла.', ui.bgm.error);
    });

    const tryPlayBGM = () => {
        if (unlocked) return;
        ui.bgm.play()
            .then(() => {
                unlocked = true;
                removeUnlockListeners();
            })
            .catch(e => {
                console.log('Фоновая музыка ждёт взаимодействия:', e);
            });
    };

    function removeUnlockListeners() {
        document.removeEventListener('click', tryPlayBGM);
        document.removeEventListener('keydown', tryPlayBGM);
        document.removeEventListener('touchstart', tryPlayBGM);
    }

    document.addEventListener('click', tryPlayBGM);
    document.addEventListener('keydown', tryPlayBGM);
    document.addEventListener('touchstart', tryPlayBGM);

    ui.bgm.addEventListener('pause', () => {
        if (unlocked && !document.hidden) {
            ui.bgm.play().catch(() => {});
        }
    });

    tryPlayBGM();
}

// 4. ФУНКЦИЯ ОТРИСОВКИ КАДРА
function renderScene(sceneId) {
    const scene = storyData[sceneId];

    if (!scene) {
        console.error(`Кадр "${sceneId}" не найден в storyData!`);
        return;
    }

    if (scene.effect) {
        triggerEffect(scene.effect);
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
        ui.audio.currentTime = 0;
        ui.audio.play().catch(e => {
            console.log('Озвучка заблокирована или файл не найден:', e);
        });
    } else {
        ui.audio.pause();
    }

    // Очистка контейнера кнопок
    ui.choices.innerHTML = '';

    // Концовка
    if (scene.isEnding) {
        renderEndingUI();
        return;
    }

    // Генерация кнопок вариантов ответа
    scene.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.innerText = choice.text;
        btn.addEventListener('click', () => renderScene(choice.target));
        ui.choices.appendChild(btn);
    });
}

// 5. ФУНКЦИЯ ОТРИСОВКИ ФИНАЛА (Иконки соцсетей + Кнопки)
function renderEndingUI() {
    // 1. Создаем общий блок для соцсетей
    const socialBlock = document.createElement('div');
    socialBlock.className = 'social-block';

    // Надпись "Ищи ее здесь"
    const socialTitle = document.createElement('div');
    socialTitle.className = 'social-title';
    socialTitle.innerText = 'Ищи её здесь:';
    socialBlock.appendChild(socialTitle);

    // Горизонтальный контейнер под иконки
    const socialIcons = document.createElement('div');
    socialIcons.className = 'social-icons';

    // Список соцсетей (иконки лежат в папке images/)
    const links = [
        { name: 'YouTube', url: 'https://www.youtube.com/@Пуська-килла?sub_confirmation=1', icon: 'images/youtube.webp' },
        { name: 'Telegram', url: 'https://t.me/CAZOROK_BATAKY', icon: 'images/telegram.webp' },
        { name: 'TikTok', url: 'https://www.tiktok.com/@killa_chan67', icon: 'images/tiktok.webp' }
    ];

    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.title = link.name;
        a.className = 'social-link';

        const img = document.createElement('img');
        img.src = link.icon;
        img.alt = link.name;
        img.className = 'social-icon-img';

        a.appendChild(img);
        socialIcons.appendChild(a);
    });

    socialBlock.appendChild(socialIcons);
    ui.choices.appendChild(socialBlock);

    // 2. Кнопка "Начать заново"
    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn';
    restartBtn.innerText = 'Начать заново';
    restartBtn.addEventListener('click', () => renderScene('start'));
    ui.choices.appendChild(restartBtn);

    // 3. Кнопка "Пойти нахер"
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