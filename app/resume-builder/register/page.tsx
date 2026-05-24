import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RegisterForm } from '@/components/resume-builder/AuthForm';

export default function ResumeRegisterPage() {
  return (
    <>
      <Header />
      <div className="min-h-[70vh] bg-gradient-to-br from-slate-100 to-blue-50 px-4 py-16">
        <RegisterForm />
      </div>
      <Footer />
    </>
  );
}
