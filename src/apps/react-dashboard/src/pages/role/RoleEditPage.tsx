import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@theme-ui';
// _mock_
import { _userList } from '../../_mock/arrays'

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { fetchRoleData } from '../../redux/slices/roleThunk';

// sections
import RoleAddEditForm from '../../sections/role/RoleAddEditForm';

// ** Styled Component
import { UserLayout } from '@theme-ui';

export default function UserEditPage() {

  const { id } = useParams();  // Get the user ID from the URL
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.role);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchRoleData(id));
    }
  }, [dispatch, id]);


  return (
    <UserLayout>
      <Container maxWidth='lg'>
        <RoleAddEditForm isEdit={true} currentUser={role} />
      </Container>
    </UserLayout>
  );
}