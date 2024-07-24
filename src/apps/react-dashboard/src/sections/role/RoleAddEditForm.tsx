import * as Yup from 'yup';
import { useParams } from 'react-router-dom';

// ** React Imports
import { MouseEvent, useState, useEffect, useMemo } from 'react'

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
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { fetchPermissionsData } from '../../redux/slices/permissionThunk';

// ** Import Form Provider
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthContext } from '@theme-ui';
import { FormProvider, RHFTextField } from '@theme-ui';
import { IRoleGeneral, PATH_DASHBOARD } from '@theme-ui'
import { status } from 'nprogress';

import { useTable, TablePaginationCustom, TableSelectedAction, TableHeadCustom, TableEmptyRows, TableNoData, getComparator, emptyRows } from '@theme-ui'

import PermissionTableRow from '../../sections/role/PermissionTableRow'
import PermissionTableToolbar from './PermissionTableToolbar';

interface FormValuesProps {
    roleName: string;
    permissionIds: number[];
    permissions: number[];
    status: number;
    afterSubmit?: string;
  };

  type Props = {
    isEdit?: boolean;
    currentRole?: IRoleGeneral;
  };

  import { IPermissionGeneral } from '@theme-ui'

  const TABLE_HEAD = [
    { id: 'id', label: 'ID', align: 'left' },
    { id: 'permissionName', label: 'Name', align: 'left' },
    { id: 'description', label: 'Description', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
  ];

const RoleAddEditForm = ({ isEdit = false, currentRole }: Props) => {
  const { id } = useParams();

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

  const { createRole, updateRole } = useAuthContext();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState(10);

  const [tableData, setTableData] = useState<IPermissionGeneral[]>([]);

  const { permissions, isLoading } = useSelector((state) => state.permission);

  const defaultValues = useMemo(
  () => ({
    roleName: currentRole?.roleName || '',
    permissionIds: currentRole?.permissionIds || [],
    permissions: currentRole?.permissionIds || [],
    status: currentRole?.status || 1,
    afterSubmit: '',
  }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRole]
  );

  const AddUserSchema = Yup.object().shape({
    roleName: Yup.string().required('Rolename required'),
    permissionIds: Yup.array().required('Permission is required'),
    permissions: Yup.array().required('Permission is required'),
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
    dispatch(fetchPermissionsData());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && currentRole) {
      // const tempIds = permissions.map(permission => permission.id);
      // console.log(selected);
      // setPermissionIds(selected);
      setSelected(values.permissionIds);
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    if (isSubmitSuccessful) {
      navigate('/pages/role');
    }
    if (permissions.length) {
      setTableData(permissions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentRole, permissions, isSubmitSuccessful, navigate]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      let isSuccess = null;
      if(!isEdit) {
        isSuccess = await createRole(data.roleName, selected, data.status);

      if (!isSuccess) {
        setError('afterSubmit', {
          message: 'Failed Add Role',
        });
      }
    }
    
    isSuccess = await updateRole(id, data.roleName, selected, data.status);

    if (!isSuccess) {
      setError('afterSubmit', {
        message: 'Failed Edit Role',
      });
    }

    navigate(PATH_DASHBOARD.role.root)
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

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus(10);
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
      <CardHeader title={!isEdit ? 'Create Role' : 'Edit Role'} titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <CardContent>
          <Grid container spacing={5}>

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
                1. Role Details
              </Typography>
              <Grid item xs={12} md={4}></Grid>

                <RHFTextField name="roleName" label='Role Name' placeholder='Staff' />
                <FormControl fullWidth>
                <InputLabel id='status-label'>Role Status</InputLabel>
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
          <Grid item xs={12}>
            <Card>

            <PermissionTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            // filterRole={filterRole}
            // optionsRole={ROLE_OPTIONS}
            onFilterName={handleFilterName}
            // onFilterRole={handleFilterRole}
            onResetFilter={handleResetFilter}
          />

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
                      <PermissionTableRow
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
        </CardContent>

        <Divider sx={{ margin: 0 }} />
        <CardActions>
        <Stack alignItems="flex-end" sx={{ mr: 2 }}>
          <LoadingButton size='large' type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Create Role' : 'Save Changes'}
          </LoadingButton>
        </Stack>
          {/* <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            Submit
          </Button> */}
          <Button size='large' color='secondary' variant='outlined' href="/pages/role">
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
  inputData: IPermissionGeneral[];
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
      (permission) => permission.permissionName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 10) {
    inputData = inputData.filter((permission) => permission.status === filterStatus);
  }

  return inputData;
}

export default RoleAddEditForm
