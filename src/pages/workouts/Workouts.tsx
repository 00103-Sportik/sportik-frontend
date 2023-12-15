import { AiFillFilter } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';
import { useGetWorkoutsQuery } from '../../store/workouts/workouts.api.ts';
import { Dialog } from '@ariakit/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Input } from '../../common/components/input/Input.tsx';
import { DateFields, dateInitialValues, dateValidationSchema } from '../../common/validations/dateValidationSchema.ts';
import { WorkoutRequest } from '../../common/types/workouts.ts';
import { useNavigate } from 'react-router-dom';
import { WORKOUTS_URL } from '../../common/constants/api.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { discardWorkoutInfo, setCountWorkouts } from '../../store/workouts/workouts.slice.ts';
import { selectWorkoutsCount } from '../../store/workouts/workouts.selectors.ts';
import styles from '../../styles/base.module.css';
import styles2 from './Workouts.module.css';

function Workouts() {
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState('new');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fetching, setFetching] = useState(true);
  const limit = 10;
  let { data, isSuccess } = useGetWorkoutsQuery({ limit, offset, sort, from, to });
  const [workouts, setWorkouts] = useState<WorkoutRequest[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectWorkoutsCount);

  useEffect(() => {
    if (isSuccess && data) {
      setWorkouts(data.data.workouts);
      dispatch(discardWorkoutInfo());
    }
  }, [isSuccess, data]);

  const changeWorkouts = async (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setSort(target.value);
    setOffset(0);
  };

  const onSubmit = (values: DateFields) => {
    setFrom(values.from);
    setTo(values.to);
    setOffset(0);
    setOpen(false);
  };

  const scrollHandler = (e: Event) => {
    if (
      e.target &&
      (e.target as HTMLInputElement).scrollHeight -
        (e.target as HTMLInputElement).scrollTop -
        (e.target as HTMLInputElement).clientHeight <
        10
    ) {
      setFetching(true);
    }
  };

  useEffect(() => {
    if (fetching) {
      if (data !== undefined) {
        setWorkouts([...workouts, ...data.data.workouts]);
        setOffset((prevState) => prevState + limit);
      }
      setFetching(false);
    }
  }, [fetching]);

  useEffect(() => {
    const box = document.getElementById('box');
    if (box) {
      box.addEventListener('scroll', scrollHandler);
      return () => {
        box.removeEventListener('scroll', scrollHandler);
      };
    }
  }, []);

  return (
    <>
      <div className={styles2.sortFilter}>
        <button className="btn-black-filter" onClick={() => setOpen(true)}>
          <AiFillFilter />
        </button>
        <Formik initialValues={dateInitialValues} onSubmit={onSubmit} validationSchema={dateValidationSchema}>
          {({ values }) => {
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
                          type="date"
                          {...field}
                          placeholder="From"
                          error={meta.touched && !!meta.error}
                          errorText={meta.error}
                        />
                      )}
                    </Field>
                    <Field name="to">
                      {({ field, meta }: FieldProps) => (
                        <Input
                          type="date"
                          {...field}
                          placeholder="To"
                          error={meta.touched && !!meta.error}
                          errorText={meta.error}
                        />
                      )}
                    </Field>
                  </div>
                  <div className={styles2.applyButton}>
                    <button className="btn-black" onClick={() => onSubmit(values)}>
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
        {workouts.length !== 0 ? (
          workouts.map((workout) => (
            <div className={styles.itemBox}>
              <div
                className={styles2.boxItems}
                onClick={() => {
                  dispatch(setCountWorkouts({ count: data?.data.workouts_count || count }));
                  navigate(`${WORKOUTS_URL}/${workout.uuid}`);
                }}
              >
                <div className={styles.boxContent}>
                  <div className={styles.boxInfo}>
                    <span>{workout.name}</span>
                    <span>{workout.date}</span>
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
