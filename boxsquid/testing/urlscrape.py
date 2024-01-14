import requests
from bs4 import BeautifulSoup
import csv

search_engines = [
    {'name': 'Google', 'url': 'https://www.google.com/search'},
    {'name': 'Bing', 'url': 'https://www.bing.com/search'},
    {'name': 'Yahoo', 'url': 'https://search.yahoo.com/search'},
    {'name': 'DuckDuckGo', 'url': 'https://duckduckgo.com/html/'},
    # Add more search engines here
]

def get_urls(search_term, data_amount):
    search_results = []

    for engine in search_engines:
        print(f"Searching on {engine['name']}...")
        remaining_urls = data_amount - len(search_results)

        params = {'q': search_term}
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

        try:
            response = requests.get(engine['url'], params=params, headers=headers)
            response.raise_for_status()
        except requests.HTTPError as e:
            print(f"Error occurred while searching on {engine['name']}: {e}")
            continue

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract URLs from search results
        urls = []
        for result in soup.find_all('a'):
            href = result.get('href')
            if href and href.startswith('http'):
                urls.append(href)
                if len(urls) >= remaining_urls:
                    break

        search_results.extend(urls[:remaining_urls])

        if len(search_results) >= data_amount:
            break

    # Save the URLs to a CSV file
    with open('search_results.csv', 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['url'])
        writer.writerows([[url] for url in search_results])
    
    print(f'Saved {len(search_results)} URLs to search_results.csv')

def execute_search(search_term, number_of_urls):
    get_urls(search_term, number_of_urls)