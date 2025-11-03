const BASIC_REPLACEMENTS = [
  { pattern: /\bthou\b/gi, replaceWith: 'you' },
  { pattern: /\bthee\b/gi, replaceWith: 'you' },
  { pattern: /\bthy\b/gi, replaceWith: 'your' },
  { pattern: /\bthine\b/gi, replaceWith: 'yours' },
  { pattern: /\bhath\b/gi, replaceWith: 'has' },
  { pattern: /\bdoth\b/gi, replaceWith: 'does' },
  { pattern: /\bart\b/gi, replaceWith: 'are' },
  { pattern: /\bshalt\b/gi, replaceWith: 'will' },
  { pattern: /\bshouldst\b/gi, replaceWith: 'should' },
  { pattern: /\bwilt\b/gi, replaceWith: 'will' },
  { pattern: /\bwhilst\b/gi, replaceWith: 'while' },
  { pattern: /\bamidst\b/gi, replaceWith: 'among' },
  { pattern: /\bamongst\b/gi, replaceWith: 'among' },
  { pattern: /\bbetwixt\b/gi, replaceWith: 'between' },
  { pattern: /\bere\b/gi, replaceWith: 'before' },
  { pattern: /\bunto\b/gi, replaceWith: 'to' },
  { pattern: /\bo’er\b/gi, replaceWith: 'over' },
  { pattern: /\bo'er\b/gi, replaceWith: 'over' },
  { pattern: /\bne’er\b/gi, replaceWith: 'never' },
  { pattern: /\bne'er\b/gi, replaceWith: 'never' },
  { pattern: /\bnay\b/gi, replaceWith: 'no' },
  { pattern: /\byea\b/gi, replaceWith: 'yes' },
  { pattern: /\bwherefore\b/gi, replaceWith: 'why' },
  { pattern: /\bforthwith\b/gi, replaceWith: 'immediately' },
  { pattern: /\bherein\b/gi, replaceWith: 'in this' },
  { pattern: /\bthereof\b/gi, replaceWith: 'of that' },
  { pattern: /\baught\b/gi, replaceWith: 'anything' }
];

const SUFFIX_RULES = [
  {
    pattern: /\b(\w+?)eth\b/gi,
    replacer: (_, stem) => `${stem}s`
  },
  {
    pattern: /\b(\w+?)est\b/gi,
    replacer: (_, stem) => `${stem}`
  }
];

export function modernizeOffline(input) {
  if (!input || typeof input !== 'string') {
    return input;
  }

  let output = input;

  for (const { pattern, replaceWith } of BASIC_REPLACEMENTS) {
    output = output.replace(pattern, replaceWith);
  }

  for (const { pattern, replacer } of SUFFIX_RULES) {
    output = output.replace(pattern, replacer);
  }

  // Collapse multiple spaces that may appear after replacements.
  output = output.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:!?])/g, '$1');

  return output.trim();
}
