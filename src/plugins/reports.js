exports.chart__donut = (data, labelTotal, labels, colors = ['#008ffb', '#00e396'], formatter = 'default') => {
    return {
        series: data,
        chartOptions: {
            chart: {
                type: "pie"
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
                                            isNaN(Math.round((val.globals.series[0] / val.globals.series[1] + Number.EPSILON) * 100))?0+"%":Math.round((val.globals.series[0] / val.globals.series[1] + Number.EPSILON) * 100)+'%'
                                        );
                                    }else{
                                        return (
                                            isNaN(Math.round(((val.globals.series[0] - val.globals.series[1]) / val.globals.series[0] + Number.EPSILON) * 100))?0+"%":Math.round(((val.globals.series[0] - val.globals.series[1]) / val.globals.series[0] + Number.EPSILON) * 100)+'%'
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
                    let concat = (formatter !== 'default')?'Bs':'';
                    return opts.w.config.series[opts.seriesIndex] + concat
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
            },
            legend: {
                horizontalAlign: 'left'
            }
        },
    };
};