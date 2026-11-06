import type { MarketingCopy } from '@/constants/marketing'

interface AboutProps {
  copy: MarketingCopy
}

const About = ({ copy }: AboutProps) => (
  <section id="about" className="scroll-mt-28 border-t border-gray-100 bg-white">
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
      <div>
        <p className="text-sm font-semibold text-blue-600">{copy.about.kicker}</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-snug text-balance sm:text-4xl">{copy.about.title}</h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600">{copy.about.body}</p>
      </div>
      <ul className="grid gap-3">
        {copy.about.points.map((point) => (
          <li
            key={point}
            className="rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-white px-4 py-4 text-base font-medium text-gray-800">
            {point}
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default About
