const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;

if (!TICKETMASTER_API_KEY) {
  console.error('❌ TICKETMASTER_API_KEY is missing in .env');
  process.exit(1);
}

app.get('/api/ticketmaster/events', async (req, res) => {
  const { keyword = 'music', city = 'New York', size = 10 } = req.query;

  try {
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
      params: {
        apikey: TICKETMASTER_API_KEY,
        keyword,
        city,
        size
      }
    });

    const events = response.data._embedded?.events?.map(event => ({
      id: event.id,
      name: event.name,
      url: event.url,
      date: event.dates?.start?.localDate,
      time: event.dates?.start?.localTime,
      venue: event._embedded?.venues?.[0]?.name,
      address: event._embedded?.venues?.[0]?.address?.line1,
      city: event._embedded?.venues?.[0]?.city?.name,
    })) || [];

    res.json({ events });
  } catch (err) {
    console.error('❌ Error fetching Ticketmaster events:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch Ticketmaster events' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Ticketmaster API server running on http://localhost:${PORT}`);
});
