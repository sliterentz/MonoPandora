import { sub, subDays } from 'date-fns';

//
import {
  age,
  role,
  roleName,
  price,
  title,
  email,
  rating,
  percent,
  country,
  company,
  boolean,
  sentence,
  lastName,
  fullName,
  firstName,
  description,
  fullAddress,
  phoneNumber,
  position,
  salary,
  gender,
} from './assets';

// ----------------------------------------------------------------------

const _mock = {
  id: (index: number) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`,
  departmentId: (index: number) => `DEP-${index + 1}`,
  employeeId: (index: number) => `EMP-${index + 1}`,
  projectId: (index: number) => `PRO-${index + 1}`,
  email: (index: number) => email[index],
  phoneNumber: (index: number) => phoneNumber[index],
  time: (index: number) => sub(new Date(), { days: index, hours: index }),
  boolean: (index: number) => boolean[index],
  role: (index: number) => role[index],
  roleName: (index: number) => roleName[index],
  position: (index: number) => position[index],
  gender: (index: number) => gender[index],
  joinDate: (index: number) => subDays(new Date(), index),
  company: (index: number) => company[index],
  salary: (index: number) => salary[index],
  address: {
    fullAddress: (index: number) => fullAddress[index],
    country: (index: number) => country[index],
  },
  name: {
    firstName: (index: number) => firstName[index],
    lastName: (index: number) => lastName[index],
    fullName: (index: number) => fullName[index],
  },
  text: {
    title: (index: number) => title[index],
    sentence: (index: number) => sentence[index],
    description: (index: number) => description[index],
  },
  number: {
    percent: (index: number) => percent[index],
    rating: (index: number) => rating[index],
    age: (index: number) => age[index],
    price: (index: number) => price[index],
  },
  image: {
    cover: (index: number) =>
      `https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_${index + 1}.jpg`,
    product: (index: number) =>
      `https://api-dev-minimal-v510.vercel.app/assets/images/m_product/product_${index + 1}.jpg`,
    avatar: (index: number) =>
      `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${index + 1}.jpg`,
  },
};

export default _mock;
