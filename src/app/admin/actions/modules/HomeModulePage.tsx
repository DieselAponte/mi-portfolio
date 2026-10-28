import { HomeCRUDContainer } from "../../../../features/admin-actions/home/HomeCRUDContainer";
import {
  fetchHomeServices,
  fetchCasesOfStudy,
  fetchHomeAbout,
} from "../../../../features/home/services/home.service";

export default async function AdminHomeModulePage() {
  const [services, casesOfStudy, about] = await Promise.all([
    fetchHomeServices(),
    fetchCasesOfStudy(),
    fetchHomeAbout(),
  ]);

  return (
    <HomeCRUDContainer
      services={services}
      casesOfStudy={casesOfStudy}
      about={about}
    />
  );
}
