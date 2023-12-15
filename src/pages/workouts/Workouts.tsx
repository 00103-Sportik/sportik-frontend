import { AiFillFilter } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';
import { useGetWorkoutsQuery } from '../../store/workouts/workouts.api.ts';
import { Dialog } from '@ariakit/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Input } from '../../common/components/input/Input.tsx';
import { DateFields, dateInitialValues, dateValidationSchema } from '../../common/validations/dateValidationSchema.ts';
import { useNavigate } from 'react-router-dom';
import { WORKOUTS_URL } from '../../common/constants/api.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { discardWorkoutInfo, setCountWorkouts } from '../../store/workouts/workouts.slice.ts';
import { selectWorkoutsCount } from '../../store/workouts/workouts.selectors.ts';
import styles from '../../styles/base.module.css';
import styles2 from './Workouts.module.css';
import { IMask } from 'react-imask';
import { apiSlice } from '../../store/api.slice.ts';
import { WorkoutRequest } from '../../common/types/workouts.ts';

function Workouts() {
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState('new');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const limit = 10;
  const { data, isFetching, isSuccess } = useGetWorkoutsQuery({ limit, offset, sort, from, to });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectWorkoutsCount);

  useEffect(() => {
    dispatch(apiSlice.util.invalidateTags(['Workouts']));
  }, [limit, sort, from, to]);

  useEffect(() => {
    const scrollHandler = (e: Event) => {
      if (
        (e.target as HTMLInputElement).scrollHeight -
          (e.target as HTMLInputElement).scrollTop -
          (e.target as HTMLInputElement).clientHeight <
          10 &&
        !isFetching
      ) {
        setOffset((prevState) => prevState + limit);
      }
    };
    const box = document.getElementById('box');
    if (box) {
      box.addEventListener('scroll', scrollHandler);
      return () => {
        box.removeEventListener('scroll', scrollHandler);
      };
    }
  }, [offset, isFetching]);

  const changeWorkouts = async (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setSort(target.value);
    setOffset(0);
  };

  const convertDate = (date: string) => {
    const parts = date.split('.');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const convertToLocalDate = (date: string) => {
    const parts = date.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  const onSubmit = (values: DateFields) => {
    setFrom(convertDate(values.from));
    setTo(convertDate(values.to));
    setOffset(0);
    setOpen(false);
  };

  return (
    <>
      <div className={styles2.sortFilter}>
        <button className="btn-black-filter" onClick={() => setOpen(true)}>
          <AiFillFilter />
        </button>
        <Formik initialValues={dateInitialValues} onSubmit={onSubmit} validationSchema={dateValidationSchema}>
          {({ handleChange }) => {
            return (
              <Dialog
                open={open}
                onClose={() => setOpen(false)}
                getPersistentElements={() => document.querySelectorAll('.Toastify')}
                backdrop={<div className="backdrop" />}
                className="dialog"
              >
                <p className={styles.p}>Enter the dates filter range:</p>
                <Form className={styles2.dateRange}>
                  <div>
                    <Field name="from">
                      {({ field, meta }: FieldProps) => (
                        <Input
                          id="date-from"
                          type="text"
                          {...field}
                          onChange={(e) => {
                            const element = document.getElementById(`date-from`);
                            const maskOptions = {
                              mask: '00.00.0000',
                            };
                            // @ts-ignore
                            IMask(element, maskOptions);
                            handleChange(e);
                          }}
                          placeholder="From"
                          error={meta.touched && !!meta.error}
                          errorText={meta.error}
                          className="form-input-modal"
                        />
                      )}
                    </Field>
                    <Field name="to">
                      {({ field, meta }: FieldProps) => (
                        <Input
                          id="date-to"
                          type="text"
                          {...field}
                          onChange={(e) => {
                            handleChange(e);
                            const element = document.getElementById(`date-to`);
                            const maskOptions = {
                              mask: '00.00.0000',
                            };
                            // @ts-ignore
                            IMask(element, maskOptions);
                          }}
                          placeholder="To"
                          error={meta.touched && !!meta.error}
                          errorText={meta.error}
                          className="form-input-modal"
                        />
                      )}
                    </Field>
                  </div>
                  <div className={styles2.applyButton}>
                    <button className="btn-black" type="submit">
                      Apply
                    </button>
                  </div>
                </Form>
              </Dialog>
            );
          }}
        </Formik>
        <div className="select-container">
          <select className={styles2.selectBox} onChange={changeWorkouts}>
            <option value="new" selected>
              Newest
            </option>
            <option value="old">Oldest</option>
            <option value="name">By name</option>
          </select>
        </div>
      </div>
      <div className={styles.mainBox} id="box">
        {/* <div className={styles.box}> */}
        {/*   <div */}
        {/*     className={styles.boxItems} */}
        {/*     onClick={() => { */}
        {/*       dispatch(setCountWorkouts({ count: data?.data.workouts_count || count })); */}
        {/*       navigate(`${WORKOUTS_URL}/${1}`); */}
        {/*     }} */}
        {/*   > */}
        {/*     <div className={styles.boxContent}> */}
        {/*       <div className={styles.boxInfo}> */}
        {/*         <span className={styles.infoItem}>name</span> */}
        {/*         <span className={styles.infoItem}>date</span> */}
        {/*         <span className={styles.infoItem}>type</span> */}
        {/*       </div> */}
        {/*       <div className={styles.deleteButton}> */}
        {/*         <button type="button"> */}
        {/*           <AiOutlineClose /> */}
        {/*         </button> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}
        {data && data.data.workouts.length !== 0 ? (
          data.data.workouts.map((workout) => (
            <div className={styles.itemBox} key={workout.uuid}>
              <div
                className={styles2.boxItems}
                onClick={() => {
                  dispatch(discardWorkoutInfo());
                  dispatch(setCountWorkouts({ count: data?.data.workouts_count || count }));
                  navigate(`${WORKOUTS_URL}/${workout.uuid}`);
                }}
              >
                <div className={styles.boxContent}>
                  <div className={styles.boxInfo}>
                    <span>{workout.name}</span>
                    <span>{convertToLocalDate(workout.date)}</span>
                    <span>{workout.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className={styles.noEntities}>There are no workouts yet</h1>
        )}
      </div>
      <button
        className="btn-black-less-margin"
        onClick={() => {
          dispatch(setCountWorkouts({ count: data?.data.workouts_count || count }));
          navigate(WORKOUTS_URL);
        }}
      >
        Add
      </button>
    </>
  );
}

export default Workouts;
