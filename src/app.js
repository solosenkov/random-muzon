document.addEventListener('DOMContentLoaded', () => {
    const player = new AudioPlayer();
    const trackProvider = new RandomTrackProvider();
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const filterTags = document.querySelectorAll('.filter-tag');
    const clearFiltersBtn = document.getElementById('clear-filters');

    let searchTimeout = null;

    async function loadAndPlayTrack(track = null) {
        try {
            player.trackNameElement.textContent = 'Загрузка...';
            player.artistNameElement.textContent = '';
            
            if (track) {
                await player.loadTrack(track);
            } else {
                const newTrack = await trackProvider.getRandomTrack();
                await player.loadTrack(newTrack);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            player.trackNameElement.textContent = 'Ошибка загрузки трека';
            player.artistNameElement.textContent = 'Попробуйте еще раз';
        }
    }

    // Обработчик поиска
    searchInput.addEventListener('input', (e) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const query = e.target.value.trim();
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        searchTimeout = setTimeout(async () => {
            try {
                const results = await trackProvider.searchTracks(query);
                searchResults.innerHTML = '';
                
                if (results.length > 0) {
                    results.forEach(track => {
                        const div = document.createElement('div');
                        div.className = 'search-result-item';
                        div.textContent = `${track.artist_name} - ${track.name}`;
                        div.addEventListener('click', () => {
                            loadAndPlayTrack(track);
                            searchResults.style.display = 'none';
                            searchInput.value = '';
                        });
                        searchResults.appendChild(div);
                    });
                    searchResults.style.display = 'block';
                } else {
                    searchResults.style.display = 'none';
                }
            } catch (error) {
                console.error('Ошибка поиска:', error);
            }
        }, 300);
    });

    // Обработчики фильтров
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
            trackProvider.toggleGenre(tag.dataset.genre);
        });
    });

    clearFiltersBtn.addEventListener('click', () => {
        filterTags.forEach(tag => tag.classList.remove('active'));
        trackProvider.clearGenres();
    });

    // Скрываем результаты поиска при клике вне
    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });

    // Обработчики кнопок управления
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