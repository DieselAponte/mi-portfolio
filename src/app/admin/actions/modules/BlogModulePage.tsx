import { BlogCRUDContainer } from "../../../../features/admin-actions/blog/BlogCRUDContainer";
import { fetchArticles } from "../../../../features/blog/services/blog.service";

export default async function BlogModulePage() {
  const articles = await fetchArticles();

  return <BlogCRUDContainer articles={articles} />;
}
