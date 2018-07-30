import {apiBase} from '../globals.js';
import {fetch} from '../fetch.js';

class PlayerService {
  static getPlayers(){
    return fetch(`${apiBase}/players`);
  }
  static getPlayer(id){
    return fetch(`${apiBase}/player/${id}`);
  }
  static newPlayer(player){
    let config = {
      method: 'post',
      body: JSON.stringify(player)
    }
    return fetch(`${apiBase}/player`, config)
  }
  static updatePlayer(player){
    let config = {
      method: 'put',
      body: JSON.stringify(player)
    }
    return fetch(`${apiBase}/player/${player._id}`, config)
  }
  static deletePlayer(id){
    let config = {
      method: 'delete'
    }
    return fetch(`${apiBase}/player/${id}`, config)
  }
}


export {
  PlayerService
};
