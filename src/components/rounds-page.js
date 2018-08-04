import { LitElement, html } from '@polymer/lit-element';
import { RoundsService } from '../service/rounds.js';
import { repeat } from 'lit-html/lib/repeat.js';

class RoundsPage extends LitElement {
  constructor(){
    super();
    this.rounds = [];
    this.loading = 'Loading...';
    this._showNew = false;

    this._getRounds();
  }
  static get properties(){
    return {
      rounds: Array,
      loading: String,
      _showNew: Boolean
    }
  }
  _getRounds(){
    this._loadingTimeout = window.setTimeout(()=>{
      this.loading = 'Loading, promise...';
    }, 1500);

    this.loading = 'Loading...';
    RoundsService.getRounds().then(rounds=>{
      this.rounds = rounds;
      this.loading = '';
      window.clearTimeout(this._loadingTimeout);
    });
  }
  _createRound(e){
    e.preventDefault();
    RoundsService.newRound()
      .then(round=>{
        this._getRounds();
      })
  }
  _deleteRound(e, id){
    e.preventDefault();

    RoundsService.deleteRound(id)
      .then(round=>{
        this._getRounds();
      })
  }
  _toggleShowNew(){
    this._showNew = !this._showNew;
  }
  _render({rounds, loading, _showNew}) {
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
      <h1>Rounds</h1>

      ${_showNew ? html`
        <form action="" on-submit="${e => this._createRound(e)}">
          <input type="text" id="newName">
          <button type="submit">Create</button>
          <button type="button" on-click="${e=>this._toggleShowNew()}">Cancel</button>
        </form>
      `: html`
        <button type="button" on-click="${e=>this._toggleShowNew()}">Add Round</button>
      `}

      ${loading}
      ${loading === '' && rounds.length ? html`
      <ul>
        ${repeat(rounds,p=>p._id,round=>html`
          <li><a href="/round/${round._id}">${round._id}</a><button type="button" on-click="${e=>this._deleteRound(e, round._id)}">x</button></li>
        `)}
      </ul>
      ` : html`
      <p>No Rounds</p>
      `}
    `
  }

}

window.customElements.define('rounds-page', RoundsPage);
