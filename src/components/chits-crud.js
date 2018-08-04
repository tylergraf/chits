import { LitElement, html } from '@polymer/lit-element';
import { ChitService } from '../service/chits.js';
import { repeat } from 'lit-html/lib/repeat.js';

class ChitsCrud extends LitElement {

  constructor() {
    super();
    this.chits = [];
    this.loading = 'Loading...';

    this._getChits();
  }

  static get properties() {
    return {
      chits: Array,
      loading: String
    }
  }

  _getChits() {
    this._loadingTimeout = setTimeout(() => {
      this.loading = 'Loading, promise...';
    }, 1500);

    this.loading = 'Loading...';
    ChitService.getChits().then(chits => {
      this.chits = chits;
      this.loading = '';
      clearTimeout(this._loadingTimeout);
    });
  }

  _createChit(e) {
    e.preventDefault();
    let newChitEl = this.shadowRoot.querySelector('#newChit');
    let name = newChitEl.value;
    if (!name) return;

    ChitService.newChit({
        name
      })
      .then(chit => {
        this._getChits();
        newChitEl.value = '';
      })
  }

  _deleteChit(e, id) {
    e.preventDefault();

    ChitService.deleteChit(id)
      .then(chit => {
        this._getChits();
      })
  }


  _render({chits, loading}) {
    return html `
      <style>
        li button {
          display: none;
          cursor: pointer;
        }

        li:hover button {
          display: inline;
        }
      </style>
      <h1>Chits</h1>
      <form action="" on-submit="${e => this._createChit(e)}">
          <input type="text" id="newChit"><button type="submit">Create</button>
      </form>
      ${loading}
      <ul>
        ${repeat(chits,c => c._id, chits=>html`
          <li>
            <span>${chits.name}</span>
            <button type="button" on-click="${e=>this._deleteChit(e, chits._id)}">x</button>
          </li>
        `)}
      </ul>`

  }
}

window.customElements.define('chits-crud', ChitsCrud);
