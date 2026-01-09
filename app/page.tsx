import { redirect } from 'next/navigation';

export default function Home() {
    // We can redirect to login or show a landing page.
    // The user didn't specify a landing page, just a tracking page.
    // Usually the root is the public tracking search or the staff login.
    // For now, let's just hold a place or redirect to login.
    redirect('/login');
}
