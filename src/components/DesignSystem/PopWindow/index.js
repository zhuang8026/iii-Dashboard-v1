import React, { createContext, useState, useContext } from 'react';

import classes from './styles.module.scss';

export const PopWindowAnimateStorage = createContext();

export const withPopWindowProvider = WrappedComponent => {
    const PopWindowProvider = props => {
        const [animateObj, setAnimateObj] = useState(null);

        const openDialog = obj => {
            setAnimateObj(obj);
        };

        const closeDialog = () => {
            setAnimateObj(null);
        };

        const PopWindowData = {
            animateObj,
            openDialog,
            closeDialog
        };

        return (
            <PopWindowAnimateStorage.Provider value={PopWindowData}>
                <WrappedComponent {...props} />
            </PopWindowAnimateStorage.Provider>
        );
    };

    return PopWindowProvider;
};

export const PopWindow = () => {
    const animateObjData = useContext(PopWindowAnimateStorage);
    const {
        animateObj
        // closeDialog
    } = animateObjData;

    if (animateObj) {
        return <div className={classes.popAnimateContainer}>{animateObj?.component}</div>;
    }
    return null;
};

export const withPopWindowConsumer = WrappedComponent => props => {
    return (
        <PopWindowAnimateStorage.Consumer>
            {values => {
                return <WrappedComponent {...props} PopWindowData={values} />;
            }}
        </PopWindowAnimateStorage.Consumer>
    );
};
