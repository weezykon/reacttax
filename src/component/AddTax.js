import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { items } from './../data';
import { useFormik } from 'formik';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { TAX_MODAL, MODIFY_TAX } from './../actions';

const AddTax = () => {
    const { taxModal } = useSelector(state => state);
    const dispatch = useDispatch();

    const [categories, setCategories] = useState([])
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResult, setSearchResult] = useState([]);

    if (taxModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';

    // close modal function
    const closeModal = () => {
        dispatch(TAX_MODAL(false))
    }
    // useEffect is a hook that runs after the render function is called
    useEffect(() => {
        const data = groupBy(items, 'category');
        // console.log(data);
        setCategories(data);
    }, [])

    // validate error
    const validate = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = 'Tax Title is required';
        } else if (values.name.length < 5) {
            errors.name = 'Tax title should be greater than 5 characters'
        }

        if (!values.tax) {
            errors.tax = 'Tax rate is required';
        } else if (values.tax.match(/[a-z]/)) {
            errors.tax = 'Tax rate should be a number'
        }

        if (!values.category.length > 0 && values.type === 'specific') {
            errors.category = 'Tax category is required';
        }

        return errors;
    }
    const formik = useFormik({
        initialValues: {
            tax: '',
            name: '',
            type: 'all',
            category: [],
        },
        validate,
        onSubmit: (values) => {
            if (values.type === 'all') getAllCategories();
            const taxRate = {
                rate: values.tax / 100,
                applicable_items: values.category,
                applied_to: values.type,
                name: values.name,
            }
            // console.log(taxRate);
            dispatch(MODIFY_TAX(taxRate));
            closeModal();
            emptyValues();
            // alert(JSON.stringify(values, null, 2));
        }
    });

    const emptyValues = () => {
        // emptyFormik Values
        formik.setFieldValue('tax', '');
        formik.setFieldValue('name', '');
        formik.setFieldValue('type', 'all');
        formik.setFieldValue('category', []);
    }

    const getAllCategories = () => {
        const data = categories.map((category) => {
            // console.log(category);
            category.value.map((item) => {
                return formik.values.category.push(item.id);
            })
            return true;
        })
    }

    const groupBy = (array, key) => {
        let result = [];
        array.forEach((item) => {
            const keyValue = item[key] ? item[key].name.toLowerCase() : 'others';
            result[keyValue] = result[keyValue] || [];
            item.isChecked = false;
            result[keyValue].push(item);
        });
        const data = Object.entries(result).map(([key, value], index) => {
            return {
                key,
                value,
            }
        });
        // console.log(data);
        return data;
    }

    const selectMultipleCheckbox = (e) => {
        const category = e.target.value;
        const checked = e.target.checked;
        let newCategories = categories.map((cat) => {
            //     // check if item.key is equal to the category
            if (cat.key === category) {
                cat.value.map((item) => {
                    if (checked) {
                        formik.values.category.push(item.id);
                    } else {
                        formik.values.category.splice(formik.values.category.indexOf(item.id), 1);
                    }
                    return (item.isChecked = checked ? true : false);
                });
            }
            return cat;
        });
        setCategories(newCategories);
    };

    const selectCheckbox = (e) => {
        const value = +e.target.value;
        const checked = e.target.checked;
        // console.log(checked);
        let newCategories = categories.map((cat) => {
            cat.value.map((item) => {
                // console.log(item);
                if (item.id === value) {
                    if (checked) {
                        formik.values.category.push(item.id);
                    } else {
                        formik.values.category.splice(formik.values.category.indexOf(item.id), 1);
                    }
                    item.isChecked = checked ? true : false;
                    // console.log(item)
                }
                return item;
            });
            return cat;
        });
        // console.log(categories);
        setCategories(newCategories);
    }

    const searchCategory = (e) => {
        const search = e.target.value;
        setSearch(search);
        setSearching(true);
        // search categories
        const dataItems = [];
        const newCategories = categories.map((category) => {
            return category.value.filter(item => {
                const check = item.name.toLowerCase().includes(search.toLowerCase())
                if (check) {
                    dataItems.push(item);
                }
                return true;
            })
        });
        setSearchResult(dataItems);
    }

    const selectSearchCheckbox = (e) => {
        const value = +e.target.value;
        const checked = e.target.checked;
        // console.log(checked);
        let newCategories = searchResult.map((item) => {
            // console.log(item);
            if (item.id === value) {
                if (checked) {
                    formik.values.category.push(item.id);
                } else {
                    formik.values.category.splice(formik.values.category.indexOf(item.id), 1);
                }
                item.isChecked = checked ? true : false;
                // console.log(item)
            }
            return item;
        });
        // console.log(categories);
        setSearchResult(newCategories);
    }

    return (
        <Modal
            isOpen={taxModal}
            // contentLabel="Minimal Modal Example"
            className="tax-modal"
            overlayClassName="overlay"
            ariaHideApp={false}
            onRequestClose={() => { closeModal() }}
        >
            <section className="modal-content">
                <div className="modal-header">
                    <h2>Add Tax</h2>
                    <div className="closeModal" onClick={() => { closeModal() }}>
                        X
                    </div>
                </div>

                <div className="modal-body">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <div className="tax-name">
                                <input className="form-control" id="name" placeholder="Tax Name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} autoComplete="off" />
                                {formik.touched.name && formik.errors.name ? <div className="error-block">{formik.errors.name}</div> : null}
                            </div>
                            <div className="tax-rate">
                                <input type="text" className="form-control" id="tax" placeholder="Rate" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.tax} autoComplete="off" />
                                {formik.touched.tax && formik.errors.tax ? <div className="error-block">{formik.errors.tax}</div> : null}
                                <div className="tax-sign">
                                    %
                                </div>
                            </div>
                        </div>
                        <div className="form-group-radio">
                            <label className="container-radio">
                                <input type="radio" name="type" id="type" value="all" checked={formik.values.type === 'all'} onChange={formik.handleChange} />
                                Apply to all items in collection
                                <span className="checkmark"></span>
                            </label>
                            <label className="container-radio">
                                <input type="radio" name="type" id="type" value="specific" checked={formik.values.type === 'specific'} onChange={formik.handleChange} />
                                Apply to specific items
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        {categories && formik.values.type === 'specific' ? (
                            <>
                                <div className="form-group col-3">
                                    <input className="form-control" id="search" placeholder="Search" onChange={searchCategory} value={search} />
                                </div>
                                {!searching && categories.map((category, index) => (
                                    <div className="form-group-checkbox" key={index}>
                                        <label htmlFor={category.key} className="container-checkbox header">
                                            <input type="checkbox" id={category.key} onChange={selectMultipleCheckbox} value={category.key} />
                                            {category.key}
                                            <span className="checkmark"></span>
                                        </label>
                                        {category.value.map((item, i) => (
                                            <label key={i} className="container-checkbox body">
                                                <input type="checkbox" onChange={selectCheckbox} name="category" value={item.id} checked={item.isChecked} />
                                                {item.name}
                                                <span className="checkmark"></span>
                                            </label>
                                        ))}
                                    </div>
                                ))}
                                {formik.touched.category && formik.errors.category ? <div className="error-block">{formik.errors.category}</div> : null}
                                <div className="form-group-checkbox">
                                    {searching && searchResult.map((item, i) => (
                                        <label key={i} className="container-checkbox body">
                                            <input type="checkbox" onChange={selectSearchCheckbox} name="category" value={item.id} checked={item.isChecked} />
                                            {item.name}
                                            <span className="checkmark"></span>
                                        </label>
                                    ))}
                                    {searching && formik.touched.category && formik.errors.category ? <div className="error-block">{formik.errors.category}</div> : null}
                                </div>
                            </>
                        ) : ('')}
                        <div className="submit">
                            <button type="submit" className="btn btn-primary">Apply tax item(s)</button>
                        </div>
                    </form>
                </div>
            </section>
        </Modal>
    )
}

export default AddTax
