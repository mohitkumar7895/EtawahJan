/**
 * Type definitions for the Application Letter Maker.
 *
 * Architecture:
 *   • A "profile" is the citizen-level data you fill ONCE
 *     (name, father's name, address, mobile, etc.) and which
 *     auto-fills into every application body via {{placeholders}}.
 *   • A "template" is one of 50+ pre-written application letters
 *     covering daily Sarkari / School / Bank / Office / Property
 *     scenarios. Each template lists the extra fields it needs
 *     ON TOP of the profile (e.g. leave dates for a leave letter).
 *   • The renderer substitutes {{name}} / {{leaveFrom}} / etc. in
 *     the body to produce the final letter.
 *
 * Bilingual model:
 *   Every user-facing string (recipient, subject, body, closing)
 *   is stored in BOTH professional English and Hindi (Devanagari).
 *   The editor lets the user pick at render time and the PDF
 *   generator embeds Noto Sans Devanagari when Hindi is selected.
 */

export type ApplicationCategory =
  | 'sarkari'
  | 'school'
  | 'bank'
  | 'office'
  | 'property'
  | 'electricity'
  | 'misc';

export type Language = 'en' | 'hi';

/** Bilingual single string. */
export interface LocalizedString {
  en: string;
  hi: string;
}

/** Bilingual multi-line block (recipient, address etc.). */
export interface LocalizedLines {
  en: string[];
  hi: string[];
}

export interface ApplicationField {
  /** Variable name used inside the template body, e.g. "leaveFrom". */
  id: string;
  /** Human label shown in the form (kept English for compactness). */
  label: string;
  /** Optional helper text under the input. */
  hint?: string;
  /** Input type — text, textarea (multi-line), date, number, tel. */
  type: 'text' | 'textarea' | 'date' | 'number' | 'tel';
  /** Required to render a complete letter? */
  required?: boolean;
  /** Pre-filled default when the field is left blank. */
  default?: string;
  /** Rows for textarea inputs. */
  rows?: number;
}

export interface ApplicationTemplate {
  /** Stable URL slug, e.g. "income-certificate". */
  slug: string;
  /** English title shown on cards / list. */
  titleEn: string;
  /** Hindi (Devanagari) title shown beside the English. */
  titleHi: string;
  category: ApplicationCategory;
  /** One-line summary for cards / search results. */
  description: string;
  /** Search keywords (Hindi + English mixed). */
  keywords: string[];

  /**
   * "Sewa mein" block — 2 to 4 lines naming the recipient.
   * Lines may include {{placeholders}} too, e.g. {{tehsil}}.
   */
  recipientLines: LocalizedLines;

  /** Subject line (without the leading "Subject:" / "विषय:" prefix). */
  subject: LocalizedString;

  /** The main body — paragraphs separated by blank lines. */
  body: LocalizedString;

  /** Extra fields beyond the profile this template needs. */
  fields: ApplicationField[];

  /**
   * Closing line above the signature.
   * Default: "Yours faithfully" / "आपका विश्वासपात्र".
   */
  closing?: LocalizedString;
}

/**
 * Persistent citizen profile saved in localStorage. All fields are
 * optional — the editor surfaces missing ones inline so users can
 * fill incrementally over multiple visits without losing progress.
 */
export interface CitizenProfile {
  fullName?: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: string; // ISO yyyy-mm-dd
  aadhaarLast4?: string;
  panNumber?: string;

  mobile?: string;
  altMobile?: string;
  email?: string;

  /** Multi-line address — house no., street, mohalla. */
  address?: string;
  village?: string;
  post?: string;
  tehsil?: string;
  district?: string;
  state?: string;
  pincode?: string;

  /** Optional: occupation / designation, used in office letters. */
  occupation?: string;
  /** Used in school/college templates. */
  schoolName?: string;
  className?: string;
  rollNumber?: string;
  /** Used in bank templates. */
  bankName?: string;
  bankBranch?: string;
  accountNumber?: string;
}
