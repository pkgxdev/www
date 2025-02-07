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

        output = get_painting_feature(metadata.get('displayName'), metadata.get('description'))
        feature = output.get('theme')
        imagery = output.get('imagery')
        colors = output.get('colors')

        if isinstance(imagery, list):
            imagery = ", ".join(imagery)
        if isinstance(colors, list):
            colors = ", ".join(colors)

        seed = random.randint(0, 2**32 - 1)

        prompt = f"""
        Create an abstract oil painting that features or represents: {feature}.
        Use an expressive explosion of {colors} and hyper-detailed textures.
        Highlight the artwork with gleaming golden accents that radiate light amidst a brilliance of harmony.
        Incorporate ethereal elements like {imagery} to symbolize the peaceful blending of these forces.
        Ensure a perfect composition with intricate pearl filigree, capturing a serene and radiant ambiance.
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

def get_painting_feature(name, description):
    prompt = "I am making a painting about an open source package"
    if name:
        prompt += f" called “{name}”"
    if description:
        prompt += f" which is described as “{description}”"

    prompt += f""".
From that name and description extract some language that can be featured in the image.
Eg. if the description is “foo is a bridge to bar” then output BRIDGE.
Keep it physical. If the description is "foo is a dynamic runtime bridge to bar” then output BRIDGE, not DYNAMIC RUNTIME BRIDGE.
Remember I need to paint this!
If the name is a play on words then find the play on words. Eg “deno” is a play on dino ie. a dinosaur.
If you know the logo for a project and the logo is a good theme, then say that. Eg. “deno”’s logo is a dinosaur.
I need the output as JSON "{{theme: ""}}.
I am feeding the output to a script, so if you don’t output json in the above form my script will break.
Thank you sir.
"""
    prompt = re.sub(r'\s+', ' ', prompt).strip()

    print(prompt)

    proc = subprocess.run(['pkgx', 'ollama', 'run', 'deepseek-r1', f"Instruct: {prompt}\nOutput: "], capture_output=True, text=True)
    result = proc.stdout

    console.print(result, style="yellow")

    result = result[result.index("</think>") + len("</think>"):].strip()

    output = {}

    match = re.search(r'{\s*"?theme"?:(.*?)}', result, re.DOTALL)
    if match:
        output['theme'] = match.group(1)
    else:
        # sometimes it just outputs the theme. Often with surrounding description, but whatever
        output['theme'] = re.sub(r'\s+', ' ', result).strip()

    prompt = f"""
I am making an abstract landscape oil painting with the theme "{output['theme']}".
I need an appropriate color palette. Pick one of these:

```markdown
- black, white, orange, beige, and pink
- Charcoal Gray, Off-White, Olive Green, Burnt Sienna, and Blush Pink
- Pearl White, Crimson Red, Champagne, and Pale Peach
- Forest Green, Ivory, Coral Orange, Sand Beige, and Dusty Rose
- Espresso Brown, Creamy White, Golden Yellow, Taupe, and Mauve
- Jet Black, Soft Gray, Teal, Warm Amber, and Powder Pink
```

If a theme requires it, adapt the color palette (ideally minimally), eg. if the theme is “Ruby” then add the color ruby!
I need the output as JSON "{{colors: ""}}.
Output the complete list item of colors, not just parts.
I am feeding the output to a script, so if you don’t output json in the above form my script will break.
Thank you sir.
"""
    print(prompt)

    prompt = f"Instruct: {prompt}\nOutput: "

    proc = subprocess.run(['pkgx', 'ollama', 'run', 'deepseek-r1', prompt], capture_output=True, text=True)
    result = proc.stdout

    console.print(result, style="blue")

    result = result[result.index("</think>") + len("</think>"):].strip()

    match = re.search(r'{\s*"?colors"?:(.*?)}', result, re.DOTALL)
    if match:
        output['colors'] = match.group(1)
    else:
        # sometimes it just outputs the theme. Often with surrounding description, but whatever
        output['colors'] = re.sub(r'\s+', ' ', result).strip()

    prompt = f"""
I have a theme: {output['theme']} and colors: {output['colors']}.
Now pick from following list of imagery options to best fit that theme and color selection:

```markdown
- oceans, waves, tides, coral reefs
- volcanoes, lava, ash, craters
- glaciers, icebergs, frost, polar lights
- caves, stalactites, stalagmites, echoes
- prairies, grasslands, sunrises
- jungles, vines, canopies
- cliffs, canyons, gorges, waterfalls
- auroras, meteors, comets, cosmic dust, moons, planetscape
- reefs, atolls, tropica
- twilight, dawn, dusk, moonlight
```

If none fit and you are inspired please provide your own imagery or adapt the options.
I need the output as JSON "{{imagery: "FOO, BAR, BAZ, ETC"}}.
Output the complete list item of imagery items, not just selected items.
I am feeding the output to a script, so if you don’t output json in the above form my script will break.
Thank you sir.
"""
    print(prompt)

    prompt = f"Instruct: {prompt}\nOutput: "

    proc = subprocess.run(['pkgx', 'ollama', 'run', 'deepseek-r1', prompt], capture_output=True, text=True)
    result = proc.stdout

    console.print(result, style="green")

    result = result[result.index("</think>") + len("</think>"):].strip()

    match = re.search(r'{\s*"?imagery"?:(.*?)}', result, re.DOTALL)
    if match:
        output['imagery'] = match.group(1)
    else:
        # sometimes it just outputs the theme. Often with surrounding description, but whatever
        output['imagery'] = re.sub(r'\s+', ' ', result).strip()

    return output

url = "http://127.0.0.1:7860/sdapi/v1/txt2img"
console = Console()

for root, dirs, files in os.walk("./public/pkgs/"):
    for file in files:
        if file.endswith(".json") and not file.endswith(".png.json") and not file.endswith("cache.json") and not file.endswith("-manifests.json"):
            gen_img(root, file);
