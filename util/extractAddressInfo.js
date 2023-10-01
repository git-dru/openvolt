function extractAddressInfo(address) {
  // Simplistic regex to match a UK postal code
  const postalCodeRegex = /[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][A-Z]{2}/;
  const postalCodeMatch = address.match(postalCodeRegex);
  const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';

  // Check if the string contains the word 'London'
  const city = address.includes('London') ? 'London' : '';

  return { postalCode, city };
}

module.exports = extractAddressInfo;