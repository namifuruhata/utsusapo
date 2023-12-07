import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/search', async (req, res) => {
    try {
        // const { lat, lon } = req.query;
        const response = await axios.get(`https://map.yahooapis.jp/search/local/V1/localSearch`, {
            params: {
                appid: 'dj00aiZpPWdrdG1UaFZBSU5sbyZzPWNvbnN1bWVyc2VjcmV0Jng9OGM-', // Client ID
                // gc: '01',
                // lat: lat,
                // lon: lon,
                // dist: 10,
                // query:'病院',
                output: 'json'
            }
        });
        res(response.data);
    } catch (error) {
        console.error('Error fetching data: ', error);
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
