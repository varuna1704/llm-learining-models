import React, { useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: string;
  description?: string;
  details?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  title,
  type = 'Concept Preview',
  description = '',
  details = '',
  onNext,
  onPrev,
}) => {
  const modalRef = useFocusTrap<HTMLDivElement>({ isOpen, onClose });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Lightbox preview: ${title}`}
        tabIndex={-1}
        style={{
          width: '90%',
          maxWidth: '720px',
          backgroundColor: 'rgba(15, 17, 26, 0.95)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
              }}
            >
              {type}
            </span>
            <h3 style={{ margin: '0.4rem 0 0 0', color: '#fff', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
            }}
            aria-label="Close lightbox"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '60vh', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {description && (
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, borderLeft: '3px solid var(--color-accent)', paddingLeft: '0.75rem' }}>
              {description}
            </p>
          )}
          {details && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              {details}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-dark)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onPrev && (
              <button className="btn" onClick={onPrev} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                ← Previous
              </button>
            )}
            {onNext && (
              <button className="btn" onClick={onNext} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                Next →
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
