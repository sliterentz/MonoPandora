import * as Yup from 'yup';

// ** React Imports
import { ChangeEvent, MouseEvent, ReactNode, useState } from 'react';

import { Link as RouterLink, useNavigate } from 'react-router-dom';

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import { Link, Typography } from '@mui/material';
import { Stack, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '@mui/material/Snackbar';

// ** Configs
import { themeConfig } from '@theme-ui'

// ** Layout Import
import { BlankLayout } from '@theme-ui'

// ** Snackbar Import
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';

// ** Routes Import
import { PATH_AUTH, PATH_DASHBOARD } from '@theme-ui';

// ** Demo Imports
import FooterIllustrationsV1 from '../../sections/auth/FooterIlustration'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Styled Components
  const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
    [theme.breakpoints.up('sm')]: { width: '28rem' }
  }))

// ** Import Form Provider
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthContext } from '@theme-ui';
import { FormProvider, RHFCodes } from '@theme-ui';

type FormValuesProps = {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
  afterSubmit?: string;
};

// ----------------------------------------------------------------------

const VerifyCodePage = () => {
  const { verify } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required('Code is required'),
    code2: Yup.string().required('Code is required'),
    code3: Yup.string().required('Code is required'),
    code4: Yup.string().required('Code is required'),
    code5: Yup.string().required('Code is required'),
    code6: Yup.string().required('Code is required'),
  });

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (verify) {
        await verify(data.code1, data.code2, data.code3, data.code4, data.code5, data.code6);
      }
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // console.log('DATA', Object.values(data).join(''));
      enqueueSnackbar('Verify success!');
      navigate(PATH_DASHBOARD.root);
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message,
      });
    }
  };

  return (
    <Box className='content-center'>
    <Card>
    <CardHeader title='Please check your email!' titleTypographyProps={{ variant: 'h6' }} />
    <Divider sx={{ margin: 0 }} />
      <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
      <Grid container spacing={5}>
        <Grid item xs={12}>

        <Box sx={{ mb: 12 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5 }}>
            We have emailed a 6-digit confirmation code to acb@domain, please enter the code in below box to verify your email.
          </Typography>
        </Box>
        </Grid>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <RHFCodes keyName="code" inputs={['code1', 'code2', 'code3', 'code4', 'code5', 'code6']} />

        {(!!errors.code1 ||
          !!errors.code2 ||
          !!errors.code3 ||
          !!errors.code4 ||
          !!errors.code5 ||
          !!errors.code6) && (
          <FormHelperText error sx={{ px: 2 }}>
            Code is required
          </FormHelperText>
        )}

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ mt: 3 }}
        >
          Verify
        </LoadingButton>
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="body2" sx={{ my: 3 }}>
        Don’t have a code? &nbsp;
        <Link variant="subtitle2">Resend code</Link>
      </Typography>

      <Link
        component={RouterLink}
        to={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <EyeOutline sx={{ color: '#db4437' }} />
                  Return to sign in
        </IconButton>
      </Link>
      </Box>
      </FormProvider>
      </Grid>
      </CardContent>
      </Card>
      <FooterIllustrationsV1 />
      </Box>
  );
}

export default VerifyCodePage
