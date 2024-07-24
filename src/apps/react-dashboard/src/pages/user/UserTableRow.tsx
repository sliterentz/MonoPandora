import { useState } from 'react'

// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// @types
import { IUserAccountGeneral } from '@theme-ui';

// components
import { Label, Iconify } from '@theme-ui';
// import Iconify from '@theme-ui';
import { MenuPopover } from '@theme-ui';
import { ConfirmDialog } from '@theme-ui';

// import CheckCircleOutline from 'mdi-material-ui/CheckCircleOutline'
// import ClockOutline from 'mdi-material-ui/ClockOutline'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import Pencil from 'mdi-material-ui/Pencil'

// ----------------------------------------------------------------------

type Props = {
  row: IUserAccountGeneral;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {

  const { fullname, avatarUrl, email, isSuperUser, isVerified, status } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

    return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={fullname} src={avatarUrl} />

            <Typography variant="subtitle2" noWrap>
              {fullname}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{email}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {(isSuperUser === true && 'Super Admin') ||
          'User' }
        </TableCell>
        <TableCell align="center">
          {/* { isVerified ? (
                  <CheckCircleOutline sx={{ color: 'success.main', width: 20, height: 20 }} />
                ) : (
                  <ClockOutline sx={{ color: 'warning.main', width: 20, height: 20 }} />
          )} */}
          <Iconify
            icon={isVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!isVerified && { color: 'warning.main' }),
            }}
          />
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={(status === 2 && 'warning') ||
              (status === 0 && 'error') ||
               'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            { status === 1 ? 'Active' : ( status === 2 ? 'Suspend' : 'Disable' ) }
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <DotsVertical />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteOutline />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}>
          <Pencil />
          Edit
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
