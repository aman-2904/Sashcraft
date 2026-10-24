export const WHATSAPP_SUPPORT_NUMBER = '9354953769';
export const WHATSAPP_COUNTRY_CODE = '91';
export const WHATSAPP_FULL_NUMBER = `${WHATSAPP_COUNTRY_CODE}${WHATSAPP_SUPPORT_NUMBER}`; // 919354953769
export const WHATSAPP_DISPLAY_NUMBER = '+91 93549 53769';

/**
 * Returns a wa.me URL for the official SashCraft WhatsApp support line (9354953769).
 * Accepts an optional pre-filled text message.
 */
export function getWhatsAppSupportUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_FULL_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
