// server.js
// where your node app starts

// init project
const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const ejs = require("ejs");

app.use(bodyParser());
app.use(morgan());
app.use(express.static("public"));

const userProfilesUrl = "https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json";
const usersUrl = "https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json";

let userProfileList = null;
let userList = null

async function loadJsonData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    jsonData = await response.json();
    console.log('JSON data loaded successfully.');
    return jsonData;
  } catch (error) {
    console.error('Error loading JSON data:', error);
  }
}

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/", (request, response) => {
  const userId = request.body.userid;
  const foundUser = userList.find((item) => item.username === userId);
  let template = null;
  let data = null;
  
  if(foundUser === undefined) {
    const errMessage = "Sorry, you are not registed!"
    template = fs.readFileSync(__dirname + "/views/error.ejs", "utf-8");
    data = ejs.render(template, {
      userId: userId,
      errMessage: errMessage
    });
    response.writeHead(200, {"Content-Type": "test/html"});
  } else {
    template = fs.readFileSync(__dirname + "/views/success.ejs", "utf-8");
    data = ejs.render(template, {
      userId: userId
    });
    response.writeHead(200, {"Content-Type": "text/html"});
  }
  console.log("foundItem=", foundUser);
  response.write(data);
  response.end();
});


async function startServer() {
  try {
    userProfileList = await loadJsonData(userProfilesUrl);
    userList = await loadJsonData(usersUrl);

    console.log(userProfileList);
    console.log(userList);

    const listener = app.listen(process.env.PORT || 3000, function () {
      console.log('Your app is listening on port ' + listener.address().port);
    });
  } catch (error) {
    console.error('Error initializing data and starting the server:', error);
  }
}

startServer();