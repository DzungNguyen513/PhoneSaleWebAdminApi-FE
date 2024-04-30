// File: apiUrl.js
const apiUrlFilePath = '../../assets/ApiUrl/api_url.txt';

async function getApiUrl() {
    try {
        const response = await fetch(apiUrlFilePath);
        if (!response.ok) {
            throw new Error('Failed to fetch API URL');
        }
        const apiUrl = await response.text();
        return apiUrl.trim();
    } catch (error) {
        console.error('Error fetching API URL:', error);
        return null;
    }
}

export { getApiUrl };
