const express = require('express');
const cors = require('cors');
const geminiRoutes = require('./routes/geminiRoutes');
const bodyParser = require('body-parser');
const videorotes = require('./routes/videorotes');
const resumeRoutes = require('./routes/resumeRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes); 
// Routes
app.use('/api/ask', geminiRoutes);



app.use(bodyParser.json());


app.use('/api/gemini',videorotes);

// app.use('api/users', searchRoutes);

app.use('/api/upload', resumeRoutes);

app.post('/graphql', async (req, res) => {
    try {
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': `https://leetcode.com/${req.body.variables.username}/`,
        },
        body: JSON.stringify(req.body),
      });
  
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch profile data' });
    }
  });
  

app.use('/api/user', userRoutes);


  
module.exports = app;