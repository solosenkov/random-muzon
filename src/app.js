document.addEventListener('DOMContentLoaded', () => {
    const player = new AudioPlayer();
    const trackProvider = new RandomTrackProvider();

    async function loadAndPlayTrack() {
        try {
            player.trackNameElement.textContent = 'Загрузка...';
            player.artistNameElement.textContent = '';
            const track = await trackProvider.getRandomTrack();
            player.loadTrack(track);
            player.play();
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
});