import json
import random

def generate_words(prefix, count):
    words = []
    for i in range(1, count + 1):
        # pattern-based synthetic words
        base = f"{prefix}_{i}"
        variants = [
            base,
            f"{base}_x",
            f"{base}_xx",
            f"{base}_alt",
            f"{base}_v{random.randint(1,9)}"
        ]
        words.append(random.choice(variants))
    return words


def generate_10k_dataset():
    total = 10000
    per_lang = total // 3  # ≈ 3333 each

    data = {
        "english": generate_words("en_badword", per_lang),
        "ka_english": generate_words("ka_badword", per_lang),
        "hi_english": generate_words("hi_badword", per_lang),
    }

    remaining = total - (per_lang * 3)
    if remaining > 0:
        data["english"].append(f"en_extra_{remaining}")

    with open("wordlist.json", "w") as f:
        json.dump(data, f, indent=2)

    print("Generated → wordlist.json")


if __name__ == "__main__":
    generate_10k_dataset()
