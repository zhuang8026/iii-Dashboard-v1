//react
import React, { lazy, useState, createContext, useEffect, useRef, useCallback, useContext } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import moment from 'moment';
import { CloudUploadOutlined, SearchOutlined, WarningOutlined, CalculatorOutlined } from '@ant-design/icons';

// API
import { getNilmReport001API } from 'api/api';

// utils
import { getBooleanFromENV } from 'utils/fromENV';

export const GlobalContext = createContext();

const GlobalContainer = props => {
    const { history, location, match } = props;
    const [nilm, setNilm] = useState([]);
    const REACT_APP_VERSION_1 = getBooleanFromENV('REACT_APP_VERSION_1', false);
    const REACT_APP_VERSION_2 = getBooleanFromENV('REACT_APP_VERSION_2', false);
    const REACT_APP_VERSION_3 = getBooleanFromENV('REACT_APP_VERSION_3', false);

    // GETNILM001API: 每日 NILM 報告 API
    const GETNILM001API = async () => {
        const res = await getNilmReport001API();
        if (res.code === 200) {
            let nilmData = res.data
                .map((val, i) => {
                    const isToday = moment(val.updateTime).isSame(moment(), 'day');
                    const iconDOM =
                        val.type === 'daily_backup' ? (
                            <CloudUploadOutlined />
                        ) : val.type === 'nilm' ? (
                            <SearchOutlined />
                        ) : val.type === 'dev_pub' ? (
                            <WarningOutlined />
                        ) : val.type === 'energy_track' ? (
                            <CalculatorOutlined />
                        ) : (
                            ''
                        );
                    return {
                        queue: val.queue,
                        type: val.type,
                        status: isToday ? 'PASS' : 'WARNING',
                        icon: iconDOM,
                        updateTime: moment(val.updateTime).format('YYYY/MM/DD HH:mm')
                    };
                })
                .sort((a, b) => a.queue - b.queue);

            return nilmData;
        } else {
            console.log('GET001API error:', res);
        }
    };

    useEffect(() => {
        GETNILM001API();
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                REACT_APP_VERSION_1,
                REACT_APP_VERSION_2,
                REACT_APP_VERSION_3,
                GETNILM001API // 每日 NILM 報告API
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};

export default withRouter(GlobalContainer);
