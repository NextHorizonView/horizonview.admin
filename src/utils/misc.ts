const generateReferralCode = (name: string, phoneNumber: string) => {
  const namePart = name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
  const phonePart = phoneNumber.slice(-3); // Last three characters of the phone number

  return `${namePart}${phonePart}`;
};

export default generateReferralCode;
