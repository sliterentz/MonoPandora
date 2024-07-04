import * as Yup from 'yup';
import { useParams } from 'react-router-dom';

// ** React Imports
import { ChangeEvent, forwardRef, MouseEvent, useState, useCallback, useEffect, useMemo } from 'react'

// ** Next Imports
import { useNavigate } from 'react-router-dom'

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
import { UserLayout, fData, PATH_DASHBOARD } from '@theme-ui'
import { Label } from '@theme-ui';

// redux
import { useDispatch } from '../../redux/store';

// ** Import Form Provider
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthContext } from '@theme-ui';
import { FormProvider, RHFTextField, RHFSwitch, RHFUploadAvatar } from '@theme-ui';
import { IPermissionGeneral } from '@theme-ui'
import { status } from 'nprogress';

interface FormValuesProps {
    permissionName: string;
    description: string;
    status: number;
    afterSubmit?: string;
  };

  type Props = {
    isEdit?: boolean;
    currentPermission?: IPermissionGeneral;
  };

const PermissionAddEditForm = ({ isEdit = false, currentPermission }: Props) => {
  const { id } = useParams();

  const { createPermission, updatePermission } = useAuthContext();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const defaultValues = useMemo(
  () => ({
    permissionName: currentPermission?.permissionName || '',
    description: currentPermission?.description || '',
    status: currentPermission?.status || 1,
    afterSubmit: '',
  }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPermission]
  );

  const AddUserSchema = Yup.object().shape({
    permissionName: Yup.string().required('Username required'),
    description: Yup.string().required('Description required'),
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
    if (isEdit && currentPermission) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    if (isSubmitSuccessful) {
      navigate('/pages/permission');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPermission,isSubmitSuccessful, dispatch, navigate]);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleMouseDownConfirmPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const onSubmit = async (data: FormValuesProps) => {
    try {

      let isSuccess = null;
      if(!isEdit) {
        isSuccess = await createPermission(data.permissionName, data.description, data.status);
        
        if (!isSuccess) {
          setError('afterSubmit', {
          message: 'Failed Add Permission',
        });
      }
    }

    isSuccess = await updatePermission(id, data.permissionName, data.description, data.status);

    if (!isSuccess) {
      setError('afterSubmit', {
        message: 'Failed Edit Permission',
      });
    }

    navigate(PATH_DASHBOARD.permission.root)
        
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

  return (
    <>
    <Grid container spacing={6}>
      <Grid item xs={12}>
    <Card>
      <CardHeader title={!isEdit ? 'Create Permission' : 'Edit Permission'} titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {!isEdit && (
              <Label color={(values.status === 2 && 'warning') ||
                       (values.status === 0 && 'error') ||
                       'success'}
                     sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

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
                      Permission Status
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable permission
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

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
                1. Permission Details
              </Typography>
              <Grid item xs={12} md={4}></Grid>

                <RHFTextField name="permissionName" label='Permission Name' placeholder='user.users.read' />
                <RHFTextField name="description" label='Description' placeholder='Permission detail' />
                <FormControl fullWidth>
                <InputLabel id='status-label'>Permission Status</InputLabel>
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
            {!isEdit ? 'Create Permission' : 'Save Changes'}
          </LoadingButton>
        </Stack>
          {/* <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            Submit
          </Button> */}
          <Button size='large' color='secondary' variant='outlined' href="/pages/permission">
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

export default PermissionAddEditForm
