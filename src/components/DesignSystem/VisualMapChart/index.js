import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

// echarts
import * as echarts from 'echarts';

// css
import classes from './style_module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const VisualMapChart = (optionItems = {}) => {
    const [option, setOption] = useState();
    const chartDOM = useRef();

    var data = [
        {
            name: 'Grandpa',
            children: [
                {
                    name: 'Uncle Leo',
                    value: 15,
                    children: [
                        {
                            name: 'Cousin Jack',
                            value: 2
                        },
                        {
                            name: 'Cousin Mary',
                            value: 5,
                            children: [
                                {
                                    name: 'Jackson',
                                    value: 2
                                }
                            ]
                        },
                        {
                            name: 'Cousin Ben',
                            value: 4
                        }
                    ]
                },
                {
                    name: 'Aunt Jane',
                    children: [
                        {
                            name: 'Cousin Kate',
                            value: 4
                        }
                    ]
                },
                {
                    name: 'Father',
                    value: 10,
                    children: [
                        {
                            name: 'Me',
                            value: 5,
                            itemStyle: {
                                color: 'red'
                            }
                        },
                        {
                            name: 'Brother Peter',
                            value: 1
                        }
                    ]
                }
            ]
        },
        {
            name: 'Mike',
            children: [
                {
                    name: 'Uncle Dan',
                    children: [
                        {
                            name: 'Cousin Lucy',
                            value: 3
                        },
                        {
                            name: 'Cousin Luck',
                            value: 4,
                            children: [
                                {
                                    name: 'Nephew',
                                    value: 2
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: 'Nancy',
            children: [
                {
                    name: 'Uncle Nike',
                    children: [
                        {
                            name: 'Cousin Betty',
                            value: 1
                        },
                        {
                            name: 'Cousin Jenny',
                            value: 2
                        }
                    ]
                }
            ]
        }
    ];
    let demo = {
        title: {
            text: 'Sunburst VisualMap'
        },
        visualMap: {
            type: 'continuous',
            min: 0,
            max: 10,
            inRange: {
                color: ['#2F93C8', '#AEC48F', '#FFDB5C', '#F98862']
            }
        },
        series: {
            type: 'sunburst',
            data: data,
            radius: ['0%', '100%'],
            label: {
                rotate: 'radial'
            }
        }
    };
    const initChart = () => {
        let chartLine = echarts.init(chartDOM.current);
        chartLine.clear();

        demo && chartLine.setOption(demo);
    };

    useEffect(() => {
        initChart();
    }, []);

    useEffect(() => {}, []);

    return <div id="chartLine" ref={chartDOM} />;
};

export default VisualMapChart;
