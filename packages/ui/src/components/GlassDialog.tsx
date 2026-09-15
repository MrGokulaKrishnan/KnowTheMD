import React from 'react';
import { GlassModal } from './GlassModal';
import { GlassButton } from './GlassButton';
import { AlertTriangle, HelpCircle } from 'lucide-react';

export interface GlassDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  type?: 'confirm' | 'warning' | 'danger';
  confirmLabel?: string;
  cancelLabel?: string;
  secondaryLabel?: string;
  onConfirm: () => void;
  onSecondary?: () => void;
}

export const GlassDialog: React.FC<GlassDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'confirm',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  secondaryLabel,
  onConfirm,
  onSecondary,
}) => {
  const icon =
    type === 'danger' || type === 'warning' ? (
      <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
    ) : (
      <HelpCircle className="w-6 h-6 text-cyan-400 shrink-0" />
    );

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={false}>
      <div className="flex items-start gap-4">
        {icon}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
          <div className="text-xs text-slate-300 leading-relaxed mb-6">{message}</div>
          <div className="flex items-center justify-end gap-2.5">
            <GlassButton variant="ghost" size="sm" onClick={onClose}>
              {cancelLabel}
            </GlassButton>
            {secondaryLabel && onSecondary && (
              <GlassButton variant="secondary" size="sm" onClick={onSecondary}>
                {secondaryLabel}
              </GlassButton>
            )}
            <GlassButton
              variant={type === 'danger' ? 'danger' : 'primary'}
              size="sm"
              onClick={onConfirm}
            >
              {confirmLabel}
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassModal>
  );
};
