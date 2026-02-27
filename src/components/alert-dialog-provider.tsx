'use client';

import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface AlertDialogState {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

let showAlertDialog: (config: Omit<AlertDialogState, 'isOpen'>) => void;

export function AlertDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlertDialogState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  useEffect(() => {
    showAlertDialog = (config) => {
      setState({
        isOpen: true,
        ...config,
      });
    };
  }, []);

  const handleClose = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
    state.onCancel?.();
  };

  const handleConfirm = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
    state.onConfirm?.();
  };

  const getIcon = () => {
    switch (state.type) {
      case 'success':
        return <CheckCircle2 className="size-6 text-emerald-600" />;
      case 'error':
        return <XCircle className="size-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="size-6 text-amber-600" />;
      case 'confirm':
        return <AlertCircle className="size-6 text-blue-600" />;
      default:
        return <Info className="size-6 text-blue-600" />;
    }
  };

  return (
    <>
      {children}
      <AlertDialog open={state.isOpen} onOpenChange={handleClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              {getIcon()}
              <AlertDialogTitle className="text-xl">{state.title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2 text-base leading-relaxed">
              {state.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {state.type === 'confirm' ? (
              <>
                <AlertDialogCancel onClick={handleClose}>
                  {state.cancelText || 'Cancel'}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirm}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {state.confirmText || 'Confirm'}
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction onClick={handleClose} className="bg-emerald-600 hover:bg-emerald-700">
                OK
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Helper functions to show alerts
export const alertDialog = {
  success: (title: string, message: string, onConfirm?: () => void) => {
    showAlertDialog({ type: 'success', title, message, onConfirm });
  },
  error: (title: string, message: string, onConfirm?: () => void) => {
    showAlertDialog({ type: 'error', title, message, onConfirm });
  },
  warning: (title: string, message: string, onConfirm?: () => void) => {
    showAlertDialog({ type: 'warning', title, message, onConfirm });
  },
  info: (title: string, message: string, onConfirm?: () => void) => {
    showAlertDialog({ type: 'info', title, message, onConfirm });
  },
  confirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string,
  ) => {
    showAlertDialog({ type: 'confirm', title, message, onConfirm, onCancel, confirmText, cancelText });
  },
};
