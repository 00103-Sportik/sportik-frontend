import { Field, FieldProps, Form, Formik } from 'formik';
import { Input } from '../../common/components/input/Input.tsx';
import {
  WorkoutFields,
  workoutInitialValues,
  workoutValidationSchema,
} from '../../common/validations/workoutValidationSchema.ts';
import { useCallback, useState } from 'react';
import {
  useCreateWorkoutMutation,
  useDeleteWorkoutMutation,
  useGetWorkoutQuery,
  useUpdateWorkoutMutation,
} from '../../store/workouts/workouts.api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { produce } from 'immer';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { selectWorkoutsCount } from '../../store/workouts/workouts.selectors.ts';
import styles from './Workout.module.css';
import { ExerciseRequest } from '../../common/types/workouts.ts';
import { toast } from 'react-toastify';
import { SUBTYPES_URL, WORKOUTS_URL } from '../../common/constants/api.ts';
import { Dialog, DialogDismiss } from '@ariakit/react';
import { setCurrentWorkouts } from '../../store/workouts/workouts.slice.ts';

function Workout() {
  const count = useAppSelector(selectWorkoutsCount) + 1;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<ExerciseRequest[]>([]);
  const [updateWorkout, { error: updateError }] = useUpdateWorkoutMutation();
  const [createWorkout, { error: createError, data }] = useCreateWorkoutMutation();
  const [delWorkout, { error: deleteError }] = useDeleteWorkoutMutation();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  let [fields, setFields] = useState<WorkoutFields>({
    name: `Новая тренировка ${count}`,
    date: new Date().toISOString().split('T')[0],
    type: 'strength',
    comment: '',
  });

  if (id) {
    dispatch(setCurrentWorkouts({ id }));
    const { data } = useGetWorkoutQuery({ id });
    [fields, setFields] = useState<WorkoutFields>({
      id: data?.data.id || '',
      name: data?.data.name || `Новая тренировка ${count}`,
      date: data?.data.date
        ? new Date(data?.data.date * 1000).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      type: data?.data.type || 'strength',
      comment: data?.data.comment || '',
    });
    if (data?.data?.exercises) {
      setExercises(data?.data?.exercises);
    }
  }

  const onSubmit = (values: WorkoutFields) => {
    if (id) {
      updateWorkout({
        id: values.id,
        date: new Date(values.date).getTime(),
        name: values.name,
        type: values.type,
        comment: values.comment,
      });
      if (updateError) {
        toast('message' in updateError ? updateError && updateError.message : 'Update failed!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
        toast('Update successful!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    } else {
      createWorkout({
        date: new Date(values.date).getTime(),
        name: values.name,
        type: values.type,
        comment: values.comment,
      });
      if (createError) {
        toast('message' in createError ? createError && createError.message : 'Create failed!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
        navigate(`${WORKOUTS_URL}/${data?.data.id}`);
        toast('Create successful!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    }
  };

  const changeField = useCallback((field: keyof WorkoutFields, value: string) => {
    setFields(
      produce((draft) => {
        draft[field] = value;
      }),
    );
  }, []);

  const deleteWorkout = () => {
    delWorkout({ id });
    if (deleteError) {
      toast('message' in deleteError ? deleteError && deleteError.message : 'Delete successful!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else {
      navigate('/');
      toast('Delete successful!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  return (
    <>
      <div>
        <Formik initialValues={workoutInitialValues} onSubmit={onSubmit} validationSchema={workoutValidationSchema}>
          {(props) => {
            return (
              <Form>
                <Field name="name">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      type="text"
                      {...field}
                      value={fields.name}
                      onChange={(event) => {
                        props.handleChange(event);
                        changeField('name', event.target.value);
                      }}
                      placeholder="Name"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                    ></Input>
                  )}
                </Field>
                <Field name="date">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      type="date"
                      {...field}
                      value={fields.date}
                      onChange={(event) => {
                        props.handleChange(event);
                        changeField('date', event.target.value);
                      }}
                      placeholder="Date"
                      min="0000-01-01"
                      max="9999-12-31"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                    />
                  )}
                </Field>
                <div className="select-container">
                  <select
                    className="select-box"
                    onChange={(event) => {
                      changeField('type', event.target.value);
                    }}
                  >
                    <option value="strength" selected={fields.type === 'strength'}>
                      Strength
                    </option>
                    <option value="cardio" selected={fields.type === 'cardio'}>
                      Cardio
                    </option>
                  </select>
                </div>
                <div className={styles.exercises} id="boxx">
                  {/* {exercises.length !== 0 ? ( */}
                  {/*   exercises.map((exercise) => ( */}
                  {/*     <div className={styles.box}> */}
                  {/*       <div className={styles.boxInfo}> */}
                  {/*         <span>{exercise.name}</span> */}
                  {/*         <span>Approaches: {exercise?.approaches?.length}</span> */}
                  {/*       </div> */}
                  {/*     </div> */}
                  {/*   )) */}
                  {/* ) : ( */}
                  {/*   <h1 className={styles.noExercises}>There are no exercises yet</h1> */}
                  {/* )} */}
                  <div className={styles.box}>
                    <div className={styles.boxInfo} onClick={() => navigate(`${SUBTYPES_URL}/${1}`)}>
                      <span>{1}</span>
                      <span>Approaches: {2}</span>
                    </div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.boxInfo} onClick={() => navigate(`${SUBTYPES_URL}/${2}`)}>
                      <span>{1}</span>
                      <span>Approaches: {2}</span>
                    </div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.boxInfo} onClick={() => navigate(`${SUBTYPES_URL}/${3}`)}>
                      <span>{1}</span>
                      <span>Approaches: {2}</span>
                    </div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.boxInfo} onClick={() => navigate(`${SUBTYPES_URL}/${4}`)}>
                      <span>{1}</span>
                      <span>Approaches: {2}</span>
                    </div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.boxInfo} onClick={() => navigate(`${SUBTYPES_URL}/${5}`)}>
                      <span>{1}</span>
                      <span>Approaches: {2}</span>
                    </div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.boxInfo} onClick={() => navigate(`${SUBTYPES_URL}/${6}`)}>
                      <span>{1}</span>
                      <span>Approaches: {2}</span>
                    </div>
                  </div>
                </div>
                <button className="btn-black" onClick={() => navigate(SUBTYPES_URL + '/' + fields.type)}>
                  Add
                </button>
                <Field name="comment">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      type="text"
                      {...field}
                      value={fields.comment}
                      onChange={(event) => {
                        props.handleChange(event);
                        changeField('comment', event.target.value);
                      }}
                      placeholder="Comment"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                    ></Input>
                  )}
                </Field>
                <div>
                  <button className="btn-black" type="submit">
                    Save
                  </button>
                  {!id && (
                    <button className="btn-red" onClick={() => setOpen(true)}>
                      Delete
                    </button>
                  )}
                  <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    getPersistentElements={() => document.querySelectorAll('.Toastify')}
                    backdrop={<div className="backdrop" />}
                    className="dialog"
                  >
                    <p className="description">Delete workout?</p>
                    <div className="buttons">
                      <DialogDismiss className="btn-black" onClick={deleteWorkout}>
                        Yes
                      </DialogDismiss>
                      <DialogDismiss className="btn-red">No</DialogDismiss>
                    </div>
                  </Dialog>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
}

export default Workout;
