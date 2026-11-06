import type { MarketingCopy } from '@/constants/marketing'

interface RecommendationsProps {
  copy: MarketingCopy
}

const Recommendations = ({ copy }: RecommendationsProps) => (
  <section id="recommendations" className="scroll-mt-28 bg-linear-to-b from-white to-blue-50">
    <div className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-sm font-semibold text-blue-600">{copy.recommendations.kicker}</p>
      <ul className="mt-10 grid gap-6 lg:grid-cols-3">
        {copy.recommendations.items.map((item, index) => (
          <li
            key={item.name || index}
            className="flex flex-col rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/80 motion-safe:animate-rise"
            style={{ animationDelay: `${index * 120}ms` }}>
            <p className="text-base leading-relaxed whitespace-pre-line text-gray-700">{item.quote}</p>
            {item.name && <p className="mt-5 text-sm font-semibold text-blue-600">{item.name}</p>}
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default Recommendations
