import datetime
import json
import logging
from pathlib import Path
from typing import Dict, List, Optional

from bs4 import BeautifulSoup
import requests


log = logging.getLogger(__name__)
PROJECT_DIR = Path(__file__).parents[1].resolve()
DATA_DIR = PROJECT_DIR / 'public' / 'data'
URL = "https://www.majortests.com/sat/wordlist.php"

WORDLIST = List[Dict[str, str]]


def get_wordlist(home_url: str) -> WORDLIST:
    r = requests.get(home_url)
    soup = BeautifulSoup(r.content, 'html.parser')
    a_tags = soup.find_all('a', href=True)
    visited = set()
    words = []
    for tag in a_tags:
        url = tag['href']
        if url in visited or not is_valid_url(url):
            continue

        wordlist = get_page_wordlist(url)
        visited.add(url)

        if wordlist is None:
            continue
        words += wordlist

        if len(words) > 0:
            log.info(words[-1])
    return words


def get_page_wordlist(url: str) -> Optional[WORDLIST]:
    """
    Get all words and definitions from the wordlist table on the provided url.
    """
    soup = BeautifulSoup(requests.get(url).content, 'html.parser')
    table = soup.find('table', {'class': 'wordlist'})
    if table is None:
        return
    wordlist = table.find_all('tr')
    payload = []
    for element in wordlist:
        word = element.find('th')
        definition = element.find('td')
        payload.append({'word': word.text, 'definition': definition.text})
    return payload


def is_valid_url(url: str) -> bool:
    return url.startswith('http')


def write_wordlist(words: WORDLIST) -> None:
    now = datetime.datetime.now()
    filename = DATA_DIR / f'wordlist.json'
    with open(filename, 'w') as fw:
        json.dump(words, fw)
    log.info(f'Logged {len(words)} words to {filename}')
    update_meta(now)


def update_meta(now: datetime.datetime) -> None:
    log.info('Updating meta')
    meta_filename = DATA_DIR / f'meta.json'
    with open(meta_filename, 'r') as fo:
        meta = json.load(fo)
    meta['current_filename'] = 'wordlist.json'
    meta['latest'] = now.strftime("%Y-%m-%dT%H:%M:%S")
    meta['timestamps'].append(now.strftime("%Y-%m-%dT%H:%M:%S"))

    with open(meta_filename, 'w') as fw:
        json.dump(meta, fw)


def main() -> None:
    words = get_wordlist(URL)
    write_wordlist(words)
    log.info('Done.')


if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s %(name)s: %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', level=logging.INFO)
    main()
