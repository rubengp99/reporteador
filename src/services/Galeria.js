import axios from 'axios';
import header from './header';
import extension from './extension';

export default () => {
    return axios.create({
        baseURL:`http://${extension}/api/galeria`,
        withCredentials:false,
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            "x-access-control":header
        }
    });
};