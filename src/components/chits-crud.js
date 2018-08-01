import { LitElement, html } from '@polymer/lit-element';
import { ChitService } from '../service/chits.js';
import { repeat } from 'lit-html/lib/repeat.js';

class ChitsCrud extends LitElement {

  _render(props) {
    return html`
      <h1>Chits Hello</h1>
    `
  }

}

window.customElements.define('chits-crud', ChitsCrud);
