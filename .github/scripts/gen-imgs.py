#!/usr/bin/env -S pkgx +python@3.11 +cwebp uv run --script

# /// script
# dependencies = [
#   "requests",
#   "rich",
# ]
# ///

# modal https://civitai.com/models/293331/wildcardx-xl-turbo?modelVersionId=329685&dialog=resourceReview&reviewId=26068625
# lora  https://civitai.com/models/118418/negativexl

from rich.console import Console
import requests
import textwrap
import base64
import random
import json
import os
import re

def gen_img(root, json_file):
    out_file = os.path.join(root, f"{os.path.splitext(json_file)[0]}.png")

    if os.path.exists(out_file):
        return

    console.print(f"Generating: {out_file}", style="bold blue")

    with open(os.path.join(root, json_file), 'r') as f:
        metadata = json.load(f)

        description = metadata.get('description') or metadata.get('homepage') or metadata.get('project')

        if metadata.get('displayName'):
            description = f"{metadata['displayName']}: {description}"

        color_suggestions = [
        "black, white, orange, beige, and pink",
        "Charcoal Gray, Off-White, Olive Green, Burnt Sienna, and Blush Pink",
        "Midnight Blue, Pearl White, Crimson Red, Champagne, and Pale Peach",
        "Forest Green, Ivory, Coral Orange, Sand Beige, and Dusty Rose",
        "Espresso Brown, Creamy White, Golden Yellow, Taupe, and Mauve",
        "Jet Black, Soft Gray, Teal, Warm Amber, and Powder Pink",
        ]

        # pick random entry from colors
        colors = random.choice(color_suggestions)

        imagery_suggestions = [
            ["sky", "flowers", "water", "fire"],
            ["mountains", "valleys", "rivers", "meadows"],
            ["forests", "lakes", "wildlife", "sunlight"],
            ["clouds", "storms", "rainbows", "snow"],
            ["deserts", "cacti", "sand dunes", "sunsets"],
            ["stars", "moon", "galaxies", "nebulae"]
        ]

        imagery = ", ".join(random.choice(imagery_suggestions))

        seed = random.randint(0, 2**32 - 1)

        prompt = f"""
        Create an abstract oil painting that represents:
        {description.strip()}
        Use an expressive explosion of {colors}—with and hyper-detailed textures.
        Highlight the artwork with gleaming golden accents that radiate light amidst a brilliance of harmony.
        Incorporate ethereal elements like {imagery} to symbolize the peaceful blending of these forces.
        Ensure a perfect composition with intricate pearl filigree, capturing a serene and radiant ambiance
        """

        prompt = re.sub(r'\s+', ' ', prompt).strip()

        payload = {
            "prompt": prompt,
            "steps": 20,
            "width": 768,
            "height": 768,
            "negative_prompt": "text, pearls, artist signature, negativeXL_D, border",
            "sd_model_checkpoint": "wildcardxXLTURBO_wildcardxXLTURBOV10.safetensors [276d222ef0]",
            "seed": seed
        }

        console.print(f"{prompt}", style="bold yellow")
        console.print(f"Seed: {seed}", style="bold red")

        response = requests.post(url, json=payload)
        r = response.json()

        image = base64.b64decode(r['images'][0])
        with open(out_file, "wb") as f:
            f.write(image)

        with open(f"{out_file}.json", "wt") as f:
            f.write(json.dumps(payload, indent=2))

        os.system(f"cwebp -q 35 -resize 560 560 {out_file} -o {os.path.splitext(out_file)[0]}.thumb.webp")
        os.system(f"cwebp {out_file} -o {os.path.splitext(out_file)[0]}.webp")

        console.print(f"Done {out_file}", style="bold green")

        # out_file = os.path.join(os.getcwd(), out_file)
        # os.system(f"osascript -e 'tell application \"Finder\" to reveal POSIX file \"{out_file}\"'")


url = "http://127.0.0.1:7860/sdapi/v1/txt2img"
console = Console()

for root, dirs, files in os.walk("./public/pkgs/"):
    for file in files:
        if file.endswith(".json") and not file.endswith(".png.json") and not file.endswith("cache.json") and not file.endswith("-manifests.json"):
            gen_img(root, file);
