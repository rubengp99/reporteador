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
                                    if(formatter === 'default'){
                                        return (
                                            Math.round(
                                                (val.globals.series[0] / val.globals.series[1] +
                                                    Number.EPSILON) *
                                                100
                                            ) + "%"
                                        );
                                    }else{
                                        return (
                                            Math.round(
                                                ((val.globals.series[1] - val.globals.series[0]) / val.globals.series[1] +
                                                    Number.EPSILON) *
                                                100
                                            ) + "%"
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
            legend: {
                position: "bottom"
            },
            colors: (colors === null)?['#008ffb', '#00e396']:colors,
        }
    };
};


exports.chart__area = (data, labels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'], yAxis = true) => {
    return {
        series: [{
            name: 'Unidades vendidas',
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
                    padding: 2,
                    opacity: 0.9,
                    borderWidth: 2,
                    borderColor: '#fff',
                },
            },
            stroke: {
                curve: 'straight'
            },
            labels: labels,
            yaxis: {
                opposite: false,
                show: yAxis
            },
            xaxis: {
                offsetX: (!yAxis) ? 15 : 0
            },
            legend: {
                horizontalAlign: 'left'
            }
        },
    };
};