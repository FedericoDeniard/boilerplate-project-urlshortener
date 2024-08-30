require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

url_database = {};

// API endpoint to shorten URL
app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    let shortUrl = uuidv4();
    console.log(`Generated shortUrl: ${shortUrl}`);
    console.log("Original url: " + url);
    url_database[shortUrl] = { original_url: url };

    res.json({ original_url: url, short_url: shortUrl });
  } catch (e) {
    res.json({ error: "invalid url" });
  }
});

// API endpoint to redirect URL based on shortUrl
app.get("/api/shorturl/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;
  if (url_database[shortUrl]) {
    console.log(`Redirecting to: ${url_database[shortUrl].original_url}`);
    res.redirect(url_database[shortUrl].original_url);
  } else {
    res.json({ error: "invalid url" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
