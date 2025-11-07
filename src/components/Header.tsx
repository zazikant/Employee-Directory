

export default function Header() {
  return (
    <header className="bg-secondary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="text-sm">
            For Business Enquiries:
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm">
            +91 77770 16824
          </p>
          <a
            href="mailto:business@gemengserv.com?subject=Interest%20in%20your%20service%20offerings&body=You%20can%20type%20your%20requirement%20here."
            className="text-sm text-primary hover:underline"
          >
            business@gemengserv.com
          </a>
        </div>
      </div>
    </header>
  );
}
