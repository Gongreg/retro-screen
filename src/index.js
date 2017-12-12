import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import Menu from './menu';
import Main from './main';
import Index from './splashscreen';
import Draw from './draw';
import Screen from './screen/test-screen';
import Images from './images';
import Clock from './clock';
import WIP from './wip';

import reducer from './state/reducer';

const store = createStore(reducer);

const Entry = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Main>
        <Menu/>
        <div className="flex-container">
          <Switch>
            <Route path="/" exact component={Index}/>
            <Route path="/screen" component={Screen}/>
            <Route path="/draw" component={Draw}/>
            <Route path="/images" component={Images}/>
            <Route path="/clock" component={Clock}/>
            <Route path="/scripts" component={WIP}/>
          </Switch>
        </div>
      </Main>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(
  <Entry/>,
  document.getElementById('react')
);
