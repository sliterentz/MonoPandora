import { m } from 'framer-motion';
// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// import { getCurrentProfile } from '@theme-ui'
// assets
// import { ForbiddenIllustration } from 'src/assets/illustrations';
// components
// import { MotionContainer, varBounce } from 'src/components/animate';

// ----------------------------------------------------------------------

type RoleGuardProp = {
  hasContent?: boolean;
  // roles?: string[];
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export const hasAccess = (requiredRoles: string[], userRoles: string[]): boolean => {
    return requiredRoles.some(role => userRoles.includes(role));
}

export default function RoleGuard({ hasContent, children, sx }: RoleGuardProp) {

    // const { userData } = getCurrentProfile();
    // const { permissions }  = userData.access.roles;
    
    // const currentRole = 'user';
    // const currentRole = userData?.access.roles.map((item) => item.roleName); // admin;

  if (hasContent) {
    return (
      <Container sx={{ textAlign: 'center', ...sx }}>
        {/* <m.div variants={varBounce().in}> */}
          <Typography variant="h3" paragraph>
            Permission Denied
          </Typography>
        {/* </m.div> */}

        {/* <m.div variants={varBounce().in}> */}
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page
          </Typography>
        {/* </m.div> */}

        {/* <m.div variants={varBounce().in}> */}
          {/* <ForbiddenIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          /> */}
        {/* </m.div> */}
      </Container>
    );
  }

  return <> {children} </>;
}
