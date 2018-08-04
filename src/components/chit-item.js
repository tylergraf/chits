import { LitElement, html } from '@polymer/lit-element';

class ChitItem extends LitElement {
  constructor(){
    super();
  }
  static get properties(){
    return {
      chit: Object
    }
  }
  _render({chit}) {
    return html`
      <style>
        span {
          color: #333;
        }
      </style>
      <span>${chit.name}</span>
    `
  }

}

window.customElements.define('chit-item', ChitItem);
