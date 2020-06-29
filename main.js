document.addEventListener('DOMContentLoaded', function () {

    const model = {
        Grid: function (row, col) {
            this.row = row,
            this.col = col
        },
        level: function (levelNumber) {
            switch(levelNumber) {
                case 0: return ['☯','♫','☯','♫','♞','♞','☂','☂','☀','☀','❤','❤']; break;
                case 1: return ['☯','♫','☯','♫','♞','♞','☂','☂','☀','☀','❤','❤','😀','😀','😜','😜']; break;
                case 2: return ['☯','♫','☯','♫','♞','♞','☂','☂','☀','☀','❤','❤','😀','😀','😜','😜','👻','👻','👀','👀']; break;
                default: console.log('Error Level not passed');
                
            }
        },
        currentCardsSelected: {
            'card1' : '',
            'card2' : ''
        },
        controlTheGame: {
            'cardsShown' : 0,
            'movimentCounter' : 0,
            'currentStarRating' : 3,
            'currentLevel' : 0,
            'scores' : 0,
            'currentPlayerID' : 0,
            'currentPlayerName' : ''
        },
        starRating: function(number) {
            switch(number) {
                case 0: return "☆☆☆"; break;
                case 1: return "★☆☆"; break;
                case 2: return "★★☆"; break;
                case 3: return "★★★"; break;
                default: console.log('Error, Number of Stars not provided');
                
            }
        }

    }


    
    const octupus = {
        getGrid: (row, col) => {
            return new model.Grid(row, col);
        },
        getLevel: () => {
            return model.controlTheGame.currentLevel;
        },
        getLevelCards: () => {
            const level = model.controlTheGame.currentLevel;
            let cardsArray = model.level(level);
            
            // Classificando uma matriz em ordem aleatória
            return cardsArray.sort(function(a, b){return 0.5 - Math.random()});            
        },
        setLevel: (level) => {
            model.controlTheGame.currentLevel = level;
        },
        getCurrentsCards: () => {
            return model.currentCardsSelected;
        },
        getCurrentContentCard1: () => {
            return model.currentCardsSelected.card1;
        },
        getCurrentContentCard2: () => {
            return model.currentCardsSelected.card2;
        },
        setCurrentContentCard1: (cardContent) => {
            model.currentCardsSelected.card1 = cardContent;
        },
        setCurrentContentCard2: (cardContent) => {
            model.currentCardsSelected.card2 = cardContent;
        },
        getCardsShownCounter: () => {
            return model.controlTheGame.cardsShown;
        },
        setCardShownCounter : () => {
            let cardsStored = model.controlTheGame.cardsShown;
            model.controlTheGame.cardsShown = cardsStored + 2;
        },
        getMovimentCounter: () => {
            return model.controlTheGame.movimentCounter;
        },
        setMovimenteCounter: () => {
            model.controlTheGame.movimentCounter++;
        },
        resetControls: (levelToSet) => {
            model.controlTheGame.movimentCounter = 0;
            model.controlTheGame.cardsShown = 0;
            model.controlTheGame.currentStarRating = 3;
            model.controlTheGame.currentLevel = levelToSet;
            model.controlTheGame.scores = 0;
        },
        setStarRating: (numOfStarsRating) => {
            model.controlTheGame.currentStarRating = numOfStarsRating;
        },
        getStarRating: () => {
            const numberOfStars = model.controlTheGame.currentStarRating;
            return model.starRating(numberOfStars);
        },
        getNumOfStars: () => {
            return model.controlTheGame.currentStarRating;
        },
        setNameOfPlayer: (name) => {
            var uniqueId = (new Date).getTime(); 
            model.controlTheGame.currentPlayerID = uniqueId;
            model.controlTheGame.currentPlayerName = name;
            let playerData = [];
            playerData[0] = name;
            playerData[1] = '0';
            localStorage.setItem("player-" + uniqueId, JSON.stringify(playerData));
        },
        getNameOfPlayer: () => {
            return JSON.parse(localStorage.getItem("player-" + model.controlTheGame.currentPlayerID));
            
        },
        getRanking: () => {
            let playerList = "";
            for (var i = 0; i < localStorage.length; i++){
                let stringKey = localStorage.key(i);
                if(stringKey.indexOf('player-') > -1) {
                    let [player, score] = JSON.parse(localStorage.getItem(localStorage.key(i)));   
                    playerList += `<li> ${player} - ${score}</li>`;
                }
            }
            return playerList;
        },
        setScore: (number) => {
            model.controlTheGame.scores += number;
            const playerName = model.controlTheGame.currentPlayerName;
            const playerScore = model.controlTheGame.scores;
            let playerData = [];
            playerData[0] = playerName;
            playerData[1] = playerScore;
  
            localStorage.setItem("player-" + model.controlTheGame.currentPlayerID, JSON.stringify(playerData));
        },

        init: () => {
            view.init();
            
        }
    }

    const view = {
        init: () => {
            const [modalGameElement, modalGameContentElement] = view.getModalStructure();
            
            
            // formulário de entrada para obter o nome do jogador antes de iniciar o jogo
            let contentAddNamePlayer = '<h2>Let\'s get started</h2>' +
            '<p></label> <input id="name_of_player" value="" type="text" placeholder="your nickname" required>' +
                '<button class="save_name_player_btn" > Go! </button></p>' +
                '<h3>Last Players Scores</h3>';
            modalGameContentElement.innerHTML = contentAddNamePlayer;

            
            // Lista de Jogadores - Classificação
            let playerListElement = document.createElement('ul');
            playerListElement.innerHTML = octupus.getRanking();
            modalGameContentElement.appendChild(playerListElement);
            
            
            // mostra o modelo na tela
            modalGameElement.classList.remove("hide");

            
            // manipulador quando o nome do jogador salvo btn(botão) é clicado
            let saveNamePlayerBtn = document.querySelector(".save_name_player_btn");
            saveNamePlayerBtn.onclick = function() {
                const nameOfPlayer = document.getElementById('name_of_player');
                let playerName; 
                if(!nameOfPlayer.value) {
                    playerName = 'quest';
                } else {
                    playerName = nameOfPlayer.value;
                }
                
                
                // salva o nome do player no armazenamento local
                octupus.setNameOfPlayer(playerName);
                
                
                // fechar modal 
                modalGameElement.classList.add("hide");
                view.startTheGame();
            }
            
        },
        getModalStructure: () => {
            const modalGameElement = document.querySelector(".modal_game");
            const modalGameContentElement = document.querySelector(".modal_game_content");

            return [modalGameElement, modalGameContentElement];
        },
        startTheGame: () => {
            let gridElement = document.getElementById('game_grid');
            const [modalGameElement, modalGameContentElement] = view.getModalStructure();
            
            // obtém uma matriz com valores para o nível -> nível 0 = 16 cartões
            let cardsArray = octupus.getLevelCards();
            let  numeberOfCards = cardsArray.length;
            
            //encontrar o melhor algoritmo para dividir a distribuição correta do jogo da memória
            let divisionRowCol = Math.sqrt(numeberOfCards);
            divisionRowCol = Math.trunc(divisionRowCol);
            
            const numRows = Math.round(numeberOfCards/divisionRowCol);
            
            // const numCol = numRows;
            const numCol = divisionRowCol;


                
            
            // obter instância para o Grid
            let Grid = octupus.getGrid(numRows, numCol);
        

            
            // construiu a estrutura do jogo
            let fragmentBuilded = view.buildGame(Grid, cardsArray);
            gridElement.appendChild(fragmentBuilded);

            
            // Nome do jogador
            let nameOfPlayerElement = document.getElementById('player_name');
            nameOfPlayerElement.innerHTML = view.showPlayerData();

            
            // adiciona controles ao jogo
            let gameControlElement = document.getElementById("game_control");

            //Reset Btn(botão) 
            let restartGameBtnElement = '<span id="restart_game_btn"> <i class="fas fa-redo-alt"></i> </span>';
            gameControlElement.innerHTML = restartGameBtnElement;
            let restardGameBtn = document.getElementById('restart_game_btn');
            restardGameBtn.onclick = function() {
                resetGame(0);
            }

            //show moviments
            let showMovesElement = document.createElement('span');
            showMovesElement.setAttribute('id', 'show_moves');
            showMovesElement.innerText = octupus.getMovimentCounter() + ' moves';
            gameControlElement.appendChild(showMovesElement);

            
            //Cronômetro
            let timerElement = document.createElement('span');
            timerElement.setAttribute('id','timer');
            timerElement.innerHTML="00<font color=#000000>:</font>00<font color=#000000>:</font>00";
            gameControlElement.appendChild(timerElement);
            let sHors = "0" + 0; 
            let sMins = "0" + 0;
            let sSecs = -1;
            let timeOut;

            // Estrelas de avaliação
            let starRatingElementCreated = document.createElement('span');
            starRatingElementCreated.setAttribute('id','star_rating');
            starRatingElementCreated.innerText = octupus.getStarRating(3);
            gameControlElement.appendChild(starRatingElementCreated);
            let starRatingElement = document.getElementById('star_rating');


            
            // ouça um clique no cartão
            gridElement.onclick = function(e) {

                
                let idCardHideClicked = e.target.id;
                let classCardHideClicked = e.target.classList.value;
                let contentCard1 = octupus.getCurrentContentCard1();
                let contentCard2 = octupus.getCurrentContentCard2();
                
                // verifica se apenas <td> / card é clicado e se o cartão está oculto
                if(idCardHideClicked != "game_grid" && classCardHideClicked == "card_hided") {

                    if(contentCard1 == "" && contentCard2 == "") {
                        let card = showTheCard(idCardHideClicked);
                        octupus.setCurrentContentCard1(card);

                        
                        // inicia o timer (quando o primeiro cartão é clicado)
                        if(octupus.getMovimentCounter() == 0) {
                            startTimer();
                        }

                    } else if (contentCard1 != "" && contentCard2 == "") {
                        let card = showTheCard(idCardHideClicked);
                        octupus.setCurrentContentCard2(card);

                        // verifica o número de estrelas Classificação
                        octupus.setMovimenteCounter();
                        let showMovesElementToUpdate = document.getElementById('show_moves');
                        showMovesElementToUpdate.innerText = octupus.getMovimentCounter() + ' moves';
                        
                        //check number of star Rating
                        checkStarRating();
                        starRatingElement.innerText = octupus.getStarRating();

                        
                        // verifica se as cartas coincidem após 1s (o usuário precisa ter tempo para ver as duas cartas clicadas)
                        setTimeout(checkCardsMatch, 1000);
                        
                    }
                }

                function showTheCard(idCardHideClicked) {
                    let idElementToShow = idCardHideClicked.split("-");
                    let cardToShow = document.getElementById(idElementToShow[0]);               

                    return cardToShow;
                }

                function checkCardsMatch() {
                    let contentCard1 = octupus.getCurrentContentCard1();
                    let contentCard2 = octupus.getCurrentContentCard2();
                    let idCardToHide1 = contentCard1.id;
                    let idCardToHide2 = contentCard2.id;

                    let hideCard1 = document.getElementById(idCardToHide1);
                    let hideCard2 = document.getElementById(idCardToHide2);

                    if (contentCard1.innerText == contentCard2.innerText) {
                        resetCards();
                        octupus.setCardShownCounter();
                        // marcar o jogador
                        octupus.setScore(5);
                        nameOfPlayerElement.innerHTML = view.showPlayerData();

                        checkEndTheGame();
                        
                    } else {
                        playSound('som/som-erro.wav');
                        
                        hideCard1.offsetParent.parentElement.classList.add("shake");
                        hideCard2.offsetParent.parentElement.classList.add("shake");

                        setTimeout(() => {
                            hideCard1.offsetParent.parentElement.classList.toggle("hover");
                            hideCard2.offsetParent.parentElement.classList.toggle("hover");
                            hideCard1.offsetParent.parentElement.classList.remove("shake");
                            hideCard2.offsetParent.parentElement.classList.remove("shake");
                        }, 1000);

                        resetCards(); 
                    }
                }

                function resetCards() {
                    octupus.setCurrentContentCard1("");
                    octupus.setCurrentContentCard2("");
                }

                function checkEndTheGame() {
                    if(numeberOfCards == octupus.getCardsShownCounter()) {

                        let timerEndTheGameElement = document.getElementById('timer');

                        let contentEndTheGame = '<h2>Well Done!!</h2>' +
                                                '<p>You finished with just ' + octupus.getMovimentCounter() + ' moviments!' +
                                                '<p>With the time of ' + timerEndTheGameElement.innerText + '</p>' +
                                                '<p>'+ starRatingElement.innerText +'</p>' +
                                                '<p><img width="10%" src="images/bananaman.gif" alt="A animeted gift with a Dacing banana" ></p>';
                        modalGameContentElement.innerHTML = contentEndTheGame;

                        let nextLevelElement = document.createElement('div');
                        nextLevelElement.setAttribute('id','next_level_btn');
                        let nextLevelText =  '';

                        const level = octupus.getLevel();
                        if(level >= 0 && level < 2) {
                            nextLevelText = `Go to Level ${level + 2}`;
                        } else {
                            nextLevelText = 'You Finished the Game!!'
                        }
                        nextLevelElement.innerText = nextLevelText;
                        modalGameContentElement.appendChild(nextLevelElement);
                        let nextLevelBtn = document.getElementById('next_level_btn');
                        nextLevelBtn.onclick = function() {
                            modalGameElement.classList.add("hide");
                            setNextLevel();
                        };

                        let resetBtnEndGameElement = document.createElement('div');
                        resetBtnEndGameElement.setAttribute('id', 'reset_btn_end_game');
                        resetBtnEndGameElement.innerHTML = '<i class="fas fa-redo-alt"></i>';
                        modalGameContentElement.appendChild(resetBtnEndGameElement);
                        let resetBtnEndGame = document.getElementById('reset_btn_end_game');
                        resetBtnEndGame.onclick = function() {
                            modalGameElement.classList.add("hide");
                            resetGame(0);
                        }

                        clearTimeout(timeOut);

                        modalGameElement.classList.remove("hide");


                        
                    }
                }
                
            };

            function checkStarRating() {
                let moves = octupus.getMovimentCounter();
                if(moves > 12 && moves <= 20) {
                    octupus.setStarRating(2);
                } else if (moves > 20 && moves <= 30) {
                    octupus.setStarRating(1);
                } else if (moves > 30) {
                    octupus.setStarRating(0);
                }
            }

            function startTimer() {
                sSecs++;
                if(sSecs == 60){
                    playSound('sounds/time-past-one-minute.wav');
                    sSecs = 0;
                    sMins++;
                    if(sMins <= 9) {
                        sMins = "0" + sMins;
                    }
                }
                if(sMins == 60){
                    sMins = "0" + 0;
                    sHors++;
                    if(sHors <= 9) {
                        sHors = "0" + sHors;
                    }
                }
                if(sSecs <= 9) {
                    sSecs = "0" + sSecs;
                }

                timerElement.innerHTML = sHors + "<font color=#000000>:</font>" + sMins + "<font color=#000000>:</font>" + sSecs;
                timeOut =  setTimeout(startTimer,1000);            
            }

            function resetGame(levelToSet) {
                reset(levelToSet);
                octupus.init();
            }

            function reset(levelToSet) {
                gridElement.innerHTML = "";
                octupus.resetControls(levelToSet);
                clearTimeout(timeOut);
            }

            function startNextLevel(levelToSet) {
                reset(levelToSet);
                view.startTheGame();
            }

            function playSound(path) {
                var audioElement = document.createElement('audio');
                audioElement.setAttribute('src', path);
                audioElement.play();
            }

            function setNextLevel() {
                const currentlyLevel = octupus.getLevel();
                if(currentlyLevel == 0) {
                    checkScores();
                    startNextLevel(1);
                } else if(currentlyLevel == 1) {
                    checkScores();
                    startNextLevel(2);
                } else {
                    checkScores();
                    resetGame(0);
                }

                function checkScores() {
                    const numOfStars = octupus.getNumOfStars();
                    const minutesAgo = parseInt(sMins);
                    switch(numOfStars) {
                        case 3: octupus.setScore(10); break;
                        case 2: octupus.setScore(5); break;
                        case 1: octupus.setScore(2); break;
                    }

                    
                    if(minutesAgo == 00) {
                        octupus.setScore(5)
                    } else if(minutesAgo == 01) {
                        octupus.setScore(3);
                    }


                    nameOfPlayerElement.innerHTML = view.showPlayerData();
                }
            }
        },
        buildGame: (Grid, cards) => {
            
            // melhorou o desempenho de 0,312ms para 0,195ms usando o fragmento
            let fragment = document.createDocumentFragment();
            let numberCardsCount = 0;
            for(let r = 1; r <= Grid.row; r++) {
                let createRow = document.createElement("tr");
                for(let c = 1; c <= Grid.col; c++) {
                    let createdCard = document.createElement("td");
                    let flipContainerElement = document.createElement("div");
                    flipContainerElement.setAttribute("class", "flip-container");
                    let flipperElement = document.createElement("div");
                    flipperElement.setAttribute("class", "flipper");

                    let cardFrontElement = document.createElement("div");
                    cardFrontElement.setAttribute("class", "card_hided");
                    cardFrontElement.setAttribute("id", r+''+c +'-hide');
                    cardFrontElement.innerText = "";
                    flipperElement.appendChild(cardFrontElement);
                    flipContainerElement.appendChild(flipperElement);

                    let cardBackElement = document.createElement("div");
                    cardBackElement.setAttribute("class", "card");
                    cardBackElement.setAttribute("id", r+''+c);
                    cardBackElement.innerText = cards[numberCardsCount];
                    flipperElement.appendChild(cardBackElement);
                    flipContainerElement.appendChild(flipperElement);

                    createdCard.appendChild(flipContainerElement);
                    createRow.appendChild(createdCard);
                    numberCardsCount++;
                }
                
                fragment.appendChild(createRow);
                
            }

            return fragment;
        },
        showPlayerData: () => {
            let [playerName, score] = octupus.getNameOfPlayer();
            return `<h3>${playerName}: ${score} scores</h3>`;
        }
    }

    
    // aplicativo começa aqui
    octupus.init();
});