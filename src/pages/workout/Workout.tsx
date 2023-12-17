import { useFormik } from 'formik';
import { Input } from '../../common/components/input/Input.tsx';
import {
  WorkoutFields,
  workoutInitialValues,
  workoutValidationSchema,
} from '../../common/validations/workoutValidationSchema.ts';
import { useEffect, useState } from 'react';
import {
  useCreateWorkoutMutation,
  useDeleteWorkoutMutation,
  useGetWorkoutQuery,
  useUpdateWorkoutMutation,
} from '../../store/workouts/workouts.api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import {
  selectExercises,
  selectFullWorkoutInfo,
  selectWorkoutsCount,
} from '../../store/workouts/workouts.selectors.ts';
import { toast } from 'react-toastify';
import { APPROACHES_URL, SUBTYPES_URL, WORKOUTS_URL } from '../../common/constants/api.ts';
import { Dialog, DialogDismiss } from '@ariakit/react';
import {
  setApproaches,
  setCountWorkouts,
  setCurrentWorkouts,
  setExercise,
  setMainInfo,
} from '../../store/workouts/workouts.slice.ts';
import { ApproachRequest, ExerciseRequestPost } from '../../common/types/workouts.ts';
import { AiOutlineClose } from 'react-icons/ai';
import styles from '../../styles/base.module.css';
import styles2 from './Workout.module.css';
import { IMask } from 'react-imask';
import { subtypeInitialValue, subtypeValidationSchema } from '../../common/validations/subtypeValidationSchema.ts';

function Workout() {
  const count = useAppSelector(selectWorkoutsCount) + 1;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const exercisesFromStore = useAppSelector(selectExercises);
  const [exercises, setExercises] = useState<ExerciseRequestPost[]>(exercisesFromStore);
  const [updateWorkout, { error: errorUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate }] =
    useUpdateWorkoutMutation();
  const [createWorkout, { error: errorCreate, isSuccess: isSuccessCreate, data: dataCreate, isError: isErrorCreate }] =
    useCreateWorkoutMutation();
  const [delWorkout, { error: errorDelete, isSuccess: isSuccessDelete, isError: isErrorDelete }] =
    useDeleteWorkoutMutation();
  const { uuid } = useParams();
  const dispatch = useAppDispatch();
  const workoutInfo = useAppSelector(selectFullWorkoutInfo);

  const convertToLocalDate = (date: string) => {
    const parts = date.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  const [fields, setFields] = useState<WorkoutFields>({
    name: workoutInfo.name || `Workout ${count}`,
    date: workoutInfo.date ? convertToLocalDate(workoutInfo.date) : new Date().toLocaleDateString(),
    type: workoutInfo.type || 'strength',
    comment: workoutInfo.comment || '',
  });
  const { data, isSuccess } = useGetWorkoutQuery({ uuid });

  useEffect(() => {
    setExercises(exercisesFromStore);
  }, [exercisesFromStore]);

  useEffect(() => {
    if (data) {
      data?.data.exercises.map((curExercise) => {
        if (!exercises.find((tmpExercise) => curExercise.uuid === tmpExercise.uuid)) {
          dispatch(setExercise(curExercise));
          dispatch(setApproaches({ exerciseId: curExercise.uuid, approaches: curExercise.approaches || [] }));
        }
      });
    }
  }, [setExercises, data]);

  useEffect(() => {
    if (isSuccess && uuid) {
      setFields({
        uuid: data?.data.uuid || '',
        name: data?.data.name || `Workout ${count}`,
        date: data?.data.date ? convertToLocalDate(data?.data.date) : new Date().toLocaleDateString(),
        type: data?.data.type || 'strength',
        comment: data?.data.comment || '',
      });
    }
  }, [isSuccess, uuid]);

  useEffect(() => {
    if (uuid) {
      dispatch(setCurrentWorkouts({ uuid }));
    }
  }, [uuid]);

  useEffect(() => {
    if (isSuccessCreate && dataCreate) {
      navigate(`${WORKOUTS_URL}/${dataCreate?.data.uuid}`);
      toast('Created successfully!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      dispatch(setCountWorkouts({ count: count + 1 }));
    }
  }, [isSuccessCreate, dataCreate]);

  useEffect(() => {
    if (isSuccessUpdate) {
      toast('Updated successfully!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [isSuccessUpdate]);

  useEffect(() => {
    if (isSuccessDelete) {
      navigate('/');
      toast('Deleted successfully!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [isSuccessDelete]);

  useEffect(() => {
    if (isErrorCreate && errorCreate) {
      toast('message' in errorCreate ? errorCreate && errorCreate.message : 'Create failed!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [errorCreate, isErrorCreate]);

  useEffect(() => {
    if (isErrorUpdate && errorUpdate) {
      toast('message' in errorUpdate ? errorUpdate && errorUpdate.message : 'Update failed!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [errorUpdate, isErrorUpdate]);

  useEffect(() => {
    if (errorDelete && isErrorDelete) {
      toast('message' in errorDelete ? errorDelete && errorDelete.message : 'Delete failed!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [errorDelete, isErrorDelete]);

  const convertDate = (date: string) => {
    const parts = date.split('.');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const onSubmit = async () => {
    const toExercises: ExerciseRequestPost[] = exercises.map((exercise) => {
      return { uuid: exercise.uuid, approaches: exercise.approaches || [] } as ExerciseRequestPost;
    });
    if (uuid) {
      await updateWorkout({
        uuid,
        date: convertDate(fields.date),
        name: fields.name,
        type: fields.type,
        comment: fields.comment,
        exercises: toExercises,
      });
    } else {
      await createWorkout({
        date: convertDate(fields.date),
        name: fields.name,
        type: fields.type,
        comment: fields.comment,
        exercises: toExercises,
      });
    }
  };

  const deleteWorkout = async () => {
    await delWorkout({ uuid });
  };

  const goToSubtypes = () => {
    dispatch(
      setMainInfo({
        uuid: uuid,
        date: convertDate(fields.date),
        name: fields.name,
        type: fields.type,
        comment: fields.comment,
      }),
    );
    navigate(SUBTYPES_URL + '/' + fields.type);
  };

  const goToApproaches = (id: string, approaches: ApproachRequest[]) => {
    dispatch(setApproaches({ exerciseId: id, approaches }));
    navigate(`${APPROACHES_URL}/${id}`);
  };

  const deleteExercise = (index: number) => {
    const tempExercises = [...exercises];
    tempExercises.splice(index, 1);
    setExercises(tempExercises);
  };

  useEffect(() => {
    formik.setValues(fields);
  }, [fields]);

  const formik = useFormik({
    initialValues: workoutInitialValues,
    onSubmit,
    validationSchema: workoutValidationSchema,
  });

  return (
    <>
      <form id="workout-form" onSubmit={formik.handleSubmit}>
        <div className={styles2.parametersBox}>
          <Input
            type="text"
            {...formik.getFieldProps('name')}
            error={formik.getFieldMeta('name').touched && !!formik.getFieldMeta('name').error}
            errorText={formik.getFieldMeta('name').error}
            placeholder="Name"
            className="form-input-wider"
          ></Input>
          <Input
            id="workout-date"
            type="text"
            {...formik.getFieldProps('date')}
            error={formik.getFieldMeta('date').touched && !!formik.getFieldMeta('date').error}
            errorText={formik.getFieldMeta('date').error}
            onChange={(event) => {
              formik.handleChange(event);
              const element = document.getElementById(`workout-date`);
              const maskOptions = {
                mask: '00.00.0000',
              };
              // @ts-ignore
              IMask(element, maskOptions);
              formik.setFieldValue('inputFile', event.target.value);
            }}
            placeholder="Date"
            className="form-input-wider"
          />
          <div className="select-container-wider">
            <select
              className="select-box-wider"
              value={formik.values.type}
              onChange={(type) => formik.setFieldValue('type', type.target.value)}
            >
              <option
                value="strength"
                selected={formik.values.type === 'strength'}
                className="select-option"
                hidden={exercises.length !== 0 && formik.values.type !== 'strength'}
              >
                strength
              </option>
              <option
                value="cardio"
                selected={formik.values.type === 'cardio'}
                className="select-option"
                hidden={exercises.length !== 0 && formik.values.type !== 'cardio'}
              >
                cardio
              </option>
            </select>
          </div>
        </div>
        <div className={styles2.mainBox}>
          {exercises.length !== 0 ? (
            exercises.map((exercise, index) => (
              <div className={styles.itemBox}>
                <div
                  className={styles.boxItems}
                  onClick={(event) => {
                    const target = event.target as HTMLElement;
                    const button = target.closest('button');
                    if (button) {
                      if (button.classList.contains('delete-from-workout')) {
                        deleteExercise(index);
                      }
                    } else {
                      goToApproaches(exercise.uuid || '', exercise.approaches || []);
                    }
                  }}
                >
                  <div className={styles.boxContent}>
                    <div className={styles.boxInfo}>
                      <span>{exercise.name}</span>
                      <span>approaches: {exercise?.approaches?.length || 0}</span>
                    </div>
                    <div className={styles.deleteButton}>
                      <button className="delete-from-workout">
                        <AiOutlineClose />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1 className={styles.noEntities}>There are no exercises yet</h1>
          )}
        </div>
        <button className="btn-black-less-margin" onClick={() => goToSubtypes()}>
          Add
        </button>
        <div className={styles2.parametersBox}>
          <Input
            type="text"
            {...formik.getFieldProps('comment')}
            error={formik.getFieldMeta('comment').touched && !!formik.getFieldMeta('comment').error}
            errorText={formik.getFieldMeta('comment').error}
            placeholder="Comment"
            className="form-input-wider"
          ></Input>
        </div>
        <div className={styles.buttonsBox}>
          <button className="btn-black-less-margin" type="submit" form="workout-form">
            Save
          </button>
          <button className="btn-red-less-margin" onClick={() => setOpen(true)} type="reset">
            Delete
          </button>
        </div>
      </form>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        getPersistentElements={() => document.querySelectorAll('.Toastify')}
        backdrop={<div className="backdrop" />}
        className="dialog"
      >
        <p className={styles.p}>Delete workout?</p>
        <div className={styles.buttonsBox}>
          <DialogDismiss className="btn-black" onClick={deleteWorkout}>
            Yes
          </DialogDismiss>
          <DialogDismiss className="btn-red">No</DialogDismiss>
        </div>
      </Dialog>
    </>
  );
}

export default Workout;
