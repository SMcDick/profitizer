import React from 'react';
import ReactDOM from 'react-dom';
import './scss/style.css';
import Orders from './orders';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Orders source="http://localhost:7555/api/sales/incompmlete" />, document.getElementById('root'));
registerServiceWorker();
