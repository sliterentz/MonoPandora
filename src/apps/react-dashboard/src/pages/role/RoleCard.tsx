// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { CustomAvatarGroup } from '@theme-ui'

// ** Icons Imports
import Heart from 'mdi-material-ui/Heart'
import ShareVariant from 'mdi-material-ui/ShareVariant'

import { _roleList } from '../../_mock/arrays'

const ROLE_OPTIONS = [
    { id: 1, roleName: 'Super Admin', backgroundColor: 'primary.main', totalUser: 1 },
    { id: 2, roleName: 'Supervisor', backgroundColor: 'success.main', totalUser: 3 },
    { id: 3, roleName: 'Employee', backgroundColor: 'info.main', totalUser: 3 },
    { id: 4, roleName: 'Client', backgroundColor: 'warning.main', totalUser: 3 },
];

const ROLE_USERS = [
    { name: 'Jayvion Simon', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg', role: 'Super Admin'},
    { name: 'Lucian Obrien', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg', role: 'Super Admin'},
    { name: 'Deja Brady', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_3.jpg', role: 'Supervisor'},
    { name: 'Harrison Stein', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_4.jpg', role: 'Supervisor'},
    { name: 'Reece Chung', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_5.jpg', role: 'Employee'},
    { name: 'Lainey Davidson', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_6.jpg', role: 'Employee'},
    { name: 'Cristopher Cardenas', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_7.jpg', role: 'Employee'},
    { name: 'Melanie Noble', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_8.jpg', role: 'Employee'},
    { name: 'Chase Day', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_9.jpg', role: 'Employee'},
    { name: 'Shawn Manning', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_10.jpg', role: 'Client'},
];

const RoleCard = () => {
  return (
    <Grid container spacing={6}>
    { ROLE_OPTIONS.map((card) => {
        const users = ROLE_USERS.filter(user => user.role === card.roleName);
        return (
    <Grid item xs={12} sm={6} md={4} key={card.id} >
    <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: `${card.backgroundColor}` }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
            <Typography variant='subtitle2' sx={{ marginBottom: 3, color: 'common.white' }}> Total {card.totalUser} users </Typography>   
            <Box sx={{ display:'flex', alignItems: 'righ', justifyContent: 'flex-end' }}>
                <CustomAvatarGroup>
                { users.map((person) => (
                    <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
                    ))}
                </CustomAvatarGroup>
            </Box>
        
        <Typography
          variant='h4'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          { card.roleName }
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Typography variant='body2' sx={{ color: 'common.white' }}>
              Edit Role
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
              <Heart sx={{ marginRight: 1.25 }} />
              <Typography variant='body2' sx={{ color: 'common.white' }}>
                3.2k
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShareVariant sx={{ marginRight: 1.25 }} />
              <Typography variant='body2' sx={{ color: 'common.white' }}>
                49
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
    </Grid>
        );
    })}
    </Grid>
  )
}

export default RoleCard
