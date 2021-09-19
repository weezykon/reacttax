import { combineReducers } from 'redux';

// import
import taxReducer from './tax';
import cartReducer from './cart';

const reducers = combineReducers({
    tax: taxReducer,
    taxModal: cartReducer,
});

export default reducers