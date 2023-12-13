import { AiFillFilter, AiOutlineClose } from 'react-icons/ai';
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
import { setCountWorkouts } from '../../store/workouts/workouts.slice.ts';
import { selectWorkoutsCount } from '../../store/workouts/workouts.selectors.ts';
import styles from './Workouts.module.css';

function Workouts() {
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(1);
  const [sort, setSort] = useState('newest');
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [workouts, setWorkouts] = useState<WorkoutRequest[]>([]);
  const [fetching, setFetching] = useState(true);
  const limit = 10;
  let { data, isSuccess } = useGetWorkoutsQuery({ limit, offset, sort, from, to });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectWorkoutsCount);

  if (isSuccess) {
    dispatch(setCountWorkouts({ count: data?.data.workouts_count || count }));
  }

  const changeWorkouts = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setSort(target.value);
    setOffset(0);
    let { data } = useGetWorkoutsQuery({ limit, offset, sort, from, to });
    if (data?.data !== undefined) {
      setWorkouts(data.data.workouts);
    }
  };

  const onSubmit = (values: DateFields) => {
    setOffset(0);
    setFrom(new Date(values.from).getTime());
    setTo(new Date(values.to).getTime());
    let { data, isSuccess } = useGetWorkoutsQuery({ limit, offset, sort, from, to });
    if (isSuccess && data?.data !== undefined) {
      setWorkouts(data.data.workouts);
    }
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
        setOffset((prevState) => prevState + 1);
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
        <div className={styles.sortFilter}>
          <button className="btn-black-filter" onClick={() => setOpen(true)}>
            <AiFillFilter />
          </button>
          <Formik initialValues={dateInitialValues} onSubmit={onSubmit} validationSchema={dateValidationSchema}>
            {({}) => {
              return (
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  getPersistentElements={() => document.querySelectorAll('.Toastify')}
                  backdrop={<div className="backdrop" />}
                  className="dialog"
                >
                  <p className="description">Enter the dates filter range:</p>
                  <Form className={styles.dateRange}>
                    <div>
                      <Field name="from">
                        {({ field, meta }: FieldProps) => (
                          <Input
                            type="date"
                            {...field}
                            placeholder="From"
                            min="0000-01-01"
                            max="9999-12-31"
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
                            min="0000-01-01"
                            max="9999-12-31"
                            error={meta.touched && !!meta.error}
                            errorText={meta.error}
                          />
                        )}
                      </Field>
                    </div>
                    <button className="btn-black" type="submit">
                      Apply
                    </button>
                  </Form>
                </Dialog>
              );
            }}
          </Formik>
          <div className="select-container">
            <select className="select-box-narrow" onChange={changeWorkouts}>
              <option value="newest" selected>
                Newest
              </option>
              <option value="oldest">Oldest</option>
              <option value="name">By name</option>
            </select>
          </div>
        </div>
        <div className={styles.workouts} id="box">
          <div className={styles.box}>
            <div className={styles.boxItems} onClick={() => navigate(`${WORKOUTS_URL}/${1}`)}>
              <div className={styles.boxContent}>
                <div className={styles.boxInfo}>
                  <span className={styles.infoItem}>name</span>
                  <span className={styles.infoItem}>date</span>
                  <span className={styles.infoItem}>type</span>
                </div>
                <div className={styles.deleteButton}>
                  <button type="button">
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxItems} onClick={() => navigate(`${WORKOUTS_URL}/${1}`)}>
              <div className={styles.boxContent}>
                <div className={styles.boxInfo}>
                  <span className={styles.infoItem}>name</span>
                  <span className={styles.infoItem}>date</span>
                  <span className={styles.infoItem}>type</span>
                </div>
                <div className={styles.deleteButton}>
                  <button type="button">
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxItems} onClick={() => navigate(`${WORKOUTS_URL}/${1}`)}>
              <div className={styles.boxContent}>
                <div className={styles.boxInfo}>
                  <span className={styles.infoItem}>name</span>
                  <span className={styles.infoItem}>date</span>
                  <span className={styles.infoItem}>type</span>
                </div>
                <div className={styles.deleteButton}>
                  <button type="button">
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxItems} onClick={() => navigate(`${WORKOUTS_URL}/${1}`)}>
              <div className={styles.boxContent}>
                <div className={styles.boxInfo}>
                  <span className={styles.infoItem}>name</span>
                  <span className={styles.infoItem}>date</span>
                  <span className={styles.infoItem}>type</span>
                </div>
                <div className={styles.deleteButton}>
                  <button type="button">
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxItems} onClick={() => navigate(`${WORKOUTS_URL}/${1}`)}>
              <div className={styles.boxContent}>
                <div className={styles.boxInfo}>
                  <span className={styles.infoItem}>name</span>
                  <span className={styles.infoItem}>date</span>
                  <span className={styles.infoItem}>type</span>
                </div>
                <div className={styles.deleteButton}>
                  <button type="button">
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxItems} onClick={() => navigate(`${WORKOUTS_URL}/${1}`)}>
              <div className={styles.boxContent}>
                <div className={styles.boxInfo}>
                  <span className={styles.infoItem}>name</span>
                  <span className={styles.infoItem}>date</span>
                  <span className={styles.infoItem}>type</span>
                </div>
                <div className={styles.deleteButton}>
                  <button type="button">
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxItems} onClick={() => navigate(`${WORKOUTS_URL}/${1}`)}>
              <div className={styles.boxContent}>
                <div className={styles.boxInfo}>
                  <span className={styles.infoItem}>name</span>
                  <span className={styles.infoItem}>date</span>
                  <span className={styles.infoItem}>type</span>
                </div>
                <div className={styles.deleteButton}>
                  <button type="button">
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {workouts.length !== 0 ? (
            workouts.map((workout) => (
              <div className={styles.box}>
                <div className={styles.boxInfo} onClick={() => navigate(`${WORKOUTS_URL}/${workout.id}`)}>
                  <div className={styles.boxInfo}>
                    <span>{workout.name}</span>
                    <span>{workout.date}</span>
                    <span>{workout.type}</span>
                  </div>
                  <button type="button">
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1 className={styles.noWorkouts}>There are no workouts yet</h1>
          )}
        </div>
        <button className="btn-black" onClick={() => navigate(WORKOUTS_URL)}>
          Add
        </button>
    </>
  );
}

export default Workouts;
