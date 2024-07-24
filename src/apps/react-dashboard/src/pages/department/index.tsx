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

import DepartmentTableRow from './DepartmentTableRow'

// ** Import _mock Data
import { _departmentList } from '../../_mock/arrays'

import { IDepartmentGeneral } from '@theme-ui'

const STATUS_OPTIONS = ['all', 'active', 'disable'];

const TABLE_HEAD = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'departmentName', label: 'Name', align: 'left' },
  { id: 'totalEmployees', label: 'Total Employees', align: 'left' },
  { id: '' },
];

const DepartmentPage = () => {
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

    const [tableData, setTableData] = useState(_departmentList);

    const [filterName, setFilterName] = useState('');

    const [filterPosition, setFilterPosition] = useState('all');

    const [openConfirm, setOpenConfirm] = useState(false);

    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(order, orderBy),
      filterName,
    });

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const denseHeight = dense ? 52 : 72;

    const isNotFound =
    (!dataFiltered.length && !!filterName);

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
        navigate(PATH_DASHBOARD.role.edit(id));
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
            Department List
        </Typography>
        <Typography variant='body2'>List of department info</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>

            <Box m={1} display="flex" justifyContent="flex-end">
              <Button sx={{ left: 4 }}
              component={RouterLink}
              to={PATH_DASHBOARD.role.new}
              variant="contained"
            >
              New Department
            </Button>
            </Box>

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
                      <DepartmentTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.departmentName)}
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
}: {
  inputData: IDepartmentGeneral[];
  comparator: (a: any, b: any) => number;
  filterName: string;
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
      (role) => role.departmentName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export default DepartmentPage
