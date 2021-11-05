class Dice {
  constructor (sides) { this.sides = sides; }
  roll = () =>  Math.floor(Math.random() * this.sides) + 1;
}

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

const attackBtn = document.getElementById('attack-btn');
const healBtn = document.getElementById('heal-btn');
let messageBox = document.getElementById('displayText')

let bear = new Creature ('Bear', 45, 45, 4, 1, 4, 2, 3, 0, 15, null, bite);
let harry = new Creature ('Harry', 30, 30, 2, 4, 4, 3, 3, 3, 18, null, longsword);

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

let currentRound = 0;
harry.healsLeft = 3;
if (harry.healsLeft > 0){ harry.canHeal = true; }
bear.enemyName = harry;
harry.enemyName = bear;
let playerGoesFirst = false;
rollInitiative();
textBreak();

function rollInitiative() {
  let playerInitiative = harry.initiative();
  let enemyInitiative = bear.initiative();
  let playerInitiativeText = document.createTextNode(`${harry.name} rolled a ${playerInitiative} for initiative!`);
  let enemyInitiativeText = document.createTextNode(`${bear.name} rolled a ${enemyInitiative} for initiative!`);
  messageBox.appendChild(playerInitiativeText);
  textBreak();
  messageBox.appendChild(enemyInitiativeText);
  textBreak();
  if (playerInitiative >= enemyInitiative) return playerGoesFirst = true;
}

let attackRound = () => {
  printRound();
  let roundEndText;
  if (harry.currentHP > 0 && harry.enemyName.currentHP > 0) {
    if (playerGoesFirst) {
      harry.attack();
        if (harry.enemyName.currentHP > 0) {
          harry.enemyName.attack();
        }
    } else {
      harry.enemyName.attack();
        if (harry.currentHP > 0) {
          harry.attack();
        }
    }
  } 
  textBreak();
  textBreak();
  if (harry.currentHP <= 0) {
    roundEndText = document.createTextNode(`${harry.name} has died!`);
    messageBox.appendChild(roundEndText);
    textBreak();
  }
  if (harry.enemyName.currentHP <= 0) {
    roundEndText = document.createTextNode(`${harry.enemyName.name} has died!`);
    messageBox.appendChild(roundEndText);
    textBreak();
  }
}

attackBtn.addEventListener('click', () => {
  attackRound();
  console.log(`Harry has ${harry.currentHP} HP.`);
  console.log(`Bear has ${bear.currentHP} HP.`);
});

healBtn.addEventListener('click', () => {
  harry.heal();
  console.log(`Harry has ${harry.currentHP} HP.`);
  console.log(`Bear has ${bear.currentHP} HP.`);
})