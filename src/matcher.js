/**
 * Creates a new matcher function based on the specified type.
 * @param {string} type - The type of matcher to create. Can be "map" or any other value.
 * @returns {object} - The matcher object corresponding to the specified type. Returns MapMatcher if the type is "map", or RegexMatcher otherwise.
 */
const NewMatcher = (type) => {
  return type === "map" ? MapMatcher : RegexMatcher;
};

/**
 * Matches words in a message using a Map data structure.
 */
const MapMatcher = {
  /**
   * GetEmojis - Matches words in a message using a Map data structure.
   * @param {string} message - The message to match words against.
   * @returns {Array} - An array of emoji indexes corresponding to the matched words.
   */
  GetEmojis: (message, emojiList) => {
    const words = new Map();
    sanitizeString(message)
      .split(" ")
      .forEach((word) => {
        if (!words.has(word)) {
          words.set(word, "");
        }
      });
    const matches = [];
    for (const tech in emojiList) {
      if (words.has(tech)) {
        matches.push(tech);
      }
    }
    return matches;
  },
};

/**
 * Matches words in a message using regular expressions.
 */
const RegexMatcher = {
  /**
   * GetEmojis - Matches words in a message using regular expressions.
   * @param {string} message - The message to match words against.
   * @returns {Array} - An array of emoji indexes corresponding to the matched words.
   */
  GetEmojis: (message, emojiList) => {
    const matches = [];
    message = sanitizeString(message);
    for (const [key, value] of Object.entries(emojiList)) {
      if (isLanguageWithSpecialChars(key.toLowerCase())) {
        if (message.includes(key.toLowerCase())) {
          matches.push(key);
        }
        continue;
      }

      let regexKey = "\\b" + key + "\\b";
      const regex = new RegExp(regexKey, "i");

      if (regex.test(message)) {
        matches.push(key);
      }
    }
    return matches;
  },
};

/**
 * Sanitizes a string by removing all characters except alphanumeric characters, spaces, "#" and "+" symbols.
 * Converts the string to lowercase.
 * @param {string} str - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
const sanitizeString = (str) => {
  return str.replace(/[^\w\s#\+\.]/g, " ").toLocaleLowerCase();
};

/**
 * Checks if the given key represents a programming language with special characters.
 * @param {string} key - The key to check.
 * @returns {boolean} - True if the key represents "c++", "c#", or ".net", otherwise false.
 */
const isLanguageWithSpecialChars = (key) => {
  return key === "c++" || key === "c#" || key === ".net";
};

module.exports = { NewMatcher, MapMatcher, RegexMatcher };
