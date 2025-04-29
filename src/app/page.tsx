import { redirect } from 'next/navigation';
export default function Home() {
  redirect('/auth/signin'); // or '/auth/signin' if that's your path
}
