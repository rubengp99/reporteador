export default {
    isExpanded: false,
    apiConcepts: null,
    apiConceptsAux: null,
    apiConceptReturns: null,
    apiInvoices: null,
    apiConceptSales: null,
    weeklySales: [],
    apiSales: null,
    apiGroups: null,
    selectedItem: {
        referece: null,
        stock: null,
        stockMin: null,
        stockMax: null,
        stock_lastDay: null
    },
    apiSubGroups: [],
    //existen conceptos con subgrupos_id = null, esta categoría las engloba para que no se pierdan
    //durante el filtrado, PD: se pushean más grupos, pero este es el inicial
    grupos: [{
        text: 'Indefinidos',
        value: {
            id: null,
            name: '-',
            hasSub: true
        }
    }],
    gruposAux: [],
    subgrupos: [],
    subgruposAux: [],
    grupo: "",
    subgrupo: "",
    search: "",
    goSearch: false,
    transitioned: [],
    closeTimeouts: {},
    singleExpand: false,
    subNoData: 'Seleccione un «Grupo» primero.',
    filteredConcepts: [],
    clear: false,
    loading: true,
    table: {
        expanded: [],
        expand: false,
        page: 1,
        page_old: 1,
        pageCount: 0,
        itemsPerPage: 10, // para cambiar el limite de conceptos por página, cambia este número, lo demas se configura solo
        dataOffset: 0,
        totalConceptos: 0,
        headers: [
            { text: "Más Detalles", align: "center", sortable: false, value: "image" },
            //{ text: "ID", align: "center", value: "id", sortable: false, },
            { text: "Código", align: "center", value: "codigo", sortable: false, },
            { text: "Producto", align: "center", value: "name", sortable: false, },
            { text: "Grupo", align: "center", value: "category.name", sortable: false, },
            { text: "Sub-Grupo", align: "center", value: "subCategory.name", sortable: false, },
            { text: "Existencia", align: "center", value: "stock", sortable: false, },
            //{ text: "Vendidos", align: "center", value: "sold", sortable: false, },
            { text: "Precio", align: "center", value: "sale", sortable: false, },
            { text: "Análisis", align: "center", value: "data-table-expand", sortable: false, }
        ],
        concepts: [],
    }
}