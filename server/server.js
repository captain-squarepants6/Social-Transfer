const express = require("express");
const https = require("https");
const http = require('http');
const fs = require("fs");
const codeRouter = require("./Routes/code");
const githubRouter = require("./Routes/github")
const academiaRouter = require("./Routes/academia")
const shortnerRouter = require("./Routes/shortner")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/html"));

const port = 80;
let server;
if (
  fs.existsSync("/etc/letsencrypt/live/darkbot.eastasia.cloudapp.azure.com/")
) {
  const privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/darkbot.eastasia.cloudapp.azure.com/privkey.pem",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "/etc/letsencrypt/live/darkbot.eastasia.cloudapp.azure.com/cert.pem",
    "utf8"
  );
  const ca = fs.readFileSync(
    "/etc/letsencrypt/live/darkbot.eastasia.cloudapp.azure.com/chain.pem",
    "utf8"
  );

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };

  server = https.createServer(credentials, app);
}

app.use("/", codeRouter);
app.use("/github",githubRouter)
app.use("/academia",academiaRouter)
app.use("/short",shortnerRouter)

if (server) {
  console.log("server");
  server.listen(433, () => {
    console.log(`https Server is running on port ${433}`);
  });
} 
http.createServer(app).listen(port, () => {
    console.log(`http Server is running on port ${port}`);
});

