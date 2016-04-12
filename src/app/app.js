import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import Main from 'main/main';
import Index from 'index/index';
import Screen from 'screen/screen';
import WIP from 'wip/wip';

ReactDOM.render(
    (
        <Router history={ browserHistory }>
            <Route path="/" component={Main}>
                <IndexRoute component={Index}/>
                <Route path="screen" component={Screen}/>
                <Route path="draw" component={WIP}/>
                <Route path="images" component={WIP}/>
                <Route path="nonogram" component={WIP}/>
                <Route path="snake" component={WIP}/>
                <Route path="tetris" component={WIP}/>
                <Route path="ping-pong" component={WIP}/>
                <Route path="equalizer" component={WIP}/>
                <Route path="scripts" component={WIP}/>

            </Route>

        </Router>
    ),
    document.getElementById('react')
);