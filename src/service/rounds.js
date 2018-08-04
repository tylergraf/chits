import {apiBase} from '../globals.js';
import {fetch} from '../fetch.js';

class RoundsService {
  static getRounds(){
    return fetch(`${apiBase}/rounds`);
  }
  static getRound(id){
    return fetch(`${apiBase}/round/${id}`);
  }
  static newRound(round = {}){
    let config = {
      method: 'post',
      body: JSON.stringify(round)
    }
    return fetch(`${apiBase}/round`, config)
  }
  static updateRound(round){
    let config = {
      method: 'put',
      body: JSON.stringify(round)
    }
    return fetch(`${apiBase}/round/${round._id}`, config)
  }
  static deleteRound(id){
    let config = {
      method: 'delete'
    }
    return fetch(`${apiBase}/round/${id}`, config)
  }
}


export {
  RoundsService
};
