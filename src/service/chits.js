import {apiBase} from '../globals.js';
import {fetch} from '../fetch.js';

class ChitService {
  static getChits(){
    return fetch(`${apiBase}/chits`);
  }
  static getChit(id){
    return fetch(`${apiBase}/chit/${id}`);
  }
  static newChit(chit){
    let config = {
      method: 'post',
      body: JSON.stringify(chit)
    }
    return fetch(`${apiBase}/chit`, config)
  }
  static updateChit(chit){
    let config = {
      method: 'put',
      body: JSON.stringify(chit)
    }
    return fetch(`${apiBase}/chit/${chit._id}`, config)
  }
  static deleteChit(id){
    let config = {
      method: 'delete'
    }
    return fetch(`${apiBase}/chit/${id}`, config)
  }
}

export {
  ChitService
};
