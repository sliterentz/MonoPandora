// @mui
import {
  Stack,
  Checkbox,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
// @types
import { IPermissionGeneral } from '@theme-ui';

// components
import { Label } from '@theme-ui';
// import Iconify from '@theme-ui';

type Props = {
  row: IPermissionGeneral;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export default function PermissionTableRow({
  row,
  selected,
  onSelectRow,
}: Props) {
  const { id, permissionName, description, status } = row;
  
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox value={id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="left">{id}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {permissionName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {description}
            </Typography>
          </Stack>
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
      </TableRow>

    </>
  );
}