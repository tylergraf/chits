import { LitElement, html } from '@polymer/lit-element';
import { RoundsService } from '../service/rounds.js';
import { PlayerService } from '../service/players.js';
import { ChitService } from '../service/chits.js';
import { LocationService } from '../service/location.js';
import { TimeService } from '../service/time.js';
import { repeat } from 'lit-html/lib/repeat.js';
import 'fs-dialog/fs-anchored-dialog.js';
import './chit-item.js';
import './player-item.js';

class RoundPage extends LitElement {
  static get observedAttributes() {return ['round-id']; }
  constructor(){
    super();
    this._round = {players:[], chits:[]};
    this._chits = [];
    this._players = [];
    this.loading = 'Loading...';

    try{
      this._position = JSON.parse(localStorage.getItem('location'));
    } catch(e){}


  }
  attributeChangedCallback(name, oldValue, newValue){
    this.roundId = newValue;
  }
  static get properties(){
    return {
      _chits: Array,
      _players: Array,
      _round: Object,
      _searchResults: Array,
      _position: Object,
      loading: String
    }
  }
  set roundId(id){
    this._roundId = id;
    RoundsService.getRound(id).then(round=>{
      this._round = round});
  }
  get roundId(){
    return this._roundId;
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
  _addPlayer(e, id, _round){
    e.preventDefault();
    let round = Object.assign({},_round);
    round.players.push(id);
    RoundsService.updateRound(round)
      .then(savedRound=>{
        this._round = savedRound;
        this._players = this._players.filter(p=>p._id !== id);
        this._invalidateProperties();
      })
  }
  _removePlayer(e, id, _round){
    e.preventDefault();
    let round = Object.assign({},_round);
    round.players = round.players.filter(p=>p._id !== id);
    RoundsService.updateRound(round)
      .then(savedRound=>{
        this._round = savedRound;
        this._invalidateProperties();
      })
  }
  _addCourse(e, course, _round){
    e.preventDefault();
    let round = Object.assign({},_round);
    round.course = course;
    RoundsService.updateRound(round)
      .then(savedRound=>{
        this._round = savedRound;
      })
  }
  _addChit(e, id, _round){
    e.preventDefault();
    let round = Object.assign({},_round);
    round.chits.push(id);
    RoundsService.updateRound(round)
      .then(savedRound=>{
        this._round = savedRound;
        this._chits = this._chits.filter(p=>p._id !== id);
      })
  }
  _removeChit(e, id, _round){
    e.preventDefault();
    let round = Object.assign({},_round);
    round.chits = round.chits.filter(p=>p._id !== id);
    RoundsService.updateRound(round)
      .then(savedRound=>{
        this._round = savedRound;
        this._invalidateProperties();
      })
  }
  _searchForCourse(e){
    e.preventDefault();
    let searchEl = this.shadowRoot.getElementById('searchTerm');
    let term = searchEl.value;
    if(!term) return;

    LocationService.search(term, this._position)
      .then(results=>{
        this.shadowRoot.getElementById('searchDialog').open({attachToElement: searchEl, focusBackElement: searchEl});
        this._searchResults = results
      });
  }
  _showAddDialog(e, id){
    this.shadowRoot.getElementById(id).open({attachToElement: e.target, focusBackElement: e.target});
    if(id.includes('player')){
      PlayerService.getPlayers().then(players=>{
        let inRoundIds = this._round.players.map(p=>p._id);
        this._players = players.filter(p=>!inRoundIds.includes(p._id));
      });
    } else {
      ChitService.getChits().then(chits=>{
        let inRoundIds = this._round.chits.map(p=>p._id);
        this._chits = chits.filter(p=>!inRoundIds.includes(p._id));
      });
    }
  }
  _deleteRound(){
    RoundsService.deleteRound(this._roundId)
      .then(_=>{
        window.location='/';
      });
  }
  _getLocation(){
    navigator.geolocation.getCurrentPosition(({coords}) => {
      this._position = {
        lat: coords.latitude,
        long: coords.longitude
      }
      localStorage.setItem('location',JSON.stringify(this._position));
      console.log(this._position);
    });
  }
  _getZip(){
    let zip = this.shadowRoot.getElementById('zip').value;
    LocationService.zip(zip)
      .then(({latitude, longitude})=>{
        this._position = {
          lat: latitude,
          long: longitude
        }
        localStorage.setItem('location',JSON.stringify(this._position));
        console.log(this._position);
      });
  }
  _render({_round, rounds, _players, loading, _chits, _searchResults, _position}) {
    return html`
      <style>
        .fs-dialog__body {
          width: 250px;
        }
      </style>
      ${!_round.course ? html`
        <h1>Round ${_round._id}</h1>
      ` : html`
        <h1>Round at ${_round.course.name}</h1>
      `}
      <h3>${TimeService._getCreationDate(_round.created)}</h3>
      ${!_round.course ? html`
        <h2>Course</h2>
        <form on-submit="${e=>this._searchForCourse(e)}">
          ${!_position ? html`
            <button type="button" on-click="${e=>this._getLocation()}">Use Current Location</button>
            <label for="zip">Zip</label>
            <input type="text" id="zip">
            <button type="button" on-click="${e=>this._getZip()}">Get Location</button>
          ` : html`
            <button type="button" on-click="${e=>this._position = localStorage.location = undefined}">Clear Location</button>
            <input type="text" id="searchTerm">
            <button type="submit">Search</button>
          `}
        </form>
      ` : ''}
      <h2>Players</h2>
      <button type="button" on-click="${e=>this._showAddDialog(e, 'playersDialog')}">Add Player to Round</button>

      ${_round.players.length ? html`
        <ul>
          ${repeat(_round.players,p=>p._id,player=>html`
            <li><player-item player="${player}"></player-item><button type="button" on-click="${e=>this._removePlayer(e, player._id, _round)}">x</button></li>
          `)}
        </ul>
      `: ''}

      <h2>Chits</h2>
      <button type="button" on-click="${e=>this._showAddDialog(e, 'chitsDialog')}">Add Chit to Round</button>

      ${_round.chits.length ? html`
        <ul>
          ${repeat(_round.chits,p=>p._id,chit=>html`
            <li>
              <chit-item chit="${chit}"></chit-item>
              <button type="button" on-click="${e=>this._removeChit(e, chit._id, _round)}">x</button>
            </li>
          `)}
        </ul>
      `: ''}

      <button type="button" on-click="${e=>this._deleteRound()}">Delete Round</button>

      <fs-anchored-dialog id="searchDialog" no-transition no-close-button preferred-pointer-direction="up left right down">
        <div class="fs-dialog__body">
        ${_searchResults ? html`
          <ul>
            ${repeat(_searchResults,r=>r.id,result=>html`
              <li>
                <span>${result.name}</span>
                <button type="button" on-click="${e=>this._addCourse(e, result, _round)}">Select</button>
              </li>
            `)}
          </ul>
        ` : html`
          <p>No Courses found</p>
        `}
          <button type="button" data-dialog-dismiss>Done</button>
        </div>
      </fs-anchored-dialog>
      <fs-anchored-dialog id="playersDialog" no-transition no-close-button preferred-pointer-direction="up left right down">
        <div class="fs-dialog__body">

        ${_players ? html`
          <ul>
            ${repeat(_players,p=>p._id,player=>html`
              <li>
                <player-item player="${player}"></player-item>
                <button type="button" on-click="${e=>this._addPlayer(e, player._id, _round)}">Add</button>
              </li>
            `)}
          </ul>
        ` : html`
          <p>No Players</p>
        `}
          <button type="button" data-dialog-dismiss>Done</button>
        </div>
      </fs-anchored-dialog>
      <fs-anchored-dialog id="chitsDialog" no-transition no-close-button preferred-pointer-direction="up left right down">
        <div class="fs-dialog__body">

        ${_chits ? html`
          <ul>
            ${repeat(_chits,p=>p._id,chit=>html`
              <li>
                <chit-item chit="${chit}"></chit-item>
                <button type="button" on-click="${e=>this._addChit(e, chit._id, _round)}">Add</button>
              </li>
            `)}
          </ul>
        ` : html`
          <p>No Chits</p>
        `}
          <button type="button" data-dialog-dismiss>Done</button>
        </div>
      </fs-anchored-dialog>
    `
  }

}

window.customElements.define('round-page', RoundPage);
