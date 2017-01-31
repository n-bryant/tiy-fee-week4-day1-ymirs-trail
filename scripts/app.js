"use strict";

const startBtn = document.querySelector('.start');
const dayDisp = document.querySelector('.day');
const wagonDiv = document.querySelector('.wagon');
const monsterDiv = document.querySelector('.monster');
const partyHud = document.querySelector('.hud-container');
const partyList = document.querySelector('.party');
const addBtn = document.querySelector('.add-member');
// const eatBtn = document.querySelector('.eat');
// const huntBtn = document.querySelector('.hunt');
const checkFoodBtn = document.querySelector('.check-food');
const foodTotal = document.querySelector('.food-total');
const checkHealthBtn = document.querySelector('.check-health');
const healthTotal = document.querySelector('.health-total');
const sickMembers = document.querySelector('.sick-members');
const nextBtn = document.querySelector('.next-day');

let day = 1;
let names = ['Sven', 'Bjorn', 'Ragnar', 'Hilda', 'Alda'];

/*
  Button Event Handlers
*/
// Start Game
startBtn.addEventListener('click', () => {
  startGame();
});
// Next Day
nextBtn.addEventListener('click', () => {
  nextDay();
});
// Add Member
addBtn.addEventListener('click', () => {
  warband.add();
});
// Check Food
checkFoodBtn.addEventListener('click', () => {
  warband.checkFood();
});
// Check Health
checkHealthBtn.addEventListener('click', () => {
  warband.checkHealth();
});

// display party hud
function startGame() {
  // remove start button
  startBtn.classList.add('vanish');
  // animate/remove monster
  monsterDiv.classList.add('chase');
  // animate/translate wagon
  wagonDiv.classList.add('chase');
  // show party hud
  partyHud.classList.add('show');
  warband.add();
};

// performs day transition actions
function nextDay() {
  day++;
  dayDisp.innerHTML = `Day: ${day}`;

  // updates party information
  for (let index = 0; index < warband.party.length; index++) {
    let selected = warband.party[index];
    selected.foodAmt -= (Math.floor(Math.random() * (selected.foodAmt + 1)));

    selected.onSickList = false;
    selected.sick = (Math.random() < .25);
    if (selected.sick < .25) {
      selected.sick = true;
    } else {
      selected.sick = false;
    }

    selected.regions.person.innerHTML = `${selected.name}: ${selected.foodAmt} food`;
    sickMembers.innerHTML = '';
  }

  // random chance of wagon breaking
  warband.broken = (Math.random() < .25);
  if (warband.broken < .25) {
    warband.broken = true;
  } else {
    warband.broken = false;
  }
  console.log(`Warband Broken: ${warband.broken}`);

  // if all party members are out of food: lose

  // if all party members are dead: lose

  // if day = 20 and wagon broken: lose
};

class Person {
  constructor() {
    // generate a name
    this.name = names[warband.party.length];
    // amount of food (10-50 pieces)
    this.foodAmt = Math.floor(Math.random() * ((50 - 10) + 1) + 10);
    // whether the person is sick or not (boolean)
    if (Math.random() < .25) {
      this.sick = true;
    } else {
      this.sick = false;
    }
    this.onSickList = false;
    this.init();
  }
  addListeners() {
    this.regions.eat.addEventListener('click', () => {
      this.eat();
    });
    this.regions.hunt.addEventListener('click', () => {
      this.hunt();
    });
  }
  build() {
    // new list item and span
    const personContainer = document.createElement('li');
    const person = document.createElement('span');
    personContainer.className = `person-container ${this.name.toLowerCase()}`;
    person.textContent = `${this.name}: ${this.foodAmt} food`;

    // new eat/hunt buttons
    const eat = document.createElement('button');
    eat.className = 'eat';
    eat.innerHTML = 'eat';
    const hunt = document.createElement('button');
    hunt.className = 'hunt';
    hunt.innerHTML = 'hunt';

    // append new elements
    partyList.appendChild(personContainer);
    personContainer.appendChild(person);
    personContainer.appendChild(eat);
    personContainer.appendChild(hunt);

    return {
      person: person,
      eat: eat,
      hunt: hunt
    }
  }
  // costs 10 food items
  eat() {
    if (this.foodAmt >= 10) {
      this.foodAmt -= 10;
      this.regions.person.innerHTML = `${this.name}: ${this.foodAmt} food`;
    }
  }
  // randomly generates 0-20 food items
  hunt() {
    this.foodAmt += Math.floor(Math.random() * (20 + 1));
    this.regions.person.innerHTML = `${this.name}: ${this.foodAmt} food`;
  }
  init() {
    this.regions = this.build();
    this.addListeners();
  }
}

class Wagon {
  constructor() {
    this.partyFood = null;
    this.party = [];
    this.broken = false;
  }

  addListeners() {
    this.regions.ghost.addEventListener('animationend', () => {
      this.regions.ghost.classList.remove(this.animation);
    });
  }
  // add people to the party
  add() {
    // maximum occupancy of five
    if (this.party.length < 5) {
      // add a new Person to party array
      this.party.push(new Person());
    }
  }
  // log out how much food is available in the wagon
  checkFood() {
    // food = all people's foodAmts added together
    let foodNumRef = 0
    for(let index = 0; index < this.party.length; index++) {
      foodNumRef += this.party[index].foodAmt;
    }
    this.partyFood = foodNumRef;
    healthTotal.classList.remove('is-active');
    foodTotal.innerHTML = `total party food: ${this.partyFood}`;
    foodTotal.classList.add('is-active');
    // console.log(this.partyFood);
  }
  // log out whether or not any of the passengers are sick
  checkHealth() {
    foodTotal.classList.remove('is-active');

    for(let index = 0; index < this.party.length; index++) {
      if (this.party[index].sick === true && this.party[index].onSickList === false) {
        const sickPerson = document.createElement('li');
        sickPerson.innerHTML = this.party[index].name;
        sickMembers.appendChild(sickPerson);
        this.party[index].onSickList = true;
      }
    }
    healthTotal.classList.add('is-active');
  }
  fix() {
    this.broken = false;
    nextDay();
  }
}

let warband = new Wagon();
