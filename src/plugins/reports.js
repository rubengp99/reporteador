exports.chart__donut = (data, labelTotal, labels, colors = ['#008ffb', '#00e396'], formatter = 'default') => {
    return {
        series: data,
        chartOptions: {
            chart: {
                type: "pie",
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
                            },
                            total: {
                                label: labelTotal,
                                color: 'white',
                                showAlways: false,
                                show: true,
                                formatter: function (val) {
                                    if(formatter === null || formatter === 'default'){
                                        return (
                                            isNaN(Math.round((val.globals.series[0] / val.globals.series[1] + Number.EPSILON) * 100)) || !isFinite(Math.round((val.globals.series[0] / val.globals.series[1] + Number.EPSILON) * 100)) ? 0 + "%" : Math.round((val.globals.series[0] / val.globals.series[1] + Number.EPSILON) * 100)+'%'
                                        );
                                    }else if(formatter !== 'volumen'){
                                        return (
                                            isNaN(Math.round(((val.globals.series[0] - val.globals.series[1]) / val.globals.series[0] + Number.EPSILON) * 100)) || !isFinite(Math.round(((val.globals.series[0] - val.globals.series[1]) / val.globals.series[0] + Number.EPSILON) * 100)) ? 0+"%" : Math.round(((val.globals.series[0] - val.globals.series[1]) / val.globals.series[0] + Number.EPSILON) * 100)+'%'
                                        );
                                    }else{
                                        return(
                                            Math.round((val.globals.series[0] / val.globals.series[1] + Number.EPSILON) * 100) > 100 ? 100 + '%' : Math.round((val.globals.series[0] / val.globals.series[1] + Number.EPSILON) * 100) +'%'
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
                        background: '#40514e',

                    }
                }
            },
            labels: labels,
            dataLabels:{
                enabled:true,
                formatter: function (val, opts) {
                    let concat = (formatter !== 'default')?'$':'';
                    return opts.w.config.series[opts.seriesIndex] + concat
                },
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
            legend: {
                position: "bottom"
            },
            colors: (colors === null)?['#008ffb', '#00e396']:colors,
        }
    };
};


exports.chart__area = (data, labels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'], yAxis = true, mode = null) => {
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

exports.chart__barRank = (data,category,today) => {
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