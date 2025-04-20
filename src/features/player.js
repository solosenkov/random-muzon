class AudioPlayer {
    constructor() {
        this.audioElement = new Audio();
        this.trackNameElement = document.getElementById('track-name');
        this.artistNameElement = document.getElementById('artist-name');
        this.playButton = document.getElementById('play');
        this.pauseButton = document.getElementById('pause');
        this.nextButton = document.getElementById('next');
        this.progressBar = document.getElementById('progress');
        this.currentTimeElement = document.getElementById('current-time');
        this.durationElement = document.getElementById('duration');
        
        this.isPlaying = false;
        this.currentTrack = null;
        
        this.setupEventListeners();
        this.connectToBackground();
    }

    connectToBackground() {
        this.port = chrome.runtime.connect({ name: 'audio-port' });
    }

    setupEventListeners() {
        this.audioElement.addEventListener('timeupdate', () => {
            this.updateProgress(this.audioElement.currentTime, this.audioElement.duration);
        });

        this.audioElement.addEventListener('ended', () => {
            this.playButton.style.display = 'block';
            this.pauseButton.style.display = 'none';
            this.isPlaying = false;
        });

        this.audioElement.addEventListener('error', () => {
            this.trackNameElement.textContent = 'Ошибка воспроизведения';
            this.playButton.style.display = 'block';
            this.pauseButton.style.display = 'none';
        });

        document.querySelector('.progress-bar').addEventListener('click', (e) => {
            if (!this.currentTrack) return;
            
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            
            this.audioElement.currentTime = this.audioElement.duration * percentage;
        });
    }

    formatTime(seconds) {
        if (!seconds) return '0:00';
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateProgress(currentTime, duration) {
        const progress = (currentTime / duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentTimeElement.textContent = this.formatTime(currentTime);
        this.durationElement.textContent = this.formatTime(duration);
    }

    async loadTrack(track) {
        if (!track || !track.audio) {
            throw new Error('Некорректные данные трека');
        }

        this.currentTrack = track;
        this.trackNameElement.textContent = track.name || 'Без названия';
        this.artistNameElement.textContent = track.artist_name || 'Неизвестный исполнитель';
        
        try {
            this.audioElement.src = track.audio;
            await this.audioElement.play();
            this.isPlaying = true;
            this.playButton.style.display = 'none';
            this.pauseButton.style.display = 'block';
            
            // Уведомляем background script о новом треке
            this.port.postMessage({ 
                type: 'trackUpdate',
                track: track
            });
        } catch (error) {
            console.error('Ошибка загрузки трека:', error);
            this.trackNameElement.textContent = 'Ошибка загрузки';
            throw error;
        }
    }

    play() {
        if (!this.currentTrack) return;
        
        this.audioElement.play();
        this.isPlaying = true;
        this.playButton.style.display = 'none';
        this.pauseButton.style.display = 'block';
    }

    pause() {
        this.audioElement.pause();
        this.isPlaying = false;
        this.playButton.style.display = 'block';
        this.pauseButton.style.display = 'none';
    }

    stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.isPlaying = false;
        this.playButton.style.display = 'block';
        this.pauseButton.style.display = 'none';
        this.updateProgress(0, 0);
    }
}