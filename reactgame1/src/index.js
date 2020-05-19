import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {Provider} from 'react-redux'
import store from './config/store'

import Game from './components/game'


ReactDOM.render(
    <Provider store={store}>
        <Game/>
    </Provider>,
    document.getElementById('root'));

if(module.hot){
    module.hot.accept();
}

