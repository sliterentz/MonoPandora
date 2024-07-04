import { useEffect } from 'react'

import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { fetchPermissionData } from '../../redux/slices/permissionThunk';

// sections
import PermissionAddEditForm from '../../sections/permission/PermissionAddEditForm';

// ** Styled Component
import { UserLayout } from '@theme-ui';

export default function UserEditPage() {

  const { id } = useParams(); // Get the user ID from the URL
  const dispatch = useDispatch();

  const { currentPermission } = useSelector((state) => state.permission);

  useEffect(() => {
    if (id) {
      dispatch(fetchPermissionData(parseInt(id,10)));
    }
  }, [dispatch, id]);

  return (
    <UserLayout>
      <Container maxWidth='lg'>
        <PermissionAddEditForm isEdit={true} currentPermission={currentPermission} />
      </Container>
    </UserLayout>
  );
}
