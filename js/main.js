class audioController {
    constructor() {
        this.bgmusic = new Audio('Assets/Audio/creepy.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameover.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.bgmusic.volume = 0.2;
        this.bgmusic.loop = true;
    }

    startMusic(){
        this.bgmusic.play();
    }
    stopMusic(){
        this.bgmusic.pause();
        this.bgmusic.currentTime = 0;
    }
    flip(){
        this.flipSound.play();
    }
    mathed(){
        this.matchSound.play();
    }
    victoryPlay(){
        this.stopMusic();
        this.victorySound.play();
    }
    defeat(){
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class gamePlay {
    constructor(totalTime,cards) {
        this.cardArray = cards;
        this.netTime = totalTime;
        this.timeRemaining = this.netTime
        this.clock = document.getElementById("Timer");
        this.clock.innerText = totalTime;
        this.flipCounter = document.getElementById("Flips");
        this.ac = new audioController();
    }

    startGame(){
        this.cardToCheck = null;
        this.busy = true;
        this.mathedArr  = [];
        this.totalClicks = 0;

        setTimeout(()=>{
            this.ac.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        },500)
 
        this.hideCards();
        this.timeRemaining = this.netTime;
        this.clock.innerText = this.netTime;
        this.flipCounter.innerText = 0;
    }


    startCountDown(){
        return setInterval(()=>{
            this.timeRemaining--;
            this.clock.innerText = this.timeRemaining;
            if(this.timeRemaining == 0){
                this.gameOver();
            }
        },1000)
    }


    gameOver(){
        clearInterval(this.countDown);
        let gameOverText = document.getElementById("game-Over-Text");
        gameOverText.classList.add("visible");
        this.ac.defeat();
    }


    shuffleCards(){
        for(let i = this.cardArray.length-1 ;i>0;i--){
            let randomIdx = Math.floor(Math.random() * (i+1));
            this.cardArray[randomIdx].style.order = i;
            this.cardArray[i].style.order = randomIdx;
        }
    }


    flipCard(card){
        if(this.canFlipCard(card)){
            this.ac.flip();
            card.classList.add("visible");
            this.totalClicks++;
            this.flipCounter.innerText = this.totalClicks;
            if(this.cardToCheck != null){
                this.checkForMatch(card);
            }
            else{
                this.cardToCheck = card;
            }

        }
    }

    checkForMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)){
            this.mathedArr.push(card);
            this.mathedArr.push(this.cardToCheck);
            card.classList.add("matched");
            this.cardToCheck.classList.add("matched");
            this.ac.mathed();
            if(this.mathedArr.length == this.cardArray.length){
                this.victory();
            }
            this.cardToCheck = null
        }
        else{
            this.busy = true;
            setTimeout(()=>{
                card.classList.remove("visible");
                this.cardToCheck.classList.remove("visible");
                this.busy = false;
                this.cardToCheck = null;
            },600)

        }
    }


    getCardType(card){
        return card.getElementsByClassName('icon')[0].src;
    }

    victory(){
        clearInterval(this.countDown);
        document.querySelector("#Victory-Text").classList.add("visible");;
        this.hideCards();
        this.ac.victoryPlay();

    }

    canFlipCard(card){
        return (!this.busy && !this.mathedArr.includes(card) && card != this.cardToCheck);
    }

    
    hideCards(){
        cards.forEach(card =>{
            card.classList.remove("visible");
            card.classList.remove("matched");
        })
    }

    resetgame(){
        clearInterval(this.countDown);
        document.querySelector("#Start-game-txt").classList.add("visible");
        this.hideCards();
        this.ac.stopMusic();
    }

}

let overlay_texts = document.querySelectorAll(".overlay-text");
let cards = document.querySelectorAll(".card");
let game = new gamePlay(100,cards);
let resetbtn = document.querySelector(".Reset-Bttn");

overlay_texts.forEach(text => {
    text.addEventListener("click",()=>{
        text.classList.remove("visible");
        game.startGame();
    })
})

resetbtn.addEventListener("click",() => {
    game.resetgame();
})


cards.forEach((card)=>{
    card.addEventListener("click",()=>{
        game.flipCard(card);
    })
})

