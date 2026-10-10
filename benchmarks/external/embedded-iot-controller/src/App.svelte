<script>
  import { IconCpu, IconWifi, IconAlertCircle, IconGauge } from 'tabler-icons-svelte';

  let cpuTemp = 48.2;
  let relayActive = true;
  let wifiConnected = true;

  function toggleRelay() {
    relayActive = !relayActive;
  }
</script>

<div class="iot-panel">
  <div class="status-bar">
    <span class="device-name"><IconCpu size={16} /> RTU-GATEWAY-04</span>
    <span class="badge {wifiConnected ? 'online' : 'offline'}">
      <IconWifi size={14} /> {wifiConnected ? 'ONLINE' : 'OFFLINE'}
    </span>
  </div>

  <div class="telemetry-grid">
    <div class="metric-card">
      <span class="label"><IconGauge size={14} /> CORE TEMP</span>
      <span class="value">{cpuTemp} °C</span>
    </div>
    <div class="metric-card">
      <span class="label">RELAY #1 STATUS</span>
      <button on:click={toggleRelay} class="toggle-btn {relayActive ? 'active' : ''}">
        {relayActive ? 'ENERGIZED' : 'OPEN'}
      </button>
    </div>
  </div>
</div>

<style>
  .iot-panel { font-family: system-ui, sans-serif; padding: 12px; background: #18181b; color: #f4f4f5; }
  .status-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #27272a; padding-bottom: 8px; }
  .badge.online { color: #34d399; }
  .badge.offline { color: #f87171; }
  .telemetry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
  .metric-card { background: #27272a; padding: 8px; border-radius: 4px; }
  .toggle-btn { padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; }
  .toggle-btn.active { background: #059669; color: white; }
</style>
