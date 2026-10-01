interface OverlayProps { progress: number; }

const stages: [string, string][] = [
  ['AUXILIARY POWER', 'APU ONLINE'],
  ['FLIGHT COMPUTERS', 'SYNCHRONIZED'],
  ['INERTIAL REFERENCE', 'ALIGNING'],
  ['SENSOR BUS', 'CALIBRATING'],
  ['COMMS NETWORK', 'LINK ESTABLISHED'],
  ['MISSION INTERFACE', 'READY']
];

export default function Overlay({ progress }: OverlayProps) {
  if (!Number.isFinite(progress)) {
    throw new Error('Loading progress must be a finite number.');
  }

  const progressPercent = Math.min(100, Math.max(0, progress));
  const activeStage = Math.min(
    stages.length - 1,
    Math.floor(progressPercent / (100 / stages.length))
  );
  const nominal = progressPercent >= 99;

  return (
    <div className="boot-screen">
      <div className="boot-grain" />

      <header className="boot-header">
        <span>MISSION SYSTEMS / INDIA</span>
        <span>INITIALIZATION / 01</span>
      </header>

      <div className="boot-center">
        <div className="boot-reticle">
          <i /><i /><i />
          <div className="boot-emblem-frame">
            <img src={`${import.meta.env.BASE_URL}vyuha-emblem.png`} alt="Vyuha Aero Systems emblem" />
          </div>
          <span className="sweep" />
        </div>
        <div className="boot-readout">
          <p>{nominal ? 'SYSTEMS NOMINAL' : stages[activeStage][0]}</p>
          <strong>{nominal ? 'INITIALIZATION COMPLETE' : stages[activeStage][1]}</strong>
        </div>
      </div>

      <footer className="boot-footer">
        <div>
          <span className="boot-progress" style={{ width: `${progressPercent}%` }} />
          <p>POWER-UP SEQUENCE</p>
        </div>
        <strong>{String(Math.floor(progressPercent)).padStart(3, '0')}%</strong>
        <span>CHENNAI / INDIA</span>
      </footer>
    </div>
  );
}
