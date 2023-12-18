import React, { Fragment, Suspense, useState, useEffect, useContext } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

// DesignSystem
import NoMatch from 'components/DesignSystem/NoMatch';
import Menu from 'components/DesignSystem/LeftMenu';
import Footer from 'components/DesignSystem/Footer';
import { withFullWindowProvider, FullPopWindow } from 'components/DesignSystem/FullWindow';

// config
import routes from 'config/routes';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

function App({ match, location, history }) {
    // all route
    const Routes = () => {
        return routes.map((route, key) => (
            <Route
                key={`route_${key}`}
                path={`${route.path}`}
                exact={route.exact}
                sensitive
                render={() => {
                    document.title = `III | ${route.title}`;
                    return <route.component localeMatch={match} routeData={route} />;
                }}
            />
        ));
    };

    return (
        <div className={cx('App')}>
            {/* <header className="App-header"></header> */}
            {/* Menu */}
            <Suspense fallback={<></>}>
                <Menu />
            </Suspense>

            {/* body */}
            <div className={cx('main')}>
                <Suspense fallback={<></>}>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/main" />
                        </Route>
                        {Routes()}
                        <Route component={NoMatch} />
                    </Switch>
                </Suspense>
                <Suspense fallback={<></>}>
                    <Footer />
                </Suspense>
            </div>

            {/**
             * 可隨意添加 comment
             */}
            <FullPopWindow />
        </div>
    );
}
export default withRouter(withFullWindowProvider(App));
