import { LitElement, html } from '@polymer/lit-element';
import { ChitService } from '../service/chits.js';
import { repeat } from 'lit-html/lib/repeat.js';

class ChitsCrud extends LitElement {
    constructor() {
        super();  // what's the purpose of this super?
        this.chits = [];
        this.loading = 'Loading...';
        
        this._getChits();
    }

    static get properties(){
        return {
            chits: Array,
            loading: String
        }
    }
    
    _getChits(){
        this.loadingTimeout = setTimeout(()=> {
            this.loading = 'Loading, promise...';
        }, 1500);
        
    this.loading = 'Loading...;
        ChitService.getChits().then(chits =>{
           this.chits = chits;
           this.loading ='';
            clearTimeout(this._loadingTimeout);
        });
        
    }
    
    _createChits(e){
        e.preventDefault();
        let newChitEl = this.shadowRoot.querySelector('#newChit'); // What is shadowRoot?
        let chit = newChitEl.value;
        if(!chit) return; //...if null, return...what?
        
        ChitService.newChit({chit})
            .then(chits=>{
            this._getChits();
            newChitEl.value = '';  //removes value from input text box
        }) 
    }
    
    _deleteChits(e, id) {
        e.preventDefault();
        
        ChitService.deleteChits(id)
        .then(chits=>{
            this._getChits();
        })
    }
    
    _render({chits, loading}) { //why parameters of render in brackets and parantheses?
        return html`
        <style>
            li button {
            display: none;
            cursor: pointer;
            }

        li: hover button {
            display: inline;
            }
        </style>
        <h1>Chits</h1>
        <form action="" on-submit="${e => this._createChits(e)}">
            <input type="text" id="newChit"><button type="submit">Create</button>
        </form>
        ${loading}
        <ul>
        ${repeat(chits,c => c._id, chits=>html`
            <li> <span> ${chits.name}</span> <button type="button" on-click="${e=>this._deleteChits(e, chits._id)}">x</button>`)}
        <ul>`
   }
}

window.customElements.define('chits-crud', ChitsCrud);
