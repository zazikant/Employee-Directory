import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <div className="bg-white">
        <div className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center py-12">
        <div className="mb-8">
          <Image
            src="https://gemengserv.com/wp-content/uploads/2021/04/GEM-Engserv-Pvt-Ltd-logo-updated.png"
            alt="GEM Engserv Logo"
            width={150}
            height={40}
          />
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold max-w-4xl text-black">
          GEM Engserv&apos;s Official Employee Directory
        </h1>

        <p className="mt-4 text-lg sm:text-2xl max-w-3xl text-gray-600 font-medium">
          This website is the official employee data of GEM Engserv. We value their contribution in taking GEM to a new height.
        </p>

        <div className="my-12">
          <Link href="/directory" className="px-8 py-4 bg-primary text-black rounded-lg text-xl font-semibold hover:bg-opacity-90 transition-colors">
            Click to view all employees
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-medium mb-6 text-center text-black">Our Values</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span className="font-medium text-black">Customer Focus</span>
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span className="font-medium text-black">Ownership</span>
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span className="font-medium text-black">Integrity</span>
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-.
2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span className="font-medium text-black">Value Creation Through Competence</span>
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span className="font-medium text-black">Respect for Individual</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}