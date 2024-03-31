export function zipcodeMask(code: number): string {
    const zipcode = code.toString()

    const parte1 = zipcode.substring(0, zipcode.length - 3);
    const parte2 = zipcode.substring(zipcode.length - 3);
    
    return `${parte1}-${parte2}`;
  }