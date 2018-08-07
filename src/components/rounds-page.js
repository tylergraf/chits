import { LitElement, html } from '@polymer/lit-element';
import { RoundsService } from '../service/rounds.js';
import { TimeService } from '../service/time.js';
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
        window.location = `/round/${round._id}`;
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
        ul {
          z-index: 1;
          position: relative;
        }
        li button {
          display: none;
          cursor: pointer;
        }
        li:hover button {
          display: inline;
        }
        :host {
          min-height: 100vh;
          background-color: #fff;
          background: linear-gradient(to bottom, #ffffff 0%,#d4d9df 70%,#d4d9df 100%);
        }
        .img {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding-top: 66.66%;
          background: url('/images/golf-course.jpg') no-repeat;
          background-size: cover;
          z-index: 0;
        }
      </style>
      <h1>Rounds</h1>

      <a href="/round/new">New Round</a>

      ${loading}
      ${loading === '' && rounds.length ? html`
      <ul>
        ${repeat(rounds,p=>p._id,round=>html`
          ${round && round.course ? html`
            <li><a href="/round/${round._id}">Round at ${round.course.name} <span>(${TimeService._getCreationDate(round.created)})</span></a><button type="button" on-click="${e=>this._deleteRound(e, round._id)}">x</button></li>
          ` : html`
            <li><a href="/round/${round._id}">${round._id}</a><button type="button" on-click="${e=>this._deleteRound(e, round._id)}">x</button></li>
          `}
        `)}
      </ul>
      ` : html`
      <p>No Rounds</p>
      `}
    `
  }

}

window.customElements.define('rounds-page', RoundsPage);
