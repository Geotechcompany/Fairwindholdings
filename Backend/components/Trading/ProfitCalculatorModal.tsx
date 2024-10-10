import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export function ProfitCalculator() {
  const [volume, setVolume] = useState<number>(10);
  const [entryPrice, setEntryPrice] = useState<number>(2612.33);
  const [takeProfit, setTakeProfit] = useState<number>(2622.33);
  const [stopLoss, setStopLoss] = useState<number>(2602.33);
  const [leverage, setLeverage] = useState<number>(50);

  const [requiredMargin, setRequiredMargin] = useState<number>(0);
  const [profitFromTP, setProfitFromTP] = useState<number>(0);
  const [lossFromSL, setLossFromSL] = useState<number>(0);
  const [roe, setRoe] = useState<number>(0);
  const [pip, setPip] = useState<number>(0);

  useEffect(() => {
    const pipValue = 0.1;
    const lotSize = volume / 100;

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

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<number>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        setter(value);
      }
    };

  return (
    <div className="bg-[#1e2329] text-white p-4 rounded-lg shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Profit Calculator</h2>
      <div className="space-y-4">
        <InputField
          label="Volume"
          value={volume}
          onChange={handleInputChange(setVolume)}
        />
        <InputField
          label="Entry Price"
          value={entryPrice}
          onChange={handleInputChange(setEntryPrice)}
        />
        <InputField
          label="Take Profit"
          value={takeProfit}
          onChange={handleInputChange(setTakeProfit)}
        />
        <InputField
          label="Stop Loss"
          value={stopLoss}
          onChange={handleInputChange(setStopLoss)}
        />

        <div className="bg-[#2c3035] p-4 rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-3">Calculations for Gold</h3>
          <div className="space-y-2">
            <ResultRow label="Leverage" value={`1:${leverage}`} />
            <ResultRow
              label="Required Margin"
              value={`${requiredMargin.toFixed(2)} USD`}
            />
            <ResultRow
              label="Profit from TP"
              value={`${profitFromTP.toFixed(2)} USD`}
            />
            <ResultRow
              label="Loss from SL"
              value={`${lossFromSL.toFixed(2)} USD`}
            />
            <ResultRow label="ROE" value={`${roe.toFixed(2)}%`} />
            <ResultRow label="PIP" value={`${pip.toFixed(2)} USD`} />
          </div>
        </div>
      </div>
    </div>
  );
}

const InputField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-400 mb-1">{label}</label>
    <Input
      value={value}
      onChange={onChange}
      className="bg-[#2c3035] text-white border-none rounded-md p-2"
    />
  </div>
);

const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default ProfitCalculator;
