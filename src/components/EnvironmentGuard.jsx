import { getEnvironmentWarnings, runtimeConfig } from '../runtimeConfig.js';

export default function EnvironmentGuard() {
  const warnings = getEnvironmentWarnings();
  if (!warnings.length) return null;

  return (
    <div className="environmentGuard wrap">
      <b>Environment guard</b>
      <span>{runtimeConfig.appEnv} / {runtimeConfig.dataMode}</span>
      {warnings.map((warning) => <em key={warning}>{warning}</em>)}
    </div>
  );
}
