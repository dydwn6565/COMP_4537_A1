const xhttp = new XMLHttpRequest();
let params = "question1/choice1/true";
const endPointRoot = "http://localhost:8080/";
let resouce = "";
let countChoice = 2;
let selectedChoiceNum = 0;
let questionNum = 0;
setTimeout(function () {
  getAll();
}, 1000);
getChoice();
function getAll() {
  resource = "questions/";
  xhttp.open("GET", endPointRoot + resource, true);
  xhttp.send();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // this.responseText.split(":");
      let listOfQuestion = "";

      for (let i = 0; i < (this.responseText.length + 3) / 53; i++) {
        listOfQuestion +=
          this.responseText.split(":")[1 + i * 2].split(",")[0] + " ";
        listOfQuestion += this.responseText.split(`"`)[5 + i * 6] + "<br/>";
        questionNum = this.responseText.split(":")[1 + i * 2].split(",")[0];
      }

      // document.getElementById("questionList").innerHTML = NumQuestion;
      // let NumQuestion = this.responseText.split(":")[1].split("}")[0];
      // console.log(this.responseText.split(":")[1].split(",")[0]);
      // console.log(this.responseText.split(`"`)[5]);
      // console.log(this.responseText.split(":")[3].split(",")[0]);
      // console.log(this.responseText.split(`"`)[11]);
      // console.log(this.responseText.split(":")[5].split(",")[0]);
      // console.log(this.responseText.split(`"`)[17]);
      // console.log(this.responseText.split(",}"));
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
function post() {
  resource = "questions/";
  // console.log(counterQ);

  let parameter = "";

  let textareaContext = document.getElementById("contentOfTextarea").value;
  console.log(textareaContext);

  parameter += textareaContext + "/";
  console.log(parameter);
  console.log(questionNum);
  console.log(countChoice);
  let multipleChoice = "";
  for (let i = 0; i < countChoice; i++) {
    multipleChoice += document.getElementById(`text${i + 1}`).value + "/";
    console.log(multipleChoice);
    multipleChoice += document.getElementById(`radio${i + 1}`).checked + "/";
    console.log(multipleChoice);
  }
  console.log(multipleChoice);
  console.log(parameter);
  // console.log(params);
  window.location.reload();
  xhttp.open("POST", endPointRoot + resource, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(parameter + multipleChoice);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
    }
  };
}

function addChoice() {
  if (countChoice < 4) {
    ++countChoice;
    let newlines = document.createElement("br");

    let radiobox = document.createElement("input");
    radiobox.type = "radio";
    radiobox.name = "radio";
    radiobox.id = "radiobox" + countChoice;

    container.appendChild(radiobox);

    let textbox = document.createElement("input");
    textbox.type = "text";
    textbox.id = "text" + countChoice;
    container.appendChild(textbox);
    container.appendChild(newlines);
  } else {
    alert("You are not able to create more than 4 choices");
  }
}

function getChoice() {
  resource = "choices/";
  xhttp.open("GET", endPointRoot + resource, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;

      let myJSON = JSON.stringify(this.responseText.split(`"`));
      localStorage.setItem("totalChoice", myJSON);
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
}
function createUpdateButtons(countChoices) {
  let updateButton = document.createElement("input");
  updateButton.onclick = UpdateChoice;
  updateButton.type = "button";
  updateButton.value = "update";
  updateButtons.appendChild(updateButton);
}

function UpdateChoice() {
  resource = "questions/";
  let params = "";
  params += document.getElementById("updateText").value + "/";
  params += document.getElementById("textareaU").value + "/";
  // console.log(getUpdateTextArea);
  for (let i = 0; i < selectedChoiceNum; i++) {
    params += document.getElementById("textU" + i).value + "/";
    // console.log(params);
    params += document.getElementById("radioboxU" + i).checked + "/";
    // console.log(params);
  }
  console.log(params);
  xhttp.open("PUT", endPointRoot + resource, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(params);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
}

function deleteUpdateChoice() {
  if (selectedChoiceNum > 2) {
    for (let i = 0; i < 3; i++) {
      updateQuestion.removeChild(updateQuestion.lastElementChild);
    }
    selectedChoiceNum--;
  }
}

function deleteQuestion() {
  if (countChoice > 2) {
    for (let i = 0; i < 3; i++) {
      container.removeChild(container.lastElementChild);
    }
    countChoice--;
  }
}
function addUpdateChoice() {
  if (selectedChoiceNum < 4) {
    ++selectedChoiceNum;
    let newlines = document.createElement("br");

    let radiobox = document.createElement("input");
    radiobox.type = "radio";
    radiobox.name = "radioU";
    radiobox.id = "radioboxU" + countChoice;

    updateQuestion.appendChild(radiobox);

    let textbox = document.createElement("input");
    textbox.type = "text";
    textbox.id = "textU" + countChoice;
    updateQuestion.appendChild(textbox);
    updateQuestion.appendChild(newlines);
  } else {
    alert("You are not able to create more than 4 choices");
  }
}

function updateValue() {
  let updateText = document.getElementById("updateText").value;
  resource = "updateValue/";
  let countChoice = 0;
  var ChoicJSON = localStorage.getItem("totalChoice");

  let retrivedChoice = JSON.parse(ChoicJSON);
  for (let i = 0; i < (retrivedChoice.length - 1) / 10; i++) {
    console.log(retrivedChoice[4].split(":")[1].split(",")[0]);
    // console.log(updateText);
    console.log("line 213" + retrivedChoice[4].split(":")[1].split(",")[0]);
    if (retrivedChoice[4 + i * 10].split(":")[1].split(",")[0] == updateText) {
      countChoice++;
    }
  }
  selectedChoiceNum = countChoice;
  console.log(countChoice);

  var ChoicJSON = localStorage.getItem("totalQuestion");

  let retrivedQuestion = JSON.parse(ChoicJSON);
  let newlines = document.createElement("br");
  let textbox = document.createElement("input");
  textbox.type = "text";
  textbox.id = "textareaU";
  console.log(updateText);
  textbox.value = retrivedQuestion[updateText - 1].split(":")[2].split(`"`)[1];

  textbox.style.width = "200px";
  textbox.style.height = "20px";
  textbox.style.marginTop = "10px";
  textbox.style.padding = "5px";
  updateQuestion.appendChild(textbox);
  updateQuestion.appendChild(newlines);
  for (let j = 0; j < countChoice; j++) {
    let newlines = document.createElement("br");

    let radiobox = document.createElement("input");
    radiobox.type = "radio";
    radiobox.name = "radioU";
    radiobox.id = "radioboxU" + j;
    console.log(retrivedChoice[10 + j * 10].split(":")[1].split("}")[0]);
    if (retrivedChoice[10 + j * 10].split(":")[1].split("}")[0] == 1) {
      radiobox.checked = true;
    }
    // radiobox.value = retrivedChoice[10 + ((j - 1) * 10)].split(":")[0].split("}")[0];
    console.log(retrivedChoice[10 + (j - 1) * 10].split(":")[0].split("}")[0]);
    updateQuestion.appendChild(radiobox);

    let textbox = document.createElement("input");
    textbox.type = "text";
    textbox.id = "textU" + j;

    console.log(updateText);
    let startingPoint = checkStartPoint(updateText);
    console.log("line 235" + startingPoint);
    textbox.value = retrivedChoice[7 + startingPoint * 10 + j * 10];
    console.log(retrivedChoice[7 + startingPoint * 10 + j * 10]);
    updateQuestion.appendChild(textbox);
    updateQuestion.appendChild(newlines);
  }
  createUpdateButtons(countChoice);
}

function checkStartPoint(userInput) {
  var ChoicJSON = localStorage.getItem("totalChoice");
  let retrivedQuestion = JSON.parse(ChoicJSON);
  let stringPoint = 0;
  for (let i = 0; i < (retrivedQuestion.length - 1) / 10; i++) {
    if (retrivedQuestion[4 + 10 * i].split(":")[1].split(",")[0] < userInput) {
      stringPoint++;
    }
  }
  console.log(retrivedQuestion[4].split(":")[1].split(",")[0]);
  console.log(stringPoint);
  return stringPoint;
}
