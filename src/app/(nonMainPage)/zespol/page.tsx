import Markdown from '@/app/components/markdown';
import MemberCard from '@/app/components/memberCard';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import gfm from 'remark-gfm';
import html from 'remark-html';

export interface Member {
  firstName: string;
  lastName: string;
  photo: string | null;
  github: string | null;
  linkedin: string | null;
}

const members: Member[] = [
  {
    firstName: "Kacper",
    lastName: "Urbański",
    photo: null,
    github: "https://github.com/Serp-ent",
    linkedin: null,
  },
];

const TEAM_LEADER = 0;

export default async function Page() {
  const filePath = path.join(process.cwd(), 'descriptions', 'zespol.md');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Convert markdown to HTML
  const processedContent = await remark().use(gfm).use(html).process(fileContent);
  const contentHtml = processedContent.toString();


  return (
    <>
      {/* <div className='hidden sm:block'>
        <MouseTrail />
      </div> */}

      <section className="p-1 mt-10 mx-auto sm:max-w-4xl">
        <div className="flex justify-center">
          <h1 className="z-10 text-2xl font-bold mb-4">Zespół 11</h1>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 relative">
          {/* Render the team leader at the center */}
          <div className="sm:col-start-2 sm:-left-1/2 md:col-start-2 md:col-span-2 md:-left-1/4 relative">
            <MemberCard member={members[TEAM_LEADER]} isLeader={true} />
          </div>

          {/* Render the rest of the members */}
          {members
            .filter((_, index) => index !== TEAM_LEADER)
            .map((member, index) => (
              <MemberCard key={index} member={member} isLeader={false} />
            ))}
        </div>
      </section>
      <section className='container mx-auto my-4 z-10'>
        <div className='flex justify-center'>
         <Markdown content={contentHtml}/>
        </div>
      </section>
    </>
  );
}