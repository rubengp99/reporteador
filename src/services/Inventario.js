import axios from 'axios';
import header from './header';
import extension from './extension';

export default (query = '') => {
    return axios.create({
        baseURL:`http://${extension}/api/movimiento_inventario/${query}`,
        withCredentials:false,
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            "x-access-control":header
        }
    });
};