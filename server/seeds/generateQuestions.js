/**
 * Seed script: Creates 17 exams, 33 CBTs, 20 mock tests each,
 * with questions drawn from large question banks (no repeats within a section).
 */
require('dotenv').config();
const { sequelize, Exam, CBT, MockTest, Question } = require('../models');

// ── Import Question Banks ──
const gkBank = require('./questions/gkBank');
const scienceBank = require('./questions/scienceBank');
const financeBank = require('./questions/financeBank');
const mathTemplates = require('./questions/mathTemplates');
const reasoningTemplates = require('./questions/reasoningTemplates');
const englishBank = require('./questions/englishBank');

// ── Exam Definitions (17 exams) ──
const examDefs = [
  { name: 'SSC CGL', category: 'SSC', slug: 'ssc-cgl', description: 'Combined Graduate Level Examination', icon: '🏛️' },
  { name: 'SSC CHSL', category: 'SSC', slug: 'ssc-chsl', description: 'Combined Higher Secondary Level', icon: '📋' },
  { name: 'SSC MTS', category: 'SSC', slug: 'ssc-mts', description: 'Multi-Tasking Staff Examination', icon: '📝' },
  { name: 'SSC GD', category: 'SSC', slug: 'ssc-gd', description: 'SSC GD Constable Examination', icon: '🛡️' },
  { name: 'SSC Stenographer', category: 'SSC', slug: 'ssc-steno', description: 'Stenographer Grade C & D', icon: '⌨️' },
  { name: 'SSC CPO', category: 'SSC', slug: 'ssc-cpo', description: 'Central Police Organisation', icon: '👮' },
  { name: 'SSC JE', category: 'SSC', slug: 'ssc-je', description: 'Junior Engineer Examination', icon: '🔧' },
  { name: 'SSC Selection Post', category: 'SSC', slug: 'ssc-selection-post', description: 'Selection Post Phase', icon: '📌' },
  { name: 'RRB NTPC', category: 'Railway', slug: 'rrb-ntpc', description: 'Non-Technical Popular Categories', icon: '🚂' },
  { name: 'RRB Group D', category: 'Railway', slug: 'rrb-group-d', description: 'Railway Group D Level 1', icon: '🚃' },
  { name: 'RRB ALP', category: 'Railway', slug: 'rrb-alp', description: 'Assistant Loco Pilot', icon: '🚆' },
  { name: 'RRB JE', category: 'Railway', slug: 'rrb-je', description: 'Railway Junior Engineer', icon: '🔩' },
  { name: 'IBPS Clerk', category: 'Banking', slug: 'ibps-clerk', description: 'Institute of Banking Personnel - Clerk', icon: '💼' },
  { name: 'IBPS PO', category: 'Banking', slug: 'ibps-po', description: 'Institute of Banking Personnel - PO', icon: '🏦' },
  { name: 'SBI Clerk', category: 'Banking', slug: 'sbi-clerk', description: 'State Bank of India - Clerk', icon: '📊' },
  { name: 'SBI PO', category: 'Banking', slug: 'sbi-po', description: 'State Bank of India - PO', icon: '🏧' },
  { name: 'RBI Grade B', category: 'Banking', slug: 'rbi-grade-b', description: 'Reserve Bank of India Grade B', icon: '🏛️' },
];

// ── 33 CBT Definitions ──
const cbtDefs = [
  // SSC CGL
  { examSlug: 'ssc-cgl', name: 'SSC CGL Tier 1', slug: 'ssc-cgl-tier-1', totalQuestions: 100, totalMarks: 200, duration: 60, negativeMarking: 0.5,
    subjects: [
      { name: 'General Intelligence & Reasoning', questions: 25, marks: 50 },
      { name: 'General Awareness', questions: 25, marks: 50 },
      { name: 'Quantitative Aptitude', questions: 25, marks: 50 },
      { name: 'English Comprehension', questions: 25, marks: 50 },
    ]},
  { examSlug: 'ssc-cgl', name: 'SSC CGL Tier 2', slug: 'ssc-cgl-tier-2', totalQuestions: 150, totalMarks: 450, duration: 150, negativeMarking: 0.5,
    subjects: [
      { name: 'Mathematical Abilities', questions: 30, marks: 90 },
      { name: 'Reasoning & General Intelligence', questions: 30, marks: 90 },
      { name: 'English Language & Comprehension', questions: 45, marks: 135 },
      { name: 'General Awareness', questions: 25, marks: 75 },
      { name: 'Computer Knowledge', questions: 20, marks: 60 },
    ]},
  // SSC CHSL
  { examSlug: 'ssc-chsl', name: 'SSC CHSL Tier 1', slug: 'ssc-chsl-tier-1', totalQuestions: 100, totalMarks: 200, duration: 60, negativeMarking: 0.5,
    subjects: [
      { name: 'General Intelligence', questions: 25, marks: 50 },
      { name: 'General Awareness', questions: 25, marks: 50 },
      { name: 'Quantitative Aptitude', questions: 25, marks: 50 },
      { name: 'English Language', questions: 25, marks: 50 },
    ]},
  { examSlug: 'ssc-chsl', name: 'SSC CHSL Tier 2', slug: 'ssc-chsl-tier-2', totalQuestions: 120, totalMarks: 360, duration: 120, negativeMarking: 0.5,
    subjects: [
      { name: 'Math & Reasoning', questions: 60, marks: 180 },
      { name: 'English & GK', questions: 60, marks: 180 },
    ]},
  // SSC MTS
  { examSlug: 'ssc-mts', name: 'SSC MTS Tier 1', slug: 'ssc-mts-tier-1', totalQuestions: 90, totalMarks: 270, duration: 90, negativeMarking: 0.5,
    subjects: [
      { name: 'Numerical & Mathematical Ability', questions: 20, marks: 60 },
      { name: 'Reasoning Ability & Problem Solving', questions: 20, marks: 60 },
      { name: 'General Awareness', questions: 25, marks: 75 },
      { name: 'English Language & Comprehension', questions: 25, marks: 75 },
    ]},
  { examSlug: 'ssc-mts', name: 'SSC MTS Tier 2', slug: 'ssc-mts-tier-2', totalQuestions: 100, totalMarks: 300, duration: 90, negativeMarking: 0.5,
    subjects: [
      { name: 'General Studies, Science & Maths', questions: 25, marks: 75 },
      { name: 'Reasoning & Problem Solving', questions: 25, marks: 75 },
      { name: 'English Language & Comprehension', questions: 25, marks: 75 },
      { name: 'General Awareness', questions: 25, marks: 75 },
    ]},
  // SSC GD
  { examSlug: 'ssc-gd', name: 'SSC GD Constable CBT', slug: 'ssc-gd-cbt', totalQuestions: 80, totalMarks: 160, duration: 60, negativeMarking: 0.5,
    subjects: [
      { name: 'General Intelligence & Reasoning', questions: 20, marks: 40 },
      { name: 'General Knowledge & Awareness', questions: 20, marks: 40 },
      { name: 'Elementary Mathematics', questions: 20, marks: 40 },
      { name: 'English / Hindi', questions: 20, marks: 40 },
    ]},
  // SSC Steno
  { examSlug: 'ssc-steno', name: 'SSC Stenographer CBT', slug: 'ssc-steno-cbt', totalQuestions: 200, totalMarks: 200, duration: 120, negativeMarking: 0.25,
    subjects: [
      { name: 'General Intelligence & Reasoning', questions: 50, marks: 50 },
      { name: 'General Awareness', questions: 50, marks: 50 },
      { name: 'English Language & Comprehension', questions: 100, marks: 100 },
    ]},
  // SSC CPO
  { examSlug: 'ssc-cpo', name: 'SSC CPO Tier 1', slug: 'ssc-cpo-tier-1', totalQuestions: 200, totalMarks: 200, duration: 120, negativeMarking: 0.25,
    subjects: [
      { name: 'General Intelligence & Reasoning', questions: 50, marks: 50 },
      { name: 'General Knowledge & Awareness', questions: 50, marks: 50 },
      { name: 'Quantitative Aptitude', questions: 50, marks: 50 },
      { name: 'English Comprehension', questions: 50, marks: 50 },
    ]},
  { examSlug: 'ssc-cpo', name: 'SSC CPO Tier 2', slug: 'ssc-cpo-tier-2', totalQuestions: 200, totalMarks: 200, duration: 120, negativeMarking: 0.25,
    subjects: [
      { name: 'English Language & Comprehension', questions: 200, marks: 200 },
    ]},
  // SSC JE
  { examSlug: 'ssc-je', name: 'SSC JE Tier 1', slug: 'ssc-je-tier-1', totalQuestions: 200, totalMarks: 200, duration: 120, negativeMarking: 0.25,
    subjects: [
      { name: 'General Intelligence & Reasoning', questions: 50, marks: 50 },
      { name: 'General Awareness', questions: 50, marks: 50 },
      { name: 'General Engineering', questions: 100, marks: 100 },
    ]},
  // SSC Selection Post
  { examSlug: 'ssc-selection-post', name: 'SSC Selection Post (10th)', slug: 'ssc-sp-10th', totalQuestions: 100, totalMarks: 200, duration: 60, negativeMarking: 0.5,
    subjects: [
      { name: 'General Intelligence & Reasoning', questions: 25, marks: 50 },
      { name: 'General Awareness', questions: 25, marks: 50 },
      { name: 'Quantitative Aptitude', questions: 25, marks: 50 },
      { name: 'English Language', questions: 25, marks: 50 },
    ]},
  { examSlug: 'ssc-selection-post', name: 'SSC Selection Post (12th)', slug: 'ssc-sp-12th', totalQuestions: 100, totalMarks: 200, duration: 60, negativeMarking: 0.5,
    subjects: [
      { name: 'General Intelligence & Reasoning', questions: 25, marks: 50 },
      { name: 'General Awareness', questions: 25, marks: 50 },
      { name: 'Quantitative Aptitude', questions: 25, marks: 50 },
      { name: 'English Language', questions: 25, marks: 50 },
    ]},
  { examSlug: 'ssc-selection-post', name: 'SSC Selection Post (Graduates)', slug: 'ssc-sp-grad', totalQuestions: 100, totalMarks: 200, duration: 60, negativeMarking: 0.5,
    subjects: [
      { name: 'General Intelligence & Reasoning', questions: 25, marks: 50 },
      { name: 'General Awareness', questions: 25, marks: 50 },
      { name: 'Quantitative Aptitude', questions: 25, marks: 50 },
      { name: 'English Language', questions: 25, marks: 50 },
    ]},
  // RRB NTPC
  { examSlug: 'rrb-ntpc', name: 'RRB NTPC Tier 1 (12th)', slug: 'rrb-ntpc-t1-12th', totalQuestions: 100, totalMarks: 100, duration: 90, negativeMarking: 0.33,
    subjects: [
      { name: 'Mathematics', questions: 30, marks: 30 },
      { name: 'General Intelligence & Reasoning', questions: 30, marks: 30 },
      { name: 'General Awareness', questions: 40, marks: 40 },
    ]},
  { examSlug: 'rrb-ntpc', name: 'RRB NTPC Tier 1 (Graduates)', slug: 'rrb-ntpc-t1-grad', totalQuestions: 100, totalMarks: 100, duration: 90, negativeMarking: 0.33,
    subjects: [
      { name: 'Mathematics', questions: 30, marks: 30 },
      { name: 'General Intelligence & Reasoning', questions: 30, marks: 30 },
      { name: 'General Awareness', questions: 40, marks: 40 },
    ]},
  { examSlug: 'rrb-ntpc', name: 'RRB NTPC Tier 2 (12th)', slug: 'rrb-ntpc-t2-12th', totalQuestions: 120, totalMarks: 120, duration: 90, negativeMarking: 0.33,
    subjects: [
      { name: 'Mathematics', questions: 35, marks: 35 },
      { name: 'General Intelligence & Reasoning', questions: 35, marks: 35 },
      { name: 'General Awareness', questions: 50, marks: 50 },
    ]},
  { examSlug: 'rrb-ntpc', name: 'RRB NTPC Tier 2 (Graduates)', slug: 'rrb-ntpc-t2-grad', totalQuestions: 120, totalMarks: 120, duration: 90, negativeMarking: 0.33,
    subjects: [
      { name: 'Mathematics', questions: 35, marks: 35 },
      { name: 'General Intelligence & Reasoning', questions: 35, marks: 35 },
      { name: 'General Awareness', questions: 50, marks: 50 },
    ]},
  // RRB Group D
  { examSlug: 'rrb-group-d', name: 'RRB Group D CBT', slug: 'rrb-group-d-cbt', totalQuestions: 100, totalMarks: 100, duration: 90, negativeMarking: 0.33,
    subjects: [
      { name: 'Mathematics', questions: 25, marks: 25 },
      { name: 'General Intelligence & Reasoning', questions: 30, marks: 30 },
      { name: 'General Science', questions: 25, marks: 25 },
      { name: 'General Awareness & Current Affairs', questions: 20, marks: 20 },
    ]},
  // RRB ALP
  { examSlug: 'rrb-alp', name: 'RRB ALP Tier 1', slug: 'rrb-alp-tier-1', totalQuestions: 75, totalMarks: 75, duration: 60, negativeMarking: 0.33,
    subjects: [
      { name: 'Mathematics', questions: 20, marks: 20 },
      { name: 'General Intelligence & Reasoning', questions: 25, marks: 25 },
      { name: 'General Science', questions: 20, marks: 20 },
      { name: 'General Awareness & Current Affairs', questions: 10, marks: 10 },
    ]},
  { examSlug: 'rrb-alp', name: 'RRB ALP Tier 2', slug: 'rrb-alp-tier-2', totalQuestions: 175, totalMarks: 175, duration: 150, negativeMarking: 0.33,
    subjects: [
      { name: 'Mathematics, Reasoning, Science, GK', questions: 100, marks: 100 },
      { name: 'Trade Specific', questions: 75, marks: 75 },
    ]},
  // RRB JE
  { examSlug: 'rrb-je', name: 'RRB JE Tier 1', slug: 'rrb-je-tier-1', totalQuestions: 100, totalMarks: 100, duration: 90, negativeMarking: 0.33,
    subjects: [
      { name: 'Mathematics', questions: 30, marks: 30 },
      { name: 'General Intelligence & Reasoning', questions: 25, marks: 25 },
      { name: 'General Awareness', questions: 15, marks: 15 },
      { name: 'General Science', questions: 30, marks: 30 },
    ]},
  { examSlug: 'rrb-je', name: 'RRB JE Tier 2', slug: 'rrb-je-tier-2', totalQuestions: 150, totalMarks: 150, duration: 120, negativeMarking: 0.33,
    subjects: [
      { name: 'General Awareness', questions: 15, marks: 15 },
      { name: 'Physics & Chemistry', questions: 15, marks: 15 },
      { name: 'Engineering Basics', questions: 20, marks: 20 },
      { name: 'Technical Subjects', questions: 100, marks: 100 },
    ]},
  // IBPS Clerk
  { examSlug: 'ibps-clerk', name: 'IBPS Clerk Prelims', slug: 'ibps-clerk-prelims', totalQuestions: 100, totalMarks: 100, duration: 60, negativeMarking: 0.25,
    subjects: [
      { name: 'English Language', questions: 30, marks: 30 },
      { name: 'Numerical Ability', questions: 35, marks: 35 },
      { name: 'Reasoning Ability', questions: 35, marks: 35 },
    ]},
  { examSlug: 'ibps-clerk', name: 'IBPS Clerk Mains', slug: 'ibps-clerk-mains', totalQuestions: 190, totalMarks: 200, duration: 160, negativeMarking: 0.25,
    subjects: [
      { name: 'General / Financial Awareness', questions: 50, marks: 50 },
      { name: 'General English', questions: 40, marks: 40 },
      { name: 'Reasoning Ability & Computer Aptitude', questions: 50, marks: 60 },
      { name: 'Quantitative Aptitude', questions: 50, marks: 50 },
    ]},
  // IBPS PO
  { examSlug: 'ibps-po', name: 'IBPS PO Prelims', slug: 'ibps-po-prelims', totalQuestions: 100, totalMarks: 100, duration: 60, negativeMarking: 0.25,
    subjects: [
      { name: 'English Language', questions: 30, marks: 30 },
      { name: 'Quantitative Aptitude', questions: 35, marks: 35 },
      { name: 'Reasoning Ability', questions: 35, marks: 35 },
    ]},
  { examSlug: 'ibps-po', name: 'IBPS PO Mains', slug: 'ibps-po-mains', totalQuestions: 157, totalMarks: 225, duration: 180, negativeMarking: 0.25,
    subjects: [
      { name: 'Reasoning & Computer Aptitude', questions: 45, marks: 60 },
      { name: 'English Language', questions: 35, marks: 40 },
      { name: 'Data Analysis & Interpretation', questions: 35, marks: 60 },
      { name: 'General Economy / Banking Awareness', questions: 40, marks: 40 },
      { name: 'English Descriptive', questions: 2, marks: 25 },
    ]},
  // SBI Clerk
  { examSlug: 'sbi-clerk', name: 'SBI Clerk Prelims', slug: 'sbi-clerk-prelims', totalQuestions: 100, totalMarks: 100, duration: 60, negativeMarking: 0.25,
    subjects: [
      { name: 'English Language', questions: 30, marks: 30 },
      { name: 'Numerical Ability', questions: 35, marks: 35 },
      { name: 'Reasoning Ability', questions: 35, marks: 35 },
    ]},
  { examSlug: 'sbi-clerk', name: 'SBI Clerk Mains', slug: 'sbi-clerk-mains', totalQuestions: 190, totalMarks: 200, duration: 160, negativeMarking: 0.25,
    subjects: [
      { name: 'General / Financial Awareness', questions: 50, marks: 50 },
      { name: 'General English', questions: 40, marks: 40 },
      { name: 'Quantitative Aptitude & Data Interpretation', questions: 50, marks: 50 },
      { name: 'Reasoning Ability & Computer Aptitude', questions: 50, marks: 60 },
    ]},
  // SBI PO
  { examSlug: 'sbi-po', name: 'SBI PO Prelims', slug: 'sbi-po-prelims', totalQuestions: 100, totalMarks: 100, duration: 60, negativeMarking: 0.25,
    subjects: [
      { name: 'English Language', questions: 30, marks: 30 },
      { name: 'Quantitative Aptitude', questions: 35, marks: 35 },
      { name: 'Reasoning Ability', questions: 35, marks: 35 },
    ]},
  { examSlug: 'sbi-po', name: 'SBI PO Mains', slug: 'sbi-po-mains', totalQuestions: 157, totalMarks: 250, duration: 180, negativeMarking: 0.25,
    subjects: [
      { name: 'Reasoning & Computer Aptitude', questions: 45, marks: 60 },
      { name: 'Data Analysis & Interpretation', questions: 35, marks: 60 },
      { name: 'General Economy / Banking Awareness', questions: 40, marks: 40 },
      { name: 'English Language', questions: 35, marks: 40 },
      { name: 'English Descriptive', questions: 2, marks: 50 },
    ]},
  // RBI Grade B
  { examSlug: 'rbi-grade-b', name: 'RBI Grade B Phase I', slug: 'rbi-grade-b-phase-1', totalQuestions: 200, totalMarks: 200, duration: 120, negativeMarking: 0.25,
    subjects: [
      { name: 'General Awareness', questions: 80, marks: 80 },
      { name: 'English Language', questions: 30, marks: 30 },
      { name: 'Quantitative Aptitude', questions: 30, marks: 30 },
      { name: 'Reasoning', questions: 60, marks: 60 },
    ]},
  { examSlug: 'rbi-grade-b', name: 'RBI Grade B Phase II', slug: 'rbi-grade-b-phase-2', totalQuestions: 75, totalMarks: 340, duration: 180, negativeMarking: 0.25,
    subjects: [
      { name: 'Economic & Social Issues', questions: 36, marks: 120 },
      { name: 'English Descriptive', questions: 3, marks: 100 },
      { name: 'Finance & Management', questions: 36, marks: 120 },
    ]},
];

// ══════════════════════════════════════════
//  SEEDED RANDOM — deterministic shuffle
// ══════════════════════════════════════════
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ══════════════════════════════════════════
//  QUESTION GENERATORS — using real banks
// ══════════════════════════════════════════

/**
 * Pick `count` unique items from a static bank using seeded shuffle.
 * If the bank is smaller than count, it wraps (with different ordering).
 */
function pickFromBank(bank, count, seed) {
  const rng = seededRandom(seed);
  const shuffled = shuffle(bank, rng);
  const qs = [];
  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    qs.push({
      questionText: item.q,
      optionA: item.a,
      optionB: item.b,
      optionC: item.c,
      optionD: item.d,
      correctOption: 'A',
      solutionText: `Answer: ${item.a}`,
      difficulty: ['easy', 'medium', 'hard'][i % 3],
    });
  }
  return qs;
}

/**
 * Generate questions from template functions (Math / Reasoning).
 * Each template is called with seeded (a, b) parameters.
 */
function pickFromTemplates(templates, count, seed) {
  const rng = seededRandom(seed);
  const shuffledTpls = shuffle(templates, rng);
  const qs = [];
  for (let i = 0; i < count; i++) {
    const tpl = shuffledTpls[i % shuffledTpls.length];
    const a = Math.floor(rng() * 20) + 3;
    const b = Math.floor(rng() * 15) + 2;
    const r = tpl(typeof tpl.length === 'number' && tpl.length === 1 ? seed + i * 7 : a, b);
    // Handle template result — may be called with (seed) or (a,b)
    const result = r || tpl(seed + i * 7);
    const opts = (result.o || []).map(String);
    while (opts.length < 4) opts.push(opts[opts.length - 1] + '*');
    qs.push({
      questionText: result.q,
      optionA: opts[0],
      optionB: opts[1],
      optionC: opts[2],
      optionD: opts[3],
      correctOption: 'A',
      solutionText: result.s || `Answer: ${opts[0]}`,
      difficulty: ['easy', 'medium', 'hard'][i % 3],
    });
  }
  return qs;
}

/**
 * Generate English questions from the structured bank.
 * Mixes synonyms, antonyms, sentence correction, idioms, one-word subs,
 * fill-blanks, spelling, and voice/narration items.
 */
function generateEnglishQs(count, seed) {
  const rng = seededRandom(seed);
  const qs = [];

  // Build a flat pool of question objects from all categories
  const pool = [];

  // Synonyms
  englishBank.synonyms.forEach(item => {
    pool.push({
      questionText: `Choose the synonym of "${item.word}":`,
      optionA: item.options[0], optionB: item.options[1],
      optionC: item.options[2], optionD: item.options[3],
      correctOption: 'A',
      solutionText: `"${item.answer}" is the synonym of "${item.word}".`,
    });
  });

  // Antonyms
  englishBank.antonyms.forEach(item => {
    pool.push({
      questionText: `Choose the antonym of "${item.word}":`,
      optionA: item.options[0], optionB: item.options[1],
      optionC: item.options[2], optionD: item.options[3],
      correctOption: 'A',
      solutionText: `"${item.answer}" is the antonym of "${item.word}".`,
    });
  });

  // Sentence Correction
  englishBank.sentenceCorrection.forEach(item => {
    pool.push({
      questionText: `Correct the sentence: "${item.incorrect}"`,
      optionA: item.options[0], optionB: item.options[1],
      optionC: item.options[2], optionD: item.options[3],
      correctOption: 'A',
      solutionText: `Correct: "${item.correct}"`,
    });
  });

  // Idioms
  englishBank.idioms.forEach(item => {
    pool.push({
      questionText: `What does the idiom "${item.idiom}" mean?`,
      optionA: item.options[0], optionB: item.options[1],
      optionC: item.options[2], optionD: item.options[3],
      correctOption: 'A',
      solutionText: `"${item.idiom}" means: ${item.meaning}`,
    });
  });

  // One-word Substitution
  englishBank.oneWordSubstitution.forEach(item => {
    pool.push({
      questionText: `One word for: "${item.description}"`,
      optionA: item.options[0], optionB: item.options[1],
      optionC: item.options[2], optionD: item.options[3],
      correctOption: 'A',
      solutionText: `Answer: ${item.answer}`,
    });
  });

  // Fill in the blanks
  englishBank.fillBlanks.forEach(item => {
    pool.push({
      questionText: item.q,
      optionA: item.options[0], optionB: item.options[1],
      optionC: item.options[2], optionD: item.options[3],
      correctOption: 'A',
      solutionText: `Answer: ${item.answer}`,
    });
  });

  // Spelling
  englishBank.spelling.forEach(item => {
    pool.push({
      questionText: `Choose the correct spelling:`,
      optionA: item.options[0], optionB: item.options[1],
      optionC: item.options[2], optionD: item.options[3],
      correctOption: 'A',
      solutionText: `Correct spelling: ${item.correct}`,
    });
  });

  // Voice & Narration
  englishBank.voiceNarration.forEach(item => {
    pool.push({
      questionText: item.q,
      optionA: item.options[0], optionB: item.options[1],
      optionC: item.options[2], optionD: item.options[3],
      correctOption: 'A',
      solutionText: `Answer: ${item.answer}`,
    });
  });

  // Shuffle and pick
  const shuffled = shuffle(pool, rng);
  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    qs.push({
      ...item,
      difficulty: ['easy', 'medium', 'hard'][i % 3],
    });
  }
  return qs;
}

// ══════════════════════════════════════════
//  SUBJECT → GENERATOR MAPPING
// ══════════════════════════════════════════
function getGenerator(subjectName) {
  const s = subjectName.toLowerCase();
  if (s.includes('math') || s.includes('quantitative') || s.includes('numerical') || s.includes('elementary math') || s.includes('data analysis'))
    return (count, seed) => pickFromTemplates(mathTemplates, count, seed);
  if (s.includes('reasoning') || s.includes('intelligence') || s.includes('computer'))
    return (count, seed) => pickFromTemplates(reasoningTemplates, count, seed);
  if (s.includes('english') || s.includes('descriptive'))
    return generateEnglishQs;
  if (s.includes('science') || s.includes('physics') || s.includes('chemistry') || s.includes('engineering') || s.includes('technical') || s.includes('trade'))
    return (count, seed) => pickFromBank(scienceBank, count, seed);
  if (s.includes('financial') || s.includes('banking') || s.includes('economy') || s.includes('finance'))
    return (count, seed) => pickFromBank(financeBank, count, seed);
  // general awareness, current affairs, studies, GK — all → GK bank
  return (count, seed) => pickFromBank(gkBank, count, seed);
}

// ══════════════════════════════════════════
//  MAIN SEED FUNCTION
// ══════════════════════════════════════════
async function seed() {
  try {
    console.log('🔗 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');

    console.log('🗂️  Syncing models (force: true)...');
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Create exams
    console.log('📝 Creating 17 exams...');
    const exams = await Exam.bulkCreate(examDefs);
    const examMap = {};
    exams.forEach(e => { examMap[e.slug] = e.id; });
    console.log(`✅ Created ${exams.length} exams`);

    let totalCBTs = 0, totalTests = 0, totalQuestions = 0;

    // Create CBTs, mock tests, and questions
    for (const cbtDef of cbtDefs) {
      const cbt = await CBT.create({
        examId: examMap[cbtDef.examSlug],
        name: cbtDef.name,
        slug: cbtDef.slug,
        totalQuestions: cbtDef.totalQuestions,
        totalMarks: cbtDef.totalMarks,
        duration: cbtDef.duration,
        negativeMarking: cbtDef.negativeMarking,
        subjects: cbtDef.subjects,
      });
      totalCBTs++;

      // 20 mock tests per CBT: test 1 = free, 2-20 = paid
      for (let testNum = 1; testNum <= 20; testNum++) {
        const mockTest = await MockTest.create({
          cbtId: cbt.id,
          testNumber: testNum,
          title: `${cbtDef.name} - Mock Test ${testNum}`,
          isFree: testNum === 1,
        });
        totalTests++;

        // Generate questions per subject — each gets a unique seed
        const allQuestions = [];
        let questionNum = 1;

        for (let si = 0; si < cbtDef.subjects.length; si++) {
          const subj = cbtDef.subjects[si];
          const generator = getGenerator(subj.name);
          // Unique seed per CBT × test × subject to ensure different questions
          const qSeed = cbt.id * 10000 + testNum * 100 + si * 10 + 7;
          const subjQuestions = generator(subj.questions, qSeed);

          for (const sq of subjQuestions) {
            allQuestions.push({
              mockTestId: mockTest.id,
              questionNumber: questionNum++,
              topic: subj.name,
              ...sq,
            });
          }
        }

        await Question.bulkCreate(allQuestions);
        totalQuestions += allQuestions.length;
      }

      console.log(`  ✅ ${cbtDef.name}: 20 tests, ${cbtDef.totalQuestions * 20} questions`);
    }

    console.log('\n🎉 Seeding complete!');
    console.log(`   Total exams: ${exams.length}`);
    console.log(`   Total CBTs: ${totalCBTs}`);
    console.log(`   Total mock tests: ${totalTests}`);
    console.log(`   Total questions: ${totalQuestions}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
