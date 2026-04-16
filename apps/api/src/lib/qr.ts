import QRCode from 'qrcode';

const QR_OPTIONS = {
  errorCorrectionLevel: 'H' as const,
  width: 300,
};

/**
 * Generate a registration QR code as a base64 data URL (PNG).
 * Encodes: `{baseUrl}/registrations/{registrationId}`
 */
export async function generateRegistrationQR(
  registrationId: string,
  baseUrl: string,
): Promise<string> {
  const url = `${baseUrl}/registrations/${registrationId}`;
  return QRCode.toDataURL(url, QR_OPTIONS);
}

/**
 * Generate a permanent vehicle QR code as a base64 data URL (PNG).
 * Encodes: `{baseUrl}/vote/{vehicleId}` — intended for vehicle plaques.
 */
export async function generateVehicleQR(
  vehicleId: string,
  baseUrl: string,
): Promise<string> {
  const url = `${baseUrl}/vote/${vehicleId}`;
  return QRCode.toDataURL(url, QR_OPTIONS);
}

/**
 * Generate a QR code as a PNG Uint8Array for serving as an image response.
 */
export async function generateQRPNG(data: string): Promise<Uint8Array> {
  const buf = await QRCode.toBuffer(data, QR_OPTIONS);
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}
