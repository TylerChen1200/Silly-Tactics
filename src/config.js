// src/config.js
const API_ENDPOINT = 'https://your-api-id.execute-api.your-region.amazonaws.com/dev';

export const API_URL = `${API_ENDPOINT}/api/units_items`;

// Then in your component:
import { API_URL } from './config';

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    // Handle your data
  })
  .catch(error => console.error('Error:', error));