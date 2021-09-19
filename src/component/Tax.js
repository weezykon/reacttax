import React, { useState, useEffect } from 'react';
import { items } from './../data';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { TAX_MODAL, DELETE_TAX } from './../actions';

const Tax = () => {
    const { tax } = useSelector(state => state);
    // console.log(tax);
    const dispatch = useDispatch();
    
    // open modal
    const openModal = () => {
        dispatch(TAX_MODAL(true))
    }

    const deleteTax = (i) => {
        dispatch(DELETE_TAX(i));
    }

    return (
        <section>
            <div className="container">
                <div className="header">
                    <h1>Tax</h1>
                    <button onClick={() => { openModal() }}>Add Tax</button>
                </div>
                {tax && tax.length > 0 ? (
                    <table cellPadding="0" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Rate</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tax.map((item,i) => (
                                <tr key={i}>
                                    <td>{item.name}</td>
                                    <td>{item.rate * 100} %</td>
                                    <td><button>Edit</button></td>
                                    <td><button onClick={() => {deleteTax(i)}}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : ('') }
            </div>
        </section>
    )
}

export default Tax
