import React, { Fragment, useContext } from 'react';
import { Route, HashRouter } from "react-router-dom"
import { Context } from './container/Context';
import Game from './game/Game';
const App = () => {

  const context = useContext(Context)
  return (
    <Fragment>
      <HashRouter>
        <Route exact path="/" component={Game}  />
      </HashRouter>
    </Fragment>
  );
}

export default App;