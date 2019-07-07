import { commonParams ,  options,headers } from './config'
import axios from 'axios';
import qs from 'qs';


export function getData(url,data) {
   url='/api'+url;
   let postdata;
   if(data){
     postdata={'areaCode':data.areaCode,'areaLevel':data.level}
   }
   else{
    postdata=null;
   }
  
  return axios.get(url,{'params':postdata},headers)
  .then((res)=> {
    return Promise.resolve(res)
  })
  .catch(function (error) {
    console.log(error);
  })
 
}

export function Publicget(url,data) {
  url='/api'+url;

 
 return axios.get(url,{'params':data},headers)
 .then((res)=> {
   return Promise.resolve(res)
 })
 .catch(function (error) {
   console.log(error);
 })

}

export function getWash(url,data) {
  url='/api'+url;

 
 return axios.get(url,{'params':data},headers)
 .then((res)=> {
   return Promise.resolve(res)
 })
 .catch(function (error) {
   console.log(error);
 })

}


export function post(url,data){
  // sessionStorage.setItem('token','THRID_USER_ID_PREFIX_82741');
  let token=sessionStorage.getItem('token');
  // Cookies.set("USER_ID","THRID_USER_ID_PREFIX_82741");
  // let token=Cookies.get('USER_ID');
  url='/api'+url;
  return axios.post(url,qs.stringify(data),{headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','token':token},
  }).then((res) => {
      return Promise.resolve(res.data)
  }).catch(function (error) {
      console.log(error);
  });
}
