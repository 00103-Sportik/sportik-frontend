import { Input } from '../../common/components/input/Input.tsx';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  ProfileFields,
  profileInitialValues,
  profileValidationSchema,
} from '../../common/validations/profileValidationSchema.ts';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/profile/profile.api.ts';
import logo from '../../assets/avatar.jpg';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setProfile, updateAvatar } from '../../store/profile/profile.slice.ts';
import { AvatarUpdate, ProfileRequest } from '../../common/types/profile.ts';
import { selectAvatar } from '../../store/profile/profile.selectors.ts';
import { Dialog, DialogDismiss } from '@ariakit/react';
import { produce } from 'immer';
import { toast } from 'react-toastify';
import styles from '../../styles/base.module.css';
import styles2 from './Profile.module.css';

function Profile() {
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState(true);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(true);
  const [open2, setOpen2] = useState(false);
  const [updateProfile, { isSuccess: isSuccessUpdate, error }] = useUpdateProfileMutation();
  const { data, isSuccess, refetch } = useGetProfileQuery();
  const dispatch = useAppDispatch();
  const avatar = useAppSelector(selectAvatar);
  const [fields, setFields] = useState<ProfileFields>({
    email: '',
    name: '',
    surname: '',
    sex: '',
    age: '',
    height: '',
    weight: '',
    image: '',
  });

  if (isSuccess && check) {
    setCheck(false);
    setFields({
      email: data?.data.email || '',
      name: data?.data.name || '',
      surname: data?.data.surname || '',
      sex: data?.data.sex || '',
      age: data?.data.age !== null ? String(data?.data.age) : '',
      height: data?.data.height !== null ? String(data?.data.height) : '',
      weight: data?.data.weight !== null ? String(data?.data.weight) : '',
      image: data?.data.image || '',
    });
  }

  useEffect(() => {
    dispatch(setProfile(fields));
  }, [fields]);

  const getValuesToUpdate = (values: ProfileFields) => {
    console.log(values);
    console.log(data);
    console.log(fields);
    const tempValues: ProfileRequest = { email: values.email };
    if (values.name) {
      tempValues.name = values.name;
    }
    if (values.surname) {
      tempValues.surname = values.surname;
    }
    if (values.sex) {
      tempValues.sex = values.sex;
    }
    if (values.age) {
      tempValues.age = Number(values.age);
    }
    if (values.height) {
      tempValues.height = Number(values.height);
    }
    if (values.weight) {
      tempValues.weight = Number(values.weight);
    }
    if (values.image) {
      tempValues.image = fields.image;
    }
    return tempValues;
  };

  if (isSuccessUpdate && check2) {
    toast('Profile updated successfully!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    setCheck2(false);
  }

  if (error && check3) {
    toast('message' in error ? error && error.message : 'Profile update failed!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    setCheck3(false);
  }

  const onSubmit = async (values: ProfileFields) => {
    const valuesToUpdate = getValuesToUpdate(values);
    await updateProfile(valuesToUpdate);
    setOpen(false);
    setCheck2(true);
  };

  const discard = async () => {
    await refetch();
    setCheck(true);
    setOpen2(false);
    toast('Updates have been canceled!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  const changeField = useCallback((field: keyof ProfileFields, value: string) => {
    setFields(
      produce((draft) => {
        draft[field] = value;
      }),
    );
  }, []);

  const convertBase64 = ({ file }: { file: any }) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve((fileReader.result as string).split('base64,')[1]);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  async function changeAvatar(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const file = (target.files as FileList)[0];
    const base64 = (await convertBase64({ file: file })) as string;
    setFields({ ...fields, image: base64 });
    dispatch(updateAvatar({ image: base64 } as AvatarUpdate));
  }

  return (
    <>

      <h1 className={styles.h1}>Profile</h1>
      <div className="@apply flex flex-row">
        <Formik initialValues={profileInitialValues} onSubmit={onSubmit} validationSchema={profileValidationSchema}>
          {(props) => {
            return (
              <Form>
                <Field name="email">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      autoComplete="email"
                      disabled={true}
                      type="text"
                      {...field}
                      value={fields.email}
                      placeholder="Email"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                    />
                  )}
                </Field>
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
                    />
                  )}
                </Field>
                <Field name="surname">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      type="text"
                      {...field}
                      value={fields.surname}
                      onChange={(event) => {
                        props.handleChange(event);
                        changeField('surname', event.target.value);
                      }}
                      placeholder="Surname"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                    />
                  )}
                </Field>
                <Field name="age">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      type="text"
                      {...field}
                      value={fields.age}
                      onChange={(event) => {
                        props.handleChange(event);
                        changeField('age', event.target.value);
                      }}
                      placeholder="Age"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                    />
                  )}
                </Field>
                <div className="select-container">
                  <select
                    className="select-box"
                    onChange={(event) => {
                      props.handleChange(event);
                      changeField('sex', event.target.value);
                    }}
                  >
                    <option value="" selected={fields.sex === ''} disabled hidden>
                      Sex
                    </option>
                    <option value="male" selected={fields.sex === 'male'}>
                      male
                    </option>
                    <option value="female" selected={fields.sex === 'female'}>
                      female
                    </option>
                  </select>
                </div>
                <Field name="height">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      type="text"
                      {...field}
                      value={fields.height}
                      onChange={(event) => {
                        props.handleChange(event);
                        changeField('height', event.target.value);
                      }}
                      placeholder="Height"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                    />
                  )}
                </Field>
                <Field name="weight">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      type="text"
                      {...field}
                      value={fields.weight}
                      onChange={(event) => {
                        props.handleChange(event);
                        changeField('weight', event.target.value);
                      }}
                      placeholder="Weight"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                    />
                  )}
                </Field>
                <Dialog
                  open={open2}
                  onClose={() => setOpen2(false)}
                  getPersistentElements={() => document.querySelectorAll('.Toastify')}
                  backdrop={<div className="backdrop" />}
                  className="dialog"
                >
                  <p className={styles.p}>Discard changes?</p>
                  <div className="flex gap-[10px]">
                    <button className="btn-red" onClick={discard}>
                      Yes
                    </button>
                    <DialogDismiss className="btn-black">No</DialogDismiss>
                  </div>
                </Dialog>
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  getPersistentElements={() => document.querySelectorAll('.Toastify')}
                  backdrop={<div className="backdrop" />}
                  className="dialog"
                >
                  <p className={styles.p}>Save changes?</p>
                  <div className="flex gap-[10px]">
                    <button className="btn-red" onClick={() => onSubmit(fields)}>
                      Yes
                    </button>
                    <DialogDismiss className="btn-black">No</DialogDismiss>
                  </div>
                </Dialog>
              </Form>
            );
          }}
        </Formik>
        <div>
          <img
            className={styles2.img}
            width={100}
            height={100}
            src={!avatar ? logo : `data:image/*;base64,${avatar}`}
            alt="avatar"
          />
          <label className="@apply btn-black w-[100px] cursor-pointer my-4">
            <input className="@apply hidden" onChange={changeAvatar} type="file" />
            <span>Upload avatar</span>
          </label>
        </div>
      </div>
      <div className="flex gap-[70px]">
        <button className="btn-black" onClick={() => setOpen(true)}>
          Save
        </button>
        <button className="btn-red" onClick={() => setOpen2(true)}>
          Discard
        </button>
      </div>
    </>
  );
}

export default Profile;
