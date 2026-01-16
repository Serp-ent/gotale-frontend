import Link from 'next/link';

const directory = '/reports';
const semesterDirectory = `${directory}/semester`;

const semesterIndividualDir = `${semesterDirectory}/individual`
const semesterIndividualReports = [
  {
    label: "Kacper Urbański",
    path: `${semesterIndividualDir}/ku.pdf`
  },
];


export default function Page() {
  return (
    <div className='grid place-content-center container mx-auto my-4'>
      <div className='flex justify-center max-w-4xl flex-col'>
        <section className='mt-10 my-6 prose prose-sm sm:prose-base md:prose-lg lg:max-w-4xl text-foreground'>
          {/* TODO: Update this page with latest documentation */}
          <h1 className='text-3xl font-bold mb-6 border-b-2 pb-2 border-accent text-primary'>
            Informacja o dokumentacji
          </h1>
          <p className='mb-4 leading-relaxed'>
            Dokumentacja projektu zostanie opublikowana po zakończeniu prac nad projektem. Szczegóły techniczne i procesowe będą dostępne w finalnej wersji dokumentacji.
          </p>
          <p className='mb-4 leading-relaxed italic text-muted-foreground'>
            Niektóre materiały, takie jak "Zestawienie spotkań" oraz "Dokumentacja API w Postman", nie są obecnie dostępne, ponieważ aktualny etap prac nad projektem jest prowadzony jednoosobowo, a aplikacja backendowa została przepisana na Django REST Framework i korzysta z drf-spectacular.
          </p>

          <h2 className='text-2xl font-semibold mt-8 mb-4 text-primary relative pl-3 before:absolute before:left-0 before:w-1 before:h-full before:bg-accent'>
            Raporty projektu
          </h2>
        </section>

        {/* Main Report Download removed */}
        <section className='pl-4'>
          {/* Individual Reports Downloads */}
          {semesterIndividualReports.length > 0 && (
            <div className='mt-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Raporty indywidualne:
              </h3>
              <ul className='list-none'>
                {semesterIndividualReports.map((report) => (
                  <li
                    key={report.path}
                    className='relative pl-6 before:absolute before:left-0 before:top-[0.3em] before:text-accent before:content-["▹"] before:mr-2 before:leading-none mt-2'
                  >
                    <a
                      href={report.path}
                      target='_blank'
                      className='text-accent hover:underline'
                    >
                      {report.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Project Documentation */}
        <section className='pl-4 mt-8'>
          <h3 className='text-xl font-semibold mb-4'>
            Dokumentacja projektowa:
          </h3>
          <ul className='list-none'>
            <li className='relative pl-6 before:absolute before:left-0 before:top-[0.3em] before:text-accent before:content-["▹"] before:mr-2 before:leading-none mt-2'>
              <Link
                href="/zesp11_opis.pdf"
                target='_blank'
                className='text-accent hover:underline'
              >
                Opis projektu
              </Link>
            </li>
            <li className='relative pl-6 before:absolute before:left-0 before:top-[0.3em] before:text-muted-foreground before:content-["▹"] before:mr-2 before:leading-none mt-2'>
              <Link
                href="/zesp11_specyfikacja_funkcjonalna.pdf"
                target='_blank'
                className='text-muted-foreground hover:underline'
              >
                Specyfikacja funkcjonalna
              </Link>
              <span className='ml-2 text-sm text-muted-foreground italic'>
                (nieaktualne — część starego projektu programowania zespołowego)
              </span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
