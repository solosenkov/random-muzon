document.addEventListener('DOMContentLoaded', () => {
    const player = new AudioPlayer();
    const trackProvider = new RandomTrackProvider();

    async function loadAndPlayTrack() {
        try {
            player.trackNameElement.textContent = 'Загрузка...';
            player.artistNameElement.textContent = '';
            const track = await trackProvider.getRandomTrack();
            player.loadTrack(track);
        } catch (error) {
            console.error('Ошибка:', error);
            player.trackNameElement.textContent = 'Ошибка загрузки трека';
            player.artistNameElement.textContent = 'Попробуйте еще раз';
        }
    }

    // Обработчики событий для кнопок
    document.getElementById('play').addEventListener('click', () => {
        if (!trackProvider.getCurrentTrack()) {
            loadAndPlayTrack();
        } else {
            player.play();
        }
    });

    document.getElementById('pause').addEventListener('click', () => {
        player.pause();
    });

    document.getElementById('next').addEventListener('click', () => {
        player.stop();
        loadAndPlayTrack();
    });

    // Обработчик закрытия окна
    document.getElementById('close-btn').addEventListener('click', () => {
        window.close();
    });

    // Добавляем возможность перетаскивания окна
    const titleBar = document.querySelector('.title-bar');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        initialX = e.clientX;
        initialY = e.clientY;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        window.moveTo(
            window.screenX + currentX,
            window.screenY + currentY
        );

        initialX = e.clientX;
        initialY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});