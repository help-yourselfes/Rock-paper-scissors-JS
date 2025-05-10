const Game = new class {
    constructor() {
        this.cards = {
            types: ['rock', 'paper', 'scissors'],
            winStatements: {
                rock: 'scissors',
                paper: 'rock',
                scissors: 'paper'
            },
            get random() {
                return this.types[Math.floor(Math.random() * this.types.length)]
            }
        };
        this.stats = JSON.parse(localStorage.getItem('stats'));
        if (!this.stats) this.cleanStats();
        
        this.user = new this.Player();
        this.enemy = new this.Player();
    }
    Player = class {
        selectCard(card) {
            this.card = card;
        }
    }

    saveStats() {
        this.stats[this.result]++;
        localStorage.setItem('stats', JSON.stringify(this.stats));
    }

    cleanStats() {
        this.stats = {
            user: 0,
            draw: 0,
            enemy: 0
        }
        localStorage.removeItem('stats');
    }

    get result() {
        if (this.user.card === this.enemy.card) return 'draw'
        if (this.cards.winStatements[this.user.card] === this.enemy.card) return 'user'
        else return 'enemy'
    }
}

const UI = new class {
    Animation = {
        speed: 500, // milis
        active: false
    }
    darkMode = false;

    constructor() {
        //declaration
        this.icons = new Map();
        this.choiceButtons = new Map();
        for (let card of Game.cards.types) {
            this.icons[card] = document.getElementById(`${card}-icon`);
            this.choiceButtons[card] = document.getElementById(card);
        }
        this.card1 = document.getElementById('card1');
        this.card2 = document.getElementById('card2');

        this.html = document.getElementsByTagName('html')[0];
        this.title = document.getElementsByTagName('title')[0];

        this.result = {
            start: document.getElementById('start-p'),
            user: document.getElementById('win-p'),
            draw: document.getElementById('draw-p'),
            enemy: document.getElementById('loss-p')
        }

        this.stats = {
            user: document.getElementById('stats-win'),
            draw: document.getElementById('stats-draw'),
            enemy: document.getElementById('stats-loss'),
        }

        //functionality
        for (let buttonName in this.choiceButtons) {
            const button = this.choiceButtons[buttonName];
            const card = button.id;
            button.appendChild(this.icons[card].content.cloneNode(true));

            button.onclick = () => {
                if (this.Animation.active) return
                const actions = [
                    () => {
                        Game.user.selectCard(card);
                        this.card1.innerHTML =
                        this.card2.innerHTML = '';
                        this.card1.appendChild(this.icons[card].content.cloneNode(true))
                    },
                    () => {
                        Game.enemy.selectCard(Game.cards.random);
                        this.card2.appendChild(this.icons[Game.enemy.card].content.cloneNode(true));
                    },
                    () => {
                        Game.saveStats();
                        this.displayResult(Game.result);
                        this.Animation.active = false;
                    },
                ];
                
                this.Animation.active = true;
                this.clearResult();
                for (let actionId = 0; actionId < actions.length; actionId++) {
                    const action = actions[actionId];
                    setTimeout(() => { action() }, (actionId) * this.Animation.speed);
                }

            }
        }

        // 
        this.displayStats();

    }

    displayResult(result) {
        this.displayStats();
        this.clearResult();
        this.result[result].className = '';
    }

    displayStats() {
        for (let state in Game.stats) {
            this.stats[state].textContent = Game.stats[state];
        }
    }

    clearResult() {
        this.result.start.className =
            this.result.user.className =
            this.result.draw.className =
            this.result.enemy.className = 'hide';
    }

    switchTheme() {
        this.darkMode = !this.darkMode;
        this.html.classList.add(this.darkMode ? 'dark' : 'light');
        this.html.classList.remove(this.darkMode ? 'light' : 'dark');
    }


};


const Translation = new class {
    constructor() {
        this.translatedElements = {
            title: UI.title,
            themeSwitch: document.getElementById('theme-switcher').lastElementChild,
            languageSwitch: document.getElementById('language-switcher').lastElementChild,
            reset: document.getElementById('stats-cleaner').lastElementChild,
            start: UI.result.start,
            win: UI.result.user,
            draw: UI.result.draw,
            loss: UI.result.enemy,
        }

        this.switchLanguage('english');
    }

    russian = {
        name: 'RU',
        title: 'Камень ножницы бумага',
        themeSwitch: 'Тема',
        languageSwitch: 'Русский',
        reset: 'Очистить',
        start: 'Нажмите на фигуру для игры',
        win: 'Вы победили!',
        draw: 'Ничья!',
        loss: 'Вы проиграли!',

    }
    english = {
        name: 'EN',
        title: 'Rock paper scissors',
        themeSwitch: 'Theme',
        languageSwitch: 'English',
        reset: 'Clear data',
        start: 'Make your choice!',
        win: 'You win!',
        draw: 'Draw!',
        loss: 'You lose!',

    }
    nextLanguage() {
        return this.language.name === 'RU' ? 'english' : 'russian'
    }
    switchLanguage(newLanguage) {
        if (this.language !== this[newLanguage]) {
            this.language = this[newLanguage];
            this.updateTranslation();
        }
    }

    updateTranslation() {
        for (let name in this.translatedElements) {
            const element = this.translatedElements[name];
            if (element) element.textContent = this.language[name];
        }
    }
};
