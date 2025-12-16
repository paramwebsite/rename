from nsfwfilter.trie_filter import TrieFilter
import argparse

def main():
    parser = argparse.ArgumentParser(description="NSFW filtering CLI tool")
    parser.add_argument("text", nargs="*", help="Text to filter")
    args = parser.parse_args()

    if not args.text:
        print("No text provided.")
        return

    text = " ".join(args.text)
    flt = TrieFilter()
    result = flt.contains_badword(text)
    print({"contains_nsfw": result})
