export const REJECTION_REASONS: Record<string, string> = {
  low_quality_images: 'Fotos de baja calidad',
  insufficient_info: 'Información insuficiente',
  prohibited_item: 'Artículo prohibido',
  suspected_fraud: 'Sospecha de fraude',
  wrong_category: 'Categoría incorrecta',
  duplicate: 'Anuncio duplicado',
  price_unrealistic: 'Precio irreal',
  other: 'Otro motivo',
};

export const FLAG_RESOLUTIONS: Record<string, string> = {
  removed: 'Anuncio retirado',
  warned_seller: 'Aviso al vendedor',
  no_action: 'Sin acción',
  duplicate_report: 'Reporte duplicado',
  invalid: 'Reporte inválido',
};

export const VERIFICATION_REJECTIONS: Record<string, string> = {
  document_illegible: 'Documento ilegible',
  document_mismatch: 'Documento no coincide',
  suspected_fraud: 'Sospecha de fraude',
  incomplete: 'Datos incompletos',
  other: 'Otro motivo',
};

export const FLAG_REASONS: Record<string, string> = {
  fraud: 'Fraude',
  prohibited: 'Prohibido',
  spam: 'Spam',
  other: 'Otro',
};
