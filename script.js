var agents = [
    "astra", "breach", "brimstone", "chamber",
    "cypher", "fade", "jett", "kayo", "killjoy",
    "neon", "omen", "phoenix", "raze", "reyna",
    "sage", "skye", "sova", "viper", "yoru"
];

var cardWrapers = new Map();
var counterWraper = document.getElementById("action-counter");
var newGameButtonWraper = document.getElementById("new-game");
var winViewWrapper = document.getElementsByClassName('win-view')[0];

function generateRandomIndex(targertArray) {
    return Math.round(Math.random() * (targertArray.length - 1));
}

function generateRandomAgentSet(numberOfAgents) {
    let n = numberOfAgents;
    let agentsCopy = [...agents];
    var agentsSet = new Set();
    for (let i = 0; i < n; i++) {
        let newAgentIndex = generateRandomIndex(agentsCopy);
        agentsSet.add(agentsCopy[newAgentIndex]);
        agentsCopy.splice(newAgentIndex, 1); // Remove the agent from copied array
    }
    return agentsSet;
}

function createCardElement(agentName) {
    let cardWraper = document.createElement('div');
    cardWraper.classList.add('card');
    let frontImg = document.createElement('img');
    frontImg.classList.add('card-front');
    frontImg.src = `./img/agents/${agentName}.png`;
    let backImg = document.createElement('img');
    backImg.classList.add('card-back');
    backImg.src = "./img/card-back.jpg";
    cardWraper.appendChild(frontImg);
    cardWraper.appendChild(backImg);
    return cardWraper;
}

function populateMain(agentsArray) {
    let mainWraper = document.getElementsByClassName("board")[0];
    mainWraper.innerHTML = "";
    cardWrapers.clear();
    agentsArray.forEach(agentName => {
        let cardWraper = createCardElement(agentName);
        mainWraper.appendChild(cardWraper);
        cardWrapers.set(cardWraper, agentName);
        cardWraper.addEventListener('click', cardClick);
    });

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffleArray(array) {
    let curId = array.length;
    while (0 !== curId) {
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
  }


/* GAME FUNCTIONS*/

var firstCardFlipped = null, secondCardFlipped = null;

async function cardClick() {
    if (!this.classList.contains('flip')){
        if (!firstCardFlipped) {
            this.classList.add('flip');
            firstCardFlipped = this;
            return;
        }
        if (!secondCardFlipped) {
            this.classList.add('flip');
            secondCardFlipped = this;
            increaseCounter();
            if (checkForFinish()){
                winViewWrapper.style.visibility = 'visible';
            }

            await sleep(1000);
            if (!checkFlippedCards()) {
                firstCardFlipped.classList.remove('flip');
                secondCardFlipped.classList.remove('flip');
            }
            firstCardFlipped = null;
            secondCardFlipped = null;
        }
    }
}

function checkFlippedCards() {
    let agent1 = cardWrapers.get(firstCardFlipped);
    let agent2 = cardWrapers.get(secondCardFlipped);
    return agent1 === agent2;
}

function increaseCounter(){
    let actualCounterValue = parseInt(counterWraper.innerHTML);
    counterWraper.innerHTML = actualCounterValue + 1;
}

function resetCounter(){
    counterWraper.innerHTML = 0;
}

var newGame = (function newGameFunction(){
    let agentsArray = generateRandomAgentSet(10);
    let cardsTypeArray = shuffleArray([...agentsArray, ...agentsArray]);
    populateMain(cardsTypeArray);
    resetCounter();
    firstCardFlipped = null, secondCardFlipped = null;
    winViewWrapper.style.visibility = 'hidden';
    return newGameFunction;
}());
newGameButtonWraper.addEventListener('click', newGame);


function checkForFinish(){
    for (const cardWraper of cardWrapers.keys()) {
        if (!cardWraper.classList.contains('flip')){
            return false;
        }
    }
    return true;
}
