import Blogs from "../components/Blogs";
import Hero from "../components/Hero";
import GitHubContributions from "../components/GitHubContributions";
import Projects from "../components/Projects";


export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Blogs />
      <GitHubContributions />
    </main>
  );
}
