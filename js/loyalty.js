var url = "";
var data;

let dataMembers;
let membersPercent;

let table1 = document.querySelector("#table1");
let table2 = document.querySelector("#table2");
let table3 = document.querySelector("#table3");

let countDemo = 0;
let countRepu = 0;
let countInde = 0;

var averageRepu = 0;
var averageDemo = 0;
var averageInde = 0;

let vmSenators = new Vue({
  el: "#appSenators",
  data: {
    senators: [],
    senators2: []
  }
});

let header = {
  headers: new Headers({
    "X-API-KEY": "cIFChT9vWG2XuMeoSjEAmiYWJE2Zya6WDaxlpkvM" //Pro-publica API key
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
// SENDS FETCH RESOLVED PROMISE TO LOADING FUCTION
let dataPromise = loadData(url, header);
dataPromise.then(resultado => cargarDatos(resultado));
//LOADS PROMISE INTO FUCTION AND RETURNS VAR DATA
function cargarDatos(array) {
  data = array;
  dataMembers = data.results[0].members;
  membersPercent = Math.floor(dataMembers.length * 0.1); //Calculates 10% of the members and floors the number.
  countDRI();
  return array;
}

// ------ COUNTING TOTAL MEMBERS PER PARTY AND CALLING ALL TABLE FUNCTIONS -------------//
function countDRI() {
  for (var i in dataMembers) {
    if (data.results[0].members[i].party == "D") {
      countDemo++;
    }
    if (data.results[0].members[i].party == "R") {
      countRepu++;
    } else if (data.results[0].members[i].party == "I") {
      countInde++;
    }
  }
  firstTable();
  secondTable();
  thirdTable();
}

//------------PAINTING FIRST TABLE--------------//
function firstTable() {
  var totalRepu = 0;
  var totalDemo = 0;
  var totalInde = 0;

  for (var i in dataMembers) {
    if (dataMembers[i].party == "R") {
      totalRepu = totalRepu + dataMembers[i].votes_with_party_pct;
    }
    if (dataMembers[i].party == "D") {
      totalDemo = totalDemo + dataMembers[i].votes_with_party_pct;
    } else if (dataMembers[i].party == "I") {
      totalInde = totalInde + dataMembers[i].votes_with_party_pct;
    }
  }
  averageRepu = totalRepu / dataMembers.length;
  averageDemo = totalDemo / dataMembers.length;
  averageInde = totalInde / dataMembers.length;

  displayAveRepu = (totalRepu / dataMembers.length).toFixed(2);
  displayAveDemo = (totalDemo / dataMembers.length).toFixed(2);
  displayAveInde = (totalInde / dataMembers.length).toFixed(2);
  displayAveTotal = (
    (totalDemo + totalInde + totalRepu) /
    dataMembers.length
  ).toFixed(2);

  var table = `
    <table>
        <tr>
            <th>Party</th>
            <th>Number of Reps</th>
            <th>% Voted with Party</th>
        </tr>
    <tbody>
        <tr>
            <td>Republican</td>
            <td>${countRepu}</td>
            <td>${displayAveRepu}</td>
        </tr>
        <tr>
            <td>Democrat</td>
            <td>${countDemo}</td>
            <td>${displayAveDemo}</td>
        </tr>
        <tr>
            <td>Independent</td>
            <td>${countInde}</td>
            <td>${displayAveInde}</td>
        </tr>
        <tr>
            <td>Total</td>
            <td>${countInde + countDemo + countRepu}</td>
            <td>${displayAveTotal}</td>
        </tr>
    </tbody>
</table>`;

  table1.innerHTML = table;
}

//------------ SECOND TABLE/WORST 10% ----------------------//
function secondTable() {
  dataMembers.sort(function(a, b) {
    return a.votes_with_party_pct - b.votes_with_party_pct;
  });
  var arrayAux = [];

  for (var i = 0; i < membersPercent; i++) {
    arrayAux.push(data.results[0].members[i]);
  }
  for (var i = 0; i < dataMembers.length; i++) {
    // To check in case the last member listed has the same score as the next and if so, include the next aswell.
    if (
      i > membersPercent &&
      dataMembers[membersPercent].votes_with_party_pct ==
        dataMembers[i].votes_with_party_pct
    ) {
      arrayAux.push(data.results[0].members[i]);
    }
    vmSenators.senators = arrayAux;
  }
}

//------------ THIRD TABLE/BEST 10% ----------------------//
function thirdTable() {
  dataMembers.sort(function(a, b) {
    return a.votes_with_party_pct - b.votes_with_party_pct;
  });
  dataMembers.reverse();
  var arrayAux = [];

  for (var i = 0; i < membersPercent; i++) {
    arrayAux.push(data.results[0].members[i]);
  }
  for (var i = 0; i < dataMembers.length; i++) {
    // To check in case the last member listed has the same score as the next and if so, include the next aswell.
    if (
      i >= membersPercent &&
      dataMembers[membersPercent].votes_with_party_pct ==
        dataMembers[i].votes_with_party_pct
    ) {
      arrayAux.push(data.results[0].members[i]);
    }
    vmSenators.senators2 = arrayAux;
  }
}
