import { Link as RouterLink, useNavigate } from 'react-router-dom';

// ** MUI Imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import { CardStatisticsVerticalComponent } from '@theme-ui'

// ** Styled Component Import
import { ApexChartWrapper } from '@theme-ui'
import { UserLayout } from '@theme-ui'

import { PATH_DASHBOARD } from '@theme-ui'

const UserPage = () => {
    const navigate = useNavigate();

    const handleEditRow = (id: string) => {
        navigate(PATH_DASHBOARD.user.edit(id));
      };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        {
          field: 'age',
          headerName: 'Age',
          type: 'number',
          width: 90,
        },
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
      ];
      
    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
      ];

    return (
    <UserLayout>
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
            User List
          </Link>
        </Typography>
        <Typography variant='body2'>This is list of monopando user</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
        <Breadcrumbs aria-label="User List">
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              variant="contained"
            >
              New User
            </Button>
        </Breadcrumbs>
          <CardHeader title='Basic Table' titleTypographyProps={{ variant: 'h6' }} />
          <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
        </Card>
      </Grid>
      </Grid>
    </UserLayout>
  )
}

export default UserPage
