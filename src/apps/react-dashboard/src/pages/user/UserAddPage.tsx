import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// sections
import UserAddEditForm from '../../sections/user/UserAddEditForm';

// ** Styled Component
import { UserLayout } from '@theme-ui';

export default function UserAddPage() {
  return (
    <UserLayout>
      <Container maxWidth='lg'>
        <UserAddEditForm isEdit={false} currentUser={[]} />
      </Container>
    </UserLayout>
  );
}
