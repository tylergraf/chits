import {apiBase} from '../globals.js';
import {fetch} from '../fetch.js';
const key = 'AIzaSyAxFAclyV_XiGPgVL_UIxqjeAVzcdoepy4';
class LocationService {
  static search(name, {lat, long}){
    let encodedName = encodeURIComponent(name);
    return fetch(`${apiBase}/maps/api/place/nearbysearch/json?location=${lat},${long}&rankby=distance&key=${key}&keyword=golf&name=${encodedName}`)
      .then(results=>{
        if(results.status !== 'OK'){
          throw new Error(results.status);
        }
        return results.results;
      });
  }
  static zip(zip){
    if(!zip) return;

    return fetch(`${apiBase}/zip/${zip}`);
  }
}


export {
  LocationService
};
