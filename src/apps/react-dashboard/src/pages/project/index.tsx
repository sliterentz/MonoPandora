import { useState } from 'react';
import { orderBy } from 'lodash';

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Pagination from '@mui/material/Pagination'

// ** Demo Components Imports
import ProjectCard from './ProjectCard'
import ProjectCardSort from './ProjectCardSort'

// ** Import _mock Data
import { _projectList } from '../../_mock/arrays'

import { IProjectGeneral } from '@theme-ui'
import { UserLayout } from '@theme-ui'

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

const CardBasic = () => {
  const [projects, setProjects] = useState(_projectList);
  
  const [sortBy, setSortBy] = useState('latest');

  const sortedProjects = applySortBy(projects, sortBy);

    // const { projectName, projectDetail, projectLeader, currentSprint, progressPercentage, totalTeam, createdAt } = project;

  const handleChangeSortBy = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value);
  };

  return (
    <UserLayout>
      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          {/* <BlogPostsSearch /> */}
          <ProjectCardSort sortBy={sortBy} sortOptions={SORT_OPTIONS} onSort={handleChangeSortBy} />
      </Stack>

      <Grid container spacing={6}>
      {(!projects.length ? [...Array(12)] : sortedProjects).map((project, index) =>
            project ? (
              <Grid key={project.id} item xs={12} sm={6} md={3}>
                <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'primary.main' }}>
                {/* <CardMedia src={project.projectCover} sx={{ height: 360 }} /> */}
                  <ProjectCard project={project} index={index} />
                </Card>
              </Grid>
            ) : (
              <Grid key={index} item xs={12} sm={6} />
            )
          )}
      </Grid>
      
      <Stack sx={{ px: { md: 5 }, }} >
        <Pagination count={6} />
      </Stack>
    </UserLayout>
  )
}

const applySortBy = (projects: IProjectGeneral[], sortBy: string) => {
  if (sortBy === 'latest') {
    return orderBy(projects, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    return orderBy(projects, ['createdAt'], ['asc']);
  }

  return projects;
};

export default CardBasic
