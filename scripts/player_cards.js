export default class PlayerCards {
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

  #cards;
  constructor(cards) {
    this.#cards = cards ? cards : {};
  }

  static getColour(country) {
    if (country in this.#cards) return this.#cards.country 

    return "country must be in the cards ";
  }

  hasCard(country) {
    return country in this.#cards
  }

  addCard(country, colour) {
    this.#cards[country] = colour 
    console.log(this.#cards)
  }
}