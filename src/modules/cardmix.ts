import cardsDesk from "./gamedesk";

export const duplicateArrayAndMix = (array: any[]) => {
    const duplicateCards = array.flatMap((i) => [i, i]);
    for (let i = 0; i < duplicateCards.length - 1; i++) {
        let j = i + Math.floor(Math.random() * (duplicateCards.length - i));
        let temp = duplicateCards[j];
        duplicateCards[j] = duplicateCards[i];
        duplicateCards[i] = temp;
    }
    return duplicateCards;
};

export const createcardsArray = (cardsCount: string) => {
    let desk = new cardsDesk();
    desk.shuffle();

    switch (cardsCount) {
        case "1":
            return duplicateArrayAndMix(desk.cards.slice(0, 3));
        case "2":
            return duplicateArrayAndMix(desk.cards.slice(0, 6));
        case "3":
            return duplicateArrayAndMix(desk.cards.slice(0, 9));

        default:
            break;
    }
};
