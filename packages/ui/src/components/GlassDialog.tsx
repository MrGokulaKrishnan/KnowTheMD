import React from 'react';
import { GlassModal } from './GlassModal';
import { GlassButton } from './GlassButton';
import { AlertTriangle, HelpCircle, Info } from 'lucide-react';

export interface GlassDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  type?: 'confirm' | 'warning' | 'danger' | 'info';
  confirmLabel?: string;
  cancelLabel?: string;
  secondaryLabel?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
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
  maxWidth = 'md',
  onConfirm,
  onSecondary,
}) => {
  const icon =
    type === 'danger' || type === 'warning' ? (
      <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
    ) : type === 'info' ? (
      <Info className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
    ) : (
      <HelpCircle className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
    );

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} maxWidth={maxWidth} showCloseButton={false}>
      <div className="flex items-start gap-4 min-w-0 w-full">
        {icon}
        <div className="flex-1 min-w-0 w-full overflow-hidden">
          <h3 className="text-base font-semibold text-white mb-2 break-words [overflow-wrap:anywhere] [word-break:break-word]">
            {title}
          </h3>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 break-words [overflow-wrap:anywhere] [word-break:break-word] max-h-[55vh] overflow-y-auto pr-1 [&_*]:max-w-full [&_pre]:overflow-x-auto [&_code]:break-all">
            {message}
          </div>
          <div className="flex items-center justify-end gap-2.5 flex-wrap">
            {cancelLabel && (
              <GlassButton variant="ghost" size="sm" onClick={onClose}>
                {cancelLabel}
              </GlassButton>
            )}
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
