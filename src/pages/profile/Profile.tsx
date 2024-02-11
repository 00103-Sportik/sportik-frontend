import { Input } from '../../common/components/input/Input.tsx';
import { useFormik } from 'formik';
import {
  ProfileFields,
  profileInitialValues,
  profileValidationSchema,
} from '../../common/validations/profileValidationSchema.ts';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/profile/profile.api.ts';
import logo from '../../assets/avatar.jpg';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setProfile, updateAvatar } from '../../store/profile/profile.slice.ts';
import { AvatarUpdate, ProfileRequest } from '../../common/types/profile.ts';
import { selectAvatar } from '../../store/profile/profile.selectors.ts';
import { Dialog, DialogDismiss } from '@ariakit/react';
import { toast } from 'react-toastify';
import styles from '../../styles/base.module.css';
import styles2 from './Profile.module.css';

function Profile() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [updateProfile, { isSuccess: isSuccessUpdate, error: errorUpdate, isError: isErrorUpdate }] =
    useUpdateProfileMutation();
  const { data, isFetching, refetch } = useGetProfileQuery();
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

  const onSubmit = async (values: ProfileFields) => {
    const valuesToUpdate = getValuesToUpdate(values);
    await updateProfile(valuesToUpdate);
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: profileInitialValues,
    onSubmit,
    validationSchema: profileValidationSchema,
  });

  useEffect(() => {
    if (!isFetching && data) {
      setFields({
        email: data?.data.email || '',
        name: data?.data.name || '',
        surname: data?.data.surname || '',
        sex: data?.data.sex || '',
        age: data?.data.age !== null ? String(data?.data.age) : '',
        height:
          data?.data.height !== null && data?.data.height !== undefined
            ? data?.data.height < 10
              ? '0' + String(data?.data.height)
              : String(data?.data.height)
            : '',
        weight: data?.data.weight !== null ? String(data?.data.weight) : '',
        image: data?.data.image || '',
      });
    }
  }, [isFetching, data]);

  useEffect(() => {
    dispatch(setProfile(fields));
    formik.setValues(fields);
  }, [fields]);

  const getValuesToUpdate = (values: ProfileFields) => {
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

  const discard = async () => {
    await refetch();
    setOpen2(false);
    toast('Updates cancelled!', {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  const convertBase64 = (file: Blob) => {
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
    console.log(file);
    if (file.type.split('/')[0] != 'image') {
      toast('Error! This is not an image!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else {
      const base64 = (await convertBase64(file)) as string;
      setFields({ ...fields, image: base64 });
      dispatch(updateAvatar({ image: base64 } as AvatarUpdate));
    }
  }

  return (
    <>
      <h1 className={styles.h1}>Profile</h1>
      <div className="@apply flex flex-row">
        <form id="profile-form" onSubmit={formik.handleSubmit}>
          <Input
            testid="email"
            autoComplete="email"
            disabled={true}
            type="text"
            {...formik.getFieldProps('email')}
            error={formik.getFieldMeta('email').touched && !!formik.getFieldMeta('email').error}
            errorText={formik.getFieldMeta('email').error}
            placeholder="Email"
          />
          <Input
            testid="name"
            type="text"
            {...formik.getFieldProps('name')}
            error={formik.getFieldMeta('name').touched && !!formik.getFieldMeta('name').error}
            errorText={formik.getFieldMeta('name').error}
            placeholder="Name"
          />
          <Input
            testid="surname"
            type="text"
            {...formik.getFieldProps('surname')}
            error={formik.getFieldMeta('surname').touched && !!formik.getFieldMeta('surname').error}
            errorText={formik.getFieldMeta('surname').error}
            placeholder="Surname"
          />
          <Input
            testid="age"
            type="text"
            {...formik.getFieldProps('age')}
            error={formik.getFieldMeta('age').touched && !!formik.getFieldMeta('age').error}
            errorText={formik.getFieldMeta('age').error}
            placeholder="Age"
          />
          <div className="select-container">
            <select
              data-testid="sex-select"
              className="select-box"
              value={formik.values.sex}
              onChange={(sex) => formik.setFieldValue('sex', sex.target.value)}
            >
              <option value="" selected={formik.values.sex === ''} disabled hidden className="select-option">
                Sex
              </option>
              <option value="male" selected={formik.values.sex === 'male'} className="select-option">
                male
              </option>
              <option value="female" selected={formik.values.sex === 'female'} className="select-option">
                female
              </option>
            </select>
          </div>
          <Input
            testid="height"
            type="text"
            {...formik.getFieldProps('height')}
            error={formik.getFieldMeta('height').touched && !!formik.getFieldMeta('height').error}
            errorText={formik.getFieldMeta('height').error}
            placeholder="Height"
          />
          <Input
            testid="weight"
            type="text"
            {...formik.getFieldProps('weight')}
            error={formik.getFieldMeta('weight').touched && !!formik.getFieldMeta('weight').error}
            errorText={formik.getFieldMeta('weight').error}
            placeholder="Weight"
          />
          <Dialog
            data-testid="discard-dialog"
            open={open2}
            onClose={() => setOpen2(false)}
            getPersistentElements={() => document.querySelectorAll('.Toastify')}
            backdrop={<div className="backdrop" />}
            className="dialog"
          >
            <p className={styles.p}>Discard changes?</p>
            <div className="flex gap-[10px]">
              <button data-testid="discard-dialog-btn" className="btn-red" onClick={discard}>
                Yes
              </button>
              <DialogDismiss data-testid="not-discard-dialog-btn" className="btn-black">
                No
              </DialogDismiss>
            </div>
          </Dialog>
          <Dialog
            data-testid="saving-dialog"
            open={open}
            onClose={() => setOpen(false)}
            getPersistentElements={() => document.querySelectorAll('.Toastify')}
            backdrop={<div className="backdrop" />}
            className="dialog"
          >
            <p className={styles.p}>Save changes?</p>
            <div className="flex gap-[10px]">
              <button data-testid="saving-dialog-btn" className="btn-red" type="submit" form="profile-form">
                Yes
              </button>
              <DialogDismiss data-testid="not-saving-dialog-btn" className="btn-black">
                No
              </DialogDismiss>
            </div>
          </Dialog>
        </form>
        <div>
          <img
            data-testid="avatar-img"
            className={styles2.img}
            width={100}
            height={100}
            src={!avatar ? logo : `data:image/*;base64,${avatar}`}
            alt="avatar"
          />
          <label className="@apply btn-black w-[100px] cursor-pointer my-4">
            <input data-testid="avatar-input" className="@apply hidden" onChange={changeAvatar} type="file" />
            <span>Upload avatar</span>
          </label>
        </div>
      </div>
      <div className="flex gap-[70px]">
        <button
          data-testid="saving-btn"
          className="btn-black"
          onClick={() => {
            if (!formik.isValid && !!formik.submitCount) {
            } else {
              setOpen(true);
            }
          }}
        >
          Save
        </button>
        <button data-testid="discard-btn" className="btn-red" onClick={() => setOpen2(true)}>
          Discard
        </button>
      </div>
    </>
  );
}

export default Profile;
