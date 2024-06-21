import _mock from '../_mock';
import { project } from '../assets';
import { subDays } from 'date-fns';

export const _projectList = project.map((data, index) => ({
    id: _mock.projectId(index),
    projectName: data.projectName,
    projectDetail: data.projectDetail,
    projectCover: _mock.image.cover(index),
    leader: data.projectLeader,
    avatarUrl: _mock.image.avatar(index),
    sprint: data.currentSprint,
    projectProgress: data.progressPercentage,
    totalMember: data.totalTeam,
    createdAt: subDays(new Date(), index),
  }));