import React, { useState, useEffect, useRef } from 'react';
import { SimulationScenario } from '../types';
import { Play, Square } from 'lucide-react';

interface SimulatorViewProps {
  scenarios: SimulationScenario[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  onSimulationComplete?: (result: any) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onSimulationComplete,
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const selectedScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  useEffect(() => {
    let interval: any = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toISOString()}] ${msg}`]);
  };

  const handleArmSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
      setCurrentStage(0);
      setTimerSeconds(0);
      setTerminalLogs([]);
      return;
    }

    setIsSimulating(true);
    setCurrentStage(1);
    setTimerSeconds(0);
    setTerminalLogs([]);
    
    // Rapid scrolling logs simulation
    let logCount = 0;
    const logInterval = setInterval(() => {
      if (logCount < 40) {
        addLog(`SYS_THREAD_${Math.floor(Math.random() * 9999)}: Processing metric payload chunk 0x${Math.floor(Math.random() * 10000).toString(16).toUpperCase()}`);
        logCount++;
      }
    }, 100);

    setTimeout(() => {
      clearInterval(logInterval);
      addLog(`CRITICAL: ${selectedScenario.title} detected on ${selectedScenario.targetService}`);
      setCurrentStage(2);
    }, 2500);

    setTimeout(() => {
      addLog(`AI DIAGNOSIS: Initiating dense vector retrieval from ChromaDB...`);
      setCurrentStage(3);
    }, 5000);

    setTimeout(() => {
      addLog(`ACTION: Synthesizing recovery plan. Executing safe runbook procedures...`);
      setCurrentStage(4);
    }, 8000);

    setTimeout(() => {
      addLog(`SUCCESS: Audit log committed. Incident resolved.`);
      setCurrentStage(5);
      if (onSimulationComplete) onSimulationComplete(selectedScenario);
    }, 11000);
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 ${isSimulating ? 'bg-[#1a0505]' : 'bg-[#050505]'} text-[#F1F1F1] font-sans flex flex-col p-6 md:p-12 border-t border-[#333]`}>
      
      {/* Header & Horizontal Selector */}
      <div className="w-full flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-8 pb-8 border-b border-[#333]">
        <div className="w-full xl:w-2/3">
          <div className="label-caps text-[#8E8E8E] mb-4">// SIMULATION SCENARIO SELECTOR</div>
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {scenarios.map((scen) => (
              <button
                key={scen.id}
                onClick={() => !isSimulating && onSelectScenario(scen.id)}
                className={`whitespace-nowrap font-display text-2xl md:text-4xl font-extrabold pb-2 transition-all ${
                  scen.id === activeScenarioId
                    ? 'text-[#FFFFFF] border-b-4 border-[#E8913C]'
                    : 'text-[#4A4A4A] border-b-4 border-transparent hover:text-[#8E8E8E]'
                }`}
              >
                {scen.title.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleArmSimulation}
          className={`flex-shrink-0 px-10 py-5 font-mono text-lg font-bold uppercase tracking-widest transition-all ${
            isSimulating
              ? 'bg-[#FF3333] text-white shadow-[0_0_30px_rgba(255,51,51,0.5)]'
              : 'bg-[#E8913C] text-[#050505] hover:bg-[#F1F1F1] hover:text-[#050505]'
          }`}
        >
          {isSimulating ? (
            <span className="flex items-center gap-3"><Square className="w-6 h-6 fill-current" /> HALT SIMULATION</span>
          ) : (
            <span className="flex items-center gap-3"><Play className="w-6 h-6 fill-current" /> ARM SIMULATION</span>
          )}
        </button>
      </div>

      {/* Operations Floor Layout */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left/Middle: Massive Terminal */}
        <div className="xl:col-span-3 flex flex-col bg-[#0A0A0A] border-2 border-[#333] relative overflow-hidden">
          
          {/* Terminal Header */}
          <div className="flex justify-between items-center bg-[#111] px-6 py-4 border-b border-[#333]">
            <div className="font-mono text-base font-bold text-[#E8913C]">
              {isSimulating ? '>>> ACTIVE SIMULATION STREAM' : '>>> TERMINAL STANDBY'}
            </div>
            <div className="font-mono text-base text-[#8E8E8E]">
              T-MINUS {timerSeconds.toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </div>
          </div>

          {/* Terminal Body */}
          <div 
            ref={terminalRef}
            className="flex-1 p-6 font-mono text-[16px] leading-[1.6] text-[#C8C8C8] overflow-y-auto h-[600px]"
          >
            {!isSimulating && terminalLogs.length === 0 && (
              <div className="h-full flex items-center justify-center text-[#4A4A4A] animate-pulse text-lg">
                WAITING FOR SIMULATION TRIGGER...
              </div>
            )}
            
            {terminalLogs.map((log, i) => (
              <div key={i} className={`mb-1 ${log.includes('CRITICAL') ? 'text-[#FF3333] font-bold' : log.includes('SUCCESS') ? 'text-[#00FF00] font-bold' : log.includes('AI DIAGNOSIS') ? 'text-[#E8913C]' : ''}`}>
                {log}
              </div>
            ))}
            {isSimulating && (
              <div className="animate-pulse text-[#E8913C] mt-2">_</div>
            )}
          </div>
          
          {/* Flashing Status Indicator if Simulating */}
          {isSimulating && (
            <div className="absolute top-4 right-4 w-4 h-4 bg-[#FF3333] rounded-full animate-ping shadow-[0_0_20px_#FF3333]" />
          )}
        </div>

        {/* Right: Execution Timeline */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="bg-[#0A0A0A] border-2 border-[#333] p-6 flex-1 flex flex-col">
            <h3 className="font-display text-2xl font-extrabold text-[#FFFFFF] mb-8 uppercase tracking-widest border-b border-[#333] pb-4">
              EXECUTION STATE
            </h3>
            
            <div className="flex flex-col gap-8 flex-1">
              {[
                { stage: 1, label: 'SIGNAL DETECTED' },
                { stage: 2, label: 'AI DIAGNOSIS' },
                { stage: 3, label: 'VECTOR RETRIEVAL' },
                { stage: 4, label: 'CONTROLLED ACTION' },
                { stage: 5, label: 'AUDIT COMMIT' }
              ].map((step) => {
                const isActive = currentStage === step.stage;
                const isPast = currentStage > step.stage;
                return (
                  <div key={step.stage} className={`flex flex-col transition-all duration-300 ${isActive || isPast ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-base font-bold text-[#8E8E8E]">STAGE 0{step.stage}</span>
                      {isActive && <span className="font-mono text-sm text-[#E8913C] animate-pulse">ACTIVE</span>}
                      {isPast && <span className="font-mono text-sm text-[#00FF00]">COMPLETE</span>}
                    </div>
                    <div className="font-display text-xl font-bold text-[#FFFFFF] mb-3 uppercase">
                      {step.label}
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#222]">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${isPast ? 'w-full bg-[#00FF00]' : isActive ? 'w-3/4 bg-[#E8913C] animate-pulse' : 'w-0 bg-transparent'}`} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
