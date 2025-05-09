const
    contentDiv = document.getElementById('content'),
    ChoiceDiv = document.getElementById('Choice'),
    gameDiv = document.getElementById('game'),
    resultDiv = document.getElementById('result'),
    startP = document.getElementById('start-p'),
    winP = document.getElementById('win-p'),
    failP = document.getElementById('fail-p'),
    drawP = document.getElementById('draw-p'),
    cardTypes = [
        'scissors', 'rock', 'paper'
    ],
    icons = {
        scissors: document.getElementById('scissors-icon'),
        rock: document.getElementById('rock-icon'),
        paper: document.getElementById('paper-icon'),
    },
    buttons = {
        scissors: document.getElementById('scissors'),
        rock: document.getElementById('rock'),
        paper: document.getElementById('paper')
    },
    statsDiv = {
        wins: document.getElementById('stats-win'),
        draws: document.getElementById('stats-draw'),
        fails: document.getElementById('stats-fail'),
    },
    card1 = document.getElementById('card1'),
    card2 = document.getElementById('card2');
let gameStart = false,
    darkMode = false,
    stats = {
        _wins: 0,
        _draws: 0,
        _fails: 0,
        isStart: true,
        get wins() {
            return this._wins
        },
        addWin() {
            this._wins++;
            this.updateStats();
        },
        get draws() {
            return this._draws
        },
        adddraw() {
            this._draws++;
            this.updateStats();
        },
        get fails() {
            return this._fails
        },
        addFail() {
            this._fails++;
            this.updateStats();
        },

        updateStats() {
            this.isStart = false;
            statsDiv.wins.textContent = stats.wins;
            statsDiv.draws.textContent = stats.draws;
            statsDiv.fails.textContent = stats.fails;
        }
    },
    Translation = {
        get language() {
            if (!this._language) this._language = 'russian';
            return this._language;
        },
        set language(language) {
            this._language = language;
        },
        switchLanguage(language) {
            this.language = language;
            this.updateLanguage();
        },
        nextLanguage() {
            return this[this.language].name === 'RU' ? 'english' : 'russian';
        },
        updateLanguage() {
            document.getElementsByTagName('title')[0].textContent = this[this.language].title;
            document.getElementById('theme-switcher').lastElementChild.textContent =
                this[this.language].themeSwitch;
            document.getElementById('language-switcher').lastElementChild.textContent =
                this[this.language].languageSwitch;
            startP.textContent = this[this.language].start;
            winP.textContent = this[this.language].win;
            drawP.textContent = this[this.language].draw;
            failP.textContent = this[this.language].fail;
        },
        russian: {
            name: 'RU',
            title: 'Камень ножницы бумага',
            themeSwitch: 'Тема',
            languageSwitch: 'Русский',
            start: 'Нажмите на фигуру для игры',
            win: 'Вы победили!',
            draw: 'Ничья!',
            fail: 'Вы проиграли!',

        },
        english: {
            name: 'EN',
            title: 'Rock paper scissors',
            themeSwitch: 'Theme',
            languageSwitch: 'English',
            start: 'Make your choice!',
            win: 'You win!',
            draw: 'Draw!',
            fail: 'You lose!',

        }
    };

class Choice {
    constructor(name) {
        this._name = name
    }

    get name() {
        return this._name;
    }

    get card() {
        return this._card;
    }
    set card(card) {
        this._card = card;
        this.onSetCard();
    }

    onSetCard() { }
};

const animationSpeed = 500;

const userChoice = new Choice('user');
const enemyChoice = new Choice('enemy');

const user = userChoice;
const enemy = enemyChoice;

for (let cardID = 0; cardID < cardTypes.length; cardID++) {
    const card = cardTypes[cardID];
    const button = buttons[card];
    button.appendChild(icons[card].content.cloneNode(true));
    button.addEventListener('click', () => {
        if (!gameStart) {
            updateUserChoice(card);
            gameStart = true;
        }
    });
}

user.onSetCard = () => {
    card1.innerHTML = '';
    card2.innerHTML = '';
    clearResult();
    card1.appendChild(icons[user.card].content.cloneNode(true));
};

enemy.onSetCard = () => {
    card2.innerHTML = '';
    card2.appendChild(icons[enemy.card].content.cloneNode(true));
};

Translation.switchLanguage('russian');

function updateUserChoice(card) {
    userChoice.card = card;
    setTimeout(() => {
        updateEnemyChoice(randomCard())
    }, animationSpeed);
}

function updateEnemyChoice(card) {
    enemyChoice.card = card;
    setTimeout(() => {
        displayResult(calculateResult(userChoice, enemyChoice));
    }, animationSpeed);
}

function calculateResult(Choice1, Choice2) {
    if (!(Choice1.card && Choice2.card)) {
        throw new Error('Some of Choices doesn`t have cards!');
    }
    if (Choice1.card === Choice2.card) return 'draw';
    if (Choice1.card === cardTypes[0])
        return (Choice2.card === cardTypes[1]) ? Choice2 : Choice1;
    else if (Choice1.card === cardTypes[1])
        return (Choice2.card === cardTypes[0]) ? Choice1 : Choice2;
    else return (Choice2.card === cardTypes[0]) ? Choice2 : Choice1;

}

function displayResult(winner) {
    clearResult();

    if (winner === 'draw') {
        drawP.classList.remove('hide')
        stats.adddraw();
    } else
        if (winner === user) {
            winP.classList.remove('hide')
            stats.addWin();
        } else {
            failP.classList.remove('hide')
            stats.addFail();
        }
    setTimeout(() => {
        gameStart = false;
    }, animationSpeed);
}

function clearResult() {
    startP.classList.add('hide');
    winP.classList.add('hide');
    drawP.classList.add('hide');
    failP.classList.add('hide');
}


function randomCard() {
    if (stats.isStart) {
        switch (user.card) {
            case 'scissors':
                return 'paper';
            case 'rock':
                return 'scissors';
            case 'paper':
                return 'rock';
        }
    } else
    return cardTypes[Math.floor(Math.random() * cardTypes.length)];
}
const html = document.getElementsByTagName('html')[0];

function switchTheme() {
    darkMode = !darkMode;
    html.classList.add(darkMode ? 'dark' : 'light');
    html.classList.remove(darkMode ? 'light' : 'dark');
}

