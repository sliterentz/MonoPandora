import * as Yup from 'yup';

// ** React Imports
import { ChangeEvent, forwardRef, MouseEvent, useState, useCallback, useEffect, useMemo } from 'react'

// ** Next Imports
import { useNavigate } from 'react-router-dom'

import { PATH_DASHBOARD } from '@theme-ui';

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel';
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Switch from '@mui/material/Switch';
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Styled Component
import { UserLayout, fData } from '@theme-ui'
import { Label } from '@theme-ui';

// redux
import { useDispatch } from '../../redux/store';

// ** Import Form Provider
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthContext } from '@theme-ui';
import { FormProvider, RHFTextField, RHFSwitch, RHFUploadAvatar } from '@theme-ui';
import { IUserAccountGeneral } from '@theme-ui'
import { CustomFile } from '@theme-ui';
import { status } from 'nprogress';

interface State {
  password: string
  password2: string
  showPassword: boolean
  showPassword2: boolean
}

interface FormValuesProps extends Omit<IUserAccountGeneral, 'avatarUrl'>  {
    avatarUrl: CustomFile | string | null;
    afterSubmit?: string;
  };

  type Props = {
    isEdit?: boolean;
    currentUser?: IUserAccountGeneral;
  };

const UserAddEditForm = ({ isEdit = false, currentUser }: Props) => {

  const { createUser } = useAuthContext();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // ** States
  // const [passwordValues, setPasswordValues] = useState<State>({
  //   password: '',
  //   password2: '',
  //   showPassword: false,
  //   showPassword2: false
  // })

  const defaultValues = useMemo(
  () => ({
    username: currentUser?.username || '',
    password: currentUser?.password || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    fullname: currentUser?.fullname || '',
    grant: currentUser?.grant || 3,
    isVerified: currentUser?.isVerified || false,
    company: currentUser?.company || '',
    avatarUrl: currentUser?.avatarUrl || 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
    status: currentUser?.status || 1,
    afterSubmit: '',
  }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const AddUserSchema = Yup.object().shape({
    username: Yup.string().required('Username required'),
    password: Yup.string().required('Password is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone: Yup.string().required('Phone is required'),
    fullname: Yup.string().required('Fullname is required'),
    grant: Yup.number().required('Role is required'),
    isVerified: Yup.boolean().required('Verified is required'),
    company: Yup.string().required('Company is required'),
    // avatarUrl: Yup.string().required('Avatar is required').nullable(true),
    status: Yup.number().required('Status is Required'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(AddUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    if (isSubmitSuccessful) {
      navigate('/pages/user');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser,isSubmitSuccessful, dispatch, navigate]);

  // Handle Password
  // const handlePasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
  //   setPasswordValues({ ...passwordValues, [prop]: event.target.value })
  // }
  // const handleClickShowPassword = () => {
  //   setPasswordValues({ ...passwordValues, showPassword: !passwordValues.showPassword })
  // }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Confirm Password
  // const handleConfirmChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
  //   setPasswordValues({ ...passwordValues, [prop]: event.target.value })
  // }
  // const handleClickShowConfirmPassword = () => {
  //   setPasswordValues({ ...passwordValues, showPassword2: !passwordValues.showPassword2 })
  // }
  const handleMouseDownConfirmPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const isSuccess = await createUser(data.username, data.password, data.email, data.phone, data.fullname, data.grant, data.isVerified, data.company, data.avatarUrl, data.status);

      if (isSuccess) {
        navigate(PATH_DASHBOARD.user)
      }
        
      // console.log('DATA', data);
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message,
      });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <>
    <Grid container spacing={6}>
      <Grid item xs={12}>
    <Card>
      <CardHeader title={!isEdit ? 'Create User' : 'Edit User'} titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isEdit && (
              <Label color={(values.status === 2 && 'warning') ||
                       (values.status === 0 && 'error') ||
                       'success'}
                     sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 1}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'disable' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      User Status
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            {/* <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            /> */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
        <Card sx={{ p: 6 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >

              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Account Details
              </Typography>
              <Grid item xs={12} md={4}></Grid>

                <RHFTextField name="username" label='User Name' placeholder='carterLeonard' />
                <RHFTextField name="email" type='email' label='Email' placeholder='carterleonard@gmail.com' />

              <RHFTextField
                name="password"
                label="Password"
                type="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge='end'
                        // onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        <EyeOutline fontSize='small' />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/*<FormControl fullWidth>*/}
              {/*  <InputLabel htmlFor='password'>Password</InputLabel>*/}
              {/*  <OutlinedInput*/}
              {/*    label='Password'*/}
              {/*    value={passwordValues.password}*/}
              {/*    id='password'*/}
              {/*    onChange={handlePasswordChange('password')}*/}
              {/*    type={passwordValues.showPassword ? 'text' : 'password'}*/}
              {/*    endAdornment={*/}
              {/*      <InputAdornment position='end'>*/}
              {/*        <IconButton*/}
              {/*          edge='end'*/}
              {/*          onClick={handleClickShowPassword}*/}
              {/*          onMouseDown={handleMouseDownPassword}*/}
              {/*          aria-label='toggle password visibility'*/}
              {/*        >*/}
              {/*          {passwordValues.showPassword ? <EyeOutline /> : <EyeOffOutline />}*/}
              {/*        </IconButton>*/}
              {/*      </InputAdornment>*/}
              {/*    }*/}
              {/*  />*/}
              {/*</FormControl>*/}

              {/*<FormControl fullWidth>*/}
              {/*  <InputLabel htmlFor='password-2'>Confirm Password</InputLabel>*/}
              {/*  <OutlinedInput*/}
              {/*    value={passwordValues.password2}*/}
              {/*    label='Confirm Password'*/}
              {/*    id='password-2'*/}
              {/*    onChange={handleConfirmChange('password2')}*/}
              {/*    type={passwordValues.showPassword2 ? 'text' : 'password'}*/}
              {/*    endAdornment={*/}
              {/*      <InputAdornment position='end'>*/}
              {/*        <IconButton*/}
              {/*          edge='end'*/}
              {/*          aria-label='toggle password visibility'*/}
              {/*          onClick={handleClickShowConfirmPassword}*/}
              {/*          onMouseDown={handleMouseDownConfirmPassword}*/}
              {/*        >*/}
              {/*          {passwordValues.showPassword2 ? <EyeOutline /> : <EyeOffOutline />}*/}
              {/*        </IconButton>*/}
              {/*      </InputAdornment>*/}
              {/*    }*/}
              {/*  />*/}
              {/*</FormControl>*/}
              
            </Box>

            <Grid item xs={12} md={4}>
              <Divider sx={{ marginTop: 4 }} />
            </Grid>
            
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >

            {/* <Grid item xs={12}> */}
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Personal Info
              </Typography>
            {/* </Grid> */}
            <Grid item xs={12} md={4}></Grid>

                <RHFTextField fullWidth name="fullname" label='Full Name' sx={{ marginBottom: 2 }} placeholder='Leonard Carter' />
                <RHFTextField fullWidth name="phone" label='Phone No.' sx={{ marginBottom: 2 }} placeholder='+62-812-456-8790' />

              <FormControl fullWidth>
                <InputLabel id='role-label'>Role</InputLabel>
                <Select
                  label='Role'
                  name='role'
                  defaultValue='3'
                  id='role'
                  labelId='role-label'
                >
                  <MenuItem value='0'>Super Admin</MenuItem>
                  <MenuItem value='1'>Supervisor</MenuItem>
                  <MenuItem value='2'>Employee</MenuItem>
                  <MenuItem value='3'>Client</MenuItem>
                </Select>
              </FormControl>

              <RHFTextField fullWidth name="company" label='Company' sx={{ marginBottom: 2 }} placeholder='Samsung LTD' />

              <FormControl fullWidth>
                <InputLabel id='status-label'>User Status</InputLabel>
                <Select
                  label='Status'
                  name='status'
                  defaultValue='1'
                  id='status'
                  labelId='status-label'
                >
                  <MenuItem value='0'>Disable</MenuItem>
                  <MenuItem value='1'>Active</MenuItem>
                </Select>
              </FormControl>
            </Box>
        </Card>
        </Grid>

          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
        <Stack alignItems="flex-end" sx={{ mr: 2 }}>
          <LoadingButton size='large' type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Create User' : 'Save Changes'}
          </LoadingButton>
        </Stack>
          {/* <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            Submit
          </Button> */}
          <Button size='large' color='secondary' variant='outlined' href="/pages/user">
            Cancel
          </Button>
        </CardActions>
      </FormProvider>
    </Card>
    </Grid>
    </Grid>
    </>
  )
}

export default UserAddEditForm
