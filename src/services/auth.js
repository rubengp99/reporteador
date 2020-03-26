import axios from 'axios';
import variables from './variables'

export default () => {
    return axios.create({
        baseURL:`http://${variables.auth}/auth`,
        withCredentials:false,
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            "x-access-control":variables.header
        }
    });
};