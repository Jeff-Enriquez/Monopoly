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
const colors = ["blue", "yellow", "pink", "purple", "brown", "orange"];
/*----- app's state (variables) -----*/
let allPlayers, currentPlayer, currentPlayerPropertySets, currentPlayerHouseSets,
  allPlayersIdx, lastLandedOn, lastRoll, objSquares, housesLeft, hotelsLeft;
/*----- cached element references -----*/
const modal = document.querySelector("#modal");
const modalP = document.querySelector("#modal-p");
const btn1 = document.createElement("button");
const btn2 = document.createElement("button");
const input = document.createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("min", "1");
const buyHousesBtn = document.querySelector("#buy-houses-btn");
const buyHotelsBtn = document.querySelector("#buy-hotels-btn")
const rollDiceBtn = document.querySelector("#roll-dice");
const tradeBtn = document.querySelector("#trade-properties");
const accordion = document.querySelector("#accordion");
const moneyPArray = document.querySelectorAll(".money");
const namesH3Array = document.querySelectorAll("h3");
const gameHistory = document.querySelector("#game-history");
/*----- event listeners -----*/
btn1.addEventListener("click", function() { 
  modal.setAttribute("style", "visibility: hidden");
  if(btn1.id == "Yes"){
    if(currentPlayer.getMoney() > lastLandedOn.cost){
      lastLandedOn.bought = true;
      lastLandedOn.owner = currentPlayer;
      currentPlayer.setMoney(-lastLandedOn.cost);
      renderGameHistory(`${currentPlayer.name}: paid ${lastLandedOn.cost} for ${lastLandedOn.name}`);
      renderBuyHotelsBtn();
      renderBuyHousesBtn();
      tradeBtn.disabled = false;
    } else {
      renderGameHistory(`${currentPlayer.name}: does not have enough money to buy ${lastLandedOn.name}`);
    }
    render();
    nextPlayer();
  } else if(btn1.id == "houses"){
    buyHousesBtn.disabled = false;
    let color = document.querySelector('input[name="foo"]:checked').id;
    let num = Number.parseInt(input.value);
    let obj = objSquares.find(obj => obj.color == color);
    if(currentPlayer.getMoney() >= num * obj.houseCost && housesAvailable(color, num)) {
      currentPlayer.setMoney(-num*obj.houseCost);
      render();
      renderGameHistory(`${currentPlayer.name}: paid ${num*obj.houseCost} for ${num} houses`);
      buildHouses(color, num);
      renderBuyHotelsBtn();
    } else {
      renderGameHistory(`${currentPlayer.name}: does not have enough money for ${num} houses`);
    }
  } else if(btn1.id == "Pay-50") {
    if(currentPlayer.getMoney() > 50){
      currentPlayer.setMoney(-50);
      currentPlayer.inJail = false; 
      currentPlayer.jailRolls = 0;
      renderGameHistory(`${currentPlayer.name}: paid 50 to get out of jail`);
      render();
    } else {
      renderGameHistory(`${currentPlayer.name}: does not have enough to get out of jail`);
    }
  } else if(btn1.id == "hotel"){
    let color = document.querySelector('input[name="foo"]:checked').id;
    let num = Number.parseInt(input.value);
    let obj = objSquares.find(obj => obj.color == color);
    if(currentPlayer.getMoney() >= num * obj.houseCost && hotelsAvailable(color, num)) {
      currentPlayer.setMoney(-num*obj.houseCost);
      buildHotels(color, num);
      renderGameHistory(`${currentPlayer.name}: paid ${num*obj.houseCost} for ${num} hotels`);
      renderBuyHousesBtn();
      render();
    } else {
      renderGameHistory(`${currentPlayer.name}: does not have enough money for ${num} hotels`);
    }
  } else if(btn1.id == "trade"){
    let allProperties = Array.prototype.slice.call(document.querySelectorAll("input:checked"));
    let allMoney = Array.prototype.slice.call(document.querySelectorAll("input[type=number]"));
    let moneyObj = allMoney.find(obj => obj.value > 0);
    let tradiePlayer = undefined;
    let money, traderProps, tradieProps, moneyMessage, propMessage;
    if(moneyObj != undefined) {
      money = Number.parseInt(moneyObj.value);
      let player = allPlayers.find(player => player.name == moneyObj.className);
      if(player != currentPlayer){
        tradiePlayer = player;
        currentPlayer.setMoney(money);
        tradiePlayer.setMoney(-money);
      } else {
        currentPlayer.setMoney(-money);
      }
    }
    traderProps = allProperties.filter(obj => obj.className == currentPlayer.name);
    tradieProps = allProperties.filter(obj => obj.className != currentPlayer.name);
    if(tradiePlayer == undefined){
      tradiePlayer = allPlayers.find(player => player.name == tradieProps[0].className);
      if(moneyObj != undefined){
        tradiePlayer.setMoney(money);
      }
    }
    if(traderProps != undefined){
      traderProps.forEach(function(traderObj){
        let currentProperty = objSquares.find(obj => obj.name == traderObj.id);
        currentProperty.owner = tradiePlayer;
      });
    }
    if(tradieProps != undefined){
      tradieProps.forEach(function(tradieObj){
        let currentProperty = objSquares.find(obj => obj.name == tradieObj.id);
        currentProperty.owner = currentPlayer;
      });
    }
    renderBuyHousesBtn();
    renderBuyHotelsBtn();
    render();
    tradeBtn.disabled = false;
  } else if (btn1.id == "Add"){
    let playerName = document.querySelector("#player").value;
    allPlayers.push(new Player(playerName, colors[allPlayersIdx]));
    allPlayersIdx++;
    removeAllChildren(modal);
    renderGetPlayers();
    return;
  }
  rollDiceBtn.disabled = false;
  removeAllChildren(modal);
});
btn2.addEventListener("click", function() { 
  modal.setAttribute("style", "visibility: hidden");
  if(btn2.textContent == "No") {
    nextPlayer();
    renderBuyHotelsBtn();
    renderBuyHousesBtn();
    tradeBtn.disabled = false;
  } else if(btn2.id == "houses"){
    buyHousesBtn.disabled = false;
    tradeBtn.disabled = false;
  } else if(btn2.id == "hotel"){
    buyHotelsBtn.disabled = false;
  } else if(btn2.id == "trade"){
    tradeBtn.disabled = false;
    renderBuyHousesBtn();
    renderBuyHotelsBtn();
  }else if(btn2.textContent == "Try for Doubles"){
    let roll1 = Math.ceil(Math.random()*6);
    let roll2 = Math.ceil(Math.random()*6);
    currentPlayer.jailRolls++;
    if(roll1 == roll2 || currentPlayer.jailRolls == 3){
      renderGameHistory(`${currentPlayer.name}: rolled ${roll1}, ${roll2} and is out of jail`);
      rollDice(currentPlayer, roll1+roll2);
      lastLandedOn = objSquares[currentPlayer.location];
      renderPlayerIcon();
      currentPlayer.inJail = false;
      currentPlayer.jailRolls = 0;
      landedOn();
    } else {
      renderGameHistory(`${currentPlayer.name}: rolled ${roll1}, ${roll2} and is still in jail. You will automatically get out on third roll.`);
      nextPlayer();
    }
  } else if (btn2.id == "Done"){
    btn1.disabled = false;
    btn2.disabled = false;
    allPlayersIdx = 0;
    currentPlayer = allPlayers[0];
    render();
    renderInitialPlayerIcon();
  }
  rollDiceBtn.disabled = false;
  removeAllChildren(modal);
});
rollDiceBtn.addEventListener("click", function () {
  if(currentPlayer.inJail){
    getOutOfJail();
  }
  if(!currentPlayer.inJail){
    rollDice(currentPlayer);
    renderGameHistory(`${currentPlayer.name}: rolled ${lastRoll}`);
    lastLandedOn = objSquares[currentPlayer.location];
    renderPlayerIcon();
    landedOn();
    render();
  }
});
buyHousesBtn.addEventListener("click", function(){
  rollDiceBtn.disabled = true;
  renderBuyHousesDisplay();
});
buyHotelsBtn.addEventListener("click", function () {
  renderBuyHotelsDisplay();
});
tradeBtn.addEventListener("click", function() {
  renderTradeDisplay();
});
/*----- functions -----*/
function landedOn() {
  let n = lastLandedOn.name;
  if (n == "GO" || n == "Chance" || n == "Community Chest" ||
  n == "Jail" || n == "Free Parking") {
  } else if(n == "Go to Jail") {
    currentPlayer.inJail = true;
    currentPlayer.prevLocation = currentPlayer.location;
    currentPlayer.location = 10;
    lastLandedOn = objSquares[currentPlayer.location];
    renderPlayerIcon();
  } else if (n == "Luxury Tax"){
    currentPlayer.setMoney(-100);
    renderGameHistory(`${currentPlayer.name}: paid 100 for Luxury Tax`);
  } else if (n == "Income Tax"){
    currentPlayer.setMoney(-200);
    renderGameHistory(`${currentPlayer.name}: paid 200 for Income Tax`);
  } else if (lastLandedOn.bought && lastLandedOn.owner != currentPlayer) {
    let rent = getRent();
    if(rent > currentPlayer.getMoney()){
      renderGameHistory(`${currentPlayer.name}: paid ${currentPlayer.getMoney()} to ${lastLandedOn.owner.name}`);
      currentPlayer.setMoney(-currentPlayer.getMoney());
      lastLandedOn.owner.setMoney(currentPlayer.getMoney());
      checkLose(currentPlayer, lastLandedOn.owner);
      nextPlayer();
      return;
    }
    currentPlayer.setMoney(-rent);
    lastLandedOn.owner.setMoney(rent);
    renderGameHistory(`${currentPlayer.name}: paid ${rent} to ${lastLandedOn.owner.name}`);
  } else if (!lastLandedOn.bought) {
    renderBuyProperty();
    return;
  }
  checkLose(currentPlayer);
  nextPlayer();
}
function init() { 
  objSquares = [
    {
      name: "GO",
    },
    {
      name: "Mediterranean Ave",
      bought: false,
      owner: undefined,
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
      totalHouses: 0,
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
      color: "brown",
      house1: 20,
      house2: 60,
      house3: 180,
      house4: 320,
      hotel: 450,
      houseCost: 50,
      mortgage: 30,
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
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
      totalHouses: 0,
    },
  ];
  allPlayersIdx = 0;
  currentSets = [];
  allPlayers = [];
  lastLandedOn = objSquares[0];
  lastRoll = 0;
  housesLeft = 32;
  hotelsLeft = 12;
  buyHousesBtn.disabled = true;
  buyHotelsBtn.disabled = true;
  renderGetPlayers();
}
function renderGetPlayers(){
  rollDiceBtn.disabled = true;
  buyHousesBtn.disabled = true;
  tradeBtn.disabled = true;
  buyHotelsBtn.disabled = true;
  modalP.textContent = `Enter player name`;
  modal.appendChild(modalP);
  let input = document.createElement("input");
  input.id = "player";
  modal.appendChild(input);
  btn1.textContent = "Add Player";
  btn1.id = "Add";
  modal.appendChild(btn1);
  btn2.textContent = "Done";
  btn2.id = "Done";
  if(allPlayersIdx > 5){
    btn1.disabled = true;
  }
  if(allPlayers.length <= 1){
    btn2.disabled = true;
  } else {
    btn2.disabled = false;
  }
  modal.appendChild(btn2);
  modal.setAttribute("style", "visibility: visible");
}
function render() {
  allPlayers.forEach(function (player, idx){
    moneyPArray[idx].textContent = `Money: ${player.getMoney()}`;
    moneyPArray[idx].innerHTML += `<br>Properties: ${getPlayerProperties(player)}`;
    namesH3Array[idx].textContent = `${player.name}`
  });
}
function renderInitialPlayerIcon() {
  allPlayers.forEach(function (player){
    let playerIcon = document.createElement("div");
    playerIcon.id = `${player.name}`;
    playerIcon.style.width = "10px";
    playerIcon.style.height = "10px";
    playerIcon.style.cssFloat = "left";
    playerIcon.style.margin = "2px";
    playerIcon.style.backgroundColor = player.color;
    boardSquares[0].appendChild(playerIcon);
  });
}
function renderBuyHousesDisplay() {
  rollDiceBtn.disabled = true;
  buyHousesBtn.disabled = true;
  modalP.textContent = `${currentPlayer.name} select property color and enter number of houses you would like:`;
  modal.appendChild(modalP);
  currentPlayerPropertySets.forEach(function (color) {
    let input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "foo");
    input.id = `${color}`;
    let label = document.createElement("label");
    label.textContent = `${color}`;
    modal.appendChild(input);
    modal.appendChild(label);
    modal.appendChild(document.createElement("br"));
    modal.appendChild(document.createElement("br"));
  });
  modal.appendChild(input);
  modal.appendChild(document.createElement("br"));
  btn1.textContent = "Submit";
  btn1.id = "houses";
  btn2.textContent = "Cancel";
  btn2.id = "houses";
  modal.appendChild(btn1);
  modal.appendChild(btn2);
  modal.setAttribute("style", "visibility: visible");
}
function renderBuyHotelsDisplay() {
  rollDiceBtn.disabled = true;
  buyHousesBtn.disabled = true;
  modalP.textContent = `${currentPlayer.name} select property color and enter number of hotels you would like:`;
  modal.appendChild(modalP);
  currentPlayerHouseSets.forEach(function (color) {
    let input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "foo");
    input.id = `${color}`;
    let label = document.createElement("label");
    label.textContent = `${color}`;
    modal.appendChild(input);
    modal.appendChild(label);
    modal.appendChild(document.createElement("br"));
    modal.appendChild(document.createElement("br"));
  });
  modal.appendChild(input);
  modal.appendChild(document.createElement("br"));
  btn1.textContent = "Submit";
  btn1.id = "hotel";
  btn2.textContent = "Cancel";
  btn2.id = "hotel";
  modal.appendChild(btn1);
  modal.appendChild(btn2);
  modal.setAttribute("style", "visibility: visible");
}
function renderTradeDisplay(){
  rollDiceBtn.disabled = true;
  buyHousesBtn.disabled = true;
  buyHotelsBtn.disabled = true;
  tradeBtn.disabled = true;
  modalP.textContent = `${currentPlayer.name} is trading: `;
  modalP.style.display = "inline";
  modal.appendChild(modalP);
  let input = document.createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("min", "0");
  input.setAttribute("max", `${currentPlayer.getMoney()-1}`);
  input.className = `${currentPlayer.name}`;
  modal.appendChild(input);
  let div = document.createElement("div");
  div.style.cssText = "overflow: auto; width: 150px; height: 35px; border: 1px solid black; padding: 2px; margin: 5px auto;";
  modal.appendChild(div);
  let currentPlayerProperties = objSquares.filter(obj => obj.owner == currentPlayer);
  currentPlayerProperties = currentPlayerProperties.filter(function (obj) {
    if(obj.totalHouses == undefined){
      return true;
    }
    if(obj.totalHouses != 0) {
      return false;
    }
    let allOwnedColors = currentPlayerProperties.filter(x => x.color == obj.color);
    if(allOwnedColors.length == 2 && obj.color == "brown"){
      return false;
    }
    if(allOwnedColors.length == 3){
      return false;
    }
    return true;
  });
  currentPlayerProperties.forEach(function (obj) {
    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.className = `${currentPlayer.name}`;
    checkBox.id = `${obj.name}`;
    let p = document.createElement("p");
    p.style.display = "inline";
    p.innerHTML = `${obj.name}<br>`
    div.appendChild(checkBox);
    div.appendChild(p);
  });
  allPlayers.forEach(function(player){
    if(player != currentPlayer){
      let pName = document.createElement("p");
      pName.textContent = `${player.name}`;
      pName.style.display = "inline";
      modal.appendChild(pName);
      let pInput = document.createElement("input");
      pInput.setAttribute("type", "number");
      pInput.setAttribute("min", "0");
      pInput.setAttribute("max", `${player.getMoney()-1}`);
      pInput.className = `${player.name}`;
      modal.appendChild(pInput);
      let pDiv = document.createElement("div");
      pDiv.style.cssText = "overflow: auto; width: 150px; height: 35px; border: 1px solid black; padding: 2px; margin: 5px auto;";
      modal.appendChild(pDiv);
      let playerProperties = objSquares.filter(obj => obj.owner == player);
      playerProperties = playerProperties.filter(function (obj) {
        if(obj.totalHouses == undefined){
          return true;
        }
        if(obj.totalHouses != 0) {
          return false;
        }
        let allOwnedColors = playerProperties.filter(x => x.color == obj.color);
        if(allOwnedColors.length == 2 && obj.color == "brown"){
          return false;
        }
        if(allOwnedColors.length == 3){
          return false;
        }
        return true;
      });
      playerProperties.forEach(function (obj) {
        let pCheckBox = document.createElement("input");
        pCheckBox.setAttribute("type", "checkbox");
        pCheckBox.id = `${obj.name}`;
        pCheckBox.className = `${player.name}`;
        let pProperty = document.createElement("p");
        pProperty.style.display = "inline";
        pProperty.innerHTML = `${obj.name}<br>`
        pDiv.appendChild(pCheckBox);
        pDiv.appendChild(pProperty);
      });
    }
  });
  btn1.id = "trade";
  btn1.textContent = "Trade";
  btn2.textContent = "Cancel";
  btn2.id = "trade";
  modal.appendChild(btn1);
  modal.appendChild(btn2);
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
  buyHousesBtn.disabled = true;
  tradeBtn.disabled = true;
  buyHotelsBtn.disabled = true;
  modalP.textContent = `${currentPlayer.name} would you like to buy ${lastLandedOn.name}?`;
  modal.appendChild(modalP);
  btn1.textContent = "Yes";
  btn1.id = "Yes";
  modal.appendChild(btn1);
  btn2.textContent = "No";
  modal.appendChild(btn2);
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
  }
  let allBoughtProperties = objSquares.filter(obj => obj.owner == currentPlayer);
  let propertiesCount = {};
  allBoughtProperties.forEach(function (obj) {
    if(propertiesCount[obj.color] == undefined){
      propertiesCount[obj.color] = 1;
    } else {
      propertiesCount[obj.color]++;
    }
  });
  for(let [key, value] of Object.entries(propertiesCount)) {
    if(value == 3){
      currentSets.push(key);
    }
  }
  if (currentSets.length > 0){
    buyHousesBtn.disabled = false;
  }
  currentPlayerPropertySets = currentSets;
}
function renderBuyHotelsBtn(){
  buyHotelsBtn.disabled = true;
  let arrObjW4Houses = objSquares.filter(obj => obj.owner == currentPlayer);
  arrObjW4Houses = arrObjW4Houses.filter(obj => obj.totalHouses == 4);
  let allColors = {};
  arrObjW4Houses.forEach(function(obj){
    if(allColors[obj.color] == undefined){
      allColors[obj.color] = 1;
    } else {
      allColors[obj.color]++;
    }
  });
  let colors = [];
  for(let [key, value] of Object.entries(allColors)){
    if(key == "brown" && value == 2){
      colors.push(key);
    } else if (value == 3){
      colors.push(key);
    }
  }
  if(colors.length > 0) {
    buyHotelsBtn.disabled = false;
  }
  currentPlayerHouseSets = colors;
}
function nextPlayer() {
  if(allPlayersIdx == allPlayers.length - 1){
    allPlayersIdx = 0;
  } else {
    allPlayersIdx++;
  }
  currentPlayer = allPlayers[allPlayersIdx];
  renderBuyHousesBtn();
  renderBuyHotelsBtn();
}
function getPlayerProperties(player) {
  let allBoughtProperties = objSquares.filter(obj => obj.owner !== undefined);
  let playerProperties = allBoughtProperties.filter(obj => obj.owner.name == player.name);
  playerProperties = playerProperties.map(obj => obj.name);
  return playerProperties.join(", ");
}
function rollDice(player, roll = Math.ceil(Math.random()*6) + Math.ceil(Math.random()*6)){
  lastRoll = roll;
  player.prevLocation = player.location;
  player.location += roll;
  if(player.location > 39) {
    player.location -= 40;
    player.setMoney(200);
  }
}
function getRent(){
  if(lastLandedOn.totalHouses == 5){
    return lastLandedOn["hotel"];
  }
  if(lastLandedOn.totalHouses > 0){
    return lastLandedOn[`house${lastLandedOn.totalHouses}`];
  }
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
function removeAllChildren(parent){
  var child = parent.lastElementChild;  
  while (child) { 
      parent.removeChild(child); 
      child = parent.lastElementChild; 
  } 
}
function housesAvailable(color, num){
  if(housesLeft - num < 0) {
    return false;
  }
  let count = 0;
  let ArrOfObjHouses = objSquares.filter(obj => obj.color == color);
  ArrOfObjHouses.forEach(function (obj){
    count += obj.totalHouses;
  });
  if(ArrOfObjHouses.length == 2 && count + num > 8){
    return false;
  }
  if(count + num > 12){
    return false;
  }
  housesLeft -= num;
  return true;
}
function hotelsAvailable(color, num){
  if(hotelsLeft - num < 0) {
    return false;
  }
  let count = 0;
  let ArrOfObjHotels = objSquares.filter(obj => obj.color == color);
  ArrOfObjHotels.forEach(function (obj){
    count += obj.totalHouses;
  });
  if(ArrOfObjHotels.length == 2 && count + num > 10){
    return false;
  }
  if(count + num > 15){
    return false;
  }
  hotelsLeft -= num;
  return true;
}
function buildHouses(color, num){
  let ArrOfObjHouses = objSquares.filter(obj => obj.color == color);
  let fewestHousesIdx = 0;
  for(let i = 0; i < num; i++){
    let houseCount = 10;
    ArrOfObjHouses.forEach(function (obj, idx){
      if(obj.totalHouses <= houseCount){
        fewestHousesIdx = idx;
        houseCount = obj.totalHouses;
      }
    })
    ArrOfObjHouses[fewestHousesIdx].totalHouses++;
    renderHouse(objSquares.indexOf(ArrOfObjHouses[fewestHousesIdx]));
  }
}
function buildHotels(color, num){
  let ArrOfObjHotels = objSquares.filter(obj => obj.color == color);
  let fewestHousesIdx = 0;
  for(let i = 0; i < num; i++){
    let houseCount = 10;
    ArrOfObjHotels.forEach(function (obj, idx){
      if(obj.totalHouses <= houseCount){
        fewestHousesIdx = idx;
        houseCount = obj.totalHouses;
      }
    })
    ArrOfObjHotels[fewestHousesIdx].totalHouses++;
    renderHotel(objSquares.indexOf(ArrOfObjHotels[fewestHousesIdx]));
  }
}
function renderHotel(boardSquaresIdx){
  let house = document.createElement("div");
  house.style.width = "10px";
  house.style.height = "10px";
  house.style.cssFloat = "left";
  house.style.margin = "2px";
  house.style.backgroundColor = "red";
  removeAllChildren(boardSquares[boardSquaresIdx]);
  boardSquares[boardSquaresIdx].appendChild(house);
}
function renderHouse(boardSquaresIdx) {
  let house = document.createElement("div");
  house.style.width = "10px";
  house.style.height = "10px";
  house.style.cssFloat = "left";
  house.style.margin = "2px";
  house.style.backgroundColor = "green";
  boardSquares[boardSquaresIdx].appendChild(house);
}
function getOutOfJail(){
  rollDiceBtn.disabled = true;
  modalP.textContent = `${currentPlayer.name} would you like to pay 50 to get out of jail or try rolling doubles?`;
  modal.appendChild(modalP);
  btn1.textContent = "Pay 50";
  btn1.id = "Pay-50";
  modal.appendChild(btn1);
  btn2.textContent = "Try for Doubles";
  modal.appendChild(btn2);
  modal.setAttribute("style", "visibility: visible");
  if(currentPlayer.getMoney() < 50){
    btn1.disabled = true;
  }
}
function checkLose(player, player2 = undefined){
  if(player.getMoney() <= 0){
    renderGameHistory(`${player.name}: THIS PLAYER LOST AND IS REMOVED FROM THE GAME`);
    currentPlayer = allPlayers[allPlayers.indexOf(player)-1];
    allPlayersIdx = allPlayers.indexOf(player)-1;
    allPlayers = allPlayers.filter(x => x != player);
    if(player2 != undefined){
      objSquares = objSquares.map(function (obj){
        if(obj.owner == player){
          obj.owner = player2;
          obj.totalHouses = 0;
        }
        return obj;
      });
    } else {
      objSquares = objSquares.map(function (obj){
        if(obj.owner == player){
          obj.bought = false;
          obj.owner = undefined;
          obj.totalHouses = 0;
        }
        return obj;
      });
    }
    //display lose message
    //clear property houses display
    if(allPlayers.length == 1){
      //display win message
    }
    render();
    return true;
  }
  render();
  return false;
}
class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this._money = 1500;
    this.location = 0;
    this.prevLocation = 0;
    this.inJail = false;
    this.jailRolls = 0;
  }
  getMoney(){
    return this._money;
  }
  setMoney(value){
    this._money += value;
  }
}
init();