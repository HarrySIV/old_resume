function Dice(sides) { this.sides = sides; }

Dice.prototype.roll = function () { return Math.floor(Math.random() * this.sides) + 1; }

function Creature(name, currentHP, str, cha, ac, enemyName, weapon) {
   this.name = name;
   this.currentHP = currentHP;
   this.str = str;
   this.cha = cha;
   this.ac = ac;
   this.enemyName = enemyName;
   this.weapon = weapon;
}

Creature.prototype.attack = function() {
   console.log(`${this.name} uses ${this.weapon.weaponName}!`)
   let toHit = d20.roll() + this.str + this.weapon.weaponModifier;
   if (toHit >= this.enemyName.ac) {
     let damageDealt = this.weapon.damage() + this.str;
     this.enemyName.currentHP -= damageDealt;
     console.log(`${this.name} rolled a ${toHit} and hits! They deal ${damageDealt} ${this.weapon.damageType} damage!`);
   } else console.log(`${this.name} rolled a ${toHit} and misses!`)
}

Creature.prototype.heal = function() {
   if (this.canHeal) {
     let amountHealed = d8.roll() + this.cha;
     this.currentHP += amountHealed; 
     console.log(`${this.name} healed for ${amountHealed} HP. They have ${this.currentHP} HP`)
     this.enemyName.attack();
   }
}

function Weapon(weaponName, damageDice, attackRange, weaponModifier, damageType) {
      this.weaponName = weaponName;
      this.damageDice = damageDice;
      this.attackRange = attackRange;
      this.weaponModifier = weaponModifier;
      this.damageType = damageType;
}

Weapon.prototype.damage = function() { return this.damageDice.roll() + this.weaponModifier; }

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
 
 let bear = new Creature ('Bear', 45, 4, 0, 15, null, bite);
 let harry = new Creature ('Harry', 30, 3, 2, 16, null, longsword);
 
 harry.canHeal = true;
 bear.enemyName = harry;
 harry.enemyName = bear;
 
 let attackRound = () => {
   harry.attack();
   bear.attack();
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