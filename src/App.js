import React, {
  Fragment,
  Suspense,
  useState,
  useEffect,
  useContext,
} from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

// DesignSystem
import NoMatch from 'components/DesignSystem/NoMatch';
import Menu from 'components/DesignSystem/Menu';

// config
import routes from 'config/routes';

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
          document.title = `${route.title} | Zscss`;
          return <route.component localeMatch={match} routeData={route} />;
        }}
      />
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Menu */}
        <Suspense fallback={<></>}>
          <Menu />
        </Suspense>

        {/* body */}
        <Suspense fallback={<></>}>
          <Switch>
            {Routes()}
            <Route component={NoMatch} />
          </Switch>
        </Suspense>
      </header>
    </div>
  );
}
export default withRouter(App);
