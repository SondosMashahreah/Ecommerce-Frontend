import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { localizedProductName, localizedProductDescription } from '../../i18n/productContent';

// Translate the displayed value, retaining the original form state until an
// intentional edit. Existing category selections map back to their API value.
export default function LocalizedCatalogInput({ value, onChange, choices = [], multiline = false, ...props }) {
  const { i18n } = useTranslation();
  const [draft, setDraft] = useState(null);
  const localize = multiline ? localizedProductDescription : localizedProductName;
  const display = localize(value, i18n.language);
  const Input = multiline ? 'textarea' : 'input';
  return <Input {...props} value={draft ?? display}
    onFocus={() => setDraft(display)} onBlur={() => setDraft(null)}
    onChange={(event) => {
      const text = event.target.value;
      setDraft(text);
      const original = choices.find((choice) => localize(choice, i18n.language) === text);
      // Focusing and leaving a translated field must never rewrite a DB value.
      onChange({ target: { name: props.name, value: text === display ? value : original ?? text } });
    }} />;
}
