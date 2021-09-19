const cartReducer = (state = false, action) => {
    switch (action.type) {
        case 'modifyModal':
            state = action.data;
            break;
        default:
            break;
    }
    return state;
}

export default cartReducer;