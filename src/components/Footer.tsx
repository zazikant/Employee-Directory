import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white p-8 mt-16">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">REGISTERED OFFICE ADDRESS</h3>
          <p>GEM Engserv Private Ltd.</p>
          <p>A-103, The Great Eastern Chamber, Plot No-28, Sector-11,</p>
          <p>CBD Belapur, Navi Mumbai 400614</p>
        </div>
        <div className="border-t border-gray-700 pt-4 mt-4">
          <p>&copy; {new Date().getFullYear()} GEM Engserv Private Ltd. All Rights Reserved.</p>
          <Link href="https://gemengserv.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            gemengserv.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
