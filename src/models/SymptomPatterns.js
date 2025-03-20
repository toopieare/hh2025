export const symptomPatterns = {
  "falls": {
    keywords: ["fall", "fell", "falling", "fallen", "tripped", "collapsed", "falls", "slip", "slipped"],
    negationWords: ["no", "not", "didn't", "never", "hasn't", "don't", "doesn't", "haven't"],
    positiveIndicators: ["yes", "did", "had", "has", "week ago", "weeks ago", "month ago", "recently"]
  },
  "memory": {
    keywords: ["forget", "memory", "remember", "confused", "confusion", "forgetful"],
    negationWords: ["no", "not", "didn't", "never", "normal"]
  },
  "recognition": {
    keywords: ["recognize", "recognise", "identify", "familiar", "know who", "forgot name", "forgot the name"],
    negationWords: ["no", "not", "didn't", "never", "normal"]
  },
  "language": {
    keywords: ["word", "speak", "talk", "language", "communicate", "speech", "express", "forgets words"],
    negationWords: ["no", "not", "didn't", "never", "normal"]
  },
  "executive": {
    keywords: ["money", "finances", "bills", "ATM", "banking", "financial", "budget"],
    negationWords: ["no", "not", "didn't", "never", "normal"]
  }
};