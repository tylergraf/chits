import {apiBase} from '../globals.js';
import {fetch} from '../fetch.js';
const key = 'AIzaSyC1xgsW8XDnx1xNeKKq8-9V-2zoSeNcVvQ';
class CourseService {
  static search(name, location){
    let encodedName = encodeURIComponent(name);
    return fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=41.305999, -111.985999&rankby=distance&key=${key}&keyword=golf&name=${encodedName}`);
  }
}


export {
  CourseService
};
