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
    this._loadingTimeout = window.setTimeout(()=>{
      this.loading = 'Loading, promise...';
    }, 1500);

    this.loading = 'Loading...';
    PlayerService.getPlayers().then(players=>{
      this.players = players;
      this.loading = '';
      window.clearTimeout(this._loadingTimeout);
    });
  }
  _createPlayer(e){
    e.preventDefault();
    let newNameEl = this.shadowRoot.querySelector('#newName');
    let avatarEl = this.shadowRoot.querySelector('#avatar');
    let name = newNameEl.value;
    let avatarUrl = avatarEl.value;
    if(!name) return;

    PlayerService.newPlayer({name, avatarUrl})
      .then(player=>{
        this._getPlayers();
        newNameEl.value = '';
        avatarEl.value = '';
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
        <label for="newName">Name</label>
        <input type="text" id="newName">
        <label for="avatar">Avatar URL</label>
        <input type="text" id="avatar">
        <button type="submit">Create</button>
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
