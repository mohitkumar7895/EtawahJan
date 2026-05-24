import Image from 'next/image';
import Link from 'next/link';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const sizes: Record<Size, { box: string; img: number; title: string; tagline: string }> = {
  sm: { box: 'w-10 h-10', img: 40, title: 'text-sm', tagline: 'text-[9px]' },
  md: { box: 'w-14 h-14 sm:w-16 sm:h-16', img: 64, title: 'text-base', tagline: 'text-[10px]' },
  lg: { box: 'w-20 h-20 sm:w-24 sm:h-24', img: 96, title: 'text-lg', tagline: 'text-xs' },
  xl: { box: 'w-24 h-24 sm:w-28 sm:h-28', img: 112, title: 'text-xl', tagline: 'text-sm' },
};

export default function ConverterBrandLogo({
  size = 'md',
  showText = true,
  linkHome = true,
  centered = false,
  hideTextOnMobile = false,
  className = '',
}: {
  size?: Size;
  showText?: boolean;
  linkHome?: boolean;
  centered?: boolean;
  hideTextOnMobile?: boolean;
  className?: string;
}) {
  const s = sizes[size];

  const inner = (
    <div
      className={`flex items-center gap-3 ${centered ? 'flex-col text-center' : ''} ${className}`}
    >
      <div
        className={`${s.box} shrink-0 rounded-2xl bg-white border border-slate-200/80 shadow-md dark:bg-slate-900 dark:border-slate-700 flex items-center justify-center p-1`}
      >
        <Image
          src="/jan-seva-logo-1.png"
          alt="Arpit Jan Seva Kendra Logo"
          width={s.img}
          height={s.img}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showText && (
        <div
          className={`${centered ? 'text-center' : 'min-w-0'} ${hideTextOnMobile ? 'hidden sm:block' : ''}`}
        >
          <p className={`font-extrabold leading-tight text-slate-900 dark:text-white ${s.title}`}>
            Arpit Jan Seva Kendra
          </p>
          <p className={`text-slate-500 dark:text-slate-400 font-medium ${s.tagline}`}>
            सेवा ही धर्म है · File Converter
          </p>
        </div>
      )}
    </div>
  );

  if (linkHome) {
    return (
      <Link href="/file-converter" className="hover:opacity-90 transition-opacity inline-flex">
        {inner}
      </Link>
    );
  }

  return inner;
}
