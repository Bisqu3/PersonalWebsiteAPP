import requests
import sentiment

import pandas as pd

# Define the base URL of the 4chan API
base_url = "https://a.4cdn.org"


def chanSearch(board, keyword, num_pages):
    text_ = []
    # Scrape the board and collect sentiment data
    for page in range(1, num_pages + 1):
        url = f"{base_url}/{board}/{page}.json"
        response = requests.get(url)
        data = response.json()

        for thread in data["threads"]:
            for post in thread["posts"]:
                post_text = post.get("com", "")
                #if post contains a match with keyword
                if keyword.lower() in post_text.lower():
                    text_.append(post_text)
                    break
    fill = []
    for i in range(0,len(text_)):
        fill.append("Empty")

    ret, avg, mentions = sentiment.getsentiment(fill,text_)
    #replace fill with relevant data
    pack = list(zip(fill, fill, text_, fill, fill,ret, fill))
    df_entries = pd.DataFrame(pack, columns=["Index", "Title", "Text", "Score", "Number of Comments", "Sentiment Score", "Link"])
    return df_entries, avg, mentions
