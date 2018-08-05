import { LitElement, html } from '@polymer/lit-element';

class PlayerItem extends LitElement {
  constructor(){
    super();
  }
  static get properties(){
    return {
      player: Object
    }
  }
  _render({player}) {
    return html`
      <style>
        span {
          color: #333;
        }
      </style>
      ${player ? html`
        <span>${player.name}</span>
      `: ''}
    `
  }

}

window.customElements.define('player-item', PlayerItem);
