import {apiBase} from '../globals.js';
import {fetch} from '../fetch.js';

class ChitService {
    static getChits() {
        return fetch(`${apiBase}/chits`);
    }
    
    static getChits(id) {
        return fetch(`${apiBase}/chit/${id}`); //chit not chits?
    }
    
    static newChit(chit) {
        let config = {
            method: 'post',
            body: JSON.stringify(chit)
        }
        return fetch(`${apiBase}/chit`, config)
    }
    
    static updateChits(chit) {
        let config = {
            method: 'put',
            body: JSON.stringify(chit)
        }
        return fetch(`${apiBase}/chit/${chit._id}`, config)
    }
    
    static deleteChits(id) {
        let config = {
            method: 'delete'
        }
        return fetch(`${apiBase}/chit/${id}`, config)
    }
}

export {
  ChitService
};

