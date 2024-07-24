import * as Yup from 'yup';

// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode, useEffect } from 'react'

// ** Next Imports
import { useNavigate, Link } from 'react-router-dom'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { LoadingButton } from '@mui/lab';
import { Logo } from '@theme-ui';

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// redux
import { useDispatch } from '../../redux/store';

// ** Configs
import { themeConfig } from '@theme-ui'

// ** Layout Import
import { BlankLayout } from '@theme-ui'

// ** Demo Imports
import FooterIllustrationsV1 from '../../sections/auth/FooterIlustration'

// ** Import Form Provider
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthContext, IResponse } from '@theme-ui';
import { FormProvider, RHFTextField } from '@theme-ui';
import { count } from 'console';

interface State {
  password: string
  showPassword: boolean
  passwordConfirm: string
  showPasswordConfirm: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

type FormValuesProps = {
  fullname: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  passwordConfirm: string;
  afterSubmit?: string;
};

const RegisterPage = () => {
  const { register } = useAuthContext()

  const dispatch = useDispatch();

  // ** States
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false,
    passwordConfirm: '',
    showPasswordConfirm: false
  })

  // ** Hook
  const theme = useTheme()
  const navigate = useNavigate()

  // Handle Password
  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Confirm Password
  const handleConfirmChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showPasswordConfirm: !values.showPasswordConfirm })
  }
  const handleMouseDownConfirmPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const RegisterSchema = Yup.object().shape({
    fullname: Yup.string().required('Full name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone: Yup.string().required('Phone is required'),
    username: Yup.string().required('Username required'),
    password: Yup.string().required('Password is required'),
    passwordConfirm: Yup.string().required('Password confirmation is required'),
  });

  const defaultValues = {
    fullname: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    passwordConfirm: '',
    afterSubmit: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const afterSubmitError = watch('afterSubmit');

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const isSuccess: IResponse = await register(data.fullname, data.email, data.phone, data.username, data.password)

        const { code, message } = isSuccess;
  
        if (!isSubmitSuccessful && code !== 200) {
          setError('afterSubmit', {
            message: message,
          });
        }

    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message,
      });
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      navigate('/pages/verify');
    }
  }, [isSubmitSuccessful, afterSubmitError, dispatch, navigate]);

  return (
    <BlankLayout>
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(2, 2, 2)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Logo></Logo>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Adventure starts here 🚀
            </Typography>
            <Typography variant='body2'>Make your project management easy and fun!</Typography>
          </Box>
          <Divider sx={{ margin: 0 }} />
          
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 6 }}>
                <Box
                  rowGap={2}
                  columnGap={4}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}>
                      <RHFTextField name="fullname" label="Full name" sx={{ marginBottom: 2 }} />
                      <RHFTextField name="email" label="Email address" sx={{ marginBottom: 2 }} />
                      <RHFTextField fullWidth name="phone" label='Phone No.' sx={{ marginBottom: 2 }} placeholder='+62-812-456-8790' />
                      <RHFTextField name="username" label='User Name' sx={{ marginBottom: 2 }} placeholder='carterLeonard' />
                
                      <RHFTextField
                      name="password"
                      label="Password"
                      sx={{ marginBottom: 4 }} 
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} onMouseDown={handleMouseDownPassword} edge="end">
                            {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                          </IconButton>
                        </InputAdornment>
                        ),
                    }}/>
                    
                    <RHFTextField
                      name="passwordConfirm"
                      label="Confirm Password"
                      type={showPasswordConfirm ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} edge="end">
                              {values.showPasswordConfirm ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                            </IconButton>
                          </InputAdornment>
                        ),
                    }}/>
                
                </Box>
              </Card>
            </Grid>

            <FormControlLabel
            sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
              control={<Checkbox />}
              label={
                <Fragment>
                  <span>I agree to </span>
                    <LinkStyled to='/' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                      privacy policy & terms
                    </LinkStyled>
                </Fragment>
              }
            />

            <LoadingButton
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              loading={isSubmitSuccessful || isSubmitting}
              sx={{ marginBottom: 7 }}
            >
              Sign Up
            </LoadingButton>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Already have an account?
              </Typography>
              <Typography variant='body2'>
                  <LinkStyled to='/pages/login' reloadDocument>Sign in instead</LinkStyled>
              </Typography>
            </Box>
            <Divider sx={{ my: 5 }}>or</Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link to='/' reloadDocument>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Facebook sx={{ color: '#497ce2' }} />
                </IconButton>
              </Link>
              <Link to='/' reloadDocument>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Twitter sx={{ color: '#1da1f2' }} />
                </IconButton>
              </Link>
              <Link to='/' reloadDocument>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Github
                    sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }}
                  />
                </IconButton>
              </Link>
              <Link to='/' reloadDocument>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Google sx={{ color: '#db4437' }} />
                </IconButton>
              </Link>
            </Box>
          {/* </form> */}
          </FormProvider>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  </BlankLayout>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
