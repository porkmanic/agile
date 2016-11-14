export class Player {
  constructor(public name: string,
              public cards: any[],
              public myKey: string,
              public position: number,
              public bids: number = 0,
              public trick: number = 0,
              public score: number = 0,
              public played_card: number = 0) {
  }
}
