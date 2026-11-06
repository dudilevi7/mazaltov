import type { MarketingCopy } from '@/constants/marketing'

interface FeaturesProps {
  copy: MarketingCopy
}

const Features = ({ copy }: FeaturesProps) => (
  <section id="features" className="scroll-mt-28 bg-linear-to-b from-blue-600 to-blue-500 text-white">
    <div className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-sm font-semibold text-blue-100">{copy.features.kicker}</p>
      <ol className="mt-10 grid gap-6 lg:grid-cols-3">
        {copy.features.items.map((item, index) => (
          <li
            key={item.id}
            id={item.id}
            className="scroll-mt-28 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15">
            <p className="text-sm font-medium text-blue-100">0{index + 1}</p>
            <h2 className="mt-3 text-2xl font-semibold leading-snug text-balance">{item.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-blue-50">{item.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
)

export default Features
