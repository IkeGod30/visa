// Travel objectives a user can pick from. `generalDocs` reference ids in documents.js.
export const objectives = [
  {
    id: 'visit',
    title: 'Short Visit',
    icon: '🤝',
    tagline: 'Visit family or friends, attend a wedding, conference or business meeting.',
    description:
      'Short-stay visas let you visit for a limited period (usually up to 90 days or 6 months) without working or studying. The embassy mainly wants proof that you have a genuine reason to travel and strong reasons to return to Nigeria.',
    keyDoc: 'an invitation letter or confirmed purpose of visit',
    generalDocs: ['passport', 'photos', 'bankStatement', 'employment', 'business', 'itinerary', 'travelHistory'],
    refusalReasons: [
      'Weak ties to Nigeria (no steady job, business or family responsibilities shown)',
      'Bank statements with sudden large deposits ("funds parking") or income that does not match lifestyle',
      'Inconsistent information between the form, invitation letter and interview',
      'Unclear purpose of trip or vague itinerary',
      'Undisclosed previous refusals or overstays',
    ],
  },
  {
    id: 'tourism',
    title: 'Tourism & Holiday',
    icon: '🏖️',
    tagline: 'Sightseeing, holidays, honeymoons and leisure travel.',
    description:
      'Tourist visas are short-stay visas for leisure. A clear, realistic itinerary and evidence that you can comfortably afford the trip matter most.',
    keyDoc: 'a day-by-day itinerary with hotel and flight reservations',
    generalDocs: ['passport', 'photos', 'bankStatement', 'employment', 'business', 'itinerary', 'travelInsurance', 'travelHistory'],
    refusalReasons: [
      'Trip cost looks unaffordable compared to your income',
      'Itinerary is unrealistic or hotel bookings are cancelled after submission',
      'Weak ties to Nigeria',
      'No previous travel history combined with a long requested stay',
    ],
  },
  {
    id: 'study',
    title: 'Study Abroad',
    icon: '🎓',
    tagline: 'Undergraduate, master’s, PhD, diploma and language courses.',
    description:
      'Student visas require an offer from a recognised institution, proof that you can pay tuition and living costs, and a believable study plan that fits your background.',
    keyDoc: 'an admission letter (e.g. CAS, I-20, LOA or CoE)',
    generalDocs: ['passport', 'photos', 'academic', 'englishTest', 'bankStatement', 'sponsorLetter', 'birthCert', 'medical'],
    refusalReasons: [
      'Insufficient or unexplained funds, or funds not held for the required period',
      'Course does not logically follow your previous education or career',
      'Gaps in education/employment that are not explained',
      'Doubts that you are a genuine student (e.g. you cannot explain why you chose the course or school)',
      'Fake or unverifiable documents — this can lead to a long ban',
    ],
  },
  {
    id: 'exchange',
    title: 'Student Exchange',
    icon: '🔄',
    tagline: 'A semester or year abroad through your university’s exchange or scholarship programme.',
    description:
      'Exchange programmes let you study abroad for a semester or a year while staying enrolled at your Nigerian university, often with tuition waived under an agreement between the two schools. You usually apply through your home university’s international office first, then apply for a visa using the documents the host university sends you.',
    keyDoc: 'a nomination letter and acceptance from the host university',
    generalDocs: ['passport', 'photos', 'exchangeLetters', 'enrolmentProof', 'academic', 'englishTest', 'bankStatement', 'sponsorLetter', 'medical'],
    refusalReasons: [
      'No proof that you remain enrolled at your Nigerian university and will return to finish your degree',
      'Not enough funds for living costs during the exchange (scholarship letters must state what they cover)',
      'Missing or unsigned nomination letter or learning agreement',
      'Applying for the wrong visa type for the length of the programme',
    ],
  },
  {
    id: 'work',
    title: 'Work Abroad',
    icon: '💼',
    tagline: 'Skilled jobs, employer sponsorship and job-seeker visas.',
    description:
      'Work visas usually require a genuine job offer from an employer that is licensed to sponsor foreign workers, plus proof of your qualifications and experience. Some countries also offer job-seeker visas.',
    keyDoc: 'a genuine job offer / sponsorship from a licensed employer',
    generalDocs: ['passport', 'photos', 'academic', 'experienceLetters', 'cv', 'englishTest', 'policeCert', 'medical'],
    refusalReasons: [
      'Job offer or sponsorship cannot be verified (often a sign of a scam)',
      'Qualifications or experience do not match the job role',
      'Salary below the required threshold',
      'Inconsistent employment history',
    ],
  },
  {
    id: 'relocation',
    title: 'Relocation / Permanent Residence',
    icon: '🏡',
    tagline: 'Move abroad long-term through skilled migration or PR programmes.',
    description:
      'Relocation (popularly called "japa") routes lead to permanent residence. Most are points-based and reward education, language scores, work experience and age. They take planning — often 6 to 24 months.',
    keyDoc: 'a language test result and an educational credential assessment',
    generalDocs: ['passport', 'academic', 'credentialAssessment', 'englishTest', 'experienceLetters', 'policeCert', 'birthCert', 'marriageCert', 'proofOfFunds', 'medical'],
    refusalReasons: [
      'Misrepresentation of work experience (e.g. reference letters that do not match job codes)',
      'Insufficient settlement funds or unexplained deposits',
      'Expired language test or credential assessment at the time of application',
      'Missing police certificates for countries lived in',
    ],
  },
  {
    id: 'family',
    title: 'Join Family',
    icon: '👨‍👩‍👧',
    tagline: 'Join a spouse, partner, parent or child living abroad.',
    description:
      'Family visas let you join a relative who is a citizen or resident. Your sponsor must usually meet income and accommodation requirements, and you must prove the relationship is genuine.',
    keyDoc: 'proof of relationship (marriage/birth certificate) and your sponsor’s status',
    generalDocs: ['passport', 'photos', 'birthCert', 'marriageCert', 'relationshipEvidence', 'policeCert', 'medical'],
    refusalReasons: [
      'Relationship not proven to be genuine and subsisting',
      'Sponsor does not meet the minimum income or accommodation requirement',
      'Marriage certificate not issued by a recognised registry',
      'Missing language test where required',
    ],
  },
  {
    id: 'medical',
    title: 'Medical Treatment',
    icon: '🏥',
    tagline: 'Receive treatment or surgery at a hospital abroad.',
    description:
      'Medical visas require evidence of your condition, a confirmed appointment or treatment plan from a foreign hospital, and proof you can pay for treatment and stay.',
    keyDoc: 'a letter from the foreign hospital confirming your treatment plan and cost',
    generalDocs: ['passport', 'photos', 'medicalReport', 'bankStatement', 'employment'],
    refusalReasons: [
      'No confirmed appointment or treatment estimate from the foreign hospital',
      'No clear evidence of how treatment will be paid for',
      'Missing documents for the accompanying attendant',
    ],
  },
  {
    id: 'transit',
    title: 'Transit',
    icon: '✈️',
    tagline: 'Change flights in a country on the way to your final destination.',
    description:
      'Some countries require Nigerian passport holders to get a transit visa even if they never leave the airport. Check before you book a connection.',
    keyDoc: 'a confirmed onward ticket and visa for your final destination',
    generalDocs: ['passport', 'photos', 'onwardTicket'],
    refusalReasons: [
      'No valid visa for the final destination',
      'Layover longer than allowed for the transit category',
    ],
  },
];

export const getObjective = (id) => objectives.find((o) => o.id === id);
