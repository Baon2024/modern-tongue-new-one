// Pronouns and possessives
const PRONOUNS = [
  { pattern: /\bthou\b/gi, replaceWith: 'you' },
  { pattern: /\bthee\b/gi, replaceWith: 'you' },
  { pattern: /\bthy\b/gi, replaceWith: 'your' },
  { pattern: /\bthine\b/gi, replaceWith: 'yours' },
  { pattern: /\bye\b/gi, replaceWith: 'you' },
  { pattern: /\byourself\b/gi, replaceWith: 'yourself' },
];

// Verbs (common archaic forms)
const VERBS = [
  { pattern: /\bhath\b/gi, replaceWith: 'has' },
  { pattern: /\bdoth\b/gi, replaceWith: 'does' },
  { pattern: /\bart\b/gi, replaceWith: 'are' },
  { pattern: /\bwert\b/gi, replaceWith: 'were' },
  { pattern: /\bwast\b/gi, replaceWith: 'were' },
  { pattern: /\bshalt\b/gi, replaceWith: 'shall' },
  { pattern: /\bwilt\b/gi, replaceWith: 'will' },
  { pattern: /\bwouldst\b/gi, replaceWith: 'would' },
  { pattern: /\bcouldst\b/gi, replaceWith: 'could' },
  { pattern: /\bshouldst\b/gi, replaceWith: 'should' },
  { pattern: /\bmayst\b/gi, replaceWith: 'may' },
  { pattern: /\bmightest\b/gi, replaceWith: 'might' },
  { pattern: /\bcanst\b/gi, replaceWith: 'can' },
  { pattern: /\bdidst\b/gi, replaceWith: 'did' },
  { pattern: /\bhast\b/gi, replaceWith: 'have' },
  { pattern: /\bhadst\b/gi, replaceWith: 'had' },
  { pattern: /\bknowest\b/gi, replaceWith: 'know' },
  { pattern: /\bseest\b/gi, replaceWith: 'see' },
  { pattern: /\bgoest\b/gi, replaceWith: 'go' },
  { pattern: /\bmakest\b/gi, replaceWith: 'make' },
  { pattern: /\btakest\b/gi, replaceWith: 'take' },
  { pattern: /\bgivest\b/gi, replaceWith: 'give' },
  { pattern: /\bsayest\b/gi, replaceWith: 'say' },
  { pattern: /\bcomest\b/gi, replaceWith: 'come' },
  { pattern: /\bthinkest\b/gi, replaceWith: 'think' },
];

// Adverbs and conjunctions
const ADVERBS_CONJUNCTIONS = [
  { pattern: /\bwhilst\b/gi, replaceWith: 'while' },
  { pattern: /\bamidst\b/gi, replaceWith: 'among' },
  { pattern: /\bamongst\b/gi, replaceWith: 'among' },
  { pattern: /\bbetwixt\b/gi, replaceWith: 'between' },
  { pattern: /\bere\b/gi, replaceWith: 'before' },
  { pattern: /\bwhence\b/gi, replaceWith: 'from where' },
  { pattern: /\bwhither\b/gi, replaceWith: 'to where' },
  { pattern: /\bhence\b/gi, replaceWith: 'from here' },
  { pattern: /\bthence\b/gi, replaceWith: 'from there' },
  { pattern: /\bhither\b/gi, replaceWith: 'here' },
  { pattern: /\bthither\b/gi, replaceWith: 'there' },
  { pattern: /\bverily\b/gi, replaceWith: 'truly' },
  { pattern: /\bforsooth\b/gi, replaceWith: 'indeed' },
  { pattern: /\bperadventure\b/gi, replaceWith: 'perhaps' },
  { pattern: /\bperchance\b/gi, replaceWith: 'perhaps' },
  { pattern: /\bmayhap\b/gi, replaceWith: 'maybe' },
];

// Prepositions
const PREPOSITIONS = [
  { pattern: /\bunto\b/gi, replaceWith: 'to' },
  { pattern: /\bupon\b/gi, replaceWith: 'on' },
  { pattern: /\bwithin\b/gi, replaceWith: 'inside' },
];

// Exclamations and affirmations
const EXCLAMATIONS = [
  { pattern: /\bnay\b/gi, replaceWith: 'no' },
  { pattern: /\byea\b/gi, replaceWith: 'yes' },
  { pattern: /\baye\b/gi, replaceWith: 'yes' },
  { pattern: /\blo\b/gi, replaceWith: 'look' },
  { pattern: /\balas\b/gi, replaceWith: 'unfortunately' },
  { pattern: /\bprithee\b/gi, replaceWith: 'please' },
  { pattern: /\bpray\b(?=\s+thee|\s+you)/gi, replaceWith: 'please' },
];

// Reason and reference words
const REFERENCE_WORDS = [
  { pattern: /\bwherefore\b/gi, replaceWith: 'why' },
  { pattern: /\btherefore\b/gi, replaceWith: 'therefore' },
  { pattern: /\bhereby\b/gi, replaceWith: 'by this' },
  { pattern: /\bthereby\b/gi, replaceWith: 'by that' },
  { pattern: /\bherein\b/gi, replaceWith: 'in this' },
  { pattern: /\btherein\b/gi, replaceWith: 'in that' },
  { pattern: /\bhereof\b/gi, replaceWith: 'of this' },
  { pattern: /\bthereof\b/gi, replaceWith: 'of that' },
  { pattern: /\bhereupon\b/gi, replaceWith: 'upon this' },
  { pattern: /\bthereupon\b/gi, replaceWith: 'upon that' },
];

// Time and manner
const TIME_MANNER = [
  { pattern: /\bforthwith\b/gi, replaceWith: 'immediately' },
  { pattern: /\banon\b/gi, replaceWith: 'soon' },
  { pattern: /\bstraightway\b/gi, replaceWith: 'immediately' },
  { pattern: /\bbetimes\b/gi, replaceWith: 'early' },
  { pattern: /\bofttimes\b/gi, replaceWith: 'often' },
  { pattern: /\boft\b/gi, replaceWith: 'often' },
];

// Quantifiers
const QUANTIFIERS = [
  { pattern: /\baught\b/gi, replaceWith: 'anything' },
  { pattern: /\bnaught\b/gi, replaceWith: 'nothing' },
  { pattern: /\bsomewhat\b/gi, replaceWith: 'something' },
];

// Contractions
const CONTRACTIONS = [
  { pattern: /\b'tis\b/gi, replaceWith: "it is" },
  { pattern: /\b'twas\b/gi, replaceWith: "it was" },
  { pattern: /\b'twere\b/gi, replaceWith: "it were" },
  { pattern: /\b'twould\b/gi, replaceWith: "it would" },
  { pattern: /\b'twill\b/gi, replaceWith: "it will" },
  { pattern: /\bo'er\b/gi, replaceWith: 'over' },
  { pattern: /\be'er\b/gi, replaceWith: 'ever' },
  { pattern: /\bne'er\b/gi, replaceWith: 'never' },
  { pattern: /\be'en\b/gi, replaceWith: 'even' },
];

// Combine all replacements
const BASIC_REPLACEMENTS = [
  ...PRONOUNS,
  ...VERBS,
  ...ADVERBS_CONJUNCTIONS,
  ...PREPOSITIONS,
  ...EXCLAMATIONS,
  ...REFERENCE_WORDS,
  ...TIME_MANNER,
  ...QUANTIFIERS,
  ...CONTRACTIONS,
];

// Suffix transformations (-eth, -est, -st endings)
const SUFFIX_RULES = [
  // -eth endings (3rd person singular): "he goeth" → "he goes"
  {
    pattern: /\b(\w+?)eth\b/gi,
    replacer: (match, stem) => {
      // Handle special cases
      if (stem.toLowerCase() === 'hath') return 'has';
      if (stem.toLowerCase() === 'doth') return 'does';
      // Add 's' or 'es' depending on stem ending
      if (/[sxz]$|[cs]h$/.test(stem)) return `${stem}es`;
      return `${stem}s`;
    }
  },
  // -est endings (2nd person singular): "thou goest" → "you go"
  {
    pattern: /\b(\w+?)est\b/gi,
    replacer: (match, stem) => {
      // Preserve if it's a superlative (finest, greatest, etc.)
      if (/[aeiou]/.test(stem.slice(-1))) return match;
      return stem;
    }
  },
  // -st endings (2nd person): "thou hast" → "you have"
  {
    pattern: /\b(\w{3,}?)st\b/gi,
    replacer: (match, stem) => {
      // Only transform if clearly a verb form
      const exceptions = ['first', 'last', 'most', 'best', 'worst', 'fast', 'just', 'must', 'past', 'test', 'rest', 'west', 'east', 'cost', 'list', 'lost'];
      if (exceptions.includes(match.toLowerCase())) return match;
      return stem;
    }
  },
];

export function modernizeOffline(input) {
  if (!input || typeof input !== 'string') {
    return input;
  }

  let output = input;

  // Apply all word replacements
  for (const { pattern, replaceWith } of BASIC_REPLACEMENTS) {
    output = output.replace(pattern, replaceWith);
  }

  // Apply suffix transformations
  for (const { pattern, replacer } of SUFFIX_RULES) {
    output = output.replace(pattern, replacer);
  }

  // Clean up spacing
  output = output.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:!?])/g, '$1');

  // Fix common word order inversions (simplified)
  // "Said he" → "He said"
  output = output.replace(/\b(said|spoke|replied|answered)\s+(he|she|I|you|they|we)\b/gi, (_, verb, pronoun) => {
    return `${pronoun} ${verb.toLowerCase()}`;
  });

  // "Dost you" → "Do you" (after earlier replacements)
  output = output.replace(/\bdost\s+you\b/gi, 'do you');

  // Normalize case after "it is/was" replacements
  output = output.replace(/\bit is\b/gi, (match, offset) => {
    return offset === 0 ? 'It is' : match.toLowerCase();
  });

  return output.trim();
}
