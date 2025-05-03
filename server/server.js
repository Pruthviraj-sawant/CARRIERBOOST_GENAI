// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post('/generate', async (req, res) => {
//   const { prompt } = req.body;

//   try {
//     const response = await axios.post(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [{ parts: [{ text: prompt }] }]
//       }
//     );

//     const generatedText = response.data.candidates[0].content.parts[0].text;
//     res.json({ text: generatedText });

//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('DB connection error', err));
