const JAMENDO_CLIENT_ID = 'd7d8b9b3'; // Необходимо зарегистрироваться на https://developer.jamendo.com/
const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';

class RandomTrackProvider {
    constructor() {
        this.currentTrack = null;
    }

    async getRandomTrack() {
        try {
            const offset = Math.floor(Math.random() * 100); // Получаем случайное смещение
            const response = await fetch(
                `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=1&offset=${offset}&boost=popularity_total`
            );
            
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

    getCurrentTrack() {
        return this.currentTrack;
    }
}