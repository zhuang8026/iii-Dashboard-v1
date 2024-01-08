//react
import React, { lazy, useState, createContext, useEffect, useRef, useCallback, useContext } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

// DesignSystem
// import { FullWindowAnimateStorage } from 'components/DesignSystem/FullWindow';
// import { PopWindowAnimateStorage } from 'components/DesignSystem/PopWindow';
// import Loading from 'components/DesignSystem/Loading';
// import Message from 'components/DesignSystem/Message';

// utils
import { getBooleanFromENV } from 'utils/fromENV';

export const GlobalContext = createContext();

const GlobalContainer = props => {
    const { history, location, match } = props;
    const REACT_APP_VERSION_1 = getBooleanFromENV('REACT_APP_VERSION_1', false);
    const REACT_APP_VERSION_2 = getBooleanFromENV('REACT_APP_VERSION_2', false);
    const REACT_APP_VERSION_3 = getBooleanFromENV('REACT_APP_VERSION_3', false);

    return (
        <GlobalContext.Provider
            value={{
                REACT_APP_VERSION_1,
                REACT_APP_VERSION_2,
                REACT_APP_VERSION_3
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};

export default withRouter(GlobalContainer);
