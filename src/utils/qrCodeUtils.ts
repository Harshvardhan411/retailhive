import QRCode from 'qrcode';

export interface OfferQRData {
  offerId: string;
  title: string;
  discount: string;
  description: string;
  shopId?: string;
  shopName?: string;
}

/**
 * Generates a QR code for an offer
 * @param offerData - The offer data to encode
 * @returns Promise<string> - Base64 encoded QR code image
 */
export async function generateOfferQRCode(offerData: OfferQRData): Promise<string> {
  try {
    const qrData = JSON.stringify({
      type: 'offer',
      ...offerData,
      timestamp: new Date().toISOString()
    });
    
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generates a QR code for a shop
 * @param shopData - The shop data to encode
 * @returns Promise<string> - Base64 encoded QR code image
 */
export async function generateShopQRCode(shopData: {
  shopId: string;
  shopName: string;
  ownerName: string;
  address: string;
}): Promise<string> {
  try {
    const qrData = JSON.stringify({
      type: 'shop',
      ...shopData,
      timestamp: new Date().toISOString()
    });
    
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Downloads a QR code as an image file
 * @param qrCodeDataURL - The QR code data URL
 * @param filename - The filename for the download
 */
export function downloadQRCode(qrCodeDataURL: string, filename: string): void {
  const link = document.createElement('a');
  link.href = qrCodeDataURL;
  link.download = `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 