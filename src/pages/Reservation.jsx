import { useState } from "react";
import NavbarMain from "../components/NavBarmain";
import Footer from "../components/Footer";

const Reservation = () => {
  const [guests, setGuests] = useState(2);
  const [selectedTime, setSelectedTime] = useState("7:30 PM");

  const times = [
    "12:30 PM","1:00 PM","1:30 PM","2:00 PM",
    "7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM"
  ];

  return (
    <>
      <NavbarMain />

      {/* HERO */}
      <section className="bg-[#eef0ff] px-10 py-8">
        <h1 className="text-3xl font-bold mb-2">
          Reserve Your Table at Fatima’s Place
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Whether it's a quiet sunset dinner for two or a grand coastal celebration,
          we ensure your experience is as authentic as our flavors.
        </p>
      </section>

      {/* MAIN */}
      <div className="flex gap-10 px-10 py-10">

        {/* LEFT SIDE */}
        <div className="flex-[2]">

          {/* STEP 1 */}
          <h2 className="text-xl font-bold mb-5">1 Reservation Details</h2>

          <div className="flex gap-6 mb-6">

            {/* DATE */}
            <div className="flex flex-col flex-1">
              <label className="text-sm mb-1">Select Date</label>
              <input
                type="date"
                className="border rounded-lg p-3"
              />
            </div>

            {/* GUESTS */}
            <div className="flex flex-col flex-1">
              <label className="text-sm mb-1">Number of Guests</label>
              <div className="flex items-center justify-between border rounded-lg p-3">
                <button onClick={() => setGuests(Math.max(1, guests - 1))}>-</button>
                <span>{guests} Guests</span>
                <button onClick={() => setGuests(guests + 1)}>+</button>
              </div>
            </div>

          </div>

          {/* TIME SLOTS */}
          <h3 className="font-semibold mb-2">Available Time Slots</h3>
          <div className="grid grid-cols-5 gap-3 mb-8">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`p-2 border rounded-lg text-sm ${
                  selectedTime === t
                    ? "bg-[#4a55ff] text-white"
                    : "bg-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* STEP 2 */}
          <h2 className="text-xl font-bold mb-5">2 Enhance Your Booking</h2>

          <div className="flex gap-6 mb-6">

            {/* OCCASION */}
            <div className="flex flex-col flex-1">
              <label className="text-sm mb-1">Type of Occasion</label>
              <select className="border rounded-lg p-3">
                <option>Casual Dining</option>
                <option>Birthday</option>
                <option>Anniversary</option>
              </select>
            </div>

            {/* REQUESTS */}
            <div className="flex flex-col flex-1">
              <label className="text-sm mb-1">Special Requests</label>
              <textarea
                className="border rounded-lg p-3"
                placeholder="Any allergies, dietary preferences..."
              />
            </div>

          </div>

          {/* ADDONS */}
          <h3 className="font-semibold mb-3">Premium Event Add-ons</h3>

          <div className="flex gap-5">

            <div className="flex-1 border rounded-lg p-4">
              <p>🎵 Live Band</p>
              <span className="text-sm text-gray-500">₹5,000</span>
            </div>

            <div className="flex-1 border rounded-lg p-4">
              <p>🎂 Celebration Cake</p>
              <span className="text-sm text-gray-500">₹1,500</span>
            </div>

            <div className="flex-1 border rounded-lg p-4">
              <p>🎉 Table Decoration</p>
              <span className="text-sm text-gray-500">₹1,200</span>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE (SUMMARY) */}
        <div className="flex-1">

          <div className="bg-white rounded-xl shadow p-6 border-t-4 border-[#4a55ff]">
            <h3 className="font-bold mb-4">Booking Summary</h3>

            <p className="text-sm mb-2">
              <strong>Time:</strong> {selectedTime}
            </p>

            <p className="text-sm mb-2">
              <strong>Guests:</strong> {guests}
            </p>

            <button className="mt-5 w-full bg-pink-500 text-white py-3 rounded-lg font-semibold">
              Confirm Reservation
            </button>
          </div>

          {/* HELP BOX */}
          <div className="bg-white rounded-xl shadow p-5 mt-5">
            <h4 className="font-semibold mb-2">Need Help?</h4>
            <p className="text-sm text-gray-500">
              Call us at +91 88 654 3230
            </p>
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default Reservation;