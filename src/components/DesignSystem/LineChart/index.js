import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

// echarts
import * as echarts from 'echarts';

// css
import classes from './style_module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const LineChart = ({ title = 'Line Chart' }) => {
    const [option, setOption] = useState({
        title: {
            text: title,
            textStyle: {
                // color: '#999',
                // fontWeight: 'normal',
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        color: ['#ff7c32', '#ffcb01', '#4bd0ce'] /* 折線圖的颜色 */,
        legend: {
            data: ['斷線', '資料過少', 'CT負值'],
            // orient: 'vertical', // 垂直排列
            // right: -50, // 靠右側距離
            // top: 50 // 距離頂部的距離
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            show: true, // 工具列開關(下載、拖拽、放大、圖表盤等)
            feature: {
                saveAsImage: {},
                // dataView: {},
                dataZoom: {},
                magicType: {
                    title: {
                        // line: '折線圖',
                        // bar: '條形圖',
                        // stack: '堆疊圖',
                        // tiled: '堆疊圖',
                    },
                    option: {
                        line: {},
                        bar: {}
                    },
                    type: ['line', 'bar']
                }
            }
        },
        // dataZoom: [
        //     {   // 这个dataZoom组件，默认控制x轴。
        //         type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
        //         bottom: '-10px',
        //         start: 0,      // 左边在 0% 的位置。
        //         end: 100         // 右边在 100% 的位置。
        //     },
        // ],
        xAxis: {
            type: 'category',
            boundaryGap: false, // 座標軸兩邊留白
            // X 軸線 設定
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#B5B5B5',
                    width: 1
                }
            },
            // 每條X軸的線
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#e3e8eb',
                    width: 1
                }
            },
            // 刻度線
            axisTick: {
                show: true
            }
        },
        yAxis: {
            type: 'value',
            // Y 軸線 設定
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#B5B5B5',
                    width: 1
                }
            }
        },
        series: [
            {
                name: '斷線',
                type: 'line',
                // stack: 'Total',
                data: [
                    ['2022-06-15', 84],
                    ['2022-07-03', 92],
                    ['2022-11-30', 17],
                    ['2022-12-15', 55],
                    ['2023-02-28', 78],
                    ['2023-03-12', 42],
                    ['2023-05-08', 93],
                    ['2023-08-22', 65],
                    ['2023-09-18', 21],
                    ['2024-01-05', 37]
                ]
            },
            {
                name: '資料過少',
                type: 'line',
                // stack: 'Total',
                data: [
                    ['2022-06-15', 63],
                    ['2022-07-03', 25],
                    ['2022-11-30', 84],
                    ['2022-12-15', 72],
                    ['2023-02-28', 15],
                    ['2023-03-12', 47],
                    ['2023-05-08', 88],
                    ['2023-08-22', 39],
                    ['2023-09-18', 54],
                    ['2024-01-05', 72]
                ]
            },
            {
                name: 'CT負值',
                type: 'line',
                // stack: 'Total',
                data: [
                    ['2022-06-15', 46],
                    ['2022-07-03', 79],
                    ['2022-11-30', 32],
                    ['2022-12-15', 67],
                    ['2023-02-28', 91],
                    ['2023-03-12', 12],
                    ['2023-05-08', 77],
                    ['2023-08-22', 58],
                    ['2023-09-18', 31],
                    ['2024-01-05', 84]
                ]
            }
        ]
    });
    const chartDOM = useRef();
    const initChart = () => {
        let chartLine = echarts.init(chartDOM.current);
        chartLine.clear();
        option && chartLine.setOption(option);
    };

    useEffect(() => {
        initChart();
    }, []);

    useEffect(() => {
        const myChart = echarts.init(chartDOM.current);
        myChart.setOption(option);

        const handleResize = () => {
            myChart.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            myChart.dispose();
        };
    }, []);

    return <div id="chartLine" ref={chartDOM} style={{ width: '100%', height: '100%' }} />;
};

export default LineChart;
