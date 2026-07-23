import styles from './Field.module.css';

/**
 * Field — underline, not box. Label always visible above the field (placeholder-as-label
 * is forbidden — it fails screen readers and destroys context on first keystroke).
 * Required is stated as the word "required", never an asterisk. Errors state the
 * correction and are linked via aria-describedby (Design System Part 8).
 *
 * Uncontrolled by default (holds its own value); a parent form reads via FormData.
 * Validation is the parent's job and fires on blur — Field only renders the error it is given.
 */

type Props = {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  error?: string | undefined;
  className?: string | undefined;
};

export function Field({ label, name, type = 'text', required = false, error, className }: Props) {
  const errorId = error ? `${name}-error` : undefined;
  const isNumericLike = type === 'tel';
  const inputClass = [styles.input, isNumericLike ? styles.mono : null].filter(Boolean).join(' ');

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required ? <span className={styles.required}> required</span> : null}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          required={required}
          rows={4}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={inputClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={inputClass}
        />
      )}

      {error ? (
        <span id={errorId} role="alert" className={styles.error}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
