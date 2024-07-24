import { Link as RouterLink } from 'react-router-dom';

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import CardMedia from '@mui/material/CardMedia';

import CheckCircleOutline from 'mdi-material-ui/CheckCircleOutline'

import { PATH_DASHBOARD, fDate, fShortenNumber } from '@theme-ui'

import { IProjectGeneral } from '@theme-ui'

  type Props = {
    project: IProjectGeneral;
    index?: number;
  };

  const ProjectCard = ({ project, index }: Props) => {
    const { projectName, projectDetail, projectCover, projectLeader, avatarUrl, currentSprint, progressPercentage, totalTeam, createdAt } = project;
    const latestPost = index === 0 || index === 1 || index === 2;

    // if (latestPost) {
    //   return (
    //     <Card>
    //       <CardMedia src={projectCover} sx={{ height: 360 }} />
    //       <Avatar
    //         alt={projectLeader}
    //         src={projectLeaderAvatarUrl}
    //         sx={{
    //           top: 24,
    //           left: 24,
    //           zIndex: 9,
    //           position: 'absolute',
    //         }}
    //       />
  
    //       <ProjectContent
    //       title={projectName}
    //       detail={projectDetail}
    //       leader={projectLeader}
    //       sprint={currentSprint}
    //       progress={progressPercentage}
    //       team={totalTeam}
    //       createdAt={createdAt}
    //       index={index}
    //       />
    //     </Card>
    //   );
    // }
  
    return (
      <Card>
        <CardMedia image={projectCover} sx={{ height: 128 }} />
        <Box sx={{ position: 'relative' }}>
  
          <Avatar
            alt={projectLeader}
            src={avatarUrl}
            sx={{
              left: 24,
              zIndex: 9,
              width: 32,
              height: 32,
              bottom: -16,
              position: 'absolute',
            }}
          />
        </Box>
  
        <ProjectContent
        title={projectName}
        detail={projectDetail}
        leader={projectLeader}
        sprint={currentSprint}
        progress={progressPercentage}
        team={totalTeam}
        createdAt={createdAt}
        />
      </Card>
    );

    // return (
    // <Grid container spacing={6}>
    //   <Grid item xs={12} sx={{ paddingBottom: 4 }}>
    //     <Typography variant='h5'>Projects</Typography>
    //   </Grid>
    //   <Grid item xs={12} sm={6} md={4}>
    //     <ProjectContent
    //     title={projectName}
    //     detail={projectDetail}
    //     leader={projectLeader}
    //     sprint={currentSprint}
    //     progress={progressPercentage}
    //     team={totalTeam}
    //     createdAt={createdAt}
    //     index={index}
    //     />
    //   </Grid>
    // </Grid>
    // )
  }

  
type ProjectContentProps = {
  title: string;
  detail: string;
  leader: string;
  sprint: string;
  progress: string;
  team: number;
  createdAt: Date | string | number;
  index?: number;
};

export function ProjectContent({ title, detail, leader, sprint, progress, team, createdAt, index }: ProjectContentProps) {

  const linkTo = PATH_DASHBOARD.project.view(title);
  
  const latestPostLarge = index === 0;

  const latestPostSmall = index === 1 || index === 2;

  const POST_INFO = [
    { id: 'leader', value: leader, icon: 'eva:message-circle-fill' },
    { id: 'detail', value: detail, icon: 'eva:eye-fill' },
    { id: 'progress', value: progress, icon: 'eva:eye-fill' },
    { id: 'team', value: team, icon: 'eva:eye-fill' },
    { id: 'sprint', value: sprint, icon: 'eva:share-fill' },
  ];

  return (
    <CardContent
      sx={{
        pt: 4.5,
        width: 1,
        ...((latestPostLarge || latestPostSmall) && {
          pt: 0,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }),
      }}
    >
      <Typography
        gutterBottom
        variant="caption"
        component="div"
        sx={{
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {fDate(createdAt)}
      </Typography>

      <Link color="inherit" component={RouterLink} to={linkTo}>
          {title}
      </Link>

      <Stack
        flexWrap="wrap"
        direction="row"
        justifyContent="flex-end"
        sx={{
          mt: 3,
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {POST_INFO.map((info) => (
          <Stack
            key={info.id}
            direction="row"
            alignItems="center"
            sx={{ typography: 'caption', ml: info.id === 'detail' ? 0 : 1.5 }}
          >
            <CheckCircleOutline width={16} sx={{ mr: 0.5 }} />
            { fShortenNumber(info.value) }
          </Stack>
        ))}
      </Stack>
    </CardContent>
  );
}

export default ProjectCard;