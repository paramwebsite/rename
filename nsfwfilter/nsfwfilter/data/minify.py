import json

def minify_json(input_file, output_file):
    with open(input_file, "r") as f:
        data = json.load(f)

    # separators=(',', ':') removes ALL spaces and newlines
    with open(output_file, "w") as f:
        json.dump(data, f, separators=(',', ':'), ensure_ascii=False)

    print("Minified JSON saved to:", output_file)


# Example usage
minify_json("wordlist.json", "wordlist_minified.json")