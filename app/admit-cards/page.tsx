import { redirect } from 'next/navigation';

export default function AdmitCardsPage() {
  redirect('/vacancies?tab=admit');
}
