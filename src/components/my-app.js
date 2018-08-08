/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';



// These are the elements needed by this element.
import './snack-bar.js';

class MyApp extends LitElement {
  _render({appTitle, _page, _drawerOpened, _snackbarOpened, _offline, _item, _params}) {
    // Anything that's related to rendering should be done in here.
    return html`
    <style>
      :host {
        --app-drawer-width: 256px;
        display: block;

        --app-primary-color: #E91E63;
        --app-secondary-color: #293237;
        --app-dark-text-color: var(--app-secondary-color);
        --app-light-text-color: white;
        --app-section-even-color: #f7f7f7;
        --app-section-odd-color: white;

        --app-header-background-color: white;
        --app-header-text-color: var(--app-dark-text-color);
        --app-header-selected-color: #55BDFD;

        --app-drawer-background-color: var(--app-secondary-color);
        --app-drawer-text-color: var(--app-light-text-color);
        --app-drawer-selected-color: #78909C;

        min-height: 100%;
        position: relative;
      }
      main {
        padding: 75px 10px 80px;
      }
      header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        color: #fff;
        background-color: #FEE140;
        background-image: linear-gradient(60deg, #FEE140 0%, #FA709A 100%);
        border-bottom: 1px solid #eee;
      }

      .logo {
        font-family: 'Pacifico';
        text-transform: lowercase;
        font-size: 30px;
        font-weight: normal;
        padding: 0;
        margin: 0;
      }

      nav > a {
        display: inline-block;
        color: #fff;
        font-weight: bold;
        text-decoration: none;
        text-transform: uppercase;
        line-height: 30px;
        padding: 0 24px;
        font-size: 12px;
      }

      nav > a[selected] {
        color: var(--app-header-selected-color);
        border-bottom: 4px solid var(--app-header-selected-color);
      }

      /* Workaround for IE11 displaying <main> as inline */
      main {
        display: block;
      }

      .page {
        display: none;
      }

      .page[active] {
        display: block;
      }

      footer {
        background-color: #08AEEA;
        background-image: linear-gradient(190deg, #08AEEA 0%, #2AF598 100%);
        color: #fff;
        text-align: center;
        width: 100%;
        height: 60px;
        position: absolute;
        bottom: 0;
        left: 0;
      }

    </style>

    <header>
      <h1 class="logo">chits</h1>
      <nav>
        <a selected?="${_page === 'rounds'}" href="/rounds">Rounds</a>
        <a selected?="${_page === 'players'}" href="/players">Players</a>
        <a selected?="${_page === 'chits'}" href="/chits">Chits</a>
      </nav>
    </header>

    <!-- Main content -->
    <main role="main" class="main-content">
      <rounds-page class="page" active?="${_page === 'rounds'}"></rounds-page>
      <round-page class="page" active?="${_page === 'round'}" round-id$="${_page === 'round' ? _item : ''}"></round-page>
      <hole-page class="page" active?="${_page === 'hole'}" roundId="${_params.round}" hole-id$="${_page === 'hole' ? _item : ''}"></hole-page>
      <players-crud class="page" active?="${_page === 'players'}"></players-crud>
      <chits-crud class="page" active?="${_page === 'chits'}"></chits-crud>
      <my-view404 class="page" active?="${_page === 'view404'}"></my-view404>
    </main>

    <footer>
      <p>Made with &hearts; by Tyler and Adam.</p>
    </footer>

    <snack-bar active?="${_snackbarOpened}">
        You are now ${_offline ? 'offline' : 'online'}.</snack-bar>
    `;
  }

  static get properties() {
    return {
      appTitle: String,
      _page: String,
      _params: String,
      _item: String,
      _drawerOpened: Boolean,
      _snackbarOpened: Boolean,
      _offline: Boolean
    }
  }

  constructor() {
    super();
    this._drawerOpened = false;
    this._params = {};

    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/2.0/docs/devguide/gesture-events#use-passive-gesture-listeners
    setPassiveTouchGestures(true);
  }

  _firstRendered() {
    installRouter((location) => this._locationChanged(location));
    installOfflineWatcher((offline) => this._offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: 460px)`,
        (matches) => this._layoutChanged(matches));
  }

  _didRender(properties, changeList) {
    if ('_page' in changeList) {
      const pageTitle = properties.appTitle + ' - ' + changeList._page;
      updateMetadata({
          title: pageTitle,
          description: pageTitle
          // This object also takes an image property, that points to an img src.
      });
    }
  }

  _layoutChanged(isWideLayout) {
    // The drawer doesn't make sense in a wide layout, so if it's opened, close it.
    this._updateDrawerState(false);
  }

  _offlineChanged(offline) {
    const previousOffline = this._offline;
    this._offline = offline;

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return;
    }

    clearTimeout(this.__snackbarTimer);
    this._snackbarOpened = true;
    this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000);
  }

  _locationChanged() {
    const path = window.decodeURIComponent(window.location.pathname);
    let query = window.decodeURIComponent(window.location.search);
    let page = path.slice(1).split('/')[0];
    let item = path.slice(1).split('/')[1];
    let params;
    query = query && query.slice(1, query.length-1).split('?');

    if(query.length){
      params = query.reduce((obj, param)=>{
        param = param.split('=');

        obj[param[0]] = param[1];
        return obj;
      },{});
    }

    page = path === '/' ? 'rounds' : page;

    this._loadPage(page, item, params);
    // Any other info you might want to extract from the path (like page type),
    // you can do here.

    // Close the drawer - in case the *path* change came from a link in the drawer.
    this._updateDrawerState(false);
  }

  _updateDrawerState(opened) {
    if (opened !== this._drawerOpened) {
      this._drawerOpened = opened;
    }
  }

  _loadPage(page, item = '', params = {}) {
    switch(page) {
      case 'rounds':
        import('../components/rounds-page.js');
        break;
      case 'round':
        import('../components/round-page.js');
        break;
      case 'hole':
        import('../components/hole-page.js');
        break;
      case 'players':
        import('../components/players-crud.js');
        break;
      case 'chits':
        import('../components/chits-crud.js').then((module) => {
          // Put code in here that you want to run every time when
          // navigating to view1 after my-view1.js is loaded.
        });
        break;
      default:
        page = 'view404';
        import('../components/my-view404.js');
    }

    this._params = params;
    this._page = page;
    this._item = item;
  }
}

window.customElements.define('my-app', MyApp);
