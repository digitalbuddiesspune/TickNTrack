const Contact = () => {
  const channels = [
    {
      icon: "📧",
      title: "Email",
      copy: "For product questions, orders, or partnerships.",
      action: (
        <a
          href="mailto:support@tickntrack.com"
          className="text-cyan-700 font-semibold hover:text-cyan-800 break-all"
        >
          support@tickntrack.com
        </a>
      )
    },
    {
      icon: "📞",
      title: "Call",
      copy: "Speak directly with our support specialists.",
      action: (
        <div className="space-y-1 text-slate-900 font-semibold">
          <p>+91 1800 123 4567</p>
          <p>+91 98765 43210</p>
        </div>
      )
    },
    {
      icon: "💬",
      title: "Chat",
      copy: "Need a quick answer? Drop us a message and we will guide you.",
      action: <p className="text-slate-900 font-semibold">Live chat — 9am to 9pm IST</p>
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-14">
        
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white px-8 sm:px-12 py-14 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/25 via-slate-900 to-slate-950 opacity-80" />
          <div className="relative space-y-6">
            <p className="text-xs font-semibold tracking-[0.3em] text-cyan-200 uppercase">Contact</p>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">Let’s build your next TickNTrack experience.</h1>
            <p className="text-lg text-slate-100/90 max-w-3xl">
              Product guidance, delivery updates, partnership ideas—our team responds quickly and keeps you informed at every step.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-semibold">Avg. first reply &lt; 2 hrs</span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-semibold">Global support · IST friendly</span>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <div className="space-y-6">
            <div className="rounded-2xl border border-cyan-100 bg-white p-6 shadow-lg">
              <h2 className="text-3xl font-semibold text-slate-900 mb-3 text-center">TickNTrack Private Limited</h2>
              <p className="text-center text-slate-600">How can we help today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {channels.map((channel) => (
                <div
                  key={channel.title}
                  className="flex flex-col gap-3 p-6 rounded-2xl border border-slate-200 bg-white shadow-md hover:-translate-y-0.5 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{channel.icon}</span>
                    <h3 className="text-xl font-semibold text-slate-900">{channel.title}</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed flex-1">{channel.copy}</p>
                  {channel.action}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📍</span>
                <h3 className="text-xl font-semibold text-slate-900">Office</h3>
              </div>
              <p className="text-slate-700 leading-relaxed">
                123 Fashion Street, Business District, Mumbai – 400001, Maharashtra, India
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-6 shadow-inner">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Support hours</h3>
              <p className="text-slate-700">Monday – Saturday · 9:00 AM to 9:00 PM IST</p>
              <p className="text-slate-600 mt-2">We aim to reply within 2 business hours.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Need a quick resolution?</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li>Share your order ID and contact number.</li>
                <li>Tell us if it is about delivery, fit, or returns.</li>
                <li>Attach photos for faster verification when applicable.</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;
