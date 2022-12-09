const cipher = (salt: string) => {
    const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
    const byteHex = (n: any) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code: any) => textToChars(salt).reduce((a,b) => a ^ b, code);
    return (text: any) => text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
}
const decipher = (salt: string) => {
    const textToChars = (text: any) => text.split('').map((c: any) => c.charCodeAt(0));
    const applySaltToChar = (code: any) => textToChars(salt).reduce((a: any,b: any) => a ^ b, code);
    return (encoded: any) => encoded.match(/.{1,2}/g)
      .map((hex: any) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode: any) => String.fromCharCode(charCode))
      .join('');
}
const SECRET = "pintamostodalacasa"
const myCipher = cipher('mySecretSalt')
const myDecipher = decipher('mySecretSalt')


export const encrypt = (text: string) => myCipher(text)
export const decrypt = (text: string) => myDecipher(text)


export const validateDecrypted = (text: string) => {
  // validate if the decrypted text is alphanumeric and has spaces
  const regex = /^[a-zA-Z0-9 ]+$/;
  return regex.test(text);
}