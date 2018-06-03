import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter,Route} from 'react-router-dom'
import {WelcomePUP,WelcomeNonPUP,Raffle} from './App'

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Route exact path="/welcome-pup" component={WelcomePUP}/>
            <Route exact path="/welcome-non-pup" component={WelcomeNonPUP}/>
            <Route exact path="/raffle" component={Raffle}/>
        </div>
    </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
