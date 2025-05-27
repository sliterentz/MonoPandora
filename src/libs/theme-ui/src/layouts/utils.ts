// ** Types
import { Location } from 'react-router-dom'

/**
 * Check for URL queries as well for matching
 * Current URL & Item Path
 *
 * @param item
 * @param activeItem
 */
export const handleURLQueries = (location: Location, path: string | undefined): boolean => {
  // if (Object.keys(router).length && path) {
  //   const arr = Object.keys(router)

  //   return router.asPath.includes(path) && router.asPath.includes(router.query[arr[0]] as string) && path !== '/'
  // }
  const searchParams = new URLSearchParams(location.search);

  if ([...searchParams.keys()].length && path) {
    const firstQueryKey = [...searchParams.keys()][0];
    const firstQueryValue = searchParams.get(firstQueryKey);

    return location.pathname.includes(path) && location.pathname.includes(firstQueryValue as string) && path !== '/';
  }
  
  return false
}
