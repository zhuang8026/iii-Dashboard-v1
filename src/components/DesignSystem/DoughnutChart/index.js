import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

// echarts
import * as echarts from 'echarts';

// css
import classes from './style_module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const DoughnutChart = (optionItems = {}) => {
    const [option, setOption] = useState();
    const chartDOM = useRef();

    let demo = {
        title: {
            text: 'Doughnut Chart',
            left: 'left', // center
            // textStyle: {
            //     color: '#999',
            //     fontWeight: 'normal',
            //     fontSize: 14
            // }
        },
        series: [
            {
                type: 'pie',
                radius: ['20%', '60%'],
                // top: top + '%',
                // height: '33.33%',
                left: 'center',
                width: '100%',
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                label: {
                    alignTo: 'edge',
                    formatter: '{name|{b}}\n{time|{c} 小时}',
                    minMargin: 5,
                    edgeDistance: 10,
                    lineHeight: 15,
                    rich: {
                        time: {
                            fontSize: 10,
                            color: '#999'
                        }
                    }
                },
                labelLine: {
                    length: 15,
                    length2: 0,
                    maxSurfaceAngle: 80
                },
                // labelLayout: function (params) {
                //     const isLeft = params.labelRect.x < chartDOM.current.getWidth() / 2;
                //     const points = params.labelLinePoints;
                //     // Update the end point.
                //     points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;
                //     return {
                //         labelLinePoints: points
                //     };
                // },
                data: [
                    { name: '圣彼得堡来客', value: 5.6 },
                    { name: '陀思妥耶夫斯基全集', value: 1 },
                    { name: '史记精注全译（全6册）', value: 0.8 },
                    { name: '加德纳艺术通史', value: 0.5 },
                    { name: '表象与本质', value: 0.5 },
                    { name: '其它', value: 3.8 }
                ]
            }
        ],
        // series: datas.map(function (data, idx) {
        //     var top = idx * 33.3;
        //     return {
        //         type: 'pie',
        //         radius: [20, 60],
        //         top: top + '%',
        //         height: '33.33%',
        //         left: 'center',
        //         width: 400,
        //         itemStyle: {
        //             borderColor: '#fff',
        //             borderWidth: 1
        //         },
        //         label: {
        //             alignTo: 'edge',
        //             formatter: '{name|{b}}\n{time|{c} 小时}',
        //             minMargin: 5,
        //             edgeDistance: 10,
        //             lineHeight: 15,
        //             rich: {
        //                 time: {
        //                     fontSize: 10,
        //                     color: '#999'
        //                 }
        //             }
        //         },
        //         labelLine: {
        //             length: 15,
        //             length2: 0,
        //             maxSurfaceAngle: 80
        //         },
        //         labelLayout: function (params) {
        //             const isLeft = params.labelRect.x < chartDOM.current.getWidth() / 2;
        //             const points = params.labelLinePoints;
        //             // Update the end point.
        //             points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;
        //             return {
        //                 labelLinePoints: points
        //             };
        //         },
        //         data: data
        //     };
        // })
    };

    const initChart = () => {
        let chartLine = echarts.init(chartDOM.current);
        chartLine.clear();
        setOption(optionItems);
        demo && chartLine.setOption(demo);
    };

    useEffect(() => {
        initChart();
    }, []);

    useEffect(() => {}, []);

    return <div id="chartLine" ref={chartDOM} />;
};

export default DoughnutChart;
