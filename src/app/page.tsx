import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          GEM Engserv&apos;s Official Employee Directory
        </h1>

        <p className="mt-3 text-2xl">
          This website is the official employee data of GEM Engserv. We value their contribution in taking GEM to a new height.
        </p>

        <div className="my-12">
          <h2 className="text-4xl font-bold mb-6 text-primary">Our Values</h2>
          <ol className="text-xl list-decimal list-inside text-left inline-block">
            <li>Customer Focus</li>
            <li>Ownership</li>
            <li>Integrity</li>
            <li>Value Creation Through Competence</li>
            <li>Respect for Individual</li>
          </ol>
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl sm:w-full">
          <Link href="/directory" className="p-6 text-left border w-96 rounded-xl hover:text-primary focus:text-primary">
            <h3 className="text-2xl font-bold">Explore Our GEMians &rarr;</h3>
            <p className="mt-4 text-xl">
              Meet the incredible people who make GEM a great place to be.
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}
