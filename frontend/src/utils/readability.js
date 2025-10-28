export const calculateReadabilityScore = (text) => {
  const words = text.split(/\s+/).length;
  const sentences = (text.match(/[.!?]+/g) || []).length || 1;
  const syllables = countSyllables(text);
  
  // Flesch Reading Ease
  const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
};

const countSyllables = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  let count = 0;
  
  words.forEach(word => {
    word = word.replace(/[^a-z]/g, '');
    if (word.length <= 3) {
      count++;
      return;
    }
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllableMatches = word.match(/[aeiouy]{1,2}/g);
    count += syllableMatches ? syllableMatches.length : 1;
  });
  
  return count;
};

export const getReadingLevelDescription = (score) => {
  if (score >= 90) return 'Very Easy (5th grade)';
  if (score >= 80) return 'Easy (6th grade)';
  if (score >= 70) return 'Fairly Easy (7th grade)';
  if (score >= 60) return 'Standard (8-9th grade)';
  if (score >= 50) return 'Fairly Difficult (10-12th grade)';
  if (score >= 30) return 'Difficult (College)';
  return 'Very Difficult (Professional)';
};