//react
import React, { lazy, useState, createContext, useEffect, useRef, useCallback, useContext } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

// utils
import { getBooleanFromENV } from 'components/utils';

export const GlobalContext = createContext();

const GlobalContainer = props => {
    const { history, location, match } = props;
    console.log( process.env)
    const REACT_APP_VERSION_1 = getBooleanFromENV('REACT_APP_VERSION_1', false);
    const REACT_APP_VERSION_2 = getBooleanFromENV('REACT_APP_VERSION_2', false);
    const REACT_APP_VERSION_3 = getBooleanFromENV('REACT_APP_VERSION_3', false);

    return (
        <GlobalContext.Provider
            value={{
                REACT_APP_VERSION_1,
                REACT_APP_VERSION_2,
                REACT_APP_VERSION_3,
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};

export default withRouter(GlobalContainer);
