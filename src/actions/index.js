export const MODIFY_TAX = (data) => {
    return {
        type: 'modifyTax',
        data
    };
};

export const ADD_TAX = (data) => {
    return {
        type: 'addTax',
        data
    };
};

export const DELETE_TAX = (data) => {
    return {
        type: 'deleteTax',
        data
    };
};

export const EDIT_TAX = (data) => {
    return {
        type: 'editTax' ,
        data
    };
};

export const TAX_MODAL = (data) => {
    return {
        type: 'modifyModal',
        data
    };
};