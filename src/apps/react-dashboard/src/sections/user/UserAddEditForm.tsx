import * as Yup from 'yup';
import { useParams } from 'react-router-dom';

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
import Switch from '@mui/material/Switch'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { fetchRolesData } from '../../redux/slices/roleThunk';

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Styled Component
import { UserLayout, fData } from '@theme-ui'
import { Label } from '@theme-ui';

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

import { useTable, TablePaginationCustom, TableSelectedAction, TableHeadCustom, TableEmptyRows, TableNoData, getComparator, emptyRows } from '@theme-ui'

import RoleTableRow from '../../sections/user/RoleTableRow'

interface FormValuesProps extends Omit<IUserAccountGeneral, 'avatarUrl'>  {
    avatarUrl: CustomFile | string | null;
    afterSubmit?: string;
  };

  type Props = {
    isEdit?: boolean;
    currentUser?: IUserAccountGeneral;
  };

  import { IRoleGeneral } from '@theme-ui'

  const TABLE_HEAD = [
    { id: 'id', label: 'ID', align: 'left' },
    { id: 'roleName', label: 'Name', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
  ];

const UserAddEditForm = ({ isEdit = false, currentUser }: Props) => {
  const { id = '' } = useParams<{ id: string }>();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { createUser, updateUser } = useAuthContext();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // const [roleIds, setRoleIds] = useState<number[]>([]);
  // const [roles, setRoles] = useState<number[]>([]);

  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState(10);

  const [tableData, setTableData] = useState<IRoleGeneral[]>([]);

  const { roles, isLoading } = useSelector((state) => state.role);

  const GRANT_OPTIONS = [
    { value: 1, label: 'Super Admin' },
    { value: 2, label: 'Supervisor' },
    { value: 3, label: 'Employee' },
    { value: 4, label: 'Client' }
  ];

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
    isSuperUser: currentUser?.isSuperUser || false,
    isVerified: currentUser?.isVerified || false,
    company: currentUser?.company || '',
    avatarUrl: currentUser?.avatarUrl || 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
    roleIds: currentUser?.roleIds || [], 
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
    isSuperUser: Yup.boolean().required('Grant is required'),
    isVerified: Yup.boolean().required('Verified is required'),
    company: Yup.string().required('Company is required'),
    // avatarUrl: Yup.string().required('Avatar is required').nullable(true),
    roleIds: Yup.array().required('Roles is required'),
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
    dispatch(fetchRolesData());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && currentUser) {
      // setRoleIds(roleIds);
      // setRoles(roleIds);
      setSelected(values.roleIds);
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    if (isSubmitSuccessful) {
      navigate('/pages/user');
    }
    if (roles.length) {
      setTableData(roles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser, isSubmitSuccessful, dispatch, navigate]);

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

  // const handleChange = (event: SelectChangeEvent<typeof roleIds>) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setRoleIds(
  //     // On autofill we get a stringified value.
  //     typeof value === 'string' ? value.split(',').map(Number) : value,
  //   );
  //   setRoles(
  //     // On autofill we get a stringified value.
  //     typeof value === 'string' ? value.split(',').map(Number) : value,
  //   );
  // };

  const onSubmit = async (data: FormValuesProps) => {
    try {

    if(!isEdit) {
      const isSuccess = await createUser( data.fullname, data.email, data.phone, data.username, data.password, data.isSuperUser, data.isVerified, data.company, data.avatarUrl, data.status);
      
      if (isSuccess) {
        navigate(PATH_DASHBOARD.user.root)
      }
    }

    const isSuccess = await updateUser( id, data.fullname, data.email, data.phone, data.username, data.isSuperUser, data.isVerified, data.company, data.avatarUrl, selected, data.status);
      
    if (isSuccess) {
      navigate(PATH_DASHBOARD.user.root)
    }

      // console.log('DATA', data);
    } catch (error) {
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

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterStatus !== 10;

  const isNotFound =
  (!dataFiltered.length && !!filterName) ||
  (!dataFiltered.length && !!filterStatus);

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
                    name="isSuperUser"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== false}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? true : false)
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Is Super User
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply for Super User Account
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

              {/* <FormControl fullWidth>
                <InputLabel id='role-label'>Role</InputLabel>
                <Select
                  label='Roles'
                  name='roleIds'
                  defaultValue={roleIds}
                  multiple
                  id='roleIds'
                  labelId='role-label'
                  onChange={handleChange}
                  renderValue={(selected) => 
                    GRANT_OPTIONS.filter(option => selected.includes(option.value))
                      .map(option => option.label).join(', ')
                  }
                >
                  { GRANT_OPTIONS.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    <Checkbox checked={roleIds.includes(role.value)} />
                    <ListItemText primary={role.label} />
                  </MenuItem>
                ))}
                </Select>
              </FormControl> */}

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

        <Grid item xs={12}>
            <Card>

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
            />
            <Table size={52 ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <RoleTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            // onChangeDense={onChangeDense}
          />
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

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
}: {
  inputData: IRoleGeneral[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: number;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (role) => role.roleName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 10) {
    inputData = inputData.filter((role) => role.status === filterStatus);
  }

  return inputData;
}

export default UserAddEditForm
