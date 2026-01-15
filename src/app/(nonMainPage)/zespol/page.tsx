import Markdown from '@/app/components/markdown';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import gfm from 'remark-gfm';
import html from 'remark-html';

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
      </section>
      <section className='container mx-auto my-4 z-10'>
        <div className='flex justify-center'>
         <Markdown content={contentHtml}/>
        </div>
      </section>
    </>
  );
}