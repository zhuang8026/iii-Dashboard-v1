import React, { Fragment, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';

// antd
import { Input, InputNumber, Select, Tag, Alert, Popconfirm, Form, Table, Typography, Button, Space } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';

import moment from 'moment';

// DesignSystem
import { FullWindowAnimateStorage } from 'components/DesignSystem/FullWindow';
import { PopWindowAnimateStorage } from 'components/DesignSystem/PopWindow';
import EditableCell from 'components/DesignSystem/EditableCell';
import TableSearch from 'components/DesignSystem/TableSearch';
import UiLineChart from 'components/DesignSystem/LineChart';
import UiDoughnutChart from 'components/DesignSystem/DoughnutChart';
import Message from 'components/DesignSystem/Message';
import Loading from 'components/DesignSystem/Loading';

// API
import { getProblemStatusDetail001API } from 'api/api';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EventDetail = ({history}) => {
    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [lastTime, setLastTime] = useState('2023/12/20 14:41:29');
    const [editingKey, setEditingKey] = useState('');

    const { closeAnimate, openAnimate } = useContext(FullWindowAnimateStorage);
    const { closeDialog, openDialog } = useContext(PopWindowAnimateStorage);

    const isEditing = record => record.key === editingKey;
    const edit = record => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record
        });
        setEditingKey(record.key);
    };

    // open loading
    const openLoading = () => {
        openAnimate({
            component: <Loading />
        });
    };

    // close loading
    const closeLoading = () => closeAnimate();

    const openMessage = (code, msg) => {
        openDialog({
            component: <Message code={code} msg={msg} closeMessage={closeMessage} />
        });
    };

    const closeMessage = () => closeDialog();

    const cancel = () => {
        setEditingKey('');
    };
    const save = async key => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row
                });

                newData.forEach(ele => {
                    ele.statusUpdateTime = ele.statusUpdateTime
                        ? moment(ele.statusUpdateTime).format('YYYY/MM/DD HH:mm')
                        : null;
                    ele.detectedDate = moment(ele.detectedDate).format('YYYY/MM/DD HH:mm');
                    return ele;
                });
                setData(newData);
                setEditingKey('');

                if (
                    newData[key].statusUpdateTime == 'Invalid date' ||
                    newData[key].statusUpdateTime == null ||
                    newData[key].statusUpdateTime == ''
                ) {
                    openMessage(400, '"處理時間" is required information.');
                    return;
                }

                await GETDETAIL001API();
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // get API 001
    const GETDETAIL001API = async () => {
        openLoading();
        const res = await getProblemStatusDetail001API();
        if (res.code === 200) {
            let tableItem = res.data.map((val, i) => {
                let updateTime = val.statusUpdateTime ? moment(val.statusUpdateTime).format('YYYY/MM/DD HH:mm') : '';
                return {
                    key: i.toString(),
                    uuid: val.uuid,
                    serialNumber: val.serialNumber,
                    name: val.name,
                    userId: val.userId,
                    detectedDate: moment(val.detectedDate).format('YYYY/MM/DD HH:mm'),
                    problem: val.problem,
                    status: val.status,
                    statusUpdateTime: updateTime,
                    note: val.note
                };
            });
            setData([...tableItem]);

            setTimeout(() => {
                closeLoading();
            }, 1000);
        } else {
            console.log('GETDETAIL001API error:', res);
        }
    };

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            width: '8%',
            editable: false, // 編輯控制
            ...TableSearch('name').getColumnSearchProps // 模糊搜索
        },
        {
            title: '帳號',
            dataIndex: 'userId',
            width: '16%',
            editable: false // 編輯控制
        },
        {
            title: '更新時間',
            dataIndex: 'detectedDate',
            width: '14%',
            editable: false, // 編輯控制
            sorter: (a, b) => {
                // 使用 Moment.js 解析日期字符串
                const preTime = moment(a.detectedDate, 'YYYY/MM/DD HH:mm');
                const backTime = moment(b.detectedDate, 'YYYY/MM/DD HH:mm');

                // 获取日期对象的时间戳（以秒为单位）
                const preSeconds = preTime.unix();
                const backSeconds = backTime.unix();

                return preSeconds - backSeconds;
            }
        },
        {
            title: '故障類別',
            dataIndex: 'problem',
            width: '10%',
            editable: false, // 編輯控制
            filters: [
                { text: '斷線', value: '斷線' },
                { text: '資料過少', value: '資料過少' },
                { text: 'CT負值', value: 'CT負值' }
            ],
            // filterMode: 'tree',
            // filterSearch: true,
            onFilter: (value, record) => record.problem.startsWith(value)
        },
        {
            title: '處理狀態',
            dataIndex: 'status',
            width: '10%',
            editable: true, // 編輯控制
            filters: [
                { text: '已完成', value: '已完成' },
                { text: '未通知', value: '未通知' },
                { text: '已通知', value: '已通知' },
                { text: '已拆除', value: '已拆除' },
                { text: '等待維護', value: '等待維護' },
                { text: '不接受維護', value: '不接受維護' },
                { label: '已排外', value: '已排外' }, // oragnge icon
            ],
            // filterMode: 'tree',
            // filterSearch: true,
            onFilter: (value, record) => record.status.startsWith(value),
            render: tags => {
                return (
                    <span>
                        {[tags].map(tag => {
                            {
                                /* let color = tag.length > 5 ? 'red' : 'green'; */
                            }
                            let color = tag == '已完成' ? 'green' : tag == '未通知' ? 'red' : 'orange';
                            if (tag === 'loser') {
                                color = 'volcano';
                            }
                            return (
                                <Tag color={color} key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>
                            );
                        })}
                    </span>
                );
            }
        },
        {
            title: '處理時間',
            dataIndex: 'statusUpdateTime',
            width: '14%',
            editable: true, // 編輯控制
            sorter: (a, b) => {
                const preTime = moment(a.statusUpdateTime, 'YYYY/MM/DD HH:mm');
                const backTime = moment(b.statusUpdateTime, 'YYYY/MM/DD HH:mm');

                // 获取日期对象的时间戳（以秒为单位）
                const preSeconds = preTime.unix();
                const backSeconds = backTime.unix();

                return preSeconds - backSeconds;
            }
        },
        {
            title: '備註',
            dataIndex: 'note',
            width: '16%',
            editable: true // 編輯控制
        },
        {
            title: '編輯',
            dataIndex: 'operation',
            width: '12%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <span>
                        <Typography.Link
                            disabled={editingKey !== ''}
                            style={{ marginRight: 8 }}
                            onClick={() => edit(record)}
                        >
                            Edit
                        </Typography.Link>
                    </span>
                );
            }
        }
    ];

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: record => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record)
            })
        };
    });

    const asyncAllAPI = async () => {
        // version 1
        await GETDETAIL001API();
    };
    useEffect(() => {
        asyncAllAPI();
    }, []);

    return (
        <div className={cx('eventDetail')}>
            <div className={cx('d_header')}>
                <div className={cx('d_icon')} onClick={() => history.goBack()}>
                    <LeftCircleOutlined style={{ fontSize: '20px', color: '#129797' }} />
                </div>
                <h1 className={cx('title')}>
                    單筆數據分析 <span> | 最後一次更新 {lastTime}</span>
                </h1>
            </div>
            <div className={cx('chart', 'margin_top')}>
                <div className={cx('chart_60', 'chart_bg')}>
                    <UiLineChart title="分析圖一" />
                </div>
                <div className={cx('chart_40', 'chart_bg')}>
                    <UiDoughnutChart title='圓餅圖二'/>
                </div>
            </div>

            <div className={cx('chart', 'detail_table')}>
                <h1 className={cx('table_title')}>待處理異常紀錄</h1>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell
                            }
                        }}
                        bordered
                        dataSource={data}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        // pagination={false}
                        pagination={{
                            position: ['none', 'bottomLeft'],
                            defaultPageSize: 10, // 默认每页显示的数量
                            onChange: cancel
                        }}
                        onRow={record => {
                            return {
                                onClick: event => {
                                    // console.log('row click');
                                }, // 点击行
                                onDoubleClick: event => {},
                                onContextMenu: event => {},
                                onMouseEnter: event => {}, // 鼠标移入行
                                onMouseLeave: event => {}
                            };
                        }}
                    />
                </Form>
            </div>
        </div>
    );
};

export default withRouter(EventDetail);
