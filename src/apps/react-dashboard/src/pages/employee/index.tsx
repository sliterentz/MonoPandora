import { useState } from 'react';
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

import { PATH_DASHBOARD } from '@theme-ui'

import { useTable, TablePaginationCustom, TableSelectedAction, TableHeadCustom, TableEmptyRows, TableNoData, getComparator, emptyRows } from '@theme-ui'

import EmployeeTableRow from './EmployeeTableRow'

// ** Import _mock Data
import { _employeeList } from '../../_mock/arrays'

import { IEmployeeGeneral } from '@theme-ui'

const GENDER_OPTIONS = ['all', 'male', 'female'];

const TABLE_HEAD = [
  { id: 'employeeId', label: 'Employee ID', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'position', label: 'Potition', align: 'left' },
  { id: 'gender', label: 'Gender', align: 'left' },
  { id: 'joinDate', label: 'Join Date', align: 'left' },
  { id: '' },
];

const EmployeePage = () => {
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

    const [tableData, setTableData] = useState(_employeeList);

    const [filterName, setFilterName] = useState('');

    const [filterPosition, setFilterPosition] = useState('all');

    const [openConfirm, setOpenConfirm] = useState(false);

    const [filterGender, setFilterGender] = useState('all');

    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(order, orderBy),
      filterName,
      filterPosition,
      filterGender,
    });

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const denseHeight = dense ? 52 : 72;

    const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterPosition) ||
    (!dataFiltered.length && !!filterGender);

    const handleFilterGender = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
      setPage(0);
      setFilterGender(newValue);
    };

    const handleDeleteRow = (id: string) => {
      const deleteRow = tableData.filter((row) => row.employeeId !== id);
      setSelected([]);
      setTableData(deleteRow);

      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
    };

    const handleDeleteRows = (selectedRows: string[]) => {
      const deleteRows = tableData.filter((row) => !selectedRows.includes(row.employeeId));
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
        navigate(PATH_DASHBOARD.employee.edit(id));
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
            Employee List
        </Typography>
        <Typography variant='body2'>This is list of employee</Typography>

        <Box m={1} display="flex" justifyContent="flex-end">
              <Button sx={{ left: 4 }}
              component={RouterLink}
              to={PATH_DASHBOARD.employee.new}
              variant="contained"
            >
              New Employee
            </Button>
        </Box>

      </Grid>
      <Grid item xs={12}>
        <Card>
          <Tabs
            value={filterGender}
            onChange={handleFilterGender}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {GENDER_OPTIONS.map((tab) => (
              <Tab key={tab} label={tab} value={tab} />
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
                  tableData.map((row) => row.employeeId)
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
                      tableData.map((row) => row.employeeId)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <EmployeeTableRow
                        key={row.employeeId}
                        row={row}
                        selected={selected.includes(row.employeeId)}
                        onSelectRow={() => onSelectRow(row.employeeId)}
                        onDeleteRow={() => handleDeleteRow(row.employeeId)}
                        onEditRow={() => handleEditRow(row.name)}
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
  filterGender,
  filterPosition,
}: {
  inputData: IEmployeeGeneral[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterGender: string;
  filterPosition: string;
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
      (employee) => employee.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterGender !== 'all') {
    inputData = inputData.filter((employee) => employee.gender === filterGender);
  }

  if (filterPosition !== 'all') {
    inputData = inputData.filter((employee) => employee.position === filterPosition);
  }

  return inputData;
}

export default EmployeePage
