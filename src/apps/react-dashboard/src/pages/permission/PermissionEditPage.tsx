import { useState, useDispatch } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@theme-ui';
// _mock_
import { _userList } from '../../_mock/arrays'

// sections
import PermissionAddEditForm from '../../sections/permission/PermissionAddEditForm';

// ** Styled Component
import { UserLayout } from '@theme-ui';

export default function UserEditPage() {

  const { id } = useParams(); // Get the user ID from the URL
  const dispatch = useDispatch();

  const currentUser = _userList.find((user) => user.id === id);

  return (
    <UserLayout>
      <Container maxWidth='lg'>
        <PermissionAddEditForm isEdit={true} currentUser={currentUser} />
      </Container>
    </UserLayout>
  );
}
