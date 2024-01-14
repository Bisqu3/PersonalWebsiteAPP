from nltk.sentiment import SentimentIntensityAnalyzer


def getsentiment(titles, texts):
    pack = []
    mentions = [0, 0, 0]
    average_sentiment = []
    analyzer = SentimentIntensityAnalyzer()

    for title, text in zip(titles, texts):
        if text != "None":
            res = analyzer.polarity_scores(text)
        else:
            res = analyzer.polarity_scores(title)
        
        average_sentiment.append(res['compound'])
        pack.append(res['compound'])
        
        if res['compound'] > 0:
            mentions[0] += 1
        elif res['compound'] < 0:
            mentions[2] += 1
        else:
            mentions[1] += 1
    
    tot = sum(average_sentiment)
    avg = tot / len(average_sentiment)
    avg = round(avg, 3)
    
    return pack, avg, mentions
