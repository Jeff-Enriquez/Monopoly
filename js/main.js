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
let player1, player2, currentPlayer, currentPlayerPropertySets,
  allPlayersIdx, lastLandedOn, lastRoll, objSquares;
/*----- cached element references -----*/
const modal = document.querySelector("#modal");
const modalP = document.querySelector("#modal-p");
const emptyBtn1 = document.querySelector("#btn1");
const emptyBtn2 = document.querySelector("#btn2");
const buyHousesBtn = document.querySelector("#buy-houses-btn");
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
  lastLandedOn;
  renderPlayerIcon();
  landedOn();
  render();
});
emptyBtn1.addEventListener("click", function() { 
  modal.setAttribute("style", "visibility: hidden");
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
  modal.setAttribute("style", "visibility: hidden");
  rollDiceBtn.disabled = false;
  render();
  nextPlayer();
});
buyHousesBtn.addEventListener("click", function(){
  rollDiceBtn.disabled = true;
  renderBuyHousesDisplay();
});
/*----- functions -----*/
function landedOn() {
  let n = lastLandedOn.name;
  if (n == "GO" || n == "Chance" || n == "Community Chest" ||
  n.includes("Jail") ||
  n == "Free Parking" || n == "Income Tax") {
  } else if (n == "Luxury Tax"){
    currentPlayer.setMoney(-100);
    renderGameHistory(`${currentPlayer.name}: paid 100 for Luxury Tax`);
  } 
  else if (lastLandedOn.bought && lastLandedOn.owner != currentPlayer) {
    let rent = getRent();
    currentPlayer.setMoney(-rent);
    lastLandedOn.owner.setMoney(rent);
    renderGameHistory(`${currentPlayer.name}: paid ${rent} to ${lastLandedOn.owner.name}`);
  } else if (!lastLandedOn.bought) {
    renderBuyProperty();
    return;
  }
  nextPlayer();
}
function init() {
  player1 = new Player("Jeff", "blue");
  player2 = new Player("Zane", "red");
  objSquares = [
    {
      name: "GO",
    },
    {
      name: "Mediterranean Ave",
      bought: true,
      owner: player1,
      cost: 60,
      rent: 2,
      color: "brown",
      house1: 10,
      house2: 30,
      house3: 90,
      house4: 160,
      hotel: 250,
      houseCost: 50,
      mortgage: 30,
    },
    {
      name: "Community Chest",
    },
    {
      name: "Baltic Ave",
      bought: true,
      owner: player1,
      cost: 60,
      rent: 4,
      color: "brown",
      house1: 20,
      house2: 60,
      house3: 180,
      house4: 320,
      hotel: 450,
      houseCost: 50,
      mortgage: 30,
    },
    {
      name: "Income Tax",
    },
    {
      name: "Reading Railroad",
      bought: false,
      owner: undefined,
      cost: 200,
      color: "black",
    },
    {
      name: "Oriental Ave",
      bought: false,
      owner: undefined,
      cost: 100,
      rent: 6,
      color: "light-blue",
      house1: 30,
      house2: 90,
      house3: 270,
      house4: 400,
      hotel: 550,
      houseCost: 50,
      mortgage: 50,
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
      color: "light-blue",
      house1: 30,
      house2: 90,
      house3: 270,
      house4: 400,
      hotel: 550,
      houseCost: 50,
      mortgage: 50,
    },
    {
      name: "Connecticut Ave",
      bought: false,
      owner: undefined,
      cost: 120,
      rent: 8,
      color: "light-blue",
      house1: 40,
      house2: 100,
      house3: 300,
      house4: 450,
      hotel: 600,
      houseCost: 50,
      mortgage: 60,
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
      color: "pink",
      house1: 50,
      house2: 150,
      house3: 450,
      house4: 625,
      hotel: 750,
      houseCost: 100,
      mortgage: 70,
    },
    {
      name: "Electric Company",
      bought: false,
      owner: undefined,
      cost: 150,
      color: "utility",
    },
    {
      name: "States Ave",
      bought: false,
      owner: undefined,
      cost: 140,
      rent: 10,
      color: "pink",
      house1: 50,
      house2: 150,
      house3: 450,
      house4: 625,
      hotel: 750,
      houseCost: 100,
      mortgage: 70,
    },
    {
      name: "Virginia Ave",
      bought: false,
      owner: undefined,
      cost: 160,
      rent: 12,
      color: "pink",
      house1: 60,
      house2: 180,
      house3: 500,
      house4: 700,
      hotel: 900,
      houseCost: 100,
      mortgage: 80,
    },
    {
      name: "Pennsylvania Railroad",
      bought: false,
      owner: undefined,
      cost: 200,
      color: "black",
    },
    {
      name: "St James Place",
      bought: false,
      owner: undefined,
      cost: 180,
      rent: 14,
      color: "orange",
      house1: 70,
      house2: 200,
      house3: 550,
      house4: 750,
      hotel: 950,
      houseCost: 100,
      mortgage: 90,
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
      color: "orange",
      house1: 70,
      house2: 200,
      house3: 550,
      house4: 750,
      hotel: 950,
      houseCost: 100,
      mortgage: 90,
    },
    {
      name: "New York Ave",
      bought: false,
      owner: undefined,
      cost: 200,
      rent: 16,
      color: "orange",
      house1: 80,
      house2: 220,
      house3: 600,
      house4: 800,
      hotel: 1000,
      houseCost: 100,
      mortgage: 100,
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
      color: "red",
      house1: 90,
      house2: 250,
      house3: 700,
      house4: 875,
      hotel: 1050,
      houseCost: 150,
      mortgage: 110,
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
      color: "red",
      house1: 90,
      house2: 250,
      house3: 700,
      house4: 875,
      hotel: 1050,
      houseCost: 150,
      mortgage: 110,
    },
    {
      name: "Illinois Ave",
      bought: false,
      owner: undefined,
      cost: 240,
      rent: 20,
      color: "red",
      house1: 100,
      house2: 300,
      house3: 7750,
      house4: 925,
      hotel: 1100,
      houseCost: 150,
      mortgage: 120,
    },
    {
      name: "B. & O. Railroad",
      bought: false,
      owner: undefined,
      cost: 200,
      color: "black",
    },
    {
      name: "Atlantic Ave",
      bought: false,
      owner: undefined,
      cost: 260,
      rent: 22,
      color: "yellow",
      house1: 110,
      house2: 330,
      house3: 800,
      house4: 975,
      hotel: 1150,
      houseCost: 150,
      mortgage: 130,
    },
    {
      name: "Ventnor Ave",
      bought: false,
      owner: undefined,
      cost: 260,
      rent: 22,
      color: "yellow",
      house1: 110,
      house2: 330,
      house3: 800,
      house4: 975,
      hotel: 1150,
      houseCost: 150,
      mortgage: 130,
    },
    {
      name: "Water Works",
      bought: false,
      owner: undefined,
      cost: 150,
      color: "utility",
    },
    {
      name: "Marvin Gardens",
      bought: false,
      owner: undefined,
      cost: 280,
      rent: 24,
      color: "yellow",
      house1: 120,
      house2: 360,
      house3: 850,
      house4: 1025,
      hotel: 1200,
      houseCost: 150,
      mortgage: 140,
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
      color: "green",
      house1: 130,
      house2: 390,
      house3: 900,
      house4: 1100,
      hotel: 1275,
      houseCost: 200,
      mortgage: 150,
    },
    {
      name: "No. Carolina Ave",
      bought: false,
      owner: undefined,
      cost: 300,
      rent: 26,
      color: "green",
      house1: 130,
      house2: 390,
      house3: 900,
      house4: 1100,
      hotel: 1275,
      houseCost: 200,
      mortgage: 150,
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
      color: "green",
      house1: 150,
      house2: 450,
      house3: 1000,
      house4: 1200,
      hotel: 1400,
      houseCost: 200,
      mortgage: 160,
    },
    {
      name: "Short Line Railroad",
      bought: false,
      owner: undefined,
      cost: 200,
      color: "black"
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
      color: "dark-blue",
      house1: 175,
      house2: 500,
      house3: 1100,
      house4: 1300,
      hotel: 1500,
      houseCost: 200,
      mortgage: 175,
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
      color: "dark-blue",
      house1: 200,
      house2: 600,
      house3: 1400,
      house4: 1700,
      hotel: 2000,
      houseCost: 200,
      mortgage: 200,
    },
  ]  
  allPlayers.push(player1, player2);
  allPlayersIdx = 0;
  currentPlayer = allPlayers[allPlayersIdx];
  currentSets = [];
  lastLandedOn = objSquares[0];
  lastRoll = 0;
  buyHousesBtn.disabled = false;
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
function renderBuyHousesDisplay() {
  rollDiceBtn.disabled = true;
  buyHousesBtn.disabled = true;
  modalP.textContent = `${currentPlayer.name} select property color and enter number of houses you would like:`;
  currentPlayerPropertySets.forEach(function (color) {
    let input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.id = `${color}`;
    let label = document.createElement("label");
    label.textContent = `${color}`;
    modal.appendChild(input);
    modal.appendChild(label);
  });
  modal.setAttribute("style", "visibility: visible");
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
  modalP.textContent = `${currentPlayer.name} would you like to buy ${lastLandedOn.name}?`;
  modal.setAttribute("style", "visibility: visible");
}
function renderGameHistory(text) {
  text += "<br>";
  gameHistory.innerHTML = text.concat(gameHistory.innerHTML);
}
function renderBuyHousesBtn(){
  buyHousesBtn.disabled = true;
  let currentSets = [];
  if(objSquares[1].owner == currentPlayer && objSquares[3].owner == currentPlayer){
    currentSets.push("brown");
  } else {
    let allBoughtProperties = objSquares.filter(obj => obj.owner == currentPlayer);
    let propertiesCount = {};
    allBoughtProperties.forEach(function (obj) {
      if(propertiesCount[obj.color] == undefined){
        propertiesCount[obj.color] = 0;
      }
      propertiesCount[obj.color]++;
    });
    for(let [key, value] of Object.entries(propertiesCount)) {
      if(value == 3){
        currentSets.push(key);
      }
    }
  }
  if (currentSets.length > 0){
    buyHousesBtn.disabled = false;
  }
  currentPlayerPropertySets = currentSets;
}
function nextPlayer() {
  if(allPlayersIdx == allPlayers.length - 1){
    allPlayersIdx = 0;
  } else {
    allPlayersIdx++;
  }
  currentPlayer = allPlayers[allPlayersIdx];
  renderBuyHousesBtn();
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
function getRent(){
  let propertyColorSet = objSquares.filter(obj => obj.color === lastLandedOn.color);
  let ownerSet = propertyColorSet.filter(obj => obj.owner === lastLandedOn.owner);
  if (ownerSet[0].color === "black") {
    return ownerSet.length * 25;
  } else if (ownerSet[0].color === "utility") {
    if (ownerSet.length == 1) {
      return lastRoll * 4;
    }
    return lastRoll * 8;
  } else if (ownerSet[0].name === "Mediterranean Ave" && ownerSet[1].name === "Baltic Ave"){
    return lastLandedOn.rent * 2;
  } else if (ownerSet.length == 3) {
    return lastLandedOn.rent * 2;
  }
  return lastLandedOn.rent;
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