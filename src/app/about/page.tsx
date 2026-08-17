export default function AboutPage() {
  return (
    <div className="container-site py-12">

      <h1 className="mb-8 text-4xl font-bold">
        About Us
      </h1>

      <div className="rounded-xl bg-white p-8 shadow">

        <p className="mb-6 text-lg leading-8 text-gray-700">
          Welcome to <strong>WOW BASKET</strong>.
        </p>

        <p className="mb-6 leading-8 text-gray-600">
          WOW BASKET helps you discover the best products from India's
          top online shopping websites in one place.
        </p>

        <p className="mb-6 leading-8 text-gray-600">
          We carefully collect trending products and the latest deals
          from trusted marketplaces like Amazon, Flipkart, Myntra,
          Ajio and Meesho.
        </p>

        <p className="leading-8 text-gray-600">
          Our goal is to save your time and help you make better buying
          decisions.
        </p>

      </div>

    </div>
  );
}