/**
 * Shared form + card styles for the admin panel (aligned with Vacancies / Announcements).
 * Use these in primitives or pass to className for selects, file inputs, etc.
 */

export const adminInputClass =
  'w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200';

export const adminTextareaClass = `${adminInputClass} resize-none`;

export const adminSelectClass = `${adminInputClass} cursor-pointer`;

export const adminLabelClass =
  'block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1';

export const adminCardClass =
  'bg-white dark:bg-zinc-900 rounded-xl shadow-md dark:shadow-black/20 p-4 sm:p-6 border border-gray-200/80 dark:border-zinc-800 transition-colors duration-200';

export const adminCardTitleClass =
  'text-lg sm:text-xl font-bold text-gray-900 dark:text-zinc-100 mb-4 sm:mb-6 flex items-center gap-2';

export const adminPrimaryButtonClass =
  'inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg text-sm sm:text-base font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed';

export const adminSecondaryButtonClass =
  'inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border-2 border-gray-300 dark:border-zinc-600 hover:border-gray-400 dark:hover:border-zinc-500 rounded-lg text-sm sm:text-base font-medium text-gray-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

export const adminFileInputClass = `${adminInputClass} file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 dark:file:bg-zinc-800 dark:file:text-zinc-200`;
