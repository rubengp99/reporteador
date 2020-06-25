import axios from 'axios';
import variables from './variables'

export default () => {
    return axios.create({
        baseURL:`${variables.http}://${variables.data}/api/subgrupos`,
        withCredentials:false,
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            "x-access-control":variables.header,
            "tenant-id": variables.tenantId
        }
    });
};