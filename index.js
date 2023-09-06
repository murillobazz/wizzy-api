const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

// This is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());

let campaigns = [
  {
    id: 1,
    title: 'No Rest for the Wicked',
    category: 'Medieval Fantasy',
    characters: [
      { name: 'Thenor', level: 5, race: 'Human', class: 'Warrior' },
      { name: 'Rilla', level: 7, race: 'Elf', class: 'Sorceress' },
      { name: 'Kalsenkart', level: 6, race: 'Dwarf', class: 'Thief' },
      { name: 'Ouen', level: 7, race: 'Elf', class: 'Ranger' },
    ]
  },
  {
    id: 2,
    title: 'Unwanted Guest',
    category: 'Sci-fi',
    characters: [
      { name: 'Jack Trove', level: 1, race: 'Human', class: 'Sharpshooter' },
      { name: 'Olifarr', level: 3, race: 'Engi', class: 'Technician' },
      { name: 'Krrat', level: 2, race: 'Mantis', class: 'Rogue' },
    ]
  },
  
];

app.get('/api/campaigns', (request, response) => {
  response.json(campaigns);
});

app.get('/api/campaigns/:id', (request, response) => {
  const id = Number(request.params.id);
  const campaign = campaigns.find(campaign => campaign.id === id);
  
  if (campaign) {
    response.json(campaign);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/campaigns/:id', (request, response) => {
  const id = Number(request.params.id);
  campaigns = campaigns.filter(campaign => campaign.id !== id);

  response.status(204).end();
})

const generateId = () => {
  const lastId = campaigns.length > 0
  ? Math.max(...campaigns.map(n => n.id))
  : 0

  return lastId + 1;
}

app.post('/api/campaigns', (request, response) => {
  const body = request.body;
  console.log(request.body);

  if (!body.title) {
    return response.status(400).json({
      error: 'title missing'
    });
  };

  const campaign = {
    title: body.title,
    category: body.category,
    characters: body.characters,
    id: generateId()
  }

  campaigns = campaigns.concat(campaign);

  response.json(campaign);
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})