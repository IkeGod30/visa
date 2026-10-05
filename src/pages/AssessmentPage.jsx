import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { objectives, getObjective } from '../data/objectives.js';
import { destinationsFor } from '../data/guides.js';
import { countries } from '../data/countries.js';

const LANGUAGE_OBJECTIVES = ['study', 'work', 'relocation', 'family'];

// Each option: [value, label, points, advice shown when this option is chosen]
function buildQuestions(objective) {
  const qs = [
    {
      id: 'passport',
      text: 'What is the status of your international passport?',
      options: [
        ['valid', 'Valid for at least 6 months beyond my trip', 10],
        ['expiring', 'It expires within 6 months of my trip', 3, 'Renew your passport on the Nigeria Immigration Service portal (immigration.gov.ng) before you apply. Most embassies need at least 6 months of validity.'],
        ['none', 'I don’t have one yet', 0, 'Apply for an e-passport via the NIS portal first. Allow several weeks for capture and production.'],
      ],
    },
    {
      id: 'history',
      text: 'What is your international travel history?',
      options: [
        ['strong', 'I have visited the UK, US, Canada, Schengen or Australia', 15],
        ['some', 'I have visited other countries (e.g. Ghana, South Africa, Kenya)', 9],
        ['none', 'I have never travelled outside Nigeria', 3, 'A short trip to visa-free or easier destinations can build your travel history, though it is not required. Make the rest of your application strong.'],
      ],
    },
    {
      id: 'refusals',
      text: 'Have you ever been refused a visa?',
      options: [
        ['none', 'Never', 15],
        ['one', 'Once', 8, 'Read your refusal letter carefully and fix every reason it gives before reapplying. Always declare previous refusals.'],
        ['many', 'More than once', 2, 'Repeated refusals need a strategy. Wait until your circumstances change meaningfully, and consider asking an adviser to review your case.'],
      ],
    },
    {
      id: 'funds',
      text: 'How would you describe your finances?',
      options: [
        ['strong', 'Steady income with 6+ months of statements that cover the trip comfortably', 20],
        ['irregular', 'Some savings, but irregular income or recent lump-sum deposits', 10, 'Avoid "funds parking". Let funds build up naturally over months and keep documents that explain any large deposits (sale agreements, contracts).'],
        ['weak', 'Limited funds / I will rely on a sponsor I haven’t arranged yet', 3, 'Arrange your funding or a sponsor first, with their statements, proof of income and proof of your relationship.'],
      ],
    },
    {
      id: 'ties',
      text: 'What ties do you have to Nigeria?',
      options: [
        ['strong', 'Stable job or registered business (CAC), plus family or property', 20],
        ['some', 'Family or property, but no formal job or business documents', 10, 'Document whatever ties you have: employment letter, CAC registration, tax clearance, property documents, dependants.'],
        ['weak', 'Few ties (unemployed, no dependants or assets)', 3, 'Embassies may doubt you will return. Strengthen your ties, or choose a route (such as study or skilled migration) where intent to return matters less.'],
      ],
    },
    {
      id: 'keyDoc',
      text: `Do you have ${objective.keyDoc}?`,
      options: [
        ['yes', 'Yes, I have it', 20],
        ['progress', 'It’s in progress', 10, `Securing ${objective.keyDoc} is the most important next step. Don’t book appointments until it is confirmed.`],
        ['no', 'Not yet', 0, `You need ${objective.keyDoc} before you can apply. Start here.`],
      ],
    },
  ];
  if (LANGUAGE_OBJECTIVES.includes(objective.id)) {
    qs.push({
      id: 'english',
      text: 'Do you have an English (or required language) test result?',
      options: [
        ['yes', 'Yes, a valid result (e.g. IELTS/PTE/CELPIP)', 10],
        ['booked', 'I have booked a test', 5, 'Prepare well. Higher scores improve points-based applications and some schools’ offers.'],
        ['no', 'No', 0, 'Check whether your school or route accepts a waiver (e.g. WAEC English). Otherwise book IELTS/PTE early, as test dates fill up fast in Lagos and Abuja.'],
      ],
    });
  }
  return qs;
}

export default function AssessmentPage() {
  const [params] = useSearchParams();
  const [objectiveId, setObjectiveId] = useState(params.get('objective') || '');
  const [countryId, setCountryId] = useState(params.get('country') || '');
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const objective = getObjective(objectiveId);
  const questions = useMemo(() => (objective ? buildQuestions(objective) : []), [objective]);
  const validCountry = !!objective && destinationsFor(objective.id).includes(countryId);
  const finished = started && step >= questions.length;

  const restart = () => {
    setStarted(false);
    setStep(0);
    setAnswers({});
  };

  const answer = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
    setStep(step + 1);
  };

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Visa Readiness Check</h1>
          <p className="lead">Answer a few questions to see how prepared you are and what to fix before you apply.</p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          {!started && (
            <div className="card">
              <div className="field">
                <label htmlFor="objective">Purpose of travel</label>
                <select
                  id="objective"
                  value={objectiveId}
                  onChange={(e) => {
                    setObjectiveId(e.target.value);
                    setCountryId('');
                  }}
                >
                  <option value="">Select a purpose…</option>
                  {objectives.map((o) => (
                    <option key={o.id} value={o.id}>{o.icon} {o.title}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="country">Destination</label>
                <select id="country" value={validCountry ? countryId : ''} disabled={!objective} onChange={(e) => setCountryId(e.target.value)}>
                  <option value="">Select a destination…</option>
                  {objective &&
                    destinationsFor(objective.id).map((c) => (
                      <option key={c} value={c}>{countries[c].flag} {countries[c].name}</option>
                    ))}
                </select>
              </div>
              <button className="btn" disabled={!validCountry} onClick={() => setStarted(true)}>
                Start check →
              </button>
            </div>
          )}

          {started && !finished && (
            <div className="card quiz">
              <div className="progress">
                <div className="progress-bar" style={{ width: `${(step / questions.length) * 100}%` }} />
              </div>
              <p className="muted">
                Question {step + 1} of {questions.length}
              </p>
              <h2>{questions[step].text}</h2>
              <div className="options">
                {questions[step].options.map(([value, label]) => (
                  <button key={value} className="option" onClick={() => answer(questions[step].id, value)}>
                    {label}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button className="btn btn-link" onClick={() => setStep(step - 1)}>← Back</button>
              )}
            </div>
          )}

          {finished && (
            <Result
              questions={questions}
              answers={answers}
              objective={objective}
              country={countries[countryId]}
              onRestart={restart}
            />
          )}
        </div>
      </section>
    </>
  );
}

function Result({ questions, answers, objective, country, onRestart }) {
  let score = 0;
  let max = 0;
  const advice = [];
  questions.forEach((q) => {
    const opt = q.options.find(([v]) => v === answers[q.id]);
    max += Math.max(...q.options.map((o) => o[2]));
    score += opt[2];
    if (opt[3]) advice.push(opt[3]);
  });
  const pct = Math.round((score / max) * 100);

  const band =
    pct >= 75
      ? { cls: 'good', title: 'Strong position', text: 'Your profile looks well prepared. Focus on presenting your documents clearly and consistently.' }
      : pct >= 50
      ? { cls: 'mid', title: 'Getting there', text: 'You have a reasonable base, but fix the points below before paying any fees.' }
      : { cls: 'low', title: 'Needs more preparation', text: 'Applying now carries a high risk of refusal. Work through the advice below first.' };

  return (
    <div className="card result">
      <div className={`score score-${band.cls}`}>
        <span>{pct}%</span>
      </div>
      <h2>{band.title}</h2>
      <p>{band.text}</p>
      <p className="muted">
        {objective.title} · {country.flag} {country.name}
      </p>

      {advice.length > 0 && (
        <>
          <h3>What to work on</h3>
          <ul className="bullets bullets-tip">
            {advice.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </>
      )}

      <p className="muted small">
        This check is a guide only. It does not predict an embassy’s decision.
      </p>
      <div className="actions">
        <Link to={`/purpose/${objective.id}/${country.id}`} className="btn">View full guide</Link>
        <Link to={`/assist?objective=${objective.id}&country=${country.id}`} className="btn btn-gold">Get assistance</Link>
        <button className="btn btn-link" onClick={onRestart}>Start again</button>
      </div>
    </div>
  );
}
