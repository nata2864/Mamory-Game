import { createcardsArray } from "./cardmix";
import { cardsApp } from "../../index";

declare global {
    interface Window {
        timeGame: any;
    }
}

export interface DeckCard {
    suit: string;
    value: string;
}

export const startGame = (difficult: string) => {
    const suitsBackground: Record<string, string> = {
        "♠": "spades.svg",
        "♣": "clubs.svg",
        "♥": "hearts.svg",
        "♦": "diamonds.svg",
    };

    const gameSection = document.querySelector(
        ".game-section-start__container"
    ) as HTMLElement;
    const gameTable = document.querySelector(
        ".game-section-cards__container"
    ) as HTMLElement;
    gameTable.style.opacity = "1";
    gameSection.style.display = "none";
    let cardsIcons = createcardsArray(difficult);

    const cardsHtml = cardsIcons
        .map((card: DeckCard) => {
            return `
      
      <div data-value=${card.value} data-suit=${
                card.suit
            } class="game-table__card" >
     
          <div class="card__face" style="background: url(./static/images/${
              suitsBackground[card.suit]
          }) center center no-repeat, rgb(255, 255, 255);">
         
              <div class="card__top">    
                  <div class="card__value">${card.value}
                  </div>
                  <img class="card__suit" src="./static/images/${
                      suitsBackground[card.suit]
                  }" alt="suit">
              </div>
              <div class="card__bottom">    
                  <div class="card__value">${card.value}
                  </div>
                  <img class="card__suit" src="./static/images/${
                      suitsBackground[card.suit]
                  }" alt="suit">
              </div>   
          </div>
          <div class="card__back"></div>    
    </div>     
      `;
        })
        .join("");

    gameTable.innerHTML = `
    <div class="main__game_content">
        <div id="timer">
            <div class="timer__text">
                <span class='timer__text_item'>min</span> <span class='timer__text_item'>sek</span>
            </div>
            <p class='timer'>00.00</p>
        </div>
        <button class="main__game_content_button">Начать заново</button>
    </div>
        <div class="main__game_cardsBox">
        ${cardsHtml}
        </div> `;

    const restartBTn = document.querySelector(".main__game_content_button");
    restartBTn!.addEventListener("click", () => {
        startGame(difficult);
    });

    function closecards() {
        const cards = document.querySelectorAll(".card__back");
        for (const card of cards as any) {
            card.style.display = "flex";
        }
    }

    const coutDownEl = document.querySelector(".timer") as HTMLElement;
    let timer = 5;
    coutDownEl.textContent = "00.05";
    let id = setInterval(function () {
        timer--;
        if (timer === 0) {
            clearInterval(id);
            closecards();
            game();
        } else {
            coutDownEl.innerHTML = `00.0${timer}`;
        }
    }, 1000);

    function gameResult(winner: boolean) {
        clearInterval(window.timeGame);
        gameSection.style.display = "block";
        const timerResult = coutDownEl.textContent;
        gameTable.style.opacity = "0.3";
        gameSection.classList.add("popup");

        gameSection.innerHTML = `<div class="game-section-start__container">
           <div class=imagemodul>
            <img class="timer_result-img" src="./static/images/${
                winner ? 'winner.png" alt="win"' : 'loser.png" alt="lose"'
            }  >
            </div>
            
            <h2 class="game-menu_result-title">${
                winner ? "Вы выиграли" : "Вы проиграли"
            }</h2>
            <p class="game-menu__subTitle">Затраченное время</h2>
            <p class='timer_result'>${timerResult}</p>
            <button class="game-menu__start-btn">Играть снова</button>
            </div>`;

        const restartBTn = document.querySelector(".game-menu__start-btn");
        restartBTn.addEventListener("click", () => {
            cardsApp();
        });
    }

    function getTimeResult() {
        timer = 0;

        coutDownEl.textContent = "00.00";
        function setTime() {
            timer++;
            const minutes = ("00" + Math.floor(timer / 60)).slice(-2);
            const seconds = ("00" + (timer % 60)).slice(-2);
            coutDownEl.textContent = `${minutes}.${seconds}`;
        }
        window.timeGame = setInterval(setTime, 1000);
        setTimeout(clearInterval, 600000, window.timeGame);
    }

    function game(): void {
        getTimeResult();
        let firstCard: number | null = null;
        let secondCard: number | null = null;
        let clickable: boolean = true;
        let winner: boolean = false;
        const allCards: NodeListOf<HTMLDivElement> =
            document.querySelectorAll(".game-table__card");

        allCards.forEach((card: HTMLDivElement, index: number) => {
            card.addEventListener("click", () => {
                if (clickable && !card.classList.contains("successfully")) {
                    card.querySelector<HTMLDivElement>(
                        ".card__back"
                    )!.classList.remove("card__back");

                    if (firstCard === null) {
                        firstCard = index;
                    } else {
                        if (index !== firstCard) {
                            secondCard = index;
                            clickable = false;
                        }
                    }

                    if (
                        firstCard !== null &&
                        secondCard !== null &&
                        typeof firstCard === "number" &&
                        typeof secondCard === "number" &&
                        firstCard !== secondCard
                    ) {
                        if (
                            allCards[firstCard].dataset.suit ===
                                allCards[secondCard].dataset.suit &&
                            allCards[firstCard].dataset.value ===
                                allCards[secondCard].dataset.value
                        ) {
                            allCards[firstCard].classList.add("successfully");
                            allCards[secondCard].classList.add("successfully");

                            firstCard = null;
                            secondCard = null;
                            clickable = true;

                            const arrSuccess = Array.from(allCards).filter(
                                (item) =>
                                    item.classList.contains("successfully")
                            );

                            if (allCards.length === arrSuccess.length) {
                                winner = true;
                                gameResult(winner);
                            }
                        } else {
                            gameResult(winner);
                        }
                    }
                }
            });
        });
    }
};
