import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

// echarts
import * as echarts from 'echarts';

// css
import classes from './style_module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const DoughnutChart = () => {
    // const [option, setOption] = useState();
    const chartDOM = useRef();

    let demo = {
        title: {
            text: 'Doughnut Chart',
            left: 'left' // center
            // textStyle: {
            //     color: '#999',
            //     fontWeight: 'normal',
            //     fontSize: 14
            // }
        },
        series: [
            {
                type: 'pie',
                radius: ['30%', '60%'],
                // top: top + '%',
                // height: '33.33%',
                left: 'center',
                width: '100%',
                color: ['#ff7c32', '#ffcb01', '#4bd0ce'] /* 折線圖的颜色 */,
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                label: {
                    alignTo: 'edge',
                    formatter: '{name|{b}}\n{number|{c} 次}',
                    minMargin: 5,
                    edgeDistance: 10,
                    lineHeight: 20,
                    fontSize: 16,
                    rich: {
                        number: {
                            fontSize: 16,
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
                    { name: '短線', value: 3 },
                    { name: '資料過少', value: 2 },
                    { name: 'CT負值', value: 4 }
                ]
            }
        ]
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
        // setOption(optionItems);
        demo && chartLine.setOption(demo);
    };

    useEffect(() => {
        initChart();
    }, []);

    useEffect(() => {}, []);

    return <div id="chartLine" ref={chartDOM} />;
};

export default DoughnutChart;
