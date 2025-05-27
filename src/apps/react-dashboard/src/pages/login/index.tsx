import * as Yup from 'yup';

// ** React Imports
import { ChangeEvent, MouseEvent, ReactNode, useState, useEffect } from 'react'

// ** React DOM Imports
import { useNavigate, Link } from 'react-router-dom'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { LoadingButton } from '@mui/lab'
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
import { fetchUserData } from '../../redux/slices/authThunk';

// ** Configs
import { themeConfig } from '@theme-ui'

// ** Layout Import
import { BlankLayout } from '@theme-ui'

// ** Demo Imports
import FooterIllustrationsV1 from '../../sections/auth/FooterIlustration'

interface State {
  password: string
  showPassword: boolean
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
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

// ** Import Form Provider
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthContext } from '@theme-ui';
import { FormProvider, RHFTextField } from '@theme-ui';

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
};

const LoginPage = () => {
  const { login } = useAuthContext();

  const dispatch = useDispatch();

  // ** State
  // const [values, setValues] = useState<State>({
  //   password: '',
  //   showPassword: false
  // })

  // ** Hook
  const theme = useTheme()
  const navigate = useNavigate()

  // const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
  //   setValues({ ...values, [prop]: event.target.value })
  // }

  // const handleClickShowPassword = () => {
  //   setValues({ ...values, showPassword: !values.showPassword })
  // }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const values = watch();

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      reset();
      setError('afterSubmit', {
        ...error,
        message: 'Invalid email or password',
      });
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      dispatch(fetchUserData());
      navigate('/dashboard');
    }
  }, [isSubmitSuccessful, dispatch, navigate]);

  return (
    <BlankLayout>
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
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
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

            <RHFTextField name="email" autoFocus fullWidth id='email' label='Email' sx={{ marginBottom: 4 }} />
            <RHFTextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                    </IconButton>
                  </InputAdornment>
                  ),
                }}/>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <FormControlLabel control={<Checkbox />} label='Remember Me' />
                <LinkStyled to='/' onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
            </Box>
            <LoadingButton
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              loading={isSubmitSuccessful || isSubmitting}
              sx={{ marginBottom: 7 }}
            >
              Login
            </LoadingButton>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2'>
                  <LinkStyled to='/pages/register' reloadDocument>Create an account</LinkStyled>
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
          </FormProvider>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
    </BlankLayout>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
