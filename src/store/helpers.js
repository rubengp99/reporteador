import concept from "@/services/Conceptos";
import groups from "@/services/Grupos"
import subGroups from '@/services/SubGrupos'

const conceptosFields = "&fields=id,referencia,codigo,nombre,existencia_minima,existencia_maxima,descripcion,imagen,existencias,precio_dolar,costo_dolar,precio_a,ultimo_costo,adm_grupos_id,adm_subgrupos_id";


const getNormalConcepts = async function(offset) {
    let result;
    concept().get('?limit=70&offset='+offset+ conceptosFields +'&orderField=id&order=DESC').then(response => {
        result = response;
    }); 

    return result
}

const getMostSoldConcepts = async function(offset) {
    let result;
    concept().get('/mostSold/?limit=70&offset='+offset).then(response => {
        result = response;
    }); 

    return result
}

const getGroups = async function(offset) {
    let result;
    groups().get('?limit=70&offset='+offset).then(response => {
        result = response;
    }); 

    return result
}

const getSubGroups = async function(offset) {
    let result;
    subGroups().get('?limit=70&offset='+offset).then(response => {
        result = response;
    }); 

    return result
}

const getMostReturnedConcepts = async function(offset) {
    let result;
    concept().get('/mostreturned/?fields=devueltos,id&limit70=&offset='+offset).then(response => {
        result = response;
    }); 

    return result
}

export default {
    getNormalConcepts,
    getMostSoldConcepts,
    getGroups,
    getSubGroups,
    getMostReturnedConcepts
}