import React, { useState, useEffect } from 'react';
import {
  Server,
  Users,
  Cloud,
  Database,
  Shield,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  UserMinus,
  UserPlus,
  LayoutDashboard,
  Settings,
  ClipboardCheck,
  FileText,
  Search,
  AlertTriangle,
  Lock,
  Activity,
  Network,
  Code,
  Key,
  Globe,
  Zap,
  Cpu,
  Terminal
} from 'lucide-react';

// --- Style Injection ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');
  
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .font-inter { font-family: 'Inter', sans-serif; }
  
  .bg-grid-pattern {
    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size: 24px 24px;
  }
  
  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }

  @keyframes dash-draw { to { stroke-dashoffset: -20; } }
  .animate-dash-flow { animation: dash-draw 1s linear infinite; }
  
  @keyframes scan { 0% { left: -50%; opacity: 0; } 50% { opacity: 1; } 100% { left: 150%; opacity: 0; } }
  .animate-scan { animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
  
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  .animate-float { animation: float 3s ease-in-out infinite; }
  
  @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0; } }
  .animate-pulse-ring { animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

  /* Traffic Animation */
  @keyframes packet-travel {
    0% { offset-distance: 0%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { offset-distance: 100%; opacity: 0; }
  }
  .packet {
    offset-rotate: auto;
    animation: packet-travel linear infinite;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

// --- Config ---
const APP_CONFIG = {
  colors: {
    legacy: { primary: 'text-orange-600', bg: 'bg-orange-500', border: 'border-orange-200', light: 'bg-orange-50/50' },
    monosign: { primary: 'text-indigo-600', bg: 'bg-indigo-600', border: 'border-indigo-200', light: 'bg-indigo-50/50' }
  }
};

const DEFAULT_STATS = { employees: 1000, servers: 500, cloudApps: 12, internalApps: 8 };

export default function MonoSignSimulator() {
  const [step, setStep] = useState('config');
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [activeScenario, setActiveScenario] = useState(null);
  const [simulationMode, setSimulationMode] = useState('legacy');
  const [viewMode, setViewMode] = useState('business');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [securityScore, setSecurityScore] = useState(100);
  const [timeSpent, setTimeSpent] = useState(0);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [scanActive, setScanActive] = useState(false);

  const handleConfigSubmit = (e) => { e.preventDefault(); setStep('dashboard'); };

  const resetSimulation = () => {
    setActiveScenario(null); setProgress(0); setLogs([]);
    setSecurityScore(100); setTimeSpent(0); setCompletedNodes([]); setScanActive(false);
  };

  useEffect(() => {
    if (!activeScenario) return;
    let interval;
    const isLegacy = simulationMode === 'legacy';
    const speed = isLegacy ? (activeScenario === 'audit' ? 0.8 : 1.5) : 5;

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanActive(false);
          let finalMsg = activeScenario === 'review' ? (isLegacy ? 'Campaign Closed. Rubber stamping detected.' : 'Campaign Complete. Toxic entitlements revoked.') :
            activeScenario === 'audit' ? (isLegacy ? 'Audit Prep Complete. Inconsistencies flagged.' : 'ISO 27001 Report Generated.') :
              `Process Completed. ${isLegacy ? 'Manual verification required.' : 'Audit logs synced.'}`;
          addLog({ time: 'Done', msg: finalMsg, type: isLegacy ? 'warning' : 'success' });
          return 100;
        }
        setTimeSpent(t => t + (isLegacy ? (activeScenario === 'audit' ? 120 : 15) : 0.5));

        if (isLegacy) {
          if (activeScenario === 'review' && prev > 60) setSecurityScore(s => Math.max(s - 0.2, 75));
          if (activeScenario === 'audit' && prev > 40) setSecurityScore(s => Math.max(s - 0.1, 80));
          if (activeScenario === 'mover' && prev > 50) setSecurityScore(s => Math.max(s - 0.5, 60));
          if (activeScenario === 'offboarding' && prev > 30) setSecurityScore(s => Math.max(s - 1, 40));
        } else { if (prev > 80) setSecurityScore(100); }

        handleStageEvents(Math.floor(prev / 20), isLegacy, activeScenario);
        if ((activeScenario === 'review' || activeScenario === 'audit') && prev < 90) setScanActive(true);
        return prev + speed;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [activeScenario, simulationMode]);

  const addLog = (log) => setLogs(prev => [log, ...prev].slice(0, 7));

  const handleStageEvents = (stage, isLegacy, scenario) => {
    const systems = [
      { id: 'ad', name: 'Local AD' }, { id: 'entra', name: 'Entra ID' },
      { id: 'm365', name: 'Microsoft 365' }, { id: 'internal', name: 'Internal Apps' },
      { id: 'servers', name: 'Server Fleet' }
    ];
    if (stage < systems.length) {
      const sys = systems[stage];
      if (!completedNodes.includes(sys.id)) {
        setCompletedNodes(prev => [...prev, sys.id]);
        let msg = '', type = 'neutral';
        if (scenario === 'onboarding') {
          msg = isLegacy ? `Ticket created for ${sys.name}...` : `Provisioned ${sys.name} via SCIM.`;
          type = isLegacy && sys.id === 'servers' ? 'warning' : 'success';
        } else if (scenario === 'offboarding') {
          msg = isLegacy ? `Risk: Access remains on ${sys.name}.` : `KILL SWITCH: Revoked ${sys.name}.`;
          type = isLegacy ? 'danger' : 'success';
          if (isLegacy && sys.id === 'ad') { msg = 'AD Disabled.'; type = 'neutral'; }
        } else if (scenario === 'mover') {
          msg = isLegacy ? `Added new role. Failed to remove old rights.` : `Role swap: Access rights updated.`;
          type = isLegacy ? 'danger' : 'success';
        } else if (scenario === 'review' || scenario === 'audit') {
          msg = isLegacy ? `Manual check on ${sys.name}.` : `Auto-scan ${sys.name} complete.`;
          type = 'info';
        }
        if (msg) addLog({ time: 'Now', msg, type });
      }
    }
  };

  if (step === 'config') return <ConfigScreen stats={stats} setStats={setStats} onSubmit={handleConfigSubmit} />;

  const isRunning = activeScenario !== null;
  const isLegacy = simulationMode === 'legacy';
  const modeColor = isLegacy ? APP_CONFIG.colors.legacy : APP_CONFIG.colors.monosign;

  return (
    <div className="min-h-screen bg-slate-50 font-inter flex flex-col">
      <Header stats={stats} setStep={setStep} />

      <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-[calc(100vh-80px)]">

        {/* Left Panel */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0">

          <Card className="p-1.5">
            <div className="grid grid-cols-2 gap-1 bg-slate-100/80 p-1 rounded-xl">
              <ModeButton label="Current State" icon={ShieldAlert} active={isLegacy} onClick={() => { if (!isRunning) { setSimulationMode('legacy'); resetSimulation(); } }} color="orange" />
              <ModeButton label="MonoSign IGA" icon={CheckCircle2} active={!isLegacy} onClick={() => { if (!isRunning) { setSimulationMode('monosign'); resetSimulation(); } }} color="indigo" />
            </div>
          </Card>

          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            <button onClick={() => setViewMode('business')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${viewMode === 'business' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Business Value</button>
            <button onClick={() => setViewMode('technical')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${viewMode === 'technical' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Technical Arch</button>
          </div>

          <Card className="flex-1 flex flex-col overflow-hidden shadow-lg shadow-slate-200/50">
            {/* UNIFIED CONTROLS: Available in BOTH views now */}
            <div className="p-5 md:p-6 pb-2 space-y-3 custom-scrollbar overflow-y-auto flex-1">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-poppins">Run Scenarios</h2>
              <ScenarioButton title="Onboarding" desc="Joiner: Provisioning" icon={UserPlus} active={activeScenario === 'onboarding'} onClick={() => { resetSimulation(); setActiveScenario('onboarding'); }} disabled={isRunning} />
              <ScenarioButton title="Role Change" desc="Mover: Dept switch" icon={Briefcase} active={activeScenario === 'mover'} onClick={() => { resetSimulation(); setActiveScenario('mover'); }} disabled={isRunning} />
              <ScenarioButton title="Offboarding" desc="Leaver: Revocation" icon={UserMinus} active={activeScenario === 'offboarding'} onClick={() => { resetSimulation(); setActiveScenario('offboarding'); }} disabled={isRunning} />
              <div className="h-px bg-slate-100 my-2"></div>
              <ScenarioButton title="Access Review" desc="Certification" icon={ClipboardCheck} active={activeScenario === 'review'} onClick={() => { resetSimulation(); setActiveScenario('review'); }} disabled={isRunning} />
              <ScenarioButton title="Audit" desc="Compliance Report" icon={FileText} active={activeScenario === 'audit'} onClick={() => { resetSimulation(); setActiveScenario('audit'); }} disabled={isRunning} />

              {/* Protocol Cheat Sheet (Visible in Tech Mode only) */}
              {viewMode === 'technical' && (
                <div className="mt-6 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Active Protocols</h3>
                  <div className="space-y-2">
                    {isLegacy ? (
                      <>
                        <TechBadge label="LDAP (389)" danger />
                        <TechBadge label="SSH (Static)" danger />
                      </>
                    ) : (
                      <>
                        <TechBadge label="OIDC / SAML" success />
                        <TechBadge label="SCIM 2.0" success />
                        <TechBadge label="SSH CA" success />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto bg-slate-50 border-t border-slate-100 p-5 md:p-6">
              {(isRunning || progress === 100) ? (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</span>
                    <span className={`text-lg font-bold font-poppins ${modeColor.primary}`}>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-6">
                    <div className={`h-full transition-all duration-300 rounded-full ${modeColor.bg}`} style={{ width: `${progress}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricBox label="Time Elapsed" value={`${Math.floor(timeSpent)} min`} icon={Clock} trend={!isLegacy ? 'down' : 'up'} />
                    <MetricBox label="Security Score" value={`${Math.round(securityScore)}`} icon={Lock} score={true} color={securityScore < 80 ? 'text-rose-600' : 'text-emerald-600'} />
                  </div>
                  {progress >= 100 && (
                    <button onClick={resetSimulation} className="mt-6 w-full py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center gap-2 group">
                      <RotateCcw className="h-4 w-4 group-hover:-rotate-180 transition-transform duration-500" /> Reset
                    </button>
                  )}
                </div>
              ) : <div className="text-center text-slate-400 text-sm py-4">Select a scenario to begin</div>}
            </div>
          </Card>
        </div>

        {/* Right Panel (Visuals) */}
        <div className="flex-1 flex flex-col gap-6 min-h-[600px]">
          <Card className="flex-1 relative bg-slate-50/50 flex flex-col shadow-inner border-slate-200 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]"></div>

            <div className="absolute top-6 right-6 z-20">
              <Badge type={isLegacy ? 'legacy' : 'monosign'}>{isLegacy ? 'LEGACY ARCH' : 'MONOSIGN ARCH'}</Badge>
            </div>

            {viewMode === 'business' ? (
              <div className="relative w-full h-full flex items-center p-8 animate-in fade-in duration-500">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <ResponsiveConnections mode={simulationMode} active={progress > 0 && progress < 100} />
                </div>
                <div className="w-1/3 flex items-center justify-center z-10 pl-4">
                  <Node title="HR / Local AD" icon={Database} isActive={progress > 0} status={isLegacy && activeScenario === 'offboarding' ? 'warning' : 'active'} details="Identity Source" />
                </div>
                <div className="w-1/3 flex flex-col items-center justify-center z-10 gap-2">
                  {simulationMode === 'monosign' ? (
                    <div className="relative group cursor-help">
                      <div className="absolute inset-0 bg-indigo-500 rounded-full animate-pulse-ring opacity-20"></div>
                      <div className="h-28 w-28 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-indigo-500/30 animate-float relative z-10 border-4 border-white/20 backdrop-blur-sm">
                        <Shield className="h-8 w-8 text-white mb-1" />
                        <span className="text-white font-bold text-[10px] font-poppins tracking-wide">MonoSign</span>
                        {scanActive && <div className="absolute inset-0 border-2 border-indigo-300 rounded-full animate-ping opacity-40"></div>}
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 w-28 border-2 border-dashed border-slate-300 rounded-full flex flex-col items-center justify-center opacity-60 bg-slate-100/50">
                      <span className="text-slate-400 text-center text-xs font-medium px-2">No Governance Layer</span>
                    </div>
                  )}
                </div>
                <div className="w-1/3 flex flex-col justify-between h-[80%] z-10 pr-4 gap-4">
                  <Node title="Entra ID / M365" icon={Cloud} isActive={completedNodes.includes('entra')} status={getSystemStatus('entra', activeScenario, isLegacy, completedNodes)} scanMode={scanActive} isLegacy={isLegacy} align="right" />
                  <Node title="Internal Apps" icon={LayoutDashboard} isActive={completedNodes.includes('internal')} status={getSystemStatus('internal', activeScenario, isLegacy, completedNodes)} scanMode={scanActive} isLegacy={isLegacy} align="right" />
                  <Node title="Server Fleet" icon={Server} isActive={completedNodes.includes('servers')} status={getSystemStatus('servers', activeScenario, isLegacy, completedNodes)} scanMode={scanActive} isLegacy={isLegacy} align="right" />
                </div>
              </div>
            ) : (
              // --- TECHNICAL VIEW WITH ACTIVE SIMULATION ---
              <div className="relative w-full h-full p-8 animate-in fade-in duration-500 flex items-center justify-center">
                {/* Animated SVG Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <TechConnections mode={simulationMode} active={progress > 0 && progress < 100} scenario={activeScenario} />
                </div>

                {/* Architecture Layout */}
                <div className="w-full max-w-4xl h-[450px] relative">
                  {/* Source */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                    <TechNode
                      title="Local AD"
                      icon={Database}
                      type="source"
                      active={progress > 0}
                      tooltip={isLegacy ? "Protocol: LDAP (389)" : "Protocol: LDAPS (636)"}
                    />
                  </div>

                  {/* Center */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    {simulationMode === 'monosign' ? (
                      <div className={`bg-indigo-600 text-white p-6 rounded-2xl shadow-xl border-4 border-indigo-100 flex flex-col items-center gap-2 relative overflow-hidden group transition-all ${progress > 0 ? 'scale-105 shadow-indigo-500/50' : ''}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[scan_1s_ease-in-out_infinite]"></div>
                        {scanActive ? <Activity className="h-8 w-8 animate-bounce" /> : <Shield className="h-8 w-8" />}
                        <div className="text-sm font-bold">MonoSign Gateway</div>
                        <div className="text-[10px] opacity-80 bg-indigo-800 px-2 py-0.5 rounded flex items-center gap-1"><Zap className="h-3 w-3 text-yellow-300" />Protocol Broker</div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center relative">
                        <span className="text-slate-400 text-xs text-center px-2">Direct Connections</span>
                        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                          <path d="M 10 20 Q 50 50 90 20" fill="none" stroke="currentColor" strokeWidth="1" />
                          <path d="M 20 80 Q 50 50 80 80" fill="none" stroke="currentColor" strokeWidth="1" />
                          <path d="M 40 10 Q 10 50 40 90" fill="none" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Targets */}
                  <div className="absolute right-0 top-0 z-10">
                    <TechNode
                      title="SaaS (M365)"
                      icon={Cloud}
                      type="target"
                      active={completedNodes.includes('entra')}
                      status={getSystemStatus('entra', activeScenario, isLegacy, completedNodes)}
                      tooltip={isLegacy ? "PowerShell Sync" : "OIDC / SAML 2.0"}
                    />
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                    <TechNode
                      title="Legacy Apps"
                      icon={LayoutDashboard}
                      type="target"
                      active={completedNodes.includes('internal')}
                      status={getSystemStatus('internal', activeScenario, isLegacy, completedNodes)}
                      tooltip={isLegacy ? "Direct SQL/LDAP" : "SCIM 2.0 Wrapper"}
                    />
                  </div>
                  <div className="absolute right-0 bottom-0 z-10">
                    <TechNode
                      title="Linux Servers"
                      icon={Server}
                      type="target"
                      active={completedNodes.includes('servers')}
                      status={getSystemStatus('servers', activeScenario, isLegacy, completedNodes)}
                      tooltip={isLegacy ? "Static SSH Keys" : "Ephemeral Certificates"}
                    />
                  </div>

                  {/* Interactive Protocol Labels */}
                  <ProtocolLabel x="25%" y="45%" label={isLegacy ? "LDAP / Sync" : "Connector"} details={isLegacy ? "High Latency" : "Real-time"} mode={simulationMode} active={progress > 0} />
                  <ProtocolLabel x="75%" y="20%" label={isLegacy ? "Manual / Pwd" : "OIDC / SAML"} details={isLegacy ? "Creds Exposed" : "Token Based"} mode={simulationMode} active={progress > 0} />
                  <ProtocolLabel x="75%" y="45%" label={isLegacy ? "Direct DB/LDAP" : "SCIM 2.0"} details={isLegacy ? "Tight Coupling" : "Standard API"} mode={simulationMode} active={progress > 0} />
                  <ProtocolLabel x="75%" y="80%" label={isLegacy ? "Static SSH Keys" : "SSH Certs (CA)"} details={isLegacy ? "Key Sprawl" : "Just-in-Time"} mode={simulationMode} active={progress > 0} />
                </div>
              </div>
            )}
          </Card>

          <Card className="h-48 flex flex-col overflow-hidden shrink-0">
            <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex justify-between items-center backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold text-slate-600 font-poppins uppercase tracking-wider">Activity Stream</h3>
              </div>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-2 custom-scrollbar bg-white">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 text-xs animate-in fade-in slide-in-from-left-2 duration-300 group">
                  <span className="font-mono text-slate-400 shrink-0 pt-0.5 w-14 text-right">{log.time}</span>
                  <div className={`flex-1 rounded px-2 py-0.5 ${log.type === 'danger' ? 'bg-rose-50 text-rose-700' : log.type === 'success' ? 'bg-emerald-50 text-emerald-700' : log.type === 'warning' ? 'bg-amber-50 text-amber-700' : 'text-slate-600'}`}>{log.msg}</div>
                </div>
              ))}
              {logs.length === 0 && <div className="text-center text-slate-300 italic text-xs pt-4">Start a scenario to see events</div>}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

// --- Tech View Components (Enhanced) ---

function TechNode({ title, icon: Icon, type, tooltip, active, status }) {
  // Status visual mapping
  let statusBorder = 'border-slate-200';
  let statusBg = 'bg-white';
  let iconColor = 'text-slate-500';

  if (active) {
    if (status === 'danger') { statusBorder = 'border-rose-400'; iconColor = 'text-rose-500'; }
    else if (status === 'warning') { statusBorder = 'border-amber-400'; iconColor = 'text-amber-500'; }
    else { statusBorder = 'border-indigo-400'; iconColor = 'text-indigo-600'; }
  }

  return (
    <div className="relative group cursor-pointer">
      <div className={`p-4 rounded-xl border shadow-md flex items-center gap-3 w-48 transition-all duration-300 ${statusBorder} ${active ? 'shadow-lg bg-white' : 'bg-slate-50 opacity-90'}`}>
        <div className={`p-2 rounded-lg ${active ? 'bg-slate-50' : 'bg-slate-100'} ${iconColor} transition-colors`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="font-bold text-sm text-slate-700 font-poppins">{title}</div>
      </div>

      {/* Simulation Status Icons */}
      {active && (
        <div className="absolute -top-2 -right-2 z-20 animate-in zoom-in duration-300">
          {status === 'danger' && <div className="bg-rose-500 p-1 rounded-full shadow-md"><XCircle className="h-4 w-4 text-white" /></div>}
          {status === 'warning' && <div className="bg-amber-500 p-1 rounded-full shadow-md"><AlertTriangle className="h-4 w-4 text-white" /></div>}
          {(status === 'active' || !status) && <div className="bg-emerald-500 p-1 rounded-full shadow-md"><CheckCircle2 className="h-4 w-4 text-white" /></div>}
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-50 shadow-xl">
        {tooltip}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-800"></div>
      </div>
    </div>
  )
}

function TechBadge({ label, danger, success }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-md border ${danger ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${danger ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
      <span className="text-[10px] font-bold uppercase">{label}</span>
    </div>
  )
}

function ProtocolLabel({ x, y, label, details, mode, active }) {
  const isLegacy = mode === 'legacy';
  const activeClass = active ? 'scale-110 shadow-md ring-2 ring-indigo-100' : '';

  return (
    <div className={`absolute px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm z-30 flex flex-col items-center group cursor-pointer border transition-all duration-300 ${activeClass} ${isLegacy ? 'bg-white border-slate-200 text-slate-500 hover:border-orange-300' : 'bg-white border-indigo-100 text-indigo-600 hover:border-indigo-300'}`} style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
      <span>{label}</span>
      <span className={`text-[9px] font-medium opacity-0 group-hover:opacity-100 absolute -bottom-6 bg-white px-2 py-1 rounded shadow-md border whitespace-nowrap ${isLegacy ? 'text-orange-600 border-orange-100' : 'text-emerald-600 border-emerald-100'}`}>
        {details}
      </span>
    </div>
  )
}

function TechConnections({ mode, active, scenario }) {
  const color = mode === 'legacy' ? '#ef4444' : '#6366f1';
  const dash = mode === 'legacy' ? "4,4" : "0";

  // Packet component
  const Packet = ({ delay, duration, pathId }) => (
    <circle r={mode === 'legacy' ? 3 : 4} fill={color} className="packet">
      <animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${delay}s`} rotate="auto">
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  );

  // Only animate if simulation is running
  const showTraffic = active;

  return (
    <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
      <defs>
        <marker id="arrow-tech" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L6,3 z" fill={color} />
        </marker>
      </defs>

      {/* Paths definitions */}
      <path id="path-src-center" d="M 12% 50% L 45% 50%" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray={dash} markerEnd="url(#arrow-tech)" opacity="0.3" />
      <path id="path-center-top" d={mode === 'monosign' ? "M 55% 50% C 60% 50%, 80% 50%, 85% 10%" : "M 12% 50% C 20% 10%, 60% 10%, 85% 10%"} stroke={color} strokeWidth="1.5" fill="none" strokeDasharray={dash} markerEnd="url(#arrow-tech)" opacity={mode === 'legacy' ? 0.2 : 0.3} />
      <path id="path-center-mid" d={mode === 'monosign' ? "M 55% 50% L 85% 50%" : "M 12% 50% C 30% 60%, 60% 40%, 85% 50%"} stroke={color} strokeWidth="1.5" fill="none" strokeDasharray={dash} markerEnd="url(#arrow-tech)" opacity={mode === 'legacy' ? 0.2 : 0.3} />
      <path id="path-center-bot" d={mode === 'monosign' ? "M 55% 50% C 60% 50%, 80% 50%, 85% 90%" : "M 12% 50% C 20% 90%, 60% 90%, 85% 90%"} stroke={color} strokeWidth="1.5" fill="none" strokeDasharray={dash} markerEnd="url(#arrow-tech)" opacity={mode === 'legacy' ? 0.2 : 0.3} />

      {/* Dynamic Traffic based on Scenario */}
      {showTraffic && (
        <>
          {/* Source -> Center */}
          <Packet pathId="path-src-center" delay={0} duration={mode === 'legacy' ? 2 : 0.8} />

          {/* Outbound Traffic */}
          {/* If Offboarding, Legacy keeps flowing (BAD), MonoSign stops traffic to target (GOOD) */}
          {(scenario !== 'offboarding' || mode === 'legacy') && (
            <>
              <Packet pathId="path-center-top" delay={0.2} duration={mode === 'legacy' ? 3 : 1} />
              <Packet pathId="path-center-mid" delay={0.4} duration={mode === 'legacy' ? 3 : 1} />
              <Packet pathId="path-center-bot" delay={0.6} duration={mode === 'legacy' ? 3 : 1} />
            </>
          )}
        </>
      )}
    </svg>
  )
}

// --- Existing Helper Components (Unchanged) ---

function ResponsiveConnections({ mode, active }) {
  const strokeColor = mode === 'monosign' ? '#6366f1' : '#f97316';
  const opacity = active ? 1 : 0.3;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity, transition: 'opacity 0.5s' }}>
      <path d="M 22 50 L 40 50" stroke={active ? strokeColor : '#cbd5e1'} strokeWidth="0.8" fill="none" strokeDasharray={active ? "2,2" : "0"} vectorEffect="non-scaling-stroke" className={active ? "animate-dash-flow" : ""} />
      <path d="M 60 50 C 65 50, 65 12, 78 12" stroke={active ? strokeColor : '#cbd5e1'} strokeWidth="0.8" fill="none" strokeDasharray={active ? "2,2" : "0"} vectorEffect="non-scaling-stroke" className={active ? "animate-dash-flow" : ""} />
      <path d="M 60 50 L 78 50" stroke={active ? strokeColor : '#cbd5e1'} strokeWidth="0.8" fill="none" strokeDasharray={active ? "2,2" : "0"} vectorEffect="non-scaling-stroke" className={active ? "animate-dash-flow" : ""} />
      <path d="M 60 50 C 65 50, 65 88, 78 88" stroke={active ? strokeColor : '#cbd5e1'} strokeWidth="0.8" fill="none" strokeDasharray={active ? "2,2" : "0"} vectorEffect="non-scaling-stroke" className={active ? "animate-dash-flow" : ""} />
    </svg>
  );
}

function Node({ title, subtitle, icon: Icon, isActive, status, scanMode, isLegacy, details, align }) {
  const isRight = align === 'right';
  const getStyles = () => {
    if (scanMode) return isLegacy ? 'border-orange-300 bg-orange-50' : 'border-indigo-300 bg-indigo-50';
    if (status === 'danger') return 'border-rose-200 bg-rose-50';
    if (status === 'active' || isActive) return 'border-indigo-200 bg-white shadow-lg shadow-indigo-100 ring-1 ring-indigo-50';
    return 'border-slate-100 bg-white shadow-sm';
  };
  return (
    <div className={`relative p-3 rounded-xl border transition-all duration-500 ${getStyles()} w-full max-w-[240px] group bg-white`}>
      {scanMode && <div className={`absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-20 ${isLegacy ? 'bg-orange-200' : 'bg-indigo-200'}`}><div className="absolute inset-0 animate-pulse bg-white/50"></div></div>}
      <div className={`flex items-center gap-3 relative z-10 ${isRight ? 'flex-row-reverse text-right' : ''}`}>
        <div className={`p-2 rounded-lg shrink-0 ${isActive || status === 'active' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
          {scanMode ? <Search className="h-5 w-5 animate-pulse" /> : <Icon className={`h-5 w-5 ${status === 'danger' ? 'text-rose-500' : isActive ? 'text-indigo-600' : 'text-slate-400'}`} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-slate-800 font-poppins truncate leading-tight">{title}</div>
          <div className="text-[10px] font-medium text-slate-500 truncate">{subtitle || details}</div>
        </div>
      </div>
      {(isActive || status !== 'neutral') && !scanMode && (
        <div className={`absolute -top-2 z-20 ${isRight ? '-left-2' : '-right-2'}`}>
          {status === 'danger' && <XCircle className="h-5 w-5 text-rose-500 bg-white rounded-full" />}
          {status === 'active' && <CheckCircle2 className="h-5 w-5 text-emerald-500 bg-white rounded-full" />}
          {status === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500 bg-white rounded-full" />}
        </div>
      )}
    </div>
  );
}

function ConfigScreen({ stats, setStats, onSubmit }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-inter">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <Card className="w-full max-w-2xl p-8 relative z-10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-poppins text-slate-900">MonoSign <span className="text-indigo-600">Simulator</span></h1>
          <p className="text-slate-500">Sales Engineering Environment Configurator</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <InputGroup label="Employees" value={stats.employees} onChange={v => setStats({ ...stats, employees: v })} icon={Users} />
            <InputGroup label="Servers" value={stats.servers} onChange={v => setStats({ ...stats, servers: v })} icon={Server} />
            <InputGroup label="SaaS Apps" value={stats.cloudApps} onChange={v => setStats({ ...stats, cloudApps: v })} icon={Cloud} />
            <InputGroup label="Internal Apps" value={stats.internalApps} onChange={v => setStats({ ...stats, internalApps: v })} icon={Database} />
          </div>
          <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors flex justify-center items-center gap-2">Launch <ArrowRight className="h-4 w-4" /></button>
        </form>
      </Card>
    </div>
  )
}
function Header({ stats, setStep }) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg"><Shield className="h-5 w-5 text-white" /></div>
        <div><h1 className="font-bold text-slate-900 font-poppins leading-none">MonoSign</h1><span className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">Sales Engineering Hub</span></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex gap-4 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          <span>{stats.servers} Servers</span><span className="text-slate-300">|</span><span>{stats.employees} Users</span>
        </div>
        <button onClick={() => setStep('config')}><Settings className="h-5 w-5 text-slate-400 hover:text-indigo-600" /></button>
      </div>
    </header>
  )
}
function ModeButton({ label, icon: Icon, active, onClick, color }) {
  const activeClass = color === 'orange' ? 'bg-white text-orange-600 shadow-sm ring-1 ring-black/5' : 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5';
  return <button onClick={onClick} className={`py-2.5 rounded-lg text-xs font-bold font-poppins flex justify-center gap-2 transition-all ${active ? activeClass : 'text-slate-400 hover:text-slate-600'}`}>{active && <Icon className="h-4 w-4" />}{label}</button>
}
function ScenarioButton({ title, desc, icon: Icon, active, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled} className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${active ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-transparent hover:bg-slate-50'}`}><div className="flex gap-3 relative z-10"><div className={`p-2 rounded-lg ${active ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600'}`}><Icon className="h-4 w-4" /></div><div><div className={`text-sm font-bold font-poppins ${active ? 'text-indigo-900' : 'text-slate-700'}`}>{title}</div><div className="text-[10px] text-slate-500 font-medium">{desc}</div></div></div></button>
}
function MetricBox({ label, value, icon: Icon, trend, score, color }) {
  return <div className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-end"><div className="space-y-1"><div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Icon className="h-3 w-3" />{label}</div><div className={`text-xl font-bold font-poppins ${color || 'text-slate-800'}`}>{value}{score && <span className="text-xs text-slate-400 ml-0.5">/100</span>}</div></div></div>
}
function InputGroup({ label, value, onChange, icon: Icon }) {
  return <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">{label}</label><div className="relative"><Icon className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input type="number" value={value} onChange={e => onChange(parseInt(e.target.value))} className="w-full pl-9 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" /></div></div>
}
function Card({ children, className = "" }) { return <div className={`bg-white rounded-2xl border border-slate-200/60 shadow-sm ${className}`}>{children}</div> }
function Badge({ children, type }) { return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${type === 'legacy' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>{children}</span> }
function getSystemStatus(id, scenario, isLegacy, completedNodes) {
  if (!completedNodes.includes(id)) return 'neutral';
  if (scenario === 'offboarding' && isLegacy && (id === 'servers' || id === 'internal')) return 'danger';
  if (scenario === 'offboarding' && isLegacy) return 'warning';
  if (scenario === 'mover' && isLegacy && (id === 'internal' || id === 'servers')) return 'danger';
  return 'active';
}