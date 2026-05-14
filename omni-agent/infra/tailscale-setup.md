# Tailscale Setup for Omni-Agent

This lets your phone connect to your home PC backend from anywhere without port forwarding.

## Steps

1. Install Tailscale on your PC: https://tailscale.com/download
2. Install Tailscale on your phone (iOS/Android)
3. Sign in with the same account on both devices
4. Get your PC's Tailscale IP: run `tailscale ip -4` in terminal (looks like `100.x.x.x`)
5. In the OmniAgent app → Settings → Backend URL, enter: `http://100.x.x.x:8000`
6. Make sure the backend is running (via NSSM service or manually with `uvicorn main:app --host 0.0.0.0 --port 8000`)

## Verify

```
curl http://100.x.x.x:8000/health
# Expected: {"status":"ok","version":"1.0.0"}
```

## Notes

- The backend binds to `0.0.0.0` so it accepts connections from the Tailscale network.
- No firewall changes needed on the router — Tailscale is encrypted peer-to-peer.
- If you want web access too, run `npx expo start --web` and visit `http://100.x.x.x:8081` from any Tailscale device.
