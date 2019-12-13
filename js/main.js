
/* -------- objSquares is the value and properties of each square space ---------- */
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

/* ------- test function -------- */
$( function() {
  $( "#accordion" ).accordion();
} );
/* ------- player color --------- */
let accordion = document.querySelector("#accordion");
const playerColors = ["red", "purple", "green", "blue"];
let colorIdx = 0;
/* -------- Player class -------- */
let currentPlayer = "";
class Player {
  constructor(name) {
    this.name = name;
    this._money = 1500;
    this.location = 0;
    this.createPlayerIcon();
    this.createPlayerDisplay();
  }
  createPlayerDisplay() {
    this.playerDisplay = document.createElement("p");
    this.playerDisplay.textContent = `Money: ${this._money}`;
    let h3 = document.createElement("h3");
    h3.textContent = this.name;
    let div = document.createElement("div");
    div.setAttribute("id", this.name);
    accordion.appendChild(h3);
    accordion.appendChild(div);
    document.querySelector(`#${this.name}`).appendChild(this.playerDisplay);  
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
    if(value == 0) {
      return this._money;
    } else if(this._money + value < 0) {
      return undefined;
    }
    this._money += value;
    this.playerDisplay.textContent = `Money: ${this._money}`;
  }
  movePlayer(roll) {
    boardSquares[this.location].removeChild(this.playerIcon);
    this.location += roll;
    if(this.location > 39) {
      this.location -= 40;
      this.money(200);
    }
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
    currentPlayer = this.name;
    landedOn(this, objSquares[this.location]);
    return roll;
  }
}

let player1 = new Player("Jeff");
let player2 = new Player("Zane");
let player3 = new Player("Sophia");


/*----- constants -----*/
const emptyDiv = document.querySelector("#empty div");
const emptyP = document.querySelector("#empty-p");
const emptyBtn1 = document.querySelector("#btn1");
const emptyBtn2 = document.querySelector("#btn2");
/*----- app's state (variables) -----*/

/*----- cached element references -----*/

/*----- event listeners -----*/

/*----- functions -----*/
function landedOn(player, propertyObj) {
  let n = propertyObj.name;
  if (n == "GO") {
    player.money(200);
    return;
  }
  if (n == "Chance" || n == "Community Chest" || n.includes("Railroad") ||
  n.includes("Jail") || n == "Electric Company" || n == "Water Works" ||
  n == "Free Parking" || n == "Income Tax"
  ) {
    return
  }
  if (propertyObj.bought) {
    player.money(-propertyObj.rent);
    propertyObj.owner.money(propertyObj.rent);
  } else {
    emptyP.textContent = `${player.name} would you like to buy ${propertyObj.name}?`;
    emptyDiv.setAttribute("style", "visibility: visible");
    emptyBtn1.addEventListener("click", function() { 
      emptyDiv.setAttribute("style", "visibility: hidden");
      if(player.money() > propertyObj.cost){
        propertyObj.bought = true;
        propertyObj.owner = player;
        player.money(-propertyObj.cost);
      }
    });
    emptyBtn2.addEventListener("click", function() { 
      emptyDiv.setAttribute("style", "visibility: hidden");
    });
  }
}