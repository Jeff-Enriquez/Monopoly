/* ------- test function -------- */
// $( function() {
//   $( "#accordion" ).accordion();
// } );

/*----- constants -----*/
const board = [];
board.push(document.querySelectorAll("#bottom-row > div"));
board.push(document.querySelectorAll("#left-column > div"));
board.push(document.querySelectorAll("#top-row > div"));
board.push(document.querySelectorAll("#right-column > div"));
const boardSquares = [];
board.forEach(function(node) {
  node.forEach(function(obj) {
    boardSquares.push(obj);
  })
})
const allPlayers = [];
/*----- app's state (variables) -----*/
let objSquares = [
  { //Go
    name: "GO",
  },
  {
    name: "Mediterranean Ave",
    bought: false,
    owner: undefined,
    cost: 60,
    rent: 2,
  },
  {
    name: "Community Chest",
  },
  {
    name: "Baltic Ave",
    bought: false,
    owner: undefined,
    cost: 60,
    rent: 4,
  },
  {
    name: "Income Tax",
  },
  {
    name: "Reading Railroad",
    bought: false,
    owner: undefined,
    cost: 200,
  },
  {
    name: "Oriental Ave",
    bought: false,
    owner: undefined,
    cost: 100,
    rent: 6,
  },
  {
    name: "Chance",
  },
  {
    name: "Vermont Ave",
    bought: false,
    owner: undefined,
    cost: 100,
    rent: 6,
  },
  {
    name: "Connecticut Ave",
    bought: false,
    owner: undefined,
    cost: 120,
    rent: 8,
  },
  {
    name: "Jail",
  },
  {
    name: "St Charles Place",
    bought: false,
    owner: undefined,
    cost: 140,
    rent: 10,
  },
  {
    name: "Electric Company",
    bought: false,
    owner: undefined,
    cost: 150,
  },
  {
    name: "States Ave",
    bought: false,
    owner: undefined,
    cost: 140,
    rent: 10,
  },
  {
    name: "Virginia Ave",
    bought: false,
    owner: undefined,
    cost: 160,
    rent: 12,
  },
  {
    name: "Pennsylvania Railroad",
    bought: false,
    owner: undefined,
    cost: 200,
  },
  {
    name: "St James Place",
    bought: false,
    owner: undefined,
    cost: 180,
    rent: 14,
  },
  {
    name: "Community Chest",
  },
  {
    name: "Tennesse Ave",
    bought: false,
    owner: undefined,
    cost: 180,
    rent: 14,
  },
  {
    name: "New York Ave",
    bought: false,
    owner: undefined,
    cost: 200,
    rent: 16,
  },
  {
    name: "Free Parking",
  },
  {
    name: "Kentucky Ave",
    bought: false,
    owner: undefined,
    cost: 220,
    rent: 18,
  },
  {
    name: "Chance",
  },
  {
    name: "Indiana Ave",
    bought: false,
    owner: undefined,
    cost: 220,
    rent: 18,
  },
  {
    name: "Illinois Ave",
    bought: false,
    owner: undefined,
    cost: 240,
    rent: 20,
  },
  {
    name: "B. & O. Railroad",
    bought: false,
    owner: undefined,
    cost: 200,
  },
  {
    name: "Atlantic Ave",
    bought: false,
    owner: undefined,
    cost: 260,
    rent: 22,
  },
  {
    name: "Ventnor Ave",
    bought: false,
    owner: undefined,
    cost: 260,
    rent: 22,
  },
  {
    name: "Water Works",
    bought: false,
    owner: undefined,
    cost: 150,
  },
  {
    name: "Marvin Gardens",
    bought: false,
    owner: undefined,
    cost: 280,
    rent: 24,
  },
  {
    name: "Go to Jail",
  },
  {
    name: "Pacific Ave",
    bought: false,
    owner: undefined,
    cost: 300,
    rent: 26,
  },
  {
    name: "No. Carolina Ave",
    bought: false,
    owner: undefined,
    cost: 300,
    rent: 26,
  },
  {
    name: "Community Chest",
  },
  {
    name: "Pennsylvania Ave",
    bought: false,
    owner: undefined,
    cost: 320,
    rent: 28,
  },
  {
    name: "Short Line Railroad",
    bought: false,
    owner: undefined,
    cost: 200,
  },
  {
    name: "Chance",
  },
  {
    name: "Park Place",
    bought: false,
    owner: undefined,
    cost: 350,
    rent: 35,
  },
  
]
let player1, player2, currentPlayer;
/*----- cached element references -----*/
const emptyDiv = document.querySelector("#empty div");
const emptyP = document.querySelector("#empty-p");
const emptyBtn1 = document.querySelector("#btn1");
const emptyBtn2 = document.querySelector("#btn2");
const rollDiceBtn = document.querySelector("#roll-dice");
const accordion = document.querySelector("#accordion");
/*----- event listeners -----*/
rollDiceBtn.addEventListener("click", function () {
  allPlayers[currentPlayer].rollDice();
  renderPlayerIcon(allPlayers[currentPlayer]);
  if(currentPlayer == allPlayers.length - 1){
    currentPlayer = 0;
  } else {
    currentPlayer++;
  }
})

/*----- functions -----*/
function landedOn(player, propertyObj) {
  let n = propertyObj.name;
  if (n == "GO" || n == "Chance" || n == "Community Chest" || n.includes("Railroad") ||
  n.includes("Jail") || n == "Electric Company" || n == "Water Works" ||
  n == "Free Parking" || n == "Income Tax"
  ) {
    return
  }
  if (propertyObj.bought) {
    player.money(-propertyObj.rent);
    propertyObj.owner.money(propertyObj.rent);
  } else {
    rollDiceBtn.disabled = true;
    emptyP.textContent = `${player.name} would you like to buy ${propertyObj.name}?`;
    emptyDiv.setAttribute("style", "visibility: visible");
    emptyBtn1.addEventListener("click", function() { 
      emptyDiv.setAttribute("style", "visibility: hidden");
      if(player.money() > propertyObj.cost){
        propertyObj.bought = true;
        propertyObj.owner = player;
        player.money(-propertyObj.cost);
      }
      rollDiceBtn.disabled = false;
    });
    emptyBtn2.addEventListener("click", function() { 
      emptyDiv.setAttribute("style", "visibility: hidden");
      rollDiceBtn.disabled = false;
    });
  }
}
function init() {
  player1 = new Player("Jeff", "blue");
  player2 = new Player("Zane", "red");
  allPlayers.push(player1, player2);
  currentPlayer = 0;
  render();
}
function render() {
  renderInitialPlayerIcon(player1);
  renderInitialPlayerIcon(player2);
  // player1H3.textContent = player1.name;
  // accordion.appendChild(player1H3);
  // player1Div.setAttribute("id", player1.name);
  // accordion.appendChild(player1Div);
  // player1P.textContent = `Money: ${player1._money}`;
  // document.querySelector(`#${player1.name}`).appendChild(player1P);
  // player2H3.textContent = player2.name;
  // accordion.appendChild(player2H3);
  // player2Div.setAttribute("id", player2.name);
  // accordion.appendChild(player2Div);
  // player2P.textContent = `Money: ${player2._money}`;
  // document.querySelector(`#${player2.name}`).appendChild(player2P);
  // renderPlayerIcon(player1);
}
function renderInitialPlayerIcon(player) {
  let playerIcon = document.createElement("div");
  playerIcon.id = `${player.name}`;
  playerIcon.style.width = "10px";
  playerIcon.style.height = "10px";
  playerIcon.style.cssFloat = "left";
  playerIcon.style.margin = "2px";
  playerIcon.style.backgroundColor = player.color;
  boardSquares[0].appendChild(playerIcon);
}
function renderPlayerIcon(player) {
  let prevIcon = document.querySelector(`#${player.name}`);
  boardSquares[player.prevLocation].removeChild(prevIcon);
  let playerIcon = document.createElement("div");
  playerIcon.id = `${player.name}`;
  playerIcon.style.width = "10px";
  playerIcon.style.height = "10px";
  playerIcon.style.cssFloat = "left";
  playerIcon.style.margin = "2px";
  playerIcon.style.backgroundColor = player.color;
  if (player.location > 29) {
    playerIcon.style.marginLeft = "40px";
  } else if (player.location > 19) {

  } else if (player.location > 9) {
    playerIcon.style.marginLeft = "2px";
  } else {
    playerIcon.style.marginTop = "40px";
  }
  boardSquares[player.location].appendChild(playerIcon);
}
class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this._money = 1500;
    this.location = 0;
    this.prevLocation = 0;
  }
  money(value = 0) {
    if(value == 0) {
      return this._money;
    } else if(this._money + value < 0) {
      return undefined;
    }
    this._money += value;
  }
  rollDice() {
    let roll = Math.ceil(Math.random()*6) + Math.ceil(Math.random()*6);
    this.prevLocation = this.location;
    this.location += roll;
    if(this.location > 39) {
      this.location -= 40;
      this.money(200);
    }
  }
}
init();