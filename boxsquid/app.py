#Dependencies
from flask import Flask, render_template, request, session, redirect, flash
from reddit import redditSearch
from chan import chanSearch
from generate_plotly import *

#For testing

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

#TODO
@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/tutorial')
def tutorial():
    return render_template('index.html')

#sentiment analysis. needs to take user input run script on go.
@app.route('/sentiment-analysis', methods=['GET', 'POST'])
def sentimentanalysis():
    social_media = None
    keyword = None
    num_entries = None
    forum = None
    entries = None
    s_average = None
    graph = None
    firstlastDate = [0,0]
    mentions = [0,0,0]
    
    if request.method == 'POST':
        # Retrieve form data
        social_media = request.form.get('socialMedia')
        keyword = request.form.get('keyword')
        num_entries = int(request.form.get('numEntries'))
        forum = request.form.get('forum')
        #pack = [social_media,forum,keyword,num_entries]
        #print(pack)
        #Reddit Sentiment
        if(social_media =="reddit"):
            entries, s_average, entryTitle, sentScore, firstlastDate, mentions = redditSearch(forum,keyword,num_entries)
            count = len(entries)
            graph = generate_scatter_plot(entryTitle,sentScore)
        elif(social_media == "4chan"):
            #fixed at 10
            entries, s_average, mentions = chanSearch(forum, keyword, 10)
        #TODO tumblr and twitter 
        #print(entries)
        return render_template('salanding.html',
         entries=entries, s_average = s_average, socialMedia = social_media,
          forum = forum, keyword = keyword, numEntries = num_entries,
           graph = graph, firstlast = firstlastDate, pmentions = mentions[0], nmentions = mentions[2], nementions = mentions[1])
        

    # render the sentiment analysis template
    return render_template('salanding.html')

@app.route('/profile-harvester', methods=['GET', 'POST'])
def profileharvester():
    keyword = None
    if request.method == 'POST':
        # Retrieve form data
        keyword = request.form.get('keyword')
        pack = [keyword]
        print(pack)
        #harvester logic here

    # render the sentiment analysis template
    return render_template('harvestlanding.html')

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, threaded=True)