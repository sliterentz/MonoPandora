// @mui
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  sortBy: string;
  sortOptions: { value: string; label: string }[];
  onSort: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ProjectCardSort = ({ sortBy, sortOptions, onSort }: Props) => {
  return (
    <TextField
      select
      size="small"
      value={sortBy}
      onChange={onSort}
      SelectProps={{
        sx: { typography: 'body2' },
      }}
    >
      {sortOptions.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            mx: 1,
            borderRadius: 0.75,
            typography: 'body2',
            textTransform: 'capitalize',
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default ProjectCardSort;
