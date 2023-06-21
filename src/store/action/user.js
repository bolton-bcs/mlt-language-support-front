import * as actionTypes from '../action/actionTypes';

export const updatePercentage =(activityRoute)=>{
  return{
    type:actionTypes.UPDATE_PERCENTAGE,
    activityRoute:activityRoute
  }
}
