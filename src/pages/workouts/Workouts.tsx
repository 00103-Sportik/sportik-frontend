import { Navbar } from '../../common/components/navbar/Navbar.tsx';
import { AiFillFilter } from 'react-icons/ai';
import styles from './Workouts.module.css';
import React, { useState } from 'react';
import { useGetWorkoutsQuery } from '../../store/workouts/workouts.api.ts';
import { Dialog } from '@ariakit/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Input } from '../../common/components/input/Input.tsx';
import { dateInitialValues } from '../../common/validations/dateValidationSchema.ts';

function Workouts() {
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(1);
  const [sort, setSort] = useState('newest');
  const [from, setFrom] = useState(undefined);
  const [to, setTo] = useState(undefined);

  const limit = 10;
  const changeWorkouts = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setSort(target.value);
    switch (sort) {
      case 'newest':
        useGetWorkoutsQuery({ limit, offset, sort, from, to });
        break;
      case 'oldest':
        useGetWorkoutsQuery({ limit, offset, sort, from, to });
        break;
      case 'name':
        useGetWorkoutsQuery({ limit, offset, sort, from, to });
        break;
    }
  };

  const onSubmit = () => {
    useGetWorkoutsQuery({ limit, offset, sort, from, to });
  };

  return (
    <>
      <Navbar></Navbar>
      <div>
        <div className={styles.sortFilter}>
          <button onClick={() => setOpen(true)}>
            <AiFillFilter />
          </button>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            getPersistentElements={() => document.querySelectorAll('.Toastify')}
            backdrop={<div className="backdrop" />}
            className="dialog"
          >
            <p className="description">Enter the dates filter range:</p>
            <Formik initialValues={dateInitialValues} onSubmit={onSubmit}>
              {({}) => {
                return (
                  <Form className={styles.dateRange}>
                    <Field name="from">
                      {({ field, form, meta }: FieldProps) => (
                        <Input
                          type="date"
                          {...field}
                          placeholder="From"
                          min="0000-01-01"
                          max="9999-12-31"
                          error={meta.touched && !!meta.error}
                          errorText={meta.error}
                          onClear={() => form.setFieldValue('from', '')}
                        />
                      )}
                    </Field>
                    <Field name="to">
                      {({ field, form, meta }: FieldProps) => (
                        <Input
                          type="date"
                          {...field}
                          placeholder="To"
                          min="0000-01-01"
                          max="9999-12-31"
                          error={meta.touched && !!meta.error}
                          errorText={meta.error}
                          onClear={() => form.setFieldValue('to', '')}
                        />
                      )}
                    </Field>
                  </Form>
                );
              }}
            </Formik>
            <button className="btn-black">Apply</button>
          </Dialog>
          <div className="select-container">
            <select className="select-box" onChange={changeWorkouts}>
              <option value="newest" selected>
                Newest
              </option>
              <option value="oldest">Oldest</option>
              <option value="name">By name</option>
            </select>
          </div>
        </div>
        <div className="workouts"></div>
        <button className="btn-black">Save</button>
      </div>
    </>
  );
}

export default Workouts;
