export const dynamic = "force-dynamic";

import ExperienceContainer from "../../features/experience/ExperienceContainer";
import { fetchCertifications, fetchCarouselItems } from "../../features/experience/services/experience.service";
import { fetchPublicaciones } from "../../features/experience/services/trayectory.service";

export default async function ExperiencePage() {
  const [publicaciones, certifications, carouselItems] = await Promise.all([
    fetchPublicaciones(),
    fetchCertifications(),
    fetchCarouselItems(),
  ]);

  return (
    <ExperienceContainer
      publicaciones={publicaciones}
      certifications={certifications}
      carouselItems={carouselItems}
    />
  );
}
