import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <div className="bg-primary text-secondary text-center py-2 text-sm">
        For business enquiries: <a href="tel:+917777016824" className="font-semibold">+91 77770 16824</a> | <a href="mailto:business@gemengserv.com" className="font-semibold">business@gemengserv.com</a>
      </div>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center py-12">
        <div className="mb-8">
          <Image
            src="/gem-logo-1.png"
            alt="GEM Engserv Logo"
            width={141}
            height={100}
          />
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold max-w-4xl text-secondary">
          GEM Engserv&apos;s Official Employee Directory
        </h1>

        <p className="mt-4 text-lg sm:text-2xl max-w-3xl text-gray-600">
          This website is the official employee data of GEM Engserv. We value their contribution in taking GEM to a new height.
        </p>

        <div className="my-12">
          <Link href="/directory" className="px-8 py-4 bg-secondary text-white rounded-lg text-xl font-semibold hover:bg-opacity-90 transition-colors">
            Click to view all employees
          </Link>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg shadow-inner max-w-4xl w-full">
          <h2 className="text-3xl font-bold mb-8 text-center text-secondary">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            <ul className="space-y-4 text-left">
              <li className="flex items-center text-lg">
                <svg className="w-6 h-6 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Customer Focus</span>
              </li>
              <li className="flex items-center text-lg">
                <svg className="w-6 h-6 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Ownership</span>
              </li>
              <li className="flex items-center text-lg">
                <svg className="w-6 h-6 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Integrity</span>
              </li>
            </ul>
            <ul className="space-y-4 text-left">
              <li className="flex items-center text-lg">
                <svg className="w-6 h-6 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Value Creation Through Competence</span>
              </li>
              <li className="flex items-center text-lg">
                <svg className="w-6 h-6 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Respect for Individual</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="w-full bg-secondary text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="font-bold text-lg mb-2">REGISTERED OFFICE ADDRESS</h3>
          <p>GEM Engserv Private Ltd.</p>
          <p>A-103, The Great Eastern Chamber, Plot No-28, Sector-11,</p>
          <p>CBD Belapur, Navi Mumbai 400614</p>
          <p className="mt-6 text-sm text-gray-400">© 2025 GEM Engserv Private Ltd. All Rights Reserved.</p>
          <a href="https://gemengserv.com" className="text-sm text-gray-400 hover:text-primary">gemengserv.com</a>
        </div>
      </footer>
    </div>
  )
}