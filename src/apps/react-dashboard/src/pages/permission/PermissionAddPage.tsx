// @mui
import { Container } from '@mui/material';

// sections
import PermissionAddEditForm from '../../sections/permission/PermissionAddEditForm';

// ** Styled Component
import { UserLayout } from '@theme-ui';

export default function UserAddPage() {
  return (
    <UserLayout>
      <Container maxWidth='lg'>
        <PermissionAddEditForm isEdit={false} currentPermission={[]} />
      </Container>
    </UserLayout>
  );
}
