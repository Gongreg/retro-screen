import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import Main from 'main/main';
import Index from 'index/index';
import Draw from 'draw/draw';
import Screen from 'screen/test';
import Images from 'images/images';
import Clock from 'clock/clock';
import WIP from 'wip/wip';

ReactDOM.render(
    (

        <Router history={ browserHistory }>
            <Route path="/" component={Main}>
                <IndexRoute component={Index}/>
                <Route path="screen" component={Screen}/>
                <Route path="draw" component={Draw}/>
                <Route path="images" component={Images}/>
                <Route path="clock" component={Clock}/>
                <Route path="scripts" component={WIP}/>
            </Route>
        </Router>
    ),
    document.getElementById('react')
);
