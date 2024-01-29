import React, { Fragment, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, InputNumber, Select, Tag, Alert, Popconfirm, Form, Table, Typography, Button, Space } from 'antd';
import moment from 'moment';

// DesignSystem
import { FullWindowAnimateStorage } from 'components/DesignSystem/FullWindow';
import { PopWindowAnimateStorage } from 'components/DesignSystem/PopWindow';
import Loading from 'components/DesignSystem/Loading';
import Message from 'components/DesignSystem/Message';
import NILMPopup from 'components/DesignSystem/NILMPopup';
import UiCard from 'components/DesignSystem/Card';
import EditableCell from 'components/DesignSystem/EditableCell';
import TableSearch from 'components/DesignSystem/TableSearch';

// Context
import GlobalContainer, { GlobalContext } from 'contexts/global';
// API
import { getProblemStatus001API, getProblemStatus002API, postProblemStatus003API } from 'api/api';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Home = ({ match, history, location }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [lastTime, setLastTime] = useState('');
    const [card, setCard] = useState([]);
    const [editingKey, setEditingKey] = useState('');

    const [cardFilter, setCardFilter] = useState({ type: [], status: [] });

    // const fetchListener = useRef();

    const { closeAnimate, openAnimate } = useContext(FullWindowAnimateStorage);
    const { closeDialog, openDialog } = useContext(PopWindowAnimateStorage);
    const { REACT_APP_VERSION_3, GETNILM001API } = useContext(GlobalContext);

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
                await GET001API();
                await GET002API();
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

    // open nilm report popup
    const openNILMReportPopup = async () => {
        let data = await GETNILM001API(); // from global context API
        // 開啟提視窗（nilm result）
        openDialog({
            component: <NILMPopup data={data} closeMessage={closeMessage} />
        });
    };

    // 開啟提視窗（400、500、ERROR win）
    const openMessage = (code, msg) => {
        openDialog({
            component: <Message code={code} msg={msg} closeMessage={closeMessage} />
        });
    };
    // 關閉提視窗（400、500、ERROR win）
    const closeMessage = () => closeDialog();

    // 卡片狀態篩選 改變 table 資料
    const handleStatusClick = obj => {
        const { title, values } = obj;

        // 根据标题设置 type 或 status
        const newFilter = { ...cardFilter };

        if (title === '故障類別') {
            // 如果是 '故障類別'，将 val 包装成数组存储
            newFilter.type = values;
        } else {
            // 如果是 '處理狀態'，将 val 包装成数组存储
            newFilter.status = values;
        }

        // 将新的 filter 存储在 state 中
        setCardFilter(newFilter);

        // 從 localStorage 中獲取資料
        const localStorageData = localStorage.getItem('currentData');

        // 將 JSON 字串轉換為物件
        const currentData = JSON.parse(localStorageData);

        // 在這裡使用 filter 函數來篩選符合條件的資料
        const filterData = currentData.filter(item => {
            // 如果 newFilter.type 不是空数组，则检查 item.problem 是否包含在 newFilter.type 中
            const matchType = newFilter.type.length > 0 ? newFilter.type.includes(item.problem) : true;

            // 如果 newFilter.status 不是空数组，则检查 item.status 是否包含在 newFilter.status 中
            const matchStatus = newFilter.status.length > 0 ? newFilter.status.includes(item.status) : true;

            // 返回同时满足两个条件的数据
            return matchType && matchStatus;
        });

        // 在這裡更新表格資料
        setData(filterData);
    };

    // 卡片所有狀態
    const getCardStatus = apiData => {
        // 使用 reduce 函數對 problem 進行加總
        const problemSummary = apiData.reduce((summary, item) => {
            const { problem } = item;
            // 如果 problem 已經存在於加總中，則增加其數量；否則，初始化為 1
            summary[problem] = (summary[problem] || 0) + 1;
            return summary;
        }, {});

        // 將加總結果轉換為指定格式的陣列
        const resultProblem = Object.entries(problemSummary).map(([type, val]) => ({
            type,
            val
        }));

        // 使用 reduce 函數對 status 進行加總
        const statusSummary = apiData.reduce((summary, item) => {
            const { status } = item;
            // 如果 status 已經存在於加總中，則增加其數量；否則，初始化為 1
            summary[status] = (summary[status] || 0) + 1;
            return summary;
        }, {});

        // 將加總結果轉換為指定格式的陣列
        const resultStatus = Object.entries(statusSummary)
            .map(([type, val]) => {
                let status;
                switch (type) {
                    case '已完成':
                        status = 'safe';
                        break;
                    case '已通知':
                    case '已拆除':
                    case '等待維護':
                    case '不接受維護':
                        status = 'warning';
                        break;
                    case '未通知':
                        status = 'dangerous';
                        break;
                }
                return {
                    type,
                    val,
                    status
                };
            })
            .sort((a, b) => {
                // 自訂排序邏輯，'已完成'排第一，'未通知'排第二，其餘按照字母順序排序
                if (a.type === '已完成') return -1;
                if (b.type === '已完成') return 1;
                if (a.type === '未通知') return -1;
                if (b.type === '未通知') return 1;
                return a.type.localeCompare(b.type);
            });

        // 綠色開發區塊（2塊）
        let card = [
            {
                type: 'Table',
                title: '故障類別',
                content: resultProblem
            },
            {
                type: 'Table',
                title: '故障狀態',
                content: resultStatus
            }
        ];
        setCard([...card]);
    };

    // table 批量選區
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name
        })
    };

    // get API 001
    const GET001API = async () => {
        openLoading();
        const res = await getProblemStatus001API();
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
                    note: val.note,
                    deviceId: 'IN10----344CA40174C5',
                    deviceSource: 'insynerger_3',
                    apartment: '幸福社區',
                    area: '台北市'
                };
            });
            setData([...tableItem]);
            // 將資料轉換為 JSON 字串並存儲在 localStorage 中
            localStorage.setItem('currentData', JSON.stringify(tableItem));

            // 計算卡片總和
            getCardStatus(res.data);

            // 關閉 loading
            closeLoading();
        } else {
            console.log('GET001API error:', res);
        }
    };

    // get API 002
    const GET002API = async () => {
        const res = await getProblemStatus002API();
        if (res.code === 200) {
            let users = res.data.map((data, index) => {
                let title =
                    data.userCategory === 'user_111_361'
                        ? '361戶'
                        : data.userCategory === 'user_112_400'
                        ? '400戶'
                        : data.userCategory === 'others'
                        ? '新北市'
                        : 'none';
                return {
                    type: 'Compare',
                    title: title,
                    content: [
                        { type: '離線', val: data.disconnectCounts },
                        { type: '連線', val: data.connectCounts }
                    ]
                };
            });

            // 計算總和
            const totalConnectCounts = res.data.reduce((sum, entry) => sum + entry.connectCounts, 0);
            const totalDisconnectCounts = res.data.reduce((sum, entry) => sum + entry.disconnectCounts, 0);
            // 轉換成所需的格式
            const total = [
                {
                    type: 'Total',
                    title: '總用戶',
                    content: [
                        {
                            type: '離線',
                            val: totalDisconnectCounts.toString()
                        },
                        {
                            type: '連線',
                            val: totalConnectCounts.toString()
                        }
                    ]
                }
            ];

            setCard(prev => {
                return [...prev, ...users, ...total];
            });

            // 後一次更新
            setLastTime(moment(res.data[0].detectedDate).format('YYYY/MM/DD')); // YYYY/MM/DD HH:mm:ss
        } else {
            console.log('GET002API error:', res);
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

    // call API's
    const asyncAllAPI = async () => {
        // version 1
        await GET001API();
        // version 2
        await GET002API();
        await openNILMReportPopup();
    };

    // table 所有欄位 設定
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            width: '6%',
            editable: false, // 編輯控制
            ...TableSearch('name').getColumnSearchProps // 模糊搜索
        },
        {
            title: '帳號',
            dataIndex: 'userId',
            width: '13%',
            editable: false, // 編輯控制
            ...TableSearch('userId').getColumnSearchProps // 模糊搜索
        },
        {
            title: '更新時間',
            dataIndex: 'detectedDate',
            width: '10%',
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
            title: '地區',
            dataIndex: 'area',
            width: '6%',
            editable: false, // 編輯控制
            filters: [
                { text: '台北市', value: '台北市' },
                { text: '新北市', value: '新北市' },
                { text: '桃園市', value: '桃園市' },
                { text: '新竹縣', value: '新竹縣' },
                { text: '台中市', value: '台中市' },
                { text: '花蓮市', value: '花蓮市' }
            ],
            onFilter: (value, record) => record.area.startsWith(value)
        },
        {
            title: '社區',
            dataIndex: 'apartment',
            width: '8%',
            editable: false, // 編輯控制
            ...TableSearch('apartment').getColumnSearchProps // 模糊搜索
        },
        {
            title: '廠牌',
            dataIndex: 'deviceSource',
            width: '8%',
            editable: false, // 編輯控制
            filters: [
                { text: 'insynerger_3', value: 'insynerger_3' },
                { text: 'insynerger_2', value: 'insynerger_2' },
                { text: 'insynerger_1', value: 'insynerger_1' }
            ],
            // filterMode: 'tree',
            // filterSearch: true,
            onFilter: (value, record) => record.deviceSource.startsWith(value)
        },
        Table.EXPAND_COLUMN,
        {
            title: '故障類別',
            dataIndex: 'problem',
            width: '8%',
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
            width: '8%',
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
            width: '10%',
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
            width: '9%',
            editable: true, // 編輯控制
            ...TableSearch('note').getColumnSearchProps // 模糊搜索
        },
        {
            title: '編輯',
            dataIndex: 'operation',
            width: '10%',
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

    // callfull API
    useEffect(() => {
        asyncAllAPI();
    }, []);

    return (
        <>
            <h1 className={cx('title')}>
                每日異常資料檢視結果 <span> | 最後一次更新 {lastTime}</span>
            </h1>
            <div className={cx('top_card')}>
                {card.length > 0
                    ? card.map((item, index) => (
                          <UiCard
                              type={item.type}
                              title={item.title}
                              content={item.content}
                              key={index}
                              onClick={val => handleStatusClick(val)}
                          />
                      ))
                    : ''}
            </div>
            <div className={cx('home')}>
                <h1 className={cx('table_title')}>待處理異常紀錄</h1>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell
                            }
                        }}
                        bordered={true} // table 边框  k控制
                        dataSource={data}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection
                        }}
                        // pagination={false}
                        pagination={{
                            // 分頁
                            position: ['none', 'bottomLeft'],
                            defaultPageSize: 10, // 默认每页显示的数量
                            onChange: cancel
                        }}
                        expandable={{
                            expandedRowRender: record => {
                                return (
                                    <p
                                        style={{
                                            margin: 0
                                        }}
                                    >
                                        Device ID - {record.deviceId}
                                    </p>
                                );
                            }
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
        </>
    );
};

export default withRouter(Home);
