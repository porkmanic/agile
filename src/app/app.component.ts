import {Component, ChangeDetectorRef, HostListener} from "@angular/core";
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";
import {Subscription} from "rxjs";
import {Queue} from "./queue";
import {Player} from "./player";

@Component({
  selector: 'sp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _isMain = false;
  private _unDealed = true;
  private _myKey: string;
  private _unJoined = true;

  private _south: number;
  private _north: number;
  private _west: number;
  private _east: number;

  selectPlayers: Queue[] = [];
  my_name = '';
  _players: FirebaseListObservable<Player[]>;
  m_players: Player[] = [];
  _turn: FirebaseObjectObservable<number>;

  _queue: FirebaseListObservable<Queue[]>;
  m_queue: Queue[] = [];
  queue_sub: Subscription;

  errorMsg: string = '';
  self: Player;

  constructor(private af: AngularFire, private ref: ChangeDetectorRef) {
    this._queue = af.database.list('/queue');
    this._turn = af.database.object('/game/turn');
    this._players = af.database.list('/game/players');

    this.queue_sub = this._queue.subscribe((q: any[])=> {
      this.m_queue = q;
      this.ref.detectChanges();
    });

    this._players.subscribe((p: Player[])=> {
      if (this._unDealed) {
        let findMe = p.find(value => value.myKey === this._myKey);
        if (findMe) {
          console.log(findMe);
          this._unDealed = false;
          this.self = findMe;
          this._south = findMe.position;
          this._east = this._getPosition(findMe.position + 1);
          this._north = this._getPosition(findMe.position + 2);
          this._west = this._getPosition(findMe.position + 3);
          this.queue_sub.unsubscribe();
        }
      } else if (p.length === 0) {
        this.reStart();
      }
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
    for (let i = 0; i < this.selectPlayers.length; i++) {
      let q = this.selectPlayers[i];
      let playernew = new Player(q.name,
        deck.splice(0, 13).sort((a, b) => {
          if (a > b) {
            return -1;
          }
          if (a < b) {
            return 1;
          }
          return 0;
        }),
        q.$key, i);
      players.push(playernew);
      this._queue.remove(q.$key);
    }
    let game$ = this.af.database.object('/game');
    game$.set({players: players,turn: 0});
  }

  shuffle(a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }

  joinGame() {
    this._myKey = this._queue.push({name: this.my_name}).key;
    this._unJoined = false;
  }

  startGame() {
    const NUM_PLAYERS = 4;
    console.log(this.selectPlayers);
    if (this.selectPlayers.length === NUM_PLAYERS) {
      this._isMain = true;
      if (this._isMain && this._unDealed) {
        this.deal();
      }
    } else {
      this.errorMsg = 'Please select 4 players!';
    }
  }

  reStart() {
    this.af.database.object('/game').remove();
    this._unDealed =true;
    this.m_queue = [];
    this._unJoined = true;
    this.queue_sub = this._queue.subscribe((q: any[])=> {
      this.m_queue = q;
      this.ref.detectChanges();
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    this._queue.remove(this._myKey);
    if (!this._unDealed) {
      this.reStart();
    }
  }

  private _getPosition(i: number) {
    if (i >= 4) {
      return i - 4;
    }
    return i;
  }
}
