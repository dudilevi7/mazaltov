import type { Metadata } from 'next'
import { Heebo } from 'next/font/google'
import Marketing from '@/components/Marketing'

const heebo = Heebo({
  subsets: ['latin', 'hebrew'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'MazalTov — הגיע הזמן לנהל אירוע ולחסוך',
  description: 'חתונה, בר/ת מצווה, ברית ואפילו חינה. תקציב, ספקים ומתנות במקום אחד.',
}

const Home = () => <Marketing fontClassName={heebo.className} />

export default Home
