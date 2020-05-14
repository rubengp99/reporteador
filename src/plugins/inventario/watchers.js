import _ from 'lodash';

const search = async function(after){
    if(after == "" && this.$route.name === 'concepto')
        this.$router.push('/Inventario');
    if (this.grupo === "" && this.grupo === "" && this.$route.name !== 'concepto'){
        if(this.search === "" && this.filteredConcepts.length > 0){
            this.table.products = [];
            this.loading = true;
            this.getConcept(false, after,  this.apiConcepts.data.data);
            this.table.totalConceptos = this.apiConcepts.data.totalCount;
        }else
            return;
    }else if (this.grupo !== "" || this.grupo !== "" && this.$route.name == 'concepto'){
        if(this.search === ""){
            this.loading = true;
            this.table.products = [];
            if(this.subgrupo !== ""){
                this.filteredConcepts = ((this.search === "" ) ? this.apiConcepts.data.data : this.filteredConcepts).filter(c => c.subgrupos_id === this.subgrupo.id || c.adm_subgrupos_id === this.subgrupo.id);
            }else if(this.grupo !== ""){
                this.filteredConcepts = ((this.search === "") ? this.apiConcepts.data.data : this.filteredConcepts).filter(c => c.grupos_id === this.grupo.id || c.adm_grupos_id === this.grupo.id);
            }
            this.table.totalConceptos = this.filteredConcepts.length; 
            await this.getConcept(false, after,  this.filteredConcepts);
        }else
            return;
    }else
        return;
};

const goSearch = _.debounce(async function () {
    //watch se activa cuando presionas enter en el text input de busqueda
    this.loading = true;
    this.table.products = [];
    this.table.page = 1;
    this.table.page_old = 1;
    this.table.dataOffset = 0;
    await this.getConcept(true,this.search, (this.grupo !== "" || this.subgrupo !== "") ? this.filteredConcepts : this.apiConcepts.data.data);
}, 555);

const singleExpand  = function(v) {
    if (!v) return
    // Single expand enabled. Hide all but the first expanded item
    this.expanded.forEach((item, i) => {
        if (i > 0) this.closeExpand(item)
    })
};

const grupo = _.debounce(async function() {
    //los watchers a veces pueden caer en bucles, es por ello que cuando se limpia la variable es necesaria una
    //condición que nos saque del procedimiento.
    if (this.grupo === "") return;
    this.subgrupos = [];
    this.subgrupo = "";
    this.commonDataReset();
    this.subgrupos = await this.filterSubGrupos();
    //el usuario puede haber habilitado una busqueda antes de seleccionar un grupo, por ello se verifica si es cierto
    //para así poder saber si filtrar el arreglo general o el arreglo previamente filtrado por la busqueda anterior
    this.filteredConcepts = ((this.search === "") ? this.apiConcepts.data.data : this.filteredConcepts).filter(c => c.grupos_id === this.grupo.id || c.adm_grupos_id === this.grupo.id);
    this.table.totalConceptos = Math.ceil(this.filteredConcepts.length);
    await this.getConcept(false,this.search,this.filteredConcepts, (this.search === ""));
}, 555);

const subgrupo = _.debounce(async function() {
    //los watchers a veces pueden caer en bucles, es por ello que cuando se limpia la variable es necesaria una
    //condición que nos saque del procedimiento.
    if (this.subgrupo === "") return;
    this.commonDataReset();
    //el usuario puede haber habilitado una busqueda antes de seleccionar un subgrupo, por ello se verifica si es cierto
    //para así poder saber si filtrar el arreglo general o el arreglo previamente filtrado por la busqueda anterior
    this.filteredConcepts = ((this.search === "" ) ? this.apiConcepts.data.data : this.filteredConcepts).filter(c => (c.subgrupos_id === this.subgrupo.id || c.adm_subgrupos_id === this.subgrupo.id) && (c.grupos_id === this.grupo.id || c.adm_grupos_id === this.grupo.id));
    this.table.totalConceptos = Math.ceil(this.filteredConcepts.length);
    await this.getConcept(false,this.search,this.filteredConcepts,(this.search === ""));
}, 555);

const clear = _.debounce(async function(){
    //los watchers a veces pueden caer en bucles, es por ello que cuando se limpia la variable es necesaria una
    //condición que nos saque del procedimiento.
    if(this.$route.name === 'concepto')
        this.$router.push('/Inventario');
    if (this.search === "" && this.grupo === "" && this.subgrupo === "" || this.$route.name === 'concepto') return;
    this.commonDataReset();
    this.subgrupo = "";
    this.grupo = "";
    this.subgrupos = [];
    this.apiConcepts = this.vuexConcepts;
    this.table.totalConceptos = this.apiConcepts.data.totalCount;
    await this.getConcept(false,"",this.apiConcepts.data.data);
}, 555);


export default {search, goSearch, grupo, subgrupo, clear, singleExpand};