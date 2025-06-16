#!/usr/bin/env -S pkgx +python@3.11 +cwebp uv run

# /// script
# dependencies = [
#   "requests",
#   "rich",
# ]
# ///

# modal https://civitai.com/models/293331/wildcardx-xl-turbo?modelVersionId=329685&dialog=resourceReview&reviewId=26068625
# lora  https://civitai.com/models/118418/negativexl

import sys
import unicodedata
from rich.console import Console
import subprocess
import requests
import base64
import random
import json
import time
import os
import re

def gen_img(root, json_file):
    out_file = os.path.join(root, f"{os.path.splitext(json_file)[0]}.png")

    if os.path.exists(out_file):
        return

    console.print(f"Generating: {out_file}", style="bold blue")

    with open(os.path.join(root, json_file), 'r') as f:
        metadata = json.load(f)

        prompt = get_painting_feature(metadata.get('displayName'), metadata.get('description'), metadata.get('homepage') or metadata.get('project'))

        seed = random.randint(0, 2**32 - 1)

        prompt = re.sub(r'\s+', ' ', prompt).strip()

        payload = {
            "prompt": prompt,
            "steps": 20,
            "width": 768,
            "height": 768,
            "negative_prompt": "pearls, artist signature, negativeXL_D, border, watermark",
            "sd_model_checkpoint": "wildcardxXLTURBO_wildcardxXLTURBOV10.safetensors [276d222ef0]",
            "seed": seed
        }

        console.print(f"{prompt}", style="bold yellow")
        console.print(f"Seed: {seed}", style="bold red")

        start = time.perf_counter()

        response = requests.post(url, json=payload)
        r = response.json()

        end = time.perf_counter()
        print(f"Execution time: {end - start:.6f} seconds")

        image = base64.b64decode(r['images'][0])
        with open(out_file, "wb") as f:
            f.write(image)

        with open(f"{out_file}.json", "wt") as f:
            f.write(json.dumps(payload, indent=2))

        os.system(f"cwebp -q 35 -resize 560 560 {out_file} -o {os.path.splitext(out_file)[0]}.thumb.webp")
        os.system(f"cwebp {out_file} -o {os.path.splitext(out_file)[0]}.webp")

        console.print(f"Done {out_file}", style="bold green")

def get_painting_feature(name, description, homepage):
    if description:
        description = "It is described as " + description + ". If the package is for Python (subtly) incorporate snakes, if for Ruby (subtly) incorporate rubies, if for Rust (subtly) incorporate rusty metal, etc."
    else:
        description = ""

    prompt = f"""
I need an image prompt for an open source package so I can display it on https://pkgx.dev/pkgs/

The package is called {name}. If this can be painted, please feature it prominently! {description}

The package homepage is {homepage} (feel free to go there and read it for more context).

An example prompt I have used is:

```
Create an abstract oil painting that features: krampus
Use an expressive explosion of Charcoal Gray, Off-White, Olive Green, Burnt Sienna, and Blush Pink with and hyper-detailed textures.
Highlight the artwork with gleaming golden accents that radiate light amidst a brilliance of harmony.
Incorporate ethereal elements like clouds, storms, rainbows, snow to symbolize the peaceful blending of these forces.
Ensure a perfect composition with intricate pearl filigree, capturing a serene and radiant ambiance
```

The package was krampus, a Command-line tool to kill one or more processes by port number.
Extract a good object to paint. Figure out colors and scenary. Maintain the fantastical oil-painting style.

Many packages are pretty abstract. If so, figure out some object to represent that the painting should feature.
Don’t list the entire package description in the prompt as the image generator will not be able to handle it.

Avoid clock imagery unless the package is literally called “clock” or its purpose is time related.

End the prompt with `Ensure a perfect composition with intricate pearl filigree, capturing a serene and
radiant ambiance` because it causes the image generator to stick to the style I want.

Pick complementary color palettes, here are some examples:

- black, white, orange, beige, and pink
- Charcoal Gray, Off-White, Olive Green, Burnt Sienna, and Blush Pink
- Pearl White, Crimson Red, Champagne, and Pale Peach
- Forest Green, Ivory, Coral Orange, Sand Beige, and Dusty Rose
- Espresso Brown, Creamy White, Golden Yellow, Taupe, and Mauve
- Jet Black, Soft Gray, Teal, Warm Amber, and Powder Pink

The above color palettes are just examples. You can pick any color palette you want (in the same vein).

I want to again emphasize that if the package name ({name}) can be painted, please feature it prominently in the painting. If not, extract a good object to paint.

Figure out colors and scenary. Maintain the fantastical oil-painting style.

Please only output the prompt as I am feeding this output directly to Stable Diffusion Web-UI.
"""

    print(prompt)

    proc = subprocess.run(['pkgx', 'llm', 'prompt', f"Instruct: {prompt}\nOutput: "], capture_output=True, text=True)
    result = proc.stdout

    console.print(result, style="yellow")

    return result

url = "http://127.0.0.1:7860/sdapi/v1/txt2img"
console = Console()

for root, dirs, files in os.walk("./public/pkgs/"):
    for file in files:
        if file.endswith(".json") and not file.endswith(".png.json") and not file.endswith("cache.json") and not file.endswith("-manifests.json"):
            gen_img(root, file);
