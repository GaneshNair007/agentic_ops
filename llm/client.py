"""LLM client: mock mode for GPU-free dev, ollama mode for real local inference.

Vendor-neutral by design — talks to Ollama over HTTP, so the identical code path
runs against a CUDA build (dev laptop) or a ROCm build (AMD demo box). Select
with LLM_MODE=mock|ollama; point at a remote server with OLLAMA_HOST.
"""

import json
import os
import urllib.error
import urllib.request

DEFAULT_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.1:8b")
OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")

_MOCK_RESPONSES = {
    "hypothesis": (
        "[MOCK] Root-cause hypothesis: the payments-api connection pool to the "
        "primary Postgres instance is exhausted, most likely due to a slow query "
        "introduced in the latest deploy holding connections open. "
        "CONFIDENCE: 0.72"
    ),
    "critique": (
        "[MOCK] Self-critique: the pool-exhaustion hypothesis is consistent with "
        "the timeout pattern, but the evidence does not rule out a network "
        "partition. Retaining hypothesis with reduced confidence. "
        "REVISED CONFIDENCE: 0.66"
    ),
    "default": "[MOCK] Generic model output for prompt.",
}


class LLMError(RuntimeError):
    pass


class LLMClient:
    def __init__(self, mode: str | None = None, model: str = DEFAULT_MODEL, host: str = OLLAMA_HOST):
        self.mode = (mode or os.environ.get("LLM_MODE", "mock")).lower()
        self.model = model
        self.host = host.rstrip("/")
        if self.mode not in ("mock", "ollama"):
            raise LLMError(f"unknown LLM_MODE {self.mode!r} (expected 'mock' or 'ollama')")

    def generate(self, prompt: str, system: str | None = None,
                 temperature: float = 0.2, max_tokens: int = 512) -> dict:
        """Returns {"text", "mode", "model", and (ollama only) token/timing stats}."""
        if self.mode == "mock":
            return self._generate_mock(prompt)
        return self._generate_ollama(prompt, system, temperature, max_tokens)

    def _generate_mock(self, prompt: str) -> dict:
        lower = prompt.lower()
        if any(w in lower for w in ("critique", "disprove", "skeptical", "counter-evidence")):
            text = _MOCK_RESPONSES["critique"]
        elif "hypothesis" in lower or "root cause" in lower:
            text = _MOCK_RESPONSES["hypothesis"]
        else:
            text = _MOCK_RESPONSES["default"]
        return {"text": text, "mode": "mock", "model": "mock"}

    def _generate_ollama(self, prompt: str, system: str | None,
                         temperature: float, max_tokens: int) -> dict:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": temperature, "num_predict": max_tokens},
        }
        if system:
            payload["system"] = system
        req = urllib.request.Request(
            f"{self.host}/api/generate",
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json"},
        )
        try:
            # generous timeout: first call after start pays model-load cost
            with urllib.request.urlopen(req, timeout=600) as resp:
                body = json.loads(resp.read())
        except urllib.error.URLError as e:
            raise LLMError(
                f"cannot reach Ollama at {self.host} — is it running? "
                f"(scripts/start_model.sh {self.model}): {e}"
            ) from e
        eval_count = body.get("eval_count", 0)
        eval_ns = body.get("eval_duration", 0)
        return {
            "text": body.get("response", ""),
            "mode": "ollama",
            "model": self.model,
            "eval_count": eval_count,
            "eval_duration_ns": eval_ns,
            "prompt_eval_count": body.get("prompt_eval_count", 0),
            "prompt_eval_duration_ns": body.get("prompt_eval_duration", 0),
            "load_duration_ns": body.get("load_duration", 0),
            "total_duration_ns": body.get("total_duration", 0),
            "tokens_per_sec": (eval_count / (eval_ns / 1e9)) if eval_ns else 0.0,
        }
