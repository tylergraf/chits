import {apiBase} from '../globals.js';
import {fetch} from '../fetch.js';

class HoleService {
  static getHole(id){
    return fetch(`${apiBase}/hole/${id}`);
  }
  static getHoleByRoundAndNumber(roundId, number){
    return fetch(`${apiBase}/hole?roundId=${roundId}number=${number}`);
  }
  static newHole(hole = {}){
    let config = {
      method: 'post',
      body: JSON.stringify(hole)
    }
    return fetch(`${apiBase}/hole`, config)
  }
  static updateHole(hole){
    let config = {
      method: 'put',
      body: JSON.stringify(hole)
    }
    return fetch(`${apiBase}/hole/${hole._id}`, config)
  }
  static deleteHole(id){
    let config = {
      method: 'delete'
    }
    return fetch(`${apiBase}/hole/${id}`, config)
  }
}


export {
  HoleService
};
