const taxReducer = (state = [], action) => {
    switch (action.type) {
        case 'addTax':
            state = action.data;
            break;
        case 'modifyTax':
            state = [ ...state, action.data ];
            break;
        case 'deleteTax':
            state = state.filter((tax, index) => index !== action.data);
            break;
        default:
            break;
    }
    return state;
}

export default taxReducer;