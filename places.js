const axios = require('axios');
require('dotenv').config();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

async function searchPlaces(query, location = '9.03,38.74') {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;

  try {
    const response = await axios.get(url, {
      params: {
        query: query,
        location: location, // e.g. Addis Ababa
        radius: 5000,
        key: GOOGLE_PLACES_API_KEY,
      },
    });

    const places = response.data.results;

    for (const place of places) {
      console.log('📍 Name:', place.name);
      console.log('🗺️ Address:', place.formatted_address);
      console.log('⭐ Rating:', place.rating);
      console.log('🆔 Place ID:', place.place_id);
      console.log('---');
    }

  } catch (error) {
    console.error('Error fetching places:', error.response?.data || error.message);
  }
}

// Example usage
searchPlaces('coffee');
