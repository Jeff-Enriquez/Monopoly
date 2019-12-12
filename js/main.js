
/* ------- boardSquares is the game sqaces --------- */
const board = []
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
/* ------- player color --------- */
const playerColors = ["red", "purple", "green", "blue"];
let colorIdx = 0;
/* -------- Player class -------- */
class Player {
  constructor(name) {
    this.name = name;
    this.money = 1500;
    this.location = 0;
    this.createPlayerIcon();
  }
  createPlayerIcon() {
    this.playerIcon = document.createElement("div");
    this.playerIcon.style.width = "10px";
    this.playerIcon.style.height = "10px";
    this.playerIcon.style.cssFloat = "left";
    this.playerIcon.style.margin = "2px";
    this.playerIcon.style.backgroundColor = playerColors[colorIdx];
    boardSquares[this.location].appendChild(this.playerIcon);
    colorIdx ++;
  }
  money(value = 0) {
    if(value = 0) {
      return this.money;
    }
    if(this.money += value < 0) {
      return undefined;
    }
    this.money += value;
  }
  movePlayer(roll) {
    boardSquares[this.location].removeChild(this.playerIcon);
    this.location += roll;
    if(this.location > 39) this.location -= 40;
    if (this.location > 29) {
      this.playerIcon.style.margin = "2px";
      this.playerIcon.style.marginLeft = "40px";
    } else if (this.location > 19) {
      this.playerIcon.style.margin = "2px";
    } else if (this.location > 9) {
      this.playerIcon.style.margin = "2px";
      this.playerIcon.style.marginLeft = "2px";
    } else {
      this.playerIcon.style.margin = "2px";
      this.playerIcon.style.marginTop = "40px";
    } 
    boardSquares[this.location].appendChild(this.playerIcon);
  }
  rollDice() {
    let roll = Math.ceil(Math.random()*6) + Math.ceil(Math.random()*6);
    this.movePlayer(roll);
    return roll;
  }
}

let player1 = new Player("Jeff");
let player2 = new Player("Zane");

/*

init() {
  players given 1500 in money
  players start at GO
  All properties are unsold
  Shuffle Chance and Community Chest
  player 1 rolls first
}
render() {
  playermove()
  propertyPurchase()
  renderDisplay()
  playerLost()
}
playermove(){
  roll dice
}
playerLost() {
  if no money
}

propertyPurchase() {
  playerMoney -= propertyCost
  property.propertyName.owner = playerName;
}

display() {
  location of player
  player money
  update player history
  if(winner())
}

winner() {
  all players - 1, have 0 money
}
*/

/*----- constants -----*/

/*----- app's state (variables) -----*/

/*----- cached element references -----*/

/*----- event listeners -----*/

/*----- functions -----*/
