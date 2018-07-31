import { LitElement, html } from '@polymer/lit-element';
import { PlayerService } from '../service/players.js';
import { repeat } from 'lit-html/lib/repeat.js';

class PlayersCrud extends LitElement {
  constructor(){
    super();
    this.players = [];
    this.loading = 'Loading...';

    this._getPlayers();
  }
  static get properties(){
    return {
      players: Array,
      loading: String
    }
  }
  _getPlayers(){
    this._loadingTimeout = setTimeout(()=>{
      this.loading = 'Loading, promise...';
    }, 1500);

    this.loading = 'Loading...';
    PlayerService.getPlayers().then(players=>{
      this.players = players;
      this.loading = '';
      clearTimeout(this._loadingTimeout);
    });
  }
  _createPlayer(e){
    e.preventDefault();
    let newNameEl = this.shadowRoot.querySelector('#newName');
    let name = newNameEl.value;
    if(!name) return;

    PlayerService.newPlayer({name})
      .then(player=>{
        this._getPlayers();
        newNameEl.value = '';
      })
  }
  _deletePlayer(e, id){
    e.preventDefault();

    PlayerService.deletePlayer(id)
      .then(player=>{
        this._getPlayers();
      })
  }
  _render({players, loading}) {
    return html`
      <style>
        li button {
          display: none;
          cursor: pointer;
        }
        li:hover button {
          display: inline;
        }
      </style>
      <h1>Players</h1>
      <form action="" on-submit="${e => this._createPlayer(e)}">
        <input type="text" id="newName"><button type="submit">Create</button>
      </form>
      ${loading}
      <ul>
        ${repeat(players,p=>p._id,player=>html`
          <li> <span>${player.name}</span> <button type="button" on-click="${e=>this._deletePlayer(e, player._id)}">x</button></li>
        `)}
      </ul>
    `
  }

}

window.customElements.define('players-crud', PlayersCrud);
