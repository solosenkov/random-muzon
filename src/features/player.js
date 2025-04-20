class AudioPlayer {
    constructor() {
        this.audioElement = document.getElementById('audio-player');
        this.trackNameElement = document.getElementById('track-name');
        this.artistNameElement = document.getElementById('artist-name');
        this.playButton = document.getElementById('play');
        this.pauseButton = document.getElementById('pause');
        this.nextButton = document.getElementById('next');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.audioElement.addEventListener('ended', () => {
            this.playButton.style.display = 'block';
            this.pauseButton.style.display = 'none';
        });

        this.audioElement.addEventListener('error', () => {
            this.trackNameElement.textContent = 'Ошибка воспроизведения';
            this.playButton.style.display = 'block';
            this.pauseButton.style.display = 'none';
        });
    }

    loadTrack(track) {
        if (!track || !track.audio) {
            throw new Error('Некорректные данные трека');
        }

        this.audioElement.src = track.audio;
        this.trackNameElement.textContent = track.name || 'Без названия';
        this.artistNameElement.textContent = track.artist_name || 'Неизвестный исполнитель';
    }

    play() {
        this.audioElement.play();
        this.playButton.style.display = 'none';
        this.pauseButton.style.display = 'block';
    }

    pause() {
        this.audioElement.pause();
        this.playButton.style.display = 'block';
        this.pauseButton.style.display = 'none';
    }

    stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.playButton.style.display = 'block';
        this.pauseButton.style.display = 'none';
    }
}