const express = require("express");

const mysql = require("mysql");
const PORT = process.env.PORT || 8080;
const app = express();
// const endPointRoot = "/API/v1/";

const db = mysql.createPool({
  multipleStatement: true,
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "mydba1",
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type ,Authorization, Content-Length, X-Requset-With",

    true
  );
  next();
});

app.get("/questions/", (req, res) => {
  db.getConnection(function (err, connection) {
    if (err) throw err;
    // let a = "";
    // let b = [];
    connection.query("SELECT * FROM question", (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  });
});

app.post("/questions/", (req, res) => {
  let body = "";
  let question = "";
  let questionNum = "";
  req.on("data", function (chunk) {
    if (chunk != null) {
      body += chunk;
      console.log(body);
      let splitedBody = body.split("/");
      question = splitedBody[0];
      console.log(question);
      db.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(
          "ALTER TABLE question AUTO_INCREMENT = 1",
          (err, result) => {
            if (err) {
              throw err;
            }
            console.log(result);
            // res.send("connected");
          }
        );
        connection.query(
          "SELECT MAX(questionId) FROM  question",
          (err, result) => {
            if (err) {
              throw err;
            }
            let max = result[0]["MAX(questionId)"];
            console.log(result[0]["MAX(questionId)"]);

            // questionNum = result;
            // console.log(result);
            console.log(splitedBody[0]);
            connection.query(
              `Insert into question(question) values("${splitedBody[0]}")`,
              (err, result) => {
                if (err) {
                  throw err;
                }

                console.log(max);
              }
            );

            for (let i = 0; i < (splitedBody.length - 2) / 2; i++) {
              console.log(splitedBody.length);
              if (splitedBody[2 + i * 2] === "true") {
                console.log(splitedBody[2 + i * 2]);
                connection.query(
                  `Insert into choice(question_id,choice,radio) values(${
                    max + 1
                  },
            "${splitedBody[1 + i * 2]}",
            ${1})`,
                  (err, result) => {
                    if (err) {
                      throw err;
                    }
                    console.log(result);
                  }
                );
              } else {
                connection.query(
                  `Insert into choice(question_id,choice,radio) values(${
                    max + 1
                  },
                      "${splitedBody[1 + i * 2]}",
                      ${0})`,
                  (err, result) => {
                    if (err) {
                      throw err;
                    }
                    console.log(result);
                  }
                );
              }
            }
          }
        );
      });
    }
  });
});

app.put("/questions/", (req, res) => {
  let body = "";
  let question = "";
  req.on("data", function (chunk) {
    if (chunk != null) {
      body += chunk;
      console.log(body);
      let splitedBody = body.split("/");
      question = splitedBody[0];
      // console.log(question);
      console.log(splitedBody);
      console.log(splitedBody[3]);
      console.log(splitedBody[4]);
      Boolean(splitedBody[2]);
      console.log(splitedBody.length);
      db.getConnection(function (err, connection) {
        if (err) throw err;
        let choiceId = 0;
        connection.query(
          `SELECT choiceId from choice where question_id =${splitedBody[0]}`,
          (err, result) => {
            if (err) {
              throw error;
            }
            choiceId = result[0]["choiceId"];
            console.log(choiceId);
            connection.query(
              `update question set question = "${splitedBody[1]}" where questionId =${splitedBody[0]}`,
              (err, result) => {
                if (err) {
                  throw error;
                }
              }
            );
            for (let i = 0; i < (splitedBody.length - 3) / 2; i++) {
              console.log(splitedBody[2 + i * 2]);
              connection.query(
                `update choice set choice = "${
                  splitedBody[2 + i * 2]
                }" where choiceId =${choiceId + i}`,
                (err, result) => {
                  if (err) {
                    throw error;
                  }
                  // console.timeLog(result);
                }
              );
              if (splitedBody[3 + i * 2] === "true") {
                connection.query(
                  `update choice set radio = ${1} where choiceId =${
                    choiceId + i
                  }`,
                  (err, result) => {
                    if (err) {
                      throw error;
                    }
                    // console.timeLog(result);
                  }
                );
              } else {
                connection.query(
                  `update choice set radio = ${0} where choiceId =${
                    choiceId + i
                  }`,
                  (err, result) => {
                    if (err) {
                      throw error;
                    }
                    // console.timeLog(result);
                  }
                );
              }
            }
          }
        );
      });
    }
  });
});

app.get("/choices/", (req, res) => {
  db.getConnection(function (err, connection) {
    if (err) throw err;
    // let a = "";
    // let b = [];
    connection.query("SELECT * FROM choice", (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  });
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("Listening to port ", PORT);
});
