export const dynamic = "force-dynamic";

import { HomeContainer } from "../features/home/HomeContainer";
import {
  fetchCasesOfStudy,
  fetchHomeServices,
  fetchHomeAbout,
} from "../features/home/services/home.service";

export default async function Home() {
  const [services, casesOfStudy, about] = await Promise.all([
    fetchHomeServices(),
    fetchCasesOfStudy(),
    fetchHomeAbout(),
  ]);

  return (
    <HomeContainer
      services={services}
      casesOfStudy={casesOfStudy}
      about={about}
    />
  );
}
