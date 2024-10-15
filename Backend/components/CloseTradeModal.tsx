// components/AdminComponents/CloseTradeModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CloseTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (closeType: 'PROFIT' | 'LOSS') => void;
}

const CloseTradeModal: React.FC<CloseTradeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Trade</DialogTitle>
        </DialogHeader>
        <p>How would you like to close this trade?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onConfirm('PROFIT')} className="bg-green-500 hover:bg-green-600">
            Close with Profit
          </Button>
          <Button onClick={() => onConfirm('LOSS')} className="bg-red-500 hover:bg-red-600">
            Close with Loss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloseTradeModal;