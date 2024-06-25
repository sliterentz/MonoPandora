import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import sumBy from 'lodash/sumBy'

// ** MUI Imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import ScrollBar from 'react-perfect-scrollbar'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card'
import { Tabs, Tab } from '@mui/material'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'

// import { cyan, purple } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';

import TablePagination from '@mui/material/TablePagination'
import CardHeader from '@mui/material/CardHeader'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'

// ** Custom Components Imports
import { Label } from '@theme-ui';
import { CardStatisticsVerticalComponent } from '@theme-ui'

// ** Styled Component Import
import { ApexChartWrapper } from '@theme-ui'
import { UserLayout } from '@theme-ui'

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { fetchUsersData } from '../../redux/slices/userThunk';

import { PATH_DASHBOARD } from '@theme-ui'

import { useTable, TablePaginationCustom, TableSelectedAction, TableHeadCustom, TableEmptyRows, TableNoData, getComparator, emptyRows } from '@theme-ui'

import UserTableRow from './UserTableRow'

// ** Import _mock Data
// import { _userList } from '../../_mock/arrays'

import { IUserAccountGeneral } from '@theme-ui'

// const STATUS_OPTIONS = ['all', 'active', 'banned'];

import UserStatusAnalytic from '../../sections/user/UserStatusAnalytic'
import UserVerifyStatusAnalytic from '../../sections/user/UserVerifyStatusAnalytic'

const TABLE_HEAD = [
  { id: 'fullname', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'grant', label: 'Role', align: 'left' },
  { id: 'isVerified', label: 'Verified', align: 'center' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

const UserPage = () => {
  const theme = useTheme();

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

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { users, isLoading } = useSelector((state) => state.user);

    const [tableData, setTableData] = useState<IUserAccountGeneral[]>([]);

    const [filterName, setFilterName] = useState('');

    const [filterRole, setFilterRole] = useState(3);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [filterIsVerified, setFilterIsVerified] = useState<boolean | null>(null);

    const [filterStatus, setFilterStatus] = useState(10);

    useEffect(() => {
      dispatch(fetchUsersData());
    }, [dispatch]);
  
    useEffect(() => {
      if (users.length) {
        setTableData(users);
      }
    }, [users]);  

    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(order, orderBy),
      filterName,
      filterRole,
      filterIsVerified,
      filterStatus,
    });

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const denseHeight = dense ? 52 : 72;

    const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterIsVerified) ||
    (!dataFiltered.length && !!filterStatus);

    const getLengthByStatus = (status: number) =>
      tableData.filter((item) => item.status === status).length;

    const getLengthByVerifyStatus = (status: boolean) =>
      tableData.filter((item) => item.isVerified === status).length;

    const getPercentByStatus = (status: number) =>
      (getLengthByStatus(status) / tableData.length) * 100;

    const getPercentByVerifyStatus = (status: boolean) =>
      (getLengthByVerifyStatus(status) / tableData.length) * 100;

    const STATUS_OPTIONS = [
      { value: 10, label: 'All', color: 'info', count: tableData.length },
      { value: 1, label: 'Active', color: 'success', count: getLengthByStatus(1) },
      { value: 2, label: 'Suspend', color: 'warning', count: getLengthByStatus(2) },
      { value: 0, label: 'Disable', color: 'error', count: getLengthByStatus(0) },
      { value: 3, label: 'Verified', color: 'success', count: getLengthByVerifyStatus(true) },
      { value: 4, label: 'Unverified', color: 'warning', count: getLengthByVerifyStatus(false) },
    ] as const;

    const handleFilterStatus = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
      setPage(0);
      if (newValue === 3 || newValue === 4) {
        setFilterIsVerified(newValue === 3);
        setFilterStatus(10);
      } else {
        setFilterIsVerified(null);
        setFilterStatus(newValue);
      }
    };

    const handleDeleteRow = (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setSelected([]);
      setTableData(deleteRow);

      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
    };

    const handleDeleteRows = (selectedRows: string[]) => {
      const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
      setSelected([]);
      setTableData(deleteRows);

      if (page > 0) {
        if (selectedRows.length === dataInPage.length) {
          setPage(page - 1);
        } else if (selectedRows.length === dataFiltered.length) {
          setPage(0);
        } else if (selectedRows.length > dataInPage.length) {
          const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
          setPage(newPage);
        }
      }
    };

    const handleEditRow = (id: string) => {
      navigate(PATH_DASHBOARD.user.edit(id));
    };

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
      setOpenConfirm(false);
    };

    return (
    <UserLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
        <Typography variant='h5'>
            User List
        </Typography>
        <Typography variant='body2'>This is list of monopando user</Typography>

        <Box sx={{ display:'flex', justifyContent:'flex-end' }}>
              <Button sx={{ left: 4 }}
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              variant="contained"
            >
              New User
            </Button>
        </Box>

      </Grid>

      <Grid item xs={12}>
      <Card sx={{ mb: 5 }}>
          <ScrollBar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <UserStatusAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />

              <UserStatusAnalytic
                title="Active"
                total={getLengthByStatus(1)}
                percent={getPercentByStatus(1)}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.success.main}
              />

              <UserStatusAnalytic
                title="Suspend"
                total={getLengthByStatus(2)}
                percent={getPercentByStatus(2)}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />

              <UserStatusAnalytic
                title="Disable"
                total={getLengthByStatus(0)}
                percent={getPercentByStatus(0)}
                icon="eva:bell-fill"
                color={theme.palette.error.main}
              />

              <UserVerifyStatusAnalytic
                title="Verified"
                total={getLengthByVerifyStatus(true)}
                percent={getPercentByVerifyStatus(true)}
                icon="eva:checkmark-circle-fill"
                color='#9c27b0'
              />

              <UserVerifyStatusAnalytic
                title="Not Verified"
                total={getLengthByVerifyStatus(false)}
                percent={getPercentByVerifyStatus(false)}
                icon="eva:clock-outline"
                color='#80deea'
              />
            </Stack>
          </ScrollBar>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <Tabs
            value={filterStatus === 1 && filterIsVerified !== null ? (filterIsVerified ? 'verified' : 'unverified') : filterStatus}
            variant="scrollable"
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} icon={
                <Label color={tab.color} sx={{ mr: 1 }}>
                  {tab.count}
                </Label>
              } />
            ))}
          </Tabs>
{/*
          <Tabs
            value={filterIsVerified}
            onChange={handleFilterVerifyStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {VERIFY_OPTIONS.map((tab) => (
              <Tab label={tab.label} value={tab.value} icon={
                <Label color={tab.color} sx={{ mr: 1 }}>
                  {tab.count}
                </Label>
              } />
            ))}
          </Tabs> */}

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
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
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
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
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
    </UserLayout>
  )
}

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterIsVerified,
  filterStatus,
  filterRole,
}: {
  inputData: IUserAccountGeneral[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterIsVerified: boolean;
  filterStatus: number;
  filterRole: number;
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
      (user) => user.fullname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterIsVerified !== null) {
    inputData = inputData.filter((user) => user.isVerified === filterIsVerified);
  }

  if (filterStatus !== 10) {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== 3) {
    inputData = inputData.filter((user) => user.grant === filterRole);
  }

  return inputData;
}

export default UserPage
