import { useEffect } from 'react'

import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';

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

  const { currentRole } = useSelector((state) => state.role);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchRoleData(parseInt(id,10)));
    }
  }, [dispatch, id]);


  return (
    <UserLayout>
      <Container maxWidth='lg'>
        <RoleAddEditForm isEdit={true} currentRole={currentRole} />
      </Container>
    </UserLayout>
  );
}
