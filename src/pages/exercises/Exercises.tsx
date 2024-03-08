import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteExerciseMutation, useGetExercisesQuery } from '../../store/exercise/exercise.api.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setExercise, setSubtype } from '../../store/workouts/workouts.slice.ts';
import { ExerciseRequest, ExerciseRequestPost } from '../../common/types/workouts.ts';
import { AiFillEdit, AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import styles from '../../styles/base.module.css';
import { useEffect, useState } from 'react';
import { selectCurrentWorkout, selectExercises, selectType } from '../../store/workouts/workouts.selectors.ts';
import { useGetSubtypesQuery } from '../../store/subtype/subtype.api.ts';
import { EXERCISE_URL, EXERCISES_URL, WORKOUTS_URL } from '../../common/constants/api.ts';

function Exercises() {
  const navigate = useNavigate();
  const exercisesFromStore = useAppSelector(selectExercises);
  const { type } = useParams();
  const workoutUuid = useAppSelector(selectCurrentWorkout);
  const [subtypeName, setSubtypeName] = useState('');
  const { data: dataSub, isSuccess: isSuccessSub } = useGetSubtypesQuery({ type: useAppSelector(selectType) });
  const { data, isSuccess } = useGetExercisesQuery({ subtype_uuid: type || '' });
  const [delExercise, { isSuccess: isSuccessDelete, error, isError }] = useDeleteExerciseMutation();
  const dispatch = useAppDispatch();
  const [exercises, setExercises] = useState<ExerciseRequest[]>([]);

  useEffect(() => {
    if (isSuccess) {
      setExercises(data?.data.exercises);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccessSub) {
      setSubtypeName(dataSub.data.subtypes.filter((subtype) => subtype.uuid === type)[0].name);
    }
  }, [isSuccessSub, dataSub]);

  const addToWorkout = (exercise: ExerciseRequestPost) => {
    if (exercisesFromStore.filter((exerciseFromStore) => exerciseFromStore.name === exercise.name).length === 0) {
      dispatch(setExercise(exercise));
      navigate(`${WORKOUTS_URL}/${workoutUuid}`);
    } else {
      toast('Exercise has already been added to the workout!', {
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
  };

  useEffect(() => {
    if (isSuccessDelete) {
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
    if (isError && error) {
      toast('message' in error ? error && error.message : 'Delete failed!', {
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
  }, [error, isError]);

  const deleteExercise = async (uuid: string) => {
    await delExercise({ uuid });
  };

  const goToCreateExercises = () => {
    dispatch(setSubtype({ subtype: type || '' }));
    navigate(EXERCISES_URL);
  };

  return (
    <>
      <p data-testid="subtype-p1" className={styles.p1}>
        {subtypeName}
      </p>
      <p className={styles.p2}>Exercises</p>
      <div className={styles.mainBox}>
        {exercises.length !== 0 ? (
          exercises?.map((exercise, index) => (
            <div className={styles.itemBox}>
              <div
                key={index}
                data-testid={`exercise${index}-div`}
                className={styles.boxItems}
                onClick={(event) => {
                  const target = event.target as HTMLElement;
                  const button = target.closest('button');
                  if (button) {
                    if (button.classList.contains('delete-exercise')) {
                      deleteExercise(exercise.uuid || '');
                    } else if (button.classList.contains('update-exercise')) {
                      dispatch(setSubtype({ subtype: type || '' }));
                      navigate(`${EXERCISE_URL}/${exercise.uuid || ''}`);
                    }
                  } else {
                    addToWorkout({
                      uuid: exercise.uuid || '',
                      combination_params: exercise.combination_params,
                      name: exercise.name,
                    });
                  }
                }}
              >
                <div className={styles.boxContent}>
                  <div className={styles.boxInfo}>
                    <span data-testid={`exercise${index}-name`}>{exercise.name}</span>
                  </div>
                  <div className={styles.sideButtonsBox} hidden={exercise.user_uuid === null}>
                    <button data-testid={`update${index}-btn`} className="update-exercise">
                      <AiFillEdit />
                    </button>
                    <button data-testid={`delete${index}-btn`} className="delete-exercise">
                      <AiOutlineClose />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 data-testid="no-entities-h1" className={styles.noEntities}>
            There are no exercises yet
          </h1>
        )}
      </div>
      <button data-testid="add-btn" className="btn-black" onClick={() => goToCreateExercises()}>
        Add
      </button>
    </>
  );
}

export default Exercises;
