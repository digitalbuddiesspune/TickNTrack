const About = () => {
  const pillars = [
    {
      icon: "🧵",
      title: "Premium Build",
      copy: "We partner with verified makers to deliver authentic, durable pieces you can rely on every day."
    },
    {
      icon: "✨",
      title: "Curated Design",
      copy: "Every collection is edited by our style team so you get modern, versatile looks without the guesswork."
    },
    {
      icon: "⚙️",
      title: "Built to Perform",
      copy: "Materials and fit are tested in real life—comfort, longevity, and utility come standard."
    },
    {
      icon: "🤝",
      title: "Service That Stays",
      copy: "Clear updates, fast support, and thoughtful post-purchase care keep you confident after checkout."
    }
  ];

  const values = [
    {
      heading: "Purposeful Collections",
      detail: "Footwear, timepieces, and accessories that move seamlessly from work to weekend."
    },
    {
      heading: "Measured Craft",
      detail: "Quality benchmarks and supplier checks ensure the same standard across every drop."
    },
    {
      heading: "Everyday Ease",
      detail: "Reliable logistics, simple returns, and secure payments make shopping feel effortless."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white px-8 sm:px-12 py-14 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/25 via-slate-900 to-slate-950 opacity-80" />
          <div className="relative space-y-6">
            <p className="text-xs font-semibold tracking-[0.3em] text-cyan-200 uppercase">About TickNTrack</p>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">Built for people who expect more from what they wear.</h1>
            <p className="text-lg text-slate-100/90 max-w-3xl">
              TickNTrack blends craftsmanship with intelligent design. We track every detail—from sourcing to delivery—so you receive pieces that look refined, feel right, and last.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-cyan-200 uppercase tracking-wide">Curated Range</p>
                <p className="text-2xl font-semibold">Footwear · Timepieces · Accessories</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-cyan-200 uppercase tracking-wide">Commitment</p>
                <p className="text-2xl font-semibold">Quality you can see & feel</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-cyan-200 uppercase tracking-wide">Promise</p>
                <p className="text-2xl font-semibold">Service that stays with you</p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold tracking-[0.25em] text-cyan-700 uppercase">Our story</p>
            <h2 className="text-3xl font-semibold leading-tight">A brand shaped by detail, driven by trust.</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              TickNTrack started with a simple belief: premium products should earn their place in your routine. We obsess over materials, fit, and finish, working with trusted manufacturers who share our standards for authenticity and care.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              Each release is intentionally curated—versatile silhouettes, considered hardware, and textures that hold up to daily use. We keep you informed at every step so you always know what to expect.
            </p>
          </div>
          <div className="rounded-3xl border border-cyan-100 bg-white/80 p-8 shadow-xl">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-slate-900">Our vision</h3>
              <p className="text-base text-slate-700 leading-relaxed">
                Make elevated essentials accessible, responsible, and ready for everyday movement. Quality, comfort, and functionality are not optional—they are the baseline for everything we ship.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-sm font-medium">Traceable quality</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-medium">Modern design</span>
                <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-sm font-medium">Comfort-first</span>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold tracking-[0.25em] text-cyan-700 uppercase">What guides us</p>
            <h2 className="text-3xl font-semibold text-slate-900">Consistency, craft, and calm confidence.</h2>
            <p className="text-lg text-slate-700 max-w-3xl mx-auto">
              We remove the noise so you can move through your day with pieces that simply work—reliably, comfortably, and with quiet style.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item) => (
              <div key={item.heading} className="rounded-2xl border border-cyan-100 bg-white p-6 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.heading}</h3>
                <p className="text-slate-700 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pillars */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold tracking-[0.25em] text-cyan-700 uppercase">Why customers choose us</p>
              <h2 className="text-3xl font-semibold text-slate-900">The TickNTrack difference</h2>
            </div>
            <div className="text-sm text-slate-600">Curated by people who wear what they create.</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="flex items-start gap-4 p-6 rounded-2xl border border-slate-200 bg-white shadow-md hover:-translate-y-0.5 hover:shadow-lg transition">
                <div className="text-3xl">{pillar.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{pillar.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="text-center rounded-3xl border border-cyan-100 bg-cyan-50/70 px-8 py-12 shadow-inner">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">Celebrate every move with TickNTrack.</h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto mb-6">
            Whether it is a high-mileage run, a boardroom presentation, or a weekend away, our collections are built to keep up—and to look sharp doing it.
          </p>
          <p className="text-xl font-semibold text-cyan-700 italic tracking-wide">Discover your style. Track your excellence.</p>
        </section>

      </div>
    </div>
  );
};

export default About;