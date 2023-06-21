import * as actionTypes from "../action/actionTypes";

const initialState = {
  percentageCount: 0
}

const reducer =(state = initialState,action)=>{
  switch (action.type){
    case actionTypes.UPDATE_PERCENTAGE:
      return{
        ...state,
        percentageCount:action.percentageCount
      };
    default:
      return state;
  }
}

export default reducer;
