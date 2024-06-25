import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// ** MUI Imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
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
import { CardStatisticsVerticalComponent } from '@theme-ui'

// ** Styled Component Import
import { ApexChartWrapper } from '@theme-ui'
import { UserLayout } from '@theme-ui'

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { fetchPermissionsData } from '../../redux/slices/permissionThunk';

import { PATH_DASHBOARD } from '@theme-ui'

import { useTable, TablePaginationCustom, TableSelectedAction, TableHeadCustom, TableEmptyRows, TableNoData, getComparator, emptyRows } from '@theme-ui'

import PermissionTableRow from './PermissionTableRow'

// ** Import _mock Data
// import { _roleList } from '../../_mock/arrays'

import { Label } from '@theme-ui';
import { IPermissionGeneral } from '@theme-ui'

// const STATUS_OPTIONS = ['all', 'active', 'disable'];

const TABLE_HEAD = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'permissionName', label: 'Name', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

const PermissionPage = () => {
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

    const { permissions, isLoading } = useSelector((state) => state.permission);

    const [tableData, setTableData] = useState<IPermissionGeneral[]>([]);

    const [filterName, setFilterName] = useState('');

    const [openConfirm, setOpenConfirm] = useState(false);

    const [filterStatus, setFilterStatus] = useState(10);

    useEffect(() => {
      dispatch(fetchPermissionsData());
    }, [dispatch]);
  
    useEffect(() => {
      if (permissions.length) {
        setTableData(permissions);
      }
    }, [permissions]);

    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(order, orderBy),
      filterName,
      filterStatus,
    });

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const denseHeight = dense ? 52 : 72;

    const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus);

    const getLengthByStatus = (status: number) =>
      tableData.filter((item) => item.status === status).length;
    
    const getPercentByStatus = (status: number) =>
      (getLengthByStatus(status) / tableData.length) * 100;

    const STATUS_OPTIONS = [
      { value: 10, label: 'All', color: 'info', count: tableData.length },
      { value: 1, label: 'Active', color: 'success', count: getLengthByStatus(1) },
      { value: 2, label: 'Disable', color: 'warning', count: getLengthByStatus(2) },
    ] as const;

    const handleFilterStatus = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
      setPage(0);
      setFilterStatus(newValue);
    };

    const handleDeleteRow = (id: number) => {
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

    const handleEditRow = (id: number) => {
        navigate(PATH_DASHBOARD.permission.edit(id));
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
            Permission List
        </Typography>
        <Typography variant='body2'>This is list of Permission app</Typography>

        <Box m={1} display="flex" justifyContent="flex-end">
              <Button sx={{ left: 4 }}
              component={RouterLink}
              to={PATH_DASHBOARD.permission.new}
              variant="contained"
            >
              New Permission
            </Button>
        </Box>

      </Grid>
      <Grid item xs={12}>
        <Card>
          <Tabs
            value={filterStatus}
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
                      <PermissionTableRow
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

export default PermissionPage
