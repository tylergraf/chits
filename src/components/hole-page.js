import { LitElement, html } from '@polymer/lit-element';
import { HoleService } from '../service/holes.js';
import { RoundsService } from '../service/rounds.js';
import { repeat } from 'lit-html/lib/repeat.js';
import 'fs-dialog/fs-anchored-dialog.js';
import './chit-item.js';
import sharedStyles from './shared-styles.js';

class HolePage extends LitElement {
  static get observedAttributes() {return ['hole-id']; }
  constructor(){
    super();
    this._round = {players:[], chits:[]};
    this._hole = {};
    this._chits = [];
    this._players = [];
    this.loading = 'Loading...';

    try{
      this._position = JSON.parse(localStorage.getItem('location'));
    } catch(e){}
  }
  _getNextHole(round, currentNumber){
    if(currentNumber === 18){
      console.log(18);
    }
    return round.holes[currentNumber]
  }
  _getPrevHole(round, currentNumber){
    if(currentNumber === 1){
      console.log(1);
    }
    return round.holes[currentNumber-2]
  }
  attributeChangedCallback(name, oldValue, newValue){
    this.holeId = newValue;
  }
  static get properties(){
    return {
      _hole: Object
    }
  }
  _setHole(round, number){
    round.currentHole = number;
    RoundsService.updateRound(round).then();
  }
  _getHole(){
    HoleService.getHole(this._holeId).then(hole=>{

      this._setHole(hole._round, hole.number);
      hole._round.chits = hole._round.chits.map(chit=>{

        let sameChit = hole.chits.filter(c=>c._chit && c._chit._id === chit._id);
        if(sameChit.length){
          return sameChit[0];
        }

        return {_chit: chit};
      })
      this._hole = Object.assign({},hole);
    });
  }
  set holeId(id){
    this._holeId = id;
    this._getHole();
  }
  get holeId(){
    return this._holeId;
  }
  
  _markChit(hole, chitId, playerId){
    let newChit = {_chit: chitId, _player: playerId};

    let chitIndex = hole.chits.reduce((cur,chit,i)=>{
      if(chit._chit && chit._chit._id === chitId) return i;
      return cur;
    },-1);

    if(chitIndex > -1){
      hole.chits[chitIndex] = newChit;
    } else {
      hole.chits.push(newChit);
    }
    // hole.chits = [];
    HoleService.updateHole(hole).then(savedHole=>this._getHole())
  }
  
  // Create _clearChit method
  _clearChit(e, hole, chitId) {
    hole.chits = hole.chits.filter(chit=>chit._id !== chitId);
    HoleService.updateHole(hole).then(savedHole=>this._getHole())
    
  }
  
  _render({_hole}) {

    if(!_hole._round) return html`Loading`;

    return html`
      ${sharedStyles}
      <style>
        header,
        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        header {
          border-bottom: 1px solid #ccc;
        }
      </style>
      <header>
        <div>
          <h2>${_hole._round.course.name}</h2>
        </div>
        <div>
          <a class="button" href="/round/${_hole._round._id}">Edit Round</a>
        </div>
      </header>
      <nav>
        <div>
          <a href="/hole/${this._getPrevHole(_hole._round, _hole.number)}">Prev</a>
        </div>
        <h3>Number ${_hole.number}</h3>
        <div>
          <a href="/hole/${this._getNextHole(_hole._round, _hole.number)}">Next</a>
        </div>
      </nav>

      ${_hole && _hole._round && _hole._round.chits && repeat(_hole._round.chits, chit=>chit._chit._id, chit=>html`
        <h4>${chit._chit.name}</h4>
        ${repeat(_hole._round.players, player=>player._id, (player, index)=>html`
          <span>
            <input on-input="${e=>this._markChit(_hole, chit._chit._id, player._id)}" type="radio" name="${chit._chit._id}" checked="${chit._player && chit._player._id === player._id}" id="${chit._chit._id}_${player._id}">
            <label for$="${chit._chit._id}_${player._id}">${player.name}</label>
          </span>
          
        `)}
        <button on-click="${e=>this._clearChit(e, hole, chitId)}">Clear</button>
      `)}
    `
  }

}

window.customElements.define('hole-page', HolePage);
