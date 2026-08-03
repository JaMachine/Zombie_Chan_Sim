// 1. ХРАНИЛИЩЕ ДАННЫХ СЮЖЕТА
let storyData = {};

// 2. ССЫЛКИ НА DOM-ЭЛЕМЕНТЫ
const ui = {
    speaker: document.getElementById('speaker-name'),
    text: document.getElementById('story-text'),
    image: document.getElementById('scene-image'),
    choices: document.getElementById('choices-container'),
    audio: document.getElementById('voice-player'),
    bgm: document.getElementById('bgm-player'),
    startOverlay: document.getElementById('start-overlay')
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

// 3. ФУНКЦИЯ ЗАПУСКА И НАСТРОЙКИ ФОНОВОЙ МУЗЫКИ С ЗАГЛУШКОЙ
function initBGM() {
    if (!ui.bgm) return;

    ui.bgm.volume = 0.2;
    ui.bgm.loop = true;

    ui.bgm.addEventListener('error', () => {
        console.error('BGM: ошибка загрузки аудиофайла — проверь путь и имя файла.', ui.bgm.error);
    });

    const startGameAction = () => {
        ui.bgm.play()
            .then(() => {
                if (ui.startOverlay) {
                    ui.startOverlay.classList.add('hidden');
                }
                renderScene('start');
            })
            .catch(e => {
                console.log('Не удалось запустить аудио:', e);
                if (ui.startOverlay) {
                    ui.startOverlay.classList.add('hidden');
                }
                renderScene('start');
            });
    };

    if (ui.startOverlay) {
        ui.startOverlay.addEventListener('click', startGameAction, { once: true });
    }
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

    // Отрисовка плашки спикера
    if (scene.speaker) {
        ui.speaker.innerText = scene.speaker;
        ui.speaker.classList.remove('hidden', 'tag-girl', 'tag-voice');
        if (scene.speaker === 'Девушка') {
            ui.speaker.classList.add('tag-girl');
        }else if (scene.speaker === 'Демон') {
            ui.speaker.classList.add('tag-demon');
        }
        else {
            ui.speaker.classList.add('tag-voice');
        }
    } else {
        ui.speaker.classList.add('hidden');
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

    // Генерация кнопок вариантов ответа (с разделением на отдельные span для иконки и текста)
    scene.choices.forEach(choice => {
        const btn = document.createElement('button');
        
        const typeClass = choice.type === 'say' ? 'btn-say' : (choice.type === 'act' ? 'btn-act' : '');
        const icon = choice.type === 'say' ? '💬' : (choice.type === 'act' ? '⚡' : '');
        
        btn.className = `btn ${typeClass}`;
        btn.innerHTML = `<span>${icon}</span><span class="btn-text">${choice.text}</span>`;
        
        btn.addEventListener('click', () => renderScene(choice.target));
        ui.choices.appendChild(btn);
    });
}

// 5. ФУНКЦИЯ ОТРИСОВКИ ФИНАЛА (Иконки соцсетей + Кнопки)
function renderEndingUI() {
    const socialBlock = document.createElement('div');
    socialBlock.className = 'social-block';

    const socialTitle = document.createElement('div');
    socialTitle.className = 'social-title';
    socialTitle.innerText = 'Ищи её здесь:';
    socialBlock.appendChild(socialTitle);

    const socialIcons = document.createElement('div');
    socialIcons.className = 'social-icons';

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

    // Кнопка "Начать заново" (без иконки, текст строго по центру)
    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn';
    restartBtn.innerHTML = `<span class="btn-text" style="margin-right: 0;">Начать заново</span>`;
    restartBtn.addEventListener('click', () => {
        if (ui.bgm) ui.bgm.play().catch(() => {});
        renderScene('start');
    });
    ui.choices.appendChild(restartBtn);

    // Кнопка "Пойти нахер" (текст строго по центру, фак сразу справа от текста)
    const fuckOffBtn = document.createElement('button');
    fuckOffBtn.className = 'btn btn-danger btn-fuck';
    fuckOffBtn.innerHTML = `<span class="btn-text">Пойти нахер</span><span class="btn-icon-right">🖕</span>`;
    fuckOffBtn.addEventListener('click', () => {
        window.location.href = 'https://google.com/search?q=пішов+нахуй';
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
    } catch (error) {
        console.error('Ошибка инициализации игры:', error);
        if (ui.startOverlay) ui.startOverlay.classList.add('hidden');
        ui.text.innerText = 'Не удалось загрузить данные игры. Убедитесь, что запустили через локальный сервер (Live Server).';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});