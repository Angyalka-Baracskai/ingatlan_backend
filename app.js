const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello Ingatlan!');
});

app.get('/ingatlanok', async (req, res) => {
    try {
        let ingatlan = await db.query(
            `SELECT ingatlanok.*, kategoriak.nev FROM ingatlanok JOIN kategoriak ON ingatlanok.kategoria = kategoriak.id;`
        );
        res.status(200).json(ingatlan);
    } catch (error) {
        res.status(500).json({ message: 'Hiba történt az ingatlanok listázása közben', error });
    }
});

app.get('/ingatlanok/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let ingatlan = await db.query(
            `SELECT * FROM ingatlanok WHERE id = ?`,[id]
        );
        res.status(200).json(ingatlan);
    } catch (error) {
        res.status(500).json({ message: 'Hiba történt a ingatlanok listázása közben', error });
    }
});

app.post('/ingatlanok', async (req, res) => {
    const {kategoria, leiras, hirdetesDatuma, tehermentes, ar, kepUrl} = req.body;
    try {
        let ingatlan = await db.query(
            `INSERT INTO ingatlanok (kategoria, leiras, hirdetesDatuma, tehermentes, ar, kepUrl) VALUES (?, ?, ?, ?, ?, ?,?)`, [kategoria, leiras, hirdetesDatuma, tehermentes, ar, kepUrl]
        );
        res.status(201).json(ingatlan);
    } catch (error) {
        res.status(400).json({ message: 'Hiányos adatok', error });
    }
});


app.delete('/ingatlanok/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await db.query(
            `DELETE FROM ingatlanok WHERE id = ?`, [id]
        );
        res.status(204).json({ message: 'ingatlan törölve' });
    } catch (error) {
        res.status(404).json({ message: 'Ingatlan nem létezik', error });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Valami hiba történt az alkalmazásban!' });
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`);
});