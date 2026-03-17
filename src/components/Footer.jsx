function Footer() {
  return (

    <footer className="bg-gray-900 text-gray-300 py-10 px-10 mt-20">

      <div className="grid md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-white text-lg font-semibold mb-3">
            Fatima's Place
          </h2>
          <p className="text-sm">
            Authentic Goan cuisine in the heart of Vagator.
          </p>
        </div>

        <div>
          <h3 className="text-white mb-2">Explore</h3>
          <p className="text-sm">Menu</p>
          <p className="text-sm">Bookings</p>
        </div>

        <div>
          <h3 className="text-white mb-2">Contact</h3>
          <p className="text-sm">Vagator, Goa</p>
          <p className="text-sm">+91 99999 99999</p>
        </div>

        <div>
          <h3 className="text-white mb-2">Newsletter</h3>
          <input
            className="p-2 rounded w-full text-black"
            placeholder="Your email"
          />
        </div>

      </div>

      <p className="text-center text-xs mt-10">
        © 2026 Fatima's Place
      </p>

    </footer>
  );
}

export default Footer;