const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;

if (!EVENTBRITE_TOKEN) {
  console.error("❌ EVENTBRITE_TOKEN missing in .env");
  process.exit(1);
}

app.get('/api/events', async (req, res) => {
  const { keyword = "Nairobi" } = req.query;

  try {
    const response = await axios.get('https://www.eventbriteapi.com/v3/events/search/', {
      headers: {
        Authorization: `Bearer ${EVENTBRITE_TOKEN}`
      },
      params: {
        'location.address': keyword,
        'expand': 'venue',
        'sort_by': 'date'
      }
    });

    const events = response.data.events.map(evt => ({
      id: evt.id,
      name: evt.name.text,
      description: evt.description?.text,
      start: evt.start.local,
      end: evt.end.local,
      url: evt.url,
      venue: evt.venue?.address?.localized_address_display,
    }));

    res.json({ events });
  } catch (err) {
    console.error('Error fetching Eventbrite events:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch Eventbrite events' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Eventbrite API server running on http://localhost:${PORT}`);
});
