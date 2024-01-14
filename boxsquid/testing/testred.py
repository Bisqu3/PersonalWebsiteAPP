import praw

reddit = praw.Reddit(
    client_id="70cR6tutbIAigpKWLVvULw",
    client_secret="bYacv7-qEXqT2WvHTawY7wWDxLX3Zw",
    user_agent="user",
)


subreddit = reddit.subreddit('worldnews')

# Get hot submissions
for submission in subreddit.search("biden", sort='new', limit= 100):
    print(submission)
    print(submission.title)
    print("name: "+str(submission.title))
    print("name: "+str(submission.created_utc))
    print("points: "+str(submission.score))
    print("num_comments: "+str(submission.num_comments))
