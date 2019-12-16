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
  {
    name: "Luxury Tax",
  },
  {
    name: "Boardwalk",
    bought: false,
    owner: undefined,
    cost: 400,
    rent: 50,
  },
]
let player1, player2, currentPlayer, allPlayersIdx, 
lastLandedOn, lastRoll;
/*----- cached element references -----*/
const emptyDiv = document.querySelector("#empty div");
const emptyP = document.querySelector("#empty-p");
const emptyBtn1 = document.querySelector("#btn1");
const emptyBtn2 = document.querySelector("#btn2");
const rollDiceBtn = document.querySelector("#roll-dice");
const accordion = document.querySelector("#accordion");
const moneyPArray = document.querySelectorAll(".money");
const namesH3Array = document.querySelectorAll("h3");
const gameHistory = document.querySelector("#game-history");
/*----- event listeners -----*/
rollDiceBtn.addEventListener("click", function () {
  rollDice(currentPlayer);
  renderGameHistory(`${currentPlayer.name}: rolled ${lastRoll}`);
  lastLandedOn = objSquares[currentPlayer.location];
  renderPlayerIcon();
  landedOn();
  render();
});
emptyBtn1.addEventListener("click", function() { 
  emptyDiv.setAttribute("style", "visibility: hidden");
  if(currentPlayer.getMoney() > lastLandedOn.cost){
    lastLandedOn.bought = true;
    lastLandedOn.owner = currentPlayer;
    currentPlayer.setMoney(-lastLandedOn.cost);
    renderGameHistory(`${currentPlayer.name}: paid ${lastLandedOn.cost} for ${lastLandedOn.name}`);
  }
  rollDiceBtn.disabled = false;
  render();
  nextPlayer();
});
emptyBtn2.addEventListener("click", function() { 
  emptyDiv.setAttribute("style", "visibility: hidden");
  rollDiceBtn.disabled = false;
  render();
  nextPlayer();
});
/*----- functions -----*/
function landedOn() {
  let n = lastLandedOn.name;
  if (n == "GO" || n == "Chance" || n == "Community Chest" || n.includes("Railroad") ||
  n.includes("Jail") || n == "Electric Company" || n == "Water Works" ||
  n == "Free Parking" || n.includes("Tax")
  ) {
  } else if (lastLandedOn.bought) {
    currentPlayer.setMoney(-lastLandedOn.rent);
    lastLandedOn.owner.setMoney(lastLandedOn.rent);
    renderGameHistory(`${currentPlayer.name}: paid ${lastLandedOn.rent} to ${lastLandedOn.owner.name}`);
  } else {
    renderBuyProperty();
    return;
  }
  nextPlayer();
}
function init() {
  player1 = new Player("Jeff", "blue");
  player2 = new Player("Zane", "red");
  allPlayers.push(player1, player2);
  allPlayersIdx = 0;
  currentPlayer = allPlayers[allPlayersIdx];
  lastLandedOn = objSquares[0];
  lastRoll = 0;
  renderInitialPlayerIcon(player1);
  renderInitialPlayerIcon(player2);
  render();
}
function render() {
  moneyPArray[0].textContent = `Money: ${player1.getMoney()}`;
  moneyPArray[1].textContent = `Money: ${player2.getMoney()}`;
  moneyPArray[0].innerHTML += `<br>Properties: ${getPlayerProperties(player1)}`;
  moneyPArray[1].innerHTML += `<br>Properties: ${getPlayerProperties(player2)}`;
}
function renderInitialPlayerIcon(player) {
  namesH3Array[0].textContent = `${player1.name}`;
  namesH3Array[1].textContent = `${player2.name}`;

  let playerIcon = document.createElement("div");
  playerIcon.id = `${player.name}`;
  playerIcon.style.width = "10px";
  playerIcon.style.height = "10px";
  playerIcon.style.cssFloat = "left";
  playerIcon.style.margin = "2px";
  playerIcon.style.backgroundColor = player.color;
  boardSquares[0].appendChild(playerIcon);
}
function renderPlayerIcon() {
  let prevIcon = document.querySelector(`#${currentPlayer.name}`);
  boardSquares[currentPlayer.prevLocation].removeChild(prevIcon);
  let playerIcon = document.createElement("div");
  playerIcon.id = `${currentPlayer.name}`;
  playerIcon.style.width = "10px";
  playerIcon.style.height = "10px";
  playerIcon.style.cssFloat = "left";
  playerIcon.style.margin = "2px";
  playerIcon.style.backgroundColor = currentPlayer.color;
  if (currentPlayer.location > 29) {
    playerIcon.style.marginLeft = "40px";
  } else if (currentPlayer.location > 19) {

  } else if (currentPlayer.location > 9) {
    playerIcon.style.marginLeft = "2px";
  } else {
    playerIcon.style.marginTop = "40px";
  }
  boardSquares[currentPlayer.location].appendChild(playerIcon);
}
function renderBuyProperty() {
  rollDiceBtn.disabled = true;
  emptyP.textContent = `${currentPlayer.name} would you like to buy ${lastLandedOn.name}?`;
  emptyDiv.setAttribute("style", "visibility: visible");
}
function renderGameHistory(text) {
  text += "<br>";
  gameHistory.innerHTML = text.concat(gameHistory.innerHTML);
}
function nextPlayer() {
  if(allPlayersIdx == allPlayers.length - 1){
    allPlayersIdx = 0;
  } else {
    allPlayersIdx++;
  }
  currentPlayer = allPlayers[allPlayersIdx];
}
function getPlayerProperties(player) {
  let allBoughtProperties = objSquares.filter(obj => obj.owner !== undefined);
  let playerProperties = allBoughtProperties.filter(obj => obj.owner.name == player.name);
  playerProperties = playerProperties.map(obj => obj.name);
  return playerProperties.join(", ");
}
function rollDice(player){
  let roll = Math.ceil(Math.random()*6) + Math.ceil(Math.random()*6);
  lastRoll = roll;
  player.prevLocation = player.location;
  player.location += roll;
  if(player.location > 39) {
    player.location -= 40;
    player.setMoney(200);
  }
}
class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this._money = 1500;
    this.location = 0;
    this.prevLocation = 0;
  }
  getMoney(){
    return this._money;
  }
  setMoney(value){
    this._money += value;
  }
}
init();