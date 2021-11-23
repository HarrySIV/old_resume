// Create dice class that can be called anywhere to roll a random integer dependent on the amount of sides.
class Dice {
  constructor (sides) { this.sides = sides; }
  roll = () =>  Math.floor(Math.random() * this.sides) + 1;
}

// Create creature class that can be used to create any sentient creature in the game. Has Attack and Heal functionality built in
class Creature {
  constructor(name, maxHP, currentHP, str, dex, con, int, wis, cha, ac, enemyName, weapon) {
    this.name = name;
    this.maxHP = maxHP;
    this.currentHP = currentHP
    this.str = str;
    this.dex = dex;
    this.con = con;
    this.int = int;
    this.wis = wis;
    this.cha = cha;
    this.ac = ac;
    this.enemyName = enemyName;
    this.weapon = weapon;
  }
  attack = () => {
    let attackText = `${this.name} uses ${this.weapon.weaponName}!`;
    let toHit = d20.roll() + this.str + this.weapon.weaponModifier;
    let displayAttackText = document.createTextNode(attackText);
    messageBox.appendChild(displayAttackText);
    textBreak();
    let hitText, missText, playerText;
    if (toHit >= this.enemyName.ac) {
      let damageDealt = this.weapon.damage() + this.str;
      this.enemyName.currentHP -= damageDealt;
      hitText = `${this.name} rolled a ${toHit} and hits! They deal ${damageDealt} ${this.weapon.damageType} damage!`;
      playerText = document.createTextNode(hitText);
    } else { 
      missText = `${this.name} rolled a ${toHit} and misses!`; 
      playerText = document.createTextNode(missText);
    }
    messageBox.appendChild(playerText);
    textBreak();
  }
  heal = () => {
    if (this.canHeal) {
      printRound();
      this.healsLeft--;
      if (this.healsLeft <= 0) {this.canHeal = false;}
      let amountHealed = d8.roll() + this.cha;
      this.currentHP += amountHealed; 
      if (this.currentHP > this.maxHP) { this.currentHP = this.maxHP; }
      let healedText = document.createTextNode(`${this.name} healed for ${amountHealed} HP.`);
      messageBox.appendChild(healedText);
      textBreak();
      if (this.enemyName.currentHP > 0) {
        this.enemyName.attack();
        textBreak();
      }
    } else {
      let noHealsLeftText = document.createTextNode(`${this.name} has no heals left and cannot heal`);
      messageBox.appendChild(noHealsLeftText);
      textBreak();
      textBreak();
    }
  }

    initiative = () => {
      let initiative = d20.roll() + this.dex;
      return initiative;
    }
}

// Create weapon class that can create any weapon in the game, has damage output functionality built in.
class Weapon {
  constructor(weaponName, damageDice, attackRange, weaponModifier, damageType) {
    this.weaponName = weaponName;
    this.damageDice = damageDice;
    this.attackRange = attackRange;
    this.weaponModifier = weaponModifier;
    this.damageType = damageType;
  }
  damage = () => this.damageDice.roll() + this.weaponModifier;
}

// Create Dice and Weapons, which are unchanging.
const d4 = new Dice (4);
const d6 = new Dice (6);
const d8 = new Dice (8);
const d10 = new Dice (10);
const d12 = new Dice (12);
const d20 = new Dice (20);
const d100 = new Dice (100);
const shortsword = new Weapon ('Shortsword', d6, 5, 1, 'piercing');
const longsword = new Weapon ('Longsword', d10, 5, 1, 'slashing');
const bite = new Weapon ('Bite', d8, 5, 0, 'piercing');
const wabbajack = new Weapon ('Quaterstaff', d12, 60, 3, "force");
const chakram = new Weapon ('Chakram', d6, 20/60, 1, 'piercing');

// Add Buttons
const attackBtn = document.getElementById('attack-btn');
const healBtn = document.getElementById('heal-btn');
const beginBtn = document.getElementById('beginBtn');

//Add modal
const characterCreationModal = document.getElementById('characterCreationModal');

// Add text formatting functionality to reuse and clean up long blocks of code.
const textBreak = () => {
  let textBreak = document.createElement('br');
  messageBox.appendChild(textBreak);
}

const lineBreak = () => {
  let textBreak = document.createElement('hr');
  messageBox.appendChild(textBreak);
}

const printRound = () => {
  currentRound++;
  let printRound = document.createTextNode(`Round ${currentRound}`);
  messageBox.appendChild(printRound);
  lineBreak();
}

// Add dynamic message block
let messageBox = document.getElementById('displayText')

//Game Start
let currentRound = 0;
let playerName;
let player;
let bear;
let playerGoesFirst = false;

//Initiative functionality to determine the order of actions each round. 
function rollInitiative() {
  let playerInitiative = player.initiative();
  let enemyInitiative = player.enemyName.initiative();
  let playerInitiativeText = document.createTextNode(`${player.name} rolled a ${playerInitiative} for initiative!`);
  let enemyInitiativeText = document.createTextNode(`${bear.name} rolled a ${enemyInitiative} for initiative!`);
  messageBox.appendChild(playerInitiativeText);
  textBreak();
  messageBox.appendChild(enemyInitiativeText);
  textBreak();
  if (playerInitiative >= enemyInitiative) return playerGoesFirst = true;
}

//Round functionality when the attack button is pressed. Prevents attacks if death occurs and ends combat.
let attackRound = () => {
  printRound();
  if (player.currentHP > 0 && player.enemyName.currentHP > 0) {
    if (playerGoesFirst) {
      player.attack();
        if (player.enemyName.currentHP > 0) {
          player.enemyName.attack();
        }
    } else {
      player.enemyName.attack();
        if (player.currentHP > 0) {
          player.attack();
        }
    }
  } 
  textBreak();
  textBreak();
  if (player.currentHP <= 0) {
    let roundEndText = document.createTextNode(`${player.name} has died!`);
    messageBox.appendChild(roundEndText);
    textBreak();
    disableBtn();
  }
  if (player.enemyName.currentHP <= 0) {
    let roundEndText = document.createTextNode(`${player.enemyName.name} has died!`);
    messageBox.appendChild(roundEndText);
    textBreak();
    disableBtn();
  }
};

//Adds button functionality to attack and heal. 
attackBtn.addEventListener('click', () => {
  attackRound();
  console.log(`${playerName} has ${player.currentHP} HP.`);
  console.log(`Bear has ${bear.currentHP} HP.`);
});

healBtn.addEventListener('click', () => {
  player.heal();
  console.log(`Harry has ${player.currentHP} HP.`);
  console.log(`Bear has ${bear.currentHP} HP.`);
});

beginBtn.addEventListener('click', () => {
  playerName = document.getElementById("playerName").value;
  player = new Creature (`${playerName}`, 30, 30, 2, 4, 4, 3, 3, 3, 18, null, longsword);
  bear = new Creature ('Bear', 45, 45, 4, 1, 4, 2, 3, 0, 15, null, bite);
  player.healsLeft = 3;
  if (player.healsLeft > 0){ player.canHeal = true; }
  bear.enemyName = player;
  player.enemyName = bear;
  rollInitiative();
  textBreak();
  if (playerName) {
    characterCreationModal.style.display = "none";
  } else alert('Please enter a name');
});

//Disable Button Press
const disableBtn = () => {
  healBtn.disabled = true;
  attackBtn.disabled = true;
}