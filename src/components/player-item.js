import { LitElement, html } from '@polymer/lit-element';

class PlayerItem extends LitElement {
  constructor(){
    super();
    this.player = {};
  }
  static get properties(){
    return {
      player: Object
      // {
      //   name: "Tyler",
      //   avatarUrl: 'asdflasdjfilasdf.jpeg'
      // }
    }
  }
  _render({player}) {
    return html`
      <style>
        span {
          color: #333;
        }
        .avatar {
          height: 40px;
          width: 40px;
          display: inline-block;
          background-size: cover;
        }
      </style>
      ${player.name ? html`
        <span id="avatar" class="avatar" style$="background-image: url(${player.avatarUrl})"></span>
        <span>${player.name}</span>
      ` : ''}
    `
  }

}

window.customElements.define('player-item', PlayerItem);
