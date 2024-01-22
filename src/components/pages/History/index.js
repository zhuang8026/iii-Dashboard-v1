import React, { Fragment, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, InputNumber, Select, Tag, DatePicker, Popconfirm, Form, Table, Typography, Button } from 'antd';
import { ApiOutlined, FallOutlined, ReconciliationOutlined, ReloadOutlined } from '@ant-design/icons';
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
    const [dates, setDates] = useState([moment().subtract(30, 'days').startOf('day'), moment().endOf('day')]); // 今天往前30天
    const [value, setValue] = useState(null);

    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [editingKey, setEditingKey] = useState('');
    const [chartData, setChartData] = useState();
    const [faultData, setFaultData] = useState([]);
    const [color, setColor] = useState('ff7c32');
    const [city, setCity] = useState([
        { name: '台北市', num: 111 },
        { name: '新北市', num: 76 },
        { name: '桃園市', num: 5555 },
        { name: '新竹縣', num: 88 },
        { name: '台中市', num: 912 },
        { name: '花蓮市', num: 65721 }
    ]);

    const { closeAnimate, openAnimate } = useContext(FullWindowAnimateStorage);
    const { closeDialog, openDialog } = useContext(PopWindowAnimateStorage);
    const { REACT_APP_VERSION_3 } = useContext(GlobalContext);

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
        const today = moment();
        // 今天之后的日期不可选
        if (current && current >= today.endOf('day')) {
            return true;
        }

        // 2023年12月1日之后的日期不可选
        if (current && current >= moment('2023-11-30').endOf('day')) {
            return false;
        }

        return true;
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
        // console.log(value, dateString);

        // 如果您需要將日期轉換成 "YYYY/MM/DD hh:mm:ss" 格式
        // const formattedDates = dateString.map(date => moment(date).format('YYYY/MM/DD HH:mm:ss'));
        // console.log(formattedDates);

        // 转换日期字符串为Unix时间戳，包括到毫秒的信息
        // const unixTimestamps = dateString.map(date => moment(date, 'YYYY/MM/DD HH:mm:ss').valueOf());
        let startTime = moment(dateString[0], 'YYYY/MM/DD HH:mm:ss').valueOf();
        let endTime = moment(dateString[1], 'YYYY/MM/DD HH:mm:ss').endOf('day').valueOf();

        console.log(`开始时间：${startTime}`);
        console.log(`结束时间：${endTime}`);

        if (!!value) {
            // 更新 state
            setValue(value);
            setDates(value);

            GETHISTORY001API(0, startTime, endTime);
        }
    };

    // 點擊時間 今天、7天、30天
    const isClickDays = days => {
        // 获取今天的开始时间（00:00:00）
        const today = moment();
        // 获取过去7天的开始时间（00:00:00）
        const sevenDaysAgoStart = moment().subtract(7, 'days').startOf('day');
        // 获取过去30天的开始时间（00:00:00）
        const thirtyDaysAgoStart = moment().subtract(30, 'days').startOf('day');

        let unixStart = ''; // 开始时间戳
        let unixEnd = ''; // 結束时间戳

        switch (days) {
            case 1:
                // 转换为Unix时间戳，包括到毫秒的信息
                unixStart = today.startOf('day').valueOf(); // 获取今天的开始时间（00:00:00）
                unixEnd = today.endOf('day').valueOf(); // 获取今天的结束时间（23:59:59）
                console.log(`开始时间：${unixStart}`);
                console.log(`结束时间：${unixEnd}`);
                break;
            case 7:
                // 转换为Unix时间戳，包括到毫秒的信息
                unixStart = sevenDaysAgoStart.valueOf(); // 开始时间戳
                unixEnd = today.endOf('day').valueOf();
                console.log(`开始时间：${unixStart}`);
                console.log(`结束时间：${unixEnd}`);
                break;
            case 30:
                // 转换为Unix时间戳，包括到毫秒的信息
                unixStart = thirtyDaysAgoStart.valueOf(); // 开始时间戳
                unixEnd = today.endOf('day').valueOf();
                console.log(`开始时间：${unixStart}`);
                console.log(`结束时间：${unixEnd}`);

                break;
            default:
                break;
        }

        if (unixStart != '' && unixEnd != '') {
            // 更新 state
            setValue([moment.unix(unixStart / 1000), moment.unix(unixEnd / 1000)]);
            setDates([moment.unix(unixStart / 1000), moment.unix(unixEnd / 1000)]);

            GETHISTORY001API(days, unixStart, unixEnd);
        }
    };

    // 取得 故障類別全部資料
    const faultLineChartData = async data => {
        // Create an object to define the sorting order of each problem type
        const problemOrder = {
            斷線: 1,
            CT負值: 2,
            資料過少: 3
        };

        // Create an object to store data for each problem type
        const transformedData = {};

        // Iterate through the API data and organize it by problem type
        data.forEach(entry => {
            const { problem, detectedDate } = entry;

            if (!transformedData[problem]) {
                transformedData[problem] = {};
            }

            const formattedDate = moment(detectedDate).format('YYYY-MM-DD');
            if (!transformedData[problem][formattedDate]) {
                transformedData[problem][formattedDate] = 0;
            }

            transformedData[problem][formattedDate] += 1; // Increment the count for the specific date and problem
        });

        // Convert the organized data into the desired format
        const result = Object.keys(transformedData)
            .sort((a, b) => problemOrder[a] - problemOrder[b])
            .map(problem => {
                const datesAndCounts = Object.keys(transformedData[problem])
                    .map(date => ({ date: new Date(date), count: transformedData[problem][date] }))
                    .sort((a, b) => a.date - b.date)
                    .map(item => [moment(item.date).format('YYYY-MM-DD'), item.count]);

                // Sort datesAndCounts by date
                datesAndCounts.sort((a, b) => moment(a[0]).valueOf() - moment(b[0]).valueOf());

                // 發生事件個別總和
                const total = datesAndCounts.reduce((acc, [date, count]) => acc + count, 0);

                return {
                    name: problem,
                    key: problem == '斷線' ? 0 : problem == 'CT負值' ? 1 : 2,
                    type: 'line',
                    data: datesAndCounts,
                    total: total
                };
            });

        setChartData([...result]);
        setFaultData([result[0]]); // 默認顯示斷線
        // setColor('#ff7c32'); // 默認顯示斷線
        console.log('chartData:', result);
    };

    // 選擇故障類別功能
    const checkFaultType = key => {
        let arr = chartData.filter(ele => ele.key == key);
        let c = ['#ff7c32', '#ffcb01', '#4bd0ce'];
        setFaultData([...arr]);
        setColor(c[key]);
    };

    // get API 001
    const GETHISTORY001API = async (days, startTime, endTime) => {
        openLoading();
        const res = await getHistory001API(days, startTime, endTime);
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

            await faultLineChartData(res.data);

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
            editable: false, // 編輯控制
            ...TableSearch('userId').getColumnSearchProps // 模糊搜索
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
            editable: true, // 編輯控制
            ...TableSearch('note').getColumnSearchProps // 模糊搜索
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
                        {REACT_APP_VERSION_3 && (
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
        let startTime = dates[0].valueOf();
        let endTime = dates[1].valueOf();
        await GETHISTORY001API(0, startTime, endTime);
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
                {/* 故障數量 卡片 */}
                <div className={cx('chart', 'h_card_container')}>
                    {chartData &&
                        chartData.map((ele, index) => {
                            return (
                                <div
                                    key={index}
                                    className={cx(
                                        'h_card',
                                        ele.key == 0 ? 'Disconnected' : ele.key == 1 ? 'CT' : 'Litte_information'
                                    )}
                                >
                                    <div className={cx('h_card_name')}>{ele.name}</div>
                                    <div className={cx('h_card_num')}>
                                        {ele.total}
                                        <span>/次</span>
                                    </div>
                                    <div className={cx('h_card_icon')}>
                                        {ele.key == 0 ? (
                                            <ApiOutlined style={{ fontSize: '110px', color: '#fff' }} />
                                        ) : ele.key == 1 ? (
                                            <FallOutlined style={{ fontSize: '110px', color: '#fff' }} />
                                        ) : (
                                            <ReconciliationOutlined style={{ fontSize: '110px', color: '#fff' }} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* 故障类别折线图 */}
                <div className={cx('chart', 'fault_type')}>
                    {/* left: menu */}
                    <div className={cx('chooseType')}>
                        <button onClick={() => checkFaultType(0)}>
                            <ApiOutlined style={{ fontSize: '16px', color: '#ff7c32' }} /> {''} 斷線
                        </button>
                        <button onClick={() => checkFaultType(1)}>
                            <FallOutlined style={{ fontSize: '16px', color: '#ffcb01' }} /> {''} CT負值
                        </button>
                        <button onClick={() => checkFaultType(2)}>
                            <ReconciliationOutlined style={{ fontSize: '16px', color: '#4bd0ce' }} /> {''} 資料過少
                        </button>
                    </div>
                    {/* right: 折線圖 */}
                    <UiLineChart title="故障類別" chartData={faultData} color={color} />
                </div>
            </div>
            <div className={cx('history_table')}>
                <h1 className={cx('table_title')}>歷史異常地區</h1>
                {/* 台北市, 新北市, 桃園市, 新竹縣, 台中市, 花蓮市 */}
                <div className={cx('table_body')}>
                    {city.map((ele, index) => (
                        <div className={cx('card', 'city')} key={index}>
                            <h3>{ele.name}</h3>
                            <div className={cx('num')}>
                                {ele.num}
                                <span>/次</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={cx('history_table')}>
                <h1 className={cx('table_title')}>歷史異常設備</h1>
            </div>
            <div className={cx('history_table')}>
                <h1 className={cx('table_title')}>
                    歷史異常紀錄
                    <span>
                        | <ReloadOutlined /> 最後一次更新 2024/01/22
                    </span>
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
                        columns={mergedColumns} // 欄位功能控制
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
