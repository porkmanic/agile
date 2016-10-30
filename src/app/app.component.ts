import {Component, ChangeDetectorRef} from "@angular/core";
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";
import {Subscription} from "rxjs";

@Component({
  selector: 'sp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _isMain = false;
  private _unDealed = true;
  _players: FirebaseListObservable<any[]>;
  m_players: any[] = [];
  _turn: FirebaseObjectObservable<number>;

  _queue: FirebaseListObservable<any[]>;
  m_queue: any[] = [];
  queue_sub: Subscription;

  constructor(private af: AngularFire, private ref: ChangeDetectorRef) {
    this._queue = af.database.list('/queue');
    this._turn = af.database.object('/game/turn');
    this._players = af.database.list('/game/players');

    this.queue_sub = this._queue.subscribe((q: any[])=> {
      console.log(q);
      this.m_queue = q;
      if (q.length === 0) {
        this._isMain = true;
      }
      if (q.length === 4) {
        this.queue_sub.unsubscribe();
      }
      if (q.length === 4 && this._isMain && this._unDealed) {
        this.deal();
      }
      this.ref.detectChanges();
    });

    this._players.subscribe((p: any[])=> {
      console.log(p);
      this.m_players = p;
      this.ref.detectChanges();
    })
  }

  deal() {
    console.log("deal");
    let deck: number[] = [];
    for (let i = 1; i <= 52; i++) {
      deck.push(i);
    }
    this.shuffle(deck);
    let players = [];
    for (let q of this.m_queue) {
      let playernew = {
        "name": q.name,
        "bids": 0,
        "trick": 0,
        "score": 0,
        "cards": deck.splice(0, 13),
        "played_card": 22
      };
      players.push(playernew);
    }
    let game$ = this.af.database.object('/game');
    game$.set({players: players,turn: 0});
    this._queue.remove();
    this._unDealed = false;
  }

  shuffle(a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }

  ready() {
    this._queue.push({"name": "Dom"});
  }

  reset() {
    this.af.database.object('/game').remove();
  }
}
