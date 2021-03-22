const xhttp = new XMLHttpRequest();
let params = "question1/choice1/true";
const endPointRoot = "http://localhost:8080/";

getAll();
getChoice();

checkNoElement();

let oneTime = 0;

var stringJSON = localStorage.getItem("totalQuestion");
let retrivedtotalQ = JSON.parse(stringJSON);
let totalQ = parseInt(retrivedtotalQ.length);

var stringJSON = localStorage.getItem("totalChoice");
let retrivedtotalC = JSON.parse(stringJSON);
let totalC = parseInt(retrivedtotalC);
let counter = totalQ - 1;
if (counter > 0) {
  console.log(totalQ);
  let counterNum = 0;
  let i = 0;
  console.log(counter);

  while (counterNum < counter) {
    console.log("hit");
    console.log(counterNum);
    createQuestionHeadLine(counterNum);

    createTextAreaWithValue(retrivedtotalQ, counterNum);
    createNewLine();

    console.log(
      parseInt(retrivedtotalC[4 + i * 10].split(":")[1].split(",")[0])
    );
    console.log(retrivedtotalC.length);

    console.log(i);
    if ((retrivedtotalC.length - 1) / 10 > i + 1) {
      while (
        parseInt(retrivedtotalC[4 + i * 10].split(":")[1].split(",")[0]) ==
        counterNum + 1
      ) {
        console.log(
          parseInt(retrivedtotalC[4 + i * 10].split(":")[1].split(",")[0])
        );
        createRadioBox(i, counterNum);
        createTextBoxWithValue(i, counterNum, retrivedtotalC);
        createNewLine();
        i++;
      }
    }
    counterNum++;
  }
} else {
  checkNoElement();
}

function getAll() {
  resource = "questions/";
  xhttp.open("GET", endPointRoot + resource, true);
  xhttp.send();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let listOfQuestion = "";

      for (let i = 0; i < (this.responseText.length + 3) / 53; i++) {
        listOfQuestion +=
          this.responseText.split(":")[1 + i * 2].split(",")[0] + " ";
        listOfQuestion += this.responseText.split(`"`)[5 + i * 6] + "<br/>";
        questionNum = this.responseText.split(":")[1 + i * 2].split(",")[0];
      }

      console.log((this.responseText.length + 3) / 53);
      let myJSON = JSON.stringify(this.responseText.split(`"}`));
      localStorage.setItem("totalQuestion", myJSON);

      var stringJSON = localStorage.getItem("totalQuestion");
      let retrivedtotalQ = JSON.parse(stringJSON);
      let totalQ = parseInt(retrivedtotalQ);
      console.log(totalQ);

      document.getElementById("questionList").innerHTML = listOfQuestion;
    }
  };
}

function getChoice() {
  resource = "choices/";
  xhttp.open("GET", endPointRoot + resource, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let myJSON = JSON.stringify(this.responseText.split(`"`));
      localStorage.setItem("totalChoice", myJSON);
    }
  };
}

function checkNoElement() {
  alert("There is no questions");
}

function checkNoItems() {
  if (retrived["theNumberOfQuestion"] == 0) {
    alert("There is no questions");
  }
}

function createNewLine() {
  let newlines = document.createElement("br");
  container.appendChild(newlines);
}
function createTextAreaWithValue(retrived, theNumberofQuestions) {
  let textarea = document.createElement("textarea");
  textarea.value = retrived[theNumberofQuestions].split(`"`)[5];
  console.log((textarea.value = retrived[theNumberofQuestions].split(`"`)[5]));
  textarea.style.width = "300px";
  textarea.style.height = "130px";
  textarea.style.padding = "30px";
  textarea.style.border = "thick solid black";
  textarea.disabled = true;
  container.appendChild(textarea);
}

function createQuestionHeadLine(counter) {
  let headLine = document.createElement("H2");
  let textNode = document.createTextNode("Question" + (counter + 1));

  headLine.style.marginTop = "70px";
  headLine.style.marginBottom = "40px";
  headLine.appendChild(textNode);
  container.appendChild(headLine);
}

function createQuestionArea(retrived, theNumberofQuestions) {
  let textarea = document.createElement("H3");
  let textNoes = document.createTextNode(
    retrived["question" + theNumberofQuestions]
  );
  textarea.appendChild(textNoes);
  textarea.style.marginLeft = "20px";
  textarea.style.marginTop = "30px";
  textarea.style.marginBottom = "40px";
  container.appendChild(textarea);
}

function createRadioBox(i, counter) {
  let radiobox = document.createElement("input");
  radiobox.type = "radio";
  radiobox.name = "contact" + counter;
  radiobox.id = "radiobox" + i;
  container.appendChild(radiobox);
}

function createTextBoxWithValue(i, counter, retrived) {
  let textbox = document.createElement("input");
  textbox.type = "text";
  textbox.id = i + "context";

  textbox.value = retrived[7 + i * 10];
  textbox.style.width = "200px";
  textbox.style.height = "20px";
  textbox.style.marginTop = "10px";
  textbox.style.padding = "5px";
  textbox.disabled = true;
  container.appendChild(textbox);
}

function insertingTheAnswer(theNumberofQuestionss) {
  for (let j = 0; j < 4; j++) {
    if (retrived[theNumberofQuestionss + "radiobox"]["radiobox" + j] == true) {
      let answerElement = document.createElement("p");
      answerElement.style.marginTop = "30px";
      answerElement.style.fontSize = "15px";
      answerElement.style.color = "red";
      answerElement.textContent =
        "Answer:   " +
        retrived[theNumberofQuestionss + "context"]["context" + j];
      let list = document.getElementById("container");
      list.insertBefore(
        answerElement,
        list.childNodes[
          15 * (theNumberofQuestionss + 1) + theNumberofQuestionss
        ]
      );
    }
  }
}

function highlightTheAnswer(theNumberofQuestions) {
  for (let i = 0; i < 4; i++) {
    if (retrived[theNumberofQuestions + "radiobox"]["radiobox" + i] == true) {
      document.getElementById("container").childNodes[
        theNumberofQuestions * 15 + 3 * (i + 1) + 1 + theNumberofQuestions
      ].style.fontWeight = "bold";
    }
  }
}

function highlightUserCheckedOne(theNumberofQuestions) {
  for (let i = 0; i < 4; i++) {
    if (
      document.getElementById("container").childNodes[
        theNumberofQuestions * 15 + (i + 1) * 3 + theNumberofQuestions
      ].checked
    ) {
      document.getElementById("container").childNodes[
        theNumberofQuestions * 15 + (i + 1) * 3 + 1 + theNumberofQuestions
      ].style.fontWeight = "bold";
    }
  }
}

function getScore() {
  let score = 0;

  for (let i = 0; i < (retrivedtotalC.length - 1) / 10; i++) {
    if (
      retrivedtotalC[10 + i * 10].split(":")[1].split("}")[0] ==
      document.getElementById("radiobox" + i).checked
    ) {
      if (document.getElementById("radiobox" + i).checked == true) {
        score += 50;
      }
    }
  }
  console.log(score);
  document.getElementById("grade").innerHTML = score;
}

document.getElementById("backToPrevious").onclick = function () {
  window.history.back();
};
