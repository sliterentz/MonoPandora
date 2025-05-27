// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import { UploadAvatar, UploadProps } from '../upload';

interface Props extends Omit<UploadProps, 'file'> {
  name: string;
  multiple?: boolean;
}

export function RHFUploadAvatar({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar
            accept={{
              'image/*': [],
            }}
            error={!!error}
            file={field.value}
            {...other}
          />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
