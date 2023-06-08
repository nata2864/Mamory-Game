import cardsDesk from "./src/modules/gamedesk";

// Используем mock function
const freshDesk = jest.fn();
let desk;

// Создаем новый экземпляр класса cardsDesk
beforeEach(() => {
    desk = new cardsDesk(freshDesk());
});
// Проверка на возврат корректного количества карт
test("should return the correct number of cards", () => {
    expect(desk.numberOfCards).toBe(desk.cards.length);
});

// Проверка на то, что карты перемешиваются
test("should shuffle the cards", () => {
    const originalCards = [...desk.cards];
    desk.shuffle();
    expect(desk.cards).not.toEqual(originalCards);
});
