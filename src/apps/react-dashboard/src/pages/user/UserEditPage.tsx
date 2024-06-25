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
import { fetchUserData } from '../../redux/slices/userThunk';

import { IUserState } from '@theme-ui'

// sections
import UserAddEditForm from '../../sections/user/UserAddEditForm';

// ** Styled Component
import { UserLayout } from '@theme-ui';

export default function UserEditPage() {

  const { id } = useParams<{ id: string }>();
  
  const dispatch = useDispatch();

  const { currentUser, isLoading, error } = useSelector((state) => state.user);

  // const [currentUserData, setTableData] = useState<IUserState[]>([]);

  // const currentUser = //_userList.find((user) => user.id === id);

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
