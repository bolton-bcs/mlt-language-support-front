export const textFieldValidator = (value,length)=>{
  if (value.trim()===''){
    return false;
  }else return value.length >= length
};
