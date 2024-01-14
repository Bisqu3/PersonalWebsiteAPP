#local
import sentiment

#
import praw
import datetime
import pandas as pd
#

debug_ = False


def redditSearch(sub,q,i):

    #OAUTH2
    reddit = praw.Reddit(
        client_id="70cR6tutbIAigpKWLVvULw",
        client_secret="bYacv7-qEXqT2WvHTawY7wWDxLX3Zw",
        user_agent="user",
    )

    #check for read only access
    print(reddit.read_only)

    text_ = []
    title_ = []
    score_ = []
    com_ = []
    sentiment_ = []
    ret = None
    avg = None
    indexInt = 0
    index = []
    date=[]
    uRl = []


    subreddit = reddit.subreddit(sub)

    for submission in subreddit.search(q, sort='new', limit= i):
        #print(submission)
        #dont log empty posts
        if(len(submission.title) > 0):
            if(len(submission.selftext) > 0):
                text_.append(submission.selftext)
            else: text_.append("None")
            title_.append(submission.title)
            score_.append(submission.score)
            com_.append(submission.num_comments)
            uRl.append(submission.url)
            #not using date
            created_utc_timestamp = submission.created_utc
            created_utc_datetime = datetime.datetime.utcfromtimestamp(created_utc_timestamp)
            formatted_timecode = created_utc_datetime.strftime('%Y-%m-%d %H:%M:%S UTC')
            date.append(formatted_timecode)
            index.append(indexInt)
            indexInt+=1
            #prints more info to terminal if true
            if debug_ == True:
                print("name: "+str(submission.title))
                print("points: "+str(submission.score))
                print("num_comments: "+str(submission.num_comments))
            #--
    firstlast = [date[0], date[len(date)-1]]
    ret, avg, mentions = sentiment.getsentiment(title_,text_)
    pack = list(zip(index,title_, text_, score_, com_,ret,uRl))

    #pandas dataframe
    df_entries = pd.DataFrame(pack, columns=["Index", "Title", "Text", "Score", "Number of Comments", "Sentiment Score", "Link"])
    return (df_entries, avg, index, ret, firstlast, mentions)
#if(debug_):
    #redditSearch(input('subreddit: '),input('search: '),int(input('amount: ')))