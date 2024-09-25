const express = require(`express`);
const mongoose = require(`mongoose`);
require(`dotenv`).config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`public`));

app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
})