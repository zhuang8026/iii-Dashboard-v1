import React, { Fragment, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, InputNumber, Select, Tag, DatePicker, Popconfirm, Form, Table, Typography, Button } from 'antd';

import moment from 'moment';
// import locale from 'antd/es/date-picker/locale/zh_TW';

// DesignSystem
import { FullWindowAnimateStorage } from 'components/DesignSystem/FullWindow';
import { PopWindowAnimateStorage } from 'components/DesignSystem/PopWindow';
import Loading from 'components/DesignSystem/Loading';
import Message from 'components/DesignSystem/Message';
import EditableCell from 'components/DesignSystem/EditableCell';
import TableSearch from 'components/DesignSystem/TableSearch';
import UiLineChart from 'components/DesignSystem/LineChart';

// Context
import GlobalContainer, { GlobalContext } from 'contexts/global';
// API
import { getHistory001API, postProblemStatus003API } from 'api/api';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Home = ({ match, history, location }) => {
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    const [dates, setDates] = useState([moment().subtract(30, 'days'), moment()]);
    const [value, setValue] = useState(null);

    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [editingKey, setEditingKey] = useState('');

    const { closeAnimate, openAnimate } = useContext(FullWindowAnimateStorage);
    const { closeDialog, openDialog } = useContext(PopWindowAnimateStorage);
    const { REACT_APP_VERSION_2 } = useContext(GlobalContext);

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

                await POST003API(newData[key]);
                await GETHISTORY001API();
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // open loading
    const openLoading = () => {
        openAnimate({
            component: <Loading />
        });
    };
    // close loading
    const closeLoading = () => closeAnimate();

    // open message
    const openMessage = (code, msg) => {
        openDialog({
            component: <Message code={code} msg={msg} closeMessage={closeMessage} />
        });
    };
    // close message
    const closeMessage = () => closeDialog();

    const disabledDate = current => {
        if (current) {
            return current > moment().endOf('day');
        }
        // if (!dates) {
        //     return false;
        // }
        // const today = moment().startOf('day');
        // const tooLate = dates[0] && today.diff(dates[0], 'days') > 30;
        // const tooEarly = dates[1] && dates[1].diff(today, 'days') > 30;
        // return !!tooEarly || !!tooLate;
    };

    const onOpenChange = open => {
        // if (open) {
        //     setDates([null, null]);
        // } else {
        //     setDates(null);
        // }
    };

    const handleRangePickerChange = (value, dateString) => {
        // dateString 是格式化後的時間字符串
        console.log(value, dateString);

        // 如果您需要將日期轉換成 "YYYY/MM/DD hh:mm:ss" 格式
        const formattedDates = dateString.map(date => moment(date).format('YYYY/MM/DD HH:mm:ss'));
        console.log(formattedDates);

        // 更新 state
        setValue(value);
        setDates(value);
        GETHISTORY001API(0, dateString);
    };

    const isClickDays = days => {
        let date = [];
        const currentDateTime = moment().format('YYYY/MM/DD');
        switch (days) {
            case 1:
                // 當前時間
                date = [currentDateTime];
                console.log(date);
                break;
            case 7:
                const nextWeekDateTime = moment().subtract(7, 'days');
                const nextWeekFormattedDate = nextWeekDateTime.format('YYYY/MM/DD');
                date = [currentDateTime, nextWeekFormattedDate];
                console.log(date);
                break;
            case 30:
                const past30DaysDateTime = moment().subtract(30, 'days');
                const past30DaysFormattedDate = past30DaysDateTime.format('YYYY/MM/DD');
                date = [currentDateTime, past30DaysFormattedDate];
                console.log(date);
                break;
            default:
                break;
        }

        GETHISTORY001API(days, date);
    };

    // get API 001
    const GETHISTORY001API = async (days, date) => {
        openLoading();
        const res = await getHistory001API(days, date);
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
            console.log('GETHISTORY001API error:', res);
        }
    };

    // save POST API 003
    const POST003API = async item => {
        // 将日期格式转换
        // item.detectedDate = moment(item.detectedDate, 'YYYY/MM/DD HH:mm').utcOffset('+08:00').toISOString();
        let playload = {
            userId: item.userId,
            uuid: item.uuid,
            serialNumber: item.serialNumber,
            problem: item.problem,
            status: item.status,
            statusUpdateTime: moment(item.statusUpdateTime, 'YYYY/MM/DD HH:mm').format('YYYY-MM-DDTHH:mm:ssZ'),
            note: item.note
        };
        const res = await postProblemStatus003API(playload);

        if (res.code === 200) {
            console.log('POST003API success');
        } else if (res.code === 409) {
            openMessage(res.code, `The message "${playload.userId}" has been repeated, thank you.`);
        } else {
            console.log('POST003API error');
            openMessage(res.code, res.message);
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
                { text: '不接受維護', value: '不接受維護' }
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
            width: '12%',
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
                        {REACT_APP_VERSION_2 && (
                            <Typography.Link
                                disabled={editingKey !== ''}
                                onClick={() => {
                                    history.push({
                                        ...location,
                                        pathname: `/main/event-detail/${record.serialNumber}`
                                    });
                                }}
                            >
                                Detail
                            </Typography.Link>
                        )}
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
        await GETHISTORY001API();
    };

    useEffect(() => {
        asyncAllAPI();
    }, []);
    return (
        <div className={cx('history')}>
            <h1 className={cx('title')}>歷史異常資料檢視結果</h1>
            <div className={cx('history_time')}>
                <Button size="default" onClick={() => isClickDays(1)}>
                    Today
                </Button>{' '}
                &nbsp;
                <Button size="default" onClick={() => isClickDays(7)}>
                    Past 7 Days
                </Button>{' '}
                &nbsp;
                <Button size="default" onClick={() => isClickDays(30)}>
                    Past 30 Days
                </Button>{' '}
                &nbsp;
                <RangePicker
                    value={dates || value}
                    defaultValue={dates}
                    // disabled={[false, true]}
                    disabledDate={disabledDate}
                    onCalendarChange={val => setDates(val)}
                    onChange={handleRangePickerChange}
                    onOpenChange={onOpenChange}
                    onBlur={() => console.log('blur has been triggered')}
                />
            </div>
            <div className={cx('history_eChart')}>
                <div className={cx('chart')}>
                    <UiLineChart title="故障類別" />
                </div>
                <div className={cx('chart')}>
                    <UiLineChart title="故障類別" />
                </div>
            </div>
            <div className={cx('history_table')}>
                <h1 className={cx('table_title')}>
                    歷史異常紀錄 <span> | 最後一次更新 2024/01/09</span>
                </h1>
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

export default withRouter(Home);
