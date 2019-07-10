let mytable = document.querySelector("#senate-data");
let checkboxes = [];

var url = "";
var data;

let vmSenators = new Vue({
  el: "#appSenators",
  data: {
    senators: []
  }
});

let vmStates = new Vue({
  el: "#appStates",
  data: {
    states: []
  }
});

var header = {
  headers: new Headers({
    "X-API-KEY": "cIFChT9vWG2XuMeoSjEAmiYWJE2Zya6WDaxlpkvM"
  })
};

// FUNCTIONS TO DETECT WHICH LINK TO FETCH
function senateFetch() {
  url = "https://api.propublica.org/congress/v1/113/senate/members.json";
}
function houseFetch() {
  url = "https://api.propublica.org/congress/v1/113/house/members.json";
}
if (document.body.className.match("houseStarter")) {
  houseFetch();
}
if (document.body.className.match("senateStarter")) {
  senateFetch();
}

// FETCH / ONLY MAKES THE PROMISE
function loadData(url, header) {
  let data = fetch(url, header)
    .then(result => result.json())
    .catch(error => console.error("ERROR: ", error));
  return data;
}
// SENDS FETCH RESOLVED PROMISE TO A LOADING FUCTION
let dataPromise = loadData(url, header);
dataPromise.then(resultado => cargarDatos(resultado));
//LOADS PROMISE INTO FUCTION AND RETURNS VAR DATA
function cargarDatos(array) {
  data = array;
  dataMembers = data.results[0].members;
  membersPercent = Math.floor(dataMembers.length * 0.1); //Calculates 10% of the members and floors the number.
  arrayCheckboxes();
  selectFilter();
  return array;
}

// CHECKBOX FILTERS //
function arrayCheckboxes() {
  var valuesCheckbox = [];
  checkboxes = document.querySelectorAll("input[type=checkbox]:checked");

  for (i = 0; i < checkboxes.length; i++) {
    valuesCheckbox.push(checkboxes[i].value);
  }
  printFilters(valuesCheckbox);
}

function printFilters(valuesCheckbox) {
  let arrayAux = [];

  for (i = 0; i < data.results[0].members.length; i++) {
    for (j = -1; j < valuesCheckbox.length; j++) {
      if (
        (valuesCheckbox.length == 0 &&
          document.querySelector("#state").value == "-- Select Option --") ||
        (valuesCheckbox.length == 0 &&
          data.results[0].members[i].state ==
            document.querySelector("#state").value)
      ) {
        arrayAux.push(data.results[0].members[i]);
      } else if (
        (data.results[0].members[i].state ==
          document.querySelector("#state").value &&
          data.results[0].members[i].party == valuesCheckbox[j]) ||
        (data.results[0].members[i].party == valuesCheckbox[j] &&
          document.querySelector("#state").value == "-- Select Option --")
      ) {
        arrayAux.push(data.results[0].members[i]);
      }
    }
  }
  vmSenators.senators = arrayAux;
}

//FILLING SELECT FILTER//
function selectFilter() {
  let arrayAux = [];
  for (i = 0; i < data.results[0].members.length; i++) {
    if (!arrayAux.includes(data.results[0].members[i].state)) {
      arrayAux.push(data.results[0].members[i].state);
    }
  }

  vmStates.states = arrayAux;
}

// USING SELECT FILTER //
function stateFil() {
  var valuesCheckbox = [];
  let arrayAux = [];
  checkboxes = document.querySelectorAll("input[type=checkbox]:checked");

  for (i = 0; i < checkboxes.length; i++) {
    valuesCheckbox.push(checkboxes[i].value);
  }

  for (i = 0; i < data.results[0].members.length; i++) {
    for (j = -1; j < valuesCheckbox.length; j++) {
      if (
        (data.results[0].members[i].state ==
          document.querySelector("#state").value &&
          data.results[0].members[i].party == valuesCheckbox[j]) ||
        (data.results[0].members[i].state ==
          document.querySelector("#state").value &&
          valuesCheckbox.length == 0)
      ) {
        arrayAux.push(data.results[0].members[i]);
      }
    }
  }
  vmSenators.senators = arrayAux;
}
