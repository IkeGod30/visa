// Assistance services offered on /assist, shared with the admin dashboard.
// `objective` pre-selects a travel purpose when the service is picked from its card.
export const SERVICE_GROUPS = [
  {
    title: 'Get there: admission, jobs & more',
    services: [
      { id: 'admission', icon: '🎓', title: 'Secure admission', objective: 'study', text: 'We shortlist suitable schools, check entry requirements and guide your application until you receive an offer (CAS, I-20, LOA, CoE).' },
      { id: 'scholarship', icon: '🏅', title: 'Find scholarships', objective: 'study', text: 'Get matched to funding such as Chevening, Commonwealth, DAAD and Stipendium Hungaricum, with help on your essays.' },
      { id: 'job', icon: '💼', title: 'Find a job abroad', objective: 'work', text: 'Rewrite your CV for the destination, find legitimate job boards and check that employers are licensed to sponsor you.' },
      { id: 'credentials', icon: '📑', title: 'Credentials & tests', text: 'Help with WES/ECA, qualification recognition and preparing for IELTS, PTE or CELPIP.' },
      { id: 'arrival', icon: '🧳', title: 'Accommodation & arrival', text: 'Find student housing or short-let accommodation, and plan your first weeks abroad.' },
    ],
  },
  {
    title: 'Visa application support',
    services: [
      { id: 'documents', icon: '📋', title: 'Document review', text: 'An adviser checks your documents against the requirements and flags weak points.' },
      { id: 'route', icon: '🗺️', title: 'Route planning', text: 'Find the visa route that fits your goals, budget and profile.' },
      { id: 'letters', icon: '✍️', title: 'Letters & statements', text: 'Help writing cover letters, statements of purpose and letters of explanation.' },
      { id: 'interview', icon: '🎤', title: 'Interview preparation', text: 'Mock U.S. visa and credibility interviews with feedback.' },
      { id: 'refusal', icon: '🔁', title: 'Refusal review', text: 'Understand why you were refused and plan a stronger reapplication.' },
    ],
  },
];
export const SERVICES = SERVICE_GROUPS.flatMap((g) => g.services);
export const getService = (id) => SERVICES.find((s) => s.id === id);

const QUALIFICATIONS = ['WAEC / NECO', 'OND / NCE', 'HND', 'Bachelor’s degree', 'Master’s degree', 'PhD'];

// Extra questions shown for specific services.
export const EXTRA_FIELDS = {
  level: { label: 'Level of study', options: ['Foundation / Diploma', 'Undergraduate', 'Master’s', 'PhD', 'Language course'] },
  field: { label: 'Course / field of study', placeholder: 'e.g. Nursing, Computer Science, MBA' },
  qualification: { label: 'Highest qualification', options: QUALIFICATIONS },
  intake: { label: 'Preferred intake', placeholder: 'e.g. September 2027' },
  budget: { label: 'Yearly tuition budget', options: ['Under ₦10m', '₦10m–₦25m', '₦25m–₦50m', 'Over ₦50m', 'Need full scholarship'] },
  profession: { label: 'Profession / job title', placeholder: 'e.g. Registered Nurse, Software Engineer' },
  experience: { label: 'Years of experience', options: ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', 'Over 10 years'] },
};
export const SERVICE_FIELDS = {
  admission: ['level', 'field', 'qualification', 'intake', 'budget'],
  scholarship: ['level', 'field', 'qualification', 'intake'],
  job: ['profession', 'experience', 'qualification'],
};
export const REQUIRED_EXTRAS = ['level', 'field', 'profession', 'experience'];
