const JAMENDO_CLIENT_ID = 'd7d8b9b3'; // Необходимо зарегистрироваться на https://developer.jamendo.com/
const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';

class RandomTrackProvider {
    constructor() {
        this.currentTrack = null;
        this.selectedGenres = new Set();
    }

    async getRandomTrack() {
        try {
            let url = `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=1&boost=popularity_total`;
            
            // Добавляем фильтр по жанрам, если они выбраны
            if (this.selectedGenres.size > 0) {
                const genres = Array.from(this.selectedGenres).join('+');
                url += `&tags=${genres}`;
            }
            
            const offset = Math.floor(Math.random() * 100);
            url += `&offset=${offset}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Ошибка при получении трека');
            }

            const data = await response.json();
            
            if (!data.results || data.results.length === 0) {
                throw new Error('Треки не найдены');
            }

            this.currentTrack = data.results[0];
            return this.currentTrack;
        } catch (error) {
            console.error('Ошибка при получении случайного трека:', error);
            throw error;
        }
    }

    async searchTracks(query) {
        try {
            const url = `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=5&namesearch=${query}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Ошибка при поиске треков');
            }

            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Ошибка при поиске треков:', error);
            throw error;
        }
    }

    toggleGenre(genre) {
        if (this.selectedGenres.has(genre)) {
            this.selectedGenres.delete(genre);
        } else {
            this.selectedGenres.add(genre);
        }
    }

    clearGenres() {
        this.selectedGenres.clear();
    }

    getCurrentTrack() {
        return this.currentTrack;
    }
}