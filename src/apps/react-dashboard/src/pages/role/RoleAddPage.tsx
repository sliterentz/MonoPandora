import { useState } from 'react'

// @mui
import { Container } from '@mui/material';

// sections
import RoleAddEditForm from '../../sections/role/RoleAddEditForm';

// ** Styled Component
import { UserLayout } from '@theme-ui';

export default function UserAddPage() {
  return (
    <UserLayout>
      <Container maxWidth='lg'>
        <RoleAddEditForm isEdit={false} currentRole={[]} />
      </Container>
    </UserLayout>
  );
}
