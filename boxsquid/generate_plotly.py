import plotly.graph_objects as go
import plotly.express as px
import plotly.offline as pyo
import numpy as np

#Holds all plotly graph generation functions and returns to app.py
#TODO
#MAKE COMPATIBLE WITH CURRENT APP. 
#DONE WITH SCATTER_PLOT

def set_dark_theme(fig):
    fig.update_layout(template="plotly_dark")
    return fig

def generate_line_plot(dataframe, x_col, y_col):
    fig = go.Figure(data=go.Scatter(x=dataframe[x_col], y=dataframe[y_col]))
    fig.update_layout(title=f"Line Chart", xaxis_title=x_col, yaxis_title=y_col)
    return set_dark_theme(fig)

def generate_bar_plot(dataframe, x_col, y_col):
    fig = go.Figure(data=go.Bar(x=dataframe[x_col], y=dataframe[y_col]))
    fig.update_layout(title=f"Bar Chart", xaxis_title=x_col, yaxis_title=y_col)
    return set_dark_theme(fig)

#WORKS WITH CURRENT CODE
def generate_scatter_plot(x_col, y_col):
    # Remove None values from y_col
    filtered_y_col = [y for y in y_col if y is not 0]

    # Create scatter plot with trendline
    fig = go.Figure(data=go.Scatter(x=x_col, y=y_col, mode='markers'))
    fig.update_layout(title=f"Sentiment Scatter Plot", xaxis_title="Mentions (Old to New)", yaxis_title="Sentiment of content")
    fig = set_dark_theme(fig)

    # Add trendline with filtered y_col
    trendline = go.Scatter(x=x_col, y=np.poly1d(np.polyfit(x_col, filtered_y_col, 1))(x_col), mode='lines', name='Trendline')
    fig.add_trace(trendline)

    # Flip x-axis for better time representation
    fig.update_layout(xaxis=dict(autorange='reversed'))

    # Set x-axis ticks to show only the first and last values
    fig.update_layout(
        xaxis=dict(
            tickmode='array',
            tickvals=[x_col[0], x_col[-1]],
            ticktext=[str(x_col[0]), str(x_col[-1])]
        )
    )

    # prepare for html
    plot_div = pyo.plot(fig, output_type='div')
    return plot_div

def generate_heatmap(dataframe, x_col, y_col, z_col):
    fig = go.Figure(data=go.Heatmap(x=dataframe[x_col], y=dataframe[y_col], z=dataframe[z_col], colorscale='Viridis'))
    fig.update_layout(title=f"Heatmap", xaxis_title=x_col, yaxis_title=y_col)
    return set_dark_theme(fig)

def generate_trend_line(dataframe, x_col, y_col):
    fig = go.Figure(data=go.Scatter(x=dataframe[x_col], y=dataframe[y_col], mode='markers'))
    fig.update_layout(title=f"Trend Line", xaxis_title=x_col, yaxis_title=y_col)
    fig = px.scatter(dataframe, x=x_col, y=y_col, trendline='ols')
    return set_dark_theme(fig)

def generate_box_plot(dataframe, x_col, y_col):
    fig = go.Figure(data=go.Box(x=dataframe[x_col], y=dataframe[y_col], boxpoints='all', jitter=0.3, pointpos=-1.8, boxmean='sd'))
    fig.update_layout(title=f"Box Plot", xaxis_title=x_col, yaxis_title=y_col, coloraxis=dict(colorscale='Viridis'))
    return set_dark_theme(fig)

def generate_3d_scatter_plot(dataframe, x_col, y_col, z_col, color_col):
    fig = go.Figure(data=go.Scatter3d(x=dataframe[x_col], y=dataframe[y_col], z=dataframe[z_col], mode='markers',
                                     marker=dict(color=dataframe[color_col], size=5)))
    fig.update_layout(title=f"3D Scatter Plot", scene=dict(xaxis_title=x_col, yaxis_title=y_col, zaxis_title=z_col))
    return set_dark_theme(fig)

def generate_us_state_choropleth(dataframe, state_col, z_col, title=None):
    color_range = [min(dataframe[z_col]), max(dataframe[z_col])]
    fig = go.Figure(data=go.Choropleth(
        locations=dataframe[state_col],
        z=dataframe[z_col],
        locationmode='USA-states',
        colorscale='Viridis',
        colorbar=dict(title=z_col, tickvals=[color_range[0], color_range[1]]),
    ))

    # Update the layout
    if title:
        fig.update_layout(title=title)
    fig.update_geos(scope='usa')

    return set_dark_theme(fig)
def generate_MIregression(dataframe, x_col, y_col, z_col, color_col):
    color_range = [min(dataframe[color_col]), max(dataframe[color_col])]
    fig = px.scatter(
        dataframe, x=x_col, y=y_col, color=color_col,
        color_continuous_scale='Viridis', range_color=color_range, opacity=z_col,
        trendline_color_override='darkblue'
    )
    return set_dark_theme(fig)

def generate_customplot1(dataframe, x_col, y_col, z_col, color_col):
    print("")
    return None

def generate_customplot2(dataframe, x_col, y_col, z_col, color_col):
    print("")
    return None

def generate_customplot3(dataframe, x_col, y_col, z_col, color_col):
    print("")
    return None

def generate_customplot4(dataframe, x_col, y_col, z_col, color_col):
    print("")
    return None