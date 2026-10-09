// Visa guides keyed by objective, then destination country id.
// Fees and timelines are indicative and change often — the UI always links to the official source.
export const DATA_AS_OF = '2025';

const visitUk = {
  visa: 'Standard Visitor visa',
  fee: '£127 for 6 months (2-, 5- and 10-year visas cost more)',
  processing: 'About 3 weeks after biometrics',
  stay: 'Up to 6 months per visit',
  requirements: [
    'Invitation letter from your host with a copy of their passport or UK residence permit',
    'Host’s proof of address and evidence of space if you will stay with them',
    'Evidence of your job or business and approved leave',
    'Proof you can fund the trip yourself, or your host’s sponsorship documents',
  ],
  tips: [
    'Make sure the purpose of your trip is the same on the form, in the invitation letter and in your cover letter.',
    'Funds should match your income. Unexplained large deposits are a leading cause of refusals.',
    'You cannot work on this visa, and you can study for no more than 30 days.',
  ],
};

const visitUs = {
  visa: 'B-1/B-2 Visitor visa',
  fee: '$185 MRV fee (additional fees introduced by 2025 U.S. legislation may apply)',
  processing: 'Depends on the interview wait time, which can be many months in Lagos and Abuja',
  stay: 'Set by the officer at the port of entry',
  requirements: [
    'DS-160 confirmation page and interview appointment letter',
    'MRV fee payment receipt',
    'Evidence of strong ties to Nigeria (job, business, family, property)',
    'Evidence of purpose: invitation, conference registration or business letter',
  ],
  tips: [
    'Decisions are made mostly at the interview, so answer briefly, honestly and confidently.',
    'Since 2025 most U.S. non-immigrant visas for Nigerians are single-entry with short validity. Plan your trips around this.',
    'A 214(b) refusal means you did not show strong enough ties. Only reapply once your circumstances have changed.',
  ],
};

const visitCanada = {
  visa: 'Visitor visa (Temporary Resident Visa)',
  fee: 'CAD 100 + CAD 85 biometrics',
  processing: 'Varies widely. Check the IRCC processing-times tool',
  stay: 'Usually up to 6 months',
  requirements: [
    'Letter explaining the purpose of your travel',
    'Invitation letter and host’s proof of status in Canada (if visiting someone)',
    'Proof of income and bank statements',
    'Family information form and travel history',
  ],
  tips: [
    'IRCC assesses whether you will leave at the end of your stay, so make your ties clear.',
    'Add a short letter of explanation for any weak point, such as a previous refusal.',
  ],
};

const visitSchengen = {
  visa: 'Schengen short-stay (Type C) visa',
  fee: '€90',
  processing: 'Usually 15 calendar days, up to 45 in some cases',
  stay: 'Up to 90 days in any 180-day period',
  requirements: [
    'Travel medical insurance with at least €30,000 cover, valid across Schengen',
    'Flight reservation and accommodation details',
    'Formal invitation (e.g. Verpflichtungserklärung for Germany, attestation d’accueil for France) if hosted',
    'Bank statements and job or business evidence',
  ],
  tips: [
    'Apply to the country where you will spend the most time.',
    'You can apply up to 6 months before travel, but no later than 15 days before.',
    'Poland, Czechia, Hungary and Romania are all Schengen members. For short visits there you need a Schengen visa from that country’s embassy.',
  ],
};

const visitJapan = {
  visa: 'Temporary Visitor (short-term stay) visa',
  fee: 'Small fee, usually about the naira equivalent of ¥3,000 for single entry (check the embassy)',
  processing: 'About 5 working days after acceptance, longer if referred to Tokyo',
  stay: '15, 30 or 90 days',
  requirements: [
    'Invitation letter and letter of guarantee from your host or company in Japan, with their residence or company documents',
    'Day-by-day schedule of your stay (taikizai yoteihyo)',
    'Bank statements and employment letter or business documents',
    'Flight reservation and accommodation details',
  ],
  tips: [
    'Japan expects a detailed, realistic schedule. Vague plans are a common reason for delays.',
    'Your host’s documents must be originals and recently issued.',
  ],
};

const visitKorea = {
  visa: 'Short-term visit visa (C-3)',
  fee: 'About US$40 equivalent for single entry (check the embassy)',
  processing: 'Often 2 weeks or more',
  stay: 'Up to 90 days',
  requirements: [
    'Invitation letter and the inviter’s ID or business registration (for family or business visits)',
    'Bank statements showing a healthy balance, and an employment certificate or business documents',
    'Flight reservation, hotel booking and itinerary',
    'Previous travel history, especially to OECD countries',
  ],
  tips: [
    'Korea scrutinises applications from Nigeria closely, so submit complete, consistent and verifiable documents.',
    'Travel history to countries such as the UK, US, Canada or Schengen states strengthens your application.',
  ],
};

const visitChina = {
  visa: 'Family visit (Q2) / Business (M) visa',
  fee: 'Varies by visa and entries (see the visa centre fee table)',
  processing: 'About 4 working days (express options available)',
  stay: 'Usually 30–60 days per entry',
  requirements: [
    'Online application form confirmation and passport photo',
    'Invitation letter from a relative in China (Q2) or a Chinese company (M), with a copy of the inviter’s ID',
    'Round-trip flight reservation and accommodation details',
    'Bank statements and employment letter',
  ],
  tips: ['Make sure the invitation letter includes your full details, the purpose and dates of travel, and the inviter’s signature.'],
};

const tourism = (base, extra) => ({
  ...base,
  requirements: [
    'Day-by-day itinerary showing the places you will visit',
    'Hotel bookings for the whole stay',
    ...base.requirements.filter((r) => !/^(invitation|host|formal invitation)/i.test(r)),
  ],
  tips: [...(extra || []), ...base.tips],
});

export const guides = {
  visit: {
    uk: visitUk,
    us: visitUs,
    canada: visitCanada,
    schengen: visitSchengen,
    japan: visitJapan,
    korea: visitKorea,
    china: visitChina,
  },

  tourism: {
    uk: { ...tourism(visitUk), visa: 'Standard Visitor visa (tourism)' },
    schengen: tourism(visitSchengen, ['A first Schengen visa is often valid only for your trip dates. Using it properly helps you get longer visas later.']),
    us: tourism(visitUs),
    canada: tourism(visitCanada),
    japan: { ...tourism(visitJapan), visa: 'Temporary Visitor visa (tourism)' },
    korea: { ...tourism(visitKorea, ['Book through a Korean-registered travel agency if you want a group or package tour visa.']), visa: 'Short-term tourist visa (C-3-9)' },
    china: {
      ...tourism(visitChina),
      visa: 'Tourist (L) visa',
      requirements: [
        'Online application form confirmation and passport photo',
        'Round-trip flight reservation and hotel bookings for the whole stay, or an invitation letter if staying with someone',
        'Day-by-day itinerary',
        'Bank statements and employment letter',
      ],
    },
  },

  study: {
    uk: {
      visa: 'Student visa',
      fee: '£524 + Immigration Health Surcharge (£776 per year of study)',
      processing: 'About 3 weeks after biometrics',
      stay: 'Length of your course plus a short period after it ends',
      requirements: [
        'Confirmation of Acceptance for Studies (CAS) from a licensed sponsor',
        'Maintenance funds held for 28 consecutive days: about £1,483/month in London or £1,136/month elsewhere (up to 9 months), plus unpaid tuition',
        'TB test certificate from an approved clinic in Nigeria',
        'Academic documents listed on your CAS',
        'English proof (IELTS for UKVI, or as assessed by your university)',
        'ATAS certificate if your course needs one',
      ],
      tips: [
        'If you use your parents’ funds, include your birth certificate and a parental consent letter.',
        'Since January 2024, most taught master’s students cannot bring dependants.',
        'The Graduate Route lets you stay and work after your degree. Check its current length.',
      ],
    },
    canada: {
      visa: 'Study permit',
      fee: 'CAD 150 + CAD 85 biometrics',
      processing: 'Varies. Check the IRCC processing times and apply early',
      stay: 'Length of your program plus 90 days',
      requirements: [
        'Letter of acceptance from a Designated Learning Institution (DLI)',
        'Provincial/Territorial Attestation Letter (PAL/TAL) for most applicants',
        'Proof of funds: first-year tuition plus living costs (about CAD 22,895 for a single applicant as of 2025)',
        'Immigration medical exam with an IRCC panel physician',
        'Study plan explaining your program choice',
      ],
      tips: [
        'Canada limits new study permits, so apply as soon as you have your LOA and PAL.',
        'Show clearly where your funds come from (sponsor income, business, savings history).',
        'Your program should make sense given your academic and career background.',
      ],
    },
    us: {
      visa: 'F-1 Student visa',
      fee: '$185 MRV + $350 SEVIS I-901 fee',
      processing: 'Depends on interview availability. Student slots open up ahead of the autumn semester',
      stay: 'Duration of status (while you remain enrolled)',
      requirements: [
        'Form I-20 from a SEVP-certified school',
        'SEVIS I-901 fee receipt',
        'Proof of funds matching your I-20 (scholarship letters, sponsor statements)',
        'Transcripts, WAEC/NECO and required test scores (TOEFL/IELTS/Duolingo, SAT/GRE/GMAT)',
      ],
      tips: [
        'Be ready to explain your choice of course and school, how you will pay, and your plans after you graduate.',
        'You can get the visa up to 365 days before your program starts, but you can only enter the U.S. 30 days before.',
      ],
    },
    germany: {
      visa: 'National (D) Student visa',
      fee: '€75',
      processing: 'Several weeks to months, as appointment waiting lists are long',
      stay: 'Initial visa, then a residence permit for your full studies',
      requirements: [
        'University admission letter (Zulassungsbescheid) or conditional admission',
        'Blocked account (Sperrkonto) with €11,904 for one year (2025 rate), a formal obligation letter or a scholarship',
        'Health insurance',
        'Proof of language skills (German or English, depending on the programme)',
        'Recognised academic certificates (check uni-assist / anabin)',
      ],
      tips: [
        'Many public universities charge little or no tuition, but you still need the blocked account.',
        'Book your visa appointment as soon as you apply to universities, because slots are scarce.',
      ],
    },
    ireland: {
      visa: 'Study (D) visa',
      fee: '€60 single entry',
      processing: 'About 8 weeks',
      stay: 'Course duration, plus the Stay Back option for graduates',
      requirements: [
        'Letter of acceptance to a full-time course on the Interim List of Eligible Programmes (ILEP)',
        'Evidence of tuition fees paid',
        'Proof of access to at least €10,000 for living costs',
        'Private medical insurance',
        'Explanation of any gaps in your education history',
      ],
      tips: ['Graduates can apply to stay on and look for work under the Third Level Graduate Programme.'],
    },
    australia: {
      visa: 'Student visa (subclass 500)',
      fee: 'AUD 2,000 (from July 2025)',
      processing: 'Varies from weeks to months',
      stay: 'Length of your course',
      requirements: [
        'Confirmation of Enrolment (CoE)',
        'Answers to the Genuine Student (GS) questions',
        'Overseas Student Health Cover (OSHC)',
        'Proof of funds for tuition, living costs (around AUD 29,710 per year) and travel',
        'English test (IELTS, PTE or TOEFL)',
      ],
      tips: ['Give specific, well-researched GS answers about why you chose this course, this provider and Australia.'],
    },
    poland: {
      visa: 'National (D) Student visa',
      fee: 'About €80',
      processing: 'Up to about 15 working days after your appointment, but appointment waits can be long',
      stay: 'Up to 1 year, then a temporary residence permit for further study',
      requirements: [
        'Admission letter from an accredited Polish university',
        'Proof that the first year’s tuition has been paid',
        'Proof of funds for living costs and return travel',
        'Proof of the language of instruction (recent reforms expect around B2 level)',
        'Health insurance and proof of accommodation',
      ],
      tips: [
        'Poland tightened checks on student visas after 2023. Choose a well-known public or accredited university and be ready to explain your choice.',
        'English-taught programmes and medical schools are popular and relatively affordable.',
      ],
    },
    czechia: {
      visa: 'Long-term visa for study',
      fee: 'CZK 2,500',
      processing: 'Up to 60 days (often faster for university students)',
      stay: 'Up to 1 year, then a long-term residence permit',
      requirements: [
        'Confirmation of admission from a Czech university',
        'Proof of funds at the level set by Czech law (based on the subsistence minimum)',
        'Proof of accommodation',
        'Travel medical insurance',
        'Police character certificate (superlegalised)',
      ],
      tips: [
        'Studying in Czech at public universities is free. English-taught programmes charge tuition.',
        'Universities can register you for a fast-track student scheme. Ask your admissions office.',
      ],
    },
    hungary: {
      visa: 'Residence permit for study purposes',
      fee: 'About €110',
      processing: 'Up to about 70 days',
      stay: 'Length of your programme (issued in yearly or multi-year periods)',
      requirements: [
        'Letter of admission from a Hungarian higher education institution',
        'Proof of funds or a scholarship (e.g. Stipendium Hungaricum)',
        'Proof of accommodation in Hungary',
        'Health insurance',
      ],
      tips: [
        'Stipendium Hungaricum is a government scholarship that covers tuition, a monthly stipend and housing support. Check whether Nigeria is on this year’s partner list.',
        'Hungarian medical and engineering degrees taught in English are well regarded.',
      ],
    },
    romania: {
      visa: 'Long-stay study visa (D/SD)',
      fee: 'About €120',
      processing: 'Up to about 45 days',
      stay: 'Visa for 90 days, then a residence permit for study',
      requirements: [
        'Letter of acceptance to studies issued by the Romanian Ministry of Education',
        'Proof that tuition for at least one year has been paid',
        'Proof of funds for living costs',
        'Medical insurance and proof of accommodation',
        'Police character certificate',
      ],
      tips: [
        'Romanian medical and dental programmes in English are popular with Nigerian students, and tuition is lower than in Western Europe.',
        'Apply for the Ministry acceptance letter early. It can take several months.',
      ],
    },
    japan: {
      visa: 'Student visa (College Student)',
      fee: 'Small fee, usually about the naira equivalent of ¥3,000 (check the embassy)',
      processing: 'Certificate of Eligibility: 1–3 months; visa: about 5 working days',
      stay: 'Length of your course (granted in periods of up to 4 years 3 months)',
      requirements: [
        'Certificate of Eligibility (CoE), which your Japanese school applies for on your behalf',
        'Admission letter from the university or Japanese language school',
        'Proof of funds for tuition and living costs (or a scholarship letter, e.g. MEXT)',
        'Academic certificates and transcripts',
        'Japanese language ability (e.g. JLPT) for Japanese-taught courses',
      ],
      tips: [
        'The Japanese Government (MEXT) Scholarship can be applied for through the Embassy of Japan in Nigeria. It covers tuition, a monthly stipend and airfare.',
        'Many universities offer English-taught degrees, and language schools are a common first step.',
      ],
    },
    korea: {
      visa: 'Student visa (D-2 degree / D-4 language course)',
      fee: 'About US$40–60 equivalent (check the embassy)',
      processing: 'Often 2–4 weeks',
      stay: 'Length of your programme',
      requirements: [
        'Certificate of Admission from a Korean university or language institute',
        'Proof of funds (degree students are often asked for around US$20,000, less for language courses), or a scholarship letter',
        'Academic certificates verified or consular-confirmed for use in Korea',
        'Study plan and, where applicable, a TOPIK (Korean) or English test score',
      ],
      tips: [
        'The Global Korea Scholarship (GKS) is fully funded and includes a year of Korean language study. Check whether Nigeria is on this year’s list.',
        'Banks may need to issue a balance certificate in a specific format, so ask the university for its template.',
      ],
    },
    china: {
      visa: 'Student visa (X1 over 180 days / X2 up to 180 days)',
      fee: 'Varies (see the visa centre fee table)',
      processing: 'About 4 working days after submission',
      stay: 'X1: convert to a residence permit within 30 days of arrival',
      requirements: [
        'Admission notice from a Chinese university',
        'JW201 or JW202 visa application form for study, issued by the university',
        'Foreigner Physical Examination Form (for X1)',
        'Passport, photo and online application confirmation',
      ],
      tips: [
        'The Chinese Government Scholarship (CSC) is widely awarded to Nigerian students. Apply through the Chinese Embassy or directly to universities.',
        'Many programmes, including medicine (MBBS) and engineering, are taught in English.',
      ],
    },
  },

  exchange: {
    uk: {
      visa: 'Standard Visitor (up to 6 months) or Student visa (longer)',
      fee: '£127 (visitor) or £524 + Immigration Health Surcharge (student)',
      processing: 'About 3 weeks after biometrics',
      stay: 'Up to 6 months as a visitor; longer exchanges need a Student visa',
      requirements: [
        'Acceptance letter from the UK host institution (a CAS if you are on a Student visa)',
        'Nomination letter from your Nigerian university and proof you will return to complete your degree',
        'Proof of funds or a scholarship/exchange grant letter',
        'TB test certificate if you will stay more than 6 months',
      ],
      tips: ['Exchanges of up to 6 months at an accredited institution can be done on a Standard Visitor visa. You cannot work on it.'],
    },
    us: {
      visa: 'J-1 Exchange Visitor visa',
      fee: '$185 MRV fee + $220 SEVIS I-901 fee',
      processing: 'Depends on interview wait time',
      stay: 'Programme dates on your DS-2019, plus a 30-day grace period',
      requirements: [
        'Form DS-2019 from your US programme sponsor (university or exchange organisation)',
        'SEVIS I-901 fee receipt',
        'Proof of funding (sponsor, scholarship or personal funds) matching the DS-2019',
        'Evidence of ties to Nigeria, such as an enrolment letter and a plan to return',
      ],
      tips: [
        'Some J-1 exchanges carry a 2-year home-residence requirement (212(e)). Check your DS-2019 and visa annotation.',
        'Programmes such as Fulbright and the Global UGRAD exchange are funded by the U.S. government.',
      ],
    },
    germany: {
      visa: 'National (D) Student visa (over 90 days) or Schengen visa (up to 90 days)',
      fee: '€75 (national) / €90 (Schengen)',
      processing: 'Weeks to months, depending on appointment availability',
      stay: 'Length of the exchange semester(s)',
      requirements: [
        'Acceptance letter from the German host university (e.g. under an Erasmus+ or DAAD partnership)',
        'Nomination from your Nigerian university and a learning agreement',
        'Proof of funds: a scholarship letter or blocked account',
        'Health insurance',
      ],
      tips: ['Erasmus+ International Credit Mobility funds exchanges between EU and partner-country universities. Ask your international office about existing partnerships.'],
    },
    canada: {
      visa: 'Study permit (over 6 months) or Visitor visa (6 months or less)',
      fee: 'CAD 150 (study permit) or CAD 100 (visitor) + CAD 85 biometrics',
      processing: 'Varies. Check the IRCC processing times',
      stay: 'Length of the exchange',
      requirements: [
        'Letter of acceptance from the Canadian institution stating the exchange dates',
        'Letter from your Nigerian university confirming the exchange and that you will return',
        'Proof of funds for living costs',
        'Biometrics, and a medical exam if required',
      ],
      tips: ['Exchanges of 6 months or less generally don’t need a study permit, but you still need a visitor visa.'],
    },
    japan: {
      visa: 'Student visa (exchange)',
      fee: 'Small fee, usually about the naira equivalent of ¥3,000',
      processing: 'Certificate of Eligibility: 1–3 months; visa: about 5 working days',
      stay: 'Length of the exchange (typically 6–12 months)',
      requirements: [
        'Certificate of Eligibility arranged by the Japanese host university',
        'Exchange acceptance letter and nomination from your Nigerian university',
        'Proof of funds or scholarship (e.g. JASSO Student Exchange Support Program)',
      ],
      tips: ['JASSO scholarships support short-term exchange students at Japanese partner universities. Ask your international office.'],
    },
    korea: {
      visa: 'Exchange student visa (D-2-6)',
      fee: 'About US$40–60 equivalent',
      processing: 'Often 2–4 weeks',
      stay: 'Length of the exchange',
      requirements: [
        'Certificate of Admission as an exchange student from the Korean university',
        'Exchange agreement or nomination letter from your Nigerian university',
        'Proof of funds or a scholarship letter',
        'Verified academic documents',
      ],
      tips: ['Exchange students usually pay tuition at home under the partnership agreement. Make sure your letters state this.'],
    },
    china: {
      visa: 'Student visa (X2 up to 180 days / X1 longer)',
      fee: 'Varies (see the visa centre fee table)',
      processing: 'About 4 working days',
      stay: 'Length of the exchange',
      requirements: [
        'Admission notice from the Chinese host university',
        'JW202 form (or JW201 for scholarship holders)',
        'Exchange nomination letter from your Nigerian university',
        'Physical examination form for exchanges over 180 days',
      ],
      tips: ['Confucius Institute and CSC scholarships fund many short exchange and language programmes in China.'],
    },
  },

  work: {
    uk: {
      visa: 'Skilled Worker visa',
      fee: 'From about £769 (up to 3 years) + Immigration Health Surcharge (£1,035 per year)',
      processing: 'About 3 weeks after biometrics',
      stay: 'Up to 5 years, renewable',
      requirements: [
        'Certificate of Sponsorship (CoS) from a Home Office-licensed employer (check the official register of licensed sponsors)',
        'A job at the required skill level, paying at least the salary threshold (generally £41,700 or the going rate since July 2025, with some exceptions)',
        'English at level B1',
        '£1,270 in maintenance funds, unless your sponsor certifies maintenance',
        'TB test, plus a criminal record certificate for some roles',
      ],
      tips: [
        'It is illegal to charge you for a CoS. Anyone selling one is running a scam.',
        'The UK closed overseas recruitment for care worker roles in July 2025.',
      ],
    },
    canada: {
      visa: 'Employer-specific work permit (LMIA)',
      fee: 'CAD 155 + CAD 85 biometrics',
      processing: 'Varies by stream',
      stay: 'Tied to your job offer',
      requirements: [
        'Job offer letter and signed contract',
        'LMIA number, or an LMIA-exempt offer number from your employer',
        'Proof of qualifications and work experience',
        'Police certificate and medical exam where required',
      ],
      tips: [
        'Real Canadian employers do not sell LMIAs. Paying for a job offer is a red flag.',
        'If you have skilled experience, also look at Express Entry under Relocation.',
      ],
    },
    us: {
      visa: 'H-1B and other work visas',
      fee: 'The employer pays most petition fees. You pay the visa application fee at the interview',
      processing: 'H-1B uses an annual lottery, with registration each March',
      stay: 'Up to 3 years, extendable',
      requirements: [
        'Approved I-129 petition from a U.S. employer (I-797 approval notice)',
        'Bachelor’s degree or equivalent in a related field',
        'Credential evaluation of your Nigerian degree',
        'Employment contract and résumé',
      ],
      tips: [
        'A 2025 proclamation added a very large employer fee for many new H-1B petitions, which makes sponsorship harder. Confirm the current rules.',
        'Other routes include O-1 (extraordinary ability), L-1 (intra-company transfer) and the EB-2 NIW green card.',
      ],
    },
    germany: {
      visa: 'EU Blue Card / Skilled Worker visa / Opportunity Card',
      fee: '€75',
      processing: 'Weeks to months, depending on appointment availability',
      stay: 'Up to 4 years (Blue Card), or up to 1 year to find work (Opportunity Card)',
      requirements: [
        'Job offer or contract (the Blue Card has a salary threshold, which is lower for shortage occupations)',
        'Recognised degree or vocational qualification (anabin / ZAB)',
        'For the Opportunity Card: points for qualifications, German/English skills, experience and age, plus proof of funds',
        'Health insurance',
      ],
      tips: [
        'The Opportunity Card (Chancenkarte) lets you live in Germany for up to a year while you look for skilled work.',
        'Even basic German (A2/B1) greatly improves your job prospects.',
      ],
    },
    poland: {
      visa: 'Work permit + National (D) work visa',
      fee: 'About €80 for the visa (your employer pays the work permit fee)',
      processing: 'Work permit: 1–3 months; visa: depends on appointment availability',
      stay: 'Up to 1 year on the visa, then a temporary residence and work permit (up to 3 years)',
      requirements: [
        'Work permit (zezwolenie na pracę, usually type A) obtained by your Polish employer from the voivode office',
        'Signed employment contract or binding job offer',
        'Proof of qualifications and experience for the role',
        'Health insurance and proof of accommodation',
      ],
      tips: [
        'Fake Polish work permits are a common scam. Ask for the case number and check it with the issuing voivodeship office.',
        'After 5 years of legal residence you can apply for EU long-term residence.',
        'The EU Blue Card is also available for degree holders with a high-salary offer.',
      ],
    },
    czechia: {
      visa: 'Employee Card (zaměstnanecká karta) / EU Blue Card',
      fee: 'CZK 2,500',
      processing: 'Usually 60–90 days',
      stay: 'Up to 2 years, renewable',
      requirements: [
        'A job registered in the Czech central register of vacancies that foreigners can fill',
        'Signed employment contract for at least 3 months, meeting the minimum wage',
        'Proof of qualifications (recognised where the job needs it)',
        'Proof of accommodation',
        'Police character certificate (legalised)',
      ],
      tips: [
        'The Employee Card is both your residence and work permit. Your employer must be named on it, and changing jobs must be reported.',
        'Nigerian public documents usually need superlegalisation for Czech use. Start this early.',
      ],
    },
    hungary: {
      visa: 'Residence permit for employment / EU Blue Card',
      fee: 'About €110 for the residence permit application',
      processing: 'Up to about 70 days',
      stay: 'Up to 2–3 years, renewable',
      requirements: [
        'Employment contract or binding offer from a Hungarian employer',
        'Employer’s confirmation that the vacancy could not be filled locally (where required)',
        'Proof of qualifications and experience',
        'Proof of accommodation and health insurance',
      ],
      tips: [
        'Hungary has limited and changed its guest-worker schemes since 2024. Check that your employer is using a route that is currently open.',
        'Never pay a recruiter for a job offer. Hungarian employers register vacancies with the authorities.',
      ],
    },
    romania: {
      visa: 'Work authorisation + long-stay employment visa (D/AM)',
      fee: 'About €120 for the visa (your employer pays for the work authorisation)',
      processing: 'Work authorisation: about 30 days; visa: up to about 45 days',
      stay: 'Visa for 90 days, then a residence permit tied to your contract',
      requirements: [
        'Work authorisation (aviz de muncă) obtained by your employer from the General Inspectorate for Immigration (IGI)',
        'Signed employment contract',
        'Proof of accommodation and medical insurance',
        'Police character certificate',
      ],
      tips: [
        'Romania sets a yearly quota for non-EU workers. Make sure your employer’s application falls within it.',
        'Agents demanding large fees for "Romanian work visas" are a common scam. The employer pays for the work authorisation.',
      ],
    },
    australia: {
      visa: 'Skills in Demand visa (subclass 482)',
      fee: 'Several thousand AUD (check the current charge)',
      processing: 'Weeks to months',
      stay: 'Up to 4 years',
      requirements: [
        'Nomination by an approved Australian sponsor',
        'Skills assessment where required',
        'At least 1 year of relevant work experience',
        'English test (IELTS or PTE)',
      ],
      tips: ['Some streams can lead to permanent residence after a period of sponsored employment.'],
    },
    japan: {
      visa: 'Work visa (e.g. Engineer/Specialist in Humanities/International Services) or Specified Skilled Worker',
      fee: 'Small fee, usually about the naira equivalent of ¥3,000',
      processing: 'Certificate of Eligibility: 1–3 months; visa: about 5 working days',
      stay: '1, 3 or 5 years, renewable',
      requirements: [
        'Job offer and Certificate of Eligibility obtained by your Japanese employer',
        'University degree related to the job, or about 10 years of relevant experience',
        'For Specified Skilled Worker: a pass in the sector skills test and Japanese language (around JLPT N4)',
        'Employment contract stating salary and duties',
      ],
      tips: [
        'Learning Japanese greatly widens your options. Many skilled-worker routes require it.',
        'The Highly Skilled Professional points system offers faster permanent residence for high earners and graduates.',
      ],
    },
    korea: {
      visa: 'Professional employment visa (E-7) / Job-seeker visa (D-10)',
      fee: 'About US$40–60 equivalent',
      processing: 'Several weeks (the employer usually obtains a visa issuance number first)',
      stay: 'Up to 3 years, renewable',
      requirements: [
        'Employment contract with a Korean company and the employer’s sponsorship documents',
        'Degree and/or experience matching the E-7 occupation list',
        'Verified academic certificates and a police character certificate',
        'For D-10: a degree (often from a Korean university) and enough points to qualify',
      ],
      tips: [
        'Nigeria is not part of Korea’s Employment Permit System (E-9) for low-skilled work, so be wary of agents offering "factory jobs in Korea".',
        'Graduates of Korean universities can switch to D-10 to look for work after graduating.',
      ],
    },
    china: {
      visa: 'Work (Z) visa',
      fee: 'Varies (see the visa centre fee table)',
      processing: 'Work permit notice: weeks; visa: about 4 working days',
      stay: 'Convert to a work-type residence permit within 30 days of arrival',
      requirements: [
        'Notification Letter of Foreigner’s Work Permit, obtained by your Chinese employer',
        'Bachelor’s degree and usually 2+ years of relevant experience',
        'Police character certificate and degree certificate, authenticated for use in China',
        'Medical examination',
      ],
      tips: ['Never enter China on a tourist or business visa to work. Working without a Z visa and work permit can lead to fines and deportation.'],
    },
  },

  relocation: {
    canada: {
      visa: 'Express Entry (Federal Skilled Worker) & Provincial Nominee Programs',
      fee: 'About CAD 950 processing + CAD 575 right of PR fee per adult',
      processing: 'About 6 months after you are invited to apply (ITA)',
      stay: 'Permanent residence',
      requirements: [
        'Educational Credential Assessment (ECA), e.g. from WES, for your Nigerian degree',
        'Language test: IELTS General or CELPIP (higher scores raise your CRS)',
        'At least 1 year of continuous skilled work experience, with detailed reference letters',
        'Proof of settlement funds (unless you have a valid job offer)',
        'Police certificates and medical exams after your ITA',
      ],
      tips: [
        'Your Comprehensive Ranking System (CRS) score decides whether you are invited. Use the official CRS calculator.',
        'A provincial nomination adds 600 CRS points.',
        'Category-based draws (e.g. healthcare, French speakers) can lower the score you need.',
      ],
    },
    australia: {
      visa: 'Skilled Independent (189) / Skilled Nominated (190)',
      fee: 'Several thousand AUD for the main applicant (check current pricing)',
      processing: 'Months after you are invited',
      stay: 'Permanent residence',
      requirements: [
        'Positive skills assessment from the relevant assessing authority',
        'At least 65 points on the points test',
        'Competent English (IELTS or PTE). Higher scores earn more points',
        'Expression of Interest (EOI) lodged in SkillSelect',
        'Age under 45 when invited',
      ],
      tips: ['Invitations usually go to applicants with well above the minimum points. Improving your English score is often the quickest boost.'],
    },
    uk: {
      visa: 'Skilled Worker / Global Talent → Indefinite Leave to Remain',
      fee: 'Visa fees for each stage plus the ILR fee',
      processing: 'Long-term route',
      stay: 'Settlement after a qualifying period',
      requirements: [
        'A qualifying visa (Skilled Worker, Global Talent, Family, etc.)',
        'Continuous lawful residence (5 years for most routes; the government has proposed making it longer)',
        'Life in the UK test and English at B1',
        'A clean immigration and criminal record',
      ],
      tips: ['The UK has no direct PR visa. Most people settle by first moving on a work or family visa.'],
    },
    germany: {
      visa: 'EU Blue Card / Skilled Worker → Settlement permit',
      fee: 'Visa and residence permit fees at each stage',
      processing: 'Long-term route',
      stay: 'Permanent settlement',
      requirements: [
        'EU Blue Card or skilled worker residence permit',
        'Pension contributions for the required period (as little as 21 months for Blue Card holders with B1 German)',
        'German language skills',
        'Secure income and accommodation',
      ],
      tips: ['The Opportunity Card can be your first step if you do not have a job offer yet.'],
    },
    us: {
      visa: 'Green card (permanent residence) routes',
      fee: 'Depends on the category',
      processing: 'Often years, depending on category and backlog',
      stay: 'Permanent residence',
      requirements: [
        'Family sponsorship by a U.S. citizen or permanent resident, or',
        'An employment-based petition (EB-1, EB-2 NIW, EB-3)',
        'Civil documents, police certificate and a medical exam',
      ],
      tips: [
        'Nigeria is NOT eligible for the Diversity Visa (DV) lottery because of high U.S. immigration numbers from Nigeria.',
        'Anyone selling "DV lottery slots" to Nigerians is running a scam.',
      ],
    },
    poland: {
      visa: 'Work or study → EU long-term residence / Permanent residence',
      fee: 'Residence permit fees at each stage (a few hundred PLN)',
      processing: 'Long-term route',
      stay: 'Permanent settlement',
      requirements: [
        'At least 5 years of continuous legal residence (time as a student counts only partly)',
        'Stable and regular income and health insurance',
        'Legal title to accommodation',
        'Polish language at B1, certified',
      ],
      tips: [
        'Most Nigerians start on a work permit or a student visa. Keep your residence status continuous, because gaps reset the clock.',
        'EU long-term residence makes it easier to move to another EU country later.',
      ],
    },
    czechia: {
      visa: 'Employee Card / Blue Card → Permanent residence',
      fee: 'CZK 2,500 for the permanent residence application',
      processing: 'Long-term route',
      stay: 'Permanent settlement',
      requirements: [
        'At least 5 years of continuous residence in Czechia (shorter for some Blue Card holders)',
        'Czech language at A2 or higher and a civics exam (per current rules)',
        'Proof of income and accommodation',
        'Clean criminal record',
      ],
      tips: ['Renew your Employee Card on time, as gaps in residence can break your path to permanent residence.'],
    },
  },

  family: {
    uk: {
      visa: 'Family visa (spouse or partner)',
      fee: '£1,938 + Immigration Health Surcharge',
      processing: 'About 12 weeks',
      stay: '2 years 9 months initially, then extendable',
      requirements: [
        'Proof that the relationship is genuine (marriage certificate, photos, communication history)',
        'Sponsor earns at least £29,000 a year, or meets the savings alternative',
        'Adequate accommodation in the UK',
        'English at level A1 or higher',
        'TB test certificate',
      ],
      tips: ['Dependants of students and skilled workers apply on the main applicant’s route, not this visa.'],
    },
    us: {
      visa: 'Immigrant visa (IR1/CR1 spouse, IR2 child, etc.)',
      fee: 'I-130 petition fee (paid by the sponsor) + $325 immigrant visa fee',
      processing: 'Many months to years, depending on category',
      stay: 'Permanent residence',
      requirements: [
        'Approved I-130 petition',
        'Affidavit of Support (I-864) from the sponsor',
        'Civil documents: NPC birth certificate, marriage certificate, police certificate',
        'Medical exam with an embassy-approved panel physician',
      ],
      tips: ['Make sure your civil documents meet the U.S. Department of State reciprocity requirements for Nigeria.'],
    },
    canada: {
      visa: 'Spousal / family sponsorship (PR)',
      fee: 'About CAD 1,200+ in total for a spouse',
      processing: 'Around 12 months or more',
      stay: 'Permanent residence',
      requirements: [
        'Sponsorship application by your Canadian citizen or PR spouse/partner',
        'Proof of a genuine relationship',
        'Police certificates and medical exam',
        'Civil documents (marriage and birth certificates)',
      ],
      tips: ['Include many types of relationship evidence covering the whole relationship, not just the wedding.'],
    },
    germany: {
      visa: 'Family reunion visa',
      fee: '€75',
      processing: 'Several months',
      stay: 'Linked to your sponsor’s residence permit',
      requirements: [
        'Marriage certificate (it may need to be verified)',
        'Basic German (A1) for spouses in many cases',
        'Sponsor’s residence permit, accommodation and income',
      ],
      tips: ['Spouses of EU Blue Card holders are usually exempt from the German language requirement.'],
    },
  },

  medical: {
    india: {
      visa: 'e-Medical visa',
      fee: 'Depends on nationality (shown on the portal)',
      processing: 'Usually a few days',
      stay: 'As granted for treatment',
      requirements: [
        'Letter from a recognised Indian hospital',
        'Medical reports from your Nigerian doctor',
        'Proof you can pay for treatment',
        'Attendants apply for an e-Medical Attendant visa',
      ],
      tips: ['Apply only on the official Indian government portal. Lookalike sites charge extra fees.'],
    },
    uk: {
      visa: 'Standard Visitor visa (private medical treatment)',
      fee: '£127 (6 months)',
      processing: 'About 3 weeks',
      stay: 'Up to 6 months, extendable for treatment',
      requirements: [
        'Letter from a UK doctor or consultant describing your condition, the treatment, its cost and how long it takes',
        'Proof that you can pay for the treatment',
        'Evidence that your condition is not a public health risk',
      ],
      tips: ['NHS treatment is not free for visitors. Budget for private care.'],
    },
    us: {
      visa: 'B-2 visa (medical treatment)',
      fee: '$185 MRV fee',
      processing: 'Depends on interview wait time (ask about expedited appointments for urgent cases)',
      stay: 'Set at the port of entry',
      requirements: [
        'Diagnosis from your Nigerian doctor',
        'Letter from a U.S. hospital or doctor with a treatment plan and cost estimate',
        'Proof of how treatment will be paid for',
      ],
      tips: ['For urgent medical cases you can ask for an expedited appointment once you have booked one.'],
    },
    korea: {
      visa: 'Medical tourism visa (C-3-3, or G-1-10 for long treatment)',
      fee: 'About US$40 equivalent',
      processing: 'Often 1–2 weeks',
      stay: 'Up to 90 days (C-3-3); longer for G-1-10',
      requirements: [
        'Invitation or appointment confirmation from a Korean hospital registered for international patients',
        'Medical reports from your Nigerian doctor',
        'Proof you can pay for the treatment and your stay',
        'A companion (family member) can apply for a matching visa',
      ],
      tips: ['Many Korean hospitals have international patient centres that help with the invitation letter and visa documents.'],
    },
  },

  transit: {
    uk: {
      visa: 'Direct Airside Transit Visa (DATV)',
      fee: 'About £40',
      processing: 'About 3 weeks',
      stay: 'Airside only, usually under 24 hours',
      requirements: ['Onward ticket within the allowed time', 'Valid visa for your final destination'],
      tips: ['You may be exempt if you hold a valid visa for the USA, Canada, Australia, New Zealand, Ireland or a Schengen country. Check the exemptions on GOV.UK.'],
    },
    schengen: {
      visa: 'Airport Transit Visa (Type A)',
      fee: '€90',
      processing: 'Usually 15 days',
      stay: 'International transit area only',
      requirements: ['Onward ticket', 'Valid visa for your final destination'],
      tips: ['Nigerian nationals need an airport transit visa, unless they hold certain valid visas or residence permits (e.g. US, Canada, UK).'],
    },
    us: {
      visa: 'C-1 Transit visa',
      fee: '$185 MRV fee',
      processing: 'Depends on interview wait time',
      stay: 'Up to 29 days in transit',
      requirements: ['Onward ticket', 'Visa for your final destination', 'DS-160 and interview'],
      tips: ['The U.S. has no airside transit, so you will pass through immigration even when changing flights.'],
    },
  },
};

export const getGuide = (objectiveId, countryId) => guides[objectiveId]?.[countryId];
export const destinationsFor = (objectiveId) => Object.keys(guides[objectiveId] || {});
