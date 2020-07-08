import accounting from 'accounting';

// Crea un gráfico de torta, con estilo de dona. Sirve para comparar dos valores.
/**
 * 
 * @param {Array of Number} data es un array de numeros, debe tener un máximo de 2 números para comparar los valores.
 * @param {Array of String} labelTotal es el nombre del calculo a realizar. Ej: Rentabilidad, Rotación, etc.
 * @param {Array of String} labels son los nombres de los valores a representar. Ej: Costos y Ventas.
 * @param {Array of String} colors arreglo de cadenas de colores en formato HEX. Ayuda a estilizar.
 * @param {String} formatter el tipo de formateador.
 * Los formateadores pueden ser:
 *  - "default": es el formateador por defecto.
 *  - "volumen": para calcular volumen entre dos valores, añade el sufijo "uds" de unidades. Retorna N uds. Ej: 1.000 uds.
 *  - "cantidad": para calcular cantidades, no añade sufijos. Ej: 1.000
 *  - "custom -100": para calcular incrementos de valores. Si se tiene una cifra de 1500 y una de 900. El valor retornado serìa 33% de incremento.
 *  "custom -100" y "custom" sirven para ajustar posibles valores negativos. Uselos con cuidado.
 *  - "custom": para calcular decrementos de valores.
 * 
 * NOTA:    "custom -100" y "custom" a veces revierten sus papeles. Estos formatos requieren un largo tiempo de testing para obtener los valores deseados
 *        por favor. Tenga cuidado al usarlos.
 * @param {String} moneda tipo de moneda. Se debe especificar Bs o $ respectivamente.
 */
const chart__donut = (data, labelTotal, labels, colors = ['#008ffb', '#00e396'], formatter = 'default',moneda = '$') => {
    return {
        series: data,
        chartOptions: {
            chart: {
                type: "donut",
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 700,
                    animateGradually: {
                        enabled: true,
                        delay:350
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                toolbar:{
                    show:false,
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                color: 'white',
                            },
                            value: {
                                color: 'white',
                                formatter: function (val) {
                                    return ((formatter !== 'default' && formatter !== 'volumen' &&  formatter !== 'cantidad' && moneda !== "") 
                                           ? (accounting.formatMoney(val,{symbol: moneda,thousand:'.',decimal:','})) 
                                           : (accounting.formatMoney(val,{symbol:'',thousand:'.',decimal:','}).split(',')[0] + ((formatter !== 'cantidad') ? ' uds' : '')));
                                },
                            },
                            total: {
                                label: labelTotal,
                                color: 'white',
                                showAlways: false,
                                show: true,
                                formatter: function (val) {
                                    if(formatter === null || formatter === 'default' || formatter === 'cantidad'){
                                        let result = (( Math.round((val.globals.series[0] / val.globals.series[1] + Number.EPSILON) * 1000) / 1000 ) * 100)
                                        return (
                                            isNaN(result) || !isFinite(result) ? 0 + "%" : result+'%'
                                        );
                                    }else if (formatter === "customfix"){
                                        let result = (val.globals.series[0] > val.globals.series[1] ? val.globals.series[1] / val.globals.series[0] : val.globals.series[0] /val.globals.series[1]);
                                        return (Math.round((100 - (result * 100) + Number.EPSILON) * 1000) / 1000) + "%"
                                    }else if(formatter === "custom"){
                                        let result = (( Math.round(((val.globals.series[1] - val.globals.series[0]) / val.globals.series[1] + Number.EPSILON) * 1000 ) / 1000) * 100);
                                        let custom100 = ( isNaN(result) || !isFinite(result) ? 0: result + 100 );
                                        let custom_100 = 100 + ( isNaN(result) || !isFinite(result) ? 0: result );
                                        return (
                                            ((!custom100 <  0) ? custom100 : custom_100) +"%"
                                        );
                                    }else if(formatter === "custom -100"){
                                        let result = ( Math.round(((val.globals.series[1] - val.globals.series[0]) / val.globals.series[1] + Number.EPSILON) * 1000) / 1000 ) * 100;
                                        let custom100 = ( (isNaN(result) || !isFinite(result)) ? 0: result -100 );
                                        let custom_100 = ( 100 - (isNaN(result) || !isFinite(result) * 100) ? 0: result );

                                        return (
                                            (custom100 <  0 ? custom100 : custom_100) + 100 +"%"
                                        );
                                    }else if(formatter !== 'volumen'){
                                        let result = (( Math.round(((val.globals.series[0] - val.globals.series[1]) / val.globals.series[0] + Number.EPSILON) * 1000) / 1000 ) * 100);
                                        return (
                                            (isNaN(result) || !isFinite(result) ? 0+"%" : result+'%')
                                        );
                                    }else{
                                        let result =  (Math.round((( val.globals.series[0] / val.globals.series[1] + Number.EPSILON ) * 1000) / 1000 )) * 100;
                                        return(
                                            (result > 100 ? 100 + '%' : result).toFixed(2) +'%'
                                        );
                                    }
                                        
                                },
                                style: {
                                    fontSize: "14px",
                                    colors: 'white',
                                },
                                background: {
                                    foreColor: 'black',
                                }
                            }
                        },
                        background: '#263238',

                    }
                }
            },
            labels: labels,
            dataLabels:{
                enabled:true,
                background: {
                    enabled: true,
                    foreColor: '#40514e',
                    borderRadius: 2,
                    padding: 4,
                    opacity: 0.9,
                    borderWidth: 3,
                    borderColor: '#fff',
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return ((formatter !== 'default' && formatter !== 'volumen' &&  formatter !== 'cantidad' && moneda !== "") ? (accounting.formatMoney(val,{symbol: moneda ,thousand:'.',decimal:','})) : (accounting.formatMoney(val,{symbol:'',thousand:'.',decimal:','}).split(',')[0] + ((formatter !== 'cantidad') ? ' uds' : '')));
                    },
                  },
                fillSeriesColor: false,
                theme:'light'
                
              },
            legend: {
                position: "bottom"
            },
            colors: (colors === null)?['#008ffb', '#00e396']:colors,
        }
    };
};

// Crea un gráfico de linea. Estilizado para tipo Area curvada. 
//Sirve para calcular incrementos o decrementos de valores a lo largo del tiempo.
/**
 * 
 * @param {Array of Number} data es un array de N numeros,  
 * @param {Array of String} labels es un array de fechas. Puede tener diferentes formatos. 
 * Se recomienda usar moment() para obtener estos valores. 
 * @param {Boolean} yAxis define si en el eje de las X muestras valores o labeles. 
 * @param {String} mode define el modo de presentación. Actualmente solo sirve para Unidades Vendidas y Restantes
 */
const chart__area = (data, labels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'], yAxis = true, mode = null) => {
    return {
        series: [{
            name: (mode === null)?'Unidades vendidas':'Unidades restantes',
            data: data,
        }],
        chartOptions: {
            chart: {
                type: 'area',
                height: 350,
                zoom: {
                    enabled: false
                },
                menu: {
                    enabled:false
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 700,
                    animateGradually: {
                        enabled: true,
                        delay:350
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                toolbar:{
                    show:false,
                }
            },
            dataLabels: {
                enabled: true,
                background: {
                    enabled: true,
                    foreColor: '#fff',
                    borderRadius: 2,
                    padding: 4,
                    opacity: 0.9,
                    borderWidth: 2,
                    borderColor: '#fff',
                },
            },
            colors: ['#005792'],
            stroke: {
                curve: 'straight'
            },
           // labels: labels,
            yaxis: {
                opposite: false,
                show: yAxis
            },
            xaxis: {
                type: 'category',
                categories: labels,
                offsetX: (!yAxis) ? 15 : 0,
                labels: {
                    hideOverlappingLabels: true,
                    //rotate: 0,
                    //rotateAlways: true,
                }
            },
            legend: {
                horizontalAlign: 'left'
            },
        },
    };
};

// Sirve para crear un ranking de valores. En formato barra horizontal con valores.
// Actualmente se usa en el dashboard como ranking de categorias mas vendidas.
/**
 * 
 * @param {Array of Objects} data es un array de objectos. Para su uso se recomienda buscar Vue ApexChart.
 * o en su defecto. Ver ejemplos en dashboard.
 * @param {Array of String} category Grupos, categorias en el eje Y. 
 * @param {String} today fecha del dia de hoy. 
 */
const chart__barRank = (data,category,today) => {
    return {
        series: data,
        chartOptions: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              stackType: '100%',
              animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 500,
                    animateGradually: {
                        enabled: true,
                        delay: 50
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                toolbar:{
                    show:false,
                }
            },
            plotOptions: {
              bar: {
                horizontal: true,
                distributed: false,
              },
            },
            dataLabels: {
                enabled: false,
                hideOverflowingLabels: true,
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },
            title: {
              text: 'LOS GRUPOS MÁS VENDIDOS - '+today,
              align: 'center'
            },
            xaxis: {
                type: 'category',
                categories: category,
                labels: {
                    show: true,
                    rotate: -25,
                    rotateAlways: false,
                },
            },
            tooltip: {
              x: {
                  show: false,
              },
              y: {
                formatter: function (val) {
                  return val + " unidades vendidas."
                },
                title: {
                    formatter: function(seriesName,globals){
                        seriesName = NaN;
                        return globals.w.globals.seriesX[globals.seriesIndex][globals.dataPointIndex]; 
                    },
                },
              },
            },
            fill: {
              opacity: 1
            
            },
            legend: {
              show: false,
              position: 'top',
              horizontalAlign: 'left',
              offsetX: 40
            }
          },
    };
};

// *** DEPRECATED ***
// este gráfico se encuentra en desuso
const chart__barCompare = (data, colors, comparado,moneda) => {
    return {
        series: [{
            data: data
        }],
        chartOptions: {
            chart: {
                type: 'bar',
                height: 380,
                toolbar: {
                    show: false,
                }
            },
            plotOptions: {
                bar: {
                    barHeight: '75%',
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: 'bottom'
                    },
                }
            },
            colors: colors,
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {
                    colors: ['#fff']
                },
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val + moneda+ " " + comparado
                },
                offsetX: 0,
                dropShadow: {
                    enabled: true
                }
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            xaxis: {
                categories: ['Mes en curso', 'Mes pasado'],
            },
            yaxis: {
                labels: {
                    show: false
                }
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return ''
                        }
                    }
                }
            }
        },
    }

}
export default { chart__area, chart__barRank , chart__donut, chart__barCompare};