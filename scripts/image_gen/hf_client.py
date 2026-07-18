"""Hugging Face Inference Providers text-to-image client."""
from __future__ import annotations

from pathlib import Path

from huggingface_hub import InferenceClient

from .tokens import load_hf_token

MODEL_PROFILES = {
    "draft": "black-forest-labs/FLUX.1-schnell",
    "final": "black-forest-labs/FLUX.1-Krea-dev",
}

FALLBACK_MODEL = "black-forest-labs/FLUX.1-dev"


def resolve_model_id(profile: str, model_id: str | None) -> str:
    if model_id:
        return model_id
    key = profile.lower().strip()
    return MODEL_PROFILES.get(key, MODEL_PROFILES["final"])


def generate_image_bytes(
    prompt: str,
    *,
    model_id: str,
    width: int,
    height: int,
    seed: int | None = None,
    provider: str = "auto",
    num_inference_steps: int | None = None,
) -> bytes:
    token = load_hf_token()
    client = InferenceClient(api_key=token, provider=provider)

    params: dict = {
        "width": width,
        "height": height,
    }
    if seed is not None:
        params["seed"] = seed
    if num_inference_steps is not None:
        params["num_inference_steps"] = num_inference_steps
    elif "schnell" in model_id.lower():
        params["num_inference_steps"] = 4

    try:
        image = client.text_to_image(prompt, model=model_id, **params)
    except Exception as e:
        if model_id != FALLBACK_MODEL:
            image = client.text_to_image(prompt, model=FALLBACK_MODEL, **params)
        else:
            raise e

    if isinstance(image, bytes):
        return image
    # PIL Image from huggingface_hub
    from io import BytesIO

    buf = BytesIO()
    image.save(buf, format="PNG")
    return buf.getvalue()


def save_png(data: bytes, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
