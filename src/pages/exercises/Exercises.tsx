import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteExerciseMutation, useGetExercisesQuery } from '../../store/exercise/exercise.api.ts';
import { useAppDispatch } from '../../store/hooks.ts';
import { setExercise, setSubtype } from '../../store/workouts/workouts.slice.ts';
import { ExerciseRequest } from '../../common/types/workouts.ts';
import { AiFillEdit, AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import styles from '../../styles/base.module.css';

function Exercises() {
  const navigate = useNavigate();
  const { type } = useParams();
  const { data, isSuccess } = useGetExercisesQuery({ type: type || '' });
  const [delExercise, { isSuccess: isDeleted }] = useDeleteExerciseMutation();
  const dispatch = useAppDispatch();
  let exercises: ExerciseRequest[] = [];

  if (isSuccess) {
    exercises = data?.data.exercises;
  }

  const addToWorkout = (exercise: ExerciseRequest) => {
    dispatch(setExercise(exercise));
    navigate('/workouts');
  };

  const deleteExercise = async (uuid: string) => {
    await delExercise({ uuid });
    if (isDeleted) {
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
    } else {
      toast('Delete failed!', {
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

  const goToCreateExercises = () => {
    dispatch(setSubtype({ subtype: type || '' }));
    navigate('/exercises');
  };

  return (
    <>
      <p className={styles.p1}>{type}</p>
      <p className={styles.p2}>Exercises</p>
      <div className={styles.mainBox}>
        {exercises?.map((exercise) => (
          <div className={styles.itemBox}>
            <div className={styles.boxItems} onClick={() => addToWorkout(exercise)}>
                <div className={styles.boxContent}>
                    <div className={styles.boxInfo}>
                        <span>{exercise.name}</span>
                    </div>
                    <div className={styles.sideButtonsBox}>
                        <button type="button" onClick={() => navigate(`/exercises/${exercise.uuid || ''}`)}>
                            <AiFillEdit />
                        </button>
                        <button type="button" onClick={() => deleteExercise(exercise.uuid || '')}>
                            <AiOutlineClose />
                        </button>
                </div>
              </div>
            </div>
          </div>
        ))}
          <div className={styles.itemBox}>
              <div
                  className={styles.boxItems}
                  onClick={() =>
                      addToWorkout({
                          uuid: 'fsas234fsa3fs',
                          name: 'distant_time',
                          type: 'fsdfsd',
                          combinationParams: 'distant_time',
                          description: 'ffsdfs',
                          approaches: [],
                      })
                  }
              >
                  <div className={styles.boxContent}>
                      <div className={styles.boxInfo}>
                          <span>name</span>
                      </div>
                      <div className={styles.sideButtonsBox}>
                          <button type="button">
                              <AiFillEdit />
                          </button>
                          <button type="button">
                              <AiOutlineClose />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <button className="btn-black" onClick={() => goToCreateExercises()}>
        Add
      </button>
    </>
  );
}

export default Exercises;
