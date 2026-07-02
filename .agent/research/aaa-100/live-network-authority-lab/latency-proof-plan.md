# Latency Proof Plan

Status: active

## Profiles

| Profile | Latency | Jitter | Loss | Purpose |
| --- | --- | --- | --- | --- |
| clean-local | 0-20ms | low | 0 | baseline |
| home-wifi | 40-80ms | medium | 1 percent | normal web test |
| bad-wifi | 120-180ms | high | 3 percent | movement stress |
| mobile-hotspot | 180-260ms | high | 5 percent | deploy risk |
| reconnect | variable | high | burst | recovery proof |

## Required Measurements

- command pending age.
- snapshot delay.
- correction distance.
- receipt lag.
- dropped delta count.
- rejoin duration.
- divergence between peer snapshots.
