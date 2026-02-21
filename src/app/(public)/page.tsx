import Blogs from "../components/Blogs";
import Hero from "../components/Hero";
import GitHubActivity from "../components/GitHubActivity";
import Projects from "../components/Projects";


export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Blogs />
      <GitHubActivity />
    </main>
  );
}
