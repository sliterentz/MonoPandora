// @mui
import { Container } from '@mui/material';

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
