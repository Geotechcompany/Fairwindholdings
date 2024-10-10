import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProfitCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfitCalculatorModal({ isOpen, onClose }: ProfitCalculatorModalProps) {
  const [volume, setVolume] = useState<number>(100);
  const [entryPrice, setEntryPrice] = useState<number>(2653.36);
  const [takeProfit, setTakeProfit] = useState<number>(2654.36);
  const [stopLoss, setStopLoss] = useState<number>(2652.36);

  const [leverage, setLeverage] = useState<number>(50);
  const [requiredMargin, setRequiredMargin] = useState<number>(0);
  const [profitFromTP, setProfitFromTP] = useState<number>(0);
  const [lossFromSL, setLossFromSL] = useState<number>(0);
  const [roe, setRoe] = useState<number>(0);
  const [pip, setPip] = useState<number>(0);

  useEffect(() => {
    const pipValue = 0.1; // Assuming $0.1 per pip for 1 unit of gold
    const lotSize = volume / 100; // Convert volume to lot size (100 units = 1 lot for gold)

    const newRequiredMargin = (volume * entryPrice) / leverage;
    const newProfitFromTP = (takeProfit - entryPrice) * volume;
    const newLossFromSL = (entryPrice - stopLoss) * volume;
    const newRoe = (newProfitFromTP / newRequiredMargin) * 100;
    const newPip = pipValue * lotSize;

    setRequiredMargin(newRequiredMargin);
    setProfitFromTP(newProfitFromTP);
    setLossFromSL(newLossFromSL);
    setRoe(newRoe);
    setPip(newPip);
  }, [volume, entryPrice, takeProfit, stopLoss, leverage]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setter(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] md:max-w-[800px] max-h-[90vh]">
        <button
            onClick={onClose}
            className="absolute -top-4 -left-4 bg-gray-500 text-white p-2 rounded-full shadow-md z-10"
            aria-label="Close"
          >
            <X className="font-bold" size={20} />
          </button>
          <div className="bg-[#1e2329] text-white p-4 rounded-lg shadow-xl overflow-y-auto h-full">
          <div className="flex mb-4">
            <Button className="bg-green-500 hover:bg-green-600 w-[80px] text-sm font-bold">BUY</Button>
            <Button className="bg-[#2c3035] hover:bg-[#3c4045] w-[80px] text-sm font-bold ml-2">SELL</Button>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Inputs */}
            <div className="w-full md:w-1/2 space-y-2 mb-4 md:mb-0">
              <div className="flex justify-between items-center bg-[#2c3035] p-2">
                <span className="text-gray-400 text-xs">Volume</span>
                <Input
                  value={volume}
                  onChange={handleInputChange(setVolume)}
                  className="bg-transparent text-white border-none text-right w-1/2 text-sm"
                />
              </div>
              <div className="flex justify-between items-center bg-[#2c3035] p-2">
                <span className="text-gray-400 text-xs">Entry Price</span>
                <Input
                  value={entryPrice}
                  onChange={handleInputChange(setEntryPrice)}
                  className="bg-transparent text-white border-none text-right w-1/2 text-sm"
                />
              </div>
              <div className="flex justify-between items-center bg-[#2c3035] p-2">
                <span className="text-gray-400 text-xs">Take Profit</span>
                <Input
                  value={takeProfit}
                  onChange={handleInputChange(setTakeProfit)}
                  className="bg-transparent text-white border-none text-right w-1/2 text-sm"
                />
              </div>
              <div className="flex justify-between items-center bg-[#2c3035] p-2">
                <span className="text-gray-400 text-xs">Stop Loss</span>
                <Input
                  value={stopLoss}
                  onChange={handleInputChange(setStopLoss)}
                  className="bg-transparent text-white border-none text-right w-1/2 text-sm"
                />
              </div>
            </div>
            
            {/* Outputs */}
            <div className="w-full md:w-1/2">
              <div className="bg-[#2c3035] p-3 rounded-md h-full">
                <h3 className="text-sm mb-2 font-bold">Calculations for Gold</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Leverage</span>
                    <span className="text-xs">1:{leverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Required Margin</span>
                    <span className="text-xs">{requiredMargin.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Profit from TP</span>
                    <span className="text-xs">{profitFromTP.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Loss from SL</span>
                    <span className="text-xs">{lossFromSL.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">ROE</span>
                    <span className="text-xs">{roe.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">PIP</span>
                    <span className="text-xs">{pip.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfitCalculatorModal;