import { useEffect } from 'react'

import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { fetchUserData } from '../../redux/slices/userThunk';

// sections
import UserAddEditForm from '../../sections/user/UserAddEditForm';

// ** Styled Component
import { UserLayout } from '@theme-ui';

export default function UserEditPage() {

  const { id } = useParams<{ id: string }>();
  
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserData(id));
    }
  }, [dispatch, id]);

  return (
    <UserLayout>
      <Container maxWidth='lg'>
        <UserAddEditForm isEdit={true} currentUser={currentUser} />
      </Container>
    </UserLayout>
  );
}
