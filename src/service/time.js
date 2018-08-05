import moment from 'moment/src/moment.js';

class TimeService {
  static _getCreationDate(date){
    let now = moment();
    let today = now.clone().startOf('day');
    let weekAgo = now.clone().subtract(7, 'days').startOf('day')
    let creation = moment(date);
    if(creation.isSame(today, 'd')){
      return creation.fromNow();
    } else if(creation.isAfter(weekAgo)) {
      return creation.calendar();
    } else {
      return creation.format("MMM Do");
    }
  }
}


export {
  TimeService
};
