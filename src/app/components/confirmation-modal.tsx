import { X } from "lucide-react";

interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subtitle: string;
}

export function ConfirmationModal({
  onClose,
  onConfirm,
  title,
  subtitle = "",
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative z-50 w-[480px] overflow-hidden rounded-lg bg-neutral-900 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-md mb-4 px-4 text-gray-200">{subtitle}</p>
        <div className="bottom-0 w-full p-4">
          <div className="float-right mb-4 mr-1">
            <button
              onClick={() => void onClose()}
              className="mr-2 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-black"
            >
              Cancel
            </button>
            <button
              onClick={() => void onConfirm()}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
