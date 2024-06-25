import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@theme-ui';

// sections
import RoleAddEditForm from '../../sections/role/RoleAddEditForm';

// ** Styled Component
import { UserLayout } from '@theme-ui';

export default function UserAddPage() {
  return (
    <UserLayout>
      <Container maxWidth='lg'>
        <RoleAddEditForm isEdit={false} currentUser={[]} />
      </Container>
    </UserLayout>
  );
}
