export default function PrivacyPage() {
  return (
    <div className="container-site py-12 max-w-5xl">

      <h1 className="mb-8 text-4xl font-bold">
        Privacy Policy
      </h1>

      <div className="space-y-8 rounded-xl bg-white p-8 shadow">

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Information We Collect
          </h2>

          <p className="text-gray-600 leading-8">
            We may collect basic information such as your name,
            email address and any details you voluntarily provide
            when contacting us.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Affiliate Disclosure
          </h2>

          <p className="text-gray-600 leading-8">
            WOW BASKET participates in affiliate programs.
            We may earn a commission when you purchase products
            through our affiliate links at no extra cost to you.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Cookies
          </h2>

          <p className="text-gray-600 leading-8">
            We may use cookies to improve your browsing experience
            and understand how visitors use our website.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Contact
          </h2>

          <p className="text-gray-600 leading-8">
            If you have any questions regarding this Privacy Policy,
            please contact us through our Contact page.
          </p>
        </section>

      </div>

    </div>
  );
}